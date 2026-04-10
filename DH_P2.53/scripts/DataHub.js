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
// DataHub sort defaults:
// VALUE desc is the baseline table order, and every non-default third click
// returns the grid to this exact sort state.
const DEFAULT_SORT = Object.freeze({
  column: "VALUE",
  direction: "desc",
});
const LOWER_IS_BETTER_SORT_COLUMNS = new Set([
  "RK",
  "AGE",
  "ADP",
  "POS·ADP",
  "TTT",
  "PRS%",
  "SAC",
  "INT",
  "FUM",
]);
const TEXT_SORT_COLUMNS = new Set(["PLAYER", "POS", "TM"]);
const SORT_ICON_PATHS = Object.freeze({
  ArrowDownWideNarrow: [
    "m3 16 4 4 4-4",
    "M7 20V4",
    "M11 4h10",
    "M11 8h7",
    "M11 12h4",
  ],
  ArrowUpWideNarrow: [
    "m3 8 4-4 4 4",
    "M7 4v16",
    "M11 20h10",
    "M11 16h7",
    "M11 12h4",
  ],
  ArrowDownNarrowWide: [
    "m3 16 4 4 4-4",
    "M7 20V4",
    "M11 4h4",
    "M11 8h7",
    "M11 12h10",
  ],
  ArrowUpNarrowWide: [
    "m3 8 4-4 4 4",
    "M7 4v16",
    "M11 20h4",
    "M11 16h7",
    "M11 12h10",
  ],
});

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
  RK: 32,
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
  sort: createDefaultSort(),
  isCompactViewport: isCompactViewport(),
  columnFormatting: Object.create(null),
  // DataHub game logs modal state:
  // keep all modal data local to this page so the DataHub port never depends on
  // shared Stats-page globals or app.js startup wiring.
  modalRankCache: Object.create(null),
  sleeperPlayers: Object.create(null),
  userId: "",
  username: "",
  ownershipContext: null,
  ownershipPreferredKtcMode: "oneqb",
  leagues: [],
  gameLogsDataLoaded: false,
  gameLogsDataPromise: null,
  playerSeasonStats: Object.create(null),
  playerSeasonRanks: Object.create(null),
  playerWeeklyStats: Object.create(null),
  weeklyStats: Object.create(null),
  liveWeeklyStats: Object.create(null),
  playerProjectionWeeks: Object.create(null),
  liveStatsLoaded: false,
  lastLiveStatsWeek: null,
  lastLiveStatsFetchTs: 0,
  currentNflSeason: 2025,
  currentNflWeek: null,
  currentGameLogsPlayer: null,
  currentGameLogsPlayerRanks: null,
  currentGameLogsSummary: null,
  currentGameLogsFooterStats: null,
  currentGameLogsView: "gl",
  currentConsistencyData: null,
  currentModalSeason: "2025",
  currentGameLogsTriggerButton: null,
};

// ---------------------------------------------------------------------------
// DOM anchors that define the page shell around the custom table renderer.
// ---------------------------------------------------------------------------
const mainTitle = document.querySelector("#main-title");
const activeViewLabel = document.querySelector("#active-view-label");
const rowCount = document.querySelector("#row-count");
const overlay = document.querySelector("#datahub-page-loading");
const overlayTitle = document.querySelector("#overlay-title");
const overlayDescription = document.querySelector("#overlay-description");
const overlayActions = document.querySelector("#overlay-actions");
const filePickerButton = document.querySelector("#file-picker-button");
const filePickerInput = document.querySelector("#file-picker-input");
const playerSearch = document.querySelector("#player-search");
const gridContainer = document.querySelector("#player-grid");
const gameLogsModal = document.querySelector("#game-logs-modal");
const modalOverlay = document.querySelector("#game-logs-modal .modal-overlay");
const modalPlayerName = document.querySelector("#modal-player-name");
const modalPlayerVitals = document.querySelector("#modal-player-vitals");
const modalSummaryChips = document.querySelector("#modal-summary-chips");
const modalBody = document.querySelector("#modal-body");
const statsKeyContainer = document.querySelector("#stats-key-container");
const radarChartContainer = document.querySelector("#radar-chart-container");
const consistencyContainer = document.querySelector("#consistency-container");
const gameLogsModalTabs = Array.from(
  document.querySelectorAll("#game-logs-modal .gamelogs-modal-tab"),
);
const gameLogsViewButtons = Array.from(
  document.querySelectorAll("#game-logs-modal .gamelogs-view-option"),
);
const gameLogsSeasonButtons = Array.from(
  document.querySelectorAll("#game-logs-modal .gamelogs-season-tab"),
);
const modalInfoButtons = Array.from(
  document.querySelectorAll("#game-logs-modal .modal-info-btn"),
);
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
  // DataHub modal wiring is deferred until the current script finishes
  // evaluating so the local game-logs constants are initialized first.
  queueMicrotask(() => {
    attachGameLogsModalListeners();
  });

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
      posRank: getNormalizedSheetValue(normalizedRow, ["POS RK", "POS_RK", "POS|RK", "POS | RK"]),
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
    state.modalRankCache = Object.create(null);
    refreshGrid();
    return;
  }

  const ktcLookup = getActiveKtcLookup();
  const adpLookup = state.adpByPlayerId || Object.create(null);

  state.rows = state.rawSeasonRows.map((row) => {
    const enrichedRow = enrichSeasonRow(row, ktcLookup, adpLookup);
    return normalizeRow(enrichedRow);
  });
  state.modalRankCache = buildDataHubModalRankCache(state.rows);

  refreshGrid();
}

function enrichSeasonRow(sourceRow, ktcLookup, adpLookup) {
  const enrichedRow = { ...sourceRow };
  const playerId = String(sourceRow.SLPR_ID || sourceRow.slpr_id || "").trim();
  const ktcEntry = playerId ? ktcLookup?.[playerId] : null;
  const adpEntry = playerId ? adpLookup?.[playerId] : null;
  const fallbackRank = toComparableNumber(sourceRow.RK ?? sourceRow.PRK_PPR);
  const gamesPlayed = getDataHubGamesPlayedValue(sourceRow);
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

// DataHub PPG source:
// mirror the Stats page season CSV path by preferring `GM_P` / aliased `G` for
// games played, with `GM` only as a final fallback for rows that lack the season
// totals field.
function getDataHubGamesPlayedValue(source = {}) {
  return toComparableNumber(source.GM_P ?? source.G ?? source.GM);
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
  indicator.setAttribute("aria-hidden", "true");
  const sortIcon = createSortIndicatorIcon(column.name);
  if (sortIcon) {
    indicator.classList.add("is-active");
    indicator.append(sortIcon);
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

  // DataHub player trigger:
  // the frozen PLAYER cell becomes the page-local game logs launcher so taps and
  // clicks can open the DataHub-owned modal without app.js.
  if (column.name === PLAYER_COLUMN) {
    content.append(createPlayerTriggerButton(row));
  } else if (column.name === "TM") {
    // DataHub TM cell logo swap:
    // render the same team-logo treatment used by the local modal so the table
    // shows logos while sort/search still operate on the raw team abbreviation.
    content.append(createDataHubTableTeamLogo(value));
  } else if (column.name === FPTS_COLUMN && !isMissingValue(value)) {
    content.append(createFptsChip(value));
  } else {
    content.textContent = formatDisplayValue(column.name, value);
  }

  td.append(content);
  return td;
}

function createPlayerTriggerButton(row) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "stats-player-btn";
  button.setAttribute("aria-label", `Open game logs for ${formatDisplayValue(PLAYER_COLUMN, row.PLAYER)}`);
  button.textContent = formatDisplayValue(PLAYER_COLUMN, row.PLAYER);
  button.addEventListener("click", () => {
    openDataHubGameLogs(row, button);
  });
  return button;
}

function createDataHubTableTeamLogo(value) {
  const teamKey = String(value || "FA").trim().toUpperCase() || "FA";
  if (!teamKey || teamKey === "FA" || isMissingValue(teamKey)) {
    const fallback = document.createElement("span");
    fallback.className = "stats-table__team-fallback";
    fallback.textContent = "FA";
    return fallback;
  }

  const logo = document.createElement("img");
  logo.className = "team-logo glow";
  logo.src = getDataHubTeamLogoSrc(teamKey);
  logo.alt = teamKey;
  logo.width = 20;
  logo.height = 20;
  logo.loading = "eager";
  logo.decoding = "async";
  return logo;
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

function createDefaultSort() {
  return { ...DEFAULT_SORT };
}

function createSortIndicatorIcon(columnName) {
  const iconKey = getSortIndicatorIconKey(columnName);
  if (!iconKey) {
    return null;
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("stats-table__sort-icon");

  SORT_ICON_PATHS[iconKey].forEach((segment) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", segment);
    svg.append(path);
  });

  return svg;
}

function getSortIndicatorIconKey(columnName) {
  if (getActiveSortColumn() !== columnName) {
    return null;
  }

  if (LOWER_IS_BETTER_SORT_COLUMNS.has(columnName)) {
    return state.sort.direction === "asc"
      ? "ArrowDownNarrowWide"
      : "ArrowUpNarrowWide";
  }

  return state.sort.direction === "desc"
    ? "ArrowDownWideNarrow"
    : "ArrowUpWideNarrow";
}

function getInitialSortDirection(columnName) {
  if (TEXT_SORT_COLUMNS.has(columnName) || LOWER_IS_BETTER_SORT_COLUMNS.has(columnName)) {
    return "asc";
  }

  return "desc";
}

function getOppositeSortDirection(direction) {
  return direction === "asc" ? "desc" : "asc";
}

function handleHeaderSort(columnName) {
  // DataHub table sort cycle:
  // most columns use preferred -> opposite -> reset-to-default, while VALUE
  // cycles desc -> asc -> desc because resetting lands on the default sort.
  if (columnName === DEFAULT_SORT.column) {
    if (state.sort.column === columnName && state.sort.direction === DEFAULT_SORT.direction) {
      state.sort = {
        column: columnName,
        direction: getOppositeSortDirection(DEFAULT_SORT.direction),
      };
    } else {
      state.sort = createDefaultSort();
    }
    refreshGrid();
    return;
  }

  if (state.sort.column !== columnName) {
    state.sort = {
      column: columnName,
      direction: getInitialSortDirection(columnName),
    };
  } else if (state.sort.direction === getInitialSortDirection(columnName)) {
    state.sort = {
      column: columnName,
      direction: getOppositeSortDirection(state.sort.direction),
    };
  } else {
    state.sort = createDefaultSort();
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
  return columns.includes(state.sort.column) ? state.sort.column : DEFAULT_SORT.column;
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

  // DataHub modal metadata:
  // store the non-display values needed by the game logs modal directly on the
  // row so the table can stay detached from any shared Stats page state.
  normalized.__meta = buildDataHubRowMeta(sourceRow, normalized);

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
// DataHub game logs modal subsystem
// ---------------------------------------------------------------------------
// This block recreates the Stats-page game logs experience inside DataHub only.
// It owns the modal data flow, rendering, and behavior locally so DataHub never
// relies on shared Stats/app.js wiring at runtime.
const DATAHUB_SLEEper_API_BASE = "https://api.sleeper.app/v1";
const DATAHUB_GAME_LOGS_YEAR = "2025";
const DATAHUB_MAX_WEEKS = 18;
const DATAHUB_TEAM_LOGO_KEY_MAP = Object.freeze({
  WSH: "was",
  WAS: "was",
  JAC: "jax",
  JAX: "jax",
  LA: "lar",
});
const DATAHUB_STATS_KEY_SECTIONS = [
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
      { abbr: "EPA/DB", desc: "Expected Points Added per Dropback" },
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
      { abbr: "EXPLSV%", desc: "Explosive Rush Rate" },
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
      { abbr: "IMP", desc: "Impact Plays" },
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
    { label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    {
      label: "PASSING PRODUCTION",
      tone: "passing",
      stats: ["pass_att", "pass_cmp", "pass_yd", "pass_td", "pass_fd", "pass_imp", "pass_sack", "pass_int"],
    },
    {
      label: "PASSING EFFICIENCY",
      tone: "passing",
      stats: ["epa_per_db", "cpoe", "pass_rtg", "cmp_pct", "pass_imp_per_att", "ttt", "prs_pct", "dp_pct", "pa_ypg"],
    },
    { label: "RUSHING PRODUCTION", tone: "rushing", stats: ["rush_att", "rush_yd", "rush_td"] },
    { label: "RUSHING EFFICIENCY", tone: "rushing", stats: ["ypc"] },
    { label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "fum"] },
    { label: "GENERAL EFFICIENCY", tone: "all", stats: ["imp_per_g"] },
  ],
  RB: [
    { label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    { label: "RUSHING PRODUCTION", tone: "rushing", stats: ["snp_pct", "rush_att", "rush_yd", "rush_td", "rush_fd", "rush_yac", "mtf"] },
    { label: "RUSHING EFFICIENCY", tone: "rushing", stats: ["ypc", "elu", "mtf_per_att", "yco_per_att", "expl_ru_pct", "ryoe", "ru_ypg"] },
    { label: "RECEIVING PRODUCTION", tone: "receiving", stats: ["rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar"] },
    { label: "RECEIVING EFFICIENCY", tone: "receiving", stats: ["ts_per_rr", "yprr"] },
    { label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "fum"] },
    { label: "GENERAL EFFICIENCY", tone: "all", stats: ["imp_per_g"] },
  ],
  WR: [
    { label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    { label: "RECEIVING PRODUCTION", tone: "receiving", stats: ["rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "rr", "rz_tgt"] },
    { label: "RECEIVING EFFICIENCY", tone: "receiving", stats: ["ts_per_rr", "yprr", "first_down_rec_rate", "ypr", "rec_ypg", "ay_pct"] },
    { label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "rush_att", "rush_yd", "rush_td", "fum"] },
    { label: "GENERAL EFFICIENCY", tone: "all", stats: ["snp_pct", "imp_per_g"] },
  ],
  TE: [
    { label: "FANTASY", tone: "all", stats: ["fpts", "ppg", "fpoe"] },
    { label: "RECEIVING PRODUCTION", tone: "receiving", stats: ["rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "rr", "rz_tgt"] },
    { label: "RECEIVING EFFICIENCY", tone: "receiving", stats: ["ts_per_rr", "yprr", "first_down_rec_rate", "ypr", "rec_ypg", "ay_pct"] },
    { label: "GENERAL PRODUCTION", tone: "all", stats: ["yds_total", "rush_att", "rush_yd", "rush_td"] },
    { label: "GENERAL EFFICIENCY", tone: "all", stats: ["snp_pct", "fum", "imp_per_g"] },
  ],
};
const DATAHUB_CONSISTENCY_THRESHOLD_MAP = {
  QB: { solid: 16, high: 22 },
  RB: { solid: 12, high: 18 },
  WR: { solid: 12, high: 18 },
  TE: { solid: 11, high: 17 },
  DEFAULT: { solid: 14, high: 20 },
  FLEX: { solid: 14, high: 20 },
};
const DATAHUB_MAX_CONSISTENCY_POINTS = 40;
const DATAHUB_CONSISTENCY_BUCKET_STYLES = {
  high: { color: "#00ffc1" },
  solid: { color: "#00c5ff" },
  low: { color: "#c26cfc" },
};
const DATAHUB_CONSISTENCY_HUD_CONDITIONAL_COLORS = {
  high: "#5dfdca",
  solid: "#47befd",
  low: "#d3a5ff",
};
const DATAHUB_SVG_NS = "http://www.w3.org/2000/svg";
// DataHub modal icon map:
// targets the Game Logs modal controls and generated Season title icon.
// It keeps modal icons on the same inline SVG/Lucide-style path contract used
// elsewhere on this page, so the modal stays self-contained and font-free.
const DATAHUB_MODAL_ICON_PATHS = {
  season: '<path d="M3 3v18h18"></path><path d="M7 16v-4"></path><path d="M12 16V8"></path><path d="M17 16v-7"></path>',
};
const DATAHUB_CONSISTENCY_LINE_FILTER_ID = "datahub-consistency-line-glow";
const DATAHUB_CONSISTENCY_AREA_FILTER_ID = "datahub-consistency-area-glow";
const DATAHUB_CONSISTENCY_AREA_GRADIENT_ID = "datahub-consistency-area-gradient";
const DATAHUB_CONSISTENCY_GRADIENT_COLORS = {
  low: "#c26cfc10",
  solid: "#005cff10",
  high: "#00ffc110",
};
const DATAHUB_CONSISTENCY_EDGE_PADDING_PCT = 2.8;
const DATAHUB_CONSISTENCY_VERTICAL_PADDING_PCT = 8;
const DATAHUB_CONSISTENCY_PROJECTION_SKIP_CODES = new Set(["IR", "OUT", "PUP", "BYE", "Q", "D"]);
const DATAHUB_LEAGUE_COLOR_PALETTE = [
  "#a6e7ff",
  "#7fd4ff",
  "#8ec1ff",
  "#9d9eff",
  "#bf8cff",
  "#ef9dff",
  "#93f4cf",
  "#f2bc8a",
];
const DATAHUB_LEAGUE_ABBR_OVERRIDES = {
  "dynasty hub": "DH",
};
const DATAHUB_STAT_LABELS = buildDataHubStatLabels();
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
const DATAHUB_QB_LOG_ORDER = [
  "fpts", "proj", "pass_rtg", "pass_yd", "pass_td", "cmp_pct", "yds_total",
  "rush_yd", "rush_td", "pass_att", "pass_cmp", "pass_fd", "imp_per_g",
  "pass_imp", "pass_imp_per_att", "rush_att", "ypc", "ttt", "prs_pct",
  "pass_sack", "pass_int", "fum", "fpoe",
];
const DATAHUB_RB_LOG_ORDER = [
  "fpts", "proj", "snp_pct", "rush_att", "rush_yd", "ypc", "rush_td", "rec",
  "rec_yd", "rec_tgt", "ts_per_rr", "yds_total", "elu", "mtf_per_att",
  "yco_per_att", "mtf", "rush_yac", "rush_fd", "rec_td", "rec_fd", "rec_yar",
  "imp_per_g", "fum", "fpoe",
];
const DATAHUB_WR_TE_LOG_ORDER = [
  "fpts", "proj", "snp_pct", "rec_tgt", "rec", "ts_per_rr", "rec_yd", "rec_td",
  "yprr", "rec_fd", "first_down_rec_rate", "rec_yar", "ypr", "imp_per_g", "rr",
  "fpoe", "yds_total", "rush_att", "rush_yd", "rush_td", "ypc", "fum",
];
const DATAHUB_RANK_COLOR_THRESHOLDS = [
  { v: 24, c: "#8bebcdbb" },
  { v: 48, c: "#97ebe3ab" },
  { v: 72, c: "#7dd1ffaa" },
  { v: 96, c: "#48a6ffaa" },
  { v: 120, c: "#957cffbb" },
  { v: 156, c: "#a642ffbb" },
  { v: 180, c: "#cf60ffcc" },
  { v: 204, c: "#ff6fe1cc" },
  { v: 250, c: "#ff2eb2" },
];
let dataHubGameLogsRequestSeq = 0;
let dataHubRadarChartInstance = null;
let dataHubCurveSvg = null;
let dataHubOwnershipContextLoadPromise = null;
let dataHubOwnershipContextLoadKey = "";
const dataHubAssignedLeagueColors = new Map();
let dataHubNextLeagueColorIndex = 0;
const DATAHUB_INJURY_DESIGNATION_COLORS = {
  IR: "#d93d76",
  SUS: "#d93d76",
  BYE: "#c3a8fb",
  Q: "#fd9a3dff",
  D: "#e780c3ff",
  PUP: "#d47dc6",
  DNP: "rgba(255, 174, 227, 0.47)",
  OUT: "#d47dc6",
};

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

// DataHub modal icon helper:
// targets JS-generated icon surfaces inside the Game Logs modal only.
// It creates the same inline stroke SVG structure the page already uses for
// table/group icons, so the modal can drop Font Awesome without changing its
// event or data wiring.
function createDataHubModalIcon(iconKey, extraClassName = "") {
  const iconMarkup = DATAHUB_MODAL_ICON_PATHS[iconKey];
  if (!iconMarkup) {
    return null;
  }

  const svg = document.createElementNS(DATAHUB_SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("datahub-modal-icon");
  if (extraClassName) {
    extraClassName.split(/\s+/).filter(Boolean).forEach((className) => {
      svg.classList.add(className);
    });
  }

  if (iconMarkup.startsWith("<")) {
    svg.innerHTML = iconMarkup;
  } else {
    const path = document.createElementNS(DATAHUB_SVG_NS, "path");
    path.setAttribute("d", iconMarkup);
    svg.appendChild(path);
  }

  return svg;
}

function buildDataHubRowMeta(sourceRow, normalizedRow) {
  const playerId = String(sourceRow.SLPR_ID || sourceRow.slpr_id || "").trim();
  const pos = String(sourceRow.POS || normalizedRow.POS || "").trim().toUpperCase();
  const team = String(sourceRow.TM || normalizedRow.TM || "FA").trim().toUpperCase() || "FA";
  const playerName = String(
    sourceRow.PLAYER
      || sourceRow["PLAYER NAME"]
      || sourceRow.NM
      || normalizedRow.PLAYER
      || "",
  ).trim();
  const ktcEntry = playerId ? getActiveKtcLookup()?.[playerId] : null;
  const gmPlayed = getDataHubGamesPlayedValue({
    GM_P: sourceRow.GM_P,
    G: normalizedRow.G,
    GM: sourceRow.GM,
  });
  const fpts = toComparableNumber(sourceRow.FPTS ?? sourceRow.FPT_PPR ?? normalizedRow.FPTS);
  // DataHub game logs modal PPG ranks:
  // keep the page-local modal aligned with the Stats page pipeline by storing the
  // same two-decimal computed FPTS/G value that stats.js ranks on, while the table
  // can keep its own rounded PPG display text without affecting the summary chip ranks.
  const computedPpg = computePpgValue(fpts, gmPlayed);
  const ppg = toComparableNumber(
    formatFixedString(computedPpg, 2) ?? sourceRow.PPG ?? normalizedRow.PPG,
  );
  return {
    playerId,
    name: playerName,
    fullName: playerName,
    displayName: playerName,
    pos,
    team,
    rank: toComparableNumber(sourceRow.RK ?? sourceRow.PRK_PPR ?? normalizedRow.RK),
    age: toComparableNumber(sourceRow.AGE ?? normalizedRow.AGE),
    gmPlayed,
    value: toComparableNumber(sourceRow.VALUE ?? normalizedRow.VALUE),
    fpts,
    ppg,
    adp: toComparableNumber(sourceRow.ADP ?? normalizedRow.ADP),
    posAdp: toComparableNumber(sourceRow["POS·ADP"] ?? normalizedRow["POS·ADP"]),
    posRankText: formatDataHubPosRankText(pos, ktcEntry?.posRank || sourceRow["POS RK"] || sourceRow["POS | RK"] || normalizedRow["POS·ADP"]),
    overallKtcRank: toIntegerOrNull(ktcEntry?.overallRank),
    ktc: toIntegerOrNull(ktcEntry?.ktc),
  };
}

function formatDataHubPosRankText(pos, sourceText) {
  const cleanPos = String(pos || "").trim().toUpperCase();
  const raw = String(sourceText || "").trim();
  if (raw.includes("·")) {
    return raw.replace(/\s+/g, "");
  }
  if (raw.includes("|")) {
    return raw.replace("|", "·").replace(/\s+/g, "");
  }
  const numericRank = parseDataHubPosRankNumber(raw);
  if (cleanPos && Number.isFinite(numericRank)) {
    return `${cleanPos}·${numericRank}`;
  }
  return cleanPos ? `${cleanPos}·NA` : "NA";
}

function parseDataHubPosRankNumber(posRankText) {
  const match = String(posRankText || "").match(/(\d+)/);
  if (!match) {
    return null;
  }
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildDataHubModalRankCache(rows) {
  const cache = Object.create(null);
  const playersWithStats = rows.filter((row) => {
    const meta = row?.__meta;
    return meta?.playerId && Number.isFinite(meta.fpts) && meta.fpts > 0 && meta.pos !== "RDP";
  });
  const assignRanks = (entries, targetKey, selector) => {
    const sorted = [...entries].sort((left, right) => (selector(right) || 0) - (selector(left) || 0));
    sorted.forEach((row, index) => {
      const playerId = row.__meta.playerId;
      if (!cache[playerId]) {
        cache[playerId] = {};
      }
      cache[playerId][targetKey] = index + 1;
    });
  };
  assignRanks(playersWithStats, "overallRank", (row) => row.__meta.fpts || 0);
  assignRanks(playersWithStats, "ppgOverallRank", (row) => row.__meta.ppg || 0);
  const groupedByPos = new Map();
  playersWithStats.forEach((row) => {
    const pos = row.__meta.pos || "";
    if (!groupedByPos.has(pos)) {
      groupedByPos.set(pos, []);
    }
    groupedByPos.get(pos).push(row);
  });
  groupedByPos.forEach((groupRows) => {
    assignRanks(groupRows, "posRank", (row) => row.__meta.fpts || 0);
    assignRanks(groupRows, "ppgPosRank", (row) => row.__meta.ppg || 0);
  });
  return cache;
}

function attachGameLogsModalListeners() {
  if (!gameLogsModal || gameLogsModal.dataset.datahubWired) {
    return;
  }
  gameLogsModal.dataset.datahubWired = "true";
  initializeDataHubStatsKeyMarkup();

  gameLogsModal.addEventListener("click", (event) => {
    if (event.target?.closest?.(".modal-close-btn")) {
      closeDataHubModal();
    }
  });
  modalOverlay?.addEventListener("click", closeDataHubModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && gameLogsModal && !gameLogsModal.classList.contains("hidden")) {
      closeDataHubModal();
    }
  });
  gameLogsModalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.modalTab;
      if (key) {
        switchDataHubModalTab(key);
      }
    });
  });
  gameLogsViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setDataHubGameLogsView(button.dataset.gamelogsView);
    });
  });
  gameLogsSeasonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const season = button.dataset.gamelogsSeason;
      if (season !== DATAHUB_GAME_LOGS_YEAR) {
        showDataHubTemporaryTooltip(button, `${season} game logs are not available in DataHub yet.`);
        return;
      }
      gameLogsSeasonButtons.forEach((entry) => {
        const isActive = entry === button;
        entry.classList.toggle("is-active", isActive);
        entry.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      state.currentModalSeason = season;
    });
  });
  modalInfoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.dataset.panel;
      const overlays = {
        "stats-key": statsKeyContainer,
        "radar-chart": radarChartContainer,
        consistency: consistencyContainer,
      };
      if (panel === "game-logs") {
        Object.values(overlays).forEach((node) => node?.classList.add("hidden"));
        modalInfoButtons.forEach((entry) => entry.classList.toggle("active", entry === button));
        return;
      }
      const target = overlays[panel];
      if (!target) {
        return;
      }
      const isOpen = !target.classList.contains("hidden");
      Object.values(overlays).forEach((node) => node?.classList.add("hidden"));
      modalInfoButtons.forEach((entry) => entry.classList.remove("active"));
      if (isOpen) {
        modalInfoButtons.find((entry) => entry.dataset.panel === "game-logs")?.classList.add("active");
        return;
      }
      target.classList.remove("hidden");
      button.classList.add("active");
      if (panel === "radar-chart" && state.currentGameLogsPlayer) {
        renderDataHubRadarChart(state.currentGameLogsPlayer.id, state.currentGameLogsPlayer.pos);
      }
      if (panel === "consistency" && state.currentGameLogsPlayer) {
        renderDataHubConsistencyChart();
      }
    });
  });
}

function openDataHubModal() {
  if (!gameLogsModal) {
    return;
  }
  gameLogsModal.classList.remove("hidden");
  statsKeyContainer?.classList.add("hidden");
  radarChartContainer?.classList.add("hidden");
  consistencyContainer?.classList.add("hidden");
  setDataHubGameLogsView("gl");
  switchDataHubModalTab("gamelogs");
  modalInfoButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === "game-logs");
  });
}

function closeDataHubModal() {
  dataHubGameLogsRequestSeq += 1;
  if (!gameLogsModal) {
    return;
  }
  gameLogsModal.classList.add("hidden");
  gameLogsModal.classList.remove("loading");
  gameLogsModal.querySelector(".game-logs-loading-container")?.remove();
  modalBody?.classList.remove("loading");
  modalBody?.replaceChildren();
  statsKeyContainer?.classList.add("hidden");
  radarChartContainer?.classList.add("hidden");
  consistencyContainer?.classList.add("hidden");
  modalInfoButtons.forEach((button) => button.classList.remove("active"));
  if (dataHubRadarChartInstance) {
    dataHubRadarChartInstance.destroy();
    dataHubRadarChartInstance = null;
  }
  if (dataHubCurveSvg) {
    dataHubCurveSvg.remove();
    dataHubCurveSvg = null;
  }
  const radarContent = radarChartContainer?.querySelector(".radar-chart-content");
  if (radarContent) {
    radarContent.innerHTML = "";
  }
  const ownershipBody = document.querySelector("#glOwnershipBody");
  const ownershipChips = document.querySelector("#glOwnershipSummaryChips");
  const ownershipLeft = document.querySelector("#glOwnershipLeft");
  const ownershipVitals = document.querySelector("#glOwnershipPlayerVitals");
  if (ownershipBody) ownershipBody.innerHTML = "";
  if (ownershipChips) ownershipChips.innerHTML = "";
  if (ownershipLeft) ownershipLeft.innerHTML = "";
  if (ownershipVitals) ownershipVitals.innerHTML = "";
  clearDataHubPendingPlayerButton();
  state.currentGameLogsPlayer = null;
  state.currentGameLogsPlayerRanks = null;
  state.currentGameLogsSummary = null;
  state.currentGameLogsFooterStats = null;
  state.currentConsistencyData = null;
}

function setDataHubGameLogsView(view) {
  const normalizedView = view === "szn" ? "szn" : "gl";
  state.currentGameLogsView = normalizedView;
  gameLogsViewButtons.forEach((button) => {
    const isActive = button.dataset.gamelogsView === normalizedView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  modalBody?.querySelectorAll(".game-logs-table-container, .no-logs[data-gamelogs-view='gl']").forEach((node) => {
    node.classList.toggle("hidden", normalizedView !== "gl");
  });
  modalBody?.querySelectorAll(".game-logs-szn-view").forEach((node) => {
    node.classList.toggle("hidden", normalizedView !== "szn");
  });
  statsKeyContainer?.classList.add("hidden");
  radarChartContainer?.classList.add("hidden");
  consistencyContainer?.classList.add("hidden");
  modalInfoButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === "game-logs");
  });
}

function switchDataHubModalTab(tabKey) {
  const gameLogsPane = document.querySelector("#gamelogs-tab-pane");
  const ownershipPane = document.querySelector("#gamelogs-ownership-pane");
  if (!gameLogsPane || !ownershipPane) {
    return;
  }
  if (tabKey === "ownership" && !state.userId) {
    const ownershipTab = gameLogsModalTabs.find((tab) => tab.dataset.modalTab === "ownership");
    showDataHubTemporaryTooltip(ownershipTab || document.body, "Please enter a Sleeper username to view Ownership data.");
    return;
  }
  gameLogsModalTabs.forEach((button) => {
    const isActive = button.dataset.modalTab === tabKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  if (tabKey === "ownership") {
    gameLogsPane.classList.add("hidden");
    ownershipPane.classList.remove("hidden");
    if (state.currentGameLogsPlayer?.id) {
      renderDataHubOwnershipPane(state.currentGameLogsPlayer.id);
      if (!hasDataHubOwnershipContextLoaded()) {
        loadDataHubOwnershipContextForUser()
          .then(() => {
            if (state.currentGameLogsPlayer?.id) {
              renderDataHubOwnershipPane(state.currentGameLogsPlayer.id);
            }
          })
          .catch(() => {
            const body = document.querySelector("#glOwnershipBody");
            if (body) {
              body.innerHTML = '<div class="ownership-modal-empty">Unable to load ownership data right now.</div>';
            }
          });
      }
    }
  } else {
    gameLogsPane.classList.remove("hidden");
    ownershipPane.classList.add("hidden");
  }
}

async function openDataHubGameLogs(row, triggerButton = null) {
  const meta = row?.__meta;
  if (!meta?.playerId || meta.pos === "RDP") {
    return;
  }
  const requestSeq = ++dataHubGameLogsRequestSeq;
  state.currentGameLogsPlayer = null;
  state.currentGameLogsPlayerRanks = null;
  state.currentGameLogsSummary = null;
  const isStaleRequest = () => requestSeq !== dataHubGameLogsRequestSeq;

  // DataHub player-tap feedback:
  // promote the clicked name button into a scoped loading state immediately so
  // the interaction feels responsive even before the modal data promise settles.
  setDataHubPendingPlayerButton(triggerButton);

  const loadingPlayer = buildDataHubModalPlayer(meta);
  state.currentGameLogsPlayer = loadingPlayer;
  prepareDataHubModalForLoading(loadingPlayer);
  openDataHubModal();
  showDataHubLoadingPanel();

  try {
    await ensureDataHubGameLogsData();
    if (isStaleRequest()) {
      return;
    }

    const player = buildDataHubModalPlayer(meta);
    state.currentGameLogsPlayer = player;
    modalPlayerName.textContent = player.fullName || player.name || "Player";

    const gameLogs = await fetchDataHubGameLogs(player.id);
    if (isStaleRequest()) {
      return;
    }

    const playerRanks = buildDataHubPlayerRanks(player.id, meta);
    if (isStaleRequest()) {
      return;
    }

    await renderDataHubGameLogs(gameLogs, player, playerRanks, requestSeq);
  } catch (error) {
    console.error("Unable to prepare DataHub game logs data.", error);
    if (isStaleRequest()) {
      return;
    }
    clearDataHubPendingPlayerButton();
    gameLogsModal?.classList.remove("loading");
    gameLogsModal?.querySelector(".game-logs-loading-container")?.remove();
    modalBody?.classList.remove("loading");
  }
}

function buildDataHubModalPlayer(meta) {
  const playerData = state.sleeperPlayers?.[meta.playerId] || {};
  const firstName = String(playerData.first_name || "").trim();
  const lastName = String(playerData.last_name || "").trim();
  const fullName = `${firstName} ${lastName}`.trim() || meta.fullName || meta.name;
  return {
    id: meta.playerId,
    name: meta.name,
    fullName,
    pos: meta.pos || playerData.position || "WR",
    team: meta.team || playerData.team || "FA",
    ktc: Number.isFinite(meta.ktc) ? meta.ktc : (Number.isFinite(meta.value) ? meta.value : 0),
    posRank: meta.posRankText,
    overallRank: Number.isFinite(meta.overallKtcRank) ? meta.overallKtcRank : meta.rank,
  };
}

function prepareDataHubModalForLoading(player) {
  // DataHub modal pre-open state:
  // clear prior player chrome before async game log work starts so the modal can
  // open instantly with the new player name and the existing loading panel.
  modalPlayerName.textContent = player.fullName || player.name || "Player";
  modalPlayerVitals?.replaceChildren();
  modalSummaryChips?.replaceChildren();
  modalBody?.replaceChildren();
  document.querySelector("#modal-header .modal-header-left-container")?.remove();
}

function setDataHubPendingPlayerButton(button) {
  if (state.currentGameLogsTriggerButton && state.currentGameLogsTriggerButton !== button) {
    clearDataHubPendingPlayerButton(state.currentGameLogsTriggerButton);
  }
  if (!button) {
    state.currentGameLogsTriggerButton = null;
    return;
  }

  state.currentGameLogsTriggerButton = button;
  button.classList.add("is-loading");
  button.setAttribute("aria-busy", "true");
}

function clearDataHubPendingPlayerButton(button = state.currentGameLogsTriggerButton) {
  if (!button) {
    state.currentGameLogsTriggerButton = null;
    return;
  }

  button.classList.remove("is-loading");
  button.removeAttribute("aria-busy");
  if (state.currentGameLogsTriggerButton === button) {
    state.currentGameLogsTriggerButton = null;
  }
}

function showDataHubLoadingPanel() {
  const modalContent = gameLogsModal?.querySelector(".modal-content");
  if (!modalContent || !modalBody) {
    return;
  }
  modalBody.classList.add("loading");
  gameLogsModal.classList.add("loading");
  modalContent.querySelector(".game-logs-loading-container")?.remove();
  const panel = document.createElement("div");
  panel.className = "game-logs-loading-container";
  panel.innerHTML = `
    <div class="game-logs-loading-content">
      <div class="game-logs-loading-spinner"></div>
      <p class="game-logs-loading-message">
        <strong>Syncing Game Logs ⇄</strong>
        Fetching DataHub game log data for the selected player.<br /><br />
        — This may take a few seconds...
      </p>
    </div>
    <p class="game-logs-loading-footer">
      <em>DataHub keeps the modal self-contained, so the first open hydrates all local game log sources for this session.</em>
    </p>
  `;
  modalContent.appendChild(panel);
}

async function ensureDataHubGameLogsData() {
  if (state.gameLogsDataLoaded) {
    await ensureDataHubLiveStats();
    if (!state.username) {
      await bootstrapDataHubUserContext();
    }
    return;
  }
  if (state.gameLogsDataPromise) {
    await state.gameLogsDataPromise;
    return;
  }
  state.gameLogsDataPromise = (async () => {
    await Promise.all([
      fetchDataHubSleeperPlayers(),
      ensureDataHubSupplementalData(),
      bootstrapDataHubUserContext(),
    ]);
    const [seasonCsvText, seasonRanksCsvText, ...weeklyCsvText] = await Promise.all([
      fetchCsvText(),
      fetchDataHubText(new URL("../data/NFL-2025_Stats/SZN_RKS.csv", window.location.href)),
      ...Array.from({ length: DATAHUB_MAX_WEEKS }, (_, index) => {
        const week = index + 1;
        return fetchDataHubText(new URL(`../data/NFL-2025_Stats/Weeks/WK${week}.csv`, window.location.href), { allowFailure: true });
      }),
    ]);
    state.playerSeasonStats = parseDataHubSeasonStatsRows(parseCsv(seasonCsvText));
    state.playerSeasonRanks = parseDataHubSeasonRanksRows(parseCsv(seasonRanksCsvText));
    const weeklyStats = Object.create(null);
    weeklyCsvText.forEach((csvText, index) => {
      if (!csvText) {
        return;
      }
      weeklyStats[index + 1] = parseDataHubWeeklyStatsRows(parseCsv(csvText));
    });
    state.playerWeeklyStats = weeklyStats;
    state.weeklyStats = weeklyStats;
    state.gameLogsDataLoaded = true;
    await ensureDataHubLiveStats();
  })()
    .catch((error) => {
      state.gameLogsDataLoaded = false;
      throw error;
    })
    .finally(() => {
      state.gameLogsDataPromise = null;
    });
  await state.gameLogsDataPromise;
}

async function bootstrapDataHubUserContext() {
  const queryUsername = new URLSearchParams(window.location.search).get("username") || "";
  const storedUsername = readStoredUsername();
  const username = String(queryUsername || storedUsername || "").trim();
  state.username = username;
  if (!username) {
    state.userId = "";
    return;
  }
  try {
    const user = await fetchDataHubJson(`${DATAHUB_SLEEper_API_BASE}/user/${encodeURIComponent(username)}`);
    state.userId = user?.user_id || "";
    if (queryUsername) {
      try {
        localStorage.setItem("sleeper_username", username);
      } catch (error) {}
    }
  } catch (error) {
    state.userId = "";
  }
}

async function fetchDataHubSleeperPlayers({ force = false } = {}) {
  if (!force && Object.keys(state.sleeperPlayers || {}).length) {
    return state.sleeperPlayers;
  }
  const payload = await fetchDataHubJson(`${DATAHUB_SLEEper_API_BASE}/players/nfl`);
  state.sleeperPlayers = payload || Object.create(null);
  return state.sleeperPlayers;
}

async function fetchDataHubGameLogs(playerId) {
  await ensureDataHubGameLogsData();
  const combinedWeeklyStats = getDataHubCombinedWeeklyStats();
  const gameLogs = [];
  Object.keys(combinedWeeklyStats)
    .map((week) => Number(week))
    .sort((left, right) => left - right)
    .forEach((week) => {
      const stats = combinedWeeklyStats[week]?.[playerId];
      if (stats) {
        gameLogs.push({ week, stats });
      }
    });
  return gameLogs;
}

function getDataHubCombinedWeeklyStats() {
  const combined = Object.create(null);
  Object.entries(state.weeklyStats || {}).forEach(([week, players]) => {
    combined[week] = {};
    Object.entries(players || {}).forEach(([playerId, statLine]) => {
      combined[week][playerId] = { ...(statLine || {}) };
    });
  });
  Object.entries(state.liveWeeklyStats || {}).forEach(([week, players]) => {
    if (!combined[week]) {
      combined[week] = {};
    }
    Object.entries(players || {}).forEach(([playerId, statLine]) => {
      const existing = combined[week][playerId] ? { ...combined[week][playerId] } : {};
      const merged = { ...existing, ...(statLine || {}) };
      if (Number.isFinite(statLine?.fpts_override)) {
        merged.fpts_override = statLine.fpts_override;
        merged.fpts = statLine.fpts_override;
      }
      combined[week][playerId] = merged;
    });
  });
  return combined;
}

async function ensureDataHubLiveStats(force = false) {
  if (!force && state.liveStatsLoaded && state.lastLiveStatsFetchTs && (Date.now() - state.lastLiveStatsFetchTs) < 5 * 60 * 1000) {
    return;
  }
  await fetchDataHubLiveStats();
}

async function fetchDataHubLiveStats() {
  try {
    const sleeperState = await fetchDataHubJson(`${DATAHUB_SLEEper_API_BASE}/state/nfl`);
    const season = String(sleeperState?.season || DATAHUB_GAME_LOGS_YEAR);
    const currentWeek = Number(sleeperState?.week);
    state.currentNflSeason = season;
    state.currentNflWeek = Number.isFinite(currentWeek) ? currentWeek : null;
    if (!Number.isFinite(currentWeek) || currentWeek <= 0) {
      state.liveStatsLoaded = true;
      return;
    }
    const liveWeeklyStats = { ...(state.liveWeeklyStats || {}) };
    const latestStoredWeek = Math.max(0, ...Object.keys(state.weeklyStats || {}).map((value) => Number(value)).filter(Number.isFinite));
    const fetchStartWeek = Math.max(1, Math.min(currentWeek, latestStoredWeek + 1));
    for (let week = fetchStartWeek; week <= currentWeek; week += 1) {
      try {
        const weekPayload = await fetchDataHubJson(`${DATAHUB_SLEEper_API_BASE}/stats/nfl/regular/${season}/${week}`);
        const weekStats = {};
        Object.entries(weekPayload || {}).forEach(([playerId, statLine]) => {
          const override = Number(
            statLine?.pts_ppr
            ?? statLine?.pts
            ?? statLine?.pts_ppr_total
            ?? statLine?.fantasy_points_ppr,
          );
          if (!Number.isFinite(override)) {
            return;
          }
          weekStats[playerId] = {
            fpts_override: override,
            fpts: override,
            __live: true,
          };
        });
        if (Object.keys(weekStats).length) {
          liveWeeklyStats[week] = weekStats;
        }
      } catch (error) {
        console.warn(`DataHub live stats unavailable for week ${week}.`, error);
      }
    }
    state.liveWeeklyStats = liveWeeklyStats;
  } finally {
    state.liveStatsLoaded = true;
    state.lastLiveStatsFetchTs = Date.now();
  }
}

function buildDataHubPlayerRanks(playerId, meta) {
  const cacheEntry = state.modalRankCache?.[playerId] || {};
  return {
    total_pts: Number.isFinite(meta?.fpts) ? meta.fpts.toFixed(1) : "0.0",
    ppg: Number.isFinite(meta?.ppg) ? meta.ppg.toFixed(1) : "0.0",
    posRank: cacheEntry.posRank || null,
    overallRank: cacheEntry.overallRank || null,
    ppgPosRank: cacheEntry.ppgPosRank || null,
    ppgOverallRank: cacheEntry.ppgOverallRank || null,
    gamesPlayed: Number.isFinite(meta?.gmPlayed) ? meta.gmPlayed : 0,
  };
}

function parseDataHubSeasonStatsRows(rows) {
  const seasonStats = Object.create(null);
  rows.forEach((row) => {
    const playerId = String(row.SLPR_ID || row.slpr_id || "").trim();
    if (!playerId) {
      return;
    }
    const stats = {};
    Object.entries(row).forEach(([header, value]) => {
      const normalizedHeader = normalizeSheetHeader(header);
      if (normalizedHeader === "SLPR_ID") {
        return;
      }
      const statKey = DATAHUB_PLAYER_STAT_HEADER_MAP[normalizedHeader];
      if (statKey) {
        const parsedValue = parseDataHubStatValue(normalizedHeader, value);
        if (parsedValue !== null) {
          stats[statKey] = parsedValue;
        }
      }
    });
    stats.pos = String(row.POS || "").trim().toUpperCase();
    stats.team = String(row.TM || "").trim().toUpperCase() || "FA";
    stats.games_played = getDataHubGamesPlayedValue(row);
    stats.fpts_ppr = toComparableNumber(row.FPT_PPR ?? row.FPTS_PPR ?? row.FPTS);
    stats.fpt_ppr = stats.fpts_ppr;
    stats.ppg = Number.isFinite(toComparableNumber(row.PPG))
      ? toComparableNumber(row.PPG)
      : computePpgValue(stats.fpts_ppr, stats.games_played);
    seasonStats[playerId] = stats;
  });
  return seasonStats;
}

function parseDataHubSeasonRanksRows(rows) {
  const rankRows = Object.create(null);
  rows.forEach((row) => {
    const playerId = String(row.SLPR_ID || row.slpr_id || "").trim();
    if (!playerId) {
      return;
    }
    const ranks = {};
    Object.entries(row).forEach(([header, value]) => {
      const normalizedHeader = normalizeSheetHeader(header);
      if (normalizedHeader === "SLPR_ID") {
        return;
      }
      const statKey = DATAHUB_PLAYER_STAT_HEADER_MAP[normalizedHeader];
      if (!statKey) {
        return;
      }
      const parsedRank = toComparableNumber(value);
      if (Number.isFinite(parsedRank)) {
        ranks[statKey] = parsedRank;
      }
    });
    rankRows[playerId] = ranks;
  });
  return rankRows;
}

function parseDataHubWeeklyStatsRows(rows) {
  const weeklyStats = Object.create(null);
  rows.forEach((row) => {
    const playerId = String(row.SLPR_ID || row.slpr_id || "").trim();
    if (!playerId) {
      return;
    }
    const stats = {};
    Object.entries(row).forEach(([header, value]) => {
      const normalizedHeader = normalizeSheetHeader(header);
      if (normalizedHeader === "SLPR_ID") {
        return;
      }
      const metaKey = DATAHUB_WEEKLY_META_HEADER_MAP[normalizedHeader];
      if (metaKey) {
        if (metaKey === "opponent_rank") {
          const numericValue = toComparableNumber(value);
          if (Number.isFinite(numericValue)) {
            stats[metaKey] = numericValue;
          }
        } else if (String(value || "").trim()) {
          stats[metaKey] = String(value || "").trim();
        }
        return;
      }
      const statKey = DATAHUB_PLAYER_STAT_HEADER_MAP[normalizedHeader];
      if (!statKey) {
        return;
      }
      if (normalizedHeader === "PROJ") {
        stats[statKey] = String(value ?? "").trim();
        return;
      }
      const parsedValue = parseDataHubStatValue(normalizedHeader, value);
      if (parsedValue !== null) {
        stats[statKey] = parsedValue;
      }
    });
    weeklyStats[playerId] = stats;
  });
  return weeklyStats;
}

function parseDataHubStatValue(header, value) {
  const trimmedValue = String(value ?? "").trim();
  if (!trimmedValue || trimmedValue.toUpperCase() === "NA") {
    return null;
  }
  if (header === "SNP%") {
    const numericPortion = Number.parseFloat(trimmedValue.replace("%", ""));
    if (!Number.isFinite(numericPortion)) {
      return null;
    }
    return trimmedValue.includes("%") || numericPortion > 1.5
      ? numericPortion
      : numericPortion * 100;
  }
  const numericValue = Number.parseFloat(trimmedValue);
  return Number.isFinite(numericValue) ? numericValue : null;
}

async function fetchDataHubJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function fetchDataHubText(url, options = {}) {
  const { allowFailure = false } = options;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    if (allowFailure) {
      return "";
    }
    throw error;
  }
}

function renderDataHubGameLogs(gameLogs, player, playerRanks, requestSeq) {
  if (requestSeq !== dataHubGameLogsRequestSeq) {
    return;
  }
  if (modalBody) {
    modalBody.classList.remove("loading");
  }
  if (gameLogsModal) {
    gameLogsModal.classList.remove("loading");
    gameLogsModal.querySelector(".game-logs-loading-container")?.remove();
  }
  clearDataHubPendingPlayerButton();
  state.currentGameLogsPlayer = player;
  state.currentGameLogsPlayerRanks = playerRanks;
  state.currentGameLogsSummary = {
    fpts: playerRanks.total_pts,
    ppg: playerRanks.ppg,
  };
  renderDataHubModalHeader(player, playerRanks);
  const tableNode = renderDataHubGameLogsTable(gameLogs, player, playerRanks);
  const seasonNode = renderDataHubSeasonStatsView(player, gameLogs, playerRanks);
  modalBody?.replaceChildren();
  if (tableNode) modalBody?.appendChild(tableNode);
  if (seasonNode) modalBody?.appendChild(seasonNode);
  if (statsKeyContainer) {
    statsKeyContainer.classList.add("hidden");
    modalBody?.appendChild(statsKeyContainer);
  }
  if (radarChartContainer) {
    radarChartContainer.classList.add("hidden");
    modalBody?.appendChild(radarChartContainer);
  }
  if (consistencyContainer) {
    consistencyContainer.classList.add("hidden");
    modalBody?.appendChild(consistencyContainer);
    prepareDataHubConsistencyPanel(player);
  }
  setDataHubGameLogsView(state.currentGameLogsView || "gl");
}

function renderDataHubModalHeader(player, playerRanks) {
  const header = document.querySelector("#modal-header");
  if (!header) {
    return;
  }
  header.querySelector(".modal-header-left-container")?.remove();
  const left = document.createElement("div");
  left.className = "modal-header-left-container";
  left.innerHTML = `
    <div class="player-tag modal-pos-tag ${dataHubEscapeHtml(player.pos)}">${dataHubEscapeHtml(player.pos)}</div>
    ${getDataHubTeamLogoMarkup(player.team)}
  `;
  header.insertBefore(left, header.firstChild);
  modalPlayerName.textContent = player.fullName || player.name || "Player";
  if (modalPlayerVitals) {
    modalPlayerVitals.innerHTML = "";
    modalPlayerVitals.appendChild(createDataHubPlayerVitalsElement(getDataHubPlayerVitals(player.id, player), { variant: "modal", pos: player.pos }));
  }
  if (modalSummaryChips) {
    modalSummaryChips.innerHTML = `
      <div class="gamelogs-summary-chip">
        <h4>
          <span class="chip-header-value" style="color:${getDataHubConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.total_pts}</span>
          <span class="chip-unit"> FPTS</span>
        </h4>
        <div class="chip-values">
          <span class="pos-rank-container">
            <span class="chip-pos-rank-label pos-color-${dataHubEscapeHtml(player.pos)}">${dataHubEscapeHtml(player.pos)}·</span>
            <span style="color:${getDataHubConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.posRank || "NA"}</span>
          </span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(playerRanks.overallRank)}">${Number.isFinite(playerRanks.overallRank) ? `#${playerRanks.overallRank}` : "NA"}</span>
        </div>
      </div>
      <div class="gamelogs-summary-chip">
        <h4>
          <span class="chip-header-value" style="color:${getDataHubConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppg}</span>
          <span class="chip-unit"> PPG</span>
        </h4>
        <div class="chip-values">
          <span class="pos-rank-container">
            <span class="chip-pos-rank-label pos-color-${dataHubEscapeHtml(player.pos)}">${dataHubEscapeHtml(player.pos)}·</span>
            <span style="color:${getDataHubConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppgPosRank || "NA"}</span>
          </span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(playerRanks.ppgOverallRank)}">${Number.isFinite(playerRanks.ppgOverallRank) ? `#${playerRanks.ppgOverallRank}` : "NA"}</span>
        </div>
      </div>
      <div class="gamelogs-summary-chip">
        <h4>
          <span class="chip-header-value" style="color:${getDataHubKtcColor(player.ktc)}">${Number.isFinite(player.ktc) ? Math.round(player.ktc) : "NA"}</span>
          <span class="chip-unit"> KTC</span>
        </h4>
        <div class="chip-values">
          <span class="pos-rank-container">
            <span class="chip-pos-rank-label pos-color-${dataHubEscapeHtml(player.pos)}">${dataHubEscapeHtml(player.pos)}·</span>
            <span style="color:${getDataHubConditionalColorByRank(parseDataHubPosRankNumber(player.posRank), player.pos)}">${parseDataHubPosRankNumber(player.posRank) || "NA"}</span>
          </span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(player.overallRank)}">${Number.isFinite(player.overallRank) ? `#${player.overallRank}` : "NA"}</span>
        </div>
      </div>
    `;
    // DataHub Game Logs header parity:
    // match the shared Rosters/Stats modal by sizing the vitals capsule to the
    // rendered summary-chip row width after the chips exist in the DOM.
    const playerVitalsElement = modalPlayerVitals?.querySelector(".player-vitals--modal");
    const summaryChipsWidth = modalSummaryChips.offsetWidth;
    if (playerVitalsElement && summaryChipsWidth > 0) {
      playerVitalsElement.style.width = `${summaryChipsWidth}px`;
    }
  }
}

// DataHub modal parity:
// keep the weekly table, SZN view, and radar markup/logic aligned with the
// Stats page implementation while still using DataHub-local data sources.
function renderDataHubGameLogsTable(gameLogs, player, playerRanks) {
  const container = document.createElement("div");
  container.className = "game-logs-table-container";
  container.dataset.gamelogsView = "gl";

  if (!gameLogs.length) {
    const empty = document.createElement("p");
    empty.className = "no-logs";
    empty.dataset.gamelogsView = "gl";
    empty.textContent = `No game logs found for ${player.fullName || player.name} for the current season.`;
    return empty;
  }

  const orderedStatKeys = getDataHubLogOrderForPosition(player.pos);
  const statLabels = DATAHUB_STAT_LABELS;
  const seasonTotals = state.playerSeasonStats?.[player.id] || null;
  const logsByWeek = new Map(gameLogs.map((entry) => [Number(entry.week), entry]));
  const COLUMN_WIDTHS = {
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
    ktc: 80,
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
  const DEFAULT_COLUMN_WIDTH = 54;
  const tableColumns = [{
    id: "week",
    accessorKey: "week",
    header: () => "WK  ·  VS ",
    size: COLUMN_WIDTHS.week,
    meta: {
      headerClass: "week-column-header",
      cellClass: "week-cell",
      footerClass: "week-column-header",
      statKey: null,
    },
  }];

  orderedStatKeys.forEach((statKey) => {
    if (!statLabels[statKey]) return;
    const statGroup = getDataHubStatGroup(statKey);
    tableColumns.push({
      id: statKey,
      accessorKey: statKey,
      header: () => statLabels[statKey],
      size: COLUMN_WIDTHS[statKey] || DEFAULT_COLUMN_WIDTH,
      meta: {
        headerClass: statGroup ? `gamelog-header-${statGroup}` : undefined,
        cellClass: statKey === "proj" ? "proj-cell" : undefined,
        footerClass: statKey === "proj" ? "proj-cell" : undefined,
        statKey,
      },
    });
  });

  const createTextDescriptor = (text, style) => ({
    render(td) {
      td.textContent = text;
      if (style) {
        Object.assign(td.style, style);
      }
    },
  });
  const getProjectionDisplayValue = (statLine) => {
    if (statLine && Object.prototype.hasOwnProperty.call(statLine, "proj")) {
      return String(statLine.proj ?? "");
    }
    return "";
  };
  const buildWeekDescriptor = (week, statsForWeek) => ({
    render(td) {
      const opponent = String(statsForWeek?.opponent || "").trim().toUpperCase();
      const opponentRank = Number.isFinite(statsForWeek?.opponent_rank) ? Math.round(statsForWeek.opponent_rank) : null;
      const opponentRankColor = getDataHubOpponentRankColor(opponentRank);
      const weekTag = document.createElement("div");
      weekTag.className = "gamelog-week-tag";

      const weekNumberLine = document.createElement("div");
      weekNumberLine.className = "gamelog-week-tag-number";
      weekNumberLine.textContent = `WK-${week}`;
      weekTag.appendChild(weekNumberLine);

      if (opponent) {
        const opponentLine = document.createElement("div");
        opponentLine.className = "gamelog-week-tag-opponent";
        if (opponent === "BYE") {
          opponentLine.textContent = "BYE";
        } else {
          const opponentText = document.createElement("span");
          opponentText.className = "gamelog-week-tag-opponent-text";
          opponentText.textContent = opponent;
          if (opponentRankColor) {
            opponentText.style.color = opponentRankColor;
          }
          opponentLine.appendChild(opponentText);

          const opponentRankDisplay = getDataHubRankDisplayText(opponentRank);
          if (opponentRankDisplay !== "NA") {
            const separator = document.createElement("span");
            separator.className = "gamelog-week-tag-separator";
            separator.textContent = " • ";
            opponentLine.appendChild(separator);

            const rankSpan = document.createElement("span");
            rankSpan.className = "gamelog-week-tag-rank";
            if (opponentRankColor) {
              rankSpan.style.color = opponentRankColor;
            }

            const rankNumber = document.createElement("span");
            rankNumber.className = "gamelog-week-tag-rank-number";
            rankNumber.textContent = String(opponentRank);
            rankSpan.appendChild(rankNumber);

            const suffix = document.createElement("span");
            suffix.className = "gamelog-week-tag-rank-suffix";
            suffix.textContent = getDataHubOrdinalSuffix(opponentRank);
            rankSpan.appendChild(suffix);

            opponentLine.appendChild(rankSpan);
          }
        }
        weekTag.appendChild(opponentLine);
      }

      td.textContent = "";
      td.appendChild(weekTag);
    },
  });

  const tableRows = [];
  const rowsMeta = [];
  const gameLogsWithData = [];
  for (let week = 1; week <= DATAHUB_MAX_WEEKS; week += 1) {
    const weekEntry = logsByWeek.get(week) || null;
    const stats = weekEntry?.stats || state.playerWeeklyStats?.[week]?.[player.id] || null;
    const opponent = String(stats?.opponent || "").trim().toUpperCase();
    const isByeWeek = opponent === "BYE";
    const liveFptsValue = Number.isFinite(stats?.fpts_override) ? stats.fpts_override : null;
    const hasRecordedStat = stats
      ? orderedStatKeys.some((statKey) => {
        if (!statLabels[statKey] || statKey === "proj") return false;
        return Number.isFinite(getDataHubGameLogStatValue(statKey, stats));
      })
      : false;
    const isLiveWeek = stats?.__live === true || (liveFptsValue !== null && !hasRecordedStat);
    const isUnplayedWeek = !isLiveWeek && (isByeWeek || !hasRecordedStat);
    const rowMeta = {
      week,
      isPlayed: !isUnplayedWeek,
      rowClasses: [],
    };
    if (isByeWeek) rowMeta.rowClasses.push("bye-week-row");
    if (isUnplayedWeek) rowMeta.rowClasses.push("unplayed-week-row");
    else if (isLiveWeek) rowMeta.rowClasses.push("live-week-row");

    const rowData = { week: buildWeekDescriptor(week, stats) };
    let rowFptsDash = false;

    for (const statKey of orderedStatKeys) {
      if (!statLabels[statKey]) continue;
      if (isUnplayedWeek) {
        if (statKey === "proj") {
          let projectionDisplay = getProjectionDisplayValue(stats);
          const normalizedProjection = projectionDisplay.trim().toUpperCase();
          if (Number(stats?.snp_pct) === 0 && !parseDataHubInjuryDesignation(normalizedProjection)) {
            projectionDisplay = "DNP";
          }
          const designation = parseDataHubInjuryDesignation(projectionDisplay);
          rowData[statKey] = createTextDescriptor(
            projectionDisplay || "",
            designation ? { color: designation.color } : undefined,
          );
        } else {
          rowData[statKey] = createTextDescriptor("-");
        }
        continue;
      }

      if (!stats) {
        rowData[statKey] = createTextDescriptor("-");
        continue;
      }

      if (statKey === "proj") {
        let projectionDisplay = getProjectionDisplayValue(stats);
        const normalizedProjection = projectionDisplay.trim().toUpperCase();
        if (Number(stats?.snp_pct) === 0 && !parseDataHubInjuryDesignation(normalizedProjection)) {
          projectionDisplay = "DNP";
        }
        const designation = parseDataHubInjuryDesignation(projectionDisplay);
        rowData[statKey] = createTextDescriptor(
          projectionDisplay || "",
          designation ? { color: designation.color } : undefined,
        );
        continue;
      }

      const rawValue = getDataHubGameLogStatValue(statKey, stats);
      const displayValue = formatDataHubGameLogCellValue(statKey, rawValue);
      if (statKey === "fpts" && displayValue === "-") {
        rowFptsDash = true;
      }
      rowData[statKey] = createTextDescriptor(displayValue);
    }

    if (rowFptsDash && !isByeWeek) {
      rowMeta.rowClasses.push("dnp-week-row");
    }

    if (!isUnplayedWeek && stats) {
      gameLogsWithData.push({ week, stats });
    }
    tableRows.push(rowData);
    rowsMeta.push(rowMeta);
  }

  const {
    aggregatedTotals,
    snapPctValues,
    statValueCounts,
  } = buildDataHubGameLogsDataContext(gameLogsWithData);
  const footerStats = buildDataHubFooterStats(player, playerRanks, seasonTotals, aggregatedTotals, gameLogsWithData);
  state.currentGameLogsFooterStats = footerStats;

  const createSectionTable = () => {
    const table = document.createElement("table");
    table.className = "game-logs-table";
    return table;
  };
  const columnSizes = tableColumns.map((column) => Number.isFinite(column.size) ? column.size : DEFAULT_COLUMN_WIDTH);
  const totalColumns = tableColumns.length;
  const totalTableWidth = columnSizes.reduce((sum, size) => sum + size, 0);

  const headerWrap = document.createElement("div");
  headerWrap.className = "game-logs-table-header";
  const headerTable = createSectionTable();
  const headerThead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  tableColumns.forEach((column, index) => {
    const th = document.createElement("th");
    if (column.meta?.headerClass) {
      column.meta.headerClass.split(" ").forEach((className) => {
        if (className) th.classList.add(className);
      });
    }
    th.textContent = typeof column.header === "function" ? column.header({}) : (column.header || "");
    const width = columnSizes[index] || DEFAULT_COLUMN_WIDTH;
    th.style.width = `${width}px`;
    th.style.minWidth = `${width}px`;
    th.style.maxWidth = `${width}px`;
    headerRow.appendChild(th);
  });
  headerThead.appendChild(headerRow);
  headerTable.appendChild(headerThead);
  headerWrap.appendChild(headerTable);

  const bodyWrap = document.createElement("div");
  bodyWrap.className = "game-logs-table-body";
  const bodyTable = createSectionTable();
  const bodyTbody = document.createElement("tbody");
  tableRows.forEach((rowData, index) => {
    const tr = document.createElement("tr");
    const meta = rowsMeta[index];
    if (meta) {
      meta.domRow = tr;
      meta.rowClasses.forEach((className) => tr.classList.add(className));
    }
    tableColumns.forEach((column, columnIndex) => {
      const td = document.createElement("td");
      if (column.meta?.cellClass) {
        column.meta.cellClass.split(" ").forEach((className) => {
          if (className) td.classList.add(className);
        });
      }
      const descriptor = rowData[column.id];
      if (descriptor?.render) {
        descriptor.render(td);
      }
      const width = columnSizes[columnIndex] || DEFAULT_COLUMN_WIDTH;
      td.style.width = `${width}px`;
      td.style.minWidth = `${width}px`;
      td.style.maxWidth = `${width}px`;
      tr.appendChild(td);
    });
    bodyTbody.appendChild(tr);
  });
  bodyTable.appendChild(bodyTbody);
  bodyWrap.appendChild(bodyTable);

  const dividerIndex = (() => {
    const sleeperCurrentWeek = Number.isFinite(state.currentNflWeek) ? state.currentNflWeek : null;
    if (!Number.isFinite(sleeperCurrentWeek)) {
      return rowsMeta.some((meta) => meta.isPlayed) ? rowsMeta.length : 0;
    }
    const currentWeekIndex = rowsMeta.findIndex((meta) => meta.week === sleeperCurrentWeek);
    if (currentWeekIndex === -1) {
      return rowsMeta.some((meta) => meta.isPlayed) ? rowsMeta.length : 0;
    }
    return rowsMeta[currentWeekIndex].isPlayed ? currentWeekIndex + 1 : currentWeekIndex;
  })();
  const dividerRow = document.createElement("tr");
  dividerRow.className = "week-divider-row";
  const dividerCell = document.createElement("td");
  dividerCell.colSpan = totalColumns;
  dividerRow.appendChild(dividerCell);
  bodyTbody.insertBefore(dividerRow, rowsMeta[Math.max(0, Math.min(dividerIndex, rowsMeta.length))]?.domRow || null);

  const footerWrap = document.createElement("div");
  footerWrap.className = "game-logs-table-footer";
  const footerTable = createSectionTable();
  const footerTfoot = document.createElement("tfoot");

  const footerHeaderRow = document.createElement("tr");
  tableColumns.forEach((column, index) => {
    const th = document.createElement("th");
    if (index === 0) th.classList.add("modal-table-footer-label", "week-column-header");
    if (column.meta?.headerClass) {
      column.meta.headerClass.split(" ").forEach((className) => {
        if (className) th.classList.add(className);
      });
    }
    th.textContent = column.id === "week"
      ? "SZN"
      : (typeof column.header === "function" ? column.header({}) : (column.header || ""));
    const width = columnSizes[index] || DEFAULT_COLUMN_WIDTH;
    th.style.width = `${width}px`;
    th.style.minWidth = `${width}px`;
    th.style.maxWidth = `${width}px`;
    footerHeaderRow.appendChild(th);
  });
  footerTfoot.appendChild(footerHeaderRow);

  const footerRow = document.createElement("tr");
  const totalTh = document.createElement("th");
  totalTh.className = "modal-table-footer-label week-column-header";
  const gamesPlayed = Number.isFinite(seasonTotals?.games_played)
    ? Math.round(seasonTotals.games_played)
    : gameLogsWithData.length;
  totalTh.innerHTML = `<span class="season-label">2025</span><br><span class="gp-label">(GP: ${gamesPlayed})</span>`;
  totalTh.style.width = `${columnSizes[0] || DEFAULT_COLUMN_WIDTH}px`;
  totalTh.style.minWidth = `${columnSizes[0] || DEFAULT_COLUMN_WIDTH}px`;
  totalTh.style.maxWidth = `${columnSizes[0] || DEFAULT_COLUMN_WIDTH}px`;
  footerRow.appendChild(totalTh);

  tableColumns.slice(1).forEach((column, index) => {
    const td = document.createElement("td");
    const width = columnSizes[index + 1] || DEFAULT_COLUMN_WIDTH;
    td.style.width = `${width}px`;
    td.style.minWidth = `${width}px`;
    td.style.maxWidth = `${width}px`;
    if (column.meta?.cellClass) {
      column.meta.cellClass.split(" ").forEach((className) => {
        if (className) td.classList.add(className);
      });
    }
    const statKey = column.meta?.statKey;
    if (!statKey) {
      footerRow.appendChild(td);
      return;
    }
    if (statKey === "proj") {
      td.textContent = "-";
      footerRow.appendChild(td);
      return;
    }

    const displayValue = getDataHubGameLogsSeasonDisplayValue({
      key: statKey,
      seasonTotals,
      aggregatedTotals,
      snapPctValues,
      statValueCounts,
      gameLogsWithData,
      player,
      playerRanks,
    });
    const rankValue = getDataHubSeasonRankValue(player.id, statKey);
    const rankAnnotation = createDataHubRankAnnotation(rankValue, {
      wrapInParens: false,
      ordinal: true,
      variant: "gamelogs-footer",
    });
    rankAnnotation.classList.add("stat-rank-annotation--bulleted");

    const bulletPrefix = document.createElement("span");
    bulletPrefix.className = "stat-rank-bullet";
    bulletPrefix.textContent = "•";
    const bulletSuffix = document.createElement("span");
    bulletSuffix.className = "stat-rank-bullet";
    bulletSuffix.textContent = "•";
    rankAnnotation.insertBefore(bulletPrefix, rankAnnotation.firstChild);
    rankAnnotation.appendChild(bulletSuffix);
    rankAnnotation.style.color = getDataHubConditionalColorByRank(rankValue, player.pos);

    const valueSpan = document.createElement("span");
    valueSpan.className = "stat-value";
    valueSpan.textContent = displayValue;
    td.appendChild(valueSpan);
    td.appendChild(rankAnnotation);
    td.classList.add("has-rank-annotation");
    footerRow.appendChild(td);
  });
  footerTfoot.appendChild(footerRow);
  footerTable.appendChild(footerTfoot);
  footerWrap.appendChild(footerTable);

  if (Number.isFinite(totalTableWidth) && totalTableWidth > 0) {
    const tableWidth = `${totalTableWidth}px`;
    headerTable.style.width = tableWidth;
    headerTable.style.minWidth = tableWidth;
    bodyTable.style.width = tableWidth;
    bodyTable.style.minWidth = tableWidth;
    footerTable.style.width = tableWidth;
    footerTable.style.minWidth = tableWidth;
  }

  const hScroll = document.createElement("div");
  hScroll.className = "game-logs-hscroll";
  const hContent = document.createElement("div");
  hContent.className = "game-logs-hscroll-content";
  hContent.appendChild(headerWrap);
  hContent.appendChild(bodyWrap);
  hContent.appendChild(footerWrap);
  hScroll.appendChild(hContent);
  container.appendChild(hScroll);
  return container;
}

function getDataHubLogOrderForPosition(position) {
  const pos = String(position || "").trim().toUpperCase();
  if (pos === "QB") return DATAHUB_QB_LOG_ORDER;
  if (pos === "RB") return DATAHUB_RB_LOG_ORDER;
  return DATAHUB_WR_TE_LOG_ORDER;
}

function buildDataHubGameLogsDataContext(gameLogs) {
  const aggregatedTotals = Object.create(null);
  const snapPctValues = [];
  const statValueCounts = {};
  gameLogs.forEach(({ stats }) => {
    Object.entries(stats || {}).forEach(([key, value]) => {
      if (!Number.isFinite(value)) return;
      if (key === "snp_pct") {
        snapPctValues.push(value);
      } else {
        aggregatedTotals[key] = (aggregatedTotals[key] || 0) + value;
      }
      statValueCounts[key] = (statValueCounts[key] || 0) + 1;
    });
  });
  return { aggregatedTotals, snapPctValues, statValueCounts };
}

function buildDataHubFooterStats(player, playerRanks, seasonTotals, aggregatedTotals, gameLogsWithData) {
  const footerStats = Object.create(null);
  const statOrder = getDataHubLogOrderForPosition(player.pos);
  footerStats.fpts = Number(playerRanks.total_pts);
  footerStats.ppg = Number(playerRanks.ppg);
  statOrder.forEach((statKey) => {
    if (statKey === "proj") {
      footerStats[statKey] = null;
      return;
    }
    footerStats[statKey] = computeDataHubSeasonValue(statKey, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
  });
  footerStats.__gamesPlayed = gameLogsWithData.length;
  return footerStats;
}

function computeDataHubSeasonValue(statKey, seasonTotals, aggregatedTotals, gameLogs, playerRanks) {
  if (statKey === "fpts") {
    return Number(playerRanks.total_pts);
  }
  if (statKey === "ppg") {
    return Number(playerRanks.ppg);
  }
  if (Number.isFinite(seasonTotals?.[statKey])) {
    return seasonTotals[statKey];
  }
  if (DATAHUB_NO_FALLBACK_KEYS.has(statKey) && !Number.isFinite(seasonTotals?.[statKey])) {
    return null;
  }
  if (statKey === "yds_total") {
    return (aggregatedTotals.pass_yd || 0) + (aggregatedTotals.rush_yd || 0) + (aggregatedTotals.rec_yd || 0);
  }
  if (statKey === "fpoe") {
    return Number.isFinite(aggregatedTotals.fpoe) ? aggregatedTotals.fpoe : null;
  }
  if (statKey === "pa_ypg") {
    const gamesPlayed = Number.isFinite(seasonTotals?.games_played) ? seasonTotals.games_played : gameLogs.length;
    const totalPassYds = aggregatedTotals.pass_yd || 0;
    return gamesPlayed > 0 ? totalPassYds / gamesPlayed : null;
  }
  if (statKey === "ru_ypg") {
    const gamesPlayed = Number.isFinite(seasonTotals?.games_played) ? seasonTotals.games_played : gameLogs.length;
    const totalRushYds = aggregatedTotals.rush_yd || 0;
    return gamesPlayed > 0 ? totalRushYds / gamesPlayed : null;
  }
  if (statKey === "rec_ypg") {
    const gamesPlayed = Number.isFinite(seasonTotals?.games_played) ? seasonTotals.games_played : gameLogs.length;
    const totalRecYds = aggregatedTotals.rec_yd || 0;
    return gamesPlayed > 0 ? totalRecYds / gamesPlayed : null;
  }
  if (statKey === "dp_pct") {
    const total = Number.isFinite(aggregatedTotals.dp_pct) ? aggregatedTotals.dp_pct : null;
    const count = gameLogs
      .map(({ stats }) => Number(stats?.dp_pct))
      .filter(Number.isFinite)
      .length;
    return total !== null && count > 0 ? total / count : null;
  }
  if (statKey === "snp_pct") {
    const snapValues = gameLogs
      .map(({ stats }) => Number(stats?.snp_pct))
      .filter(Number.isFinite);
    if (!snapValues.length) return null;
    return snapValues.reduce((sum, value) => sum + value, 0) / snapValues.length;
  }
  if (statKey === "imp_per_g") {
    const gamesPlayed = Math.max(1, gameLogs.length);
    const impactTotal = Number.isFinite(aggregatedTotals.imp)
      ? aggregatedTotals.imp
      : (aggregatedTotals.pass_fd || 0)
        + (aggregatedTotals.rush_fd || 0)
        + (aggregatedTotals.rec_fd || 0)
        + (aggregatedTotals.pass_td || 0)
        + (aggregatedTotals.rush_td || 0)
        + (aggregatedTotals.rec_td || 0);
    return impactTotal / gamesPlayed;
  }
  if (statKey === "ypc") {
    const attempts = aggregatedTotals.rush_att || 0;
    return attempts > 0 ? (aggregatedTotals.rush_yd || 0) / attempts : null;
  }
  if (statKey === "yco_per_att") {
    const attempts = aggregatedTotals.rush_att || 0;
    return attempts > 0 ? (aggregatedTotals.rush_yac || 0) / attempts : null;
  }
  if (statKey === "mtf_per_att") {
    const attempts = aggregatedTotals.rush_att || 0;
    return attempts > 0 ? (aggregatedTotals.mtf || 0) / attempts : null;
  }
  if (statKey === "ypr") {
    const receptions = aggregatedTotals.rec || 0;
    return receptions > 0 ? (aggregatedTotals.rec_yd || 0) / receptions : null;
  }
  if (statKey === "yprr") {
    const routes = aggregatedTotals.rr || 0;
    return routes > 0 ? (aggregatedTotals.rec_yd || 0) / routes : null;
  }
  if (statKey === "ts_per_rr") {
    const routes = aggregatedTotals.rr || 0;
    return routes > 0 ? ((aggregatedTotals.rec_tgt || 0) / routes) * 100 : null;
  }
  if (statKey === "first_down_rec_rate") {
    const receptions = aggregatedTotals.rec || 0;
    return receptions > 0 ? (aggregatedTotals.rec_fd || 0) / receptions : null;
  }
  if (statKey === "pass_imp_per_att") {
    const attempts = aggregatedTotals.pass_att || 0;
    return attempts > 0 ? ((aggregatedTotals.pass_imp || 0) / attempts) * 100 : null;
  }
  if (statKey === "pass_rtg") {
    const gamesWithPassAttempts = gameLogs.filter(({ stats }) => (stats?.pass_att || 0) > 0).length;
    return gamesWithPassAttempts > 0 ? (aggregatedTotals.pass_rtg || 0) / gamesWithPassAttempts : null;
  }
  if (statKey === "cmp_pct") {
    const attempts = aggregatedTotals.pass_att || 0;
    return attempts > 0 ? ((aggregatedTotals.pass_cmp || 0) / attempts) * 100 : null;
  }
  return Number.isFinite(aggregatedTotals[statKey]) ? aggregatedTotals[statKey] : null;
}

function getDataHubGameLogStatValue(statKey, stats) {
  if (!stats) return null;
  if (DATAHUB_NO_FALLBACK_KEYS.has(statKey)) {
    return Number.isFinite(stats[statKey]) ? stats[statKey] : null;
  }
  if (statKey === "fpts") {
    if (Number.isFinite(stats.fpts_override)) return stats.fpts_override;
    if (Number.isFinite(stats.fpt_ppr)) return stats.fpt_ppr;
    return Number.isFinite(stats.fpts) ? stats.fpts : null;
  }
  if (statKey === "yds_total") {
    const totalYards = (Number.isFinite(stats.pass_yd) ? stats.pass_yd : 0)
      + (Number.isFinite(stats.rush_yd) ? stats.rush_yd : 0)
      + (Number.isFinite(stats.rec_yd) ? stats.rec_yd : 0);
    return totalYards > 0 ? totalYards : (Number.isFinite(stats.yds_total) ? stats.yds_total : 0);
  }
  if (statKey === "ypc") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.rush_yd) || 0) / attempts : 0;
  }
  if (statKey === "yco_per_att") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.rush_yac) || 0) / attempts : 0;
  }
  if (statKey === "mtf_per_att") {
    const attempts = Number(stats.rush_att) || 0;
    return attempts > 0 ? (Number(stats.mtf) || 0) / attempts : 0;
  }
  if (statKey === "pass_imp_per_att") {
    const attempts = Number(stats.pass_att) || 0;
    return attempts > 0 ? ((Number(stats.pass_imp) || 0) / attempts) * 100 : 0;
  }
  if (statKey === "ts_per_rr") {
    const routes = Number(stats.rr) || 0;
    return routes > 0 ? ((Number(stats.rec_tgt) || 0) / routes) * 100 : 0;
  }
  if (statKey === "yprr") {
    const routes = Number(stats.rr) || 0;
    return routes > 0 ? (Number(stats.rec_yd) || 0) / routes : 0;
  }
  if (statKey === "ypr") {
    const receptions = Number(stats.rec) || 0;
    return receptions > 0 ? (Number(stats.rec_yd) || 0) / receptions : 0;
  }
  if (statKey === "first_down_rec_rate") {
    const receptions = Number(stats.rec) || 0;
    return receptions > 0 ? (Number(stats.rec_fd) || 0) / receptions : 0;
  }
  if (statKey === "imp_per_g") {
    if (Number.isFinite(stats.imp_per_g)) return stats.imp_per_g;
    if (Number.isFinite(stats.imp)) return stats.imp;
    return 0;
  }
  if (statKey === "cmp_pct") {
    const attempts = Number(stats.pass_att) || 0;
    return attempts > 0 ? ((Number(stats.pass_cmp) || 0) / attempts) * 100 : 0;
  }
  if (["prs_pct", "snp_pct", "ttt"].includes(statKey)) {
    return Number.isFinite(stats[statKey]) ? stats[statKey] : 0;
  }
  return Number.isFinite(stats[statKey]) ? stats[statKey] : 0;
}

function formatDataHubGameLogCellValue(statKey, value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return statKey === "fpts" ? "-" : "N/A";
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return statKey === "fpts" ? "-" : "N/A";
  }
  if (statKey === "yco_per_att") return numericValue.toFixed(2);
  if (["mtf_per_att", "ypc", "ttt", "ypr", "yprr", "first_down_rec_rate"].includes(statKey)) {
    return numericValue.toFixed(2);
  }
  if (["pass_imp_per_att", "prs_pct", "snp_pct", "ts_per_rr", "cmp_pct"].includes(statKey)) {
    return `${numericValue.toFixed(1)}%`;
  }
  if (["pass_rtg", "fpts"].includes(statKey)) {
    return numericValue.toFixed(1);
  }
  return Number.isInteger(numericValue) ? String(numericValue) : numericValue.toFixed(2);
}

function formatDataHubRadarStatValue(statKey, value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      if ((statKey === "cpoe" || statKey === "epa_per_db") && !trimmed.startsWith("-") && !trimmed.startsWith("+")) {
        const numericValue = parseFloat(trimmed.replace("%", ""));
        if (Number.isFinite(numericValue) && numericValue > 0) return `+${trimmed}`;
      }
      return trimmed;
    }
  }
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "N/A";

  if (["cmp_pct", "snp_pct", "ts_per_rr", "prs_pct", "pass_imp_per_att", "expl_ru_pct"].includes(statKey)) {
    return `${numericValue.toFixed(1)}%`;
  }
  if (statKey === "cpoe") {
    const formatted = `${numericValue.toFixed(1)}%`;
    return numericValue > 0 ? `+${formatted}` : formatted;
  }
  if (statKey === "epa_per_db") {
    const formatted = numericValue.toFixed(2);
    return numericValue > 0 ? `+${formatted}` : formatted;
  }
  if (statKey === "first_down_rec_rate") return numericValue.toFixed(2);
  if (["fpts", "ppg", "pass_rtg", "rec_ypg"].includes(statKey)) return numericValue.toFixed(1);
  if (["rec", "rec_tgt", "yds_total"].includes(statKey)) return Math.round(numericValue).toString();
  if (["ttt", "imp_per_g"].includes(statKey)) return numericValue.toFixed(2);
  return numericValue.toFixed(2);
}

function formatDataHubPercentage(value, decimals = 1) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return `${(0).toFixed(decimals)}%`;
  }
  return `${numericValue.toFixed(decimals)}%`;
}

function getDataHubRankDisplayText(rank) {
  if (rank === null || rank === undefined || Number.isNaN(rank)) {
    return "NA";
  }
  const rankText = String(rank).trim();
  if (!rankText) return "NA";
  const upper = rankText.toUpperCase();
  if (upper === "NA" || upper === "N/A") return "NA";
  return rankText;
}

function createDataHubRankAnnotation(rank, { wrapInParens = true, ordinal = false, variant = "default" } = {}) {
  const span = document.createElement("span");
  span.className = `stat-rank-annotation stat-rank-variant-${variant}`;
  const displayText = getDataHubRankDisplayText(rank);
  const numericRank = Number(displayText);

  if (displayText !== "NA" && Number.isFinite(numericRank)) {
    if (wrapInParens) span.appendChild(document.createTextNode("("));
    const numberNode = document.createElement("span");
    numberNode.className = "stat-rank-number";
    numberNode.textContent = String(numericRank);
    span.appendChild(numberNode);
    if (ordinal) {
      const suffixNode = variant === "ktc"
        ? document.createElement("span")
        : document.createElement("sup");
      suffixNode.className = `stat-rank-suffix stat-rank-suffix-${variant}`;
      suffixNode.textContent = getDataHubOrdinalSuffix(numericRank);
      span.appendChild(suffixNode);
    }
    if (wrapInParens) span.appendChild(document.createTextNode(")"));
    return span;
  }

  span.textContent = wrapInParens ? `(${displayText})` : displayText;
  return span;
}

function parseDataHubInjuryDesignation(rawValue) {
  if (rawValue === undefined || rawValue === null) return null;
  const trimmed = String(rawValue).trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (["NA", "N/A", "UNDEFINED", "NULL"].includes(upper)) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return null;
  let primaryToken = upper.split(/\s+/)[0]?.replace(/[^A-Z]/g, "") || "";
  if (!primaryToken) return null;
  if (primaryToken.startsWith("QUESTION")) primaryToken = "Q";
  else if (primaryToken.startsWith("DOUBT")) primaryToken = "D";
  else if (primaryToken === "OUT") primaryToken = "OUT";
  else if (primaryToken.includes("IR")) primaryToken = "IR";
  else if (primaryToken.startsWith("PUP")) primaryToken = "PUP";
  else if (primaryToken.startsWith("DNP")) primaryToken = "DNP";
  const color = DATAHUB_INJURY_DESIGNATION_COLORS[primaryToken] || "var(--datahub-modal-text-secondary)";
  return { designation: primaryToken, color, raw: trimmed };
}

function getDataHubGameLogsSeasonDisplayValue({
  key,
  seasonTotals,
  aggregatedTotals,
  snapPctValues,
  statValueCounts,
  gameLogsWithData,
  player,
  playerRanks,
}) {
  if (key === "proj") return "-";
  let displayValue;

  if (DATAHUB_NO_FALLBACK_KEYS.has(key)) {
    const raw = seasonTotals && typeof seasonTotals[key] === "number" ? seasonTotals[key] : null;
    if (raw === null) {
      displayValue = "N/A";
    } else if (key === "expl_ru_pct") {
      const normalized = Math.abs(raw) <= 1.5 ? raw * 100 : raw;
      displayValue = formatDataHubPercentage(normalized);
    } else if (["snp_pct", "prs_pct", "ts_per_rr", "cmp_pct"].includes(key)) {
      displayValue = formatDataHubPercentage(raw);
    } else if (key === "cpoe") {
      const formatted = formatDataHubPercentage(raw, 1);
      displayValue = raw > 0 ? `+${formatted}` : formatted;
    } else if (key === "epa_per_db") {
      const formatted = Number(raw).toFixed(2);
      displayValue = raw > 0 ? `+${formatted}` : formatted;
    } else {
      displayValue = Number.isInteger(raw) ? String(raw) : Number(raw).toFixed(2);
    }
    return displayValue;
  }

  if (key === "fpts") {
    const summaryFpts = playerRanks?.total_pts;
    if (summaryFpts !== null && summaryFpts !== undefined && summaryFpts !== "") {
      return typeof summaryFpts === "number" ? summaryFpts.toFixed(1) : String(summaryFpts);
    }
    const numericValue = computeDataHubSeasonValue(key, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
    return Number.isFinite(numericValue) ? Number(numericValue).toFixed(1) : "N/A";
  }

  if (key === "ppg") {
    const summaryPpg = playerRanks?.ppg;
    if (summaryPpg !== null && summaryPpg !== undefined && summaryPpg !== "") {
      return typeof summaryPpg === "number" ? summaryPpg.toFixed(1) : String(summaryPpg);
    }
    const numericValue = computeDataHubSeasonValue(key, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
    return Number.isFinite(numericValue) ? Number(numericValue).toFixed(1) : "N/A";
  }

  if (key === "fpoe") {
    const hasSeasonValue = seasonTotals && typeof seasonTotals.fpoe === "number" && Number.isFinite(seasonTotals.fpoe);
    const hasAggregatedValue = aggregatedTotals && Object.prototype.hasOwnProperty.call(aggregatedTotals, "fpoe")
      && typeof aggregatedTotals.fpoe === "number" && Number.isFinite(aggregatedTotals.fpoe);
    if (!hasSeasonValue && !hasAggregatedValue) return "N/A";
    const value = hasSeasonValue ? seasonTotals.fpoe : aggregatedTotals.fpoe;
    return Number(value).toFixed(1);
  }

  if (["pa_ypg", "ru_ypg", "rec_ypg"].includes(key)) {
    const perGameValue = computeDataHubSeasonValue(key, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
    return Number.isFinite(perGameValue) ? Number(perGameValue).toFixed(1) : "N/A";
  }

  if (key === "dp_pct") {
    let pctValue = seasonTotals && typeof seasonTotals.dp_pct === "number" ? seasonTotals.dp_pct : null;
    if (pctValue === null) {
      const hasTotal = aggregatedTotals && typeof aggregatedTotals.dp_pct === "number" && Number.isFinite(aggregatedTotals.dp_pct);
      const count = typeof statValueCounts?.dp_pct === "number" ? statValueCounts.dp_pct : 0;
      if (hasTotal && count > 0) pctValue = aggregatedTotals.dp_pct / count;
    }
    if (pctValue === null || pctValue === undefined || !Number.isFinite(Number(pctValue))) {
      return "N/A";
    }
    const normalized = Math.abs(pctValue) <= 1.5 ? pctValue * 100 : pctValue;
    return formatDataHubPercentage(normalized, 1);
  }

  if (key === "pass_rtg") {
    const rating = computeDataHubSeasonValue(key, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
    if (!Number.isFinite(rating)) return "N/A";
    return Number.isInteger(rating) ? String(rating) : Number(rating).toFixed(1);
  }

  if (["pass_imp_per_att", "prs_pct", "cmp_pct", "snp_pct", "ts_per_rr"].includes(key)) {
    const pctValue = computeDataHubSeasonValue(key, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
    if (!Number.isFinite(pctValue)) return "N/A";
    return formatDataHubPercentage(pctValue);
  }

  if (["ypc", "yco_per_att", "mtf_per_att", "ttt", "imp_per_g", "yprr", "ypr", "first_down_rec_rate"].includes(key)) {
    const numericValue = computeDataHubSeasonValue(key, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
    if (!Number.isFinite(numericValue)) return "N/A";
    if (key === "ttt" && Number.isInteger(numericValue)) return String(numericValue);
    return Number.isInteger(numericValue) ? String(numericValue) : Number(numericValue).toFixed(2);
  }

  const totalValue = computeDataHubSeasonValue(key, seasonTotals, aggregatedTotals, gameLogsWithData, playerRanks);
  if (!Number.isFinite(totalValue)) return "N/A";
  return Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue).toFixed(2);
}

function renderDataHubSeasonStatsView(player, gameLogs, playerRanks) {
  const container = document.createElement("div");
  container.className = "game-logs-szn-view hidden";
  const seasonTotals = state.playerSeasonStats?.[player.id] || null;
  const orderedStatKeys = getDataHubLogOrderForPosition(player.pos);
  const {
    aggregatedTotals,
    snapPctValues,
    statValueCounts,
  } = buildDataHubGameLogsDataContext(gameLogs);

  const title = document.createElement("div");
  title.className = "gamelogs-szn-title";
  title.setAttribute("role", "heading");
  title.setAttribute("aria-level", "3");

  const titleIcon = createDataHubModalIcon("season", "gamelogs-szn-title-icon");
  if (titleIcon) {
    title.appendChild(titleIcon);
  }

  const titleText = document.createElement("span");
  titleText.className = "gamelogs-szn-title-text";
  titleText.textContent = "Season Stats";
  title.appendChild(titleText);

  const gamesPlayed = Number.isFinite(seasonTotals?.games_played)
    ? Math.round(seasonTotals.games_played)
    : null;
  if (gamesPlayed !== null) {
    const games = document.createElement("span");
    games.className = "gamelogs-szn-title-games";
    const gamesLabel = document.createElement("span");
    gamesLabel.className = "gamelogs-szn-title-games-label";
    gamesLabel.textContent = "G:";
    const gamesValue = document.createElement("span");
    gamesValue.className = "gamelogs-szn-title-games-value";
    gamesValue.textContent = String(gamesPlayed);
    games.appendChild(gamesLabel);
    games.appendChild(gamesValue);
    title.appendChild(games);
  }

  const list = document.createElement("div");
  list.className = "gamelogs-szn-list";
  const sections = DATAHUB_SZN_STAT_SECTIONS_BY_POS[player.pos] || [];
  const usedKeys = new Set();
  const appendSeasonStatRow = (statKey) => {
    if (!DATAHUB_STAT_LABELS[statKey] || statKey === "proj" || usedKeys.has(statKey)) {
      return false;
    }
    const labelText = DATAHUB_STAT_LABELS[statKey];
    const rankValue = getDataHubSeasonRankValue(player.id, statKey);
    const rankColor = getDataHubSznStatRankColor(rankValue, player.pos);
    const fillCoreColor = getDataHubSznStatFillCoreColor(rankValue, player.pos);
    const rankBoxShadow = getDataHubSznStatRankBoxShadow(rankValue, player.pos, rankColor);
    const progressPercent = computeDataHubSznProgressPercent(rankValue, player.pos);
    const displayValue = getDataHubGameLogsSeasonDisplayValue({
      key: statKey,
      seasonTotals,
      aggregatedTotals,
      snapPctValues,
      statValueCounts,
      gameLogsWithData: gameLogs,
      player,
      playerRanks,
    });

    const row = document.createElement("div");
    row.className = "gamelogs-szn-row";
    const statGroup = getDataHubStatGroup(statKey);
    if (statGroup) row.classList.add(`gamelogs-szn-row--${statGroup}`);

    const label = document.createElement("div");
    label.className = "gamelogs-szn-label";
    label.textContent = labelText;

    const bar = document.createElement("div");
    bar.className = "gamelogs-szn-bar";
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", `${labelText} rank ${getDataHubRankDisplayText(rankValue)}`);

    const fill = document.createElement("div");
    fill.className = "gamelogs-szn-bar-fill";
    fill.style.width = `${progressPercent}%`;
    if (progressPercent > 0) {
      const gradient = buildDataHubSznFillCoreGradient(fillCoreColor);
      if (gradient) {
        fill.style.backgroundImage = gradient;
        fill.style.backgroundColor = "transparent";
      } else if (fillCoreColor && fillCoreColor !== "inherit") {
        fill.style.backgroundImage = "none";
        fill.style.backgroundColor = fillCoreColor;
      }
      if (rankColor && rankColor !== "inherit") {
        fill.style.border = `1px solid ${rankColor}`;
        fill.style.boxShadow = rankBoxShadow;
      }
    }
    bar.appendChild(fill);

    const rankAnnotation = createDataHubRankAnnotation(rankValue, {
      wrapInParens: false,
      ordinal: true,
      variant: "szn",
    });
    rankAnnotation.classList.add("gamelogs-szn-bar-rank");
    if (rankColor && rankColor !== "inherit") {
      rankAnnotation.style.color = rankColor;
    }
    const rankPosition = Math.min(98, Math.max(2, Number.isFinite(progressPercent) ? progressPercent : 0));
    rankAnnotation.style.setProperty("--szn-rank-pos", `${rankPosition}%`);
    bar.appendChild(rankAnnotation);

    const value = document.createElement("div");
    value.className = "gamelogs-szn-value";
    const valueMain = document.createElement("span");
    valueMain.className = "gamelogs-szn-value-main";
    const valueText = String(displayValue ?? "").trim();
    if (valueText.endsWith("%") && valueText.length > 1) {
      const numberPart = document.createElement("span");
      numberPart.className = "gamelogs-szn-value-number";
      numberPart.textContent = valueText.slice(0, -1);
      const percentPart = document.createElement("span");
      percentPart.className = "gamelogs-szn-value-percent";
      percentPart.textContent = "%";
      valueMain.appendChild(numberPart);
      valueMain.appendChild(percentPart);
    } else {
      valueMain.textContent = valueText;
    }
    value.appendChild(valueMain);

    row.appendChild(label);
    row.appendChild(bar);
    row.appendChild(value);
    list.appendChild(row);
    usedKeys.add(statKey);
    return true;
  };

  sections.forEach((section) => {
    const visibleKeys = (section.stats || []).filter((statKey) => DATAHUB_STAT_LABELS[statKey] && statKey !== "proj" && !usedKeys.has(statKey));
    if (!visibleKeys.length) return;

    const header = document.createElement("div");
    header.className = "gamelogs-szn-section-header";
    if (section.tone) header.classList.add(`gamelogs-szn-section-header--${section.tone}`);
    header.setAttribute("role", "heading");
    header.setAttribute("aria-level", "4");
    header.textContent = section.label || "SECTION";
    list.appendChild(header);

    visibleKeys.forEach((statKey) => {
      appendSeasonStatRow(statKey);
    });
  });

  if (!sections.length) {
    orderedStatKeys.forEach((statKey) => {
      appendSeasonStatRow(statKey);
    });
  }

  container.appendChild(title);
  container.appendChild(list);
  return container;
}

function computeDataHubSznProgressPercent(rank, position) {
  const numericRank = Number(rank);
  if (!Number.isFinite(numericRank) || numericRank <= 0) {
    return 0;
  }
  const thresholds = DATAHUB_SZN_PROGRESS_THRESHOLDS[String(position || "").trim().toUpperCase()] || DATAHUB_SZN_PROGRESS_THRESHOLDS.WR;
  const sortedThresholds = thresholds.slice().sort((left, right) => left.rank - right.rank);
  if (numericRank <= sortedThresholds[0].rank) return sortedThresholds[0].pct;
  if (numericRank >= sortedThresholds[sortedThresholds.length - 1].rank) return sortedThresholds[sortedThresholds.length - 1].pct;
  for (let index = 0; index < sortedThresholds.length - 1; index += 1) {
    const start = sortedThresholds[index];
    const end = sortedThresholds[index + 1];
    if (numericRank >= start.rank && numericRank <= end.rank) {
      const progress = (numericRank - start.rank) / Math.max(1, end.rank - start.rank);
      return start.pct + ((end.pct - start.pct) * progress);
    }
  }
  return 0;
}

function getDataHubSeasonRankValue(playerId, statKey) {
  const ranks = state.playerSeasonRanks?.[playerId];
  if (statKey === "fpts") {
    return state.currentGameLogsPlayerRanks?.posRank || state.modalRankCache?.[playerId]?.posRank || null;
  }
  if (statKey === "ppg") {
    return state.currentGameLogsPlayerRanks?.ppgPosRank || state.modalRankCache?.[playerId]?.ppgPosRank || null;
  }
  return Number.isFinite(ranks?.[statKey]) ? ranks[statKey] : null;
}

function getDataHubStatGroup(statKey) {
  if ([
    "pass_att", "pass_cmp", "pass_yd", "pass_td", "pass_fd", "pass_imp", "pass_rtg",
    "pass_imp_per_att", "pass_int", "pass_sack", "ttt", "prs_pct", "cmp_pct", "epa_per_db", "cpoe", "dp_pct", "pa_ypg",
  ].includes(statKey)) return "passing";
  if ([
    "rush_att", "rush_yd", "rush_td", "rush_fd", "ypc", "elu", "mtf_per_att", "yco_per_att",
    "mtf", "rush_yac", "ryoe", "expl_ru_pct", "ru_ypg",
  ].includes(statKey)) return "rushing";
  if ([
    "rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "ts_per_rr", "yprr", "ypr",
    "rr", "rz_tgt", "first_down_rec_rate", "rec_ypg", "ay_pct",
  ].includes(statKey)) return "receiving";
  return "all";
}

function getDataHubSznStatRankColor(rank, position) {
  if (typeof rank !== "number" || rank <= 0) return "inherit";
  const normalizedPos = typeof position === "string" ? position.trim().toUpperCase() : "";
  const thresholds = normalizedPos === "WR"
    ? [
      { v: 12, c: "#00FFFFB5" },
      { v: 24, c: "#1b7affec" },
      { v: 36, c: "#3300ff" },
      { v: 48, c: "#5700FF" },
      { v: 60, c: "#8732ff" },
      { v: 72, c: "#ea08ff" },
    ]
    : [
      { v: 8, c: "#00FFFFB5" },
      { v: 16, c: "#1b7affec" },
      { v: 24, c: "#3300ff" },
      { v: 32, c: "#5700FF" },
      { v: 40, c: "#8732ff" },
      { v: 50, c: "#ea08ff" },
    ];
  for (const threshold of thresholds) {
    if (rank <= threshold.v) return threshold.c;
  }
  return "#63616c";
}

function buildDataHubSznFillCoreGradient(fillCoreColor) {
  if (!fillCoreColor || fillCoreColor === "inherit") return null;
  return `linear-gradient(90deg, ${fillCoreColor} 0%, ${fillCoreColor} 100%)`;
}

function getDataHubSznStatFillCoreColor(rank, position) {
  if (typeof rank !== "number" || rank <= 0) return "inherit";
  const normalizedPos = typeof position === "string" ? position.trim().toUpperCase() : "";
  const thresholds = normalizedPos === "WR"
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

function getDataHubSznStatRankBoxShadow(rank, position, rankColor) {
  if (typeof rank !== "number" || rank <= 0 || !rankColor || rankColor === "inherit") return "none";
  const normalizedPos = typeof position === "string" ? position.trim().toUpperCase() : "";
  const thresholds = normalizedPos === "WR"
    ? [
      { v: 12, s: `inset 0 0 4px 1px ${rankColor}` },
      { v: 24, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 36, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 48, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 60, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 72, s: `inset 0 0 5px 1px ${rankColor}` },
    ]
    : [
      { v: 8, s: `inset 0 0 4px 1px ${rankColor}` },
      { v: 16, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 24, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 32, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 40, s: `inset 0 0 5px 1px ${rankColor}` },
      { v: 50, s: `inset 0 0 5px 1px ${rankColor}` },
    ];
  for (const threshold of thresholds) {
    if (rank <= threshold.v) return threshold.s;
  }
  return `inset 0 0 8px 1px ${rankColor}, 0 0 2px ${rankColor}`;
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
    const levels = options.levels || [];
    levels.forEach((level) => {
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
      const dataPoint = scale.getPointPositionForValue(index, value);
      let offsetDistance = options.offset || 18;
      if (index === 0 || index === 1) offsetDistance -= 1.5;
      else if (index === 7) offsetDistance += 3.5;
      else if (index === 5) offsetDistance += 4;
      else if (index === 6) offsetDistance += 7;

      const offsetX = Math.cos(angle) * offsetDistance;
      const offsetY = Math.sin(angle) * offsetDistance;
      const rawRank = dataset.rawRanks?.[index];
      const rankColor = getDataHubConditionalColorByRank(rawRank, dataset.position);

      if (rawRank !== null && rawRank !== undefined && !Number.isNaN(rawRank)) {
        const rankNumber = Math.round(rawRank);
        const suffixText = getDataHubOrdinalSuffix(rankNumber);
        const labelText = rankNumber.toString();
        ctx.fillStyle = rankColor;
        ctx.fillText(labelText, dataPoint.x + offsetX, dataPoint.y + offsetY);
        const metrics = ctx.measureText(labelText);
        const suffixFontSize = parseInt(ctx.font, 10) * 0.7;
        ctx.font = `${suffixFontSize}px "Product Sans"`;
        ctx.fillText(suffixText, dataPoint.x + offsetX + (metrics.width / 2) + 4, dataPoint.y + offsetY);
        ctx.font = options.font || '11px "Product Sans"';
      } else {
        ctx.fillStyle = rankColor;
        ctx.fillText("NA", dataPoint.x + offsetX, dataPoint.y + offsetY);
      }
    });
  },
};

const dataHubPlayerRadarAxisLabelsPlugin = {
  id: "dataHubPlayerRadarAxisLabels",
  afterDraw(chart, args, options) {
    const scale = chart.scales?.r;
    if (!scale) return;
    const dataset = chart.data.datasets[0];
    if (!dataset) return;
    const labels = chart.data.labels;
    if (!labels?.length) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const labelFontSize = isMobile ? (options?.labelFontSizeMobile ?? 11) : (options?.labelFontSize ?? 12);
    const valueFontSize = isMobile ? (options?.valueFontSizeMobile ?? 9) : (options?.valueFontSize ?? 10);
    const labelFont = `${labelFontSize}px "Product Sans", "Google Sans", sans-serif`;
    const valueFont = `${valueFontSize}px "Product Sans", "Google Sans", sans-serif`;
    const labelColor = options?.labelColor || "#EAEBF0";
    const labelOffset = options?.labelOffset ?? (isMobile ? 14 : 18);
    const topLabelExtraOffset = options?.topLabelExtraOffset ?? (isMobile ? 10 : 12);
    const axisLabelExtraOffsetsByIndex = options?.axisLabelExtraOffsetsByIndex ?? {
      1: 17,
      2: 14,
      3: 10,
      5: 13,
      6: 18,
      7: 21,
    };
    const valueSpacing = options?.valueSpacing ?? (isMobile ? 3 : 4);

    const { ctx } = chart;
    const angleStep = (Math.PI * 2) / labels.length;
    const startAngle = -Math.PI / 2;

    ctx.save();
    for (let index = 0; index < labels.length; index += 1) {
      const angle = startAngle + angleStep * index;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      let textBaseline;
      if (Math.abs(sin) <= 1e-4) textBaseline = "middle";
      else textBaseline = sin < 0 ? "bottom" : "top";

      let effectiveOffset = labelOffset;
      if (index === 0) effectiveOffset = labelOffset + topLabelExtraOffset;
      const axisExtraOffset = Number(axisLabelExtraOffsetsByIndex[index]);
      if (Number.isFinite(axisExtraOffset)) {
        effectiveOffset += axisExtraOffset;
      }
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
      const formattedValue = formatDataHubRadarStatValue(statKey, statValue);
      const rawRank = dataset.rawRanks?.[index];
      const valueColor = getDataHubConditionalColorByRank(rawRank, dataset.position) || labelColor;
      let valueY = y;
      if (textBaseline === "top") {
        valueY = y + labelFontSize + valueSpacing;
      } else if (textBaseline === "middle") {
        valueY = y + (labelFontSize / 2) + valueSpacing;
      } else {
        valueY = y + valueSpacing;
      }
      ctx.font = valueFont;
      ctx.textBaseline = "top";
      ctx.fillStyle = valueColor;
      ctx.fillText(`• ${formattedValue} •`, x, valueY);
    }
    ctx.restore();
  },
};

function renderDataHubRadarChart(playerId, position) {
  const container = radarChartContainer?.querySelector(".radar-chart-content");
  if (!container) return;

  container.innerHTML = "";
  const radarData = getDataHubRadarData(playerId, position);
  if (!radarData || !window.Chart) {
    container.innerHTML = '<p class="no-data-message">No radar data available for this position.</p>';
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.id = "player-radar-canvas";
  container.appendChild(canvas);

  if (dataHubRadarChartInstance) {
    dataHubRadarChartInstance.destroy();
    dataHubRadarChartInstance = null;
  }

  const ctx = canvas.getContext("2d");
  const isMobileRadar = window.matchMedia("(max-width: 640px)").matches;
  const radarLayoutPadding = {
    top: isMobileRadar ? 34 : 50,
    bottom: isMobileRadar ? 44 : 52,
    left: isMobileRadar ? 45 : 18,
    right: isMobileRadar ? 45 : 18,
  };
  const radarRankLabelOffset = isMobileRadar ? 13 : 16;
  const scaleMax = 100;

  dataHubRadarChartInstance = new window.Chart(ctx, {
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
        analyzerLabels: true,
        order: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      events: [],
      layout: {
        padding: radarLayoutPadding,
      },
      elements: {
        line: { tension: 0.4 },
      },
      scales: {
        r: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: scaleMax,
          max: scaleMax,
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
            { ratio: 0.95, fill: "#2c334f62", stroke: "#525a7739", lineWidth: 1 },
            { ratio: 0.75, fill: "#2D345153", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.55, fill: "#2F365250", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.35, fill: "#30375455", stroke: "#525a7729", lineWidth: 1 },
            { ratio: 0.18, fill: "#31385565", stroke: "#525a7735", lineWidth: 1 },
          ],
        },
        dataHubPlayerRadarLabels: {
          font: '14px "Product Sans", "Google Sans", sans-serif',
          offset: radarRankLabelOffset,
        },
        dataHubPlayerRadarAxisLabels: {
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
    plugins: [dataHubPlayerRadarBackgroundPlugin, dataHubPlayerRadarLabelPlugin, dataHubPlayerRadarAxisLabelsPlugin],
  });

  const scale = dataHubRadarChartInstance.scales?.r;
  if (scale) {
    const gradient = ctx.createRadialGradient(scale.xCenter, scale.yCenter, 0, scale.xCenter, scale.yCenter, scale.drawingArea);
    gradient.addColorStop(0, "rgba(121, 0, 245, 0.13)");
    gradient.addColorStop(0.4, "rgba(92, 0, 255, 0.20)");
    gradient.addColorStop(0.78, "rgba(75, 0, 255, 0.34)");
    gradient.addColorStop(1, "rgba(34, 0, 255, 0.91)");
    dataHubRadarChartInstance.data.datasets[0].backgroundColor = gradient;
    dataHubRadarChartInstance.update("none");
  }
}

function getDataHubRadarData(playerId, position) {
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
  const footerStats = state.currentGameLogsFooterStats || {};
  const seasonTotals = state.playerSeasonStats?.[playerId] || null;
  const playerRanks = state.currentGameLogsPlayerRanks || null;
  const summarySnapshot = state.currentGameLogsSummary || null;

  config.stats.forEach((statKey) => {
    const rankValue = getDataHubSeasonRankValue(playerId, statKey);
    radarData.rawRanks.push(rankValue);

    let statValue;
    if (statKey === "ppg") {
      statValue = playerRanks?.ppg;
    } else {
      statValue = footerStats[statKey];
      if (statValue === undefined) {
        if (statKey === "fpts") {
          statValue = summarySnapshot?.fpts;
          if (statValue === undefined && typeof seasonTotals?.fpts_ppr === "number") {
            statValue = seasonTotals.fpts_ppr;
          }
        } else if (statKey === "ypc") {
          const attempts = Number(seasonTotals?.rush_att) || 0;
          statValue = attempts > 0 ? (Number(seasonTotals?.rush_yd) || 0) / attempts : null;
        } else if (statKey === "yco_per_att") {
          const attempts = Number(seasonTotals?.rush_att) || 0;
          statValue = attempts > 0 ? (Number(seasonTotals?.rush_yac) || 0) / attempts : null;
        } else if (statKey === "mtf_per_att") {
          const attempts = Number(seasonTotals?.rush_att) || 0;
          statValue = attempts > 0 ? (Number(seasonTotals?.mtf) || 0) / attempts : null;
        } else if (statKey === "pass_imp_per_att") {
          const attempts = Number(seasonTotals?.pass_att) || 0;
          statValue = attempts > 0 ? ((Number(seasonTotals?.pass_imp) || 0) / attempts) * 100 : null;
        } else if (typeof seasonTotals?.[statKey] === "number") {
          statValue = seasonTotals[statKey];
        } else {
          statValue = null;
        }
      }
    }

    if (typeof statValue === "string") {
      const trimmed = statValue.trim();
      if (!trimmed) statValue = null;
      else if (statKey !== "fpts" && statKey !== "ppg") {
        const numericCandidate = Number(trimmed);
        statValue = Number.isNaN(numericCandidate) ? trimmed : numericCandidate;
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

function initializeDataHubStatsKeyMarkup() {
  document.querySelectorAll(".stats-key-shared-body").forEach((container) => {
    container.innerHTML = buildDataHubStatsKeyMarkup();
  });
}

function buildDataHubStatsKeyMarkup() {
  return `
    <div class="stats-key-sections">
      ${DATAHUB_STATS_KEY_SECTIONS.map((section) => `
        <section class="stats-key-section stats-key-section--${section.tone}">
          <div class="stats-key-section-header stats-key-section-header--${section.tone}">${section.label}</div>
          <div class="stats-key-section-body">
            ${section.items
              .slice()
              .sort((left, right) => left.abbr.localeCompare(right.abbr, undefined, { numeric: true, sensitivity: "base" }))
              .map((item) => `
                <div class="stats-key-item">
                  <span class="stats-key-abbr">${item.abbr}</span>
                  <span class="stats-key-desc">${item.desc}</span>
                </div>
              `)
              .join("")}
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function getDataHubOpponentRankColor(rank) {
  if (!Number.isFinite(rank)) return null;
  if (rank <= 8) return "#82d8bee0";
  if (rank <= 16) return "#73b9e7e0";
  if (rank <= 24) return "#c093ebe0";
  if (rank <= 32) return "#c456b1e0";
  return null;
}

function prepareDataHubConsistencyPanel(player) {
  state.currentConsistencyData = buildDataHubConsistencyPanelData(player);
  updateDataHubConsistencyHud(state.currentConsistencyData);
}

function getDataHubConsistencyAxisWeeks() {
  return Object.keys(state.playerWeeklyStats || {})
    .map(Number)
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
}

function clampDataHubConsistencyPoints(value) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.min(DATAHUB_MAX_CONSISTENCY_POINTS, value));
}

function pluralizeDataHubWeeks(count) {
  if (!count) return "No weeks charted";
  return count === 1 ? "1 week charted" : `${count} weeks charted`;
}

function buildDataHubConsistencyPanelData(player) {
  if (!player?.id) {
    return null;
  }
  const axisWeeks = getDataHubConsistencyAxisWeeks();
  if (!axisWeeks.length) {
    return null;
  }
  const combinedWeeklyStats = getDataHubCombinedWeeklyStats();
  const fullPlayer = state.sleeperPlayers?.[player.id];
  const resolvedPosition = String(player.pos || fullPlayer?.position || "FLEX").trim().toUpperCase() || "FLEX";
  const thresholds = getDataHubConsistencyThresholds(resolvedPosition);
  const series = [];
  const skippedLabels = {};
  axisWeeks.forEach((week) => {
    const stats = combinedWeeklyStats?.[week]?.[player.id];
    if (!stats) {
      return;
    }
    const projReason = formatDataHubProjReason(stats.proj);
    if (shouldSkipDataHubConsistencyWeek(stats)) {
      if (projReason) {
        skippedLabels[week] = projReason;
      }
      return;
    }
    const opponent = String(stats.opponent || "").trim().toUpperCase();
    if (opponent === "BYE") {
      skippedLabels[week] = "BYE";
      return;
    }
    const originalPoints = Number(stats.fpts_override ?? stats.fpt_ppr ?? stats.fpts);
    const clampedPoints = clampDataHubConsistencyPoints(originalPoints);
    if (clampedPoints === null) {
      return;
    }
    series.push({
      week,
      pts: clampedPoints,
      originalPts: originalPoints,
      opponent: stats.opponent || "",
    });
  });
  series.sort((left, right) => left.week - right.week);
  const seasonTotals = state.playerSeasonStats?.[player.id] || {};
  const gamesPlayed = Number.isFinite(seasonTotals.games_played) ? seasonTotals.games_played : series.length;
  const highWeekCount = series.filter((entry) => entry.pts >= thresholds.high).length;
  const solidHighCount = series.filter((entry) => entry.pts >= thresholds.solid).length;
  const lastFive = series.slice(-5);
  const lastFiveAvg = lastFive.length
    ? lastFive.reduce((sum, entry) => sum + (Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts), 0) / lastFive.length
    : null;
  const consistencyPct = Number.isFinite(seasonTotals.csty_pct)
    ? seasonTotals.csty_pct
    : (gamesPlayed > 0 ? (solidHighCount / gamesPlayed) * 100 : null);
  const ceilingValue = Number.isFinite(seasonTotals.ceiling)
    ? seasonTotals.ceiling
    : (series.length ? Math.max(...series.map((entry) => Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts)) : null);
  const consistencyRank = getDataHubSeasonRankValue(player.id, "csty_pct");
  const ceilingRank = getDataHubSeasonRankValue(player.id, "ceiling");
  const axisStart = axisWeeks[0];
  const axisEnd = axisWeeks[axisWeeks.length - 1];
  return {
    playerId: player.id,
    position: resolvedPosition,
    axisWeeks,
    series,
    gamesPlayed,
    thresholds,
    consistencyPct,
    ceilingValue,
    consistencyRank,
    ceilingRank,
    highWeekCount,
    solidHighCount,
    totalWeeks: series.length,
    lastFiveAvg,
    weekRangeLabel: axisStart === axisEnd ? `Week ${axisStart}` : `Weeks ${axisStart}–${axisEnd}`,
    weeksChartedLabel: pluralizeDataHubWeeks(series.length),
    ceilingRankMax: DATAHUB_RADAR_STATS_CONFIG[resolvedPosition]?.maxRank || 32,
    skippedLabels,
  };
}

function shouldSkipDataHubConsistencyWeek(statsForWeek) {
  if (!statsForWeek) {
    return false;
  }
  const rawFantasyPoints = statsForWeek.fpts_override ?? statsForWeek.fpt_ppr ?? statsForWeek.fpts;
  const numericFantasyPoints = Number(rawFantasyPoints);
  if (Number.isFinite(numericFantasyPoints) && numericFantasyPoints > 0.5) {
    return false;
  }
  const rawProj = statsForWeek.proj;
  if (rawProj === undefined || rawProj === null) {
    return false;
  }
  if (typeof rawProj === "number" && Number.isFinite(rawProj)) {
    return false;
  }
  const trimmedProj = String(rawProj).trim();
  if (!trimmedProj) {
    return false;
  }
  const numericProjection = Number(trimmedProj);
  if (Number.isFinite(numericProjection)) {
    return false;
  }
  return DATAHUB_CONSISTENCY_PROJECTION_SKIP_CODES.has(trimmedProj.toUpperCase()) || true;
}

function formatDataHubProjReason(rawProj) {
  if (rawProj === undefined || rawProj === null) {
    return "";
  }
  const text = String(rawProj).trim();
  return text ? text.toUpperCase() : "";
}

function formatDataHubHudPercentage(value, decimals = 1) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }
  return `${Number(value).toFixed(decimals)}%`;
}

function formatDataHubCeilingValue(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }
  return Number(value).toFixed(1);
}

function getDataHubRankAccentColor(rank) {
  if (!Number.isFinite(rank)) return "#f8faff";
  if (rank <= 12) return "#7cf5ff";
  if (rank <= 24) return "#56c4ff";
  return "#d3a5ff";
}

function applyDataHubRankStyling({ rank, metricValueEl, metricSubEl, circleValueEl }) {
  const color = getDataHubRankAccentColor(rank);
  if (metricValueEl) metricValueEl.style.color = color;
  if (circleValueEl) circleValueEl.style.color = color;
  if (metricSubEl) {
    const valueNode = metricSubEl.querySelector(".metric-sub-value");
    if (valueNode) {
      valueNode.textContent = Number.isFinite(rank) ? `${rank}` : "NA";
      valueNode.style.color = color;
    }
  }
}

function updateDataHubConsistencyHud(data) {
  if (!consistencyContainer) {
    return;
  }
  consistencyContainer.querySelector("[data-week-range]")?.replaceChildren(document.createTextNode(data?.weekRangeLabel || "Weeks —"));
  consistencyContainer.querySelector("[data-weeks-charted]")?.replaceChildren(document.createTextNode(data?.weeksChartedLabel || "No weeks charted"));
  const consistencyRankEl = consistencyContainer.querySelector("[data-consistency-rank]");
  if (consistencyRankEl) {
    consistencyRankEl.textContent = Number.isFinite(data?.consistencyRank) ? `#${data.consistencyRank}` : "NA";
  }
  const ceilingValueEl = consistencyContainer.querySelector("[data-ceiling-value]");
  if (ceilingValueEl) {
    ceilingValueEl.textContent = formatDataHubCeilingValue(data?.ceilingValue);
  }
  const consistencyCircleValue = consistencyContainer.querySelector("[data-consistency-circle-value]");
  if (consistencyCircleValue) {
    consistencyCircleValue.textContent = formatDataHubHudPercentage(data?.consistencyPct);
  }
  const ceilingCircleValue = consistencyContainer.querySelector("[data-ceiling-circle-rank]");
  if (ceilingCircleValue) {
    ceilingCircleValue.innerHTML = Number.isFinite(data?.ceilingRank)
      ? `${Math.round(data.ceilingRank)}<span class="ceiling-rank-suffix">${getDataHubOrdinalSuffix(Math.round(data.ceilingRank))}</span>`
      : "NA";
  }
  const consistencyCaptionEl = consistencyContainer.querySelector("[data-consistency-circle-caption]");
  if (consistencyCaptionEl) consistencyCaptionEl.textContent = "CSTY RATE";
  const ceilingCaptionEl = consistencyContainer.querySelector("[data-ceiling-circle-caption]");
  if (ceilingCaptionEl) ceilingCaptionEl.textContent = "CL POS RANK";
  const consistencyRing = consistencyContainer.querySelector(".progress-circle--consistency .progress-ring-fill");
  const ceilingRing = consistencyContainer.querySelector(".progress-circle--ceiling .progress-ring-fill--ceiling");
  applyDataHubRankStyling({
    rank: data?.consistencyRank,
    metricValueEl: consistencyRankEl,
    metricSubEl: null,
    circleValueEl: consistencyCircleValue,
  });
  if (consistencyRing) {
    consistencyRing.setAttribute("stroke", getDataHubRankAccentColor(data?.consistencyRank));
  }
  applyDataHubRankStyling({
    rank: data?.ceilingRank,
    metricValueEl: ceilingValueEl,
    metricSubEl: null,
    circleValueEl: ceilingCircleValue,
  });
  if (ceilingRing) {
    ceilingRing.setAttribute("stroke", getDataHubRankAccentColor(data?.ceilingRank));
  }
  const cstyCountEl = consistencyContainer.querySelector("[data-insight-cstycount]");
  if (cstyCountEl) {
    const made = Number.isFinite(data?.solidHighCount) ? data.solidHighCount : null;
    const total = Number.isFinite(data?.totalWeeks) ? data.totalWeeks : null;
    if (made !== null && total !== null && total > 0) {
      const color = getDataHubRankAccentColor(data?.consistencyRank);
      cstyCountEl.innerHTML = `<span class="csty-made" style="color:${color}">${made}</span><span class="hud-insight-suffix">/${total}</span>`;
    } else {
      cstyCountEl.textContent = "—";
    }
  }
  const bigGameEl = consistencyContainer.querySelector("[data-insight-best]");
  if (bigGameEl) {
    const highCount = Number.isFinite(data?.highWeekCount) ? data.highWeekCount : null;
    const gamesPlayed = Number.isFinite(data?.gamesPlayed)
      ? data.gamesPlayed
      : (Number.isFinite(data?.totalWeeks) ? data.totalWeeks : null);
    if (highCount !== null && gamesPlayed !== null && gamesPlayed > 0) {
      const percentage = (highCount / gamesPlayed) * 100;
      const color = percentage > 40
        ? DATAHUB_CONSISTENCY_HUD_CONDITIONAL_COLORS.high
        : (percentage < 23 ? DATAHUB_CONSISTENCY_HUD_CONDITIONAL_COLORS.low : DATAHUB_CONSISTENCY_HUD_CONDITIONAL_COLORS.solid);
      bigGameEl.style.color = "";
      bigGameEl.innerHTML = `<span style="color:${color}">${percentage.toFixed(1)}</span><span class="hud-insight-suffix">%</span>`;
    } else {
      bigGameEl.textContent = "—";
      bigGameEl.style.color = "";
    }
  }
  const lastFiveEl = consistencyContainer.querySelector("[data-insight-last5]");
  if (lastFiveEl) {
    if (Number.isFinite(data?.lastFiveAvg)) {
      const bucket = getDataHubConsistencyBucket(data.lastFiveAvg, data.thresholds || getDataHubConsistencyThresholds(data?.position));
      const color = bucket?.name === "high"
        ? DATAHUB_CONSISTENCY_HUD_CONDITIONAL_COLORS.high
        : (bucket?.name === "solid" ? DATAHUB_CONSISTENCY_HUD_CONDITIONAL_COLORS.solid : DATAHUB_CONSISTENCY_HUD_CONDITIONAL_COLORS.low);
      lastFiveEl.style.color = "";
      lastFiveEl.innerHTML = `<span style="color:${color}">${data.lastFiveAvg.toFixed(1)}</span><span class="hud-insight-suffix"> fpts</span>`;
    } else {
      lastFiveEl.textContent = "—";
      lastFiveEl.style.color = "";
    }
  }
}

function showDataHubConsistencyEmptyState(chartBox, message) {
  if (!chartBox) {
    return;
  }
  let emptyEl = chartBox.querySelector(".consistency-empty-state");
  if (!emptyEl) {
    emptyEl = document.createElement("div");
    emptyEl.className = "consistency-empty-state";
    chartBox.appendChild(emptyEl);
  }
  emptyEl.textContent = message;
  emptyEl.classList.remove("hidden");
}

function hideDataHubConsistencyEmptyState(chartBox) {
  const emptyEl = chartBox?.querySelector(".consistency-empty-state");
  if (emptyEl) {
    emptyEl.classList.add("hidden");
  }
}

function renderDataHubConsistencyChart() {
  const data = state.currentConsistencyData;
  const chartBox = document.querySelector("#weekly-chart-box");
  const pointsLayer = document.querySelector("#weekly-chart-points");
  const xAxisEl = document.querySelector("#weekly-chart-x-axis");
  if (!chartBox || !pointsLayer || !xAxisEl) {
    return;
  }
  updateDataHubConsistencyHud(data);
  requestAnimationFrame(() => {
    if (!data) {
      renderDataHubConsistencyXAxis({ axisWeeks: getDataHubConsistencyAxisWeeks() });
      renderDataHubConsistencyZoneSummary(null);
      pointsLayer.querySelectorAll(".weekly-point, .weekly-skip-label").forEach((node) => node.remove());
      if (dataHubCurveSvg) {
        dataHubCurveSvg.remove();
        dataHubCurveSvg = null;
      }
      showDataHubConsistencyEmptyState(chartBox, "Consistency data unavailable.");
      hydrateDataHubConsistencyProgressCircles(null);
      return;
    }
    renderDataHubConsistencyXAxis(data);
    renderDataHubConsistencyZoneSummary(data);
    renderDataHubConsistencyPoints(data);
    hydrateDataHubConsistencyProgressCircles(data);
    if (!data.series.length) {
      showDataHubConsistencyEmptyState(chartBox, "No sheet-based fantasy points recorded yet.");
    } else {
      hideDataHubConsistencyEmptyState(chartBox);
    }
  });
}

function getDataHubConsistencyThresholds(position) {
  return DATAHUB_CONSISTENCY_THRESHOLD_MAP[String(position || "").trim().toUpperCase()]
    || DATAHUB_CONSISTENCY_THRESHOLD_MAP.DEFAULT;
}

function renderDataHubConsistencyZoneSummary(data) {
  const container = document.querySelector("#weekly-zone-summary");
  if (!container) {
    return;
  }
  const lowEl = container.querySelector("[data-zone-low]");
  const solidEl = container.querySelector("[data-zone-solid]");
  const highEl = container.querySelector("[data-zone-high]");
  const lowThresholdEl = container.querySelector("[data-threshold-low]");
  const solidThresholdEl = container.querySelector("[data-threshold-solid]");
  const highThresholdEl = container.querySelector("[data-threshold-high]");
  const resetCounts = () => {
    if (lowEl) lowEl.textContent = "0";
    if (solidEl) solidEl.textContent = "0";
    if (highEl) highEl.textContent = "0";
  };
  const resetThresholds = () => {
    if (lowThresholdEl) lowThresholdEl.textContent = "";
    if (solidThresholdEl) solidThresholdEl.textContent = "";
    if (highThresholdEl) highThresholdEl.textContent = "";
  };
  if (!data || !data.series?.length) {
    resetCounts();
    resetThresholds();
    return;
  }
  const thresholds = data.thresholds || getDataHubConsistencyThresholds(data.position);
  const solidRounded = Math.round(thresholds.solid);
  const highRounded = Math.round(thresholds.high);
  if (lowThresholdEl) lowThresholdEl.textContent = `(<${solidRounded}):`;
  if (solidThresholdEl) solidThresholdEl.textContent = `(${solidRounded}-${highRounded}):`;
  if (highThresholdEl) highThresholdEl.textContent = `(≥${highRounded}):`;
  let low = 0;
  let solid = 0;
  let high = 0;
  data.series.forEach((entry) => {
    const points = entry?.pts;
    if (!Number.isFinite(points)) {
      return;
    }
    if (points >= thresholds.high) {
      high += 1;
    } else if (points >= thresholds.solid) {
      solid += 1;
    } else {
      low += 1;
    }
  });
  if (lowEl) lowEl.textContent = String(low);
  if (solidEl) solidEl.textContent = String(solid);
  if (highEl) highEl.textContent = String(high);
}

function renderDataHubConsistencyXAxis(data) {
  const xAxisEl = document.querySelector("#weekly-chart-x-axis");
  if (!xAxisEl) {
    return;
  }
  xAxisEl.innerHTML = "";
  // Match the shared Rosters/Stats modal axis contract so mobile styling can
  // target the separate week prefix and number spans exactly the same way.
  const isMobile = typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(max-width: 540px)").matches;
  const weeks = data?.axisWeeks?.length ? data.axisWeeks : getDataHubConsistencyAxisWeeks();
  const playedWeeks = new Set(Array.isArray(data?.series) ? data.series.map((entry) => entry.week) : []);
  const totalSlots = weeks.length || 1;
  const spanSlots = Math.max(1, totalSlots - 1);
  const edgePaddingPct = getDataHubEdgePaddingPct(totalSlots);
  if (edgePaddingPct > 0) {
    xAxisEl.dataset.padding = edgePaddingPct;
  } else {
    delete xAxisEl.dataset.padding;
  }
  weeks.forEach((week, slotIndex) => {
    const pctX = totalSlots === 1
      ? 50
      : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const label = document.createElement("span");
    if (isMobile) {
      const prefix = document.createElement("span");
      prefix.className = "axis-week-prefix";
      prefix.textContent = "wk";
      const number = document.createElement("span");
      number.className = "axis-week-number";
      number.textContent = `${week}`;
      label.append(prefix, number);
    } else {
      label.textContent = `WK${week}`;
    }
    if (playedWeeks.size && !playedWeeks.has(week)) {
      label.classList.add("axis-week-missed");
    }
    label.style.left = `${pctX}%`;
    xAxisEl.appendChild(label);
  });
}

function ensureDataHubCurveInfrastructure(pointsLayer) {
  if (!dataHubCurveSvg) {
    dataHubCurveSvg = document.createElementNS(DATAHUB_SVG_NS, "svg");
    dataHubCurveSvg.setAttribute("class", "weekly-curve-layer");
    dataHubCurveSvg.style.position = "absolute";
    dataHubCurveSvg.style.inset = "0";
    dataHubCurveSvg.style.pointerEvents = "none";
  }
  if (!pointsLayer.contains(dataHubCurveSvg)) {
    pointsLayer.prepend(dataHubCurveSvg);
  }
  let defs = dataHubCurveSvg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(DATAHUB_SVG_NS, "defs");
    dataHubCurveSvg.appendChild(defs);
  }
  let areaPath = dataHubCurveSvg.querySelector(".weekly-area-path");
  if (!areaPath) {
    areaPath = document.createElementNS(DATAHUB_SVG_NS, "path");
    areaPath.setAttribute("class", "weekly-area-path");
    dataHubCurveSvg.appendChild(areaPath);
  }
  let lineGroup = dataHubCurveSvg.querySelector(".weekly-line-group");
  if (!lineGroup) {
    lineGroup = document.createElementNS(DATAHUB_SVG_NS, "g");
    lineGroup.setAttribute("class", "weekly-line-group");
    dataHubCurveSvg.appendChild(lineGroup);
  }
  if (areaPath.nextSibling !== lineGroup) {
    dataHubCurveSvg.insertBefore(areaPath, lineGroup);
  }
  return { svg: dataHubCurveSvg, defs, areaPath, lineGroup };
}

function clampDataHubGradientOffset(value) {
  return Math.min(1, Math.max(0, value));
}

function updateDataHubConsistencyAreaGradient(defs, height, thresholds) {
  let gradient = defs.querySelector(`#${DATAHUB_CONSISTENCY_AREA_GRADIENT_ID}`);
  if (!gradient) {
    gradient = document.createElementNS(DATAHUB_SVG_NS, "linearGradient");
    gradient.id = DATAHUB_CONSISTENCY_AREA_GRADIENT_ID;
    defs.appendChild(gradient);
  }
  gradient.setAttribute("gradientUnits", "userSpaceOnUse");
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", `${height}`);
  gradient.setAttribute("x2", "0");
  gradient.setAttribute("y2", "0");
  const solidOffset = clampDataHubGradientOffset((thresholds?.solid || 0) / DATAHUB_MAX_CONSISTENCY_POINTS);
  const highOffset = clampDataHubGradientOffset((thresholds?.high || 0) / DATAHUB_MAX_CONSISTENCY_POINTS);
  const stops = [
    { offset: 0, color: DATAHUB_CONSISTENCY_GRADIENT_COLORS.low },
    { offset: solidOffset, color: DATAHUB_CONSISTENCY_GRADIENT_COLORS.solid },
    { offset: highOffset, color: DATAHUB_CONSISTENCY_GRADIENT_COLORS.high },
    { offset: 1, color: DATAHUB_CONSISTENCY_GRADIENT_COLORS.high },
  ];
  while (gradient.firstChild) {
    gradient.removeChild(gradient.firstChild);
  }
  stops.forEach((stopDef) => {
    const stop = document.createElementNS(DATAHUB_SVG_NS, "stop");
    stop.setAttribute("offset", clampDataHubGradientOffset(stopDef.offset).toFixed(3));
    stop.setAttribute("stop-color", stopDef.color);
    gradient.appendChild(stop);
  });
}

function ensureDataHubConsistencyLineFilter(defs) {
  let filter = defs.querySelector(`#${DATAHUB_CONSISTENCY_LINE_FILTER_ID}`);
  if (filter) {
    return;
  }
  filter = document.createElementNS(DATAHUB_SVG_NS, "filter");
  filter.id = DATAHUB_CONSISTENCY_LINE_FILTER_ID;
  filter.setAttribute("x", "-10%");
  filter.setAttribute("y", "-10%");
  filter.setAttribute("width", "120%");
  filter.setAttribute("height", "120%");
  const shadow = document.createElementNS(DATAHUB_SVG_NS, "feDropShadow");
  shadow.setAttribute("dx", "0");
  shadow.setAttribute("dy", "1");
  shadow.setAttribute("stdDeviation", "0.5");
  shadow.setAttribute("flood-color", "#d2e6fa");
  shadow.setAttribute("flood-opacity", "0.06");
  filter.appendChild(shadow);
  defs.appendChild(filter);
}

function ensureDataHubConsistencyAreaFilter(defs) {
  let filter = defs.querySelector(`#${DATAHUB_CONSISTENCY_AREA_FILTER_ID}`);
  if (filter) {
    return;
  }
  filter = document.createElementNS(DATAHUB_SVG_NS, "filter");
  filter.id = DATAHUB_CONSISTENCY_AREA_FILTER_ID;
  filter.setAttribute("x", "-40%");
  filter.setAttribute("y", "-60%");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "240%");
  const shadow = document.createElementNS(DATAHUB_SVG_NS, "feDropShadow");
  shadow.setAttribute("dx", "0");
  shadow.setAttribute("dy", "10");
  shadow.setAttribute("stdDeviation", "30");
  shadow.setAttribute("flood-color", "#38bdf8");
  shadow.setAttribute("flood-opacity", "0.22");
  filter.appendChild(shadow);
  defs.appendChild(filter);
}

function getDataHubSegmentThresholds(thresholds) {
  if (!thresholds) {
    return [];
  }
  return Array.from(new Set([thresholds.solid, thresholds.high].filter(Number.isFinite))).sort((left, right) => left - right);
}

function createDataHubCubicSegment(p0, p1, value0, value1) {
  const deltaX = (p1.x - p0.x) * 0.35;
  return {
    p0,
    c1: { x: p0.x + deltaX, y: p0.y },
    c2: { x: p1.x - deltaX, y: p1.y },
    p1,
    v0: value0,
    v1: value1,
  };
}

function lerpDataHubPoint(left, right, t) {
  return {
    x: left.x + ((right.x - left.x) * t),
    y: left.y + ((right.y - left.y) * t),
  };
}

function splitDataHubCubicSegment(segment, t) {
  const { p0, c1, c2, p1, v0, v1 } = segment;
  const p01 = lerpDataHubPoint(p0, c1, t);
  const p12 = lerpDataHubPoint(c1, c2, t);
  const p23 = lerpDataHubPoint(c2, p1, t);
  const p012 = lerpDataHubPoint(p01, p12, t);
  const p123 = lerpDataHubPoint(p12, p23, t);
  const p0123 = lerpDataHubPoint(p012, p123, t);
  const splitValue = v0 + ((v1 - v0) * t);
  return [
    {
      p0,
      c1: p01,
      c2: p012,
      p1: p0123,
      v0,
      v1: splitValue,
    },
    {
      p0: p0123,
      c1: p123,
      c2: p23,
      p1,
      v0: splitValue,
      v1,
    },
  ];
}

function splitDataHubSegmentByThresholds(segment, thresholds) {
  if (!thresholds.length) {
    return [segment];
  }
  const delta = segment.v1 - segment.v0;
  if (delta === 0) {
    return [segment];
  }
  const breakpoints = thresholds
    .map((threshold) => {
      const minValue = Math.min(segment.v0, segment.v1);
      const maxValue = Math.max(segment.v0, segment.v1);
      if (threshold <= minValue || threshold >= maxValue) {
        return null;
      }
      const t = (threshold - segment.v0) / delta;
      return t > 0 && t < 1 ? t : null;
    })
    .filter((value) => value !== null)
    .sort((left, right) => left - right);
  if (!breakpoints.length) {
    return [segment];
  }
  const segments = [];
  let remaining = segment;
  let previousT = 0;
  breakpoints.forEach((originalT) => {
    const adjustedT = (originalT - previousT) / (1 - previousT);
    const [leftSegment, rightSegment] = splitDataHubCubicSegment(remaining, adjustedT);
    segments.push(leftSegment);
    remaining = rightSegment;
    previousT = originalT;
  });
  segments.push(remaining);
  return segments;
}

function dataHubCubicSegmentToPath(segment) {
  const { p0, c1, c2, p1 } = segment;
  return `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p1.x} ${p1.y}`;
}

function buildDataHubCurvePath(points) {
  if (points.length < 2) {
    return "";
  }
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const deltaX = (end.x - start.x) * 0.35;
    path += ` C ${start.x + deltaX} ${start.y}, ${end.x - deltaX} ${end.y}, ${end.x} ${end.y}`;
  }
  return path;
}

function buildDataHubAreaPath(points, height) {
  if (points.length < 2) {
    return "";
  }
  const curvePath = buildDataHubCurvePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  return `${curvePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;
}

function extendDataHubCurvePoints(points) {
  if (!points?.length) {
    return [];
  }
  if (points.length === 1) {
    return [
      { ...points[0], x: 0 },
      { ...points[0], x: 100 },
    ];
  }
  return [
    { ...points[0], x: 0 },
    ...points,
    { ...points[points.length - 1], x: 100 },
  ];
}

function drawDataHubSegmentedCurve(pointsLayer, relativePoints, data) {
  if (!pointsLayer || relativePoints.length < 2) {
    if (dataHubCurveSvg) {
      const areaPath = dataHubCurveSvg.querySelector(".weekly-area-path");
      if (areaPath) {
        areaPath.setAttribute("d", "");
      }
      const lineGroup = dataHubCurveSvg.querySelector(".weekly-line-group");
      if (lineGroup) {
        lineGroup.innerHTML = "";
      }
    }
    return;
  }
  const bounds = pointsLayer.getBoundingClientRect();
  const width = bounds.width || pointsLayer.clientWidth || pointsLayer.offsetWidth;
  const height = bounds.height || pointsLayer.clientHeight || pointsLayer.offsetHeight;
  if (!width || !height) {
    return;
  }
  const absolutePoints = relativePoints.map((point) => ({
    x: (point.x / 100) * width,
    y: (point.y / 100) * height,
    value: point.value,
  }));
  const { svg, defs, areaPath, lineGroup } = ensureDataHubCurveInfrastructure(pointsLayer);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  updateDataHubConsistencyAreaGradient(defs, height, data.thresholds);
  ensureDataHubConsistencyLineFilter(defs);
  ensureDataHubConsistencyAreaFilter(defs);
  areaPath.setAttribute("d", buildDataHubAreaPath(absolutePoints, height));
  areaPath.setAttribute("fill", `url(#${DATAHUB_CONSISTENCY_AREA_GRADIENT_ID})`);
  areaPath.setAttribute("fill-opacity", "0.92");
  areaPath.setAttribute("filter", `url(#${DATAHUB_CONSISTENCY_AREA_FILTER_ID})`);
  lineGroup.innerHTML = "";
  const thresholdValues = getDataHubSegmentThresholds(data.thresholds);
  for (let index = 0; index < absolutePoints.length - 1; index += 1) {
    const baseSegment = createDataHubCubicSegment(
      absolutePoints[index],
      absolutePoints[index + 1],
      absolutePoints[index].value,
      absolutePoints[index + 1].value,
    );
    const splitSegments = splitDataHubSegmentByThresholds(baseSegment, thresholdValues);
    splitSegments.forEach((segment) => {
      const path = document.createElementNS(DATAHUB_SVG_NS, "path");
      path.setAttribute("d", dataHubCubicSegmentToPath(segment));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", getDataHubConsistencyBucket((segment.v0 + segment.v1) / 2, data.thresholds).color);
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("filter", `url(#${DATAHUB_CONSISTENCY_LINE_FILTER_ID})`);
      lineGroup.appendChild(path);
    });
  }
}

function getDataHubEdgePaddingPct(slotCount) {
  return slotCount > 1 ? DATAHUB_CONSISTENCY_EDGE_PADDING_PCT : 0;
}

function yFromDataHubConsistencyPoints(points) {
  const clamped = Math.max(0, Math.min(points, DATAHUB_MAX_CONSISTENCY_POINTS));
  const rawPct = (1 - (clamped / DATAHUB_MAX_CONSISTENCY_POINTS)) * 100;
  const paddedRange = 100 - (DATAHUB_CONSISTENCY_VERTICAL_PADDING_PCT * 2);
  return DATAHUB_CONSISTENCY_VERTICAL_PADDING_PCT + ((rawPct / 100) * paddedRange);
}

function renderDataHubConsistencyPoints(data) {
  const pointsLayer = document.querySelector("#weekly-chart-points");
  if (!pointsLayer) {
    return;
  }
  pointsLayer.querySelectorAll(".weekly-point, .weekly-skip-label").forEach((node) => node.remove());
  if (dataHubCurveSvg) {
    dataHubCurveSvg.remove();
    dataHubCurveSvg = null;
  }
  const axisWeeks = data.axisWeeks.length ? data.axisWeeks : data.series.map((entry) => entry.week);
  const totalSlots = axisWeeks.length || data.series.length || 1;
  if (!data.series.length) {
    return;
  }
  const spanSlots = Math.max(1, totalSlots - 1);
  const edgePaddingPct = getDataHubEdgePaddingPct(totalSlots);
  const curvePoints = [];
  data.series.forEach((entry) => {
    const slotIndex = Math.max(0, axisWeeks.indexOf(entry.week));
    const pctX = totalSlots === 1
      ? 50
      : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const pctY = yFromDataHubConsistencyPoints(entry.pts);
    curvePoints.push({ x: pctX, y: pctY, value: entry.pts });
    const bucket = getDataHubConsistencyBucket(entry.pts, data.thresholds);
    const pointEl = document.createElement("div");
    pointEl.className = "weekly-point";
    pointEl.dataset.zone = bucket.name;
    pointEl.style.setProperty("--point-color", bucket.color);
    pointEl.style.left = `${pctX}%`;
    pointEl.style.top = `${pctY}%`;
    pointEl.title = `WK${entry.week}: ${(Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts).toFixed(1)}${entry.opponent ? ` vs ${entry.opponent}` : ""}`;
    const label = document.createElement("div");
    label.className = `weekly-point-label weekly-point-label--${bucket.name}`;
    const suffix = document.createElement("span");
    suffix.className = "weekly-point-label__suffix";
    suffix.textContent = `wk${entry.week}`;
    const valueSpan = document.createElement("span");
    valueSpan.className = "weekly-point-label__value";
    const valueNumber = document.createElement("span");
    valueNumber.style.color = bucket.color;
    const rawValue = Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts;
    valueNumber.textContent = Number.isFinite(rawValue) ? rawValue.toFixed(1) : "—";
    valueSpan.appendChild(valueNumber);
    if (Number.isFinite(rawValue) && rawValue > DATAHUB_MAX_CONSISTENCY_POINTS) {
      label.classList.add("weekly-point-label--capped");
    }
    label.append(suffix, valueSpan);
    pointEl.appendChild(label);
    pointsLayer.appendChild(pointEl);
  });
  const skipped = data.skippedLabels || {};
  const playedWeekSet = new Set(data.series.map((entry) => entry.week));
  axisWeeks.forEach((week, slotIndex) => {
    if (!skipped[week] || playedWeekSet.has(week)) {
      return;
    }
    const pctX = totalSlots === 1
      ? 50
      : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
    const previous = [...data.series].reverse().find((entry) => entry.week < week);
    const next = data.series.find((entry) => entry.week > week);
    let interpolatedPoints = null;
    if (previous && next && next.week !== previous.week) {
      const t = (week - previous.week) / (next.week - previous.week);
      interpolatedPoints = previous.pts + ((next.pts - previous.pts) * t);
    } else if (previous) {
      interpolatedPoints = previous.pts;
    } else if (next) {
      interpolatedPoints = next.pts;
    }
    if (!Number.isFinite(interpolatedPoints)) {
      return;
    }
    const marker = document.createElement("div");
    marker.className = "weekly-skip-label";
    marker.textContent = skipped[week];
    marker.style.left = `${pctX}%`;
    marker.style.top = `${yFromDataHubConsistencyPoints(interpolatedPoints)}%`;
    pointsLayer.appendChild(marker);
  });
  drawDataHubSegmentedCurve(pointsLayer, extendDataHubCurvePoints(curvePoints), data);
}

function hydrateDataHubConsistencyProgressCircles(data) {
  const consistencyCircle = document.querySelector(".progress-circle--consistency .progress-ring-fill");
  const pctValue = data && Number.isFinite(data.consistencyPct)
    ? Math.max(0, Math.min(100, data.consistencyPct)) / 100
    : 0;
  if (consistencyCircle) {
    consistencyCircle.style.setProperty("--progress", pctValue.toFixed(3));
  }
  const ceilingCircle = document.querySelector(".progress-circle--ceiling .progress-ring-fill--ceiling");
  if (ceilingCircle) {
    const rankMax = Math.max(2, data?.ceilingRankMax || 24);
    const rank = Number.isFinite(data?.ceilingRank) ? data.ceilingRank : rankMax;
    const normalized = Math.max(0, Math.min(1, (rankMax - rank) / (rankMax - 1)));
    ceilingCircle.style.setProperty("--progress", normalized.toFixed(3));
  }
}

function getDataHubConsistencyBucket(points, thresholds) {
  if (!Number.isFinite(points)) return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.low, name: "low" };
  if (points >= thresholds.high) return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.high, name: "high" };
  if (points >= thresholds.solid) return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.solid, name: "solid" };
  return { ...DATAHUB_CONSISTENCY_BUCKET_STYLES.low, name: "low" };
}

async function loadDataHubOwnershipContextForUser() {
  const cacheKey = String(state.userId || "").trim();
  if (!cacheKey) {
    return null;
  }
  if (hasDataHubOwnershipContextLoaded(cacheKey)) {
    return state.ownershipContext;
  }
  if (dataHubOwnershipContextLoadPromise && dataHubOwnershipContextLoadKey === cacheKey) {
    return dataHubOwnershipContextLoadPromise;
  }
  dataHubOwnershipContextLoadKey = cacheKey;
  dataHubOwnershipContextLoadPromise = (async () => {
    const currentYear = new Date().getFullYear();
    const leagues = await fetchDataHubJson(`${DATAHUB_SLEEper_API_BASE}/user/${cacheKey}/leagues/nfl/${currentYear}`);
    const leaguePayloads = await Promise.allSettled(
      (Array.isArray(leagues) ? leagues : []).map(async (league) => {
        const [rosters, users] = await Promise.all([
          fetchDataHubJson(`${DATAHUB_SLEEper_API_BASE}/league/${league.league_id}/rosters`),
          fetchDataHubJson(`${DATAHUB_SLEEper_API_BASE}/league/${league.league_id}/users`),
        ]);
        return { league, rosters, users };
      }),
    );
    const hydratedLeagues = [];
    const failures = [];
    leaguePayloads.forEach((result, index) => {
      if (result.status === "fulfilled") {
        hydratedLeagues.push(result.value);
      } else {
        const fallbackName = Array.isArray(leagues) ? leagues[index]?.name : `League ${index + 1}`;
        failures.push(fallbackName || `League ${index + 1}`);
      }
    });
    state.ownershipContext = {
      cacheKey,
      leagues: hydratedLeagues,
      failures,
    };
    return state.ownershipContext;
  })()
    .finally(() => {
      dataHubOwnershipContextLoadPromise = null;
      dataHubOwnershipContextLoadKey = "";
    });
  return dataHubOwnershipContextLoadPromise;
}

function hasDataHubOwnershipContextLoaded(cacheKey = String(state.userId || "").trim()) {
  return Boolean(
    cacheKey
    && state.ownershipContext?.cacheKey === cacheKey
    && Array.isArray(state.ownershipContext?.leagues),
  );
}

function renderDataHubOwnershipPane(playerId) {
  const nameEl = document.querySelector("#glOwnershipPlayerName");
  const leftEl = document.querySelector("#glOwnershipLeft");
  const vitalsEl = document.querySelector("#glOwnershipPlayerVitals");
  const chipsEl = document.querySelector("#glOwnershipSummaryChips");
  const bodyEl = document.querySelector("#glOwnershipBody");
  const summary = getDataHubOwnershipSummary(playerId);
  if (!summary) {
    if (bodyEl) {
      bodyEl.innerHTML = '<div class="ownership-modal-empty">Player data unavailable.</div>';
    }
    return;
  }
  if (nameEl) nameEl.textContent = summary.fullName;
  if (leftEl) {
    leftEl.innerHTML = `
      <div class="player-tag modal-pos-tag ${dataHubEscapeHtml(summary.pos)}">${dataHubEscapeHtml(summary.pos)}</div>
      ${getDataHubTeamLogoMarkup(summary.team)}
    `;
  }
  if (vitalsEl) {
    vitalsEl.innerHTML = "";
    vitalsEl.appendChild(createDataHubPlayerVitalsElement(getDataHubPlayerVitals(playerId, summary), { variant: "modal", pos: summary.pos }));
  }
  if (chipsEl) {
    chipsEl.innerHTML = `
      <div class="gamelogs-summary-chip ownership-summary-chip">
        <h4><span class="chip-header-value" style="color:${getDataHubConditionalColorByRank(summary.posRank, summary.pos)}">${Number.isFinite(summary.fpts) ? summary.fpts.toFixed(1) : "—"}</span><span class="chip-unit"> FPTS</span></h4>
        <div class="chip-values">
          <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${dataHubEscapeHtml(summary.pos)}">${dataHubEscapeHtml(summary.pos)}·</span><span style="color:${getDataHubConditionalColorByRank(summary.posRank, summary.pos)}">${summary.posRank || "—"}</span></span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(summary.overallRank)}">${Number.isFinite(summary.overallRank) ? `#${summary.overallRank}` : "—"}</span>
        </div>
      </div>
      <div class="gamelogs-summary-chip ownership-summary-chip">
        <h4><span class="chip-header-value" style="color:${getDataHubConditionalColorByRank(summary.ppgPosRank, summary.pos)}">${Number.isFinite(summary.ppg) ? summary.ppg.toFixed(1) : "—"}</span><span class="chip-unit"> PPG</span></h4>
        <div class="chip-values">
          <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${dataHubEscapeHtml(summary.pos)}">${dataHubEscapeHtml(summary.pos)}·</span><span style="color:${getDataHubConditionalColorByRank(summary.ppgPosRank, summary.pos)}">${summary.ppgPosRank || "—"}</span></span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(summary.ppgOverallRank)}">${Number.isFinite(summary.ppgOverallRank) ? `#${summary.ppgOverallRank}` : "—"}</span>
        </div>
      </div>
      <div class="gamelogs-summary-chip ownership-summary-chip">
        <h4><span class="chip-header-value" style="color:${getDataHubKtcColor(summary.ktc)}">${Number.isFinite(summary.ktc) ? Math.round(summary.ktc) : "—"}</span><span class="chip-unit"> KTC</span></h4>
        <div class="chip-values">
          <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${dataHubEscapeHtml(summary.pos)}">${dataHubEscapeHtml(summary.pos)}·</span><span style="color:${getDataHubConditionalColorByRank(summary.ktcPosRank, summary.pos)}">${summary.ktcPosRank || "—"}</span></span>
          <span class="chip-separator">•</span>
          <span style="color:${getDataHubRankColor(summary.ktcOverallRank)}">${Number.isFinite(summary.ktcOverallRank) ? `#${summary.ktcOverallRank}` : "—"}</span>
        </div>
      </div>
    `;
  }
  if (bodyEl) {
    if (!hasDataHubOwnershipContextLoaded()) {
      bodyEl.innerHTML = '<div class="ownership-modal-empty">Ownership data is loading…</div>';
      return;
    }
    const rows = findDataHubOwnershipLeagueOwnerRows(playerId);
    const failures = Array.isArray(state.ownershipContext?.failures) ? state.ownershipContext.failures : [];
    bodyEl.innerHTML = `
      <div class="ownership-modal-section-title">
        League Ownership
        <span class="ownership-modal-section-subtitle">${rows.length} league${rows.length === 1 ? "" : "s"}</span>
      </div>
      <div class="ownership-modal-league-list">
        ${rows.map((row) => {
          const ownerText = row.missing ? "Unrostered" : (row.isUser ? "You" : row.ownerDisplay);
          const ownerClass = row.missing ? "owner-none" : (row.isUser ? "owner-you" : "owner-other");
          return `
            <article class="ownership-league-row ${ownerClass}">
              <div class="ownership-league-meta">
                <span class="ownership-league-abbr" style="color:${getDataHubLeagueColor(row.leagueAbbr)}">${dataHubEscapeHtml(row.leagueAbbr)}</span>
                <span class="ownership-league-name">${dataHubEscapeHtml(row.leagueName)}</span>
              </div>
              <div class="ownership-league-owner">${dataHubEscapeHtml(ownerText)}</div>
            </article>
          `;
        }).join("")}
      </div>
      ${failures.length ? `<p class="ownership-modal-warning">Some leagues could not be loaded: ${failures.map((item) => dataHubEscapeHtml(item)).join(", ")}</p>` : ""}
    `;
  }
}

function getDataHubOwnershipSummary(playerId) {
  const player = state.sleeperPlayers?.[playerId];
  const seasonStats = state.playerSeasonStats?.[playerId] || {};
  const rowMeta = state.rows.find((row) => row.__meta?.playerId === playerId)?.__meta || null;
  if (!player && !rowMeta) {
    return null;
  }
  const currentLookup = getActiveKtcLookup()?.[playerId] || null;
  const fallbackLookup = state.primaryTab === "SFLX"
    ? state.ktcLookups["1-QB"]?.[playerId]
    : state.ktcLookups.SFLX?.[playerId];
  const valueData = currentLookup || fallbackLookup || {};
  const rankCache = state.modalRankCache?.[playerId] || {};
  const firstName = String(player?.first_name || "").trim();
  const lastName = String(player?.last_name || "").trim();
  return {
    fullName: `${firstName} ${lastName}`.trim() || rowMeta?.fullName || rowMeta?.name || playerId,
    pos: String(player?.position || rowMeta?.pos || "").trim().toUpperCase() || "—",
    team: String(player?.team || rowMeta?.team || "FA").trim().toUpperCase() || "FA",
    fpts: Number.isFinite(seasonStats.fpts_ppr) ? seasonStats.fpts_ppr : rowMeta?.fpts,
    ppg: Number.isFinite(seasonStats.ppg) ? seasonStats.ppg : rowMeta?.ppg,
    posRank: rankCache.posRank || null,
    overallRank: rankCache.overallRank || null,
    ppgPosRank: rankCache.ppgPosRank || null,
    ppgOverallRank: rankCache.ppgOverallRank || null,
    ktc: Number.isFinite(valueData?.ktc) ? valueData.ktc : rowMeta?.ktc,
    ktcPosRank: parseDataHubPosRankNumber(valueData?.posRank || rowMeta?.posRankText),
    ktcOverallRank: Number.isFinite(valueData?.overallRank) ? valueData.overallRank : rowMeta?.overallKtcRank,
  };
}

function findDataHubOwnershipLeagueOwnerRows(playerId) {
  return (state.ownershipContext?.leagues || []).map(({ league, rosters, users }) => {
    const usersById = new Map((users || []).map((user) => [user.user_id, user]));
    const roster = (rosters || []).find((entry) => (entry.players || []).includes(playerId));
    if (!roster) {
      return {
        leagueName: league?.name || "League",
        leagueAbbr: getDataHubLeagueAbbr(league?.name || "League"),
        ownerDisplay: "Free Agent / Not rostered",
        missing: true,
      };
    }
    const owner = usersById.get(roster.owner_id) || null;
    return {
      leagueName: league?.name || "League",
      leagueAbbr: getDataHubLeagueAbbr(league?.name || "League"),
      ownerDisplay: owner?.display_name || owner?.username || `Roster ${roster.roster_id}`,
      isUser: roster.owner_id === state.userId || (Array.isArray(roster.co_owners) && roster.co_owners.includes(state.userId)),
      missing: false,
    };
  });
}

function getDataHubPlayerVitals(playerId, fallbackPlayer) {
  const fallback = { age: "—", height: "—", weight: "—", exp: "—", ry: "—" };
  const player = state.sleeperPlayers?.[playerId] || fallbackPlayer || null;
  if (!player) return fallback;

  const collect = (...values) => values
    .map((value) => (typeof value === "string" ? value.trim() : value))
    .filter((value) => value !== undefined && value !== null && value !== "");

  const parseAge = () => {
    const valueData = getActiveKtcLookup()?.[playerId];
    const ageFromSheet = valueData?.age;
    if (typeof ageFromSheet === "number") {
      return ageFromSheet.toFixed(1);
    }
    const candidates = collect(
      player.age,
      player.metadata?.age,
      player.metadata?.player_age,
    );
    for (const candidate of candidates) {
      const numeric = Number.parseInt(candidate, 10);
      if (Number.isFinite(numeric) && numeric > 0) {
        return Number(numeric).toFixed(1);
      }
    }
    if (player.birthdate) {
      const birth = new Date(player.birthdate);
      if (!Number.isNaN(birth.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const hasHadBirthdayThisYear =
          today.getMonth() > birth.getMonth()
          || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
        if (!hasHadBirthdayThisYear) age -= 1;
        if (Number.isFinite(age) && age > 0 && age < 80) {
          return Number(age).toFixed(1);
        }
      }
    }
    return null;
  };

  const formatHeightFromParts = (feet, inches) => {
    const f = Number.parseInt(feet, 10);
    const i = Number.parseInt(inches, 10);
    if (!Number.isFinite(f) && !Number.isFinite(i)) return null;
    const safeFeet = Number.isFinite(f) ? f : Math.floor(i / 12);
    const safeInches = Number.isFinite(i) ? i % 12 : 0;
    if (!Number.isFinite(safeFeet) || safeFeet <= 0) return null;
    const boundedInches = Math.max(0, Math.min(11, safeInches));
    return `${safeFeet}'${boundedInches}"`;
  };

  const parseHeightString = (value) => {
    if (value === undefined || value === null) return null;
    const str = String(value).trim();
    if (!str) return null;
    const digits = str.match(/\d+/g);
    if (!digits || digits.length === 0) return null;
    if (digits.length >= 2) {
      return formatHeightFromParts(digits[0], digits[1]);
    }
    const only = Number.parseInt(digits[0], 10);
    if (!Number.isFinite(only) || only <= 0) return null;
    const raw = digits[0];
    if (raw.length >= 3) {
      const feetPart = raw.slice(0, raw.length - 2);
      const inchPart = raw.slice(-2);
      const formattedFromRaw = formatHeightFromParts(feetPart, inchPart);
      if (formattedFromRaw) return formattedFromRaw;
    }
    if (only > 12) {
      const feet = Math.floor(only / 12);
      const inches = only % 12;
      return `${feet}'${inches}"`;
    }
    return `${only}'0"`;
  };

  const parseHeight = () => {
    const pairCandidates = [
      [player.height_feet, player.height_inches],
      [player.metadata?.height_feet, player.metadata?.height_inches],
      [player.height_ft, player.height_in],
      [player.metadata?.height_ft, player.metadata?.height_in],
    ];
    for (const [feet, inches] of pairCandidates) {
      const formatted = formatHeightFromParts(feet, inches);
      if (formatted) return formatted;
    }
    const heightCandidates = collect(
      player.height,
      player.metadata?.height,
      player.metadata?.player_height,
      player.height_inches,
      player.height_in,
      player.metadata?.height_inches,
      player.metadata?.height_in,
    );
    for (const candidate of heightCandidates) {
      const formatted = parseHeightString(candidate);
      if (formatted) return formatted;
    }
    return null;
  };

  const parseWeight = () => {
    const weightCandidates = collect(
      player.weight,
      player.metadata?.weight,
      player.metadata?.player_weight,
      player.weight_lbs,
      player.metadata?.weight_lbs,
    );
    for (const candidate of weightCandidates) {
      const numeric = Number.parseInt(candidate, 10);
      if (Number.isFinite(numeric) && numeric > 0) {
        return `${numeric} lbs`;
      }
    }
    return null;
  };

  const parseYearsExperience = () => {
    const exp = player.years_exp;
    if (exp === null || exp === undefined || exp === "") return "—";
    return String(exp);
  };

  const parseRookieYear = () => {
    const rookieYear = player.rookie_year;
    if (rookieYear && rookieYear !== "0") {
      return String(rookieYear);
    }
    const exp = player.years_exp;
    if (exp !== null && exp !== undefined && exp !== "") {
      return String(2025 - Number(exp));
    }
    return "—";
  };

  return {
    age: parseAge() ?? "—",
    height: parseHeight() ?? "—",
    weight: parseWeight() ?? "—",
    exp: parseYearsExperience(),
    ry: parseRookieYear(),
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
    if (["AGE", "HEIGHT", "WEIGHT"].includes(label)) {
      valueEl.style.color = getDataHubVitalsColor(label, pos, value) || "";
    }
    item.append(labelEl, valueEl);
    container.appendChild(item);
  });
  return container;
}

function getDataHubVitalsColor(label, pos, rawValue) {
  const position = String(pos || "").trim().toUpperCase();
  if (!rawValue || rawValue === "—") return null;
  if (label === "AGE") {
    const age = Number.parseFloat(rawValue);
    if (!Number.isFinite(age)) return null;
    if (position === "RB") return age <= 24 ? "#96f2ceb9" : (age < 28 ? "#84b8fbff" : "#f7a3ebdf");
    if (position === "WR" || position === "TE") return age < 26 ? "#96f2ceb9" : (age < 30 ? "#84b8fbff" : "#f7a3ebdf");
    if (position === "QB") return age < 29 ? "#96f2ceb9" : (age < 36 ? "#84b8fbff" : "#f7a3ebdf");
  }
  if (label === "HEIGHT") {
    const inchesMatch = String(rawValue).match(/(\d+)'(\d+)/);
    if (!inchesMatch) return null;
    const totalInches = (Number(inchesMatch[1]) * 12) + Number(inchesMatch[2]);
    return totalInches >= 72 ? "#96f2ceb9" : "#84b8fbff";
  }
  if (label === "WEIGHT") {
    const weight = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(weight)) return null;
    return weight >= 210 ? "#96f2ceb9" : "#84b8fbff";
  }
  return null;
}

function getDataHubConditionalColorByRank(rank, position) {
  if (!Number.isFinite(Number(rank)) || Number(rank) <= 0) {
    return "inherit";
  }
  const normalizedRank = Number(rank);
  const pos = String(position || "").trim().toUpperCase();
  const thresholds = pos === "WR"
    ? [
      { v: 12, c: "#51cba5" },
      { v: 24, c: "#34aabf" },
      { v: 36, c: "#4798fc" },
      { v: 48, c: "#957cff" },
      { v: 60, c: "#ff6fe1" },
      { v: 72, c: "#ff2eb9" },
    ]
    : [
      { v: 8, c: "#51cba5" },
      { v: 16, c: "#34aabf" },
      { v: 24, c: "#4798fc" },
      { v: 32, c: "#957cff" },
      { v: 44, c: "#ff6fe1" },
      { v: 60, c: "#ff2eb2" },
    ];
  const match = thresholds.find((entry) => normalizedRank <= entry.v);
  return match ? match.c : "#767693";
}

function getDataHubRankColor(rank) {
  const numericRank = Number(rank);
  if (!Number.isFinite(numericRank)) return "var(--color-text-primary, #e7ecff)";
  const match = DATAHUB_RANK_COLOR_THRESHOLDS.find((entry) => numericRank <= entry.v);
  if (match) return match.c;
  if (numericRank >= 300) return "#656565";
  return "#ff0080";
}

function getDataHubKtcColor(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return "#e0e6ed";
  const scales = [
    { v: 9000, c: "#72edd0b3" },
    { v: 8000, c: "#58d5ceb3" },
    { v: 7000, c: "#5bdae8b3" },
    { v: 6000, c: "#6eb4ebb3" },
    { v: 5500, c: "#62a5f9b3" },
    { v: 5000, c: "#848bffb3" },
    { v: 4500, c: "#7b63ffb3" },
    { v: 4000, c: "#964effb3" },
    { v: 3500, c: "#c449f9b3" },
    { v: 3000, c: "#ee42ffb3" },
    { v: 2500, c: "#d13eb8b3" },
    { v: 2000, c: "#d032aab3" },
    { v: 0, c: "#f94ea4b3" },
  ];
  return scales.find((entry) => numericValue >= entry.v)?.c || scales[scales.length - 1].c;
}

function getDataHubConditionalHudColor(value, lowThreshold, highThreshold) {
  if (!Number.isFinite(value)) return "inherit";
  if (value >= highThreshold) return "#51cba5";
  if (value >= lowThreshold) return "#4798fc";
  return "#ff6fe1";
}

function getDataHubLeagueAbbr(name) {
  const trimmedName = String(name || "").trim();
  const normalizedName = trimmedName.toLowerCase().replace(/[.,()]/g, "");
  if (DATAHUB_LEAGUE_ABBR_OVERRIDES[normalizedName]) {
    return DATAHUB_LEAGUE_ABBR_OVERRIDES[normalizedName];
  }
  if (trimmedName.length <= 4 && !trimmedName.includes(" ") && !trimmedName.includes("-")) {
    return trimmedName.toUpperCase();
  }
  return trimmedName.split(/[\s-]+/).map((part) => part[0] || "").join("").toUpperCase() || "LG";
}

function getDataHubLeagueColor(abbr) {
  if (!dataHubAssignedLeagueColors.has(abbr)) {
    dataHubAssignedLeagueColors.set(
      abbr,
      DATAHUB_LEAGUE_COLOR_PALETTE[dataHubNextLeagueColorIndex % DATAHUB_LEAGUE_COLOR_PALETTE.length],
    );
    dataHubNextLeagueColorIndex += 1;
  }
  return dataHubAssignedLeagueColors.get(abbr);
}

function getDataHubTeamLogoMarkup(team) {
  const teamKey = String(team || "FA").trim().toUpperCase() || "FA";
  return teamKey !== "FA"
    ? `<div class="player-tag modal-team-logo-chip" data-team="${dataHubEscapeHtml(teamKey)}"><img class="team-logo glow" src="${getDataHubTeamLogoSrc(teamKey)}" alt="${dataHubEscapeHtml(teamKey)}" width="24" height="24" loading="eager" /></div>`
    : '<div class="player-tag modal-team-logo-chip" data-team="FA"><span>FA</span></div>';
}

function getDataHubNormalizedTeamLogoKey(team) {
  const teamKey = String(team || "FA").trim().toUpperCase() || "FA";
  return DATAHUB_TEAM_LOGO_KEY_MAP[teamKey] || teamKey.toLowerCase();
}

function getDataHubTeamLogoSrc(team) {
  const normalizedTeam = getDataHubNormalizedTeamLogoKey(team);
  return `../assets/NFL_logos_svg/${normalizedTeam}.svg`;
}

function showDataHubTemporaryTooltip(element, message) {
  document.querySelectorAll(".custom-tooltip").forEach((node) => node.remove());
  const tooltip = document.createElement("div");
  tooltip.className = "custom-tooltip";
  tooltip.textContent = message;
  document.body.appendChild(tooltip);
  const anchor = element || document.body;
  const rect = anchor.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const left = Math.max(8, rect.left + window.scrollX + ((rect.width - tooltipRect.width) / 2));
  const top = rect.bottom + window.scrollY + 12;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  requestAnimationFrame(() => tooltip.classList.add("is-visible"));
  window.setTimeout(() => tooltip.classList.add("is-hiding"), 2000);
  window.setTimeout(() => tooltip.remove(), 2400);
}

function dataHubEscapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getDataHubOrdinalSuffix(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "";
  const abs = Math.abs(numericValue);
  const tens = abs % 100;
  if (tens >= 11 && tens <= 13) return "th";
  const ones = abs % 10;
  if (ones === 1) return "st";
  if (ones === 2) return "nd";
  if (ones === 3) return "rd";
  return "th";
}
