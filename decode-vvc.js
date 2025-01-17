/**
 * @copyright: Copyright (c) 2021-2023
 * @author: Paul Higgs
 * @file: decode-vvc.js
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
// see annex E.6 through E.8 of  ISO/IEC 14496-15:2019 Amd.2 "Carriage of VVC and EVC in ISOBMFF"
// w19454

// VVC - ISO/IEC 23090-3  - w19470

function decodeVVC(val) {
  const VVCregex =
    /^(vvc1|vvi1)(\.\d+)(\.[LH]\d+)(\.C[a-zA-Z2-7]+)?(\.S[a-fA-F\d]{1,2}(\+[a-fA-F\d]{1,2})*)?(\.O\d+(\+\d+)?)?$/;
  const VVCformat =
    "<sample entry 4CC>.<general_profile_idc>.[LH]<op_level_idc>{.C<general_constraint_info>}{.S<general_sub_profile_idc>}{.O{<OlsIdx>}{+<MaxTid>}}";

  function printProfile(profile) {
    let res = "",
      general_profile_idc = parseInt(profile);
    switch (general_profile_idc) {
      case 1:
        res += "Main 10";
        break;
      case 65:
        res += "Main 10 Still Picture";
        break;
      case 33:
        res += "Main 10 4:4:4";
        break;
      case 97:
        res += "Main 10 4:4:4 Still Picture";
        break;
      case 17:
        res += "Multilayer Main 10";
        break;
      case 49:
        res += "Multilayer Main 10 4:4:4";
        break;
    }
    return res + BREAK;
  }

  function printTier(tier, level) {
    let res = "",
      op_level_idc = parseInt(level);

    switch (tier) {
      case "L":
        res += "Main Tier (L)";
        break;
      case "H":
        res += "High Tier (H)";
        break;
      default:
        res += err(`unknown Tier (${tier})`);
        break;
    }
    res += BREAK;
    let lev = null;
    switch (op_level_idc) {
      // table 135 in VVC
      case 16:
        lev = "1.0";
        break;
      case 32:
        lev = "2.0";
        break;
      case 35:
        lev = "2.1";
        break;
      case 48:
        lev = "3.0";
        break;
      case 51:
        lev = "3.1";
        break;
      case 64:
        lev = "4.0";
        break;
      case 67:
        lev = "4.1";
        break;
      case 80:
        lev = "5.0";
        break;
      case 83:
        lev = "5.1";
        break;
      case 86:
        lev = "5.2";
        break;
      case 96:
        lev = "6.0";
        break;
      case 99:
        lev = "6.1";
        break;
      case 102:
        lev = "6.2";
        break;
      default:
        res += err(`unknown Level (${op_level_idc})`);
    }
    if (lev) res += `Level ${lev}`;
    return (res += BREAK);
  }

  let VVC_general_constraints = [
    { bit: 0, name: "gci_present_flag", existance: true },
    { bit: 1, name: "gci_intra_only_constraint_flag" },
    { bit: 2, name: "gci_all_layers_independent_constraint_flag" },
    { bit: 3, name: "gci_one_au_only_constraint_flag" },
    {
      bit: 4,
      name: "gci_sixteen_minus_max_bitdepth_constraint_idc",
      length: 4,
    },
    {
      bit: 8,
      name: "gci_three_minus_max_chroma_format_constraint_idc",
      length: 2,
    },
    { bit: 10, name: "gci_no_mixed_nalu_types_in_pic_constraint_flag" },
    { bit: 11, name: "gci_no_trail_constraint_flag" },
    { bit: 12, name: "gci_no_stsa_constraint_flag" },
    { bit: 13, name: "gci_no_rasl_constraint_flag" },
    { bit: 14, name: "gci_no_radl_constraint_flag" },
    { bit: 15, name: "gci_no_idr_constraint_flag" },
    { bit: 16, name: "gci_no_cra_constraint_flag" },
    { bit: 17, name: "gci_no_gdr_constraint_flag" },
    { bit: 18, name: "gci_no_aps_constraint_flag" },
    { bit: 19, name: "gci_no_idr_rpl_constraint_flag" },
    { bit: 20, name: "gci_one_tile_per_pic_constraint_flag" },
    { bit: 21, name: "gci_pic_header_in_slice_header_constraint_flag" },
    { bit: 22, name: "gci_one_slice_per_pic_constraint_flag" },
    { bit: 23, name: "gci_no_rectangular_slice_constraint_flag" },
    { bit: 24, name: "gci_one_slice_per_subpic_constraint_flag" },
    { bit: 25, name: "gci_no_subpic_info_constraint_flag" },
    {
      bit: 26,
      name: "gci_three_minus_max_log2_ctu_size_constraint_idc",
      length: 2,
    },
    { bit: 28, name: "gci_no_partition_constraints_override_constraint_flag" },
    { bit: 29, name: "gci_no_mtt_constraint_flag" },
    { bit: 30, name: "gci_no_qtbtt_dual_tree_intra_constraint_flag" },
    { bit: 31, name: "gci_no_palette_constraint_flag" },
    { bit: 32, name: "gci_no_ibc_constraint_flag" },
    { bit: 33, name: "gci_no_isp_constraint_flag" },
    { bit: 34, name: "gci_no_mrl_constraint_flag" },
    { bit: 35, name: "gci_no_mip_constraint_flag" },
    { bit: 36, name: "gci_no_cclm_constraint_flag" },
    { bit: 37, name: "gci_no_ref_pic_resampling_constraint_flag" },
    { bit: 38, name: "gci_no_res_change_in_clvs_constraint_flag" },
    { bit: 39, name: "gci_no_weighted_prediction_constraint_flag" },
    { bit: 40, name: "gci_no_ref_wraparound_constraint_flag" },
    { bit: 41, name: "gci_no_temporal_mvp_constraint_flag" },
    { bit: 42, name: "gci_no_sbtmvp_constraint_flag" },
    { bit: 43, name: "gci_no_amvr_constraint_flag" },
    { bit: 44, name: "gci_no_bdof_constraint_flag" },
    { bit: 45, name: "gci_no_smvd_constraint_flag" },
    { bit: 46, name: "gci_no_dmvr_constraint_flag" },
    { bit: 47, name: "gci_no_mmvd_constraint_flag" },
    { bit: 48, name: "gci_no_affine_motion_constraint_flag" },
    { bit: 49, name: "gci_no_prof_constraint_flag" },
    { bit: 50, name: "gci_no_bcw_constraint_flag" },
    { bit: 51, name: "gci_no_ciip_constraint_flag" },
    { bit: 52, name: "gci_no_gpm_constraint_flag" },
    { bit: 53, name: "gci_no_luma_transform_size_64_constraint_flag" },
    { bit: 54, name: "gci_no_transform_skip_constraint_flag" },
    { bit: 55, name: "gci_no_bdpcm_constraint_flag" },
    { bit: 56, name: "gci_no_mts_constraint_flag" },
    { bit: 57, name: "gci_no_lfnst_constraint_flag" },
    { bit: 58, name: "gci_no_joint_cbcr_constraint_flag" },
    { bit: 58, name: "gci_no_sbt_constraint_flag" },
    { bit: 60, name: "gci_no_act_constraint_flag" },
    { bit: 61, name: "gci_no_explicit_scaling_list_constraint_flag" },
    { bit: 62, name: "gci_no_dep_quant_constraint_flag" },
    { bit: 63, name: "gci_no_sign_data_hiding_constraint_flag" },
    { bit: 64, name: "gci_no_cu_qp_delta_constraint_flag" },
    { bit: 65, name: "gci_no_chroma_qp_offset_constraint_flag" },
    { bit: 66, name: "gci_no_sao_constraint_flag" },
    { bit: 67, name: "gci_no_alf_constraint_flag" },
    { bit: 68, name: "gci_no_ccalf_constraint_flag" },
    { bit: 69, name: "gci_no_lmcs_constraint_flag" },
    { bit: 70, name: "gci_no_ladf_constraint_flag" },
    { bit: 71, name: "gci_no_virtual_boundaries_constraint_flag" },
    { bit: 72, name: "gci_num_reserved_bits", length: 8 },
    { bit: 79, unspecified: true },
  ];

  function printConstraints(general_constraint_info) {
    let res = "";

    // general_constraint_info is base32, so convert it to hex
    let byteset = parseInt(general_constraint_info, 32).toString(16);
    while (byteset.length % 2) byteset += "0";

    let i = 0,
      constraintFlags = new BitList();
    while (i < byteset.length) {
      constraintFlags.push(parseInt(byteset.substring(i, i + 2), 16));
      i += 2;
    }

    let gotFlags = false;
    VVC_general_constraints.forEach((constraint) => {
      if (constraint.existance) {
        if (constraintFlags.bitsetB(constraint.bit)) gotFlags = true;
        res += `${constraint.name}=${constraintFlags.bitsetB(
          constraint.bit
        )}${BREAK}`;
      } else if (gotFlags) {
        if (constraint.length) {
          res += `${constraint.name}=${constraintFlags.valueB(
            constraint.bit,
            constraint.length
          )}${BREAK}`;
        } else {
          if (constraintFlags.bitsetB(constraint.bit))
            res += constraint.name + BREAK;
        }
      }
    });
    return res;
  }

  function printSubProfile(general_sub_profile_idc) {
    let res = "";
    let subProfiles = general_sub_profile_idc.split("+");

    // VVC says
    //general_sub_profile_idc[ i ] specifies the i-th interoperability indicator registered as specified by Rec. ITU-T T.35,
    // the contents of which are not specified in this document.
    // ITU T.35 (2000) - Procedure for the allocation of ITU-T defined codes for non-standard facilities

    for (let i = 0; i < subProfiles.length; i++) {
      let p = parseInt(subProfiles[i], 16);
      res += `Sub profile (${i + 1})=${p}${BREAK}`;
    }
    return res;
  }

  function printTemporalLayers(indexes) {
    let res = "";
    let layerIndexes = indexes.split("+");
    if (layerIndexes[0])
      res += `Output Layer Set index (${em("OlsIdx")})=${
        layerIndexes[0]
      }${BREAK}`;
    if (layerIndexes[1])
      res += `Maximum Temporal Id (${em("MaxTid")})=${layerIndexes[1]}${BREAK}`;
    return res;
  }

  if (!VVCregex.test(val))
    return err("Regex mismatch!") + BREAK + err(VVCformat) + BREAK;

  let x = val.match(VVCregex);
  let res = "";
  x.forEach((part) => {
    if (part && part.substring(0, 1) == ".") {
      let cmd = part.substring(1, 2);
      if (cmd >= "0" && cmd <= "9") {
        res += printProfile(part.substring(1));
      } else
        switch (cmd) {
          case "L":
          case "H":
            res += printTier(cmd, part.substring(2));
            break;
          case "C":
            res += printConstraints(part.substring(2));
            break;
          case "S":
            res += printSubProfile(part.substring(2));
            break;
          case "O":
            res += printTemporalLayers(part.substring(2));
            break;
        }
    }
  });

  return res;
}

addHandler(["vvc1", "vvi1"], "MPEG Versatile Video Coding", decodeVVC);
addHandler("vvcN", "VVC non-VCL track", noHandler);
addHandler("vvs1", "VVC subpicture track", noHandler);
