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
const API_BASE = "https://api.sleeper.app/v1";
const KTC_SHEET_BY_FORMAT = Object.freeze({
  "1-QB": "KTC_1QB",
  SFLX: "KTC_SFLX",
});
const ADP_SHEET_NAME = "ADP_2026";

// DataHub game logs modal: these constants mirror the Stats page sheet-driven
// subsystem locally so DataHub can render GL/SZN, radar, consistency, and the
// shared key without any shared app.js dependency.
const PLAYER_STATS_SHEETS = Object.freeze({
  season: "SZN",
  seasonRanks: "SZN_RKs",
  weeks: Object.freeze({
    1: "WK1",
    2: "WK2",
    3: "WK3",
    4: "WK4",
    5: "WK5",
    6: "WK6",
    7: "WK7",
    8: "WK8",
    9: "WK9",
    10: "WK10",
    11: "WK11",
    12: "WK12",
    13: "WK13",
    14: "WK14",
    15: "WK15",
    16: "WK16",
    17: "WK17",
    18: "WK18",
  }),
});

const PLAYER_STATS_CSV_PATHS = Object.freeze({
  season: "../data/NFL-2025_Stats/SZN.csv",
  seasonRanks: "../data/NFL-2025_Stats/SZN_RKs.csv",
  weeksDir: "../data/NFL-2025_Stats/Weeks",
});

const MAX_DISPLAY_WEEKS = 18;
const TEAM_LOGO_KEY_MAP = Object.freeze({
  WSH: "was",
  WAS: "was",
  JAC: "jax",
  LA: "lar",
});

const SHARED_STATS_KEY_SECTIONS = [
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

// DataHub modal runtime stays fully page-local. The table continues to own its
// own state, while the modal owns its own loaders, active player context, and
// rank caches derived from the full active-format dataset.
const dataHubGameLogsState = {
  statsSheetsLoaded: false,
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
  currentPlayer: null,
  currentPlayerRanks: null,
  currentSummary: null,
  currentFooterStats: null,
  currentView: "gl",
  currentConsistencyData: null,
  rowContextByPlayerId: Object.create(null),
  rankCacheByPlayerId: Object.create(null),
  requestSeq: 0,
  playerMetaById: null,
  playerMetaLoadPromise: null,
  textCache: new Map(),
  statsLoadPromise: null,
};

// DataHub modal DOM refs are scoped to the local modal root only. This avoids
// the global modal selector problems called out in the audit and keeps the
// subsystem from binding unrelated UI.
const gameLogsModalRoot = document.querySelector("#datahub-game-logs-modal");
const gameLogsModalOverlay = gameLogsModalRoot?.querySelector("[data-modal-overlay]");
const gameLogsModalContent = gameLogsModalRoot?.querySelector(".modal-content");
const gameLogsModalCloseButton = gameLogsModalRoot?.querySelector(".modal-close-btn");
const gameLogsModalPlayerName = gameLogsModalRoot?.querySelector("#modal-player-name");
const gameLogsModalPlayerVitals = gameLogsModalRoot?.querySelector("#modal-player-vitals");
const gameLogsModalSummaryChips = gameLogsModalRoot?.querySelector("#modal-summary-chips");
const gameLogsModalBody = gameLogsModalRoot?.querySelector("#modal-body");
const gameLogsViewButtons = Array.from(
  gameLogsModalRoot?.querySelectorAll(".gamelogs-view-option") || [],
);
const gameLogsFooterButtons = Array.from(
  gameLogsModalRoot?.querySelectorAll(".modal-info-btn") || [],
);
const gameLogsStatsKeyContainer = gameLogsModalRoot?.querySelector("#stats-key-container");
const gameLogsRadarChartContainer = gameLogsModalRoot?.querySelector("#radar-chart-container");
const gameLogsConsistencyContainer = gameLogsModalRoot?.querySelector("#consistency-container");
const gameLogsSharedStatsKeyBody = gameLogsModalRoot?.querySelector('[data-stats-key-body="gamelogs"]');

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
  initializeDataHubGameLogsModal();
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
  attachDataHubGameLogsListeners();

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
      posRank: getNormalizedSheetValue(normalizedRow, ["POS·RK", "POS RK", "POS_RK"]) || null,
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
    dataHubGameLogsState.rowContextByPlayerId = Object.create(null);
    dataHubGameLogsState.rankCacheByPlayerId = Object.create(null);
    refreshGrid();
    return;
  }

  const ktcLookup = getActiveKtcLookup();
  const adpLookup = state.adpByPlayerId || Object.create(null);
  const rowContextByPlayerId = Object.create(null);
  const rankablePlayers = [];

  state.rows = state.rawSeasonRows.map((row) => {
    const enrichedRow = enrichSeasonRow(row, ktcLookup, adpLookup);
    const normalizedRow = normalizeRow(enrichedRow);
    const playerContext = buildDataHubGameLogEntry(enrichedRow);
    if (playerContext?.id) {
      rowContextByPlayerId[playerContext.id] = playerContext;
      if (playerContext.pos !== "RDP" && Number.isFinite(playerContext.fpts) && playerContext.fpts > 0) {
        rankablePlayers.push(playerContext);
      }
    }
    return normalizedRow;
  });
  dataHubGameLogsState.rowContextByPlayerId = rowContextByPlayerId;
  dataHubGameLogsState.rankCacheByPlayerId = buildDataHubGameLogsRankCache(rankablePlayers);

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
  enrichedRow.__ktcPosRank = ktcEntry?.posRank || null;
  enrichedRow.__ktcOverallRank = ktcEntry?.overallRank ?? null;

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

  if (column.name === PLAYER_COLUMN && row.__playerId && row.POS !== "RDP") {
    // DataHub PLAYER cells open the local game logs modal. Delegation keeps the
    // trigger stable across full table rerenders without stacking listeners.
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "datahub-player-trigger";
    trigger.dataset.playerId = row.__playerId;
    trigger.title = `Open ${formatDisplayValue(column.name, value)} game logs`;
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

  normalized.__playerId = String(sourceRow.SLPR_ID || sourceRow.slpr_id || "").trim();

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
// DataHub-local Stats page game logs subsystem.
// This block owns the modal's shared-key markup, CSV parsing, runtime state,
// open/close behavior, renderers, and panel switching without shared app.js.
// ---------------------------------------------------------------------------

const PLAYER_STAT_HEADER_MAP = {
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

const WEEKLY_META_HEADER_MAP = {
  VS: "opponent",
  vsRK: "opponent_rank",
};

const SEASON_META_HEADERS = {
  POS: "pos",
  TM: "team",
  GM_P: "games_played",
};

const SEASON_VALUE_HEADERS = {
  FPT_PPR: "fpts_ppr",
  FPTS_PPR: "fpts_ppr",
  PRK_PPR: "pos_rank_ppr",
};

const STAT_KEY_RANK_OVERRIDES = { fpts: "fpts_ppr" };

const NO_FALLBACK_KEYS = new Set([
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

const SZN_PROGRESS_THRESHOLDS = {
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

const INJURY_DESIGNATION_COLORS = {
  IR: "#d93d76",
  SUS: "#d93d76",
  BYE: "#C3A8FB",
  Q: "#fd9a3dff",
  D: "#e780c3ff",
  PUP: "#D47DC6",
  DNP: "rgba(255, 174, 227, 0.47)",
  OUT: "#D47DC6",
};

const RADAR_STATS_CONFIG = {
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

const SZN_STAT_SECTIONS_BY_POS = {
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

const MAX_CONSISTENCY_POINTS = 40;
const CONSISTENCY_THRESHOLD_MAP = {
  QB: { solid: 16, high: 22 },
  RB: { solid: 12, high: 18 },
  WR: { solid: 12, high: 18 },
  TE: { solid: 11, high: 17 },
  DEFAULT: { solid: 14, high: 20 },
};
const CONSISTENCY_BUCKET_STYLES = {
  high: { color: "#00ffc1" },
  solid: { color: "#00c5ff" },
  low: { color: "#c26cfc" },
};
const CONSISTENCY_HUD_CONDITIONAL_COLORS = {
  high: "#5dfdca",
  solid: "#47befd",
  low: "#d3a5ff",
};
const SVG_NS = "http://www.w3.org/2000/svg";
const CONSISTENCY_LINE_FILTER_ID = "consistency-line-glow";
const CONSISTENCY_AREA_FILTER_ID = "consistency-area-glow";
const CONSISTENCY_AREA_GRADIENT_ID = "consistency-area-gradient";
const CONSISTENCY_GRADIENT_COLORS = {
  low: "#c26cfc10",
  solid: "#005cff10",
  high: "#00ffc110",
};
const CONSISTENCY_EDGE_PADDING_PCT = 2.8;
const CONSISTENCY_PROJECTION_SKIP_CODES = new Set(["IR", "OUT", "PUP", "BYE", "Q", "D"]);
const CONSISTENCY_VERTICAL_PADDING_PCT = 8;

let curveSvg = null;

function initializeDataHubGameLogsModal() {
  // Shared stats key markup is injected once at boot because the DataHub modal
  // ships the container in local HTML instead of relying on app.js boot order.
  if (gameLogsSharedStatsKeyBody) {
    renderSharedStatsKeyMarkup(gameLogsSharedStatsKeyBody);
  }
}

function getSortedSharedStatsKeySections() {
  return SHARED_STATS_KEY_SECTIONS.map((section) => ({
    ...section,
    items: [...section.items].sort((left, right) => left.abbr.localeCompare(right.abbr, undefined, {
      numeric: true,
      sensitivity: "base",
    })),
  }));
}

function buildSharedStatsKeyMarkup() {
  const sections = getSortedSharedStatsKeySections();
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

function renderSharedStatsKeyMarkup(container) {
  if (!container) return;
  container.innerHTML = buildSharedStatsKeyMarkup();
}

function attachDataHubGameLogsListeners() {
  if (!gameLogsModalRoot || gameLogsModalRoot.dataset.gamelogsWired === "true") {
    return;
  }
  gameLogsModalRoot.dataset.gamelogsWired = "true";

  // DataHub table trigger path: delegate from the grid shell so rerenders do
  // not add duplicate listeners and the modal stays tied to the current row set.
  gridContainer.addEventListener("click", handleDataHubPlayerTriggerClick);
  gameLogsModalCloseButton?.addEventListener("click", closeModal);
  gameLogsModalOverlay?.addEventListener("click", closeModal);

  gameLogsModalRoot.querySelector(".gamelogs-view-switcher")?.addEventListener("click", (event) => {
    const button = event.target.closest(".gamelogs-view-option");
    if (!button) return;
    setGameLogsModalView(button.dataset.gamelogsView);
  });

  gameLogsModalRoot.querySelector(".modal-footer")?.addEventListener("click", (event) => {
    const button = event.target.closest(".modal-info-btn");
    if (!button) return;
    toggleGameLogsFooterPanel(button.dataset.panel);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !gameLogsModalRoot.classList.contains("hidden")) {
      closeModal();
    }
  });

  // SZN forwarding keeps vertical scrolling usable even if the gesture starts
  // on the modal chrome instead of inside the SZN scroller itself.
  if (gameLogsModalContent && gameLogsModalBody) {
    gameLogsModalContent.addEventListener("wheel", (event) => {
      if (dataHubGameLogsState.currentView !== "szn") return;
      if (!gameLogsStatsKeyContainer?.classList.contains("hidden")
        || !gameLogsRadarChartContainer?.classList.contains("hidden")
        || !gameLogsConsistencyContainer?.classList.contains("hidden")) {
        return;
      }
      const sznScroll = gameLogsModalBody.querySelector(".game-logs-szn-view:not(.hidden)");
      if (!sznScroll || sznScroll.contains(event.target)) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (sznScroll.scrollHeight <= sznScroll.clientHeight) return;
      sznScroll.scrollTop += event.deltaY;
      event.preventDefault();
    }, { passive: false });
  }
}

function handleDataHubPlayerTriggerClick(event) {
  const trigger = event.target.closest(".datahub-player-trigger");
  if (!trigger || !gridContainer.contains(trigger)) return;
  const playerId = String(trigger.dataset.playerId || "").trim();
  if (!playerId) return;
  openDataHubGameLogs(playerId);
}

function openDataHubGameLogs(playerId) {
  const player = dataHubGameLogsState.rowContextByPlayerId[playerId];
  if (!player || player.pos === "RDP") return;
  handlePlayerNameClick(player);
}

function buildDataHubGameLogEntry(sourceRow) {
  const playerId = String(sourceRow.SLPR_ID || sourceRow.slpr_id || "").trim();
  if (!playerId) return null;

  const name = String(sourceRow.NM || sourceRow["PLAYER NAME"] || "").trim();
  const pos = String(sourceRow.POS || "").trim().toUpperCase();
  const team = String(sourceRow.TM || "FA").trim().toUpperCase();
  const fpts = toComparableNumber(sourceRow.FPT_PPR ?? sourceRow.FPTS);
  const gamesPlayed = toComparableNumber(sourceRow.GM_P ?? sourceRow.GM);
  const ppg = toComparableNumber(sourceRow.PPG ?? computePpgValue(fpts, gamesPlayed));
  const ktc = toComparableNumber(sourceRow.VALUE);
  const ktcOverallRank = toComparableNumber(sourceRow.__ktcOverallRank ?? sourceRow.RK);
  const ktcPosRankValue = extractRankNumber(sourceRow.__ktcPosRank);

  return {
    id: playerId,
    name,
    pos,
    team,
    age: sourceRow.AGE,
    ktc,
    ktcPosRank: ktcPosRankValue,
    ktcPosRankText: buildKtcPosRankText(pos, sourceRow.__ktcPosRank),
    ktcOverallRank,
    fpts,
    ppg,
    gamesPlayed,
  };
}

function buildDataHubGameLogsRankCache(dataset) {
  const cache = Object.create(null);
  const rankablePlayers = (dataset || []).filter((entry) => entry && entry.pos !== "RDP"
    && Number.isFinite(entry.fpts) && entry.fpts > 0);

  const byFpts = [...rankablePlayers].sort((left, right) => (right.fpts || 0) - (left.fpts || 0));
  byFpts.forEach((entry, index) => {
    if (!cache[entry.id]) cache[entry.id] = {};
    cache[entry.id].overallRank = index + 1;
  });

  const byPpg = [...rankablePlayers].sort((left, right) => (right.ppg || 0) - (left.ppg || 0));
  byPpg.forEach((entry, index) => {
    if (!cache[entry.id]) cache[entry.id] = {};
    cache[entry.id].ppgOverallRank = index + 1;
  });

  const positionGroups = new Map();
  rankablePlayers.forEach((entry) => {
    if (!positionGroups.has(entry.pos)) {
      positionGroups.set(entry.pos, []);
    }
    positionGroups.get(entry.pos).push(entry);
  });

  positionGroups.forEach((players) => {
    [...players].sort((left, right) => (right.fpts || 0) - (left.fpts || 0)).forEach((entry, index) => {
      if (!cache[entry.id]) cache[entry.id] = {};
      cache[entry.id].posRank = index + 1;
    });
    [...players].sort((left, right) => (right.ppg || 0) - (left.ppg || 0)).forEach((entry, index) => {
      if (!cache[entry.id]) cache[entry.id] = {};
      cache[entry.id].ppgPosRank = index + 1;
    });
  });

  return cache;
}

function getDefaultPlayerRanks() {
  return {
    total_pts: "0.0",
    overallRank: null,
    posRank: null,
    ppg: "0.0",
    ppgOverallRank: null,
    ppgPosRank: null,
    gamesPlayed: 0,
  };
}

function getStatsPagePlayerRanks(playerId) {
  const player = dataHubGameLogsState.rowContextByPlayerId[playerId];
  const ranks = dataHubGameLogsState.rankCacheByPlayerId[playerId];
  if (!player) return getDefaultPlayerRanks();
  return {
    total_pts: Number.isFinite(player.fpts) ? player.fpts.toFixed(1) : "0.0",
    overallRank: ranks?.overallRank ?? null,
    posRank: ranks?.posRank ?? null,
    ppg: Number.isFinite(player.ppg) ? player.ppg.toFixed(1) : "0.0",
    ppgOverallRank: ranks?.ppgOverallRank ?? null,
    ppgPosRank: ranks?.ppgPosRank ?? null,
    gamesPlayed: Number.isFinite(player.gamesPlayed) ? player.gamesPlayed : 0,
  };
}

function buildKtcPosRankText(position, rawRankValue) {
  const rankNumber = extractRankNumber(rawRankValue);
  if (!Number.isFinite(rankNumber) || rankNumber <= 0) {
    return null;
  }
  return `${position}·${rankNumber}`;
}

function extractRankNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const match = String(value || "").match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

function resolvePlayerStatsCsvUrl(relativePath) {
  return new URL(relativePath, import.meta.url).toString();
}

async function fetchTextWithCache(url) {
  const key = String(url);
  if (dataHubGameLogsState.textCache.has(key)) {
    return dataHubGameLogsState.textCache.get(key);
  }
  const request = fetch(key, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key}: ${response.status}`);
      }
      return response.text();
    })
    .catch((error) => {
      dataHubGameLogsState.textCache.delete(key);
      throw error;
    });
  dataHubGameLogsState.textCache.set(key, request);
  return request;
}

async function loadPlayerStatsFromCsvFiles() {
  const seasonPromise = fetchTextWithCache(resolvePlayerStatsCsvUrl(PLAYER_STATS_CSV_PATHS.season));
  const seasonRanksPromise = fetchTextWithCache(resolvePlayerStatsCsvUrl(PLAYER_STATS_CSV_PATHS.seasonRanks));
  const weeklyPromises = Object.entries(PLAYER_STATS_SHEETS.weeks).map(async ([week, sheetName]) => {
    const csvPath = `${PLAYER_STATS_CSV_PATHS.weeksDir}/${sheetName}.csv`;
    const csv = await fetchTextWithCache(resolvePlayerStatsCsvUrl(csvPath));
    return { week: Number(week), csv, hasFullStats: true };
  });
  const [seasonCsv, seasonRanksCsv, ...allWeeklyCsvs] = await Promise.all([
    seasonPromise,
    seasonRanksPromise,
    ...weeklyPromises,
  ]);
  return { seasonCsv, seasonRanksCsv, allWeeklyCsvs };
}

async function fetchPlayerStatsSheets() {
  if (dataHubGameLogsState.statsSheetsLoaded) {
    await ensureSleeperLiveStats();
    return;
  }
  if (dataHubGameLogsState.statsLoadPromise) {
    await dataHubGameLogsState.statsLoadPromise;
    return;
  }

  // DataHub modal data preload: keep CSV parsing and live-week overlay local so
  // the modal can open independently of the rest of the app shell.
  dataHubGameLogsState.statsLoadPromise = (async () => {
    try {
      const { seasonCsv, seasonRanksCsv, allWeeklyCsvs } = await loadPlayerStatsFromCsvFiles();
      dataHubGameLogsState.playerSeasonStats = parseSeasonStatsCsv(seasonCsv);
      dataHubGameLogsState.playerSeasonRanks = parseSeasonRanksCsv(seasonRanksCsv);

      const weeklyStats = Object.create(null);
      const projectionWeeks = Object.create(null);
      allWeeklyCsvs.forEach(({ week, csv, hasFullStats }) => {
        if (!csv) return;
        weeklyStats[week] = parseWeeklyStatsCsv(csv);
        if (!hasFullStats) {
          projectionWeeks[week] = true;
        }
      });

      dataHubGameLogsState.playerWeeklyStats = weeklyStats;
      dataHubGameLogsState.weeklyStats = weeklyStats;
      dataHubGameLogsState.playerProjectionWeeks = projectionWeeks;
      dataHubGameLogsState.statsSheetsLoaded = true;
      dataHubGameLogsState.liveStatsLoaded = false;
      await ensureSleeperLiveStats();
    } catch (error) {
      console.error("Failed to load DataHub game logs CSV data.", error);
      dataHubGameLogsState.playerSeasonStats = Object.create(null);
      dataHubGameLogsState.playerSeasonRanks = Object.create(null);
      dataHubGameLogsState.playerWeeklyStats = Object.create(null);
      dataHubGameLogsState.weeklyStats = Object.create(null);
      dataHubGameLogsState.playerProjectionWeeks = Object.create(null);
      dataHubGameLogsState.liveWeeklyStats = Object.create(null);
      dataHubGameLogsState.liveStatsLoaded = true;
      dataHubGameLogsState.statsSheetsLoaded = false;
    } finally {
      dataHubGameLogsState.statsLoadPromise = null;
    }
  })();

  await dataHubGameLogsState.statsLoadPromise;
}

async function ensureSleeperLiveStats(force = false) {
  if (!force && dataHubGameLogsState.liveStatsLoaded) {
    const knownWeek = dataHubGameLogsState.currentNflWeek;
    const lastFetchedWeek = dataHubGameLogsState.lastLiveStatsWeek;
    if (Number.isFinite(knownWeek) && knownWeek === lastFetchedWeek) {
      const now = Date.now();
      if (dataHubGameLogsState.lastLiveStatsFetchTs
        && (now - dataHubGameLogsState.lastLiveStatsFetchTs) < 5 * 60 * 1000) {
        return;
      }
    }
  }
  await fetchSleeperLiveStats();
}

async function fetchSleeperLiveStats() {
  const sheetWeeks = Object.keys(dataHubGameLogsState.playerWeeklyStats || {})
    .map(Number)
    .filter(Number.isFinite);
  const latestSheetWeek = sheetWeeks.length ? Math.max(...sheetWeeks) : 0;
  const existingLiveStats = Object.entries(dataHubGameLogsState.liveWeeklyStats || {}).reduce((accumulator, [week, stats]) => {
    accumulator[week] = { ...(stats || {}) };
    return accumulator;
  }, Object.create(null));

  try {
    const response = await fetch(`${API_BASE}/state/nfl`);
    if (!response.ok) throw new Error(`Sleeper state request failed: ${response.status}`);
    const sleeperState = await response.json();
    const season = sleeperState?.season || null;
    const currentWeek = Number(sleeperState?.week);
    dataHubGameLogsState.currentNflSeason = season;
    dataHubGameLogsState.currentNflWeek = Number.isFinite(currentWeek) ? currentWeek : null;

    if (!season || !Number.isFinite(currentWeek) || currentWeek <= 0) {
      dataHubGameLogsState.liveWeeklyStats = existingLiveStats;
      return;
    }

    const liveWeeklyStats = { ...existingLiveStats };
    const fetchStartWeek = Math.max(Math.min(latestSheetWeek + 1, currentWeek), 1);
    for (let week = fetchStartWeek; week <= currentWeek; week += 1) {
      try {
        const weekResponse = await fetch(`${API_BASE}/stats/nfl/regular/${season}/${week}`);
        if (!weekResponse.ok) throw new Error(`Sleeper stats request failed: ${weekResponse.status}`);
        const statsData = await weekResponse.json();
        if (!statsData || typeof statsData !== "object") continue;

        const weekStats = Object.create(null);
        Object.entries(statsData).forEach(([playerId, statLine]) => {
          const override = Number(
            statLine?.pts_ppr
            ?? statLine?.pts
            ?? statLine?.pts_ppr_total
            ?? statLine?.fantasy_points_ppr,
          );
          if (!Number.isFinite(override)) return;
          weekStats[playerId] = {
            fpts: override,
            fpts_override: override,
            __live: true,
          };
        });
        if (Object.keys(weekStats).length) {
          liveWeeklyStats[week] = weekStats;
        }
      } catch (weekError) {
        console.warn(`Unable to fetch Sleeper live stats for week ${week}.`, weekError);
      }
    }

    dataHubGameLogsState.liveWeeklyStats = liveWeeklyStats;
    dataHubGameLogsState.lastLiveStatsWeek = currentWeek;
  } catch (error) {
    console.warn("Sleeper live stats unavailable for DataHub modal.", error);
    dataHubGameLogsState.liveWeeklyStats = existingLiveStats;
  } finally {
    dataHubGameLogsState.liveStatsLoaded = true;
    dataHubGameLogsState.lastLiveStatsFetchTs = Date.now();
  }
}

function getCombinedWeeklyStats() {
  const combined = Object.create(null);
  Object.entries(dataHubGameLogsState.weeklyStats || {}).forEach(([week, stats]) => {
    const clonedWeek = Object.create(null);
    Object.entries(stats || {}).forEach(([playerId, statLine]) => {
      clonedWeek[playerId] = { ...(statLine || {}) };
    });
    combined[week] = clonedWeek;
  });

  Object.entries(dataHubGameLogsState.liveWeeklyStats || {}).forEach(([week, stats]) => {
    if (!combined[week]) combined[week] = Object.create(null);
    const weekBucket = combined[week];
    const isProjectionWeek = dataHubGameLogsState.playerProjectionWeeks?.[Number(week)] === true;
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
      if (liveLine?.__live === true && (isProjectionWeek || Object.keys(existing).length === 0)) {
        merged.__live = true;
      } else if (!isProjectionWeek && merged.__live) {
        delete merged.__live;
      }
      weekBucket[playerId] = merged;
    });
  });

  return combined;
}

async function ensurePlayerMetaLoaded() {
  if (dataHubGameLogsState.playerMetaById) {
    return dataHubGameLogsState.playerMetaById;
  }
  if (dataHubGameLogsState.playerMetaLoadPromise) {
    return dataHubGameLogsState.playerMetaLoadPromise;
  }

  // Vitals parity is optional. If Sleeper player metadata fails, the modal
  // still renders and the vitals row gracefully degrades to em dashes.
  dataHubGameLogsState.playerMetaLoadPromise = fetch(`${API_BASE}/players/nfl`, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Sleeper players request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((payload) => {
      dataHubGameLogsState.playerMetaById = payload || Object.create(null);
      return dataHubGameLogsState.playerMetaById;
    })
    .catch((error) => {
      console.warn("Sleeper player metadata unavailable for DataHub modal.", error);
      dataHubGameLogsState.playerMetaById = Object.create(null);
      return dataHubGameLogsState.playerMetaById;
    })
    .finally(() => {
      dataHubGameLogsState.playerMetaLoadPromise = null;
    });

  return dataHubGameLogsState.playerMetaLoadPromise;
}

function parseSeasonStatsCsv(csvText) {
  const { headers, rows } = parsePlayerStatsCsv(csvText);
  const normalizedHeaders = headers.map(normalizeHeader);
  const hasAltFpoe = normalizedHeaders.includes("aFPOE");
  const result = Object.create(null);

  rows.forEach((columns) => {
    let playerId = null;
    const stats = {};
    normalizedHeaders.forEach((header, index) => {
      const value = columns[index];
      if (!value) return;
      if (header === "SLPR_ID") {
        playerId = value.trim();
        return;
      }
      if (header === "FPOE" && hasAltFpoe) return;

      const statKey = PLAYER_STAT_HEADER_MAP[header];
      if (statKey) {
        const parsedValue = parseStatValue(header, value);
        if (parsedValue !== null) stats[statKey] = parsedValue;
        return;
      }

      const metaKey = SEASON_META_HEADERS[header];
      if (metaKey) {
        if (metaKey === "games_played") {
          const numericValue = Number.parseFloat(value);
          if (!Number.isNaN(numericValue)) stats[metaKey] = numericValue;
        } else {
          const trimmedValue = value.trim();
          if (trimmedValue) stats[metaKey] = trimmedValue;
        }
        return;
      }

      const seasonValueKey = SEASON_VALUE_HEADERS[header];
      if (seasonValueKey) {
        const parsedValue = parseSeasonValue(header, value);
        if (parsedValue !== null) stats[seasonValueKey] = parsedValue;
      }
    });

    if (!playerId) return;
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

function parseSeasonRanksCsv(csvText) {
  const { headers, rows } = parsePlayerStatsCsv(csvText);
  const normalizedHeaders = headers.map(normalizeHeader);
  const result = Object.create(null);

  rows.forEach((columns) => {
    let playerId = null;
    const ranks = {};
    normalizedHeaders.forEach((header, index) => {
      const value = columns[index];
      if (!value) return;
      if (header === "SLPR_ID") {
        playerId = value.trim();
        return;
      }
      const statKey = PLAYER_STAT_HEADER_MAP[header] || SEASON_VALUE_HEADERS[header];
      if (!statKey) return;
      const parsedRank = parseRankValue(value);
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

function parseWeeklyStatsCsv(csvText) {
  const { headers, rows } = parsePlayerStatsCsv(csvText);
  const normalizedHeaders = headers.map(normalizeHeader);
  const result = Object.create(null);

  rows.forEach((columns) => {
    let playerId = null;
    const stats = {};
    normalizedHeaders.forEach((header, index) => {
      const value = columns[index];
      if (header === "SLPR_ID") {
        if (value) playerId = value.trim();
        return;
      }
      if (header !== "PROJ" && !value) return;

      const metaKey = WEEKLY_META_HEADER_MAP[header];
      if (metaKey) {
        if (metaKey === "opponent_rank") {
          const parsedValue = Number.parseFloat(value.trim());
          if (!Number.isNaN(parsedValue)) stats[metaKey] = parsedValue;
        } else {
          const trimmedValue = value.trim();
          if (trimmedValue) stats[metaKey] = trimmedValue;
        }
        return;
      }

      const statKey = PLAYER_STAT_HEADER_MAP[header];
      if (!statKey) return;
      if (header === "PROJ") {
        stats[statKey] = value || "";
      } else {
        const parsedValue = parseStatValue(header, value);
        if (parsedValue !== null) stats[statKey] = parsedValue;
      }
    });

    if (playerId) {
      result[playerId] = stats;
    }
  });

  return result;
}

function parsePlayerStatsCsv(csvText) {
  const lines = String(csvText || "").split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) return { headers: [], rows: [] };
  const headers = parsePlayerStatsCsvLine(lines[0]);
  const rows = lines.slice(1)
    .map((line) => parsePlayerStatsCsvLine(line))
    .filter((columns) => columns.some((column) => column.length > 0));
  return { headers, rows };
}

function parsePlayerStatsCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  const sanitizedLine = String(line || "").replace(/\r$/, "");
  for (let index = 0; index < sanitizedLine.length; index += 1) {
    const char = sanitizedLine[index];
    if (inQuotes) {
      if (char === "\"") {
        if (sanitizedLine[index + 1] === "\"") {
          current += "\"";
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function normalizeHeader(header) {
  return String(header || "").replace(/[\u00a0\u202f]/g, " ").trim();
}

function parseStatValue(header, value) {
  const trimmedValue = String(value || "").trim();
  if (!trimmedValue || trimmedValue.toUpperCase() === "NA") return null;
  if (header === "SNP%") {
    const numericPortion = Number.parseFloat(trimmedValue.replace("%", ""));
    if (Number.isNaN(numericPortion)) return null;
    if (trimmedValue.includes("%") || numericPortion > 1.5) {
      return numericPortion;
    }
    return numericPortion * 100;
  }
  const parsedValue = Number.parseFloat(trimmedValue);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function parseInjuryDesignation(rawValue) {
  if (rawValue === undefined || rawValue === null) return null;
  const trimmedValue = String(rawValue).trim();
  if (!trimmedValue) return null;
  const upperValue = trimmedValue.toUpperCase();
  if (["NA", "N/A", "UNDEFINED", "NULL"].includes(upperValue)) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmedValue)) return null;
  let primaryToken = upperValue.split(/\s+/)[0]?.replace(/[^A-Z]/g, "") || "";
  if (!primaryToken) return null;
  if (primaryToken.startsWith("QUESTION")) primaryToken = "Q";
  else if (primaryToken.startsWith("DOUBT")) primaryToken = "D";
  else if (primaryToken.includes("IR")) primaryToken = "IR";
  else if (primaryToken.startsWith("PUP")) primaryToken = "PUP";
  else if (primaryToken.startsWith("DNP")) primaryToken = "DNP";
  const color = INJURY_DESIGNATION_COLORS[primaryToken] || "var(--color-text-secondary)";
  return { designation: primaryToken, color, raw: trimmedValue };
}

function parseSeasonValue(header, value) {
  const trimmedValue = String(value || "").trim();
  if (!trimmedValue || trimmedValue.toUpperCase() === "NA") return null;
  if (header === "PRK_PPR") {
    const parsedValue = Number.parseInt(trimmedValue, 10);
    return Number.isNaN(parsedValue) ? null : parsedValue;
  }
  const parsedValue = Number.parseFloat(trimmedValue);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function parseRankValue(value) {
  const trimmedValue = String(value || "").trim();
  if (!trimmedValue) return null;
  const upperValue = trimmedValue.toUpperCase();
  if (upperValue === "NA" || upperValue === "N/A" || upperValue === "PLACEHOLDER") {
    return null;
  }
  const parsedValue = Number.parseFloat(trimmedValue);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function buildStatLabels() {
  const labels = {};
  Object.entries(PLAYER_STAT_HEADER_MAP).forEach(([header, key]) => {
    labels[key] = header;
  });
  labels.fpts = "FPTS";
  labels.ppg = "PPG";
  labels.ts_per_rr = "TS%";
  labels.fpoe = "FPOE";
  labels.expl_ru_pct = "EXPLSV%";
  return labels;
}

function getSeasonRankKey(statKey) {
  return STAT_KEY_RANK_OVERRIDES[statKey] || statKey;
}

function getSeasonRankValue(playerId, statKey) {
  const normalizeRank = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    return parseRankValue(String(value));
  };

  if (statKey === "fpts" || statKey === "ppg") {
    const modalRanks = dataHubGameLogsState.currentPlayerRanks;
    const liveRank = statKey === "fpts" ? modalRanks?.posRank : modalRanks?.ppgPosRank;
    return normalizeRank(liveRank);
  }

  const ranks = dataHubGameLogsState.playerSeasonRanks?.[playerId];
  if (!ranks) return null;
  const rankKey = getSeasonRankKey(statKey);
  if (!(rankKey in ranks)) return null;
  return normalizeRank(ranks[rankKey]);
}

function getRankDisplayText(rank) {
  if (rank === null || rank === undefined || Number.isNaN(rank)) return "NA";
  const rankText = String(rank).trim();
  if (!rankText) return "NA";
  const upperText = rankText.toUpperCase();
  return upperText === "NA" || upperText === "N/A" ? "NA" : rankText;
}

function formatPercentage(value, decimals = 1) {
  const fallback = (0).toFixed(decimals) + "%";
  if (value === null || value === undefined || Number.isNaN(value)) return fallback;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return fallback;
  return numericValue.toFixed(decimals) + "%";
}

function formatRadarStatValue(statKey, value) {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      if ((statKey === "cpoe" || statKey === "epa_per_db")
        && !trimmedValue.startsWith("-")
        && !trimmedValue.startsWith("+")) {
        const numericValue = Number.parseFloat(trimmedValue.replace("%", ""));
        if (Number.isFinite(numericValue) && numericValue > 0) {
          return `+${trimmedValue}`;
        }
      }
      return trimmedValue;
    }
  }
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "N/A";
  if (["cmp_pct", "snp_pct", "ts_per_rr", "prs_pct", "pass_imp_per_att"].includes(statKey)) {
    return numericValue.toFixed(1) + "%";
  }
  if (statKey === "cpoe") {
    const formattedValue = numericValue.toFixed(1) + "%";
    return numericValue > 0 ? `+${formattedValue}` : formattedValue;
  }
  if (statKey === "first_down_rec_rate") return numericValue.toFixed(2);
  if (statKey === "fpts" || statKey === "ppg") return numericValue.toFixed(1);
  if (statKey === "rec" || statKey === "rec_tgt" || statKey === "yds_total") {
    return Math.round(numericValue).toString();
  }
  if (statKey === "rec_ypg" || statKey === "pass_rtg") return numericValue.toFixed(1);
  if (statKey === "ttt" || statKey === "imp_per_g") return numericValue.toFixed(2);
  if (statKey === "epa_per_db") {
    const formattedValue = numericValue.toFixed(2);
    return numericValue > 0 ? `+${formattedValue}` : formattedValue;
  }
  return numericValue.toFixed(2);
}

function getRankColor(rank) {
  if (typeof rank !== "number") return "var(--color-text-primary)";
  const thresholds = [
    { value: 24, color: "#8BEBCDbb" },
    { value: 48, color: "#97EBE3ab" },
    { value: 72, color: "#7dd1ffaa" },
    { value: 96, color: "#48a6ffaa" },
    { value: 120, color: "#957cffbb" },
    { value: 156, color: "#a642ffbb" },
    { value: 180, color: "#cf60ffcc" },
    { value: 204, color: "#ff6fe1cc" },
    { value: 250, color: "#ff2eb2" },
  ];
  for (const threshold of thresholds) {
    if (rank <= threshold.value) return threshold.color;
  }
  if (rank > 250 && rank < 300) return "#ff0080";
  if (rank >= 300) return "#656565";
  return "var(--color-text-secondary)";
}

function getConditionalColorByRank(rank, position) {
  if (typeof rank !== "number" || rank <= 0) return "inherit";
  const normalizedPosition = String(position || "").trim().toUpperCase();
  const thresholds = normalizedPosition === "WR"
    ? [
      { value: 12, color: "#51CBA5" },
      { value: 24, color: "#34aabf" },
      { value: 36, color: "#4798fc" },
      { value: 48, color: "#957CFF" },
      { value: 60, color: "#FF6FE1" },
      { value: 72, color: "#FF2EB9" },
    ]
    : [
      { value: 8, color: "#51CBA5" },
      { value: 16, color: "#34aabf" },
      { value: 24, color: "#4798fc" },
      { value: 32, color: "#957CFF" },
      { value: 44, color: "#FF6FE1" },
      { value: 60, color: "#FF2EB2" },
    ];
  for (const threshold of thresholds) {
    if (rank <= threshold.value) return threshold.color;
  }
  return "#767693";
}

function getSznStatRankColor(rank, position) {
  if (typeof rank !== "number" || rank <= 0) return "inherit";
  const normalizedPosition = String(position || "").trim().toUpperCase();
  const thresholds = normalizedPosition === "WR"
    ? [
      { value: 12, color: "#00FFFFB5" },
      { value: 24, color: "#1b7affec" },
      { value: 36, color: "#3300ff" },
      { value: 48, color: "#5700FF" },
      { value: 60, color: "#8732ff" },
      { value: 72, color: "#ea08ff" },
    ]
    : [
      { value: 8, color: "#00FFFFB5" },
      { value: 16, color: "#1b7affec" },
      { value: 24, color: "#3300ff" },
      { value: 32, color: "#5700FF" },
      { value: 40, color: "#8732ff" },
      { value: 50, color: "#ea08ff" },
    ];
  for (const threshold of thresholds) {
    if (rank <= threshold.value) return threshold.color;
  }
  return "#63616c";
}

function getKtcColor(value) {
  const thresholds = [
    { value: 9000, color: "#72edd0B3" },
    { value: 8000, color: "#58d5ceB3" },
    { value: 7000, color: "#5bdae8B3" },
    { value: 6000, color: "#6eb4ebB3" },
    { value: 5500, color: "#62a5f9B3" },
    { value: 5000, color: "#848bffB3" },
    { value: 4500, color: "#7b63ffB3" },
    { value: 4000, color: "#964effB3" },
    { value: 3500, color: "#c449f9B3" },
    { value: 3000, color: "#ee42ffB3" },
    { value: 2500, color: "#d13eb8B3" },
    { value: 2000, color: "#d032aaB3" },
    { value: 0, color: "#f94ea4B3" },
  ];
  if (value === null || value === 0) return "#e0e6ed";
  for (const threshold of thresholds) {
    if (value >= threshold.value) return threshold.color;
  }
  return thresholds[thresholds.length - 1].color;
}

function ordinalSuffix(value) {
  const ones = value % 10;
  const tens = value % 100;
  if (ones === 1 && tens !== 11) return `${value}st`;
  if (ones === 2 && tens !== 12) return `${value}nd`;
  if (ones === 3 && tens !== 13) return `${value}rd`;
  return `${value}th`;
}

function createRankAnnotation(rank, { wrapInParens = true, ordinal = false, variant = "default" } = {}) {
  const span = document.createElement("span");
  span.className = `stat-rank-annotation stat-rank-variant-${variant}`;
  const displayText = getRankDisplayText(rank);
  const getOrdinalSuffixOnly = (number) => {
    const absolute = Math.abs(Number(number));
    if (!Number.isFinite(absolute) || Math.floor(absolute) !== absolute) return "";
    const tens = absolute % 100;
    if (tens >= 11 && tens <= 13) return "th";
    const ones = absolute % 10;
    if (ones === 1) return "st";
    if (ones === 2) return "nd";
    if (ones === 3) return "rd";
    return "th";
  };

  const numericValue = Number(displayText);
  if (displayText !== "NA" && Number.isFinite(numericValue)) {
    if (wrapInParens) span.append(document.createTextNode("("));
    const numberNode = document.createElement("span");
    numberNode.className = "stat-rank-number";
    numberNode.textContent = String(numericValue);
    span.append(numberNode);
    if (ordinal) {
      const suffixText = getOrdinalSuffixOnly(numericValue);
      if (variant === "ktc") {
        const suffix = document.createElement("span");
        suffix.className = `stat-rank-suffix stat-rank-suffix-${variant}`;
        suffix.textContent = suffixText;
        span.append(suffix);
      } else {
        const suffix = document.createElement("sup");
        suffix.className = `stat-rank-suffix stat-rank-suffix-${variant}`;
        suffix.textContent = suffixText;
        span.append(suffix);
      }
    }
    if (wrapInParens) span.append(document.createTextNode(")"));
    return span;
  }
  span.textContent = wrapInParens ? `(${displayText})` : displayText;
  return span;
}

const HEIGHT_WEIGHT_COLORS = {
  low: "#F7A3EBDF",
  mid: "#84b8fbff",
  high: "#96F2CEB9",
};

function getPlayerVitals(playerId, playerContext = null) {
  const fallback = { age: "—", height: "—", weight: "—", exp: "—", ry: "—" };
  const meta = dataHubGameLogsState.playerMetaById?.[playerId] || null;
  const rowContext = playerContext || dataHubGameLogsState.rowContextByPlayerId[playerId] || null;
  if (!meta && !rowContext) return fallback;

  const collect = (...values) => values
    .map((value) => (typeof value === "string" ? value.trim() : value))
    .filter((value) => value !== undefined && value !== null && value !== "");

  const ageCandidates = collect(
    rowContext?.age,
    meta?.age,
    meta?.metadata?.age,
    meta?.metadata?.player_age,
  );

  let ageValue = null;
  for (const candidate of ageCandidates) {
    const numericValue = Number.parseFloat(candidate);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      ageValue = numericValue.toFixed(1);
      break;
    }
  }
  if (!ageValue && meta?.birth_date) {
    const birthDate = new Date(meta.birth_date);
    if (!Number.isNaN(birthDate.getTime())) {
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const hasHadBirthday =
        now.getMonth() > birthDate.getMonth()
        || (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
      if (!hasHadBirthday) age -= 1;
      if (Number.isFinite(age) && age > 0) {
        ageValue = Number(age).toFixed(1);
      }
    }
  }

  const heightValue = parseHeightString(
    collect(
      meta?.height,
      meta?.metadata?.height,
      meta?.metadata?.player_height,
      meta?.height_inches,
      meta?.metadata?.height_inches,
    )[0],
  );

  const weightValue = parseWeightString(
    collect(
      meta?.weight,
      meta?.metadata?.weight,
      meta?.metadata?.player_weight,
      meta?.weight_lbs,
      meta?.metadata?.weight_lbs,
    )[0],
  );

  const expValue = meta?.years_exp ?? meta?.metadata?.years_exp ?? null;
  const rookieYearValue = meta?.rookie_year ?? meta?.metadata?.rookie_year ?? null;

  return {
    age: ageValue ?? "—",
    height: heightValue ?? "—",
    weight: weightValue ?? "—",
    exp: expValue !== null && expValue !== undefined && expValue !== "" ? String(expValue) : "—",
    ry: rookieYearValue !== null && rookieYearValue !== undefined && rookieYearValue !== "" ? String(rookieYearValue) : "—",
  };
}

function createPlayerVitalsElement(vitals, { variant = "modal", pos = "" } = {}) {
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
    const labelElement = document.createElement("span");
    labelElement.className = "player-vitals__label";
    labelElement.textContent = label;
    const valueElement = document.createElement("span");
    valueElement.className = "player-vitals__value";
    valueElement.textContent = value;
    if (label === "AGE" || label === "HEIGHT" || label === "WEIGHT") {
      const color = getVitalsColor(label, pos, value);
      if (color) valueElement.style.color = color;
    }
    item.append(labelElement, valueElement);
    container.append(item);
  });
  return container;
}

function parseHeightToInches(heightString) {
  if (!heightString && heightString !== 0) return null;
  const normalizedValue = String(heightString)
    .trim()
    .replace(/[’‘]/g, "'")
    .replace(/[‐–—−]/g, "-")
    .replace(/\s+ft\b/gi, "'")
    .replace(/\s*in\b/gi, "");
  let match = normalizedValue.match(/^(\d{1,2})\s*(?:'|-)\s*(\d{1,2})\s*(?:\"?)$/);
  if (match) {
    return Number.parseInt(match[1], 10) * 12 + Number.parseInt(match[2], 10);
  }
  match = normalizedValue.match(/^(\d{1,2})\s*(?:'|ft)?\s*$/i);
  if (match) {
    return Number.parseInt(match[1], 10) * 12;
  }
  const digits = normalizedValue.match(/\d+/g) || [];
  if (digits.length === 1) {
    const raw = digits[0];
    if (raw.length === 3) {
      return Number.parseInt(raw.slice(0, 1), 10) * 12 + Number.parseInt(raw.slice(1), 10);
    }
    const numericValue = Number.parseInt(raw, 10);
    if (numericValue >= 50 && numericValue <= 90) return numericValue;
  }
  if (digits.length >= 2) {
    return Number.parseInt(digits[0], 10) * 12 + Number.parseInt(digits[1], 10);
  }
  return null;
}

function parseHeightString(value) {
  const inches = parseHeightToInches(value);
  if (!Number.isFinite(inches) || inches <= 0) return null;
  const feet = Math.floor(inches / 12);
  const remainder = inches % 12;
  return `${feet}'${remainder}"`;
}

function parseWeightToLbs(weightString) {
  if (!weightString && weightString !== 0) return null;
  const match = String(weightString).match(/(\d{2,3})\s*(?:lbs?|lb)?/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function parseWeightString(value) {
  const pounds = parseWeightToLbs(value);
  return Number.isFinite(pounds) && pounds > 0 ? `${pounds} lbs` : null;
}

function parseAgeValue(ageString) {
  if (!ageString && ageString !== 0) return null;
  const match = String(ageString).trim().match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const numericValue = Number(match[0]);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function getVitalsColor(label, pos, rawValue) {
  const position = String(pos || "").toUpperCase();
  if (!rawValue) return null;
  if (label === "AGE") {
    const age = parseAgeValue(rawValue);
    if (age === null) return null;
    if (position === "WR") {
      if (age < 26) return "#96F2CEB9";
      if (age < 29) return "#84B8FBFF";
      if (age < 31) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
    if (position === "RB") {
      if (age <= 24) return "#96F2CEB9";
      if (age < 25) return "#84B8FBFF";
      if (age < 28) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
    if (position === "TE") {
      if (age < 26) return "#96F2CEB9";
      if (age < 29.5) return "#84B8FBFF";
      if (age < 32) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
    if (position === "QB") {
      if (age < 28.5) return "#96F2CEB9";
      if (age < 33) return "#84B8FBFF";
      if (age < 41) return "#AB8BF5FF";
      return "#F7A3EBDF";
    }
  }
  if (label === "WEIGHT") {
    const pounds = parseWeightToLbs(rawValue);
    if (pounds === null) return null;
    if (position === "QB") {
      if (pounds < 210) return HEIGHT_WEIGHT_COLORS.low;
      if (pounds <= 250) return HEIGHT_WEIGHT_COLORS.mid;
      return HEIGHT_WEIGHT_COLORS.low;
    }
    if (position === "RB") {
      if (pounds < 190) return HEIGHT_WEIGHT_COLORS.low;
      if (pounds < 200) return HEIGHT_WEIGHT_COLORS.mid;
      return HEIGHT_WEIGHT_COLORS.high;
    }
    if (position === "TE") {
      if (pounds < 230) return HEIGHT_WEIGHT_COLORS.low;
      if (pounds < 240) return HEIGHT_WEIGHT_COLORS.mid;
      return HEIGHT_WEIGHT_COLORS.high;
    }
    if (position === "WR") {
      if (pounds < 190) return HEIGHT_WEIGHT_COLORS.low;
      if (pounds <= 200) return HEIGHT_WEIGHT_COLORS.mid;
      if (pounds <= 234) return HEIGHT_WEIGHT_COLORS.high;
      return HEIGHT_WEIGHT_COLORS.low;
    }
  }
  if (label === "HEIGHT") {
    const inches = parseHeightToInches(rawValue);
    if (inches === null) return null;
    if (position === "QB") {
      if (inches < 72) return HEIGHT_WEIGHT_COLORS.low;
      if (inches <= 73) return HEIGHT_WEIGHT_COLORS.mid;
      return HEIGHT_WEIGHT_COLORS.high;
    }
    if (position === "RB") {
      if (inches >= 75) return HEIGHT_WEIGHT_COLORS.low;
      if (inches > 69 && inches < 75) return HEIGHT_WEIGHT_COLORS.high;
      if (inches >= 67 && inches <= 69) return HEIGHT_WEIGHT_COLORS.mid;
      return HEIGHT_WEIGHT_COLORS.low;
    }
    if (position === "TE") {
      if (inches > 74) return HEIGHT_WEIGHT_COLORS.high;
      if (inches >= 73 && inches <= 74) return HEIGHT_WEIGHT_COLORS.mid;
      return HEIGHT_WEIGHT_COLORS.low;
    }
    if (position === "WR") {
      if (inches < 71) return HEIGHT_WEIGHT_COLORS.low;
      if (inches <= 72) return HEIGHT_WEIGHT_COLORS.mid;
      return HEIGHT_WEIGHT_COLORS.high;
    }
  }
  return null;
}

function getPlayerRadarData(playerId, position) {
  const config = RADAR_STATS_CONFIG[position];
  if (!config) return null;

  const radarData = {
    labels: config.labels,
    ranks: [],
    rawRanks: [],
    statValues: [],
    statKeys: config.stats,
    maxRank: config.maxRank,
  };

  const footerStats = dataHubGameLogsState.currentFooterStats || {};
  const seasonTotals = dataHubGameLogsState.playerSeasonStats?.[playerId] || null;
  const playerRanks = dataHubGameLogsState.currentPlayerRanks || null;
  const summarySnapshot = dataHubGameLogsState.currentSummary || null;

  config.stats.forEach((statKey) => {
    const rankValue = getSeasonRankValue(playerId, statKey);
    radarData.rawRanks.push(rankValue);

    let statValue;
    if (statKey === "ppg") {
      statValue = playerRanks?.ppg;
    } else {
      statValue = footerStats[statKey];
      if (statValue === undefined) {
        if (statKey === "fpts") {
          statValue = summarySnapshot?.fpts ?? seasonTotals?.fpts_ppr ?? seasonTotals?.fpt_ppr ?? null;
        } else if (statKey === "ypc") {
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
      const trimmedValue = statValue.trim();
      if (!trimmedValue) {
        statValue = null;
      } else if (statKey === "fpts" || statKey === "ppg") {
        statValue = trimmedValue;
      } else {
        const numericValue = Number(trimmedValue);
        statValue = Number.isNaN(numericValue) ? trimmedValue : numericValue;
      }
    }

    radarData.statValues.push(statValue);

    if (rankValue === null || rankValue === undefined || Number.isNaN(rankValue)) {
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

const playerRadarBackgroundPlugin = {
  id: "playerRadarBackground",
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

const playerRadarLabelPlugin = {
  id: "playerRadarLabels",
  afterDatasetsDraw(chart, args, options) {
    const dataset = chart.data.datasets[0];
    if (!dataset || !dataset.data) return;
    const { ctx } = chart;
    const scale = chart.scales?.r;
    if (!scale) return;

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
      if (rawRank !== null && rawRank !== undefined && !Number.isNaN(rawRank)) {
        const rankInt = Math.round(rawRank);
        const suffix = ordinalSuffix(rankInt).slice(String(rankInt).length);
        const label = String(rankInt);
        ctx.fillStyle = getConditionalColorByRank(rawRank, dataset.position);
        ctx.fillText(label, point.x + offsetX, point.y + offsetY);
        const metrics = ctx.measureText(label);
        const suffixFontSize = Number.parseInt(ctx.font, 10) * 0.7;
        ctx.font = `${suffixFontSize}px "Product Sans"`;
        ctx.fillText(suffix, point.x + offsetX + (metrics.width / 2) + 4, point.y + offsetY);
        ctx.font = options.font || '11px "Product Sans"';
      } else {
        ctx.fillStyle = getConditionalColorByRank(rawRank, dataset.position);
        ctx.fillText("NA", point.x + offsetX, point.y + offsetY);
      }
    });
  },
};

const playerRadarAxisLabelsPlugin = {
  id: "playerRadarAxisLabels",
  afterDraw(chart, args, options) {
    const scale = chart.scales?.r;
    if (!scale) return;
    const dataset = chart.data.datasets[0];
    const labels = chart.data.labels;
    if (!dataset || !labels?.length) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const labelFontSize = isMobile ? (options?.labelFontSizeMobile ?? 11) : (options?.labelFontSize ?? 12);
    const valueFontSize = isMobile ? (options?.valueFontSizeMobile ?? 9) : (options?.valueFontSize ?? 10);
    const labelFont = `${labelFontSize}px "Product Sans", "Google Sans", sans-serif`;
    const valueFont = `${valueFontSize}px "Product Sans", "Google Sans", sans-serif`;
    const labelColor = options?.labelColor || "#EAEBF0";
    const labelOffset = options?.labelOffset ?? (isMobile ? 14 : 18);
    const topLabelExtraOffset = options?.topLabelExtraOffset ?? (isMobile ? 10 : 12);
    const axisLabelExtraOffsetsByIndex = options?.axisLabelExtraOffsetsByIndex || {};
    const valueSpacing = options?.valueSpacing ?? (isMobile ? 3 : 4);

    const { ctx } = chart;
    const angleStep = (Math.PI * 2) / labels.length;
    const startAngle = -Math.PI / 2;

    ctx.save();
    for (let index = 0; index < labels.length; index += 1) {
      const angle = startAngle + angleStep * index;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      let textBaseline = "middle";
      if (Math.abs(sin) > 1e-4) {
        textBaseline = sin < 0 ? "bottom" : "top";
      }

      let effectiveOffset = labelOffset;
      if (index === 0) effectiveOffset += topLabelExtraOffset;
      const extra = Number(axisLabelExtraOffsetsByIndex[index]);
      if (Number.isFinite(extra)) effectiveOffset += extra;

      const radius = scale.drawingArea + effectiveOffset;
      const x = scale.xCenter + cos * radius;
      const y = scale.yCenter + sin * radius;

      ctx.font = labelFont;
      ctx.textAlign = "center";
      ctx.textBaseline = textBaseline;
      ctx.fillStyle = labelColor;
      ctx.fillText(String(labels[index] ?? ""), x, y);

      const statKey = dataset.statKeys?.[index];
      const statValue = dataset.statValues?.[index];
      const formattedValue = formatRadarStatValue(statKey, statValue);
      const rawRank = dataset.rawRanks?.[index];
      const valueColor = getConditionalColorByRank(rawRank, dataset.position) || labelColor;

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

function renderPlayerRadarChart(playerId, position) {
  const container = gameLogsRadarChartContainer?.querySelector(".radar-chart-content");
  if (!container) return;
  container.innerHTML = "";

  const radarData = getPlayerRadarData(playerId, position);
  if (!radarData || typeof Chart === "undefined") {
    container.innerHTML = '<p class="no-data-message">No radar data available for this player.</p>';
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.id = "player-radar-canvas";
  container.append(canvas);
  const ctx = canvas.getContext("2d");
  const isMobileRadar = window.matchMedia("(max-width: 640px)").matches;
  const radarLayoutPadding = {
    top: isMobileRadar ? 34 : 50,
    bottom: isMobileRadar ? 44 : 52,
    left: isMobileRadar ? 45 : 18,
    right: isMobileRadar ? 45 : 18,
  };
  const radarRankLabelOffset = isMobileRadar ? 13 : 16;

  const chartInstance = new Chart(ctx, {
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
      layout: { padding: radarLayoutPadding },
      elements: { line: { tension: 0.4 } },
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
        playerRadarBackground: {
          levels: [
            { ratio: 0.95, fill: "#2c334f62", stroke: "#525a7739", lineWidth: 1 },
            { ratio: 0.75, fill: "#2D345153", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.55, fill: "#2F365250", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.35, fill: "#30375455", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.18, fill: "#31385565", stroke: "#525a7735", lineWidth: 1 },
          ],
        },
        playerRadarLabels: {
          font: '14px "Product Sans", "Google Sans", sans-serif',
          offset: radarRankLabelOffset,
        },
        playerRadarAxisLabels: {
          labelFontSize: 14,
          labelFontSizeMobile: 13,
          valueFontSize: 12,
          valueFontSizeMobile: 11,
          labelOffset: isMobileRadar ? 10 : 14,
          topLabelExtraOffset: isMobileRadar ? 10 : 12,
          axisLabelExtraOffsetsByIndex: {
            1: 17,
            2: 14,
            3: 10,
            5: 13,
            6: 18,
            7: 21,
          },
          valueSpacing: isMobileRadar ? 3 : 4,
          labelColor: "#EAEBF0",
        },
      },
    },
    plugins: [playerRadarBackgroundPlugin, playerRadarLabelPlugin, playerRadarAxisLabelsPlugin],
  });

  const scale = chartInstance.scales?.r;
  if (scale) {
    const gradient = ctx.createRadialGradient(scale.xCenter, scale.yCenter, 0, scale.xCenter, scale.yCenter, scale.drawingArea);
    gradient.addColorStop(0, "rgba(121, 0, 245, 0.13)");
    gradient.addColorStop(0.4, "rgba(92, 0, 255, 0.20)");
    gradient.addColorStop(0.78, "rgba(75, 0, 255, 0.34)");
    gradient.addColorStop(1, "rgba(34, 0, 255, 0.91)");
    chartInstance.data.datasets[0].backgroundColor = gradient;
    chartInstance.update("none");
  }

  container._chartInstance = Chart.getChart("player-radar-canvas");
}

function getSznSectionsForPosition(position) {
  const posKey = String(position || "").trim().toUpperCase();
  return Array.isArray(SZN_STAT_SECTIONS_BY_POS[posKey]) ? SZN_STAT_SECTIONS_BY_POS[posKey] : [];
}

function computeSznProgressPercent(rank, position) {
  const numericRank = typeof rank === "number" ? rank : Number(rank);
  if (!Number.isFinite(numericRank) || numericRank <= 0) return 0;
  const thresholds = SZN_PROGRESS_THRESHOLDS[String(position || "").trim().toUpperCase()] || SZN_PROGRESS_THRESHOLDS.WR;
  const sorted = thresholds.slice().sort((left, right) => left.rank - right.rank);
  if (numericRank <= sorted[0].rank) return sorted[0].pct;
  if (numericRank >= sorted[sorted.length - 1].rank) return sorted[sorted.length - 1].pct;
  for (let index = 0; index < sorted.length - 1; index += 1) {
    const start = sorted[index];
    const end = sorted[index + 1];
    if (numericRank >= start.rank && numericRank <= end.rank) {
      const span = Math.max(end.rank - start.rank, 1);
      const t = (numericRank - start.rank) / span;
      return Math.max(0, Math.min(100, start.pct + (end.pct - start.pct) * t));
    }
  }
  return 0;
}

function buildSznFillCoreGradient(fillCoreColor) {
  if (!fillCoreColor || fillCoreColor === "inherit") return null;
  return `linear-gradient(90deg, ${fillCoreColor} 0%, ${fillCoreColor} 100%)`;
}

function getSznStatFillCoreColor(rank, position) {
  if (typeof rank !== "number" || rank <= 0) return "inherit";
  const normalizedPosition = String(position || "").trim().toUpperCase();
  const thresholds = normalizedPosition === "WR"
    ? [
      { value: 12, color: "#DEF5" },
      { value: 24, color: "#DEF3" },
      { value: 36, color: "#DEF5" },
      { value: 48, color: "#DEF5" },
      { value: 60, color: "#DEF3" },
      { value: 72, color: "#DEF6" },
    ]
    : [
      { value: 8, color: "#def5" },
      { value: 16, color: "#def3" },
      { value: 24, color: "#def5" },
      { value: 32, color: "#def5" },
      { value: 40, color: "#def3" },
      { value: 50, color: "#def6" },
    ];
  for (const threshold of thresholds) {
    if (rank <= threshold.value) return threshold.color;
  }
  return "#7f7e99";
}

function getSznStatRankBoxShadow(rank, position, rankColor) {
  if (typeof rank !== "number" || rank <= 0 || !rankColor || rankColor === "inherit") {
    return "none";
  }
  return `inset 0 0 5px 1px ${rankColor}`;
}

function getGameLogsSeasonDisplayValue({
  key,
  seasonTotals,
  aggregatedTotals,
  snapPctValues,
  statValueCounts,
  gameLogsWithData,
  player,
}) {
  if (key === "proj") return "-";
  let displayValue;

  if (NO_FALLBACK_KEYS.has(key)) {
    const raw = seasonTotals && typeof seasonTotals[key] === "number" ? seasonTotals[key] : null;
    if (raw === null) {
      displayValue = "N/A";
    } else if (key === "expl_ru_pct") {
      const normalized = Math.abs(raw) <= 1.5 ? raw * 100 : raw;
      displayValue = formatPercentage(normalized);
    } else if (["snp_pct", "prs_pct", "ts_per_rr", "cmp_pct"].includes(key)) {
      displayValue = formatPercentage(raw);
    } else if (key === "cpoe") {
      const formatted = formatPercentage(raw, 1);
      displayValue = raw > 0 ? `+${formatted}` : formatted;
    } else if (key === "epa_per_db") {
      const formatted = Number(raw).toFixed(2);
      displayValue = raw > 0 ? `+${formatted}` : formatted;
    } else {
      displayValue = Number.isInteger(raw) ? String(raw) : Number(raw).toFixed(2);
    }
  } else if (key === "fpts") {
    displayValue = String(dataHubGameLogsState.currentPlayerRanks?.total_pts ?? (seasonTotals?.fpts_ppr ?? seasonTotals?.fpt_ppr ?? 0).toFixed?.(1) ?? "0.0");
  } else if (key === "ppg") {
    displayValue = String(dataHubGameLogsState.currentPlayerRanks?.ppg ?? "0.0");
  } else if (key === "fpoe") {
    const value = Number.isFinite(seasonTotals?.fpoe) ? seasonTotals.fpoe : aggregatedTotals.fpoe;
    displayValue = Number.isFinite(value) ? Number(value).toFixed(1) : "N/A";
  } else if (key === "pa_ypg") {
    const value = Number.isFinite(seasonTotals?.pa_ypg)
      ? seasonTotals.pa_ypg
      : ((seasonTotals?.pass_yd ?? aggregatedTotals.pass_yd ?? 0) / Math.max(seasonTotals?.games_played ?? gameLogsWithData.length ?? 1, 1));
    displayValue = Number(value).toFixed(1);
  } else if (key === "ru_ypg") {
    const value = Number.isFinite(seasonTotals?.ru_ypg)
      ? seasonTotals.ru_ypg
      : ((seasonTotals?.rush_yd ?? aggregatedTotals.rush_yd ?? 0) / Math.max(seasonTotals?.games_played ?? gameLogsWithData.length ?? 1, 1));
    displayValue = Number(value).toFixed(1);
  } else if (key === "rec_ypg") {
    const value = Number.isFinite(seasonTotals?.rec_ypg)
      ? seasonTotals.rec_ypg
      : ((seasonTotals?.rec_yd ?? aggregatedTotals.rec_yd ?? 0) / Math.max(seasonTotals?.games_played ?? gameLogsWithData.length ?? 1, 1));
    displayValue = Number(value).toFixed(1);
  } else if (key === "dp_pct") {
    let pctValue = Number.isFinite(seasonTotals?.dp_pct) ? seasonTotals.dp_pct : null;
    if (pctValue === null) {
      const count = statValueCounts.dp_pct || 0;
      if (Number.isFinite(aggregatedTotals.dp_pct) && count > 0) {
        pctValue = aggregatedTotals.dp_pct / count;
      }
    }
    displayValue = pctValue === null ? "N/A" : formatPercentage(Math.abs(pctValue) <= 1.5 ? pctValue * 100 : pctValue, 1);
  } else if (key === "ypc") {
    const totalYards = seasonTotals?.rush_yd ?? aggregatedTotals.rush_yd ?? 0;
    const totalCarries = seasonTotals?.rush_att ?? aggregatedTotals.rush_att ?? 0;
    displayValue = (totalCarries > 0 ? totalYards / totalCarries : 0).toFixed(2);
  } else if (key === "yco_per_att") {
    const totalYco = seasonTotals?.rush_yac ?? aggregatedTotals.rush_yac ?? 0;
    const totalCarries = seasonTotals?.rush_att ?? aggregatedTotals.rush_att ?? 0;
    displayValue = (totalCarries > 0 ? totalYco / totalCarries : 0).toFixed(2);
  } else if (key === "mtf_per_att") {
    const totalMtf = seasonTotals?.mtf ?? aggregatedTotals.mtf ?? 0;
    const totalCarries = seasonTotals?.rush_att ?? aggregatedTotals.rush_att ?? 0;
    displayValue = (totalCarries > 0 ? totalMtf / totalCarries : 0).toFixed(2);
  } else if (key === "pass_rtg") {
    const value = Number.isFinite(seasonTotals?.pass_rtg)
      ? seasonTotals.pass_rtg
      : ((aggregatedTotals.pass_rtg || 0) / Math.max(gameLogsWithData.filter((week) => (week.stats.pass_att || 0) > 0).length, 1));
    displayValue = Number(value).toFixed(1);
  } else if (key === "pass_imp_per_att") {
    let pctValue = Number.isFinite(seasonTotals?.pass_imp_per_att) ? seasonTotals.pass_imp_per_att : null;
    if (pctValue === null) {
      const totalPassImp = seasonTotals?.pass_imp ?? aggregatedTotals.pass_imp ?? 0;
      const totalPassAtt = seasonTotals?.pass_att ?? aggregatedTotals.pass_att ?? 0;
      pctValue = totalPassAtt > 0 ? (totalPassImp / totalPassAtt) * 100 : 0;
    }
    displayValue = formatPercentage(pctValue);
  } else if (key === "ttt") {
    const count = statValueCounts.ttt || 0;
    const value = Number.isFinite(seasonTotals?.ttt) ? seasonTotals.ttt : (count > 0 ? aggregatedTotals.ttt / count : 0);
    displayValue = Number(value).toFixed(2);
  } else if (key === "prs_pct") {
    const count = statValueCounts.prs_pct || 0;
    const value = Number.isFinite(seasonTotals?.prs_pct) ? seasonTotals.prs_pct : (count > 0 ? aggregatedTotals.prs_pct / count : 0);
    displayValue = formatPercentage(value);
  } else if (key === "cmp_pct") {
    const count = statValueCounts.cmp_pct || 0;
    const value = Number.isFinite(seasonTotals?.cmp_pct) ? seasonTotals.cmp_pct : (count > 0 ? aggregatedTotals.cmp_pct / count : 0);
    displayValue = formatPercentage(value);
  } else if (key === "snp_pct") {
    const value = Number.isFinite(seasonTotals?.snp_pct)
      ? seasonTotals.snp_pct
      : (snapPctValues.length ? snapPctValues.reduce((sum, pct) => sum + pct, 0) / snapPctValues.length : 0);
    displayValue = formatPercentage(value);
  } else if (key === "imp_per_g") {
    let value = Number.isFinite(seasonTotals?.imp_per_g) ? seasonTotals.imp_per_g : null;
    if (value === null) {
      const totalImp = seasonTotals?.imp ?? aggregatedTotals.imp ?? 0;
      const games = seasonTotals?.games_played ?? gameLogsWithData.length ?? 0;
      value = games > 0 ? totalImp / games : 0;
    }
    displayValue = Number(value).toFixed(2);
  } else if (key === "yprr") {
    let value = Number.isFinite(seasonTotals?.yprr) ? seasonTotals.yprr : null;
    if (value === null) {
      const totalRoutes = seasonTotals?.rr ?? aggregatedTotals.rr ?? 0;
      const totalRecYds = seasonTotals?.rec_yd ?? aggregatedTotals.rec_yd ?? 0;
      value = totalRoutes > 0 ? totalRecYds / totalRoutes : 0;
    }
    displayValue = Number(value).toFixed(2);
  } else if (key === "ts_per_rr") {
    let pctValue = Number.isFinite(seasonTotals?.ts_per_rr) ? seasonTotals.ts_per_rr : null;
    if (pctValue === null) {
      const totalRoutes = seasonTotals?.rr ?? aggregatedTotals.rr ?? 0;
      const totalTargets = seasonTotals?.rec_tgt ?? aggregatedTotals.rec_tgt ?? 0;
      pctValue = totalRoutes > 0 ? (totalTargets / totalRoutes) * 100 : 0;
    }
    displayValue = formatPercentage(pctValue);
  } else if (key === "ypr") {
    let value = Number.isFinite(seasonTotals?.ypr) ? seasonTotals.ypr : null;
    if (value === null) {
      const totalReceptions = seasonTotals?.rec ?? aggregatedTotals.rec ?? 0;
      const totalRecYds = seasonTotals?.rec_yd ?? aggregatedTotals.rec_yd ?? 0;
      value = totalReceptions > 0 ? totalRecYds / totalReceptions : 0;
    }
    displayValue = Number(value).toFixed(2);
  } else if (key === "first_down_rec_rate") {
    let value = Number.isFinite(seasonTotals?.first_down_rec_rate) ? seasonTotals.first_down_rec_rate : null;
    if (value === null) {
      const totalRecFd = seasonTotals?.rec_fd ?? aggregatedTotals.rec_fd ?? 0;
      const totalRec = seasonTotals?.rec ?? aggregatedTotals.rec ?? 0;
      value = totalRec > 0 ? totalRecFd / totalRec : 0;
    }
    displayValue = Number(value).toFixed(2);
  } else {
    const totalValue = Number.isFinite(seasonTotals?.[key]) ? seasonTotals[key] : (aggregatedTotals[key] || 0);
    displayValue = Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(2);
  }

  return displayValue;
}

function renderGameLogsSeasonStatsView({
  container,
  player,
  orderedStatKeys,
  statLabels,
  seasonTotals,
  aggregatedTotals,
  snapPctValues,
  statValueCounts,
  gameLogsWithData,
  statGroupByKey,
}) {
  if (!container) return;
  container.innerHTML = "";

  const title = document.createElement("div");
  title.className = "gamelogs-szn-title";
  title.setAttribute("role", "heading");
  title.setAttribute("aria-level", "3");
  title.innerHTML = `
    <span class="gamelogs-szn-title-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5 19V9M12 19V5M19 19v-8"/></svg>
    </span>
    <span class="gamelogs-szn-title-text">Season Stats</span>
  `;

  const gamesPlayed = Number.isFinite(seasonTotals?.games_played) ? Math.round(seasonTotals.games_played) : null;
  if (gamesPlayed !== null) {
    const games = document.createElement("span");
    games.className = "gamelogs-szn-title-games";
    games.innerHTML = `<span class="gamelogs-szn-title-games-label">G:</span><span class="gamelogs-szn-title-games-value">${gamesPlayed}</span>`;
    title.append(games);
  }

  const list = document.createElement("div");
  list.className = "gamelogs-szn-list";

  const appendSznStatRow = (statKey) => {
    if (!statLabels?.[statKey] || statKey === "proj") return false;
    const rankValue = getSeasonRankValue(player.id, statKey);
    const rankColor = getSznStatRankColor(rankValue, player.pos);
    const fillCoreColor = getSznStatFillCoreColor(rankValue, player.pos);
    const progressPct = computeSznProgressPercent(rankValue, player.pos);
    const displayValue = getGameLogsSeasonDisplayValue({
      key: statKey,
      seasonTotals,
      aggregatedTotals,
      snapPctValues,
      statValueCounts,
      gameLogsWithData,
      player,
    });

    const row = document.createElement("div");
    row.className = "gamelogs-szn-row";
    const group = statGroupByKey?.get(statKey);
    if (group) row.classList.add(`gamelogs-szn-row--${group}`);

    const label = document.createElement("div");
    label.className = "gamelogs-szn-label";
    label.textContent = statLabels[statKey];

    const bar = document.createElement("div");
    bar.className = "gamelogs-szn-bar";
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", `${statLabels[statKey]} rank ${getRankDisplayText(rankValue)}`);
    const fill = document.createElement("div");
    fill.className = "gamelogs-szn-bar-fill";
    fill.style.width = `${progressPct}%`;
    const gradient = buildSznFillCoreGradient(fillCoreColor);
    if (gradient) {
      fill.style.backgroundImage = gradient;
      if (rankColor && rankColor !== "inherit") {
        fill.style.border = `1px solid ${rankColor}`;
        fill.style.boxShadow = getSznStatRankBoxShadow(rankValue, player.pos, rankColor);
      }
    }
    const annotation = createRankAnnotation(rankValue, { wrapInParens: false, ordinal: true, variant: "szn" });
    annotation.classList.add("gamelogs-szn-bar-rank");
    annotation.style.color = rankColor;
    annotation.style.setProperty("--szn-rank-pos", `${Math.min(98, Math.max(2, progressPct))}%`);
    bar.append(fill, annotation);

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
    return true;
  };

  const usedKeys = new Set();
  const sections = getSznSectionsForPosition(player?.pos);
  if (sections.length) {
    sections.forEach((section) => {
      const visibleKeys = (section.stats || []).filter((key) => !usedKeys.has(key) && key !== "proj" && statLabels?.[key]);
      if (!visibleKeys.length) return;
      const header = document.createElement("div");
      header.className = `gamelogs-szn-section-header gamelogs-szn-section-header--${section.tone || "all"}`;
      header.setAttribute("role", "heading");
      header.setAttribute("aria-level", "4");
      header.textContent = section.label || "SECTION";
      list.append(header);
      visibleKeys.forEach((key) => {
        if (appendSznStatRow(key)) usedKeys.add(key);
      });
    });
  } else {
    (orderedStatKeys || []).forEach((key) => {
      if (appendSznStatRow(key)) usedKeys.add(key);
    });
  }

  container.append(title, list);
}

function getOpponentRankColor(rank) {
  const numericRank = typeof rank === "number" ? rank : Number.parseFloat(rank);
  if (!Number.isFinite(numericRank)) return null;
  if (numericRank <= 8) return "#82d8bee0";
  if (numericRank <= 16) return "#73b9e7e0";
  if (numericRank <= 24) return "#c093ebe0";
  if (numericRank <= 32) return "#c456b1e0";
  return null;
}

async function fetchGameLogs(playerId) {
  if (!dataHubGameLogsState.statsSheetsLoaded) {
    await fetchPlayerStatsSheets();
  } else {
    await ensureSleeperLiveStats();
  }
  const combinedWeeklyStats = getCombinedWeeklyStats();
  return Object.keys(combinedWeeklyStats)
    .map(Number)
    .sort((left, right) => left - right)
    .reduce((logs, week) => {
      const statsForWeek = combinedWeeklyStats[week]?.[playerId];
      if (statsForWeek) {
        logs.push({ week, stats: statsForWeek });
      }
      return logs;
    }, []);
}

async function handlePlayerNameClick(player) {
  const requestSeq = ++dataHubGameLogsState.requestSeq;
  const isStaleRequest = () => requestSeq !== dataHubGameLogsState.requestSeq;
  dataHubGameLogsState.currentPlayer = null;
  dataHubGameLogsState.currentPlayerRanks = null;
  dataHubGameLogsState.currentSummary = null;
  dataHubGameLogsState.currentFooterStats = null;

  gameLogsModalPlayerName.textContent = player.name || "Player Game Logs";
  gameLogsModalPlayerVitals.innerHTML = "";
  gameLogsModalSummaryChips.innerHTML = "";
  gameLogsModalBody.innerHTML = "";

  gameLogsModalBody.classList.add("loading");
  gameLogsModalRoot.classList.add("loading");
  const loadingPanel = document.createElement("div");
  loadingPanel.className = "game-logs-loading-container";
  loadingPanel.innerHTML = `
    <div class="game-logs-loading-content">
      <div class="game-logs-loading-spinner"></div>
      <p class="game-logs-loading-message">
        <strong>Syncing Game Logs ⇄</strong>
        Fetching DataHub game log data across all weeks.
      </p>
    </div>
    <p class="game-logs-loading-footer"><em>Local CSV stats load once per session. Live-week overlay stays fail-soft.</em></p>
  `;
  gameLogsModalContent.append(loadingPanel);

  openModal();

  await Promise.all([
    fetchPlayerStatsSheets(),
    ensurePlayerMetaLoaded(),
  ]);
  if (isStaleRequest()) return;

  const gameLogs = await fetchGameLogs(player.id);
  if (isStaleRequest()) return;

  const playerRanks = getStatsPagePlayerRanks(player.id);
  gameLogsModalBody.classList.remove("loading");
  gameLogsModalRoot.classList.remove("loading");
  loadingPanel.remove();
  await renderGameLogs(gameLogs, player, playerRanks, requestSeq);
}

function syncGameLogsFooterButtons(activePanel) {
  gameLogsFooterButtons.forEach((button) => {
    const isActive = button.dataset.panel === activePanel;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function toggleGameLogsFooterPanel(panelName) {
  const overlayContainers = {
    "stats-key": gameLogsStatsKeyContainer,
    "radar-chart": gameLogsRadarChartContainer,
    consistency: gameLogsConsistencyContainer,
  };

  if (panelName === "game-logs") {
    Object.values(overlayContainers).forEach((container) => container?.classList.add("hidden"));
    syncGameLogsFooterButtons("game-logs");
    return;
  }

  const activeContainer = overlayContainers[panelName];
  if (!activeContainer) return;
  const isVisible = !activeContainer.classList.contains("hidden");
  Object.values(overlayContainers).forEach((container) => container?.classList.add("hidden"));

  if (isVisible) {
    syncGameLogsFooterButtons("game-logs");
    return;
  }

  activeContainer.classList.remove("hidden");
  syncGameLogsFooterButtons(panelName);
  if (panelName === "radar-chart" && dataHubGameLogsState.currentPlayer) {
    renderPlayerRadarChart(dataHubGameLogsState.currentPlayer.id, dataHubGameLogsState.currentPlayer.pos);
  }
  if (panelName === "consistency" && dataHubGameLogsState.currentPlayer) {
    renderConsistencyChart();
  }
}

function setGameLogsModalView(view) {
  const normalizedView = view === "szn" ? "szn" : "gl";
  gameLogsViewButtons.forEach((button) => {
    const isActive = button.dataset.gamelogsView === normalizedView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  gameLogsModalBody.querySelectorAll('.game-logs-table-container, .no-logs[data-gamelogs-view="gl"]').forEach((node) => {
    node.classList.toggle("hidden", normalizedView !== "gl");
  });
  const sznNode = gameLogsModalBody.querySelector(".game-logs-szn-view");
  if (sznNode) sznNode.classList.toggle("hidden", normalizedView !== "szn");
  gameLogsStatsKeyContainer?.classList.add("hidden");
  gameLogsRadarChartContainer?.classList.add("hidden");
  gameLogsConsistencyContainer?.classList.add("hidden");
  syncGameLogsFooterButtons("game-logs");
  dataHubGameLogsState.currentView = normalizedView;
}

function openModal() {
  gameLogsModalRoot.classList.remove("hidden");
  gameLogsModalRoot.setAttribute("aria-hidden", "false");
  document.body.classList.add("datahub-gamelogs-open");
  setGameLogsModalView("gl");
}

function closeModal() {
  dataHubGameLogsState.requestSeq += 1;
  gameLogsModalRoot.classList.add("hidden");
  gameLogsModalRoot.setAttribute("aria-hidden", "true");
  gameLogsModalRoot.classList.remove("loading");
  gameLogsModalBody.classList.remove("loading");
  gameLogsModalContent.querySelector(".game-logs-loading-container")?.remove();
  gameLogsStatsKeyContainer?.classList.add("hidden");
  gameLogsRadarChartContainer?.classList.add("hidden");
  gameLogsConsistencyContainer?.classList.add("hidden");
  const radarContent = gameLogsRadarChartContainer?.querySelector(".radar-chart-content");
  if (radarContent?._chartInstance) {
    radarContent._chartInstance.destroy();
    radarContent._chartInstance = null;
  }
  syncGameLogsFooterButtons("game-logs");
  document.body.classList.remove("datahub-gamelogs-open");
}

async function renderGameLogs(gameLogs, player, playerRanks, requestSeq) {
  const isStaleRequest = () => Number.isFinite(requestSeq) && requestSeq !== dataHubGameLogsState.requestSeq;
  if (isStaleRequest()) return;

  dataHubGameLogsState.currentPlayer = player;
  dataHubGameLogsState.currentPlayerRanks = playerRanks;
  dataHubGameLogsState.currentSummary = {
    fpts: playerRanks?.total_pts,
    ppg: playerRanks?.ppg,
  };

  const modalHeader = gameLogsModalRoot.querySelector("#modal-header");
  modalHeader.querySelector(".modal-header-left-container")?.remove();
  const headerTags = document.createElement("div");
  headerTags.className = "modal-header-left-container";
  const posTag = document.createElement("div");
  posTag.className = `player-tag modal-pos-tag ${player.pos}`;
  posTag.textContent = player.pos;
  const teamKey = (player.team || "FA").toUpperCase();
  const normalizedKey = TEAM_LOGO_KEY_MAP[teamKey] || teamKey.toLowerCase();
  const teamLogoChip = document.createElement("div");
  teamLogoChip.className = "player-tag modal-team-logo-chip";
  teamLogoChip.dataset.team = teamKey;
  teamLogoChip.innerHTML = teamKey && teamKey !== "FA"
    ? `<img class="team-logo glow" src="../assets/NFL_logos_svg/${normalizedKey}.svg" alt="${teamKey}" width="24" height="24" loading="eager">`
    : "<span>FA</span>";
  headerTags.append(posTag, teamLogoChip);
  modalHeader.insertBefore(headerTags, modalHeader.firstChild);

  gameLogsModalPlayerVitals.innerHTML = "";
  gameLogsModalPlayerVitals.append(createPlayerVitalsElement(getPlayerVitals(player.id, player), {
    variant: "modal",
    pos: player.pos,
  }));

  const ktcRankColor = getConditionalColorByRank(player.ktcPosRank, player.pos);
  gameLogsModalSummaryChips.innerHTML = `
    <div class="gamelogs-summary-chip">
      <h4>
        <span class="chip-header-value" style="color:${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.total_pts}</span>
        <span class="chip-unit">FPTS</span>
      </h4>
      <div class="chip-values">
        <span class="pos-rank-container">
          <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
          <span style="color:${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.posRank || "NA"}</span>
        </span>
        <span class="chip-separator">•</span>
        <span style="color:${getRankColor(playerRanks.overallRank)}">${typeof playerRanks.overallRank === "number" ? `#${playerRanks.overallRank}` : "NA"}</span>
      </div>
    </div>
    <div class="gamelogs-summary-chip">
      <h4>
        <span class="chip-header-value" style="color:${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppg}</span>
        <span class="chip-unit">PPG</span>
      </h4>
      <div class="chip-values">
        <span class="pos-rank-container">
          <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
          <span style="color:${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppgPosRank || "NA"}</span>
        </span>
        <span class="chip-separator">•</span>
        <span style="color:${getRankColor(playerRanks.ppgOverallRank)}">${typeof playerRanks.ppgOverallRank === "number" ? `#${playerRanks.ppgOverallRank}` : "NA"}</span>
      </div>
    </div>
    <div class="gamelogs-summary-chip">
      <h4>
        <span class="chip-header-value" style="color:${getKtcColor(player.ktc)}">${Number.isFinite(player.ktc) ? player.ktc : "NA"}</span>
        <span class="chip-unit">KTC</span>
      </h4>
      <div class="chip-values">
        <span class="pos-rank-container">
          <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
          <span style="color:${ktcRankColor}">${player.ktcPosRank || "NA"}</span>
        </span>
        <span class="chip-separator">•</span>
        <span style="color:${getRankColor(player.ktcOverallRank)}">${Number.isFinite(player.ktcOverallRank) ? `#${player.ktcOverallRank}` : "NA"}</span>
      </div>
    </div>
  `;

  gameLogsModalBody.innerHTML = "";
  const statLabels = buildStatLabels();
  const qbStatOrder = ["fpts", "proj", "pass_rtg", "pass_yd", "pass_td", "cmp_pct", "yds_total", "rush_yd", "rush_td", "pass_att", "pass_cmp", "pass_fd", "imp_per_g", "pass_imp", "pass_imp_per_att", "rush_att", "ypc", "ttt", "prs_pct", "pass_sack", "pass_int", "fum", "fpoe"];
  const rbStatOrder = ["fpts", "proj", "snp_pct", "rush_att", "rush_yd", "ypc", "rush_td", "rec", "rec_yd", "rec_tgt", "ts_per_rr", "yds_total", "elu", "mtf_per_att", "yco_per_att", "mtf", "rush_yac", "rush_fd", "rec_td", "rec_fd", "rec_yar", "imp_per_g", "fum", "fpoe"];
  const wrTeStatOrder = ["fpts", "proj", "snp_pct", "rec_tgt", "rec", "ts_per_rr", "rec_yd", "rec_td", "yprr", "rec_fd", "first_down_rec_rate", "rec_yar", "ypr", "imp_per_g", "rr", "fpoe", "yds_total", "rush_att", "rush_yd", "rush_td", "ypc", "fum"];
  const statGroupByKey = new Map();
  const assignStatGroup = (group, keys) => keys.forEach((key) => statGroupByKey.set(key, group));
  assignStatGroup("all", ["fpts", "ppg", "proj", "snp_pct", "yds_total", "imp_per_g", "fum", "fpoe"]);
  assignStatGroup("passing", ["pass_rtg", "pass_yd", "pass_td", "cmp_pct", "pass_att", "pass_cmp", "pass_fd", "pass_imp", "pass_imp_per_att", "ttt", "prs_pct", "pass_sack", "cpoe", "dp_pct", "pass_int", "epa_per_db", "pa_ypg"]);
  assignStatGroup("rushing", ["rush_att", "rush_yd", "ypc", "rush_td", "rush_fd", "elu", "mtf_per_att", "yco_per_att", "expl_ru_pct", "mtf", "rush_yac", "ryoe", "ru_ypg"]);
  assignStatGroup("receiving", ["rec", "rec_yd", "rec_tgt", "rec_td", "rec_fd", "rec_yar", "ypr", "yprr", "ts_per_rr", "first_down_rec_rate", "rr", "rz_tgt", "rec_ypg", "ay_pct"]);
  const orderedStatKeys = player.pos === "QB" ? qbStatOrder : (player.pos === "RB" ? rbStatOrder : wrTeStatOrder);

  if (!gameLogs?.length) {
    const noLogs = document.createElement("p");
    noLogs.className = "no-logs";
    noLogs.dataset.gamelogsView = "gl";
    noLogs.textContent = `No game logs found for ${player.name} for the current season.`;
    gameLogsModalBody.append(noLogs);
    const sznContainer = document.createElement("div");
    sznContainer.className = "game-logs-szn-view hidden";
    renderGameLogsSeasonStatsView({
      container: sznContainer,
      player,
      orderedStatKeys,
      statLabels,
      seasonTotals: dataHubGameLogsState.playerSeasonStats?.[player.id] || null,
      aggregatedTotals: {},
      snapPctValues: [],
      statValueCounts: {},
      gameLogsWithData: [],
      statGroupByKey,
    });
    gameLogsModalBody.append(sznContainer);
    prepareConsistencyPanel(player);
    setGameLogsModalView(dataHubGameLogsState.currentView || "gl");
    return;
  }

  const container = document.createElement("div");
  container.className = "game-logs-table-container";
  const columnWidths = {
    week: 56,
    proj: 32,
    snp_pct: 44,
    ts_per_rr: 38,
    first_down_rec_rate: 30,
    yds_total: 37,
    rush_att: 34,
    rush_td: 35,
    rush_yd: 44,
    rec_tgt: 41,
    rec: 36,
    rec_yd: 38,
    rec_td: 44,
    ypr: 40,
    yprr: 42,
    imp_per_g: 45,
    pass_rtg: 48,
    pass_yd: 40,
    pass_td: 36,
    pass_att: 38,
    pass_cmp: 38,
    pass_imp_per_att: 44,
    prs_pct: 42,
    ttt: 38,
    yco_per_att: 44,
    ypc: 40,
    mtf_per_att: 44,
    fpts: 45,
    pass_fd: 36,
    pass_imp: 36,
    pass_int: 34,
    pass_sack: 34,
    rush_fd: 36,
    mtf: 36,
    elu: 36,
    rush_yac: 36,
    rec_fd: 36,
    rec_yar: 36,
    rr: 36,
    imp: 36,
    fum: 36,
    fpoe: 36,
    ypg: 36,
    pa_ypg: 36,
    ru_ypg: 36,
    rec_ypg: 36,
  };
  const defaultColumnWidth = 54;
  const tableColumns = [{ id: "week", label: "WK  ·  VS", headerClass: "week-column-header", cellClass: "week-cell" }];
  orderedStatKeys.forEach((key) => {
    if (!statLabels[key]) return;
    tableColumns.push({
      id: key,
      label: statLabels[key],
      headerClass: statGroupByKey.get(key) ? `gamelog-header-${statGroupByKey.get(key)}` : "",
      cellClass: key === "proj" ? "proj-cell" : "",
    });
  });

  const rowsMeta = [];
  const tableRows = [];
  const gameLogsByWeek = new Map(gameLogs.map((entry) => [Number.parseInt(entry.week, 10), entry]));
  const gameLogsWithData = [];
  const createTextDescriptor = (text, style) => ({
    render: (cell) => {
      cell.textContent = text;
      if (style) Object.assign(cell.style, style);
    },
  });
  const getProjectionDisplayValue = (statLine, playerId, week) => {
    if (statLine && Object.prototype.hasOwnProperty.call(statLine, "proj")) return String(statLine.proj);
    const weeklyStat = dataHubGameLogsState.playerWeeklyStats?.[week]?.[playerId];
    if (weeklyStat && Object.prototype.hasOwnProperty.call(weeklyStat, "proj")) return String(weeklyStat.proj);
    return "";
  };

  for (let week = 1; week <= MAX_DISPLAY_WEEKS; week += 1) {
    const weekStatsEntry = gameLogsByWeek.get(week) || null;
    const stats = weekStatsEntry?.stats || null;
    const isProjectionWeek = dataHubGameLogsState.playerProjectionWeeks?.[week] === true;
    const sheetStatsForWeek = dataHubGameLogsState.playerWeeklyStats?.[week]?.[player.id] || null;
    const opponent = stats?.opponent || null;
    const isByeWeek = opponent === "BYE";
    const hasSheetStats = !!sheetStatsForWeek && Object.entries(sheetStatsForWeek).some(([statKey, statValue]) => statLabels[statKey] && statKey !== "proj" && typeof statValue === "number");
    const hasRecordedStat = !!stats && orderedStatKeys.some((key) => statLabels[key] && key !== "proj" && typeof stats[key] === "number");
    const liveFptsValue = typeof stats?.fpts === "number" && Number.isFinite(stats.fpts) ? stats.fpts : null;
    const isLiveWeek = stats?.__live === true || (liveFptsValue !== null && !isProjectionWeek);
    const suppressNonFptsForLiveOnly = isLiveWeek && !hasSheetStats;
    const isUnplayedWeek = !isLiveWeek && (isProjectionWeek || isByeWeek || !hasRecordedStat);
    const rowMeta = { week, isPlayed: !isUnplayedWeek, rowClasses: [] };
    if (isByeWeek) rowMeta.rowClasses.push("bye-week-row");
    if (isUnplayedWeek) rowMeta.rowClasses.push("unplayed-week-row");
    else if (isLiveWeek) rowMeta.rowClasses.push("live-week-row");

    const rowData = { __meta: rowMeta };
    rowData.week = {
      render: (cell) => {
        const weekTag = document.createElement("div");
        weekTag.className = "gamelog-week-tag";
        const weekNumberLine = document.createElement("div");
        weekNumberLine.className = "gamelog-week-tag-number";
        weekNumberLine.textContent = `WK-${week}`;
        weekTag.append(weekNumberLine);
        if (opponent) {
          const opponentLine = document.createElement("div");
          opponentLine.className = "gamelog-week-tag-opponent";
          if (isByeWeek) {
            opponentLine.textContent = "BYE";
          } else {
            const opponentText = document.createElement("span");
            opponentText.className = "gamelog-week-tag-opponent-text";
            opponentText.textContent = opponent;
            const opponentColor = getOpponentRankColor(stats?.opponent_rank);
            if (opponentColor) opponentText.style.color = opponentColor;
            opponentLine.append(opponentText);
            const rankDisplay = getRankDisplayText(stats?.opponent_rank);
            if (rankDisplay !== "NA") {
              const separator = document.createElement("span");
              separator.className = "gamelog-week-tag-separator";
              separator.textContent = " • ";
              const rankSpan = document.createElement("span");
              rankSpan.className = "gamelog-week-tag-rank";
              if (opponentColor) rankSpan.style.color = opponentColor;
              rankSpan.innerHTML = `<span class="gamelog-week-tag-rank-number">${stats.opponent_rank}</span><span class="gamelog-week-tag-rank-suffix">${ordinalSuffix(Number(stats.opponent_rank)).slice(String(Number(stats.opponent_rank)).length)}</span>`;
              opponentLine.append(separator, rankSpan);
            }
          }
          weekTag.append(opponentLine);
        }
        cell.textContent = "";
        cell.append(weekTag);
      },
    };

    const knownDesignations = new Set(["BYE", "OUT", "IR", "PUP", "DNP", "SUS", "D", "Q"]);
    let rowFptsDash = false;
    orderedStatKeys.forEach((key) => {
      if (!statLabels[key]) return;
      if (isUnplayedWeek) {
        if (key === "proj") {
          let projectionValue = getProjectionDisplayValue(stats, player.id, week);
          if (typeof stats?.snp === "number" && stats.snp === 0) {
            const token = String(projectionValue || "").trim().toUpperCase().split(/\s+/)[0]?.replace(/[^A-Z]/g, "") || "";
            if (!knownDesignations.has(token)) projectionValue = "DNP";
          }
          const designationMeta = parseInjuryDesignation(projectionValue);
          rowData[key] = createTextDescriptor(String(projectionValue ?? ""), {
            color: designationMeta ? designationMeta.color : "",
          });
        } else {
          rowData[key] = createTextDescriptor("-", { color: "" });
        }
        return;
      }
      if (suppressNonFptsForLiveOnly && key !== "fpts" && key !== "proj") {
        rowData[key] = createTextDescriptor("-");
        return;
      }
      if (!weekStatsEntry || !stats) {
        rowData[key] = createTextDescriptor("-");
        return;
      }
      if (key === "proj") {
        let projectionValue = getProjectionDisplayValue(stats, player.id, week);
        if (typeof stats?.snp === "number" && stats.snp === 0) {
          const token = String(projectionValue || "").trim().toUpperCase().split(/\s+/)[0]?.replace(/[^A-Z]/g, "") || "";
          if (!knownDesignations.has(token)) projectionValue = "DNP";
        }
        const designationMeta = parseInjuryDesignation(projectionValue);
        rowData[key] = createTextDescriptor(String(projectionValue ?? ""), {
          color: designationMeta ? designationMeta.color : "",
        });
        return;
      }
      let value;
      if (NO_FALLBACK_KEYS.has(key)) {
        value = typeof stats[key] === "number" ? stats[key] : null;
      } else if (key === "fpts") {
        value = typeof stats.fpt_ppr === "number" ? stats.fpt_ppr : (typeof stats.fpts === "number" ? stats.fpts : null);
        if (typeof stats.snp === "number" && stats.snp === 0) value = null;
        if (value === null) rowFptsDash = true;
      } else if (key === "ypc") {
        value = (stats.rush_att || 0) > 0 ? ((stats.rush_yd || 0) / stats.rush_att) : 0;
      } else if (key === "yco_per_att") {
        value = (stats.rush_att || 0) > 0 ? ((stats.rush_yac || 0) / stats.rush_att) : 0;
      } else if (key === "mtf_per_att") {
        value = (stats.rush_att || 0) > 0 ? ((stats.mtf || 0) / stats.rush_att) : 0;
      } else if (key === "pass_imp_per_att") {
        value = typeof stats.pass_imp_per_att === "number"
          ? stats.pass_imp_per_att
          : ((stats.pass_att || 0) > 0 ? ((stats.pass_imp || 0) / stats.pass_att) * 100 : 0);
      } else if (key === "ts_per_rr") {
        value = typeof stats.ts_per_rr === "number" ? stats.ts_per_rr : ((stats.rr || 0) > 0 ? ((stats.rec_tgt || 0) / stats.rr) * 100 : 0);
      } else if (key === "yprr") {
        value = typeof stats.yprr === "number" ? stats.yprr : ((stats.rr || 0) > 0 ? (stats.rec_yd || 0) / stats.rr : 0);
      } else if (key === "ypr") {
        value = typeof stats.ypr === "number" ? stats.ypr : ((stats.rec || 0) > 0 ? (stats.rec_yd || 0) / stats.rec : 0);
      } else if (key === "first_down_rec_rate") {
        value = typeof stats.first_down_rec_rate === "number" ? stats.first_down_rec_rate : ((stats.rec || 0) > 0 ? (stats.rec_fd || 0) / stats.rec : 0);
      } else if (key === "imp_per_g") {
        value = typeof stats.imp_per_g === "number" ? stats.imp_per_g : (stats.imp || 0);
      } else if (["prs_pct", "snp_pct", "cmp_pct", "ttt"].includes(key)) {
        value = typeof stats[key] === "number" ? stats[key] : 0;
      } else {
        value = stats[key] || 0;
      }

      let displayValue;
      if (value === null || typeof value !== "number") displayValue = key === "fpts" ? "-" : "N/A";
      else if (["yco_per_att", "mtf_per_att", "ypc", "ttt", "ypr", "yprr", "first_down_rec_rate"].includes(key)) displayValue = value.toFixed(2);
      else if (["pass_imp_per_att", "prs_pct", "snp_pct", "ts_per_rr", "cmp_pct"].includes(key)) displayValue = formatPercentage(value);
      else if (key === "pass_rtg" || key === "fpts") displayValue = value.toFixed(1);
      else displayValue = Number.isInteger(value) ? String(value) : value.toFixed(2);
      rowData[key] = createTextDescriptor(displayValue);
    });

    if (rowFptsDash && !isByeWeek) rowMeta.rowClasses.push("dnp-week-row");
    if (!isUnplayedWeek && weekStatsEntry) gameLogsWithData.push(weekStatsEntry);
    tableRows.push(rowData);
    rowsMeta.push(rowMeta);
  }

  const sleeperCurrentWeek = Number.isFinite(dataHubGameLogsState.currentNflWeek) ? dataHubGameLogsState.currentNflWeek : null;
  let dividerIndex = rowsMeta.length;
  if (Number.isFinite(sleeperCurrentWeek)) {
    const currentWeekIndex = rowsMeta.findIndex((meta) => meta.week === sleeperCurrentWeek);
    if (currentWeekIndex !== -1) {
      dividerIndex = rowsMeta[currentWeekIndex].isPlayed ? currentWeekIndex + 1 : currentWeekIndex;
    }
  }
  if (!rowsMeta.some((meta) => meta.isPlayed)) dividerIndex = 0;
  dividerIndex = Math.max(0, Math.min(dividerIndex, rowsMeta.length));

  const createSectionTable = () => {
    const table = document.createElement("table");
    table.className = "game-logs-table";
    const colgroup = document.createElement("colgroup");
    tableColumns.forEach((column) => {
      const col = document.createElement("col");
      const size = columnWidths[column.id] || defaultColumnWidth;
      col.style.width = `${size}px`;
      colgroup.append(col);
    });
    table.append(colgroup);
    return table;
  };

  const headerWrapper = document.createElement("div");
  headerWrapper.className = "game-logs-table-header";
  const headerTable = createSectionTable();
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  tableColumns.forEach((column) => {
    const th = document.createElement("th");
    if (column.headerClass) column.headerClass.split(" ").forEach((className) => className && th.classList.add(className));
    th.textContent = column.label;
    headerRow.append(th);
  });
  thead.append(headerRow);
  headerTable.append(thead);
  headerWrapper.append(headerTable);

  const bodyWrapper = document.createElement("div");
  bodyWrapper.className = "game-logs-table-body";
  const bodyTable = createSectionTable();
  const tbody = document.createElement("tbody");
  tableRows.forEach((rowData, rowIndex) => {
    const tr = document.createElement("tr");
    rowsMeta[rowIndex].domRow = tr;
    rowsMeta[rowIndex].rowClasses.forEach((className) => tr.classList.add(className));
    tableColumns.forEach((column) => {
      const td = document.createElement("td");
      if (column.cellClass) column.cellClass.split(" ").forEach((className) => className && td.classList.add(className));
      rowData[column.id]?.render?.(td);
      tr.append(td);
    });
    tbody.append(tr);
  });
  if (rowsMeta.length) {
    const dividerRow = document.createElement("tr");
    dividerRow.className = "week-divider-row";
    const dividerCell = document.createElement("td");
    dividerCell.colSpan = tableColumns.length;
    dividerRow.append(dividerCell);
    tbody.insertBefore(dividerRow, rowsMeta[dividerIndex]?.domRow || null);
  }
  bodyTable.append(tbody);
  bodyWrapper.append(bodyTable);

  const footerWrapper = document.createElement("div");
  footerWrapper.className = "game-logs-table-footer";
  const footerTable = createSectionTable();
  const tfoot = document.createElement("tfoot");
  footerTable.append(tfoot);
  footerWrapper.append(footerTable);

  const seasonTotals = dataHubGameLogsState.playerSeasonStats?.[player.id] || null;
  const aggregatedTotals = {};
  const snapPctValues = [];
  const statValueCounts = {};
  gameLogsWithData.forEach((weekStats) => {
    Object.entries(weekStats.stats || {}).forEach(([key, rawValue]) => {
      const numericValue = Number.parseFloat(rawValue);
      if (Number.isNaN(numericValue)) return;
      if (key === "snp_pct") {
        snapPctValues.push(numericValue);
      } else {
        aggregatedTotals[key] = (aggregatedTotals[key] || 0) + numericValue;
      }
      statValueCounts[key] = (statValueCounts[key] || 0) + 1;
    });
  });

  dataHubGameLogsState.currentFooterStats = { __gamesPlayed: gameLogsWithData.length };
  if (gameLogsWithData.length > 0) {
    const footerHeaderRow = document.createElement("tr");
    tableColumns.forEach((column, index) => {
      const th = document.createElement("th");
      if (index === 0) th.classList.add("modal-table-footer-label", "week-column-header");
      if (column.headerClass) column.headerClass.split(" ").forEach((className) => className && th.classList.add(className));
      th.textContent = column.id === "week" ? "SZN" : column.label;
      footerHeaderRow.append(th);
    });
    tfoot.append(footerHeaderRow);

    const footerRow = document.createElement("tr");
    const totalTh = document.createElement("th");
    totalTh.className = "modal-table-footer-label week-column-header";
    const gamesPlayed = Number.isFinite(seasonTotals?.games_played)
      ? Math.round(seasonTotals.games_played)
      : (Number.isFinite(playerRanks?.gamesPlayed) ? playerRanks.gamesPlayed : gameLogsWithData.length);
    totalTh.innerHTML = `<span class="season-label">2025</span><br><span class="gp-label">(GP: ${gamesPlayed})</span>`;
    footerRow.append(totalTh);

    const footerStatsForRadar = {};
    for (let index = 1; index < tableColumns.length; index += 1) {
      const column = tableColumns[index];
      const key = column.id;
      const td = document.createElement("td");
      if (column.cellClass) column.cellClass.split(" ").forEach((className) => className && td.classList.add(className));
      if (key === "proj") {
        td.textContent = "-";
        footerRow.append(td);
        continue;
      }
      const displayValue = getGameLogsSeasonDisplayValue({
        key,
        seasonTotals,
        aggregatedTotals,
        snapPctValues,
        statValueCounts,
        gameLogsWithData,
        player,
      });
      const rankValue = getSeasonRankValue(player.id, key);
      const annotation = createRankAnnotation(rankValue, { wrapInParens: false, ordinal: true, variant: "gamelogs-footer" });
      annotation.classList.add("stat-rank-annotation--bulleted");
      annotation.style.color = getConditionalColorByRank(rankValue, player.pos);
      annotation.prepend(Object.assign(document.createElement("span"), { className: "stat-rank-bullet", textContent: "•" }));
      annotation.append(Object.assign(document.createElement("span"), { className: "stat-rank-bullet", textContent: "•" }));

      const valueSpan = document.createElement("span");
      valueSpan.className = "stat-value";
      valueSpan.textContent = displayValue;
      td.append(valueSpan, annotation);
      td.classList.add("has-rank-annotation");
      const numericValue = Number.parseFloat(String(displayValue).replace(/[,%]/g, ""));
      if (!Number.isNaN(numericValue)) footerStatsForRadar[key] = numericValue;
      footerRow.append(td);
    }
    if (footerStatsForRadar.fpts !== undefined) {
      footerStatsForRadar.__gamesPlayed = gameLogsWithData.length;
      footerStatsForRadar.ppg = gameLogsWithData.length > 0 ? footerStatsForRadar.fpts / gameLogsWithData.length : 0;
    }
    dataHubGameLogsState.currentFooterStats = footerStatsForRadar;
    tfoot.append(footerRow);
  } else {
    footerWrapper.classList.add("hidden");
  }

  const hScroll = document.createElement("div");
  hScroll.className = "game-logs-hscroll";
  const hContent = document.createElement("div");
  hContent.className = "game-logs-hscroll-content";
  hContent.append(headerWrapper, bodyWrapper, footerWrapper);
  hScroll.append(hContent);
  container.append(hScroll);
  gameLogsModalBody.append(container);

  const sznContainer = document.createElement("div");
  sznContainer.className = "game-logs-szn-view hidden";
  renderGameLogsSeasonStatsView({
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
  gameLogsModalBody.append(sznContainer);

  prepareConsistencyPanel(player);
  const summaryChipsWidth = gameLogsModalSummaryChips.offsetWidth;
  const playerVitalsElement = gameLogsModalRoot.querySelector(".player-vitals--modal");
  if (playerVitalsElement && summaryChipsWidth > 0) {
    playerVitalsElement.style.width = `${summaryChipsWidth}px`;
  }
  setGameLogsModalView(dataHubGameLogsState.currentView || "gl");
}

function getConsistencyAxisWeeks() {
  return Object.keys(PLAYER_STATS_SHEETS.weeks).map(Number).filter(Number.isFinite).sort((left, right) => left - right);
}

function getConsistencyThresholds(position) {
  const key = String(position || "").toUpperCase();
  return CONSISTENCY_THRESHOLD_MAP[key] || CONSISTENCY_THRESHOLD_MAP.DEFAULT;
}

function clampConsistencyPoints(value) {
  if (!Number.isFinite(value)) return null;
  return Math.max(0, Math.min(MAX_CONSISTENCY_POINTS, value));
}

function getConsistencyBucket(points, thresholds) {
  if (!Number.isFinite(points)) return { ...CONSISTENCY_BUCKET_STYLES.low, name: "low" };
  if (points >= thresholds.high) return { ...CONSISTENCY_BUCKET_STYLES.high, name: "high" };
  if (points >= thresholds.solid) return { ...CONSISTENCY_BUCKET_STYLES.solid, name: "solid" };
  return { ...CONSISTENCY_BUCKET_STYLES.low, name: "low" };
}

function getRankAccentColor(rank) {
  if (!Number.isFinite(rank)) return "#f8faff";
  if (rank <= 12) return "#7cf5ff";
  if (rank <= 24) return "#56c4ff";
  return "#d3a5ff";
}

function formatHudPercentage(value, decimals = 1) {
  return Number.isFinite(value) ? `${Number(value).toFixed(decimals)}%` : "N/A";
}

function formatCeilingValue(value) {
  return Number.isFinite(value) ? Number(value).toFixed(1) : "N/A";
}

function pluralizeWeeks(count) {
  if (!count) return "No weeks charted";
  return count === 1 ? "1 week charted" : `${count} weeks charted`;
}

function shouldSkipConsistencyWeek(statsForWeek) {
  if (!statsForWeek) return false;
  const rawFpts = statsForWeek.fpt_ppr;
  const numericFpts = typeof rawFpts === "number" ? rawFpts : Number(rawFpts);
  if (Number.isFinite(numericFpts) && numericFpts > 0.5) return false;
  const rawProj = statsForWeek.proj;
  if (rawProj === undefined || rawProj === null) return false;
  if (typeof rawProj === "number" && Number.isFinite(rawProj)) return false;
  const trimmedProj = String(rawProj).trim();
  if (!trimmedProj) return false;
  if (Number.isFinite(Number(trimmedProj))) return false;
  return CONSISTENCY_PROJECTION_SKIP_CODES.has(trimmedProj.toUpperCase());
}

function formatProjReason(rawProj) {
  if (rawProj === undefined || rawProj === null) return "";
  return String(rawProj).trim().toUpperCase();
}

function buildConsistencyPanelData(player) {
  if (!player?.id) return null;
  const axisWeeks = getConsistencyAxisWeeks();
  if (!axisWeeks.length) return null;

  const playerId = player.id;
  const weeklyStats = dataHubGameLogsState.playerWeeklyStats || {};
  const thresholds = getConsistencyThresholds(player.pos);
  const series = [];
  const skippedLabels = {};

  axisWeeks.forEach((week) => {
    const statsForWeek = weeklyStats?.[week]?.[playerId];
    if (!statsForWeek) return;
    const projectionReason = formatProjReason(statsForWeek.proj);
    if (shouldSkipConsistencyWeek(statsForWeek)) {
      if (projectionReason) skippedLabels[week] = projectionReason;
      return;
    }
    const opponent = String(statsForWeek.opponent || "").toUpperCase();
    if (opponent === "BYE") {
      skippedLabels[week] = "BYE";
      return;
    }
    const numericFpts = typeof statsForWeek.fpt_ppr === "number" ? statsForWeek.fpt_ppr : Number(statsForWeek.fpt_ppr);
    if (!Number.isFinite(numericFpts)) return;
    const clampedPoints = clampConsistencyPoints(numericFpts);
    if (clampedPoints === null) return;
    series.push({
      week,
      pts: clampedPoints,
      originalPts: numericFpts,
      opponent: statsForWeek.opponent || "",
    });
  });

  series.sort((left, right) => left.week - right.week);
  const seasonTotals = dataHubGameLogsState.playerSeasonStats?.[playerId] || {};
  const consistencyPct = Number(seasonTotals.csty_pct);
  const ceilingValue = Number(seasonTotals.ceiling);
  const consistencyRank = getSeasonRankValue(playerId, "csty_pct");
  const ceilingRank = getSeasonRankValue(playerId, "ceiling");
  const weekRangeLabel = axisWeeks[0] === axisWeeks[axisWeeks.length - 1]
    ? `Week ${axisWeeks[0]}`
    : `Weeks ${axisWeeks[0]}–${axisWeeks[axisWeeks.length - 1]}`;

  const bestGame = series.reduce((best, entry) => (!best || entry.pts > best.pts ? entry : best), null);
  const lastFive = series.slice(-5);
  const lastFiveAvg = lastFive.length
    ? lastFive.reduce((sum, entry) => sum + (Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts), 0) / lastFive.length
    : null;

  return {
    playerId,
    playerName: player.name || "Player",
    position: player.pos,
    axisWeeks,
    series,
    chartedWeeksCount: series.length,
    gamesPlayed: Number.isFinite(seasonTotals.games_played) ? seasonTotals.games_played : series.length,
    thresholds,
    consistencyPct: Number.isFinite(consistencyPct) ? consistencyPct : null,
    ceilingValue: Number.isFinite(ceilingValue) ? ceilingValue : null,
    consistencyRank: Number.isFinite(consistencyRank) ? consistencyRank : null,
    ceilingRank: Number.isFinite(ceilingRank) ? ceilingRank : null,
    weekRangeLabel,
    weeksChartedLabel: pluralizeWeeks(series.length),
    ceilingRankMax: RADAR_STATS_CONFIG[player.pos]?.maxRank || 32,
    bestGame,
    lastFiveAvg,
    highWeekCount: series.filter((entry) => entry.pts >= thresholds.high).length,
    solidHighCount: series.filter((entry) => entry.pts >= thresholds.solid).length,
    totalWeeks: series.length,
    skippedLabels,
  };
}

function updateConsistencyHud(data) {
  if (!gameLogsConsistencyContainer) return;
  gameLogsConsistencyContainer.querySelector("[data-week-range]")?.replaceChildren(document.createTextNode(data?.weekRangeLabel || "Weeks —"));
  gameLogsConsistencyContainer.querySelector("[data-weeks-charted]")?.replaceChildren(document.createTextNode(data?.weeksChartedLabel || "No weeks charted"));
  const consistencyRankEl = gameLogsConsistencyContainer.querySelector("[data-consistency-rank]");
  if (consistencyRankEl) consistencyRankEl.textContent = Number.isFinite(data?.consistencyRank) ? `#${data.consistencyRank}` : "NA";
  const ceilingValueEl = gameLogsConsistencyContainer.querySelector("[data-ceiling-value]");
  if (ceilingValueEl) ceilingValueEl.textContent = formatCeilingValue(data?.ceilingValue);
  const consistencyCircleValue = gameLogsConsistencyContainer.querySelector("[data-consistency-circle-value]");
  if (consistencyCircleValue) consistencyCircleValue.textContent = formatHudPercentage(data?.consistencyPct);
  const ceilingCircleRank = gameLogsConsistencyContainer.querySelector("[data-ceiling-circle-rank]");
  if (ceilingCircleRank) {
    if (Number.isFinite(data?.ceilingRank)) {
      const rankInt = Math.round(data.ceilingRank);
      const suffix = ordinalSuffix(rankInt).slice(String(rankInt).length);
      ceilingCircleRank.innerHTML = `${rankInt}<span class="ceiling-rank-suffix">${suffix}</span>`;
    } else {
      ceilingCircleRank.textContent = "NA";
    }
  }
  const bestEl = gameLogsConsistencyContainer.querySelector("[data-insight-best]");
  if (bestEl) {
    if (Number.isFinite(data?.highWeekCount) && Number.isFinite(data?.gamesPlayed) && data.gamesPlayed > 0) {
      const percentage = (data.highWeekCount / data.gamesPlayed) * 100;
      const color = percentage > 40
        ? CONSISTENCY_HUD_CONDITIONAL_COLORS.high
        : (percentage < 23 ? CONSISTENCY_HUD_CONDITIONAL_COLORS.low : CONSISTENCY_HUD_CONDITIONAL_COLORS.solid);
      bestEl.innerHTML = `<span style="color:${color}">${percentage.toFixed(1)}</span><span class="hud-insight-suffix">%</span>`;
    } else {
      bestEl.textContent = "—";
    }
  }
  const lastFiveEl = gameLogsConsistencyContainer.querySelector("[data-insight-last5]");
  if (lastFiveEl) {
    if (Number.isFinite(data?.lastFiveAvg)) {
      const bucket = getConsistencyBucket(data.lastFiveAvg, data.thresholds);
      const color = bucket.name === "high"
        ? CONSISTENCY_HUD_CONDITIONAL_COLORS.high
        : (bucket.name === "solid" ? CONSISTENCY_HUD_CONDITIONAL_COLORS.solid : CONSISTENCY_HUD_CONDITIONAL_COLORS.low);
      lastFiveEl.innerHTML = `<span style="color:${color}">${data.lastFiveAvg.toFixed(1)}</span><span class="hud-insight-suffix"> fpts</span>`;
    } else {
      lastFiveEl.textContent = "—";
    }
  }
  const cstyCountEl = gameLogsConsistencyContainer.querySelector("[data-insight-cstycount]");
  if (cstyCountEl) {
    if (Number.isFinite(data?.solidHighCount) && Number.isFinite(data?.totalWeeks) && data.totalWeeks > 0) {
      cstyCountEl.innerHTML = `<span class="csty-made" style="color:${getRankAccentColor(data.consistencyRank)}">${data.solidHighCount}</span><span class="hud-insight-suffix">/${data.totalWeeks}</span>`;
    } else {
      cstyCountEl.textContent = "—";
    }
  }
}

function prepareConsistencyPanel(player) {
  dataHubGameLogsState.currentConsistencyData = buildConsistencyPanelData(player);
  updateConsistencyHud(dataHubGameLogsState.currentConsistencyData);
}

function renderZoneSummary(data) {
  const container = gameLogsConsistencyContainer?.querySelector("#weekly-zone-summary");
  if (!container) return;
  const lowEl = container.querySelector("[data-zone-low]");
  const solidEl = container.querySelector("[data-zone-solid]");
  const highEl = container.querySelector("[data-zone-high]");
  const lowThresholdEl = container.querySelector("[data-threshold-low]");
  const solidThresholdEl = container.querySelector("[data-threshold-solid]");
  const highThresholdEl = container.querySelector("[data-threshold-high]");
  if (!data?.series?.length) {
    if (lowEl) lowEl.textContent = "0";
    if (solidEl) solidEl.textContent = "0";
    if (highEl) highEl.textContent = "0";
    if (lowThresholdEl) lowThresholdEl.textContent = "";
    if (solidThresholdEl) solidThresholdEl.textContent = "";
    if (highThresholdEl) highThresholdEl.textContent = "";
    return;
  }
  const thresholds = data.thresholds;
  const solidRounded = Math.round(thresholds.solid);
  const highRounded = Math.round(thresholds.high);
  if (lowThresholdEl) lowThresholdEl.textContent = `(<${solidRounded}):`;
  if (solidThresholdEl) solidThresholdEl.textContent = `(${solidRounded}-${highRounded}):`;
  if (highThresholdEl) highThresholdEl.textContent = `(≥${highRounded}):`;
  let low = 0;
  let solid = 0;
  let high = 0;
  data.series.forEach((entry) => {
    if (entry.pts >= thresholds.high) high += 1;
    else if (entry.pts >= thresholds.solid) solid += 1;
    else low += 1;
  });
  if (lowEl) lowEl.textContent = String(low);
  if (solidEl) solidEl.textContent = String(solid);
  if (highEl) highEl.textContent = String(high);
}

function getEdgePaddingPct(slotCount) {
  return slotCount > 1 ? CONSISTENCY_EDGE_PADDING_PCT : 0;
}

function renderXAxis(data) {
  const xAxis = gameLogsConsistencyContainer?.querySelector("#weekly-chart-x-axis");
  if (!xAxis) return;
  xAxis.innerHTML = "";
  const isMobile = window.matchMedia("(max-width: 540px)").matches;
  const weeks = data?.axisWeeks?.length ? data.axisWeeks : getConsistencyAxisWeeks();
  const playedWeeks = new Set(Array.isArray(data?.series) ? data.series.map((entry) => entry.week) : []);
  const totalSlots = weeks.length || 1;
  const spanSlots = Math.max(1, totalSlots - 1);
  const paddingPct = getEdgePaddingPct(totalSlots);
  weeks.forEach((week, slotIndex) => {
    const pctX = totalSlots === 1 ? 50 : paddingPct + ((100 - paddingPct * 2) * (slotIndex / spanSlots));
    const span = document.createElement("span");
    if (isMobile) {
      span.innerHTML = `<span class="axis-week-prefix">wk</span><span class="axis-week-number">${week}</span>`;
    } else {
      span.textContent = `WK${week}`;
    }
    if (playedWeeks.size && !playedWeeks.has(week)) span.classList.add("axis-week-missed");
    span.style.left = `${pctX}%`;
    xAxis.append(span);
  });
}

function ensureCurveInfrastructure(pointsLayer) {
  if (!curveSvg) {
    curveSvg = document.createElementNS(SVG_NS, "svg");
    curveSvg.setAttribute("class", "weekly-curve-layer");
    curveSvg.style.position = "absolute";
    curveSvg.style.inset = "0";
    curveSvg.style.pointerEvents = "none";
  }
  if (!pointsLayer.contains(curveSvg)) pointsLayer.prepend(curveSvg);
  let defs = curveSvg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    curveSvg.append(defs);
  }
  let areaPath = curveSvg.querySelector(".weekly-area-path");
  if (!areaPath) {
    areaPath = document.createElementNS(SVG_NS, "path");
    areaPath.setAttribute("class", "weekly-area-path");
    curveSvg.append(areaPath);
  }
  let lineGroup = curveSvg.querySelector(".weekly-line-group");
  if (!lineGroup) {
    lineGroup = document.createElementNS(SVG_NS, "g");
    lineGroup.setAttribute("class", "weekly-line-group");
    curveSvg.append(lineGroup);
  }
  return { svg: curveSvg, defs, areaPath, lineGroup };
}

function clampGradientOffset(value) {
  return Math.min(1, Math.max(0, value));
}

function updateAreaGradient(defs, height, thresholds) {
  let gradient = defs.querySelector(`#${CONSISTENCY_AREA_GRADIENT_ID}`);
  if (!gradient) {
    gradient = document.createElementNS(SVG_NS, "linearGradient");
    gradient.id = CONSISTENCY_AREA_GRADIENT_ID;
    defs.append(gradient);
  }
  gradient.setAttribute("gradientUnits", "userSpaceOnUse");
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", `${height}`);
  gradient.setAttribute("x2", "0");
  gradient.setAttribute("y2", "0");
  const solidOffset = clampGradientOffset((thresholds?.solid || 0) / MAX_CONSISTENCY_POINTS);
  const highOffset = clampGradientOffset((thresholds?.high || 0) / MAX_CONSISTENCY_POINTS);
  const stops = [
    { offset: 0, color: CONSISTENCY_GRADIENT_COLORS.low },
    { offset: solidOffset, color: CONSISTENCY_GRADIENT_COLORS.solid },
    { offset: highOffset, color: CONSISTENCY_GRADIENT_COLORS.high },
    { offset: 1, color: CONSISTENCY_GRADIENT_COLORS.high },
  ];
  gradient.innerHTML = "";
  stops.forEach((stopDefinition) => {
    const stop = document.createElementNS(SVG_NS, "stop");
    stop.setAttribute("offset", clampGradientOffset(stopDefinition.offset).toFixed(3));
    stop.setAttribute("stop-color", stopDefinition.color);
    gradient.append(stop);
  });
}

function yFromPoints(points) {
  const clamped = Math.max(0, Math.min(points, MAX_CONSISTENCY_POINTS));
  const rawPct = (1 - clamped / MAX_CONSISTENCY_POINTS) * 100;
  const paddedRange = 100 - (CONSISTENCY_VERTICAL_PADDING_PCT * 2);
  return CONSISTENCY_VERTICAL_PADDING_PCT + (rawPct / 100) * paddedRange;
}

function drawSegmentedCurve(pointsLayer, relPoints, data) {
  if (!pointsLayer || relPoints.length < 2) return;
  const box = pointsLayer.getBoundingClientRect();
  const width = box.width || pointsLayer.clientWidth || pointsLayer.offsetWidth;
  const height = box.height || pointsLayer.clientHeight || pointsLayer.offsetHeight;
  if (!width || !height) return;

  const absPoints = relPoints.map((point) => ({
    x: (point.x / 100) * width,
    y: (point.y / 100) * height,
    value: point.value,
  }));
  const { svg, defs, areaPath, lineGroup } = ensureCurveInfrastructure(pointsLayer);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  updateAreaGradient(defs, height, data.thresholds);
  areaPath.setAttribute("d", `${buildCurvePath(absPoints)} L ${absPoints[absPoints.length - 1].x} ${height} L ${absPoints[0].x} ${height} Z`);
  areaPath.setAttribute("fill", `url(#${CONSISTENCY_AREA_GRADIENT_ID})`);
  areaPath.setAttribute("fill-opacity", "0.92");
  lineGroup.innerHTML = "";
  for (let index = 0; index < absPoints.length - 1; index += 1) {
    const p0 = absPoints[index];
    const p1 = absPoints[index + 1];
    const dx = (p1.x - p0.x) * 0.35;
    const average = (p0.value + p1.value) / 2;
    const bucket = getConsistencyBucket(average, data.thresholds);
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `M ${p0.x} ${p0.y} C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", bucket.color);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    lineGroup.append(path);
  }
}

function buildCurvePath(absPoints) {
  if (absPoints.length < 2) return "";
  let d = `M ${absPoints[0].x} ${absPoints[0].y}`;
  for (let index = 0; index < absPoints.length - 1; index += 1) {
    const p0 = absPoints[index];
    const p1 = absPoints[index + 1];
    const dx = (p1.x - p0.x) * 0.35;
    d += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function extendCurvePoints(points) {
  if (!points?.length) return [];
  if (points.length === 1) {
    return [{ ...points[0], x: 0 }, { ...points[0], x: 100 }];
  }
  return [{ ...points[0], x: 0 }, ...points, { ...points[points.length - 1], x: 100 }];
}

function renderPoints(data) {
  const pointsLayer = gameLogsConsistencyContainer?.querySelector("#weekly-chart-points");
  if (!pointsLayer) return;
  pointsLayer.querySelectorAll(".weekly-point, .weekly-skip-label").forEach((node) => node.remove());
  if (curveSvg) {
    curveSvg.remove();
    curveSvg = null;
  }
  if (!data.series.length) return;

  const axisWeeks = data.axisWeeks.length ? data.axisWeeks : data.series.map((entry) => entry.week);
  const totalSlots = axisWeeks.length || data.series.length || 1;
  const spanSlots = Math.max(1, totalSlots - 1);
  const edgePaddingPct = getEdgePaddingPct(totalSlots);
  const curvePoints = [];

  data.series.forEach((entry) => {
    const slotIndex = Math.max(0, axisWeeks.indexOf(entry.week));
    const pctX = totalSlots === 1 ? 50 : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const pctY = yFromPoints(entry.pts);
    curvePoints.push({ x: pctX, y: pctY, value: entry.pts });
    const bucket = getConsistencyBucket(entry.pts, data.thresholds);
    const point = document.createElement("div");
    point.className = "weekly-point";
    point.dataset.zone = bucket.name;
    point.style.setProperty("--point-color", bucket.color);
    point.style.left = `${pctX}%`;
    point.style.top = `${pctY}%`;
    point.innerHTML = `
      <div class="weekly-point-label weekly-point-label--${bucket.name}">
        <span class="weekly-point-label__suffix">wk${entry.week}</span>
        <span class="weekly-point-label__value"><span style="color:${bucket.color}">${(Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts).toFixed(1)}</span></span>
      </div>
    `;
    pointsLayer.append(point);
  });

  Object.entries(data.skippedLabels || {}).forEach(([weekKey, label]) => {
    const week = Number(weekKey);
    const playedWeekSet = new Set(data.series.map((entry) => entry.week));
    if (playedWeekSet.has(week)) return;
    const slotIndex = Math.max(0, axisWeeks.indexOf(week));
    const pctX = totalSlots === 1 ? 50 : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const previous = [...data.series].reverse().find((entry) => entry.week < week);
    const next = data.series.find((entry) => entry.week > week);
    let interpolated = null;
    if (previous && next && next.week !== previous.week) {
      const t = (week - previous.week) / (next.week - previous.week);
      interpolated = previous.pts + (next.pts - previous.pts) * t;
    } else if (previous) {
      interpolated = previous.pts;
    } else if (next) {
      interpolated = next.pts;
    }
    if (!Number.isFinite(interpolated)) return;
    const marker = document.createElement("div");
    marker.className = "weekly-skip-label";
    marker.textContent = label;
    marker.style.left = `${pctX}%`;
    marker.style.top = `${yFromPoints(interpolated)}%`;
    pointsLayer.append(marker);
  });

  drawSegmentedCurve(pointsLayer, extendCurvePoints(curvePoints), data);
}

function hydrateProgressCircles(data) {
  const consistencyCircle = gameLogsConsistencyContainer?.querySelector(".progress-circle--consistency .progress-ring-fill");
  if (consistencyCircle) {
    const pctValue = data && Number.isFinite(data.consistencyPct) ? Math.max(0, Math.min(100, data.consistencyPct)) / 100 : 0;
    consistencyCircle.style.setProperty("--progress", pctValue.toFixed(3));
    consistencyCircle.setAttribute("stroke", getRankAccentColor(data?.consistencyRank));
  }
  const ceilingCircle = gameLogsConsistencyContainer?.querySelector(".progress-circle--ceiling .progress-ring-fill--ceiling");
  if (ceilingCircle) {
    const rankMax = Math.max(2, data?.ceilingRankMax || 24);
    const rank = Number.isFinite(data?.ceilingRank) ? data.ceilingRank : rankMax;
    const normalized = Math.max(0, Math.min(1, (rankMax - rank) / (rankMax - 1)));
    ceilingCircle.style.setProperty("--progress", normalized.toFixed(3));
    ceilingCircle.setAttribute("stroke", getRankAccentColor(data?.ceilingRank));
  }
}

function renderConsistencyChart() {
  if (!gameLogsConsistencyContainer) return;
  const chartBox = gameLogsConsistencyContainer.querySelector("#weekly-chart-box");
  const pointsLayer = gameLogsConsistencyContainer.querySelector("#weekly-chart-points");
  const xAxis = gameLogsConsistencyContainer.querySelector("#weekly-chart-x-axis");
  if (!chartBox || !pointsLayer || !xAxis) return;
  const data = dataHubGameLogsState.currentConsistencyData;
  updateConsistencyHud(data);
  requestAnimationFrame(() => {
    renderXAxis(data || { axisWeeks: getConsistencyAxisWeeks() });
    renderZoneSummary(data);
    if (!data) {
      pointsLayer.querySelectorAll(".weekly-point, .weekly-skip-label").forEach((node) => node.remove());
      if (curveSvg) {
        curveSvg.remove();
        curveSvg = null;
      }
      hydrateProgressCircles(null);
      return;
    }
    renderPoints(data);
    hydrateProgressCircles(data);
  });
}
