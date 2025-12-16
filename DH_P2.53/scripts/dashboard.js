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
    "SLPR_ID": 4984,
    "NM": "Josh Allen",
    "POS": "QB",
    "AGE": 29.4,
    "TM": "BUF",
    "G": 13,
    "FPTS": 320.02,
    "PPG": 24.61692308,
    "CSTY%": 0.8461538462,
    "CL": 40.42666667,
    "TS%": NaN,
    "paYPG": 237.1538462,
    "paRTG": 102.87,
    "CMP%": 0.7010582011,
    "TTT": 2.684341029,
    "YDS(t)": 3570,
    "IMP/G": 14.30769231,
    "SNP%": 0.9698870765,
    "YPC": 5.6,
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
    "SLPR_ID": 6813,
    "NM": "Jonathan Taylor",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "IND",
    "G": 13,
    "FPTS": 309.0,
    "PPG": 23.76923077,
    "CSTY%": 0.7692307692,
    "CL": 40.4,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1660,
    "IMP/G": 6.153846154,
    "SNP%": 0.8447368421,
    "YPC": 5.49,
    "TGT": 40,
    "REC": 35,
    "MTF/A": 0.3319838057,
    "YCO/A": 2.672064777,
    "recYPG": 23.38461538,
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
    "G": 13,
    "FPTS": 307.6,
    "PPG": 23.66153846,
    "CSTY%": 0.7692307692,
    "CL": 43.53333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1536,
    "IMP/G": 5.461538462,
    "SNP%": 0.6371359223,
    "YPC": 5.68,
    "TGT": 66,
    "REC": 58,
    "MTF/A": 0.3315508021,
    "YCO/A": 1.668449198,
    "recYPG": 36.46153846,
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
    "G": 13,
    "FPTS": 287.4,
    "PPG": 22.10769231,
    "CSTY%": 0.9230769231,
    "CL": 31.8,
    "TS%": 0.338,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1464,
    "IMP/G": 5.0,
    "SNP%": 0.7418918919,
    "YPC": 5.14,
    "TGT": 121,
    "REC": 89,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 109.8461538,
    "YPRR": 4.139130435,
    "1DRR": 0.1565217391
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4046,
    "NM": "Patrick Mahomes",
    "POS": "QB",
    "AGE": 30.0,
    "TM": "KC",
    "G": 13,
    "FPTS": 282.62,
    "PPG": 21.74,
    "CSTY%": 0.6923076923,
    "CL": 29.54666667,
    "TS%": NaN,
    "paYPG": 261.3846154,
    "paRTG": 91.2,
    "CMP%": 0.6308016878,
    "TTT": 2.556943942,
    "YDS(t)": 3795,
    "IMP/G": 14.69230769,
    "SNP%": 0.9736842105,
    "YPC": 6.56,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": -0.7692307692,
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
    "G": 13,
    "FPTS": 271.9,
    "PPG": 20.91538462,
    "CSTY%": 1.0,
    "CL": 32.56666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1509,
    "IMP/G": 5.153846154,
    "SNP%": 0.7908309456,
    "YPC": 5.83,
    "TGT": 73,
    "REC": 55,
    "MTF/A": 0.378238342,
    "YCO/A": 2.787564767,
    "recYPG": 29.46153846,
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
    "G": 13,
    "FPTS": 269.28,
    "PPG": 20.71384615,
    "CSTY%": 0.7692307692,
    "CL": 29.1,
    "TS%": NaN,
    "paYPG": 279.7692308,
    "paRTG": 100.2,
    "CMP%": 0.6900826446,
    "TTT": 2.538095841,
    "YDS(t)": 3775,
    "IMP/G": 14.53846154,
    "SNP%": 0.979143798,
    "YPC": 3.14,
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
    "SLPR_ID": 9509,
    "NM": "Bijan Robinson",
    "POS": "RB",
    "AGE": 23.7,
    "TM": "ATL",
    "G": 13,
    "FPTS": 264.3,
    "PPG": 20.33076923,
    "CSTY%": 0.7692307692,
    "CL": 32.13333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1683,
    "IMP/G": 5.538461538,
    "SNP%": 0.7864583333,
    "YPC": 5.03,
    "TGT": 70,
    "REC": 56,
    "MTF/A": 0.3441860465,
    "YCO/A": 2.306976744,
    "recYPG": 46.30769231,
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
    "G": 13,
    "FPTS": 263.16,
    "PPG": 20.24307692,
    "CSTY%": 0.6153846154,
    "CL": 27.22666667,
    "TS%": NaN,
    "paYPG": 258.0,
    "paRTG": 113.14,
    "CMP%": 0.6666666667,
    "TTT": 2.560117845,
    "YDS(t)": 3344,
    "IMP/G": 13.30769231,
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
    "SLPR_ID": 9493,
    "NM": "Puka Nacua",
    "POS": "WR",
    "AGE": 24.3,
    "TM": "LAR",
    "G": 12,
    "FPTS": 258.9,
    "PPG": 21.575,
    "CSTY%": 0.9166666667,
    "CL": 33.1,
    "TS%": 0.273,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1259,
    "IMP/G": 5.083333333,
    "SNP%": 0.7004341534,
    "YPC": 12.17,
    "TGT": 118,
    "REC": 93,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 98.83333333,
    "YPRR": 3.717868339,
    "1DRR": 0.1630094044
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
    "SLPR_ID": 8137,
    "NM": "George Pickens",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "DAL",
    "G": 13,
    "FPTS": 245.9,
    "PPG": 18.91538462,
    "CSTY%": 0.8461538462,
    "CL": 31.6,
    "TS%": 0.231,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1179,
    "IMP/G": 4.769230769,
    "SNP%": 0.8254665203,
    "YPC": 0.0,
    "TGT": 114,
    "REC": 78,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 90.69230769,
    "YPRR": 2.540948276,
    "1DRR": 0.1163793103
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11560,
    "NM": "Caleb Williams",
    "POS": "QB",
    "AGE": 23.9,
    "TM": "CHI",
    "G": 13,
    "FPTS": 244.62,
    "PPG": 18.81692308,
    "CSTY%": 0.5384615385,
    "CL": 30.97333333,
    "TS%": NaN,
    "paYPG": 223.6923077,
    "paRTG": 87.23,
    "CMP%": 0.5777262181,
    "TTT": 2.922555868,
    "YDS(t)": 3251,
    "IMP/G": 12.69230769,
    "SNP%": 0.9867947179,
    "YPC": 4.94,
    "TGT": 2,
    "REC": 2,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 1.692307692,
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
    "G": 13,
    "FPTS": 239.56,
    "PPG": 18.42769231,
    "CSTY%": 0.5384615385,
    "CL": 30.49333333,
    "TS%": NaN,
    "paYPG": 227.2307692,
    "paRTG": 86.43,
    "CMP%": 0.6319148936,
    "TTT": 2.605152368,
    "YDS(t)": 3198,
    "IMP/G": 12.61538462,
    "SNP%": 0.9950062422,
    "YPC": 4.44,
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
    "SLPR_ID": 8130,
    "NM": "Trey McBride",
    "POS": "TE",
    "AGE": 25.8,
    "TM": "ARI",
    "G": 13,
    "FPTS": 234.7,
    "PPG": 18.05384615,
    "CSTY%": 0.8461538462,
    "CL": 28.2,
    "TS%": 0.25,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 937,
    "IMP/G": 3.769230769,
    "SNP%": 0.8982035928,
    "YPC": 0.0,
    "TGT": 127,
    "REC": 93,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 72.07692308,
    "YPRR": 1.859126984,
    "1DRR": 0.08134920635
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8138,
    "NM": "James Cook",
    "POS": "RB",
    "AGE": 26.0,
    "TM": "BUF",
    "G": 13,
    "FPTS": 234.5,
    "PPG": 18.03846154,
    "CSTY%": 0.6923076923,
    "CL": 27.53333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1575,
    "IMP/G": 4.923076923,
    "SNP%": 0.5959849435,
    "YPC": 5.25,
    "TGT": 31,
    "REC": 29,
    "MTF/A": 0.2610441767,
    "YCO/A": 2.172690763,
    "recYPG": 20.53846154,
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
    "paYPG": 238.5384615,
    "paRTG": 100.18,
    "CMP%": 0.6796875,
    "TTT": 2.658333333,
    "YDS(t)": 3265,
    "IMP/G": 12.92307692,
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
    "SLPR_ID": 7547,
    "NM": "Amon-Ra St. Brown",
    "POS": "WR",
    "AGE": 25.9,
    "TM": "DET",
    "G": 13,
    "FPTS": 233.5,
    "PPG": 17.96153846,
    "CSTY%": 0.7692307692,
    "CL": 31.7,
    "TS%": 0.281,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 985,
    "IMP/G": 3.692307692,
    "SNP%": 0.8300970874,
    "YPC": 3.0,
    "TGT": 117,
    "REC": 81,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 75.07692308,
    "YPRR": 2.508997429,
    "1DRR": 0.09768637532
  },
  {
    "SZN": 2025,
    "SLPR_ID": 3163,
    "NM": "Jared Goff",
    "POS": "QB",
    "AGE": 31.0,
    "TM": "DET",
    "G": 13,
    "FPTS": 232.76,
    "PPG": 17.90461538,
    "CSTY%": 0.6153846154,
    "CL": 26.46666667,
    "TS%": NaN,
    "paYPG": 256.4615385,
    "paRTG": 110.23,
    "CMP%": 0.7014563107,
    "TTT": 2.50657767,
    "YDS(t)": 3378,
    "IMP/G": 12.46153846,
    "SNP%": 0.9805825243,
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
    "SLPR_ID": 7523,
    "NM": "Trevor Lawrence",
    "POS": "QB",
    "AGE": 26.0,
    "TM": "JAX",
    "G": 13,
    "FPTS": 227.3,
    "PPG": 17.48461538,
    "CSTY%": 0.6923076923,
    "CL": 23.7,
    "TS%": NaN,
    "paYPG": 221.5384615,
    "paRTG": 83.26,
    "CMP%": 0.5952941176,
    "TTT": 2.62712526,
    "YDS(t)": 3131,
    "IMP/G": 12.76923077,
    "SNP%": 0.9866504854,
    "YPC": 4.11,
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
    "G": 12,
    "FPTS": 221.9,
    "PPG": 18.49166667,
    "CSTY%": 0.5833333333,
    "CL": 34.53333333,
    "TS%": 0.282,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1029,
    "IMP/G": 4.25,
    "SNP%": 0.9559659091,
    "YPC": 4.67,
    "TGT": 139,
    "REC": 91,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 84.58333333,
    "YPRR": 2.1875,
    "1DRR": 0.09913793103
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6804,
    "NM": "Jordan Love",
    "POS": "QB",
    "AGE": 26.9,
    "TM": "GB",
    "G": 13,
    "FPTS": 221.42,
    "PPG": 17.03230769,
    "CSTY%": 0.4615384615,
    "CL": 26.78,
    "TS%": NaN,
    "paYPG": 232.9230769,
    "paRTG": 105.36,
    "CMP%": 0.670984456,
    "TTT": 2.703495885,
    "YDS(t)": 3191,
    "IMP/G": 11.84615385,
    "SNP%": 0.9829396325,
    "YPC": 3.88,
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
    "G": 13,
    "FPTS": 215.38,
    "PPG": 16.56769231,
    "CSTY%": 0.6153846154,
    "CL": 24.05333333,
    "TS%": NaN,
    "paYPG": 209.3846154,
    "paRTG": 90.63,
    "CMP%": 0.6163069544,
    "TTT": 2.636992121,
    "YDS(t)": 3007,
    "IMP/G": 10.92307692,
    "SNP%": 0.9558638083,
    "YPC": 6.63,
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
    "G": 13,
    "FPTS": 211.8,
    "PPG": 16.29230769,
    "CSTY%": 0.6923076923,
    "CL": 24.23333333,
    "TS%": 0.242,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 718,
    "IMP/G": 3.615384615,
    "SNP%": 0.7516425756,
    "YPC": 0.0,
    "TGT": 105,
    "REC": 56,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 55.23076923,
    "YPRR": 1.884514436,
    "1DRR": 0.08661417323
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7588,
    "NM": "Javonte Williams",
    "POS": "RB",
    "AGE": 25.4,
    "TM": "DAL",
    "G": 13,
    "FPTS": 210.0,
    "PPG": 16.15384615,
    "CSTY%": 0.7692307692,
    "CL": 24.1,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1150,
    "IMP/G": 4.769230769,
    "SNP%": 0.758507135,
    "YPC": 4.75,
    "TGT": 46,
    "REC": 33,
    "MTF/A": 0.2930232558,
    "YCO/A": 2.48372093,
    "recYPG": 9.846153846,
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
    "G": 12,
    "FPTS": 207.8,
    "PPG": 17.31666667,
    "CSTY%": 0.8333333333,
    "CL": 27.9,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1068,
    "IMP/G": 4.75,
    "SNP%": 0.6307471264,
    "YPC": 3.97,
    "TGT": 38,
    "REC": 31,
    "MTF/A": 0.2815533981,
    "YCO/A": 2.033980583,
    "recYPG": 20.91666667,
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
    "G": 13,
    "FPTS": 202.9,
    "PPG": 15.60769231,
    "CSTY%": 0.6923076923,
    "CL": 24.23333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1149,
    "IMP/G": 5.230769231,
    "SNP%": 0.7082785808,
    "YPC": 4.86,
    "TGT": 35,
    "REC": 26,
    "MTF/A": 0.2857142857,
    "YCO/A": 1.709183673,
    "recYPG": 15.15384615,
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
    "G": 13,
    "FPTS": 200.68,
    "PPG": 15.43692308,
    "CSTY%": 0.6153846154,
    "CL": 26.7,
    "TS%": NaN,
    "paYPG": 243.2307692,
    "paRTG": 103.8,
    "CMP%": 0.6807909605,
    "TTT": 2.599745763,
    "YDS(t)": 3234,
    "IMP/G": 11.15384615,
    "SNP%": 0.9594594595,
    "YPC": 3.79,
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
    "G": 13,
    "FPTS": 189.8,
    "PPG": 14.6,
    "CSTY%": 0.6153846154,
    "CL": 20.43333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1098,
    "IMP/G": 3.538461538,
    "SNP%": 0.5776699029,
    "YPC": 4.56,
    "TGT": 39,
    "REC": 26,
    "MTF/A": 0.263681592,
    "YCO/A": 2.169154229,
    "recYPG": 13.92307692,
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
    "G": 13,
    "FPTS": 188.5,
    "PPG": 14.5,
    "CSTY%": 0.5384615385,
    "CL": 24.06666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1175,
    "IMP/G": 4.230769231,
    "SNP%": 0.547116737,
    "YPC": 4.62,
    "TGT": 20,
    "REC": 15,
    "MTF/A": 0.1981981982,
    "YCO/A": 1.846846847,
    "recYPG": 11.53846154,
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
    "G": 13,
    "FPTS": 185.8,
    "PPG": 14.29230769,
    "CSTY%": 0.6923076923,
    "CL": 21.4,
    "TS%": 0.269,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 808,
    "IMP/G": 2.769230769,
    "SNP%": 0.834378921,
    "YPC": -3.0,
    "TGT": 120,
    "REC": 76,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 62.38461538,
    "YPRR": 1.826576577,
    "1DRR": 0.06981981982
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9224,
    "NM": "Chase Brown",
    "POS": "RB",
    "AGE": 25.5,
    "TM": "CIN",
    "G": 13,
    "FPTS": 185.6,
    "PPG": 14.27692308,
    "CSTY%": 0.6153846154,
    "CL": 21.13333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1026,
    "IMP/G": 3.923076923,
    "SNP%": 0.6879063719,
    "YPC": 4.23,
    "TGT": 68,
    "REC": 51,
    "MTF/A": 0.2674418605,
    "YCO/A": 2.069767442,
    "recYPG": 23.0,
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
    "G": 12,
    "FPTS": 184.1,
    "PPG": 15.34166667,
    "CSTY%": 0.6666666667,
    "CL": 23.06666667,
    "TS%": 0.225,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 931,
    "IMP/G": 3.333333333,
    "SNP%": 0.7731543624,
    "YPC": 7.5,
    "TGT": 103,
    "REC": 61,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 76.33333333,
    "YPRR": 2.462365591,
    "1DRR": 0.09408602151
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12527,
    "NM": "Ashton Jeanty",
    "POS": "RB",
    "AGE": 21.8,
    "TM": "LV",
    "G": 13,
    "FPTS": 183.4,
    "PPG": 14.10769231,
    "CSTY%": 0.6153846154,
    "CL": 26.06666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 924,
    "IMP/G": 3.384615385,
    "SNP%": 0.7548209366,
    "YPC": 3.48,
    "TGT": 58,
    "REC": 45,
    "MTF/A": 0.3560209424,
    "YCO/A": 2.151832461,
    "recYPG": 19.92307692,
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
    "SLPR_ID": 6819,
    "NM": "Michael Pittman",
    "POS": "WR",
    "AGE": 28.0,
    "TM": "IND",
    "G": 13,
    "FPTS": 182.9,
    "PPG": 14.06923077,
    "CSTY%": 0.6923076923,
    "CL": 21.6,
    "TS%": 0.225,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 699,
    "IMP/G": 3.230769231,
    "SNP%": 0.8394736842,
    "YPC": 0.0,
    "TGT": 94,
    "REC": 69,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 53.76923077,
    "YPRR": 1.801546392,
    "1DRR": 0.09020618557
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4881,
    "NM": "Lamar Jackson",
    "POS": "QB",
    "AGE": 28.7,
    "TM": "BAL",
    "G": 10,
    "FPTS": 180.1,
    "PPG": 18.01,
    "CSTY%": 0.6,
    "CL": 27.56,
    "TS%": NaN,
    "paYPG": 206.0,
    "paRTG": 100.05,
    "CMP%": 0.6335877863,
    "TTT": 2.525548413,
    "YDS(t)": 2367,
    "IMP/G": 11.2,
    "SNP%": 0.9640151515,
    "YPC": 5.2,
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
    "TS%": 0.227,
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
    "SLPR_ID": 7526,
    "NM": "Jaylen Waddle",
    "POS": "WR",
    "AGE": 26.8,
    "TM": "MIA",
    "G": 13,
    "FPTS": 176.62,
    "PPG": 13.58615385,
    "CSTY%": 0.6153846154,
    "CL": 21.1,
    "TS%": 0.23,
    "paYPG": 0.6153846154,
    "paRTG": 100.0,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 841,
    "IMP/G": 3.307692308,
    "SNP%": 0.823782235,
    "YPC": 21.0,
    "TGT": 86,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 62.46153846,
    "YPRR": 2.453172205,
    "1DRR": 0.1087613293
  },
  {
    "SZN": 2025,
    "SLPR_ID": 96,
    "NM": "Aaron Rodgers",
    "POS": "QB",
    "AGE": 41.8,
    "TM": "PIT",
    "G": 12,
    "FPTS": 176.5,
    "PPG": 14.70833333,
    "CSTY%": 0.4166666667,
    "CL": 23.89333333,
    "TS%": NaN,
    "paYPG": 197.5,
    "paRTG": 96.2,
    "CMP%": 0.6540697674,
    "TTT": 2.40736729,
    "YDS(t)": 2387,
    "IMP/G": 8.166666667,
    "SNP%": 0.9345047923,
    "YPC": 1.53,
    "TGT": 1,
    "REC": 1,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": -0.75,
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
    "G": 13,
    "FPTS": 173.5,
    "PPG": 13.34615385,
    "CSTY%": 0.4615384615,
    "CL": 26.13333333,
    "TS%": 0.255,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 815,
    "IMP/G": 2.230769231,
    "SNP%": 0.8360655738,
    "YPC": 4.5,
    "TGT": 110,
    "REC": 54,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 62.0,
    "YPRR": 1.928229665,
    "1DRR": 0.05502392344
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8155,
    "NM": "Breece Hall",
    "POS": "RB",
    "AGE": 24.3,
    "TM": "NYJ",
    "G": 13,
    "FPTS": 172.76,
    "PPG": 13.28923077,
    "CSTY%": 0.5384615385,
    "CL": 23.28666667,
    "TS%": NaN,
    "paYPG": 0.3076923077,
    "paRTG": 122.92,
    "CMP%": 1.0,
    "TTT": NaN,
    "YDS(t)": 1190,
    "IMP/G": 4.538461538,
    "SNP%": 0.6528150134,
    "YPC": 4.36,
    "TGT": 40,
    "REC": 30,
    "MTF/A": 0.2139303483,
    "YCO/A": 1.905472637,
    "recYPG": 23.76923077,
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
    "G": 13,
    "FPTS": 170.5,
    "PPG": 13.11538462,
    "CSTY%": 0.6153846154,
    "CL": 22.33333333,
    "TS%": 0.183,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 555,
    "IMP/G": 2.076923077,
    "SNP%": 0.6981339188,
    "YPC": 1.0,
    "TGT": 90,
    "REC": 75,
    "MTF/A": NaN,
    "YCO/A": 1.0,
    "recYPG": 42.61538462,
    "YPRR": 1.454068241,
    "1DRR": 0.05249343832
  },
  {
    "SZN": 2025,
    "SLPR_ID": 6790,
    "NM": "D'Andre Swift",
    "POS": "RB",
    "AGE": 26.7,
    "TM": "CHI",
    "G": 12,
    "FPTS": 169.3,
    "PPG": 14.10833333,
    "CSTY%": 0.5833333333,
    "CL": 22.36666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 1093,
    "IMP/G": 4.833333333,
    "SNP%": 0.5816733068,
    "YPC": 4.84,
    "TGT": 40,
    "REC": 28,
    "MTF/A": 0.1965317919,
    "YCO/A": 1.786127168,
    "recYPG": 21.33333333,
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
    "TS%": 0.164,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 667,
    "IMP/G": 2.75,
    "SNP%": 0.8513119534,
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
    "paYPG": 203.6923077,
    "paRTG": 84.45,
    "CMP%": 0.6700251889,
    "TTT": 2.650701414,
    "YDS(t)": 2756,
    "IMP/G": 11.15384615,
    "SNP%": 0.9903581267,
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
    "SLPR_ID": 5045,
    "NM": "Courtland Sutton",
    "POS": "WR",
    "AGE": 30.0,
    "TM": "DEN",
    "G": 13,
    "FPTS": 165.3,
    "PPG": 12.71538462,
    "CSTY%": 0.5384615385,
    "CL": 20.33333333,
    "TS%": 0.191,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 773,
    "IMP/G": 3.0,
    "SNP%": 0.8739076155,
    "YPC": 0.0,
    "TGT": 90,
    "REC": 56,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 59.46153846,
    "YPRR": 1.733183857,
    "1DRR": 0.07623318386
  },
  {
    "SZN": 2025,
    "SLPR_ID": 1466,
    "NM": "Travis Kelce",
    "POS": "TE",
    "AGE": 36.0,
    "TM": "KC",
    "G": 13,
    "FPTS": 164.8,
    "PPG": 12.67692308,
    "CSTY%": 0.5384615385,
    "CL": 21.7,
    "TS%": 0.175,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 728,
    "IMP/G": 2.846153846,
    "SNP%": 0.7846889952,
    "YPC": 1.0,
    "TGT": 83,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": 0.0,
    "recYPG": 55.92307692,
    "YPRR": 1.781862745,
    "1DRR": 0.07843137255
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5846,
    "NM": "DK Metcalf",
    "POS": "WR",
    "AGE": 27.8,
    "TM": "PIT",
    "G": 13,
    "FPTS": 164.5,
    "PPG": 12.65384615,
    "CSTY%": 0.5384615385,
    "CL": 21.63333333,
    "TS%": 0.22,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 765,
    "IMP/G": 2.615384615,
    "SNP%": 0.88252149,
    "YPC": 6.0,
    "TGT": 87,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 57.92307692,
    "YPRR": 1.930769231,
    "1DRR": 0.07179487179
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9997,
    "NM": "Zay Flowers",
    "POS": "WR",
    "AGE": 25.0,
    "TM": "BAL",
    "G": 13,
    "FPTS": 163.5,
    "PPG": 12.57692308,
    "CSTY%": 0.5384615385,
    "CL": 21.2,
    "TS%": 0.27,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 935,
    "IMP/G": 2.846153846,
    "SNP%": 0.8734177215,
    "YPC": 4.89,
    "TGT": 95,
    "REC": 68,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 68.53846154,
    "YPRR": 2.427792916,
    "1DRR": 0.09264305177
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8148,
    "NM": "Jameson Williams",
    "POS": "WR",
    "AGE": 24.5,
    "TM": "DET",
    "G": 13,
    "FPTS": 162.4,
    "PPG": 12.49230769,
    "CSTY%": 0.5384615385,
    "CL": 23.5,
    "TS%": 0.173,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 814,
    "IMP/G": 2.692307692,
    "SNP%": 0.9004854369,
    "YPC": 2.0,
    "TGT": 72,
    "REC": 45,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 61.69230769,
    "YPRR": 1.904988124,
    "1DRR": 0.06888361045
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
    "SLPR_ID": 6786,
    "NM": "CeeDee Lamb",
    "POS": "WR",
    "AGE": 26.5,
    "TM": "DAL",
    "G": 10,
    "FPTS": 161.7,
    "PPG": 16.17,
    "CSTY%": 0.8,
    "CL": 22.13333333,
    "TS%": 0.181,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 867,
    "IMP/G": 3.3,
    "SNP%": 0.7111416781,
    "YPC": 2.0,
    "TGT": 89,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 86.5,
    "YPRR": 2.781350482,
    "1DRR": 0.09646302251
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12518,
    "NM": "Tyler Warren",
    "POS": "TE",
    "AGE": 23.4,
    "TM": "IND",
    "G": 13,
    "FPTS": 160.7,
    "PPG": 12.36153846,
    "CSTY%": 0.6153846154,
    "CL": 18.16666667,
    "TS%": 0.201,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 707,
    "IMP/G": 2.846153846,
    "SNP%": 0.8289473684,
    "YPC": 1.33,
    "TGT": 84,
    "REC": 60,
    "MTF/A": NaN,
    "YCO/A": 0.3333333333,
    "recYPG": 53.76923077,
    "YPRR": 1.92032967,
    "1DRR": 0.08241758242
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5872,
    "NM": "Deebo Samuel",
    "POS": "WR",
    "AGE": 29.7,
    "TM": "WAS",
    "G": 12,
    "FPTS": 159.0,
    "PPG": 13.25,
    "CSTY%": 0.5,
    "CL": 22.3,
    "TS%": 0.212,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 610,
    "IMP/G": 2.25,
    "SNP%": 0.7355021216,
    "YPC": 3.77,
    "TGT": 81,
    "REC": 62,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 46.75,
    "YPRR": 1.833333333,
    "1DRR": 0.06209150327
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8228,
    "NM": "Jaylen Warren",
    "POS": "RB",
    "AGE": 26.9,
    "TM": "PIT",
    "G": 12,
    "FPTS": 158.9,
    "PPG": 13.24166667,
    "CSTY%": 0.6666666667,
    "CL": 18.03333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 929,
    "IMP/G": 4.25,
    "SNP%": 0.5395348837,
    "YPC": 4.1,
    "TGT": 35,
    "REC": 30,
    "MTF/A": 0.3710691824,
    "YCO/A": 2.364779874,
    "recYPG": 23.08333333,
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
    "G": 13,
    "FPTS": 158.48,
    "PPG": 12.19076923,
    "CSTY%": 0.2307692308,
    "CL": 22.18,
    "TS%": NaN,
    "paYPG": 185.1538462,
    "paRTG": 86.43,
    "CMP%": 0.6685393258,
    "TTT": 2.449537597,
    "YDS(t)": 2449,
    "IMP/G": 9.846153846,
    "SNP%": 0.9598853868,
    "YPC": 2.21,
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
    "SLPR_ID": 6794,
    "NM": "Justin Jefferson",
    "POS": "WR",
    "AGE": 26.3,
    "TM": "MIN",
    "G": 13,
    "FPTS": 157.4,
    "PPG": 12.10769231,
    "CSTY%": 0.5384615385,
    "CL": 19.53333333,
    "TS%": 0.279,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 814,
    "IMP/G": 2.692307692,
    "SNP%": 0.9642857143,
    "YPC": 4.0,
    "TGT": 109,
    "REC": 64,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 62.30769231,
    "YPRR": 1.914893617,
    "1DRR": 0.0780141844
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
    "SLPR_ID": 12512,
    "NM": "Quinshon Judkins",
    "POS": "RB",
    "AGE": 21.9,
    "TM": "CLE",
    "G": 12,
    "FPTS": 155.0,
    "PPG": 12.91666667,
    "CSTY%": 0.5,
    "CL": 21.53333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 930,
    "IMP/G": 4.416666667,
    "SNP%": 0.5007032349,
    "YPC": 3.73,
    "TGT": 26,
    "REC": 18,
    "MTF/A": 0.2095238095,
    "YCO/A": 2.214285714,
    "recYPG": 12.16666667,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 11604,
    "NM": "Brock Bowers",
    "POS": "TE",
    "AGE": 22.8,
    "TM": "LV",
    "G": 10,
    "FPTS": 153.1,
    "PPG": 15.31,
    "CSTY%": 0.6,
    "CL": 26.96666667,
    "TS%": 0.178,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 621,
    "IMP/G": 3.1,
    "SNP%": 0.8256227758,
    "YPC": 1.0,
    "TGT": 73,
    "REC": 53,
    "MTF/A": NaN,
    "YCO/A": 1.5,
    "recYPG": 61.9,
    "YPRR": 1.934375,
    "1DRR": 0.078125
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
    "SLPR_ID": 12489,
    "NM": "RJ Harvey",
    "POS": "RB",
    "AGE": 24.6,
    "TM": "DEN",
    "G": 13,
    "FPTS": 151.1,
    "PPG": 11.62307692,
    "CSTY%": 0.3846153846,
    "CL": 22.43333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 39.58,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 601,
    "IMP/G": 2.384615385,
    "SNP%": 0.3320848939,
    "YPC": 3.89,
    "TGT": 42,
    "REC": 37,
    "MTF/A": 0.3076923077,
    "YCO/A": 1.538461538,
    "recYPG": 19.0,
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
    "G": 13,
    "FPTS": 150.7,
    "PPG": 11.59230769,
    "CSTY%": 0.3076923077,
    "CL": 26.36666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 657,
    "IMP/G": 2.923076923,
    "SNP%": 0.4627507163,
    "YPC": 4.64,
    "TGT": 58,
    "REC": 50,
    "MTF/A": 0.3,
    "YCO/A": 1.725,
    "recYPG": 22.0,
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
    "G": 13,
    "FPTS": 150.2,
    "PPG": 11.55384615,
    "CSTY%": 0.2307692308,
    "CL": 30.83333333,
    "TS%": 0.185,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 712,
    "IMP/G": 2.923076923,
    "SNP%": 0.8011976048,
    "YPC": 0.0,
    "TGT": 94,
    "REC": 61,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 54.76923077,
    "YPRR": 1.518123667,
    "1DRR": 0.07462686567
  },
  {
    "SZN": 2025,
    "SLPR_ID": 9758,
    "NM": "C.J. Stroud",
    "POS": "QB",
    "AGE": 24.0,
    "TM": "HOU",
    "G": 10,
    "FPTS": 148.64,
    "PPG": 14.864,
    "CSTY%": 0.3,
    "CL": 23.3,
    "TS%": NaN,
    "paYPG": 218.1,
    "paRTG": 90.03,
    "CMP%": 0.6428571429,
    "TTT": 2.498203463,
    "YDS(t)": 2375,
    "IMP/G": 11.3,
    "SNP%": 0.8969404187,
    "YPC": 6.06,
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
    "TS%": 0.206,
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
    "SLPR_ID": 12506,
    "NM": "Harold Fannin",
    "POS": "TE",
    "AGE": 21.2,
    "TM": "CLE",
    "G": 13,
    "FPTS": 143.9,
    "PPG": 11.06923077,
    "CSTY%": 0.4615384615,
    "CL": 19.63333333,
    "TS%": 0.19,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 629,
    "IMP/G": 2.153846154,
    "SNP%": 0.7623888183,
    "YPC": 2.0,
    "TGT": 85,
    "REC": 59,
    "MTF/A": NaN,
    "YCO/A": 1.0,
    "recYPG": 47.61538462,
    "YPRR": 1.831360947,
    "1DRR": 0.06804733728
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5892,
    "NM": "David Montgomery",
    "POS": "RB",
    "AGE": 28.3,
    "TM": "DET",
    "G": 13,
    "FPTS": 143.82,
    "PPG": 11.06307692,
    "CSTY%": 0.3846153846,
    "CL": 20.64,
    "TS%": NaN,
    "paYPG": 0.2307692308,
    "paRTG": 95.83,
    "CMP%": 0.5,
    "TTT": NaN,
    "YDS(t)": 770,
    "IMP/G": 3.230769231,
    "SNP%": 0.3932038835,
    "YPC": 4.67,
    "TGT": 25,
    "REC": 21,
    "MTF/A": 0.2558139535,
    "YCO/A": 2.279069767,
    "recYPG": 12.61538462,
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
    "SLPR_ID": 11627,
    "NM": "Troy Franklin",
    "POS": "WR",
    "AGE": 22.6,
    "TM": "DEN",
    "G": 13,
    "FPTS": 140.0,
    "PPG": 10.76923077,
    "CSTY%": 0.3846153846,
    "CL": 21.96666667,
    "TS%": 0.187,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 550,
    "IMP/G": 2.076923077,
    "SNP%": 0.6529338327,
    "YPC": 2.25,
    "TGT": 88,
    "REC": 51,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.61538462,
    "YPRR": 1.474114441,
    "1DRR": 0.05449591281
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8151,
    "NM": "Kenneth Walker III",
    "POS": "RB",
    "AGE": 24.9,
    "TM": "SEA",
    "G": 13,
    "FPTS": 138.6,
    "PPG": 10.66153846,
    "CSTY%": 0.3846153846,
    "CL": 18.96666667,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 936,
    "IMP/G": 3.461538462,
    "SNP%": 0.4743243243,
    "YPC": 4.48,
    "TGT": 26,
    "REC": 21,
    "MTF/A": 0.3235294118,
    "YCO/A": 1.7,
    "recYPG": 13.38461538,
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
    "G": 7,
    "FPTS": 138.0,
    "PPG": 19.71428571,
    "CSTY%": 0.7142857143,
    "CL": 26.33333333,
    "TS%": 0.141,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 540,
    "IMP/G": 4.142857143,
    "SNP%": 0.7081447964,
    "YPC": 4.0,
    "TGT": 67,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 74.28571429,
    "YPRR": 2.441314554,
    "1DRR": 0.103286385
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8134,
    "NM": "Khalil Shakir",
    "POS": "WR",
    "AGE": 25.6,
    "TM": "BUF",
    "G": 13,
    "FPTS": 138.0,
    "PPG": 10.61538462,
    "CSTY%": 0.4615384615,
    "CL": 18.56666667,
    "TS%": 0.203,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 590,
    "IMP/G": 1.846153846,
    "SNP%": 0.5922208281,
    "YPC": 5.0,
    "TGT": 78,
    "REC": 57,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 45.0,
    "YPRR": 1.899350649,
    "1DRR": 0.06493506494
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5947,
    "NM": "Jakobi Meyers",
    "POS": "WR",
    "AGE": 28.9,
    "TM": "JAX",
    "G": 12,
    "FPTS": 137.8,
    "PPG": 11.48333333,
    "CSTY%": 0.4166666667,
    "CL": 18.0,
    "TS%": 0.188,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 648,
    "IMP/G": 2.666666667,
    "SNP%": 0.8433048433,
    "YPC": 3.0,
    "TGT": 80,
    "REC": 55,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 53.0,
    "YPRR": 1.796610169,
    "1DRR": 0.0790960452
  },
  {
    "SZN": 2025,
    "SLPR_ID": 10213,
    "NM": "Tre Tucker",
    "POS": "WR",
    "AGE": 24.6,
    "TM": "LV",
    "G": 13,
    "FPTS": 137.0,
    "PPG": 10.53846154,
    "CSTY%": 0.3076923077,
    "CL": 23.0,
    "TS%": 0.175,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 610,
    "IMP/G": 2.076923077,
    "SNP%": 0.9393939394,
    "YPC": 6.0,
    "TGT": 72,
    "REC": 46,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 44.15384615,
    "YPRR": 1.307517084,
    "1DRR": 0.05011389522
  },
  {
    "SZN": 2025,
    "SLPR_ID": 5967,
    "NM": "Tony Pollard",
    "POS": "RB",
    "AGE": 28.4,
    "TM": "TEN",
    "G": 13,
    "FPTS": 136.4,
    "PPG": 10.49230769,
    "CSTY%": 0.3076923077,
    "CL": 18.93333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 914,
    "IMP/G": 3.230769231,
    "SNP%": 0.6508152174,
    "YPC": 4.25,
    "TGT": 34,
    "REC": 27,
    "MTF/A": 0.32,
    "YCO/A": 1.548571429,
    "recYPG": 13.15384615,
    "YPRR": NaN,
    "1DRR": NaN
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
    "SLPR_ID": 7002,
    "NM": "Juwan Johnson",
    "POS": "TE",
    "AGE": 29.0,
    "TM": "NO",
    "G": 13,
    "FPTS": 135.4,
    "PPG": 10.41538462,
    "CSTY%": 0.4615384615,
    "CL": 16.9,
    "TS%": 0.179,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 614,
    "IMP/G": 2.307692308,
    "SNP%": 0.7979924718,
    "YPC": 0.0,
    "TGT": 80,
    "REC": 58,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 47.23076923,
    "YPRR": 1.624338624,
    "1DRR": 0.07142857143
  },
  {
    "SZN": 2025,
    "SLPR_ID": 12522,
    "NM": "Cam Ward",
    "POS": "QB",
    "AGE": 23.3,
    "TM": "TEN",
    "G": 13,
    "FPTS": 134.42,
    "PPG": 10.34,
    "CSTY%": 0.07692307692,
    "CL": 16.92,
    "TS%": NaN,
    "paYPG": 189.8461538,
    "paRTG": 74.89,
    "CMP%": 0.5909090909,
    "TTT": 2.745133117,
    "YDS(t)": 2595,
    "IMP/G": 10.15384615,
    "SNP%": 1.0,
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
    "SLPR_ID": 8676,
    "NM": "Rashid Shaheed",
    "POS": "WR",
    "AGE": 27.1,
    "TM": "SEA",
    "G": 14,
    "FPTS": 132.4,
    "PPG": 9.457142857,
    "CSTY%": 0.2142857143,
    "CL": 17.76666667,
    "TS%": 0.229,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 644,
    "IMP/G": 2.0,
    "SNP%": 0.6575178998,
    "YPC": 5.86,
    "TGT": 82,
    "REC": 52,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 43.07142857,
    "YPRR": 1.591029024,
    "1DRR": 0.06332453826
  },
  {
    "SZN": 2025,
    "SLPR_ID": 4098,
    "NM": "Kareem Hunt",
    "POS": "RB",
    "AGE": 30.1,
    "TM": "KC",
    "G": 13,
    "FPTS": 131.9,
    "PPG": 10.14615385,
    "CSTY%": 0.3846153846,
    "CL": 18.63333333,
    "TS%": NaN,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 659,
    "IMP/G": 4.0,
    "SNP%": 0.4796650718,
    "YPC": 3.84,
    "TGT": 19,
    "REC": 14,
    "MTF/A": 0.2605633803,
    "YCO/A": 1.866197183,
    "recYPG": 8.769230769,
    "YPRR": NaN,
    "1DRR": NaN
  },
  {
    "SZN": 2025,
    "SLPR_ID": 8121,
    "NM": "Romeo Doubs",
    "POS": "WR",
    "AGE": 25.5,
    "TM": "GB",
    "G": 13,
    "FPTS": 131.2,
    "PPG": 10.09230769,
    "CSTY%": 0.3076923077,
    "CL": 19.7,
    "TS%": 0.188,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 542,
    "IMP/G": 2.461538462,
    "SNP%": 0.8070866142,
    "YPC": 0.0,
    "TGT": 73,
    "REC": 45,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 41.69230769,
    "YPRR": 1.667692308,
    "1DRR": 0.08307692308
  },
  {
    "SZN": 2025,
    "SLPR_ID": 7553,
    "NM": "Kyle Pitts",
    "POS": "TE",
    "AGE": 25.0,
    "TM": "ATL",
    "G": 13,
    "FPTS": 131.1,
    "PPG": 10.08461538,
    "CSTY%": 0.4615384615,
    "CL": 16.06666667,
    "TS%": 0.205,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 631,
    "IMP/G": 2.384615385,
    "SNP%": 0.859375,
    "YPC": 0.0,
    "TGT": 85,
    "REC": 62,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 48.53846154,
    "YPRR": 1.573566085,
    "1DRR": 0.07481296758
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
    "SLPR_ID": 8142,
    "NM": "Alec Pierce",
    "POS": "WR",
    "AGE": 25.4,
    "TM": "IND",
    "G": 11,
    "FPTS": 126.9,
    "PPG": 11.53636364,
    "CSTY%": 0.4545454545,
    "CL": 17.9,
    "TS%": 0.16,
    "paYPG": 0.0,
    "paRTG": 0.0,
    "CMP%": 0.0,
    "TTT": NaN,
    "YDS(t)": 769,
    "IMP/G": 3.0,
    "SNP%": 0.8546603476,
    "YPC": 0.0,
    "TGT": 67,
    "REC": 38,
    "MTF/A": NaN,
    "YCO/A": NaN,
    "recYPG": 69.90909091,
    "YPRR": 2.344512195,
    "1DRR": 0.09451219512
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
