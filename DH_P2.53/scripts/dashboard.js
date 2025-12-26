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
    "G": 15,
    "FPTS": 376.8,
    "PPG": 25.12,
    "CSTY%": 0.9333333333,
    "CL": 36.16666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1888,
    "IMP/G": 7.2,
    "SNP%": 0.8292682927,
    "YPC": 3.71,
    "TGT": 116,
    "REC": 92,
    "MTF/A": 0.3428571429,
    "YCO/A": 1.242857143,
    "recYPG": 56.6,
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
    "G": 15,
    "FPTS": 351.44,
    "PPG": 23.42933333,
    "CSTY%": 0.8,
    "CL": 40.42666667,
    "TS%": NaN,
    "CPOE": 0.016,
    "EPA/DB": 0.15,
    "paYPG": 227.0666667,
    "paRTG": 103.32,
    "CMP%": 0.6964705882,
    "TTT": 2.794564706,
    "YDS(t)": 3958,
    "IMP/G": 13.93333333,
    "SNP%": 0.9755351682,
    "YPC": 5.26,
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
    "G": 15,
    "FPTS": 340.2,
    "PPG": 22.68,
    "CSTY%": 0.7333333333,
    "CL": 43.53333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1662,
    "IMP/G": 5.066666667,
    "SNP%": 0.6663201663,
    "YPC": 5.32,
    "TGT": 86,
    "REC": 72,
    "MTF/A": 0.3236714976,
    "YCO/A": 1.623188406,
    "recYPG": 37.33333333,
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
    "G": 15,
    "FPTS": 339.0,
    "PPG": 22.6,
    "CSTY%": 0.8,
    "CL": 40.4,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1840,
    "IMP/G": 6.066666667,
    "SNP%": 0.8370786517,
    "YPC": 5.17,
    "TGT": 47,
    "REC": 41,
    "MTF/A": 0.2951388889,
    "YCO/A": 2.541666667,
    "recYPG": 23.4,
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
    "G": 14,
    "FPTS": 333.3,
    "PPG": 23.80714286,
    "CSTY%": 0.9285714286,
    "CL": 39.4,
    "TS%": 0.279,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1673,
    "IMP/G": 5.428571429,
    "SNP%": 0.6778378378,
    "YPC": 10.13,
    "TGT": 145,
    "REC": 114,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 113.7142857,
    "YPRR": 4.082051282,
    "1DRR": 0.1666666667
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9488,
    "NM": "Jaxon Smith-Njigba",
    "POS": "WR",
    "AGE": 23.6,
    "TM": "SEA",
    "G": 15,
    "FPTS": 329.3,
    "PPG": 21.95333333,
    "CSTY%": 0.9333333333,
    "CL": 31.8,
    "TS%": 0.334,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1673,
    "IMP/G": 4.866666667,
    "SNP%": 0.7674919268,
    "YPC": 5.14,
    "TGT": 143,
    "REC": 104,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 109.1333333,
    "YPRR": 3.906921241,
    "1DRR": 0.1455847255
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9509,
    "NM": "Bijan Robinson",
    "POS": "RB",
    "AGE": 23.7,
    "TM": "ATL",
    "G": 15,
    "FPTS": 323.6,
    "PPG": 21.57333333,
    "CSTY%": 0.8,
    "CL": 32.13333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 2026,
    "IMP/G": 5.866666667,
    "SNP%": 0.7806122449,
    "YPC": 5.0,
    "TGT": 92,
    "REC": 71,
    "MTF/A": 0.336,
    "YCO/A": 2.356,
    "recYPG": 51.73333333,
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
    "G": 15,
    "FPTS": 315.96,
    "PPG": 21.064,
    "CSTY%": 0.6666666667,
    "CL": 28.55333333,
    "TS%": NaN,
    "CPOE": 0.015,
    "EPA/DB": 0.2,
    "paYPG": 278.6,
    "paRTG": 112.06,
    "CMP%": 0.6570327553,
    "TTT": 2.762003854,
    "YDS(t)": 4177,
    "IMP/G": 14.0,
    "SNP%": 0.9849246231,
    "YPC": -0.07,
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
    "SLPR_ID": 11564,
    "NM": "Drake Maye",
    "POS": "QB",
    "AGE": 23.1,
    "TM": "NE",
    "G": 15,
    "FPTS": 311.78,
    "PPG": 20.78533333,
    "CSTY%": 0.8666666667,
    "CL": 26.94,
    "TS%": NaN,
    "CPOE": 0.082,
    "EPA/DB": 0.2,
    "paYPG": 263.1333333,
    "paRTG": 108.48,
    "CMP%": 0.7086092715,
    "TTT": 2.952030905,
    "YDS(t)": 4336,
    "IMP/G": 14.26666667,
    "SNP%": 0.9834881321,
    "YPC": 4.07,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.1333333333,
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
    "G": 15,
    "FPTS": 308.6,
    "PPG": 20.57333333,
    "CSTY%": 1.0,
    "CL": 32.56666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1726,
    "IMP/G": 4.866666667,
    "SNP%": 0.752293578,
    "YPC": 5.76,
    "TGT": 82,
    "REC": 64,
    "MTF/A": 0.3681818182,
    "YCO/A": 3.068181818,
    "recYPG": 30.6,
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
    "G": 15,
    "FPTS": 302.76,
    "PPG": 20.184,
    "CSTY%": 0.7333333333,
    "CL": 34.23333333,
    "TS%": NaN,
    "CPOE": -0.038,
    "EPA/DB": 0.01,
    "paYPG": 232.6,
    "paRTG": 89.89,
    "CMP%": 0.6004056795,
    "TTT": 2.847626775,
    "YDS(t)": 3811,
    "IMP/G": 13.46666667,
    "SNP%": 0.9754901961,
    "YPC": 4.47,
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
    "G": 15,
    "FPTS": 300.4,
    "PPG": 20.02666667,
    "CSTY%": 0.7333333333,
    "CL": 29.1,
    "TS%": NaN,
    "CPOE": 0.055,
    "EPA/DB": 0.12,
    "paYPG": 278.3333333,
    "paRTG": 100.02,
    "CMP%": 0.6847826087,
    "TTT": 2.814963768,
    "YDS(t)": 4329,
    "IMP/G": 14.26666667,
    "SNP%": 0.9769008662,
    "YPC": 3.28,
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
    "SLPR_ID": 6904,
    "NM": "Jalen Hurts",
    "POS": "QB",
    "AGE": 27.1,
    "TM": "PHI",
    "G": 15,
    "FPTS": 296.16,
    "PPG": 19.744,
    "CSTY%": 0.7333333333,
    "CL": 28.42,
    "TS%": NaN,
    "CPOE": 0.035,
    "EPA/DB": 0.03,
    "paYPG": 207.6,
    "paRTG": 100.19,
    "CMP%": 0.6580796253,
    "TTT": 2.958571429,
    "YDS(t)": 3530,
    "IMP/G": 12.26666667,
    "SNP%": 0.9753747323,
    "YPC": 4.08,
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
    "SLPR_ID": 8138,
    "NM": "James Cook",
    "POS": "RB",
    "AGE": 26.0,
    "TM": "BUF",
    "G": 15,
    "FPTS": 292.0,
    "PPG": 19.46666667,
    "CSTY%": 0.7333333333,
    "CL": 30.4,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1820,
    "IMP/G": 5.0,
    "SNP%": 0.6095820591,
    "YPC": 5.34,
    "TGT": 36,
    "REC": 32,
    "MTF/A": 0.2404181185,
    "YCO/A": 2.31010453,
    "recYPG": 19.2,
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
    "G": 15,
    "FPTS": 284.82,
    "PPG": 18.988,
    "CSTY%": 0.6,
    "CL": 31.92666667,
    "TS%": NaN,
    "CPOE": -0.015,
    "EPA/DB": 0.06,
    "paYPG": 240.5333333,
    "paRTG": 88.96,
    "CMP%": 0.6315789474,
    "TTT": 2.877894737,
    "YDS(t)": 3873,
    "IMP/G": 13.06666667,
    "SNP%": 0.9960356789,
    "YPC": 4.02,
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
    "SLPR_ID": 3163,
    "NM": "Jared Goff",
    "POS": "QB",
    "AGE": 31.0,
    "TM": "DET",
    "G": 15,
    "FPTS": 284.74,
    "PPG": 18.98266667,
    "CSTY%": 0.6666666667,
    "CL": 28.64666667,
    "TS%": NaN,
    "CPOE": 0.021,
    "EPA/DB": 0.15,
    "paYPG": 269.0666667,
    "paRTG": 109.38,
    "CMP%": 0.6863905325,
    "TTT": 2.712011834,
    "YDS(t)": 4079,
    "IMP/G": 13.2,
    "SNP%": 0.9833679834,
    "YPC": 2.69,
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
    "G": 15,
    "FPTS": 284.6,
    "PPG": 18.97333333,
    "CSTY%": 0.6,
    "CL": 30.97333333,
    "TS%": NaN,
    "CPOE": -0.073,
    "EPA/DB": 0.04,
    "paYPG": 226.6666667,
    "paRTG": 89.47,
    "CMP%": 0.5780933063,
    "TTT": 3.209472617,
    "YDS(t)": 3786,
    "IMP/G": 12.6,
    "SNP%": 0.9893514037,
    "YPC": 5.13,
    "TGT": 2,
    "REC": 2,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 1.466666667,
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
    "G": 15,
    "FPTS": 284.3,
    "PPG": 18.95333333,
    "CSTY%": 0.7333333333,
    "CL": 36.83333333,
    "TS%": 0.282,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1203,
    "IMP/G": 3.933333333,
    "SNP%": 0.8492723493,
    "YPC": 3.0,
    "TGT": 144,
    "REC": 98,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 79.6,
    "YPRR": 2.45174538,
    "1DRR": 0.09650924025
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6797,
    "NM": "Justin Herbert",
    "POS": "QB",
    "AGE": 27.6,
    "TM": "LAC",
    "G": 15,
    "FPTS": 283.74,
    "PPG": 18.916,
    "CSTY%": 0.4666666667,
    "CL": 29.6,
    "TS%": NaN,
    "CPOE": 0.033,
    "EPA/DB": 0.03,
    "paYPG": 232.7333333,
    "paRTG": 94.71,
    "CMP%": 0.6645833333,
    "TTT": 2.887604167,
    "YDS(t)": 3952,
    "IMP/G": 13.13333333,
    "SNP%": 0.971258672,
    "YPC": 5.99,
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
    "SLPR_ID": 8130,
    "NM": "Trey McBride",
    "POS": "TE",
    "AGE": 25.8,
    "TM": "ARI",
    "G": 15,
    "FPTS": 278.8,
    "PPG": 18.58666667,
    "CSTY%": 0.8,
    "CL": 31.5,
    "TS%": 0.255,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1098,
    "IMP/G": 3.866666667,
    "SNP%": 0.9078431373,
    "YPC": 0.0,
    "TGT": 148,
    "REC": 109,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 73.2,
    "YPRR": 1.902946274,
    "1DRR": 0.08318890815
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8137,
    "NM": "George Pickens",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "DAL",
    "G": 15,
    "FPTS": 278.2,
    "PPG": 18.54666667,
    "CSTY%": 0.8,
    "CL": 31.6,
    "TS%": 0.229,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1342,
    "IMP/G": 4.6,
    "SNP%": 0.8306063523,
    "YPC": 0.0,
    "TGT": 129,
    "REC": 88,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 89.46666667,
    "YPRR": 2.499068901,
    "1DRR": 0.1117318436
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7564,
    "NM": "Ja'Marr Chase",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "CIN",
    "G": 14,
    "FPTS": 265.0,
    "PPG": 18.92857143,
    "CSTY%": 0.6428571429,
    "CL": 34.53333333,
    "TS%": 0.294,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1270,
    "IMP/G": 4.428571429,
    "SNP%": 0.9544950055,
    "YPC": 4.67,
    "TGT": 166,
    "REC": 110,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 89.71428571,
    "YPRR": 2.321626617,
    "1DRR": 0.1053604436
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4892,
    "NM": "Baker Mayfield",
    "POS": "QB",
    "AGE": 30.4,
    "TM": "TB",
    "G": 15,
    "FPTS": 249.26,
    "PPG": 16.61733333,
    "CSTY%": 0.6,
    "CL": 24.05333333,
    "TS%": NaN,
    "CPOE": -0.022,
    "EPA/DB": -0.02,
    "paYPG": 209.6,
    "paRTG": 89.99,
    "CMP%": 0.6163522013,
    "TTT": 2.820377358,
    "YDS(t)": 3479,
    "IMP/G": 11.26666667,
    "SNP%": 0.965,
    "YPC": 6.98,
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
    "SLPR_ID": 8144,
    "NM": "Chris Olave",
    "POS": "WR",
    "AGE": 25.2,
    "TM": "NO",
    "G": 15,
    "FPTS": 243.1,
    "PPG": 16.20666667,
    "CSTY%": 0.7333333333,
    "CL": 28.33333333,
    "TS%": 0.274,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1041,
    "IMP/G": 3.2,
    "SNP%": 0.8363273453,
    "YPC": -3.0,
    "TGT": 145,
    "REC": 92,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 69.6,
    "YPRR": 1.981024668,
    "1DRR": 0.07590132827
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6804,
    "NM": "Jordan Love",
    "POS": "QB",
    "AGE": 26.9,
    "TM": "GB",
    "G": 15,
    "FPTS": 241.14,
    "PPG": 16.076,
    "CSTY%": 0.4,
    "CL": 26.78,
    "TS%": NaN,
    "CPOE": 0.038,
    "EPA/DB": 0.2,
    "paYPG": 225.4,
    "paRTG": 101.18,
    "CMP%": 0.6628701595,
    "TTT": 2.891526196,
    "YDS(t)": 3580,
    "IMP/G": 11.53333333,
    "SNP%": 0.9380902413,
    "YPC": 4.23,
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
    "SLPR_ID": 7543,
    "NM": "Travis Etienne",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "JAX",
    "G": 15,
    "FPTS": 237.9,
    "PPG": 15.86,
    "CSTY%": 0.6666666667,
    "CL": 24.43333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1269,
    "IMP/G": 3.666666667,
    "SNP%": 0.5970588235,
    "YPC": 4.36,
    "TGT": 48,
    "REC": 33,
    "MTF/A": 0.2445414847,
    "YCO/A": 2.222707424,
    "recYPG": 18.0,
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
    "G": 15,
    "FPTS": 236.2,
    "PPG": 15.74666667,
    "CSTY%": 0.6666666667,
    "CL": 25.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1322,
    "IMP/G": 5.066666667,
    "SNP%": 0.6824120603,
    "YPC": 4.7,
    "TGT": 42,
    "REC": 30,
    "MTF/A": 0.2564102564,
    "YCO/A": 1.846153846,
    "recYPG": 14.8,
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
    "G": 14,
    "FPTS": 235.8,
    "PPG": 16.84285714,
    "CSTY%": 0.7857142857,
    "CL": 28.96666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1208,
    "IMP/G": 4.5,
    "SNP%": 0.6099210823,
    "YPC": 4.03,
    "TGT": 43,
    "REC": 35,
    "MTF/A": 0.2652173913,
    "YCO/A": 2.030434783,
    "recYPG": 20.14285714,
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
    "G": 15,
    "FPTS": 234.5,
    "PPG": 15.63333333,
    "CSTY%": 0.6666666667,
    "CL": 25.86666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1225,
    "IMP/G": 4.066666667,
    "SNP%": 0.6759834369,
    "YPC": 4.29,
    "TGT": 79,
    "REC": 62,
    "MTF/A": 0.2538071066,
    "YCO/A": 2.157360406,
    "recYPG": 25.26666667,
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
    "SLPR_ID": 4943,
    "NM": "Sam Darnold",
    "POS": "QB",
    "AGE": 28.3,
    "TM": "SEA",
    "G": 15,
    "FPTS": 233.52,
    "PPG": 15.568,
    "CSTY%": 0.6,
    "CL": 26.7,
    "TS%": NaN,
    "CPOE": 0.046,
    "EPA/DB": 0.08,
    "paYPG": 246.8666667,
    "paRTG": 100.58,
    "CMP%": 0.6721698113,
    "TTT": 2.623915094,
    "YDS(t)": 3787,
    "IMP/G": 11.2,
    "SNP%": 0.9590958019,
    "YPC": 3.23,
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
    "G": 15,
    "FPTS": 231.4,
    "PPG": 15.42666667,
    "CSTY%": 0.7333333333,
    "CL": 24.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1284,
    "IMP/G": 4.666666667,
    "SNP%": 0.7160731473,
    "YPC": 4.8,
    "TGT": 49,
    "REC": 35,
    "MTF/A": 0.2677824268,
    "YCO/A": 2.49790795,
    "recYPG": 9.133333333,
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
    "G": 15,
    "FPTS": 225.5,
    "PPG": 15.03333333,
    "CSTY%": 0.6666666667,
    "CL": 24.33333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1345,
    "IMP/G": 3.666666667,
    "SNP%": 0.7815845824,
    "YPC": 4.11,
    "TGT": 50,
    "REC": 37,
    "MTF/A": 0.2030651341,
    "YCO/A": 1.67816092,
    "recYPG": 18.2,
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
    "G": 15,
    "FPTS": 223.4,
    "PPG": 14.89333333,
    "CSTY%": 0.6,
    "CL": 30.03333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1154,
    "IMP/G": 3.266666667,
    "SNP%": 0.7603211009,
    "YPC": 3.7,
    "TGT": 66,
    "REC": 50,
    "MTF/A": 0.3035714286,
    "YCO/A": 2.25,
    "recYPG": 21.73333333,
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
    "TS%": 0.219,
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
    "SLPR_ID": 3198,
    "NM": "Derrick Henry",
    "POS": "RB",
    "AGE": 31.7,
    "TM": "BAL",
    "G": 15,
    "FPTS": 221.3,
    "PPG": 14.75333333,
    "CSTY%": 0.5333333333,
    "CL": 24.93333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1403,
    "IMP/G": 4.266666667,
    "SNP%": 0.5310033822,
    "YPC": 4.99,
    "TGT": 20,
    "REC": 15,
    "MTF/A": 0.187250996,
    "YCO/A": 2.270916335,
    "recYPG": 10.0,
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
    "G": 14,
    "FPTS": 217.5,
    "PPG": 15.53571429,
    "CSTY%": 0.6428571429,
    "CL": 23.43333333,
    "TS%": 0.222,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1075,
    "IMP/G": 3.285714286,
    "SNP%": 0.7750791975,
    "YPC": 7.5,
    "TGT": 116,
    "REC": 68,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 75.71428571,
    "YPRR": 2.453703704,
    "1DRR": 0.09027777778
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5045,
    "NM": "Courtland Sutton",
    "POS": "WR",
    "AGE": 30.0,
    "TM": "DEN",
    "G": 15,
    "FPTS": 210.2,
    "PPG": 14.01333333,
    "CSTY%": 0.6,
    "CL": 22.9,
    "TS%": 0.203,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 972,
    "IMP/G": 3.266666667,
    "SNP%": 0.8622398414,
    "YPC": 0.0,
    "TGT": 112,
    "REC": 69,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 64.8,
    "YPRR": 1.840909091,
    "1DRR": 0.07954545455
  },
  {
    "SZN": 2025,
    "SLPR_ID": 96,
    "NM": "Aaron Rodgers",
    "POS": "QB",
    "AGE": 41.8,
    "TM": "PIT",
    "G": 14,
    "FPTS": 209.0,
    "PPG": 14.92857143,
    "CSTY%": 0.4285714286,
    "CL": 23.89333333,
    "TS%": NaN,
    "CPOE": -0.008,
    "EPA/DB": -0.03,
    "paYPG": 204.2857143,
    "paRTG": 98.16,
    "CMP%": 0.6674757282,
    "TTT": 2.628131068,
    "YDS(t)": 2886,
    "IMP/G": 8.785714286,
    "SNP%": 0.9498777506,
    "YPC": 1.84,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": -0.6428571429,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5859,
    "NM": "A.J. Brown",
    "POS": "WR",
    "AGE": 28.2,
    "TM": "PHI",
    "G": 14,
    "FPTS": 208.5,
    "PPG": 14.89285714,
    "CSTY%": 0.5714285714,
    "CL": 29.43333333,
    "TS%": 0.265,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 935,
    "IMP/G": 3.142857143,
    "SNP%": 0.9064994299,
    "YPC": 0.0,
    "TGT": 114,
    "REC": 73,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.78571429,
    "YPRR": 2.205188679,
    "1DRR": 0.08726415094
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7021,
    "NM": "Rico Dowdle",
    "POS": "RB",
    "AGE": 27.3,
    "TM": "CAR",
    "G": 15,
    "FPTS": 204.0,
    "PPG": 13.6,
    "CSTY%": 0.4,
    "CL": 31.46666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1280,
    "IMP/G": 4.133333333,
    "SNP%": 0.5538140021,
    "YPC": 4.64,
    "TGT": 43,
    "REC": 34,
    "MTF/A": 0.2073732719,
    "YCO/A": 2.087557604,
    "recYPG": 18.2,
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
    "G": 14,
    "FPTS": 201.64,
    "PPG": 14.40285714,
    "CSTY%": 0.3571428571,
    "CL": 25.56,
    "TS%": NaN,
    "CPOE": -0.006,
    "EPA/DB": -0.06,
    "paYPG": 192.2142857,
    "paRTG": 89.5,
    "CMP%": 0.6348448687,
    "TTT": 2.827374702,
    "YDS(t)": 2881,
    "IMP/G": 10.71428571,
    "SNP%": 0.9598214286,
    "YPC": 4.42,
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
    "SLPR_ID": 12508,
    "NM": "Jaxson Dart",
    "POS": "QB",
    "AGE": 22.4,
    "TM": "NYG",
    "G": 12,
    "FPTS": 201.1,
    "PPG": 16.75833333,
    "CSTY%": 0.6666666667,
    "CL": 27.64666667,
    "TS%": NaN,
    "CPOE": -0.026,
    "EPA/DB": -0.05,
    "paYPG": 152.9166667,
    "paRTG": 89.55,
    "CMP%": 0.6209386282,
    "TTT": 2.750252708,
    "YDS(t)": 2242,
    "IMP/G": 9.166666667,
    "SNP%": 0.7461809636,
    "YPC": 5.65,
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
    "SLPR_ID": 6790,
    "NM": "D'Andre Swift",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "CHI",
    "G": 14,
    "FPTS": 200.9,
    "PPG": 14.35,
    "CSTY%": 0.5714285714,
    "CL": 22.96666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1259,
    "IMP/G": 4.714285714,
    "SNP%": 0.5771248688,
    "YPC": 4.87,
    "TGT": 43,
    "REC": 31,
    "MTF/A": 0.2009803922,
    "YCO/A": 1.852941176,
    "recYPG": 19.0,
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
    "G": 15,
    "FPTS": 200.8,
    "PPG": 13.38666667,
    "CSTY%": 0.6,
    "CL": 25.73333333,
    "TS%": 0.178,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1018,
    "IMP/G": 2.933333333,
    "SNP%": 0.9043659044,
    "YPC": 2.0,
    "TGT": 91,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 67.06666667,
    "YPRR": 1.949612403,
    "1DRR": 0.07170542636
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9997,
    "NM": "Zay Flowers",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "BAL",
    "G": 15,
    "FPTS": 200.5,
    "PPG": 13.36666667,
    "CSTY%": 0.6,
    "CL": 23.3,
    "TS%": 0.279,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1105,
    "IMP/G": 3.0,
    "SNP%": 0.8748590755,
    "YPC": 6.2,
    "TGT": 107,
    "REC": 78,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 69.53333333,
    "YPRR": 2.568965517,
    "1DRR": 0.09852216749
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4881,
    "NM": "Lamar Jackson",
    "POS": "QB",
    "AGE": 28.7,
    "TM": "BAL",
    "G": 12,
    "FPTS": 200.44,
    "PPG": 16.70333333,
    "CSTY%": 0.5,
    "CL": 27.56,
    "TS%": NaN,
    "CPOE": -0.02,
    "EPA/DB": -0.05,
    "paYPG": 192.5833333,
    "paRTG": 101.42,
    "CMP%": 0.6373239437,
    "TTT": 2.988838028,
    "YDS(t)": 2651,
    "IMP/G": 10.58333333,
    "SNP%": 0.9247159091,
    "YPC": 5.4,
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
    "G": 15,
    "FPTS": 199.4,
    "PPG": 13.29333333,
    "CSTY%": 0.4,
    "CL": 23.4,
    "TS%": 0.246,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 924,
    "IMP/G": 3.4,
    "SNP%": 0.8735632184,
    "YPC": 0.0,
    "TGT": 112,
    "REC": 65,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 61.6,
    "YPRR": 1.970149254,
    "1DRR": 0.09381663113
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8228,
    "NM": "Jaylen Warren",
    "POS": "RB",
    "AGE": 26.9,
    "TM": "PIT",
    "G": 14,
    "FPTS": 195.8,
    "PPG": 13.98571429,
    "CSTY%": 0.6428571429,
    "CL": 22.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1128,
    "IMP/G": 4.071428571,
    "SNP%": 0.5256869773,
    "YPC": 4.48,
    "TGT": 40,
    "REC": 35,
    "MTF/A": 0.3243243243,
    "YCO/A": 2.27027027,
    "recYPG": 21.42857143,
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
    "G": 15,
    "FPTS": 195.7,
    "PPG": 13.04666667,
    "CSTY%": 0.6,
    "CL": 21.6,
    "TS%": 0.216,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 757,
    "IMP/G": 3.0,
    "SNP%": 0.8483146067,
    "YPC": 0.0,
    "TGT": 104,
    "REC": 76,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 50.46666667,
    "YPRR": 1.674778761,
    "1DRR": 0.08407079646
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8126,
    "NM": "Wan'Dale Robinson",
    "POS": "WR",
    "AGE": 24.7,
    "TM": "NYG",
    "G": 15,
    "FPTS": 195.6,
    "PPG": 13.04,
    "CSTY%": 0.4666666667,
    "CL": 26.4,
    "TS%": 0.272,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 906,
    "IMP/G": 2.333333333,
    "SNP%": 0.92039801,
    "YPC": 1.67,
    "TGT": 126,
    "REC": 81,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 60.06666667,
    "YPRR": 1.900843882,
    "1DRR": 0.06329113924
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7553,
    "NM": "Kyle Pitts",
    "POS": "TE",
    "AGE": 25.0,
    "TM": "ATL",
    "G": 15,
    "FPTS": 195.4,
    "PPG": 13.02666667,
    "CSTY%": 0.5333333333,
    "CL": 27.43333333,
    "TS%": 0.215,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 854,
    "IMP/G": 2.933333333,
    "SNP%": 0.8714285714,
    "YPC": 0.0,
    "TGT": 106,
    "REC": 80,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.93333333,
    "YPRR": 1.790356394,
    "1DRR": 0.08176100629
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7567,
    "NM": "Kenneth Gainwell",
    "POS": "RB",
    "AGE": 26.5,
    "TM": "PIT",
    "G": 15,
    "FPTS": 194.1,
    "PPG": 12.94,
    "CSTY%": 0.4,
    "CL": 28.23333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 911,
    "IMP/G": 3.266666667,
    "SNP%": 0.4741573034,
    "YPC": 4.91,
    "TGT": 72,
    "REC": 62,
    "MTF/A": 0.2941176471,
    "YCO/A": 2.176470588,
    "recYPG": 27.33333333,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7526,
    "NM": "Jaylen Waddle",
    "POS": "WR",
    "AGE": 26.8,
    "TM": "MIA",
    "G": 15,
    "FPTS": 193.42,
    "PPG": 12.89466667,
    "CSTY%": 0.6,
    "CL": 21.1,
    "TS%": 0.229,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.5333333333,
    "paRTG": 100.0,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 939,
    "IMP/G": 3.266666667,
    "SNP%": 0.8142201835,
    "YPC": 21.0,
    "TGT": 99,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 60.66666667,
    "YPRR": 2.375979112,
    "1DRR": 0.1096605744
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6786,
    "NM": "CeeDee Lamb",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "DAL",
    "G": 12,
    "FPTS": 189.9,
    "PPG": 15.825,
    "CSTY%": 0.75,
    "CL": 22.13333333,
    "TS%": 0.188,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1029,
    "IMP/G": 3.333333333,
    "SNP%": 0.7333333333,
    "YPC": 2.0,
    "TGT": 106,
    "REC": 69,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 85.58333333,
    "YPRR": 2.674479167,
    "1DRR": 0.09635416667
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7525,
    "NM": "DeVonta Smith",
    "POS": "WR",
    "AGE": 26.9,
    "TM": "PHI",
    "G": 15,
    "FPTS": 189.1,
    "PPG": 12.60666667,
    "CSTY%": 0.4666666667,
    "CL": 24.23333333,
    "TS%": 0.242,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 931,
    "IMP/G": 2.666666667,
    "SNP%": 0.891862955,
    "YPC": 0.0,
    "TGT": 104,
    "REC": 72,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 62.06666667,
    "YPRR": 2.050660793,
    "1DRR": 0.07929515419
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12514,
    "NM": "Emeka Egbuka",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "TB",
    "G": 15,
    "FPTS": 188.9,
    "PPG": 12.59333333,
    "CSTY%": 0.4,
    "CL": 26.13333333,
    "TS%": 0.242,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 919,
    "IMP/G": 2.266666667,
    "SNP%": 0.808,
    "YPC": 4.5,
    "TGT": 119,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 60.66666667,
    "YPRR": 1.986899563,
    "1DRR": 0.06113537118
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5846,
    "NM": "DK Metcalf",
    "POS": "WR",
    "AGE": 27.8,
    "TM": "PIT",
    "G": 15,
    "FPTS": 187.2,
    "PPG": 12.48,
    "CSTY%": 0.5333333333,
    "CL": 21.63333333,
    "TS%": 0.213,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 862,
    "IMP/G": 2.533333333,
    "SNP%": 0.8719101124,
    "YPC": 6.0,
    "TGT": 99,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.66666667,
    "YPRR": 1.868131868,
    "1DRR": 0.06813186813
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8155,
    "NM": "Breece Hall",
    "POS": "RB",
    "AGE": 24.3,
    "TM": "NYJ",
    "G": 15,
    "FPTS": 186.76,
    "PPG": 12.45066667,
    "CSTY%": 0.4666666667,
    "CL": 23.28666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.2666666667,
    "paRTG": 122.92,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 1290,
    "IMP/G": 4.4,
    "SNP%": 0.6503198294,
    "YPC": 4.17,
    "TGT": 45,
    "REC": 34,
    "MTF/A": 0.192139738,
    "YCO/A": 1.855895197,
    "recYPG": 22.13333333,
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
    "G": 15,
    "FPTS": 183.7,
    "PPG": 12.24666667,
    "CSTY%": 0.4,
    "CL": 22.73333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 787,
    "IMP/G": 2.6,
    "SNP%": 0.3974231913,
    "YPC": 4.01,
    "TGT": 48,
    "REC": 41,
    "MTF/A": 0.264957265,
    "YCO/A": 1.846153846,
    "recYPG": 21.2,
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
    "G": 12,
    "FPTS": 183.52,
    "PPG": 15.29333333,
    "CSTY%": 0.3333333333,
    "CL": 24.96,
    "TS%": NaN,
    "CPOE": 0.014,
    "EPA/DB": 0.08,
    "paYPG": 219.0,
    "paRTG": 93.57,
    "CMP%": 0.6532258065,
    "TTT": 2.840672043,
    "YDS(t)": 2832,
    "IMP/G": 11.41666667,
    "SNP%": 0.922235723,
    "YPC": 4.86,
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
    "SLPR_ID": 6801,
    "NM": "Tee Higgins",
    "POS": "WR",
    "AGE": 26.7,
    "TM": "CIN",
    "G": 13,
    "FPTS": 183.0,
    "PPG": 14.07692308,
    "CSTY%": 0.4615384615,
    "CL": 27.3,
    "TS%": 0.149,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 720,
    "IMP/G": 2.692307692,
    "SNP%": 0.8252788104,
    "YPC": 0.0,
    "TGT": 84,
    "REC": 49,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 55.38461538,
    "YPRR": 1.617977528,
    "1DRR": 0.05617977528
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8112,
    "NM": "Drake London",
    "POS": "WR",
    "AGE": 24.2,
    "TM": "ATL",
    "G": 10,
    "FPTS": 182.7,
    "PPG": 18.27,
    "CSTY%": 0.6,
    "CL": 31.86666667,
    "TS%": 0.207,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 837,
    "IMP/G": 4.1,
    "SNP%": 0.8925373134,
    "YPC": 0.0,
    "TGT": 102,
    "REC": 63,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 83.7,
    "YPRR": 2.567484663,
    "1DRR": 0.1073619632
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1373,
    "NM": "Geno Smith",
    "POS": "QB",
    "AGE": 35.0,
    "TM": "LV",
    "G": 14,
    "FPTS": 181.76,
    "PPG": 12.98285714,
    "CSTY%": 0.2142857143,
    "CL": 23.93333333,
    "TS%": NaN,
    "CPOE": "-",
    "EPA/DB": "-",
    "paYPG": 203.5,
    "paRTG": 85.7,
    "CMP%": 0.6714285714,
    "TTT": 2.821809524,
    "YDS(t)": 2957,
    "IMP/G": 10.92857143,
    "SNP%": 0.9759036145,
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
    "SLPR_ID": 2449,
    "NM": "Stefon Diggs",
    "POS": "WR",
    "AGE": 31.8,
    "TM": "NE",
    "G": 15,
    "FPTS": 180.9,
    "PPG": 12.06,
    "CSTY%": 0.4666666667,
    "CL": 22.3,
    "TS%": 0.204,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 869,
    "IMP/G": 3.0,
    "SNP%": 0.5428276574,
    "YPC": 0.0,
    "TGT": 93,
    "REC": 76,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 57.93333333,
    "YPRR": 2.533527697,
    "1DRR": 0.1224489796
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12529,
    "NM": "TreVeyon Henderson",
    "POS": "RB",
    "AGE": 22.9,
    "TM": "NE",
    "G": 15,
    "FPTS": 180.7,
    "PPG": 12.04666667,
    "CSTY%": 0.3333333333,
    "CL": 30.13333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 997,
    "IMP/G": 2.933333333,
    "SNP%": 0.4571723426,
    "YPC": 5.24,
    "TGT": 42,
    "REC": 35,
    "MTF/A": 0.3108108108,
    "YCO/A": 2.222972973,
    "recYPG": 14.73333333,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1466,
    "NM": "Travis Kelce",
    "POS": "TE",
    "AGE": 36.0,
    "TM": "KC",
    "G": 15,
    "FPTS": 180.4,
    "PPG": 12.02666667,
    "CSTY%": 0.5333333333,
    "CL": 21.7,
    "TS%": 0.181,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 804,
    "IMP/G": 2.8,
    "SNP%": 0.8041749503,
    "YPC": 1.0,
    "TGT": 96,
    "REC": 68,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 53.53333333,
    "YPRR": 1.697674419,
    "1DRR": 0.07822410148
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10232,
    "NM": "Michael Wilson",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "ARI",
    "G": 15,
    "FPTS": 179.8,
    "PPG": 11.98666667,
    "CSTY%": 0.3333333333,
    "CL": 30.83333333,
    "TS%": 0.186,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 818,
    "IMP/G": 2.866666667,
    "SNP%": 0.8068627451,
    "YPC": 0.0,
    "TGT": 108,
    "REC": 68,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 54.53333333,
    "YPRR": 1.543396226,
    "1DRR": 0.07169811321
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8110,
    "NM": "Jake Ferguson",
    "POS": "TE",
    "AGE": 26.7,
    "TM": "DAL",
    "G": 15,
    "FPTS": 179.0,
    "PPG": 11.93333333,
    "CSTY%": 0.5333333333,
    "CL": 22.33333333,
    "TS%": 0.174,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 590,
    "IMP/G": 1.933333333,
    "SNP%": 0.6987487969,
    "YPC": 1.0,
    "TGT": 98,
    "REC": 80,
    "MTF/A": NaN,
    "YCO/A": 1.0,
    "recYPG": 39.26666667,
    "YPRR": 1.354022989,
    "1DRR": 0.05057471264
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11635,
    "NM": "Ladd McConkey",
    "POS": "WR",
    "AGE": 23.9,
    "TM": "LAC",
    "G": 15,
    "FPTS": 176.8,
    "PPG": 11.78666667,
    "CSTY%": 0.5333333333,
    "CL": 21.5,
    "TS%": 0.211,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 758,
    "IMP/G": 2.266666667,
    "SNP%": 0.775024777,
    "YPC": 0.0,
    "TGT": 104,
    "REC": 65,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 50.53333333,
    "YPRR": 1.534412955,
    "1DRR": 0.05668016194
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11604,
    "NM": "Brock Bowers",
    "POS": "TE",
    "AGE": 22.8,
    "TM": "LV",
    "G": 12,
    "FPTS": 176.2,
    "PPG": 14.68333333,
    "CSTY%": 0.5833333333,
    "CL": 26.96666667,
    "TS%": 0.187,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 682,
    "IMP/G": 3.0,
    "SNP%": 0.854519774,
    "YPC": 1.0,
    "TGT": 86,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": 1.5,
    "recYPG": 56.66666667,
    "YPRR": 1.818181818,
    "1DRR": 0.07754010695
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6794,
    "NM": "Justin Jefferson",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "MIN",
    "G": 15,
    "FPTS": 176.1,
    "PPG": 11.74,
    "CSTY%": 0.5333333333,
    "CL": 19.53333333,
    "TS%": 0.286,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 921,
    "IMP/G": 2.733333333,
    "SNP%": 0.9511363636,
    "YPC": 4.0,
    "TGT": 125,
    "REC": 72,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 61.13333333,
    "YPRR": 1.922431866,
    "1DRR": 0.08176100629
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
    "SNP%": 0.9569495695,
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
    "SLPR_ID": 12506,
    "NM": "Harold Fannin",
    "POS": "TE",
    "AGE": 21.2,
    "TM": "CLE",
    "G": 15,
    "FPTS": 175.4,
    "PPG": 11.69333333,
    "CSTY%": 0.5333333333,
    "CL": 21.1,
    "TS%": 0.205,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 714,
    "IMP/G": 2.2,
    "SNP%": 0.7906026558,
    "YPC": 1.86,
    "TGT": 105,
    "REC": 70,
    "MTF/A": NaN,
    "YCO/A": 0.8571428571,
    "recYPG": 46.73333333,
    "YPRR": 1.705596107,
    "1DRR": 0.06326034063
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5022,
    "NM": "Dallas Goedert",
    "POS": "TE",
    "AGE": 30.7,
    "TM": "PHI",
    "G": 14,
    "FPTS": 175.3,
    "PPG": 12.52142857,
    "CSTY%": 0.5,
    "CL": 23.56666667,
    "TS%": 0.177,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 583,
    "IMP/G": 2.357142857,
    "SNP%": 0.8512585812,
    "YPC": 0.0,
    "TGT": 76,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.64285714,
    "YPRR": 1.563002681,
    "1DRR": 0.06166219839
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5872,
    "NM": "Deebo Samuel",
    "POS": "WR",
    "AGE": 29.7,
    "TM": "WAS",
    "G": 14,
    "FPTS": 172.8,
    "PPG": 12.34285714,
    "CSTY%": 0.4285714286,
    "CL": 22.3,
    "TS%": 0.212,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 688,
    "IMP/G": 2.285714286,
    "SNP%": 0.7185354691,
    "YPC": 3.77,
    "TGT": 90,
    "REC": 68,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.64285714,
    "YPRR": 1.815340909,
    "1DRR": 0.06818181818
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12518,
    "NM": "Tyler Warren",
    "POS": "TE",
    "AGE": 23.4,
    "TM": "IND",
    "G": 15,
    "FPTS": 171.6,
    "PPG": 11.44,
    "CSTY%": 0.5333333333,
    "CL": 18.16666667,
    "TS%": 0.206,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 756,
    "IMP/G": 2.6,
    "SNP%": 0.8359550562,
    "YPC": 1.33,
    "TGT": 99,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": 0.5,
    "recYPG": 49.86666667,
    "YPRR": 1.772511848,
    "1DRR": 0.07582938389
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11627,
    "NM": "Troy Franklin",
    "POS": "WR",
    "AGE": 22.6,
    "TM": "DEN",
    "G": 15,
    "FPTS": 171.4,
    "PPG": 11.42666667,
    "CSTY%": 0.4,
    "CL": 23.9,
    "TS%": 0.179,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 704,
    "IMP/G": 2.133333333,
    "SNP%": 0.6124876115,
    "YPC": 2.4,
    "TGT": 99,
    "REC": 61,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.13333333,
    "YPRR": 1.628235294,
    "1DRR": 0.05647058824
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12512,
    "NM": "Quinshon Judkins",
    "POS": "RB",
    "AGE": 21.9,
    "TM": "CLE",
    "G": 14,
    "FPTS": 169.8,
    "PPG": 12.12857143,
    "CSTY%": 0.4285714286,
    "CL": 21.53333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 998,
    "IMP/G": 4.071428571,
    "SNP%": 0.5005537099,
    "YPC": 3.6,
    "TGT": 36,
    "REC": 26,
    "MTF/A": 0.1956521739,
    "YCO/A": 2.195652174,
    "recYPG": 12.21428571,
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
    "G": 15,
    "FPTS": 169.4,
    "PPG": 11.29333333,
    "CSTY%": 0.2666666667,
    "CL": 22.73333333,
    "TS%": 0.215,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 724,
    "IMP/G": 3.066666667,
    "SNP%": 0.5510406343,
    "YPC": 0.0,
    "TGT": 106,
    "REC": 73,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.26666667,
    "YPRR": 1.875647668,
    "1DRR": 0.1088082902
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12522,
    "NM": "Cam Ward",
    "POS": "QB",
    "AGE": 23.3,
    "TM": "TEN",
    "G": 15,
    "FPTS": 167.44,
    "PPG": 11.16266667,
    "CSTY%": 0.1333333333,
    "CL": 18.98666667,
    "TS%": NaN,
    "CPOE": "-",
    "EPA/DB": "-",
    "paYPG": 191.0666667,
    "paRTG": 79.1,
    "CMP%": 0.6016096579,
    "TTT": 2.907545272,
    "YDS(t)": 3004,
    "IMP/G": 10.2,
    "SNP%": 1.0,
    "YPC": 3.94,
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
    "SLPR_ID": 8151,
    "NM": "Kenneth Walker III",
    "POS": "RB",
    "AGE": 24.9,
    "TM": "SEA",
    "G": 15,
    "FPTS": 166.9,
    "PPG": 11.12666667,
    "CSTY%": 0.4,
    "CL": 21.43333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1119,
    "IMP/G": 3.333333333,
    "SNP%": 0.471474704,
    "YPC": 4.63,
    "TGT": 30,
    "REC": 25,
    "MTF/A": 0.3,
    "YCO/A": 1.789473684,
    "recYPG": 16.0,
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
    "G": 15,
    "FPTS": 166.38,
    "PPG": 11.092,
    "CSTY%": 0.3333333333,
    "CL": 23.09333333,
    "TS%": 0.156,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.1333333333,
    "paRTG": 118.75,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 745,
    "IMP/G": 2.466666667,
    "SNP%": 0.8431752178,
    "YPC": 5.27,
    "TGT": 78,
    "REC": 48,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.26666667,
    "YPRR": 1.440347072,
    "1DRR": 0.05422993492
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5967,
    "NM": "Tony Pollard",
    "POS": "RB",
    "AGE": 28.4,
    "TM": "TEN",
    "G": 15,
    "FPTS": 164.8,
    "PPG": 10.98666667,
    "CSTY%": 0.3333333333,
    "CL": 20.36666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1128,
    "IMP/G": 3.333333333,
    "SNP%": 0.6314655172,
    "YPC": 4.52,
    "TGT": 36,
    "REC": 28,
    "MTF/A": 0.2761904762,
    "YCO/A": 1.747619048,
    "recYPG": 11.93333333,
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
    "G": 15,
    "FPTS": 161.5,
    "PPG": 10.76666667,
    "CSTY%": 0.5333333333,
    "CL": 19.56666667,
    "TS%": 0.188,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 685,
    "IMP/G": 2.4,
    "SNP%": 0.7185978578,
    "YPC": 0.0,
    "TGT": 98,
    "REC": 75,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.66666667,
    "YPRR": 1.634844869,
    "1DRR": 0.07875894988
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7002,
    "NM": "Juwan Johnson",
    "POS": "TE",
    "AGE": 29.0,
    "TM": "NO",
    "G": 15,
    "FPTS": 159.3,
    "PPG": 10.62,
    "CSTY%": 0.4666666667,
    "CL": 17.33333333,
    "TS%": 0.176,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 733,
    "IMP/G": 2.4,
    "SNP%": 0.7584830339,
    "YPC": 0.0,
    "TGT": 93,
    "REC": 70,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.86666667,
    "YPRR": 1.665909091,
    "1DRR": 0.075
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5947,
    "NM": "Jakobi Meyers",
    "POS": "WR",
    "AGE": 28.9,
    "TM": "JAX",
    "G": 14,
    "FPTS": 158.5,
    "PPG": 11.32142857,
    "CSTY%": 0.4285714286,
    "CL": 18.0,
    "TS%": 0.192,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 765,
    "IMP/G": 2.785714286,
    "SNP%": 0.8452115813,
    "YPC": 2.6,
    "TGT": 95,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 53.71428571,
    "YPRR": 1.744779582,
    "1DRR": 0.08120649652
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8134,
    "NM": "Khalil Shakir",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "BUF",
    "G": 15,
    "FPTS": 156.9,
    "PPG": 10.46,
    "CSTY%": 0.4,
    "CL": 18.56666667,
    "TS%": 0.204,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 689,
    "IMP/G": 1.8,
    "SNP%": 0.5871559633,
    "YPC": 5.0,
    "TGT": 88,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.6,
    "YPRR": 1.965517241,
    "1DRR": 0.06609195402
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9754,
    "NM": "Quentin Johnston",
    "POS": "WR",
    "AGE": 24.1,
    "TM": "LAC",
    "G": 13,
    "FPTS": 156.4,
    "PPG": 12.03076923,
    "CSTY%": 0.4615384615,
    "CL": 23.03333333,
    "TS%": 0.154,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 644,
    "IMP/G": 1.769230769,
    "SNP%": 0.7690557452,
    "YPC": 3.5,
    "TGT": 77,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 49.0,
    "YPRR": 1.505910165,
    "1DRR": 0.03546099291
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8121,
    "NM": "Romeo Doubs",
    "POS": "WR",
    "AGE": 25.5,
    "TM": "GB",
    "G": 15,
    "FPTS": 156.2,
    "PPG": 10.41333333,
    "CSTY%": 0.3333333333,
    "CL": 21.76666667,
    "TS%": 0.181,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 662,
    "IMP/G": 2.533333333,
    "SNP%": 0.7901364113,
    "YPC": 0.0,
    "TGT": 82,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.13333333,
    "YPRR": 1.75596817,
    "1DRR": 0.0848806366
  },
  {
    "SZN": 2025,
    "SLPR_ID": 19,
    "NM": "Joe Flacco",
    "POS": "QB",
    "AGE": 40.7,
    "TM": "CIN",
    "G": 11,
    "FPTS": 155.3,
    "PPG": 14.11818182,
    "CSTY%": 0.3636363636,
    "CL": 27.66666667,
    "TS%": NaN,
    "CPOE": "-",
    "EPA/DB": "-",
    "paYPG": 223.1818182,
    "paRTG": 79.28,
    "CMP%": 0.603406326,
    "TTT": 2.734136253,
    "YDS(t)": 2486,
    "IMP/G": 11.0,
    "SNP%": 0.6556741028,
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
    "SLPR_ID": 5892,
    "NM": "David Montgomery",
    "POS": "RB",
    "AGE": 28.3,
    "TM": "DET",
    "G": 15,
    "FPTS": 154.42,
    "PPG": 10.29466667,
    "CSTY%": 0.3333333333,
    "CL": 20.64,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.2,
    "paRTG": 95.83,
    "CMP%": 0.5,
    "TTT": NaN,
    "YDS(t)": 816,
    "IMP/G": 3.066666667,
    "SNP%": 0.369022869,
    "YPC": 4.64,
    "TGT": 26,
    "REC": 21,
    "MTF/A": 0.2785714286,
    "YCO/A": 2.242857143,
    "recYPG": 10.93333333,
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
    "G": 15,
    "FPTS": 154.3,
    "PPG": 10.28666667,
    "CSTY%": 0.3333333333,
    "CL": 23.0,
    "TS%": 0.174,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 663,
    "IMP/G": 2.466666667,
    "SNP%": 0.8173374613,
    "YPC": 0.0,
    "TGT": 79,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.2,
    "YPRR": 1.691326531,
    "1DRR": 0.07908163265
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8142,
    "NM": "Alec Pierce",
    "POS": "WR",
    "AGE": 25.4,
    "TM": "IND",
    "G": 13,
    "FPTS": 154.1,
    "PPG": 11.85384615,
    "CSTY%": 0.4615384615,
    "CL": 20.26666667,
    "TS%": 0.15,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 871,
    "IMP/G": 2.923076923,
    "SNP%": 0.8636959371,
    "YPC": 0.0,
    "TGT": 72,
    "REC": 43,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 67.0,
    "YPRR": 2.216284987,
    "1DRR": 0.08651399491
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4217,
    "NM": "George Kittle",
    "POS": "TE",
    "AGE": 32.0,
    "TM": "SF",
    "G": 10,
    "FPTS": 153.6,
    "PPG": 15.36,
    "CSTY%": 0.7,
    "CL": 24.2,
    "TS%": 0.121,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 596,
    "IMP/G": 3.5,
    "SNP%": 0.8071672355,
    "YPC": -3.0,
    "TGT": 62,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 59.9,
    "YPRR": 2.465020576,
    "1DRR": 0.1152263374
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7049,
    "NM": "Jauan Jennings",
    "POS": "WR",
    "AGE": 28.2,
    "TM": "SF",
    "G": 13,
    "FPTS": 153.6,
    "PPG": 11.81538462,
    "CSTY%": 0.5384615385,
    "CL": 18.9,
    "TS%": 0.156,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 566,
    "IMP/G": 2.538461538,
    "SNP%": 0.8068181818,
    "YPC": 0.0,
    "TGT": 80,
    "REC": 49,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 43.53846154,
    "YPRR": 1.493403694,
    "1DRR": 0.06596306069
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8676,
    "NM": "Rashid Shaheed",
    "POS": "WR",
    "AGE": 27.1,
    "TM": "SEA",
    "G": 16,
    "FPTS": 153.6,
    "PPG": 9.6,
    "CSTY%": 0.25,
    "CL": 17.76666667,
    "TS%": 0.21,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 746,
    "IMP/G": 2.0,
    "SNP%": 0.6426484907,
    "YPC": 7.67,
    "TGT": 90,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 42.3125,
    "YPRR": 1.56712963,
    "1DRR": 0.0625
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
    "TS%": 0.147,
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
    "SLPR_ID": 10213,
    "NM": "Tre Tucker",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "LV",
    "G": 15,
    "FPTS": 146.4,
    "PPG": 9.76,
    "CSTY%": 0.2666666667,
    "CL": 23.0,
    "TS%": 0.174,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 664,
    "IMP/G": 1.933333333,
    "SNP%": 0.9426605505,
    "YPC": 5.88,
    "TGT": 80,
    "REC": 50,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.13333333,
    "YPRR": 1.243951613,
    "1DRR": 0.04838709677
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
// Custom ring mids (exact colors per ring, inner -> outer)
const QB_CUSTOM_RING_MIDS = ['#ff0aa5ff', '#fe26f7ff', '#d747ffff', '#a74effff', '#7866FF', '#4D79FF', '#00a9f1ff', '#00DDFA'];
const RB_CUSTOM_RING_MIDS = ['#e8d058ff', '#FFB847', '#FF916B', '#FF6B6B', '#f94d95ff', '#CE34F9', '#8F33FF', '#7B5CFF'];
const WR_CUSTOM_RING_MIDS = ['#00FF99', '#3ffdbeff', '#69D6FF', '#52ACF8', '#5882D6', '#6053D5', '#5F03DF', '#3A0CA3'];
const TE_CUSTOM_RING_MIDS = ['#00FF99', '#00FFCC', '#0099FF', '#0066ffff', '#4c00ffff', '#5D00FF', '#8F00FF', '#D200FF'];
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
if (RB_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.RB = buildPaletteFromMids(RB_CUSTOM_RING_MIDS);
}
if (WR_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.WR = buildPaletteFromMids(WR_CUSTOM_RING_MIDS);
}
if (TE_CUSTOM_RING_MIDS.length) {
  RADAR_PALETTES.TE = buildPaletteFromMids(TE_CUSTOM_RING_MIDS);
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
    dot.style.boxShadow = `0 0 3px ${hexToRgba(mid, 0.18)}`;
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
  const gap = size * (window.innerWidth < 768 ? 0.009 : 0.005);
  const palette = activeRadarPalette;
  const colors = activeRadarColors;
  const fontSize = Math.max(8, size * 0.025);
  const isMobile = window.innerWidth < 768;
  const strokeWidth = Math.max(1, ringWidth * 0.08);
  data.forEach((d, i) => {
    const rInner = innerRadius + i * ringWidth + gap;
    const rOuter = innerRadius + (i + 1) * ringWidth;
    const color = colors[i % colors.length];
    const bgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(2 * Math.PI).cornerRadius(ringWidth / 2);
    svg.append('path')
      .attr('d', bgArc)
      .attr('fill', color)
      .attr('opacity', 0.12);
    const maxFill = 0.97;
    const endAngle = (d.value / 100) * 2 * Math.PI * maxFill;
    const fgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(endAngle).cornerRadius(ringWidth / 2);
    svg.append('path')
      .attr('fill', color)
      .attr('fill-opacity', 0.95)
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-opacity', 0.6)
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
