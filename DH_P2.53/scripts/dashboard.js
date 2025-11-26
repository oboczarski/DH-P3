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
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1581,
    "IMP/G": 7.5,
    "SNP%": 0.8316708229,
    "YPC": 3.67,
    "TGT": 103,
    "REC": 81,
    "MTF/A": 1.460829493,
    "YCO/A": 1.460829493,
    "recYPG": 65.41666667,
    "YPRR": null,
    "1DRR": null
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
    "CL": 34.54545455,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1465,
    "IMP/G": 6.454545455,
    "SNP%": 0.8342776204,
    "YPC": 5.84,
    "TGT": 35,
    "REC": 32,
    "MTF/A": 3.034146341,
    "YCO/A": 3.034146341,
    "recYPG": 24.36363636,
    "YPRR": null,
    "1DRR": null
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
    "CL": 30.18181818,
    "TS%": null,
    "paYPG": 267.9090909,
    "paRTG": 97.6,
    "CMP%": 0.6766848816,
    "TTT": 2.933179723,
    "YDS(t)": 3330,
    "IMP/G": 14.18181818,
    "SNP%": 0.9668049793,
    "YPC": 5.3,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
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
    "CL": 34.3,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1397,
    "IMP/G": 5.454545455,
    "SNP%": 0.6266088549,
    "YPC": 6.14,
    "TGT": 55,
    "REC": 48,
    "MTF/A": 1.787096774,
    "YCO/A": 1.787096774,
    "recYPG": 34.45454545,
    "YPRR": null,
    "1DRR": null
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
    "TTT": null,
    "YDS(t)": 1313,
    "IMP/G": 5.363636364,
    "SNP%": 0.7340265902,
    "YPC": 6.17,
    "TGT": 107,
    "REC": 80,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 119.3636364,
    "YPRR": 4.574913,
    "1DRR": 0.1742160279
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5656,
    "NM": "CeeDee Lamb",
    "POS": "WR",
    "AGE": 26.2,
    "TM": "DAL",
    "G": 11,
    "FPTS": 247.5,
    "PPG": 22.5,
    "CSTY%": 0.8181818182,
    "CL": 35.1,
    "TS%": 0.207,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1561,
    "IMP/G": 4.727272727,
    "SNP%": 0.9417475728,
    "YPC": 0.0,
    "TGT": 114,
    "REC": 84,
    "MTF/A": 0.8894472362,
    "YCO/A": 0.8894472362,
    "recYPG": 132.0,
    "YPRR": 2.637992831,
    "1DRR": 0.2613623662
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5867,
    "NM": "Amon-Ra St. Brown",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "DET",
    "G": 11,
    "FPTS": 244.5,
    "PPG": 22.22727273,
    "CSTY%": 0.8181818182,
    "CL": 29.7,
    "TS%": 0.069,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1379,
    "IMP/G": 3.818181818,
    "SNP%": 0.8267929634,
    "YPC": 0.0,
    "TGT": 117,
    "REC": 87,
    "MTF/A": 0.6111111111,
    "YCO/A": 0.6111111111,
    "recYPG": 125.3636364,
    "YPRR": 2.663925729,
    "1DRR": 0.2709251101
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3676,
    "NM": "Tyreek Hill",
    "POS": "WR",
    "AGE": 31.2,
    "TM": "MIA",
    "G": 11,
    "FPTS": 242.5,
    "PPG": 22.04545455,
    "CSTY%": 0.8181818182,
    "CL": 31.4,
    "TS%": 0.0,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1434,
    "IMP/G": 3.909090909,
    "SNP%": 0.7854666553,
    "YPC": 0.0,
    "TGT": 113,
    "REC": 79,
    "MTF/A": 0.5530973451,
    "YCO/A": 0.5530973451,
    "recYPG": 130.3636364,
    "YPRR": 3.060679612,
    "1DRR": 0.2652011281
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5136,
    "NM": "Justin Jefferson",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "MIN",
    "G": 11,
    "FPTS": 240.1,
    "PPG": 21.82727273,
    "CSTY%": 0.8181818182,
    "CL": 32.2,
    "TS%": 0.067,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1358,
    "IMP/G": 3.363636364,
    "SNP%": 0.8949729364,
    "YPC": 0.0,
    "TGT": 117,
    "REC": 84,
    "MTF/A": 0.8590604027,
    "YCO/A": 0.8590604027,
    "recYPG": 123.4545455,
    "YPRR": 2.774107144,
    "1DRR": 0.2731494267
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9339,
    "NM": "Xavier Worthy",
    "POS": "WR",
    "AGE": 22.1,
    "TM": "KC",
    "G": 11,
    "FPTS": 233.0,
    "PPG": 21.18181818,
    "CSTY%": 0.8181818182,
    "CL": 31.1,
    "TS%": 0.401,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1273,
    "IMP/G": 3.545454545,
    "SNP%": 0.7354619052,
    "YPC": 0.0,
    "TGT": 101,
    "REC": 68,
    "MTF/A": 1.109375,
    "YCO/A": 1.109375,
    "recYPG": 115.7272727,
    "YPRR": 2.706160727,
    "1DRR": 0.2121212121
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9522,
    "NM": "Marvin Harrison Jr.",
    "POS": "WR",
    "AGE": 23.2,
    "TM": "ARI",
    "G": 11,
    "FPTS": 229.6,
    "PPG": 20.87272727,
    "CSTY%": 0.9090909091,
    "CL": 27.0,
    "TS%": 0.149,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1264,
    "IMP/G": 3.454545455,
    "SNP%": 0.8660237876,
    "YPC": 0.0,
    "TGT": 99,
    "REC": 76,
    "MTF/A": 0.752688172,
    "YCO/A": 0.752688172,
    "recYPG": 114.9090909,
    "YPRR": 2.558132043,
    "1DRR": 0.2752969121
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7279,
    "NM": "Puka Nacua",
    "POS": "WR",
    "AGE": 24.9,
    "TM": "LAR",
    "G": 11,
    "FPTS": 228.0,
    "PPG": 20.72727273,
    "CSTY%": 0.8181818182,
    "CL": 30.7,
    "TS%": -0.004,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1307,
    "IMP/G": 4.181818182,
    "SNP%": 0.8552441224,
    "YPC": 0.0,
    "TGT": 108,
    "REC": 82,
    "MTF/A": 0.9512195122,
    "YCO/A": 0.9512195122,
    "recYPG": 118.8181818,
    "YPRR": 2.853579735,
    "1DRR": 0.2891903731
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6794,
    "NM": "Justin Fields",
    "POS": "QB",
    "AGE": 26.7,
    "TM": "PIT",
    "G": 10,
    "FPTS": 224.66,
    "PPG": 22.466,
    "CSTY%": 0.8,
    "CL": 33.1,
    "TS%": null,
    "paYPG": 210.2,
    "paRTG": 94.9,
    "CMP%": 0.6776315789,
    "TTT": 2.956,
    "YDS(t)": 2042,
    "IMP/G": 17.7,
    "SNP%": 0.9604011461,
    "YPC": 5.9,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9332,
    "NM": "Caleb Williams",
    "POS": "QB",
    "AGE": 23.6,
    "TM": "CHI",
    "G": 9,
    "FPTS": 220.92,
    "PPG": 24.54666667,
    "CSTY%": 0.7777777778,
    "CL": 30.54,
    "TS%": null,
    "paYPG": 269.1111111,
    "paRTG": 99.33333333,
    "CMP%": 0.6756900157,
    "TTT": 2.811222222,
    "YDS(t)": 2403,
    "IMP/G": 16.33333333,
    "SNP%": 0.9446787049,
    "YPC": 6.4,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6405,
    "NM": "C.J. Stroud",
    "POS": "QB",
    "AGE": 24.7,
    "TM": "HOU",
    "G": 11,
    "FPTS": 218.68,
    "PPG": 19.880000000000003,
    "CSTY%": 0.8181818182,
    "CL": 27.74,
    "TS%": null,
    "paYPG": 279.7272727,
    "paRTG": 107.3,
    "CMP%": 0.682953658,
    "TTT": 2.752727273,
    "YDS(t)": 2878,
    "IMP/G": 7.090909091,
    "SNP%": 0.9748361357,
    "YPC": 4.09,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9456,
    "NM": "Malik Nabers",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "NYG",
    "G": 11,
    "FPTS": 216.2,
    "PPG": 19.65454545,
    "CSTY%": 0.8181818182,
    "CL": 27.1,
    "TS%": -0.049,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1220,
    "IMP/G": 3.454545455,
    "SNP%": 0.737390357,
    "YPC": 0.0,
    "TGT": 107,
    "REC": 82,
    "MTF/A": 0.7068965517,
    "YCO/A": 0.7068965517,
    "recYPG": 110.9090909,
    "YPRR": 2.687758396,
    "1DRR": 0.2982591876
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7907,
    "NM": "Sam LaPorta",
    "POS": "TE",
    "AGE": 25.3,
    "TM": "DET",
    "G": 11,
    "FPTS": 199.6,
    "PPG": 18.14545455,
    "CSTY%": 0.8181818182,
    "CL": 31.7,
    "TS%": 0.544,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1096,
    "IMP/G": 4.272727273,
    "SNP%": 0.7915540594,
    "YPC": 0.0,
    "TGT": 102,
    "REC": 76,
    "MTF/A": 0.6198347107,
    "YCO/A": 0.6198347107,
    "recYPG": 99.63636364,
    "YPRR": 2.38203161,
    "1DRR": 0.2865329513
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6683,
    "NM": "Tua Tagovailoa",
    "POS": "QB",
    "AGE": 27.3,
    "TM": "MIA",
    "G": 11,
    "FPTS": 196.46,
    "PPG": 17.860000000000003,
    "CSTY%": 0.8181818182,
    "CL": 26.3,
    "TS%": null,
    "paYPG": 263.9090909,
    "paRTG": 103.7,
    "CMP%": 0.7275009425,
    "TTT": 2.084363636,
    "YDS(t)": 2726,
    "IMP/G": 1.909090909,
    "SNP%": 0.9420416817,
    "YPC": 0.96,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7570,
    "NM": "De'Von Achane",
    "POS": "RB",
    "AGE": 24.0,
    "TM": "MIA",
    "G": 10,
    "FPTS": 192.9,
    "PPG": 19.29,
    "CSTY%": 0.8,
    "CL": 41.1,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 947,
    "IMP/G": 4.5,
    "SNP%": 0.5903426791,
    "YPC": 6.63,
    "TGT": 51,
    "REC": 39,
    "MTF/A": 1.693181818,
    "YCO/A": 1.693181818,
    "recYPG": 42.5,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3625,
    "NM": "Patrick Mahomes",
    "POS": "QB",
    "AGE": 30.4,
    "TM": "KC",
    "G": 11,
    "FPTS": 192.26,
    "PPG": 17.47818182,
    "CSTY%": 0.8181818182,
    "CL": 27.46,
    "TS%": null,
    "paYPG": 248.4545455,
    "paRTG": 91.4,
    "CMP%": 0.656530528,
    "TTT": 2.99,
    "YDS(t)": 2613,
    "IMP/G": 8.363636364,
    "SNP%": 0.9801937729,
    "YPC": 3.4,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3116,
    "NM": "Davante Adams",
    "POS": "WR",
    "AGE": 32.9,
    "TM": "LV",
    "G": 11,
    "FPTS": 190.9,
    "PPG": 17.35454545,
    "CSTY%": 0.8181818182,
    "CL": 25.7,
    "TS%": 0.097,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1044,
    "IMP/G": 2.909090909,
    "SNP%": 0.91128499,
    "YPC": 0.0,
    "TGT": 115,
    "REC": 80,
    "MTF/A": 0.5833333333,
    "YCO/A": 0.5833333333,
    "recYPG": 94.90909091,
    "YPRR": 2.327473778,
    "1DRR": 0.3082191781
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7809,
    "NM": "Jahmyr Gibbs",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "NE",
    "G": 11,
    "FPTS": 185.3,
    "PPG": 16.84545455,
    "CSTY%": 0.7272727273,
    "CL": 24.7,
    "TS%": 0.177,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 929,
    "IMP/G": 2.181818182,
    "SNP%": 0.8605800873,
    "YPC": 0.0,
    "TGT": 100,
    "REC": 71,
    "MTF/A": 0.5915492958,
    "YCO/A": 0.5915492958,
    "recYPG": 84.45454545,
    "YPRR": 2.233703139,
    "1DRR": 0.2601880878
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5888,
    "NM": "Jaylen Waddle",
    "POS": "WR",
    "AGE": 27.0,
    "TM": "MIA",
    "G": 11,
    "FPTS": 184.7,
    "PPG": 16.79090909,
    "CSTY%": 0.8181818182,
    "CL": 23.8,
    "TS%": 0.246,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 905,
    "IMP/G": 2.636363636,
    "SNP%": 0.7134344918,
    "YPC": 0.0,
    "TGT": 87,
    "REC": 57,
    "MTF/A": 0.4651162791,
    "YCO/A": 0.4651162791,
    "recYPG": 82.27272727,
    "YPRR": 2.801108033,
    "1DRR": 0.2783505155
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5943,
    "NM": "D.J. Moore",
    "POS": "WR",
    "AGE": 28.4,
    "TM": "CHI",
    "G": 11,
    "FPTS": 184.4,
    "PPG": 16.76363636,
    "CSTY%": 0.8181818182,
    "CL": 29.7,
    "TS%": 0.087,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1153,
    "IMP/G": 2.636363636,
    "SNP%": 0.8767327873,
    "YPC": 0.0,
    "TGT": 106,
    "REC": 76,
    "MTF/A": 0.6447368421,
    "YCO/A": 0.6447368421,
    "recYPG": 104.8181818,
    "YPRR": 2.792029406,
    "1DRR": 0.2711864407
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5583,
    "NM": "Kyle Pitts",
    "POS": "TE",
    "AGE": 25.0,
    "TM": "ATL",
    "G": 11,
    "FPTS": 182.8,
    "PPG": 16.61818182,
    "CSTY%": 0.9090909091,
    "CL": 23.0,
    "TS%": 0.011,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 991,
    "IMP/G": 3.363636364,
    "SNP%": 0.7258758389,
    "YPC": 0.0,
    "TGT": 98,
    "REC": 69,
    "MTF/A": 0.5,
    "YCO/A": 0.5,
    "recYPG": 90.09090909,
    "YPRR": 2.053995681,
    "1DRR": 0.2745098039
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8205,
    "NM": "Nico Collins",
    "POS": "WR",
    "AGE": 26.7,
    "TM": "HOU",
    "G": 11,
    "FPTS": 180.7,
    "PPG": 16.42727273,
    "CSTY%": 0.7272727273,
    "CL": 26.8,
    "TS%": 0.245,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1064,
    "IMP/G": 3.090909091,
    "SNP%": 0.8100586767,
    "YPC": 0.0,
    "TGT": 93,
    "REC": 69,
    "MTF/A": 0.4946236559,
    "YCO/A": 0.4946236559,
    "recYPG": 96.72727273,
    "YPRR": 2.736326253,
    "1DRR": 0.2950819672
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9225,
    "NM": "Xavier Legette",
    "POS": "WR",
    "AGE": 24.4,
    "TM": "CAR",
    "G": 11,
    "FPTS": 180.1,
    "PPG": 16.37272727,
    "CSTY%": 0.9090909091,
    "CL": 27.4,
    "TS%": 0.351,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1066,
    "IMP/G": 3.818181818,
    "SNP%": 0.7263121024,
    "YPC": 0.0,
    "TGT": 95,
    "REC": 70,
    "MTF/A": 0.5957446809,
    "YCO/A": 0.5957446809,
    "recYPG": 96.90909091,
    "YPRR": 2.680609103,
    "1DRR": 0.2631578947
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5704,
    "NM": "Kenneth Walker",
    "POS": "RB",
    "AGE": 25.0,
    "TM": "SEA",
    "G": 11,
    "FPTS": 177.2,
    "PPG": 16.10909091,
    "CSTY%": 0.6363636364,
    "CL": 27.0,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1066,
    "IMP/G": 3.545454545,
    "SNP%": 0.6190562827,
    "YPC": 5.02,
    "TGT": 41,
    "REC": 31,
    "MTF/A": 0.9375,
    "YCO/A": 0.9375,
    "recYPG": 21.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7519,
    "NM": "Breece Hall",
    "POS": "RB",
    "AGE": 24.4,
    "TM": "NYJ",
    "G": 11,
    "FPTS": 176.4,
    "PPG": 16.03636364,
    "CSTY%": 0.6363636364,
    "CL": 27.3,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1054,
    "IMP/G": 3.454545455,
    "SNP%": 0.6648226051,
    "YPC": 4.54,
    "TGT": 54,
    "REC": 36,
    "MTF/A": 0.9655172414,
    "YCO/A": 0.9655172414,
    "recYPG": 28.09090909,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9186,
    "NM": "Rashee Rice",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "KC",
    "G": 11,
    "FPTS": 174.9,
    "PPG": 15.9,
    "CSTY%": 0.8181818182,
    "CL": 23.7,
    "TS%": 0.136,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 920,
    "IMP/G": 2.363636364,
    "SNP%": 0.8320634689,
    "YPC": 0.0,
    "TGT": 97,
    "REC": 70,
    "MTF/A": 0.5,
    "YCO/A": 0.5,
    "recYPG": 83.63636364,
    "YPRR": 2.238586157,
    "1DRR": 0.264957265
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5453,
    "NM": "Breece Hall",
    "POS": "WR",
    "AGE": 28.9,
    "TM": "CLE",
    "G": 11,
    "FPTS": 171.7,
    "PPG": 15.60909091,
    "CSTY%": 0.7272727273,
    "CL": 27.5,
    "TS%": 0.209,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 963,
    "IMP/G": 2.909090909,
    "SNP%": 0.8019243069,
    "YPC": 0.0,
    "TGT": 105,
    "REC": 66,
    "MTF/A": 0.4380952381,
    "YCO/A": 0.4380952381,
    "recYPG": 87.54545455,
    "YPRR": 2.16981232,
    "1DRR": 0.2517985612
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5659,
    "NM": "Jonathan Taylor",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "CIN",
    "G": 11,
    "FPTS": 171.1,
    "PPG": 15.55454545,
    "CSTY%": 0.8181818182,
    "CL": 24.5,
    "TS%": 0.236,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 878,
    "IMP/G": 2.818181818,
    "SNP%": 0.7995917367,
    "YPC": 0.0,
    "TGT": 84,
    "REC": 60,
    "MTF/A": 0.6,
    "YCO/A": 0.6,
    "recYPG": 79.81818182,
    "YPRR": 2.383391423,
    "1DRR": 0.275862069
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5618,
    "NM": "Tee Higgins",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "CIN",
    "G": 11,
    "FPTS": 167.4,
    "PPG": 15.21818182,
    "CSTY%": 0.6363636364,
    "CL": 27.8,
    "TS%": 0.223,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 984,
    "IMP/G": 2.636363636,
    "SNP%": 0.7641992392,
    "YPC": 0.0,
    "TGT": 97,
    "REC": 64,
    "MTF/A": 0.5945945946,
    "YCO/A": 0.5945945946,
    "recYPG": 89.45454545,
    "YPRR": 2.344128198,
    "1DRR": 0.2680412371
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7864,
    "NM": "Jayden Reed",
    "POS": "WR",
    "AGE": 25.2,
    "TM": "GB",
    "G": 11,
    "FPTS": 167.3,
    "PPG": 15.20909091,
    "CSTY%": 0.6363636364,
    "CL": 28.9,
    "TS%": 0.186,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 924,
    "IMP/G": 2.909090909,
    "SNP%": 0.7431062457,
    "YPC": 0.0,
    "TGT": 95,
    "REC": 68,
    "MTF/A": 0.5882352941,
    "YCO/A": 0.5882352941,
    "recYPG": 84.0,
    "YPRR": 2.254523139,
    "1DRR": 0.2289156627
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6795,
    "NM": "Trevor Lawrence",
    "POS": "QB",
    "AGE": 25.9,
    "TM": "JAX",
    "G": 11,
    "FPTS": 166.36,
    "PPG": 15.14,
    "CSTY%": 0.6363636364,
    "CL": 22.34,
    "TS%": null,
    "paYPG": 244.0,
    "paRTG": 89.0,
    "CMP%": 0.6889328063,
    "TTT": 2.648636364,
    "YDS(t)": 2682,
    "IMP/G": 5.545454545,
    "SNP%": 0.9605479562,
    "YPC": 4.16,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6827,
    "NM": "Josh Jacobs",
    "POS": "RB",
    "AGE": 27.5,
    "TM": "GB",
    "G": 11,
    "FPTS": 166.2,
    "PPG": 15.10909091,
    "CSTY%": 0.6363636364,
    "CL": 27.7,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 1027,
    "IMP/G": 2.363636364,
    "SNP%": 0.6775005031,
    "YPC": 5.33,
    "TGT": 38,
    "REC": 26,
    "MTF/A": 0.6666666667,
    "YCO/A": 0.6666666667,
    "recYPG": 20.36363636,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7599,
    "NM": "Bijan Robinson",
    "POS": "RB",
    "AGE": 23.4,
    "TM": "ATL",
    "G": 11,
    "FPTS": 165.7,
    "PPG": 15.06363636,
    "CSTY%": 0.6363636364,
    "CL": 20.9,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 867,
    "IMP/G": 2.181818182,
    "SNP%": 0.7335065673,
    "YPC": 4.45,
    "TGT": 45,
    "REC": 34,
    "MTF/A": 0.6976744186,
    "YCO/A": 0.6976744186,
    "recYPG": 23.63636364,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5749,
    "NM": "A.J. Brown",
    "POS": "WR",
    "AGE": 28.3,
    "TM": "PHI",
    "G": 11,
    "FPTS": 165.1,
    "PPG": 15.00909091,
    "CSTY%": 0.8181818182,
    "CL": 24.4,
    "TS%": 0.044,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 932,
    "IMP/G": 2.909090909,
    "SNP%": 0.8618709046,
    "YPC": 0.0,
    "TGT": 104,
    "REC": 77,
    "MTF/A": 0.4935064935,
    "YCO/A": 0.4935064935,
    "recYPG": 84.72727273,
    "YPRR": 2.398965732,
    "1DRR": 0.3099755202
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7861,
    "NM": "Zay Flowers",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "BAL",
    "G": 11,
    "FPTS": 164.4,
    "PPG": 14.94545455,
    "CSTY%": 0.6363636364,
    "CL": 24.5,
    "TS%": 0.164,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 884,
    "IMP/G": 2.909090909,
    "SNP%": 0.8101007812,
    "YPC": 0.0,
    "TGT": 103,
    "REC": 69,
    "MTF/A": 0.5348837209,
    "YCO/A": 0.5348837209,
    "recYPG": 80.36363636,
    "YPRR": 2.376676025,
    "1DRR": 0.2623762376
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7830,
    "NM": "Jordan Addison",
    "POS": "WR",
    "AGE": 25.1,
    "TM": "MIN",
    "G": 11,
    "FPTS": 163.6,
    "PPG": 14.87272727,
    "CSTY%": 0.6363636364,
    "CL": 24.8,
    "TS%": 0.069,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 932,
    "IMP/G": 3.181818182,
    "SNP%": 0.7445467031,
    "YPC": 0.0,
    "TGT": 92,
    "REC": 62,
    "MTF/A": 0.5185185185,
    "YCO/A": 0.5185185185,
    "recYPG": 84.72727273,
    "YPRR": 2.576458571,
    "1DRR": 0.2830188679
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9340,
    "NM": "Brian Thomas Jr.",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "JAX",
    "G": 11,
    "FPTS": 163.3,
    "PPG": 14.84545455,
    "CSTY%": 0.7272727273,
    "CL": 25.0,
    "TS%": 0.266,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 934,
    "IMP/G": 3.0,
    "SNP%": 0.7543467787,
    "YPC": 0.0,
    "TGT": 91,
    "REC": 65,
    "MTF/A": 0.5384615385,
    "YCO/A": 0.5384615385,
    "recYPG": 84.90909091,
    "YPRR": 2.233700785,
    "1DRR": 0.3108108108
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8155,
    "NM": "James Cook",
    "POS": "RB",
    "AGE": 26.1,
    "TM": "BUF",
    "G": 11,
    "FPTS": 162.5,
    "PPG": 14.77272727,
    "CSTY%": 0.6363636364,
    "CL": 23.0,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 921,
    "IMP/G": 2.909090909,
    "SNP%": 0.6739944442,
    "YPC": 5.12,
    "TGT": 44,
    "REC": 33,
    "MTF/A": 0.6136363636,
    "YCO/A": 0.6136363636,
    "recYPG": 26.18181818,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7553,
    "NM": "Drake London",
    "POS": "WR",
    "AGE": 24.0,
    "TM": "ATL",
    "G": 11,
    "FPTS": 161.2,
    "PPG": 14.65454545,
    "CSTY%": 0.7272727273,
    "CL": 23.2,
    "TS%": 0.153,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 870,
    "IMP/G": 2.909090909,
    "SNP%": 0.85700614,
    "YPC": 0.0,
    "TGT": 90,
    "REC": 63,
    "MTF/A": 0.5873015873,
    "YCO/A": 0.5873015873,
    "recYPG": 79.09090909,
    "YPRR": 2.049180328,
    "1DRR": 0.2535211268
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7775,
    "NM": "Tank Dell",
    "POS": "WR",
    "AGE": 26.1,
    "TM": "HOU",
    "G": 11,
    "FPTS": 160.6,
    "PPG": 14.6,
    "CSTY%": 0.7272727273,
    "CL": 24.0,
    "TS%": 0.141,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 884,
    "IMP/G": 3.0,
    "SNP%": 0.8397932817,
    "YPC": 0.0,
    "TGT": 83,
    "REC": 62,
    "MTF/A": 0.4578313253,
    "YCO/A": 0.4578313253,
    "recYPG": 80.36363636,
    "YPRR": 2.374789432,
    "1DRR": 0.2716049383
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9453,
    "NM": "Rome Odunze",
    "POS": "WR",
    "AGE": 23.0,
    "TM": "CHI",
    "G": 11,
    "FPTS": 160.3,
    "PPG": 14.57272727,
    "CSTY%": 0.6363636364,
    "CL": 25.5,
    "TS%": 0.047,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 893,
    "IMP/G": 3.454545455,
    "SNP%": 0.861366651,
    "YPC": 0.0,
    "TGT": 98,
    "REC": 63,
    "MTF/A": 0.5593220339,
    "YCO/A": 0.5593220339,
    "recYPG": 81.18181818,
    "YPRR": 2.446850435,
    "1DRR": 0.2558139535
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7747,
    "NM": "Rachaad White",
    "POS": "RB",
    "AGE": 26.3,
    "TM": "TB",
    "G": 11,
    "FPTS": 159.9,
    "PPG": 14.53636364,
    "CSTY%": 0.7272727273,
    "CL": 22.0,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 872,
    "IMP/G": 2.909090909,
    "SNP%": 0.7716276289,
    "YPC": 4.31,
    "TGT": 37,
    "REC": 29,
    "MTF/A": 0.6551724138,
    "YCO/A": 0.6551724138,
    "recYPG": 23.27272727,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5699,
    "NM": "Jaylen Waddle",
    "POS": "RB",
    "AGE": 26.6,
    "TM": "PIT",
    "G": 11,
    "FPTS": 159.7,
    "PPG": 14.51818182,
    "CSTY%": 0.8181818182,
    "CL": 25.0,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 974,
    "IMP/G": 3.272727273,
    "SNP%": 0.6181518238,
    "YPC": 5.35,
    "TGT": 40,
    "REC": 30,
    "MTF/A": 0.8064516129,
    "YCO/A": 0.8064516129,
    "recYPG": 27.27272727,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6783,
    "NM": "Jalen Hurts",
    "POS": "QB",
    "AGE": 27.3,
    "TM": "PHI",
    "G": 11,
    "FPTS": 156.44,
    "PPG": 14.22,
    "CSTY%": 0.6363636364,
    "CL": 21.84,
    "TS%": null,
    "paYPG": 248.4545455,
    "paRTG": 91.0,
    "CMP%": 0.671797044,
    "TTT": 2.505272727,
    "YDS(t)": 2601,
    "IMP/G": 6.454545455,
    "SNP%": 0.9655980145,
    "YPC": 3.39,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6452,
    "NM": "DeVonta Smith",
    "POS": "WR",
    "AGE": 26.7,
    "TM": "PHI",
    "G": 11,
    "FPTS": 155.1,
    "PPG": 14.1,
    "CSTY%": 0.7272727273,
    "CL": 24.5,
    "TS%": 0.279,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 844,
    "IMP/G": 2.545454545,
    "SNP%": 0.6962628853,
    "YPC": 0.0,
    "TGT": 86,
    "REC": 58,
    "MTF/A": 0.5517241379,
    "YCO/A": 0.5517241379,
    "recYPG": 76.72727273,
    "YPRR": 2.616697838,
    "1DRR": 0.2115384615
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9012,
    "NM": "Laporta St. Brown",
    "POS": "WR",
    "AGE": 23.9,
    "TM": "DET",
    "G": 11,
    "FPTS": 154.3,
    "PPG": 14.02727273,
    "CSTY%": 0.7272727273,
    "CL": 22.5,
    "TS%": 0.075,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 845,
    "IMP/G": 3.090909091,
    "SNP%": 0.7127181487,
    "YPC": 0.0,
    "TGT": 85,
    "REC": 60,
    "MTF/A": 0.5466666667,
    "YCO/A": 0.5466666667,
    "recYPG": 76.81818182,
    "YPRR": 2.278597786,
    "1DRR": 0.2519174041
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7025,
    "NM": "Garrett Wilson",
    "POS": "WR",
    "AGE": 25.1,
    "TM": "NYJ",
    "G": 11,
    "FPTS": 154.1,
    "PPG": 14.00909091,
    "CSTY%": 0.6363636364,
    "CL": 24.7,
    "TS%": 0.222,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 872,
    "IMP/G": 2.727272727,
    "SNP%": 0.8859470695,
    "YPC": 0.0,
    "TGT": 105,
    "REC": 64,
    "MTF/A": 0.5416666667,
    "YCO/A": 0.5416666667,
    "recYPG": 79.27272727,
    "YPRR": 2.097893432,
    "1DRR": 0.2857142857
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7616,
    "NM": "Travis Etienne",
    "POS": "RB",
    "AGE": 26.5,
    "TM": "JAX",
    "G": 11,
    "FPTS": 152.5,
    "PPG": 13.86363636,
    "CSTY%": 0.5454545455,
    "CL": 23.1,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 766,
    "IMP/G": 2.545454545,
    "SNP%": 0.6882809117,
    "YPC": 4.59,
    "TGT": 50,
    "REC": 33,
    "MTF/A": 0.6346153846,
    "YCO/A": 0.6346153846,
    "recYPG": 22.18181818,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9315,
    "NM": "Trey Benson",
    "POS": "RB",
    "AGE": 22.3,
    "TM": "ARI",
    "G": 11,
    "FPTS": 152.3,
    "PPG": 13.84545455,
    "CSTY%": 0.6363636364,
    "CL": 25.7,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 898,
    "IMP/G": 2.272727273,
    "SNP%": 0.6256576983,
    "YPC": 4.74,
    "TGT": 47,
    "REC": 35,
    "MTF/A": 0.7173913043,
    "YCO/A": 0.7173913043,
    "recYPG": 25.27272727,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3438,
    "NM": "Stefon Diggs",
    "POS": "WR",
    "AGE": 31.8,
    "TM": "HOU",
    "G": 11,
    "FPTS": 151.4,
    "PPG": 13.76363636,
    "CSTY%": 0.7272727273,
    "CL": 26.0,
    "TS%": 0.147,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 891,
    "IMP/G": 2.636363636,
    "SNP%": 0.8864801712,
    "YPC": 0.0,
    "TGT": 113,
    "REC": 73,
    "MTF/A": 0.5890410959,
    "YCO/A": 0.5890410959,
    "recYPG": 80.99999999999999,
    "YPRR": 2.260059268,
    "1DRR": 0.2831858407
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6394,
    "NM": "Jaylen Warren",
    "POS": "RB",
    "AGE": 26.4,
    "TM": "PIT",
    "G": 11,
    "FPTS": 150.9,
    "PPG": 13.71818182,
    "CSTY%": 0.5454545455,
    "CL": 20.5,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 777,
    "IMP/G": 2.636363636,
    "SNP%": 0.5679955558,
    "YPC": 5.08,
    "TGT": 41,
    "REC": 32,
    "MTF/A": 0.7317073171,
    "YCO/A": 0.7317073171,
    "recYPG": 24.72727273,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7771,
    "NM": "Sam Howell",
    "POS": "QB",
    "AGE": 25.6,
    "TM": "WSH",
    "G": 11,
    "FPTS": 150.42,
    "PPG": 13.67454545,
    "CSTY%": 0.6363636364,
    "CL": 23.5,
    "TS%": null,
    "paYPG": 263.1818182,
    "paRTG": 91.0,
    "CMP%": 0.6921471572,
    "TTT": 2.614181818,
    "YDS(t)": 2336,
    "IMP/G": 5.454545455,
    "SNP%": 0.9471032002,
    "YPC": 4.3,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7427,
    "NM": "George Pickens",
    "POS": "WR",
    "AGE": 24.4,
    "TM": "PIT",
    "G": 11,
    "FPTS": 149.7,
    "PPG": 13.60909091,
    "CSTY%": 0.5454545455,
    "CL": 23.8,
    "TS%": 0.039,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 905,
    "IMP/G": 2.272727273,
    "SNP%": 0.8749106961,
    "YPC": 0.0,
    "TGT": 105,
    "REC": 61,
    "MTF/A": 0.5476190476,
    "YCO/A": 0.5476190476,
    "recYPG": 82.27272727,
    "YPRR": 2.340688086,
    "1DRR": 0.2881355932
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5669,
    "NM": "Baker Mayfield",
    "POS": "QB",
    "AGE": 30.3,
    "TM": "TB",
    "G": 11,
    "FPTS": 148.62,
    "PPG": 13.51181818,
    "CSTY%": 0.7272727273,
    "CL": 23.8,
    "TS%": null,
    "paYPG": 254.6363636,
    "paRTG": 95.7,
    "CMP%": 0.6787486006,
    "TTT": 2.769545455,
    "YDS(t)": 2464,
    "IMP/G": 3.454545455,
    "SNP%": 0.9571934706,
    "YPC": 3.59,
    "TGT": 0,
    "REC": 0,
    "MTF/A": null,
    "YCO/A": null,
    "recYPG": 0.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6472,
    "NM": "Cole Kmet",
    "POS": "TE",
    "AGE": 26.2,
    "TM": "CHI",
    "G": 11,
    "FPTS": 147.7,
    "PPG": 13.42727273,
    "CSTY%": 0.7272727273,
    "CL": 24.9,
    "TS%": 0.332,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 829,
    "IMP/G": 3.0,
    "SNP%": 0.7587800944,
    "YPC": 0.0,
    "TGT": 92,
    "REC": 69,
    "MTF/A": 0.5507246377,
    "YCO/A": 0.5507246377,
    "recYPG": 75.36363636,
    "YPRR": 2.133026625,
    "1DRR": 0.2517985612
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9322,
    "NM": "Xavier Worthy",
    "POS": "RB",
    "AGE": 23.0,
    "TM": "KC",
    "G": 11,
    "FPTS": 147.3,
    "PPG": 13.39090909,
    "CSTY%": 0.5454545455,
    "CL": 23.1,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 738,
    "IMP/G": 2.545454545,
    "SNP%": 0.5872740388,
    "YPC": 4.79,
    "TGT": 52,
    "REC": 39,
    "MTF/A": 0.7179487179,
    "YCO/A": 0.7179487179,
    "recYPG": 26.27272727,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6312,
    "NM": "Mark Andrews",
    "POS": "TE",
    "AGE": 29.5,
    "TM": "BAL",
    "G": 11,
    "FPTS": 146.8,
    "PPG": 13.34545455,
    "CSTY%": 0.7272727273,
    "CL": 22.9,
    "TS%": 0.097,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 766,
    "IMP/G": 2.454545455,
    "SNP%": 0.7164404223,
    "YPC": 0.0,
    "TGT": 91,
    "REC": 67,
    "MTF/A": 0.5074626866,
    "YCO/A": 0.5074626866,
    "recYPG": 69.63636364,
    "YPRR": 1.993830691,
    "1DRR": 0.2589285714
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6977,
    "NM": "Dameon Pierce",
    "POS": "RB",
    "AGE": 25.0,
    "TM": "HOU",
    "G": 11,
    "FPTS": 146.5,
    "PPG": 13.31818182,
    "CSTY%": 0.4545454545,
    "CL": 23.8,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 837,
    "IMP/G": 2.636363636,
    "SNP%": 0.5635133243,
    "YPC": 4.74,
    "TGT": 38,
    "REC": 27,
    "MTF/A": 0.6296296296,
    "YCO/A": 0.6296296296,
    "recYPG": 22.36363636,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5554,
    "NM": "Kyren Williams",
    "POS": "RB",
    "AGE": 25.0,
    "TM": "LAR",
    "G": 11,
    "FPTS": 146.0,
    "PPG": 13.27272727,
    "CSTY%": 0.6363636364,
    "CL": 24.2,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 827,
    "IMP/G": 2.636363636,
    "SNP%": 0.6561269917,
    "YPC": 4.13,
    "TGT": 46,
    "REC": 33,
    "MTF/A": 0.6666666667,
    "YCO/A": 0.6666666667,
    "recYPG": 24.0,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3609,
    "NM": "Mike Evans",
    "POS": "WR",
    "AGE": 32.1,
    "TM": "TB",
    "G": 11,
    "FPTS": 145.6,
    "PPG": 13.23636364,
    "CSTY%": 0.6363636364,
    "CL": 23.9,
    "TS%": 0.186,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 828,
    "IMP/G": 2.363636364,
    "SNP%": 0.8646858623,
    "YPC": 0.0,
    "TGT": 104,
    "REC": 60,
    "MTF/A": 0.5,
    "YCO/A": 0.5,
    "recYPG": 75.27272727,
    "YPRR": 2.117364208,
    "1DRR": 0.2330097087
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9320,
    "NM": "Jonathon Brooks",
    "POS": "RB",
    "AGE": 22.4,
    "TM": "CAR",
    "G": 11,
    "FPTS": 145.1,
    "PPG": 13.19090909,
    "CSTY%": 0.6363636364,
    "CL": 21.5,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 794,
    "IMP/G": 2.636363636,
    "SNP%": 0.6485049327,
    "YPC": 4.19,
    "TGT": 44,
    "REC": 32,
    "MTF/A": 0.6818181818,
    "YCO/A": 0.6818181818,
    "recYPG": 24.18181818,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3596,
    "NM": "Adam Thielen",
    "POS": "WR",
    "AGE": 35.4,
    "TM": "CAR",
    "G": 11,
    "FPTS": 144.9,
    "PPG": 13.17272727,
    "CSTY%": 0.6363636364,
    "CL": 23.2,
    "TS%": -0.014,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 801,
    "IMP/G": 2.363636364,
    "SNP%": 0.7890738068,
    "YPC": 0.0,
    "TGT": 103,
    "REC": 73,
    "MTF/A": 0.4794520548,
    "YCO/A": 0.4794520548,
    "recYPG": 72.81818182,
    "YPRR": 2.109194488,
    "1DRR": 0.2612612613
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5174,
    "NM": "Joe Mixon",
    "POS": "RB",
    "AGE": 29.4,
    "TM": "HOU",
    "G": 11,
    "FPTS": 143.9,
    "PPG": 13.08181818,
    "CSTY%": 0.5454545455,
    "CL": 23.6,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 802,
    "IMP/G": 2.818181818,
    "SNP%": 0.6117095888,
    "YPC": 3.72,
    "TGT": 52,
    "REC": 39,
    "MTF/A": 0.5769230769,
    "YCO/A": 0.5769230769,
    "recYPG": 26.18181818,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7485,
    "NM": "Jameson Williams",
    "POS": "WR",
    "AGE": 24.5,
    "TM": "DET",
    "G": 11,
    "FPTS": 143.4,
    "PPG": 13.03636364,
    "CSTY%": 0.6363636364,
    "CL": 21.1,
    "TS%": 0.088,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 809,
    "IMP/G": 3.0,
    "SNP%": 0.7861416372,
    "YPC": 0.0,
    "TGT": 90,
    "REC": 60,
    "MTF/A": 0.5666666667,
    "YCO/A": 0.5666666667,
    "recYPG": 73.54545455,
    "YPRR": 2.178593511,
    "1DRR": 0.2338716627
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8204,
    "NM": "Rhamondre Stevenson",
    "POS": "RB",
    "AGE": 27.5,
    "TM": "NE",
    "G": 11,
    "FPTS": 143.0,
    "PPG": 13.0,
    "CSTY%": 0.4545454545,
    "CL": 24.0,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 810,
    "IMP/G": 2.727272727,
    "SNP%": 0.5853052121,
    "YPC": 4.07,
    "TGT": 52,
    "REC": 37,
    "MTF/A": 0.6730769231,
    "YCO/A": 0.6730769231,
    "recYPG": 26.72727273,
    "YPRR": null,
    "1DRR": null
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9044,
    "NM": "Josh Downs",
    "POS": "WR",
    "AGE": 24.0,
    "TM": "IND",
    "G": 11,
    "FPTS": 142.7,
    "PPG": 12.97272727,
    "CSTY%": 0.6363636364,
    "CL": 20.9,
    "TS%": 0.237,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 781,
    "IMP/G": 2.545454545,
    "SNP%": 0.7092391304,
    "YPC": 0.0,
    "TGT": 99,
    "REC": 69,
    "MTF/A": 0.4587155963,
    "YCO/A": 0.4587155963,
    "recYPG": 71.0,
    "YPRR": 2.157427937,
    "1DRR": 0.1964285714
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5732,
    "NM": "Najee Harris",
    "POS": "RB",
    "AGE": 27.2,
    "TM": "PIT",
    "G": 11,
    "FPTS": 142.7,
    "PPG": 12.97272727,
    "CSTY%": 0.4545454545,
    "CL": 24.5,
    "TS%": null,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": null,
    "YDS(t)": 810,
    "IMP/G": 2.909090909,
    "SNP%": 0.5680009572,
    "YPC": 4.25,
    "TGT": 39,
    "REC": 29,
    "MTF/A": 0.641025641,
    "YCO/A": 0.641025641,
    "recYPG": 23.72727273,
    "YPRR": null,
    "1DRR": null
  }
]
;

// === State ===
let players = [];
const dashState = { selectedPlayerId: null, filter: 'all' };

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
    .slice(0, 10)
    .map(p => ({ label: p.name.split(' ').pop() || p.name, value: p.stats.ppg }));
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
    setText('total-points-name', formatInitialLast(topFpts.name));
    setWidth('total-points-bar', (topFpts.stats.fpts / projectedMax) * 100);
  }
  if (topCstyRB) {
    setText('consistency-value', `${topCstyRB.stats.csty.toFixed(1)}%`);
    setText('consistency-name', formatInitialLast(topCstyRB.name));
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
        <span class="fc-option-team">${p.position} - ${p.team}</span>
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
    .filter(p => Number.isFinite(p.stats?.fpts))
    .sort((a, b) => b.stats.fpts - a.stats.fpts);
  const scatterPool = [];
  for (const p of topByFpts) {
    if (Number.isFinite(p.stats.csty) && Number.isFinite(p.stats.ceiling)) scatterPool.push(p);
    if (scatterPool.length >= 24) break;
  }
  if (!scatterPool.length) return;
  drawScatterChart('scatter-chart', scatterPool);
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

  window.addEventListener('resize', debounce(() => {
    renderRadar();
    renderBar();
    renderScatter();
  }, 200));
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
  const margin = { top: height * 0.12, right: width * 0.03, bottom: height * 0.12, left: width * 0.03 };
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
  const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, maxValue * 1.15]);
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
  const isMobile = window.innerWidth < 768;
  const strokeMain = Math.max(1, width * 0.008);
  const strokeGlow = Math.max(2, width * 0.015);
  const fontSizeVal = Math.max(8, width * 0.02);
  const fontSizeAxis = isMobile ? 5 : Math.max(8, width * 0.015);
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeGlow).attr('stroke-opacity', 0.3).style('filter', 'url(#neon-glow)').transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', (d, i) => `url(#bar-grad-${uid}-${i})`).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeMain).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('text').text(d => d.value.toFixed(1)).attr('x', d => x(d.label) + barWidth / 2).attr('y', innerHeight).attr('text-anchor', 'middle').attr('fill', (d, i) => colorScale(i)).attr('font-size', `${fontSizeVal}px`).attr('font-weight', '700').style('text-shadow', '0 0 10px rgba(0,0,0,1)').style('opacity', 0).transition().duration(1000).delay((d, i) => i * 50 + 400).attr('y', d => y(d.value) - (isMobile ? height * 0.05 : height * 0.02)).style('opacity', 1);
  g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSize(0)).selectAll('text').style('text-anchor', 'middle').style('fill', '#94a3b8').style('font-size', `${fontSizeAxis}px`).style('font-weight', '500').attr('dy', '1.5em');
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
  const margin = { top: isMobile ? 10 : height * 0.02, right: width * 0.05, bottom: isMobile ? 40 : height * 0.1, left: isMobile ? 40 : width * 0.06 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'scatter-tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
  const yDomain = [23, 41];
  const xDomain = [54, 102];
  const xTicks = [60, 70, 80, 90, 100];
  const x = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);
  const y = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]);
  const xAxisGrid = d3.axisBottom(x).tickValues(xTicks).tickSize(-innerHeight).tickFormat('');
  const yAxisGrid = d3.axisLeft(y).tickValues([25, 30, 35, 40]).tickSize(-innerWidth).tickFormat('');
  g.append('g').attr('class', 'scatter-grid').attr('transform', `translate(0,${innerHeight})`).call(xAxisGrid);
  g.append('g').attr('class', 'scatter-grid').call(yAxisGrid);
  g.append('g').attr('class', 'scatter-axis').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickValues(xTicks)).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('g').attr('class', 'scatter-axis').call(d3.axisLeft(y).tickValues([25, 30, 35, 40])).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('text').attr('x', innerWidth / 2).attr('y', innerHeight + (isMobile ? 35 : margin.bottom - 5)).attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight', 'bold').attr('letter-spacing', '0.1em').text('CONSISTENCY');
  g.append('text').attr('transform', 'rotate(-90)').attr('x', -innerHeight / 2).attr('y', isMobile ? -30 : -margin.left + 20).attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight', 'bold').attr('letter-spacing', '0.1em').text('CEILING');
  const circles = g.selectAll('.scatter-dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', d => `scatter-dot scatter-dot-${d.position.toLowerCase()}`)
    .attr('cx', d => x(clamp(d.stats.csty, xDomain[0], xDomain[1])))
    .attr('cy', d => y(d.stats.ceiling))
    .attr('r', 0)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 30)
    .ease(d3.easeBackOut)
    .attr('r', isMobile ? 3.5 : 7)
    .selection();

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
    tooltip.style.left = `${pageX + 12}px`;
    tooltip.style.top = `${pageY - 20}px`;
    tooltip.style.display = 'block';
  }
  function hideTooltip() { tooltip.style.display = 'none'; }

  circles.on('mouseenter', function(event,d){ if (!isMobile) showTooltip(event,d); })
         .on('mousemove', function(event,d){ if (!isMobile) showTooltip(event,d); })
         .on('mouseleave', function(){ if (!isMobile) hideTooltip(); })
         .on('touchstart', function(event,d){ showTooltip(event,d); event.preventDefault(); })
         .on('touchend', function(){ hideTooltip(); });
  const labels = g.selectAll('.scatter-label').data(data).enter().append('text').attr('class', 'scatter-label').attr('x', d => x(clamp(d.stats.csty, xDomain[0], xDomain[1]))).attr('y', d => y(d.stats.ceiling)).text(d => {
    const parts = d.name.split(' '); return `${parts[0][0]}. ${parts[parts.length - 1]}`;
  }).attr('opacity', 0);
  const labelNodes = data.map(d => {
    const cx = x(clamp(d.stats.csty, xDomain[0], xDomain[1]));
    const cy = y(d.stats.ceiling);
    return { ...d, fx: cx, fy: cy, x: cx, y: cy };
  });
  const sim = d3.forceSimulation(labelNodes)
    .force('anchorX', d3.forceX(d => x(d.stats.csty)).strength(3))
    .force('anchorY', d3.forceY(d => y(d.stats.ceiling) - 10).strength(3))
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
