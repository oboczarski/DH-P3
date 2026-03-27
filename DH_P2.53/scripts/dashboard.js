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
    "G": 17,
    "FPTS": 416.6,
    "PPG": 24.50588235,
    "CSTY%": 0.8823529412,
    "CL": 36.16666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 2126,
    "IMP/G": 7.0,
    "SNP%": 0.8299198575,
    "YPC": 3.86,
    "TGT": 129,
    "REC": 102,
    "MTF/A": 0.3633440514,
    "YCO/A": 3.141800643,
    "recYPG": 54.35294118,
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
    "G": 16,
    "FPTS": 375.0,
    "PPG": 23.4375,
    "CSTY%": 0.9375,
    "CL": 39.4,
    "TS%": 0.278,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1820,
    "IMP/G": 5.3125,
    "SNP%": 0.6818181818,
    "YPC": 10.5,
    "TGT": 166,
    "REC": 129,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 107.1875,
    "YPRR": 3.77753304,
    "1DRR": 0.154185022
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4984,
    "NM": "Josh Allen",
    "POS": "QB",
    "AGE": 29.4,
    "TM": "BUF",
    "G": 17,
    "FPTS": 374.62,
    "PPG": 22.03647059,
    "CSTY%": 0.7647058824,
    "CL": 40.42666667,
    "TS%": NaN,
    "CPOE": 0.015,
    "EPA/DB": 0.1,
    "paYPG": 215.7647059,
    "paRTG": 102.16,
    "CMP%": 0.6934782609,
    "TTT": 2.581934783,
    "YDS(t)": 4247,
    "IMP/G": 13.11764706,
    "SNP%": 0.9772942289,
    "YPC": 5.17,
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
    "G": 17,
    "FPTS": 370.8,
    "PPG": 21.81176471,
    "CSTY%": 0.7647058824,
    "CL": 35.33333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 2298,
    "IMP/G": 5.705882353,
    "SNP%": 0.7812197483,
    "YPC": 5.15,
    "TGT": 103,
    "REC": 79,
    "MTF/A": 0.3728222997,
    "YCO/A": 3.907665505,
    "recYPG": 48.23529412,
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
    "G": 17,
    "FPTS": 366.9,
    "PPG": 21.58235294,
    "CSTY%": 0.7058823529,
    "CL": 43.53333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1839,
    "IMP/G": 4.941176471,
    "SNP%": 0.6676413255,
    "YPC": 5.03,
    "TGT": 94,
    "REC": 77,
    "MTF/A": 0.329218107,
    "YCO/A": 3.060493827,
    "recYPG": 36.23529412,
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
    "G": 17,
    "FPTS": 362.3,
    "PPG": 21.31176471,
    "CSTY%": 0.7647058824,
    "CL": 40.4,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1963,
    "IMP/G": 5.823529412,
    "SNP%": 0.8430983118,
    "YPC": 4.91,
    "TGT": 55,
    "REC": 46,
    "MTF/A": 0.3095975232,
    "YCO/A": 3.792260062,
    "recYPG": 22.23529412,
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
    "G": 17,
    "FPTS": 359.96,
    "PPG": 21.17411765,
    "CSTY%": 0.8235294118,
    "CL": 28.98666667,
    "TS%": NaN,
    "CPOE": 0.091,
    "EPA/DB": 0.25,
    "paYPG": 258.4705882,
    "paRTG": 113.48,
    "CMP%": 0.7195121951,
    "TTT": 2.970162602,
    "YDS(t)": 4846,
    "IMP/G": 14.17647059,
    "SNP%": 0.9710144928,
    "YPC": 4.37,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 0.1176470588,
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
    "G": 17,
    "FPTS": 359.9,
    "PPG": 21.17058824,
    "CSTY%": 0.9411764706,
    "CL": 31.8,
    "TS%": 0.339,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1829,
    "IMP/G": 4.764705882,
    "SNP%": 0.7791353383,
    "YPC": 5.14,
    "TGT": 163,
    "REC": 119,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 105.4705882,
    "YPRR": 3.751046025,
    "1DRR": 0.1443514644
  },
  {
    "SZN": 2025,
    "SLPR_ID": 421,
    "NM": "Matthew Stafford",
    "POS": "QB",
    "AGE": 37.6,
    "TM": "LAR",
    "G": 17,
    "FPTS": 358.38,
    "PPG": 21.08117647,
    "CSTY%": 0.63,
    "CL": 28.15,
    "TS%": NaN,
    "CPOE": 0.015,
    "EPA/DB": 0.2,
    "paYPG": 276.8823529,
    "paRTG": 109.2,
    "CMP%": 0.6499162479,
    "TTT": 2.798994975,
    "YDS(t)": 4708,
    "IMP/G": 13.88235294,
    "SNP%": 0.9858490566,
    "YPC": 0.03,
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
    "G": 17,
    "FPTS": 350.18,
    "PPG": 20.59882353,
    "CSTY%": 0.7647058824,
    "CL": 34.23333333,
    "TS%": NaN,
    "CPOE": -0.027,
    "EPA/DB": 0.04,
    "paYPG": 235.7058824,
    "paRTG": 90.97,
    "CMP%": 0.6089285714,
    "TTT": 2.866982143,
    "YDS(t)": 4366,
    "IMP/G": 13.76470588,
    "SNP%": 0.9770431589,
    "YPC": 4.38,
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
    "G": 17,
    "FPTS": 325.18,
    "PPG": 19.12823529,
    "CSTY%": 0.6470588235,
    "CL": 32.17,
    "TS%": NaN,
    "CPOE": -0.069,
    "EPA/DB": 0.05,
    "paYPG": 231.8823529,
    "paRTG": 90.13,
    "CMP%": 0.5809859155,
    "TTT": 3.194542254,
    "YDS(t)": 4347,
    "IMP/G": 12.76470588,
    "SNP%": 0.9899909008,
    "YPC": 4.97,
    "TGT": 2,
    "REC": 2,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 1.294117647,
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
    "G": 17,
    "FPTS": 324.0,
    "PPG": 19.05882353,
    "CSTY%": 0.7647058824,
    "CL": 36.83333333,
    "TS%": 0.296,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1410,
    "IMP/G": 4.235294118,
    "SNP%": 0.8479532164,
    "YPC": 3.0,
    "TGT": 172,
    "REC": 117,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 82.41176471,
    "YPRR": 2.497326203,
    "1DRR": 0.1069518717
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3294,
    "NM": "Dak Prescott",
    "POS": "QB",
    "AGE": 32.2,
    "TM": "DAL",
    "G": 17,
    "FPTS": 323.78,
    "PPG": 19.04588235,
    "CSTY%": 0.7058823529,
    "CL": 29.1,
    "TS%": NaN,
    "CPOE": 0.044,
    "EPA/DB": 0.12,
    "paYPG": 267.7647059,
    "paRTG": 99.53,
    "CMP%": 0.6733333333,
    "TTT": 2.818433333,
    "YDS(t)": 4729,
    "IMP/G": 13.82352941,
    "SNP%": 0.9787798408,
    "YPC": 3.34,
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
    "G": 16,
    "FPTS": 322.8,
    "PPG": 20.175,
    "CSTY%": 1.0,
    "CL": 32.86666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1838,
    "IMP/G": 4.9375,
    "SNP%": 0.7518878101,
    "YPC": 5.67,
    "TGT": 85,
    "REC": 67,
    "MTF/A": 0.3865546218,
    "YCO/A": 4.423109244,
    "recYPG": 30.5,
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
    "G": 17,
    "FPTS": 315.9,
    "PPG": 18.58235294,
    "CSTY%": 0.8235294118,
    "CL": 31.5,
    "TS%": 0.26,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1239,
    "IMP/G": 3.705882353,
    "SNP%": 0.9108635097,
    "YPC": 0.0,
    "TGT": 169,
    "REC": 126,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 72.88235294,
    "YPRR": 1.897396631,
    "1DRR": 0.07963246554
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11563,
    "NM": "Bo Nix",
    "POS": "QB",
    "AGE": 25.6,
    "TM": "DEN",
    "G": 17,
    "FPTS": 315.84,
    "PPG": 18.57882353,
    "CSTY%": 0.5882352941,
    "CL": 31.92666667,
    "TS%": NaN,
    "CPOE": -0.021,
    "EPA/DB": 0.05,
    "paYPG": 231.2352941,
    "paRTG": 87.81,
    "CMP%": 0.6339869281,
    "TTT": 2.864477124,
    "YDS(t)": 4287,
    "IMP/G": 13.0,
    "SNP%": 0.9962997225,
    "YPC": 4.29,
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
    "SLPR_ID": 7564,
    "NM": "Ja'Marr Chase",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "CIN",
    "G": 16,
    "FPTS": 313.6,
    "PPG": 19.6,
    "CSTY%": 0.6875,
    "CL": 34.53333333,
    "TS%": 0.289,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1426,
    "IMP/G": 4.5625,
    "SNP%": 0.9396728016,
    "YPC": 4.67,
    "TGT": 185,
    "REC": 125,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 88.25,
    "YPRR": 2.288492707,
    "1DRR": 0.1053484603
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6904,
    "NM": "Jalen Hurts",
    "POS": "QB",
    "AGE": 27.1,
    "TM": "PHI",
    "G": 16,
    "FPTS": 305.06,
    "PPG": 19.06625,
    "CSTY%": 0.6875,
    "CL": 28.42,
    "TS%": NaN,
    "CPOE": 0.031,
    "EPA/DB": 0.01,
    "paYPG": 201.5,
    "paRTG": 98.49,
    "CMP%": 0.6475770925,
    "TTT": 2.976497797,
    "YDS(t)": 3645,
    "IMP/G": 11.875,
    "SNP%": 0.9767206478,
    "YPC": 4.01,
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
    "SLPR_ID": 3163,
    "NM": "Jared Goff",
    "POS": "QB",
    "AGE": 31.0,
    "TM": "DET",
    "G": 17,
    "FPTS": 305.06,
    "PPG": 17.94470588,
    "CSTY%": 0.6470588235,
    "CL": 28.64666667,
    "TS%": NaN,
    "CPOE": 0.016,
    "EPA/DB": 0.13,
    "paYPG": 268.4705882,
    "paRTG": 105.49,
    "CMP%": 0.6799307958,
    "TTT": 2.698598616,
    "YDS(t)": 4609,
    "IMP/G": 13.41176471,
    "SNP%": 0.9844054581,
    "YPC": 2.37,
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
    "G": 17,
    "FPTS": 302.2,
    "PPG": 17.77647059,
    "CSTY%": 0.6470588235,
    "CL": 30.4,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1912,
    "IMP/G": 4.647058824,
    "SNP%": 0.6026490066,
    "YPC": 5.25,
    "TGT": 40,
    "REC": 33,
    "MTF/A": 0.2524271845,
    "YCO/A": 3.595145631,
    "recYPG": 17.11764706,
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
    "G": 16,
    "FPTS": 299.88,
    "PPG": 18.7425,
    "CSTY%": 0.5,
    "CL": 29.6,
    "TS%": NaN,
    "CPOE": 0.033,
    "EPA/DB": 0.02,
    "paYPG": 232.9375,
    "paRTG": 94.1,
    "CMP%": 0.6640625,
    "TTT": 2.902128906,
    "YDS(t)": 4225,
    "IMP/G": 13.0625,
    "SNP%": 0.9729477612,
    "YPC": 6.0,
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
    "CSTY%": 0.6368571429,
    "CL": 29.14666667,
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
    "SLPR_ID": 8137,
    "NM": "George Pickens",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "DAL",
    "G": 17,
    "FPTS": 291.9,
    "PPG": 17.17058824,
    "CSTY%": 0.7058823529,
    "CL": 31.51,
    "TS%": 0.22,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1429,
    "IMP/G": 4.294117647,
    "SNP%": 0.83377542,
    "YPC": 0.0,
    "TGT": 137,
    "REC": 93,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 84.05882353,
    "YPRR": 2.430272109,
    "1DRR": 0.1088435374
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4892,
    "NM": "Baker Mayfield",
    "POS": "QB",
    "AGE": 30.4,
    "TM": "TB",
    "G": 17,
    "FPTS": 282.92,
    "PPG": 16.64235294,
    "CSTY%": 0.5882352941,
    "CL": 24.05333333,
    "TS%": NaN,
    "CPOE": -0.016,
    "EPA/DB": 0,
    "paYPG": 217.2352941,
    "paRTG": 90.58,
    "CMP%": 0.6316758748,
    "TTT": 2.845451197,
    "YDS(t)": 4075,
    "IMP/G": 11.70588235,
    "SNP%": 0.9691358025,
    "YPC": 6.95,
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
    "G": 17,
    "FPTS": 282.6,
    "PPG": 16.62352941,
    "CSTY%": 0.7058823529,
    "CL": 29.94666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1456,
    "IMP/G": 4.117647059,
    "SNP%": 0.6711409396,
    "YPC": 4.39,
    "TGT": 88,
    "REC": 69,
    "MTF/A": 0.2974137931,
    "YCO/A": 3.503448276,
    "recYPG": 25.70588235,
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
    "G": 17,
    "FPTS": 279.5,
    "PPG": 16.44117647,
    "CSTY%": 0.5882352941,
    "CL": 32.83333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1745,
    "IMP/G": 4.882352941,
    "SNP%": 0.53894081,
    "YPC": 5.2,
    "TGT": 21,
    "REC": 15,
    "MTF/A": 0.2117263844,
    "YCO/A": 3.961889251,
    "recYPG": 8.823529412,
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
    "G": 16,
    "FPTS": 269.0,
    "PPG": 16.8125,
    "CSTY%": 0.776,
    "CL": 29.93333333,
    "TS%": 0.264,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1160,
    "IMP/G": 3.3125,
    "SNP%": 0.8399621212,
    "YPC": -3.0,
    "TGT": 156,
    "REC": 100,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 72.6875,
    "YPRR": 2.084229391,
    "1DRR": 0.07885304659
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8150,
    "NM": "Kyren Williams",
    "POS": "RB",
    "AGE": 25.1,
    "TM": "LAR",
    "G": 17,
    "FPTS": 263.3,
    "PPG": 15.48823529,
    "CSTY%": 0.6470588235,
    "CL": 25.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1533,
    "IMP/G": 5.058823529,
    "SNP%": 0.6839622642,
    "YPC": 4.83,
    "TGT": 50,
    "REC": 36,
    "MTF/A": 0.277992278,
    "YCO/A": 3.659459459,
    "recYPG": 16.52941176,
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
    "G": 17,
    "FPTS": 253.9,
    "PPG": 14.93529412,
    "CSTY%": 0.5882352941,
    "CL": 24.43333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1399,
    "IMP/G": 3.647058824,
    "SNP%": 0.6033057851,
    "YPC": 4.26,
    "TGT": 52,
    "REC": 36,
    "MTF/A": 0.2615384615,
    "YCO/A": 3.261538462,
    "recYPG": 17.17647059,
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
    "G": 17,
    "FPTS": 249.42,
    "PPG": 14.67176471,
    "CSTY%": 0.5294117647,
    "CL": 26.7,
    "TS%": NaN,
    "CPOE": 0.043,
    "EPA/DB": 0.06,
    "paYPG": 238.1176471,
    "paRTG": 99.11,
    "CMP%": 0.677148847,
    "TTT": 2.661509434,
    "YDS(t)": 4143,
    "IMP/G": 11.05882353,
    "SNP%": 0.9642857143,
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
    "SLPR_ID": 12508,
    "NM": "Jaxson Dart",
    "POS": "QB",
    "AGE": 22.4,
    "TM": "NYG",
    "G": 14,
    "FPTS": 246.58,
    "PPG": 17.61285714,
    "CSTY%": 0.7142857143,
    "CL": 27.64666667,
    "TS%": NaN,
    "CPOE": -0.02,
    "EPA/DB": -0.01,
    "paYPG": 162.2857143,
    "paRTG": 91.71,
    "CMP%": 0.6371681416,
    "TTT": 2.728967552,
    "YDS(t)": 2759,
    "IMP/G": 10.0,
    "SNP%": 0.7614379085,
    "YPC": 5.66,
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
    "SLPR_ID": 12527,
    "NM": "Ashton Jeanty",
    "POS": "RB",
    "AGE": 21.8,
    "TM": "LV",
    "G": 17,
    "FPTS": 245.1,
    "PPG": 14.41764706,
    "CSTY%": 0.5882352941,
    "CL": 30.03333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1321,
    "IMP/G": 3.352941176,
    "SNP%": 0.7636949517,
    "YPC": 3.67,
    "TGT": 73,
    "REC": 55,
    "MTF/A": 0.3308270677,
    "YCO/A": 3.231578947,
    "recYPG": 20.35294118,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9997,
    "NM": "Zay Flowers",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "BAL",
    "G": 17,
    "FPTS": 243.3,
    "PPG": 14.31176471,
    "CSTY%": 0.6470588235,
    "CL": 26.36666667,
    "TS%": 0.28,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1273,
    "IMP/G": 3.0,
    "SNP%": 0.8598130841,
    "YPC": 6.2,
    "TGT": 118,
    "REC": 86,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 71.23529412,
    "YPRR": 2.673289183,
    "1DRR": 0.09492273731
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7588,
    "NM": "Javonte Williams",
    "POS": "RB",
    "AGE": 25.4,
    "TM": "DAL",
    "G": 16,
    "FPTS": 242.8,
    "PPG": 15.175,
    "CSTY%": 0.6875,
    "CL": 24.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1338,
    "IMP/G": 4.625,
    "SNP%": 0.6799292661,
    "YPC": 4.77,
    "TGT": 51,
    "REC": 35,
    "MTF/A": 0.2698412698,
    "YCO/A": 3.85515873,
    "recYPG": 8.5625,
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
    "SLPR_ID": 5850,
    "NM": "Josh Jacobs",
    "POS": "RB",
    "AGE": 27.6,
    "TM": "GB",
    "G": 15,
    "FPTS": 237.1,
    "PPG": 15.80666667,
    "CSTY%": 0.7333333333,
    "CL": 28.96666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1211,
    "IMP/G": 4.2,
    "SNP%": 0.5931477516,
    "YPC": 3.97,
    "TGT": 44,
    "REC": 36,
    "MTF/A": 0.2735042735,
    "YCO/A": 3.097435897,
    "recYPG": 18.8,
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
    "SLPR_ID": 96,
    "NM": "Aaron Rodgers",
    "POS": "QB",
    "AGE": 41.8,
    "TM": "PIT",
    "G": 16,
    "FPTS": 234.08,
    "PPG": 14.63,
    "CSTY%": 0.4375,
    "CL": 23.89333333,
    "TS%": NaN,
    "CPOE": -0.014,
    "EPA/DB": -0.04,
    "paYPG": 207.625,
    "paRTG": 94.8,
    "CMP%": 0.656626506,
    "TTT": 2.590783133,
    "YDS(t)": 3374,
    "IMP/G": 9.1875,
    "SNP%": 0.9536199095,
    "YPC": 2.9,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": -0.5625,
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
    "G": 16,
    "FPTS": 232.3,
    "PPG": 14.51875,
    "CSTY%": 0.625,
    "CL": 24.33333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1413,
    "IMP/G": 3.6875,
    "SNP%": 0.782388664,
    "YPC": 4.07,
    "TGT": 50,
    "REC": 37,
    "MTF/A": 0.2178571429,
    "YCO/A": 2.941785714,
    "recYPG": 17.0625,
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
    "G": 16,
    "FPTS": 229.04,
    "PPG": 14.315,
    "CSTY%": 0.375,
    "CL": 25.56,
    "TS%": NaN,
    "CPOE": -0.003,
    "EPA/DB": -0.08,
    "paYPG": 188.1875,
    "paRTG": 87.78,
    "CMP%": 0.6359832636,
    "TTT": 2.83332636,
    "YDS(t)": 3227,
    "IMP/G": 10.5625,
    "SNP%": 0.964,
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
    "SLPR_ID": 6790,
    "NM": "D'Andre Swift",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "CHI",
    "G": 16,
    "FPTS": 228.6,
    "PPG": 14.2875,
    "CSTY%": 0.5625,
    "CL": 23.33333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1386,
    "IMP/G": 4.625,
    "SNP%": 0.5780176644,
    "YPC": 4.87,
    "TGT": 48,
    "REC": 34,
    "MTF/A": 0.2062780269,
    "YCO/A": 3.429596413,
    "recYPG": 18.6875,
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
    "G": 15,
    "FPTS": 226.2,
    "PPG": 15.08,
    "CSTY%": 0.6,
    "CL": 23.43333333,
    "TS%": 0.206,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1132,
    "IMP/G": 3.266666667,
    "SNP%": 0.7687747036,
    "YPC": 7.5,
    "TGT": 120,
    "REC": 71,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 74.46666667,
    "YPRR": 2.449561404,
    "1DRR": 0.09210526316
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
    "TS%": 0.191,
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
    "SLPR_ID": 7567,
    "NM": "Kenneth Gainwell",
    "POS": "RB",
    "AGE": 26.5,
    "TM": "PIT",
    "G": 17,
    "FPTS": 222.3,
    "PPG": 13.07647059,
    "CSTY%": 0.4117647059,
    "CL": 28.23333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1023,
    "IMP/G": 3.352941176,
    "SNP%": 0.4884937238,
    "YPC": 4.71,
    "TGT": 85,
    "REC": 73,
    "MTF/A": 0.298245614,
    "YCO/A": 3.561403509,
    "recYPG": 28.58823529,
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
    "G": 13,
    "FPTS": 221.86,
    "PPG": 17.06615385,
    "CSTY%": 0.5384615385,
    "CL": 27.56,
    "TS%": NaN,
    "CPOE": -0.022,
    "EPA/DB": -0.04,
    "paYPG": 196.0769231,
    "paRTG": 103.75,
    "CMP%": 0.6357615894,
    "TTT": 3.01513245,
    "YDS(t)": 2898,
    "IMP/G": 10.23076923,
    "SNP%": 0.9247159091,
    "YPC": 5.21,
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
    "SLPR_ID": 10232,
    "NM": "Michael Wilson",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "ARI",
    "G": 17,
    "FPTS": 220.6,
    "PPG": 12.97647059,
    "CSTY%": 0.4117647059,
    "CL": 30.83333333,
    "TS%": 0.194,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1006,
    "IMP/G": 3.0,
    "SNP%": 0.8096564531,
    "YPC": 0.0,
    "TGT": 126,
    "REC": 78,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.17647059,
    "YPRR": 1.673876872,
    "1DRR": 0.07321131448
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5859,
    "NM": "A.J. Brown",
    "POS": "WR",
    "AGE": 28.2,
    "TM": "PHI",
    "G": 15,
    "FPTS": 220.3,
    "PPG": 14.68666667,
    "CSTY%": 0.5333333333,
    "CL": 29.43333333,
    "TS%": 0.243,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1003,
    "IMP/G": 3.133333333,
    "SNP%": 0.9054779807,
    "YPC": 0.0,
    "TGT": 121,
    "REC": 78,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.86666667,
    "YPRR": 2.228888889,
    "1DRR": 0.08888888889
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8148,
    "NM": "Jameson Williams",
    "POS": "WR",
    "AGE": 24.5,
    "TM": "DET",
    "G": 17,
    "FPTS": 219.9,
    "PPG": 12.93529412,
    "CSTY%": 0.5882352941,
    "CL": 25.73333333,
    "TS%": 0.175,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1129,
    "IMP/G": 2.882352941,
    "SNP%": 0.8996101365,
    "YPC": 2.0,
    "TGT": 102,
    "REC": 65,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 65.70588235,
    "YPRR": 1.893220339,
    "1DRR": 0.07118644068
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5045,
    "NM": "Courtland Sutton",
    "POS": "WR",
    "AGE": 30.0,
    "TM": "DEN",
    "G": 17,
    "FPTS": 219.7,
    "PPG": 12.92352941,
    "CSTY%": 0.5294117647,
    "CL": 22.9,
    "TS%": 0.202,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1017,
    "IMP/G": 3.058823529,
    "SNP%": 0.8593894542,
    "YPC": 0.0,
    "TGT": 124,
    "REC": 74,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.82352941,
    "YPRR": 1.700668896,
    "1DRR": 0.07525083612
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8126,
    "NM": "Wan'Dale Robinson",
    "POS": "WR",
    "AGE": 24.7,
    "TM": "NYG",
    "G": 16,
    "FPTS": 217.9,
    "PPG": 13.61875,
    "CSTY%": 0.5,
    "CL": 27.03333333,
    "TS%": 0.266,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1019,
    "IMP/G": 2.5,
    "SNP%": 0.9076492537,
    "YPC": 1.67,
    "TGT": 140,
    "REC": 92,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 63.375,
    "YPRR": 2.007920792,
    "1DRR": 0.06930693069
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8228,
    "NM": "Jaylen Warren",
    "POS": "RB",
    "AGE": 26.9,
    "TM": "PIT",
    "G": 16,
    "FPTS": 217.1,
    "PPG": 13.56875,
    "CSTY%": 0.625,
    "CL": 22.1,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1291,
    "IMP/G": 4.0625,
    "SNP%": 0.5105204873,
    "YPC": 4.54,
    "TGT": 45,
    "REC": 40,
    "MTF/A": 0.4028436019,
    "YCO/A": 3.917535545,
    "recYPG": 20.8125,
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
    "G": 14,
    "FPTS": 216.54,
    "PPG": 15.46714286,
    "CSTY%": 0.3571428571,
    "CL": 24.96,
    "TS%": NaN,
    "CPOE": 0.008,
    "EPA/DB": 0.07,
    "paYPG": 217.2142857,
    "paRTG": 92.91,
    "CMP%": 0.6453900709,
    "TTT": 2.831040189,
    "YDS(t)": 3250,
    "IMP/G": 10.92857143,
    "SNP%": 0.9279279279,
    "YPC": 4.35,
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
    "G": 17,
    "FPTS": 216.3,
    "PPG": 12.72352941,
    "CSTY%": 0.3529411765,
    "CL": 31.46666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1373,
    "IMP/G": 3.823529412,
    "SNP%": 0.5570216777,
    "YPC": 4.56,
    "TGT": 50,
    "REC": 39,
    "MTF/A": 0.2161016949,
    "YCO/A": 3.18940678,
    "recYPG": 17.47058824,
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
    "G": 15,
    "FPTS": 211.6,
    "PPG": 14.10666667,
    "CSTY%": 0.4666666667,
    "CL": 27.3,
    "TS%": 0.153,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 846,
    "IMP/G": 2.733333333,
    "SNP%": 0.8031674208,
    "YPC": 0.0,
    "TGT": 98,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.4,
    "YPRR": 1.649122807,
    "1DRR": 0.05847953216
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12526,
    "NM": "Tetairoa McMillan",
    "POS": "WR",
    "AGE": 22.5,
    "TM": "CAR",
    "G": 17,
    "FPTS": 211.4,
    "PPG": 12.43529412,
    "CSTY%": 0.3529411765,
    "CL": 23.4,
    "TS%": 0.237,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1014,
    "IMP/G": 3.235294118,
    "SNP%": 0.8718190386,
    "YPC": 0.0,
    "TGT": 122,
    "REC": 70,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.64705882,
    "YPRR": 1.920454545,
    "1DRR": 0.09090909091
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7553,
    "NM": "Kyle Pitts",
    "POS": "TE",
    "AGE": 25.0,
    "TM": "ATL",
    "G": 17,
    "FPTS": 210.8,
    "PPG": 12.4,
    "CSTY%": 0.5294117647,
    "CL": 27.43333333,
    "TS%": 0.217,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 928,
    "IMP/G": 3.0,
    "SNP%": 0.8741529526,
    "YPC": 0.0,
    "TGT": 118,
    "REC": 88,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 54.58823529,
    "YPRR": 1.757575758,
    "1DRR": 0.08712121212
  },
  {
    "SZN": 2025,
    "SLPR_ID": 2449,
    "NM": "Stefon Diggs",
    "POS": "WR",
    "AGE": 31.8,
    "TM": "NE",
    "G": 17,
    "FPTS": 210.3,
    "PPG": 12.37058824,
    "CSTY%": 0.4705882353,
    "CL": 23.16666667,
    "TS%": 0.203,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1013,
    "IMP/G": 3.0,
    "SNP%": 0.5410628019,
    "YPC": 0.0,
    "TGT": 102,
    "REC": 85,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.58823529,
    "YPRR": 2.665789474,
    "1DRR": 0.1236842105
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8155,
    "NM": "Breece Hall",
    "POS": "RB",
    "AGE": 24.3,
    "TM": "NYJ",
    "G": 16,
    "FPTS": 207.66,
    "PPG": 12.97875,
    "CSTY%": 0.5,
    "CL": 24.42,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.25,
    "paRTG": 122.92,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 1419,
    "IMP/G": 4.4375,
    "SNP%": 0.6406406406,
    "YPC": 4.38,
    "TGT": 48,
    "REC": 36,
    "MTF/A": 0.2057613169,
    "YCO/A": 3.058847737,
    "recYPG": 21.875,
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
    "G": 17,
    "FPTS": 206.6,
    "PPG": 12.15294118,
    "CSTY%": 0.4117647059,
    "CL": 22.73333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 896,
    "IMP/G": 2.705882353,
    "SNP%": 0.4144310823,
    "YPC": 3.7,
    "TGT": 58,
    "REC": 47,
    "MTF/A": 0.3150684932,
    "YCO/A": 3.073287671,
    "recYPG": 20.94117647,
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
    "G": 17,
    "FPTS": 206.2,
    "PPG": 12.12941176,
    "CSTY%": 0.3529411765,
    "CL": 30.13333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1132,
    "IMP/G": 3.058823529,
    "SNP%": 0.4608695652,
    "YPC": 5.06,
    "TGT": 42,
    "REC": 35,
    "MTF/A": 0.3,
    "YCO/A": 3.543333333,
    "recYPG": 13.0,
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
    "G": 17,
    "FPTS": 202.4,
    "PPG": 11.90588235,
    "CSTY%": 0.5294117647,
    "CL": 21.6,
    "TS%": 0.203,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 784,
    "IMP/G": 2.764705882,
    "SNP%": 0.8540218471,
    "YPC": 0.0,
    "TGT": 111,
    "REC": 80,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.11764706,
    "YPRR": 1.53125,
    "1DRR": 0.078125
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8112,
    "NM": "Drake London",
    "POS": "WR",
    "AGE": 24.2,
    "TM": "ATL",
    "G": 12,
    "FPTS": 201.9,
    "PPG": 16.825,
    "CSTY%": 0.5833333333,
    "CL": 31.86666667,
    "TS%": 0.205,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 919,
    "IMP/G": 3.833333333,
    "SNP%": 0.8990318119,
    "YPC": 0.0,
    "TGT": 112,
    "REC": 68,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 76.58333333,
    "YPRR": 2.412073491,
    "1DRR": 0.1023622047
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7525,
    "NM": "DeVonta Smith",
    "POS": "WR",
    "AGE": 26.9,
    "TM": "PHI",
    "G": 17,
    "FPTS": 201.8,
    "PPG": 11.87058824,
    "CSTY%": 0.4117647059,
    "CL": 24.23333333,
    "TS%": 0.227,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1008,
    "IMP/G": 2.588235294,
    "SNP%": 0.8896761134,
    "YPC": 0.0,
    "TGT": 113,
    "REC": 77,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.29411765,
    "YPRR": 2.069815195,
    "1DRR": 0.08213552361
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6794,
    "NM": "Justin Jefferson",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "MIN",
    "G": 17,
    "FPTS": 201.5,
    "PPG": 11.85294118,
    "CSTY%": 0.5294117647,
    "CL": 20.1,
    "TS%": 0.291,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1055,
    "IMP/G": 2.764705882,
    "SNP%": 0.9528907923,
    "YPC": 3.5,
    "TGT": 141,
    "REC": 84,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 61.64705882,
    "YPRR": 1.973634652,
    "1DRR": 0.08474576271
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6786,
    "NM": "CeeDee Lamb",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "DAL",
    "G": 14,
    "FPTS": 200.9,
    "PPG": 14.35,
    "CSTY%": 0.6428571429,
    "CL": 22.13333333,
    "TS%": 0.188,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1079,
    "IMP/G": 3.071428571,
    "SNP%": 0.7465681098,
    "YPC": 2.0,
    "TGT": 117,
    "REC": 75,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 76.92857143,
    "YPRR": 2.464530892,
    "1DRR": 0.09153318078
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12514,
    "NM": "Emeka Egbuka",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "TB",
    "G": 17,
    "FPTS": 195.7,
    "PPG": 11.51176471,
    "CSTY%": 0.3529411765,
    "CL": 26.13333333,
    "TS%": 0.228,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 947,
    "IMP/G": 2.0,
    "SNP%": 0.7813051146,
    "YPC": 4.5,
    "TGT": 127,
    "REC": 63,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 55.17647059,
    "YPRR": 1.861111111,
    "1DRR": 0.05555555556
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7526,
    "NM": "Jaylen Waddle",
    "POS": "WR",
    "AGE": 26.8,
    "TM": "MIA",
    "G": 16,
    "FPTS": 194.12,
    "PPG": 12.1325,
    "CSTY%": 0.5625,
    "CL": 21.1,
    "TS%": 0.209,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.5,
    "paRTG": 100.0,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 946,
    "IMP/G": 3.0625,
    "SNP%": 0.7810140237,
    "YPC": 14.0,
    "TGT": 100,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 56.875,
    "YPRR": 2.327365729,
    "1DRR": 0.1074168798
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12522,
    "NM": "Cam Ward",
    "POS": "QB",
    "AGE": 23.3,
    "TM": "TEN",
    "G": 17,
    "FPTS": 193.66,
    "PPG": 11.39176471,
    "CSTY%": 0.1764705882,
    "CL": 19.66666667,
    "TS%": NaN,
    "CPOE": "-",
    "EPA/DB": "-",
    "paYPG": 186.4117647,
    "paRTG": 80.24,
    "CMP%": 0.5981481481,
    "TTT": 2.996222222,
    "YDS(t)": 3328,
    "IMP/G": 9.882352941,
    "SNP%": 1.0,
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
    "SLPR_ID": 1466,
    "NM": "Travis Kelce",
    "POS": "TE",
    "AGE": 36.0,
    "TM": "KC",
    "G": 17,
    "FPTS": 193.2,
    "PPG": 11.36470588,
    "CSTY%": 0.4705882353,
    "CL": 21.7,
    "TS%": 0.185,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 852,
    "IMP/G": 2.705882353,
    "SNP%": 0.8112488084,
    "YPC": 1.0,
    "TGT": 108,
    "REC": 76,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 50.05882353,
    "YPRR": 1.608695652,
    "1DRR": 0.0775047259
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8151,
    "NM": "Kenneth Walker III",
    "POS": "RB",
    "AGE": 24.9,
    "TM": "SEA",
    "G": 17,
    "FPTS": 191.9,
    "PPG": 11.28823529,
    "CSTY%": 0.4117647059,
    "CL": 21.43333333,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1309,
    "IMP/G": 3.411764706,
    "SNP%": 0.4680451128,
    "YPC": 4.65,
    "TGT": 36,
    "REC": 31,
    "MTF/A": 0.3438914027,
    "YCO/A": 3.335746606,
    "recYPG": 16.58823529,
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
    "G": 15,
    "FPTS": 190.9,
    "PPG": 12.72666667,
    "CSTY%": 0.2,
    "CL": 23.93333333,
    "TS%": NaN,
    "CPOE": "-",
    "EPA/DB": "-",
    "paYPG": 201.6666667,
    "paRTG": 84.72,
    "CMP%": 0.6741071429,
    "TTT": 2.800446429,
    "YDS(t)": 3134,
    "IMP/G": 10.73333333,
    "SNP%": 0.9707536558,
    "YPC": 2.66,
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
    "G": 17,
    "FPTS": 188.5,
    "PPG": 11.08823529,
    "CSTY%": 0.4705882353,
    "CL": 18.16666667,
    "TS%": 0.205,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 825,
    "IMP/G": 2.647058824,
    "SNP%": 0.8401191658,
    "YPC": 1.33,
    "TGT": 112,
    "REC": 76,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 48.05882353,
    "YPRR": 1.727272727,
    "1DRR": 0.08033826638
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5872,
    "NM": "Deebo Samuel",
    "POS": "WR",
    "AGE": 29.7,
    "TM": "WAS",
    "G": 16,
    "FPTS": 188.2,
    "PPG": 11.7625,
    "CSTY%": 0.375,
    "CL": 22.3,
    "TS%": 0.211,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 802,
    "IMP/G": 2.25,
    "SNP%": 0.7233115468,
    "YPC": 4.41,
    "TGT": 99,
    "REC": 72,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.4375,
    "YPRR": 1.831234257,
    "1DRR": 0.06801007557
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8110,
    "NM": "Jake Ferguson",
    "POS": "TE",
    "AGE": 26.7,
    "TM": "DAL",
    "G": 17,
    "FPTS": 188.1,
    "PPG": 11.06470588,
    "CSTY%": 0.4705882353,
    "CL": 22.33333333,
    "TS%": 0.163,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 601,
    "IMP/G": 1.764705882,
    "SNP%": 0.6657824934,
    "YPC": 1.0,
    "TGT": 102,
    "REC": 82,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 35.29411765,
    "YPRR": 1.304347826,
    "1DRR": 0.04782608696
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8183,
    "NM": "Brock Purdy",
    "POS": "QB",
    "AGE": 25.8,
    "TM": "SF",
    "G": 9,
    "FPTS": 187.38,
    "PPG": 20.82,
    "CSTY%": 0.7777777778,
    "CL": 32.50666667,
    "TS%": NaN,
    "CPOE": 0.051,
    "EPA/DB": 0.13,
    "paYPG": 240.7777778,
    "paRTG": 100.48,
    "CMP%": 0.6936619718,
    "TTT": 3.167394366,
    "YDS(t)": 2314,
    "IMP/G": 16.22222222,
    "SNP%": 0.9795918367,
    "YPC": 4.45,
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
    "TS%": 0.18,
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
    "SLPR_ID": 12506,
    "NM": "Harold Fannin",
    "POS": "TE",
    "AGE": 21.2,
    "TM": "CLE",
    "G": 16,
    "FPTS": 186.4,
    "PPG": 11.65,
    "CSTY%": 0.5625,
    "CL": 21.1,
    "TS%": 0.192,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 744,
    "IMP/G": 2.125,
    "SNP%": 0.7623666343,
    "YPC": 1.86,
    "TGT": 107,
    "REC": 72,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 45.6875,
    "YPRR": 1.748803828,
    "1DRR": 0.06220095694
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5967,
    "NM": "Tony Pollard",
    "POS": "RB",
    "AGE": 28.4,
    "TM": "TEN",
    "G": 17,
    "FPTS": 185.8,
    "PPG": 10.92941176,
    "CSTY%": 0.2941176471,
    "CL": 20.36666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1288,
    "IMP/G": 3.470588235,
    "SNP%": 0.621756487,
    "YPC": 4.47,
    "TGT": 41,
    "REC": 33,
    "MTF/A": 0.2851239669,
    "YCO/A": 3.462396694,
    "recYPG": 12.11764706,
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
    "G": 15,
    "FPTS": 185.1,
    "PPG": 12.34,
    "CSTY%": 0.4666666667,
    "CL": 23.56666667,
    "TS%": 0.165,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 591,
    "IMP/G": 2.266666667,
    "SNP%": 0.8480603448,
    "YPC": 0.0,
    "TGT": 82,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 39.4,
    "YPRR": 1.492424242,
    "1DRR": 0.05808080808
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9487,
    "NM": "Parker Washington",
    "POS": "WR",
    "AGE": 23.5,
    "TM": "JAX",
    "G": 16,
    "FPTS": 184.7,
    "PPG": 11.54375,
    "CSTY%": 0.4375,
    "CL": 21.73333333,
    "TS%": 0.169,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 847,
    "IMP/G": 2.375,
    "SNP%": 0.6117073171,
    "YPC": 0.0,
    "TGT": 95,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 52.9375,
    "YPRR": 2.188630491,
    "1DRR": 0.0826873385
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8142,
    "NM": "Alec Pierce",
    "POS": "WR",
    "AGE": 25.4,
    "TM": "IND",
    "G": 15,
    "FPTS": 183.3,
    "PPG": 12.22,
    "CSTY%": 0.4666666667,
    "CL": 24.06666667,
    "TS%": 0.154,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1003,
    "IMP/G": 2.733333333,
    "SNP%": 0.8738636364,
    "YPC": 0.0,
    "TGT": 84,
    "REC": 47,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 66.86666667,
    "YPRR": 2.223946785,
    "1DRR": 0.07760532151
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1479,
    "NM": "Keenan Allen",
    "POS": "WR",
    "AGE": 33.4,
    "TM": "LAC",
    "G": 17,
    "FPTS": 182.7,
    "PPG": 10.74705882,
    "CSTY%": 0.2352941176,
    "CL": 22.73333333,
    "TS%": 0.214,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 777,
    "IMP/G": 2.882352941,
    "SNP%": 0.552238806,
    "YPC": 0.0,
    "TGT": 122,
    "REC": 81,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.70588235,
    "YPRR": 1.75,
    "1DRR": 0.1013513514
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9753,
    "NM": "Zach Charbonnet",
    "POS": "RB",
    "AGE": 24.7,
    "TM": "SEA",
    "G": 16,
    "FPTS": 181.4,
    "PPG": 11.3375,
    "CSTY%": 0.375,
    "CL": 21.46666667,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 874,
    "IMP/G": 3.4375,
    "SNP%": 0.4856007944,
    "YPC": 3.97,
    "TGT": 24,
    "REC": 20,
    "MTF/A": 0.3043478261,
    "YCO/A": 3.616847826,
    "recYPG": 9.0,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11635,
    "NM": "Ladd McConkey",
    "POS": "WR",
    "AGE": 23.9,
    "TM": "LAC",
    "G": 16,
    "FPTS": 180.9,
    "PPG": 11.30625,
    "CSTY%": 0.5,
    "CL": 21.5,
    "TS%": 0.186,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 789,
    "IMP/G": 2.1875,
    "SNP%": 0.7817164179,
    "YPC": 0.0,
    "TGT": 106,
    "REC": 66,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 49.3125,
    "YPRR": 1.483082707,
    "1DRR": 0.0545112782
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7002,
    "NM": "Juwan Johnson",
    "POS": "TE",
    "AGE": 29.0,
    "TM": "NO",
    "G": 17,
    "FPTS": 179.9,
    "PPG": 10.58235294,
    "CSTY%": 0.4705882353,
    "CL": 17.33333333,
    "TS%": 0.173,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 889,
    "IMP/G": 2.411764706,
    "SNP%": 0.7566287879,
    "YPC": 0.0,
    "TGT": 102,
    "REC": 77,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 52.29411765,
    "YPRR": 1.774451098,
    "1DRR": 0.07584830339
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7611,
    "NM": "Rhamondre Stevenson",
    "POS": "RB",
    "AGE": 27.6,
    "TM": "NE",
    "G": 14,
    "FPTS": 178.8,
    "PPG": 12.77142857,
    "CSTY%": 0.4285714286,
    "CL": 27.9,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 948,
    "IMP/G": 2.857142857,
    "SNP%": 0.6019070322,
    "YPC": 4.64,
    "TGT": 37,
    "REC": 32,
    "MTF/A": 0.2538461538,
    "YCO/A": 3.600769231,
    "recYPG": 24.64285714,
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
    "G": 17,
    "FPTS": 178.8,
    "PPG": 10.51764706,
    "CSTY%": 0.3529411765,
    "CL": 23.0,
    "TS%": 0.173,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 768,
    "IMP/G": 2.470588235,
    "SNP%": 0.806763285,
    "YPC": 0.0,
    "TGT": 87,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.17647059,
    "YPRR": 1.781902552,
    "1DRR": 0.08120649652
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5001,
    "NM": "Dalton Schultz",
    "POS": "TE",
    "AGE": 29.2,
    "TM": "HOU",
    "G": 17,
    "FPTS": 177.7,
    "PPG": 10.45294118,
    "CSTY%": 0.5294117647,
    "CL": 19.56666667,
    "TS%": 0.182,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 777,
    "IMP/G": 2.294117647,
    "SNP%": 0.7225274725,
    "YPC": 0.0,
    "TGT": 106,
    "REC": 82,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.70588235,
    "YPRR": 1.678185745,
    "1DRR": 0.0777537797
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11627,
    "NM": "Troy Franklin",
    "POS": "WR",
    "AGE": 22.6,
    "TM": "DEN",
    "G": 17,
    "FPTS": 177.1,
    "PPG": 10.41764706,
    "CSTY%": 0.3529411765,
    "CL": 23.9,
    "TS%": 0.17,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 721,
    "IMP/G": 2.0,
    "SNP%": 0.5966697502,
    "YPC": 2.4,
    "TGT": 104,
    "REC": 65,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.70588235,
    "YPRR": 1.531317495,
    "1DRR": 0.05615550756
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
    "CL": 26.69,
    "TS%": 0.167,
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
    "YCO/A": 0.0,
    "recYPG": 56.66666667,
    "YPRR": 1.818181818,
    "1DRR": 0.07754010695
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5947,
    "NM": "Jakobi Meyers",
    "POS": "WR",
    "AGE": 28.9,
    "TM": "JAX",
    "G": 16,
    "FPTS": 175.8,
    "PPG": 10.9875,
    "CSTY%": 0.375,
    "CL": 18.0,
    "TS%": 0.195,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 848,
    "IMP/G": 2.75,
    "SNP%": 0.8521199586,
    "YPC": 2.6,
    "TGT": 110,
    "REC": 75,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 52.1875,
    "YPRR": 1.640471513,
    "1DRR": 0.07858546169
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
    "SLPR_ID": 7049,
    "NM": "Jauan Jennings",
    "POS": "WR",
    "AGE": 28.2,
    "TM": "SF",
    "G": 15,
    "FPTS": 173.3,
    "PPG": 11.55333333,
    "CSTY%": 0.5333333333,
    "CL": 18.9,
    "TS%": 0.157,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 643,
    "IMP/G": 2.4,
    "SNP%": 0.8179012346,
    "YPC": 0.0,
    "TGT": 90,
    "REC": 55,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 42.86666667,
    "YPRR": 1.448198198,
    "1DRR": 0.06081081081
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9754,
    "NM": "Quentin Johnston",
    "POS": "WR",
    "AGE": 24.1,
    "TM": "LAC",
    "G": 14,
    "FPTS": 171.2,
    "PPG": 12.22857143,
    "CSTY%": 0.5,
    "CL": 23.03333333,
    "TS%": 0.148,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 742,
    "IMP/G": 1.928571429,
    "SNP%": 0.7675159236,
    "YPC": 3.5,
    "TGT": 85,
    "REC": 51,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 52.5,
    "YPRR": 1.608315098,
    "1DRR": 0.04157549234
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4983,
    "NM": "D.J. Moore",
    "POS": "WR",
    "AGE": 28.4,
    "TM": "CHI",
    "G": 17,
    "FPTS": 170.18,
    "PPG": 10.01058824,
    "CSTY%": 0.2941176471,
    "CL": 23.09333333,
    "TS%": 0.148,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.1176470588,
    "paRTG": 118.75,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 763,
    "IMP/G": 2.235294118,
    "SNP%": 0.8480436761,
    "YPC": 5.27,
    "TGT": 85,
    "REC": 50,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 40.11764706,
    "YPRR": 1.284369115,
    "1DRR": 0.04896421846
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
    "MTF/A": 0.2,
    "YCO/A": 3.416521739,
    "recYPG": 12.21428571,
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
    "G": 17,
    "FPTS": 166.92,
    "PPG": 9.818823529,
    "CSTY%": 0.2941176471,
    "CL": 20.64,
    "TS%": NaN,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.1764705882,
    "paRTG": 95.83,
    "CMP%": 0.5,
    "TTT": NaN,
    "YDS(t)": 911,
    "IMP/G": 3.117647059,
    "SNP%": 0.3674463938,
    "YPC": 4.53,
    "TGT": 29,
    "REC": 24,
    "MTF/A": 0.2784810127,
    "YCO/A": 3.422151899,
    "recYPG": 11.29411765,
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
    "G": 16,
    "FPTS": 166.4,
    "PPG": 10.4,
    "CSTY%": 0.375,
    "CL": 18.56666667,
    "TS%": 0.192,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 724,
    "IMP/G": 1.75,
    "SNP%": 0.600756859,
    "YPC": 5.0,
    "TGT": 95,
    "REC": 72,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.9375,
    "YPRR": 1.867532468,
    "1DRR": 0.06233766234
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8121,
    "NM": "Romeo Doubs",
    "POS": "WR",
    "AGE": 25.5,
    "TM": "GB",
    "G": 16,
    "FPTS": 165.4,
    "PPG": 10.3375,
    "CSTY%": 0.3125,
    "CL": 21.76666667,
    "TS%": 0.174,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 724,
    "IMP/G": 2.5625,
    "SNP%": 0.78,
    "YPC": 0.0,
    "TGT": 85,
    "REC": 55,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.25,
    "YPRR": 1.837563452,
    "1DRR": 0.08883248731
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12517,
    "NM": "Colston Loveland",
    "POS": "TE",
    "AGE": 21.5,
    "TM": "CHI",
    "G": 16,
    "FPTS": 165.1,
    "PPG": 10.31875,
    "CSTY%": 0.3125,
    "CL": 25.43333333,
    "TS%": 0.143,
    "CPOE": NaN,
    "EPA/DB": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 711,
    "IMP/G": 2.25,
    "SNP%": 0.6314258002,
    "YPC": -2.0,
    "TGT": 82,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 44.5625,
    "YPRR": 2.066666667,
    "1DRR": 0.08695652174
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
  // Mobile: top 5 leaders to save space; Desktop: top 8
  const count = window.innerWidth < 768 ? 5 : 8;
  return [...players]
    .filter(p => Number.isFinite(p.stats?.ppg) && p.stats.ppg > 0)
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, count)
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
    // Performance Map selector options are rendered in descending FPTS order,
    // so the rank column is a simple 1..100 index tied to this existing order.
    .map((p, index) => {
      const posClass = `fc-option-pos fc-option-pos-${p.position.toLowerCase()}`;
      const rank = index + 1;
      return `
      <li class="fc-option ${p.id === dashState.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span class="fc-option-rank">${rank}</span>
        <span class="fc-option-name">${p.name}</span>
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
      // Performance Map custom select options use a 3-column grid (rank, name, team),
      // so re-show rows as grid to preserve left-aligned name layout.
      optionsContainer.querySelectorAll('.fc-option').forEach(opt => opt.style.display = 'grid');
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeDropdown();
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    optionsContainer.querySelectorAll('.fc-option').forEach(opt => {
      // Keep visible matches in grid mode so column alignment remains consistent.
      opt.style.display = opt.textContent.toLowerCase().includes(term) ? 'grid' : 'none';
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
      .slice(0, 8);
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
  // PPG Leaders bar chart palette:
  // Mobile (5 bars): original neon gradient stops — untouched
  // Desktop (8 bars): use the QB radial ring colors (QB_CUSTOM_RING_MIDS) so each bar
  //   matches the corresponding ring color from the QB Performance Map radar chart.
  //   Each mid color is used for the stroke/label; fill gradient uses the same
  //   start/end derivation as buildPaletteFromMids (mixHex white 35% / black 28%).
  const barPaletteMobile = ['#13dcff', '#2077ed', '#4d39fc', '#701fe3', '#a633f7'];
  // QB ring mid colors (outer → inner, reversed from QB_CUSTOM_RING_MIDS) — cyan end first
  // (trailing 'ff' alpha stripped to 6-char hex so mixHex parses correctly)
  const barPaletteDesktopMids = ['#00DDFA', '#00a9f1', '#4D79FF', '#7866FF', '#a74eff', '#d747ff', '#fe26f7', '#ff0aa5'];
  // Build per-bar gradient stop objects the same way buildPaletteFromMids does,
  // so the fill gradient mirrors the radar ring gradient appearance
  const barPaletteDesktop = barPaletteDesktopMids.map(mid => ({
    mid,
    start: mixHex(mid, '#FFFFFF', 0.35), // 35% lighter — tops of bars
    end: mixHex(mid, '#000000', 0.28)    // 28% darker  — bottoms of bars
  }));
  const barPalette = isMobile ? barPaletteMobile : barPaletteDesktopMids;
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
  filter.append('feGaussianBlur').attr('stdDeviation', '1.5').attr('result', 'coloredBlur'); // Reduced from 3 — tighter, less diffuse glow on bar outlines
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  // Mobile: tighter bar gap to fit narrower panel; Desktop: original spacing
  const x = d3.scaleBand().range([0, innerWidth]).domain(data.map(d => d.label)).paddingInner(isMobile ? 0.5 : 0.6).paddingOuter(0.05);
  const maxValue = d3.max(data, d => d.value) || 0;
  // Reduced headroom above bars (1.02 instead of 1.05)
  const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, maxValue * 1.02]);
  const colorScale = d3.scaleOrdinal()
    .domain(data.map((_, i) => i))
    .range(barPalette);
  const uid = Date.now();
  data.forEach((d, i) => {
    const gradId = `bar-grad-${uid}-${i}`;
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    if (isMobile) {
      // Mobile: original flat-color gradient (unchanged)
      const color = barPalette[i % barPalette.length];
      grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.44);
      grad.append('stop').attr('offset', '70%').attr('stop-color', color).attr('stop-opacity', 0.07);
      grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.015);
    } else {
      // Desktop: use TE ring gradient stops (start → mid → end) matching radar ring appearance
      const { start, mid, end } = barPaletteDesktop[i % barPaletteDesktop.length];
      grad.append('stop').attr('offset', '0%').attr('stop-color', start).attr('stop-opacity', 0.52);
      grad.append('stop').attr('offset', '55%').attr('stop-color', mid).attr('stop-opacity', 0.18);
      grad.append('stop').attr('offset', '100%').attr('stop-color', end).attr('stop-opacity', 0.06);
    }
  });
  const barGroups = g.selectAll('.bar-group').data(data).enter().append('g').attr('class', 'bar-group');
  const barWidth = x.bandwidth();
  const radius = barWidth / 2;
  const strokeMain = Math.max(1, width * 0.008);
  const strokeGlow = Math.max(2, width * 0.015);
  // Font sizes — mobile: slightly larger data labels & player names
  const fontSizeVal = isMobile ? Math.max(8.5, width * 0.022) : Math.max(14, width * 0.024);
  const fontSizeAxis = isMobile ? Math.max(7, width * 0.021) : Math.max(11, width * 0.02);
  
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
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeGlow).attr('stroke-opacity', 0.18).style('filter', 'url(#neon-glow)') // opacity reduced from 0.3 for tighter outline.transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
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
  // Dashboard scatter plot layout:
  // keep the original bottom-axis spacing on desktop and mobile, while letting the
  // desktop chart become taller through CSS-driven chart-host sizing only.
  const margin = {
    top: isMobile ? 10 : height * 0.02,
    right: width * 0.02,
    bottom: isMobile ? 30 : height * 0.085,
    left: isMobile ? 30 : width * 0.055
  };
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
  const yDomain = [17, 44];
  // Scatter plot domain stays unchanged; only the visible x-axis labels are constrained to 50%..100%.
  const xDomain = [45, 104];
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

  const xAxisText = g.append('g')
    .attr('class', 'scatter-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', isMobile ? '8px' : '14px');

  xAxisText.filter(d => d === 100)
    .attr('dx', isMobile ? '0.35em' : '0.3em');

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
  
  // Desktop dots are intentionally a bit larger for readability.
  const dotRadius = isMobile ? 4.8 : 7.6;
  // Minimum distance between dot centers to avoid overlap (slightly stronger than before)
  const minDistance = dotRadius * 3;
  
  // Get initial positions for all dots
  const dotPositions = data.map((d, i) => ({
    index: i,
    cx: x(clamp(d.stats.csty, xDomain[0], xDomain[1])),
    cy: y(d.stats.ceiling),
    originalX: x(clamp(d.stats.csty, xDomain[0], xDomain[1])),
    originalY: y(d.stats.ceiling)
  }));
  
  // Collision detection and resolution - run multiple passes to separate overlapping dots
  const maxIterations = 25;
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
          const angle = ((i * 37 + j * 17) % 360) * (Math.PI / 180);
          dotPositions[i].cx -= Math.cos(angle) * (minDistance / 2);
          dotPositions[i].cy -= Math.sin(angle) * (minDistance / 2);
          dotPositions[j].cx += Math.cos(angle) * (minDistance / 2);
          dotPositions[j].cy += Math.sin(angle) * (minDistance / 2);
          moved = true;
        }

        // Keep dots within the plot bounds so collision resolution doesn't push them off-chart
        dotPositions[i].cx = clamp(dotPositions[i].cx, 0, innerWidth);
        dotPositions[i].cy = clamp(dotPositions[i].cy, 0, innerHeight);
        dotPositions[j].cx = clamp(dotPositions[j].cx, 0, innerWidth);
        dotPositions[j].cy = clamp(dotPositions[j].cy, 0, innerHeight);
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
  // Data labels: restore the original fixed positioning relative to each dot
  const labelDx = isMobile ? -2 : 3;
  const labelDy = isMobile ? 2 : 1;
  const labels = g.selectAll('.scatter-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'scatter-label')
    .attr('text-anchor', 'start')
    .attr('x', (d, i) => dotPositions[i].cx + labelDx)
    .attr('y', (d, i) => dotPositions[i].cy + labelDy)
    .text(d => {
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
  })
    .attr('opacity', 0);

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
  labels.transition()
    .duration(900)
    .delay((d, i) => i * 25 + 450)
    .attr('opacity', 1);
}

// Dashboard header branding: keep the home-page logo visible when the app is opened
// from a sister app or restored from a mobile webview/pageshow state. The helper
// validates the header logo image and re-requests it once if the first paint stalls.
function stabilizeDashboardBrandLogo() {
  const brandLogo = document.getElementById('dashboardBrandLogo');
  if (!(brandLogo instanceof HTMLImageElement)) return;

  // Dashboard header branding: resolve the retry URL from the same app-relative path
  // used in the markup so the logo still loads when this app is served from a subfolder.
  const configuredLogoPath = brandLogo.dataset.logoSrc || brandLogo.getAttribute('src') || 'assets/welcome/welcome-logo-256.png';
  const baseLogoUrl = new URL(configuredLogoPath, document.baseURI).href;
  let recoveryAttempted = false;

  const markLogoReady = () => {
    if (brandLogo.naturalWidth > 0) {
      brandLogo.removeAttribute('data-logo-recovering');
    }
  };

  const recoverBrandLogo = () => {
    if (recoveryAttempted || brandLogo.naturalWidth > 0) return;
    recoveryAttempted = true;
    brandLogo.setAttribute('data-logo-recovering', 'true');
    brandLogo.src = `${baseLogoUrl}?v=${Date.now()}`;
  };

  const validateBrandLogo = () => {
    if (brandLogo.complete && brandLogo.naturalWidth > 0) {
      markLogoReady();
      return;
    }
    window.setTimeout(() => {
      if (brandLogo.complete && brandLogo.naturalWidth > 0) {
        markLogoReady();
        return;
      }
      recoverBrandLogo();
    }, 180);
  };

  brandLogo.loading = 'eager';
  brandLogo.decoding = 'async';
  try {
    brandLogo.fetchPriority = 'high';
  } catch (e) {
    // Ignore browsers that do not expose fetchPriority as a writable property.
  }

  if (!brandLogo.getAttribute('src')) {
    brandLogo.src = baseLogoUrl;
  }

  brandLogo.addEventListener('load', markLogoReady);
  brandLogo.addEventListener('error', recoverBrandLogo);
  window.addEventListener('pageshow', validateBrandLogo);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      validateBrandLogo();
    }
  });

  if (typeof brandLogo.decode === 'function') {
    brandLogo.decode().then(markLogoReady).catch(() => {
      validateBrandLogo();
    });
  } else {
    validateBrandLogo();
  }
}

// Home menu: support external destinations (Trophy Room / Matchups) without impacting shared app.js navigation.
// This file loads before deferred `app.js`, so we can intercept clicks and stop the default handler for these items.
(() => {
  const homeMenu = document.getElementById('homeMenu');
  if (!homeMenu) return;

  const homeMenuToggle = document.getElementById('homeMenuToggle');
  const TROPHY_ROOM_HOST = 'dynastyhub-trophyroom.netlify.app';
  const readStoredUsername = () => {
    const input = document.getElementById('usernameInput');
    const inputValue = typeof input?.value === 'string' ? input.value.trim() : '';
    if (inputValue) return inputValue;
    try {
      return (localStorage.getItem('sleeper_username') || '').trim();
    } catch (e) {
      return '';
    }
  };
  const buildExternalUrl = (rawUrl) => {
    if (typeof window.__dhBuildExternalUrl === 'function') {
      return window.__dhBuildExternalUrl(rawUrl);
    }
    if (!rawUrl) return rawUrl;
    let parsed;
    try {
      parsed = new URL(rawUrl, window.location.origin);
    } catch (e) {
      return rawUrl;
    }
    if (parsed.hostname !== TROPHY_ROOM_HOST) return rawUrl;
    const username = readStoredUsername();
    if (!username) return rawUrl;
    parsed.searchParams.set('user', username);
    return parsed.toString();
  };
  const closeHomeMenu = () => {
    if (!homeMenu.classList.contains('hidden')) {
      homeMenu.classList.add('hidden');
    }
    homeMenu.setAttribute('aria-hidden', 'true');
    homeMenuToggle?.setAttribute('aria-expanded', 'false');
  };

  homeMenu.querySelectorAll('.home-menu-item[data-url]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const url = btn.dataset.url;
      if (!url) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      closeHomeMenu();

      const destination = buildExternalUrl(url);
      window.location.href = destination;
    });
  });
})();

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
  stabilizeDashboardBrandLogo();
  window.initFantasyDashboard();
});
})();
