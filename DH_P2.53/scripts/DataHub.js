// ---------------------------------------------------------------------------
// Hero copy and filter labels that drive the surrounding page shell.
// ---------------------------------------------------------------------------
const PRIMARY_TITLES = {
  "1-QB": "1QB ADP, TRADE VALUES & 2025 STATS",
  SFLX: "SFLX ADP, TRADE VALUES & 2025 STATS",
};

const CATEGORY_LABELS = {
  overview: "OVERVIEW (ALL)",
  passing: "PASSING (QB)",
  rushing: "RUSHING (RB)",
  receiving: "RECEIVING (W/T)",
};

// ---------------------------------------------------------------------------
// Column order is the main structural source of truth for each category view.
// These arrays simultaneously define:
// 1. visible column order
// 2. which columns remain frozen (the first STICKY_COLUMN_COUNT entries)
// 3. which fields participate in search/sort for that view
// 4. how column groups must line up with the rendered table
// ---------------------------------------------------------------------------
const COLUMN_SETS = {
  // GENERAL (frozen): RK, PLAYER, POS
  // INFO: TM, AGE
  // FANTASY: FPTS, PPG, VALUE, ADP, POS·ADP
  // OVERVIEW STATS: G, SNP%, YDS(t), YPG(t), OPP, IMP, IMP/OPP, CSTY%, CL
  overview: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "FPTS",
    "PPG",
    "VALUE",
    "ADP",
    "POS·ADP",
    "G",
    "SNP%",
    "YDS(t)",
    "YPG(t)",
    "OPP",
    "IMP",
    "IMP/OPP",
    "CSTY%",
    "CL",
  ],
  // GENERAL (frozen): RK, PLAYER, POS
  // INFO: TM, AGE, G
  // FANTASY: FPTS, PPG, VALUE, ADP, POS·ADP
  // PASSING: paYDS, paTD, CMP%, paATT, paRTG, EPA/DB, CPOE, CMP, YDS(t), paYPG, pa1D, IMP/G, pIMP, pIMP/A, TTT, PRS%, SAC, INT
  // RUSHING: ruYDS, ruTD, CAR, YPC, FUM
  // CEILING & CONSISTENCY: FPOE, CSTY%, CL
  passing: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "G",
    "FPTS",
    "PPG",
    "VALUE",
    "ADP",
    "POS·ADP",
    "paYDS",
    "paTD",
    "CMP%",
    "paATT",
    "paRTG",
    "EPA/DB",
    "CPOE",
    "CMP",
    "YDS(t)",
    "paYPG",
    "pa1D",
    "IMP/G",
    "pIMP",
    "pIMP/A",
    "TTT",
    "PRS%",
    "SAC",
    "INT",
    "ruYDS",
    "ruTD",
    "CAR",
    "YPC",
    "FUM",
    "FPOE",
    "CSTY%",
    "CL",
  ],
  // GENERAL (frozen): RK, PLAYER, POS
  // INFO: TM, AGE, G
  // FANTASY: FPTS, PPG, VALUE, ADP, POS·ADP
  // RUSHING EFFICIENCY: SNP%, YPC, ruYPG, IMP/G
  // RUSHING PRODUCTION: CAR, ruYDS, ruTD, ru1D, YDS(t), FUM
  // RECEIVING: REC, recYDS, recTD, rec1D, YAC, TGT
  // ADVANCED RUSHING: ELU, MTF/A, YCO/A, MTF, YCO, RYOE, EXPLSV%
  // CEILING & CONSISTENCY: FPOE, CSTY%, CL
  rushing: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "G",
    "FPTS",
    "PPG",
    "VALUE",
    "ADP",
    "POS·ADP",
    "SNP%",
    "YPC",
    "ruYPG",
    "IMP/G",
    "CAR",
    "ruYDS",
    "ruTD",
    "ru1D",
    "YDS(t)",
    "FUM",
    "REC",
    "recYDS",
    "recTD",
    "rec1D",
    "YAC",
    "TGT",
    "ELU",
    "MTF/A",
    "YCO/A",
    "MTF",
    "YCO",
    "RYOE",
    "EXPLSV%",
    "FPOE",
    "CSTY%",
    "CL",
  ],
  // GENERAL (frozen): RK, PLAYER, POS
  // INFO: TM, AGE, G
  // FANTASY: FPTS, PPG, VALUE, ADP, POS·ADP
  // RECEIVING: SNP%, TGT, REC, TS%, recYDS, recTD, YPRR, rec1D, 1DRR, recYPG, AY%, YAC, YPR, IMP/G, RR, YDS(t), RZ Tgt
  // RUSHING: CAR, ruYDS, ruTD, YPC, FUM
  // CEILING & CONSISTENCY: FPOE, CSTY%, CL
  receiving: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "G",
    "FPTS",
    "PPG",
    "VALUE",
    "ADP",
    "POS·ADP",
    "SNP%",
    "TGT",
    "REC",
    "TS%",
    "recYDS",
    "recTD",
    "YPRR",
    "rec1D",
    "1DRR",
    "recYPG",
    "AY%",
    "YAC",
    "YPR",
    "IMP/G",
    "RR",
    "YDS(t)",
    "RZ Tgt",
    "CAR",
    "ruYDS",
    "ruTD",
    "YPC",
    "FUM",
    "FPOE",
    "CSTY%",
    "CL",
  ],
};

// ---------------------------------------------------------------------------
// CSV alias map. A null alias means the current local CSV does not provide that
// field, but the column still exists in the reference layout and should render
// as "NA" until a future integration supplies live values.
// ---------------------------------------------------------------------------
const SOURCE_ALIASES = {
  PLAYER: "NM",
  RK: "PRK_PPR",
  FPTS: "FPT_PPR",
  G: "GM",
  VALUE: null,
  ADP: null,
  "POS·ADP": null,
  PPG: null,
};

// ---------------------------------------------------------------------------
// Lucide icon paths (24×24 viewBox, stroke-based). Only columns used in this
// app are listed here — no full icon library is loaded or bundled.
// ---------------------------------------------------------------------------
const COLUMN_ICONS = {
  RK:        "M4 6h16M4 12h8M4 18h4", // Hash-like lines
  PLAYER:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", // User
  POS:       "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01", // Tag
  TM:        "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10", // Home/Building
  AGE:       "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", // Calendar
  G:         "M22 12h-4l-3 9L9 3l-3 9H2", // Activity/Games played
  FPTS:      "M13 2L3 14h9l-1 8 10-12h-9l1-8z", // Zap
  PPG:       "M22 7 12 17 7 12 2 17", // TrendingUp
  VALUE:     "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", // DollarSign
  ADP:       "M18 20V10M12 20V4M6 20v-6", // BarChart2
  "POS·ADP": "M3 6h18M7 12h10M11 18h2", // ListFilter (3 lines decreasing)
  SNP:       "M22 12h-4l-3 9L9 3l-3 9H2", // Activity
  "SNP%":    "M22 12h-4l-3 9L9 3l-3 9H2", // Activity
  "YDS(t)":  "M22 3H2l8 9.46V19l4 2v-8.54L22 3z", // Filter/Ruler-like
  "YPG(t)":  "M18 20V10M12 20V4M6 20v-6", // BarChart
  OPP:       "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", // Shield/Opposition
  IMP:       "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", // Sun/Impact
  "IMP/OPP": "M12 2v20M2 12h20", // Percent-like cross
  "CSTY%":   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4", // ShieldCheck
  CL:        "M8.21 13.89L7 23l5-3 5 3-1.21-9.12M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5z", // Award-like
  paYDS:     "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z", // Send
  paTD:      "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3", // CheckCircle
  "CMP%":    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01", // Target-like
  paATT:     "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", // MessageSquare (attempts)
  paRTG:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", // Star
  "EPA/DB":  "M13 2L3 14h9l-1 8 10-12h-9l1-8z", // Zap
  CPOE:      "M22 7 12 17 7 12 2 17", // TrendingUp
  CMP:       "M20 6 9 17l-5-5", // Check
  paYPG:     "M22 7 12 17 7 12 2 17", // TrendingUp
  ruYDS:     "M5 12h14M12 5l7 7-7 7", // ArrowRight
  ruTD:      "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", // Flag
  pa1D:      "M9 18l6-6-6-6", // ChevronRight
  "IMP/G":   "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", // Gauge/Sun
  pIMP:      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 12l3 3 5-5", // Target+check
  "pIMP/A":  "M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM12 10v4M12 14h.01", // Percent frame
  CAR:       "M5 12h14M12 5l7 7-7 7", // ArrowRight (carries)
  YPC:       "M6 3l6 18M18 3l-6 18M3 12h18", // Divide
  TTT:       "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2", // Clock
  "PRS%":    "M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 1-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10", // Lock
  SAC:       "M5 12h14", // Minus
  INT:       "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01", // AlertTriangle
  FUM:       "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", // AlertCircle
  FPOE:      "M22 7 12 17 7 12 2 17", // TrendingUp
  REC:       "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z", // Inbox
  TGT:       "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", // Target circles
  ELU:       "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2 2 0 1 1 19 12H2", // Wind
  "MTF/A":   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", // Users
  "YCO/A":   "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7v6M12 13h.01", // MapPin
  MTF:       "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", // Users
  YCO:       "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3zM13 13l6 6", // Map/Compass
  "EXPLSV%": "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z", // Flame
  ru1D:      "M9 18l6-6-6-6", // ChevronRight
  RYOE:      "M22 7 12 17 7 12 2 17", // TrendingUp
  recTD:     "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", // Flag
  rec1D:     "M9 18l6-6-6-6", // ChevronRight
  YAC:       "M5 12h14M12 19l7-7-7-7", // ArrowRight (after catch)
  "TS%":     "M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM16 10h-6M12 8v4", // Target share
  YPRR:      "M22 7 12 17 7 12 2 17", // TrendingUp
  "1DRR":    "M18 20V10M12 20V4M6 20v-6", // BarChart
  recYPG:    "M22 7 12 17 7 12 2 17", // TrendingUp
  "AY%":     "M12 2v20M2 12h20", // Percent cross
  YPR:       "M6 3l6 18M18 3l-6 18M3 12h18", // Divide
  RR:        "M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3", // Repeat
  "RZ Tgt":  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", // Target
  ruYPG:     "M22 7 12 17 7 12 2 17", // TrendingUp
};

// ---------------------------------------------------------------------------
// Column group definitions per view. Each group has a label and lists the
// exact columns it spans (in-order, matching COLUMN_SETS). The frozen pane
// always uses FROZEN_GROUP. The scrollable pane uses per-category groups.
// ---------------------------------------------------------------------------
// GENERAL icon: User (person)
const FROZEN_GROUP = [{ label: "GENERAL", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", columns: ["RK", "PLAYER", "POS"] }];

// Group icons: badge-info, Star, BarChart2, Crosshair, Zap(new), TrendingUpDown(rotated), TrendingUp, Waypoints, Shield
const COLUMN_GROUPS = {
  overview: [
    { label: "INFO",           icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>',                                                                                                columns: ["TM", "AGE"] },
    { label: "FANTASY",        icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",                                                              columns: ["FPTS", "PPG", "VALUE", "ADP", "POS·ADP"] },
    { label: "OVERVIEW STATS", icon: "M18 20V10M12 20V4M6 20v-6",                                                                                                                                   columns: ["G", "SNP%", "YDS(t)", "YPG(t)", "OPP", "IMP", "IMP/OPP", "CSTY%", "CL"] },
  ],
  passing: [
    { label: "INFO",                  icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>',                                                                                           columns: ["TM", "AGE", "G"] },
    { label: "FANTASY",               icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",                                                         columns: ["FPTS", "PPG", "VALUE", "ADP", "POS·ADP"] },
    { label: "PASSING",               icon: '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',                                                                                                                                 columns: ["paYDS", "paTD", "CMP%", "paATT", "paRTG", "EPA/DB", "CPOE", "CMP", "YDS(t)", "paYPG", "pa1D", "IMP/G", "pIMP", "pIMP/A", "TTT", "PRS%", "SAC", "INT"] },
    { label: "RUSHING",               icon: "M13 10V3L4 14h7v7l9-11h-7z",                                                                                                                            columns: ["ruYDS", "ruTD", "CAR", "YPC", "FUM"] },
    { label: "CEILING & CONSISTENCY", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",                                                                                                          columns: ["FPOE", "CSTY%", "CL"] },
  ],
  rushing: [
    { label: "INFO",                  icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>',                                                                                           columns: ["TM", "AGE", "G"] },
    { label: "FANTASY",               icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",                                                         columns: ["FPTS", "PPG", "VALUE", "ADP", "POS·ADP"] },
    { label: "RUSHING EFFICIENCY",    icon: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",                                                                                                                             columns: ["SNP%", "YPC", "ruYPG", "IMP/G"] },
    { label: "RUSHING PRODUCTION",    icon: "M22 7 12 17 7 12 2 17",                                                                                                                                 columns: ["CAR", "ruYDS", "ruTD", "ru1D", "YDS(t)", "FUM"] },
    { label: "RECEIVING",             icon: '<g transform="rotate(-90 12 12)"><path d="M14.828 14.828 21 21"/><path d="M21 16v5h-5"/><path d="m21 3-9 9-4-4-6 6"/><path d="M21 8V3h-5"/></g>',                columns: ["REC", "recYDS", "recTD", "rec1D", "YAC", "TGT"] },
    { label: "ADVANCED RUSHING",      icon: '<path d="m10.586 5.414-5.172 5.172"/><path d="m18.586 13.414-5.172 5.172"/><path d="M6 12h12"/><circle cx="12" cy="20" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="4" cy="12" r="2"/>',                                                                                          columns: ["ELU", "MTF/A", "YCO/A", "MTF", "YCO", "RYOE", "EXPLSV%"] },
    { label: "CEILING & CONSISTENCY", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",                                                                                                          columns: ["FPOE", "CSTY%", "CL"] },
  ],
  receiving: [
    { label: "INFO",                  icon: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>',                                                                                           columns: ["TM", "AGE", "G"] },
    { label: "FANTASY",               icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",                                                         columns: ["FPTS", "PPG", "VALUE", "ADP", "POS·ADP"] },
    { label: "RECEIVING",             icon: '<g transform="rotate(-90 12 12)"><path d="M14.828 14.828 21 21"/><path d="M21 16v5h-5"/><path d="m21 3-9 9-4-4-6 6"/><path d="M21 8V3h-5"/></g>',                columns: ["SNP%", "TGT", "REC", "TS%", "recYDS", "recTD", "YPRR", "rec1D", "1DRR", "recYPG", "AY%", "YAC", "YPR", "IMP/G", "RR", "YDS(t)", "RZ Tgt"] },
    { label: "RUSHING",               icon: "M13 10V3L4 14h7v7l9-11h-7z",                                                                                                                            columns: ["CAR", "ruYDS", "ruTD", "YPC", "FUM"] },
    { label: "CEILING & CONSISTENCY", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",                                                                                                          columns: ["FPOE", "CSTY%", "CL"] },
  ],
};

// ---------------------------------------------------------------------------
// Table formatting and layout invariants.
// ---------------------------------------------------------------------------
const NON_FORMATTED_COLUMNS = new Set(["PLAYER", "POS", "TM", "AGE", "G"]);
const INVERTED_COLUMNS = new Set([
  "RK",
  "ADP",
  "POS·ADP",
  "INT",
  "FUM",
  "PRS%",
  "CSTY%",
]);
const NEUTRAL_COLUMNS = new Set(["TTT", "CL"]);
const PLAYER_COLUMN = "PLAYER";
const FPTS_COLUMN = "FPTS";
const STICKY_COLUMN_COUNT = 3;
const ALL_COLUMNS = [...new Set(Object.values(COLUMN_SETS).flat())];
const COMPACT_SCROLL_COLUMN_SCALE = 1.3;
const DEFAULT_COLUMN_WIDTH = 94;
const DEFAULT_COMPACT_COLUMN_WIDTH = 58;

const CATEGORY_FILTERS = {
  overview: (row) => Boolean(row.POS && row.POS !== "NA"),
  passing: (row) => row.POS === "QB",
  rushing: (row) => row.POS === "RB",
  receiving: (row, state) =>
    (row.POS === "WR" && state.receivingFilters.WR) ||
    (row.POS === "TE" && state.receivingFilters.TE),
};

const MOBILE_BREAKPOINT = 719;

const COLUMN_WIDTHS = {
  RK: 78,
  PLAYER: 172,
  POS: 86,
  TM: 82,
  AGE: 78,
  FPTS: 110,
  PPG: 92,
  VALUE: 100,
  ADP: 92,
  "POS·ADP": 116,
  G: 72,
  "SNP%": 94,
  "YDS(t)": 108,
  "YPG(t)": 102,
  OPP: 90,
  IMP: 88,
  "IMP/OPP": 102,
  "CSTY%": 94,
  CL: 86,
  paYDS: 104,
  paTD: 90,
  "CMP%": 92,
  paATT: 96,
  paRTG: 98,
  "EPA/DB": 96,
  CPOE: 94,
  CMP: 90,
  paYPG: 96,
  ruYDS: 100,
  ruTD: 88,
  pa1D: 88,
  "IMP/G": 96,
  pIMP: 90,
  "pIMP/A": 96,
  CAR: 88,
  YPC: 88,
  TTT: 88,
  "PRS%": 90,
  SAC: 82,
  INT: 82,
  FUM: 84,
  FPOE: 92,
  REC: 88,
  recYDS: 104,
  TGT: 88,
  ELU: 88,
  "MTF/A": 92,
  "YCO/A": 92,
  MTF: 86,
  YCO: 86,
  "EXPLSV%": 96,
  ru1D: 86,
  RYOE: 92,
  recTD: 88,
  rec1D: 88,
  YAC: 88,
  "TS%": 86,
  YPRR: 88,
  "1DRR": 88,
  recYPG: 96,
  "AY%": 84,
  YPR: 84,
  RR: 84,
  "RZ Tgt": 98,
};

const MOBILE_COLUMN_WIDTHS = {
  RK: 35,
  PLAYER: 62,
  POS: 37,
  TM: 52,
  AGE: 54,
  FPTS: 70,
  PPG: 62,
  VALUE: 62,
  ADP: 62,
  "POS·ADP": 74,
  G: 46,
  "SNP%": 62,
  "YDS(t)": 68,
  "YPG(t)": 62,
  OPP: 58,
  IMP: 56,
  "IMP/OPP": 68,
  "CSTY%": 60,
  CL: 52,
  paYDS: 68,
  paTD: 56,
  "CMP%": 62,
  paATT: 60,
  paRTG: 60,
  "EPA/DB": 62,
  CPOE: 58,
  CMP: 56,
  paYPG: 62,
  ruYDS: 62,
  ruTD: 54,
  pa1D: 54,
  "IMP/G": 62,
  pIMP: 56,
  "pIMP/A": 66,
  CAR: 52,
  YPC: 52,
  TTT: 52,
  "PRS%": 58,
  SAC: 50,
  INT: 50,
  FUM: 50,
  FPOE: 60,
  REC: 52,
  recYDS: 64,
  TGT: 52,
  ELU: 52,
  "MTF/A": 60,
  "YCO/A": 60,
  MTF: 52,
  YCO: 52,
  "EXPLSV%": 68,
  ru1D: 52,
  RYOE: 60,
  recTD: 54,
  rec1D: 54,
  YAC: 56,
  "TS%": 56,
  YPRR: 56,
  "1DRR": 56,
  recYPG: 62,
  "AY%": 54,
  YPR: 52,
  RR: 52,
  "RZ Tgt": 64,
};

// ---------------------------------------------------------------------------
// Runtime state. This app keeps a single in-memory dataset and re-renders the
// two-pane table whenever view state changes.
// ---------------------------------------------------------------------------
const state = {
  primaryTab: "1-QB",
  activeCategory: "overview",
  receivingFilters: {
    WR: true,
    TE: true,
  },
  searchText: "",
  rawSeasonRows: [],
  rows: [],
  displayedRows: [],
  supplementalDataLoaded: false,
  ktcLookups: {
    "1-QB": Object.create(null),
    SFLX: Object.create(null),
  },
  adpByPlayerId: Object.create(null),
  sort: {
    column: "RK",
    direction: "asc",
  },
  isCompactViewport: isCompactViewport(),
  columnFormatting: Object.create(null),
};

// ---------------------------------------------------------------------------
// DataHub-local Game Logs subsystem state.
// This modal is fully page-scoped: weekly/season caches, live Sleeper overlay,
// player metadata, and active modal UI state all live here instead of app.js.
// ---------------------------------------------------------------------------
const DATAHUB_API_BASE = "https://api.sleeper.app/v1";
const DATAHUB_MAX_DISPLAY_WEEKS = 18;
const DATAHUB_PLAYER_STATS_WEEKS = Object.freeze(
  Array.from({ length: DATAHUB_MAX_DISPLAY_WEEKS }, (_, index) => [index + 1, `WK${index + 1}`]),
);
const DATAHUB_PLAYER_STATS_CSV_PATHS = Object.freeze({
  season: new URL("../data/NFL-2025_Stats/SZN.csv", window.location.href).href,
  seasonRanks: new URL("../data/NFL-2025_Stats/SZN_RKs.csv", window.location.href).href,
  weeksDir: new URL("../data/NFL-2025_Stats/Weeks/", window.location.href),
});
const DATAHUB_TEAM_COLORS = Object.freeze({
  ARI: "#97233F",
  ATL: "#A71930",
  BAL: "#241773",
  BUF: "#00338D",
  CAR: "#0085CA",
  CHI: "#1a2d4e",
  CIN: "#FB4F14",
  CLE: "#311D00",
  DAL: "#003594",
  DEN: "#FB4F14",
  DET: "#0076B6",
  GB: "#203731",
  HOU: "#03202F",
  IND: "#002C5F",
  JAX: "#006778",
  KC: "#E31837",
  LAC: "#0080C6",
  LAR: "#003594",
  LV: "#A5ACAF",
  MIA: "#008E97",
  MIN: "#4F2683",
  NE: "#002244",
  NO: "#D3BC8D",
  NYG: "#0B2265",
  NYJ: "#125740",
  PHI: "#004C54",
  PIT: "#FFB612",
  SEA: "#69BE28",
  SF: "#B3995D",
  TB: "#D50A0A",
  TEN: "#4B92DB",
  WAS: "#5A1414",
  FA: "#64748b",
});
const gameLogsState = {
  statsSheetsLoaded: false,
  statsSheetsLoadPromise: null,
  textCache: new Map(),
  playerSeasonStats: Object.create(null),
  playerSeasonRanks: Object.create(null),
  playerWeeklyStats: Object.create(null),
  weeklyStats: Object.create(null),
  playerProjectionWeeks: Object.create(null),
  liveWeeklyStats: Object.create(null),
  liveStatsLoaded: false,
  currentNflSeason: null,
  currentNflWeek: null,
  lastLiveStatsWeek: null,
  lastLiveStatsFetchTs: 0,
  playerMetaById: Object.create(null),
  playerMetaLoaded: false,
  playerMetaLoadPromise: null,
  rankCache: Object.create(null),
  requestSeq: 0,
  activePlayer: null,
  activeRanks: null,
  activeSummary: null,
  activeFooterStats: { __gamesPlayed: 0 },
  currentView: "gl",
  activePanel: "game-logs",
  currentConsistencyData: null,
  radarChartInstance: null,
  initialized: false,
};

// ---------------------------------------------------------------------------
// DOM anchors that define the page shell around the custom table renderer.
// ---------------------------------------------------------------------------
const mainTitle = document.querySelector("#main-title");
const activeViewLabel = document.querySelector("#active-view-label");
const rowCount = document.querySelector("#row-count");
const overlay = document.querySelector("#grid-overlay");
const overlayTitle = document.querySelector("#overlay-title");
const overlayDescription = document.querySelector("#overlay-description");
const overlayActions = document.querySelector("#overlay-actions");
const filePickerButton = document.querySelector("#file-picker-button");
const filePickerInput = document.querySelector("#file-picker-input");
const playerSearch = document.querySelector("#player-search");
const gridContainer = document.querySelector("#player-grid");
const pageTabs = document.querySelector(".page-tabs");
const pageTabButtons = Array.from(document.querySelectorAll(".page-tabs .page-tab"));
const primaryTabButtons = Array.from(
  document.querySelectorAll("[data-primary-tab]"),
);
const categoryButtons = Array.from(
  document.querySelectorAll("[data-category]"),
);
const receivingSubfilters = document.querySelector("#receiving-subfilters");
const receivingButtons = Array.from(
  document.querySelectorAll("[data-receiving-filter]"),
);
// DataHub navigation stays fully page-local: these buttons and the shared More
// dropdown are wired here instead of relying on app.js so the page remains a
// standalone bundle.
const navButtons = Array.from(document.querySelectorAll(".main-nav .nav-item[data-nav]"));
const moreToggles = Array.from(document.querySelectorAll(".nav-more-toggle"));
const moreDropdown = document.querySelector("#datahubMoreMenu");
const moreDropdownItems = Array.from(
  document.querySelectorAll("#datahubMoreMenu .nav-more-item"),
);
const dataHubGameLogsModal = document.querySelector("#datahub-game-logs-modal");
const dataHubGameLogsModalOverlay = dataHubGameLogsModal?.querySelector(
  ".datahub-gamelogs-modal__overlay",
);
const dataHubGameLogsModalContent = dataHubGameLogsModal?.querySelector(
  ".datahub-gamelogs-modal__content",
);
const dataHubGameLogsCloseButtons = Array.from(
  dataHubGameLogsModal?.querySelectorAll("[data-gamelogs-close]") || [],
);
const dataHubGameLogsModalHeader = document.querySelector("#modal-header");
const dataHubGameLogsModalPlayerName = document.querySelector("#modal-player-name");
const dataHubGameLogsModalPlayerVitals = document.querySelector("#modal-player-vitals");
const dataHubGameLogsModalSummaryChips = document.querySelector("#modal-summary-chips");
const dataHubGameLogsModalBody = document.querySelector("#modal-body");
const dataHubGameLogsSeasonTabs = Array.from(
  dataHubGameLogsModal?.querySelectorAll(".gamelogs-season-tab") || [],
);
const dataHubGameLogsViewButtons = Array.from(
  dataHubGameLogsModal?.querySelectorAll(".gamelogs-view-option") || [],
);
const dataHubGameLogsFooterButtons = Array.from(
  dataHubGameLogsModal?.querySelectorAll(".datahub-gamelogs-footer-btn") || [],
);
const dataHubStatsKeyContainer = document.querySelector("#stats-key-container");
const dataHubStatsKeyBody = dataHubStatsKeyContainer?.querySelector(".stats-key-shared-body");
const dataHubRadarChartContainer = document.querySelector("#radar-chart-container");
const dataHubRadarChartContent = dataHubRadarChartContainer?.querySelector(".radar-chart-content");
const dataHubConsistencyContainer = document.querySelector("#consistency-container");

const PAGE_ROUTES = Object.freeze({
  home: "../index.html",
  rosters: "../rosters/rosters.html",
  ownership: "../ownership/ownership.html",
  datahub: "../datahub/datahub.html",
  leaguehub: "../leaguehub/leaguehub.html",
  research: "../research/research.html",
  contact: "../contact/contact.html",
});

const TROPHY_ROOM_HOST = "dynastyhub-trophyroom.netlify.app";

// Data Hub intentionally mirrors the Stats page KTC + ADP wiring locally so
// this page stays standalone and does not rely on app.js startup state.
const GOOGLE_SHEET_ID = "1MDTf1IouUIrm4qabQT9E5T0FsJhQtmaX55P32XK5c_0";
const KTC_SHEET_BY_FORMAT = Object.freeze({
  "1-QB": "KTC_1QB",
  SFLX: "KTC_SFLX",
});
const ADP_SHEET_NAME = "ADP_2026";

let supplementalDataPromise = null;

let activeMoreToggle = null;
let moreCloseTimer = 0;

initializeApp();

// ---------------------------------------------------------------------------
// Boot sequence. Order matters: the shell UI is synced first, the table frame
// is rendered immediately, and the dataset loads on top of the persistent
// overlay so the layout stays stable even before CSV import completes.
// ---------------------------------------------------------------------------
function initializeApp() {
  attachEventListeners();
  queueMicrotask(initializeDataHubGameLogs);
  syncPageTabButtons();
  syncUiState();
  updatePageTabsGlint();
  renderTable();
  showOverlay({
    title: "Preparing SZN.csv + valuations",
    description:
      "Loading season stats plus the KTC trade value and ADP feeds for the Data Hub table.",
  });
  loadInitialData();

  if (document.fonts?.ready) {
    document.fonts.ready
      .then(() => {
        updatePageTabsGlint();
      })
      .catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------
function attachEventListeners() {
  attachNavigationListeners();

  pageTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) {
        return;
      }

      // Page-view tabs are placeholders for now: clicking them should only
      // move the active styling and desktop glint, not trigger page data work.
      syncPageTabButtons(button);
      updatePageTabsGlint();
    });
  });

  primaryTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.primaryTab === button.dataset.primaryTab) {
        return;
      }

      state.primaryTab = button.dataset.primaryTab;
      syncUiState();

      // The 1-QB / SFLX tabs switch valuation context only; rebuild the same
      // season rows against the already-cached KTC + ADP lookups.
      if (!state.supplementalDataLoaded) {
        ensureDataHubSupplementalData().then(() => {
          rebuildDataHubRows();
        });
        return;
      }

      rebuildDataHubRows();
    });
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      syncUiState();
      refreshGrid();
    });
  });

  receivingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.receivingFilter;
      state.receivingFilters[key] = !state.receivingFilters[key];
      syncUiState();
      refreshGrid();
    });
  });

  playerSearch.addEventListener("input", (event) => {
    state.searchText = event.target.value;
    refreshGrid();
  });

  // The DataHub player column opens the local game logs modal through one
  // delegated listener so table re-renders never duplicate button handlers.
  gridContainer.addEventListener("click", handleDataHubGridClick);

  filePickerButton.addEventListener("click", () => filePickerInput.click());
  filePickerInput.addEventListener("change", handlePickedFile);

  window.addEventListener("load", updatePageTabsGlint);
  window.addEventListener("resize", handleViewportResize, { passive: true });
}

// Primary DataHub nav + More dropdown wiring.
// Notes:
// - Internal routes mirror the existing app page structure.
// - Trophy Room keeps the same optional `?user=` forwarding used elsewhere.
// - The dropdown is shared between mobile and desktop toggles and positioned
//   directly beneath whichever visible More button opens it.
function attachNavigationListeners() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.nav;
      if (!target) {
        return;
      }

      closeMoreDropdown({ immediate: true });
      navigateToPage(target);
    });
  });

  if (!moreDropdown) {
    return;
  }

  moreToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();

      if (activeMoreToggle === toggle && moreDropdown.classList.contains("is-open")) {
        closeMoreDropdown();
        return;
      }

      openMoreDropdown(toggle);
    });
  });

  moreDropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      const page = item.dataset.nav;
      const externalUrl = item.dataset.url;

      closeMoreDropdown({ immediate: true });

      if (externalUrl) {
        window.location.href = buildExternalUrl(externalUrl);
        return;
      }

      if (page) {
        navigateToPage(page);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!moreDropdown.classList.contains("is-open")) {
      return;
    }

    const clickedToggle = moreToggles.some((toggle) => toggle.contains(event.target));
    if (clickedToggle || moreDropdown.contains(event.target)) {
      return;
    }

    closeMoreDropdown();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMoreDropdown();
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!moreDropdown.classList.contains("is-open")) {
        return;
      }

      if (!activeMoreToggle || !isElementVisible(activeMoreToggle)) {
        closeMoreDropdown({ immediate: true });
        return;
      }

      positionMoreDropdown(activeMoreToggle);
    },
    { passive: true },
  );
}

function navigateToPage(page) {
  const destination = buildInternalUrl(page);
  if (!destination) {
    return;
  }

  window.location.href = destination;
}

function buildInternalUrl(page) {
  const route = PAGE_ROUTES[page];
  if (!route) {
    return null;
  }

  const username = readStoredUsername();
  if (!username || page === "home" || page === "datahub") {
    return route;
  }

  const separator = route.includes("?") ? "&" : "?";
  return `${route}${separator}username=${encodeURIComponent(username)}`;
}

function readStoredUsername() {
  try {
    return (localStorage.getItem("sleeper_username") || "").trim();
  } catch (error) {
    return "";
  }
}

function buildExternalUrl(rawUrl) {
  if (!rawUrl) {
    return rawUrl;
  }

  let parsed;
  try {
    parsed = new URL(rawUrl, window.location.origin);
  } catch (error) {
    return rawUrl;
  }

  if (parsed.hostname !== TROPHY_ROOM_HOST) {
    return parsed.toString();
  }

  const username = readStoredUsername();
  if (!username) {
    return parsed.toString();
  }

  parsed.searchParams.set("user", username);
  return parsed.toString();
}

function openMoreDropdown(toggle) {
  if (!moreDropdown) {
    return;
  }

  window.clearTimeout(moreCloseTimer);
  activeMoreToggle = toggle;
  syncMoreToggleState(toggle, true);

  moreDropdown.hidden = false;
  moreDropdown.setAttribute("aria-hidden", "false");
  positionMoreDropdown(toggle);

  requestAnimationFrame(() => {
    if (activeMoreToggle !== toggle) {
      return;
    }

    moreDropdown.classList.add("is-open");
  });
}

function closeMoreDropdown(options = {}) {
  if (!moreDropdown) {
    return;
  }

  const { immediate = false } = options;

  window.clearTimeout(moreCloseTimer);
  moreDropdown.classList.remove("is-open");
  moreDropdown.setAttribute("aria-hidden", "true");
  syncMoreToggleState(activeMoreToggle, false);
  activeMoreToggle = null;

  if (immediate) {
    moreDropdown.hidden = true;
    return;
  }

  moreCloseTimer = window.setTimeout(() => {
    if (!moreDropdown.classList.contains("is-open")) {
      moreDropdown.hidden = true;
    }
  }, 190);
}

function syncMoreToggleState(activeToggle, isExpanded) {
  moreToggles.forEach((toggle) => {
    const expanded = toggle === activeToggle && isExpanded;
    toggle.setAttribute("aria-expanded", String(expanded));
  });
}

function positionMoreDropdown(toggle) {
  if (!moreDropdown || !toggle) {
    return;
  }

  const wasHidden = moreDropdown.hidden;
  const previousVisibility = moreDropdown.style.visibility;

  if (wasHidden) {
    moreDropdown.hidden = false;
    moreDropdown.style.visibility = "hidden";
  }

  const rect = toggle.getBoundingClientRect();
  const margin = 12;
  const gap = state.isCompactViewport ? 8 : 10;
  const menuWidth = moreDropdown.offsetWidth || 0;
  const menuHeight = moreDropdown.offsetHeight || 0;
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = rect.left + (rect.width / 2) - (menuWidth / 2);
  left = Math.max(margin, Math.min(left, viewportWidth - margin - menuWidth));

  let top = rect.bottom + gap;
  const aboveTop = rect.top - menuHeight - gap;
  if (top + menuHeight + margin > viewportHeight && aboveTop >= margin) {
    top = aboveTop;
  }

  moreDropdown.style.left = `${Math.round(left)}px`;
  moreDropdown.style.top = `${Math.round(top)}px`;
  moreDropdown.style.right = "auto";
  moreDropdown.style.bottom = "auto";

  if (wasHidden) {
    moreDropdown.hidden = true;
    moreDropdown.style.visibility = previousVisibility;
  }
}

function isElementVisible(element) {
  if (!element) {
    return false;
  }

  return element.offsetParent !== null;
}

async function loadInitialData() {
  try {
    const [csvText] = await Promise.all([
      fetchCsvText(),
      ensureDataHubSupplementalData(),
    ]);
    applyCsvText(csvText);
    hideOverlay();
    preloadDataHubGameLogsData();
  } catch (error) {
    console.error(error);
    showOverlay({
      title: "Local browser access blocked",
      description:
        "This browser blocked direct access to SZN.csv from file://. Select the same local SZN.csv file to finish loading the Data Hub.",
      showActions: true,
    });
  }
}

async function fetchCsvText() {
  // DataHub season stats: reuse the same shipped SZN.csv as the Stats page, but
  // resolve it from this page's folder so the standalone reference bundle works in DH-P3.
  const seasonCsvUrl = new URL("../data/NFL-2025_Stats/SZN.csv", window.location.href);
  const response = await fetch(seasonCsvUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load SZN.csv (${response.status})`);
  }
  return response.text();
}

// Supplemental data mirrors the Stats page merge behavior locally:
// - KTC_1QB / KTC_SFLX provide VALUE + RK context
// - ADP_2026 provides ADP + POS·ADP context
async function ensureDataHubSupplementalData() {
  if (state.supplementalDataLoaded) {
    return;
  }

  if (supplementalDataPromise) {
    return supplementalDataPromise;
  }

  supplementalDataPromise = (async () => {
    const [oneQbLookup, sflxLookup, adpLookup] = await Promise.all([
      fetchKtcLookup(KTC_SHEET_BY_FORMAT["1-QB"]),
      fetchKtcLookup(KTC_SHEET_BY_FORMAT.SFLX),
      fetchDataHubAdpLookup(),
    ]);

    state.ktcLookups["1-QB"] = oneQbLookup;
    state.ktcLookups.SFLX = sflxLookup;
    state.adpByPlayerId = adpLookup;
    state.supplementalDataLoaded = true;
  })()
    .catch((error) => {
      console.error("Data Hub supplemental data load failed.", error);
      state.ktcLookups["1-QB"] = Object.create(null);
      state.ktcLookups.SFLX = Object.create(null);
      state.adpByPlayerId = Object.create(null);
      state.supplementalDataLoaded = true;
    })
    .finally(() => {
      supplementalDataPromise = null;
    });

  return supplementalDataPromise;
}

async function fetchGoogleSheetCsv(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
  }
  return response.text();
}

async function fetchKtcLookup(sheetName) {
  try {
    const csvText = await fetchGoogleSheetCsv(sheetName);
    return parseKtcSheetData(csvText);
  } catch (error) {
    console.error(`Unable to load Data Hub KTC sheet: ${sheetName}`, error);
    return Object.create(null);
  }
}

async function fetchDataHubAdpLookup() {
  try {
    const csvText = await fetchGoogleSheetCsv(ADP_SHEET_NAME);
    const rows = parseCsv(csvText);
    const adpLookup = Object.create(null);

    rows.forEach((row) => {
      const normalizedRow = buildNormalizedSheetRow(row);
      const playerId = getNormalizedSheetValue(normalizedRow, "SLPR_ID");
      if (!playerId) {
        return;
      }

      adpLookup[playerId] = {
        sflxAdp: toFloatOrNull(getNormalizedSheetValue(normalizedRow, "SFLX_ADP")),
        pprAdp: toFloatOrNull(getNormalizedSheetValue(normalizedRow, "PPR_ADP")),
        posAdp: toFloatOrNull(getNormalizedSheetValue(normalizedRow, "POS_ADP")),
        posSfAdp: toFloatOrNull(getNormalizedSheetValue(normalizedRow, ["P-SF_ADP", "POS_SF_ADP"])),
      };
    });

    return adpLookup;
  } catch (error) {
    console.error("Unable to load Data Hub ADP sheet.", error);
    return Object.create(null);
  }
}

function parseKtcSheetData(csvText) {
  const rows = parseCsv(csvText);
  const ktcLookup = Object.create(null);

  rows.forEach((row) => {
    const normalizedRow = buildNormalizedSheetRow(row);
    const pos = getNormalizedSheetValue(normalizedRow, "POS").toUpperCase();
    const playerId = getNormalizedSheetValue(normalizedRow, "SLPR_ID");

    // Pick rows stay out of scope here until Data Hub gets its own pick-values view.
    if (!playerId || playerId === "NA" || pos === "RDP") {
      return;
    }

    ktcLookup[playerId] = {
      ktc: toIntegerOrNull(getNormalizedSheetValue(normalizedRow, ["VALUE", "KTC"])),
      overallRank: toIntegerOrNull(getNormalizedSheetValue(normalizedRow, ["RANK", "OVR", "OVERALL", "SCA"])),
      posRank: getNormalizedSheetValue(normalizedRow, ["POS·RK", "POS RK", "POS_RK"]) || "",
      age: toFloatOrNull(getNormalizedSheetValue(normalizedRow, "AGE")),
    };
  });

  return ktcLookup;
}

function normalizeSheetHeader(header) {
  return String(header || "").replace(/[\u00a0\u202f]/g, " ").trim();
}

function buildNormalizedSheetRow(row) {
  const normalizedRow = new Map();
  Object.entries(row || {}).forEach(([key, value]) => {
    normalizedRow.set(
      normalizeSheetHeader(key).toUpperCase(),
      typeof value === "string" ? value.trim() : String(value ?? "").trim(),
    );
  });
  return normalizedRow;
}

function getNormalizedSheetValue(normalizedRow, names) {
  const candidates = Array.isArray(names) ? names : [names];
  for (const name of candidates) {
    const value = normalizedRow.get(normalizeSheetHeader(name).toUpperCase());
    if (value !== undefined) {
      return value;
    }
  }
  return "";
}

function toIntegerOrNull(value) {
  const parsedValue = Number.parseInt(String(value || "").trim(), 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function toFloatOrNull(value) {
  const parsedValue = Number.parseFloat(String(value || "").trim());
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getActiveKtcLookup() {
  return state.primaryTab === "SFLX"
    ? state.ktcLookups.SFLX
    : state.ktcLookups["1-QB"];
}

// Rebuild the rendered season rows from the cached CSV base so the Data Hub
// table can switch between 1-QB and SFLX instantly without re-fetching SZN.csv.
function rebuildDataHubRows() {
  if (!state.rawSeasonRows.length) {
    state.rows = [];
    gameLogsState.rankCache = Object.create(null);
    refreshGrid();
    return;
  }

  const ktcLookup = getActiveKtcLookup();
  const adpLookup = state.adpByPlayerId || Object.create(null);

  state.rows = state.rawSeasonRows.map((row) => {
    const enrichedRow = enrichSeasonRow(row, ktcLookup, adpLookup);
    return normalizeRow(enrichedRow);
  });
  gameLogsState.rankCache = buildDataHubGameLogRankCache(state.rows);

  refreshGrid();
}

function enrichSeasonRow(sourceRow, ktcLookup, adpLookup) {
  const enrichedRow = { ...sourceRow };
  const playerId = String(sourceRow.SLPR_ID || sourceRow.slpr_id || "").trim();
  const ktcEntry = playerId ? ktcLookup?.[playerId] : null;
  const adpEntry = playerId ? adpLookup?.[playerId] : null;
  const fallbackRank = toComparableNumber(sourceRow.RK ?? sourceRow.PRK_PPR);
  const gamesPlayed = toComparableNumber(sourceRow.GM ?? sourceRow.GM_P);
  const fantasyPoints = toComparableNumber(sourceRow.FPTS ?? sourceRow.FPT_PPR);
  const ppg = computePpgValue(fantasyPoints, gamesPlayed);

  // Match the Stats page merge path: KTC rank/value override the season row
  // when present, while ADP columns are format-aware and sourced from ADP_2026.
  enrichedRow.RK = formatIntegerString(ktcEntry?.overallRank ?? fallbackRank);
  enrichedRow.VALUE = formatIntegerString(ktcEntry?.ktc);
  enrichedRow.ADP = formatFixedString(
    state.primaryTab === "SFLX" ? adpEntry?.sflxAdp : adpEntry?.pprAdp,
    1,
  );
  enrichedRow["POS·ADP"] = formatFixedString(
    state.primaryTab === "SFLX" ? adpEntry?.posSfAdp : adpEntry?.posAdp,
    1,
  );
  enrichedRow.PPG = formatFixedString(ppg, 1);
  if (!String(enrichedRow.AGE || "").trim() && Number.isFinite(ktcEntry?.age)) {
    enrichedRow.AGE = Number(ktcEntry.age).toFixed(1);
  }
  if (ktcEntry?.posRank) {
    enrichedRow.POS_RK = String(ktcEntry.posRank).trim();
  }

  return enrichedRow;
}

function computePpgValue(fantasyPoints, gamesPlayed) {
  if (!Number.isFinite(fantasyPoints)) {
    return null;
  }

  if (!Number.isFinite(gamesPlayed) || gamesPlayed <= 0) {
    return null;
  }

  return fantasyPoints / gamesPlayed;
}

function formatIntegerString(value) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return String(Math.round(value));
}

function formatFixedString(value, decimals) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Number(value).toFixed(decimals);
}

async function handlePickedFile(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    showOverlay({
      title: "Importing SZN.csv",
      description:
        "Parsing the selected local file and merging it with the Data Hub KTC + ADP lookups.",
    });
    await ensureDataHubSupplementalData();
    const csvText = await file.text();
    applyCsvText(csvText);
    hideOverlay();
  } catch (error) {
    console.error(error);
    showOverlay({
      title: "Could not read the selected file",
      description:
        "Select the local SZN.csv file from this folder and try again.",
      showActions: true,
    });
  } finally {
    filePickerInput.value = "";
  }
}

// Normalize the current CSV payload into app state, then rebuild every derived
// view (formatting tiers, search results, row count, and the two-pane table).
function applyCsvText(csvText) {
  state.rawSeasonRows = parseCsv(csvText).filter(
    (row) => (row.NM || "").trim() || (row.POS || "").trim(),
  );

  rebuildDataHubRows();
}

// Refreshing the grid always follows the same pipeline:
// category filter -> formatting metrics -> free-text search -> sort -> render.
function refreshGrid() {
  const visibleRows = getVisibleRows();
  state.columnFormatting = buildColumnFormatting(visibleRows);
  const searchedRows = visibleRows.filter(matchesSearch);
  state.displayedRows = sortRows(searchedRows);
  renderTable();
  updateRowCount();
}

// Sync the non-table shell controls so the header, chips, and receiving
// subfilters stay aligned with the active in-memory state.
function syncUiState() {
  mainTitle.textContent = PRIMARY_TITLES[state.primaryTab];
  activeViewLabel.textContent = CATEGORY_LABELS[state.activeCategory];

  primaryTabButtons.forEach((button) => {
    const isActive = button.dataset.primaryTab === state.primaryTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === state.activeCategory;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  const showReceivingFilters = state.activeCategory === "receiving";
  receivingSubfilters.hidden = !showReceivingFilters;

  receivingButtons.forEach((button) => {
    const key = button.dataset.receivingFilter;
    const isActive = Boolean(state.receivingFilters[key]);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

// Desktop-only glint positioning for the top page tabs. This depends on the
// actual rendered tab widths, so it is recalculated on load, resize, and when
// fonts finish loading.
function updatePageTabsGlint() {
  if (!pageTabs) {
    return;
  }

  if (isCompactViewport()) {
    pageTabs.style.removeProperty("--page-tabs-glint-left");
    pageTabs.style.removeProperty("--page-tabs-glint-width");
    return;
  }

  const activeTab = pageTabs.querySelector(".page-tab.is-active");
  if (!activeTab) {
    return;
  }

  const tabsRect = pageTabs.getBoundingClientRect();
  const activeRect = activeTab.getBoundingClientRect();
  const glowCenter = activeRect.left - tabsRect.left + (activeRect.width / 2);
  const glowWidth = Math.max(56, Math.min(activeRect.width * 0.72, 128));

  pageTabs.style.setProperty("--page-tabs-glint-left", `${glowCenter}px`);
  pageTabs.style.setProperty("--page-tabs-glint-width", `${glowWidth}px`);
}

// Page-view tab shell state stays UI-only for the current placeholder tabs.
// It keeps one tab visually active and updates accessibility state without
// changing the table, hero copy, or any loaded data.
function syncPageTabButtons(nextActiveButton = null) {
  if (!pageTabButtons.length) {
    return;
  }

  const activeButton = nextActiveButton
    ?? pageTabButtons.find((button) => button.classList.contains("is-active"))
    ?? pageTabButtons[0];

  pageTabButtons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function updateRowCount() {
  const displayedRows = state.displayedRows.length;
  rowCount.textContent = `${displayedRows} row${displayedRows === 1 ? "" : "s"}`;
}

// Render one frame composed of two synchronized tables:
// - frozen pane: identity columns only
// - scroll pane: category-dependent stats columns
// Both tables must stay column-order compatible with COLUMN_SETS/COLUMN_GROUPS.
function renderTable() {
  // Preserve horizontal scroll position across re-renders (e.g. after a sort)
  const savedScrollLeft = gridContainer.querySelector(".table-pane--scroll")?.scrollLeft ?? 0;

  const allColumns = COLUMN_SETS[state.activeCategory];
  const frozenNames = allColumns.slice(0, STICKY_COLUMN_COUNT);
  const scrollNames = allColumns.slice(STICKY_COLUMN_COUNT);

  const { columns: frozenCols, totalWidth: frozenWidth } = buildColumnLayout(frozenNames);
  // Non-frozen columns are intentionally wider on compact viewports so the
  // horizontal table section stays legible once headers and chips compress.
  const { columns: scrollCols, totalWidth: scrollWidth } = buildColumnLayout(
    scrollNames,
    COMPACT_SCROLL_COLUMN_SCALE,
  );

  // ── Frozen pane ──────────────────────────────────────────────────────────
  const frozenTable = buildTable(frozenCols, frozenWidth, FROZEN_GROUP, "frozen");
  const frozenPane = document.createElement("div");
  frozenPane.className = "table-pane table-pane--frozen";
  frozenPane.append(frozenTable);

  // ── Scroll pane ──────────────────────────────────────────────────────────
  const scrollTable = buildTable(scrollCols, scrollWidth, COLUMN_GROUPS[state.activeCategory], "scroll");
  const scrollPane = document.createElement("div");
  scrollPane.className = "table-pane table-pane--scroll";
  scrollPane.append(scrollTable);

  // ── Assemble frame ────────────────────────────────────────────────────────
  const frame = document.createElement("div");
  frame.className = "table-frame";
  frame.append(frozenPane, scrollPane);

  gridContainer.replaceChildren(frame);

  // Restore horizontal scroll position (avoids snap-to-left after sort/re-render)
  scrollPane.scrollLeft = savedScrollLeft;

  // Vertical scroll sync: right pane is the sole scroll container; left pane follows via JS
  scrollPane.addEventListener("scroll", () => {
    if (frozenPane.scrollTop !== scrollPane.scrollTop) {
      frozenPane.scrollTop = scrollPane.scrollTop;
    }
  });

  attachFrozenPaneScrollProxy(frozenPane, scrollPane);

  // Prevent left-edge overscroll bounce — block rightward pull when already at scrollLeft === 0
  let touchStartX = 0;
  scrollPane.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  scrollPane.addEventListener("touchmove", (e) => {
    if (scrollPane.scrollLeft === 0 && e.touches[0].clientX > touchStartX) e.preventDefault();
  }, { passive: false });

  // Sync row heights after paint (both panes are now in the DOM)
  requestAnimationFrame(() => {
    syncRowHeights(frozenTable, scrollTable);
    observeRowResize(frozenTable, scrollTable);
  });
}

// The frozen pane never owns vertical scrolling itself. It only proxies wheel
// and touch gestures into the real scroll pane so both halves still feel like
// one table when the pointer is over the locked columns.
function attachFrozenPaneScrollProxy(frozenPane, scrollPane) {
  let lastTouchY = 0;

  frozenPane.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const previousScrollTop = scrollPane.scrollTop;
    scrollPane.scrollTop += event.deltaY;
    if (scrollPane.scrollTop !== previousScrollTop) {
      event.preventDefault();
    }
  }, { passive: false });

  frozenPane.addEventListener("touchstart", (event) => {
    lastTouchY = event.touches[0]?.clientY ?? 0;
  }, { passive: true });

  frozenPane.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const deltaY = lastTouchY - touch.clientY;
    lastTouchY = touch.clientY;

    if (Math.abs(deltaY) < 0.5) {
      return;
    }

    const previousScrollTop = scrollPane.scrollTop;
    const maxScrollTop = scrollPane.scrollHeight - scrollPane.clientHeight;
    const nextScrollTop = Math.max(0, Math.min(maxScrollTop, previousScrollTop + deltaY));

    if (nextScrollTop !== previousScrollTop) {
      scrollPane.scrollTop = nextScrollTop;
      event.preventDefault();
    }
  }, { passive: false });
}

// Build one complete <table> (colgroup + group header row + column row + body).
// Both panes use this same builder so the header/body structure stays mirrored.
function buildTable(columns, totalWidth, groups, paneType) {
  const table = document.createElement("table");
  table.className = "stats-table";
  table.dataset.pane = paneType;
  table.setAttribute("aria-label", paneType === "frozen" ? "Player identity columns" : "Player stats columns");
  table.style.setProperty("--table-width", `${totalWidth}px`);

  // colgroup
  const colgroup = document.createElement("colgroup");
  columns.forEach((column) => {
    const col = document.createElement("col");
    col.style.width = `${column.width}px`;
    col.style.minWidth = `${column.width}px`;
    col.style.maxWidth = `${column.width}px`;
    colgroup.append(col);
  });
  table.append(colgroup);

  // thead: group row + column row
  const thead = document.createElement("thead");
  thead.append(buildGroupHeaderRow(columns, groups));
  const columnRow = document.createElement("tr");
  columns.forEach((column) => columnRow.append(createHeaderCell(column)));
  thead.append(columnRow);
  table.append(thead);

  // tbody
  const tbody = document.createElement("tbody");
  if (paneType === "scroll" && !state.displayedRows.length) {
    tbody.append(createEmptyStateRow(columns.length));
  } else {
    state.displayedRows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      tr.dataset.rowIndex = rowIndex;
      columns.forEach((column) => tr.append(createBodyCell(row, column)));
      tbody.append(tr);
    });
  }
  table.append(tbody);

  return table;
}

function buildColumnLayout(columnNames, compactScaleFactor = 1) {
  let totalWidth = 0;
  const scale = state.isCompactViewport ? compactScaleFactor : 1;

  const columns = columnNames.map((name, index) => {
    const width = Math.round(getColumnWidth(name) * scale);
    totalWidth += width;
    return { name, index, width };
  });

  return { columns, totalWidth };
}

function createHeaderCell(column) {
  const th = document.createElement("th");
  th.className = "stats-table__header-cell";
  th.scope = "col";
  applyColumnStyle(th, column);
  th.setAttribute("aria-sort", getAriaSort(column.name));

  const button = document.createElement("button");
  button.type = "button";
  button.className = "stats-table__head-button";
  button.setAttribute("aria-label", `Sort by ${column.name}`);
  button.addEventListener("click", () => handleHeaderSort(column.name));

  // Icon (Lucide inline SVG — only rendered when a path is defined)
  const iconPath = COLUMN_ICONS[column.name];
  if (iconPath) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.classList.add("stats-table__head-icon");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", iconPath);
    svg.append(path);
    button.append(svg);
  }

  const label = document.createElement("span");
  label.className = "stats-table__head-label";
  label.textContent = column.name;

  const indicator = document.createElement("span");
  indicator.className = "stats-table__sort-indicator";
  indicator.textContent = getSortIndicator(column.name);
  indicator.setAttribute("aria-hidden", "true");

  if (getActiveSortColumn() === column.name) {
    indicator.classList.add("is-active");
  }

  button.append(label, indicator);
  th.append(button);
  return th;
}

function createBodyCell(row, column) {
  const value = row[column.name];
  const td = document.createElement("td");
  td.classList.add("stats-table__body-cell");
  applyColumnStyle(td, column);

  td.classList.add(...getCellClassNames(column.name, value));
  td.title = formatCellValue(value);

  const content = document.createElement("div");
  content.className = "stats-table__cell-content";

  if (column.name === PLAYER_COLUMN && row.__meta?.playerId) {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "datahub-player-trigger";
    trigger.dataset.gamelogsPlayerId = row.__meta.playerId;
    trigger.setAttribute(
      "aria-label",
      `Open game logs for ${row.__meta.name || formatCellValue(value)}`,
    );
    trigger.textContent = formatDisplayValue(column.name, value);
    content.append(trigger);
  } else if (column.name === FPTS_COLUMN && !isMissingValue(value)) {
    content.append(createFptsChip(value));
  } else {
    content.textContent = formatDisplayValue(column.name, value);
  }

  td.append(content);
  return td;
}

function createFptsChip(value) {
  const chip = document.createElement("span");
  const tier = getFormattingTier(FPTS_COLUMN, value);
  chip.className = `stats-table__fpts-chip stats-table__fpts-chip--tier-${tier}`;
  chip.textContent = formatDisplayValue(FPTS_COLUMN, value);
  return chip;
}

function createEmptyStateRow(columnCount) {
  const tr = document.createElement("tr");
  tr.className = "stats-table__empty-row";

  const td = document.createElement("td");
  td.className = "stats-table__empty-cell";
  td.colSpan = columnCount;
  td.textContent = "No players match the current view.";

  tr.append(td);
  return tr;
}

function applyColumnStyle(cell, column) {
  cell.style.setProperty("--column-width", `${column.width}px`);
}

// ---------------------------------------------------------------------------
// Group header row builder
// ---------------------------------------------------------------------------
function buildGroupHeaderRow(columns, groups) {
  const tr = document.createElement("tr");

  groups.forEach((group) => {
    const th = document.createElement("th");
    th.className = "stats-table__group-header-cell";
    th.colSpan = group.columns.length;

    const inner = document.createElement("div");
    inner.className = "stats-table__group-header-inner";

    if (group.icon) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.classList.add("stats-table__group-header-icon");
      if (group.icon.startsWith("<")) {
        svg.innerHTML = group.icon;
      } else {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", group.icon);
        svg.append(path);
      }
      inner.append(svg);
    }

    const label = document.createElement("span");
    label.textContent = group.label;
    inner.append(label);

    th.append(inner);
    tr.append(th);
  });

  return tr;
}

// ---------------------------------------------------------------------------
// Row height synchronization — keeps frozen + scroll pane rows identical
// ---------------------------------------------------------------------------
let rowResizeObserver = null;

function syncRowHeights(frozenTable, scrollTable) {
  // Sync thead rows (group row + column row)
  const frozenHeadRows = frozenTable.tHead ? Array.from(frozenTable.tHead.rows) : [];
  const scrollHeadRows = scrollTable.tHead ? Array.from(scrollTable.tHead.rows) : [];
  const headLen = Math.min(frozenHeadRows.length, scrollHeadRows.length);
  for (let i = 0; i < headLen; i++) {
    const h = Math.max(frozenHeadRows[i].offsetHeight, scrollHeadRows[i].offsetHeight);
    frozenHeadRows[i].style.height = `${h}px`;
    scrollHeadRows[i].style.height = `${h}px`;
  }

  // Sync tbody rows
  const frozenRows = frozenTable.tBodies[0] ? Array.from(frozenTable.tBodies[0].rows) : [];
  const scrollRows = scrollTable.tBodies[0] ? Array.from(scrollTable.tBodies[0].rows) : [];
  const len = Math.max(frozenRows.length, scrollRows.length);
  for (let i = 0; i < len; i++) {
    const frozenRow = frozenRows[i];
    const scrollRow = scrollRows[i];
    if (!frozenRow || !scrollRow) { continue; }
    // Reset to natural height first so we don't lock in a stale value
    frozenRow.style.height = "";
    scrollRow.style.height = "";
    const h = Math.max(frozenRow.offsetHeight, scrollRow.offsetHeight);
    frozenRow.style.height = `${h}px`;
    scrollRow.style.height = `${h}px`;
  }

  // Wire hover sync once per pair of rows
  attachHoverSync(frozenRows, scrollRows);
}

function attachHoverSync(frozenRows, scrollRows) {
  const len = Math.min(frozenRows.length, scrollRows.length);
  for (let i = 0; i < len; i++) {
    const fr = frozenRows[i];
    const sr = scrollRows[i];
    [fr, sr].forEach((el) => {
      el.addEventListener("mouseenter", () => {
        fr.classList.add("is-hovered");
        sr.classList.add("is-hovered");
      });
      el.addEventListener("mouseleave", () => {
        fr.classList.remove("is-hovered");
        sr.classList.remove("is-hovered");
      });
    });
  }
}

function observeRowResize(frozenTable, scrollTable) {
  if (typeof ResizeObserver === "undefined") { return; }
  if (rowResizeObserver) {
    rowResizeObserver.disconnect();
  }
  let frame = 0;
  rowResizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => syncRowHeights(frozenTable, scrollTable));
  });
  if (scrollTable.tBodies[0]) {
    rowResizeObserver.observe(scrollTable.tBodies[0]);
  }
}

// ---------------------------------------------------------------------------
// Sorting, filtering, and viewport responsiveness
// ---------------------------------------------------------------------------
function getAriaSort(columnName) {
  if (getActiveSortColumn() !== columnName) {
    return "none";
  }

  return state.sort.direction === "asc" ? "ascending" : "descending";
}

function getSortIndicator(columnName) {
  if (getActiveSortColumn() !== columnName) {
    return "↕";
  }

  return state.sort.direction === "asc" ? "▲" : "▼";
}

function handleHeaderSort(columnName) {
  if (state.sort.column === columnName) {
    state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
  } else {
    state.sort = {
      column: columnName,
      direction: "asc",
    };
  }

  refreshGrid();
}

function getVisibleRows() {
  const predicate = CATEGORY_FILTERS[state.activeCategory];
  return state.rows.filter((row) => predicate(row, state));
}

function matchesSearch(row) {
  const query = state.searchText.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return COLUMN_SETS[state.activeCategory].some((columnName) => {
    const value = row[columnName];
    return !isMissingValue(value) && String(value).toLowerCase().includes(query);
  });
}

function sortRows(rows) {
  const sortColumn = getActiveSortColumn();
  const directionMultiplier = state.sort.direction === "desc" ? -1 : 1;

  return [...rows].sort((left, right) => {
    const primaryResult = compareGridValues(left[sortColumn], right[sortColumn]);
    if (primaryResult !== 0) {
      return primaryResult * directionMultiplier;
    }

    if (sortColumn !== "RK") {
      const rankFallback = compareGridValues(left.RK, right.RK);
      if (rankFallback !== 0) {
        return rankFallback;
      }
    }

    const playerFallback = compareGridValues(left.PLAYER, right.PLAYER);
    if (playerFallback !== 0) {
      return playerFallback;
    }

    return compareGridValues(left.POS, right.POS);
  });
}

function getActiveSortColumn() {
  const columns = COLUMN_SETS[state.activeCategory];
  return columns.includes(state.sort.column) ? state.sort.column : "RK";
}

function getColumnWidth(columnName) {
  const widths = state.isCompactViewport ? MOBILE_COLUMN_WIDTHS : COLUMN_WIDTHS;
  return widths[columnName]
    ?? (state.isCompactViewport ? DEFAULT_COMPACT_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH);
}

function isCompactViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

let resizeFrame = 0;

function handleViewportResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    const nextCompact = isCompactViewport();
    if (nextCompact !== state.isCompactViewport) {
      state.isCompactViewport = nextCompact;
      refreshGrid();
    }

    updatePageTabsGlint();
  });
}

// ---------------------------------------------------------------------------
// CSV normalization and source parsing
// ---------------------------------------------------------------------------
// Convert source CSV rows into the layout-friendly record shape expected by the
// renderer. Every column in ALL_COLUMNS is populated so the table structure can
// stay stable even when the source file omits optional fields. Derived fields
// like RK / VALUE / ADP / POS·ADP / PPG can override the CSV aliases by using
// the final layout column name directly on the enriched source row.
function normalizeRow(sourceRow) {
  const normalized = {};

  for (const columnName of ALL_COLUMNS) {
    if (sourceRow[columnName] !== undefined) {
      normalized[columnName] = sanitizeValue(sourceRow[columnName]);
      continue;
    }

    const alias = Object.prototype.hasOwnProperty.call(SOURCE_ALIASES, columnName)
      ? SOURCE_ALIASES[columnName]
      : columnName;

    if (alias === null) {
      normalized[columnName] = "NA";
      continue;
    }

    const rawValue = sourceRow[alias];
    normalized[columnName] = sanitizeValue(rawValue);
  }

  normalized.__meta = buildDataHubRowMeta(sourceRow);

  return normalized;
}

function sanitizeValue(value) {
  const text = typeof value === "string" ? value.trim() : value;
  if (text === "" || text == null || text === "#N/A") {
    return "NA";
  }
  return String(text);
}

function parseCsv(csvText) {
  const rows = [];
  let current = "";
  let row = [];
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(current);
      current = "";
      rows.push(row);
      row = [];
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  const [headerRow = [], ...dataRows] = rows;
  const headers = headerRow.map((header) => header.replace(/^\uFEFF/, "").trim());

  return dataRows
    .filter((values) => values.some((value) => value !== ""))
    .map((values) =>
      headers.reduce((record, header, index) => {
        record[header] = values[index] ?? "";
        return record;
      }, {}),
    );
}

// ---------------------------------------------------------------------------
// Cell styling and value formatting
// ---------------------------------------------------------------------------
// Class assignment mirrors the current table styling system. This deliberately
// uses plain column/value inputs instead of old grid-library style params so
// future agents can read it as custom renderer logic, not adapter code.
function getCellClassNames(columnName, value) {
  const classes = ["dh-grid-cell"];
  const missingValue = isMissingValue(value);

  if (columnName === PLAYER_COLUMN) {
    classes.push("player-cell");
  } else {
    classes.push("center-cell");
  }

  if (NON_FORMATTED_COLUMNS.has(columnName)) {
    classes.push("plain-cell");
  } else {
    classes.push("formatted-cell");
  }

  if (missingValue) {
    classes.push("na-cell");
    return classes;
  }

  if (columnName === FPTS_COLUMN) {
    classes.push("fpts-cell", `fpts-cell--tier-${getFormattingTier(columnName, value)}`);
    return classes;
  }

  if (!NON_FORMATTED_COLUMNS.has(columnName)) {
    const family = NEUTRAL_COLUMNS.has(columnName) ? "neutral" : "heat";
    const tier = getFormattingTier(columnName, value);
    classes.push("heat-cell", `heat-cell--${family}`, `heat-cell--tier-${tier}`);
  }

  return classes;
}

function formatCellValue(value) {
  return isMissingValue(value) ? "NA" : value;
}

function formatDisplayValue(columnName, value) {
  const formattedValue = formatCellValue(value);

  if (columnName !== PLAYER_COLUMN || !state.isCompactViewport) {
    return formattedValue;
  }

  return abbreviatePlayerName(formattedValue);
}

function abbreviatePlayerName(name) {
  if (isMissingValue(name)) {
    return "NA";
  }

  const parts = String(name).trim().split(/\s+/);
  if (parts.length < 2) {
    return String(name);
  }

  const [first, ...rest] = parts;
  return `${first.charAt(0)}. ${rest.join(" ")}`;
}

function buildColumnFormatting(rows) {
  const formatting = Object.create(null);
  const columns = COLUMN_SETS[state.activeCategory];

  columns.forEach((columnName) => {
    if (NON_FORMATTED_COLUMNS.has(columnName)) {
      return;
    }

    const values = rows
      .map((row) => toComparableNumber(row[columnName]))
      .filter((numericValue) => numericValue != null);

    if (!values.length) {
      return;
    }

    formatting[columnName] = createColumnMetric(values);
  });

  return formatting;
}

function createColumnMetric(values) {
  const sorted = [...values].sort((left, right) => left - right);

  return {
    sorted,
    isFlat: sorted[0] === sorted[sorted.length - 1],
  };
}

function getFormattingTier(columnName, value) {
  const metric = state.columnFormatting[columnName];
  const numericValue = toComparableNumber(value);

  if (!metric || numericValue == null) {
    return 0;
  }

  if (metric.isFlat) {
    return 2;
  }

  const percentile = getPercentileRank(metric.sorted, numericValue);
  const normalized = INVERTED_COLUMNS.has(columnName)
    ? 1 - percentile
    : percentile;

  return clamp(Math.round(normalized * 4), 0, 4);
}

function getPercentileRank(sortedValues, value) {
  if (sortedValues.length <= 1) {
    return 0.5;
  }

  const upperIndex = upperBound(sortedValues, value) - 1;
  return clamp(upperIndex / (sortedValues.length - 1), 0, 1);
}

function upperBound(values, target) {
  let low = 0;
  let high = values.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (values[middle] <= target) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return low;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function compareGridValues(valueA, valueB) {
  const parsedA = toComparableValue(valueA);
  const parsedB = toComparableValue(valueB);

  const aMissing = parsedA == null;
  const bMissing = parsedB == null;

  if (aMissing && bMissing) {
    return 0;
  }

  if (aMissing) {
    return 1;
  }

  if (bMissing) {
    return -1;
  }

  if (typeof parsedA === "number" && typeof parsedB === "number") {
    return parsedA - parsedB;
  }

  return String(parsedA).localeCompare(String(parsedB), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function toComparableValue(value) {
  if (isMissingValue(value)) {
    return null;
  }

  const raw = String(value).trim();
  const parsedNumber = toComparableNumber(raw);

  if (parsedNumber != null) {
    return parsedNumber;
  }

  return raw.toUpperCase();
}

function toComparableNumber(value) {
  if (isMissingValue(value)) {
    return null;
  }

  const normalized = String(value).trim().replace(/,/g, "").replace(/%$/g, "");
  const parsedNumber = Number(normalized);

  if (Number.isNaN(parsedNumber)) {
    return null;
  }

  return parsedNumber;
}

function isMissingValue(value) {
  return value == null || value === "" || value === "NA" || value === "#N/A";
}

function showOverlay({ title, description, showActions = false }) {
  overlayTitle.textContent = title;
  overlayDescription.textContent = description;
  overlayActions.hidden = !showActions;
  overlay.classList.remove("is-hidden");
}

function hideOverlay() {
  overlay.classList.add("is-hidden");
}

// ---------------------------------------------------------------------------
// DataHub-local Game Logs subsystem.
// This block ports the Stats page modal experience into DataHub without
// depending on shared app.js, styles.css, stats.js, or stats.css at runtime.
// ---------------------------------------------------------------------------

const DATAHUB_SHARED_STATS_KEY_SECTIONS = [
  {
    id: "fantasy",
    label: "Fantasy",
    tone: "all",
    items: [
      { abbr: "FPOE", desc: "Fantasy Points Over Expected" },
      { abbr: "FPTS", desc: "Fantasy Points (PPR)" },
      { abbr: "PPG", desc: "Points Per Game" },
    ],
  },
  {
    id: "passing",
    label: "Passing",
    tone: "passing",
    items: [
      { abbr: "CMP", desc: "Completions" },
      { abbr: "CMP%", desc: "Completion Percentage" },
      { abbr: "CPOE", desc: "Completion Percentage Over Expected" },
      { abbr: "EPA/DB", desc: "Expected Points Added per dropback" },
      { abbr: "INT", desc: "Interceptions" },
      { abbr: "pa1D", desc: "Passing First Downs" },
      { abbr: "paATT", desc: "Passing Attempts" },
      { abbr: "paRTG", desc: "Passer Rating" },
      { abbr: "paTD", desc: "Passing Touchdowns" },
      { abbr: "paYDS", desc: "Passing Yards" },
      { abbr: "pIMP", desc: "Passing Impact Plays" },
      { abbr: "pIMP/A", desc: "Passing Impact per Attempt" },
      { abbr: "PRS%", desc: "Pressure Rate" },
      { abbr: "SAC", desc: "Sacks Taken" },
      { abbr: "TTT", desc: "Time to Throw" },
    ],
  },
  {
    id: "rushing",
    label: "Rushing",
    tone: "rushing",
    items: [
      { abbr: "CAR", desc: "Carries" },
      { abbr: "ELU", desc: "Elusiveness Rating" },
      { abbr: "EXPLSV%", desc: "Explosive Rush Rate [% CAR of 10+ YDS]" },
      { abbr: "MTF", desc: "Missed Tackles Forced" },
      { abbr: "MTF/A", desc: "Missed Tackles per Attempt" },
      { abbr: "ru1D", desc: "Rushing First Downs" },
      { abbr: "ruTD", desc: "Rushing Touchdowns" },
      { abbr: "ruYDS", desc: "Rushing Yards" },
      { abbr: "YCO", desc: "Yards After Contact" },
      { abbr: "YCO/A", desc: "Yards After Contact per Attempt" },
      { abbr: "YPC", desc: "Yards per Carry" },
    ],
  },
  {
    id: "receiving",
    label: "Receiving",
    tone: "receiving",
    items: [
      { abbr: "1DRR", desc: "First Downs per Route Run" },
      { abbr: "AY%", desc: "Air Yards Share" },
      { abbr: "REC", desc: "Receptions" },
      { abbr: "rec1D", desc: "Receiving First Downs" },
      { abbr: "recTD", desc: "Receiving Touchdowns" },
      { abbr: "recYDS", desc: "Receiving Yards" },
      { abbr: "RR", desc: "Routes Run" },
      { abbr: "RZ Tgt", desc: "Red Zone Targets" },
      { abbr: "TGT", desc: "Targets" },
      { abbr: "TS%", desc: "Target Share" },
      { abbr: "YAC", desc: "Yards After Catch" },
      { abbr: "YPR", desc: "Yards per Reception" },
      { abbr: "YPRR", desc: "Yards per Route Run" },
    ],
  },
  {
    id: "general",
    label: "General",
    tone: "all",
    items: [
      { abbr: "ADP", desc: "Average Draft Position" },
      { abbr: "AGE", desc: "Player Age" },
      { abbr: "CL", desc: "Ceiling" },
      { abbr: "CSTY%", desc: "Consistency Percentage" },
      { abbr: "FUM", desc: "Fumbles Lost" },
      { abbr: "G", desc: "Games Played" },
      { abbr: "IMP", desc: "Impact Plays (1D + TD)" },
      { abbr: "IMP/G", desc: "Impact Plays per Game" },
      { abbr: "IMP/OPP", desc: "Impact per Opportunity" },
      { abbr: "POS", desc: "Position" },
      { abbr: "POS·ADP", desc: "Positional ADP" },
      { abbr: "RK", desc: "Overall Rank" },
      { abbr: "SNP%", desc: "Snap Share" },
      { abbr: "TM", desc: "Team" },
      { abbr: "VALUE", desc: "Trade Value" },
      { abbr: "YDS(t)", desc: "Total Yards" },
      { abbr: "YPG(t)", desc: "Yards per Game (Total)" },
    ],
  },
];

const DATAHUB_PLAYER_STAT_HEADER_MAP = {
  paATT: "pass_att",
  CMP: "pass_cmp",
  "CMP PCT": "cmp_pct",
  "CMP%": "cmp_pct",
  paYDS: "pass_yd",
  paTD: "pass_td",
  pa1D: "pass_fd",
  "EPA/DB": "epa_per_db",
  CPOE: "cpoe",
  "DP%": "dp_pct",
  "IMP/G": "imp_per_g",
  paRTG: "pass_rtg",
  pIMP: "pass_imp",
  "pIMP/A": "pass_imp_per_att",
  INT: "pass_int",
  SAC: "pass_sack",
  TTT: "ttt",
  "PRS%": "prs_pct",
  CAR: "rush_att",
  ruYDS: "rush_yd",
  YPC: "ypc",
  ruTD: "rush_td",
  ru1D: "rush_fd",
  MTF: "mtf",
  ELU: "elu",
  RYOE: "ryoe",
  YCO: "rush_yac",
  "YCO/A": "yco_per_att",
  "ExplRu%": "expl_ru_pct",
  "EXPLSV%": "expl_ru_pct",
  "MTF/A": "mtf_per_att",
  TGT: "rec_tgt",
  REC: "rec",
  recYDS: "rec_yd",
  recTD: "rec_td",
  rec1D: "rec_fd",
  YAC: "rec_yar",
  YPR: "ypr",
  RR: "rr",
  "RZ Tgt": "rz_tgt",
  "TS%": "ts_per_rr",
  "CSTY%": "csty_pct",
  YPRR: "yprr",
  "1DRR": "first_down_rec_rate",
  IMP: "imp",
  FUM: "fum",
  SNP: "snp",
  "SNP%": "snp_pct",
  "YDS(t)": "yds_total",
  FPOE: "fpoe",
  aFPOE: "fpoe",
  CL: "ceiling",
  "YPG(t)": "ypg",
  paYPG: "pa_ypg",
  ruYPG: "ru_ypg",
  recYPG: "rec_ypg",
  "AY%": "ay_pct",
  PROJ: "proj",
  FPT_PPR: "fpt_ppr",
  FPTS_PPR: "fpt_ppr",
};
const DATAHUB_WEEKLY_META_HEADER_MAP = {
  VS: "opponent",
  vsRK: "opponent_rank",
};
const DATAHUB_NO_FALLBACK_KEYS = new Set([
  "yprr",
  "ts_per_rr",
  "imp_per_g",
  "epa_per_db",
  "cpoe",
  "snp_pct",
  "prs_pct",
  "ypr",
  "first_down_rec_rate",
  "expl_ru_pct",
]);
const DATAHUB_SEASON_META_HEADERS = {
  POS: "pos",
  TM: "team",
  GM_P: "games_played",
};
const DATAHUB_SEASON_VALUE_HEADERS = {
  FPT_PPR: "fpts_ppr",
  FPTS_PPR: "fpts_ppr",
  PRK_PPR: "pos_rank_ppr",
};
const DATAHUB_STAT_KEY_RANK_OVERRIDES = { fpts: "fpts_ppr" };
const DATAHUB_RADAR_STATS_CONFIG = {
  QB: {
    stats: ["fpts", "ppg", "ttt", "cmp_pct", "pa_ypg", "pass_rtg", "cpoe", "epa_per_db"],
    labels: ["FPTS", "PPG", "TTT", "CMP%", "paYPG", "paRTG", "CPOE", "EPA/DB"],
    maxRank: 36,
  },
  RB: {
    stats: ["fpts", "ppg", "yds_total", "snp_pct", "mtf_per_att", "yco_per_att", "ypc", "ts_per_rr"],
    labels: ["FPTS", "PPG", "YDS(t)", "SNP%", "MTF/A", "YCO/A", "YPC", "TS%"],
    maxRank: 48,
  },
  WR: {
    stats: ["fpts", "ppg", "rec", "rec_ypg", "ts_per_rr", "yprr", "first_down_rec_rate", "imp_per_g"],
    labels: ["FPTS", "PPG", "REC", "recYPG", "TS%", "YPRR", "1DRR", "IMP/G"],
    maxRank: 72,
  },
  TE: {
    stats: ["fpts", "ppg", "rec", "rec_ypg", "ts_per_rr", "yprr", "first_down_rec_rate", "imp_per_g"],
    labels: ["FPTS", "PPG", "REC", "recYPG", "TS%", "YPRR", "1DRR", "IMP/G"],
    maxRank: 24,
  },
};
const DATAHUB_SZN_PROGRESS_THRESHOLDS = {
  QB: [
    { rank: 1, pct: 100 },
    { rank: 13, pct: 75 },
    { rank: 26, pct: 50 },
    { rank: 39, pct: 25 },
    { rank: 53, pct: 0 },
  ],
  RB: [
    { rank: 1, pct: 100 },
    { rank: 16, pct: 75 },
    { rank: 32, pct: 50 },
    { rank: 48, pct: 25 },
    { rank: 65, pct: 0 },
  ],
  WR: [
    { rank: 1, pct: 100 },
    { rank: 24, pct: 75 },
    { rank: 48, pct: 50 },
    { rank: 72, pct: 25 },
    { rank: 96, pct: 0 },
  ],
  TE: [
    { rank: 1, pct: 100 },
    { rank: 13, pct: 75 },
    { rank: 26, pct: 50 },
    { rank: 39, pct: 25 },
    { rank: 53, pct: 0 },
  ],
};
const DATAHUB_SZN_STAT_SECTIONS_BY_POS = {
  QB: [
    { id: "fantasy", label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    {
      id: "passing-production",
      label: "PASSING PRODUCTION",
      tone: "passing",
      stats: ["pass_att", "pass_cmp", "pass_yd", "pass_td", "pass_fd", "pass_imp", "pass_sack", "pass_int"],
    },
    {
      id: "passing-efficiency",
      label: "PASSING EFFICIENCY",
      tone: "passing",
      stats: ["epa_per_db", "cpoe", "pass_rtg", "cmp_pct", "pass_imp_per_att", "ttt", "prs_pct", "dp_pct", "pa_ypg"],
    },
    { id: "rushing-production", label: "RUSHING PRODUCTION", tone: "rushing", stats: ["rush_att", "rush_yd", "rush_td"] },
    { id: "rushing-efficiency", label: "RUSHING EFFICIENCY", tone: "rushing", stats: ["ypc"] },
    { id: "general-production", label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "fum"] },
    { id: "general-efficiency", label: "GENERAL EFFICIENCY", tone: "all", stats: ["imp_per_g"] },
  ],
  RB: [
    { id: "fantasy", label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    {
      id: "rushing-production",
      label: "RUSHING PRODUCTION",
      tone: "rushing",
      stats: ["snp_pct", "rush_att", "rush_yd", "rush_td", "rush_fd", "rush_yac", "mtf"],
    },
    {
      id: "rushing-efficiency",
      label: "RUSHING EFFICIENCY",
      tone: "rushing",
      stats: ["ypc", "elu", "mtf_per_att", "yco_per_att", "expl_ru_pct", "ryoe", "ru_ypg"],
    },
    {
      id: "receiving-production",
      label: "RECEIVING PRODUCTION",
      tone: "receiving",
      stats: ["rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar"],
    },
    { id: "receiving-efficiency", label: "RECEIVING EFFICIENCY", tone: "receiving", stats: ["ts_per_rr", "yprr"] },
    { id: "general-production", label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "fum"] },
    { id: "general-efficiency", label: "GENERAL EFFICIENCY", tone: "all", stats: ["imp_per_g"] },
  ],
  WR: [
    { id: "fantasy", label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    {
      id: "receiving-production",
      label: "RECEIVING PRODUCTION",
      tone: "receiving",
      stats: ["rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "rr", "rz_tgt"],
    },
    {
      id: "receiving-efficiency",
      label: "RECEIVING EFFICIENCY",
      tone: "receiving",
      stats: ["ts_per_rr", "yprr", "first_down_rec_rate", "ypr", "rec_ypg", "ay_pct"],
    },
    { id: "general-production", label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "rush_att", "rush_yd", "rush_td", "fum"] },
    { id: "general-efficiency", label: "GENERAL EFFICIENCY", tone: "all", stats: ["snp_pct", "imp_per_g"] },
  ],
  TE: [
    { id: "fantasy", label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    {
      id: "receiving-production",
      label: "RECEIVING PRODUCTION",
      tone: "receiving",
      stats: ["rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "rr", "rz_tgt"],
    },
    {
      id: "receiving-efficiency",
      label: "RECEIVING EFFICIENCY",
      tone: "receiving",
      stats: ["ts_per_rr", "yprr", "first_down_rec_rate", "ypr", "rec_ypg", "ay_pct"],
    },
    { id: "general-production", label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "rush_att", "rush_yd", "rush_td"] },
    { id: "general-efficiency", label: "GENERAL EFFICIENCY", tone: "all", stats: ["snp_pct", "fum", "imp_per_g"] },
  ],
};
const DATAHUB_CONSISTENCY_THRESHOLD_MAP = {
  QB: { solid: 16, high: 22 },
  RB: { solid: 12, high: 18 },
  WR: { solid: 12, high: 18 },
  TE: { solid: 11, high: 17 },
  DEFAULT: { solid: 14, high: 20 },
};
const DATAHUB_CONSISTENCY_BUCKET_STYLES = {
  high: { color: "#00ffc1" },
  solid: { color: "#00c5ff" },
  low: { color: "#c26cfc" },
};
const DATAHUB_CONSISTENCY_HUD_COLORS = {
  high: "#5dfdca",
  solid: "#47befd",
  low: "#d3a5ff",
};
const DATAHUB_MAX_CONSISTENCY_POINTS = 40;
const DATAHUB_CONSISTENCY_PROJECTION_SKIP_CODES = new Set(["IR", "OUT", "PUP", "BYE", "Q", "D"]);
const DATAHUB_HEIGHT_WEIGHT_COLORS = {
  low: "#F7A3EBDF",
  mid: "#84b8fbff",
  high: "#96F2CEB9",
};

function initializeDataHubGameLogs() {
  if (!dataHubGameLogsModal || gameLogsState.initialized) {
    return;
  }

  // DataHub modal boot:
  // 1. inject shared stat-key markup
  // 2. wire one close / view / footer listener set
  // 3. keep season pills visual-only for parity with the Stats modal
  renderDataHubSharedStatsKeyMarkup(dataHubStatsKeyBody);
  setDataHubGameLogsModalView("gl");
  setDataHubGameLogsPanel("game-logs", { force: true });

  dataHubGameLogsCloseButtons.forEach((button) => {
    button.addEventListener("click", () => closeDataHubGameLogsModal());
  });

  dataHubGameLogsViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setDataHubGameLogsModalView(button.dataset.gamelogsView || "gl");
    });
  });

  dataHubGameLogsFooterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.dataset.panel || "game-logs";
      if (panel !== "game-logs" && gameLogsState.activePanel === panel) {
        setDataHubGameLogsPanel("game-logs");
        return;
      }
      setDataHubGameLogsPanel(panel);
    });
  });

  dataHubGameLogsSeasonTabs.forEach((button) => {
    // Season tabs are currently visual-only, but we still keep the pressed
    // state synchronized so the localized DataHub modal remains accessible.
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    button.addEventListener("click", () => {
      dataHubGameLogsSeasonTabs.forEach((tab) => {
        const isActive = tab === button;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
      });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dataHubGameLogsModal.classList.contains("is-hidden")) {
      closeDataHubGameLogsModal();
    }
  });

  gameLogsState.initialized = true;
}

function preloadDataHubGameLogsData() {
  fetchDataHubPlayerStatsSheets().catch((error) => {
    console.warn("DataHub game logs preload failed.", error);
  });
}

function handleDataHubGridClick(event) {
  const trigger = event.target.closest(".datahub-player-trigger");
  if (!trigger) {
    return;
  }

  const playerId = String(trigger.dataset.gamelogsPlayerId || "").trim();
  if (!playerId) {
    return;
  }

  const row = state.rows.find((candidate) => candidate.__meta?.playerId === playerId);
  if (!row) {
    return;
  }

  openDataHubGameLogs(buildDataHubGameLogEntry(row));
}

function buildDataHubRowMeta(sourceRow) {
  const playerId = String(sourceRow.SLPR_ID || sourceRow.slpr_id || "").trim();
  const pos = String(sourceRow.POS || sourceRow.pos || "").trim().toUpperCase() || "NA";
  const name = String(sourceRow.NM || sourceRow.PLAYER || "").trim();
  const team = String(sourceRow.TM || sourceRow.team || "").trim().toUpperCase() || "FA";
  const gamesPlayed = toComparableNumber(sourceRow.GM ?? sourceRow.GM_P);
  const fpts = toComparableNumber(sourceRow.FPT_PPR ?? sourceRow.FPTS_PPR ?? sourceRow.FPTS);
  const ppg = toComparableNumber(sourceRow.PPG);
  const ktc = toComparableNumber(sourceRow.VALUE);
  const overallRank = toComparableNumber(sourceRow.RK);
  const activeKtcLookup = getActiveKtcLookup();
  const ktcEntry = playerId ? activeKtcLookup?.[playerId] : null;
  const rawPosRank = String(sourceRow.POS_RK || ktcEntry?.posRank || "").trim();

  return {
    playerId,
    name,
    pos,
    team,
    gamesPlayed,
    fpts,
    ppg,
    ktc,
    ktcOverallRank: Number.isFinite(ktcEntry?.overallRank) ? ktcEntry.overallRank : overallRank,
    ktcPosRank: toComparableNumber(rawPosRank),
    ktcPosRankText: rawPosRank && pos ? `${pos}·${rawPosRank}` : null,
    sourceRow,
  };
}

function buildDataHubGameLogEntry(row) {
  const meta = row.__meta || {};
  return {
    id: meta.playerId,
    name: meta.name || row.PLAYER,
    pos: meta.pos || row.POS,
    team: meta.team || row.TM || "FA",
    ktc: Number.isFinite(meta.ktc) ? meta.ktc : 0,
    posRank: meta.ktcPosRankText || null,
    overallRank: Number.isFinite(meta.ktcOverallRank) ? meta.ktcOverallRank : null,
    fpts: Number.isFinite(meta.fpts) ? meta.fpts : null,
    ppg: Number.isFinite(meta.ppg) ? meta.ppg : null,
    gamesPlayed: Number.isFinite(meta.gamesPlayed) ? meta.gamesPlayed : null,
  };
}

function buildDataHubGameLogRankCache(dataset) {
  const cache = Object.create(null);
  const playersWithStats = dataset.filter((entry) => {
    const meta = entry.__meta;
    return meta?.playerId && meta.pos !== "RDP" && Number.isFinite(meta.fpts) && meta.fpts > 0;
  });

  const fptsSorted = [...playersWithStats].sort((left, right) => {
    return (right.__meta?.fpts || 0) - (left.__meta?.fpts || 0);
  });
  fptsSorted.forEach((entry, index) => {
    const playerId = entry.__meta.playerId;
    if (!cache[playerId]) cache[playerId] = {};
    cache[playerId].overallRank = index + 1;
  });

  const ppgSorted = [...playersWithStats].sort((left, right) => {
    return (right.__meta?.ppg || 0) - (left.__meta?.ppg || 0);
  });
  ppgSorted.forEach((entry, index) => {
    const playerId = entry.__meta.playerId;
    if (!cache[playerId]) cache[playerId] = {};
    cache[playerId].ppgOverallRank = index + 1;
  });

  const positionGroups = new Map();
  playersWithStats.forEach((entry) => {
    const pos = entry.__meta?.pos;
    if (!pos) return;
    if (!positionGroups.has(pos)) positionGroups.set(pos, []);
    positionGroups.get(pos).push(entry);
  });

  positionGroups.forEach((players) => {
    [...players]
      .sort((left, right) => (right.__meta?.fpts || 0) - (left.__meta?.fpts || 0))
      .forEach((entry, index) => {
        cache[entry.__meta.playerId].posRank = index + 1;
      });

    [...players]
      .sort((left, right) => (right.__meta?.ppg || 0) - (left.__meta?.ppg || 0))
      .forEach((entry, index) => {
        cache[entry.__meta.playerId].ppgPosRank = index + 1;
      });
  });

  return cache;
}

function getDataHubDefaultPlayerRanks() {
  return {
    total_pts: "0.0",
    overallRank: null,
    posRank: null,
    ppg: "0.0",
    ppgOverallRank: null,
    ppgPosRank: null,
  };
}

function getDataHubPlayerRanks(entry) {
  if (!entry?.id) {
    return getDataHubDefaultPlayerRanks();
  }

  const ranks = gameLogsState.rankCache?.[entry.id] || {};
  return {
    total_pts: Number.isFinite(entry.fpts) ? entry.fpts.toFixed(1) : "0.0",
    overallRank: Number.isFinite(ranks.overallRank) ? ranks.overallRank : null,
    posRank: Number.isFinite(ranks.posRank) ? ranks.posRank : null,
    ppg: Number.isFinite(entry.ppg) ? entry.ppg.toFixed(1) : "0.0",
    ppgOverallRank: Number.isFinite(ranks.ppgOverallRank) ? ranks.ppgOverallRank : null,
    ppgPosRank: Number.isFinite(ranks.ppgPosRank) ? ranks.ppgPosRank : null,
  };
}

function openDataHubGameLogsModal() {
  if (!dataHubGameLogsModal) {
    return;
  }

  dataHubGameLogsModal.classList.remove("is-hidden");
  dataHubGameLogsModal.setAttribute("aria-hidden", "false");
  setDataHubGameLogsPanel("game-logs", { force: true });
  setDataHubGameLogsModalView(gameLogsState.currentView || "gl");
}

function closeDataHubGameLogsModal() {
  if (!dataHubGameLogsModal) {
    return;
  }

  gameLogsState.requestSeq += 1;
  gameLogsState.activePlayer = null;
  gameLogsState.activeRanks = null;
  gameLogsState.activeSummary = null;
  gameLogsState.activeFooterStats = { __gamesPlayed: 0 };
  gameLogsState.currentConsistencyData = null;

  dataHubGameLogsModal.classList.add("is-hidden");
  dataHubGameLogsModal.setAttribute("aria-hidden", "true");
  dataHubGameLogsModal.classList.remove("is-loading");
  if (dataHubGameLogsModalBody) {
    dataHubGameLogsModalBody.classList.remove("is-loading");
  }
  destroyDataHubRadarChart();
  setDataHubGameLogsPanel("game-logs", { force: true });
}

function setDataHubGameLogsModalView(view) {
  const normalizedView = view === "szn" ? "szn" : "gl";
  gameLogsState.currentView = normalizedView;

  dataHubGameLogsViewButtons.forEach((button) => {
    const isActive = button.dataset.gamelogsView === normalizedView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (dataHubGameLogsModalBody) {
    dataHubGameLogsModalBody
      .querySelectorAll(".game-logs-table-container, .no-logs[data-gamelogs-view=\"gl\"]")
      .forEach((node) => {
        node.classList.toggle("is-hidden", normalizedView !== "gl");
      });

    const sznView = dataHubGameLogsModalBody.querySelector(".game-logs-szn-view");
    if (sznView) {
      sznView.classList.toggle("is-hidden", normalizedView !== "szn");
    }
  }
}

function setDataHubGameLogsPanel(panel, options = {}) {
  const { force = false } = options;
  const targetPanel = panel || "game-logs";
  if (!force && gameLogsState.activePanel === targetPanel) {
    return;
  }

  gameLogsState.activePanel = targetPanel;
  dataHubGameLogsFooterButtons.forEach((button) => {
    const isActive = button.dataset.panel === targetPanel;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const showGameLogs = targetPanel === "game-logs";
  dataHubStatsKeyContainer?.classList.toggle("is-hidden", targetPanel !== "stats-key");
  dataHubRadarChartContainer?.classList.toggle("is-hidden", targetPanel !== "radar-chart");
  dataHubConsistencyContainer?.classList.toggle("is-hidden", targetPanel !== "consistency");

  if (dataHubGameLogsModalBody) {
    dataHubGameLogsModalBody.classList.toggle("is-hidden", !showGameLogs);
  }

  if (targetPanel === "radar-chart" && gameLogsState.activePlayer) {
    renderDataHubPlayerRadarChart(gameLogsState.activePlayer.id, gameLogsState.activePlayer.pos);
  }
  if (targetPanel === "consistency" && gameLogsState.activePlayer) {
    renderDataHubConsistencyChart();
  }
}

function renderDataHubGameLogsLoading(player) {
  if (!dataHubGameLogsModal || !dataHubGameLogsModalBody) {
    return;
  }

  dataHubGameLogsModal.classList.add("is-loading");
  dataHubGameLogsModalBody.classList.add("is-loading");
  if (dataHubGameLogsModalPlayerName) {
    dataHubGameLogsModalPlayerName.textContent = player?.name || "Player";
  }
  if (dataHubGameLogsModalPlayerVitals) {
    dataHubGameLogsModalPlayerVitals.innerHTML = "";
  }
  if (dataHubGameLogsModalSummaryChips) {
    dataHubGameLogsModalSummaryChips.innerHTML = "";
  }

  dataHubGameLogsModalBody.innerHTML = `
    <div class="game-logs-loading-container">
      <div class="game-logs-loading-content">
        <div class="game-logs-loading-spinner" aria-hidden="true"></div>
        <p class="game-logs-loading-message">
          <strong>Syncing Game Logs</strong><br>
          Loading DataHub game logs, season totals, and live-week updates.
        </p>
      </div>
      <p class="game-logs-loading-footer">
        <em>One-time local sync per session. After this load, modal re-opens are instant.</em>
      </p>
    </div>
  `;
}

async function openDataHubGameLogs(entry) {
  if (!entry?.id || !entry?.pos) {
    return;
  }

  const requestSeq = ++gameLogsState.requestSeq;
  const isStaleRequest = () => requestSeq !== gameLogsState.requestSeq;

  renderDataHubGameLogsLoading(entry);
  openDataHubGameLogsModal();

  try {
    await Promise.all([
      fetchDataHubPlayerStatsSheets(),
      loadDataHubPlayerMeta(),
    ]);
    if (isStaleRequest()) return;

    const gameLogs = await fetchDataHubGameLogs(entry.id);
    if (isStaleRequest()) return;

    const playerRanks = getDataHubPlayerRanks(entry);
    if (isStaleRequest()) return;

    renderDataHubGameLogs(gameLogs, entry, playerRanks, requestSeq);
  } catch (error) {
    console.error("DataHub game logs open failed.", error);
    if (isStaleRequest()) return;
    dataHubGameLogsModal.classList.remove("is-loading");
    dataHubGameLogsModalBody.classList.remove("is-loading");
    dataHubGameLogsModalBody.innerHTML = `
      <div class="datahub-gamelogs-error">
        <h4>Game logs unavailable</h4>
        <p>The local weekly or rank files could not be loaded for this player.</p>
      </div>
    `;
  }
}

function destroyDataHubRadarChart() {
  if (gameLogsState.radarChartInstance) {
    gameLogsState.radarChartInstance.destroy();
    gameLogsState.radarChartInstance = null;
  }
  if (dataHubRadarChartContent) {
    dataHubRadarChartContent.innerHTML = "";
  }
}

async function fetchDataHubPlayerStatsSheets() {
  if (gameLogsState.statsSheetsLoaded) {
    await ensureDataHubLiveStats();
    return;
  }

  if (gameLogsState.statsSheetsLoadPromise) {
    await gameLogsState.statsSheetsLoadPromise;
    return;
  }

  gameLogsState.statsSheetsLoadPromise = (async () => {
    const weeklyPromises = DATAHUB_PLAYER_STATS_WEEKS.map(async ([week, sheetName]) => {
      const csvUrl = new URL(`${sheetName}.csv`, DATAHUB_PLAYER_STATS_CSV_PATHS.weeksDir).href;
      try {
        const csv = await fetchDataHubTextWithCache(csvUrl);
        return { week, csv };
      } catch (error) {
        console.warn(`Week ${week} CSV unavailable for DataHub game logs.`, error);
        return { week, csv: null };
      }
    });

    const [seasonCsv, seasonRanksCsv, ...weeklyCsvs] = await Promise.all([
      fetchDataHubTextWithCache(DATAHUB_PLAYER_STATS_CSV_PATHS.season),
      fetchDataHubTextWithCache(DATAHUB_PLAYER_STATS_CSV_PATHS.seasonRanks),
      ...weeklyPromises,
    ]);

    gameLogsState.playerSeasonStats = parseDataHubSeasonStatsCsv(seasonCsv);
    gameLogsState.playerSeasonRanks = parseDataHubSeasonRanksCsv(seasonRanksCsv);

    const weeklyStats = Object.create(null);
    const projectionWeeks = Object.create(null);
    weeklyCsvs.forEach(({ week, csv }) => {
      if (!csv) return;
      weeklyStats[week] = parseDataHubWeeklyStatsCsv(csv);
      if (!DATAHUB_PLAYER_STATS_WEEKS.some(([knownWeek]) => knownWeek === week)) {
        projectionWeeks[week] = true;
      }
    });

    gameLogsState.playerWeeklyStats = weeklyStats;
    gameLogsState.weeklyStats = weeklyStats;
    gameLogsState.playerProjectionWeeks = projectionWeeks;
    gameLogsState.statsSheetsLoaded = true;
    gameLogsState.liveStatsLoaded = false;

    await ensureDataHubLiveStats();
  })()
    .catch((error) => {
      gameLogsState.playerSeasonStats = Object.create(null);
      gameLogsState.playerSeasonRanks = Object.create(null);
      gameLogsState.playerWeeklyStats = Object.create(null);
      gameLogsState.weeklyStats = Object.create(null);
      gameLogsState.playerProjectionWeeks = Object.create(null);
      gameLogsState.statsSheetsLoaded = false;
      gameLogsState.liveWeeklyStats = Object.create(null);
      gameLogsState.liveStatsLoaded = true;
      throw error;
    })
    .finally(() => {
      gameLogsState.statsSheetsLoadPromise = null;
    });

  await gameLogsState.statsSheetsLoadPromise;
}

async function fetchDataHubTextWithCache(url) {
  if (gameLogsState.textCache.has(url)) {
    return gameLogsState.textCache.get(url);
  }

  const promise = fetch(url, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      return response.text();
    })
    .catch((error) => {
      gameLogsState.textCache.delete(url);
      throw error;
    });

  gameLogsState.textCache.set(url, promise);
  return promise;
}

async function loadDataHubPlayerMeta() {
  if (gameLogsState.playerMetaLoaded) {
    return;
  }
  if (gameLogsState.playerMetaLoadPromise) {
    return gameLogsState.playerMetaLoadPromise;
  }

  gameLogsState.playerMetaLoadPromise = fetch(`${DATAHUB_API_BASE}/players/nfl`, {
    cache: "no-store",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Sleeper players request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((players) => {
      gameLogsState.playerMetaById = players || Object.create(null);
      gameLogsState.playerMetaLoaded = true;
    })
    .catch((error) => {
      console.warn("DataHub player metadata unavailable.", error);
      gameLogsState.playerMetaById = Object.create(null);
      gameLogsState.playerMetaLoaded = true;
    })
    .finally(() => {
      gameLogsState.playerMetaLoadPromise = null;
    });

  return gameLogsState.playerMetaLoadPromise;
}

async function ensureDataHubLiveStats(force = false) {
  if (!force && gameLogsState.liveStatsLoaded) {
    const knownWeek = gameLogsState.currentNflWeek;
    const lastFetchedWeek = gameLogsState.lastLiveStatsWeek;
    if (Number.isFinite(knownWeek) && knownWeek === lastFetchedWeek) {
      const now = Date.now();
      if (gameLogsState.lastLiveStatsFetchTs && now - gameLogsState.lastLiveStatsFetchTs < 5 * 60 * 1000) {
        return;
      }
    }
  }

  await fetchDataHubLiveStats();
}

async function fetchDataHubLiveStats() {
  const sheetWeeks = Object.keys(gameLogsState.playerWeeklyStats || {})
    .map(Number)
    .filter(Number.isFinite);
  const latestSheetWeek = sheetWeeks.length ? Math.max(...sheetWeeks) : 0;
  const existingLiveStats = Object.entries(gameLogsState.liveWeeklyStats || {}).reduce((accumulator, [week, stats]) => {
    accumulator[week] = { ...(stats || {}) };
    return accumulator;
  }, Object.create(null));

  try {
    const response = await fetch(`${DATAHUB_API_BASE}/state/nfl`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Sleeper state request failed: ${response.status}`);
    }

    const sleeperState = await response.json();
    const season = sleeperState?.season || null;
    const currentWeek = Number(sleeperState?.week);
    gameLogsState.currentNflSeason = season;
    gameLogsState.currentNflWeek = Number.isFinite(currentWeek) ? currentWeek : null;

    if (!season || !Number.isFinite(currentWeek) || currentWeek <= 0) {
      gameLogsState.liveWeeklyStats = existingLiveStats;
      return;
    }

    const liveWeeklyStats = { ...existingLiveStats };
    const fetchStartWeek = Math.max(Math.min(latestSheetWeek + 1, currentWeek), 1);
    for (let week = fetchStartWeek; week <= currentWeek; week += 1) {
      try {
        const statsResponse = await fetch(`${DATAHUB_API_BASE}/stats/nfl/regular/${season}/${week}`, {
          cache: "no-store",
        });
        if (!statsResponse.ok) {
          throw new Error(`Sleeper stats request failed: ${statsResponse.status}`);
        }
        const statsData = await statsResponse.json();
        if (!statsData || typeof statsData !== "object") {
          continue;
        }

        const weekStats = Object.create(null);
        Object.entries(statsData).forEach(([playerId, statLine]) => {
          const override = Number(
            statLine?.pts_ppr ?? statLine?.pts ?? statLine?.pts_ppr_total ?? statLine?.fantasy_points_ppr,
          );
          if (!Number.isFinite(override)) {
            return;
          }
          weekStats[playerId] = {
            fpts: override,
            fpts_override: override,
            __live: true,
          };
        });

        if (Object.keys(weekStats).length > 0) {
          liveWeeklyStats[week] = weekStats;
        }
      } catch (weekError) {
        console.warn(`Unable to fetch DataHub live fantasy points for week ${week}.`, weekError);
      }
    }

    gameLogsState.liveWeeklyStats = liveWeeklyStats;
    gameLogsState.lastLiveStatsWeek = currentWeek;
  } catch (error) {
    console.warn("DataHub live Sleeper stats unavailable.", error);
    gameLogsState.liveWeeklyStats = existingLiveStats;
    if (!Number.isFinite(gameLogsState.lastLiveStatsWeek) && Number.isFinite(gameLogsState.currentNflWeek)) {
      gameLogsState.lastLiveStatsWeek = gameLogsState.currentNflWeek;
    }
  } finally {
    gameLogsState.liveStatsLoaded = true;
    gameLogsState.lastLiveStatsFetchTs = Date.now();
  }
}

function getDataHubCombinedWeeklyStats() {
  const combined = Object.create(null);

  Object.entries(gameLogsState.weeklyStats || {}).forEach(([week, stats]) => {
    const clonedWeek = Object.create(null);
    Object.entries(stats || {}).forEach(([playerId, statLine]) => {
      clonedWeek[playerId] = { ...(statLine || {}) };
    });
    combined[week] = clonedWeek;
  });

  Object.entries(gameLogsState.liveWeeklyStats || {}).forEach(([week, stats]) => {
    if (!combined[week]) combined[week] = Object.create(null);
    const weekBucket = combined[week];
    Object.entries(stats || {}).forEach(([playerId, liveLine]) => {
      const existing = weekBucket[playerId] ? { ...(weekBucket[playerId]) } : {};
      const merged = { ...existing, ...(liveLine || {}) };
      const liveFpts = Number.isFinite(liveLine?.fpts)
        ? liveLine.fpts
        : (Number.isFinite(liveLine?.fpts_override) ? liveLine.fpts_override : null);
      if (liveFpts !== null) {
        merged.fpts = liveFpts;
        merged.fpts_override = liveFpts;
      }
      if (liveLine?.__live === true) {
        merged.__live = true;
      }
      weekBucket[playerId] = merged;
    });
  });

  return combined;
}

async function fetchDataHubGameLogs(playerId) {
  if (!gameLogsState.statsSheetsLoaded) {
    await fetchDataHubPlayerStatsSheets();
  } else {
    await ensureDataHubLiveStats();
  }

  const allWeeklyStats = [];
  const weeklyStats = getDataHubCombinedWeeklyStats();
  Object.keys(weeklyStats)
    .map(Number)
    .sort((left, right) => left - right)
    .forEach((week) => {
      const statsForWeek = weeklyStats[week]?.[playerId];
      if (statsForWeek) {
        allWeeklyStats.push({ week, stats: statsForWeek });
      }
    });

  return allWeeklyStats;
}

function parseDataHubSeasonStatsCsv(csvText) {
  const rows = parseCsv(csvText);
  const result = Object.create(null);

  rows.forEach((row) => {
    let playerId = null;
    const stats = {};

    Object.entries(row || {}).forEach(([rawHeader, rawValue]) => {
      const header = normalizeDataHubPlayerStatsHeader(rawHeader);
      const value = String(rawValue ?? "");
      if (!value && header !== "PROJ") {
        return;
      }

      if (header === "SLPR_ID") {
        playerId = value.trim();
        return;
      }

      const statKey = DATAHUB_PLAYER_STAT_HEADER_MAP[header];
      if (statKey) {
        const parsedValue = parseDataHubStatValue(header, value);
        if (parsedValue !== null) stats[statKey] = parsedValue;
        return;
      }

      const metaKey = DATAHUB_SEASON_META_HEADERS[header];
      if (metaKey) {
        if (metaKey === "games_played") {
          const num = parseFloat(value);
          if (!Number.isNaN(num)) stats[metaKey] = num;
        } else {
          const trimmed = value.trim();
          if (trimmed) stats[metaKey] = trimmed;
        }
        return;
      }

      const valueKey = DATAHUB_SEASON_VALUE_HEADERS[header];
      if (valueKey) {
        const parsed = parseDataHubSeasonValue(header, value);
        if (parsed !== null) stats[valueKey] = parsed;
      }
    });

    if (!playerId) {
      return;
    }

    if (!Number.isFinite(stats.fpts_ppr) && Number.isFinite(stats.fpt_ppr)) {
      stats.fpts_ppr = stats.fpt_ppr;
    }
    if (!Number.isFinite(stats.fpt_ppr) && Number.isFinite(stats.fpts_ppr)) {
      stats.fpt_ppr = stats.fpts_ppr;
    }
    result[playerId] = stats;
  });

  return result;
}

function parseDataHubSeasonRanksCsv(csvText) {
  const rows = parseCsv(csvText);
  const result = Object.create(null);

  rows.forEach((row) => {
    let playerId = null;
    const ranks = {};

    Object.entries(row || {}).forEach(([rawHeader, rawValue]) => {
      const header = normalizeDataHubPlayerStatsHeader(rawHeader);
      const value = String(rawValue ?? "");
      if (!value) {
        return;
      }

      if (header === "SLPR_ID") {
        playerId = value.trim();
        return;
      }

      const statKey = DATAHUB_PLAYER_STAT_HEADER_MAP[header] || DATAHUB_SEASON_VALUE_HEADERS[header];
      if (!statKey) {
        return;
      }

      const parsedRank = parseDataHubRankValue(value);
      if (parsedRank !== null) {
        ranks[statKey] = parsedRank;
      }
    });

    if (playerId) {
      result[playerId] = ranks;
    }
  });

  return result;
}

function parseDataHubWeeklyStatsCsv(csvText) {
  const rows = parseCsv(csvText);
  const result = Object.create(null);

  rows.forEach((row) => {
    let playerId = null;
    const stats = {};

    Object.entries(row || {}).forEach(([rawHeader, rawValue]) => {
      const header = normalizeDataHubPlayerStatsHeader(rawHeader);
      const value = String(rawValue ?? "");

      if (header === "SLPR_ID") {
        if (value) playerId = value.trim();
        return;
      }
      if (header !== "PROJ" && !value) {
        return;
      }

      const metaKey = DATAHUB_WEEKLY_META_HEADER_MAP[header];
      if (metaKey) {
        if (metaKey === "opponent_rank") {
          const parsed = parseFloat(value.trim());
          if (!Number.isNaN(parsed)) stats[metaKey] = parsed;
        } else {
          const trimmed = value.trim();
          if (trimmed) stats[metaKey] = trimmed;
        }
        return;
      }

      const statKey = DATAHUB_PLAYER_STAT_HEADER_MAP[header];
      if (!statKey) {
        return;
      }
      if (header === "PROJ") {
        stats[statKey] = value || "";
        return;
      }

      const parsedValue = parseDataHubStatValue(header, value);
      if (parsedValue !== null) {
        stats[statKey] = parsedValue;
      }
    });

    if (playerId) {
      result[playerId] = stats;
    }
  });

  return result;
}

function normalizeDataHubPlayerStatsHeader(header) {
  return String(header || "").replace(/[\u00a0\u202f]/g, " ").trim();
}

function parseDataHubStatValue(header, value) {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed.toUpperCase() === "NA") {
    return null;
  }
  if (header === "SNP%") {
    const numericPortion = parseFloat(trimmed.replace("%", ""));
    if (Number.isNaN(numericPortion)) return null;
    if (trimmed.includes("%") || numericPortion > 1.5) return numericPortion;
    return numericPortion * 100;
  }
  const num = parseFloat(trimmed);
  return Number.isNaN(num) ? null : num;
}

function parseDataHubSeasonValue(header, value) {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed.toUpperCase() === "NA") return null;
  if (header === "PRK_PPR") {
    const intVal = parseInt(trimmed, 10);
    return Number.isNaN(intVal) ? null : intVal;
  }
  const numVal = parseFloat(trimmed);
  return Number.isNaN(numVal) ? null : numVal;
}

function parseDataHubRankValue(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (upper === "NA" || upper === "N/A") return null;
  const numVal = parseFloat(trimmed);
  return Number.isNaN(numVal) ? null : numVal;
}

function buildDataHubStatLabels() {
  const labels = {};
  Object.entries(DATAHUB_PLAYER_STAT_HEADER_MAP).forEach(([header, key]) => {
    labels[key] = header;
  });
  labels.fpts = "FPTS";
  labels.ppg = "PPG";
  labels.ts_per_rr = "TS%";
  labels.fpoe = "FPOE";
  labels.expl_ru_pct = "EXPLSV%";
  return labels;
}

function getDataHubSeasonRankKey(statKey) {
  return DATAHUB_STAT_KEY_RANK_OVERRIDES[statKey] || statKey;
}

function getDataHubSeasonRankValue(playerId, statKey) {
  const normalizeRank = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    return parseDataHubRankValue(String(value));
  };

  if (statKey === "fpts" || statKey === "ppg") {
    const liveRank = statKey === "fpts"
      ? gameLogsState.activeRanks?.posRank
      : gameLogsState.activeRanks?.ppgPosRank;
    return normalizeRank(liveRank);
  }

  const ranks = gameLogsState.playerSeasonRanks?.[playerId];
  if (!ranks) return null;
  const key = getDataHubSeasonRankKey(statKey);
  if (!(key in ranks)) return null;
  return normalizeRank(ranks[key]);
}

function getDataHubRankDisplayText(rank) {
  if (rank === null || rank === undefined || Number.isNaN(rank)) {
    return "NA";
  }
  const rankStr = String(rank).trim();
  if (!rankStr) return "NA";
  const upper = rankStr.toUpperCase();
  if (upper === "NA" || upper === "N/A") return "NA";
  return rankStr;
}

function getSortedDataHubSharedStatsKeySections() {
  return DATAHUB_SHARED_STATS_KEY_SECTIONS.map((section) => ({
    ...section,
    items: [...section.items].sort((left, right) => {
      return left.abbr.localeCompare(right.abbr, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }),
  }));
}

function buildDataHubSharedStatsKeyMarkup() {
  const sections = getSortedDataHubSharedStatsKeySections();
  return `
    <div class="stats-key-sections">
      ${sections.map((section) => `
        <section class="stats-key-section stats-key-section--${section.tone}">
          <div class="stats-key-section-header stats-key-section-header--${section.tone}">${section.label}</div>
          <div class="stats-key-section-body">
            ${section.items.map((item) => `
              <div class="stats-key-item">
                <span class="stats-key-abbr">${item.abbr}</span>
                <span class="stats-key-desc">${item.desc}</span>
              </div>
            `).join("")}
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderDataHubSharedStatsKeyMarkup(container) {
  if (!container) {
    return;
  }

  container.innerHTML = buildDataHubSharedStatsKeyMarkup();
}

function formatDataHubPercentage(value, decimals = 1) {
  const fallback = (0).toFixed(decimals) + "%";
  if (value === null || value === undefined || Number.isNaN(value)) return fallback;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return fallback;
  return numericValue.toFixed(decimals) + "%";
}

function formatDataHubRadarStatValue(statKey, value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      if ((statKey === "cpoe" || statKey === "epa_per_db") && !trimmed.startsWith("-") && !trimmed.startsWith("+")) {
        const numeric = parseFloat(trimmed.replace("%", ""));
        if (Number.isFinite(numeric) && numeric > 0) return `+${trimmed}`;
      }
      return trimmed;
    }
  }
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "N/A";
  if (["cmp_pct", "snp_pct", "ts_per_rr", "prs_pct", "pass_imp_per_att"].includes(statKey)) {
    return numericValue.toFixed(1) + "%";
  }
  if (statKey === "cpoe") {
    const formatted = numericValue.toFixed(1) + "%";
    return numericValue > 0 ? `+${formatted}` : formatted;
  }
  if (statKey === "first_down_rec_rate") return numericValue.toFixed(2);
  if (statKey === "fpts" || statKey === "ppg") return numericValue.toFixed(1);
  if (statKey === "rec" || statKey === "rec_tgt" || statKey === "yds_total") {
    return Math.round(numericValue).toString();
  }
  if (statKey === "rec_ypg" || statKey === "pass_rtg") return numericValue.toFixed(1);
  if (statKey === "ttt" || statKey === "imp_per_g") return numericValue.toFixed(2);
  if (statKey === "epa_per_db") {
    const formatted = numericValue.toFixed(2);
    return numericValue > 0 ? `+${formatted}` : formatted;
  }
  return numericValue.toFixed(2);
}

function createDataHubRankAnnotation(rank, { wrapInParens = true, ordinal = false, variant = "default" } = {}) {
  const span = document.createElement("span");
  span.className = `stat-rank-annotation stat-rank-variant-${variant}`;
  const displayText = getDataHubRankDisplayText(rank);

  if (displayText !== "NA") {
    const numericValue = Number(displayText);
    if (Number.isFinite(numericValue)) {
      if (wrapInParens) span.append(document.createTextNode("("));
      const number = document.createElement("span");
      number.className = "stat-rank-number";
      number.textContent = String(numericValue);
      span.append(number);

      if (ordinal) {
        const suffix = document.createElement("sup");
        suffix.className = `stat-rank-suffix stat-rank-suffix-${variant}`;
        suffix.textContent = getOrdinalSuffixOnly(numericValue);
        span.append(suffix);
      }
      if (wrapInParens) span.append(document.createTextNode(")"));
      return span;
    }
  }

  span.textContent = wrapInParens ? `(${displayText})` : displayText;
  return span;
}

function getOrdinalSuffixOnly(number) {
  const numeric = Math.abs(Number(number));
  if (!Number.isFinite(numeric) || Math.floor(numeric) !== numeric) return "";
  const tens = numeric % 100;
  if (tens >= 11 && tens <= 13) return "th";
  const ones = numeric % 10;
  if (ones === 1) return "st";
  if (ones === 2) return "nd";
  if (ones === 3) return "rd";
  return "th";
}

function ordinalSuffix(number) {
  const suffix = getOrdinalSuffixOnly(number);
  return `${number}${suffix}`;
}

function getDataHubRankColor(rank) {
  if (typeof rank !== "number") return "var(--datahub-gamelogs-text-primary)";
  const thresholds = [
    { v: 24, c: "#8BEBCDbb" },
    { v: 48, c: "#97EBE3ab" },
    { v: 72, c: "#7dd1ffaa" },
    { v: 96, c: "#48a6ffaa" },
    { v: 120, c: "#957cffbb" },
    { v: 156, c: "#a642ffbb" },
    { v: 180, c: "#cf60ffcc" },
    { v: 204, c: "#ff6fe1cc" },
    { v: 250, c: "#ff2eb2" },
  ];
  for (const threshold of thresholds) {
    if (rank <= threshold.v) return threshold.c;
  }
  if (rank > 250 && rank < 300) return "#ff0080";
  if (rank >= 300) return "#656565";
  return "var(--datahub-gamelogs-text-secondary)";
}

function getDataHubConditionalColorByRank(rank, position) {
  if (typeof rank !== "number" || rank <= 0) return "inherit";
  const normalizedPos = typeof position === "string" ? position.trim().toUpperCase() : "";
  const thresholds = normalizedPos === "WR"
    ? [
      { v: 12, c: "#51CBA5" },
      { v: 24, c: "#34aabf" },
      { v: 36, c: "#4798fc" },
      { v: 48, c: "#957CFF" },
      { v: 60, c: "#FF6FE1" },
      { v: 72, c: "#FF2EB9" },
    ]
    : [
      { v: 8, c: "#51CBA5" },
      { v: 16, c: "#34aabf" },
      { v: 24, c: "#4798fc" },
      { v: 32, c: "#957CFF" },
      { v: 44, c: "#FF6FE1" },
      { v: 60, c: "#FF2EB2" },
    ];
  for (const threshold of thresholds) {
    if (rank <= threshold.v) return threshold.c;
  }
  return "#767693";
}

function getDataHubKtcColor(value) {
  const scale = [
    { v: 9000, c: "#72edd0B3" },
    { v: 8000, c: "#58d5ceB3" },
    { v: 7000, c: "#5bdae8B3" },
    { v: 6000, c: "#6eb4ebB3" },
    { v: 5500, c: "#62a5f9B3" },
    { v: 5000, c: "#848bffB3" },
    { v: 4500, c: "#7b63ffB3" },
    { v: 4000, c: "#964effB3" },
    { v: 3500, c: "#c449f9B3" },
    { v: 3000, c: "#ee42ffB3" },
    { v: 2500, c: "#d13eb8B3" },
    { v: 2000, c: "#d032aaB3" },
    { v: 0, c: "#f94ea4B3" },
  ];
  if (value === null || value === 0) return "#e0e6ed";
  for (const threshold of scale) {
    if (value >= threshold.v) return threshold.c;
  }
  return scale[scale.length - 1].c;
}

function parseDataHubHeightToInches(heightStr) {
  if (!heightStr && heightStr !== 0) return null;
  const normalized = String(heightStr)
    .trim()
    .replace(/[’‘]/g, "'")
    .replace(/[‐–—−]/g, "-")
    .replace(/\s+ft\b/gi, "'")
    .replace(/\s*in\b/gi, "");
  let match = normalized.match(/^(\d{1,2})\s*(?:'|-)\s*(\d{1,2})\s*(?:\"?)$/);
  if (match) {
    return parseInt(match[1], 10) * 12 + parseInt(match[2], 10);
  }
  match = normalized.match(/^(\d{1,2})\s*(?:'|ft)?\s*$/i);
  if (match) {
    return parseInt(match[1], 10) * 12;
  }
  const digits = normalized.match(/\d+/g) || [];
  if (digits.length === 1) {
    const raw = digits[0];
    if (raw.length === 3) {
      return parseInt(raw.slice(0, 1), 10) * 12 + parseInt(raw.slice(1), 10);
    }
    const num = parseInt(raw, 10);
    if (num >= 50 && num <= 90) return num;
  }
  if (digits.length >= 2) {
    return parseInt(digits[0], 10) * 12 + parseInt(digits[1], 10);
  }
  return null;
}

function parseDataHubWeightToLbs(weightStr) {
  if (!weightStr && weightStr !== 0) return null;
  const match = String(weightStr).match(/(\d{2,3})\s*(?:lbs?|lb)?/i) || String(weightStr).match(/(\d{2,3})/);
  return match ? parseInt(match[1], 10) : null;
}

function parseDataHubAgeValue(ageStr) {
  if (!ageStr && ageStr !== 0) return null;
  const match = String(ageStr).trim().match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const numeric = Number(match[0]);
  return Number.isFinite(numeric) ? numeric : null;
}

function getDataHubVitalsColor(label, position, rawValue) {
  const pos = String(position || "").toUpperCase();
  if (!rawValue) return null;
  if (label === "AGE") {
    const age = parseDataHubAgeValue(rawValue);
    if (age === null) return null;
    if (pos === "WR") {
      if (age < 26) return "#96F2CEB9";
      if (age < 29) return "#84B8FBFF";
      if (age < 31) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
    if (pos === "RB") {
      if (age <= 24) return "#96F2CEB9";
      if (age < 25) return "#84B8FBFF";
      if (age < 28) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
    if (pos === "TE") {
      if (age < 26) return "#96F2CEB9";
      if (age < 29.5) return "#84B8FBFF";
      if (age < 32) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
    if (pos === "QB") {
      if (age < 28.5) return "#96F2CEB9";
      if (age < 33) return "#84B8FBFF";
      if (age < 41) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
  }
  if (label === "WEIGHT") {
    const weight = parseDataHubWeightToLbs(rawValue);
    if (weight === null) return null;
    if (pos === "QB") {
      if (weight < 210) return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
      if (weight <= 250) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
    }
    if (pos === "RB") {
      if (weight < 190) return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
      if (weight < 200) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.high;
    }
    if (pos === "TE") {
      if (weight < 230) return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
      if (weight < 240) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.high;
    }
    if (pos === "WR") {
      if (weight < 190) return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
      if (weight <= 200) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      if (weight <= 234) return DATAHUB_HEIGHT_WEIGHT_COLORS.high;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
    }
  }
  if (label === "HEIGHT") {
    const inches = parseDataHubHeightToInches(rawValue);
    if (inches === null) return null;
    if (pos === "QB") {
      if (inches < 72) return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
      if (inches <= 73) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.high;
    }
    if (pos === "RB") {
      if (inches >= 75) return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
      if (inches > 69) return DATAHUB_HEIGHT_WEIGHT_COLORS.high;
      if (inches >= 67) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
    }
    if (pos === "TE") {
      if (inches > 74) return DATAHUB_HEIGHT_WEIGHT_COLORS.high;
      if (inches >= 73) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
    }
    if (pos === "WR") {
      if (inches < 71) return DATAHUB_HEIGHT_WEIGHT_COLORS.low;
      if (inches <= 72) return DATAHUB_HEIGHT_WEIGHT_COLORS.mid;
      return DATAHUB_HEIGHT_WEIGHT_COLORS.high;
    }
  }
  return null;
}

function getDataHubPlayerVitals(playerId, player) {
  const fallback = { age: "—", height: "—", weight: "—", exp: "—", ry: "—" };
  const playerMeta = gameLogsState.playerMetaById?.[playerId];
  const activeKtcLookup = getActiveKtcLookup();
  const ktcMeta = activeKtcLookup?.[playerId] || null;
  const collect = (...values) => values
    .map((value) => (typeof value === "string" ? value.trim() : value))
    .filter((value) => value !== undefined && value !== null && value !== "");

  if (!playerMeta && !ktcMeta) {
    return fallback;
  }

  const parseAge = () => {
    if (typeof ktcMeta?.age === "number") return ktcMeta.age.toFixed(1);
    const candidates = collect(playerMeta?.age, playerMeta?.metadata?.age, playerMeta?.metadata?.player_age);
    for (const candidate of candidates) {
      const numeric = parseInt(candidate, 10);
      if (Number.isFinite(numeric) && numeric > 0) return Number(numeric).toFixed(1);
    }
    if (playerMeta?.birth_date || playerMeta?.birthdate) {
      const birth = new Date(playerMeta.birth_date || playerMeta.birthdate);
      if (!Number.isNaN(birth.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const hasHadBirthday = today.getMonth() > birth.getMonth()
          || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
        if (!hasHadBirthday) age -= 1;
        if (Number.isFinite(age) && age > 0 && age < 80) return Number(age).toFixed(1);
      }
    }
    return null;
  };

  const formatHeightFromParts = (feet, inches) => {
    const parsedFeet = parseInt(feet, 10);
    const parsedInches = parseInt(inches, 10);
    if (!Number.isFinite(parsedFeet) && !Number.isFinite(parsedInches)) return null;
    const safeFeet = Number.isFinite(parsedFeet) ? parsedFeet : Math.floor(parsedInches / 12);
    const safeInches = Number.isFinite(parsedInches) ? parsedInches % 12 : 0;
    if (!Number.isFinite(safeFeet) || safeFeet <= 0) return null;
    return `${safeFeet}'${Math.max(0, Math.min(11, safeInches))}"`;
  };

  const parseHeight = () => {
    const pairCandidates = [
      [playerMeta?.height_feet, playerMeta?.height_inches],
      [playerMeta?.metadata?.height_feet, playerMeta?.metadata?.height_inches],
      [playerMeta?.height_ft, playerMeta?.height_in],
      [playerMeta?.metadata?.height_ft, playerMeta?.metadata?.height_in],
    ];
    for (const [feet, inches] of pairCandidates) {
      const formatted = formatHeightFromParts(feet, inches);
      if (formatted) return formatted;
    }
    const candidates = collect(
      playerMeta?.height,
      playerMeta?.metadata?.height,
      playerMeta?.metadata?.player_height,
      playerMeta?.height_inches,
      playerMeta?.height_in,
      playerMeta?.metadata?.height_inches,
      playerMeta?.metadata?.height_in,
    );
    for (const candidate of candidates) {
      const inches = parseDataHubHeightToInches(candidate);
      if (Number.isFinite(inches)) {
        const feet = Math.floor(inches / 12);
        const remainder = inches % 12;
        return `${feet}'${remainder}"`;
      }
    }
    return null;
  };

  const parseWeight = () => {
    const candidates = collect(
      playerMeta?.weight,
      playerMeta?.metadata?.weight,
      playerMeta?.metadata?.player_weight,
      playerMeta?.weight_lbs,
      playerMeta?.metadata?.weight_lbs,
    );
    for (const candidate of candidates) {
      const numeric = parseInt(candidate, 10);
      if (Number.isFinite(numeric) && numeric > 0) return `${numeric} lbs`;
    }
    return null;
  };

  const parseExperience = () => {
    const exp = playerMeta?.years_exp ?? playerMeta?.metadata?.years_exp;
    if (exp === null || exp === undefined || exp === "") return "—";
    return String(exp);
  };

  const parseRookieYear = () => {
    const rookieYear = playerMeta?.rookie_year ?? playerMeta?.metadata?.rookie_year;
    if (rookieYear && rookieYear !== "0") return String(rookieYear);
    const exp = playerMeta?.years_exp;
    if (exp !== null && exp !== undefined && exp !== "") {
      return String(2025 - Number(exp));
    }
    return "—";
  };

  return {
    age: parseAge() ?? fallback.age,
    height: parseHeight() ?? fallback.height,
    weight: parseWeight() ?? fallback.weight,
    exp: parseExperience(),
    ry: parseRookieYear(),
    pos: player?.pos || playerMeta?.position || "",
  };
}

function createDataHubPlayerVitalsElement(vitals, { variant = "modal", pos = "" } = {}) {
  const container = document.createElement("div");
  container.className = `player-vitals player-vitals--${variant}`;
  [
    { label: "AGE", value: vitals.age },
    { label: "HEIGHT", value: vitals.height },
    { label: "WEIGHT", value: vitals.weight },
    { label: "EXP", value: vitals.exp },
    { label: "RY", value: vitals.ry },
  ].forEach(({ label, value }) => {
    const item = document.createElement("div");
    item.className = "player-vitals__item";
    const labelEl = document.createElement("span");
    labelEl.className = "player-vitals__label";
    labelEl.textContent = label;
    const valueEl = document.createElement("span");
    valueEl.className = "player-vitals__value";
    valueEl.textContent = value;
    if (label === "AGE" || label === "HEIGHT" || label === "WEIGHT") {
      const color = getDataHubVitalsColor(label, pos, value);
      if (color) valueEl.style.color = color;
    }
    item.append(labelEl, valueEl);
    container.append(item);
  });
  return container;
}

function getDataHubOpponentRankColor(rank) {
  const numericRank = typeof rank === "number" ? rank : parseFloat(rank);
  if (!Number.isFinite(numericRank)) return null;
  if (numericRank <= 8) return "#82d8bee0";
  if (numericRank <= 16) return "#73b9e7e0";
  if (numericRank <= 24) return "#c093ebe0";
  if (numericRank <= 32) return "#c456b1e0";
  return null;
}

function buildDataHubGameLogsHeader(player, playerRanks) {
  if (!dataHubGameLogsModalHeader) {
    return;
  }

  dataHubGameLogsModal.classList.remove("is-loading");
  dataHubGameLogsModalBody.classList.remove("is-loading");

  if (dataHubGameLogsModalPlayerName) {
    dataHubGameLogsModalPlayerName.textContent = player.name || "Player";
  }

  dataHubGameLogsModalHeader.querySelector(".modal-header-left-container")?.remove();
  const leftContainer = document.createElement("div");
  leftContainer.className = "modal-header-left-container";

  const posTag = document.createElement("div");
  posTag.className = `modal-pos-tag ${player.pos}`;
  posTag.textContent = player.pos;
  leftContainer.append(posTag);

  const teamKey = String(player.team || "FA").toUpperCase();
  const logoKeyMap = { WSH: "was", WAS: "was", JAC: "jax", LA: "lar" };
  const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
  const teamLogoChip = document.createElement("div");
  teamLogoChip.className = "modal-team-logo-chip";
  teamLogoChip.dataset.team = teamKey;
  if (teamKey && teamKey !== "FA") {
    const img = document.createElement("img");
    img.className = "team-logo";
    img.alt = teamKey;
    img.width = 24;
    img.height = 24;
    img.loading = "eager";
    img.src = new URL(`../assets/NFL_logos_svg/${normalizedKey}.svg`, window.location.href).href;
    teamLogoChip.append(img);
  } else {
    teamLogoChip.textContent = "FA";
  }
  leftContainer.append(teamLogoChip);
  dataHubGameLogsModalHeader.insertBefore(leftContainer, dataHubGameLogsModalHeader.firstChild);

  if (dataHubGameLogsModalPlayerVitals) {
    dataHubGameLogsModalPlayerVitals.innerHTML = "";
    const vitals = getDataHubPlayerVitals(player.id, player);
    dataHubGameLogsModalPlayerVitals.append(
      createDataHubPlayerVitalsElement(vitals, { variant: "modal", pos: player.pos }),
    );
  }

  if (dataHubGameLogsModalSummaryChips) {
    const ktcPosRank = parseInt(String(player.posRank || "").split("·")[1], 10);
    dataHubGameLogsModalSummaryChips.innerHTML = `
      <div class="gamelogs-summary-chip">
        <h4>
          <span class="chip-header-value" style="color:${getDataHubConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.total_pts}</span>
          <span class="chip-unit">FPTS</span>
        </h4>
        <div class="chip-values">
          <span class="pos-rank-container">
            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
            <span style="color:${getDataHubConditionalColorByRank(playerRanks.posRank, player.pos)}">${Number.isFinite(playerRanks.posRank) ? playerRanks.posRank : "NA"}</span>
          </span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(playerRanks.overallRank)}">${Number.isFinite(playerRanks.overallRank) ? `#${playerRanks.overallRank}` : "NA"}</span>
        </div>
      </div>
      <div class="gamelogs-summary-chip">
        <h4>
          <span class="chip-header-value" style="color:${getDataHubConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppg}</span>
          <span class="chip-unit">PPG</span>
        </h4>
        <div class="chip-values">
          <span class="pos-rank-container">
            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
            <span style="color:${getDataHubConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${Number.isFinite(playerRanks.ppgPosRank) ? playerRanks.ppgPosRank : "NA"}</span>
          </span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(playerRanks.ppgOverallRank)}">${Number.isFinite(playerRanks.ppgOverallRank) ? `#${playerRanks.ppgOverallRank}` : "NA"}</span>
        </div>
      </div>
      <div class="gamelogs-summary-chip">
        <h4>
          <span class="chip-header-value" style="color:${getDataHubKtcColor(player.ktc)}">${Number.isFinite(player.ktc) ? player.ktc : "—"}</span>
          <span class="chip-unit">KTC</span>
        </h4>
        <div class="chip-values">
          <span class="pos-rank-container">
            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
            <span style="color:${getDataHubConditionalColorByRank(ktcPosRank, player.pos)}">${Number.isFinite(ktcPosRank) ? ktcPosRank : "NA"}</span>
          </span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(player.overallRank)}">${Number.isFinite(player.overallRank) ? `#${player.overallRank}` : "NA"}</span>
        </div>
      </div>
    `;
  }
}

function getDataHubOrderedStatKeys(position) {
  const qbStatOrder = ["fpts", "proj", "pass_rtg", "pass_yd", "pass_td", "cmp_pct", "yds_total", "rush_yd", "rush_td", "pass_att", "pass_cmp", "pass_fd", "imp_per_g", "pass_imp", "pass_imp_per_att", "rush_att", "ypc", "ttt", "prs_pct", "pass_sack", "pass_int", "fum", "fpoe"];
  const rbStatOrder = ["fpts", "proj", "snp_pct", "rush_att", "rush_yd", "rush_td", "rush_fd", "yds_total", "ypc", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "rec_tgt", "elu", "mtf_per_att", "yco_per_att", "mtf", "rush_yac", "ryoe", "expl_ru_pct", "imp_per_g", "fum", "fpoe"];
  const wrTeStatOrder = ["fpts", "proj", "snp_pct", "rec_tgt", "rec", "ts_per_rr", "rec_yd", "rec_td", "yprr", "rec_fd", "first_down_rec_rate", "rec_ypg", "ay_pct", "rec_yar", "ypr", "imp_per_g", "rr", "yds_total", "rz_tgt", "rush_att", "rush_yd", "rush_td", "ypc", "fum", "fpoe"];
  if (position === "QB") return qbStatOrder;
  if (position === "RB") return rbStatOrder;
  return wrTeStatOrder;
}

function buildDataHubStatGroupMap() {
  const map = new Map();
  const assign = (group, keys) => keys.forEach((key) => map.set(key, group));
  assign("all", ["fpts", "ppg", "proj", "snp_pct", "yds_total", "imp_per_g", "fum", "fpoe"]);
  assign("passing", ["pass_rtg", "pass_yd", "pass_td", "cmp_pct", "pass_att", "pass_cmp", "pass_fd", "pass_imp", "pass_imp_per_att", "ttt", "prs_pct", "cpoe", "dp_pct", "pass_int", "epa_per_db", "pa_ypg", "pass_sack"]);
  assign("rushing", ["rush_att", "rush_yd", "ypc", "rush_td", "rush_fd", "elu", "mtf_per_att", "yco_per_att", "expl_ru_pct", "mtf", "rush_yac", "ryoe", "ru_ypg"]);
  assign("receiving", ["rec", "rec_yd", "rec_tgt", "rec_td", "rec_fd", "rec_yar", "ypr", "yprr", "ts_per_rr", "first_down_rec_rate", "rr", "rz_tgt", "rec_ypg", "ay_pct"]);
  return map;
}

function createDataHubWeekTag(week, stats) {
  const wrapper = document.createElement("div");
  wrapper.className = "gamelog-week-tag";

  const weekNumberLine = document.createElement("div");
  weekNumberLine.className = "gamelog-week-tag-number";
  weekNumberLine.textContent = `WK-${week}`;
  wrapper.append(weekNumberLine);

  if (stats?.opponent) {
    const opponentLine = document.createElement("div");
    opponentLine.className = "gamelog-week-tag-opponent";
    const opponentText = document.createElement("span");
    opponentText.className = "gamelog-week-tag-opponent-text";
    opponentText.textContent = stats.opponent;
    opponentLine.append(opponentText);

    if (Number.isFinite(stats.opponent_rank)) {
      const separator = document.createElement("span");
      separator.className = "gamelog-week-tag-separator";
      separator.textContent = "•";
      const rankWrap = document.createElement("span");
      rankWrap.className = "gamelog-week-tag-rank";
      rankWrap.style.color = getDataHubOpponentRankColor(stats.opponent_rank) || "";
      rankWrap.innerHTML = `
        <span class="gamelog-week-tag-rank-number">${Math.round(stats.opponent_rank)}</span>
        <span class="gamelog-week-tag-rank-suffix">${getOrdinalSuffixOnly(stats.opponent_rank)}</span>
      `;
      opponentLine.append(separator, rankWrap);
    }

    wrapper.append(opponentLine);
  }

  return wrapper;
}

function getDataHubProjectionDisplayValue(stats) {
  if (stats && Object.prototype.hasOwnProperty.call(stats, "proj")) {
    return String(stats.proj ?? "");
  }
  return "";
}

function resolveDataHubWeeklyStatDisplayValue(key, stats, isLiveWeek) {
  if (!stats) {
    return key === "fpts" ? "-" : "N/A";
  }
  if (key === "proj") {
    return getDataHubProjectionDisplayValue(stats);
  }
  if (key === "fpts") {
    if (isLiveWeek && Number.isFinite(stats.fpts)) return stats.fpts.toFixed(1);
    if (Number.isFinite(stats.fpt_ppr)) return stats.fpt_ppr.toFixed(1);
    return "-";
  }

  let value = null;
  if (DATAHUB_NO_FALLBACK_KEYS.has(key)) {
    value = typeof stats[key] === "number" ? stats[key] : null;
  } else if (key === "ypc") {
    value = (stats.rush_att || 0) > 0 ? (stats.rush_yd || 0) / stats.rush_att : 0;
  } else if (key === "yco_per_att") {
    value = (stats.rush_att || 0) > 0 ? (stats.rush_yac || 0) / stats.rush_att : 0;
  } else if (key === "mtf_per_att") {
    value = (stats.rush_att || 0) > 0 ? (stats.mtf || 0) / stats.rush_att : 0;
  } else if (key === "pass_imp_per_att") {
    if (typeof stats[key] === "number") value = stats[key];
    else if ((stats.pass_att || 0) > 0) value = ((stats.pass_imp || 0) / stats.pass_att) * 100;
    else value = 0;
  } else if (key === "ts_per_rr") {
    if (typeof stats[key] === "number") value = stats[key];
    else if ((stats.rr || 0) > 0) value = ((stats.rec_tgt || 0) / stats.rr) * 100;
    else value = 0;
  } else if (key === "yprr") {
    if (typeof stats[key] === "number") value = stats[key];
    else if ((stats.rr || 0) > 0) value = (stats.rec_yd || 0) / stats.rr;
    else value = 0;
  } else if (key === "ypr") {
    if (typeof stats[key] === "number") value = stats[key];
    else if ((stats.rec || 0) > 0) value = (stats.rec_yd || 0) / stats.rec;
    else value = 0;
  } else if (key === "first_down_rec_rate") {
    if (typeof stats[key] === "number") value = stats[key];
    else if ((stats.rec || 0) > 0) value = (stats.rec_fd || 0) / stats.rec;
    else value = 0;
  } else if (key === "imp_per_g") {
    value = typeof stats[key] === "number" ? stats[key] : (stats.imp || 0);
  } else {
    value = typeof stats[key] === "number" ? stats[key] : null;
  }

  if (value === null || value === undefined || Number.isNaN(value)) {
    return key === "fpts" ? "-" : "N/A";
  }
  if (key === "expl_ru_pct") {
    const normalized = Math.abs(value) <= 1.5 ? value * 100 : value;
    return formatDataHubPercentage(normalized, 1);
  }
  if (["pass_imp_per_att", "prs_pct", "snp_pct", "ts_per_rr", "cmp_pct"].includes(key)) {
    return formatDataHubPercentage(value, 1);
  }
  if (key === "cpoe") {
    const formatted = formatDataHubPercentage(value, 1);
    return value > 0 ? `+${formatted}` : formatted;
  }
  if (key === "epa_per_db") {
    const formatted = Number(value).toFixed(2);
    return value > 0 ? `+${formatted}` : formatted;
  }
  if (["yco_per_att", "mtf_per_att", "ypc", "ttt", "ypr", "yprr", "first_down_rec_rate", "imp_per_g"].includes(key)) {
    return Number(value).toFixed(2);
  }
  if (key === "pass_rtg") return Number(value).toFixed(1);
  return Number.isInteger(value) ? String(value) : Number(value).toFixed(1);
}

function getDataHubSznSectionsForPosition(position) {
  const normalized = String(position || "").trim().toUpperCase();
  return DATAHUB_SZN_STAT_SECTIONS_BY_POS[normalized] || [];
}

function computeDataHubSznProgressPercent(rank, position) {
  const numericRank = typeof rank === "number" ? rank : Number(rank);
  if (!Number.isFinite(numericRank) || numericRank <= 0) return 0;
  const thresholds = DATAHUB_SZN_PROGRESS_THRESHOLDS[String(position || "").toUpperCase()] || DATAHUB_SZN_PROGRESS_THRESHOLDS.WR;
  if (numericRank <= thresholds[0].rank) return thresholds[0].pct;
  if (numericRank >= thresholds[thresholds.length - 1].rank) return thresholds[thresholds.length - 1].pct;
  for (let index = 0; index < thresholds.length - 1; index += 1) {
    const start = thresholds[index];
    const end = thresholds[index + 1];
    if (numericRank >= start.rank && numericRank <= end.rank) {
      const span = Math.max(end.rank - start.rank, 1);
      const t = (numericRank - start.rank) / span;
      return Math.max(0, Math.min(100, start.pct + (end.pct - start.pct) * t));
    }
  }
  return 0;
}

function getDataHubSznStatRankColor(rank, position) {
  return getDataHubConditionalColorByRank(rank, position);
}

function getDataHubSznStatFillCoreColor(rank, position) {
  if (typeof rank !== "number" || rank <= 0) return "inherit";
  const pos = String(position || "").toUpperCase();
  const thresholds = pos === "WR"
    ? [
      { v: 12, c: "#DEF5" },
      { v: 24, c: "#DEF3" },
      { v: 36, c: "#DEF5" },
      { v: 48, c: "#DEF5" },
      { v: 60, c: "#DEF3" },
      { v: 72, c: "#DEF6" },
    ]
    : [
      { v: 8, c: "#def5" },
      { v: 16, c: "#def3" },
      { v: 24, c: "#def5" },
      { v: 32, c: "#def5" },
      { v: 40, c: "#def3" },
      { v: 50, c: "#def6" },
    ];
  for (const threshold of thresholds) {
    if (rank <= threshold.v) return threshold.c;
  }
  return "#7f7e99";
}

function buildDataHubSznFillCoreGradient(fillCoreColor) {
  if (!fillCoreColor || fillCoreColor === "inherit") return null;
  return `linear-gradient(90deg, ${fillCoreColor} 0%, ${fillCoreColor} 100%)`;
}

function getDataHubSznStatRankBoxShadow(rank, position, rankColor) {
  if (typeof rank !== "number" || rank <= 0 || !rankColor || rankColor === "inherit") return "none";
  return `inset 0 0 5px 1px ${rankColor}`;
}

function getDataHubGameLogsSeasonDisplayValue({ key, seasonTotals, aggregatedTotals, snapPctValues, statValueCounts, gameLogsWithData }) {
  if (key === "proj") return "-";
  if (key === "fpts") return gameLogsState.activeRanks?.total_pts ?? "0.0";
  if (key === "ppg") return gameLogsState.activeRanks?.ppg ?? "0.0";
  if (DATAHUB_NO_FALLBACK_KEYS.has(key)) {
    const raw = seasonTotals && typeof seasonTotals[key] === "number" ? seasonTotals[key] : null;
    if (raw === null) return "N/A";
    if (key === "expl_ru_pct") {
      const normalized = Math.abs(raw) <= 1.5 ? raw * 100 : raw;
      return formatDataHubPercentage(normalized, 1);
    }
    if (["snp_pct", "prs_pct", "ts_per_rr", "cmp_pct"].includes(key)) return formatDataHubPercentage(raw, 1);
    if (key === "cpoe") {
      const formatted = formatDataHubPercentage(raw, 1);
      return raw > 0 ? `+${formatted}` : formatted;
    }
    if (key === "epa_per_db") {
      const formatted = Number(raw).toFixed(2);
      return raw > 0 ? `+${formatted}` : formatted;
    }
    return Number.isInteger(raw) ? String(raw) : Number(raw).toFixed(2);
  }
  if (key === "fpoe") {
    const value = typeof seasonTotals?.fpoe === "number" ? seasonTotals.fpoe : aggregatedTotals.fpoe;
    return Number.isFinite(value) ? Number(value).toFixed(1) : "N/A";
  }
  if (key === "pa_ypg") {
    const total = typeof seasonTotals?.pass_yd === "number" ? seasonTotals.pass_yd : (aggregatedTotals.pass_yd || 0);
    const games = typeof seasonTotals?.games_played === "number" ? seasonTotals.games_played : gameLogsWithData.length;
    return (games > 0 ? total / games : 0).toFixed(1);
  }
  if (key === "ru_ypg") {
    const total = typeof seasonTotals?.rush_yd === "number" ? seasonTotals.rush_yd : (aggregatedTotals.rush_yd || 0);
    const games = typeof seasonTotals?.games_played === "number" ? seasonTotals.games_played : gameLogsWithData.length;
    return (games > 0 ? total / games : 0).toFixed(1);
  }
  if (key === "rec_ypg") {
    const total = typeof seasonTotals?.rec_yd === "number" ? seasonTotals.rec_yd : (aggregatedTotals.rec_yd || 0);
    const games = typeof seasonTotals?.games_played === "number" ? seasonTotals.games_played : gameLogsWithData.length;
    return (games > 0 ? total / games : 0).toFixed(1);
  }
  if (key === "dp_pct") {
    let pctValue = typeof seasonTotals?.dp_pct === "number" ? seasonTotals.dp_pct : null;
    if (pctValue === null) {
      const total = aggregatedTotals.dp_pct || 0;
      const count = statValueCounts.dp_pct || 0;
      pctValue = count > 0 ? total / count : 0;
    }
    const normalized = Math.abs(pctValue) <= 1.5 ? pctValue * 100 : pctValue;
    return formatDataHubPercentage(normalized, 1);
  }
  if (key === "ypc") {
    const yards = typeof seasonTotals?.rush_yd === "number" ? seasonTotals.rush_yd : (aggregatedTotals.rush_yd || 0);
    const carries = typeof seasonTotals?.rush_att === "number" ? seasonTotals.rush_att : (aggregatedTotals.rush_att || 0);
    return (carries > 0 ? yards / carries : 0).toFixed(2);
  }
  if (key === "yco_per_att") {
    const yco = typeof seasonTotals?.rush_yac === "number" ? seasonTotals.rush_yac : (aggregatedTotals.rush_yac || 0);
    const carries = typeof seasonTotals?.rush_att === "number" ? seasonTotals.rush_att : (aggregatedTotals.rush_att || 0);
    return (carries > 0 ? yco / carries : 0).toFixed(2);
  }
  if (key === "mtf_per_att") {
    const mtf = typeof seasonTotals?.mtf === "number" ? seasonTotals.mtf : (aggregatedTotals.mtf || 0);
    const carries = typeof seasonTotals?.rush_att === "number" ? seasonTotals.rush_att : (aggregatedTotals.rush_att || 0);
    return (carries > 0 ? mtf / carries : 0).toFixed(2);
  }
  if (key === "pass_imp_per_att") {
    const passImp = typeof seasonTotals?.pass_imp === "number" ? seasonTotals.pass_imp : (aggregatedTotals.pass_imp || 0);
    const passAtt = typeof seasonTotals?.pass_att === "number" ? seasonTotals.pass_att : (aggregatedTotals.pass_att || 0);
    return formatDataHubPercentage(passAtt > 0 ? (passImp / passAtt) * 100 : 0, 1);
  }
  if (key === "pass_rtg") {
    const value = typeof seasonTotals?.pass_rtg === "number"
      ? seasonTotals.pass_rtg
      : (statValueCounts.pass_rtg ? (aggregatedTotals.pass_rtg || 0) / statValueCounts.pass_rtg : 0);
    return Number(value).toFixed(1);
  }
  if (key === "ttt") {
    const value = typeof seasonTotals?.ttt === "number"
      ? seasonTotals.ttt
      : (statValueCounts.ttt ? (aggregatedTotals.ttt || 0) / statValueCounts.ttt : 0);
    return Number(value).toFixed(2);
  }
  if (key === "prs_pct" || key === "cmp_pct") {
    const count = statValueCounts[key] || 0;
    const value = typeof seasonTotals?.[key] === "number" ? seasonTotals[key] : (count > 0 ? (aggregatedTotals[key] || 0) / count : 0);
    return formatDataHubPercentage(value, 1);
  }
  if (key === "snp_pct") {
    const value = typeof seasonTotals?.snp_pct === "number"
      ? seasonTotals.snp_pct
      : (snapPctValues.length ? snapPctValues.reduce((sum, pct) => sum + pct, 0) / snapPctValues.length : 0);
    return formatDataHubPercentage(value, 1);
  }
  if (key === "imp_per_g") {
    const impact = typeof seasonTotals?.imp === "number" ? seasonTotals.imp : (aggregatedTotals.imp || 0);
    const games = typeof seasonTotals?.games_played === "number" ? seasonTotals.games_played : gameLogsWithData.length;
    return Number(games > 0 ? impact / games : 0).toFixed(2);
  }
  if (key === "yprr") {
    const routes = typeof seasonTotals?.rr === "number" ? seasonTotals.rr : (aggregatedTotals.rr || 0);
    const yards = typeof seasonTotals?.rec_yd === "number" ? seasonTotals.rec_yd : (aggregatedTotals.rec_yd || 0);
    return Number(routes > 0 ? yards / routes : 0).toFixed(2);
  }
  if (key === "ts_per_rr") {
    const routes = typeof seasonTotals?.rr === "number" ? seasonTotals.rr : (aggregatedTotals.rr || 0);
    const targets = typeof seasonTotals?.rec_tgt === "number" ? seasonTotals.rec_tgt : (aggregatedTotals.rec_tgt || 0);
    return formatDataHubPercentage(routes > 0 ? (targets / routes) * 100 : 0, 1);
  }
  if (key === "ypr") {
    const receptions = typeof seasonTotals?.rec === "number" ? seasonTotals.rec : (aggregatedTotals.rec || 0);
    const yards = typeof seasonTotals?.rec_yd === "number" ? seasonTotals.rec_yd : (aggregatedTotals.rec_yd || 0);
    return Number(receptions > 0 ? yards / receptions : 0).toFixed(2);
  }
  if (key === "first_down_rec_rate") {
    const firstDowns = typeof seasonTotals?.rec_fd === "number" ? seasonTotals.rec_fd : (aggregatedTotals.rec_fd || 0);
    const receptions = typeof seasonTotals?.rec === "number" ? seasonTotals.rec : (aggregatedTotals.rec || 0);
    return Number(receptions > 0 ? firstDowns / receptions : 0).toFixed(2);
  }
  const totalValue = typeof seasonTotals?.[key] === "number" ? seasonTotals[key] : (aggregatedTotals[key] || 0);
  return Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(1);
}

function renderDataHubGameLogsSeasonStatsView({ container, player, orderedStatKeys, statLabels, seasonTotals, aggregatedTotals, snapPctValues, statValueCounts, gameLogsWithData, statGroupByKey }) {
  if (!container) return;
  container.innerHTML = "";

  const title = document.createElement("div");
  title.className = "gamelogs-szn-title";
  const titleText = document.createElement("span");
  titleText.className = "gamelogs-szn-title-text";
  titleText.textContent = "Season Stats";
  title.append(titleText);

  const gamesPlayed = typeof seasonTotals?.games_played === "number" ? Math.round(seasonTotals.games_played) : null;
  if (gamesPlayed !== null) {
    const games = document.createElement("span");
    games.className = "gamelogs-szn-title-games";
    games.innerHTML = `<span class="gamelogs-szn-title-games-label">G:</span><span class="gamelogs-szn-title-games-value">${gamesPlayed}</span>`;
    title.append(games);
  }

  const list = document.createElement("div");
  list.className = "gamelogs-szn-list";
  const usedKeys = new Set();

  const appendStatRow = (statKey) => {
    if (!statLabels?.[statKey] || statKey === "proj" || usedKeys.has(statKey)) return;
    usedKeys.add(statKey);

    const rankValue = getDataHubSeasonRankValue(player.id, statKey);
    const rankColor = getDataHubSznStatRankColor(rankValue, player.pos);
    const fillCoreColor = getDataHubSznStatFillCoreColor(rankValue, player.pos);
    const rankBoxShadow = getDataHubSznStatRankBoxShadow(rankValue, player.pos, rankColor);
    const progressPct = computeDataHubSznProgressPercent(rankValue, player.pos);
    const displayValue = getDataHubGameLogsSeasonDisplayValue({
      key: statKey,
      seasonTotals,
      aggregatedTotals,
      snapPctValues,
      statValueCounts,
      gameLogsWithData,
    });

    const row = document.createElement("div");
    row.className = "gamelogs-szn-row";
    const group = statGroupByKey.get(statKey);
    if (group) row.classList.add(`gamelogs-szn-row--${group}`);

    const label = document.createElement("div");
    label.className = "gamelogs-szn-label";
    label.textContent = statLabels[statKey];

    const bar = document.createElement("div");
    bar.className = "gamelogs-szn-bar";
    const fill = document.createElement("div");
    fill.className = "gamelogs-szn-bar-fill";
    fill.style.width = `${progressPct}%`;
    const gradient = buildDataHubSznFillCoreGradient(fillCoreColor);
    if (gradient) {
      fill.style.backgroundImage = gradient;
      fill.style.backgroundColor = "transparent";
    }
    if (rankColor && rankColor !== "inherit") {
      fill.style.border = `1px solid ${rankColor}`;
      fill.style.boxShadow = rankBoxShadow;
    }
    const rankAnnotation = createDataHubRankAnnotation(rankValue, {
      wrapInParens: false,
      ordinal: true,
      variant: "szn",
    });
    rankAnnotation.classList.add("gamelogs-szn-bar-rank");
    rankAnnotation.style.color = rankColor;
    rankAnnotation.style.setProperty("--szn-rank-pos", `${Math.min(98, Math.max(2, progressPct))}%`);
    bar.append(fill, rankAnnotation);

    const value = document.createElement("div");
    value.className = "gamelogs-szn-value";
    const valueMain = document.createElement("span");
    valueMain.className = "gamelogs-szn-value-main";
    const valueText = String(displayValue ?? "").trim();
    if (valueText.endsWith("%") && valueText.length > 1) {
      valueMain.innerHTML = `<span class="gamelogs-szn-value-number">${valueText.slice(0, -1)}</span><span class="gamelogs-szn-value-percent">%</span>`;
    } else {
      valueMain.textContent = valueText;
    }
    value.append(valueMain);

    row.append(label, bar, value);
    list.append(row);
  };

  const sections = getDataHubSznSectionsForPosition(player.pos);
  if (sections.length) {
    sections.forEach((section) => {
      const visibleKeys = (section.stats || []).filter((key) => statLabels?.[key] && key !== "proj" && !usedKeys.has(key));
      if (!visibleKeys.length) return;
      const header = document.createElement("div");
      header.className = `gamelogs-szn-section-header gamelogs-szn-section-header--${section.tone}`;
      header.textContent = section.label;
      list.append(header);
      visibleKeys.forEach(appendStatRow);
    });
  } else {
    orderedStatKeys.forEach(appendStatRow);
  }

  container.append(title, list);
}

function renderDataHubGameLogs(gameLogs, player, playerRanks, requestSeq) {
  const isStaleRequest = () => requestSeq !== gameLogsState.requestSeq;
  if (isStaleRequest()) return;

  gameLogsState.activePlayer = player;
  gameLogsState.activeRanks = playerRanks;
  gameLogsState.activeSummary = {
    fpts: playerRanks.total_pts,
    ppg: playerRanks.ppg,
  };

  buildDataHubGameLogsHeader(player, playerRanks);
  dataHubGameLogsModalBody.innerHTML = "";

  const statLabels = buildDataHubStatLabels();
  const orderedStatKeys = getDataHubOrderedStatKeys(player.pos);
  const statGroupByKey = buildDataHubStatGroupMap();
  const seasonTotals = gameLogsState.playerSeasonStats?.[player.id] || null;
  const gameLogsByWeek = new Map((gameLogs || []).map((entry) => [Number(entry.week), entry]));
  const gameLogsWithData = [];
  const aggregatedTotals = Object.create(null);
  const statValueCounts = Object.create(null);
  const snapPctValues = [];

  const container = document.createElement("div");
  container.className = "game-logs-table-container";
  const scroller = document.createElement("div");
  scroller.className = "game-logs-hscroll";
  const table = document.createElement("table");
  table.className = "game-logs-table";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tfoot = document.createElement("tfoot");
  table.append(thead, tbody, tfoot);
  scroller.append(table);
  container.append(scroller);

  const headerRow = document.createElement("tr");
  const weekHeader = document.createElement("th");
  weekHeader.className = "week-column-header";
  weekHeader.textContent = "WK · VS";
  headerRow.append(weekHeader);
  orderedStatKeys
    .filter((key) => statLabels[key])
    .forEach((key) => {
      const th = document.createElement("th");
      const group = statGroupByKey.get(key);
      if (group) th.classList.add(`gamelog-header-${group}`);
      th.textContent = statLabels[key];
      headerRow.append(th);
    });
  thead.append(headerRow);

  for (let week = 1; week <= DATAHUB_MAX_DISPLAY_WEEKS; week += 1) {
    const weekEntry = gameLogsByWeek.get(week) || null;
    const stats = weekEntry?.stats || gameLogsState.weeklyStats?.[week]?.[player.id] || null;
    const isByeWeek = stats?.opponent === "BYE";
    const hasRecordedStat = stats
      ? orderedStatKeys.some((key) => key !== "proj" && statLabels[key] && typeof stats[key] === "number")
      : false;
    const isLiveWeek = stats?.__live === true || Number.isFinite(stats?.fpts);
    const isUnplayedWeek = !isLiveWeek && (isByeWeek || !hasRecordedStat);

    const row = document.createElement("tr");
    if (isByeWeek) row.classList.add("bye-week-row");
    if (isUnplayedWeek) row.classList.add("unplayed-week-row");
    if (isLiveWeek) row.classList.add("live-week-row");

    const weekCell = document.createElement("td");
    weekCell.className = "week-cell";
    weekCell.append(createDataHubWeekTag(week, stats));
    row.append(weekCell);

    let rowHasData = false;
    orderedStatKeys
      .filter((key) => statLabels[key])
      .forEach((key) => {
        const td = document.createElement("td");
        if (key === "proj") td.classList.add("proj-cell");
        const displayValue = resolveDataHubWeeklyStatDisplayValue(key, stats, isLiveWeek);
        td.textContent = displayValue;
        row.append(td);

        if (stats && key !== "proj" && typeof stats[key] === "number") {
          rowHasData = true;
          if (key === "snp_pct") {
            snapPctValues.push(stats[key]);
          } else {
            aggregatedTotals[key] = (aggregatedTotals[key] || 0) + stats[key];
          }
          statValueCounts[key] = (statValueCounts[key] || 0) + 1;
        }
        if (key === "fpts" && Number.isFinite(stats?.fpt_ppr)) {
          aggregatedTotals.fpt_ppr = (aggregatedTotals.fpt_ppr || 0) + stats.fpt_ppr;
        }
      });

    if (rowHasData || isLiveWeek) {
      gameLogsWithData.push({ week, stats: stats || {} });
    }
    tbody.append(row);
  }

  const footerHeaderRow = document.createElement("tr");
  const footerSeasonHead = document.createElement("th");
  footerSeasonHead.className = "week-column-header";
  footerSeasonHead.textContent = "SZN";
  footerHeaderRow.append(footerSeasonHead);
  orderedStatKeys.filter((key) => statLabels[key]).forEach((key) => {
    const th = document.createElement("th");
    const group = statGroupByKey.get(key);
    if (group) th.classList.add(`gamelog-header-${group}`);
    th.textContent = statLabels[key];
    footerHeaderRow.append(th);
  });
  tfoot.append(footerHeaderRow);

  const totalsRow = document.createElement("tr");
  const totalsLabel = document.createElement("th");
  totalsLabel.className = "week-column-header";
  const gp = typeof seasonTotals?.games_played === "number" ? Math.round(seasonTotals.games_played) : gameLogsWithData.length;
  totalsLabel.innerHTML = `<span class="season-label">2025</span><br><span class="gp-label">(GP: ${gp})</span>`;
  totalsRow.append(totalsLabel);

  const footerStatsForRadar = { __gamesPlayed: gp };
  orderedStatKeys.filter((key) => statLabels[key]).forEach((key) => {
    const td = document.createElement("td");
    if (key === "proj") {
      td.textContent = "-";
      totalsRow.append(td);
      return;
    }
    const displayValue = getDataHubGameLogsSeasonDisplayValue({
      key,
      seasonTotals,
      aggregatedTotals,
      snapPctValues,
      statValueCounts,
      gameLogsWithData,
    });
    const rankValue = getDataHubSeasonRankValue(player.id, key);
    const valueSpan = document.createElement("span");
    valueSpan.className = "stat-value";
    valueSpan.textContent = displayValue;
    td.append(valueSpan);
    if (Number.isFinite(rankValue)) {
      const annotation = createDataHubRankAnnotation(rankValue, {
        wrapInParens: false,
        ordinal: true,
        variant: "gamelogs-footer",
      });
      annotation.classList.add("stat-rank-annotation--footer");
      annotation.style.color = getDataHubConditionalColorByRank(rankValue, player.pos);
      td.append(annotation);
      td.classList.add("has-rank-annotation");
    }
    const numericValue = parseFloat(String(displayValue).replace(/[,%+]/g, ""));
    if (!Number.isNaN(numericValue)) {
      footerStatsForRadar[key] = numericValue;
    }
    totalsRow.append(td);
  });
  tfoot.append(totalsRow);
  gameLogsState.activeFooterStats = footerStatsForRadar;

  if (!gameLogsWithData.length) {
    const noLogs = document.createElement("p");
    noLogs.className = "no-logs";
    noLogs.dataset.gamelogsView = "gl";
    noLogs.textContent = `No game logs found for ${player.name} for the current season.`;
    dataHubGameLogsModalBody.append(noLogs);
    container.classList.add("is-hidden");
  }

  dataHubGameLogsModalBody.append(container);

  const sznContainer = document.createElement("div");
  sznContainer.className = "game-logs-szn-view is-hidden";
  renderDataHubGameLogsSeasonStatsView({
    container: sznContainer,
    player,
    orderedStatKeys,
    statLabels,
    seasonTotals,
    aggregatedTotals,
    snapPctValues,
    statValueCounts,
    gameLogsWithData,
    statGroupByKey,
  });
  dataHubGameLogsModalBody.append(sznContainer);

  prepareDataHubConsistencyPanel(player);
  setDataHubGameLogsPanel("game-logs", { force: true });
  setDataHubGameLogsModalView(gameLogsState.currentView || "gl");
}

const dataHubPlayerRadarBackgroundPlugin = {
  id: "dataHubPlayerRadarBackground",
  beforeDraw(chart, args, options) {
    const scale = chart.scales?.r;
    if (!scale) return;
    const { ctx } = chart;
    const centerX = scale.xCenter;
    const centerY = scale.yCenter;
    const angleStep = (Math.PI * 2) / chart.data.labels.length;
    const startAngle = -Math.PI / 2;
    const maxRadius = scale.drawingArea;
    (options.levels || []).forEach((level) => {
      const radius = maxRadius * (level.ratio ?? 1);
      ctx.beginPath();
      ctx.strokeStyle = level.stroke || "rgba(151, 166, 210, 0.15)";
      ctx.fillStyle = level.fill || "transparent";
      ctx.lineWidth = 1;
      chart.data.labels.forEach((label, index) => {
        const angle = startAngle + angleStep * index;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  },
};

const dataHubPlayerRadarLabelPlugin = {
  id: "dataHubPlayerRadarLabels",
  afterDatasetsDraw(chart, args, options) {
    const dataset = chart.data.datasets[0];
    const scale = chart.scales?.r;
    if (!dataset || !scale) return;
    const { ctx } = chart;
    const angleStep = (Math.PI * 2) / chart.data.labels.length;
    const startAngle = -Math.PI / 2;
    ctx.font = options.font || '11px "Product Sans"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    dataset.data.forEach((value, index) => {
      const angle = startAngle + angleStep * index;
      const point = scale.getPointPositionForValue(index, value);
      let offsetDistance = options.offset || 18;
      if (index === 0 || index === 1) offsetDistance -= 1.5;
      else if (index === 7) offsetDistance += 3.5;
      else if (index === 5) offsetDistance += 4;
      else if (index === 6) offsetDistance += 7;

      const offsetX = Math.cos(angle) * offsetDistance;
      const offsetY = Math.sin(angle) * offsetDistance;
      const rawRank = dataset.rawRanks?.[index];
      const color = getDataHubConditionalColorByRank(rawRank, dataset.position);
      ctx.fillStyle = color;

      if (Number.isFinite(rawRank)) {
        const rankNum = Math.round(rawRank);
        const label = String(rankNum);
        ctx.fillText(label, point.x + offsetX, point.y + offsetY);
        const metrics = ctx.measureText(label);
        const suffixFontSize = parseInt(ctx.font, 10) * 0.7;
        ctx.font = `${suffixFontSize}px "Product Sans"`;
        ctx.fillText(getOrdinalSuffixOnly(rankNum), point.x + offsetX + (metrics.width / 2) + 4, point.y + offsetY);
        ctx.font = options.font || '11px "Product Sans"';
      } else {
        ctx.fillText("NA", point.x + offsetX, point.y + offsetY);
      }
    });
  },
};

const dataHubPlayerRadarAxisLabelsPlugin = {
  id: "dataHubPlayerRadarAxisLabels",
  afterDraw(chart, args, options) {
    const scale = chart.scales?.r;
    const dataset = chart.data.datasets[0];
    const labels = chart.data.labels;
    if (!scale || !dataset || !labels?.length) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const labelFontSize = isMobile ? (options?.labelFontSizeMobile ?? 11) : (options?.labelFontSize ?? 12);
    const valueFontSize = isMobile ? (options?.valueFontSizeMobile ?? 9) : (options?.valueFontSize ?? 10);
    const labelFont = `${labelFontSize}px "Product Sans", "Google Sans", sans-serif`;
    const valueFont = `${valueFontSize}px "Product Sans", "Google Sans", sans-serif`;
    const labelOffset = options?.labelOffset ?? (isMobile ? 14 : 18);
    const topLabelExtraOffset = options?.topLabelExtraOffset ?? (isMobile ? 10 : 12);
    const axisExtraOffsets = options?.axisLabelExtraOffsetsByIndex ?? { 1: 17, 2: 14, 3: 10, 5: 13, 6: 18, 7: 21 };
    const valueSpacing = options?.valueSpacing ?? (isMobile ? 3 : 4);

    const { ctx } = chart;
    const angleStep = (Math.PI * 2) / labels.length;
    const startAngle = -Math.PI / 2;

    ctx.save();
    for (let index = 0; index < labels.length; index += 1) {
      const angle = startAngle + angleStep * index;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const textBaseline = Math.abs(sin) <= 1e-4 ? "middle" : (sin < 0 ? "bottom" : "top");
      let effectiveOffset = labelOffset;
      if (index === 0) effectiveOffset += topLabelExtraOffset;
      if (Number.isFinite(axisExtraOffsets[index])) effectiveOffset += axisExtraOffsets[index];
      const radius = scale.drawingArea + effectiveOffset;
      const x = scale.xCenter + cos * radius;
      const y = scale.yCenter + sin * radius;

      ctx.font = labelFont;
      ctx.textAlign = "center";
      ctx.textBaseline = textBaseline;
      ctx.fillStyle = options?.labelColor || "#EAEBF0";
      ctx.fillText(String(labels[index] ?? ""), x, y);

      const statKey = dataset.statKeys?.[index];
      const statValue = dataset.statValues?.[index];
      const formattedValue = formatDataHubRadarStatValue(statKey, statValue);
      const rawRank = dataset.rawRanks?.[index];
      const valueColor = getDataHubConditionalColorByRank(rawRank, dataset.position) || options?.labelColor || "#EAEBF0";

      let valueY = y;
      if (textBaseline === "top") valueY = y + labelFontSize + valueSpacing;
      else if (textBaseline === "middle") valueY = y + (labelFontSize / 2) + valueSpacing;
      else valueY = y + valueSpacing;

      ctx.font = valueFont;
      ctx.textBaseline = "top";
      ctx.fillStyle = valueColor;
      ctx.fillText(`• ${formattedValue} •`, x, valueY);
    }
    ctx.restore();
  },
};

function getDataHubPlayerRadarData(playerId, position) {
  const config = DATAHUB_RADAR_STATS_CONFIG[position];
  if (!config) return null;
  const radarData = {
    labels: config.labels,
    ranks: [],
    rawRanks: [],
    statValues: [],
    statKeys: config.stats,
    maxRank: config.maxRank,
  };
  const footerStats = gameLogsState.activeFooterStats || {};
  const seasonTotals = gameLogsState.playerSeasonStats?.[playerId] || null;
  const playerRanks = gameLogsState.activeRanks || null;
  const summarySnapshot = gameLogsState.activeSummary || null;

  config.stats.forEach((statKey) => {
    const rankValue = getDataHubSeasonRankValue(playerId, statKey);
    radarData.rawRanks.push(rankValue);
    let statValue;
    if (statKey === "ppg") {
      statValue = playerRanks?.ppg;
    } else {
      statValue = footerStats[statKey];
      if (statValue === undefined) {
        if (statKey === "fpts") statValue = summarySnapshot?.fpts;
        else if (statKey === "ypc") {
          statValue = seasonTotals?.rush_att > 0 ? (seasonTotals.rush_yd || 0) / seasonTotals.rush_att : null;
        } else if (statKey === "yco_per_att") {
          statValue = seasonTotals?.rush_att > 0 ? (seasonTotals.rush_yac || 0) / seasonTotals.rush_att : null;
        } else if (statKey === "mtf_per_att") {
          statValue = seasonTotals?.rush_att > 0 ? (seasonTotals.mtf || 0) / seasonTotals.rush_att : null;
        } else if (statKey === "pass_imp_per_att") {
          statValue = seasonTotals?.pass_att > 0 ? ((seasonTotals.pass_imp || 0) / seasonTotals.pass_att) * 100 : null;
        } else if (seasonTotals && typeof seasonTotals[statKey] === "number") {
          statValue = seasonTotals[statKey];
        } else {
          statValue = null;
        }
      }
    }

    if (typeof statValue === "string") {
      const trimmed = statValue.trim();
      if (!trimmed) statValue = null;
    }
    radarData.statValues.push(statValue);

    if (!Number.isFinite(rankValue)) {
      radarData.ranks.push(10);
    } else if (rankValue <= 1) {
      radarData.ranks.push(85);
    } else if (rankValue >= config.maxRank) {
      radarData.ranks.push(10);
    } else if (rankValue <= 7) {
      radarData.ranks.push(85 - ((rankValue - 1) / 6) * 12);
    } else {
      radarData.ranks.push(73 - ((rankValue - 7) / (config.maxRank - 7)) * 63);
    }
  });

  return radarData;
}

function renderDataHubPlayerRadarChart(playerId, position) {
  if (!dataHubRadarChartContent || typeof Chart === "undefined") {
    return;
  }

  destroyDataHubRadarChart();
  const radarData = getDataHubPlayerRadarData(playerId, position);
  if (!radarData) {
    dataHubRadarChartContent.innerHTML = '<p class="no-data-message">No radar data available for this position.</p>';
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.id = "datahub-player-radar-canvas";
  dataHubRadarChartContent.append(canvas);
  const ctx = canvas.getContext("2d");
  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  const chart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: radarData.labels,
      datasets: [{
        label: "Player Rank",
        data: radarData.ranks,
        rawRanks: radarData.rawRanks,
        statValues: radarData.statValues,
        statKeys: radarData.statKeys,
        position,
        fill: true,
        backgroundColor: "rgba(83, 0, 255, 0.33)",
        borderColor: "#6700ff",
        borderWidth: 2,
        pointBackgroundColor: "#6300ff",
        pointBorderColor: "#0D0E1B",
        pointRadius: 4.5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      events: [],
      layout: {
        padding: {
          top: isMobile ? 34 : 50,
          bottom: isMobile ? 44 : 52,
          left: isMobile ? 45 : 18,
          right: isMobile ? 45 : 18,
        },
      },
      elements: {
        line: { tension: 0.4 },
      },
      scales: {
        r: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100,
          max: 100,
          grid: { display: false },
          angleLines: { display: false },
          ticks: { display: false },
          pointLabels: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        dataHubPlayerRadarBackground: {
          levels: [
            { ratio: 0.95, fill: "#2c334f62", stroke: "#525a7739" },
            { ratio: 0.75, fill: "#2D345153", stroke: "#525a7729" },
            { ratio: 0.55, fill: "#2F365250", stroke: "#525a7729" },
            { ratio: 0.35, fill: "#30375455", stroke: "#525a7729" },
            { ratio: 0.18, fill: "#31385565", stroke: "#525a7735" },
          ],
        },
        dataHubPlayerRadarLabels: {
          font: '14px "Product Sans", "Google Sans", sans-serif',
          offset: isMobile ? 13 : 16,
        },
        dataHubPlayerRadarAxisLabels: {
          labelFontSize: 14,
          labelFontSizeMobile: 13,
          valueFontSize: 12,
          valueFontSizeMobile: 11,
          labelOffset: isMobile ? 10 : 14,
          topLabelExtraOffset: isMobile ? 10 : 12,
          axisLabelExtraOffsetsByIndex: { 1: 17, 2: 14, 3: 10, 5: 13, 6: 18, 7: 21 },
          valueSpacing: isMobile ? 3 : 4,
          labelColor: "#EAEBF0",
        },
      },
    },
    plugins: [dataHubPlayerRadarBackgroundPlugin, dataHubPlayerRadarLabelPlugin, dataHubPlayerRadarAxisLabelsPlugin],
  });

  const scale = chart.scales?.r;
  if (scale) {
    const gradient = ctx.createRadialGradient(scale.xCenter, scale.yCenter, 0, scale.xCenter, scale.yCenter, scale.drawingArea);
    gradient.addColorStop(0, "rgba(121, 0, 245, 0.13)");
    gradient.addColorStop(0.4, "rgba(92, 0, 255, 0.20)");
    gradient.addColorStop(0.78, "rgba(75, 0, 255, 0.34)");
    gradient.addColorStop(1, "rgba(34, 0, 255, 0.91)");
    chart.data.datasets[0].backgroundColor = gradient;
    chart.update("none");
  }

  gameLogsState.radarChartInstance = chart;
}

function getDataHubConsistencyThresholds(position) {
  return DATAHUB_CONSISTENCY_THRESHOLD_MAP[String(position || "").toUpperCase()] || DATAHUB_CONSISTENCY_THRESHOLD_MAP.DEFAULT;
}

function clampDataHubConsistencyPoints(value) {
  if (!Number.isFinite(value)) return null;
  return Math.max(0, Math.min(DATAHUB_MAX_CONSISTENCY_POINTS, value));
}

function getDataHubConsistencyBucket(points, thresholds) {
  if (!Number.isFinite(points)) return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.low, name: "low" };
  if (points >= thresholds.high) return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.high, name: "high" };
  if (points >= thresholds.solid) return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.solid, name: "solid" };
  return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.low, name: "low" };
}

function buildDataHubConsistencyPanelData(player) {
  if (!player?.id) return null;
  const axisWeeks = Array.from({ length: DATAHUB_MAX_DISPLAY_WEEKS }, (_, index) => index + 1);
  const thresholds = getDataHubConsistencyThresholds(player.pos);
  const series = [];
  const skippedLabels = {};

  axisWeeks.forEach((week) => {
    const stats = gameLogsState.playerWeeklyStats?.[week]?.[player.id];
    if (!stats) return;
    const opponent = String(stats.opponent || "").toUpperCase();
    if (opponent === "BYE") {
      skippedLabels[week] = "BYE";
      return;
    }
    const rawProjection = String(stats.proj || "").trim().toUpperCase();
    if (!Number.isFinite(stats.fpt_ppr) && DATAHUB_CONSISTENCY_PROJECTION_SKIP_CODES.has(rawProjection)) {
      skippedLabels[week] = rawProjection;
      return;
    }
    const numeric = Number(stats.fpt_ppr);
    if (!Number.isFinite(numeric)) return;
    const clamped = clampDataHubConsistencyPoints(numeric);
    if (clamped === null) return;
    series.push({
      week,
      pts: clamped,
      originalPts: numeric,
      opponent: stats.opponent || "",
    });
  });

  series.sort((left, right) => left.week - right.week);

  const seasonTotals = gameLogsState.playerSeasonStats?.[player.id] || {};
  const consistencyPct = Number(seasonTotals.csty_pct);
  const ceilingValue = Number(seasonTotals.ceiling);
  const consistencyRank = getDataHubSeasonRankValue(player.id, "csty_pct");
  const ceilingRank = getDataHubSeasonRankValue(player.id, "ceiling");
  const bestGame = series.reduce((best, entry) => (!best || entry.pts > best.pts ? entry : best), null);
  const lastFive = series.slice(-5);
  const lastFiveAvg = lastFive.length ? lastFive.reduce((sum, entry) => sum + entry.originalPts, 0) / lastFive.length : null;
  const solidHighCount = series.filter((entry) => entry.pts >= thresholds.solid).length;
  const highWeekCount = series.filter((entry) => entry.pts >= thresholds.high).length;
  const gamesPlayed = typeof seasonTotals.games_played === "number" ? seasonTotals.games_played : series.length;

  return {
    playerId: player.id,
    playerName: player.name,
    position: player.pos,
    axisWeeks,
    series,
    chartedWeeksCount: series.length,
    gamesPlayed,
    thresholds,
    consistencyPct: Number.isFinite(consistencyPct) ? consistencyPct : null,
    ceilingValue: Number.isFinite(ceilingValue) ? ceilingValue : null,
    consistencyRank: Number.isFinite(consistencyRank) ? consistencyRank : null,
    ceilingRank: Number.isFinite(ceilingRank) ? ceilingRank : null,
    weekRangeLabel: "Weeks 1-18",
    weeksChartedLabel: series.length === 1 ? "1 week charted" : `${series.length} weeks charted`,
    ceilingRankMax: DATAHUB_RADAR_STATS_CONFIG[player.pos]?.maxRank || 32,
    bestGame,
    lastFiveAvg,
    highWeekCount,
    solidHighCount,
    totalWeeks: series.length,
    skippedLabels,
  };
}

function prepareDataHubConsistencyPanel(player) {
  gameLogsState.currentConsistencyData = buildDataHubConsistencyPanelData(player);
  updateDataHubConsistencyHud(gameLogsState.currentConsistencyData);
}

function updateDataHubConsistencyHud(data) {
  if (!dataHubConsistencyContainer) return;
  const setText = (selector, value) => {
    const node = dataHubConsistencyContainer.querySelector(selector);
    if (node) node.textContent = value;
  };
  setText("[data-week-range]", data?.weekRangeLabel || "Weeks -");
  setText("[data-weeks-charted]", data?.weeksChartedLabel || "No weeks charted");
  setText("[data-consistency-rank]", Number.isFinite(data?.consistencyRank) ? `#${data.consistencyRank}` : "NA");
  setText("[data-ceiling-value]", Number.isFinite(data?.ceilingValue) ? data.ceilingValue.toFixed(1) : "N/A");
  setText("[data-consistency-circle-value]", Number.isFinite(data?.consistencyPct) ? `${data.consistencyPct.toFixed(1)}%` : "N/A");
  setText("[data-consistency-circle-caption]", "CSTY RATE");
  setText("[data-ceiling-circle-caption]", "CL POS RANK");

  const ceilingCircle = dataHubConsistencyContainer.querySelector("[data-ceiling-circle-rank]");
  if (ceilingCircle) {
    if (Number.isFinite(data?.ceilingRank)) {
      const rankInt = Math.round(data.ceilingRank);
      ceilingCircle.innerHTML = `${rankInt}<span class="ceiling-rank-suffix">${getOrdinalSuffixOnly(rankInt)}</span>`;
    } else {
      ceilingCircle.textContent = "NA";
    }
  }

  const highPctNode = dataHubConsistencyContainer.querySelector("[data-insight-best]");
  if (highPctNode) {
    if (Number.isFinite(data?.highWeekCount) && Number.isFinite(data?.gamesPlayed) && data.gamesPlayed > 0) {
      const pct = (data.highWeekCount / data.gamesPlayed) * 100;
      const color = pct > 40 ? DATAHUB_CONSISTENCY_HUD_COLORS.high : (pct < 23 ? DATAHUB_CONSISTENCY_HUD_COLORS.low : DATAHUB_CONSISTENCY_HUD_COLORS.solid);
      highPctNode.innerHTML = `<span style="color:${color}">${pct.toFixed(1)}</span><span class="hud-insight-suffix">%</span>`;
    } else {
      highPctNode.textContent = "—";
    }
  }

  const lastFiveNode = dataHubConsistencyContainer.querySelector("[data-insight-last5]");
  if (lastFiveNode) {
    if (Number.isFinite(data?.lastFiveAvg)) {
      const bucket = getDataHubConsistencyBucket(data.lastFiveAvg, data.thresholds);
      const color = bucket.name === "high"
        ? DATAHUB_CONSISTENCY_HUD_COLORS.high
        : (bucket.name === "solid" ? DATAHUB_CONSISTENCY_HUD_COLORS.solid : DATAHUB_CONSISTENCY_HUD_COLORS.low);
      lastFiveNode.innerHTML = `<span style="color:${color}">${data.lastFiveAvg.toFixed(1)}</span><span class="hud-insight-suffix"> fpts</span>`;
    } else {
      lastFiveNode.textContent = "—";
    }
  }

  const cstyCountNode = dataHubConsistencyContainer.querySelector("[data-insight-cstycount]");
  if (cstyCountNode) {
    if (Number.isFinite(data?.solidHighCount) && Number.isFinite(data?.totalWeeks) && data.totalWeeks > 0) {
      const color = getDataHubConditionalColorByRank(data?.consistencyRank, data?.position);
      cstyCountNode.innerHTML = `<span class="csty-made" style="color:${color}">${data.solidHighCount}</span><span class="hud-insight-suffix">/${data.totalWeeks}</span>`;
    } else {
      cstyCountNode.textContent = "—";
    }
  }

  const lowCount = data?.series?.filter((entry) => entry.pts < data.thresholds.solid).length ?? 0;
  const solidCount = data?.series?.filter((entry) => entry.pts >= data.thresholds.solid && entry.pts < data.thresholds.high).length ?? 0;
  const highCount = data?.series?.filter((entry) => entry.pts >= data.thresholds.high).length ?? 0;
  setText("[data-zone-low]", String(lowCount));
  setText("[data-zone-solid]", String(solidCount));
  setText("[data-zone-high]", String(highCount));
  setText("[data-threshold-low]", data ? `(<${Math.round(data.thresholds.solid)}):` : "");
  setText("[data-threshold-solid]", data ? `(${Math.round(data.thresholds.solid)}-${Math.round(data.thresholds.high)}):` : "");
  setText("[data-threshold-high]", data ? `(>=${Math.round(data.thresholds.high)}):` : "");

  hydrateDataHubProgressCircles(data);
}

function hydrateDataHubProgressCircles(data) {
  const consistencyCircle = dataHubConsistencyContainer?.querySelector(".progress-circle--consistency .progress-ring-fill");
  if (consistencyCircle) {
    const progress = data && Number.isFinite(data.consistencyPct) ? Math.max(0, Math.min(100, data.consistencyPct)) / 100 : 0;
    consistencyCircle.style.setProperty("--progress", progress.toFixed(3));
  }
  const ceilingCircle = dataHubConsistencyContainer?.querySelector(".progress-circle--ceiling .progress-ring-fill--ceiling");
  if (ceilingCircle) {
    const rankMax = Math.max(2, data?.ceilingRankMax || 24);
    const rank = Number.isFinite(data?.ceilingRank) ? data.ceilingRank : rankMax;
    const normalized = Math.max(0, Math.min(1, (rankMax - rank) / (rankMax - 1)));
    ceilingCircle.style.setProperty("--progress", normalized.toFixed(3));
  }
}

function renderDataHubConsistencyChart() {
  if (!dataHubConsistencyContainer) return;
  const pointsLayer = dataHubConsistencyContainer.querySelector("#weekly-chart-points");
  const xAxis = dataHubConsistencyContainer.querySelector("#weekly-chart-x-axis");
  const chartBox = dataHubConsistencyContainer.querySelector("#weekly-chart-box");
  if (!pointsLayer || !xAxis || !chartBox) return;

  const data = gameLogsState.currentConsistencyData;
  updateDataHubConsistencyHud(data);
  pointsLayer.innerHTML = "";
  xAxis.innerHTML = "";
  chartBox.querySelector(".consistency-empty-state")?.remove();

  const axisWeeks = data?.axisWeeks || Array.from({ length: DATAHUB_MAX_DISPLAY_WEEKS }, (_, index) => index + 1);
  axisWeeks.forEach((week, index) => {
    const span = document.createElement("span");
    span.textContent = `WK${week}`;
    span.style.left = `${axisWeeks.length === 1 ? 50 : (index / (axisWeeks.length - 1)) * 100}%`;
    xAxis.append(span);
  });

  if (!data?.series?.length) {
    const empty = document.createElement("div");
    empty.className = "consistency-empty-state";
    empty.textContent = "No sheet-based fantasy points recorded yet.";
    chartBox.append(empty);
    return;
  }

  const curvePoints = [];
  data.series.forEach((entry) => {
    const x = axisWeeks.length === 1 ? 50 : ((entry.week - 1) / (axisWeeks.length - 1)) * 100;
    const y = 100 - ((Math.max(0, Math.min(DATAHUB_MAX_CONSISTENCY_POINTS, entry.pts)) / DATAHUB_MAX_CONSISTENCY_POINTS) * 100);
    curvePoints.push({ x, y });
    const bucket = getDataHubConsistencyBucket(entry.pts, data.thresholds);
    const point = document.createElement("div");
    point.className = "weekly-point";
    point.dataset.zone = bucket.name;
    point.style.left = `${x}%`;
    point.style.top = `${y}%`;
    point.style.setProperty("--point-color", bucket.color);
    point.innerHTML = `
      <div class="weekly-point-label weekly-point-label--${bucket.name}">
        <span class="weekly-point-label__suffix">wk${entry.week}</span>
        <span class="weekly-point-label__value"><span style="color:${bucket.color}">${entry.originalPts.toFixed(1)}</span></span>
      </div>
    `;
    pointsLayer.append(point);
  });

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("weekly-curve-layer");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const d = curvePoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#9ad7ff");
  path.setAttribute("stroke-width", "1.8");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  pointsLayer.prepend(svg);

  Object.entries(data.skippedLabels || {}).forEach(([week, label]) => {
    const skip = document.createElement("div");
    skip.className = "weekly-skip-label";
    skip.textContent = label;
    const x = axisWeeks.length === 1 ? 50 : ((Number(week) - 1) / (axisWeeks.length - 1)) * 100;
    skip.style.left = `${x}%`;
    skip.style.top = "82%";
    pointsLayer.append(skip);
  });
}
