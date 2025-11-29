(function() {
// Manual data source (top 100 FPTS), updated weekly.
// Replace the array below directly; structure mirrors the JSON in .ReferenceFolder/HP-Data-reference.json
const HP_DATA = [
  {
    "SZN": 2025,
    "SLPR_ID": 4034,
    "NM": "Christian McCaffrey",
    "POS": "RB",
    "AGE": 29.3,
    "TM": "SF",
    "G": 12,
    "FPTS": 311.1,
    "PPG": 25.925,
    "CSTY%": 0.9166666667,
    "CL": 36.16666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1581,
    "IMP/G": 7.5,
    "SNP%": 0.8316708229,
    "YPC": 3.67,
    "TGT": 103,
    "REC": 81,
    "MTF/A": 0.3824884793,
    "YCO/A": 1.460829493,
    "recYPG": 65.41666667,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6813,
    "NM": "Jonathan Taylor",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "IND",
    "G": 11,
    "FPTS": 282.5,
    "PPG": 25.68181818,
    "CSTY%": 0.8181818182,
    "CL": 40.4,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1465,
    "IMP/G": 6.454545455,
    "SNP%": 0.8342776204,
    "YPC": 5.84,
    "TGT": 35,
    "REC": 32,
    "MTF/A": 0.3609756098,
    "YCO/A": 3.034146341,
    "recYPG": 24.36363636,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4984,
    "NM": "Josh Allen",
    "POS": "QB",
    "AGE": 29.4,
    "TM": "BUF",
    "G": 11,
    "FPTS": 264.46,
    "PPG": 24.04181818,
    "CSTY%": 0.8181818182,
    "CL": 37.42,
    "TS%": NaN,
    "paYPG": 246.2727273,
    "paRTG": 101.59,
    "CMP%": 0.6972477064,
    "TTT": 2.928165138,
    "YDS(t)": 3080,
    "IMP/G": 14.18181818,
    "SNP%": 0.9668049793,
    "YPC": 5.3,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9221,
    "NM": "Jahmyr Gibbs",
    "POS": "RB",
    "AGE": 23.5,
    "TM": "DET",
    "G": 11,
    "FPTS": 259.0,
    "PPG": 23.54545455,
    "CSTY%": 0.8181818182,
    "CL": 43.46666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1330,
    "IMP/G": 5.454545455,
    "SNP%": 0.6266094421,
    "YPC": 6.14,
    "TGT": 55,
    "REC": 48,
    "MTF/A": 0.3161290323,
    "YCO/A": 1.787096774,
    "recYPG": 34.45454545,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9488,
    "NM": "Jaxon Smith-Njigba",
    "POS": "WR",
    "AGE": 23.6,
    "TM": "SEA",
    "G": 11,
    "FPTS": 255.0,
    "PPG": 23.18181818,
    "CSTY%": 1.0,
    "CL": 31.5,
    "TS%": 0.354,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1350,
    "IMP/G": 5.363636364,
    "SNP%": 0.7340267459,
    "YPC": 6.17,
    "TGT": 107,
    "REC": 80,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 119.3636364,
    "YPRR": 4.574912892,
    "1DRR": 0.1742160279
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11564,
    "NM": "Drake Maye",
    "POS": "QB",
    "AGE": 23.1,
    "TM": "NE",
    "G": 12,
    "FPTS": 245.1,
    "PPG": 20.425,
    "CSTY%": 0.8333333333,
    "CL": 26.94,
    "TS%": NaN,
    "paYPG": 260.8333333,
    "paRTG": 110.65,
    "CMP%": 0.7098591549,
    "TTT": 2.927211268,
    "YDS(t)": 3439,
    "IMP/G": 13.91666667,
    "SNP%": 0.9794344473,
    "YPC": 4.09,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.1666666667,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4046,
    "NM": "Patrick Mahomes",
    "POS": "QB",
    "AGE": 30.0,
    "TM": "KC",
    "G": 11,
    "FPTS": 243.88,
    "PPG": 22.17090909,
    "CSTY%": 0.7214,
    "CL": 28.83333333,
    "TS%": NaN,
    "paYPG": 270.6363636,
    "paRTG": 93.78,
    "CMP%": 0.6437346437,
    "TTT": 2.735872236,
    "YDS(t)": 3295,
    "IMP/G": 15.18181818,
    "SNP%": 0.9714285714,
    "YPC": 6.12,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9226,
    "NM": "De'Von Achane",
    "POS": "RB",
    "AGE": 24.0,
    "TM": "MIA",
    "G": 11,
    "FPTS": 235.0,
    "PPG": 21.36363636,
    "CSTY%": 1.0,
    "CL": 32.56666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1270,
    "IMP/G": 5.181818182,
    "SNP%": 0.7962382445,
    "YPC": 5.49,
    "TGT": 71,
    "REC": 54,
    "MTF/A": 0.3902439024,
    "YCO/A": 2.81097561,
    "recYPG": 33.63636364,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6904,
    "NM": "Jalen Hurts",
    "POS": "QB",
    "AGE": 27.1,
    "TM": "PHI",
    "G": 11,
    "FPTS": 232.16,
    "PPG": 21.10545455,
    "CSTY%": 0.7344,
    "CL": 28.06,
    "TS%": NaN,
    "paYPG": 207.6363636,
    "paRTG": 106.03,
    "CMP%": 0.6720779221,
    "TTT": 2.998376623,
    "YDS(t)": 2582,
    "IMP/G": 12.09090909,
    "SNP%": 0.9970149254,
    "YPC": 3.73,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3294,
    "NM": "Dak Prescott",
    "POS": "QB",
    "AGE": 32.2,
    "TM": "DAL",
    "G": 11,
    "FPTS": 227.24,
    "PPG": 20.65818182,
    "CSTY%": 0.7310,
    "CL": 29.94,
    "TS%": NaN,
    "paYPG": 267.3636364,
    "paRTG": 102.6,
    "CMP%": 0.6934673367,
    "TTT": 2.810778894,
    "YDS(t)": 3067,
    "IMP/G": 14.09090909,
    "SNP%": 0.9749009247,
    "YPC": 3.32,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 421,
    "NM": "Matthew Stafford",
    "POS": "QB",
    "AGE": 37.6,
    "TM": "LAR",
    "G": 11,
    "FPTS": 226.3,
    "PPG": 20.57272727,
    "CSTY%": 0.6363636364,
    "CL": 27.22666667,
    "TS%": NaN,
    "paYPG": 257.2727273,
    "paRTG": 113.68,
    "CMP%": 0.6648793566,
    "TTT": 2.739785523,
    "YDS(t)": 2821,
    "IMP/G": 13.45454545,
    "SNP%": 0.9957686883,
    "YPC": -0.38,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9509,
    "NM": "Bijan Robinson",
    "POS": "RB",
    "AGE": 23.7,
    "TM": "ATL",
    "G": 11,
    "FPTS": 224.6,
    "PPG": 20.41818182,
    "CSTY%": 0.8191818182,
    "CL": 31.01,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1396,
    "IMP/G": 5.272727273,
    "SNP%": 0.7782546495,
    "YPC": 4.96,
    "TGT": 61,
    "REC": 49,
    "MTF/A": 0.3430232558,
    "YCO/A": 2.470930233,
    "recYPG": 49.36363636,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8137,
    "NM": "George Pickens",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "DAL",
    "G": 11,
    "FPTS": 220.4,
    "PPG": 20.03636364,
    "CSTY%": 0.9090909091,
    "CL": 31.6,
    "TS%": 0.226,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1054,
    "IMP/G": 5.181818182,
    "SNP%": 0.8322324967,
    "YPC": 0.0,
    "TGT": 92,
    "REC": 67,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 95.81818182,
    "YPRR": 2.751958225,
    "1DRR": 0.1279373368
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7547,
    "NM": "Amon-Ra St. Brown",
    "POS": "WR",
    "AGE": 25.9,
    "TM": "DET",
    "G": 11,
    "FPTS": 218.3,
    "PPG": 19.84545455,
    "CSTY%": 0.8111818182,
    "CL": 31.91,
    "TS%": 0.301,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 893,
    "IMP/G": 4.181818182,
    "SNP%": 0.8912732475,
    "YPC": 3.0,
    "TGT": 107,
    "REC": 75,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 80.36363636,
    "YPRR": 2.504249292,
    "1DRR": 0.1019830028
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11560,
    "NM": "Caleb Williams",
    "POS": "QB",
    "AGE": 23.9,
    "TM": "CHI",
    "G": 11,
    "FPTS": 218.22,
    "PPG": 19.83818182,
    "CSTY%": 0.6363636364,
    "CL": 30.97333333,
    "TS%": NaN,
    "paYPG": 233.4545455,
    "paRTG": 91.3,
    "CMP%": 0.5916666667,
    "TTT": 3.232194444,
    "YDS(t)": 2883,
    "IMP/G": 12.45454545,
    "SNP%": 0.9852546917,
    "YPC": 5.23,
    "TGT": 2,
    "REC": 2,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 2.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5870,
    "NM": "Daniel Jones",
    "POS": "QB",
    "AGE": 28.3,
    "TM": "IND",
    "G": 11,
    "FPTS": 216.5,
    "PPG": 19.68181818,
    "CSTY%": 0.8181818182,
    "CL": 25.38,
    "TS%": NaN,
    "paYPG": 258.1818182,
    "paRTG": 101.37,
    "CMP%": 0.6914285714,
    "TTT": 2.712942857,
    "YDS(t)": 2999,
    "IMP/G": 14.09090909,
    "SNP%": 0.9716713881,
    "YPC": 3.7,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6797,
    "NM": "Justin Herbert",
    "POS": "QB",
    "AGE": 27.6,
    "TM": "LAC",
    "G": 11,
    "FPTS": 215.14,
    "PPG": 19.55818182,
    "CSTY%": 0.5454545455,
    "CL": 28.84,
    "TS%": NaN,
    "paYPG": 244.6363636,
    "paRTG": 94.18,
    "CMP%": 0.664893617,
    "TTT": 2.856515957,
    "YDS(t)": 3036,
    "IMP/G": 13.63636364,
    "SNP%": 0.9742547425,
    "YPC": 6.39,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9493,
    "NM": "Puka Nacua",
    "POS": "WR",
    "AGE": 24.3,
    "TM": "LAR",
    "G": 10,
    "FPTS": 210.0,
    "PPG": 21.0,
    "CSTY%": 0.9,
    "CL": 29.36666667,
    "TS%": 0.262,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1020,
    "IMP/G": 5.1,
    "SNP%": 0.6979655712,
    "YPC": 12.17,
    "TGT": 98,
    "REC": 80,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 94.7,
    "YPRR": 3.494464945,
    "1DRR": 0.1623616236
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11563,
    "NM": "Bo Nix",
    "POS": "QB",
    "AGE": 25.6,
    "TM": "DEN",
    "G": 11,
    "FPTS": 206.14,
    "PPG": 18.74,
    "CSTY%": 0.5454545455,
    "CL": 30.49333333,
    "TS%": NaN,
    "paYPG": 220.0909091,
    "paRTG": 86.07,
    "CMP%": 0.6124031008,
    "TTT": 2.780155039,
    "YDS(t)": 2634,
    "IMP/G": 11.90909091,
    "SNP%": 0.9945280438,
    "YPC": 4.26,
    "TGT": 1,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8138,
    "NM": "James Cook",
    "POS": "RB",
    "AGE": 26.0,
    "TM": "BUF",
    "G": 11,
    "FPTS": 204.7,
    "PPG": 18.60909091,
    "CSTY%": 0.7212727273,
    "CL": 27.13333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1287,
    "IMP/G": 4.818181818,
    "SNP%": 0.5947441217,
    "YPC": 5.45,
    "TGT": 26,
    "REC": 24,
    "MTF/A": 0.2713567839,
    "YCO/A": 2.613065327,
    "recYPG": 18.45454545,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8130,
    "NM": "Trey McBride",
    "POS": "TE",
    "AGE": 25.8,
    "TM": "ARI",
    "G": 11,
    "FPTS": 201.7,
    "PPG": 18.33636364,
    "CSTY%": 0.9090909091,
    "CL": 28.2,
    "TS%": 0.256,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 797,
    "IMP/G": 4.0,
    "SNP%": 0.8992248062,
    "YPC": 0.0,
    "TGT": 109,
    "REC": 80,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 72.45454545,
    "YPRR": 1.911270983,
    "1DRR": 0.08872901679
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3163,
    "NM": "Jared Goff",
    "POS": "QB",
    "AGE": 31.0,
    "TM": "DET",
    "G": 11,
    "FPTS": 195.96,
    "PPG": 17.81454545,
    "CSTY%": 0.5454545455,
    "CL": 26.29333333,
    "TS%": NaN,
    "paYPG": 251.7272727,
    "paRTG": 108.49,
    "CMP%": 0.6931818182,
    "TTT": 2.728096591,
    "YDS(t)": 2791,
    "IMP/G": 12.63636364,
    "SNP%": 0.9771101574,
    "YPC": 1.83,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7564,
    "NM": "Ja'Marr Chase",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "CIN",
    "G": 10,
    "FPTS": 193.7,
    "PPG": 19.37,
    "CSTY%": 0.6,
    "CL": 34.53333333,
    "TS%": 0.285,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 867,
    "IMP/G": 4.3,
    "SNP%": 0.9516908213,
    "YPC": 3.0,
    "TGT": 117,
    "REC": 79,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 86.1,
    "YPRR": 2.265789474,
    "1DRR": 0.1
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4892,
    "NM": "Baker Mayfield",
    "POS": "QB",
    "AGE": 30.4,
    "TM": "TB",
    "G": 11,
    "FPTS": 188.84,
    "PPG": 17.16727273,
    "CSTY%": 0.7272727273,
    "CL": 24.05333333,
    "TS%": NaN,
    "paYPG": 218.7272727,
    "paRTG": 93.15,
    "CMP%": 0.6267409471,
    "TTT": 2.824345404,
    "YDS(t)": 2622,
    "IMP/G": 11.45454545,
    "SNP%": 0.9521857923,
    "YPC": 6.97,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7523,
    "NM": "Trevor Lawrence",
    "POS": "QB",
    "AGE": 26.0,
    "TM": "JAX",
    "G": 11,
    "FPTS": 186.28,
    "PPG": 16.93454545,
    "CSTY%": 0.6363636364,
    "CL": 23.56,
    "TS%": NaN,
    "paYPG": 218.8181818,
    "paRTG": 79.38,
    "CMP%": 0.597826087,
    "TTT": 2.810869565,
    "YDS(t)": 2617,
    "IMP/G": 12.63636364,
    "SNP%": 0.9894875164,
    "YPC": 3.89,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 2133,
    "NM": "Davante Adams",
    "POS": "WR",
    "AGE": 32.8,
    "TM": "LAR",
    "G": 11,
    "FPTS": 183.1,
    "PPG": 16.64545455,
    "CSTY%": 0.7272727273,
    "CL": 24.23333333,
    "TS%": 0.251,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 631,
    "IMP/G": 3.636363636,
    "SNP%": 0.7517630465,
    "YPC": 0.0,
    "TGT": 94,
    "REC": 48,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 57.36363636,
    "YPRR": 1.872403561,
    "1DRR": 0.08308605341
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5850,
    "NM": "Josh Jacobs",
    "POS": "RB",
    "AGE": 27.6,
    "TM": "GB",
    "G": 10,
    "FPTS": 180.5,
    "PPG": 18.05,
    "CSTY%": 0.9,
    "CL": 27.4,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 885,
    "IMP/G": 4.8,
    "SNP%": 0.6398104265,
    "YPC": 3.83,
    "TGT": 35,
    "REC": 28,
    "MTF/A": 0.2781065089,
    "YCO/A": 2.218934911,
    "recYPG": 23.7,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7588,
    "NM": "Javonte Williams",
    "POS": "RB",
    "AGE": 25.4,
    "TM": "DAL",
    "G": 11,
    "FPTS": 178.3,
    "PPG": 16.20909091,
    "CSTY%": 0.7272727273,
    "CL": 24.1,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1003,
    "IMP/G": 4.909090909,
    "SNP%": 0.7529722589,
    "YPC": 4.95,
    "TGT": 39,
    "REC": 28,
    "MTF/A": 0.2872928177,
    "YCO/A": 2.651933702,
    "recYPG": 9.727272727,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8112,
    "NM": "Drake London",
    "POS": "WR",
    "AGE": 24.2,
    "TM": "ATL",
    "G": 9,
    "FPTS": 177.0,
    "PPG": 19.66666667,
    "CSTY%": 0.6666666667,
    "CL": 31.86666667,
    "TS%": 0.268,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 810,
    "IMP/G": 4.333333333,
    "SNP%": 0.9190556492,
    "YPC": 0.0,
    "TGT": 94,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 90.0,
    "YPRR": 2.736486486,
    "1DRR": 0.1114864865
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6804,
    "NM": "Jordan Love",
    "POS": "QB",
    "AGE": 26.9,
    "TM": "GB",
    "G": 11,
    "FPTS": 175.4,
    "PPG": 15.94545455,
    "CSTY%": 0.3636363636,
    "CL": 25.15333333,
    "TS%": NaN,
    "paYPG": 232.7272727,
    "paRTG": 102.03,
    "CMP%": 0.6767371601,
    "TTT": 2.871057402,
    "YDS(t)": 2720,
    "IMP/G": 12.18181818,
    "SNP%": 0.9814020029,
    "YPC": 4.44,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4943,
    "NM": "Sam Darnold",
    "POS": "QB",
    "AGE": 28.3,
    "TM": "SEA",
    "G": 11,
    "FPTS": 174.3,
    "PPG": 15.84545455,
    "CSTY%": 0.6363636364,
    "CL": 25.61333333,
    "TS%": NaN,
    "paYPG": 253.1818182,
    "paRTG": 106.18,
    "CMP%": 0.6946308725,
    "TTT": 2.870939597,
    "YDS(t)": 2834,
    "IMP/G": 11.27272727,
    "SNP%": 0.9598811293,
    "YPC": 3.06,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7021,
    "NM": "Rico Dowdle",
    "POS": "RB",
    "AGE": 27.3,
    "TM": "CAR",
    "G": 12,
    "FPTS": 173.4,
    "PPG": 14.45,
    "CSTY%": 0.4166666667,
    "CL": 31.46666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1104,
    "IMP/G": 4.583333333,
    "SNP%": 0.5601023018,
    "YPC": 5.01,
    "TGT": 34,
    "REC": 27,
    "MTF/A": 0.2298850575,
    "YCO/A": 2.252873563,
    "recYPG": 19.41666667,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8150,
    "NM": "Kyren Williams",
    "POS": "RB",
    "AGE": 25.1,
    "TM": "LAR",
    "G": 11,
    "FPTS": 172.0,
    "PPG": 15.63636364,
    "CSTY%": 0.6363636364,
    "CL": 24.23333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 980,
    "IMP/G": 5.181818182,
    "SNP%": 0.7108603667,
    "YPC": 4.68,
    "TGT": 32,
    "REC": 24,
    "MTF/A": 0.2941176471,
    "YCO/A": 1.8,
    "recYPG": 16.72727273,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12527,
    "NM": "Ashton Jeanty",
    "POS": "RB",
    "AGE": 21.8,
    "TM": "LV",
    "G": 11,
    "FPTS": 165.5,
    "PPG": 15.04545455,
    "CSTY%": 0.6363636364,
    "CL": 26.06666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 825,
    "IMP/G": 3.727272727,
    "SNP%": 0.7404129794,
    "YPC": 3.64,
    "TGT": 46,
    "REC": 37,
    "MTF/A": 0.3614457831,
    "YCO/A": 2.343373494,
    "recYPG": 20.09090909,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8144,
    "NM": "Chris Olave",
    "POS": "WR",
    "AGE": 25.2,
    "TM": "NO",
    "G": 11,
    "FPTS": 165.1,
    "PPG": 15.00909091,
    "CSTY%": 0.7272727273,
    "CL": 21.4,
    "TS%": 0.278,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 731,
    "IMP/G": 2.818181818,
    "SNP%": 0.8303448276,
    "YPC": -3.0,
    "TGT": 108,
    "REC": 69,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.72727273,
    "YPRR": 1.926509186,
    "1DRR": 0.07086614173
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12526,
    "NM": "Tetairoa McMillan",
    "POS": "WR",
    "AGE": 22.5,
    "TM": "CAR",
    "G": 12,
    "FPTS": 164.3,
    "PPG": 13.69166667,
    "CSTY%": 0.4166666667,
    "CL": 22.6,
    "TS%": 0.253,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 783,
    "IMP/G": 3.75,
    "SNP%": 0.8858695652,
    "YPC": 0.0,
    "TGT": 96,
    "REC": 56,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 65.25,
    "YPRR": 2.023255814,
    "1DRR": 0.1033591731
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6819,
    "NM": "Michael Pittman",
    "POS": "WR",
    "AGE": 28.0,
    "TM": "IND",
    "G": 11,
    "FPTS": 163.7,
    "PPG": 14.88181818,
    "CSTY%": 0.7272727273,
    "CL": 21.6,
    "TS%": 0.22,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 607,
    "IMP/G": 3.272727273,
    "SNP%": 0.8399433428,
    "YPC": 0.0,
    "TGT": 78,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 55.18181818,
    "YPRR": 1.839393939,
    "1DRR": 0.08787878788
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8126,
    "NM": "Wan'Dale Robinson",
    "POS": "WR",
    "AGE": 24.7,
    "TM": "NYG",
    "G": 12,
    "FPTS": 163.6,
    "PPG": 13.63333333,
    "CSTY%": 0.5,
    "CL": 26.4,
    "TS%": 0.262,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 796,
    "IMP/G": 2.666666667,
    "SNP%": 0.902291918,
    "YPC": 1.0,
    "TGT": 102,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.16666667,
    "YPRR": 2.051679587,
    "1DRR": 0.07235142119
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7543,
    "NM": "Travis Etienne",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "JAX",
    "G": 11,
    "FPTS": 163.5,
    "PPG": 14.86363636,
    "CSTY%": 0.6363636364,
    "CL": 19.8,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 975,
    "IMP/G": 3.727272727,
    "SNP%": 0.5847568988,
    "YPC": 4.82,
    "TGT": 37,
    "REC": 24,
    "MTF/A": 0.2958579882,
    "YCO/A": 2.177514793,
    "recYPG": 14.54545455,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12508,
    "NM": "Jaxson Dart",
    "POS": "QB",
    "AGE": 22.4,
    "TM": "NYG",
    "G": 9,
    "FPTS": 163.38,
    "PPG": 18.15333333,
    "CSTY%": 0.7777777778,
    "CL": 27.64666667,
    "TS%": NaN,
    "paYPG": 157.4444444,
    "paRTG": 93.53,
    "CMP%": 0.6274509804,
    "TTT": 2.893823529,
    "YDS(t)": 1734,
    "IMP/G": 9.777777778,
    "SNP%": 0.6785185185,
    "YPC": 5.56,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4866,
    "NM": "Saquon Barkley",
    "POS": "RB",
    "AGE": 28.6,
    "TM": "PHI",
    "G": 11,
    "FPTS": 163.3,
    "PPG": 14.84545455,
    "CSTY%": 0.6363636364,
    "CL": 23.2,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 943,
    "IMP/G": 3.454545455,
    "SNP%": 0.7895522388,
    "YPC": 3.7,
    "TGT": 41,
    "REC": 35,
    "MTF/A": 0.227027027,
    "YCO/A": 1.432432432,
    "recYPG": 23.54545455,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12514,
    "NM": "Emeka Egbuka",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "TB",
    "G": 11,
    "FPTS": 161.8,
    "PPG": 14.70909091,
    "CSTY%": 0.5454545455,
    "CL": 26.13333333,
    "TS%": 0.249,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 758,
    "IMP/G": 2.545454545,
    "SNP%": 0.8346994536,
    "YPC": 4.5,
    "TGT": 93,
    "REC": 48,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 68.09090909,
    "YPRR": 2.092178771,
    "1DRR": 0.06145251397
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3198,
    "NM": "Derrick Henry",
    "POS": "RB",
    "AGE": 31.7,
    "TM": "BAL",
    "G": 11,
    "FPTS": 159.9,
    "PPG": 14.53636364,
    "CSTY%": 0.5454545455,
    "CL": 24.06666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 969,
    "IMP/G": 4.090909091,
    "SNP%": 0.5606758833,
    "YPC": 4.66,
    "TGT": 17,
    "REC": 13,
    "MTF/A": 0.1604278075,
    "YCO/A": 1.994652406,
    "recYPG": 8.909090909,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 19,
    "NM": "Joe Flacco",
    "POS": "QB",
    "AGE": 40.7,
    "TM": "CIN",
    "G": 10,
    "FPTS": 155.14,
    "PPG": 15.514,
    "CSTY%": 0.4,
    "CL": 27.66666667,
    "TS%": NaN,
    "paYPG": 245.1,
    "paRTG": 79.23,
    "CMP%": 0.6024390244,
    "TTT": 2.736390244,
    "YDS(t)": 2482,
    "IMP/G": 12.1,
    "SNP%": 0.8921438083,
    "YPC": 1.94,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8155,
    "NM": "Breece Hall",
    "POS": "RB",
    "AGE": 24.3,
    "TM": "NYJ",
    "G": 11,
    "FPTS": 152.86,
    "PPG": 13.89636364,
    "CSTY%": 0.5454545455,
    "CL": 23.28666667,
    "TS%": NaN,
    "paYPG": 0.3636363636,
    "paRTG": 122.92,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 1071,
    "IMP/G": 4.909090909,
    "SNP%": 0.6308823529,
    "YPC": 4.56,
    "TGT": 37,
    "REC": 28,
    "MTF/A": 0.2142857143,
    "YCO/A": 2.113095238,
    "recYPG": 27.36363636,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 96,
    "NM": "Aaron Rodgers",
    "POS": "QB",
    "AGE": 41.8,
    "TM": "PIT",
    "G": 10,
    "FPTS": 152.36,
    "PPG": 15.236,
    "CSTY%": 0.4,
    "CL": 22.57333333,
    "TS%": NaN,
    "paYPG": 196.9,
    "paRTG": 97.66,
    "CMP%": 0.6643598616,
    "TTT": 2.639930796,
    "YDS(t)": 1995,
    "IMP/G": 8.6,
    "SNP%": 0.9416809605,
    "YPC": 1.86,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6794,
    "NM": "Justin Jefferson",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "MIN",
    "G": 11,
    "FPTS": 151.9,
    "PPG": 13.80909091,
    "CSTY%": 0.6363636364,
    "CL": 19.53333333,
    "TS%": 0.294,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 799,
    "IMP/G": 3.090909091,
    "SNP%": 0.9645061728,
    "YPC": 4.0,
    "TGT": 99,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 72.27272727,
    "YPRR": 2.178082192,
    "1DRR": 0.08767123288
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7526,
    "NM": "Jaylen Waddle",
    "POS": "WR",
    "AGE": 26.8,
    "TM": "MIA",
    "G": 11,
    "FPTS": 151.52,
    "PPG": 13.77454545,
    "CSTY%": 0.6363636364,
    "CL": 21.1,
    "TS%": 0.221,
    "paYPG": 0.7272727273,
    "paRTG": 100.0,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 730,
    "IMP/G": 3.181818182,
    "SNP%": 0.8150470219,
    "YPC": 0.0,
    "TGT": 73,
    "REC": 49,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 65.63636364,
    "YPRR": 2.506944444,
    "1DRR": 0.1041666667
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8110,
    "NM": "Jake Ferguson",
    "POS": "TE",
    "AGE": 26.7,
    "TM": "DAL",
    "G": 11,
    "FPTS": 151.1,
    "PPG": 13.73636364,
    "CSTY%": 0.7272727273,
    "CL": 22.33333333,
    "TS%": 0.189,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 461,
    "IMP/G": 2.090909091,
    "SNP%": 0.6856010568,
    "YPC": 1.0,
    "TGT": 77,
    "REC": 65,
    "MTF/A": NaN,
    "YCO/A": 1.0,
    "recYPG": 41.81818182,
    "YPRR": 1.483870968,
    "1DRR": 0.05161290323
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4881,
    "NM": "Lamar Jackson",
    "POS": "QB",
    "AGE": 28.7,
    "TM": "BAL",
    "G": 8,
    "FPTS": 150.5,
    "PPG": 18.8125,
    "CSTY%": 0.625,
    "CL": 27.56,
    "TS%": NaN,
    "paYPG": 199.375,
    "paRTG": 110.95,
    "CMP%": 0.6666666667,
    "TTT": 2.878871795,
    "YDS(t)": 1832,
    "IMP/G": 11.25,
    "SNP%": 0.9594017094,
    "YPC": 5.15,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9224,
    "NM": "Chase Brown",
    "POS": "RB",
    "AGE": 25.5,
    "TM": "CIN",
    "G": 11,
    "FPTS": 148.8,
    "PPG": 13.52727273,
    "CSTY%": 0.5454545455,
    "CL": 21.13333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 878,
    "IMP/G": 4.0,
    "SNP%": 0.6982507289,
    "YPC": 4.32,
    "TGT": 57,
    "REC": 41,
    "MTF/A": 0.275862069,
    "YCO/A": 2.206896552,
    "recYPG": 22.90909091,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7525,
    "NM": "DeVonta Smith",
    "POS": "WR",
    "AGE": 26.9,
    "TM": "PHI",
    "G": 11,
    "FPTS": 148.4,
    "PPG": 13.49090909,
    "CSTY%": 0.5454545455,
    "CL": 24.23333333,
    "TS%": 0.253,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 754,
    "IMP/G": 2.909090909,
    "SNP%": 0.9208955224,
    "YPC": 0.0,
    "TGT": 78,
    "REC": 55,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 68.54545455,
    "YPRR": 2.277945619,
    "1DRR": 0.08761329305
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1466,
    "NM": "Travis Kelce",
    "POS": "TE",
    "AGE": 36.0,
    "TM": "KC",
    "G": 11,
    "FPTS": 147.5,
    "PPG": 13.40909091,
    "CSTY%": 0.5454545455,
    "CL": 21.7,
    "TS%": 0.177,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 675,
    "IMP/G": 3.181818182,
    "SNP%": 0.774025974,
    "YPC": 1.0,
    "TGT": 72,
    "REC": 54,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 61.27272727,
    "YPRR": 1.970760234,
    "1DRR": 0.09064327485
  },
  {
    "SZN": 2025,
    "SLPR_ID": 2449,
    "NM": "Stefon Diggs",
    "POS": "WR",
    "AGE": 31.8,
    "TM": "NE",
    "G": 12,
    "FPTS": 146.9,
    "PPG": 12.24166667,
    "CSTY%": 0.5,
    "CL": 20.06666667,
    "TS%": 0.21,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 679,
    "IMP/G": 2.916666667,
    "SNP%": 0.5462724936,
    "YPC": 0.0,
    "TGT": 75,
    "REC": 61,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.58333333,
    "YPRR": 2.562264151,
    "1DRR": 0.120754717
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7569,
    "NM": "Nico Collins",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "HOU",
    "G": 10,
    "FPTS": 146.5,
    "PPG": 14.65,
    "CSTY%": 0.6,
    "CL": 23.06666667,
    "TS%": 0.217,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 705,
    "IMP/G": 3.1,
    "SNP%": 0.7757847534,
    "YPC": 8.0,
    "TGT": 85,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 69.7,
    "YPRR": 2.248387097,
    "1DRR": 0.08709677419
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9228,
    "NM": "Bryce Young",
    "POS": "QB",
    "AGE": 24.2,
    "TM": "CAR",
    "G": 11,
    "FPTS": 146.04,
    "PPG": 13.27636364,
    "CSTY%": 0.2727272727,
    "CL": 24.53333333,
    "TS%": NaN,
    "paYPG": 193.7272727,
    "paRTG": 83.85,
    "CMP%": 0.6268221574,
    "TTT": 2.781778426,
    "YDS(t)": 2229,
    "IMP/G": 11.09090909,
    "SNP%": 0.9500693481,
    "YPC": 3.63,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12518,
    "NM": "Tyler Warren",
    "POS": "TE",
    "AGE": 23.4,
    "TM": "IND",
    "G": 11,
    "FPTS": 145.8,
    "PPG": 13.25454545,
    "CSTY%": 0.6363636364,
    "CL": 18.16666667,
    "TS%": 0.208,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 668,
    "IMP/G": 3.090909091,
    "SNP%": 0.8257790368,
    "YPC": 1.5,
    "TGT": 74,
    "REC": 55,
    "MTF/A": NaN,
    "YCO/A": 0.5,
    "recYPG": 60.18181818,
    "YPRR": 2.156351792,
    "1DRR": 0.09446254072
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1373,
    "NM": "Geno Smith",
    "POS": "QB",
    "AGE": 35.0,
    "TM": "LV",
    "G": 11,
    "FPTS": 144.68,
    "PPG": 13.15272727,
    "CSTY%": 0.2727272727,
    "CL": 23.93333333,
    "TS%": NaN,
    "paYPG": 215.1818182,
    "paRTG": 82.43,
    "CMP%": 0.6657223796,
    "TTT": 2.791926346,
    "YDS(t)": 2477,
    "IMP/G": 11.72727273,
    "SNP%": 0.9896755162,
    "YPC": 2.97,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6768,
    "NM": "Tua Tagovailoa",
    "POS": "QB",
    "AGE": 27.6,
    "TM": "MIA",
    "G": 11,
    "FPTS": 143.72,
    "PPG": 13.06545455,
    "CSTY%": 0.2727272727,
    "CL": 22.18,
    "TS%": NaN,
    "paYPG": 193.0,
    "paRTG": 88.13,
    "CMP%": 0.6826923077,
    "TTT": 2.579967949,
    "YDS(t)": 2161,
    "IMP/G": 10.18181818,
    "SNP%": 0.9561128527,
    "YPC": 2.71,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7591,
    "NM": "Justin Fields",
    "POS": "QB",
    "AGE": 26.6,
    "TM": "NYJ",
    "G": 9,
    "FPTS": 143.66,
    "PPG": 15.96222222,
    "CSTY%": 0.5555555556,
    "CL": 27.52666667,
    "TS%": NaN,
    "paYPG": 139.8888889,
    "paRTG": 89.48,
    "CMP%": 0.6274509804,
    "TTT": 2.929411765,
    "YDS(t)": 1642,
    "IMP/G": 9.333333333,
    "SNP%": 0.8199672668,
    "YPC": 5.39,
    "TGT": 1,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11620,
    "NM": "Rome Odunze",
    "POS": "WR",
    "AGE": 23.3,
    "TM": "CHI",
    "G": 11,
    "FPTS": 143.3,
    "PPG": 13.02727273,
    "CSTY%": 0.5454545455,
    "CL": 23.6,
    "TS%": 0.23,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 653,
    "IMP/G": 3.272727273,
    "SNP%": 0.8887399464,
    "YPC": 0.0,
    "TGT": 84,
    "REC": 42,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.36363636,
    "YPRR": 1.876436782,
    "1DRR": 0.08620689655
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11635,
    "NM": "Ladd McConkey",
    "POS": "WR",
    "AGE": 23.9,
    "TM": "LAC",
    "G": 11,
    "FPTS": 142.4,
    "PPG": 12.94545455,
    "CSTY%": 0.5454545455,
    "CL": 21.5,
    "TS%": 0.216,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 644,
    "IMP/G": 2.636363636,
    "SNP%": 0.7723577236,
    "YPC": 0.0,
    "TGT": 84,
    "REC": 54,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 58.54545455,
    "YPRR": 1.731182796,
    "1DRR": 0.06720430108
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9997,
    "NM": "Zay Flowers",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "BAL",
    "G": 11,
    "FPTS": 142.3,
    "PPG": 12.93636364,
    "CSTY%": 0.5454545455,
    "CL": 19.13333333,
    "TS%": 0.27,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 803,
    "IMP/G": 3.0,
    "SNP%": 0.866359447,
    "YPC": 5.25,
    "TGT": 77,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 69.18181818,
    "YPRR": 2.579661017,
    "1DRR": 0.1016949153
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6801,
    "NM": "Tee Higgins",
    "POS": "WR",
    "AGE": 26.7,
    "TM": "CIN",
    "G": 11,
    "FPTS": 141.5,
    "PPG": 12.86363636,
    "CSTY%": 0.3636363636,
    "CL": 23.33333333,
    "TS%": 0.17,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 575,
    "IMP/G": 2.545454545,
    "SNP%": 0.8513119534,
    "YPC": 0.0,
    "TGT": 70,
    "REC": 40,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 52.27272727,
    "YPRR": 1.497395833,
    "1DRR": 0.0546875
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5872,
    "NM": "Deebo Samuel",
    "POS": "WR",
    "AGE": 29.7,
    "TM": "WAS",
    "G": 10,
    "FPTS": 141.2,
    "PPG": 14.12,
    "CSTY%": 0.6,
    "CL": 22.3,
    "TS%": 0.221,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 522,
    "IMP/G": 2.2,
    "SNP%": 0.7406807131,
    "YPC": 4.73,
    "TGT": 68,
    "REC": 53,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 47.0,
    "YPRR": 1.934156379,
    "1DRR": 0.05761316872
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1479,
    "NM": "Keenan Allen",
    "POS": "WR",
    "AGE": 33.4,
    "TM": "LAC",
    "G": 11,
    "FPTS": 139.2,
    "PPG": 12.65454545,
    "CSTY%": 0.3636363636,
    "CL": 22.73333333,
    "TS%": 0.222,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 592,
    "IMP/G": 3.272727273,
    "SNP%": 0.5636856369,
    "YPC": 0.0,
    "TGT": 86,
    "REC": 56,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 53.81818182,
    "YPRR": 1.986577181,
    "1DRR": 0.1073825503
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6790,
    "NM": "D'Andre Swift",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "CHI",
    "G": 10,
    "FPTS": 137.3,
    "PPG": 13.73,
    "CSTY%": 0.6,
    "CL": 20.76666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 873,
    "IMP/G": 4.6,
    "SNP%": 0.5885885886,
    "YPC": 4.57,
    "TGT": 34,
    "REC": 24,
    "MTF/A": 0.2042253521,
    "YCO/A": 1.823943662,
    "recYPG": 22.4,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12529,
    "NM": "TreVeyon Henderson",
    "POS": "RB",
    "AGE": 22.9,
    "TM": "NE",
    "G": 12,
    "FPTS": 136.8,
    "PPG": 11.4,
    "CSTY%": 0.3333333333,
    "CL": 24.33333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 738,
    "IMP/G": 2.916666667,
    "SNP%": 0.4781491003,
    "YPC": 4.73,
    "TGT": 34,
    "REC": 29,
    "MTF/A": 0.3305084746,
    "YCO/A": 2.406779661,
    "recYPG": 15.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5846,
    "NM": "DK Metcalf",
    "POS": "WR",
    "AGE": 27.8,
    "TM": "PIT",
    "G": 11,
    "FPTS": 136.5,
    "PPG": 12.40909091,
    "CSTY%": 0.5454545455,
    "CL": 19.86666667,
    "TS%": 0.207,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 585,
    "IMP/G": 2.636363636,
    "SNP%": 0.8839694656,
    "YPC": 6.0,
    "TGT": 70,
    "REC": 42,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 52.09090909,
    "YPRR": 1.710447761,
    "1DRR": 0.06865671642
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7527,
    "NM": "Mac Jones",
    "POS": "QB",
    "AGE": 27.1,
    "TM": "SF",
    "G": 9,
    "FPTS": 136.14,
    "PPG": 15.12666667,
    "CSTY%": 0.4444444444,
    "CL": 22.66666667,
    "TS%": NaN,
    "paYPG": 239.0,
    "paRTG": 97.4,
    "CMP%": 0.6955017301,
    "TTT": 2.715017301,
    "YDS(t)": 2212,
    "IMP/G": 13.0,
    "SNP%": 0.6720698254,
    "YPC": 1.97,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5045,
    "NM": "Courtland Sutton",
    "POS": "WR",
    "AGE": 30.0,
    "TM": "DEN",
    "G": 11,
    "FPTS": 135.9,
    "PPG": 12.35454545,
    "CSTY%": 0.4545454545,
    "CL": 20.33333333,
    "TS%": 0.191,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 649,
    "IMP/G": 2.909090909,
    "SNP%": 0.8796169631,
    "YPC": 0.0,
    "TGT": 74,
    "REC": 45,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.0,
    "YPRR": 1.744623656,
    "1DRR": 0.0752688172
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11627,
    "NM": "Troy Franklin",
    "POS": "WR",
    "AGE": 22.6,
    "TM": "DEN",
    "G": 11,
    "FPTS": 131.8,
    "PPG": 11.98181818,
    "CSTY%": 0.4545454545,
    "CL": 21.96666667,
    "TS%": 0.209,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 518,
    "IMP/G": 2.363636364,
    "SNP%": 0.6648426813,
    "YPC": 2.25,
    "TGT": 81,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.27272727,
    "YPRR": 1.585669782,
    "1DRR": 0.05919003115
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8228,
    "NM": "Jaylen Warren",
    "POS": "RB",
    "AGE": 26.9,
    "TM": "PIT",
    "G": 10,
    "FPTS": 131.3,
    "PPG": 13.13,
    "CSTY%": 0.6,
    "CL": 18.03333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 823,
    "IMP/G": 4.6,
    "SNP%": 0.5382059801,
    "YPC": 4.28,
    "TGT": 28,
    "REC": 25,
    "MTF/A": 0.390070922,
    "YCO/A": 2.609929078,
    "recYPG": 21.9,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12512,
    "NM": "Quinshon Judkins",
    "POS": "RB",
    "AGE": 21.9,
    "TM": "CLE",
    "G": 10,
    "FPTS": 129.7,
    "PPG": 12.97,
    "CSTY%": 0.5,
    "CL": 21.53333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 737,
    "IMP/G": 4.3,
    "SNP%": 0.4907407407,
    "YPC": 3.86,
    "TGT": 20,
    "REC": 14,
    "MTF/A": 0.1965317919,
    "YCO/A": 2.346820809,
    "recYPG": 7.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7567,
    "NM": "Kenneth Gainwell",
    "POS": "RB",
    "AGE": 26.5,
    "TM": "PIT",
    "G": 11,
    "FPTS": 128.0,
    "PPG": 11.63636364,
    "CSTY%": 0.2727272727,
    "CL": 26.36666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 570,
    "IMP/G": 3.0,
    "SNP%": 0.465648855,
    "YPC": 4.73,
    "TGT": 48,
    "REC": 42,
    "MTF/A": 0.3098591549,
    "YCO/A": 1.887323944,
    "recYPG": 21.27272727,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12481,
    "NM": "Cam Skattebo",
    "POS": "RB",
    "AGE": 23.6,
    "TM": "NYG",
    "G": 8,
    "FPTS": 127.7,
    "PPG": 15.9625,
    "CSTY%": 0.75,
    "CL": 24.5,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 617,
    "IMP/G": 4.75,
    "SNP%": 0.5412844037,
    "YPC": 4.06,
    "TGT": 32,
    "REC": 24,
    "MTF/A": 0.3465346535,
    "YCO/A": 1.900990099,
    "recYPG": 25.875,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10213,
    "NM": "Tre Tucker",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "LV",
    "G": 11,
    "FPTS": 127.6,
    "PPG": 11.6,
    "CSTY%": 0.3636363636,
    "CL": 23.0,
    "TS%": 0.18,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 566,
    "IMP/G": 2.181818182,
    "SNP%": 0.9380530973,
    "YPC": 6.0,
    "TGT": 64,
    "REC": 41,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.18181818,
    "YPRR": 1.402116402,
    "1DRR": 0.05026455026
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8134,
    "NM": "Khalil Shakir",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "BUF",
    "G": 11,
    "FPTS": 126.9,
    "PPG": 11.53636364,
    "CSTY%": 0.5454545455,
    "CL": 18.56666667,
    "TS%": 0.213,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 569,
    "IMP/G": 2.090909091,
    "SNP%": 0.6030428769,
    "YPC": 5.0,
    "TGT": 71,
    "REC": 54,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 51.27272727,
    "YPRR": 2.065934066,
    "1DRR": 0.07326007326
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5859,
    "NM": "A.J. Brown",
    "POS": "WR",
    "AGE": 28.2,
    "TM": "PHI",
    "G": 10,
    "FPTS": 126.7,
    "PPG": 12.67,
    "CSTY%": 0.4,
    "CL": 25.33333333,
    "TS%": 0.244,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 567,
    "IMP/G": 2.4,
    "SNP%": 0.9184339315,
    "YPC": 0.0,
    "TGT": 75,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.7,
    "YPRR": 1.922033898,
    "1DRR": 0.06779661017
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9758,
    "NM": "C.J. Stroud",
    "POS": "QB",
    "AGE": 24.0,
    "TM": "HOU",
    "G": 8,
    "FPTS": 125.98,
    "PPG": 15.7475,
    "CSTY%": 0.375,
    "CL": 23.3,
    "TS%": NaN,
    "paYPG": 212.75,
    "paRTG": 93.37,
    "CMP%": 0.6652892562,
    "TTT": 2.742272727,
    "YDS(t)": 1891,
    "IMP/G": 11.375,
    "SNP%": 0.8825688073,
    "YPC": 6.52,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3214,
    "NM": "Hunter Henry",
    "POS": "TE",
    "AGE": 30.8,
    "TM": "NE",
    "G": 12,
    "FPTS": 124.7,
    "PPG": 10.39166667,
    "CSTY%": 0.25,
    "CL": 21.8,
    "TS%": 0.176,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 537,
    "IMP/G": 2.416666667,
    "SNP%": 0.8200514139,
    "YPC": 0.0,
    "TGT": 63,
    "REC": 41,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.75,
    "YPRR": 1.754901961,
    "1DRR": 0.07843137255
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8151,
    "NM": "Kenneth Walker III",
    "POS": "RB",
    "AGE": 24.9,
    "TM": "SEA",
    "G": 11,
    "FPTS": 124.4,
    "PPG": 11.30909091,
    "CSTY%": 0.4545454545,
    "CL": 18.96666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 834,
    "IMP/G": 3.454545455,
    "SNP%": 0.4665676077,
    "YPC": 4.61,
    "TGT": 19,
    "REC": 17,
    "MTF/A": 0.3265306122,
    "YCO/A": 1.734693878,
    "recYPG": 14.27272727,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11559,
    "NM": "Michael Penix Jr.",
    "POS": "QB",
    "AGE": 25.4,
    "TM": "ATL",
    "G": 9,
    "FPTS": 123.28,
    "PPG": 13.69777778,
    "CSTY%": 0.3333333333,
    "CL": 22.16,
    "TS%": NaN,
    "paYPG": 220.2222222,
    "paRTG": 88.47,
    "CMP%": 0.6014492754,
    "TTT": 2.789456522,
    "YDS(t)": 2052,
    "IMP/G": 11.55555556,
    "SNP%": 0.9325463744,
    "YPC": 3.33,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9754,
    "NM": "Quentin Johnston",
    "POS": "WR",
    "AGE": 24.1,
    "TM": "LAC",
    "G": 10,
    "FPTS": 121.9,
    "PPG": 12.19,
    "CSTY%": 0.5,
    "CL": 21.53333333,
    "TS%": 0.168,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 509,
    "IMP/G": 1.8,
    "SNP%": 0.7982195846,
    "YPC": 3.5,
    "TGT": 66,
    "REC": 37,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 50.2,
    "YPRR": 1.467836257,
    "1DRR": 0.0350877193
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6786,
    "NM": "CeeDee Lamb",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "DAL",
    "G": 8,
    "FPTS": 119.4,
    "PPG": 14.925,
    "CSTY%": 0.75,
    "CL": 20.06666667,
    "TS%": 0.177,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 634,
    "IMP/G": 3.125,
    "SNP%": 0.7347294939,
    "YPC": 2.0,
    "TGT": 72,
    "REC": 44,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 79.0,
    "YPRR": 2.517928287,
    "1DRR": 0.09163346614
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8121,
    "NM": "Romeo Doubs",
    "POS": "WR",
    "AGE": 25.5,
    "TM": "GB",
    "G": 11,
    "FPTS": 119.2,
    "PPG": 10.83636364,
    "CSTY%": 0.2727272727,
    "CL": 19.7,
    "TS%": 0.201,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 522,
    "IMP/G": 2.818181818,
    "SNP%": 0.8040057225,
    "YPC": 0.0,
    "TGT": 67,
    "REC": 41,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 47.45454545,
    "YPRR": 1.85106383,
    "1DRR": 0.09574468085
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7002,
    "NM": "Juwan Johnson",
    "POS": "TE",
    "AGE": 29.0,
    "TM": "NO",
    "G": 11,
    "FPTS": 118.7,
    "PPG": 10.79090909,
    "CSTY%": 0.5454545455,
    "CL": 16.9,
    "TS%": 0.173,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 537,
    "IMP/G": 2.363636364,
    "SNP%": 0.8055172414,
    "YPC": 0.0,
    "TGT": 67,
    "REC": 49,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.81818182,
    "YPRR": 1.622356495,
    "1DRR": 0.06948640483
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8148,
    "NM": "Jameson Williams",
    "POS": "WR",
    "AGE": 24.5,
    "TM": "DET",
    "G": 11,
    "FPTS": 118.2,
    "PPG": 10.74545455,
    "CSTY%": 0.4545454545,
    "CL": 20.8,
    "TS%": 0.149,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 572,
    "IMP/G": 2.363636364,
    "SNP%": 0.895565093,
    "YPC": 2.5,
    "TGT": 53,
    "REC": 31,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 51.09090909,
    "YPRR": 1.574229692,
    "1DRR": 0.05882352941
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5022,
    "NM": "Dallas Goedert",
    "POS": "TE",
    "AGE": 30.7,
    "TM": "PHI",
    "G": 10,
    "FPTS": 117.6,
    "PPG": 11.76,
    "CSTY%": 0.4,
    "CL": 21.16666667,
    "TS%": 0.169,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 376,
    "IMP/G": 2.1,
    "SNP%": 0.8491803279,
    "YPC": 0.0,
    "TGT": 52,
    "REC": 38,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 37.6,
    "YPRR": 1.451737452,
    "1DRR": 0.05405405405
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9484,
    "NM": "Tucker Kraft",
    "POS": "TE",
    "AGE": 24.9,
    "TM": "GB",
    "G": 8,
    "FPTS": 117.2,
    "PPG": 14.65,
    "CSTY%": 0.5,
    "CL": 24.93333333,
    "TS%": 0.132,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 492,
    "IMP/G": 2.75,
    "SNP%": 0.8607843137,
    "YPC": 3.0,
    "TGT": 44,
    "REC": 32,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 61.125,
    "YPRR": 2.657608696,
    "1DRR": 0.08695652174
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5892,
    "NM": "David Montgomery",
    "POS": "RB",
    "AGE": 28.3,
    "TM": "DET",
    "G": 11,
    "FPTS": 116.72,
    "PPG": 10.61090909,
    "CSTY%": 0.2727272727,
    "CL": 20.24,
    "TS%": NaN,
    "paYPG": 0.2727272727,
    "paRTG": 118.75,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 649,
    "IMP/G": 3.090909091,
    "SNP%": 0.4020028612,
    "YPC": 4.44,
    "TGT": 22,
    "REC": 18,
    "MTF/A": 0.252173913,
    "YCO/A": 2.139130435,
    "recYPG": 12.27272727,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4983,
    "NM": "D.J. Moore",
    "POS": "WR",
    "AGE": 28.4,
    "TM": "CHI",
    "G": 11,
    "FPTS": 116.28,
    "PPG": 10.57090909,
    "CSTY%": 0.2727272727,
    "CL": 19.72666667,
    "TS%": 0.158,
    "paYPG": 0.1818181818,
    "paRTG": 118.75,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 544,
    "IMP/G": 2.363636364,
    "SNP%": 0.8243967828,
    "YPC": 4.38,
    "TGT": 58,
    "REC": 36,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.09090909,
    "YPRR": 1.483180428,
    "1DRR": 0.05810397554
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11604,
    "NM": "Brock Bowers",
    "POS": "TE",
    "AGE": 22.8,
    "TM": "LV",
    "G": 8,
    "FPTS": 116.2,
    "PPG": 14.525,
    "CSTY%": 0.511,
    "CL": 24.16666667,
    "TS%": 0.18,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 512,
    "IMP/G": 3.0,
    "SNP%": 0.8112840467,
    "YPC": 1.0,
    "TGT": 64,
    "REC": 45,
    "MTF/A": NaN,
    "YCO/A": 1.5,
    "recYPG": 63.75,
    "YPRR": 1.954022989,
    "1DRR": 0.08045977011
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12522,
    "NM": "Cam Ward",
    "POS": "QB",
    "AGE": 23.3,
    "TM": "TEN",
    "G": 11,
    "FPTS": 116.0,
    "PPG": 10.54545455,
    "CSTY%": 0.09090909091,
    "CL": 16.92,
    "TS%": NaN,
    "paYPG": 200.9090909,
    "paRTG": 75.72,
    "CMP%": 0.5935828877,
    "TTT": 2.941898396,
    "YDS(t)": 2326,
    "IMP/G": 10.90909091,
    "SNP%": 1.0,
    "YPC": 4.3,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6806,
    "NM": "J.K. Dobbins",
    "POS": "RB",
    "AGE": 26.8,
    "TM": "DEN",
    "G": 10,
    "FPTS": 115.9,
    "PPG": 11.59,
    "CSTY%": 0.5,
    "CL": 15.4,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 809,
    "IMP/G": 3.7,
    "SNP%": 0.5082212257,
    "YPC": 5.05,
    "TGT": 14,
    "REC": 11,
    "MTF/A": 0.2091503268,
    "YCO/A": 2.444444444,
    "recYPG": 3.7,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4098,
    "NM": "Kareem Hunt",
    "POS": "RB",
    "AGE": 30.1,
    "TM": "KC",
    "G": 11,
    "FPTS": 113.9,
    "PPG": 10.35454545,
    "CSTY%": 0.4545454545,
    "CL": 18.63333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 549,
    "IMP/G": 4.090909091,
    "SNP%": 0.4662337662,
    "YPC": 3.94,
    "TGT": 16,
    "REC": 13,
    "MTF/A": 0.2844827586,
    "YCO/A": 2.094827586,
    "recYPG": 8.363636364,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11566,
    "NM": "Jayden Daniels",
    "POS": "QB",
    "AGE": 24.8,
    "TM": "WAS",
    "G": 6,
    "FPTS": 113.56,
    "PPG": 18.92666667,
    "CSTY%": 1.0,
    "CL": 20.82,
    "TS%": NaN,
    "paYPG": 197.3333333,
    "paRTG": 94.44,
    "CMP%": 0.625,
    "TTT": 2.808928571,
    "YDS(t)": 1446,
    "IMP/G": 11.33333333,
    "SNP%": 0.9265822785,
    "YPC": 4.85,
    "TGT": 0,
    "REC": 0,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8676,
    "NM": "Rashid Shaheed",
    "POS": "WR",
    "AGE": 27.1,
    "TM": "SEA",
    "G": 12,
    "FPTS": 113.1,
    "PPG": 9.425,
    "CSTY%": 0.1666666667,
    "CL": 16.13333333,
    "TS%": 0.245,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 561,
    "IMP/G": 2.083333333,
    "SNP%": 0.673151751,
    "YPC": 5.33,
    "TGT": 74,
    "REC": 47,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.08333333,
    "YPRR": 1.569732938,
    "1DRR": 0.06231454006
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11628,
    "NM": "Marvin Harrison Jr.",
    "POS": "WR",
    "AGE": 23.1,
    "TM": "ARI",
    "G": 9,
    "FPTS": 112.5,
    "PPG": 12.5,
    "CSTY%": 0.5555555556,
    "CL": 19.76666667,
    "TS%": 0.146,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 525,
    "IMP/G": 2.777777778,
    "SNP%": 0.7846655791,
    "YPC": 0.0,
    "TGT": 62,
    "REC": 34,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 58.33333333,
    "YPRR": 1.761744966,
    "1DRR": 0.07046979866
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11597,
    "NM": "Theo Johnson",
    "POS": "TE",
    "AGE": 24.6,
    "TM": "NYG",
    "G": 12,
    "FPTS": 111.7,
    "PPG": 9.308333333,
    "CSTY%": 0.3333333333,
    "CL": 17.13333333,
    "TS%": 0.154,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 427,
    "IMP/G": 1.833333333,
    "SNP%": 0.8564535585,
    "YPC": 0.0,
    "TGT": 60,
    "REC": 39,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 35.58333333,
    "YPRR": 1.290030211,
    "1DRR": 0.05135951662
  }
];

// === State ===
let players = [];
let scatterAll = [];
const dashState = { selectedPlayerId: null, filter: 'all', scatterFilter: 'ALL' };

// === Helpers ===
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const formatInitialLast = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstInitial = parts[0]?.[0] ? `${parts[0][0].toUpperCase()}.` : '';
  const last = parts.slice(1).join(' ');
  return `${firstInitial} ${last}`.trim();
};
const getSelected = () => players.find(p => p.id === dashState.selectedPlayerId) || players[0];

const RADAR_STATS_CONFIG = {
  QB: {
    stats: ['fpts', 'ppg', 'pass_rtg', 'cmp_pct', 'pa_ypg', 'ttt', 'yds_total', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'paRTG', 'CMP%', 'paYPG', 'TTT', 'YDS(t)', 'IMP/G'],
    maxRank: 36,
    invert: new Set(['ttt'])
  },
  RB: {
    stats: ['fpts', 'ppg', 'yds_total', 'snp_pct', 'ypc', 'rec_tgt', 'mtf_per_att', 'yco_per_att'],
    labels: ['FPTS', 'PPG', 'YDS(t)', 'SNP%', 'YPC', 'TGT', 'MTF/A', 'YCO/A'],
    maxRank: 48,
    invert: new Set()
  },
  WR: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 72,
    invert: new Set()
  },
  TE: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 24,
    invert: new Set()
  }
};

// Utility helpers
const toNum = (v) => (v === null || v === undefined ? null : Number(v));
const toPct = (v) => {
  const n = toNum(v);
  if (!Number.isFinite(n)) return null;
  return n <= 1 && n >= 0 ? n * 100 : n;
};
const formatPct1 = (n) => Number.isFinite(n) ? `${n.toFixed(1)}%` : 'NA';
const formatNum1 = (n) => Number.isFinite(n) ? n.toFixed(1) : 'NA';
const ordinal = (n) => {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return Number.isFinite(n) ? `${n}${s[(v-20)%10]||s[v]||s[0]}` : 'NA';
};
const ordinalParts = (n) => {
  if (!Number.isFinite(n)) return { num: 'NA', suffix: '' };
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  const suffix = s[(v-20)%10] || s[v] || s[0];
  return { num: `${Math.trunc(n)}`, suffix };
};
const rankColor = (rank) => {
  if (!Number.isFinite(rank)) return '#9ca3af';
  if (rank <= 3) return '#76ffc3';         // bright green
  if (rank <= 6) return '#3EACD1';          // cyan for elite
  if (rank <= 10) return '#728cff';          // purple for very good
  return '#A27FF0';                         // red for lower
};

const getRadarRankColor = (rank) => {
  if (!Number.isFinite(rank)) return '#9ca3af';
  if (rank <= 3) return '#76FFC3';
  if (rank <= 12) return '#3EACD1';
  if (rank <= 18) return '#728CFF';
  if (rank <= 24) return '#A27FF0';
  if (rank <= 36) return '#FF6FE1';
  return '#FF2EB2';
};

function normalizePlayer(row) {
  const pos = (row.POS || '').toUpperCase();
  const snp = toPct(row['SNP%']);
  return {
    id: String(row.SLPR_ID),
    name: row.NM,
    position: pos,
    team: row.TM,
    trend: 'stable',
    stats: {
      fpts: toNum(row.FPTS) || 0,
      ppg: toNum(row.PPG) || 0,
      csty: toPct(row['CSTY%']),
      ts: toPct(row['TS%']),
      ceiling: toNum(row.CL),
      cl: toNum(row.CL),
      pa_ypg: toNum(row['paYPG']),
      pass_rtg: toNum(row['paRTG']),
      cmp_pct: toPct(row['CMP%']),
      ttt: toNum(row['TTT']),
      yds_total: toNum(row['YDS(t)']),
      imp_per_g: toNum(row['IMP/G']),
      snp_pct: snp,
      ypc: toNum(row['YPC']),
      rec_tgt: toNum(row['TGT']),
      mtf_per_att: toNum(row['MTF/A']),
      yco_per_att: toNum(row['YCO/A']),
      rec: toNum(row['REC']),
      rec_ypg: toNum(row['recYPG']),
      ts_per_rr: toPct(row['TS%']),
      yprr: toNum(row['YPRR']),
      first_down_rec_rate: toNum(row['1DRR']) || null
    },
    ranks: { posRank: null, ppgPosRank: null },
    statRanks: {}
  };
}

function computePositionalRanks(players) {
  const byPos = { QB: [], RB: [], WR: [], TE: [] };
  players.forEach(p => { if (byPos[p.position]) byPos[p.position].push(p); });

  // Common ranks for FPTS/PPG
  ['fpts','ppg'].forEach(stat => {
    Object.values(byPos).forEach(list => {
      const eligible = list.filter(p => Number.isFinite(p.stats[stat]) && p.stats[stat] > 0)
        .sort((a,b) => b.stats[stat] - a.stats[stat]);
      eligible.forEach((p, idx) => {
        if (stat === 'fpts') p.ranks.posRank = idx + 1;
        else p.ranks.ppgPosRank = idx + 1;
      });
    });
  });

  const EFF_THRESH = 40; // 40% snap share
  const statConfig = {
    QB: [ ['pass_rtg', false], ['cmp_pct', false], ['pa_ypg', false], ['ttt', true], ['yds_total', false], ['imp_per_g', false], ['cl', false], ['csty', false] ],
    RB: [ ['yds_total', false], ['snp_pct', false], ['ypc', false], ['rec_tgt', false], ['mtf_per_att', false], ['yco_per_att', false], ['cl', false], ['csty', false] ],
    WR: [ ['rec', false], ['rec_ypg', false], ['ts_per_rr', false], ['yprr', false], ['first_down_rec_rate', false], ['imp_per_g', false], ['cl', false], ['csty', false] ],
    TE: [ ['rec', false], ['rec_ypg', false], ['ts_per_rr', false], ['yprr', false], ['first_down_rec_rate', false], ['imp_per_g', false], ['cl', false], ['csty', false] ]
  };

  Object.entries(statConfig).forEach(([pos, stats]) => {
    const list = byPos[pos] || [];
    stats.forEach(([key, invert]) => {
      const eligible = list.filter(p => {
        const v = p.stats[key];
        if (!Number.isFinite(v)) return false;
        if ((pos === 'RB' || pos === 'WR' || pos === 'TE') && (!Number.isFinite(p.stats.snp_pct) || p.stats.snp_pct < EFF_THRESH)) return false;
        return true;
      });
      eligible.sort((a,b) => invert ? a.stats[key] - b.stats[key] : b.stats[key] - a.stats[key]);
      eligible.forEach((p, idx) => {
        p.statRanks[key] = idx + 1;
      });
    });
  });
}

// Build radar dataset using provided ranks; fill scales to rank (1 = 100%)
function buildRadarDataset(player) {
  const cfg = RADAR_STATS_CONFIG[player.position];
  if (!cfg) return [];
  return cfg.stats.map((statKey, idx) => {
    const label = cfg.labels[idx];
    let rank = null;
    if (statKey === 'fpts') rank = player.ranks?.posRank;
    else if (statKey === 'ppg') rank = player.ranks?.ppgPosRank;
    else rank = player.statRanks?.[statKey] ?? null;
    const maxRank = cfg.maxRank;
    const fill = Number.isFinite(rank)
      ? clamp(((maxRank - rank + 1) / maxRank) * 100, 0, 100)
      : 8;
    return { axis: label, value: fill, rawValue: player.stats?.[statKey], rank };
  });
}

// Charts data builders
function ppgBarData(filter) {
  return [...players]
    .filter(p => Number.isFinite(p.stats?.ppg) && p.stats.ppg > 0)
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, 8)
    .map(p => ({ label: p.name, value: p.stats.ppg }));
}

// Rendering
function renderSummary() {
  if (!players.length) return;
  const topFpts = players[0];
  const topPPG = [...players].filter(p => Number.isFinite(p.stats.ppg) && p.stats.ppg > 0).sort((a,b)=>b.stats.ppg - a.stats.ppg)[0];
  const topCstyRB = [...players].filter(p => p.position === 'RB' && Number.isFinite(p.stats.csty)).sort((a,b)=>b.stats.csty - a.stats.csty)[0];
  const topTSWR = [...players].filter(p => p.position === 'WR' && Number.isFinite(p.stats.ts)).sort((a,b)=>b.stats.ts - a.stats.ts)[0];

  const projectedMax = Math.max(450, topFpts?.stats.fpts || 0);

  if (topFpts) {
    setText('total-points-value', topFpts.stats.fpts.toFixed(1));
    setText('total-points-name', topFpts.name);
    setWidth('total-points-bar', (topFpts.stats.fpts / projectedMax) * 100);
  }
  if (topCstyRB) {
    setText('consistency-value', `${topCstyRB.stats.csty.toFixed(1)}%`);
    setText('consistency-name', topCstyRB.name);
    setWidth('consistency-bar', topCstyRB.stats.csty);
  }
  if (topPPG) {
    setText('ppg-value', topPPG.stats.ppg.toFixed(1));
    setText('ppg-name', topPPG.name);
  }
  if (topTSWR) {
    setText('share-value', `${topTSWR.stats.ts.toFixed(1)}%`);
    setText('share-name', topTSWR.name);
  }
}

function renderCustomSelect() {
  const optionsContainer = document.getElementById('player-select-options');
  const label = document.getElementById('player-select-label');
  if (!optionsContainer) return;
  const optionsList = players.slice(0, 100);
  optionsContainer.innerHTML = optionsList
    .map(p => `
      <li class="fc-option ${p.id === dashState.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span>${p.name}</span>
        <span class="fc-option-team fc-option-pos-${p.position.toLowerCase()}">${p.position} - ${p.team}</span>
      </li>
    `)
    .join('');
  const selected = getSelected();
  if (label && selected) label.textContent = selected.name;
}

function setupCustomSelect() {
  const container = document.getElementById('player-select-container');
  const trigger = document.getElementById('player-select-trigger');
  const dropdown = document.getElementById('player-select-dropdown');
  const searchInput = document.getElementById('player-select-search');
  const optionsContainer = document.getElementById('player-select-options');
  if (!container || !trigger || !dropdown || !searchInput || !optionsContainer) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    container.classList.toggle('is-open');
    trigger.classList.toggle('is-open');
    if (container.classList.contains('is-open')) {
      searchInput.value = '';
      searchInput.focus();
      optionsContainer.querySelectorAll('.fc-option').forEach(opt => opt.style.display = 'flex');
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeDropdown();
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    optionsContainer.querySelectorAll('.fc-option').forEach(opt => {
      opt.style.display = opt.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
    });
  });

  optionsContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.fc-option');
    if (!option) return;
    dashState.selectedPlayerId = option.dataset.value;
    renderCustomSelect();
    renderSelectedDetails();
    renderRadar();
    closeDropdown();
  });

  function closeDropdown() {
    container.classList.remove('is-open');
    trigger.classList.remove('is-open');
  }
}

function renderSelectedDetails() {
  const player = getSelected();
  const posRank = player.ranks?.posRank;
  const { num, suffix } = ordinalParts(posRank);
  setText('rating-label-top', 'FPTS');
  setHTML('rating-value', `${num}<span class="fc-radar-suffix">${suffix}</span>`);
  setText('rating-meta', 'POS•RK');
}

function renderRadar() {
  const player = getSelected();
  const data = buildRadarDataset(player);
  updateLegendForPosition(player.position);
  drawRadarChart('radar-chart', data);
}

function renderBar() {
  const data = ppgBarData(dashState.filter);
  if (!data.length) return;
  drawBarChart('bar-chart', data);
}

// Update legend labels to match selected position's radar rings
function updateLegendForPosition(pos) {
  const cfg = RADAR_STATS_CONFIG[pos];
  if (!cfg) return;
  const labels = cfg.labels;
  const legendItems = document.querySelectorAll('.fc-legend .fc-legend-item');
  legendItems.forEach((item, idx) => {
    const full = item.querySelector('.fc-legend-full');
    const abbr = item.querySelector('.fc-legend-abbr');
    const label = labels[idx] || '';
    if (full) full.textContent = label;
    if (abbr) abbr.textContent = label;
  });
}

function renderScatter() {
  const topByFpts = [...players]
    .filter(p => Number.isFinite(p.stats?.ppg))
    .sort((a, b) => b.stats.ppg - a.stats.ppg);
  const scatterPool = [];
  ['QB', 'RB', 'WR', 'TE'].forEach(pos => {
    const byPos = topByFpts
      .filter(p => p.position === pos && Number.isFinite(p.stats.csty) && Number.isFinite(p.stats.ceiling))
      .slice(0, 6);
    scatterPool.push(...byPos);
  });
  scatterAll = scatterPool;
  applyScatterFilter(dashState.scatterFilter);
}

function applyScatterFilter(pos) {
  if (!scatterAll.length) return;
  const selected = pos && pos !== 'ALL' ? pos : 'ALL';
  dashState.scatterFilter = selected;
  const filtered = selected === 'ALL' ? scatterAll : scatterAll.filter(p => p.position === selected);
  drawScatterChart('scatter-chart', filtered);
  updateScatterLegend(selected);
}

// Event wiring
function wireEvents() {
  const filterBtns = document.getElementById('filter-buttons');
  if (filterBtns) {
    filterBtns.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const filter = btn.dataset.filter;
      if (!filter) return;
      dashState.filter = filter;
      updateFilterButtons();
      renderBar();
    });
  }

  // Radar Center Click
  const radarCenter = document.querySelector('.fc-radar-center');
  if (radarCenter) {
    radarCenter.addEventListener('click', openRadarModal);
  }

  // Modal Events
  const modal = document.getElementById('radar-modal');
  const closeBtn = modal?.querySelector('.fc-modal-close');
  const overlay = modal?.querySelector('.fc-modal-overlay');

  if (closeBtn) closeBtn.addEventListener('click', closeRadarModal);
  if (overlay) overlay.addEventListener('click', closeRadarModal);
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-visible')) {
      closeRadarModal();
    }
  });

  window.addEventListener('resize', debounce(() => {
    renderRadar();
    renderBar();
    renderScatter();
  }, 200));

  wireScatterLegend();
}

function wireScatterLegend() {
  const legend = document.querySelector('.fc-scatter-legend');
  if (!legend) return;
  legend.addEventListener('click', e => {
    const item = e.target.closest('.fc-legend-item');
    if (!item || !legend.contains(item)) return;
    const pos = item.dataset.pos;
    if (!pos) return;
    const next = dashState.scatterFilter === pos ? 'ALL' : pos;
    applyScatterFilter(next);
  });
}

function updateScatterLegend(activePos) {
  const legend = document.querySelector('.fc-scatter-legend');
  if (!legend) return;
  legend.classList.toggle('has-filter', activePos !== 'ALL');
  legend.querySelectorAll('.fc-legend-item').forEach(item => {
    const pos = item.dataset.pos;
    const isActive = activePos !== 'ALL' && pos === activePos;
    item.classList.toggle('is-active', isActive);
  });
}

function openRadarModal() {
  const player = getSelected();
  if (!player) return;

  const modal = document.getElementById('radar-modal');
  const title = document.getElementById('radar-modal-title');
  const body = document.getElementById('radar-modal-body');
  
  if (!modal || !title || !body) return;

  // Center modal horizontally over the radar chart
  const radarPanel = document.querySelector('.fc-radar-panel');
  if (radarPanel) {
    const rect = radarPanel.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    // Calculate center of radar panel (page-relative)
    const centerX = rect.left + scrollX + (rect.width / 2);
    modal.style.left = centerX + 'px';
  }

  title.innerHTML = `
    <div class="fc-modal-title-row">
      <span class="fc-modal-player-name">${player.name}</span>
      <div class="fc-modal-pos-tag ${player.position}">${player.position}</div>
    </div>
  `;
  
  const cfg = RADAR_STATS_CONFIG[player.position];
  if (!cfg) return;

  // Ring colors matching the radial bar graph
  const ringColors = ['#ef4444', '#f97316', '#eab308', '#22d3ee', '#8b5cf6', '#10b981', '#ec4899', '#a855f7'];

  // Number formatting config per stat key
  const formatConfig = {
    // General stats
    fpts: { decimals: 1, percent: false },
    ppg: { decimals: 1, percent: false },
    csty: { decimals: 1, percent: true },
    cl: { decimals: 1, percent: false },
    ts: { decimals: 1, percent: true },
    pa_ypg: { decimals: 1, percent: false },
    pass_rtg: { decimals: 1, percent: false },
    cmp_pct: { decimals: 1, percent: true },
    ttt: { decimals: 2, percent: false },
    yds_total: { decimals: 0, percent: false },
    imp_per_g: { decimals: 1, percent: false },
    snp_pct: { decimals: 1, percent: true },
    ypc: { decimals: 2, percent: false },
    rec_tgt: { decimals: 0, percent: false },
    rec: { decimals: 0, percent: false },
    mtf_per_att: { decimals: 3, percent: false },
    yco_per_att: { decimals: 2, percent: false },
    rec_ypg: { decimals: 1, percent: false },
    yprr: { decimals: 2, percent: false },
    first_down_rec_rate: { decimals: 3, percent: false },
    ts_per_rr: { decimals: 1, percent: true }
  };

  const statsHtml = cfg.stats.map((statKey, idx) => {
    const label = cfg.labels[idx];
    let val = player.stats[statKey];
    let rank = null;
    
    // Determine rank based on stat key logic from buildRadarDataset
    if (statKey === 'fpts') rank = player.ranks?.posRank;
    else if (statKey === 'ppg') rank = player.ranks?.ppgPosRank;
    else rank = player.statRanks?.[statKey];

    // Format value based on config
    let displayVal = 'NA';
    if (Number.isFinite(val)) {
      const fmt = formatConfig[statKey] || { decimals: 1, percent: false };
      if (fmt.percent) {
        displayVal = val.toFixed(fmt.decimals) + '%';
      } else {
        displayVal = val.toFixed(fmt.decimals);
      }
    }

    const rankTxt = Number.isFinite(rank) ? ordinal(rank) : '-';
    const rColor = getRadarRankColor(rank);
    const dotColor = ringColors[idx % ringColors.length];

    return `
      <div class="fc-stat-row">
        <span class="fc-stat-label"><span class="fc-stat-dot" style="background-color: ${dotColor};"></span>${label}</span>
        <div class="fc-stat-values">
          <span class="fc-stat-val" style="color: ${rColor};">${displayVal}</span>
          <span class="fc-stat-rank" style="color: ${rColor}; border: 1px solid ${rColor}40;">${rankTxt}</span>
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = statsHtml;
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
}

function closeRadarModal() {
  const modal = document.getElementById('radar-modal');
  if (modal) {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function updateFilterButtons() {
  document.querySelectorAll('#filter-buttons button').forEach(btn => {
    const active = btn.dataset.filter === dashState.filter;
    btn.classList.toggle('active', active);
    btn.classList.toggle('fc-filter-btn--active', active);
  });
}

// Small utilities
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}
function setWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${clamp(pct, 0, 100)}%`;
}
function debounce(fn, delay = 150) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
function trendSvg(trend) {
  if (trend === 'up') return '<span style="color: var(--color-emerald-light); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></span>';
  if (trend === 'down') return '<span style="color: var(--color-red); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></span>';
  return '<span style="color: var(--text-muted); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path></svg></span>';
}

// D3 radar, bar, scatter (unchanged visuals)
function drawRadarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 360;
  const height = rect.height || 360;
  const size = Math.min(width, height);
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', `translate(${width / 2},${height / 2})`);
  const numRings = data.length;
  const maxRadius = size / 2 * 0.95;
  const innerRadius = size * 0.12;
  const ringWidth = (maxRadius - innerRadius) / numRings;
  const gap = size * 0.01;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22d3ee', '#8b5cf6', '#10b981', '#ec4899', '#a855f7'];
  const fontSize = Math.max(8, size * 0.025);
  const isMobile = window.innerWidth < 768;
  data.forEach((d, i) => {
    const rInner = innerRadius + i * ringWidth + gap;
    const rOuter = innerRadius + (i + 1) * ringWidth;
    const color = colors[i % colors.length];
    const bgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(2 * Math.PI).cornerRadius(ringWidth / 2);
    svg.append('path').attr('d', bgArc).attr('fill', color).attr('opacity', 0.1);
    const endAngle = (d.value / 100) * 2 * Math.PI;
    const fgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(endAngle).cornerRadius(ringWidth / 2);
    svg.append('path').attr('fill', color).attr('d', fgArc).transition().duration(1200).ease(d3.easeCubicOut).attrTween('d', function() {
      const interpolate = d3.interpolate(0, endAngle);
      return function(t) {
        return d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(interpolate(t)).cornerRadius(ringWidth / 2)();
      };
    });
    if (!isMobile) {
      svg.append('text')
        .attr('x', 5)
        .attr('y', -(rInner + (ringWidth - gap) / 2))
        .attr('dy', '0.35em')
        .text(d.axis.substring(0, 3).toUpperCase())
        .attr('fill', '#fff')
        .attr('font-size', `${fontSize}px`)
        .attr('font-weight', 'bold')
        .attr('opacity', 0.8)
        .style('pointer-events', 'none');
    }
  });
}

function drawBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth < 768;
  // Reduced top margin to move bars up, increased bottom for angled labels on mobile
  const margin = { top: height * 0.06, right: width * 0.03, bottom: isMobile ? height * 0.18 : height * 0.12, left: width * 0.03 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'scatter-svg');
  const defs = svg.append('defs');
  const filter = defs.append('filter').attr('id', 'neon-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const x = d3.scaleBand().range([0, innerWidth]).domain(data.map(d => d.label)).paddingInner(0.6).paddingOuter(0.05);
  const maxValue = d3.max(data, d => d.value) || 0;
  // Reduced headroom above bars (1.02 instead of 1.05)
  const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, maxValue * 1.02]);
  const colorScale = d3.scaleLinear().domain([0, data.length - 1]).range(['#06b6d4', '#a855f7']).interpolate(d3.interpolateRgb);
  const uid = Date.now();
  data.forEach((d, i) => {
    const color = colorScale(i);
    const gradId = `bar-grad-${uid}-${i}`;
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.5);
    grad.append('stop').attr('offset', '70%').attr('stop-color', color).attr('stop-opacity', 0.1);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);
  });
  const barGroups = g.selectAll('.bar-group').data(data).enter().append('g').attr('class', 'bar-group');
  const barWidth = x.bandwidth();
  const radius = barWidth / 2;
  const strokeMain = Math.max(1, width * 0.008);
  const strokeGlow = Math.max(2, width * 0.015);
  // Font sizes - increased axis font size
  const fontSizeVal = isMobile ? Math.max(6, width * 0.016) : Math.max(14, width * 0.024);
  const fontSizeAxis = isMobile ? Math.max(6, width * 0.016) : Math.max(11, width * 0.02);
  
  // Helper to format player name: First initial + truncated last name (max 9 chars)
  function formatBarLabel(fullName) {
    const parts = fullName.split(' ');
    const firstInitial = parts[0]?.[0] ? `${parts[0][0]}.` : '';
    let lastName = parts.slice(1).join(' ');
    // Truncate last name to 9 characters max (including hyphens/spaces)
    if (lastName.length > 9) {
      lastName = lastName.substring(0, 9);
    }
    return `${firstInitial} ${lastName}`.trim();
  }
  
  // Outer glow rect
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeGlow).attr('stroke-opacity', 0.3).style('filter', 'url(#neon-glow)').transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  // Gradient fill rect
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', (d, i) => `url(#bar-grad-${uid}-${i})`).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  // Main stroke rect
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeMain).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  
  // Data labels ABOVE the bars (original position)
  barGroups.append('text').text(d => d.value.toFixed(1)).attr('x', d => x(d.label) + barWidth / 2).attr('y', innerHeight).attr('text-anchor', 'middle').attr('fill', (d, i) => colorScale(i)).attr('font-size', `${fontSizeVal}px`).attr('font-weight', '700').style('text-shadow', '0 0 10px rgba(0,0,0,1)').style('opacity', 0).transition().duration(1000).delay((d, i) => i * 50 + 400).attr('y', d => y(d.value) - (isMobile ? height * 0.02 : height * 0.02)).style('opacity', 1);
  
  // X-axis with formatted names at bottom
  const xAxis = g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSize(0).tickFormat((d, i) => formatBarLabel(d)));
  xAxis.selectAll('text')
    .style('text-anchor', isMobile ? 'end' : 'middle')
    .style('fill', (d, i) => colorScale(i))
    .style('font-size', `${fontSizeAxis}px`)
    .style('font-weight', '600')
    .attr('dx', isMobile ? '1.1em' : '0')
    .attr('dy', isMobile ? '1.1em' : '1.5em')
    .attr('transform', isMobile ? 'rotate(-45)' : 'rotate(0)');
  g.select('.domain').remove();
}

function drawScatterChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth < 768;
  // Tightened margins to reclaim space from removed tick marks (mobile-first)
  const margin = { top: isMobile ? 10 : height * 0.02, right: width * 0.05, bottom: isMobile ? 30 : height * 0.085, left: isMobile ? 30 : width * 0.055 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  
  // Add SVG filter definitions for iOS-compatible glow effects
  const defs = svg.append('defs');
  const glowColors = {
    qb: { color: '#ec4899', id: 'glow-qb' },
    rb: { color: '#10b981', id: 'glow-rb' },
    wr: { color: '#06b6d4', id: 'glow-wr' },
    te: { color: '#f97316', id: 'glow-te' }
  };
  Object.values(glowColors).forEach(({ color, id }) => {
    const filter = defs.append('filter')
      .attr('id', id)
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    filter.append('feDropShadow')
      .attr('dx', 0).attr('dy', 0)
      .attr('stdDeviation', 3)
      .attr('flood-color', color)
      .attr('flood-opacity', 0.8);
  });
  
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'scatter-tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
  const yDomain = [18, 44];
  const xDomain = [49.5, 104];
  const xTicks = [50, 60, 70, 80, 90, 100];
  const x = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);
  const y = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]);
  const xAxisGrid = d3.axisBottom(x).tickValues([60,70,80,90,100]).tickSize(-innerHeight).tickFormat('');
  const yAxisGrid = d3.axisLeft(y).tickValues([20, 25, 30, 35, 40]).tickSize(-innerWidth).tickFormat('');
  g.append('g').attr('class', 'scatter-grid').attr('transform', `translate(0,${innerHeight})`).call(xAxisGrid);
  g.append('g').attr('class', 'scatter-grid').call(yAxisGrid);

  const xAxis = d3.axisBottom(x)
    .tickValues(xTicks)
    .tickFormat(d => `${d}%`)
    .tickSize(0)
    .tickPadding(isMobile ? 6 : 8);
  const yAxis = d3.axisLeft(y)
    .tickValues([20, 25, 30, 35, 40])
    .tickSize(0)
    .tickPadding(isMobile ? 6 : 8);

  g.append('g')
    .attr('class', 'scatter-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', isMobile ? '8px' : '14px');

  g.append('g')
    .attr('class', 'scatter-axis')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', isMobile ? '8px' : '14px');

  const xLabelOffset = isMobile ? margin.bottom - 4 : margin.bottom - 1; // mobile: pull title up slightly; desktop unchanged
  const yLabelOffset = isMobile ? -(margin.left - 6) : -(margin.left - 14);

  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + xLabelOffset)
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .attr('font-size', isMobile ? '8px' : '16px')
    .attr('font-weight', 'bold')
    .attr('letter-spacing', '0.1em')
    .text('CONSISTENCY');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', yLabelOffset)
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .attr('font-size', isMobile ? '8px' : '16px')
    .attr('font-weight', 'bold')
    .attr('letter-spacing', '0.1em')
    .text('CEILING');
  
  // Calculate offsets for overlapping/nearby dots
  const dotRadius = isMobile ? 4.8 : 7;
  const minDistance = dotRadius * 2.2; // Minimum distance between dot centers to avoid overlap
  
  // Get initial positions for all dots
  const dotPositions = data.map((d, i) => ({
    index: i,
    cx: x(clamp(d.stats.csty, xDomain[0], xDomain[1])),
    cy: y(d.stats.ceiling),
    originalX: x(clamp(d.stats.csty, xDomain[0], xDomain[1])),
    originalY: y(d.stats.ceiling)
  }));
  
  // Collision detection and resolution - run multiple passes to separate overlapping dots
  const maxIterations = 15;
  for (let iter = 0; iter < maxIterations; iter++) {
    let moved = false;
    for (let i = 0; i < dotPositions.length; i++) {
      for (let j = i + 1; j < dotPositions.length; j++) {
        const dx = dotPositions[j].cx - dotPositions[i].cx;
        const dy = dotPositions[j].cy - dotPositions[i].cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance && distance > 0) {
          // Dots are overlapping - push them apart
          const overlap = minDistance - distance;
          const pushX = (dx / distance) * (overlap / 2);
          const pushY = (dy / distance) * (overlap / 2);
          
          dotPositions[i].cx -= pushX;
          dotPositions[i].cy -= pushY;
          dotPositions[j].cx += pushX;
          dotPositions[j].cy += pushY;
          moved = true;
        } else if (distance === 0) {
          // Exact same position - offset in a random direction
          const angle = Math.random() * Math.PI * 2;
          dotPositions[i].cx -= Math.cos(angle) * (minDistance / 2);
          dotPositions[i].cy -= Math.sin(angle) * (minDistance / 2);
          dotPositions[j].cx += Math.cos(angle) * (minDistance / 2);
          dotPositions[j].cy += Math.sin(angle) * (minDistance / 2);
          moved = true;
        }
      }
    }
    if (!moved) break; // No more overlaps
  }
  
  const circles = g.selectAll('.scatter-dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', d => `scatter-dot scatter-dot-${d.position.toLowerCase()}`)
    .attr('filter', d => `url(#glow-${d.position.toLowerCase()})`)
    .attr('cx', (d, i) => dotPositions[i].cx)
    .attr('cy', (d, i) => dotPositions[i].cy)
    .attr('r', 0)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 30)
    .ease(d3.easeBackOut)
    .attr('r', dotRadius)
    .selection();

  let activeTooltipId = null;

  function showTooltip(event, d) {
    const pageX = (event.touches ? event.touches[0].pageX : event.pageX);
    const pageY = (event.touches ? event.touches[0].pageY : event.pageY);
    const clRank = d.statRanks?.cl;
    const cstyRank = d.statRanks?.csty;
    const clRankTxt = Number.isFinite(clRank) ? ordinal(clRank) : 'NA';
    const cstyRankTxt = Number.isFinite(cstyRank) ? ordinal(cstyRank) : 'NA';
    const clColor = rankColor(clRank);
    const cstyColor = rankColor(cstyRank);
    tooltip.innerHTML = `
      <div><strong>${d.name}</strong> • ${d.position}</div>
      <div><strong>CL:</strong> <span style="color:${clColor}">${formatNum1(d.stats.ceiling)}</span> &middot; | &middot; <span style="color:${clColor}">${clRankTxt} (${d.position})</span></div>
      <div><strong>CSTY%:</strong> <span style="color:${cstyColor}">${formatPct1(d.stats.csty)}</span> &middot; | &middot; <span style="color:${cstyColor}">${cstyRankTxt} (${d.position})</span></div>
    `;
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.style.display = 'block';
    const ttWidth = tooltip.offsetWidth || 180;
    const ttHeight = tooltip.offsetHeight || 80;
    let left = pageX + 12;
    if (left + ttWidth > window.innerWidth - 8) {
      left = pageX - ttWidth - 12;
      if (left < 8) left = 8;
    }
    let top = pageY - ttHeight - 12;
    if (top < 8) top = pageY + 12;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.display = 'block';
    activeTooltipId = d.id;
  }
  function hideTooltip() { tooltip.style.display = 'none'; activeTooltipId = null; }

  circles.on('mouseenter', function(event,d){ if (!isMobile) showTooltip(event,d); })
         .on('mousemove', function(event,d){ if (!isMobile) showTooltip(event,d); })
         .on('mouseleave', function(){ if (!isMobile) hideTooltip(); })
         .on('click touchstart', function(event,d){
            if (!isMobile) return;
            event.preventDefault();
            // always show on tap; if same dot tapped again, toggle off
            if (activeTooltipId === d.id) {
              hideTooltip();
              return;
            }
            hideTooltip();
            showTooltip(event,d);
          });

  if (isMobile) {
    document.addEventListener('touchstart', (e) => {
      const target = e.target;
      const isDot = target.closest && target.closest('.scatter-dot');
      const isTooltip = target.closest && target.closest('.scatter-tooltip');
      if (!isDot && !isTooltip) hideTooltip();
    }, { passive: true });
  }
  const labels = g.selectAll('.scatter-label').data(data).enter().append('text').attr('class', 'scatter-label').attr('x', (d, i) => dotPositions[i].cx).attr('y', (d, i) => dotPositions[i].cy).text(d => {
    const parts = d.name.split(' ');
    const firstInitial = parts[0]?.[0] ? `${parts[0][0]}.` : '';
    let last = parts.slice(1).join(' ');
    if (parts.length >= 3) {
      const penultimate = parts[parts.length - 2];
      const lastWord = parts[parts.length - 1];
      if (/^[A-Za-z]{2,3}\.?$/.test(penultimate)) {
        last = `${penultimate} ${lastWord}`;
      } else {
        last = lastWord;
      }
    }
    return `${firstInitial} ${last}`.trim();
  }).attr('opacity', 0);

  if (isMobile) {
    labels.on('click touchstart', function(event,d){
      if (activeTooltipId === d.id) {
        hideTooltip();
        return;
      }
      hideTooltip();
      showTooltip(event,d);
    });
  }
  const labelNodes = data.map((d, i) => {
    const cx = dotPositions[i].cx;
    const cy = dotPositions[i].cy;
    return { ...d, fx: cx, fy: cy, x: cx, y: cy };
  });
  const sim = d3.forceSimulation(labelNodes)
    .force('anchorX', d3.forceX((d, i) => dotPositions[i].cx).strength(3))
    .force('anchorY', d3.forceY((d, i) => dotPositions[i].cy - 10).strength(3))
    .force('collide', d3.forceCollide(14))
    .stop();
  for (let i = 0; i < 60; ++i) sim.tick();
  labels.transition().duration(1000).delay((d, i) => i * 30 + 500).attr('x', (d, i) => labelNodes[i].x).attr('y', (d, i) => labelNodes[i].y).attr('opacity', 1);
}

// Initialize
window.initFantasyDashboard = function() {
  players = HP_DATA.map(normalizePlayer);
  // Ensure FPTS order from source stays dominant
  players.sort((a,b) => b.stats.fpts - a.stats.fpts);
  computePositionalRanks(players);
  if (!players.length) return;
  dashState.selectedPlayerId = players[0].id;
  renderSummary();
  renderCustomSelect();
  setupCustomSelect();
  renderSelectedDetails();
  renderRadar();
  renderBar();
  renderScatter();
  updateFilterButtons();
  wireEvents();
};

document.addEventListener('DOMContentLoaded', () => {
  window.initFantasyDashboard();
});
})();
