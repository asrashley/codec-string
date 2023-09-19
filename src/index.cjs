const { decodeAAC } = require('./decode-aac.js');
const { decodeAC4 } = require('./decode-ac4.js');
const { decodeAV1 } = require('./decode-av1.js');
const { decodeAVC } = require('./decode-avc.js');
const { decodeAVS3 } = require('./decode-avs.js');
const { decodeEVC } = require('./decode-evc.js');
const { decodeHEVC } = require('./decode-hevc.js');
const { decodeMPEGH } = require('./decode-mpegH.js');
const { decodeSTPP } = require('./decode-text.js');
const { decodeVP9 } = require('./decode-vp9.js');
const { decodeVVC } = require('./decode-vvc.js');
const { decode } = require('./decode.js');

module.exports = {
  decodeAAC,
  decodeAC4,
  decodeAV1,
  decodeAVC,
  decodeAVS3,
  decodeEVC,
  decodeHEVC,
  decodeMPEGH,
  decodeSTPP,
  decodeVP9,
  decodeVVC,
  decode
};