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
  rows: [],
  displayedRows: [],
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
  syncUiState();
  updatePageTabsGlint();
  renderTable();
  showOverlay({
    title: "Preparing SZN.csv",
    description:
      "Building the Data Hub table and mapping the requested stat views.",
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

  primaryTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.primaryTab = button.dataset.primaryTab;
      syncUiState();
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
    const csvText = await fetchCsvText();
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

async function handlePickedFile(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    showOverlay({
      title: "Importing SZN.csv",
      description:
        "Parsing the selected local file and rebuilding the category views.",
    });
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
  const parsedRows = parseCsv(csvText);
  state.rows = parsedRows
    .filter((row) => (row.NM || "").trim() || (row.POS || "").trim())
    .map(normalizeRow);

  refreshGrid();
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

  if (column.name === FPTS_COLUMN && !isMissingValue(value)) {
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
// stay stable even when the source file omits optional fields.
function normalizeRow(sourceRow) {
  const normalized = {};

  for (const columnName of ALL_COLUMNS) {
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
