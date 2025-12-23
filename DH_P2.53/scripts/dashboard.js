(function() {
// Manual data source (top 100 FPTS), updated weekly.
// Replace the array below directly; structure mirrors the JSON in .ReferenceFolder/HP-Data-reference.json
const HP_DATA = [
  {
    "SZN": 2025,
    "SLPR_ID": 4984,
    "NM": "Josh Allen",
    "POS": "QB",
    "AGE": 29.4,
    "TM": "BUF",
    "G": 14,
    "FPTS": 344.54,
    "PPG": 24.61,
    "CSTY%": 0.8571428571,
    "CL": 40.42666667,
    "TS%": NaN,
    "CPOE": 0.02,
    "EPA/DB": 0.18,
    "paYPG": 234.0,
    "paRTG": 104.26,
    "CMP%": 0.6995073892,
    "TTT": 2.925344828,
    "YDS(t)": 3811,
    "IMP/G": 14.35714286,
    "SNP%": 0.9742212675,
    "YPC": 5.46,
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
    "SLPR_ID": 4034,
    "NM": "Christian McCaffrey",
    "POS": "RB",
    "AGE": 29.3,
    "TM": "SF",
    "G": 14,
    "FPTS": 344.2,
    "PPG": 24.58571429,
    "CSTY%": 0.9285714286,
    "CL": 36.16666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1742,
    "IMP/G": 7.071428571,
    "SNP%": 0.8292682927,
    "YPC": 3.56,
    "TGT": 108,
    "REC": 86,
    "MTF/A": 0.3706563707,
    "YCO/A": 1.343629344,
    "recYPG": 58.57142857,
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
    "G": 14,
    "FPTS": 322.1,
    "PPG": 23.00714286,
    "CSTY%": 0.7857142857,
    "CL": 40.4,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1761,
    "IMP/G": 6.142857143,
    "SNP%": 0.8370786517,
    "YPC": 5.31,
    "TGT": 44,
    "REC": 38,
    "MTF/A": 0.3125,
    "YCO/A": 2.691176471,
    "recYPG": 22.71428571,
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
    "G": 14,
    "FPTS": 317.4,
    "PPG": 22.67142857,
    "CSTY%": 0.7142857143,
    "CL": 43.53333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1594,
    "IMP/G": 5.142857143,
    "SNP%": 0.6497747748,
    "YPC": 5.5,
    "TGT": 73,
    "REC": 62,
    "MTF/A": 0.335,
    "YCO/A": 1.66,
    "recYPG": 35.28571429,
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
    "G": 14,
    "FPTS": 305.7,
    "PPG": 21.83571429,
    "CSTY%": 0.9285714286,
    "CL": 31.8,
    "TS%": 0.33,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1577,
    "IMP/G": 4.857142857,
    "SNP%": 0.7526132404,
    "YPC": 5.14,
    "TGT": 130,
    "REC": 96,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 110.0714286,
    "YPRR": 4.044619423,
    "1DRR": 0.1496062992
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4046,
    "NM": "Patrick Mahomes",
    "POS": "QB",
    "AGE": 30.0,
    "TM": "KC",
    "G": 14,
    "FPTS": 296.68,
    "PPG": 21.19142857,
    "CSTY%": 0.6428571429,
    "CL": 29.54666667,
    "TS%": NaN,
    "CPOE": -0.029,
    "EPA/DB": 0.11,
    "paYPG": 256.2142857,
    "paRTG": 89.62,
    "CMP%": 0.6274900398,
    "TTT": 2.792948207,
    "YDS(t)": 3999,
    "IMP/G": 14.28571429,
    "SNP%": 0.9719042664,
    "YPC": 6.59,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": -0.7142857143,
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
    "G": 14,
    "FPTS": 293.8,
    "PPG": 20.98571429,
    "CSTY%": 0.7857142857,
    "CL": 32.13333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1858,
    "IMP/G": 5.785714286,
    "SNP%": 0.7873754153,
    "YPC": 5.02,
    "TGT": 81,
    "REC": 64,
    "MTF/A": 0.358974359,
    "YCO/A": 2.41025641,
    "recYPG": 48.85714286,
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
    "G": 14,
    "FPTS": 290.6,
    "PPG": 20.75714286,
    "CSTY%": 1.0,
    "CL": 32.56666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1636,
    "IMP/G": 5.142857143,
    "SNP%": 0.752293578,
    "YPC": 5.79,
    "TGT": 79,
    "REC": 61,
    "MTF/A": 0.3951219512,
    "YCO/A": 2.843902439,
    "recYPG": 32.14285714,
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
    "G": 14,
    "FPTS": 287.08,
    "PPG": 20.50571429,
    "CSTY%": 0.8571428571,
    "CL": 26.94,
    "TS%": NaN,
    "CPOE": 0.077,
    "EPA/DB": 0.2,
    "paYPG": 254.7857143,
    "paRTG": 109.12,
    "CMP%": 0.7090464548,
    "TTT": 2.915672372,
    "YDS(t)": 3931,
    "IMP/G": 13.85714286,
    "SNP%": 0.982122905,
    "YPC": 4.26,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.1428571429,
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
    "G": 13,
    "FPTS": 286.8,
    "PPG": 22.06153846,
    "CSTY%": 0.9230769231,
    "CL": 33.2,
    "TS%": 0.274,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1448,
    "IMP/G": 5.307692308,
    "SNP%": 0.6662665066,
    "YPC": 10.13,
    "TGT": 129,
    "REC": 102,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 105.1538462,
    "YPRR": 3.962318841,
    "1DRR": 0.1739130435
  },
  {
    "SZN": 2025,
    "SLPR_ID": 421,
    "NM": "Matthew Stafford",
    "POS": "QB",
    "AGE": 37.6,
    "TM": "LAR",
    "G": 14,
    "FPTS": 285.08,
    "PPG": 20.36285714,
    "CSTY%": 0.6428571429,
    "CL": 27.22666667,
    "TS%": NaN,
    "CPOE": 0.026,
    "EPA/DB": 0.18,
    "paYPG": 265.8571429,
    "paRTG": 112.21,
    "CMP%": 0.6638297872,
    "TTT": 2.747617021,
    "YDS(t)": 3714,
    "IMP/G": 13.78571429,
    "SNP%": 0.9833887043,
    "YPC": -0.31,
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
    "G": 14,
    "FPTS": 281.24,
    "PPG": 20.08857143,
    "CSTY%": 0.7142857143,
    "CL": 29.1,
    "TS%": NaN,
    "CPOE": 0.054,
    "EPA/DB": 0.11,
    "paYPG": 280.7857143,
    "paRTG": 99.07,
    "CMP%": 0.683908046,
    "TTT": 2.799731801,
    "YDS(t)": 4071,
    "IMP/G": 14.35714286,
    "SNP%": 0.9806320082,
    "YPC": 3.11,
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
    "SLPR_ID": 6904,
    "NM": "Jalen Hurts",
    "POS": "QB",
    "AGE": 27.1,
    "TM": "PHI",
    "G": 14,
    "FPTS": 276.76,
    "PPG": 19.76857143,
    "CSTY%": 0.7142857143,
    "CL": 28.42,
    "TS%": NaN,
    "CPOE": 0.035,
    "EPA/DB": 0.01,
    "paYPG": 209.2142857,
    "paRTG": 99.37,
    "CMP%": 0.6523929471,
    "TTT": 2.981889169,
    "YDS(t)": 3305,
    "IMP/G": 12.14285714,
    "SNP%": 0.9780092593,
    "YPC": 3.96,
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
    "SLPR_ID": 7547,
    "NM": "Amon-Ra St. Brown",
    "POS": "WR",
    "AGE": 25.9,
    "TM": "DET",
    "G": 14,
    "FPTS": 274.9,
    "PPG": 19.63571429,
    "CSTY%": 0.7857142857,
    "CL": 36.83333333,
    "TS%": 0.295,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1149,
    "IMP/G": 4.071428571,
    "SNP%": 0.838963964,
    "YPC": 3.0,
    "TGT": 135,
    "REC": 94,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 81.42857143,
    "YPRR": 2.645011601,
    "1DRR": 0.1044083527
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8130,
    "NM": "Trey McBride",
    "POS": "TE",
    "AGE": 25.8,
    "TM": "ARI",
    "G": 14,
    "FPTS": 272.1,
    "PPG": 19.43571429,
    "CSTY%": 0.8571428571,
    "CL": 31.5,
    "TS%": 0.255,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1071,
    "IMP/G": 4.071428571,
    "SNP%": 0.9044652129,
    "YPC": 0.0,
    "TGT": 140,
    "REC": 105,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 76.5,
    "YPRR": 1.957952468,
    "1DRR": 0.08592321755
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7523,
    "NM": "Trevor Lawrence",
    "POS": "QB",
    "AGE": 26.0,
    "TM": "JAX",
    "G": 14,
    "FPTS": 271.6,
    "PPG": 19.4,
    "CSTY%": 0.7142857143,
    "CL": 31.24666667,
    "TS%": NaN,
    "CPOE": -0.044,
    "EPA/DB": -0.01,
    "paYPG": 229.2857143,
    "paRTG": 87.88,
    "CMP%": 0.5973741794,
    "TTT": 2.826170678,
    "YDS(t)": 3512,
    "IMP/G": 13.21428571,
    "SNP%": 0.9736842105,
    "YPC": 4.58,
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
    "SLPR_ID": 11563,
    "NM": "Bo Nix",
    "POS": "QB",
    "AGE": 25.6,
    "TM": "DEN",
    "G": 14,
    "FPTS": 268.64,
    "PPG": 19.18857143,
    "CSTY%": 0.5714285714,
    "CL": 31.92666667,
    "TS%": NaN,
    "CPOE": -0.009,
    "EPA/DB": 0.06,
    "paYPG": 232.5714286,
    "paRTG": 89.68,
    "CMP%": 0.6349206349,
    "TTT": 2.874900794,
    "YDS(t)": 3510,
    "IMP/G": 12.92857143,
    "SNP%": 0.9957582185,
    "YPC": 4.1,
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
    "G": 14,
    "FPTS": 265.6,
    "PPG": 18.97142857,
    "CSTY%": 0.7142857143,
    "CL": 30.4,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1686,
    "IMP/G": 4.928571429,
    "SNP%": 0.612244898,
    "YPC": 5.22,
    "TGT": 34,
    "REC": 31,
    "MTF/A": 0.2546125461,
    "YCO/A": 2.26199262,
    "recYPG": 19.35714286,
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
    "G": 14,
    "FPTS": 263.6,
    "PPG": 18.82857143,
    "CSTY%": 0.5714285714,
    "CL": 30.97333333,
    "TS%": NaN,
    "CPOE": -0.079,
    "EPA/DB": 0.02,
    "paYPG": 225.0,
    "paRTG": 88.78,
    "CMP%": 0.5795206972,
    "TTT": 3.215359477,
    "YDS(t)": 3506,
    "IMP/G": 12.71428571,
    "SNP%": 0.9886480908,
    "YPC": 4.91,
    "TGT": 2,
    "REC": 2,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 1.571428571,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3163,
    "NM": "Jared Goff",
    "POS": "QB",
    "AGE": 31.0,
    "TM": "DET",
    "G": 14,
    "FPTS": 258.28,
    "PPG": 18.44857143,
    "CSTY%": 0.6428571429,
    "CL": 28.09333333,
    "TS%": NaN,
    "CPOE": 0.034,
    "EPA/DB": 0.15,
    "paYPG": 262.2857143,
    "paRTG": 110.36,
    "CMP%": 0.6931567329,
    "TTT": 2.727748344,
    "YDS(t)": 3716,
    "IMP/G": 12.78571429,
    "SNP%": 0.981981982,
    "YPC": 2.93,
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
    "G": 14,
    "FPTS": 253.54,
    "PPG": 18.11,
    "CSTY%": 0.4285714286,
    "CL": 28.84,
    "TS%": NaN,
    "CPOE": 0.026,
    "EPA/DB": -0.01,
    "paYPG": 227.9285714,
    "paRTG": 92.17,
    "CMP%": 0.6563192905,
    "TTT": 2.877804878,
    "YDS(t)": 3610,
    "IMP/G": 12.78571429,
    "SNP%": 0.9693121693,
    "YPC": 6.07,
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
    "G": 14,
    "FPTS": 252.2,
    "PPG": 18.01428571,
    "CSTY%": 0.7857142857,
    "CL": 31.6,
    "TS%": 0.226,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1212,
    "IMP/G": 4.571428571,
    "SNP%": 0.8277268094,
    "YPC": 0.0,
    "TGT": 120,
    "REC": 81,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 86.57142857,
    "YPRR": 2.414342629,
    "1DRR": 0.1115537849
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7564,
    "NM": "Ja'Marr Chase",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "CIN",
    "G": 13,
    "FPTS": 245.1,
    "PPG": 18.85384615,
    "CSTY%": 0.6153846154,
    "CL": 34.53333333,
    "TS%": 0.291,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1161,
    "IMP/G": 4.307692308,
    "SNP%": 0.9607142857,
    "YPC": 4.67,
    "TGT": 155,
    "REC": 101,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 88.23076923,
    "YPRR": 2.262327416,
    "1DRR": 0.100591716
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6804,
    "NM": "Jordan Love",
    "POS": "QB",
    "AGE": 26.9,
    "TM": "GB",
    "G": 14,
    "FPTS": 237.36,
    "PPG": 16.95428571,
    "CSTY%": 0.4285714286,
    "CL": 26.78,
    "TS%": NaN,
    "CPOE": 0.042,
    "EPA/DB": 0.2,
    "paYPG": 236.0,
    "paRTG": 101.89,
    "CMP%": 0.6643192488,
    "TTT": 2.899812207,
    "YDS(t)": 3496,
    "IMP/G": 12.0,
    "SNP%": 0.9852440409,
    "YPC": 4.27,
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
    "SLPR_ID": 4892,
    "NM": "Baker Mayfield",
    "POS": "QB",
    "AGE": 30.4,
    "TM": "TB",
    "G": 14,
    "FPTS": 235.56,
    "PPG": 16.82571429,
    "CSTY%": 0.6428571429,
    "CL": 24.05333333,
    "TS%": NaN,
    "CPOE": -0.02,
    "EPA/DB": -0.03,
    "paYPG": 214.2142857,
    "paRTG": 90.58,
    "CMP%": 0.6119733925,
    "TTT": 2.839423503,
    "YDS(t)": 3285,
    "IMP/G": 11.28571429,
    "SNP%": 0.9626068376,
    "YPC": 6.5,
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
    "SLPR_ID": 5870,
    "NM": "Daniel Jones",
    "POS": "QB",
    "AGE": 28.3,
    "TM": "IND",
    "G": 13,
    "FPTS": 234.44,
    "PPG": 18.03384615,
    "CSTY%": 0.7692307692,
    "CL": 25.38,
    "TS%": NaN,
    "CPOE": 0.034,
    "EPA/DB": 0.12,
    "paYPG": 238.5384615,
    "paRTG": 100.18,
    "CMP%": 0.6796875,
    "TTT": 2.702552083,
    "YDS(t)": 3265,
    "IMP/G": 12.92307692,
    "SNP%": 0.9108433735,
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
    "SLPR_ID": 5850,
    "NM": "Josh Jacobs",
    "POS": "RB",
    "AGE": 27.6,
    "TM": "GB",
    "G": 13,
    "FPTS": 231.0,
    "PPG": 17.76923077,
    "CSTY%": 0.8461538462,
    "CL": 28.96666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1160,
    "IMP/G": 4.692307692,
    "SNP%": 0.6294478528,
    "YPC": 4.08,
    "TGT": 41,
    "REC": 33,
    "MTF/A": 0.2798165138,
    "YCO/A": 2.077981651,
    "recYPG": 20.76923077,
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
    "G": 14,
    "FPTS": 225.1,
    "PPG": 16.07857143,
    "CSTY%": 0.7857142857,
    "CL": 24.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1241,
    "IMP/G": 4.928571429,
    "SNP%": 0.7247706422,
    "YPC": 4.84,
    "TGT": 46,
    "REC": 33,
    "MTF/A": 0.2782608696,
    "YCO/A": 2.530434783,
    "recYPG": 9.142857143,
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
    "G": 14,
    "FPTS": 224.7,
    "PPG": 16.05,
    "CSTY%": 0.7142857143,
    "CL": 25.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1237,
    "IMP/G": 5.214285714,
    "SNP%": 0.6799557032,
    "YPC": 4.88,
    "TGT": 36,
    "REC": 27,
    "MTF/A": 0.2843601896,
    "YCO/A": 1.886255924,
    "recYPG": 14.78571429,
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
    "G": 14,
    "FPTS": 222.9,
    "PPG": 15.92142857,
    "CSTY%": 0.6428571429,
    "CL": 24.23333333,
    "TS%": 0.242,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 789,
    "IMP/G": 3.642857143,
    "SNP%": 0.7032115172,
    "YPC": 0.0,
    "TGT": 114,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.35714286,
    "YPRR": 1.943349754,
    "1DRR": 0.09113300493
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7543,
    "NM": "Travis Etienne",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "JAX",
    "G": 14,
    "FPTS": 221.3,
    "PPG": 15.80714286,
    "CSTY%": 0.6428571429,
    "CL": 24.43333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1203,
    "IMP/G": 3.714285714,
    "SNP%": 0.5894736842,
    "YPC": 4.46,
    "TGT": 43,
    "REC": 29,
    "MTF/A": 0.2629107981,
    "YCO/A": 2.192488263,
    "recYPG": 18.14285714,
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
    "G": 14,
    "FPTS": 212.02,
    "PPG": 15.14428571,
    "CSTY%": 0.5714285714,
    "CL": 26.7,
    "TS%": NaN,
    "CPOE": 0.05,
    "EPA/DB": 0.12,
    "paYPG": 245.2142857,
    "paRTG": 102.01,
    "CMP%": 0.6743589744,
    "TTT": 2.852666667,
    "YDS(t)": 3510,
    "IMP/G": 11.14285714,
    "SNP%": 0.9558652729,
    "YPC": 3.35,
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
    "SLPR_ID": 7569,
    "NM": "Nico Collins",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "HOU",
    "G": 13,
    "FPTS": 207.6,
    "PPG": 15.96923077,
    "CSTY%": 0.6923076923,
    "CL": 23.43333333,
    "TS%": 0.22,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1016,
    "IMP/G": 3.307692308,
    "SNP%": 0.7732426304,
    "YPC": 7.5,
    "TGT": 107,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 77.0,
    "YPRR": 2.490049751,
    "1DRR": 0.08955223881
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8144,
    "NM": "Chris Olave",
    "POS": "WR",
    "AGE": 25.2,
    "TM": "NO",
    "G": 14,
    "FPTS": 206.3,
    "PPG": 14.73571429,
    "CSTY%": 0.7142857143,
    "CL": 22.9,
    "TS%": 0.269,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 893,
    "IMP/G": 2.928571429,
    "SNP%": 0.8409090909,
    "YPC": -3.0,
    "TGT": 129,
    "REC": 82,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 64.0,
    "YPRR": 1.866666667,
    "1DRR": 0.07291666667
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4866,
    "NM": "Saquon Barkley",
    "POS": "RB",
    "AGE": 28.6,
    "TM": "PHI",
    "G": 14,
    "FPTS": 204.3,
    "PPG": 14.59285714,
    "CSTY%": 0.6428571429,
    "CL": 23.33333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1213,
    "IMP/G": 3.428571429,
    "SNP%": 0.7824074074,
    "YPC": 3.92,
    "TGT": 48,
    "REC": 37,
    "MTF/A": 0.2208333333,
    "YCO/A": 1.495833333,
    "recYPG": 19.5,
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
    "G": 14,
    "FPTS": 201.6,
    "PPG": 14.4,
    "CSTY%": 0.6428571429,
    "CL": 21.13333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1116,
    "IMP/G": 4.0,
    "SNP%": 0.6806629834,
    "YPC": 4.22,
    "TGT": 75,
    "REC": 58,
    "MTF/A": 0.2702702703,
    "YCO/A": 2.162162162,
    "recYPG": 24.0,
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
    "G": 11,
    "FPTS": 200.08,
    "PPG": 18.18909091,
    "CSTY%": 0.7272727273,
    "CL": 27.64666667,
    "TS%": NaN,
    "CPOE": -0.018,
    "EPA/DB": 0.01,
    "paYPG": 163.8181818,
    "paRTG": 92.71,
    "CMP%": 0.625,
    "TTT": 2.885681818,
    "YDS(t)": 2202,
    "IMP/G": 9.818181818,
    "SNP%": 0.7255639098,
    "YPC": 5.71,
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
    "G": 14,
    "FPTS": 198.5,
    "PPG": 14.17857143,
    "CSTY%": 0.5,
    "CL": 24.06666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1275,
    "IMP/G": 4.214285714,
    "SNP%": 0.5372596154,
    "YPC": 4.83,
    "TGT": 20,
    "REC": 15,
    "MTF/A": 0.2017167382,
    "YCO/A": 2.163090129,
    "recYPG": 10.71428571,
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
    "G": 11,
    "FPTS": 195.7,
    "PPG": 17.79090909,
    "CSTY%": 0.5454545455,
    "CL": 27.56,
    "TS%": NaN,
    "CPOE": -0.021,
    "EPA/DB": -0.07,
    "paYPG": 200.9090909,
    "paRTG": 101.38,
    "CMP%": 0.6350364964,
    "TTT": 2.96580292,
    "YDS(t)": 2543,
    "IMP/G": 10.90909091,
    "SNP%": 0.9630200308,
    "YPC": 5.46,
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
    "G": 14,
    "FPTS": 195.7,
    "PPG": 13.97857143,
    "CSTY%": 0.4285714286,
    "CL": 31.46666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1237,
    "IMP/G": 4.285714286,
    "SNP%": 0.5526024363,
    "YPC": 4.7,
    "TGT": 37,
    "REC": 30,
    "MTF/A": 0.2163461538,
    "YCO/A": 2.139423077,
    "recYPG": 18.5,
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
    "G": 13,
    "FPTS": 193.46,
    "PPG": 14.88153846,
    "CSTY%": 0.4615384615,
    "CL": 23.89333333,
    "TS%": NaN,
    "CPOE": -0.013,
    "EPA/DB": -0.04,
    "paYPG": 199.5384615,
    "paRTG": 98.83,
    "CMP%": 0.6684636119,
    "TTT": 2.64671159,
    "YDS(t)": 2611,
    "IMP/G": 8.384615385,
    "SNP%": 0.9395280236,
    "YPC": 1.53,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": -0.6923076923,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6790,
    "NM": "D'Andre Swift",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "CHI",
    "G": 13,
    "FPTS": 191.9,
    "PPG": 14.76153846,
    "CSTY%": 0.6153846154,
    "CL": 22.96666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1189,
    "IMP/G": 4.923076923,
    "SNP%": 0.5793025872,
    "YPC": 4.9,
    "TGT": 41,
    "REC": 29,
    "MTF/A": 0.2146596859,
    "YCO/A": 1.806282723,
    "recYPG": 19.53846154,
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
    "G": 14,
    "FPTS": 191.6,
    "PPG": 13.68571429,
    "CSTY%": 0.5714285714,
    "CL": 26.06666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 966,
    "IMP/G": 3.214285714,
    "SNP%": 0.7493887531,
    "YPC": 3.5,
    "TGT": 64,
    "REC": 49,
    "MTF/A": 0.34,
    "YCO/A": 2.16,
    "recYPG": 19.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8126,
    "NM": "Wan'Dale Robinson",
    "POS": "WR",
    "AGE": 24.7,
    "TM": "NYG",
    "G": 14,
    "FPTS": 190.4,
    "PPG": 13.6,
    "CSTY%": 0.5,
    "CL": 26.4,
    "TS%": 0.267,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 884,
    "IMP/G": 2.5,
    "SNP%": 0.9138655462,
    "YPC": 1.0,
    "TGT": 120,
    "REC": 78,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.0,
    "YPRR": 1.934210526,
    "1DRR": 0.06578947368
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5859,
    "NM": "A.J. Brown",
    "POS": "WR",
    "AGE": 28.2,
    "TM": "PHI",
    "G": 13,
    "FPTS": 190.0,
    "PPG": 14.61538462,
    "CSTY%": 0.5384615385,
    "CL": 29.43333333,
    "TS%": 0.255,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 840,
    "IMP/G": 2.923076923,
    "SNP%": 0.9095415118,
    "YPC": 0.0,
    "TGT": 102,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 64.61538462,
    "YPRR": 2.170542636,
    "1DRR": 0.08010335917
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5045,
    "NM": "Courtland Sutton",
    "POS": "WR",
    "AGE": 30.0,
    "TM": "DEN",
    "G": 14,
    "FPTS": 189.6,
    "PPG": 13.54285714,
    "CSTY%": 0.5714285714,
    "CL": 22.4,
    "TS%": 0.198,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 886,
    "IMP/G": 3.142857143,
    "SNP%": 0.8568398727,
    "YPC": 0.0,
    "TGT": 100,
    "REC": 63,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.28571429,
    "YPRR": 1.838174274,
    "1DRR": 0.07883817427
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8148,
    "NM": "Jameson Williams",
    "POS": "WR",
    "AGE": 24.5,
    "TM": "DET",
    "G": 14,
    "FPTS": 188.8,
    "PPG": 13.48571429,
    "CSTY%": 0.5714285714,
    "CL": 25.73333333,
    "TS%": 0.177,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 948,
    "IMP/G": 2.928571429,
    "SNP%": 0.9009009009,
    "YPC": 2.0,
    "TGT": 81,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.85714286,
    "YPRR": 2.030368764,
    "1DRR": 0.0737527115
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6819,
    "NM": "Michael Pittman",
    "POS": "WR",
    "AGE": 28.0,
    "TM": "IND",
    "G": 14,
    "FPTS": 188.5,
    "PPG": 13.46428571,
    "CSTY%": 0.6428571429,
    "CL": 21.6,
    "TS%": 0.222,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 725,
    "IMP/G": 3.142857143,
    "SNP%": 0.8483146067,
    "YPC": 0.0,
    "TGT": 99,
    "REC": 72,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 51.78571429,
    "YPRR": 1.742788462,
    "1DRR": 0.08894230769
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9228,
    "NM": "Bryce Young",
    "POS": "QB",
    "AGE": 24.2,
    "TM": "CAR",
    "G": 13,
    "FPTS": 184.0,
    "PPG": 14.15384615,
    "CSTY%": 0.3076923077,
    "CL": 25.56,
    "TS%": NaN,
    "CPOE": -0.011,
    "EPA/DB": -0.06,
    "paYPG": 192.3076923,
    "paRTG": 88.43,
    "CMP%": 0.6330749354,
    "TTT": 2.813927649,
    "YDS(t)": 2670,
    "IMP/G": 10.84615385,
    "SNP%": 0.9572446556,
    "YPC": 4.36,
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
    "SLPR_ID": 12514,
    "NM": "Emeka Egbuka",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "TB",
    "G": 14,
    "FPTS": 183.9,
    "PPG": 13.13571429,
    "CSTY%": 0.4285714286,
    "CL": 26.13333333,
    "TS%": 0.251,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 879,
    "IMP/G": 2.357142857,
    "SNP%": 0.8247863248,
    "YPC": 4.5,
    "TGT": 117,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 62.14285714,
    "YPRR": 1.963882619,
    "1DRR": 0.06094808126
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7526,
    "NM": "Jaylen Waddle",
    "POS": "WR",
    "AGE": 26.8,
    "TM": "MIA",
    "G": 14,
    "FPTS": 181.22,
    "PPG": 12.94428571,
    "CSTY%": 0.5714285714,
    "CL": 21.1,
    "TS%": 0.224,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.5714285714,
    "paRTG": 100.0,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 867,
    "IMP/G": 3.214285714,
    "SNP%": 0.8204456094,
    "YPC": 21.0,
    "TGT": 90,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.85714286,
    "YPRR": 2.334261838,
    "1DRR": 0.1058495822
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12526,
    "NM": "Tetairoa McMillan",
    "POS": "WR",
    "AGE": 22.5,
    "TM": "CAR",
    "G": 14,
    "FPTS": 180.1,
    "PPG": 12.86428571,
    "CSTY%": 0.3571428571,
    "CL": 22.6,
    "TS%": 0.241,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 851,
    "IMP/G": 3.357142857,
    "SNP%": 0.8737541528,
    "YPC": 0.0,
    "TGT": 102,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 60.78571429,
    "YPRR": 1.947368421,
    "1DRR": 0.0938215103
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9997,
    "NM": "Zay Flowers",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "BAL",
    "G": 14,
    "FPTS": 179.3,
    "PPG": 12.80714286,
    "CSTY%": 0.5714285714,
    "CL": 21.5,
    "TS%": 0.275,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1003,
    "IMP/G": 2.857142857,
    "SNP%": 0.8737980769,
    "YPC": 4.89,
    "TGT": 100,
    "REC": 71,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 68.5,
    "YPRR": 2.497395833,
    "1DRR": 0.09375
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5846,
    "NM": "DK Metcalf",
    "POS": "WR",
    "AGE": 27.8,
    "TM": "PIT",
    "G": 14,
    "FPTS": 179.0,
    "PPG": 12.78571429,
    "CSTY%": 0.5714285714,
    "CL": 21.63333333,
    "TS%": 0.213,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 820,
    "IMP/G": 2.571428571,
    "SNP%": 0.8786666667,
    "YPC": 6.0,
    "TGT": 90,
    "REC": 55,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 57.71428571,
    "YPRR": 1.946987952,
    "1DRR": 0.06987951807
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6786,
    "NM": "CeeDee Lamb",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "DAL",
    "G": 11,
    "FPTS": 178.8,
    "PPG": 16.25454545,
    "CSTY%": 0.8181818182,
    "CL": 22.13333333,
    "TS%": 0.186,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 978,
    "IMP/G": 3.363636364,
    "SNP%": 0.7239648683,
    "YPC": 2.0,
    "TGT": 99,
    "REC": 63,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 88.72727273,
    "YPRR": 2.788571429,
    "1DRR": 0.09714285714
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1466,
    "NM": "Travis Kelce",
    "POS": "TE",
    "AGE": 36.0,
    "TM": "KC",
    "G": 14,
    "FPTS": 178.8,
    "PPG": 12.77142857,
    "CSTY%": 0.5714285714,
    "CL": 21.7,
    "TS%": 0.181,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 798,
    "IMP/G": 3.0,
    "SNP%": 0.8054110302,
    "YPC": 1.0,
    "TGT": 92,
    "REC": 67,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 56.92857143,
    "YPRR": 1.782997763,
    "1DRR": 0.08277404922
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12529,
    "NM": "TreVeyon Henderson",
    "POS": "RB",
    "AGE": 22.9,
    "TM": "NE",
    "G": 14,
    "FPTS": 178.5,
    "PPG": 12.75,
    "CSTY%": 0.3571428571,
    "CL": 30.13333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 985,
    "IMP/G": 3.142857143,
    "SNP%": 0.4793296089,
    "YPC": 5.41,
    "TGT": 41,
    "REC": 34,
    "MTF/A": 0.3216783217,
    "YCO/A": 2.258741259,
    "recYPG": 15.14285714,
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
    "G": 14,
    "FPTS": 178.46,
    "PPG": 12.74714286,
    "CSTY%": 0.5,
    "CL": 23.28666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.2857142857,
    "paRTG": 122.92,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 1227,
    "IMP/G": 4.285714286,
    "SNP%": 0.6513761468,
    "YPC": 4.23,
    "TGT": 42,
    "REC": 32,
    "MTF/A": 0.20657277,
    "YCO/A": 1.910798122,
    "recYPG": 23.07142857,
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
    "TS%": 0.205,
    "CPOE": NaN,
    "EPA/DB": NaN,
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
    "SLPR_ID": 7553,
    "NM": "Kyle Pitts",
    "POS": "TE",
    "AGE": 25.0,
    "TM": "ATL",
    "G": 14,
    "FPTS": 176.7,
    "PPG": 12.62142857,
    "CSTY%": 0.5,
    "CL": 26.26666667,
    "TS%": 0.212,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 797,
    "IMP/G": 2.785714286,
    "SNP%": 0.8715393134,
    "YPC": 0.0,
    "TGT": 97,
    "REC": 73,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.92857143,
    "YPRR": 1.799097065,
    "1DRR": 0.07900677201
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6768,
    "NM": "Tua Tagovailoa",
    "POS": "QB",
    "AGE": 27.6,
    "TM": "MIA",
    "G": 14,
    "FPTS": 175.7,
    "PPG": 12.55,
    "CSTY%": 0.2857142857,
    "CL": 22.18,
    "TS%": NaN,
    "CPOE": -0.003,
    "EPA/DB": -0.06,
    "paYPG": 190.0,
    "paRTG": 88.45,
    "CMP%": 0.6770833333,
    "TTT": 2.654322917,
    "YDS(t)": 2703,
    "IMP/G": 10.21428571,
    "SNP%": 0.9541284404,
    "YPC": 2.15,
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
    "SLPR_ID": 8110,
    "NM": "Jake Ferguson",
    "POS": "TE",
    "AGE": 26.7,
    "TM": "DAL",
    "G": 14,
    "FPTS": 174.1,
    "PPG": 12.43571429,
    "CSTY%": 0.5714285714,
    "CL": 22.33333333,
    "TS%": 0.177,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 571,
    "IMP/G": 1.928571429,
    "SNP%": 0.6992864424,
    "YPC": 1.0,
    "TGT": 94,
    "REC": 77,
    "MTF/A": NaN,
    "YCO/A": 1.0,
    "recYPG": 40.71428571,
    "YPRR": 1.390243902,
    "1DRR": 0.0487804878
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7525,
    "NM": "DeVonta Smith",
    "POS": "WR",
    "AGE": 26.9,
    "TM": "PHI",
    "G": 14,
    "FPTS": 172.9,
    "PPG": 12.35,
    "CSTY%": 0.4285714286,
    "CL": 24.23333333,
    "TS%": 0.24,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 889,
    "IMP/G": 2.642857143,
    "SNP%": 0.8946759259,
    "YPC": 0.0,
    "TGT": 96,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.5,
    "YPRR": 2.126794258,
    "1DRR": 0.08133971292
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9758,
    "NM": "C.J. Stroud",
    "POS": "QB",
    "AGE": 24.0,
    "TM": "HOU",
    "G": 11,
    "FPTS": 172.04,
    "PPG": 15.64,
    "CSTY%": 0.3636363636,
    "CL": 24.96,
    "TS%": NaN,
    "CPOE": 0.017,
    "EPA/DB": 0.09,
    "paYPG": 221.9090909,
    "paRTG": 94.08,
    "CMP%": 0.6528189911,
    "TTT": 2.851127596,
    "YDS(t)": 2645,
    "IMP/G": 11.54545455,
    "SNP%": 0.9155672823,
    "YPC": 5.37,
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
    "SLPR_ID": 7567,
    "NM": "Kenneth Gainwell",
    "POS": "RB",
    "AGE": 26.5,
    "TM": "PIT",
    "G": 14,
    "FPTS": 170.3,
    "PPG": 12.16428571,
    "CSTY%": 0.3571428571,
    "CL": 26.83333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 783,
    "IMP/G": 3.142857143,
    "SNP%": 0.464,
    "YPC": 4.85,
    "TGT": 65,
    "REC": 57,
    "MTF/A": 0.3225806452,
    "YCO/A": 1.569892473,
    "recYPG": 23.71428571,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6801,
    "NM": "Tee Higgins",
    "POS": "WR",
    "AGE": 26.7,
    "TM": "CIN",
    "G": 12,
    "FPTS": 168.7,
    "PPG": 14.05833333,
    "CSTY%": 0.4166666667,
    "CL": 27.3,
    "TS%": 0.152,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 667,
    "IMP/G": 2.75,
    "SNP%": 0.8418230563,
    "YPC": 0.0,
    "TGT": 81,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 55.58333333,
    "YPRR": 1.603365385,
    "1DRR": 0.05769230769
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1373,
    "NM": "Geno Smith",
    "POS": "QB",
    "AGE": 35.0,
    "TM": "LV",
    "G": 13,
    "FPTS": 166.72,
    "PPG": 12.82461538,
    "CSTY%": 0.2307692308,
    "CL": 23.93333333,
    "TS%": NaN,
    "CPOE": "-",
    "EPA/DB": "-",
    "paYPG": 203.6923077,
    "paRTG": 84.45,
    "CMP%": 0.6700251889,
    "TTT": 2.814382872,
    "YDS(t)": 2756,
    "IMP/G": 11.15384615,
    "SNP%": 0.9742268041,
    "YPC": 2.7,
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
    "SLPR_ID": 8228,
    "NM": "Jaylen Warren",
    "POS": "RB",
    "AGE": 26.9,
    "TM": "PIT",
    "G": 13,
    "FPTS": 166.7,
    "PPG": 12.82307692,
    "CSTY%": 0.6153846154,
    "CL": 18.03333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 977,
    "IMP/G": 4.076923077,
    "SNP%": 0.5365853659,
    "YPC": 4.01,
    "TGT": 38,
    "REC": 33,
    "MTF/A": 0.350877193,
    "YCO/A": 2.233918129,
    "recYPG": 22.46153846,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10232,
    "NM": "Michael Wilson",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "ARI",
    "G": 14,
    "FPTS": 166.6,
    "PPG": 11.9,
    "CSTY%": 0.2857142857,
    "CL": 30.83333333,
    "TS%": 0.191,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 766,
    "IMP/G": 2.928571429,
    "SNP%": 0.8037383178,
    "YPC": 0.0,
    "TGT": 105,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 54.71428571,
    "YPRR": 1.51984127,
    "1DRR": 0.07341269841
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5872,
    "NM": "Deebo Samuel",
    "POS": "WR",
    "AGE": 29.7,
    "TM": "WAS",
    "G": 13,
    "FPTS": 166.3,
    "PPG": 12.79230769,
    "CSTY%": 0.4615384615,
    "CL": 22.3,
    "TS%": 0.214,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 653,
    "IMP/G": 2.307692308,
    "SNP%": 0.712195122,
    "YPC": 3.77,
    "TGT": 86,
    "REC": 65,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.46153846,
    "YPRR": 1.841463415,
    "1DRR": 0.06707317073
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12518,
    "NM": "Tyler Warren",
    "POS": "TE",
    "AGE": 23.4,
    "TM": "IND",
    "G": 14,
    "FPTS": 165.6,
    "PPG": 11.82857143,
    "CSTY%": 0.5714285714,
    "CL": 18.16666667,
    "TS%": 0.202,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 726,
    "IMP/G": 2.714285714,
    "SNP%": 0.8359550562,
    "YPC": 1.33,
    "TGT": 90,
    "REC": 63,
    "MTF/A": NaN,
    "YCO/A": 0.5,
    "recYPG": 51.28571429,
    "YPRR": 1.841025641,
    "1DRR": 0.07948717949
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5022,
    "NM": "Dallas Goedert",
    "POS": "TE",
    "AGE": 30.7,
    "TM": "PHI",
    "G": 13,
    "FPTS": 163.1,
    "PPG": 12.54615385,
    "CSTY%": 0.4615384615,
    "CL": 23.56666667,
    "TS%": 0.183,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 551,
    "IMP/G": 2.461538462,
    "SNP%": 0.8495024876,
    "YPC": 0.0,
    "TGT": 73,
    "REC": 54,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 42.38461538,
    "YPRR": 1.611111111,
    "1DRR": 0.06725146199
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11635,
    "NM": "Ladd McConkey",
    "POS": "WR",
    "AGE": 23.9,
    "TM": "LAC",
    "G": 14,
    "FPTS": 162.5,
    "PPG": 11.60714286,
    "CSTY%": 0.5,
    "CL": 21.5,
    "TS%": 0.211,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 715,
    "IMP/G": 2.285714286,
    "SNP%": 0.7767195767,
    "YPC": 0.0,
    "TGT": 98,
    "REC": 61,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 51.07142857,
    "YPRR": 1.540948276,
    "1DRR": 0.05818965517
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11604,
    "NM": "Brock Bowers",
    "POS": "TE",
    "AGE": 22.8,
    "TM": "LV",
    "G": 11,
    "FPTS": 161.9,
    "PPG": 14.71818182,
    "CSTY%": 0.5454545455,
    "CL": 26.96666667,
    "TS%": 0.186,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 649,
    "IMP/G": 3.090909091,
    "SNP%": 0.8440366972,
    "YPC": 1.0,
    "TGT": 81,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": 1.5,
    "recYPG": 58.81818182,
    "YPRR": 1.848571429,
    "1DRR": 0.08
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6794,
    "NM": "Justin Jefferson",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "MIN",
    "G": 14,
    "FPTS": 161.6,
    "PPG": 11.54285714,
    "CSTY%": 0.5,
    "CL": 19.53333333,
    "TS%": 0.283,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 836,
    "IMP/G": 2.642857143,
    "SNP%": 0.9511599512,
    "YPC": 4.0,
    "TGT": 117,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.42857143,
    "YPRR": 1.853006682,
    "1DRR": 0.07795100223
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12489,
    "NM": "RJ Harvey",
    "POS": "RB",
    "AGE": 24.6,
    "TM": "DEN",
    "G": 14,
    "FPTS": 161.6,
    "PPG": 11.54285714,
    "CSTY%": 0.3571428571,
    "CL": 22.43333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 666,
    "IMP/G": 2.357142857,
    "SNP%": 0.3838812301,
    "YPC": 3.81,
    "TGT": 43,
    "REC": 37,
    "MTF/A": 0.2818181818,
    "YCO/A": 1.681818182,
    "recYPG": 17.64285714,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11627,
    "NM": "Troy Franklin",
    "POS": "WR",
    "AGE": 22.6,
    "TM": "DEN",
    "G": 14,
    "FPTS": 160.8,
    "PPG": 11.48571429,
    "CSTY%": 0.4285714286,
    "CL": 23.9,
    "TS%": 0.186,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 638,
    "IMP/G": 2.214285714,
    "SNP%": 0.6108165429,
    "YPC": 2.4,
    "TGT": 94,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.71428571,
    "YPRR": 1.609254499,
    "1DRR": 0.05912596401
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1479,
    "NM": "Keenan Allen",
    "POS": "WR",
    "AGE": 33.4,
    "TM": "LAC",
    "G": 14,
    "FPTS": 160.0,
    "PPG": 11.42857143,
    "CSTY%": 0.2857142857,
    "CL": 22.73333333,
    "TS%": 0.218,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 680,
    "IMP/G": 3.0,
    "SNP%": 0.5566137566,
    "YPC": 0.0,
    "TGT": 101,
    "REC": 68,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.57142857,
    "YPRR": 1.842818428,
    "1DRR": 0.1029810298
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12512,
    "NM": "Quinshon Judkins",
    "POS": "RB",
    "AGE": 21.9,
    "TM": "CLE",
    "G": 13,
    "FPTS": 159.7,
    "PPG": 12.28461538,
    "CSTY%": 0.4615384615,
    "CL": 21.53333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 947,
    "IMP/G": 4.076923077,
    "SNP%": 0.5089605735,
    "YPC": 3.63,
    "TGT": 30,
    "REC": 21,
    "MTF/A": 0.2027027027,
    "YCO/A": 2.225225225,
    "recYPG": 10.92307692,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 2449,
    "NM": "Stefon Diggs",
    "POS": "WR",
    "AGE": 31.8,
    "TM": "NE",
    "G": 14,
    "FPTS": 158.1,
    "PPG": 11.29285714,
    "CSTY%": 0.4285714286,
    "CL": 20.06666667,
    "TS%": 0.202,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 731,
    "IMP/G": 2.714285714,
    "SNP%": 0.538547486,
    "YPC": 0.0,
    "TGT": 83,
    "REC": 67,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 52.21428571,
    "YPRR": 2.412541254,
    "1DRR": 0.1155115512
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12506,
    "NM": "Harold Fannin",
    "POS": "TE",
    "AGE": 21.2,
    "TM": "CLE",
    "G": 14,
    "FPTS": 155.9,
    "PPG": 11.13571429,
    "CSTY%": 0.5,
    "CL": 19.63333333,
    "TS%": 0.205,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 679,
    "IMP/G": 2.142857143,
    "SNP%": 0.7853231106,
    "YPC": 2.0,
    "TGT": 99,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": 0.8333333333,
    "recYPG": 47.64285714,
    "YPRR": 1.759894459,
    "1DRR": 0.06596306069
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
    "CPOE": -0.004,
    "EPA/DB": -0.17,
    "paYPG": 245.1,
    "paRTG": 79.23,
    "CMP%": 0.6024390244,
    "TTT": 2.736390244,
    "YDS(t)": 2482,
    "IMP/G": 12.1,
    "SNP%": 0.6907216495,
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
    "SLPR_ID": 5967,
    "NM": "Tony Pollard",
    "POS": "RB",
    "AGE": 28.4,
    "TM": "TEN",
    "G": 14,
    "FPTS": 154.6,
    "PPG": 11.04285714,
    "CSTY%": 0.3571428571,
    "CL": 20.36666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1026,
    "IMP/G": 3.357142857,
    "SNP%": 0.6385964912,
    "YPC": 4.48,
    "TGT": 36,
    "REC": 28,
    "MTF/A": 0.3068783069,
    "YCO/A": 1.767195767,
    "recYPG": 12.78571429,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5892,
    "NM": "David Montgomery",
    "POS": "RB",
    "AGE": 28.3,
    "TM": "DET",
    "G": 14,
    "FPTS": 153.02,
    "PPG": 10.93,
    "CSTY%": 0.3571428571,
    "CL": 20.64,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.2142857143,
    "paRTG": 95.83,
    "CMP%": 0.5,
    "TTT": NaN,
    "YDS(t)": 802,
    "IMP/G": 3.214285714,
    "SNP%": 0.3851351351,
    "YPC": 4.67,
    "TGT": 26,
    "REC": 21,
    "MTF/A": 0.2867647059,
    "YCO/A": 2.294117647,
    "recYPG": 11.71428571,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10229,
    "NM": "Rashee Rice",
    "POS": "WR",
    "AGE": 25.4,
    "TM": "KC",
    "G": 8,
    "FPTS": 150.1,
    "PPG": 18.7625,
    "CSTY%": 0.75,
    "CL": 26.33333333,
    "TS%": 0.154,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 591,
    "IMP/G": 3.75,
    "SNP%": 0.7319223986,
    "YPC": 4.0,
    "TGT": 78,
    "REC": 53,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 71.375,
    "YPRR": 2.274900398,
    "1DRR": 0.09163346614
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5947,
    "NM": "Jakobi Meyers",
    "POS": "WR",
    "AGE": 28.9,
    "TM": "JAX",
    "G": 13,
    "FPTS": 149.9,
    "PPG": 11.53076923,
    "CSTY%": 0.4615384615,
    "CL": 18.0,
    "TS%": 0.19,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 719,
    "IMP/G": 2.846153846,
    "SNP%": 0.8442028986,
    "YPC": 3.0,
    "TGT": 87,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 54.38461538,
    "YPRR": 1.81748072,
    "1DRR": 0.08483290488
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8134,
    "NM": "Khalil Shakir",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "BUF",
    "G": 14,
    "FPTS": 149.5,
    "PPG": 10.67857143,
    "CSTY%": 0.4285714286,
    "CL": 18.56666667,
    "TS%": 0.201,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 655,
    "IMP/G": 1.857142857,
    "SNP%": 0.5929108485,
    "YPC": 5.0,
    "TGT": 83,
    "REC": 62,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.42857143,
    "YPRR": 1.946107784,
    "1DRR": 0.06586826347
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12522,
    "NM": "Cam Ward",
    "POS": "QB",
    "AGE": 23.3,
    "TM": "TEN",
    "G": 14,
    "FPTS": 149.42,
    "PPG": 10.67285714,
    "CSTY%": 0.07142857143,
    "CL": 17.56666667,
    "TS%": NaN,
    "CPOE": "-",
    "EPA/DB": "-",
    "paYPG": 188.4285714,
    "paRTG": 76.51,
    "CMP%": 0.592750533,
    "TTT": 2.936652452,
    "YDS(t)": 2767,
    "IMP/G": 10.07142857,
    "SNP%": 1.0,
    "YPC": 4.16,
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
    "SLPR_ID": 5001,
    "NM": "Dalton Schultz",
    "POS": "TE",
    "AGE": 29.2,
    "TM": "HOU",
    "G": 14,
    "FPTS": 147.0,
    "PPG": 10.5,
    "CSTY%": 0.5,
    "CL": 19.56666667,
    "TS%": 0.191,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 650,
    "IMP/G": 2.428571429,
    "SNP%": 0.7193347193,
    "YPC": 0.0,
    "TGT": 93,
    "REC": 70,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.42857143,
    "YPRR": 1.65394402,
    "1DRR": 0.08142493639
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
    "TS%": 0.194,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 661,
    "IMP/G": 3.083333333,
    "SNP%": 0.8153503893,
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
    "SLPR_ID": 8676,
    "NM": "Rashid Shaheed",
    "POS": "WR",
    "AGE": 27.1,
    "TM": "SEA",
    "G": 15,
    "FPTS": 144.5,
    "PPG": 9.633333333,
    "CSTY%": 0.2666666667,
    "CL": 17.76666667,
    "TS%": 0.226,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 715,
    "IMP/G": 2.066666667,
    "SNP%": 0.6496350365,
    "YPC": 4.75,
    "TGT": 89,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.13333333,
    "YPRR": 1.655256724,
    "1DRR": 0.06601466993
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4983,
    "NM": "D.J. Moore",
    "POS": "WR",
    "AGE": 28.4,
    "TM": "CHI",
    "G": 14,
    "FPTS": 144.48,
    "PPG": 10.32,
    "CSTY%": 0.2857142857,
    "CL": 23.09333333,
    "TS%": 0.153,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.1428571429,
    "paRTG": 118.75,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 636,
    "IMP/G": 2.357142857,
    "SNP%": 0.8359133127,
    "YPC": 4.79,
    "TGT": 71,
    "REC": 43,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 40.5,
    "YPRR": 1.330985915,
    "1DRR": 0.05399061033
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
    "CPOE": -0.013,
    "EPA/DB": -0.13,
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
    "SLPR_ID": 7002,
    "NM": "Juwan Johnson",
    "POS": "TE",
    "AGE": 29.0,
    "TM": "NO",
    "G": 14,
    "FPTS": 142.4,
    "PPG": 10.17142857,
    "CSTY%": 0.4285714286,
    "CL": 16.9,
    "TS%": 0.175,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 644,
    "IMP/G": 2.285714286,
    "SNP%": 0.7673160173,
    "YPC": 0.0,
    "TGT": 84,
    "REC": 62,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.0,
    "YPRR": 1.590123457,
    "1DRR": 0.07160493827
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8151,
    "NM": "Kenneth Walker III",
    "POS": "RB",
    "AGE": 24.9,
    "TM": "SEA",
    "G": 14,
    "FPTS": 141.5,
    "PPG": 10.10714286,
    "CSTY%": 0.3571428571,
    "CL": 18.96666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 955,
    "IMP/G": 3.214285714,
    "SNP%": 0.4738675958,
    "YPC": 4.35,
    "TGT": 27,
    "REC": 22,
    "MTF/A": 0.3184357542,
    "YCO/A": 1.748603352,
    "recYPG": 12.57142857,
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
    "G": 14,
    "FPTS": 138.8,
    "PPG": 9.914285714,
    "CSTY%": 0.2857142857,
    "CL": 21.8,
    "TS%": 0.175,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 628,
    "IMP/G": 2.428571429,
    "SNP%": 0.817877095,
    "YPC": 0.0,
    "TGT": 72,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.85714286,
    "YPRR": 1.774011299,
    "1DRR": 0.08192090395
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10213,
    "NM": "Tre Tucker",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "LV",
    "G": 14,
    "FPTS": 137.0,
    "PPG": 9.785714286,
    "CSTY%": 0.2857142857,
    "CL": 23.0,
    "TS%": 0.172,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 610,
    "IMP/G": 1.928571429,
    "SNP%": 0.9388753056,
    "YPC": 6.0,
    "TGT": 75,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.0,
    "YPRR": 1.221276596,
    "1DRR": 0.04680851064
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8121,
    "NM": "Romeo Doubs",
    "POS": "WR",
    "AGE": 25.5,
    "TM": "GB",
    "G": 14,
    "FPTS": 136.8,
    "PPG": 9.771428571,
    "CSTY%": 0.2857142857,
    "CL": 19.7,
    "TS%": 0.177,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 578,
    "IMP/G": 2.428571429,
    "SNP%": 0.8036322361,
    "YPC": 0.0,
    "TGT": 76,
    "REC": 47,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.28571429,
    "YPRR": 1.61452514,
    "1DRR": 0.08100558659
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
    "CPOE": 0.032,
    "EPA/DB": 0.07,
    "paYPG": 215.1,
    "paRTG": 97.4,
    "CMP%": 0.6955017301,
    "TTT": 2.715017301,
    "YDS(t)": 2214,
    "IMP/G": 11.8,
    "SNP%": 0.5758218452,
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
    "SLPR_ID": 9754,
    "NM": "Quentin Johnston",
    "POS": "WR",
    "AGE": 24.1,
    "TM": "LAC",
    "G": 12,
    "FPTS": 136.0,
    "PPG": 11.33333333,
    "CSTY%": 0.4166666667,
    "CL": 21.53333333,
    "TS%": 0.153,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 540,
    "IMP/G": 1.666666667,
    "SNP%": 0.7840490798,
    "YPC": 3.5,
    "TGT": 72,
    "REC": 42,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.41666667,
    "YPRR": 1.335839599,
    "1DRR": 0.03258145363
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
    stats: ['fpts', 'ppg', 'pass_rtg', 'cmp_pct', 'yds_total', 'ttt', 'epa_db', 'cpoe'],
    labels: ['FPTS', 'PPG', 'paRTG', 'CMP%', 'YDS(t)', 'TTT', 'EPA/DB', 'CPOE'],
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

// Position-specific palettes: pick 1-4 to compare distinct schemes.
const RADAR_THEME_VARIANT = 1; // 1-4
// Custom QB ring mids (exact colors per ring, inner -> outer)
const QB_CUSTOM_RING_MIDS = ['#00FF99', '#76FFEB', '#48BEFF', '#6176FF', '#957CFF', '#767693', '#FF6FE1', '#FF2EB2'];
const RADAR_THEME_VARIANTS = [
  {
    name: 'Nocturne',
    anchors: {
      QB: ['#101A3A', '#2C5BFF', '#00C9FF', '#D8F6FF'],
      RB: ['#2A0500', '#8A1A00', '#FF4D1A', '#FFB347'],
      WR: ['#052A18', '#00A86B', '#2BFF88', '#C7FF2E'],
      TE: ['#250530', '#6B1FA8', '#D62BFF', '#FF6B98']
    }
  },
  {
    name: 'Desert-Glass',
    anchors: {
      QB: ['#0B1E2D', '#0D5D8F', '#46C2FF', '#E6FFFF'],
      RB: ['#2B140A', '#7A3A20', '#FF8A2A', '#FFE08A'],
      WR: ['#042A2E', '#007C88', '#00E6C3', '#B9FFF1'],
      TE: ['#2A001E', '#7A003E', '#C026D3', '#FFC1D6']
    }
  },
  {
    name: 'Circuit-Bloom',
    anchors: {
      QB: ['#190B3A', '#4B2BFF', '#00B2FF', '#9AE6FF'],
      RB: ['#2E1000', '#B12C00', '#FF6A00', '#FFE66D'],
      WR: ['#003B1E', '#00C26E', '#7CFF00', '#F2FF7A'],
      TE: ['#1E0B2E', '#5D1E9C', '#FF2D9A', '#FF7A8A']
    }
  },
  {
    name: 'Polar-Ember',
    anchors: {
      QB: ['#0C1020', '#1A2CFF', '#00D6FF', '#DFF6FF'],
      RB: ['#1B0B0B', '#C1123A', '#FF7A00', '#FFD1A6'],
      WR: ['#022E2A', '#00B37E', '#4CFF8F', '#D7FF6A'],
      TE: ['#220C2E', '#9C27B0', '#FF2D9A', '#FF6B98']
    }
  }
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const hexToRgb = (hex) => {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length !== 6) return { r: 255, g: 255, b: 255 };
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
};
const rgbToHex = (r, g, b) => {
  const toHex = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
const mixHex = (a, b, t) => {
  const ta = clamp01(t);
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  const r = c1.r + (c2.r - c1.r) * ta;
  const g = c1.g + (c2.g - c1.g) * ta;
  const bch = c1.b + (c2.b - c1.b) * ta;
  return rgbToHex(r, g, bch);
};
const hexToRgba = (hex, alpha) => {
  const c = hexToRgb(hex);
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
};
const lerpColor = (a, b, t) => mixHex(a, b, t);

const buildPaletteFromAnchors = (anchors, count = 8) => {
  const steps = Math.max(1, count);
  const segments = Math.max(1, anchors.length - 1);
  const mids = [];
  for (let i = 0; i < steps; i += 1) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const seg = Math.min(segments - 1, Math.floor(t * segments));
    const localT = (t - seg / segments) * segments;
    const mid = lerpColor(anchors[seg], anchors[seg + 1], localT);
    mids.push(mid);
  }
  return mids.map((mid, idx) => {
    const start = mixHex(mid, '#FFFFFF', 0.35);
    const end = mixHex(mid, '#000000', 0.28);
    return { name: `ring-${idx + 1}`, stops: [start, mid, end] };
  });
};

const buildPaletteFromMids = (mids) => (
  mids.map((mid, idx) => {
    const start = mixHex(mid, '#FFFFFF', 0.35);
    const end = mixHex(mid, '#000000', 0.28);
    return { name: `ring-${idx + 1}`, stops: [start, mid, end] };
  })
);

const buildThemePalettes = (anchorsByPos) => ({
  QB: buildPaletteFromAnchors(anchorsByPos.QB),
  RB: buildPaletteFromAnchors(anchorsByPos.RB),
  WR: buildPaletteFromAnchors(anchorsByPos.WR),
  TE: buildPaletteFromAnchors(anchorsByPos.TE)
});

const themeIndex = Math.min(Math.max(RADAR_THEME_VARIANT - 1, 0), RADAR_THEME_VARIANTS.length - 1);
const ACTIVE_RADAR_THEME = RADAR_THEME_VARIANTS[themeIndex];
const RADAR_PALETTES = buildThemePalettes(ACTIVE_RADAR_THEME.anchors);
if (QB_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.QB = buildPaletteFromMids(QB_CUSTOM_RING_MIDS);
}

const getRadarPalette = (pos) => RADAR_PALETTES[pos] || RADAR_PALETTES.QB;
const getRadarRingColors = (palette) => palette.map(gradient => gradient.stops[1] || gradient.stops[0]);
let activeRadarPalette = getRadarPalette('QB');
let activeRadarColors = getRadarRingColors(activeRadarPalette);

function applyRadarLegendPalette(palette) {
  const dots = document.querySelectorAll('.fc-legend .fc-dot');
  if (!dots.length) return;
  dots.forEach((dot, idx) => {
    const gradient = palette[idx % palette.length];
    const start = gradient.stops[0];
    const mid = gradient.stops[1] || gradient.stops[0];
    const end = gradient.stops[2] || gradient.stops[1] || gradient.stops[0];
    dot.style.backgroundColor = mid;
    dot.style.backgroundImage = `linear-gradient(135deg, ${start}, ${mid} 55%, ${end})`;
    dot.style.boxShadow = `0 0 9px ${hexToRgba(mid, 0.55)}`;
  });
}

function setRadarPalette(pos) {
  activeRadarPalette = getRadarPalette(pos);
  activeRadarColors = getRadarRingColors(activeRadarPalette);
  applyRadarLegendPalette(activeRadarPalette);
}

// Utility helpers
const toNum = (v) => (v === null || v === undefined ? null : Number(v));
const toPct = (v) => {
  const n = toNum(v);
  if (!Number.isFinite(n)) return null;
  return n <= 1 && n >= 0 ? n * 100 : n;
};
const toSignedPct = (v) => {
  const n = toNum(v);
  if (!Number.isFinite(n)) return null;
  return Math.abs(n) <= 1 ? n * 100 : n;
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
      epa_db: toNum(row['EPA/DB']),
      cpoe: toSignedPct(row.CPOE),
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
    QB: [ ['pass_rtg', false], ['cmp_pct', false], ['epa_db', false], ['ttt', true], ['yds_total', false], ['cpoe', false], ['cl', false], ['csty', false] ],
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
  const topEPAQB = [...players].filter(p => p.position === 'QB' && Number.isFinite(p.stats.epa_db)).sort((a,b)=>b.stats.epa_db - a.stats.epa_db)[0];
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
  if (topEPAQB) {
    const epa = topEPAQB.stats.epa_db;
    setText('ppg-value', `${epa > 0 ? '+' : ''}${epa.toFixed(2)}`);
    setText('ppg-name', topEPAQB.name);
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
  setRadarPalette(player.position);
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
  const ringColors = activeRadarColors;

  // Number formatting config per stat key
  const formatConfig = {
    // General stats
    fpts: { decimals: 1, percent: false },
    ppg: { decimals: 1, percent: false },
    csty: { decimals: 1, percent: true },
    cl: { decimals: 1, percent: false },
    ts: { decimals: 1, percent: true },
    epa_db: { decimals: 2, percent: false },
    cpoe: { decimals: 1, percent: true },
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
      if ((statKey === 'epa_db' || statKey === 'cpoe') && val > 0) {
        displayVal = `+${displayVal}`;
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
  const palette = activeRadarPalette;
  const colors = activeRadarColors;
  const fontSize = Math.max(8, size * 0.025);
  const isMobile = window.innerWidth < 768;
  const defs = svg.append('defs');
  const uid = `radar-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const glowId = `${uid}-glow`;
  const glowBlur = Math.max(1.5, size * 0.006);
  const glow = defs.append('filter')
    .attr('id', glowId)
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
  glow.append('feGaussianBlur').attr('stdDeviation', glowBlur).attr('result', 'blur');
  const glowMerge = glow.append('feMerge');
  glowMerge.append('feMergeNode').attr('in', 'blur');
  glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  const ringGradients = palette.map((gradient, i) => {
    const gradId = `${uid}-ring-${i}`;
    const grad = defs.append('linearGradient')
      .attr('id', gradId)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', -maxRadius)
      .attr('y1', -maxRadius)
      .attr('x2', maxRadius)
      .attr('y2', maxRadius);
    grad.append('stop').attr('offset', '0%').attr('stop-color', gradient.stops[0]).attr('stop-opacity', 0.95);
    grad.append('stop').attr('offset', '55%').attr('stop-color', gradient.stops[1] || gradient.stops[0]).attr('stop-opacity', 0.9);
    grad.append('stop').attr('offset', '100%').attr('stop-color', gradient.stops[2] || gradient.stops[1] || gradient.stops[0]).attr('stop-opacity', 0.95);
    return gradId;
  });
  const strokeWidth = Math.max(1, ringWidth * 0.08);
  data.forEach((d, i) => {
    const rInner = innerRadius + i * ringWidth + gap;
    const rOuter = innerRadius + (i + 1) * ringWidth;
    const color = colors[i % colors.length];
    const gradId = ringGradients[i % ringGradients.length];
    const bgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(2 * Math.PI).cornerRadius(ringWidth / 2);
    svg.append('path')
      .attr('d', bgArc)
      .attr('fill', `url(#${gradId})`)
      .attr('opacity', 0.12);
    const endAngle = (d.value / 100) * 2 * Math.PI;
    const fgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(endAngle).cornerRadius(ringWidth / 2);
    svg.append('path')
      .attr('fill', `url(#${gradId})`)
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-opacity', 0.55)
      .style('filter', `url(#${glowId})`)
      .attr('d', fgArc)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attrTween('d', function() {
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
