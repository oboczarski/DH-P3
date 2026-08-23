export type NflDraftPosition = "QB" | "RB" | "WR" | "TE";

export type NflDraftRange =
  | "Round 1"
  | "Round 2"
  | "Round 3"
  | "Round 4"
  | "Round 5"
  | "Round 6"
  | "Round 7";

export type NflDraftTrendRow = {
  range: NflDraftRange;
  shortRange: string;
  overall: number;
  QB: number;
  RB: number;
  WR: number;
  TE: number;
};

// NFL Draft hit-rate source: these seven rows preserve the exact overall and
// positional values from the retired Vanilla Research tab.
export const nflDraftTrendData: NflDraftTrendRow[] = [
  { range: "Round 1", shortRange: "RD 1", overall: 78.4, QB: 78, RB: 83, WR: 76, TE: 78 },
  { range: "Round 2", shortRange: "RD 2", overall: 47.7, QB: 42, RB: 50, WR: 51, TE: 40 },
  { range: "Round 3", shortRange: "RD 3", overall: 38.5, QB: 31, RB: 62, WR: 30, TE: 36 },
  { range: "Round 4", shortRange: "RD 4", overall: 18.0, QB: 20, RB: 27, WR: 9, TE: 23 },
  { range: "Round 5", shortRange: "RD 5", overall: 15.0, QB: 7, RB: 27, WR: 13, TE: 9 },
  { range: "Round 6", shortRange: "RD 6", overall: 14.1, QB: 11, RB: 18, WR: 15, TE: 8 },
  { range: "Round 7", shortRange: "RD 7", overall: 9.4, QB: 13, RB: 9, WR: 11, TE: 4 },
];

export const nflDraftPositionGradients = {
  QB: ["#FFA947", "#FF916B", "#FF666B", "#F94095"],
  RB: ["#004CFF", "#00B3FF", "#00EDFF", "#00FFCB"],
  WR: ["#5300FF", "#4947FF", "#0066FF", "#0099FF"],
  TE: ["#FF0088", "#D400FF", "#5D00FF", "#4C00FF"],
} satisfies Record<NflDraftPosition, readonly string[]>;

export const nflDraftStatNotes = {
  "Round 1": { desktop: "Premium capital", mobile: "Premium" },
  "Round 2": { desktop: "Day 2 signal", mobile: "Day 2" },
  "Round 3": { desktop: "Late Day 2", mobile: "Late D2" },
  "Round 4": { desktop: "Early Day 3", mobile: "Early D3" },
  "Round 5": { desktop: "Value range", mobile: "Value" },
  "Round 6": { desktop: "Long-shot range", mobile: "Long shot" },
  "Round 7": { desktop: "Final-round odds", mobile: "Final" },
} satisfies Record<NflDraftRange, { desktop: string; mobile: string }>;

export const nflDraftStatPalettes = [
  { accent: "#ff0aa5", rgb: "255,10,165", start: "#ff82d7", mid: "#ff0aa5", end: "#bc3dff" },
  { accent: "#d747ff", rgb: "215,71,255", start: "#ef83ff", mid: "#d747ff", end: "#986cff" },
  { accent: "#8b6cff", rgb: "139,108,255", start: "#d09bff", mid: "#8b6cff", end: "#5f79ff" },
  { accent: "#4d79ff", rgb: "77,121,255", start: "#a68dff", mid: "#6870ff", end: "#16a9ff" },
  { accent: "#00a9ff", rgb: "0,169,255", start: "#69a9ff", mid: "#009fff", end: "#00d7f2" },
  { accent: "#00dcca", rgb: "0,220,202", start: "#50e8ff", mid: "#00dcca", end: "#27ef9f" },
  { accent: "#55e58f", rgb: "85,229,143", start: "#8fffc0", mid: "#55e58f", end: "#00d9b0" },
] as const;

export type TrendLabelOffset = { dx: number; dy: number };

// Each label receives a position-and-round-specific slot. The offsets preserve
// all 28 visible values while separating the dense Round 1 and late-round data.
export const nflDraftTrendLabelOffsets: Record<NflDraftPosition, readonly TrendLabelOffset[]> = {
  QB: [
    { dx: -22, dy: -12 }, { dx: -15, dy: -13 }, { dx: -16, dy: -12 },
    { dx: -16, dy: 12 }, { dx: -14, dy: 17 }, { dx: -16, dy: -6 }, { dx: -18, dy: -26 },
  ],
  RB: [
    { dx: 0, dy: -15 }, { dx: -15, dy: -14 }, { dx: 0, dy: -14 },
    { dx: 0, dy: -15 }, { dx: 0, dy: -15 }, { dx: 0, dy: -17 }, { dx: 17, dy: 16 },
  ],
  WR: [
    { dx: 0, dy: 19 }, { dx: 15, dy: 17 }, { dx: 16, dy: 17 },
    { dx: 0, dy: 17 }, { dx: 0, dy: -15 }, { dx: 15, dy: -7 }, { dx: 17, dy: -10 },
  ],
  TE: [
    { dx: 22, dy: -5 }, { dx: 15, dy: 15 }, { dx: 17, dy: -12 },
    { dx: 15, dy: -12 }, { dx: 13, dy: 2 }, { dx: 14, dy: 18 }, { dx: -8, dy: 19 },
  ],
};
