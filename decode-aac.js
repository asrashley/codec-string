/**
 * @copyright: Copyright (c) 2021-2023
 * @author: Paul Higgs
 * @file: decode-aac.js
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/*jshint esversion: 6 */

/* RFC6381 - https://tools.ietf.org/html/rfc6381
   When the first element of a value is 'mp4a' (indicating some kind of
   MPEG-4 audio), or 'mp4v' (indicating some kind of MPEG-4 part-2
   video), or 'mp4s' (indicating some kind of MPEG-4 Systems streams
   such as MPEG-4 BInary Format for Scenes (BIFS)), the second element
   is the hexadecimal representation of the MP4 Registration Authority
   ObjectTypeIndication (OTI), as specified in [MP4RA] and [MP41]
   (including amendments).  Note that [MP4RA] uses a leading "0x" with
   these values, which is omitted here and hence implied.

   One of the OTI values for 'mp4a' is 40 (identifying MPEG-4 audio).
   For this value, the third element identifies the audio
   ObjectTypeIndication (OTI) as defined in [MP4A] (including
   amendments), expressed as a decimal number.

   For example, AAC low complexity (AAC-LC) has the value 2, so a
   complete string for AAC-LC would be "mp4a.40.2".
   
   [MP4RA] - http://www.mp4ra.org
   [MP4A] - "Information technology--Coding of audio-visual objects -- Part 3: Audio", ISO/IEC 14496-3:2009.
   [MP41] - "Information technology--Coding of audio-visual objects -- Part 1: Systems", ISO/IEC 14496-1:2010.
  */

function decodeAAC(val) {
  let parts = val.split(".");
  if (parts.length < 2) return err("invalid format");
  if (!hexDigits(parts[1])) return err("OTI must be expressed in hexadecimal");

  // https://cconcolato.github.io/media-mime-support/
  let res = "";
  let MP4oti = parseInt(parts[1], 16);
  switch (MP4oti) {
    case 0x40:
      res += "MPEG-4 AAC (40)" + BREAK;
      if (parts[2]) {
        let aacMode = parseInt(parts[2]);
        let vals = [
          { i: 1, s: "Main" },
          { i: 2, s: "Low-Complexity AAC" },
          { i: 3, s: "SSR AAC" },
          { i: 4, s: "LTP AAC" },
          { i: 5, s: "High-Efficiency (SBR) AAC" },
          { i: 6, s: "MPEG-4 AAC-Scalable" },
          { i: 7, s: "MPEG-4 TWIN VQ" },
          { i: 8, s: "MPEG-4 CELP" },
          { i: 9, s: "MPEG-4 HVCX" },
          { i: 12, s: "MPEG-4 TTSI" },
          { i: 13, s: "MPEG-4 Main Synthetic" },
          { i: 14, s: "MPEG-4 Wavetable Synthetis" },
          { i: 15, s: "MPEG-4 General Midi" },
          { i: 16, s: "MPEG-4 ALGO_SYNTH_AUDIO_FX" },
          { i: 17, s: "MPEG-4 ER_AAC_LC" },
          { i: 19, s: "MPEG-4 ER_AAC_LTP" },
          { i: 20, s: "MPEG-4 ER_AAC_SCALABLE" },
          { i: 21, s: "MPEG-4 ER_TWINVQ" },
          { i: 22, s: "MPEG-4 ER_BSAC" },
          { i: 23, s: "MPEG-4 ER_AAC_LD" },
          { i: 24, s: "MPEG-4 ER_AAC_LD" },
          { i: 25, s: "MPEG-4 ER_HVXC" },
          { i: 26, s: "MPEG-4 ER_HILN" },
          { i: 27, s: "MPEG-4 ER_PARAMETRIC" },
          { i: 28, s: "MPEG-4 SSC" },
          { i: 29, s: "MPEG-4 AAC_PS" },
          { i: 32, s: "MPEG-4 LAYER1" },
          { i: 33, s: "MPEG-4 LAYER2" },
          { i: 34, s: "MPEG-4 LAYER3" },
          { i: 35, s: "MPEG-4 DST" },
          { i: 36, s: "MPEG-4 ALS" },
        ];
        const found = vals.find((elem) => aacMode == elem.i);
        res += found
          ? `${found.s} (${found.i})`
          : err(`invalid AAC OTI (${aacMode})`);
        res += BREAK;
      }
      break;
    case 0x66:
      res += "MPEG-2 AAC Main Profile (66)";
      break;
    case 0x67:
      res += "MPEG-2 AAC Low Complexity Profile (67)";
      break;
    case 0x68:
      res += "MPEG-2 AAC Scalable Sampling Rate Profile (68)";
      break;
    case 0x69:
      res += "MPEG-2 Audio Part 3 (69)";
      break;
    case 0x6b:
      res += "MPEG-1 Part 3 (6B)";
      break;
    default:
      res += err(`invalid MP4 OTI (${MP4oti})`);
  }
  res += BREAK;
  return res;
}

addHandler("mp4a", "AAC", decodeAAC);
