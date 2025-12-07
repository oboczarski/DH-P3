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
    "G": 13,
    "FPTS": 328.5,
    "PPG": 25.26923077,
    "CSTY%": 0.9230769231,
    "CL": 36.16666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1655,
    "IMP/G": 7.384615385,
    "SNP%": 0.8285385501,
    "YPC": 3.58,
    "TGT": 107,
    "REC": 85,
    "MTF/A": 0.388185654,
    "YCO/A": 1.46835443,
    "recYPG": 62.0,
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
    "G": 12,
    "FPTS": 297.6,
    "PPG": 24.8,
    "CSTY%": 0.8333333333,
    "CL": 40.4,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1586,
    "IMP/G": 6.416666667,
    "SNP%": 0.8447368421,
    "YPC": 5.67,
    "TGT": 40,
    "REC": 35,
    "MTF/A": 0.3584070796,
    "YCO/A": 2.920353982,
    "recYPG": 25.33333333,
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
    "G": 12,
    "FPTS": 282.18,
    "PPG": 23.515,
    "CSTY%": 0.8333333333,
    "CL": 37.42,
    "TS%": NaN,
    "paYPG": 236.0,
    "paRTG": 99.85,
    "CMP%": 0.6942857143,
    "TTT": 2.8974,
    "YDS(t)": 3241,
    "IMP/G": 14.08333333,
    "SNP%": 0.9698870765,
    "YPC": 5.24,
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
    "SLPR_ID": 4046,
    "NM": "Patrick Mahomes",
    "POS": "QB",
    "AGE": 30.0,
    "TM": "KC",
    "G": 12,
    "FPTS": 273.32,
    "PPG": 22.77666667,
    "CSTY%": 0.75,
    "CL": 29.54666667,
    "TS%": NaN,
    "paYPG": 269.8333333,
    "paRTG": 96.55,
    "CMP%": 0.6462585034,
    "TTT": 2.746984127,
    "YDS(t)": 3586,
    "IMP/G": 15.16666667,
    "SNP%": 0.9736842105,
    "YPC": 6.33,
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
    "G": 12,
    "FPTS": 270.6,
    "PPG": 22.55,
    "CSTY%": 0.75,
    "CL": 43.46666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1416,
    "IMP/G": 5.333333333,
    "SNP%": 0.6325459318,
    "YPC": 5.82,
    "TGT": 59,
    "REC": 51,
    "MTF/A": 0.3028571429,
    "YCO/A": 1.714285714,
    "recYPG": 33.08333333,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11564,
    "NM": "Drake Maye",
    "POS": "QB",
    "AGE": 23.1,
    "TM": "NE",
    "G": 13,
    "FPTS": 265.58,
    "PPG": 20.42923077,
    "CSTY%": 0.8461538462,
    "CL": 26.94,
    "TS%": NaN,
    "paYPG": 262.4615385,
    "paRTG": 111.88,
    "CMP%": 0.7150259067,
    "TTT": 2.899326425,
    "YDS(t)": 3733,
    "IMP/G": 14.15384615,
    "SNP%": 0.9810201661,
    "YPC": 3.94,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.1538461538,
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
    "G": 12,
    "FPTS": 259.3,
    "PPG": 21.60833333,
    "CSTY%": 0.9166666667,
    "CL": 31.5,
    "TS%": 0.338,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1373,
    "IMP/G": 5.083333333,
    "SNP%": 0.7418918919,
    "YPC": 6.17,
    "TGT": 111,
    "REC": 82,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 111.3333333,
    "YPRR": 4.241269841,
    "1DRR": 0.1650793651
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9509,
    "NM": "Bijan Robinson",
    "POS": "RB",
    "AGE": 23.7,
    "TM": "ATL",
    "G": 12,
    "FPTS": 254.9,
    "PPG": 21.24166667,
    "CSTY%": 0.8333333333,
    "CL": 32.13333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1589,
    "IMP/G": 5.666666667,
    "SNP%": 0.7864583333,
    "YPC": 5.1,
    "TGT": 68,
    "REC": 54,
    "MTF/A": 0.3487179487,
    "YCO/A": 2.543589744,
    "recYPG": 49.5,
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
    "G": 12,
    "FPTS": 254.4,
    "PPG": 21.2,
    "CSTY%": 1.0,
    "CL": 32.56666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1404,
    "IMP/G": 5.25,
    "SNP%": 0.7908309456,
    "YPC": 5.56,
    "TGT": 72,
    "REC": 54,
    "MTF/A": 0.3709677419,
    "YCO/A": 2.892473118,
    "recYPG": 30.83333333,
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
    "G": 12,
    "FPTS": 249.46,
    "PPG": 20.78833333,
    "CSTY%": 0.75,
    "CL": 28.42,
    "TS%": NaN,
    "paYPG": 209.5,
    "paRTG": 103.86,
    "CMP%": 0.6608187135,
    "TTT": 2.992573099,
    "YDS(t)": 2843,
    "IMP/G": 12.08333333,
    "SNP%": 0.9972375691,
    "YPC": 3.92,
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
    "G": 12,
    "FPTS": 248.84,
    "PPG": 20.73666667,
    "CSTY%": 0.75,
    "CL": 29.1,
    "TS%": NaN,
    "paYPG": 271.75,
    "paRTG": 102.4,
    "CMP%": 0.6933638444,
    "TTT": 2.809816934,
    "YDS(t)": 3385,
    "IMP/G": 14.16666667,
    "SNP%": 0.9770808203,
    "YPC": 3.02,
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
    "G": 12,
    "FPTS": 239.92,
    "PPG": 19.99333333,
    "CSTY%": 0.5833333333,
    "CL": 27.22666667,
    "TS%": NaN,
    "paYPG": 256.0833333,
    "paRTG": 111.74,
    "CMP%": 0.6633416459,
    "TTT": 2.756558603,
    "YDS(t)": 3063,
    "IMP/G": 13.33333333,
    "SNP%": 0.9960578187,
    "YPC": -0.4,
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
    "SLPR_ID": 8137,
    "NM": "George Pickens",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "DAL",
    "G": 12,
    "FPTS": 237.2,
    "PPG": 19.76666667,
    "CSTY%": 0.9166666667,
    "CL": 31.6,
    "TS%": 0.235,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1142,
    "IMP/G": 5.0,
    "SNP%": 0.8238841978,
    "YPC": 0.0,
    "TGT": 105,
    "REC": 73,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 95.16666667,
    "YPRR": 2.738609113,
    "1DRR": 0.1247002398
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5870,
    "NM": "Daniel Jones",
    "POS": "QB",
    "AGE": 28.3,
    "TM": "IND",
    "G": 12,
    "FPTS": 232.64,
    "PPG": 19.38666667,
    "CSTY%": 0.8333333333,
    "CL": 25.38,
    "TS%": NaN,
    "paYPG": 253.4166667,
    "paRTG": 101.34,
    "CMP%": 0.6790450928,
    "TTT": 2.705570292,
    "YDS(t)": 3201,
    "IMP/G": 13.66666667,
    "SNP%": 0.9736842105,
    "YPC": 3.64,
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
    "G": 12,
    "FPTS": 228.98,
    "PPG": 19.08166667,
    "CSTY%": 0.5,
    "CL": 28.84,
    "TS%": NaN,
    "paYPG": 236.8333333,
    "paRTG": 94.91,
    "CMP%": 0.6691919192,
    "TTT": 2.860227273,
    "YDS(t)": 3195,
    "IMP/G": 13.41666667,
    "SNP%": 0.9639751553,
    "YPC": 6.19,
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
    "SLPR_ID": 11560,
    "NM": "Caleb Williams",
    "POS": "QB",
    "AGE": 23.9,
    "TM": "CHI",
    "G": 12,
    "FPTS": 228.68,
    "PPG": 19.05666667,
    "CSTY%": 0.5833333333,
    "CL": 30.97333333,
    "TS%": NaN,
    "paYPG": 226.8333333,
    "paRTG": 88.17,
    "CMP%": 0.5808080808,
    "TTT": 3.179267677,
    "YDS(t)": 3050,
    "IMP/G": 12.58333333,
    "SNP%": 0.9867947179,
    "YPC": 5.02,
    "TGT": 2,
    "REC": 2,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 1.833333333,
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
    "G": 12,
    "FPTS": 223.9,
    "PPG": 18.65833333,
    "CSTY%": 0.9166666667,
    "CL": 28.2,
    "TS%": 0.254,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 879,
    "IMP/G": 3.916666667,
    "SNP%": 0.8982035928,
    "YPC": 0.0,
    "TGT": 118,
    "REC": 88,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 73.25,
    "YPRR": 1.931868132,
    "1DRR": 0.08571428571
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11563,
    "NM": "Bo Nix",
    "POS": "QB",
    "AGE": 25.6,
    "TM": "DEN",
    "G": 12,
    "FPTS": 223.58,
    "PPG": 18.63166667,
    "CSTY%": 0.5833333333,
    "CL": 30.49333333,
    "TS%": NaN,
    "paYPG": 228.5,
    "paRTG": 85.82,
    "CMP%": 0.6157407407,
    "TTT": 2.833263889,
    "YDS(t)": 2971,
    "IMP/G": 12.41666667,
    "SNP%": 0.9950062422,
    "YPC": 4.4,
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
    "G": 12,
    "FPTS": 223.4,
    "PPG": 18.61666667,
    "CSTY%": 0.75,
    "CL": 27.53333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1464,
    "IMP/G": 5.083333333,
    "SNP%": 0.5959849435,
    "YPC": 5.32,
    "TGT": 29,
    "REC": 27,
    "MTF/A": 0.2640692641,
    "YCO/A": 2.341991342,
    "recYPG": 19.66666667,
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
    "G": 11,
    "FPTS": 223.2,
    "PPG": 20.29090909,
    "CSTY%": 0.9090909091,
    "CL": 29.36666667,
    "TS%": 0.266,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1092,
    "IMP/G": 4.909090909,
    "SNP%": 0.7004341534,
    "YPC": 12.17,
    "TGT": 107,
    "REC": 86,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 92.63636364,
    "YPRR": 3.430976431,
    "1DRR": 0.1582491582
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7547,
    "NM": "Amon-Ra St. Brown",
    "POS": "WR",
    "AGE": 25.9,
    "TM": "DET",
    "G": 12,
    "FPTS": 218.3,
    "PPG": 18.19166667,
    "CSTY%": 0.75,
    "CL": 31.7,
    "TS%": 0.283,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 893,
    "IMP/G": 3.833333333,
    "SNP%": 0.8228346457,
    "YPC": 3.0,
    "TGT": 108,
    "REC": 75,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 73.66666667,
    "YPRR": 2.490140845,
    "1DRR": 0.1014084507
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3163,
    "NM": "Jared Goff",
    "POS": "QB",
    "AGE": 31.0,
    "TM": "DET",
    "G": 12,
    "FPTS": 216.6,
    "PPG": 18.05,
    "CSTY%": 0.5833333333,
    "CL": 26.46666667,
    "TS%": NaN,
    "paYPG": 252.0833333,
    "paRTG": 110.16,
    "CMP%": 0.6984126984,
    "TTT": 2.730978836,
    "YDS(t)": 3071,
    "IMP/G": 12.66666667,
    "SNP%": 0.9790026247,
    "YPC": 3.54,
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
    "G": 11,
    "FPTS": 211.7,
    "PPG": 19.24545455,
    "CSTY%": 0.6363636364,
    "CL": 34.53333333,
    "TS%": 0.287,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 977,
    "IMP/G": 4.363636364,
    "SNP%": 0.9559659091,
    "YPC": 3.0,
    "TGT": 131,
    "REC": 86,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 88.27272727,
    "YPRR": 2.274004684,
    "1DRR": 0.1007025761
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7523,
    "NM": "Trevor Lawrence",
    "POS": "QB",
    "AGE": 26.0,
    "TM": "JAX",
    "G": 12,
    "FPTS": 207.94,
    "PPG": 17.32833333,
    "CSTY%": 0.6666666667,
    "CL": 23.7,
    "TS%": NaN,
    "paYPG": 219.6666667,
    "paRTG": 81.58,
    "CMP%": 0.5974683544,
    "TTT": 2.825164557,
    "YDS(t)": 2871,
    "IMP/G": 12.75,
    "SNP%": 0.9866504854,
    "YPC": 4.12,
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
    "G": 12,
    "FPTS": 204.9,
    "PPG": 17.075,
    "CSTY%": 0.75,
    "CL": 24.23333333,
    "TS%": 0.246,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 689,
    "IMP/G": 3.666666667,
    "SNP%": 0.7516425756,
    "YPC": 0.0,
    "TGT": 99,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 57.41666667,
    "YPRR": 1.919220056,
    "1DRR": 0.08356545961
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4892,
    "NM": "Baker Mayfield",
    "POS": "QB",
    "AGE": 30.4,
    "TM": "TB",
    "G": 12,
    "FPTS": 203.3,
    "PPG": 16.94166667,
    "CSTY%": 0.6666666667,
    "CL": 24.05333333,
    "TS%": NaN,
    "paYPG": 216.6666667,
    "paRTG": 93.38,
    "CMP%": 0.6279069767,
    "TTT": 2.840671835,
    "YDS(t)": 2843,
    "IMP/G": 11.25,
    "SNP%": 0.9558638083,
    "YPC": 6.57,
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
    "SLPR_ID": 6804,
    "NM": "Jordan Love",
    "POS": "QB",
    "AGE": 26.9,
    "TM": "GB",
    "G": 12,
    "FPTS": 201.16,
    "PPG": 16.76333333,
    "CSTY%": 0.4166666667,
    "CL": 26.78,
    "TS%": NaN,
    "paYPG": 232.8333333,
    "paRTG": 104.28,
    "CMP%": 0.6703601108,
    "TTT": 2.889252078,
    "YDS(t)": 2958,
    "IMP/G": 12.08333333,
    "SNP%": 0.9829396325,
    "YPC": 4.0,
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
    "SLPR_ID": 7588,
    "NM": "Javonte Williams",
    "POS": "RB",
    "AGE": 25.4,
    "TM": "DAL",
    "G": 12,
    "FPTS": 195.3,
    "PPG": 16.275,
    "CSTY%": 0.75,
    "CL": 24.1,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1083,
    "IMP/G": 4.75,
    "SNP%": 0.7551266586,
    "YPC": 4.82,
    "TGT": 42,
    "REC": 31,
    "MTF/A": 0.2777777778,
    "YCO/A": 2.550505051,
    "recYPG": 10.66666667,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5850,
    "NM": "Josh Jacobs",
    "POS": "RB",
    "AGE": 27.6,
    "TM": "GB",
    "G": 11,
    "FPTS": 190.6,
    "PPG": 17.32727273,
    "CSTY%": 0.8181818182,
    "CL": 27.9,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 976,
    "IMP/G": 4.545454545,
    "SNP%": 0.6307471264,
    "YPC": 3.93,
    "TGT": 36,
    "REC": 29,
    "MTF/A": 0.2849462366,
    "YCO/A": 2.252688172,
    "recYPG": 22.27272727,
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
    "G": 12,
    "FPTS": 185.2,
    "PPG": 15.43333333,
    "CSTY%": 0.6666666667,
    "CL": 24.23333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1052,
    "IMP/G": 5.083333333,
    "SNP%": 0.7082785808,
    "YPC": 4.74,
    "TGT": 33,
    "REC": 24,
    "MTF/A": 0.2732240437,
    "YCO/A": 1.830601093,
    "recYPG": 15.33333333,
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
    "G": 13,
    "FPTS": 183.3,
    "PPG": 14.1,
    "CSTY%": 0.3846153846,
    "CL": 31.46666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1183,
    "IMP/G": 4.461538462,
    "SNP%": 0.5496453901,
    "YPC": 4.84,
    "TGT": 36,
    "REC": 29,
    "MTF/A": 0.234375,
    "YCO/A": 2.197916667,
    "recYPG": 19.53846154,
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
    "G": 12,
    "FPTS": 179.8,
    "PPG": 14.98333333,
    "CSTY%": 0.75,
    "CL": 21.4,
    "TS%": 0.27,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 778,
    "IMP/G": 2.833333333,
    "SNP%": 0.834378921,
    "YPC": -3.0,
    "TGT": 115,
    "REC": 73,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 65.08333333,
    "YPRR": 1.85952381,
    "1DRR": 0.06904761905
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12527,
    "NM": "Ashton Jeanty",
    "POS": "RB",
    "AGE": 21.8,
    "TM": "LV",
    "G": 12,
    "FPTS": 177.6,
    "PPG": 14.8,
    "CSTY%": 0.6666666667,
    "CL": 26.06666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 886,
    "IMP/G": 3.5,
    "SNP%": 0.7548209366,
    "YPC": 3.51,
    "TGT": 54,
    "REC": 43,
    "MTF/A": 0.3756906077,
    "YCO/A": 2.270718232,
    "recYPG": 20.91666667,
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
    "G": 12,
    "FPTS": 177.42,
    "PPG": 14.785,
    "CSTY%": 0.5833333333,
    "CL": 25.61333333,
    "TS%": NaN,
    "paYPG": 242.75,
    "paRTG": 103.07,
    "CMP%": 0.6820987654,
    "TTT": 2.838765432,
    "YDS(t)": 2962,
    "IMP/G": 11.0,
    "SNP%": 0.9594594595,
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
    "SLPR_ID": 3198,
    "NM": "Derrick Henry",
    "POS": "RB",
    "AGE": 31.7,
    "TM": "BAL",
    "G": 12,
    "FPTS": 177.3,
    "PPG": 14.775,
    "CSTY%": 0.5833333333,
    "CL": 24.06666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1073,
    "IMP/G": 4.083333333,
    "SNP%": 0.547116737,
    "YPC": 4.73,
    "TGT": 18,
    "REC": 14,
    "MTF/A": 0.1827411168,
    "YCO/A": 2.081218274,
    "recYPG": 11.83333333,
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
    "TS%": 0.245,
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
    "SLPR_ID": 12508,
    "NM": "Jaxson Dart",
    "POS": "QB",
    "AGE": 22.4,
    "TM": "NYG",
    "G": 10,
    "FPTS": 176.94,
    "PPG": 17.694,
    "CSTY%": 0.7,
    "CL": 27.64666667,
    "TS%": NaN,
    "paYPG": 155.6,
    "paRTG": 94.12,
    "CMP%": 0.6359649123,
    "TTT": 2.859736842,
    "YDS(t)": 1893,
    "IMP/G": 9.4,
    "SNP%": 0.702739726,
    "YPC": 5.52,
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
    "SLPR_ID": 12526,
    "NM": "Tetairoa McMillan",
    "POS": "WR",
    "AGE": 22.5,
    "TM": "CAR",
    "G": 13,
    "FPTS": 175.6,
    "PPG": 13.50769231,
    "CSTY%": 0.3846153846,
    "CL": 22.6,
    "TS%": 0.245,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 826,
    "IMP/G": 3.538461538,
    "SNP%": 0.8758865248,
    "YPC": 0.0,
    "TGT": 98,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.53846154,
    "YPRR": 2.024509804,
    "1DRR": 0.09803921569
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8126,
    "NM": "Wan'Dale Robinson",
    "POS": "WR",
    "AGE": 24.7,
    "TM": "NYG",
    "G": 13,
    "FPTS": 174.0,
    "PPG": 13.38461538,
    "CSTY%": 0.4615384615,
    "CL": 26.4,
    "TS%": 0.266,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 830,
    "IMP/G": 2.461538462,
    "SNP%": 0.9083710407,
    "YPC": 1.0,
    "TGT": 110,
    "REC": 73,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.69230769,
    "YPRR": 2.004842615,
    "1DRR": 0.06779661017
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12514,
    "NM": "Emeka Egbuka",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "TB",
    "G": 12,
    "FPTS": 170.0,
    "PPG": 14.16666667,
    "CSTY%": 0.5,
    "CL": 26.13333333,
    "TS%": 0.251,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 800,
    "IMP/G": 2.416666667,
    "SNP%": 0.8360655738,
    "YPC": 4.5,
    "TGT": 101,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 65.91666667,
    "YPRR": 2.043927649,
    "1DRR": 0.05943152455
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4866,
    "NM": "Saquon Barkley",
    "POS": "RB",
    "AGE": 28.6,
    "TM": "PHI",
    "G": 12,
    "FPTS": 168.9,
    "PPG": 14.075,
    "CSTY%": 0.5833333333,
    "CL": 23.2,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 999,
    "IMP/G": 3.25,
    "SNP%": 0.7997237569,
    "YPC": 3.74,
    "TGT": 43,
    "REC": 35,
    "MTF/A": 0.2272727273,
    "YCO/A": 1.434343434,
    "recYPG": 21.58333333,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7543,
    "NM": "Travis Etienne",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "JAX",
    "G": 12,
    "FPTS": 168.6,
    "PPG": 14.05,
    "CSTY%": 0.5833333333,
    "CL": 19.8,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1016,
    "IMP/G": 3.583333333,
    "SNP%": 0.5776699029,
    "YPC": 4.66,
    "TGT": 38,
    "REC": 25,
    "MTF/A": 0.2817679558,
    "YCO/A": 2.408839779,
    "recYPG": 14.41666667,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9228,
    "NM": "Bryce Young",
    "POS": "QB",
    "AGE": 24.2,
    "TM": "CAR",
    "G": 12,
    "FPTS": 168.58,
    "PPG": 14.04833333,
    "CSTY%": 0.3333333333,
    "CL": 25.56,
    "TS%": NaN,
    "paYPG": 194.75,
    "paRTG": 87.91,
    "CMP%": 0.6336088154,
    "TTT": 2.784435262,
    "YDS(t)": 2458,
    "IMP/G": 10.91666667,
    "SNP%": 0.9541401274,
    "YPC": 3.78,
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
    "G": 12,
    "FPTS": 168.46,
    "PPG": 14.03833333,
    "CSTY%": 0.5833333333,
    "CL": 23.28666667,
    "TS%": NaN,
    "paYPG": 0.3333333333,
    "paRTG": 122.92,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 1147,
    "IMP/G": 4.833333333,
    "SNP%": 0.6528150134,
    "YPC": 4.46,
    "TGT": 39,
    "REC": 30,
    "MTF/A": 0.2245989305,
    "YCO/A": 2.048128342,
    "recYPG": 25.75,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7569,
    "NM": "Nico Collins",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "HOU",
    "G": 11,
    "FPTS": 168.0,
    "PPG": 15.27272727,
    "CSTY%": 0.6363636364,
    "CL": 23.06666667,
    "TS%": 0.222,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 810,
    "IMP/G": 3.363636364,
    "SNP%": 0.7731543624,
    "YPC": 7.5,
    "TGT": 95,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 72.27272727,
    "YPRR": 2.345132743,
    "1DRR": 0.09439528024
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9224,
    "NM": "Chase Brown",
    "POS": "RB",
    "AGE": 25.5,
    "TM": "CIN",
    "G": 12,
    "FPTS": 167.1,
    "PPG": 13.925,
    "CSTY%": 0.5833333333,
    "CL": 21.13333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 991,
    "IMP/G": 4.083333333,
    "SNP%": 0.6879063719,
    "YPC": 4.4,
    "TGT": 64,
    "REC": 48,
    "MTF/A": 0.28125,
    "YCO/A": 2.225,
    "recYPG": 23.91666667,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6819,
    "NM": "Michael Pittman",
    "POS": "WR",
    "AGE": 28.0,
    "TM": "IND",
    "G": 12,
    "FPTS": 166.0,
    "PPG": 13.83333333,
    "CSTY%": 0.6666666667,
    "CL": 21.6,
    "TS%": 0.215,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 620,
    "IMP/G": 3.083333333,
    "SNP%": 0.8394736842,
    "YPC": 0.0,
    "TGT": 82,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 51.66666667,
    "YPRR": 1.751412429,
    "1DRR": 0.08474576271
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1466,
    "NM": "Travis Kelce",
    "POS": "TE",
    "AGE": 36.0,
    "TM": "KC",
    "G": 12,
    "FPTS": 163.0,
    "PPG": 13.58333333,
    "CSTY%": 0.5833333333,
    "CL": 21.7,
    "TS%": 0.177,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 720,
    "IMP/G": 3.083333333,
    "SNP%": 0.7846889952,
    "YPC": 1.0,
    "TGT": 78,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 59.91666667,
    "YPRR": 1.917333333,
    "1DRR": 0.08533333333
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5859,
    "NM": "A.J. Brown",
    "POS": "WR",
    "AGE": 28.2,
    "TM": "PHI",
    "G": 11,
    "FPTS": 161.9,
    "PPG": 14.71818182,
    "CSTY%": 0.4545454545,
    "CL": 29.43333333,
    "TS%": 0.254,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 699,
    "IMP/G": 2.818181818,
    "SNP%": 0.9220389805,
    "YPC": 0.0,
    "TGT": 87,
    "REC": 56,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.54545455,
    "YPRR": 2.144171779,
    "1DRR": 0.07668711656
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8110,
    "NM": "Jake Ferguson",
    "POS": "TE",
    "AGE": 26.7,
    "TM": "DAL",
    "G": 12,
    "FPTS": 159.7,
    "PPG": 13.30833333,
    "CSTY%": 0.6666666667,
    "CL": 22.33333333,
    "TS%": 0.186,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 497,
    "IMP/G": 2.083333333,
    "SNP%": 0.687575392,
    "YPC": 1.0,
    "TGT": 83,
    "REC": 70,
    "MTF/A": NaN,
    "YCO/A": 1.0,
    "recYPG": 41.33333333,
    "YPRR": 1.471810089,
    "1DRR": 0.05341246291
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7526,
    "NM": "Jaylen Waddle",
    "POS": "WR",
    "AGE": 26.8,
    "TM": "MIA",
    "G": 12,
    "FPTS": 158.52,
    "PPG": 13.21,
    "CSTY%": 0.5833333333,
    "CL": 21.1,
    "TS%": 0.224,
    "paYPG": 0.6666666667,
    "paRTG": 100.0,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 770,
    "IMP/G": 3.166666667,
    "SNP%": 0.823782235,
    "YPC": 0.0,
    "TGT": 79,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.5,
    "YPRR": 2.434504792,
    "1DRR": 0.1054313099
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7525,
    "NM": "DeVonta Smith",
    "POS": "WR",
    "AGE": 26.9,
    "TM": "PHI",
    "G": 12,
    "FPTS": 158.2,
    "PPG": 13.18333333,
    "CSTY%": 0.5,
    "CL": 24.23333333,
    "TS%": 0.251,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 802,
    "IMP/G": 2.833333333,
    "SNP%": 0.9226519337,
    "YPC": 0.0,
    "TGT": 86,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.83333333,
    "YPRR": 2.221606648,
    "1DRR": 0.08587257618
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6790,
    "NM": "D'Andre Swift",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "CHI",
    "G": 11,
    "FPTS": 158.1,
    "PPG": 14.37272727,
    "CSTY%": 0.6363636364,
    "CL": 22.36666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1011,
    "IMP/G": 4.818181818,
    "SNP%": 0.5816733068,
    "YPC": 4.84,
    "TGT": 36,
    "REC": 25,
    "MTF/A": 0.2125,
    "YCO/A": 1.93125,
    "recYPG": 21.54545455,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4881,
    "NM": "Lamar Jackson",
    "POS": "QB",
    "AGE": 28.7,
    "TM": "BAL",
    "G": 9,
    "FPTS": 158.04,
    "PPG": 17.56,
    "CSTY%": 0.5555555556,
    "CL": 27.56,
    "TS%": NaN,
    "paYPG": 204.5555556,
    "paRTG": 104.52,
    "CMP%": 0.6475770925,
    "TTT": 2.912863436,
    "YDS(t)": 2105,
    "IMP/G": 11.11111111,
    "SNP%": 0.9640151515,
    "YPC": 5.08,
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
    "SLPR_ID": 1373,
    "NM": "Geno Smith",
    "POS": "QB",
    "AGE": 35.0,
    "TM": "LV",
    "G": 12,
    "FPTS": 157.68,
    "PPG": 13.14,
    "CSTY%": 0.25,
    "CL": 23.93333333,
    "TS%": NaN,
    "paYPG": 211.0,
    "paRTG": 84.0,
    "CMP%": 0.6728723404,
    "TTT": 2.79731383,
    "YDS(t)": 2636,
    "IMP/G": 11.5,
    "SNP%": 0.9903581267,
    "YPC": 2.67,
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
    "G": 12,
    "FPTS": 157.0,
    "PPG": 13.08333333,
    "CSTY%": 0.6666666667,
    "CL": 18.16666667,
    "TS%": 0.204,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 690,
    "IMP/G": 2.916666667,
    "SNP%": 0.8289473684,
    "YPC": 1.2,
    "TGT": 78,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": 0.4,
    "recYPG": 57.0,
    "YPRR": 2.079027356,
    "1DRR": 0.08814589666
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11635,
    "NM": "Ladd McConkey",
    "POS": "WR",
    "AGE": 23.9,
    "TM": "LAC",
    "G": 12,
    "FPTS": 156.3,
    "PPG": 13.025,
    "CSTY%": 0.5833333333,
    "CL": 21.5,
    "TS%": 0.22,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 683,
    "IMP/G": 2.583333333,
    "SNP%": 0.7714285714,
    "YPC": 0.0,
    "TGT": 90,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.91666667,
    "YPRR": 1.733502538,
    "1DRR": 0.06598984772
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
    "SNP%": 0.8033573141,
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
    "SLPR_ID": 96,
    "NM": "Aaron Rodgers",
    "POS": "QB",
    "AGE": 41.8,
    "TM": "PIT",
    "G": 11,
    "FPTS": 155.04,
    "PPG": 14.09454545,
    "CSTY%": 0.3636363636,
    "CL": 22.57333333,
    "TS%": NaN,
    "paYPG": 189.6363636,
    "paRTG": 95.44,
    "CMP%": 0.6516129032,
    "TTT": 2.670419355,
    "YDS(t)": 2112,
    "IMP/G": 8.181818182,
    "SNP%": 0.9345047923,
    "YPC": 1.73,
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
    "G": 12,
    "FPTS": 154.3,
    "PPG": 12.85833333,
    "CSTY%": 0.5833333333,
    "CL": 19.53333333,
    "TS%": 0.286,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 803,
    "IMP/G": 2.833333333,
    "SNP%": 0.9642857143,
    "YPC": 4.0,
    "TGT": 105,
    "REC": 62,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.58333333,
    "YPRR": 2.002506266,
    "1DRR": 0.08020050125
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5045,
    "NM": "Courtland Sutton",
    "POS": "WR",
    "AGE": 30.0,
    "TM": "DEN",
    "G": 12,
    "FPTS": 153.1,
    "PPG": 12.75833333,
    "CSTY%": 0.5,
    "CL": 20.33333333,
    "TS%": 0.185,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 711,
    "IMP/G": 2.916666667,
    "SNP%": 0.8739076155,
    "YPC": 0.0,
    "TGT": 80,
    "REC": 50,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.25,
    "YPRR": 1.729927007,
    "1DRR": 0.07299270073
  },
  {
    "SZN": 2025,
    "SLPR_ID": 2449,
    "NM": "Stefon Diggs",
    "POS": "WR",
    "AGE": 31.8,
    "TM": "NE",
    "G": 13,
    "FPTS": 152.5,
    "PPG": 11.73076923,
    "CSTY%": 0.4615384615,
    "CL": 20.06666667,
    "TS%": 0.204,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 705,
    "IMP/G": 2.846153846,
    "SNP%": 0.5409252669,
    "YPC": 0.0,
    "TGT": 79,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 54.23076923,
    "YPRR": 2.465034965,
    "1DRR": 0.1188811189
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5872,
    "NM": "Deebo Samuel",
    "POS": "WR",
    "AGE": 29.7,
    "TM": "WAS",
    "G": 11,
    "FPTS": 152.3,
    "PPG": 13.84545455,
    "CSTY%": 0.5454545455,
    "CL": 22.3,
    "TS%": 0.21,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 583,
    "IMP/G": 2.272727273,
    "SNP%": 0.7355021216,
    "YPC": 3.77,
    "TGT": 75,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.54545455,
    "YPRR": 1.886925795,
    "1DRR": 0.06007067138
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6768,
    "NM": "Tua Tagovailoa",
    "POS": "QB",
    "AGE": 27.6,
    "TM": "MIA",
    "G": 12,
    "FPTS": 149.4,
    "PPG": 12.45,
    "CSTY%": 0.25,
    "CL": 22.18,
    "TS%": NaN,
    "paYPG": 190.0,
    "paRTG": 85.91,
    "CMP%": 0.671641791,
    "TTT": 2.601253731,
    "YDS(t)": 2322,
    "IMP/G": 10.0,
    "SNP%": 0.9598853868,
    "YPC": 2.33,
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
    "SLPR_ID": 12529,
    "NM": "TreVeyon Henderson",
    "POS": "RB",
    "AGE": 22.9,
    "TM": "NE",
    "G": 13,
    "FPTS": 148.4,
    "PPG": 11.41538462,
    "CSTY%": 0.3076923077,
    "CL": 24.33333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 824,
    "IMP/G": 3.0,
    "SNP%": 0.4792408066,
    "YPC": 4.84,
    "TGT": 38,
    "REC": 32,
    "MTF/A": 0.3410852713,
    "YCO/A": 2.426356589,
    "recYPG": 15.30769231,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1479,
    "NM": "Keenan Allen",
    "POS": "WR",
    "AGE": 33.4,
    "TM": "LAC",
    "G": 12,
    "FPTS": 146.2,
    "PPG": 12.18333333,
    "CSTY%": 0.3333333333,
    "CL": 22.73333333,
    "TS%": 0.222,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 622,
    "IMP/G": 3.25,
    "SNP%": 0.5664596273,
    "YPC": 0.0,
    "TGT": 91,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 51.83333333,
    "YPRR": 1.94375,
    "1DRR": 0.109375
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11620,
    "NM": "Rome Odunze",
    "POS": "WR",
    "AGE": 23.3,
    "TM": "CHI",
    "G": 12,
    "FPTS": 146.1,
    "PPG": 12.175,
    "CSTY%": 0.5,
    "CL": 23.6,
    "TS%": 0.224,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 661,
    "IMP/G": 3.083333333,
    "SNP%": 0.8799519808,
    "YPC": 0.0,
    "TGT": 90,
    "REC": 44,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 55.08333333,
    "YPRR": 1.734908136,
    "1DRR": 0.0813648294
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12512,
    "NM": "Quinshon Judkins",
    "POS": "RB",
    "AGE": 21.9,
    "TM": "CLE",
    "G": 11,
    "FPTS": 145.6,
    "PPG": 13.23636364,
    "CSTY%": 0.5454545455,
    "CL": 21.53333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 846,
    "IMP/G": 4.545454545,
    "SNP%": 0.5007032349,
    "YPC": 3.87,
    "TGT": 23,
    "REC": 17,
    "MTF/A": 0.2091836735,
    "YCO/A": 2.37244898,
    "recYPG": 8.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8148,
    "NM": "Jameson Williams",
    "POS": "WR",
    "AGE": 24.5,
    "TM": "DET",
    "G": 12,
    "FPTS": 145.1,
    "PPG": 12.09166667,
    "CSTY%": 0.5,
    "CL": 23.5,
    "TS%": 0.165,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 711,
    "IMP/G": 2.666666667,
    "SNP%": 0.8989501312,
    "YPC": 1.0,
    "TGT": 63,
    "REC": 38,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 58.83333333,
    "YPRR": 1.829015544,
    "1DRR": 0.06735751295
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8228,
    "NM": "Jaylen Warren",
    "POS": "RB",
    "AGE": 26.9,
    "TM": "PIT",
    "G": 11,
    "FPTS": 143.7,
    "PPG": 13.06363636,
    "CSTY%": 0.6363636364,
    "CL": 18.03333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 867,
    "IMP/G": 4.545454545,
    "SNP%": 0.5395348837,
    "YPC": 4.23,
    "TGT": 32,
    "REC": 27,
    "MTF/A": 0.3841059603,
    "YCO/A": 2.490066225,
    "recYPG": 20.72727273,
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
    "SNP%": 0.7400295421,
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
    "SLPR_ID": 6786,
    "NM": "CeeDee Lamb",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "DAL",
    "G": 9,
    "FPTS": 143.6,
    "PPG": 15.95555556,
    "CSTY%": 0.7777777778,
    "CL": 22.13333333,
    "TS%": 0.182,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 746,
    "IMP/G": 3.222222222,
    "SNP%": 0.7426356589,
    "YPC": 2.0,
    "TGT": 81,
    "REC": 51,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 82.66666667,
    "YPRR": 2.601398601,
    "1DRR": 0.09090909091
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9997,
    "NM": "Zay Flowers",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "BAL",
    "G": 12,
    "FPTS": 142.9,
    "PPG": 11.90833333,
    "CSTY%": 0.5,
    "CL": 19.13333333,
    "TS%": 0.265,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 809,
    "IMP/G": 2.75,
    "SNP%": 0.8734177215,
    "YPC": 5.25,
    "TGT": 84,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.91666667,
    "YPRR": 2.331306991,
    "1DRR": 0.09118541033
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5846,
    "NM": "DK Metcalf",
    "POS": "WR",
    "AGE": 27.8,
    "TM": "PIT",
    "G": 12,
    "FPTS": 142.7,
    "PPG": 11.89166667,
    "CSTY%": 0.5,
    "CL": 19.86666667,
    "TS%": 0.207,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 617,
    "IMP/G": 2.583333333,
    "SNP%": 0.88252149,
    "YPC": 6.0,
    "TGT": 75,
    "REC": 45,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 50.41666667,
    "YPRR": 1.694677871,
    "1DRR": 0.0700280112
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
    "TS%": 0.153,
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
    "SLPR_ID": 11604,
    "NM": "Brock Bowers",
    "POS": "TE",
    "AGE": 22.8,
    "TM": "LV",
    "G": 9,
    "FPTS": 138.5,
    "PPG": 15.38888889,
    "CSTY%": 0.5555555556,
    "CL": 26.96666667,
    "TS%": 0.179,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 575,
    "IMP/G": 3.111111111,
    "SNP%": 0.8256227758,
    "YPC": 1.0,
    "TGT": 68,
    "REC": 49,
    "MTF/A": NaN,
    "YCO/A": 1.5,
    "recYPG": 63.66666667,
    "YPRR": 2.003496503,
    "1DRR": 0.08041958042
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7527,
    "NM": "Mac Jones",
    "POS": "QB",
    "AGE": 27.1,
    "TM": "SF",
    "G": 10,
    "FPTS": 136.34,
    "PPG": 13.634,
    "CSTY%": 0.4,
    "CL": 22.66666667,
    "TS%": NaN,
    "paYPG": 215.1,
    "paRTG": 97.4,
    "CMP%": 0.6955017301,
    "TTT": 2.715017301,
    "YDS(t)": 2214,
    "IMP/G": 11.8,
    "SNP%": 0.6248561565,
    "YPC": 1.91,
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
    "SLPR_ID": 9758,
    "NM": "C.J. Stroud",
    "POS": "QB",
    "AGE": 24.0,
    "TM": "HOU",
    "G": 9,
    "FPTS": 136.02,
    "PPG": 15.11333333,
    "CSTY%": 0.3333333333,
    "CL": 23.3,
    "TS%": NaN,
    "paYPG": 219.7777778,
    "paRTG": 91.1,
    "CMP%": 0.6606498195,
    "TTT": 2.776101083,
    "YDS(t)": 2167,
    "IMP/G": 11.66666667,
    "SNP%": 0.8969404187,
    "YPC": 6.3,
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
    "G": 13,
    "FPTS": 136.0,
    "PPG": 10.46153846,
    "CSTY%": 0.3076923077,
    "CL": 21.8,
    "TS%": 0.178,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 610,
    "IMP/G": 2.538461538,
    "SNP%": 0.8149466192,
    "YPC": 0.0,
    "TGT": 69,
    "REC": 45,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.92307692,
    "YPRR": 1.837349398,
    "1DRR": 0.0843373494
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11627,
    "NM": "Troy Franklin",
    "POS": "WR",
    "AGE": 22.6,
    "TM": "DEN",
    "G": 12,
    "FPTS": 135.9,
    "PPG": 11.325,
    "CSTY%": 0.4166666667,
    "CL": 21.96666667,
    "TS%": 0.194,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 539,
    "IMP/G": 2.25,
    "SNP%": 0.6529338327,
    "YPC": 2.25,
    "TGT": 84,
    "REC": 48,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.16666667,
    "YPRR": 1.50997151,
    "1DRR": 0.05698005698
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8151,
    "NM": "Kenneth Walker III",
    "POS": "RB",
    "AGE": 24.9,
    "TM": "SEA",
    "G": 12,
    "FPTS": 134.8,
    "PPG": 11.23333333,
    "CSTY%": 0.4166666667,
    "CL": 18.96666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 908,
    "IMP/G": 3.583333333,
    "SNP%": 0.4743243243,
    "YPC": 4.58,
    "TGT": 23,
    "REC": 20,
    "MTF/A": 0.31875,
    "YCO/A": 1.80625,
    "recYPG": 14.58333333,
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
    "G": 12,
    "FPTS": 134.5,
    "PPG": 11.20833333,
    "CSTY%": 0.25,
    "CL": 26.36666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 615,
    "IMP/G": 2.916666667,
    "SNP%": 0.4627507163,
    "YPC": 4.68,
    "TGT": 51,
    "REC": 44,
    "MTF/A": 0.3026315789,
    "YCO/A": 1.815789474,
    "recYPG": 21.58333333,
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
    "G": 11,
    "FPTS": 133.2,
    "PPG": 12.10909091,
    "CSTY%": 0.4545454545,
    "CL": 21.53333333,
    "TS%": 0.166,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 532,
    "IMP/G": 1.818181818,
    "SNP%": 0.7867746289,
    "YPC": 3.5,
    "TGT": 69,
    "REC": 40,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 47.72727273,
    "YPRR": 1.454293629,
    "1DRR": 0.03601108033
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10213,
    "NM": "Tre Tucker",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "LV",
    "G": 12,
    "FPTS": 132.6,
    "PPG": 11.05,
    "CSTY%": 0.3333333333,
    "CL": 23.0,
    "TS%": 0.177,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 586,
    "IMP/G": 2.083333333,
    "SNP%": 0.9393939394,
    "YPC": 6.0,
    "TGT": 67,
    "REC": 44,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.83333333,
    "YPRR": 1.358024691,
    "1DRR": 0.04938271605
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8121,
    "NM": "Romeo Doubs",
    "POS": "WR",
    "AGE": 25.5,
    "TM": "GB",
    "G": 12,
    "FPTS": 131.2,
    "PPG": 10.93333333,
    "CSTY%": 0.3333333333,
    "CL": 19.7,
    "TS%": 0.195,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 542,
    "IMP/G": 2.666666667,
    "SNP%": 0.8070866142,
    "YPC": 0.0,
    "TGT": 71,
    "REC": 45,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.16666667,
    "YPRR": 1.77124183,
    "1DRR": 0.08823529412
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10229,
    "NM": "Rashee Rice",
    "POS": "WR",
    "AGE": 25.4,
    "TM": "KC",
    "G": 6,
    "FPTS": 130.6,
    "PPG": 21.76666667,
    "CSTY%": 0.8333333333,
    "CL": 26.33333333,
    "TS%": 0.134,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 506,
    "IMP/G": 4.666666667,
    "SNP%": 0.7081447964,
    "YPC": 4.0,
    "TGT": 59,
    "REC": 42,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 81.0,
    "YPRR": 2.67032967,
    "1DRR": 0.1153846154
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5892,
    "NM": "David Montgomery",
    "POS": "RB",
    "AGE": 28.3,
    "TM": "DET",
    "G": 12,
    "FPTS": 129.52,
    "PPG": 10.79333333,
    "CSTY%": 0.3333333333,
    "CL": 20.24,
    "TS%": NaN,
    "paYPG": 0.25,
    "paRTG": 95.83,
    "CMP%": 0.5,
    "TTT": NaN,
    "YDS(t)": 697,
    "IMP/G": 3.166666667,
    "SNP%": 0.4002624672,
    "YPC": 4.41,
    "TGT": 24,
    "REC": 20,
    "MTF/A": 0.2357723577,
    "YCO/A": 2.097560976,
    "recYPG": 12.58333333,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12489,
    "NM": "RJ Harvey",
    "POS": "RB",
    "AGE": 24.6,
    "TM": "DEN",
    "G": 12,
    "FPTS": 129.1,
    "PPG": 10.75833333,
    "CSTY%": 0.3333333333,
    "CL": 21.7,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 501,
    "IMP/G": 1.916666667,
    "SNP%": 0.3320848939,
    "YPC": 3.77,
    "TGT": 36,
    "REC": 31,
    "MTF/A": 0.2702702703,
    "YCO/A": 1.891891892,
    "recYPG": 18.5,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8134,
    "NM": "Khalil Shakir",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "BUF",
    "G": 12,
    "FPTS": 128.4,
    "PPG": 10.7,
    "CSTY%": 0.5,
    "CL": 18.56666667,
    "TS%": 0.211,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 574,
    "IMP/G": 1.916666667,
    "SNP%": 0.5922208281,
    "YPC": 5.0,
    "TGT": 75,
    "REC": 55,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 47.41666667,
    "YPRR": 1.98951049,
    "1DRR": 0.06993006993
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
    "SLPR_ID": 7002,
    "NM": "Juwan Johnson",
    "POS": "TE",
    "AGE": 29.0,
    "TM": "NO",
    "G": 12,
    "FPTS": 127.6,
    "PPG": 10.63333333,
    "CSTY%": 0.5,
    "CL": 16.9,
    "TS%": 0.178,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 576,
    "IMP/G": 2.333333333,
    "SNP%": 0.7979924718,
    "YPC": 0.0,
    "TGT": 76,
    "REC": 54,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.0,
    "YPRR": 1.582417582,
    "1DRR": 0.06868131868
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11628,
    "NM": "Marvin Harrison Jr.",
    "POS": "WR",
    "AGE": 23.1,
    "TM": "ARI",
    "G": 10,
    "FPTS": 125.4,
    "PPG": 12.54,
    "CSTY%": 0.6,
    "CL": 19.76666667,
    "TS%": 0.148,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 594,
    "IMP/G": 2.9,
    "SNP%": 0.7685459941,
    "YPC": 0.0,
    "TGT": 69,
    "REC": 40,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.4,
    "YPRR": 1.833333333,
    "1DRR": 0.07716049383
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1339,
    "NM": "Zach Ertz",
    "POS": "TE",
    "AGE": 34.9,
    "TM": "WAS",
    "G": 12,
    "FPTS": 124.3,
    "PPG": 10.35833333,
    "CSTY%": 0.4166666667,
    "CL": 18.43333333,
    "TS%": 0.196,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 493,
    "IMP/G": 2.0,
    "SNP%": 0.665374677,
    "YPC": 0.0,
    "TGT": 70,
    "REC": 49,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.08333333,
    "YPRR": 1.600649351,
    "1DRR": 0.06493506494
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
    "SLPR_ID": 5947,
    "NM": "Jakobi Meyers",
    "POS": "WR",
    "AGE": 28.9,
    "TM": "JAX",
    "G": 11,
    "FPTS": 123.0,
    "PPG": 11.18181818,
    "CSTY%": 0.3636363636,
    "CL": 18.0,
    "TS%": 0.177,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 600,
    "IMP/G": 2.545454545,
    "SNP%": 0.8433048433,
    "YPC": 3.0,
    "TGT": 70,
    "REC": 51,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 54.27272727,
    "YPRR": 1.842592593,
    "1DRR": 0.08024691358
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4098,
    "NM": "Kareem Hunt",
    "POS": "RB",
    "AGE": 30.1,
    "TM": "KC",
    "G": 12,
    "FPTS": 122.9,
    "PPG": 10.24166667,
    "CSTY%": 0.4166666667,
    "CL": 18.63333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 629,
    "IMP/G": 4.083333333,
    "SNP%": 0.4796650718,
    "YPC": 3.96,
    "TGT": 18,
    "REC": 14,
    "MTF/A": 0.2615384615,
    "YCO/A": 2.038461538,
    "recYPG": 9.5,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12522,
    "NM": "Cam Ward",
    "POS": "QB",
    "AGE": 23.3,
    "TM": "TEN",
    "G": 12,
    "FPTS": 122.34,
    "PPG": 10.195,
    "CSTY%": 0.08333333333,
    "CL": 16.92,
    "TS%": NaN,
    "paYPG": 195.9166667,
    "paRTG": 75.21,
    "CMP%": 0.5970873786,
    "TTT": 2.93065534,
    "YDS(t)": 2474,
    "IMP/G": 10.41666667,
    "SNP%": 1.0,
    "YPC": 4.39,
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
    "SLPR_ID": 5022,
    "NM": "Dallas Goedert",
    "POS": "TE",
    "AGE": 30.7,
    "TM": "PHI",
    "G": 11,
    "FPTS": 122.3,
    "PPG": 11.11818182,
    "CSTY%": 0.3636363636,
    "CL": 21.16666667,
    "TS%": 0.164,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 403,
    "IMP/G": 2.0,
    "SNP%": 0.8524096386,
    "YPC": 0.0,
    "TGT": 56,
    "REC": 40,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 36.63636364,
    "YPRR": 1.409090909,
    "1DRR": 0.05244755245
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4983,
    "NM": "D.J. Moore",
    "POS": "WR",
    "AGE": 28.4,
    "TM": "CHI",
    "G": 12,
    "FPTS": 120.98,
    "PPG": 10.08166667,
    "CSTY%": 0.25,
    "CL": 19.72666667,
    "TS%": 0.157,
    "paYPG": 0.1666666667,
    "paRTG": 118.75,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 571,
    "IMP/G": 2.416666667,
    "SNP%": 0.8331332533,
    "YPC": 4.79,
    "TGT": 63,
    "REC": 38,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.83333333,
    "YPRR": 1.379120879,
    "1DRR": 0.05769230769
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5001,
    "NM": "Dalton Schultz",
    "POS": "TE",
    "AGE": 29.2,
    "TM": "HOU",
    "G": 12,
    "FPTS": 120.2,
    "PPG": 10.01666667,
    "CSTY%": 0.5,
    "CL": 16.93333333,
    "TS%": 0.187,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 552,
    "IMP/G": 2.333333333,
    "SNP%": 0.7115151515,
    "YPC": 0.0,
    "TGT": 80,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.0,
    "YPRR": 1.652694611,
    "1DRR": 0.08083832335
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
    .map(p => {
      const posClass = `fc-option-pos fc-option-pos-${p.position.toLowerCase()}`;
      return `
      <li class="fc-option ${p.id === dashState.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span>${p.name}</span>
        <span class="fc-option-team"><span class="${posClass}">${p.position}</span> • ${p.team}</span>
      </li>
    `;
    })
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
  const margin = { top: height * 0.06, right: width * 0.03, bottom: isMobile ? height * 0.15 : height * 0.10, left: width * 0.03 };
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
 // g.append('g')
  // .attr('class', 'scatter-grid')
  // .attr('transform', `translate(0,${innerHeight})`)
  // .call(xAxisGrid);
  g.append('g')
  .attr('class', 'scatter-grid')
  .call(yAxisGrid);

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
    .text('CONSISTENCY % (CSTY %)');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', yLabelOffset)
    .attr('text-anchor', 'middle')
    .attr('fill', '#94a3b8')
    .attr('font-size', isMobile ? '8px' : '16px')
    .attr('font-weight', 'bold')
    .attr('letter-spacing', '0.1em')
    .text('CEILING (CL)');
  
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
      <div><strong class="scatter-tooltip-label">CL:</strong> <span style="color:${clColor}">${formatNum1(d.stats.ceiling)}</span> &middot; | &middot; <span style="color:${clColor}">${clRankTxt} (${d.position})</span></div>
      <div><strong class="scatter-tooltip-label">CSTY%:</strong> <span style="color:${cstyColor}">${formatPct1(d.stats.csty)}</span> &middot; | &middot; <span style="color:${cstyColor}">${cstyRankTxt} (${d.position})</span></div>
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
