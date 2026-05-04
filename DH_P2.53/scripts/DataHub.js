// ---------------------------------------------------------------------------
// Hero copy and filter labels that drive the surrounding page shell.
// ---------------------------------------------------------------------------
// DataHub hero titles:
// the visible page title now follows the active Stats vs Trade Values tab so
// each content view shows the requested heading without touching other pages.
const PAGE_TITLES = Object.freeze({
  stats: "2025 Stats & Advanced Analytics",
  "adp-values": "Trade Values & ADP",
  rookies: "2026 Rookie Prospect Grades",
});
const CONTENT_PAGE_VIEWS = new Set(["stats", "adp-values", "rookies-career", "rookies-trade"]);
// DataHub top-tab routing:
// rookies owns two local content modes now, but the visible top page tab still
// remains the single "Rookies" shell control used by the hero/chart state.
const DATAHUB_PAGE_TAB_TO_CONTENT_VIEW = Object.freeze({
  stats: "stats",
  "adp-values": "adp-values",
  rookies: "rookies-career",
});
const STATS_CATEGORY_KEYS = Object.freeze(["overview", "passing", "rushing", "receiving"]);
const TRADE_VALUES_CATEGORY_KEYS = Object.freeze(["all", "qb", "rb", "wr", "te", "flx"]);
const ROOKIES_CAREER_CATEGORY_KEYS = STATS_CATEGORY_KEYS;
const ROOKIES_TRADE_CATEGORY_KEYS = TRADE_VALUES_CATEGORY_KEYS;
const DATAHUB_STATS_FAMILY_VIEWS = new Set(["stats", "rookies-career"]);
const DATAHUB_TRADE_FAMILY_VIEWS = new Set(["adp-values", "rookies-trade"]);
const STATS_ACTIVE_VIEW_LABELS = Object.freeze({
  overview: "OVERVIEW (ALL)",
  passing: "PASSING (QB)",
  rushing: "RUSHING (RB)",
  receiving: "RECEIVING (W/T)",
});
const STATS_CATEGORY_CONFIGS = Object.freeze([
  Object.freeze({ key: "overview", label: "OVERVIEW", meta: "(ALL)", ariaLabel: "OVERVIEW (ALL)" }),
  Object.freeze({ key: "passing", label: "PASSING", meta: "(QB)", ariaLabel: "PASSING (QB)" }),
  Object.freeze({ key: "rushing", label: "RUSHING", meta: "(RB)", ariaLabel: "RUSHING (RB)" }),
  Object.freeze({ key: "receiving", label: "RECEIVING", meta: "(W/T)", ariaLabel: "RECEIVING (W/T)" }),
]);
const TRADE_VALUES_ACTIVE_VIEW_LABELS = Object.freeze({
  all: "ALL",
  qb: "QB",
  rb: "RB",
  wr: "WR",
  te: "TE",
  flx: "FLX",
});
const TRADE_VALUES_CATEGORY_CONFIGS = Object.freeze([
  Object.freeze({ key: "all", label: "ALL", ariaLabel: "ALL" }),
  Object.freeze({ key: "qb", label: "QB", ariaLabel: "QB" }),
  Object.freeze({ key: "rb", label: "RB", ariaLabel: "RB" }),
  Object.freeze({ key: "wr", label: "WR", ariaLabel: "WR" }),
  Object.freeze({ key: "te", label: "TE", ariaLabel: "TE" }),
  Object.freeze({ key: "flx", label: "FLX", ariaLabel: "FLX" }),
]);

// DataHub view-specific filter controls:
// these configs drive the chip labels, active-view meta text, and which filter
// state belongs to Stats versus Trade Values so tab switches restore the last
// valid selection for each table instead of sharing one category key.
const VIEW_FILTER_CONFIGS = Object.freeze({
  stats: Object.freeze({
    defaultCategory: "overview",
    activeViewLabels: STATS_ACTIVE_VIEW_LABELS,
    categories: STATS_CATEGORY_CONFIGS,
    supportsReceivingSubfilters: true,
  }),
  "adp-values": Object.freeze({
    defaultCategory: "all",
    activeViewLabels: TRADE_VALUES_ACTIVE_VIEW_LABELS,
    categories: TRADE_VALUES_CATEGORY_CONFIGS,
    supportsReceivingSubfilters: false,
  }),
  "rookies-career": Object.freeze({
    defaultCategory: "overview",
    activeViewLabels: STATS_ACTIVE_VIEW_LABELS,
    categories: STATS_CATEGORY_CONFIGS,
    supportsReceivingSubfilters: true,
  }),
  "rookies-trade": Object.freeze({
    defaultCategory: "all",
    activeViewLabels: TRADE_VALUES_ACTIVE_VIEW_LABELS,
    categories: TRADE_VALUES_CATEGORY_CONFIGS,
    supportsReceivingSubfilters: false,
  }),
});

// Stats-only qualifier controls:
// these category configs drive the new middle-row qualifier UI so each Stats
// category can reset to its requested defaults while keeping the team filter
// independent from those per-category qualifier resets.
const STATS_QUALIFIER_CONFIGS = Object.freeze({
  overview: Object.freeze({
    defaultStat: "SNP%",
    defaultThreshold: 70,
    defaultShowAll: true,
    stats: Object.freeze({
      "SNP%": Object.freeze([70, 60, 50, 40, 30]),
      GM_P: Object.freeze([17, 14, 10, 7, 4]),
    }),
  }),
  passing: Object.freeze({
    defaultStat: "paATT",
    defaultThreshold: 200,
    defaultShowAll: false,
    stats: Object.freeze({
      DB: Object.freeze([500, 400, 300]),
      paATT: Object.freeze([400, 300, 200, 100]),
      GM_P: Object.freeze([17, 14, 10, 7, 4]),
    }),
  }),
  rushing: Object.freeze({
    defaultStat: "CAR",
    defaultThreshold: 100,
    defaultShowAll: false,
    stats: Object.freeze({
      CAR: Object.freeze([200, 150, 100, 75, 50]),
      "SNP%": Object.freeze([70, 60, 50, 40, 30]),
      GM_P: Object.freeze([17, 14, 10, 7, 4]),
    }),
  }),
  receiving: Object.freeze({
    defaultStat: "RR",
    defaultThreshold: 220,
    defaultShowAll: false,
    stats: Object.freeze({
      RR: Object.freeze([450, 380, 300, 220, 180]),
      TGT: Object.freeze([110, 100, 90, 80]),
      "SNP%": Object.freeze([70, 60, 50, 40, 30]),
      GM_P: Object.freeze([17, 14, 10, 7, 4]),
    }),
  }),
});
const DATAHUB_CONTROL_TEAM_LOGO_KEY_MAP = Object.freeze({
  WSH: "was",
  WAS: "was",
  JAC: "jax",
  JAX: "jax",
  LA: "lar",
});

// ---------------------------------------------------------------------------
// Top 60 positional chart reference data.
// ---------------------------------------------------------------------------
// This keeps the imported Top60ChrtW widget page-local to DataHub and preserves
// the exact static series/count data from the reference bundle for v1.
const DATAHUB_TOP60_CHART_DATA = Object.freeze([
  { rank: 1, QB: 0, RB: 1, WR: 0, TE: 0 },
  { rank: 2, QB: 0, RB: 1, WR: 1, TE: 0 },
  { rank: 3, QB: 1, RB: 1, WR: 1, TE: 0 },
  { rank: 4, QB: 1, RB: 2, WR: 1, TE: 0 },
  { rank: 5, QB: 1, RB: 3, WR: 1, TE: 0 },
  { rank: 6, QB: 1, RB: 4, WR: 1, TE: 0 },
  { rank: 7, QB: 2, RB: 4, WR: 1, TE: 0 },
  { rank: 8, QB: 2, RB: 4, WR: 2, TE: 0 },
  { rank: 9, QB: 3, RB: 4, WR: 2, TE: 0 },
  { rank: 10, QB: 4, RB: 4, WR: 2, TE: 0 },
  { rank: 11, QB: 5, RB: 4, WR: 2, TE: 0 },
  { rank: 12, QB: 5, RB: 4, WR: 3, TE: 0 },
  { rank: 13, QB: 6, RB: 4, WR: 3, TE: 0 },
  { rank: 14, QB: 6, RB: 5, WR: 3, TE: 0 },
  { rank: 15, QB: 6, RB: 5, WR: 3, TE: 1 },
  { rank: 16, QB: 7, RB: 5, WR: 3, TE: 1 },
  { rank: 17, QB: 7, RB: 5, WR: 4, TE: 1 },
  { rank: 18, QB: 8, RB: 5, WR: 4, TE: 1 },
  { rank: 19, QB: 9, RB: 5, WR: 4, TE: 1 },
  { rank: 20, QB: 9, RB: 6, WR: 4, TE: 1 },
  { rank: 21, QB: 10, RB: 6, WR: 4, TE: 1 },
  { rank: 22, QB: 11, RB: 6, WR: 4, TE: 1 },
  { rank: 23, QB: 12, RB: 6, WR: 4, TE: 1 },
  { rank: 24, QB: 12, RB: 6, WR: 5, TE: 1 },
  { rank: 25, QB: 12, RB: 7, WR: 5, TE: 1 },
  { rank: 26, QB: 12, RB: 7, WR: 5, TE: 2 },
  { rank: 27, QB: 12, RB: 7, WR: 6, TE: 2 },
  { rank: 28, QB: 12, RB: 8, WR: 6, TE: 2 },
  { rank: 29, QB: 13, RB: 8, WR: 6, TE: 2 },
  { rank: 30, QB: 14, RB: 8, WR: 6, TE: 2 },
  { rank: 31, QB: 14, RB: 8, WR: 7, TE: 2 },
  { rank: 32, QB: 14, RB: 9, WR: 7, TE: 2 },
  { rank: 33, QB: 15, RB: 9, WR: 7, TE: 2 },
  { rank: 34, QB: 15, RB: 10, WR: 7, TE: 2 },
  { rank: 35, QB: 15, RB: 11, WR: 7, TE: 2 },
  { rank: 36, QB: 16, RB: 11, WR: 7, TE: 2 },
  { rank: 37, QB: 17, RB: 11, WR: 7, TE: 2 },
  { rank: 38, QB: 18, RB: 11, WR: 7, TE: 2 },
  { rank: 39, QB: 18, RB: 11, WR: 8, TE: 2 },
  { rank: 40, QB: 19, RB: 11, WR: 8, TE: 2 },
  { rank: 41, QB: 19, RB: 12, WR: 8, TE: 2 },
  { rank: 42, QB: 19, RB: 13, WR: 8, TE: 2 },
  { rank: 43, QB: 19, RB: 14, WR: 8, TE: 2 },
  { rank: 44, QB: 19, RB: 14, WR: 9, TE: 2 },
  { rank: 45, QB: 20, RB: 14, WR: 9, TE: 2 },
  { rank: 46, QB: 20, RB: 14, WR: 10, TE: 2 },
  { rank: 47, QB: 20, RB: 15, WR: 10, TE: 2 },
  { rank: 48, QB: 20, RB: 15, WR: 11, TE: 2 },
  { rank: 49, QB: 20, RB: 15, WR: 12, TE: 2 },
  { rank: 50, QB: 20, RB: 15, WR: 13, TE: 2 },
  { rank: 51, QB: 20, RB: 15, WR: 14, TE: 2 },
  { rank: 52, QB: 20, RB: 16, WR: 14, TE: 2 },
  { rank: 53, QB: 21, RB: 16, WR: 14, TE: 2 },
  { rank: 54, QB: 21, RB: 17, WR: 14, TE: 2 },
  { rank: 55, QB: 21, RB: 18, WR: 14, TE: 2 },
  { rank: 56, QB: 21, RB: 18, WR: 15, TE: 2 },
  { rank: 57, QB: 21, RB: 18, WR: 16, TE: 2 },
  { rank: 58, QB: 21, RB: 18, WR: 17, TE: 2 },
  { rank: 59, QB: 21, RB: 19, WR: 17, TE: 2 },
  { rank: 60, QB: 21, RB: 20, WR: 17, TE: 2 },
]);

const DATAHUB_TOP60_CHART_SERIES = Object.freeze([
  Object.freeze({
    key: "QB",
    count: 21,
    pct: 35.0,
    lineStart: "#ff9a3d",
    lineEnd: "#ff4187",
    areaStart: "#ff9a3d",
    areaEnd: "#ff4187",
    glow: "rgba(255, 120, 90, 0.34)",
  }),
  Object.freeze({
    key: "RB",
    count: 20,
    pct: 33.3,
    lineStart: "#1ac2ff",
    lineEnd: "#06ff97",
    areaStart: "#64d8ff",
    areaEnd: "#06ffa8",
    glow: "rgba(100, 216, 255, 0.34)",
  }),
  Object.freeze({
    key: "WR",
    count: 17,
    pct: 28.3,
    lineStart: "#8153ff",
    lineEnd: "#0299fe",
    areaStart: "#6e10fb",
    areaEnd: "#0d72ff",
    glow: "rgba(124, 111, 255, 0.34)",
  }),
  Object.freeze({
    key: "TE",
    count: 2,
    pct: 3.3,
    lineStart: "#ff6bc8",
    lineEnd: "#7f2fff",
    areaStart: "#ff6bc8",
    areaEnd: "#7f2fff",
    glow: "rgba(255, 107, 200, 0.30)",
  }),
]);

// Trade Values chart reference data:
// this is the updated Top60ChrtW widget content, kept page-local so the
// Trade Values hero chart can match the standalone reference without pulling
// from live table rows in this pass.
const DATAHUB_TRADE_VALUES_CHART_DATA = Object.freeze([
  { name: "J.Allen", fullName: "Josh Allen", pos: "QB", ktc: 3, adp: 1.5 },
  { name: "Bijan", fullName: "Bijan Robinson", pos: "RB", ktc: 2, adp: 2.6 },
  { name: "J.Chase", fullName: "Ja'Marr Chase", pos: "WR", ktc: 1, adp: 4.4 },
  { name: "Maye", fullName: "Drake Maye", pos: "QB", ktc: 6, adp: 3.4 },
  { name: "Gibbs", fullName: "Jahmyr Gibbs", pos: "RB", ktc: 5, adp: 5.9 },
  { name: "JSN", fullName: "Jaxon Smith-Njigba", pos: "WR", ktc: 4, adp: 7.5 },
  { name: "Nacua", fullName: "Puka Nacua", pos: "WR", ktc: 7, adp: 6.4 },
  { name: "Daniels", fullName: "Jayden Daniels", pos: "QB", ktc: 11, adp: 8 },
  { name: "Nabers", fullName: "Malik Nabers", pos: "WR", ktc: 9, adp: 12.8 },
  { name: "St.Brown", fullName: "Amon-Ra St. Brown", pos: "WR", ktc: 13, adp: 9.1 },
  { name: "C.Williams", fullName: "Caleb Williams", pos: "QB", ktc: 8, adp: 14.1 },
  { name: "Bowers", fullName: "Brock Bowers", pos: "TE", ktc: 10, adp: 13.2 },
  { name: "L.Jackson", fullName: "Lamar Jackson", pos: "QB", ktc: 14, adp: 11.8 },
  { name: "Jefferson", fullName: "Justin Jefferson", pos: "WR", ktc: 12, adp: 16.3 },
  { name: "Burrow", fullName: "Joe Burrow", pos: "QB", ktc: 18, adp: 10.4 },
].sort((a, b) => b.adp - a.adp));

const DATAHUB_TRADE_VALUES_CHART_POSITIONS = Object.freeze([
  Object.freeze({
    key: "QB",
    lineStart: "#ff6441",
    lineEnd: "#fe2a78",
    glow: "rgba(255,120,90,0.34)",
    badgeColor: "#d37be9",
  }),
  Object.freeze({
    key: "RB",
    lineStart: "#1ac2ff",
    lineEnd: "#06ff97",
    glow: "rgba(100,216,255,0.34)",
    badgeColor: "#66fccc",
  }),
  Object.freeze({
    key: "WR",
    lineStart: "#8153ff",
    lineEnd: "#0299fe",
    glow: "rgba(124,111,255,0.34)",
    badgeColor: "#60b5ff",
  }),
  Object.freeze({
    key: "TE",
    lineStart: "#ff4187",
    lineEnd: "#6a00ff",
    glow: "rgba(255,107,200,0.30)",
    badgeColor: "#7e51fc",
  }),
]);

const DATAHUB_TRADE_VALUES_CHART_COLORS = Object.freeze({
  ktc: "#17c9ff",
  mid: "#3d1bff",
  adp: "#9205fd",
});

const DATAHUB_HERO_CHART_CONFIGS = Object.freeze({
  stats: Object.freeze({
    key: "stats",
    template: "standard",
    title: "PPR · Top 60  — Positional Distribution",
    ariaLabel: "Top 60 positional distribution chart",
    xAxisLabel: "Rank",
    yAxisLabel: "Count",
    renderSummary: renderDataHubTop60SummaryChips,
    buildOption: buildDataHubTop60ChartOption,
  }),
  "adp-values": Object.freeze({
    key: "adp-values",
    template: "standard",
    title: "SFLX · Top 15 — KTC Rank vs. ADP",
    ariaLabel: "Top 15 KTC Rank vs. ADP chart",
    xAxisLabel: "",
    yAxisLabel: "Player",
    renderSummary: renderDataHubTradeValuesSummaryChips,
    buildOption: buildDataHubTradeValuesChartOption,
  }),
  rookies: Object.freeze({
    key: "rookies",
    template: "rookies",
    title: "2026 NFL Prospect Grades • Tier Map",
    ariaLabel: "2026 rookie prospect tier map chart",
  }),
});

const DATAHUB_STANDARD_CHART_TEMPLATE = `
  <div class="datahub-top60-chart__header">
    <h2 data-chart-title></h2>
  </div>

  <div class="datahub-top60-chart__body">
    <div class="datahub-top60-chart__shell">
      <div class="datahub-top60-chart__plot" data-chart-canvas></div>
      <div class="datahub-top60-chart__axis datahub-top60-chart__axis--x" data-chart-axis-x></div>
      <div class="datahub-top60-chart__axis datahub-top60-chart__axis--y" data-chart-axis-y></div>
    </div>

    <div class="datahub-top60-chart__chips" data-chart-summary></div>
  </div>
`;

const DATAHUB_ROOKIES_CHART_TEMPLATE = `
  <div class="datahub-top60-chart__header datahub-top60-chart__header--rookies">
    <h2 data-chart-title></h2>
    <div class="datahub-rookies-chart__legend" aria-label="Tier legend">
      <span class="datahub-rookies-chart__legend-item datahub-rookies-chart__legend-item--1">
        <span class="datahub-rookies-chart__legend-dot"></span>
        Tier 1
      </span>
      <span class="datahub-rookies-chart__legend-item datahub-rookies-chart__legend-item--2">
        <span class="datahub-rookies-chart__legend-dot"></span>
        Tier 2
      </span>
      <span class="datahub-rookies-chart__legend-item datahub-rookies-chart__legend-item--3">
        <span class="datahub-rookies-chart__legend-dot"></span>
        Tier 3
      </span>
      <span class="datahub-rookies-chart__legend-item datahub-rookies-chart__legend-item--4">
        <span class="datahub-rookies-chart__legend-dot"></span>
        Tier 4
      </span>
    </div>
  </div>

  <div class="datahub-top60-chart__body datahub-top60-chart__body--rookies">
    <div class="datahub-rookies-chart__shell" data-rookies-chart-shell>
      <div class="datahub-rookies-chart__plot" data-chart-canvas></div>
    </div>
  </div>
`;

// Rookies hero chart reference data:
// these constants preserve the standalone prospect tier-map layout so the
// DataHub rookies tab can use the same geometry and rendering behavior.
const DATAHUB_ROOKIES_CHART_PLAYERS = Object.freeze([
  { name: "Jeremiyah Love", grade: 94, tier: 1, pos: "RB" },
  { name: "Fernando Mendoza", grade: 90, tier: 2, pos: "QB" },
  { name: "Carnell Tate", grade: 89, tier: 2, pos: "WR" },
  { name: "Makai Lemon", grade: 88, tier: 2, pos: "WR" },
  { name: "Jordyn Tyson", grade: 87, tier: 2, pos: "WR" },
  { name: "KC Concepcion", grade: 84, tier: 3, pos: "WR" },
  { name: "Kenyon Sadiq", grade: 80, tier: 3, pos: "TE" },
  { name: "Omar Cooper", grade: 81, tier: 3, pos: "WR" },
  { name: "Denzel Boston", grade: 80, tier: 3, pos: "WR" },
  { name: "Jadarian Price", grade: 74, tier: 4, pos: "RB" },
  { name: "Ty Simpson", grade: 76, tier: 4, pos: "QB" },
  { name: "Eli Stowers", grade: 77, tier: 4, pos: "TE" },
  { name: "Mike Washington", grade: 73, tier: 4, pos: "RB" },
  { name: "Jonah Coleman", grade: 72, tier: 4, pos: "RB" },
  { name: "Elijah Sarratt", grade: 75, tier: 4, pos: "WR" },
  { name: "Emmett Johnson", grade: 70, tier: 4, pos: "RB" },
]);

const DATAHUB_ROOKIES_TIER_LABELS = Object.freeze({
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
  4: "Tier 4",
});

const DATAHUB_ROOKIES_TIER_KEYS = Object.freeze([2, 3, 4]);
const DATAHUB_ROOKIES_REFERENCE_CENTER_X = 600;
const DATAHUB_ROOKIES_REFERENCE_CENTER_Y = 600;
const DATAHUB_ROOKIES_GEOMETRY = Object.freeze({
  centerNodeRadius: 102,
  centerScale: 0.955,
  outerScale: 1.08,
  backdropInset: 18,
  chartPadding: { top: 12, right: 10, bottom: 10, left: 10 },
  coreOrbit3Radius: 170,
  coreRingInnerRadius: 128,
  bands: {
    2: { radius: 214, width: 76, nodeRadius: 58, angles: [0, 106, 180, 276] },
    3: { radius: 324, width: 74, nodeRadius: 52, angles: [56, 140, 228, 318] },
    4: {
      radius: 434,
      width: 72,
      nodeRadius: 46,
      angles: [34, 72, 126, 180, 234, 288, 326],
    },
  },
  radialOffsets: {
    "Jonah Coleman": 34,
    "Emmett Johnson": 34,
  },
});

const DATAHUB_ROOKIES_REFERENCE_PLAYERS = (() => {
  const tierIndices = { 2: 0, 3: 0, 4: 0 };

  return DATAHUB_ROOKIES_CHART_PLAYERS.map((player) => {
    if (player.tier === 1) {
      return {
        ...player,
        shortName: formatDataHubRookiesShortName(player.name),
        angle: 0,
        x: DATAHUB_ROOKIES_REFERENCE_CENTER_X,
        y: DATAHUB_ROOKIES_REFERENCE_CENTER_Y,
        nodeRadius: DATAHUB_ROOKIES_GEOMETRY.centerNodeRadius,
      };
    }

    const band = DATAHUB_ROOKIES_GEOMETRY.bands[player.tier];
    const angle = band.angles[tierIndices[player.tier]++];
    const radius = band.radius + (DATAHUB_ROOKIES_GEOMETRY.radialOffsets[player.name] || 0);
    const point = dataHubPolarToCartesian(
      DATAHUB_ROOKIES_REFERENCE_CENTER_X,
      DATAHUB_ROOKIES_REFERENCE_CENTER_Y,
      radius,
      angle,
    );

    return {
      ...player,
      shortName: formatDataHubRookiesShortName(player.name),
      angle,
      x: point.x,
      y: point.y,
      nodeRadius: band.nodeRadius,
    };
  });
})();

const DATAHUB_ROOKIES_REFERENCE_EXTENTS = (() => {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  const outerBand = DATAHUB_ROOKIES_GEOMETRY.bands[4];

  dataHubExpandBounds(
    bounds,
    DATAHUB_ROOKIES_REFERENCE_CENTER_X,
    DATAHUB_ROOKIES_REFERENCE_CENTER_Y,
    outerBand.radius + outerBand.nodeRadius + DATAHUB_ROOKIES_GEOMETRY.backdropInset,
  );
  dataHubExpandBounds(
    bounds,
    DATAHUB_ROOKIES_REFERENCE_CENTER_X,
    DATAHUB_ROOKIES_REFERENCE_CENTER_Y,
    DATAHUB_ROOKIES_GEOMETRY.coreOrbit3Radius,
  );

  DATAHUB_ROOKIES_REFERENCE_PLAYERS.forEach((player) => {
    dataHubExpandBounds(
      bounds,
      player.x,
      player.y,
      player.tier === 1 ? player.nodeRadius + 34 : player.nodeRadius + 15,
    );
  });

  return {
    left: DATAHUB_ROOKIES_REFERENCE_CENTER_X - bounds.minX,
    right: bounds.maxX - DATAHUB_ROOKIES_REFERENCE_CENTER_X,
    top: DATAHUB_ROOKIES_REFERENCE_CENTER_Y - bounds.minY,
    bottom: bounds.maxY - DATAHUB_ROOKIES_REFERENCE_CENTER_Y,
  };
})();

// ---------------------------------------------------------------------------
// Column order is the main structural source of truth for each category view.
// These arrays simultaneously define:
// 1. visible column order
// 2. which columns remain frozen (the first view-specific sticky columns)
// 3. which fields participate in search/sort for that view
// 4. how column groups must line up with the rendered table
// ---------------------------------------------------------------------------
// Trade Values table groups:
// the market columns are split into parallel 1QB and SFLX trios so the
// compact Trade Values view can compare each format left-to-right.
const ONE_QB_MARKET_DATA_COLUMNS = ["KTC 1QB", "1QB ADP", "1QB DIFF"];
const SFLX_MARKET_DATA_COLUMNS = ["KTC SFLX", "SFLX ADP", "SFLX DIFF"];
const MARKET_DATA_COLUMNS = [...ONE_QB_MARKET_DATA_COLUMNS, ...SFLX_MARKET_DATA_COLUMNS];
const BLANK_PLACEHOLDER_COLUMNS = new Set();

// Trade Values table layout:
// this view intentionally stays compact and reuses one shared schema across all
// category filters, so category changes only affect which players are shown and
// never introduce the passing/rushing/receiving stat groups back into the table.
const TRADE_VALUES_COLUMN_SET = [
  "RK",
  "PLAYER",
  "POS",
  "TM",
  "AGE",
  "FPTS",
  "PPG",
  ...MARKET_DATA_COLUMNS,
];
const ROOKIES_TRADE_COLUMN_SET = [
  "RK",
  "PLAYER",
  "POS",
  "TM",
  "AGE",
  "GRD",
  "TIER",
  "OVR-RK",
  "RD & PK#",
  "OVR_PK",
  ...MARKET_DATA_COLUMNS,
];

const STATS_COLUMN_SETS = {
  overview: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "FPTS",
    "PPG",
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
  passing: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "G",
    "FPTS",
    "PPG",
    "paATT",
    "CMP",
    "paYDS",
    "paTD",
    "pa1D",
    "SAC",
    "INT",
    "CMP%",
    "paRTG",
    "EPA/DB",
    "CPOE",
    "TTT",
    "PRS%",
    "DP%",
    "paYPG",
    "pIMP/A",
    "ruYDS",
    "ruTD",
    "CAR",
    "YPC",
    "YDS(t)",
    "FUM",
    "IMP/G",
    "FPOE",
    "CSTY%",
    "CL",
  ],
  rushing: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "G",
    "FPTS",
    "PPG",
    "CAR",
    "ruYDS",
    "ruTD",
    "ru1D",
    "MTF",
    "YCO",
    "RYOE",
    "SNP%",
    "YPC",
    "ELU",
    "MTF/A",
    "YCO/A",
    "EXPLSV%",
    "ruYPG",
    "REC",
    "recYDS",
    "recTD",
    "YPRR",
    "TS%",
    "TGT",
    "YAC",
    "rec1D",
    "YDS(t)",
    "FUM",
    "IMP/G",
    "FPOE",
    "CSTY%",
    "CL",
  ],
  receiving: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "G",
    "FPTS",
    "PPG",
    "TGT",
    "REC",
    "recYDS",
    "recTD",
    "rec1D",
    "RR",
    "RZ Tgt",
    "TS%",
    "YPRR",
    "TPRR",
    "1DRR",
    "recYPG",
    "AY%",
    "YAC",
    "YPR",
    "CAR",
    "ruYDS",
    "ruTD",
    "YPC",
    "SNP%",
    "IMP/G",
    "YDS(t)",
    "FUM",
    "FPOE",
    "CSTY%",
    "CL",
  ],
};
// Rookie career table schemas:
// these page-local column sets mirror the requested college-career layouts,
// while duplicate source stats like passing ATT get unique internal keys so
// DataHub can keep column groups, widths, and separators stable.
const ROOKIES_CAREER_COLUMN_SETS = {
  overview: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "TIER",
    "GRD",
    "POS-RK",
    "RD & PK#",
    "OVR_PK",
    "CFB",
    "HT",
    "WT",
    "40dsh",
    "Gs",
    "tYDS",
    "tTD",
    "OPP",
    "IMP/OPP",
  ],
  passing: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "GRD",
    "TIER",
    "OVR-RK",
    "RD & PK#",
    "OVR_PK",
    "Gs",
    "tYDS",
    "tTD",
    "OPP",
    "IMP/OPP",
    "paATT",
    "CMP",
    "paYDS",
    "paTD",
    "pa1D",
    "pIMP",
    "INT",
    "SAC",
    "paATT_EFF",
    "CMP%",
    "YPA",
    "pIMP/ATT",
    "ruYDS",
    "ruTD",
    "CAR",
    "YPC",
    "CFB",
    "HT",
    "WT",
    "40dsh",
  ],
  rushing: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "GRD",
    "TIER",
    "OVR-RK",
    "RD & PK#",
    "OVR_PK",
    "Gs",
    "tYDS",
    "tTD",
    "OPP",
    "IMP/OPP",
    "CAR",
    "ruYDS",
    "ruTD",
    "ru1D",
    "MTF",
    "YCO",
    "YPC",
    "MTF/A",
    "YCO/A",
    "EXPLSV%",
    "TGT",
    "REC",
    "recYDS",
    "recTD",
    "CFB",
    "HT",
    "WT",
    "40dsh",
  ],
  receiving: [
    "RK",
    "PLAYER",
    "POS",
    "TM",
    "AGE",
    "GRD",
    "TIER",
    "OVR-RK",
    "RD & PK#",
    "OVR_PK",
    "Gs",
    "tYDS",
    "tTD",
    "OPP",
    "IMP/OPP",
    "TGT",
    "REC",
    "recYDS",
    "recTD",
    "rec1D",
    "RR",
    "YAC",
    "AY",
    "YPR",
    "YPRR",
    "1DRR",
    "IMP/RR",
    "TGT%",
    "tgtQBR",
    "CTST%",
    "DROP%",
    "CFB",
    "HT",
    "WT",
    "40dsh",
  ],
};

const PAGE_VIEW_COLUMN_SETS = Object.freeze({
  stats: STATS_COLUMN_SETS,
  "adp-values": createCategoryMap(TRADE_VALUES_CATEGORY_KEYS, TRADE_VALUES_COLUMN_SET),
  "rookies-career": ROOKIES_CAREER_COLUMN_SETS,
  "rookies-trade": createCategoryMap(ROOKIES_TRADE_CATEGORY_KEYS, ROOKIES_TRADE_COLUMN_SET),
});

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
  "paATT_EFF": "paATT",
  "KTC 1QB": null,
  "KTC SFLX": null,
  "1QB ADP": null,
  "SFLX ADP": null,
  "1QB DIFF": null,
  "SFLX DIFF": null,
  VALUE: null,
  ADP: null,
  "POS·ADP": null,
  PPG: null,
};

// ---------------------------------------------------------------------------
// Local Lucide SVG fragments.
// These are kept inline so DataHub can use the requested icon set without
// adding a runtime icon dependency or changing the page-local rendering model.
// ---------------------------------------------------------------------------
const DATAHUB_LUCIDE_ICON_MARKUP = Object.freeze({
  CircleUser: '<circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />',
  Sparkles: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" />',
  CircleFadingPlus: '<path d="M12 2a10 10 0 0 1 7.38 16.75" /><path d="M12 8v8" /><path d="M16 12H8" /><path d="M2.5 8.875a10 10 0 0 0-.5 3" /><path d="M2.83 16a10 10 0 0 0 2.43 3.4" /><path d="M4.636 5.235a10 10 0 0 1 .891-.857" /><path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />',
  BadgePercent: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m15 9-6 6" /><path d="M9 9h.01" /><path d="M15 15h.01" />',
  BadgeDollarSign: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />',
  CircleDollarSign: '<circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />',
  RulerDimensionLine: '<path d="M10 15v-3" /><path d="M14 15v-3" /><path d="M18 15v-3" /><path d="M2 8V4" /><path d="M22 6H2" /><path d="M22 8V4" /><path d="M6 15v-3" /><rect x="2" y="12" width="20" height="8" rx="2" />',
  ChartSpline: '<path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />',
  SignalHigh: '<path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" />',
  RefreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />',
  ArrowUpToLine: '<path d="M5 3h14" /><path d="m18 13-6-6-6 6" /><path d="M12 7v14" />',
  Crosshair: '<circle cx="12" cy="12" r="10" /><line x1="22" x2="18" y1="12" y2="12" /><line x1="6" x2="2" y1="12" y2="12" /><line x1="12" x2="12" y1="6" y2="2" /><line x1="12" x2="12" y1="22" y2="18" />',
  ChartScatter: '<circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="5.5" r=".5" fill="currentColor" /><circle cx="11.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="7.5" cy="16.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="14.5" r=".5" fill="currentColor" /><path d="M3 3v16a2 2 0 0 0 2 2h16" />',
  ChevronsLeftRightEllipsis: '<path d="M12 12h.01" /><path d="M16 12h.01" /><path d="m17 7 5 5-5 5" /><path d="m7 7-5 5 5 5" /><path d="M8 12h.01" />',
  MapPinCheckInside: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><path d="m9 10 2 2 4-4" />',
  ArrowBigDownDash: '<path d="M14 8a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h3.293a.707.707 0 0 1 .5 1.207l-6.939 6.939a1.207 1.207 0 0 1-1.708 0l-6.94-6.94a.707.707 0 0 1 .5-1.206H8a1 1 0 0 0 1-1V9a1 1 0 0 1 1-1z" /><path d="M9 4h6" />',
  Tablets: '<circle cx="7" cy="7" r="5" /><circle cx="17" cy="17" r="5" /><path d="M12 17h10" /><path d="m3.46 10.54 7.08-7.08" />',
  Sparkle: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />',
  RefreshCcwDot: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /><circle cx="12" cy="12" r="1" />',
  Flame: '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />',
  LocateFixed: '<line x1="2" x2="5" y1="12" y2="12" /><line x1="19" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="5" /><line x1="12" x2="12" y1="19" y2="22" /><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" />',
  RedoDot: '<circle cx="12" cy="17" r="1" /><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />',
  ClockFading: '<path d="M12 2a10 10 0 0 1 7.38 16.75" /><path d="M12 6v6l4 2" /><path d="M2.5 8.875a10 10 0 0 0-.5 3" /><path d="M2.83 16a10 10 0 0 0 2.43 3.4" /><path d="M4.636 5.235a10 10 0 0 1 .891-.857" /><path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />',
  SquareActivity: '<rect width="18" height="18" x="3" y="3" rx="2" /><path d="M17 12h-2l-2 5-2-10-2 5H7" />',
  Split: '<path d="M16 3h5v5" /><path d="M8 3H3v5" /><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />',
  BowArrow: '<path d="M17 3h4v4" /><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17" /><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05" /><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z" /><path d="M9.707 14.293 21 3" />',
  CircleDotDashed: '<path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" /><path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" /><path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" /><path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" /><path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" /><path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" /><path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" /><path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" /><circle cx="12" cy="12" r="1" />',
  Tractor: '<path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" /><path d="M16 18h-5" /><path d="M18 5a1 1 0 0 0-1 1v5.573" /><path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" /><path d="M4 11V4" /><path d="M7 15h.01" /><path d="M8 10.1V4" /><circle cx="18" cy="18" r="2" /><circle cx="7" cy="15" r="5" />',
  Route: '<circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />',
  ArrowUp10: '<path d="m3 8 4-4 4 4" /><path d="M7 4v16" /><path d="M17 10V4h-2" /><path d="M15 10h4" /><rect x="15" y="14" width="4" height="6" ry="2" />',
  Bus: '<path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><path d="M9 18h5" /><circle cx="16" cy="18" r="2" />',
  Atom: '<circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" /><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />',
  Fan: '<path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z" /><path d="M12 12v.01" />',
  ChartNoAxesCombined: '<path d="M12 16v5" /><path d="M16 14v7" /><path d="M20 10v11" /><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" /><path d="M4 18v3" /><path d="M8 14v7" />',
  LayersPlus: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 .83.18 2 2 0 0 0 .83-.18l8.58-3.9a1 1 0 0 0 0-1.831z" /><path d="M16 17h6" /><path d="M19 14v6" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 .825.178" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l2.116-.962" />',
  TrendingUp: '<path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" />',
  TrendingUpDown: '<path d="M14.828 14.828 21 21" /><path d="M21 16v5h-5" /><path d="m21 3-9 9-4-4-6 6" /><path d="M21 8V3h-5" />',
  HandHelping: '<path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" /><path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 13 6 6" />',
  CircleCheckBig: '<path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />',
  GitPullRequestDraft: '<circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M18 6V5" /><path d="M18 11v-1" /><line x1="6" x2="6" y1="9" y2="21" />',
  HandCoins: '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" />',
  GitCompareArrows: '<circle cx="5" cy="6" r="3" /><path d="M12 6h5a2 2 0 0 1 2 2v7" /><path d="m15 9-3-3 3-3" /><circle cx="19" cy="18" r="3" /><path d="M12 18H7a2 2 0 0 1-2-2V9" /><path d="m9 15 3 3-3 3" />',
  GitCompare: '<circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M11 18H8a2 2 0 0 1-2-2V9" />',
  GitPullRequestArrow: '<circle cx="5" cy="6" r="3" /><path d="M5 9v12" /><circle cx="19" cy="18" r="3" /><path d="m15 9-3-3 3-3" /><path d="M12 6h5a2 2 0 0 1 2 2v7" />',
  PlaneTakeoff: '<path d="M2 22h20" /><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />',
  Waypoints: '<path d="m10.586 5.414-5.172 5.172" /><path d="m18.586 13.414-5.172 5.172" /><path d="M6 12h12" /><circle cx="12" cy="20" r="2" /><circle cx="12" cy="4" r="2" /><circle cx="20" cy="12" r="2" /><circle cx="4" cy="12" r="2" />',
  ListStart: '<path d="M3 5h6" /><path d="M3 12h13" /><path d="M3 19h13" /><path d="m16 8-3-3 3-3" /><path d="M21 19V7a2 2 0 0 0-2-2h-6" />',
  TramFront: '<rect width="16" height="16" x="4" y="3" rx="2" /><path d="M4 11h16" /><path d="M12 3v8" /><path d="m8 19-2 3" /><path d="m18 22-2-3" /><path d="M8 15h.01" /><path d="M16 15h.01" />',
  Rocket: '<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" />',
  Joystick: '<path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z" /><path d="M6 15v-2" /><path d="M12 15V9" /><circle cx="12" cy="6" r="3" />',
  Bomb: '<circle cx="11" cy="13" r="9" /><path d="M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95" /><path d="m22 2-1.5 1.5" />',
  MoveDiagonal: '<path d="M11 19H5v-6" /><path d="M13 5h6v6" /><path d="M19 5 5 19" />',
  Diff: '<path d="M12 3v14" /><path d="M5 10h14" /><path d="M5 21h14" />',
  Bolt: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><circle cx="12" cy="12" r="4" />',
  Zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />',
  DraftTicket: '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5z" /><path d="M8 8v8" /><path d="M12 10h5" /><path d="M12 14h4" />',
  DraftMedal: '<path d="M8 2h8l-2 6h-4z" /><path d="M10 8 7 13" /><path d="m14 8 3 5" /><circle cx="12" cy="16" r="5" /><path d="M12 13v6" /><path d="M9.5 16h5" />',
});

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
  Gs:        "M22 12h-4l-3 9L9 3l-3 9H2", // Activity/Games started
  CFB:       DATAHUB_LUCIDE_ICON_MARKUP.BowArrow,
  HT:        "M21 6H3M21 18H3M8 6v12M16 6v12", // Ruler
  WT:        "M7 6h10l2 4-2 8H7L5 10l2-4zM9.5 13h5", // Weight/scale
  "40dsh":   DATAHUB_LUCIDE_ICON_MARKUP.ClockFading,
  GRD:       DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
  TIER:      DATAHUB_LUCIDE_ICON_MARKUP.LayersPlus,
  "OVR-RK":  DATAHUB_LUCIDE_ICON_MARKUP.ArrowUpToLine,
  "RD & PK#": DATAHUB_LUCIDE_ICON_MARKUP.DraftTicket,
  OVR_PK:    DATAHUB_LUCIDE_ICON_MARKUP.DraftMedal,
  "POS-RK":  DATAHUB_LUCIDE_ICON_MARKUP.ListStart,
  FPTS:      DATAHUB_LUCIDE_ICON_MARKUP.CircleFadingPlus,
  PPG:       DATAHUB_LUCIDE_ICON_MARKUP.Bolt,
  tYDS:      DATAHUB_LUCIDE_ICON_MARKUP.RulerDimensionLine,
  tTD:       "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3", // CheckCircle
  "KTC 1QB": "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", // DollarSign
  "KTC SFLX": "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", // DollarSign
  "1QB ADP": DATAHUB_LUCIDE_ICON_MARKUP.TrendingUpDown,
  "SFLX ADP": DATAHUB_LUCIDE_ICON_MARKUP.TrendingUpDown,
  "1QB DIFF": DATAHUB_LUCIDE_ICON_MARKUP.Diff,
  "SFLX DIFF": DATAHUB_LUCIDE_ICON_MARKUP.Diff,
  VALUE:     "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", // DollarSign
  ADP:       "M18 20V10M12 20V4M6 20v-6", // BarChart2
  "POS·ADP": "M3 6h18M7 12h10M11 18h2", // ListFilter (3 lines decreasing)
  SNP:       "M22 12h-4l-3 9L9 3l-3 9H2", // Activity
  "SNP%":    DATAHUB_LUCIDE_ICON_MARKUP.BadgePercent,
  "YDS(t)":  DATAHUB_LUCIDE_ICON_MARKUP.RulerDimensionLine,
  "YPG(t)":  DATAHUB_LUCIDE_ICON_MARKUP.ChartSpline,
  OPP:       "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", // Shield/Opposition
  IMP:       "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", // Sun/Impact
  "IMP/OPP": DATAHUB_LUCIDE_ICON_MARKUP.SignalHigh,
  "CSTY%":   DATAHUB_LUCIDE_ICON_MARKUP.RefreshCw,
  CL:        DATAHUB_LUCIDE_ICON_MARKUP.ArrowUpToLine,
  paYDS:     DATAHUB_LUCIDE_ICON_MARKUP.ChevronsLeftRightEllipsis,
  paTD:      "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3", // CheckCircle
  "CMP%":    DATAHUB_LUCIDE_ICON_MARKUP.RefreshCcwDot,
  paATT:     DATAHUB_LUCIDE_ICON_MARKUP.ChartScatter,
  "paATT_EFF": DATAHUB_LUCIDE_ICON_MARKUP.ChartScatter,
  paRTG:     DATAHUB_LUCIDE_ICON_MARKUP.Flame,
  "EPA/DB":  DATAHUB_LUCIDE_ICON_MARKUP.LocateFixed,
  CPOE:      DATAHUB_LUCIDE_ICON_MARKUP.RedoDot,
  CMP:       "M20 6 9 17l-5-5", // Check
  YPA:       DATAHUB_LUCIDE_ICON_MARKUP.ChartSpline,
  paYPG:     DATAHUB_LUCIDE_ICON_MARKUP.BowArrow,
  ruYDS:     DATAHUB_LUCIDE_ICON_MARKUP.Route,
  ruTD:      DATAHUB_LUCIDE_ICON_MARKUP.ArrowUp10,
  pa1D:      DATAHUB_LUCIDE_ICON_MARKUP.MapPinCheckInside,
  "IMP/G":   DATAHUB_LUCIDE_ICON_MARKUP.Fan,
  pIMP:      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 12l3 3 5-5", // Target+check
  "pIMP/A":  DATAHUB_LUCIDE_ICON_MARKUP.CircleDotDashed,
  "pIMP/ATT": DATAHUB_LUCIDE_ICON_MARKUP.CircleDotDashed,
  CAR:       DATAHUB_LUCIDE_ICON_MARKUP.Bus,
  YPC:       DATAHUB_LUCIDE_ICON_MARKUP.Atom,
  TTT:       DATAHUB_LUCIDE_ICON_MARKUP.ClockFading,
  "PRS%":    DATAHUB_LUCIDE_ICON_MARKUP.SquareActivity,
  "DP%":     DATAHUB_LUCIDE_ICON_MARKUP.Split,
  SAC:       DATAHUB_LUCIDE_ICON_MARKUP.ArrowBigDownDash,
  INT:       DATAHUB_LUCIDE_ICON_MARKUP.Tablets,
  FUM:       "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", // AlertCircle
  FPOE:      DATAHUB_LUCIDE_ICON_MARKUP.LayersPlus,
  REC:       DATAHUB_LUCIDE_ICON_MARKUP.HandHelping,
  recYDS:    DATAHUB_LUCIDE_ICON_MARKUP.Split,
  TGT:       "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", // Target circles
  ELU:       "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2 2 0 1 1 19 12H2", // Wind
  "MTF/A":   DATAHUB_LUCIDE_ICON_MARKUP.Joystick,
  "YCO/A":   DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
  MTF:       DATAHUB_LUCIDE_ICON_MARKUP.Zap,
  YCO:       DATAHUB_LUCIDE_ICON_MARKUP.TramFront,
  "EXPLSV%": DATAHUB_LUCIDE_ICON_MARKUP.Bomb,
  ru1D:      DATAHUB_LUCIDE_ICON_MARKUP.MapPinCheckInside,
  RYOE:      DATAHUB_LUCIDE_ICON_MARKUP.Rocket,
  recTD:     DATAHUB_LUCIDE_ICON_MARKUP.CircleCheckBig,
  rec1D:     DATAHUB_LUCIDE_ICON_MARKUP.MapPinCheckInside,
  YAC:       DATAHUB_LUCIDE_ICON_MARKUP.Waypoints,
  "TS%":     DATAHUB_LUCIDE_ICON_MARKUP.HandCoins,
  YPRR:      DATAHUB_LUCIDE_ICON_MARKUP.GitCompareArrows,
  TPRR:      DATAHUB_LUCIDE_ICON_MARKUP.GitCompare,
  "1DRR":    DATAHUB_LUCIDE_ICON_MARKUP.GitPullRequestArrow,
  recYPG:    DATAHUB_LUCIDE_ICON_MARKUP.ChartSpline,
  "AY%":     DATAHUB_LUCIDE_ICON_MARKUP.PlaneTakeoff,
  AY:        DATAHUB_LUCIDE_ICON_MARKUP.PlaneTakeoff,
  YPR:       DATAHUB_LUCIDE_ICON_MARKUP.ListStart,
  RR:        DATAHUB_LUCIDE_ICON_MARKUP.GitPullRequestDraft,
  "IMP/RR":  DATAHUB_LUCIDE_ICON_MARKUP.CircleDotDashed,
  "TGT%":    DATAHUB_LUCIDE_ICON_MARKUP.BadgePercent,
  tgtQBR:    DATAHUB_LUCIDE_ICON_MARKUP.Flame,
  "CTST%":   DATAHUB_LUCIDE_ICON_MARKUP.BadgePercent,
  "DROP%":   DATAHUB_LUCIDE_ICON_MARKUP.BadgePercent,
  "RZ Tgt":  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", // Target
  ruYPG:     DATAHUB_LUCIDE_ICON_MARKUP.ChartSpline,
};

const STATS_COLUMN_ICON_OVERRIDES = Object.freeze({
  rushing: Object.freeze({
    // Rushing-category receiving subsection:
    // YAC intentionally uses a different icon here than the receiving table.
    YAC: DATAHUB_LUCIDE_ICON_MARKUP.MoveDiagonal,
  }),
});

// ---------------------------------------------------------------------------
// Column group definitions per view. Each group has a label and lists the
// exact columns it spans (in-order, matching the active page-view column set).
// The frozen pane uses a view-scoped group config so Stats-only header icon
// changes can land without leaking into the Trade Values identity pane.
// The scrollable pane uses the
// per-category groups for either the Stats or Trade Values table mode.
// ---------------------------------------------------------------------------
const CURRENT_FROZEN_GROUP_ICON = "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const CURRENT_INFO_GROUP_ICON = '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>';
const CURRENT_TRADE_FANTASY_GROUP_ICON = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
const CURRENT_OVERVIEW_STATS_GROUP_ICON = "M18 20V10M12 20V4M6 20v-6";
const CURRENT_RECEIVING_GROUP_ICON = '<g transform="rotate(-90 12 12)"><path d="M14.828 14.828 21 21"/><path d="M21 16v5h-5"/><path d="m21 3-9 9-4-4-6 6"/><path d="M21 8V3h-5"/></g>';
const CURRENT_ADV_RUSHING_GROUP_ICON = '<path d="m10.586 5.414-5.172 5.172"/><path d="m18.586 13.414-5.172 5.172"/><path d="M6 12h12"/><circle cx="12" cy="20" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="4" cy="12" r="2"/>';
const CURRENT_CEILING_GROUP_ICON = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
const TRADE_VALUES_ONE_QB_GROUP_ICON = DATAHUB_LUCIDE_ICON_MARKUP.BadgeDollarSign;
const TRADE_VALUES_SFLX_GROUP_ICON = DATAHUB_LUCIDE_ICON_MARKUP.CircleDollarSign;

// Stats group-header vs column-header icon colors:
// keep these as separate constant maps even when they currently use the same
// hex values so future icon-color tweaks can target group headers without
// having to touch the column-header icon color assignments.
const SHARED_GROUP_HEADER_ICON_COLORS = Object.freeze({
  GENERAL: "#6cb0fe",
  INFO: "#888bff",
  FANTASY: "#dfc689",
  OVERVIEW_STATS: "#8454ff",
});

const SHARED_COLUMN_ICON_COLORS = Object.freeze({
  GENERAL: "#7ebafd",
  INFO: "#828be2",
  FANTASY: "#ac9a70",
  OVERVIEW_STATS: "#6E35FF",
});

const PASSING_GROUP_HEADER_ICON_COLORS = Object.freeze({
  PASSING_PRODUCTION: "#fd8787",
  PASSING_EFFICIENCY: "#ff2782",
  RUSHING: "#1cffd3",
  GENERAL_PROD_EFF: "#8454ff",
  CEILING: "#ff6752",
});

const PASSING_COLUMN_ICON_COLORS = Object.freeze({
  PASSING_PRODUCTION: "#ffa0a0",
  PASSING_EFFICIENCY: "#ff4593",
  RUSHING: "#5ce0c6",
  GENERAL_PROD_EFF: "#6E35FF",
  CEILING: "#fd6759",
});

const RECEIVING_GROUP_HEADER_ICON_COLORS = Object.freeze({
  RECEIVING_PRODUCTION: "#4289ff",
  RECEIVING_EFFICIENCY: "#0975ff",
  RUSHING: "#1cffd3",
  GENERAL_PROD_EFF: "#8454ff",
  CEILING: "#ff6752",
});

const RECEIVING_COLUMN_ICON_COLORS = Object.freeze({
  RECEIVING_PRODUCTION: "#4a82df",
  RECEIVING_EFFICIENCY: "#207ffc",
  RUSHING: "#5ce0c6",
  GENERAL_PROD_EFF: "#6E35FF",
  CEILING: "#fd6759",
});

const RUSHING_GROUP_HEADER_ICON_COLORS = Object.freeze({
  RUSHING_PRODUCTION: "#1cffd3",
  RUSHING_EFFICIENCY: "#05e1b7",
  RECEIVING: "#4289ff",
  GENERAL_PROD_EFF: "#8454ff",
  CEILING: "#ff6752",
});

const RUSHING_COLUMN_ICON_COLORS = Object.freeze({
  RUSHING_PRODUCTION: "#5ce0c6",
  RUSHING_EFFICIENCY: "#1aba9c",
  RECEIVING: "#4a86e8",
  GENERAL_PROD_EFF: "#6E35FF",
  CEILING: "#fd6759",
});

// Rookie career heat families:
// these names are attached to Rankings & Career Stats column groups so each
// stat area can keep the same percentile tier logic while rendering in its own
// color scale.
const ROOKIE_CAREER_FORMATTING_FAMILIES = Object.freeze({
  GENERAL: "career-info",
  PROSPECT: "career-prospect",
  INFO: "career-info",
  CAREER_TOTALS: "career-total",
  PASSING_PRODUCTION: "career-passing-production",
  PASSING_EFFICIENCY: "career-passing-efficiency",
  RUSHING: "career-rushing",
  RUSHING_PRODUCTION: "career-rushing-production",
  RUSHING_EFFICIENCY: "career-rushing-efficiency",
  RECEIVING: "career-receiving",
  RECEIVING_PRODUCTION: "career-receiving-production",
  RECEIVING_EFFICIENCY: "career-receiving-efficiency",
});

function createDataHubColumnGroup({
  label,
  ariaLabel = label,
  icon,
  columns,
  groupIconColor,
  columnIconColor = groupIconColor,
  columnIconColors = null,
  formatFamily = null,
}) {
  return Object.freeze({
    label,
    ariaLabel,
    icon,
    columns: Object.freeze([...columns]),
    groupIconColor,
    columnIconColor,
    columnIconColors: columnIconColors ? Object.freeze({ ...columnIconColors }) : null,
    formatFamily,
  });
}

const FROZEN_GROUPS = Object.freeze({
  stats: Object.freeze([
    createDataHubColumnGroup({
      label: "GENERAL",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
      columns: ["RK", "PLAYER", "POS"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
    }),
  ]),
  "adp-values": Object.freeze([
    createDataHubColumnGroup({
      label: "GENERAL",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
      columns: ["RK", "PLAYER", "POS"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
    }),
  ]),
  "rookies-trade": Object.freeze([
    createDataHubColumnGroup({
      label: "GENERAL",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
      columns: ["RK", "PLAYER", "POS"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
    }),
  ]),
  "rookies-career": Object.freeze({
    overview: Object.freeze([
      createDataHubColumnGroup({
        label: "GENERAL",
        icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
        columns: ["RK", "PLAYER", "POS"],
        groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
        columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
      }),
    ]),
    passing: Object.freeze([
      createDataHubColumnGroup({
        label: "GENERAL",
        icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
        columns: ["RK", "PLAYER", "POS"],
        groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
        columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
      }),
    ]),
    rushing: Object.freeze([
      createDataHubColumnGroup({
        label: "GENERAL",
        icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
        columns: ["RK", "PLAYER", "POS"],
        groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
        columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
      }),
    ]),
    receiving: Object.freeze([
      createDataHubColumnGroup({
        label: "GENERAL",
        icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
        columns: ["RK", "PLAYER", "POS"],
        groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
        columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
      }),
    ]),
  }),
});

const BASE_COLUMN_GROUPS = Object.freeze({
  overview: Object.freeze([
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["TM", "AGE"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
    }),
    createDataHubColumnGroup({
      label: "FANTASY",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["FPTS", "PPG"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
    }),
    createDataHubColumnGroup({
      label: "OVERVIEW STATS",
      icon: CURRENT_OVERVIEW_STATS_GROUP_ICON,
      columns: ["G", "SNP%", "YDS(t)", "YPG(t)", "OPP", "IMP", "IMP/OPP", "CSTY%", "CL"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.OVERVIEW_STATS,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.OVERVIEW_STATS,
    }),
  ]),
  passing: Object.freeze([
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["TM", "AGE", "G"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
    }),
    createDataHubColumnGroup({
      label: "FANTASY",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["FPTS", "PPG"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
    }),
    createDataHubColumnGroup({
      label: "PASSING PRODUCTION",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Crosshair,
      columns: ["paATT", "CMP", "paYDS", "paTD", "pa1D", "SAC", "INT"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.PASSING_PRODUCTION,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.PASSING_PRODUCTION,
    }),
    createDataHubColumnGroup({
      label: "PASSING EFFICIENCY",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkle,
      columns: ["CMP%", "paRTG", "EPA/DB", "CPOE", "TTT", "PRS%", "DP%", "paYPG", "pIMP/A"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.PASSING_EFFICIENCY,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.PASSING_EFFICIENCY,
    }),
    createDataHubColumnGroup({
      label: "RUSHING",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Tractor,
      columns: ["ruYDS", "ruTD", "CAR", "YPC"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.RUSHING,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.RUSHING,
    }),
    createDataHubColumnGroup({
      label: "GENERAL PROD. & EFF.",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.ChartNoAxesCombined,
      columns: ["YDS(t)", "FUM", "IMP/G"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.GENERAL_PROD_EFF,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.GENERAL_PROD_EFF,
    }),
    createDataHubColumnGroup({
      label: "CEILING & CONSISTENCY",
      icon: CURRENT_CEILING_GROUP_ICON,
      columns: ["FPOE", "CSTY%", "CL"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.CEILING,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.CEILING,
    }),
  ]),
  rushing: Object.freeze([
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["TM", "AGE", "G"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
    }),
    createDataHubColumnGroup({
      label: "FANTASY",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["FPTS", "PPG"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
    }),
    createDataHubColumnGroup({
      label: "RUSHING PRODUCTION",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Tractor,
      columns: ["CAR", "ruYDS", "ruTD", "ru1D", "MTF", "YCO", "RYOE"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.RUSHING_PRODUCTION,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.RUSHING_PRODUCTION,
    }),
    createDataHubColumnGroup({
      label: "RUSHING EFFICIENCY",
      icon: CURRENT_ADV_RUSHING_GROUP_ICON,
      columns: ["SNP%", "YPC", "ELU", "MTF/A", "YCO/A", "EXPLSV%", "ruYPG"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.RUSHING_EFFICIENCY,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.RUSHING_EFFICIENCY,
    }),
    createDataHubColumnGroup({
      label: "RECEIVING",
      icon: CURRENT_RECEIVING_GROUP_ICON,
      columns: ["REC", "recYDS", "recTD", "YPRR", "TS%", "TGT", "YAC", "rec1D"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.RECEIVING,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.RECEIVING,
    }),
    createDataHubColumnGroup({
      label: "GENERAL PROD. & EFF.",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.ChartNoAxesCombined,
      columns: ["YDS(t)", "FUM", "IMP/G"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.GENERAL_PROD_EFF,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.GENERAL_PROD_EFF,
    }),
    createDataHubColumnGroup({
      label: "CEILING & CONSISTENCY",
      icon: CURRENT_CEILING_GROUP_ICON,
      columns: ["FPOE", "CSTY%", "CL"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.CEILING,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.CEILING,
    }),
  ]),
  receiving: Object.freeze([
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["TM", "AGE", "G"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
    }),
    createDataHubColumnGroup({
      label: "FANTASY",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["FPTS", "PPG"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
    }),
    createDataHubColumnGroup({
      label: "RECEIVING PRODUCTION",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.TrendingUp,
      columns: ["TGT", "REC", "recYDS", "recTD", "rec1D", "RR", "RZ Tgt"],
      groupIconColor: RECEIVING_GROUP_HEADER_ICON_COLORS.RECEIVING_PRODUCTION,
      columnIconColor: RECEIVING_COLUMN_ICON_COLORS.RECEIVING_PRODUCTION,
    }),
    createDataHubColumnGroup({
      label: "RECEIVING EFFICIENCY",
      icon: CURRENT_RECEIVING_GROUP_ICON,
      columns: ["TS%", "YPRR", "TPRR", "1DRR", "recYPG", "AY%", "YAC", "YPR"],
      groupIconColor: RECEIVING_GROUP_HEADER_ICON_COLORS.RECEIVING_EFFICIENCY,
      columnIconColor: RECEIVING_COLUMN_ICON_COLORS.RECEIVING_EFFICIENCY,
    }),
    createDataHubColumnGroup({
      label: "RUSHING",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Tractor,
      columns: ["CAR", "ruYDS", "ruTD", "YPC"],
      groupIconColor: RECEIVING_GROUP_HEADER_ICON_COLORS.RUSHING,
      columnIconColor: RECEIVING_COLUMN_ICON_COLORS.RUSHING,
    }),
    createDataHubColumnGroup({
      label: "GENERAL PROD. & EFF.",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.ChartNoAxesCombined,
      columns: ["SNP%", "IMP/G", "YDS(t)", "FUM"],
      groupIconColor: RECEIVING_GROUP_HEADER_ICON_COLORS.GENERAL_PROD_EFF,
      columnIconColor: RECEIVING_COLUMN_ICON_COLORS.GENERAL_PROD_EFF,
    }),
    createDataHubColumnGroup({
      label: "CEILING & CONSISTENCY",
      icon: CURRENT_CEILING_GROUP_ICON,
      columns: ["FPOE", "CSTY%", "CL"],
      groupIconColor: RECEIVING_GROUP_HEADER_ICON_COLORS.CEILING,
      columnIconColor: RECEIVING_COLUMN_ICON_COLORS.CEILING,
    }),
  ]),
});
// Rookie career scrollable General continuation:
// TM and AGE follow the frozen RK/PLAYER/POS identity columns without becoming
// sticky, while keeping the same General heading icon and column icon colors.
const ROOKIE_CAREER_SCROLL_GENERAL_GROUP = createDataHubColumnGroup({
  // Icon-only General continuation:
  // show the General icon for scrollable TM/AGE, but omit visible group text so
  // it reads as an extension of the frozen General group instead of a repeat.
  label: "",
  ariaLabel: "GENERAL",
  icon: DATAHUB_LUCIDE_ICON_MARKUP.CircleUser,
  columns: ["TM", "AGE"],
  groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.GENERAL,
  columnIconColor: SHARED_COLUMN_ICON_COLORS.GENERAL,
  formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.GENERAL,
});
const ROOKIES_CAREER_SCROLL_GROUPS = Object.freeze({
  overview: Object.freeze([
    ROOKIE_CAREER_SCROLL_GENERAL_GROUP,
    createDataHubColumnGroup({
      label: "PROSPECT OVERVIEW",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["TIER", "GRD", "POS-RK", "RD & PK#", "OVR_PK"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.PROSPECT,
    }),
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["CFB", "HT", "WT", "40dsh", "Gs"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.INFO,
    }),
    createDataHubColumnGroup({
      label: "CAREER TOTALS",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.ChartNoAxesCombined,
      columns: ["tYDS", "tTD", "OPP", "IMP/OPP"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.OVERVIEW_STATS,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.OVERVIEW_STATS,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.CAREER_TOTALS,
    }),
  ]),
  passing: Object.freeze([
    ROOKIE_CAREER_SCROLL_GENERAL_GROUP,
    createDataHubColumnGroup({
      label: "PROSPECT OVERVIEW",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["GRD", "TIER", "OVR-RK", "RD & PK#", "OVR_PK"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.PROSPECT,
    }),
    createDataHubColumnGroup({
      label: "CAREER TOTALS (PA+RU)",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.ChartNoAxesCombined,
      columns: ["Gs", "tYDS", "tTD", "OPP", "IMP/OPP"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.OVERVIEW_STATS,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.OVERVIEW_STATS,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.CAREER_TOTALS,
    }),
    createDataHubColumnGroup({
      label: "PASSING PRODUCTION",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Crosshair,
      columns: ["paATT", "CMP", "paYDS", "paTD", "pa1D", "pIMP", "INT", "SAC"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.PASSING_PRODUCTION,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.PASSING_PRODUCTION,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.PASSING_PRODUCTION,
    }),
    createDataHubColumnGroup({
      label: "PASSING EFFICIENCY",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkle,
      columns: ["paATT_EFF", "CMP%", "YPA", "pIMP/ATT"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.PASSING_EFFICIENCY,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.PASSING_EFFICIENCY,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.PASSING_EFFICIENCY,
    }),
    createDataHubColumnGroup({
      label: "RUSHING",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Tractor,
      columns: ["ruYDS", "ruTD", "CAR", "YPC"],
      groupIconColor: PASSING_GROUP_HEADER_ICON_COLORS.RUSHING,
      columnIconColor: PASSING_COLUMN_ICON_COLORS.RUSHING,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.RUSHING,
    }),
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["CFB", "HT", "WT", "40dsh"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.INFO,
    }),
  ]),
  rushing: Object.freeze([
    ROOKIE_CAREER_SCROLL_GENERAL_GROUP,
    createDataHubColumnGroup({
      label: "PROSPECT OVERVIEW",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["GRD", "TIER", "OVR-RK", "RD & PK#", "OVR_PK"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.PROSPECT,
    }),
    createDataHubColumnGroup({
      label: "CAREER TOTALS (RU+REC)",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.ChartNoAxesCombined,
      columns: ["Gs", "tYDS", "tTD", "OPP", "IMP/OPP"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.OVERVIEW_STATS,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.OVERVIEW_STATS,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.CAREER_TOTALS,
    }),
    createDataHubColumnGroup({
      label: "RUSHING PRODUCTION",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Tractor,
      columns: ["CAR", "ruYDS", "ruTD", "ru1D", "MTF", "YCO"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.RUSHING_PRODUCTION,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.RUSHING_PRODUCTION,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.RUSHING_PRODUCTION,
    }),
    createDataHubColumnGroup({
      label: "RUSHING EFFICIENCY",
      icon: CURRENT_ADV_RUSHING_GROUP_ICON,
      columns: ["YPC", "MTF/A", "YCO/A", "EXPLSV%"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.RUSHING_EFFICIENCY,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.RUSHING_EFFICIENCY,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.RUSHING_EFFICIENCY,
    }),
    createDataHubColumnGroup({
      label: "RECEIVING",
      icon: CURRENT_RECEIVING_GROUP_ICON,
      columns: ["TGT", "REC", "recYDS", "recTD"],
      groupIconColor: RUSHING_GROUP_HEADER_ICON_COLORS.RECEIVING,
      columnIconColor: RUSHING_COLUMN_ICON_COLORS.RECEIVING,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.RECEIVING,
    }),
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["CFB", "HT", "WT", "40dsh"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.INFO,
    }),
  ]),
  receiving: Object.freeze([
    ROOKIE_CAREER_SCROLL_GENERAL_GROUP,
    createDataHubColumnGroup({
      label: "PROSPECT OVERVIEW",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["GRD", "TIER", "OVR-RK", "RD & PK#", "OVR_PK"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.PROSPECT,
    }),
    createDataHubColumnGroup({
      label: "CAREER TOTALS (REC+RU)",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.ChartNoAxesCombined,
      columns: ["Gs", "tYDS", "tTD", "OPP", "IMP/OPP"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.OVERVIEW_STATS,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.OVERVIEW_STATS,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.CAREER_TOTALS,
    }),
    createDataHubColumnGroup({
      label: "RECEIVING PRODUCTION",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.TrendingUp,
      columns: ["TGT", "REC", "recYDS", "recTD", "rec1D", "RR", "YAC", "AY"],
      groupIconColor: RECEIVING_GROUP_HEADER_ICON_COLORS.RECEIVING_PRODUCTION,
      columnIconColor: RECEIVING_COLUMN_ICON_COLORS.RECEIVING_PRODUCTION,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.RECEIVING_PRODUCTION,
    }),
    createDataHubColumnGroup({
      label: "RECEIVING EFFICIENCY",
      icon: CURRENT_RECEIVING_GROUP_ICON,
      columns: ["YPR", "YPRR", "1DRR", "IMP/RR", "TGT%", "tgtQBR", "CTST%", "DROP%"],
      groupIconColor: RECEIVING_GROUP_HEADER_ICON_COLORS.RECEIVING_EFFICIENCY,
      columnIconColor: RECEIVING_COLUMN_ICON_COLORS.RECEIVING_EFFICIENCY,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.RECEIVING_EFFICIENCY,
    }),
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["CFB", "HT", "WT", "40dsh"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
      formatFamily: ROOKIE_CAREER_FORMATTING_FAMILIES.INFO,
    }),
  ]),
});

const PAGE_VIEW_COLUMN_GROUPS = Object.freeze({
  stats: BASE_COLUMN_GROUPS,
  "adp-values": createCategoryMap(TRADE_VALUES_CATEGORY_KEYS, [
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["TM", "AGE"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
    }),
    createDataHubColumnGroup({
      label: "FANTASY",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["FPTS", "PPG"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
    }),
    createDataHubColumnGroup({
      label: "1QB",
      // Trade Values market groups:
      // keep 1QB and SFLX on separate group-header icons so each market lane
      // can evolve independently without changing the column-header icons.
      icon: TRADE_VALUES_ONE_QB_GROUP_ICON,
      columns: ONE_QB_MARKET_DATA_COLUMNS,
      groupIconColor: "#74efff",
      columnIconColor: "#74efff",
    }),
    createDataHubColumnGroup({
      label: "SFLX",
      icon: TRADE_VALUES_SFLX_GROUP_ICON,
      columns: SFLX_MARKET_DATA_COLUMNS,
      groupIconColor: "#d97dff",
      columnIconColor: "#d97dff",
    }),
  ]),
  "rookies-career": ROOKIES_CAREER_SCROLL_GROUPS,
  "rookies-trade": createCategoryMap(ROOKIES_TRADE_CATEGORY_KEYS, [
    createDataHubColumnGroup({
      label: "INFO",
      icon: CURRENT_INFO_GROUP_ICON,
      columns: ["TM", "AGE"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.INFO,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.INFO,
    }),
    createDataHubColumnGroup({
      label: "PROSPECT OVERVIEW",
      icon: DATAHUB_LUCIDE_ICON_MARKUP.Sparkles,
      columns: ["GRD", "TIER", "OVR-RK", "RD & PK#", "OVR_PK"],
      groupIconColor: SHARED_GROUP_HEADER_ICON_COLORS.FANTASY,
      columnIconColor: SHARED_COLUMN_ICON_COLORS.FANTASY,
    }),
    createDataHubColumnGroup({
      label: "1QB",
      icon: TRADE_VALUES_ONE_QB_GROUP_ICON,
      columns: ONE_QB_MARKET_DATA_COLUMNS,
      groupIconColor: "#74efff",
      columnIconColor: "#74efff",
    }),
    createDataHubColumnGroup({
      label: "SFLX",
      icon: TRADE_VALUES_SFLX_GROUP_ICON,
      columns: SFLX_MARKET_DATA_COLUMNS,
      groupIconColor: "#d97dff",
      columnIconColor: "#d97dff",
    }),
  ]),
});

function createCategoryMap(keys, value) {
  return Object.freeze(
    keys.reduce((map, key) => {
      map[key] = cloneSharedCategoryValue(value);
      return map;
    }, {}),
  );
}

function cloneSharedCategoryValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => (
      typeof entry === "object" && entry !== null
        ? {
          ...entry,
          columns: Array.isArray(entry.columns) ? [...entry.columns] : entry.columns,
          columnIconColors: entry.columnIconColors ? { ...entry.columnIconColors } : entry.columnIconColors,
        }
        : entry
    ));
  }
  return value;
}

function getStatsQualifierConfig(category = VIEW_FILTER_CONFIGS.stats.defaultCategory) {
  return STATS_QUALIFIER_CONFIGS[category] || STATS_QUALIFIER_CONFIGS.overview;
}

function createDefaultStatsQualifierState(category = VIEW_FILTER_CONFIGS.stats.defaultCategory) {
  const config = getStatsQualifierConfig(category);
  return {
    qualifierStat: config.defaultStat,
    qualifierThreshold: String(config.defaultThreshold),
    showAll: Boolean(config.defaultShowAll),
    team: "",
  };
}

function createDefaultTradeEntityFilterState() {
  return {
    vets: true,
    rookies: true,
    picks: true,
  };
}

function isDataHubStatsFamilyView(pageView = state.activePageView) {
  return DATAHUB_STATS_FAMILY_VIEWS.has(pageView);
}

function isDataHubTradeFamilyView(pageView = state.activePageView) {
  return DATAHUB_TRADE_FAMILY_VIEWS.has(pageView);
}

function isDataHubRookiesCareerView(pageView = state.activePageView) {
  return pageView === "rookies-career";
}

function isDataHubRookiesTradeView(pageView = state.activePageView) {
  return pageView === "rookies-trade";
}

function isDataHubRookiesView(pageView = state.activePageView) {
  return isDataHubRookiesCareerView(pageView) || isDataHubRookiesTradeView(pageView);
}

function getActiveRookiesSubview() {
  return state.activeRookiesSubview === "rookies-trade"
    ? "rookies-trade"
    : "rookies-career";
}

function getStickyColumnCount(pageView = state.activePageView, category = state.activeCategory) {
  if (pageView === "rookies-career") {
    // Rookie career sticky identity:
    // TM now scrolls inside Prospect Overview and Gs lives in Career Totals, so
    // all rookie career categories freeze only rank, player, and position.
    return 3;
  }

  return 3;
}

function resetStatsQualifierDefaultsForCategory(category = state.activeCategory) {
  const defaults = createDefaultStatsQualifierState(category);
  state.statsFilters.qualifierStat = defaults.qualifierStat;
  state.statsFilters.qualifierThreshold = defaults.qualifierThreshold;
  state.statsFilters.showAll = defaults.showAll;
}

function getStatsQualifierThresholds(category = state.activeCategory, qualifierStat = state.statsFilters.qualifierStat) {
  const config = getStatsQualifierConfig(category);
  return config.stats?.[qualifierStat] || [];
}

function getDefaultThresholdForStat(category = state.activeCategory, qualifierStat = state.statsFilters.qualifierStat) {
  const thresholds = getStatsQualifierThresholds(category, qualifierStat);
  return thresholds.length ? String(thresholds[0]) : "";
}

function isAllowedStatsQualifierStat(category = state.activeCategory, qualifierStat = state.statsFilters.qualifierStat) {
  const config = getStatsQualifierConfig(category);
  return Object.prototype.hasOwnProperty.call(config.stats, qualifierStat);
}

function formatQualifierThresholdLabel(qualifierStat, threshold) {
  return qualifierStat === "SNP%" ? `${threshold}%` : String(threshold);
}

function getDataHubTeamOptions() {
  const sourceRows = state.statsRowsBase.length ? state.statsRowsBase : state.rows;
  const uniqueTeams = [...new Set(
    sourceRows
      .map((row) => String(row.TM || "").trim())
      .filter((team) => team && team !== "NA"),
  )].sort();

  return [
    { value: "", label: "All Teams" },
    ...uniqueTeams.map((team) => ({ value: team, label: team })),
  ];
}

function getDataHubControlTeamLogoSrc(team) {
  const teamKey = String(team || "FA").trim().toUpperCase() || "FA";
  const normalizedKey = DATAHUB_CONTROL_TEAM_LOGO_KEY_MAP[teamKey] || teamKey.toLowerCase();
  return `../assets/NFL_logos_svg/${normalizedKey}.svg`;
}

function getTradeEntityExperience(...values) {
  for (const value of values) {
    const normalizedValue = String(value ?? "").trim();
    if (!normalizedValue || normalizedValue.toUpperCase() === "NA" || normalizedValue.toUpperCase() === "#N/A") {
      continue;
    }

    const parsedValue = Number(normalizedValue);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

function getTradeEntityBucket(pos, primaryExperience, fallbackExperience) {
  if (String(pos || "").trim().toUpperCase() === "RDP") {
    return "pick";
  }

  const experience = getTradeEntityExperience(primaryExperience, fallbackExperience);
  return experience === 0 ? "rookie" : "vet";
}

// Trade Values entity controls:
// keep the adp-values-only toggle row mirrored across both control mounts so
// vets, rookies, and picks can be filtered independently without touching Stats.
function syncTradeEntityControls(mount) {
  if (!mount.tradeEntityRow) {
    return;
  }

  const isTradeValuesView = state.activePageView === "adp-values";
  mount.tradeEntityRow.hidden = !isTradeValuesView;
  if (!isTradeValuesView) {
    return;
  }

  mount.tradeEntityToggles.forEach((button) => {
    const filterKey = button.dataset.tradeEntityToggle;
    const isActive = Boolean(state.tradeEntityFilters[filterKey]);
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("is-active", isActive);
  });
}

// Rookies subview controls:
// the Rookies top tab owns a dedicated first-row switcher so the page title
// and hero/chart shell stay on one tab while the table swaps between datasets.
function syncRookiesModeControls(mount) {
  if (!mount.rookiesModeRow) {
    return;
  }

  const shouldShow = state.activePageTab === "rookies";
  mount.rookiesModeRow.hidden = !shouldShow;
  if (!shouldShow) {
    return;
  }

  const activeSubview = getActiveRookiesSubview();
  mount.rookiesModeButtons.forEach((button) => {
    const isActive = button.dataset.rookiesSubview === activeSubview;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

// DataHub Stats receiving subfilters:
// mirrors the dedicated Stats page by swapping the Receiving chip into inline
// WR / TE buttons, while always keeping at least one nested filter active.
function resetDataHubReceivingFilters() {
  RECEIVING_SUBFILTER_KEYS.forEach((key) => {
    state.receivingFilters[key] = true;
  });
}

function toggleDataHubReceivingFilter(key) {
  if (!RECEIVING_SUBFILTER_KEYS.includes(key)) {
    return false;
  }

  const isActive = Boolean(state.receivingFilters[key]);
  if (isActive) {
    const activeCount = RECEIVING_SUBFILTER_KEYS.reduce((count, filterKey) => (
      state.receivingFilters[filterKey] ? count + 1 : count
    ), 0);
    if (activeCount <= 1) {
      return false;
    }
  }

  state.receivingFilters[key] = !isActive;
  return true;
}

// ---------------------------------------------------------------------------
// Table formatting and layout invariants.
// ---------------------------------------------------------------------------
// RK is a display-only rank column:
// Most DataHub views treat RK as a rendered-order display column, while the
// rookies-career views reuse it as the imported source rank field.
const RK_COLUMN = "RK";
const NON_FORMATTED_COLUMNS = new Set([
  RK_COLUMN,
  "PLAYER",
  "POS",
  "TM",
  "AGE",
  "CFB",
  "HT",
  "WT",
  "G",
  ...BLANK_PLACEHOLDER_COLUMNS,
]);
const NON_SORTABLE_COLUMNS = new Set([RK_COLUMN, ...BLANK_PLACEHOLDER_COLUMNS]);
const INVERTED_COLUMNS = new Set([
  RK_COLUMN,
  "ADP",
  "POS·ADP",
  "1QB ADP",
  "SFLX ADP",
  "1QB DIFF",
  "SFLX DIFF",
  "OVR-RK",
  "RD & PK#",
  "OVR_PK",
  "POS-RK",
  "TIER",
  "40dsh",
  "DROP%",
  "INT",
  "FUM",
  "PRS%",
  "CSTY%",
]);
const NEUTRAL_COLUMNS = new Set(["TTT", "CL"]);
const PPG_COLUMNS = new Set(["PPG"]);
const ROOKIE_DRAFT_COLUMNS = new Set(["RD & PK#", "OVR_PK"]);
const KTC_COLUMNS = new Set(["KTC 1QB", "KTC SFLX"]);
const ADP_COLUMNS = new Set(["1QB ADP", "SFLX ADP", "ADP", "POS·ADP"]);
const DIFF_COLUMNS = new Set(["1QB DIFF", "SFLX DIFF"]);
const PLAYER_COLUMN = "PLAYER";
const FPTS_COLUMN = "FPTS";
const FORMATTING_TOP_RANGE_LIMIT = 160;
const ALL_COLUMNS = [...new Set([
  ...Object.values(STATS_COLUMN_SETS).flat(),
  ...Object.values(ROOKIES_CAREER_COLUMN_SETS).flat(),
  ...ROOKIES_TRADE_COLUMN_SET,
  ...MARKET_DATA_COLUMNS,
  "VALUE",
  "ADP",
  "POS·ADP",
  // Hidden Stats qualifier fields:
  // keep these source columns on the normalized row object even when they are
  // not visible in the table so the new minimum qualifier controls can filter
  // against the original season CSV values.
  "GM_P",
  "DB",
])];
const COMPACT_SCROLL_COLUMN_SCALE = 1.3;
const DEFAULT_COLUMN_WIDTH = 94;
const DEFAULT_COMPACT_COLUMN_WIDTH = 58;
// DataHub table-view defaults:
// each real content view owns its own baseline sort so switching between the
// Stats grid and the Trade Values & ADP grid immediately lands on the intended
// primary metric for that specific table.
const DEFAULT_SORT_BY_VIEW = Object.freeze({
  stats: Object.freeze({
    column: "FPTS",
    direction: "desc",
  }),
  "adp-values": Object.freeze({
    column: "KTC SFLX",
    direction: "desc",
  }),
  "rookies-career": Object.freeze({
    column: "RK",
    direction: "asc",
  }),
  "rookies-trade": Object.freeze({
    // Rookie trade view default sort:
    // ADP is the requested landing sort for this subview, and because lower
    // ADP is better it should open in ascending order on first render.
    column: "SFLX ADP",
    direction: "asc",
  }),
});
const LOWER_IS_BETTER_SORT_COLUMNS = new Set([
  RK_COLUMN,
  "AGE",
  "OVR-RK",
  "RD & PK#",
  "OVR_PK",
  "POS-RK",
  "TIER",
  "40dsh",
  "ADP",
  "POS·ADP",
  "1QB ADP",
  "SFLX ADP",
  "1QB DIFF",
  "SFLX DIFF",
  "DROP%",
  "TTT",
  "PRS%",
  "SAC",
  "INT",
  "FUM",
]);
const TEXT_SORT_COLUMNS = new Set(["PLAYER", "POS", "TM", "CFB", "HT", "WT"]);
const COLUMN_LABELS = Object.freeze({});
const GRID_TEXT_COLLATOR = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});
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
  passing: (row, appState) => CATEGORY_FILTERS.qb(row, appState),
  rushing: (row, appState) => CATEGORY_FILTERS.rb(row, appState),
  receiving: (row, appState) =>
    (row.POS === "WR" && appState.receivingFilters.WR) ||
    (row.POS === "TE" && appState.receivingFilters.TE),
  all: (row) => Boolean(row.POS && row.POS !== "NA"),
  qb: (row) => row.POS === "QB",
  rb: (row) => row.POS === "RB",
  wr: (row) => row.POS === "WR",
  te: (row) => row.POS === "TE",
  flx: (row) => row.POS === "RB" || row.POS === "WR" || row.POS === "TE",
};
const RECEIVING_SUBFILTER_KEYS = Object.freeze(["WR", "TE"]);
const TRADE_ENTITY_FILTER_KEYS = Object.freeze(["vets", "rookies", "picks"]);

const MOBILE_BREAKPOINT = 719;

const COLUMN_WIDTHS = {
  RK: 78,
  PLAYER: 172,
  POS: 86,
  TM: 82,
  AGE: 78,
  CFB: 120,
  HT: 88,
  WT: 96,
  "40dsh": 86,
  Gs: 72,
  // Rookies prospect columns:
  // these fields appear in the rookies grids only, and get a little extra
  // width so grade/rank values do not feel cramped on either career or trade.
  GRD: 98,
  TIER: 90,
  "OVR-RK": 104,
  "RD & PK#": 112,
  OVR_PK: 96,
  "POS-RK": 100,
  FPTS: 110,
  PPG: 92,
  tYDS: 98,
  tTD: 84,
  "KTC 1QB": 96,
  "KTC SFLX": 96,
  "1QB ADP": 96,
  "SFLX ADP": 100,
  "1QB DIFF": 96,
  "SFLX DIFF": 96,
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
  "paATT_EFF": 96,
  paRTG: 98,
  "EPA/DB": 96,
  CPOE: 94,
  CMP: 90,
  YPA: 84,
  paYPG: 96,
  ruYDS: 100,
  ruTD: 88,
  pa1D: 88,
  "IMP/G": 96,
  pIMP: 90,
  "pIMP/A": 96,
  "pIMP/ATT": 98,
  CAR: 88,
  YPC: 88,
  TTT: 88,
  "PRS%": 90,
  "DP%": 90,
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
  TPRR: 88,
  "1DRR": 88,
  recYPG: 96,
  "AY%": 84,
  AY: 84,
  YPR: 84,
  RR: 84,
  "IMP/RR": 96,
  "TGT%": 84,
  tgtQBR: 98,
  "CTST%": 88,
  "DROP%": 88,
  "RZ Tgt": 98,
};

const TRADE_VALUES_COLUMN_WIDTHS = Object.freeze({
  RK: 88,
  PLAYER: 210,
  POS: 96,
  TM: 94,
  AGE: 88,
  FPTS: 126,
  PPG: 108,
  "KTC 1QB": 152,
  "KTC SFLX": 152,
  "1QB ADP": 128,
  "SFLX ADP": 130,
  "1QB DIFF": 118,
  "SFLX DIFF": 120,
});
const ROOKIES_TRADE_COLUMN_WIDTHS = Object.freeze({
  ...TRADE_VALUES_COLUMN_WIDTHS,
  GRD: 104,
  TIER: 96,
  "OVR-RK": 110,
  "RD & PK#": 118,
  OVR_PK: 104,
});

const MOBILE_COLUMN_WIDTHS = {
  RK: 28,
  PLAYER: 75,
  POS: 64,
  TM: 40,
  AGE: 45,
  // Rookie info columns on mobile:
  // tighten these four widths so the rookies career tables fit more cleanly
  // across the small-screen scroll pane without changing desktop sizing.
  CFB: 72,
  HT: 48,
  WT: 50,
  "40dsh": 48,
  Gs: 42,
  GRD: 62,
  TIER: 58,
  "OVR-RK": 70,
  "RD & PK#": 72,
  OVR_PK: 64,
  "POS-RK": 68,
  FPTS: 62,
  PPG: 52,
  tYDS: 62,
  tTD: 52,
  "KTC 1QB": 60,
  "KTC SFLX": 60,
  "1QB ADP": 60,
  "SFLX ADP": 62,
  "1QB DIFF": 60,
  "SFLX DIFF": 60,
  VALUE: 62,
  ADP: 52,
  "POS·ADP": 64,
  G: 40,
  "SNP%": 58,
  "YDS(t)": 59,
  "YPG(t)": 59,
  OPP: 52,
  IMP: 52,
  "IMP/OPP": 65,
  "CSTY%": 60,
  CL: 52,
  paYDS: 64,
  paTD: 56,
  "CMP%": 62,
  paATT: 60,
  "paATT_EFF": 60,
  paRTG: 60,
  "EPA/DB": 62,
  CPOE: 58,
  CMP: 56,
  YPA: 52,
  paYPG: 62,
  ruYDS: 62,
  ruTD: 54,
  pa1D: 54,
  "IMP/G": 62,
  pIMP: 56,
  "pIMP/A": 66,
  "pIMP/ATT": 66,
  CAR: 52,
  YPC: 52,
  TTT: 52,
  "PRS%": 58,
  "DP%": 58,
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
  TPRR: 56,
  "1DRR": 56,
  recYPG: 62,
  "AY%": 54,
  AY: 54,
  YPR: 52,
  RR: 52,
  "IMP/RR": 64,
  "TGT%": 58,
  tgtQBR: 66,
  "CTST%": 60,
  "DROP%": 60,
  "RZ Tgt": 64,
};

const TRADE_VALUES_MOBILE_COLUMN_WIDTHS = Object.freeze({
  // Mobile Trade Values frozen columns:
  // keep the left frozen pane aligned to the same widths as the Stats table
  // so the mobile identity columns feel identical across both real views.
  RK: MOBILE_COLUMN_WIDTHS.RK,
  PLAYER: MOBILE_COLUMN_WIDTHS.PLAYER,
  POS: MOBILE_COLUMN_WIDTHS.POS,
  TM: 40,
  AGE: 45,
  FPTS:58,
  PPG: 52,
  // Mobile Trade Values market groups:
  // tighten only the 1QB / SFLX market columns so the shorter trade-values
  // schema fits more comfortably on mobile without affecting the Stats view.
  "KTC 1QB": 68,
  "KTC SFLX": 72,
  "1QB ADP": 68,
  "SFLX ADP": 70,
  "1QB DIFF": 68,
  "SFLX DIFF": 70,
});
const ROOKIES_TRADE_MOBILE_COLUMN_WIDTHS = Object.freeze({
  ...TRADE_VALUES_MOBILE_COLUMN_WIDTHS,
  GRD: 64,
  TIER: 60,
  "OVR-RK": 72,
  "RD & PK#": 74,
  OVR_PK: 66,
});

// ---------------------------------------------------------------------------
// Runtime state. This app keeps a single in-memory dataset and re-renders the
// two-pane table whenever view state changes.
// ---------------------------------------------------------------------------
const state = {
  // DataHub table mode:
  // tracks which top page tab should actively drive the grid layout. The
  // non-grid tabs can still borrow the active shell styling, while rookies
  // now swaps between two page-local table modes under one top page tab.
  activePageTab: "stats",
  activePageView: "stats",
  // Rookies subview state:
  // keeps the rookies page-tab on its own two-mode switcher so the hero/chart
  // shell stays on "Rookies" while the grid swaps between career and trade data.
  activeRookiesSubview: "rookies-career",
  // Hidden valuation context:
  // the visible 1-QB / SFLX toggle was removed from the DataHub hero, but the
  // local modal and ownership summaries still default to 1-QB KTC data.
  primaryTab: "1-QB",
  activeCategoryByView: {
    stats: VIEW_FILTER_CONFIGS.stats.defaultCategory,
    "adp-values": VIEW_FILTER_CONFIGS["adp-values"].defaultCategory,
    "rookies-career": VIEW_FILTER_CONFIGS["rookies-career"].defaultCategory,
    "rookies-trade": VIEW_FILTER_CONFIGS["rookies-trade"].defaultCategory,
  },
  activeCategory: "overview",
  receivingFilters: {
    WR: true,
    TE: true,
  },
  statsFilters: createDefaultStatsQualifierState(),
  // Trade Values entity toggles:
  // keep the three adp-values row filters in page-local state so desktop and
  // mobile controls stay mirrored while tab switches preserve the session.
  tradeEntityFilters: createDefaultTradeEntityFilterState(),
  searchText: "",
  rawSeasonRows: [],
  statsRowsBase: [],
  tradeRowsBase: [],
  rookieCareerRowsByCategory: {
    overview: [],
    passing: [],
    rushing: [],
    receiving: [],
  },
  rookieTradeRowsBase: [],
  rookieProspectByPlayerId: Object.create(null),
  rookieDataLoaded: false,
  statsRowsByPlayerId: Object.create(null),
  rows: [],
  visibleRows: [],
  searchedRows: [],
  displayedRows: [],
  gridRefs: null,
  gridShellKey: "",
  gridScroll: {
    horizontal: 0,
    vertical: 0,
  },
  supplementalDataLoaded: false,
  // Hero chart widget state:
  // keep the DataHub chart widgets local to this page so the shared desktop
  // panel and mobile modal can swap between Stats and Trade Values safely.
  heroChartWidgets: {
    desktop: null,
    mobile: null,
  },
  isChartModalOpen: false,
  ktcSheetData: {
    "1-QB": createEmptyKtcSheetStore(),
    SFLX: createEmptyKtcSheetStore(),
  },
  ktcLookups: {
    "1-QB": Object.create(null),
    SFLX: Object.create(null),
  },
  adpByPlayerId: Object.create(null),
  sort: createDefaultSort("stats"),
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
const sortMetaPill = document.querySelector("#sort-meta-pill");
const chartToggleButton = document.querySelector("[data-chart-modal-toggle]");
const chartModal = document.querySelector("#datahub-chart-modal");
const chartModalOverlay = chartModal?.querySelector(".datahub-chart-modal__overlay");
const chartModalCloseButton = chartModal?.querySelector("[data-chart-modal-close]");
const chartDesktopPanel = document.querySelector("[data-chart-panel='desktop']");
const chartDesktopRoot = document.querySelector("[data-chart-widget='desktop']");
const chartMobileRoot = document.querySelector("[data-chart-widget='mobile']");
const overlay = document.querySelector("#datahub-page-loading");
const overlayTitle = document.querySelector("#overlay-title");
const overlayDescription = document.querySelector("#overlay-description");
const overlayActions = document.querySelector("#overlay-actions");
const filePickerButton = document.querySelector("#file-picker-button");
const filePickerInput = document.querySelector("#file-picker-input");
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
// DataHub controls live in two mounts:
// desktop and mobile each get their own hero-shell control mount so layout can
// diverge per breakpoint while the underlying DataHub state stays synced.
const controlMounts = Array.from(document.querySelectorAll("[data-control-scope]")).map((root) => ({
  root,
  rookiesModeRow: root.querySelector("[data-rookies-mode-row]"),
  categoryRow: root.querySelector("[data-category-row]"),
  receivingSubfilters: root.querySelector("[data-receiving-subfilters]"),
  tradeEntityRow: root.querySelector("[data-trade-entity-row]"),
  qualifierRow: root.querySelector("[data-qualifier-row]"),
  qualifierStat: root.querySelector("[data-qualifier-stat]"),
  qualifierThreshold: root.querySelector("[data-qualifier-threshold]"),
  qualifierShowAll: root.querySelector("[data-qualifier-show-all]"),
  teamFilterShell: root.querySelector("[data-team-filter-shell]"),
  teamFilterToggle: root.querySelector("[data-team-filter-toggle]"),
  teamFilterValue: root.querySelector("[data-team-filter-value]"),
  teamFilterMenu: root.querySelector("[data-team-filter-menu]"),
  tradeEntityToggles: Array.from(root.querySelectorAll("[data-trade-entity-toggle]")),
  rookiesModeButtons: Array.from(root.querySelectorAll("[data-rookies-subview]")),
  playerSearch: root.querySelector("[data-player-search]"),
}));
const playerSearchInputs = controlMounts
  .map(({ playerSearch }) => playerSearch)
  .filter((input) => input instanceof HTMLInputElement);
let hasWarnedMissingEcharts = false;
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
// Rookie career CSV inputs:
// these local files back the dedicated rookies grid only, and they stay
// separated by category so the requested career tables do not depend on SZN.csv.
const ROOKIE_CSV_URLS_BY_CATEGORY = Object.freeze({
  overview: "../data/CFB-26Class_CrStats/ALL-Cr.csv",
  passing: "../data/CFB-26Class_CrStats/QB-Cr.csv",
  rushing: "../data/CFB-26Class_CrStats/RB-Cr.csv",
  receiving: "../data/CFB-26Class_CrStats/WT-Cr.csv",
});

let supplementalDataPromise = null;
let rookieDataPromise = null;

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
    title: "Crunching Numbers.. Building Data Hub..",
    description:
      "Building out the Data Hub. Loading season stats, rankings, player values, and ADP feeds.",
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
      const nextPageTab = button.dataset.pageTab;
      if (!nextPageTab || nextPageTab === state.activePageTab) {
        return;
      }

      // DataHub top-tab selection:
      // rookies keeps its own hero/chart shell on the top page tab, while the
      // underlying grid view is resolved from the rookies-only switcher state.
      state.activePageTab = nextPageTab;
      syncPageTabButtons();
      updatePageTabsGlint();

      if (nextPageTab === "rookies" && !state.rookieDataLoaded) {
        ensureDataHubRookieData().catch(() => {});
      }

      const nextPageView = resolveDataHubContentView(nextPageTab);
      if (!CONTENT_PAGE_VIEWS.has(nextPageView)) {
        return;
      }

      if (nextPageView === state.activePageView) {
        syncUiState();
        return;
      }

      state.activePageView = nextPageView;
      state.activeCategory = getStoredCategoryForView(nextPageView);
      state.sort = createDefaultSort(nextPageView);
      state.rows = getActiveRowsForView(nextPageView);
      syncUiState();
      refreshGrid();
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

  controlMounts.forEach((mount) => {
    const {
      rookiesModeRow,
      categoryRow,
      receivingSubfilters,
      tradeEntityRow,
      qualifierStat,
      qualifierThreshold,
      qualifierShowAll,
      teamFilterShell,
      teamFilterToggle,
      teamFilterMenu,
      rookiesModeButtons,
      playerSearch,
    } = mount;

    rookiesModeRow?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-rookies-subview]");
      if (!(button instanceof HTMLButtonElement) || state.activePageTab !== "rookies") {
        return;
      }

      const nextSubview = button.dataset.rookiesSubview;
      if (!CONTENT_PAGE_VIEWS.has(nextSubview) || nextSubview === state.activePageView) {
        return;
      }

      state.activeRookiesSubview = nextSubview;
      state.activePageView = nextSubview;
      state.activeCategory = getStoredCategoryForView(nextSubview);
      state.sort = createDefaultSort(nextSubview);
      state.rows = getActiveRowsForView(nextSubview);
      if (nextSubview === "rookies-career" && state.activeCategory === "receiving") {
        resetDataHubReceivingFilters();
      }
      syncUiState();
      refreshGrid();
    });

    categoryRow?.addEventListener("click", (event) => {
      const receivingFilterButton = event.target.closest("[data-receiving-filter]");
      if (receivingFilterButton instanceof HTMLButtonElement) {
        if (!isDataHubStatsFamilyView() || state.activeCategory !== "receiving") {
          return;
        }

        const filterKey = receivingFilterButton.dataset.receivingFilter;
        if (!toggleDataHubReceivingFilter(filterKey)) {
          return;
        }

        syncUiState();
        refreshGrid();
        return;
      }

      const button = event.target.closest("[data-category]");
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const nextCategory = button.dataset.category;
      if (!nextCategory || nextCategory === state.activeCategory) {
        return;
      }

      const previousCategory = state.activeCategory;
      state.activeCategory = nextCategory;
      state.activeCategoryByView[state.activePageView] = nextCategory;
      if (isDataHubStatsFamilyView()) {
        if (nextCategory === "receiving" && previousCategory !== "receiving") {
          resetDataHubReceivingFilters();
        }
        if (state.activePageView === "stats") {
          resetStatsQualifierDefaultsForCategory(nextCategory);
        }
      }
      syncUiState();
      refreshGrid();
    });

    receivingSubfilters?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-receiving-filter]");
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const key = button.dataset.receivingFilter;
      if (!key) {
        return;
      }

      if (!toggleDataHubReceivingFilter(key)) {
        return;
      }
      syncUiState();
      refreshGrid();
    });

    tradeEntityRow?.addEventListener("click", (event) => {
      if (state.activePageView !== "adp-values") {
        return;
      }

      const button = event.target.closest("[data-trade-entity-toggle]");
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const filterKey = button.dataset.tradeEntityToggle;
      if (!TRADE_ENTITY_FILTER_KEYS.includes(filterKey)) {
        return;
      }

      // Trade Values entity toggles:
      // keep the KTC-driven row set intact while letting the control row hide
      // vets, rookies, and picks in any combination within the current view.
      state.tradeEntityFilters[filterKey] = !state.tradeEntityFilters[filterKey];
      syncUiState();
      refreshGrid();
    });

    playerSearch?.addEventListener("input", (event) => {
      state.searchText = event.target.value;
      syncSearchInputs(playerSearch);
      refreshGrid();
    });

    qualifierStat?.addEventListener("change", (event) => {
      if (state.activePageView !== "stats") {
        return;
      }

      const nextStat = event.target.value;
      if (!isAllowedStatsQualifierStat(state.activeCategory, nextStat)) {
        return;
      }

      state.statsFilters.qualifierStat = nextStat;
      state.statsFilters.qualifierThreshold = getDefaultThresholdForStat(state.activeCategory, nextStat);
      syncUiState();
      refreshGrid();
    });

    qualifierThreshold?.addEventListener("change", (event) => {
      if (state.activePageView !== "stats") {
        return;
      }

      state.statsFilters.qualifierThreshold = event.target.value;
      syncUiState();
      refreshGrid();
    });

    qualifierShowAll?.addEventListener("change", (event) => {
      if (state.activePageView !== "stats") {
        return;
      }

      state.statsFilters.showAll = Boolean(event.target.checked);
      syncUiState();
      refreshGrid();
    });

    teamFilterToggle?.addEventListener("click", () => {
      if (state.activePageView !== "stats") {
        return;
      }

      const shouldOpen = teamFilterMenu?.hidden !== false;
      closeAllDataHubTeamMenus();
      if (teamFilterMenu) {
        teamFilterMenu.hidden = !shouldOpen;
      }
      if (teamFilterShell) {
        teamFilterShell.dataset.open = String(shouldOpen);
      }
      teamFilterToggle.setAttribute("aria-expanded", String(shouldOpen));
    });

    teamFilterMenu?.addEventListener("click", (event) => {
      if (state.activePageView !== "stats") {
        return;
      }

      const option = event.target.closest("[data-team-option]");
      if (!(option instanceof HTMLButtonElement)) {
        return;
      }

      state.statsFilters.team = option.dataset.teamOption || "";
      closeAllDataHubTeamMenus();
      syncUiState();
      refreshGrid();
    });
  });

  chartToggleButton?.addEventListener("click", () => {
    if (state.isChartModalOpen) {
      closeDataHubChartModal();
      return;
    }
    openDataHubChartModal();
  });

  chartModal?.addEventListener("click", (event) => {
    if (event.target?.closest?.("[data-chart-modal-close]")) {
      closeDataHubChartModal();
    }
  });
  chartModalOverlay?.addEventListener("click", closeDataHubChartModal);
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.("[data-team-filter-shell]")) {
      return;
    }
    closeAllDataHubTeamMenus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.isChartModalOpen) {
      closeDataHubChartModal();
    }
    if (event.key === "Escape") {
      closeAllDataHubTeamMenus();
    }
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
    await ensureDataHubRookieData();
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
// - KTC_1QB / KTC_SFLX provide the dual-format trade value context
// - ADP_2026 provides the dual-format ADP context
async function ensureDataHubSupplementalData() {
  if (state.supplementalDataLoaded) {
    return;
  }

  if (supplementalDataPromise) {
    return supplementalDataPromise;
  }

  supplementalDataPromise = (async () => {
    const [oneQbSheetData, sflxSheetData, adpLookup] = await Promise.all([
      fetchKtcSheetData(KTC_SHEET_BY_FORMAT["1-QB"]),
      fetchKtcSheetData(KTC_SHEET_BY_FORMAT.SFLX),
      fetchDataHubAdpLookup(),
    ]);

    state.ktcSheetData["1-QB"] = oneQbSheetData;
    state.ktcSheetData.SFLX = sflxSheetData;
    state.ktcLookups["1-QB"] = oneQbSheetData.byPlayerId;
    state.ktcLookups.SFLX = sflxSheetData.byPlayerId;
    state.adpByPlayerId = adpLookup;
    state.supplementalDataLoaded = true;
  })()
    .catch((error) => {
      console.error("Data Hub supplemental data load failed.", error);
      state.ktcSheetData["1-QB"] = createEmptyKtcSheetStore();
      state.ktcSheetData.SFLX = createEmptyKtcSheetStore();
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

function createEmptyKtcSheetStore() {
  return {
    entities: [],
    byPlayerId: Object.create(null),
    byEntityKey: Object.create(null),
  };
}

async function fetchKtcSheetData(sheetName) {
  try {
    const csvText = await fetchGoogleSheetCsv(sheetName);
    return parseKtcSheetData(csvText);
  } catch (error) {
    console.error(`Unable to load Data Hub KTC sheet: ${sheetName}`, error);
    return createEmptyKtcSheetStore();
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
  const ktcSheetData = createEmptyKtcSheetStore();

  rows.forEach((row) => {
    const normalizedRow = buildNormalizedSheetRow(row);
    const entity = buildKtcSheetEntity(normalizedRow);
    if (!entity) {
      return;
    }

    ktcSheetData.entities.push(entity);
    if (entity.playerId) {
      ktcSheetData.byPlayerId[entity.playerId] = entity;
    }
    if (entity.entityKey) {
      ktcSheetData.byEntityKey[entity.entityKey] = entity;
    }
  });

  return ktcSheetData;
}

function buildKtcSheetEntity(normalizedRow) {
  const name = getNormalizedSheetValue(normalizedRow, ["PLAYER NAME", "PLAYER", "NAME"]);
  const pos = getNormalizedSheetValue(normalizedRow, "POS").toUpperCase();
  const playerId = getNormalizedSheetValue(normalizedRow, "SLPR_ID");

  if (!name && !playerId) {
    return null;
  }

  return {
    name,
    pos,
    playerId: !playerId || playerId === "NA" ? "" : playerId,
    team: getNormalizedSheetValue(normalizedRow, "TM").toUpperCase(),
    entityKey: buildKtcEntityKey(name, pos),
    ktc: toIntegerOrNull(getNormalizedSheetValue(normalizedRow, ["VALUE", "KTC"])),
    overallRank: toIntegerOrNull(getNormalizedSheetValue(normalizedRow, ["RANK", "OVR", "OVERALL", "SCA"])),
    posRank: getNormalizedSheetValue(normalizedRow, ["POS RK", "POS_RK", "POS|RK", "POS | RK", "POS·RK"]),
    age: toFloatOrNull(getNormalizedSheetValue(normalizedRow, "AGE")),
    rookieYear: getNormalizedSheetValue(normalizedRow, ["RY", "ROOKIE YEAR"]),
    experience: getTradeEntityExperience(getNormalizedSheetValue(normalizedRow, ["EXP", "YEARS"])),
    tier: getNormalizedSheetValue(normalizedRow, "TIER"),
    trend: getNormalizedSheetValue(normalizedRow, "TREND"),
    sheetAdp: toFloatOrNull(getNormalizedSheetValue(normalizedRow, "ADP")),
  };
}

function buildKtcEntityKey(name, pos) {
  const normalizedName = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const normalizedPos = String(pos || "").trim().toUpperCase();

  if (!normalizedName && !normalizedPos) {
    return "";
  }

  return `${normalizedName}::${normalizedPos}`;
}

function getKtcSheetEntity(sheetData, playerId, entityKey) {
  if (playerId && sheetData?.byPlayerId?.[playerId]) {
    return sheetData.byPlayerId[playerId];
  }

  if (entityKey && sheetData?.byEntityKey?.[entityKey]) {
    return sheetData.byEntityKey[entityKey];
  }

  return null;
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

async function ensureDataHubRookieData() {
  if (state.rookieDataLoaded) {
    return;
  }

  if (rookieDataPromise) {
    return rookieDataPromise;
  }

  rookieDataPromise = (async () => {
    const rookieCsvRowsByCategory = {
      overview: [],
      passing: [],
      rushing: [],
      receiving: [],
    };

    const rookieProspectByPlayerId = Object.create(null);
    await Promise.all(
      Object.entries(ROOKIE_CSV_URLS_BY_CATEGORY).map(async ([category, relativeUrl]) => {
        const csvText = await fetchDataHubText(new URL(relativeUrl, window.location.href));
        const rows = parseCsv(csvText);
        rookieCsvRowsByCategory[category] = rows;
        rows.forEach((row) => {
          mergeRookieProspectLookupEntry(rookieProspectByPlayerId, row, category);
        });
      }),
    );

    state.rookieProspectByPlayerId = rookieProspectByPlayerId;
    state.rookieCareerRowsByCategory = {
      overview: buildRookieCareerRowsForCategory("overview", rookieCsvRowsByCategory.overview),
      passing: buildRookieCareerRowsForCategory("passing", rookieCsvRowsByCategory.passing),
      rushing: buildRookieCareerRowsForCategory("rushing", rookieCsvRowsByCategory.rushing),
      receiving: buildRookieCareerRowsForCategory("receiving", rookieCsvRowsByCategory.receiving),
    };
    state.rookieTradeRowsBase = buildRookieTradeRowsBase(state.tradeRowsBase, rookieProspectByPlayerId);
    state.rookieDataLoaded = true;
    state.rows = getActiveRowsForView();
  })()
    .catch((error) => {
      console.error("Unable to load Data Hub rookie career CSVs.", error);
      state.rookieProspectByPlayerId = Object.create(null);
      state.rookieCareerRowsByCategory = {
        overview: [],
        passing: [],
        rushing: [],
        receiving: [],
      };
      state.rookieTradeRowsBase = [];
      state.rookieDataLoaded = true;
    })
    .finally(() => {
      rookieDataPromise = null;
      if (isDataHubRookiesView()) {
        syncUiState();
        refreshGrid();
      }
    });

  return rookieDataPromise;
}

function buildRookieCareerRowsForCategory(category, rows) {
  let receivingCategoryRank = 0;

  return rows.map((row) => {
    let categoryRankOverride = null;

    // Rankings & Career Stats receiving RK:
    // WT-Cr.csv combines WR and TE players, but its POS-RK field ranks each
    // position separately. Build one W/T display rank from source order while
    // preserving NR rows so their existing bottom-sort handling still applies.
    if (category === "receiving" && !isRookieCareerUnrankedSourceRow(row)) {
      receivingCategoryRank += 1;
      categoryRankOverride = String(receivingCategoryRank);
    }

    return normalizeRow(buildRookieCareerSourceRow(category, row, { categoryRankOverride }));
  });
}

function isRookieCareerUnrankedSourceRow(row) {
  const sourceRank = getFirstUsableRookieValue(row?.["OVR-RK"], row?.["POS-RK"]);
  return isRookieBottomSortValue(sourceRank);
}

function buildRookieCareerSourceRow(category, row, { categoryRankOverride = null } = {}) {
  const playerId = getRookiePlayerId(row);
  const playerLookup = playerId ? state.rookieProspectByPlayerId[playerId] : null;
  const sourceRow = {
    SLPR_ID: playerId,
    PLAYER: getFirstUsableRookieValue(row.PLAYER, playerLookup?.PLAYER),
    POS: getFirstUsableRookieValue(row.POS, playerLookup?.POS),
    // Rookies career TM:
    // prefer the TM field carried directly in the CSV row (overview/ALL-Cr.csv)
    // or via the merged prospect lookup, then fall back to the KTC-based
    // resolver so the column stays populated for any players not yet in the CSVs.
    TM: getFirstUsableRookieValue(row.TM, playerLookup?.TM) || resolveRookieCareerTeam(playerId),
    AGE: getFirstUsableRookieValue(row.AGE, playerLookup?.AGE),
    CFB: getFirstUsableRookieValue(row.CFB, playerLookup?.CFB),
    HT: getFirstUsableRookieValue(row.HT, playerLookup?.HT),
    WT: getFirstUsableRookieValue(row.WT, playerLookup?.WT),
    "40dsh": getFirstUsableRookieValue(row["40dsh"], playerLookup?.["40dsh"]),
    Gs: getFirstUsableRookieValue(row.Gs, playerLookup?.Gs),
    GRD: getFirstUsableRookieValue(row.GRD, playerLookup?.GRD),
    TIER: getFirstUsableRookieValue(row.TIER, playerLookup?.TIER),
    "OVR-RK": getFirstUsableRookieValue(row["OVR-RK"], playerLookup?.["OVR-RK"]),
    "POS-RK": getFirstUsableRookieValue(row["POS-RK"], playerLookup?.["POS-RK"]),
    // Updated CFB draft fields:
    // carry round/pick and overall pick values into every rookies career
    // category so Prospect Overview columns stay populated after category
    // switches.
    "RD & PK#": getFirstUsableRookieValue(row["RD & PK#"], playerLookup?.["RD & PK#"]),
    OVR_PK: getFirstUsableRookieValue(row.OVR_PK, playerLookup?.OVR_PK),
    tYDS: row.tYDS,
    tTD: row.tTD,
    OPP: row.OPP,
    "IMP/OPP": row["IMP/OPP"],
    __hasGameLogsSupport: false,
  };

  if (category === "overview") {
    sourceRow.RK = getFirstUsableRookieValue(row["OVR-RK"], playerLookup?.["OVR-RK"]);
    return sourceRow;
  }

  // Rankings & Career Stats category RK:
  // passing/rushing can keep POS-RK because they are single-position tables;
  // receiving passes a combined W/T rank override because it includes WR + TE.
  sourceRow.RK = categoryRankOverride
    ?? getFirstUsableRookieValue(row["POS-RK"], playerLookup?.["POS-RK"]);

  if (category === "passing") {
    sourceRow.paATT = row.paATT;
    sourceRow.CMP = row.CMP;
    sourceRow.paYDS = row.paYDS;
    sourceRow.paTD = row.paTD;
    sourceRow.pa1D = row.pa1D;
    sourceRow.pIMP = row.pIMP;
    sourceRow.INT = row.INT;
    sourceRow.SAC = row.SAC;
    sourceRow["paATT_EFF"] = row.paATT;
    sourceRow["CMP%"] = row["CMP%"];
    sourceRow.YPA = row.YPA;
    sourceRow["pIMP/ATT"] = row["pIMP/ATT"];
    sourceRow.ruYDS = row.ruYDS;
    sourceRow.ruTD = row.ruTD;
    sourceRow.CAR = row.CAR;
    sourceRow.YPC = row.YPC;
    return sourceRow;
  }

  if (category === "rushing") {
    sourceRow.CAR = row.CAR;
    sourceRow.ruYDS = row.ruYDS;
    sourceRow.ruTD = row.ruTD;
    sourceRow.ru1D = row.ru1D;
    sourceRow.MTF = row.MTF;
    sourceRow.YCO = row.YCO;
    sourceRow.YPC = row.YPC;
    sourceRow["MTF/A"] = row["MTF/A"];
    sourceRow["YCO/A"] = row["YCO/A"];
    sourceRow["EXPLSV%"] = row["EXPLSV%"];
    sourceRow.TGT = row.TGT;
    sourceRow.REC = row.REC;
    sourceRow.recYDS = row.recYDS;
    sourceRow.recTD = row.recTD;
    return sourceRow;
  }

  sourceRow.TGT = row.TGT;
  sourceRow.REC = row.REC;
  sourceRow.recYDS = row.recYDS;
  sourceRow.recTD = row.recTD;
  sourceRow.rec1D = row.rec1D ?? row["1D"];
  sourceRow.RR = row.RR;
  sourceRow.YAC = row.YAC;
  sourceRow.AY = row.AY;
  sourceRow.YPR = row.YPR;
  sourceRow.YPRR = row.YPRR;
  sourceRow["1DRR"] = row["1DRR"];
  sourceRow["IMP/RR"] = row["IMP/RR"];
  sourceRow["TGT%"] = row["TGT%"];
  sourceRow.tgtQBR = row.tgtQBR;
  sourceRow["CTST%"] = row["CTST%"];
  sourceRow["DROP%"] = row["DROP%"];
  return sourceRow;
}

function buildRookieTradeRowsBase(tradeRowsBase, rookieProspectByPlayerId) {
  return tradeRowsBase
    .filter((row) => String(row?.__meta?.tradeEntityBucket || "").trim().toLowerCase() === "rookie")
    .map((row) => {
      const playerId = String(row?.__meta?.playerId || row?.SLPR_ID || "").trim();
      const prospect = rookieProspectByPlayerId?.[playerId] || null;
      return {
        ...row,
        // Rookie Trade Values TM:
        // prefer the ALL-Cr.csv CSV team over the KTC trade row team so the
        // Rookies trade table shows the same team as the career table.
        TM: getFirstUsableRookieValue(prospect?.TM, row.TM),
        // prefer the new ALL-Cr.csv prospect AGE joined by SLPR_ID, falling
        // back to the KTC/SZN trade row age so non-age fields stay unchanged.
        AGE: getFirstUsableRookieValue(prospect?.AGE, row.AGE),
        GRD: sanitizeValue(prospect?.GRD),
        TIER: sanitizeValue(prospect?.TIER),
        "OVR-RK": sanitizeValue(prospect?.["OVR-RK"]),
        // Rookie Trade Values draft fields:
        // populate the Prospect Overview group from the CFB career lookup while
        // leaving KTC market data on the original trade row.
        "RD & PK#": sanitizeValue(prospect?.["RD & PK#"]),
        OVR_PK: sanitizeValue(prospect?.OVR_PK),
      };
    });
}

function mergeRookieProspectLookupEntry(store, row, category = "overview") {
  const playerId = getRookiePlayerId(row);
  if (!playerId) {
    return;
  }

  const previous = store[playerId] || {};
  store[playerId] = {
    SLPR_ID: playerId,
    PLAYER: getFirstUsableRookieValue(previous.PLAYER, row.PLAYER),
    POS: getFirstUsableRookieValue(previous.POS, row.POS),
    // Rookie prospect team lookup:
    // QB-Cr.csv, RB-Cr.csv, and WT-Cr.csv (passing/rushing/receiving) are the
    // authoritative source for TM per position. Their TM always wins over
    // ALL-Cr.csv (overview). Since CSVs load in parallel via Promise.all we
    // handle both orderings:
    //   - position-specific finishes first  → sets TM; overview won't overwrite
    //   - overview finishes first           → sets TM; position-specific overwrites
    TM: category === "overview"
      ? getFirstUsableRookieValue(previous.TM, row.TM)   // don't overwrite if position CSV already wrote
      : getFirstUsableRookieValue(row.TM, previous.TM),  // position CSV always wins
    AGE: getFirstUsableRookieValue(previous.AGE, row.AGE),
    CFB: getFirstUsableRookieValue(previous.CFB, row.CFB),
    HT: getFirstUsableRookieValue(previous.HT, row.HT),
    WT: getFirstUsableRookieValue(previous.WT, row.WT),
    "40dsh": getFirstUsableRookieValue(previous["40dsh"], row["40dsh"]),
    Gs: getFirstUsableRookieValue(previous.Gs, row.Gs),
    GRD: getFirstUsableRookieValue(previous.GRD, row.GRD),
    TIER: getFirstUsableRookieValue(previous.TIER, row.TIER),
    "OVR-RK": getFirstUsableRookieValue(previous["OVR-RK"], row["OVR-RK"]),
    "POS-RK": getFirstUsableRookieValue(previous["POS-RK"], row["POS-RK"]),
    // Rookie prospect draft lookup:
    // keep the new CFB draft columns available to both rookies subviews from
    // the shared SLPR_ID merge path.
    "RD & PK#": getFirstUsableRookieValue(previous["RD & PK#"], row["RD & PK#"]),
    OVR_PK: getFirstUsableRookieValue(previous.OVR_PK, row.OVR_PK),
  };
}

function getRookiePlayerId(row) {
  return String(row?.SLPR_ID || row?.slpr_id || "").trim();
}

function getFirstUsableRookieValue(...values) {
  const usableValue = values.find((value) => !isRookieLookupMissingValue(value));
  return usableValue == null ? "" : usableValue;
}

function isRookieLookupMissingValue(value) {
  const normalizedValue = String(value ?? "").trim().toUpperCase();
  return !normalizedValue || normalizedValue === "NA" || normalizedValue === "#N/A";
}

function resolveRookieCareerTeam(playerId) {
  const sflxTeam = String(state.ktcLookups?.SFLX?.[playerId]?.team || "").trim().toUpperCase();
  if (sflxTeam && sflxTeam !== "NA") {
    return sflxTeam;
  }

  const oneQbTeam = String(state.ktcLookups?.["1-QB"]?.[playerId]?.team || "").trim().toUpperCase();
  if (oneQbTeam && oneQbTeam !== "NA") {
    return oneQbTeam;
  }

  return "UD";
}

// Rebuild the rendered season rows from the cached CSV base so the Data Hub
// table can swap between the Stats and Trade Values views without re-fetching
// SZN.csv, while the hidden 1-QB modal context remains available separately.
function rebuildDataHubRows() {
  if (!state.rawSeasonRows.length) {
    state.statsRowsBase = [];
    state.tradeRowsBase = [];
    state.statsRowsByPlayerId = Object.create(null);
    state.rows = [];
    state.modalRankCache = Object.create(null);
    syncUiState();
    refreshGrid();
    return;
  }

  const oneQbSheetData = state.ktcSheetData["1-QB"] || createEmptyKtcSheetStore();
  const sflxSheetData = state.ktcSheetData.SFLX || createEmptyKtcSheetStore();
  const oneQbLookup = oneQbSheetData.byPlayerId || Object.create(null);
  const sflxLookup = sflxSheetData.byPlayerId || Object.create(null);
  const adpLookup = state.adpByPlayerId || Object.create(null);
  const statsRowsBase = state.rawSeasonRows.map((row) => {
    const enrichedRow = enrichSeasonRow(row, {
      oneQbLookup,
      sflxLookup,
      adpLookup,
    });
    return normalizeRow(enrichedRow);
  });
  const statsRowsByPlayerId = buildStatsRowsByPlayerId(statsRowsBase);
  const tradeRowsBase = buildTradeRowsBase({
    sflxSheetData,
    oneQbSheetData,
    adpLookup,
    statsRowsByPlayerId,
  });

  state.statsRowsBase = statsRowsBase;
  state.tradeRowsBase = tradeRowsBase;
  if (state.rookieDataLoaded) {
    state.rookieTradeRowsBase = buildRookieTradeRowsBase(tradeRowsBase, state.rookieProspectByPlayerId);
  }
  state.statsRowsByPlayerId = statsRowsByPlayerId;
  state.rows = getActiveRowsForView();
  state.modalRankCache = buildDataHubModalRankCache(statsRowsBase);

  syncUiState();
  refreshGrid();
}

function buildStatsRowsByPlayerId(rows) {
  const rowsByPlayerId = Object.create(null);

  rows.forEach((row) => {
    const playerId = String(row?.__meta?.playerId || "").trim();
    if (!playerId) {
      return;
    }

    rowsByPlayerId[playerId] = row;
  });

  return rowsByPlayerId;
}

function getActiveRowsForView(pageView = state.activePageView) {
  if (pageView === "adp-values") {
    // Trade Values row source:
    // keep the full KTC_SFLX-driven row set available here so the view-level
    // entity toggles can hide vets, rookies, and picks later in one place.
    return [...state.tradeRowsBase];
  }

  if (pageView === "rookies-trade") {
    return [...state.rookieTradeRowsBase];
  }

  if (pageView === "rookies-career") {
    return [...(state.rookieCareerRowsByCategory[state.activeCategory] || [])];
  }

  return [...state.statsRowsBase];
}

function buildTradeRowsBase({ sflxSheetData, oneQbSheetData, adpLookup, statsRowsByPlayerId }) {
  return (sflxSheetData.entities || []).map((sflxEntity) => {
    const entityKey = sflxEntity.entityKey || buildKtcEntityKey(sflxEntity.name, sflxEntity.pos);
    const oneQbEntity = getKtcSheetEntity(oneQbSheetData, sflxEntity.playerId, entityKey);
    const statsRow = sflxEntity.playerId ? statsRowsByPlayerId[sflxEntity.playerId] : null;
    const adpEntry = sflxEntity.playerId ? adpLookup?.[sflxEntity.playerId] : null;
    const oneQbAdpValue = Number.isFinite(adpEntry?.pprAdp) ? adpEntry.pprAdp : oneQbEntity?.sheetAdp;
    const sflxAdpValue = Number.isFinite(adpEntry?.sflxAdp) ? adpEntry.sflxAdp : sflxEntity.sheetAdp;
    // Trade Values entity classification:
    // targets the DataHub Trade Values entity filters and the Rookies Trade
    // Values subview. Rookie status comes from KTC EXP === 0 only; TM stays
    // display-only here so drafted rookies are not misclassified as vets.
    const resolvedTeam = resolveTradeEntityTeam(sflxEntity, statsRow);
    const tradeEntityExperience = getTradeEntityExperience(sflxEntity.experience, oneQbEntity?.experience);
    const tradeEntityBucket = getTradeEntityBucket(sflxEntity.pos, sflxEntity.experience, oneQbEntity?.experience);
    const tradeSourceRow = {
      PLAYER: sflxEntity.name,
      "PLAYER NAME": sflxEntity.name,
      SLPR_ID: sflxEntity.playerId,
      RK: formatIntegerString(sflxEntity.overallRank),
      POS: sflxEntity.pos,
      TM: resolvedTeam,
      AGE: formatTradeEntityAge(sflxEntity.age, statsRow?.AGE),
      G: statsRow?.G,
      FPTS: statsRow?.FPTS,
      PPG: statsRow?.PPG,
      VALUE: formatIntegerString(oneQbEntity?.ktc),
      ADP: formatFixedString(oneQbAdpValue, 1),
      "POS·ADP": formatFixedString(adpEntry?.posAdp, 1),
      "POS RK": sflxEntity.posRank,
      RY: sflxEntity.rookieYear,
      EXP: tradeEntityExperience,
      "KTC 1QB": formatIntegerString(oneQbEntity?.ktc),
      "KTC SFLX": formatIntegerString(sflxEntity.ktc),
      "1QB ADP": formatFixedString(oneQbAdpValue, 1),
      "SFLX ADP": formatFixedString(sflxAdpValue, 1),
      "1QB DIFF": formatTradeDiffString(getTradeDiffValue(oneQbEntity?.overallRank, oneQbAdpValue)),
      "SFLX DIFF": formatTradeDiffString(getTradeDiffValue(sflxEntity.overallRank, sflxAdpValue)),
      __oneQbOverallRank: oneQbEntity?.overallRank ?? null,
      __sflxOverallRank: sflxEntity.overallRank ?? null,
      __oneQbDiffWinner: getTradeDiffWinner(oneQbEntity?.overallRank, oneQbAdpValue),
      __sflxDiffWinner: getTradeDiffWinner(sflxEntity.overallRank, sflxAdpValue),
      __hasGameLogsSupport: Boolean(statsRow?.__meta?.playerId),
      __tradeEntityType: sflxEntity.pos === "RDP" ? "pick" : "player",
      __tradeEntityBucket: tradeEntityBucket,
    };

    return normalizeRow(tradeSourceRow);
  });
}

function resolveTradeEntityTeam(entity, statsRow) {
  const sheetTeam = String(entity?.team || "").trim().toUpperCase();
  if (sheetTeam && sheetTeam !== "NA") {
    return sheetTeam;
  }

  const statsTeam = String(statsRow?.TM || "").trim().toUpperCase();
  return statsTeam || "FA";
}

function formatTradeEntityAge(ageValue, fallbackAge) {
  const resolvedAge = Number.isFinite(ageValue)
    ? ageValue
    : toComparableNumber(fallbackAge);
  return formatFixedString(resolvedAge, 1);
}

function enrichSeasonRow(sourceRow, { oneQbLookup, sflxLookup, adpLookup }) {
  const enrichedRow = { ...sourceRow };
  const playerId = String(sourceRow.SLPR_ID || sourceRow.slpr_id || "").trim();
  const oneQbEntry = playerId ? oneQbLookup?.[playerId] : null;
  const sflxEntry = playerId ? sflxLookup?.[playerId] : null;
  const adpEntry = playerId ? adpLookup?.[playerId] : null;
  const fallbackRank = toComparableNumber(sourceRow.RK ?? sourceRow.PRK_PPR);
  const gamesPlayed = getDataHubGamesPlayedValue(sourceRow);
  const fantasyPoints = toComparableNumber(sourceRow.FPTS ?? sourceRow.FPT_PPR);
  const ppg = computePpgValue(fantasyPoints, gamesPlayed);

  // DataHub table enrichment:
  // attach both KTC formats and both ADP formats to every row so the Stats
  // tab can omit market columns entirely while the Trade Values tab can render
  // both league formats side-by-side from the same cached dataset.
  enrichedRow.RK = formatIntegerString(oneQbEntry?.overallRank ?? fallbackRank);
  enrichedRow["KTC 1QB"] = formatIntegerString(oneQbEntry?.ktc);
  enrichedRow["KTC SFLX"] = formatIntegerString(sflxEntry?.ktc);
  enrichedRow["1QB ADP"] = formatFixedString(adpEntry?.pprAdp, 1);
  enrichedRow["SFLX ADP"] = formatFixedString(adpEntry?.sflxAdp, 1);
  const oneQbDiff = getTradeDiffValue(oneQbEntry?.overallRank, adpEntry?.pprAdp);
  const sflxDiff = getTradeDiffValue(sflxEntry?.overallRank, adpEntry?.sflxAdp);
  enrichedRow["1QB DIFF"] = formatTradeDiffString(oneQbDiff);
  enrichedRow["SFLX DIFF"] = formatTradeDiffString(sflxDiff);
  enrichedRow.__oneQbOverallRank = oneQbEntry?.overallRank ?? null;
  enrichedRow.__sflxOverallRank = sflxEntry?.overallRank ?? null;
  enrichedRow.__oneQbDiffWinner = getTradeDiffWinner(oneQbEntry?.overallRank, adpEntry?.pprAdp);
  enrichedRow.__sflxDiffWinner = getTradeDiffWinner(sflxEntry?.overallRank, adpEntry?.sflxAdp);
  // Legacy modal metadata fields:
  // keep the hidden default 1-QB context available for page-local modal and
  // ownership summaries that still read the existing VALUE / ADP fields.
  enrichedRow.VALUE = formatIntegerString(oneQbEntry?.ktc);
  enrichedRow.ADP = formatFixedString(adpEntry?.pprAdp, 1);
  enrichedRow["POS·ADP"] = formatFixedString(adpEntry?.posAdp, 1);
  enrichedRow.PPG = formatFixedString(ppg, 1);
  enrichedRow.__hasGameLogsSupport = Boolean(playerId && String(sourceRow.POS || "").trim().toUpperCase() !== "RDP");

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

function getTradeDiffValue(ktcRank, adpValue) {
  if (!Number.isFinite(ktcRank) || !Number.isFinite(adpValue)) {
    return null;
  }

  return Math.abs(Number(ktcRank) - Number(adpValue));
}

function getTradeDiffWinner(ktcRank, adpValue) {
  if (!Number.isFinite(ktcRank) || !Number.isFinite(adpValue)) {
    return "";
  }

  if (Number(ktcRank) === Number(adpValue)) {
    return "";
  }

  return Number(ktcRank) < Number(adpValue) ? "ktc" : "adp";
}

function formatTradeDiffString(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Number(value).toFixed(1).replace(/\.0$/, "");
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
  ensureValidActiveSort();
  rebuildGridData();
  applySortedRows();
}

// DataHub sort performance pass:
// cache the expensive category/search work once so repeated header clicks only
// redo the active sort and render instead of rebuilding the whole pipeline.
function rebuildGridData() {
  state.visibleRows = getVisibleRows();
  state.searchedRows = state.visibleRows.filter(matchesSearch);
  // DataHub conditional formatting:
  // calculate tiers from the post-filter, post-search rows so the visible table
  // always drives the active heat range rather than the hidden remainder.
  state.columnFormatting = buildColumnFormatting(state.searchedRows);
}

function applySortedRows() {
  state.displayedRows = sortRows(state.searchedRows);
  renderTable();
  updateSortMetaPill();
  updateRowCount();
}

function resolveDataHubContentView(pageTab = state.activePageTab) {
  if (CONTENT_PAGE_VIEWS.has(pageTab)) {
    return pageTab;
  }

  if (pageTab === "rookies") {
    return getActiveRookiesSubview();
  }

  return DATAHUB_PAGE_TAB_TO_CONTENT_VIEW[pageTab] || state.activePageView || "stats";
}

function getDataHubHeroTitle(pageTab = state.activePageTab) {
  return PAGE_TITLES[pageTab]
    || PAGE_TITLES[resolveDataHubContentView(pageTab)]
    || PAGE_TITLES.stats;
}

// Sync the non-table shell controls so the header, chips, and receiving
// subfilters stay aligned with the active in-memory state.
function syncUiState() {
  const viewConfig = getViewFilterConfig();
  state.activeCategory = getStoredCategoryForView(state.activePageView);
  state.rows = getActiveRowsForView();
  ensureValidActiveSort();
  syncPageTabButtons();
  mainTitle.textContent = getDataHubHeroTitle();
  activeViewLabel.textContent = getActiveViewLabelText();
  updateSortMetaPill();
  document.body.dataset.datahubView = state.activePageView;
  document.body.dataset.datahubTab = state.activePageTab;

  primaryTabButtons.forEach((button) => {
    const isActive = button.dataset.primaryTab === state.primaryTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  controlMounts.forEach((mount) => {
    mount.root.dataset.view = state.activePageView;
    syncRookiesModeControls(mount);
    renderCategoryButtons(viewConfig, mount.categoryRow);
    renderReceivingSubfilters(viewConfig, mount.receivingSubfilters);
    if (mount.receivingSubfilters) {
      // DataHub now mirrors the Stats-page receiving interaction:
      // WR / TE render inside the Receiving category slot, so the legacy extra
      // row stays empty and hidden in every control mount.
      mount.receivingSubfilters.hidden = true;
    }
    syncTradeEntityControls(mount);
    syncStatsQualifierControls(mount);
  });

  syncSearchInputs();
  syncDataHubChartUi();
}

// ---------------------------------------------------------------------------
// DataHub hero chart widgets
// ---------------------------------------------------------------------------
// These helpers keep the chart lane shared between page views while swapping
// the underlying widget content so Stats and Trade Values can each own the
// same desktop panel and mobile modal without duplicating the shell markup.
function syncDataHubChartUi() {
  const chartConfig = getDataHubHeroChartConfig();
  const shouldShowChart = Boolean(chartConfig);

  if (chartDesktopPanel) {
    chartDesktopPanel.hidden = !shouldShowChart || state.isCompactViewport;
  }

  if (chartToggleButton) {
    chartToggleButton.hidden = !shouldShowChart || !state.isCompactViewport;
    chartToggleButton.setAttribute("aria-expanded", String(state.isChartModalOpen));
  }

  if (!shouldShowChart) {
    closeDataHubChartModal({ restoreFocus: false });
    return;
  }

  if (state.isCompactViewport) {
    if (chartDesktopPanel) {
      chartDesktopPanel.hidden = true;
    }

    if (state.isChartModalOpen) {
      const mobileWidget = ensureDataHubHeroChartWidget("mobile", chartConfig.key);
      requestAnimationFrame(() => {
        mobileWidget?.resize?.();
      });
    }
    return;
  }

  closeDataHubChartModal({ restoreFocus: false });
  const desktopWidget = ensureDataHubHeroChartWidget("desktop", chartConfig.key);
  requestAnimationFrame(() => {
    desktopWidget?.resize?.();
  });
}

function getDataHubHeroChartConfig(viewKey = state.activePageTab) {
  return DATAHUB_HERO_CHART_CONFIGS[viewKey]
    || DATAHUB_HERO_CHART_CONFIGS[resolveDataHubContentView(viewKey)]
    || null;
}

function getDataHubHeroChartRoot(widgetKey) {
  return widgetKey === "mobile" ? chartMobileRoot : chartDesktopRoot;
}

function syncDataHubHeroChartFrame(widgetRoot, chartConfig) {
  if (!widgetRoot || !chartConfig) {
    return;
  }

  const chartTitle = widgetRoot.querySelector("[data-chart-title]");
  const chartAxisX = widgetRoot.querySelector("[data-chart-axis-x]");
  const chartAxisY = widgetRoot.querySelector("[data-chart-axis-y]");

  widgetRoot.dataset.chartView = chartConfig.key;
  widgetRoot.setAttribute("aria-label", chartConfig.ariaLabel);

  if (chartTitle) {
    chartTitle.textContent = chartConfig.title;
  }

  if (chartAxisX) {
    chartAxisX.textContent = chartConfig.xAxisLabel || "";
    chartAxisX.hidden = !chartConfig.xAxisLabel;
  }

  if (chartAxisY) {
    chartAxisY.textContent = chartConfig.yAxisLabel || "";
    chartAxisY.hidden = !chartConfig.yAxisLabel;
  }
}

function ensureDataHubHeroChartWidget(widgetKey, viewKey = state.activePageTab) {
  const widgetRoot = getDataHubHeroChartRoot(widgetKey);
  if (!widgetRoot) {
    return null;
  }

  const chartConfig = getDataHubHeroChartConfig(viewKey);
  if (!chartConfig) {
    return null;
  }

  const existingWidget = state.heroChartWidgets?.[widgetKey];
  if (existingWidget?.viewKey === chartConfig.key && existingWidget.root === widgetRoot) {
    syncDataHubHeroChartFrame(widgetRoot, chartConfig);
    return existingWidget;
  }

  if (existingWidget) {
    existingWidget.dispose?.();
    state.heroChartWidgets[widgetKey] = null;
  }

  const widget = createDataHubHeroChartWidget(widgetRoot, widgetKey, chartConfig);
  state.heroChartWidgets[widgetKey] = widget;
  return widget;
}

function getDataHubHeroChartMarkup(chartConfig) {
  return chartConfig?.template === "rookies"
    ? DATAHUB_ROOKIES_CHART_TEMPLATE
    : DATAHUB_STANDARD_CHART_TEMPLATE;
}

function ensureDataHubHeroChartMarkup(widgetRoot, chartConfig) {
  if (!widgetRoot || !chartConfig) {
    return;
  }

  if (widgetRoot.dataset.chartTemplate === chartConfig.template) {
    return;
  }

  widgetRoot.innerHTML = getDataHubHeroChartMarkup(chartConfig);
  widgetRoot.dataset.chartTemplate = chartConfig.template;
}

function createDataHubHeroChartWidget(widgetRoot, widgetKey, chartConfig) {
  if (chartConfig.template === "rookies") {
    return createDataHubRookiesChartWidget(widgetRoot, widgetKey, chartConfig);
  }

  return createDataHubStandardHeroChartWidget(widgetRoot, widgetKey, chartConfig);
}

function createDataHubStandardHeroChartWidget(widgetRoot, widgetKey, chartConfig) {
  ensureDataHubHeroChartMarkup(widgetRoot, chartConfig);
  const chartCanvas = widgetRoot.querySelector("[data-chart-canvas]");
  const summaryHost = widgetRoot.querySelector("[data-chart-summary]");

  if (!chartCanvas || !summaryHost) {
    return null;
  }

  syncDataHubHeroChartFrame(widgetRoot, chartConfig);
  chartConfig.renderSummary(summaryHost);

  const echartsApi = getDataHubEchartsApi();
  if (!echartsApi) {
    return {
      key: widgetKey,
      viewKey: chartConfig.key,
      root: widgetRoot,
      resize: () => {},
      dispose: () => {},
    };
  }

  const chart = echartsApi.init(chartCanvas, null, { renderer: "svg" });
  chart.setOption(chartConfig.buildOption(echartsApi), true);

  const resize = () => {
    if (!widgetRoot.isConnected || chart.isDisposed()) {
      return;
    }
    chart.resize();
  };

  const resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(() => resize())
    : null;
  resizeObserver?.observe(widgetRoot);

  return {
    key: widgetKey,
    viewKey: chartConfig.key,
    root: widgetRoot,
    chart,
    resize,
    dispose: () => {
      resizeObserver?.disconnect();
      if (!chart.isDisposed()) {
        chart.dispose();
      }
    },
  };
}

function getDataHubEchartsApi() {
  if (window.echarts) {
    return window.echarts;
  }

  if (!hasWarnedMissingEcharts) {
    console.warn("DataHub chart widget skipped because ECharts is unavailable.");
    hasWarnedMissingEcharts = true;
  }

  return null;
}

function renderDataHubTop60SummaryChips(summaryHost) {
  summaryHost.innerHTML = DATAHUB_TOP60_CHART_SERIES
    .map((series) => `
      <div
        class="datahub-top60-chart__stat-chip"
        style="
          --datahub-chart-chip-line: linear-gradient(90deg, ${series.lineStart}, ${series.lineEnd});
          --datahub-chart-chip-dot: linear-gradient(135deg, ${series.lineStart}, ${series.lineEnd});
          box-shadow:
            0 2px 8px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.03),
            0 0 0 1px rgba(255,255,255,0.02),
            0 -3px 10px ${series.glow};
        "
      >
        <div class="datahub-top60-chart__stat-chip-top">
          <span class="datahub-top60-chart__stat-dot"></span>
          <span class="datahub-top60-chart__stat-label">${series.key}</span>
        </div>

        <div class="datahub-top60-chart__stat-chip-bottom">
          <span class="datahub-top60-chart__stat-count">${series.count}</span>
          <span class="datahub-top60-chart__stat-meta">
            <span class="datahub-top60-chart__stat-sub">Top 60</span>
            <span class="datahub-top60-chart__stat-pct">${series.pct.toFixed(1)}%</span>
          </span>
        </div>
      </div>
    `)
    .join("");
}

function renderDataHubTradeValuesSummaryChips(summaryHost) {
  const summaries = DATAHUB_TRADE_VALUES_CHART_POSITIONS.map((positionGroup) => {
    const players = DATAHUB_TRADE_VALUES_CHART_DATA.filter((row) => row.pos === positionGroup.key);
    const count = players.length;
    const totalShift = players.reduce((sum, row) => sum + (row.adp - row.ktc), 0);
    const avgDiff = count ? totalShift / count : 0;

    return {
      ...positionGroup,
      count,
      avgDiff,
      // No sign — just the absolute diff value for display.
      shiftText: count ? Math.abs(avgDiff).toFixed(1) : "-",
      // Green for diffs under 3 (QB/RB/WR), reddish for 3+ (TE).
      shiftColor:
        count > 0
          ? Math.abs(avgDiff) < 3
            ? "#06ff97"
            : "#ff4187"
          : "rgba(255,255,255,0.72)",
    };
  });

  summaryHost.innerHTML = summaries
    .map((item) => `
      <div
        class="datahub-top60-chart__stat-chip"
        style="
          --datahub-chart-chip-line: linear-gradient(90deg, ${item.lineStart}, ${item.lineEnd});
          --datahub-chart-chip-dot: linear-gradient(135deg, ${item.lineStart}, ${item.lineEnd});
          --datahub-chart-chip-glow: ${item.glow};
          --datahub-chart-shift-color: ${item.shiftColor};
          box-shadow:
            0 2px 8px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.03),
            0 0 0 1px rgba(255,255,255,0.02),
            0 -3px 10px ${item.glow};
        "
      >
        <div class="datahub-top60-chart__stat-chip-top">
          <span class="datahub-top60-chart__stat-dot"></span>
          <span class="datahub-top60-chart__stat-label">${item.key}</span>
        </div>

        <div class="datahub-top60-chart__stat-chip-bottom datahub-top60-chart__stat-chip-bottom--split">
          <div class="datahub-top60-chart__stat-block">
            <span class="datahub-top60-chart__stat-count">${item.count}</span>
            <span class="datahub-top60-chart__stat-sub">COUNT</span>
          </div>
          <span class="datahub-top60-chart__stat-divider" aria-hidden="true"></span>
          <div class="datahub-top60-chart__stat-block">
            <span class="datahub-top60-chart__stat-count datahub-top60-chart__stat-shift">${item.shiftText}</span>
            <span class="datahub-top60-chart__stat-sub">AVG DIFF</span>
          </div>
        </div>
      </div>
    `)
    .join("");
}

function buildDataHubTop60ChartOption(echartsApi) {
  return {
    animationDuration: 450,
    backgroundColor: "transparent",
    grid: {
      left: 30,
      right: 8,
      top: 16,
      bottom: 44,
      containLabel: false,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(5,6,11,0.96)",
      borderColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      textStyle: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif",
      },
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgba(255,255,255,0.14)",
          width: 1,
        },
      },
      extraCssText:
        "border-radius:16px; box-shadow:0 16px 40px rgba(0,0,0,.45); padding:10px 12px;",
      formatter(params) {
        const items = params
          .map((entry) => {
            const series = DATAHUB_TOP60_CHART_SERIES.find((item) => item.key === entry.seriesName);
            if (!series) {
              return "";
            }

            return `
              <div style="display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:4px;">
                <div style="display:flex; align-items:center; gap:8px; color:rgba(255,255,255,.78);">
                  <span style="
                    width:10px;
                    height:10px;
                    border-radius:999px;
                    display:inline-block;
                    background: linear-gradient(135deg, ${series.lineStart}, ${series.lineEnd});
                  "></span>
                  ${entry.seriesName}
                </div>
                <div style="font-weight:700; color:#fff;">${entry.value[1]}</div>
              </div>
            `;
          })
          .join("");

        return `
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:.18em; color:rgba(255,255,255,.55); margin-bottom:6px;">
            Rank ${params[0]?.axisValue ?? ""}
          </div>
          ${items}
        `;
      },
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 60,
      interval: 12,
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 300,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif",
        formatter(value) {
          return Number.isInteger(value) ? String(value) : "";
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.14)",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 22,
      interval: 2,
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 300,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0)",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.05)",
          type: "dotted",
        },
      },
    },
    series: buildDataHubTop60ChartSeries(echartsApi),
  };
}

function buildDataHubTop60ChartSeries(echartsApi) {
  return DATAHUB_TOP60_CHART_SERIES.map((series) => ({
    name: series.key,
    type: "line",
    smooth: 0.55,
    showSymbol: false,
    symbol: "none",
    z: 3,
    lineStyle: {
      width: 3,
      color: createDataHubTop60LineGradient(echartsApi, series.lineStart, series.lineEnd),
      cap: "round",
      join: "round",
    },
    areaStyle: {
      color: createDataHubTop60AreaGradient(echartsApi, series.areaStart, series.areaEnd),
    },
    emphasis: {
      focus: "series",
    },
    data: DATAHUB_TOP60_CHART_DATA.map((row) => [row.rank, row[series.key]]),
  }));
}

function createDataHubTop60LineGradient(echartsApi, start, end) {
  return new echartsApi.graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: start },
    { offset: 0.42, color: start },
    { offset: 0.82, color: end },
    { offset: 1, color: end },
  ]);
}

function createDataHubTop60AreaGradient(echartsApi, start, end) {
  return new echartsApi.graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: echartsApi.color.modifyAlpha(start, 0.44) },
    { offset: 0.4, color: echartsApi.color.modifyAlpha(start, 0.32) },
    { offset: 0.82, color: echartsApi.color.modifyAlpha(end, 0.21) },
    { offset: 1, color: echartsApi.color.modifyAlpha(end, 0.14) },
  ]);
}

function buildDataHubTradeValuesChartOption(echartsApi) {
  const adpData = DATAHUB_TRADE_VALUES_CHART_DATA.map((row) => row.adp);
  const ktcData = DATAHUB_TRADE_VALUES_CHART_DATA.map((row) => row.ktc);

  return {
    animationDuration: 450,
    backgroundColor: "transparent",
    grid: {
      left: 90,
      right: 20,
      top: 6,
      bottom: 24,
      containLabel: false,
    },
    legend: {
      top: 6,
      right: 24,
      itemHeight: 14,
      itemWidth: 14,
      data: [
        { name: "ADP", icon: "roundRect" },
        { name: "KTC Rank", icon: "roundRect" },
      ],
      textStyle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10, 11, 16, 0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: {
        color: "#fff",
        fontSize: 13,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif",
      },
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(255,255,255,0.03)",
        },
      },
      extraCssText:
        "border-radius:8px; box-shadow:0 8px 30px rgba(0,0,0,0.6); padding:6px 9px; backdrop-filter:blur(8px);",
      formatter(params) {
        return buildDataHubTradeValuesTooltip(params);
      },
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 20,
      interval: 5,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 500,
        margin: 0,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.05)",
          type: "dotted",
        },
      },
    },
    yAxis: {
      type: "category",
      data: DATAHUB_TRADE_VALUES_CHART_DATA.map((row) => row.name),
      axisLabel: {
        formatter(value) {
          const player = DATAHUB_TRADE_VALUES_CHART_DATA.find((row) => row.name === value);
          if (!player) {
            return value;
          }
          return `{name|${player.name}  •  }{pos${player.pos}|${player.pos}}`;
        },
        rich: {
          name: {
            color: "rgba(255,255,255,0.76)",
            fontSize: 9,
            fontWeight: 600,
            fontFamily: "'Product Sans', 'Google Sans', sans-serif",
          },
          posQB: {
            color: "#d37be9",
            fontSize: 9,
            fontWeight: 400,
            fontFamily: "'Product Sans', 'Google Sans', sans-serif",
          },
          posRB: {
            color: "#66fccc",
            fontSize: 9,
            fontWeight: 400,
            fontFamily: "'Product Sans', 'Google Sans', sans-serif",
          },
          posWR: {
            color: "#60b5ff",
            fontSize: 9,
            fontWeight: 400,
            fontFamily: "'Product Sans', 'Google Sans', sans-serif",
          },
          posTE: {
            color: "#7e51fc",
            fontSize: 9,
            fontWeight: 400,
            fontFamily: "'Product Sans', 'Google Sans', sans-serif",
          },
        },
        interval: 0,
        margin: 4,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.10)",
        },
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "Connector",
        type: "custom",
        renderItem(params, api) {
          const y = api.coord([0, api.value(2)])[1];
          const x0 = api.coord([api.value(0), api.value(2)])[0];
          const x1 = api.coord([api.value(1), api.value(2)])[0];
          const minX = Math.min(x0, x1);
          const maxX = Math.max(x0, x1);

          return {
            type: "rect",
            transition: ["shape"],
            shape: {
              x: minX - 6,
              y: y - 6,
              width: maxX - minX + 12,
              height: 12,
              r: 6,
            },
            style: api.style({
              fill: new echartsApi.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: x0 < x1 ? DATAHUB_TRADE_VALUES_CHART_COLORS.ktc : DATAHUB_TRADE_VALUES_CHART_COLORS.adp,
                },
                { offset: 0.5, color: DATAHUB_TRADE_VALUES_CHART_COLORS.mid },
                {
                  offset: 1,
                  color: x0 < x1 ? DATAHUB_TRADE_VALUES_CHART_COLORS.adp : DATAHUB_TRADE_VALUES_CHART_COLORS.ktc,
                },
              ]),
            }),
          };
        },
        data: DATAHUB_TRADE_VALUES_CHART_DATA.map((row, index) => [row.ktc, row.adp, index]),
        z: 3,
        tooltip: { show: false },
      },
      {
        name: "KTC Rank",
        type: "scatter",
        symbol: "circle",
        symbolSize: 12,
        itemStyle: { color: DATAHUB_TRADE_VALUES_CHART_COLORS.ktc },
        data: ktcData,
        z: 2,
      },
      {
        name: "ADP",
        type: "scatter",
        symbol: "circle",
        symbolSize: 12,
        itemStyle: { color: DATAHUB_TRADE_VALUES_CHART_COLORS.adp },
        data: adpData,
        z: 2,
      },
    ],
  };
}

function buildDataHubTradeValuesTooltip(params) {
  if (!Array.isArray(params) || params.length === 0) {
    return "";
  }

  const playerIndex = params[0]?.dataIndex ?? 0;
  const player = DATAHUB_TRADE_VALUES_CHART_DATA[playerIndex];
  const adpPoint = params.find((entry) => entry.seriesName === "ADP");
  const ktcPoint = params.find((entry) => entry.seriesName === "KTC Rank");

  return `
    <div style="font-size:12px; font-weight:600; color:rgba(255,255,255,0.9); margin-bottom:6px; display:flex; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
      ${player?.fullName || player?.name || params[0]?.name || ""}
      ${buildDataHubTradeValuesPosBadge(player?.pos)}
    </div>
    <div style="display:flex; justify-content:space-between; gap:24px; margin-bottom:2px; align-items:center;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; border-radius:50%; background:${DATAHUB_TRADE_VALUES_CHART_COLORS.adp};"></span>
        <span style="color:rgba(255,255,255,0.7); font-size:12px;">ADP</span>
      </div>
      <strong style="font-size:14px; color:#fff;">${adpPoint?.value ?? ""}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; gap:24px; align-items:center;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; border-radius:50%; background:${DATAHUB_TRADE_VALUES_CHART_COLORS.ktc};"></span>
        <span style="color:rgba(255,255,255,0.7); font-size:12px;">KTC Rank</span>
      </div>
      <strong style="font-size:14px; color:#fff;">${ktcPoint?.value ?? ""}</strong>
    </div>
  `;
}

function buildDataHubTradeValuesPosBadge(position) {
  if (!position) {
    return "";
  }

  const badgeColors = {
    QB: "#d37be9",
    RB: "#66fccc",
    WR: "#60b5ff",
    TE: "#7e51fc",
  };
  const badgeColor = badgeColors[position] || "rgba(255,255,255,0.7)";

  return `<span style="background:${badgeColor}26; color:${badgeColor}; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">${position}</span>`;
}

function dataHubCssVar(styles, name, fallback = "") {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

function dataHubCssNum(styles, name, fallback = 0) {
  const value = Number.parseFloat(dataHubCssVar(styles, name));
  return Number.isFinite(value) ? value : fallback;
}

function dataHubCssList(styles, name, fallback) {
  const matches = dataHubCssVar(styles, name).match(/-?\d*\.?\d+/g);
  return matches ? matches.map((match) => Number.parseFloat(match)) : fallback;
}

function dataHubClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function dataHubAlpha(echartsApi, color, value) {
  return echartsApi.color.modifyAlpha(color, value);
}

function dataHubIsVisiblePaint(paint) {
  if (!paint || paint === "transparent" || paint === "none") {
    return false;
  }

  if (typeof paint !== "string") {
    return true;
  }

  const rgba = paint.match(/rgba?\(([^)]+)\)/i);
  if (!rgba) {
    return true;
  }

  const parts = rgba[1].split(",").map((part) => Number.parseFloat(part.trim()));
  return parts.length < 4 || parts[3] > 0.002;
}

function formatDataHubRookiesShortName(name) {
  const parts = String(name || "").trim().split(" ").filter(Boolean);
  return parts.length <= 1 ? String(name || "") : `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

function dataHubPolarToCartesian(cx, cy, radius, angleFromTop) {
  const angle = ((angleFromTop - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function dataHubVectorFromAngle(angleFromTop) {
  const angle = ((angleFromTop - 90) * Math.PI) / 180;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

function dataHubExpandBounds(bounds, x, y, radius) {
  bounds.minX = Math.min(bounds.minX, x - radius);
  bounds.maxX = Math.max(bounds.maxX, x + radius);
  bounds.minY = Math.min(bounds.minY, y - radius);
  bounds.maxY = Math.max(bounds.maxY, y + radius);
}

function dataHubBuildTierMap(builder) {
  return {
    2: builder(2),
    3: builder(3),
    4: builder(4),
  };
}

function readDataHubRookiesChartTheme(shellEl, echartsApi) {
  const styles = getComputedStyle(shellEl);
  const tierColor = (tier) => dataHubCssVar(styles, `--tier-${tier}`);

  return {
    fontFamily: dataHubCssVar(
      styles,
      "--chart-font-family",
      '"Product Sans", "Google Sans", sans-serif',
    ),
    text: {
      strong: dataHubCssVar(styles, "--chart-text-strong", "#fff"),
      name: dataHubCssVar(styles, "--chart-text-name", "rgba(255,255,255,0.94)"),
    },
    tooltip: {
      background: dataHubCssVar(styles, "--chart-tooltip-bg", "rgba(7,11,28,0.96)"),
      border: dataHubCssVar(styles, "--chart-tooltip-border", "rgba(255,255,255,0.08)"),
      muted: dataHubCssVar(styles, "--chart-tooltip-text-muted", "rgba(255,255,255,0.7)"),
      shadow: dataHubCssVar(styles, "--chart-tooltip-shadow", "0 16px 48px rgba(0,0,0,0.45)"),
      radius: dataHubCssVar(styles, "--chart-tooltip-radius", "14px"),
      padding: dataHubCssVar(styles, "--chart-tooltip-padding", "10px 12px"),
    },
    positions: {
      QB: dataHubCssVar(styles, "--pos-qb", "#fc3688"),
      RB: dataHubCssVar(styles, "--pos-rb", "#25f4c5"),
      WR: dataHubCssVar(styles, "--pos-wr", "#48d1ff"),
      TE: dataHubCssVar(styles, "--pos-te", "#8d63ff"),
    },
    tiers: {
      1: { color: tierColor(1), label: DATAHUB_ROOKIES_TIER_LABELS[1] },
      2: { color: tierColor(2), label: DATAHUB_ROOKIES_TIER_LABELS[2] },
      3: { color: tierColor(3), label: DATAHUB_ROOKIES_TIER_LABELS[3] },
      4: { color: tierColor(4), label: DATAHUB_ROOKIES_TIER_LABELS[4] },
    },
    bands: dataHubBuildTierMap((tier) => ({
      stroke: dataHubCssVar(styles, `--tier-${tier}-band-stroke`),
      fill: dataHubCssVar(styles, `--tier-${tier}-band-fill`),
    })),
    graphics: {
      outerBackdropFill: dataHubCssVar(styles, "--chart-outer-backdrop-fill"),
      outerBackdropStroke: dataHubCssVar(styles, "--chart-outer-backdrop-stroke"),
      outerAccentStroke: dataHubCssVar(styles, "--chart-outer-accent-stroke"),
      bandEdgeInner: dataHubCssVar(styles, "--chart-band-edge-inner"),
      bandEdgeOuter: dataHubCssVar(styles, "--chart-band-edge-outer"),
      coreOrbitStroke: dataHubCssVar(styles, "--chart-core-orbit-3-stroke"),
      coreRingInnerStroke: dataHubCssVar(styles, "--chart-core-ring-inner-stroke"),
      bandDash: {
        aMin: dataHubCssNum(styles, "--chart-band-dash-a-min", 0.25),
        aScale: dataHubCssNum(styles, "--chart-band-dash-a-scale", 1),
        bMin: dataHubCssNum(styles, "--chart-band-dash-b-min", 4),
        bScale: dataHubCssNum(styles, "--chart-band-dash-b-scale", 1),
      },
      bandRingWidth: {
        min: dataHubCssNum(styles, "--chart-band-ring-line-min", 21),
        scale: dataHubCssNum(styles, "--chart-band-ring-line-scale", 15),
      },
      coreRingInnerDash: {
        aMin: dataHubCssNum(styles, "--chart-core-ring-inner-dash-a-min", 1),
        aScale: dataHubCssNum(styles, "--chart-core-ring-inner-dash-a-scale", 2.2),
        bMin: dataHubCssNum(styles, "--chart-core-ring-inner-dash-b-min", 1),
        bScale: dataHubCssNum(styles, "--chart-core-ring-inner-dash-b-scale", 1.4),
      },
      coreRingInnerWidth: {
        min: dataHubCssNum(styles, "--chart-core-ring-inner-line-min", 1),
        scale: dataHubCssNum(styles, "--chart-core-ring-inner-line-scale", 21.4),
      },
    },
    connectors: {
      opacity: dataHubCssNum(styles, "--connector-opacity", 0.62),
      shadowBlurMin: dataHubCssNum(styles, "--connector-shadow-blur-min", 4),
      shadowBlurScale: dataHubCssNum(styles, "--connector-shadow-blur-scale", 6.2),
      gradient: {
        start: dataHubCssNum(styles, "--connector-gradient-start-alpha", 0.04),
        mid: dataHubCssNum(styles, "--connector-gradient-mid-alpha", 0.48),
        end: dataHubCssNum(styles, "--connector-gradient-end-alpha", 0.84),
        tail: dataHubCssNum(styles, "--connector-gradient-tail-alpha", 0.28),
      },
      highlight: {
        widthFactor: dataHubCssNum(styles, "--connector-highlight-width-factor", 0.34),
        start: dataHubCssNum(styles, "--connector-highlight-start-alpha", 0.04),
        mid: dataHubCssNum(styles, "--connector-highlight-mid-alpha", 0.18),
        end: dataHubCssNum(styles, "--connector-highlight-end-alpha", 0.24),
      },
      tiers: dataHubBuildTierMap((tier) => ({
        color: dataHubCssVar(styles, `--connector-tier-${tier}-color`, tierColor(tier)),
        widthMin: dataHubCssNum(styles, `--connector-tier-${tier}-width-min`, 1),
        widthScale: dataHubCssNum(styles, `--connector-tier-${tier}-width-scale`, 4),
      })),
    },
    nodes: {
      haloOpacity: {
        center: dataHubCssNum(styles, "--chart-node-halo-opacity-center", 0.06),
        outer: dataHubCssNum(styles, "--chart-node-halo-opacity-outer", 0.091),
      },
      haloBlur: {
        center: dataHubCssNum(styles, "--chart-node-halo-blur-center", 6),
        outer: dataHubCssNum(styles, "--chart-node-halo-blur-outer", 6),
        tiers: dataHubBuildTierMap((tier) => (
          dataHubCssNum(styles, `--chart-node-halo-blur-tier-${tier}`, 6)
        )),
      },
      haloSpread: {
        center: {
          min: dataHubCssNum(styles, "--chart-node-halo-spread-center-min", 16),
          scale: dataHubCssNum(styles, "--chart-node-halo-spread-center-scale", 34),
        },
        tiers: dataHubBuildTierMap((tier) => ({
          min: dataHubCssNum(styles, `--chart-node-halo-spread-tier-${tier}-min`, 5),
          scale: dataHubCssNum(styles, `--chart-node-halo-spread-tier-${tier}-scale`, 11),
        })),
      },
      shadowFill: dataHubCssVar(styles, "--chart-node-sphere-shadow-fill", "rgba(3,8,20,0.6)"),
      shadowOffset: {
        center: dataHubCssNum(styles, "--chart-node-sphere-shadow-offset-center", 0.08),
        outer: dataHubCssNum(styles, "--chart-node-sphere-shadow-offset-outer", 0.12),
      },
      fill: {
        center: dataHubCssVar(styles, "--chart-node-shell-fill-center", "rgba(255,255,255,0.06)"),
        tiers: dataHubBuildTierMap((tier) => (
          dataHubCssVar(styles, `--chart-node-fill-tier-${tier}`)
        )),
      },
      shell: {
        highlight: {
          center: dataHubCssNum(styles, "--chart-node-shell-highlight-alpha-center", 0.2),
          outer: dataHubCssNum(styles, "--chart-node-shell-highlight-alpha-outer", 0.12),
        },
        edge: {
          center: dataHubCssNum(styles, "--chart-node-shell-edge-alpha-center", 0.42),
          outer: dataHubCssNum(styles, "--chart-node-shell-edge-alpha-outer", 0.3),
        },
      },
      rim: {
        alpha: {
          center: dataHubCssNum(styles, "--chart-node-rim-alpha-center", 0.96),
          outer: dataHubCssNum(styles, "--chart-node-rim-alpha-outer", 0.88),
        },
        width: {
          center: {
            min: dataHubCssNum(styles, "--chart-node-rim-width-center-min", 2.4),
            factor: dataHubCssNum(styles, "--chart-node-rim-width-center-factor", 0.082),
          },
          outer: {
            min: dataHubCssNum(styles, "--chart-node-rim-width-outer-min", 1.2),
            factor: dataHubCssNum(styles, "--chart-node-rim-width-outer-factor", 0.094),
          },
        },
        inner: {
          color: dataHubCssVar(styles, "--chart-node-inner-rim-color", "rgba(255,255,255,1)"),
          alpha: {
            center: dataHubCssNum(styles, "--chart-node-inner-rim-alpha-center", 0.18),
            outer: dataHubCssNum(styles, "--chart-node-inner-rim-alpha-outer", 0.12),
          },
          width: {
            center: dataHubCssNum(styles, "--chart-node-inner-rim-width-center", 1.35),
            outer: dataHubCssNum(styles, "--chart-node-inner-rim-width-outer", 0.9),
          },
        },
      },
      sphere: {
        edgeShadow: dataHubCssVar(styles, "--chart-node-sphere-edge-shadow", "rgba(6,10,24,0.94)"),
        specularCore: dataHubCssVar(styles, "--chart-node-sphere-specular-core", "rgba(255,255,255,0.98)"),
        specularSoft: dataHubCssVar(styles, "--chart-node-sphere-specular-soft", "rgba(255,255,255,0.58)"),
        specularGlint: dataHubCssVar(styles, "--chart-node-sphere-specular-glint", "rgba(255,255,255,0.82)"),
        highlightFade: dataHubCssVar(styles, "--chart-node-sphere-highlight-fade", "rgba(255,255,255,0)"),
        colorAlpha: {
          inner: dataHubCssNum(styles, "--chart-node-sphere-color-alpha-inner", 0.22),
          mid: dataHubCssNum(styles, "--chart-node-sphere-color-alpha-mid", 0.5),
          edge: dataHubCssNum(styles, "--chart-node-sphere-color-alpha-edge", 0.96),
        },
      },
      specular: {
        offset: {
          center: {
            x: dataHubCssNum(styles, "--chart-node-specular-offset-x-center", -0.52),
            y: dataHubCssNum(styles, "--chart-node-specular-offset-y-center", -0.72),
          },
          outer: {
            x: dataHubCssNum(styles, "--chart-node-specular-offset-x-outer", -0.2),
            y: dataHubCssNum(styles, "--chart-node-specular-offset-y-outer", -0.3),
          },
        },
        radius: {
          center: dataHubCssNum(styles, "--chart-node-specular-radius-center", 0.17),
          outer: dataHubCssNum(styles, "--chart-node-specular-radius-outer", 0.48),
        },
        opacity: {
          center: dataHubCssNum(styles, "--chart-node-specular-opacity-center", 0.04),
          outer: dataHubCssNum(styles, "--chart-node-specular-opacity-outer", 0.26),
        },
      },
      glint: {
        offset: {
          center: {
            x: dataHubCssNum(styles, "--chart-node-glint-offset-x-center", -0.22),
            y: dataHubCssNum(styles, "--chart-node-glint-offset-y-center", -0.52),
          },
          outer: {
            x: dataHubCssNum(styles, "--chart-node-glint-offset-x-outer", -0.12),
            y: dataHubCssNum(styles, "--chart-node-glint-offset-y-outer", -0.36),
          },
        },
        size: {
          center: dataHubCssNum(styles, "--chart-node-glint-size-center", 0.09),
          outer: dataHubCssNum(styles, "--chart-node-glint-size-outer", 0.12),
        },
        alpha: {
          center: dataHubCssNum(styles, "--chart-node-glint-alpha-center", 0.26),
          outer: dataHubCssNum(styles, "--chart-node-glint-alpha-outer", 0.58),
        },
      },
      centerInner: {
        fill: dataHubCssVar(styles, "--chart-node-inner-fill-center", "rgba(18,10,39,0.42)"),
        stroke: dataHubCssVar(styles, "--chart-node-inner-stroke-center", "rgba(255,255,255,0.16)"),
        strokeWidth: dataHubCssNum(styles, "--chart-node-inner-stroke-width-center", 1),
      },
      centerGradient: {
        start1: dataHubCssVar(styles, "--chart-center-gradient-stop-1", "rgba(246,237,255,0.98)"),
        start2: dataHubCssVar(styles, "--chart-center-gradient-stop-2", "rgba(196,162,244,0.94)"),
        end: dataHubCssVar(styles, "--chart-center-gradient-stop-4", "rgba(40,11,82,1)"),
      },
      nameChip: {
        padding: {
          center: dataHubCssList(styles, "--chart-name-chip-padding-center", [1, 5, 3, 4]),
          outer: dataHubCssList(styles, "--chart-name-chip-padding-outer", [1, 3, 2, 3]),
        },
        bg: {
          center: dataHubCssVar(styles, "--chart-name-chip-bg-center", "rgba(10,16,36,0.28)"),
          outer: dataHubCssVar(styles, "--chart-name-chip-bg-outer", "rgba(33,41,55,0.9)"),
        },
        borderWidth: dataHubCssNum(styles, "--chart-name-chip-border-width", 1),
        borderRadius: dataHubCssNum(styles, "--chart-name-chip-border-radius", 999),
        borderAlpha: {
          center: dataHubCssNum(styles, "--chart-name-chip-border-alpha-center", 0.5),
          outer: dataHubCssNum(styles, "--chart-name-chip-border-alpha-outer", 0.38),
        },
        shadowBlur: {
          center: dataHubCssNum(styles, "--chart-name-chip-shadow-blur-center", 3),
          outer: dataHubCssNum(styles, "--chart-name-chip-shadow-blur-outer", 2),
        },
        shadowAlpha: {
          center: dataHubCssNum(styles, "--chart-name-chip-shadow-alpha-center", 0.3),
          outer: dataHubCssNum(styles, "--chart-name-chip-shadow-alpha-outer", 0.32),
        },
      },
    },
    type: {
      stackGap: {
        center: dataHubCssNum(styles, "--chart-pos-grade-gap-center", 1.15),
        outer: dataHubCssNum(styles, "--chart-pos-grade-gap-outer", 0.55),
      },
      posLift: {
        center: dataHubCssNum(styles, "--chart-pos-label-lift-center", 6),
        outer: dataHubCssNum(styles, "--chart-pos-label-lift-outer", 3.2),
      },
      pos: {
        center: {
          weight: dataHubCssNum(styles, "--chart-pos-font-weight-center", 700),
          factor: dataHubCssNum(styles, "--chart-pos-font-factor-center", 0.31),
          min: dataHubCssNum(styles, "--chart-pos-font-min-center", 14),
          max: dataHubCssNum(styles, "--chart-pos-font-max-center", 14.3),
        },
        outer: {
          weight: dataHubCssNum(styles, "--chart-pos-font-weight-outer", 700),
          factor: dataHubCssNum(styles, "--chart-pos-font-factor-outer", 0.42),
          min: dataHubCssNum(styles, "--chart-pos-font-min-outer", 8.5),
          max: dataHubCssNum(styles, "--chart-pos-font-max-outer", 9.5),
          bumpByTier: dataHubBuildTierMap((tier) => (
            dataHubCssNum(styles, `--chart-pos-font-bump-tier-${tier}`, 0)
          )),
        },
        shadow: {
          color: dataHubCssVar(styles, "--chart-pos-shadow-color", "rgba(0,0,0,0.58)"),
          blur: {
            center: dataHubCssNum(styles, "--chart-pos-shadow-blur-center", 4.2),
            outer: dataHubCssNum(styles, "--chart-pos-shadow-blur-outer", 2.2),
          },
          offsetX: dataHubCssNum(styles, "--chart-pos-shadow-offset-x", 0),
          offsetY: dataHubCssNum(styles, "--chart-pos-shadow-offset-y", 0.7),
          underlay: {
            center: {
              color: dataHubCssVar(styles, "--chart-pos-underlay-color-center", "rgba(4,1,12,0.9)"),
              bump: dataHubCssNum(styles, "--chart-pos-underlay-size-bump-center", 0.1),
              offsetX: dataHubCssNum(styles, "--chart-pos-underlay-offset-x-center", 0.3),
              offsetY: dataHubCssNum(styles, "--chart-pos-underlay-offset-y-center", 1.05),
            },
            outer: {
              color: dataHubCssVar(styles, "--chart-pos-underlay-color-outer", "rgba(4,1,12,0.82)"),
              bump: dataHubCssNum(styles, "--chart-pos-underlay-size-bump-outer", 0.05),
              offsetX: dataHubCssNum(styles, "--chart-pos-underlay-offset-x-outer", 0.15),
              offsetY: dataHubCssNum(styles, "--chart-pos-underlay-offset-y-outer", 0.8),
            },
            tier3: {
              color: dataHubCssVar(styles, "--chart-pos-underlay-color-tier-3", "rgba(4,1,12,0.9)"),
              bump: dataHubCssNum(styles, "--chart-pos-underlay-size-bump-tier-3", 0.08),
              offsetX: dataHubCssNum(styles, "--chart-pos-underlay-offset-x-tier-3", 0.2),
              offsetY: dataHubCssNum(styles, "--chart-pos-underlay-offset-y-tier-3", 0.95),
            },
          },
        },
      },
      grade: {
        center: {
          weight: dataHubCssNum(styles, "--chart-grade-font-weight-center", 400),
          factor: dataHubCssNum(styles, "--chart-grade-font-factor-center", 1),
          min: dataHubCssNum(styles, "--chart-grade-font-min-center", 42),
          max: dataHubCssNum(styles, "--chart-grade-font-max-center", 42),
        },
        outer: {
          weight: dataHubCssNum(styles, "--chart-grade-font-weight-outer", 400),
          factor: dataHubCssNum(styles, "--chart-grade-font-factor-outer", 0.82),
          min: dataHubCssNum(styles, "--chart-grade-font-min-outer", 9.2),
          max: dataHubCssNum(styles, "--chart-grade-font-max-outer", 13.4),
          bumpByTier: dataHubBuildTierMap((tier) => (
            dataHubCssNum(styles, `--chart-grade-font-bump-tier-${tier}`, 0)
          )),
        },
        shadow: {
          color: dataHubCssVar(styles, "--chart-grade-shadow-color-center", "rgba(3,1,12,0.98)"),
          blur: dataHubCssNum(styles, "--chart-grade-shadow-blur-center", 10.5),
          offsetX: dataHubCssNum(styles, "--chart-grade-shadow-offset-x-center", 0.45),
          offsetY: dataHubCssNum(styles, "--chart-grade-shadow-offset-y-center", 2.2),
          underlayColor: dataHubCssVar(styles, "--chart-grade-underlay-color-center", "rgba(2,1,10,0.96)"),
          underlayBump: dataHubCssNum(styles, "--chart-grade-underlay-size-bump-center", 0.15),
          underlayOffsetX: dataHubCssNum(styles, "--chart-grade-underlay-offset-x-center", 0.65),
          underlayOffsetY: dataHubCssNum(styles, "--chart-grade-underlay-offset-y-center", 2.85),
        },
      },
      name: {
        weight: dataHubCssNum(styles, "--chart-name-font-weight", 400),
        center: {
          factor: dataHubCssNum(styles, "--chart-name-font-factor-center", 0.34),
          min: dataHubCssNum(styles, "--chart-name-font-min-center", 11),
          max: dataHubCssNum(styles, "--chart-name-font-max-center", 14.2),
        },
        outer: {
          factor: dataHubCssNum(styles, "--chart-name-font-factor-outer", 0.5),
          min: dataHubCssNum(styles, "--chart-name-font-min-outer", 6),
          max: dataHubCssNum(styles, "--chart-name-font-max-outer", 8.5),
          floor: dataHubCssNum(styles, "--chart-name-font-floor-outer", 5.7),
          midCutoff: dataHubCssNum(styles, "--chart-name-font-mid-cutoff", 10),
          midReduction: dataHubCssNum(styles, "--chart-name-font-mid-reduction", 0.5),
          longCutoff: dataHubCssNum(styles, "--chart-name-font-long-cutoff", 13),
          longReduction: dataHubCssNum(styles, "--chart-name-font-long-reduction", 0.9),
        },
      },
    },
  };
}

function getDataHubRookiesOuterNameSize(shortName, nodeRadius, nameTheme) {
  let size = dataHubClamp(nodeRadius * nameTheme.factor, nameTheme.min, nameTheme.max);

  if (shortName.length >= nameTheme.longCutoff) {
    size -= nameTheme.longReduction;
  } else if (shortName.length >= nameTheme.midCutoff) {
    size -= nameTheme.midReduction;
  }

  return Math.max(nameTheme.floor, size);
}

function computeDataHubRookiesChartLayout(width, height, theme) {
  const { chartPadding } = DATAHUB_ROOKIES_GEOMETRY;
  const availableWidth = width - chartPadding.left - chartPadding.right;
  const availableHeight = height - chartPadding.top - chartPadding.bottom;
  const scale = Math.min(
    availableWidth / (2 * Math.max(DATAHUB_ROOKIES_REFERENCE_EXTENTS.left, DATAHUB_ROOKIES_REFERENCE_EXTENTS.right)),
    availableHeight / (2 * Math.max(DATAHUB_ROOKIES_REFERENCE_EXTENTS.top, DATAHUB_ROOKIES_REFERENCE_EXTENTS.bottom)),
  ) * 0.985;
  const center = {
    x: chartPadding.left + availableWidth / 2,
    y: chartPadding.top + availableHeight / 2,
  };
  const bands = DATAHUB_ROOKIES_TIER_KEYS.map((tier) => ({
    tier,
    radius: DATAHUB_ROOKIES_GEOMETRY.bands[tier].radius * scale,
    width: DATAHUB_ROOKIES_GEOMETRY.bands[tier].width * scale,
  }));
  const players = DATAHUB_ROOKIES_REFERENCE_PLAYERS.map((player) => {
    const isCenter = player.tier === 1;
    const posTheme = isCenter ? theme.type.pos.center : theme.type.pos.outer;
    const gradeTheme = isCenter ? theme.type.grade.center : theme.type.grade.outer;
    const nameTheme = isCenter ? theme.type.name.center : theme.type.name.outer;
    const nodeRadius = player.nodeRadius * scale * (
      isCenter ? DATAHUB_ROOKIES_GEOMETRY.centerScale : DATAHUB_ROOKIES_GEOMETRY.outerScale
    );
    const posFontSize = dataHubClamp(nodeRadius * posTheme.factor, posTheme.min, posTheme.max)
      + (isCenter ? 0 : posTheme.bumpByTier[player.tier] || 0);
    const gradeFontSize = dataHubClamp(nodeRadius * gradeTheme.factor, gradeTheme.min, gradeTheme.max)
      + (isCenter ? 0 : gradeTheme.bumpByTier[player.tier] || 0);
    const posGap = isCenter ? theme.type.stackGap.center : theme.type.stackGap.outer;
    const posSeparation = Math.round((
      (posFontSize * (isCenter ? 0.58 : 0.54))
      + (gradeFontSize * (isCenter ? 0.62 : 0.58))
    ) / 2 + posGap);

    return {
      ...player,
      color: theme.tiers[player.tier].color,
      posColor: theme.positions[player.pos],
      x: center.x + (player.x - DATAHUB_ROOKIES_REFERENCE_CENTER_X) * scale,
      y: center.y + (player.y - DATAHUB_ROOKIES_REFERENCE_CENTER_Y) * scale,
      nodeRadius,
      shellRadius: isCenter ? nodeRadius + Math.max(7, 10 * scale) : nodeRadius,
      haloRadius: nodeRadius + Math.max(
        isCenter
          ? theme.nodes.haloSpread.center.min
          : theme.nodes.haloSpread.tiers[player.tier].min,
        (
          isCenter
            ? theme.nodes.haloSpread.center.scale
            : theme.nodes.haloSpread.tiers[player.tier].scale
        ) * scale,
      ),
      innerRadius: isCenter ? Math.max(14, nodeRadius - Math.max(4, 14 * scale)) : 0,
      posFontSize,
      gradeFontSize,
      posSeparation,
      gradeOffsetY: isCenter ? -nodeRadius * 0.01 : nodeRadius * 0.04,
      nameFontSize: isCenter
        ? dataHubClamp(nodeRadius * nameTheme.factor, nameTheme.min, nameTheme.max)
        : getDataHubRookiesOuterNameSize(player.shortName, nodeRadius, nameTheme),
      nameOffsetY: isCenter
        ? nodeRadius * 0.73
        : player.tier === 4
          ? nodeRadius * 0.81
          : player.tier === 3
            ? nodeRadius * 0.75
            : nodeRadius * 0.68,
    };
  });

  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  const outerBackdropRadius = (
    DATAHUB_ROOKIES_GEOMETRY.bands[4].radius
    + DATAHUB_ROOKIES_GEOMETRY.bands[4].nodeRadius
    + DATAHUB_ROOKIES_GEOMETRY.backdropInset
  ) * scale;

  dataHubExpandBounds(bounds, center.x, center.y, outerBackdropRadius);
  dataHubExpandBounds(bounds, center.x, center.y, DATAHUB_ROOKIES_GEOMETRY.coreOrbit3Radius * scale);
  players.forEach((player) => {
    dataHubExpandBounds(bounds, player.x, player.y, player.haloRadius);
  });

  let shiftX = 0;
  let shiftY = 0;
  const minX = chartPadding.left;
  const maxX = width - chartPadding.right;
  const minY = chartPadding.top;
  const maxY = height - chartPadding.bottom;

  if (bounds.minX < minX) {
    shiftX = minX - bounds.minX;
  } else if (bounds.maxX > maxX) {
    shiftX = maxX - bounds.maxX;
  }

  if (bounds.minY < minY) {
    shiftY = minY - bounds.minY;
  } else if (bounds.maxY > maxY) {
    shiftY = maxY - bounds.maxY;
  }

  const shiftedPlayers = (shiftX || shiftY)
    ? players.map((player) => ({
      ...player,
      x: player.x + shiftX,
      y: player.y + shiftY,
    }))
    : players;

  return {
    width,
    height,
    scale,
    bands,
    center: { x: center.x + shiftX, y: center.y + shiftY },
    outerBackdropRadius,
    coreOrbit3Radius: DATAHUB_ROOKIES_GEOMETRY.coreOrbit3Radius * scale,
    coreRingInnerRadius: DATAHUB_ROOKIES_GEOMETRY.coreRingInnerRadius * scale,
    players: shiftedPlayers,
    centerPlayer: shiftedPlayers.find((player) => player.tier === 1),
    outerPlayers: shiftedPlayers.filter((player) => player.tier !== 1),
  };
}

function buildDataHubRookiesDashPair(config, scale) {
  return [
    Math.max(config.aMin, config.aScale * scale),
    Math.max(config.bMin, config.bScale * scale),
  ];
}

function buildDataHubRookiesConnectorGradient(path, theme, isHighlight, echartsApi) {
  const { start, end, color } = path;
  const stops = isHighlight
    ? [
      { offset: 0, color: dataHubAlpha(echartsApi, theme.text.strong, theme.connectors.highlight.start) },
      { offset: 0.36, color: dataHubAlpha(echartsApi, theme.text.strong, theme.connectors.highlight.mid) },
      { offset: 0.84, color: dataHubAlpha(echartsApi, color, theme.connectors.highlight.end) },
      { offset: 1, color: dataHubAlpha(echartsApi, color, 0) },
    ]
    : [
      { offset: 0, color: dataHubAlpha(echartsApi, theme.text.strong, theme.connectors.gradient.start) },
      { offset: 0.24, color: dataHubAlpha(echartsApi, theme.text.strong, theme.connectors.gradient.start * 0.72) },
      { offset: 0.52, color: dataHubAlpha(echartsApi, color, theme.connectors.gradient.mid) },
      { offset: 0.86, color: dataHubAlpha(echartsApi, color, theme.connectors.gradient.end) },
      { offset: 1, color: dataHubAlpha(echartsApi, color, theme.connectors.gradient.tail) },
    ];

  return new echartsApi.graphic.LinearGradient(start[0], start[1], end[0], end[1], stops, true);
}

function buildDataHubRookiesConnectorPaths(layout, theme) {
  const startRadius = layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale);

  return layout.outerPlayers.map((player) => {
    const direction = dataHubVectorFromAngle(player.angle);
    const tierTheme = theme.connectors.tiers[player.tier];
    const start = [
      layout.center.x + direction.x * startRadius,
      layout.center.y + direction.y * startRadius,
    ];
    const end = [
      player.x - direction.x * player.shellRadius,
      player.y - direction.y * player.shellRadius,
    ];

    return {
      tier: player.tier,
      color: tierTheme.color,
      start,
      end,
      coords: [start, end],
      width: Math.max(tierTheme.widthMin, tierTheme.widthScale * layout.scale),
      shadowBlur: Math.max(
        theme.connectors.shadowBlurMin,
        theme.connectors.shadowBlurScale * layout.scale,
      ),
    };
  });
}

function buildDataHubRookiesConnectorSeries(paths, theme, isHighlight, echartsApi) {
  return {
    type: "lines",
    coordinateSystem: "cartesian2d",
    polyline: false,
    silent: true,
    z: isHighlight ? 3 : 2,
    data: paths.map((path) => ({
      coords: path.coords,
      lineStyle: {
        color: buildDataHubRookiesConnectorGradient(path, theme, isHighlight, echartsApi),
        width: path.width * (isHighlight ? theme.connectors.highlight.widthFactor : 1),
        opacity: isHighlight ? 1 : theme.connectors.opacity,
        shadowColor: path.color,
        shadowBlur: isHighlight ? 0 : path.shadowBlur,
        cap: "round",
      },
    })),
  };
}

function pushDataHubRookiesCircle(target, cx, cy, radius, fill, stroke, lineWidth, style = {}) {
  if (
    (!dataHubIsVisiblePaint(fill) || radius <= 0)
    && (!dataHubIsVisiblePaint(stroke) || !lineWidth || radius <= 0)
  ) {
    return;
  }

  target.push({
    type: "circle",
    silent: true,
    shape: { cx, cy, r: radius },
    style: {
      fill,
      stroke,
      lineWidth,
      ...style,
    },
  });
}

function buildDataHubRookiesGraphics(layout, theme) {
  const elements = [];
  const bandDash = buildDataHubRookiesDashPair(theme.graphics.bandDash, layout.scale);
  const innerDash = buildDataHubRookiesDashPair(theme.graphics.coreRingInnerDash, layout.scale);
  const bandRingWidth = Math.max(
    theme.graphics.bandRingWidth.min,
    theme.graphics.bandRingWidth.scale * layout.scale,
  );

  pushDataHubRookiesCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.outerBackdropRadius,
    theme.graphics.outerBackdropFill,
    theme.graphics.outerBackdropStroke,
    1,
  );

  pushDataHubRookiesCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.bands[layout.bands.length - 1].radius
      + layout.bands[layout.bands.length - 1].width / 2
      + Math.max(2, 8 * layout.scale),
    "transparent",
    theme.graphics.outerAccentStroke,
    1,
  );

  layout.bands.forEach((band) => {
    const bandTheme = theme.bands[band.tier];

    pushDataHubRookiesCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius,
      "transparent",
      bandTheme.fill,
      band.width,
    );
    pushDataHubRookiesCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius,
      "transparent",
      bandTheme.stroke,
      bandRingWidth,
      { lineDash: bandDash },
    );
    pushDataHubRookiesCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius - band.width / 2,
      "transparent",
      theme.graphics.bandEdgeInner,
      1,
    );
    pushDataHubRookiesCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius + band.width / 2,
      "transparent",
      theme.graphics.bandEdgeOuter,
      1,
    );
  });

  pushDataHubRookiesCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.coreOrbit3Radius,
    "transparent",
    theme.graphics.coreOrbitStroke,
    1,
  );

  pushDataHubRookiesCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.coreRingInnerRadius,
    "transparent",
    theme.graphics.coreRingInnerStroke,
    Math.max(
      theme.graphics.coreRingInnerWidth.min,
      theme.graphics.coreRingInnerWidth.scale * layout.scale,
    ),
    { lineDash: innerDash },
  );

  return elements;
}

function buildDataHubRookiesShellGradient(color, fillColor, theme, isCenter, echartsApi) {
  return new echartsApi.graphic.RadialGradient(0.28, 0.24, 1, [
    {
      offset: 0,
      color: dataHubAlpha(
        echartsApi,
        theme.text.strong,
        isCenter ? theme.nodes.shell.highlight.center : theme.nodes.shell.highlight.outer,
      ),
    },
    { offset: 0.22, color: dataHubAlpha(echartsApi, color, theme.nodes.sphere.colorAlpha.inner * 0.52) },
    { offset: 0.74, color: fillColor },
    {
      offset: 1,
      color: dataHubAlpha(
        echartsApi,
        color,
        isCenter ? theme.nodes.shell.edge.center : theme.nodes.shell.edge.outer,
      ),
    },
  ]);
}

function buildDataHubRookiesOuterBodyGradient(color, fillColor, theme, echartsApi) {
  return new echartsApi.graphic.RadialGradient(0.34, 0.26, 0.94, [
    { offset: 0, color: dataHubAlpha(echartsApi, theme.text.strong, 0.12) },
    { offset: 0.16, color: dataHubAlpha(echartsApi, color, theme.nodes.sphere.colorAlpha.inner) },
    { offset: 0.48, color: dataHubAlpha(echartsApi, color, theme.nodes.sphere.colorAlpha.mid) },
    { offset: 0.8, color: fillColor },
    { offset: 0.96, color: dataHubAlpha(echartsApi, color, theme.nodes.sphere.colorAlpha.edge) },
    { offset: 1, color: theme.nodes.sphere.edgeShadow },
  ]);
}

function buildDataHubRookiesCenterBodyGradient(color, theme, echartsApi) {
  return new echartsApi.graphic.RadialGradient(0.3, 0.24, 1, [
    { offset: 0, color: dataHubAlpha(echartsApi, theme.text.strong, 0.18) },
    { offset: 0.08, color: theme.nodes.centerGradient.start1 },
    { offset: 0.24, color: theme.nodes.centerGradient.start2 },
    { offset: 0.54, color: dataHubAlpha(echartsApi, color, Math.max(0.68, theme.nodes.sphere.colorAlpha.mid)) },
    { offset: 0.8, color },
    { offset: 1, color: theme.nodes.centerGradient.end },
  ]);
}

function buildDataHubRookiesHighlightGradient(theme, isCenter, echartsApi) {
  return new echartsApi.graphic.RadialGradient(0.34, 0.28, 1, [
    {
      offset: 0,
      color: dataHubAlpha(
        echartsApi,
        theme.nodes.sphere.specularCore,
        isCenter ? 0.54 : 0.42,
      ),
    },
    {
      offset: 0.34,
      color: dataHubAlpha(
        echartsApi,
        theme.nodes.sphere.specularSoft,
        isCenter ? 0.28 : 0.22,
      ),
    },
    { offset: 1, color: theme.nodes.sphere.highlightFade },
  ]);
}

function buildDataHubRookiesTextLayer({
  x,
  y,
  text,
  fill,
  font,
  shadow,
  padding,
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius,
  shadowBlur,
  shadowColor,
}) {
  return {
    type: "text",
    x,
    y,
    silent: true,
    style: {
      text,
      fill,
      font,
      ...(shadow ? {
        shadowColor: shadow.color,
        shadowBlur: shadow.blur,
        shadowOffsetX: shadow.offsetX,
        shadowOffsetY: shadow.offsetY,
      } : {}),
      ...(padding ? { padding } : {}),
      ...(backgroundColor ? { backgroundColor } : {}),
      ...(borderColor ? { borderColor } : {}),
      ...(borderWidth ? { borderWidth } : {}),
      ...(borderRadius ? { borderRadius } : {}),
      ...(shadowBlur ? { shadowBlur } : {}),
      ...(shadowColor ? { shadowColor } : {}),
      textAlign: "center",
      textVerticalAlign: "middle",
    },
  };
}

function getDataHubRookiesPositionUnderlay(item, posShadow) {
  if (item.tier === 1) {
    return posShadow.underlay.center;
  }

  return item.tier === 3 ? posShadow.underlay.tier3 : posShadow.underlay.outer;
}

function buildDataHubRookiesNodeSeries(players, theme, echartsApi) {
  return {
    type: "custom",
    coordinateSystem: "cartesian2d",
    z: 10,
    data: players.map((player, index) => [player.x, player.y, index]),
    renderItem(params, api) {
      const item = players[api.value(2)];
      const isCenter = item.tier === 1;
      const point = api.coord([item.x, item.y]);
      const x = point[0];
      const y = point[1];
      const posTheme = isCenter ? theme.type.pos.center : theme.type.pos.outer;
      const gradeTheme = isCenter ? theme.type.grade.center : theme.type.grade.outer;
      const posShadow = theme.type.pos.shadow;
      const gradeShadow = theme.type.grade.shadow;
      const posTextY = Math.round(
        y
          + item.gradeOffsetY
          - item.posSeparation
          - (isCenter ? theme.type.posLift.center : theme.type.posLift.outer),
      );
      const gradeTextY = Math.round(y + item.gradeOffsetY);
      const underlay = getDataHubRookiesPositionUnderlay(item, posShadow);
      const rimWidth = Math.max(
        isCenter ? theme.nodes.rim.width.center.min : theme.nodes.rim.width.outer.min,
        item.nodeRadius * (
          isCenter ? theme.nodes.rim.width.center.factor : theme.nodes.rim.width.outer.factor
        ),
      );
      const bodyRadius = item.shellRadius - Math.max(0.7, rimWidth * 0.72);
      const shadowOffsetFactor = isCenter
        ? theme.nodes.shadowOffset.center
        : theme.nodes.shadowOffset.outer;
      const specularOffset = isCenter
        ? theme.nodes.specular.offset.center
        : theme.nodes.specular.offset.outer;
      const glintOffset = isCenter
        ? theme.nodes.glint.offset.center
        : theme.nodes.glint.offset.outer;
      const posShadowStyle = {
        color: posShadow.color,
        blur: isCenter ? posShadow.blur.center : posShadow.blur.outer,
        offsetX: posShadow.offsetX,
        offsetY: posShadow.offsetY,
      };
      const gradeShadowStyle = {
        color: gradeShadow.color,
        blur: gradeShadow.blur,
        offsetX: gradeShadow.offsetX,
        offsetY: gradeShadow.offsetY,
      };
      const children = [];

      pushDataHubRookiesCircle(
        children,
        x + Math.round(item.nodeRadius * shadowOffsetFactor * 0.72),
        y + Math.round(item.nodeRadius * shadowOffsetFactor),
        item.shellRadius * (isCenter ? 1.08 : 1.05),
        theme.nodes.shadowFill,
        "transparent",
        0,
        { opacity: isCenter ? 0.58 : 0.82 },
      );
      pushDataHubRookiesCircle(
        children,
        x,
        y,
        item.haloRadius,
        item.color,
        "transparent",
        0,
        {
          opacity: isCenter ? theme.nodes.haloOpacity.center : theme.nodes.haloOpacity.outer,
          shadowBlur: isCenter ? theme.nodes.haloBlur.center : theme.nodes.haloBlur.tiers[item.tier],
          shadowColor: item.color,
        },
      );
      pushDataHubRookiesCircle(
        children,
        x,
        y,
        item.shellRadius,
        buildDataHubRookiesShellGradient(
          item.color,
          isCenter ? theme.nodes.fill.center : theme.nodes.fill.tiers[item.tier],
          theme,
          isCenter,
          echartsApi,
        ),
        "transparent",
        0,
      );
      pushDataHubRookiesCircle(
        children,
        x,
        y,
        item.shellRadius - rimWidth * 0.5,
        "transparent",
        dataHubAlpha(
          echartsApi,
          item.color,
          isCenter ? theme.nodes.rim.alpha.center : theme.nodes.rim.alpha.outer,
        ),
        rimWidth,
      );
      pushDataHubRookiesCircle(
        children,
        x,
        y,
        bodyRadius,
        isCenter
          ? buildDataHubRookiesCenterBodyGradient(item.color, theme, echartsApi)
          : buildDataHubRookiesOuterBodyGradient(
            item.color,
            theme.nodes.fill.tiers[item.tier],
            theme,
            echartsApi,
          ),
        "transparent",
        0,
      );
      pushDataHubRookiesCircle(
        children,
        x + bodyRadius * specularOffset.x,
        y + bodyRadius * specularOffset.y,
        bodyRadius * (
          isCenter ? theme.nodes.specular.radius.center : theme.nodes.specular.radius.outer
        ),
        buildDataHubRookiesHighlightGradient(theme, isCenter, echartsApi),
        "transparent",
        0,
        {
          opacity: isCenter
            ? theme.nodes.specular.opacity.center
            : theme.nodes.specular.opacity.outer,
        },
      );
      pushDataHubRookiesCircle(
        children,
        x + bodyRadius * glintOffset.x,
        y + bodyRadius * glintOffset.y,
        bodyRadius * (isCenter ? theme.nodes.glint.size.center : theme.nodes.glint.size.outer),
        dataHubAlpha(
          echartsApi,
          theme.nodes.sphere.specularGlint,
          isCenter ? theme.nodes.glint.alpha.center : theme.nodes.glint.alpha.outer,
        ),
        "transparent",
        0,
      );

      if (isCenter) {
        pushDataHubRookiesCircle(
          children,
          x,
          y,
          item.innerRadius,
          new echartsApi.graphic.RadialGradient(0.34, 0.28, 0.98, [
            { offset: 0, color: dataHubAlpha(echartsApi, theme.text.strong, 0.14) },
            { offset: 0.26, color: theme.nodes.centerInner.fill },
            { offset: 1, color: dataHubAlpha(echartsApi, item.color, 0.24) },
          ]),
          theme.nodes.centerInner.stroke,
          theme.nodes.centerInner.strokeWidth,
        );
      }

      pushDataHubRookiesCircle(
        children,
        x,
        y,
        bodyRadius + Math.max(0.2, rimWidth * 0.12),
        "transparent",
        dataHubAlpha(
          echartsApi,
          theme.nodes.rim.inner.color,
          isCenter ? theme.nodes.rim.inner.alpha.center : theme.nodes.rim.inner.alpha.outer,
        ),
        isCenter ? theme.nodes.rim.inner.width.center : theme.nodes.rim.inner.width.outer,
      );

      children.push(
        buildDataHubRookiesTextLayer({
          x: x + underlay.offsetX,
          y: posTextY + underlay.offsetY,
          text: item.pos,
          fill: underlay.color,
          font: `${posTheme.weight} ${item.posFontSize + underlay.bump}px ${theme.fontFamily}`,
          shadow: posShadowStyle,
        }),
        buildDataHubRookiesTextLayer({
          x,
          y: posTextY,
          text: item.pos,
          fill: item.posColor,
          font: `${posTheme.weight} ${item.posFontSize}px ${theme.fontFamily}`,
          shadow: posShadowStyle,
        }),
      );

      if (isCenter) {
        children.push(
          buildDataHubRookiesTextLayer({
            x: x + gradeShadow.offsetX * 0.7,
            y: gradeTextY + gradeShadow.offsetY * 0.7,
            text: String(item.grade),
            fill: dataHubAlpha(echartsApi, gradeShadow.color, 0.82),
            font: `${gradeTheme.weight} ${item.gradeFontSize + 0.1}px ${theme.fontFamily}`,
            shadow: gradeShadowStyle,
          }),
          buildDataHubRookiesTextLayer({
            x: x + gradeShadow.underlayOffsetX,
            y: gradeTextY + gradeShadow.underlayOffsetY,
            text: String(item.grade),
            fill: gradeShadow.underlayColor,
            font: `${gradeTheme.weight} ${item.gradeFontSize + gradeShadow.underlayBump}px ${theme.fontFamily}`,
          }),
        );
      }

      children.push(
        buildDataHubRookiesTextLayer({
          x,
          y: gradeTextY,
          text: String(item.grade),
          fill: theme.text.strong,
          font: `${gradeTheme.weight} ${item.gradeFontSize}px ${theme.fontFamily}`,
          shadow: isCenter ? {
            color: gradeShadow.color,
            blur: gradeShadow.blur * 0.34,
            offsetX: gradeShadow.offsetX * 0.32,
            offsetY: gradeShadow.offsetY * 0.32,
          } : null,
        }),
        buildDataHubRookiesTextLayer({
          x,
          y: y + item.nameOffsetY,
          text: item.shortName,
          fill: theme.text.name,
          font: `${theme.type.name.weight} ${item.nameFontSize}px ${theme.fontFamily}`,
          padding: isCenter ? theme.nodes.nameChip.padding.center : theme.nodes.nameChip.padding.outer,
          backgroundColor: isCenter ? theme.nodes.nameChip.bg.center : theme.nodes.nameChip.bg.outer,
          borderColor: dataHubAlpha(
            echartsApi,
            item.color,
            isCenter ? theme.nodes.nameChip.borderAlpha.center : theme.nodes.nameChip.borderAlpha.outer,
          ),
          borderWidth: theme.nodes.nameChip.borderWidth,
          borderRadius: theme.nodes.nameChip.borderRadius,
          shadowBlur: isCenter ? theme.nodes.nameChip.shadowBlur.center : theme.nodes.nameChip.shadowBlur.outer,
          shadowColor: dataHubAlpha(
            echartsApi,
            item.color,
            isCenter ? theme.nodes.nameChip.shadowAlpha.center : theme.nodes.nameChip.shadowAlpha.outer,
          ),
        }),
      );

      return {
        type: "group",
        z2: isCenter ? 20 : 10 + item.tier,
        children,
      };
    },
    tooltip: {
      formatter(params) {
        const item = players[params.dataIndex];

        return `
          <div style="font-family:${theme.fontFamily}; min-width:128px;">
            <div style="font-size:13px; font-weight:700; margin-bottom:5px;">${item.name}</div>
            <div style="font-size:11px; color:${theme.tooltip.muted};">${theme.tiers[item.tier].label} · ${item.pos}</div>
            <div style="margin-top:6px; font-size:12px; font-weight:700;">Grade: ${item.grade}</div>
          </div>
        `;
      },
    },
  };
}

// DataHub rookies chart widget:
// ports the standalone tier-map ECharts widget into the shared desktop/mobile
// chart roots while keeping its own markup, geometry, and resize lifecycle local.
function createDataHubRookiesChartWidget(widgetRoot, widgetKey, chartConfig) {
  ensureDataHubHeroChartMarkup(widgetRoot, chartConfig);
  syncDataHubHeroChartFrame(widgetRoot, chartConfig);

  const shellEl = widgetRoot.querySelector("[data-rookies-chart-shell]");
  const chartEl = widgetRoot.querySelector("[data-chart-canvas]");
  if (!shellEl || !chartEl) {
    return null;
  }

  const echartsApi = getDataHubEchartsApi();
  if (!echartsApi) {
    return {
      key: widgetKey,
      viewKey: chartConfig.key,
      root: widgetRoot,
      resize: () => {},
      dispose: () => {},
    };
  }

  const chart = echartsApi.init(chartEl, null, {
    renderer: "canvas",
    useDirtyRect: true,
  });
  let themeCache = null;
  let lastWidth = 0;
  let lastHeight = 0;
  let renderFrame = 0;

  const getTheme = (force = false) => {
    if (!themeCache || force) {
      themeCache = readDataHubRookiesChartTheme(shellEl, echartsApi);
    }

    return themeCache;
  };

  const syncShellAtmosphere = (layout) => {
    shellEl.style.setProperty("--core-x", `${layout.center.x}px`);
    shellEl.style.setProperty("--core-y", `${layout.center.y}px`);
  };

  const render = (forceTheme = false) => {
    if (chart.isDisposed()) {
      return;
    }

    const width = chartEl.clientWidth;
    const height = chartEl.clientHeight;
    if (!width || !height) {
      return;
    }

    if (!forceTheme && width === lastWidth && height === lastHeight) {
      return;
    }

    lastWidth = width;
    lastHeight = height;

    const theme = getTheme(forceTheme);
    const layout = computeDataHubRookiesChartLayout(width, height, theme);
    const connectorPaths = buildDataHubRookiesConnectorPaths(layout, theme);

    syncShellAtmosphere(layout);
    chart.resize({ width, height });
    chart.setOption({
      animationDuration: 700,
      animationEasing: "cubicOut",
      backgroundColor: "transparent",
      grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
      xAxis: { type: "value", min: 0, max: width, show: false },
      yAxis: { type: "value", min: 0, max: height, inverse: true, show: false },
      tooltip: {
        trigger: "item",
        backgroundColor: theme.tooltip.background,
        borderColor: theme.tooltip.border,
        borderWidth: 1,
        textStyle: {
          color: theme.text.strong,
          fontFamily: theme.fontFamily,
        },
        extraCssText: `box-shadow:${theme.tooltip.shadow}; border-radius:${theme.tooltip.radius}; padding:${theme.tooltip.padding};`,
      },
      graphic: buildDataHubRookiesGraphics(layout, theme),
      series: [
        buildDataHubRookiesConnectorSeries(connectorPaths, theme, false, echartsApi),
        buildDataHubRookiesConnectorSeries(connectorPaths, theme, true, echartsApi),
        buildDataHubRookiesNodeSeries(layout.players, theme, echartsApi),
      ],
    }, true);
  };

  const queueRender = (forceTheme = false) => {
    cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(() => render(forceTheme));
  };

  queueRender(true);

  const resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(() => queueRender())
    : null;
  resizeObserver?.observe(shellEl);

  if (document.fonts?.ready) {
    document.fonts.ready
      .then(() => queueRender(true))
      .catch(() => {});
  }

  return {
    key: widgetKey,
    viewKey: chartConfig.key,
    root: widgetRoot,
    chart,
    resize: () => queueRender(true),
    dispose: () => {
      cancelAnimationFrame(renderFrame);
      resizeObserver?.disconnect();
      if (!chart.isDisposed()) {
        chart.dispose();
      }
    },
  };
}

function openDataHubChartModal() {
  if (!state.isCompactViewport || !chartModal || chartToggleButton?.hidden) {
    return;
  }

  state.isChartModalOpen = true;
  chartModal.classList.remove("hidden");
  chartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("datahub-chart-modal-open");
  chartToggleButton?.setAttribute("aria-expanded", "true");

  requestAnimationFrame(() => {
    const widget = ensureDataHubHeroChartWidget("mobile", state.activePageTab);
    requestAnimationFrame(() => {
      widget?.resize?.();
      chartModalCloseButton?.focus?.();
    });
  });
}

function closeDataHubChartModal({ restoreFocus = true } = {}) {
  if (!chartModal) {
    return;
  }

  state.isChartModalOpen = false;
  chartModal.classList.add("hidden");
  chartModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("datahub-chart-modal-open");
  chartToggleButton?.setAttribute("aria-expanded", "false");

  if (restoreFocus && state.isCompactViewport) {
    chartToggleButton?.focus?.();
  }
}

function resizeDataHubHeroCharts() {
  state.heroChartWidgets.desktop?.resize?.();
  if (state.isChartModalOpen) {
    state.heroChartWidgets.mobile?.resize?.();
  }
}

function getActiveColumnSet() {
  const viewSets = PAGE_VIEW_COLUMN_SETS[state.activePageView] || PAGE_VIEW_COLUMN_SETS.stats;
  return viewSets[state.activeCategory] || viewSets[getDefaultCategory(state.activePageView)] || PAGE_VIEW_COLUMN_SETS.stats.overview;
}

function getActiveColumnGroups() {
  const viewGroups = PAGE_VIEW_COLUMN_GROUPS[state.activePageView] || PAGE_VIEW_COLUMN_GROUPS.stats;
  return viewGroups[state.activeCategory] || viewGroups[getDefaultCategory(state.activePageView)] || PAGE_VIEW_COLUMN_GROUPS.stats.overview;
}

function getActiveFrozenColumnGroups() {
  const frozenGroups = FROZEN_GROUPS[state.activePageView] || FROZEN_GROUPS.stats;
  if (Array.isArray(frozenGroups)) {
    return frozenGroups;
  }

  return frozenGroups[state.activeCategory]
    || frozenGroups[getDefaultCategory(state.activePageView)]
    || FROZEN_GROUPS.stats;
}

// Stats header icon overrides:
// a handful of column names appear in multiple category tables with different
// requested icons, so resolve the active icon from the current stats category
// before falling back to the shared column icon registry.
function getActiveColumnIconMarkup(columnName) {
  if (state.activePageView === "stats") {
    const categoryOverrides = STATS_COLUMN_ICON_OVERRIDES[state.activeCategory];
    if (categoryOverrides?.[columnName]) {
      return categoryOverrides[columnName];
    }
  }

  return COLUMN_ICONS[columnName];
}

function getViewFilterConfig(pageView = state.activePageView) {
  return VIEW_FILTER_CONFIGS[pageView] || VIEW_FILTER_CONFIGS.stats;
}

function getDefaultCategory(pageView = state.activePageView) {
  return getViewFilterConfig(pageView).defaultCategory;
}

function getStoredCategoryForView(pageView = state.activePageView) {
  const viewConfig = getViewFilterConfig(pageView);
  const storedCategory = state.activeCategoryByView?.[pageView];
  const categoryExists = viewConfig.categories.some(({ key }) => key === storedCategory);
  return categoryExists ? storedCategory : viewConfig.defaultCategory;
}

function getActiveViewLabelText() {
  const viewConfig = getViewFilterConfig();
  return viewConfig.activeViewLabels[state.activeCategory]
    || viewConfig.activeViewLabels[viewConfig.defaultCategory]
    || "";
}

function ensureValidActiveSort() {
  const activeColumns = getActiveColumnSet();
  if (activeColumns.includes(state.sort.column) && isSortableColumn(state.sort.column)) {
    return;
  }

  state.sort = createDefaultSort(state.activePageView);
}

function syncSearchInputs(sourceInput = null) {
  playerSearchInputs.forEach((input) => {
    if (input === sourceInput) {
      return;
    }
    if (input.value !== state.searchText) {
      input.value = state.searchText;
    }
  });
}

function getResolvedSortState() {
  ensureValidActiveSort();
  return {
    column: state.sort.column,
    direction: state.sort.direction,
  };
}

function updateSortMetaPill() {
  if (!sortMetaPill) {
    return;
  }

  const { column } = getResolvedSortState();
  const label = document.createElement("span");
  label.className = "meta-pill__label";
  label.textContent = `SORTED BY: ${getColumnLabel(column)}`;

  const iconWrap = document.createElement("span");
  iconWrap.className = "meta-pill__icon";

  // Sort meta pill icon:
  // mirror the same active sort icon used by the matching table header so the
  // shell summary always reflects the exact current sort mode and direction.
  const sortIcon = createSortIndicatorIcon(column);
  if (sortIcon) {
    sortIcon.classList.add("meta-pill__sort-icon");
    iconWrap.append(sortIcon);
  }

  sortMetaPill.replaceChildren(label, iconWrap);
}

function createCategoryChipButton(category, isActive) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "category-chip";
  if (!category.meta) {
    button.classList.add("category-chip--single-line");
  }
  button.dataset.category = category.key;
  button.setAttribute("role", "tab");
  button.setAttribute("aria-selected", String(isActive));
  button.setAttribute("aria-label", category.ariaLabel || category.label);
  button.classList.toggle("is-active", isActive);

  const label = document.createElement("span");
  label.className = "category-chip__label";
  label.textContent = category.label;
  button.append(label);

  if (category.meta) {
    const meta = document.createElement("span");
    meta.className = "category-chip__meta";
    meta.textContent = category.meta;
    button.append(meta);
  }

  return button;
}

function createStatsReceivingCategoryControl(category) {
  const wrapper = document.createElement("div");
  const isExpanded = state.activeCategory === "receiving";
  wrapper.className = "datahub-receiving-filter-shell";
  wrapper.classList.toggle("is-expanded", isExpanded);

  const triggerButton = createCategoryChipButton(category, isExpanded);
  triggerButton.classList.add("datahub-receiving-filter-trigger");
  triggerButton.setAttribute("aria-pressed", String(isExpanded));

  const expandedGroup = document.createElement("div");
  expandedGroup.className = "datahub-receiving-filter-inline";
  expandedGroup.setAttribute("aria-hidden", String(!isExpanded));

  RECEIVING_SUBFILTER_KEYS.forEach((position) => {
    const isActive = Boolean(state.receivingFilters[position]);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-chip category-chip--single-line datahub-receiving-filter-chip";
    button.dataset.receivingFilter = position;
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("is-active", isActive);
    button.textContent = position;
    expandedGroup.append(button);
  });

  wrapper.append(triggerButton, expandedGroup);
  return wrapper;
}

function renderCategoryButtons(viewConfig, categoryRow) {
  if (!categoryRow) {
    return;
  }

  const isTradeFamilyView = isDataHubTradeFamilyView();
  const isStatsFamilyView = isDataHubStatsFamilyView();
  categoryRow.dataset.view = state.activePageView;
  categoryRow.setAttribute(
    "aria-label",
    isTradeFamilyView ? "Trade values position filters" : "Stat categories",
  );

  const fragment = document.createDocumentFragment();
  viewConfig.categories.forEach((category) => {
    if (isStatsFamilyView && category.key === "receiving") {
      // Stats-family receiving category:
      // keep the WR / TE controls inside the original Receiving slot so the
      // interaction matches the dedicated Stats page instead of using a second row.
      fragment.append(createStatsReceivingCategoryControl(category));
      return;
    }

    fragment.append(createCategoryChipButton(category, category.key === state.activeCategory));
  });

  categoryRow.replaceChildren(fragment);
}

function renderReceivingSubfilters(viewConfig, receivingSubfilters) {
  if (!receivingSubfilters) {
    return;
  }

  void viewConfig;
  receivingSubfilters.replaceChildren();
}

// Stats qualifier controls:
// keep the new middle-row dropdowns/toggle mirrored between the desktop and
// mobile mounts while only exposing them in the real Stats table view.
function syncStatsQualifierControls(mount) {
  if (!mount.qualifierRow) {
    return;
  }

  const isStatsView = state.activePageView === "stats";
  mount.qualifierRow.hidden = !isStatsView;
  if (!isStatsView) {
    if (mount.teamFilterMenu) {
      mount.teamFilterMenu.hidden = true;
    }
    if (mount.teamFilterShell) {
      mount.teamFilterShell.dataset.open = "false";
    }
    if (mount.teamFilterToggle) {
      mount.teamFilterToggle.setAttribute("aria-expanded", "false");
    }
    return;
  }

  if (!isAllowedStatsQualifierStat(state.activeCategory, state.statsFilters.qualifierStat)) {
    resetStatsQualifierDefaultsForCategory(state.activeCategory);
  }

  const qualifierConfig = getStatsQualifierConfig(state.activeCategory);
  const statOptions = Object.keys(qualifierConfig.stats).map((statKey) => ({
    value: statKey,
    label: statKey,
  }));
  const qualifiersActive = !state.statsFilters.showAll;
  syncQualifierSelectOptions(
    mount.qualifierStat,
    qualifiersActive
      ? statOptions
      : [{ value: "__show-all__", label: "NA" }],
    qualifiersActive ? state.statsFilters.qualifierStat : "__show-all__",
    !qualifiersActive,
  );

  const thresholdOptions = getStatsQualifierThresholds(
    state.activeCategory,
    state.statsFilters.qualifierStat,
  ).map((threshold) => ({
    value: String(threshold),
    label: formatQualifierThresholdLabel(state.statsFilters.qualifierStat, threshold),
  }));

  if (!thresholdOptions.some((option) => option.value === state.statsFilters.qualifierThreshold)) {
    state.statsFilters.qualifierThreshold = getDefaultThresholdForStat(
      state.activeCategory,
      state.statsFilters.qualifierStat,
    );
  }

  syncQualifierSelectOptions(
    mount.qualifierThreshold,
    qualifiersActive
      ? thresholdOptions
      : [{ value: "__show-all__", label: "-" }],
    qualifiersActive ? state.statsFilters.qualifierThreshold : "__show-all__",
    !qualifiersActive,
  );

  const teamOptions = getDataHubTeamOptions();
  if (!teamOptions.some((option) => option.value === state.statsFilters.team)) {
    state.statsFilters.team = "";
  }
  syncTeamFilterControl(mount, teamOptions);

  if (mount.qualifierShowAll instanceof HTMLInputElement) {
    mount.qualifierShowAll.checked = state.statsFilters.showAll;
  }

  mount.qualifierRow.dataset.showAll = String(state.statsFilters.showAll);
  mount.qualifierRow.dataset.qualifierActive = String(qualifiersActive);
  mount.qualifierStat?.closest(".qualifier-field")?.classList.toggle("is-filtering", qualifiersActive);
  mount.qualifierThreshold?.closest(".qualifier-field")?.classList.toggle("is-filtering", qualifiersActive);
  mount.qualifierStat?.closest(".qualifier-field")?.classList.toggle("is-dimmed", !qualifiersActive);
  mount.qualifierThreshold?.closest(".qualifier-field")?.classList.toggle("is-dimmed", !qualifiersActive);
  mount.qualifierShowAll?.closest(".qualifier-toggle")?.classList.toggle("is-active", state.statsFilters.showAll);
}

function syncQualifierSelectOptions(select, options, selectedValue, isDisabled = false) {
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }

  const fragment = document.createDocumentFragment();
  options.forEach((optionConfig) => {
    const option = document.createElement("option");
    option.value = optionConfig.value;
    option.textContent = optionConfig.label;
    fragment.append(option);
  });

  select.replaceChildren(fragment);
  select.disabled = isDisabled;
  select.value = options.some((option) => option.value === selectedValue)
    ? selectedValue
    : (options[0]?.value || "");
}

function syncTeamFilterControl(mount, options) {
  if (!mount.teamFilterMenu || !mount.teamFilterValue || !mount.teamFilterToggle) {
    return;
  }

  const fragment = document.createDocumentFragment();
  options.forEach((optionConfig) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "team-filter__option";
    button.dataset.teamOption = optionConfig.value;
    button.setAttribute("role", "option");
    const isSelected = optionConfig.value === state.statsFilters.team;
    button.setAttribute("aria-selected", String(isSelected));
    button.classList.toggle("is-active", isSelected);
    button.append(buildTeamFilterContent(optionConfig));
    fragment.append(button);
  });

  mount.teamFilterMenu.replaceChildren(fragment);

  const activeOption = options.find((option) => option.value === state.statsFilters.team)
    || options[0]
    || { value: "", label: "All Teams" };
  mount.teamFilterValue.replaceChildren(buildTeamFilterContent(activeOption, { compact: true }));
  mount.teamFilterShell?.classList.toggle("is-selected", Boolean(state.statsFilters.team));
  mount.teamFilterToggle.setAttribute("aria-expanded", String(mount.teamFilterMenu.hidden === false));
}

function buildTeamFilterContent(optionConfig, options = {}) {
  const { compact = false } = options;
  const wrapper = document.createElement("span");
  wrapper.className = "team-filter__content";

  if (optionConfig.value && optionConfig.value !== "FA") {
    const logo = document.createElement("img");
    logo.className = "team-logo glow team-filter__logo";
    logo.src = getDataHubControlTeamLogoSrc(optionConfig.value);
    logo.alt = optionConfig.label;
    logo.width = compact ? 16 : 18;
    logo.height = compact ? 16 : 18;
    logo.loading = "lazy";
    wrapper.append(logo);
  } else if (optionConfig.value === "FA") {
    const fallback = document.createElement("span");
    fallback.className = "team-filter__fallback";
    fallback.textContent = "FA";
    wrapper.append(fallback);
  }

  const label = document.createElement("span");
  label.className = "team-filter__text";
  label.textContent = optionConfig.label;
  wrapper.append(label);

  return wrapper;
}

function closeAllDataHubTeamMenus() {
  controlMounts.forEach((mount) => {
    if (mount.teamFilterMenu) {
      mount.teamFilterMenu.hidden = true;
    }
    if (mount.teamFilterShell) {
      mount.teamFilterShell.dataset.open = "false";
    }
    if (mount.teamFilterToggle) {
      mount.teamFilterToggle.setAttribute("aria-expanded", "false");
    }
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
    ?? pageTabButtons.find((button) => button.dataset.pageTab === state.activePageTab)
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

// Render the DataHub grid as one persistent shell:
// - frozen header
// - scroll header
// - one shared vertical scroller for both body tables
// - one dedicated horizontal scrollbar for the right-side columns
// The shell only rebuilds when the table structure changes; sorts/searches
// simply repopulate the tbody nodes and preserve scroll positions.
function renderTable() {
  const allColumns = getActiveColumnSet();
  const stickyColumnCount = getStickyColumnCount();
  const frozenNames = allColumns.slice(0, stickyColumnCount);
  const scrollNames = allColumns.slice(stickyColumnCount);
  const { columns: frozenCols, totalWidth: frozenWidth } = buildColumnLayout(frozenNames);
  const { columns: scrollCols, totalWidth: scrollWidth } = buildColumnLayout(
    scrollNames,
    COMPACT_SCROLL_COLUMN_SCALE,
  );
  const nextShellKey = getGridShellKey();
  const savedScroll = saveGridScrollPositions();

  let refs = state.gridRefs;
  if (!refs || state.gridShellKey !== nextShellKey) {
    refs = createGridShell({
      frozenCols,
      frozenWidth,
      scrollCols,
      scrollWidth,
    });
    state.gridRefs = refs;
    state.gridShellKey = nextShellKey;
    gridContainer.replaceChildren(refs.frame);
  } else {
    refs.frozenColumns = frozenCols;
    refs.scrollColumns = scrollCols;
    refs.frame.style.setProperty("--datahub-frozen-width", `${frozenWidth}px`);
    refs.frame.style.setProperty("--datahub-scroll-width", `${scrollWidth}px`);
  }

  renderGridBodyRows(refs);
  updateGridHeaderSortState(refs);
  syncGridContentHeight(refs);
  restoreGridScrollPositions(refs, savedScroll);
}

function getGridShellKey() {
  return [
    state.activePageView,
    state.activeCategory,
    state.isCompactViewport ? "compact" : "regular",
  ].join("|");
}

// Shared-scroll shell:
// the frozen side and the scrollable side live inside one vertical scroller so
// the panes stop chasing each other during touch/wheel scroll.
function createGridShell({ frozenCols, frozenWidth, scrollCols, scrollWidth }) {
  const frame = document.createElement("div");
  frame.className = "table-frame";
  frame.style.setProperty("--datahub-frozen-width", `${frozenWidth}px`);
  frame.style.setProperty("--datahub-scroll-width", `${scrollWidth}px`);

  const frozenCorner = document.createElement("div");
  frozenCorner.className = "datahub-frozen-corner";
  const frozenHeaderTable = buildHeaderTable(
    frozenCols,
    frozenWidth,
    getActiveFrozenColumnGroups(),
    "frozen-header",
  );
  frozenCorner.append(frozenHeaderTable);

  const scrollHeaderShell = document.createElement("div");
  scrollHeaderShell.className = "datahub-scroll-header-shell";
  const scrollHeaderInner = document.createElement("div");
  scrollHeaderInner.className = "datahub-scroll-header-inner";
  const scrollHeaderTable = buildHeaderTable(
    scrollCols,
    scrollWidth,
    getActiveColumnGroups(),
    "scroll-header",
  );
  scrollHeaderInner.append(scrollHeaderTable);
  scrollHeaderShell.append(scrollHeaderInner);

  const vscrollContainer = document.createElement("div");
  vscrollContainer.className = "datahub-vscroll-container";
  const vscrollContent = document.createElement("div");
  vscrollContent.className = "datahub-vscroll-content";

  const frozenBody = document.createElement("div");
  frozenBody.className = "datahub-frozen-body";
  const frozenBodyTable = buildBodyTable(frozenCols, frozenWidth, "frozen-body");
  const frozenBodyTbody = frozenBodyTable.tBodies[0];
  frozenBody.append(frozenBodyTable);

  const scrollBodyOverlay = document.createElement("div");
  scrollBodyOverlay.className = "datahub-scroll-body-overlay";
  const scrollBodyInner = document.createElement("div");
  scrollBodyInner.className = "datahub-scroll-body-inner";
  const scrollBodyTable = buildBodyTable(scrollCols, scrollWidth, "scroll-body");
  const scrollBodyTbody = scrollBodyTable.tBodies[0];
  scrollBodyInner.append(scrollBodyTable);
  scrollBodyOverlay.append(scrollBodyInner);

  vscrollContent.append(frozenBody, scrollBodyOverlay);
  vscrollContainer.append(vscrollContent);

  const hscrollShell = document.createElement("div");
  hscrollShell.className = "datahub-hscroll-shell";
  const hscrollBar = document.createElement("div");
  hscrollBar.className = "datahub-hscroll-bar";
  const hscrollSpacer = document.createElement("div");
  hscrollSpacer.className = "datahub-hscroll-spacer";
  hscrollBar.append(hscrollSpacer);
  hscrollShell.append(hscrollBar);

  frame.append(frozenCorner, scrollHeaderShell, vscrollContainer, hscrollShell);

  const refs = {
    frame,
    frozenColumns: frozenCols,
    scrollColumns: scrollCols,
    frozenHeaderTable,
    scrollHeaderShell,
    scrollHeaderInner,
    scrollHeaderTable,
    vscrollContainer,
    vscrollContent,
    frozenBody,
    frozenBodyTable,
    frozenBodyTbody,
    scrollBodyOverlay,
    scrollBodyInner,
    scrollBodyTable,
    scrollBodyTbody,
    hscrollBar,
    hscrollSpacer,
    horizontalSyncFrame: 0,
    pendingScrollLeft: 0,
    headerCells: Array.from(frame.querySelectorAll("th[data-column-name]")),
  };

  bindGridShellEvents(refs);
  syncGridHorizontalOffset(refs, 0);
  return refs;
}

function buildHeaderTable(columns, totalWidth, groups, paneType) {
  const table = createTableBase(
    columns,
    totalWidth,
    paneType,
    paneType.startsWith("frozen") ? "Player identity header" : "Player stats header",
  );
  const thead = document.createElement("thead");
  thead.append(buildGroupHeaderRow(columns, groups));
  const columnIconColors = buildColumnIconColorMap(groups);

  // Compute group-start columns so the column header cells at each group
  // boundary get a matching left border that connects to the group header row
  // border-right directly above them.
  const groupStartCols = getGroupStartColumnSet(groups);

  const columnRow = document.createElement("tr");
  columns.forEach((column) => {
    const th = createHeaderCell(column, columnIconColors.get(column.name));
    if (groupStartCols.has(column.name)) {
      th.classList.add("stats-table__header-cell--group-start");
    }
    columnRow.append(th);
  });
  thead.append(columnRow);
  table.append(thead);
  return table;
}

function buildColumnIconColorMap(groups) {
  const colorMap = new Map();
  groups.forEach((group) => {
    group.columns.forEach((columnName) => {
      // Group header exceptions:
      // some rookie columns, like TM inside Prospect Overview, need a per-column
      // header icon color while still belonging to a different group header.
      const color = group.columnIconColors?.[columnName]
        || group.columnIconColor
        || group.groupIconColor
        || group.iconColor;
      if (!color) {
        return;
      }
      colorMap.set(columnName, color);
    });
  });
  return colorMap;
}

function buildBodyTable(columns, totalWidth, paneType) {
  const table = createTableBase(
    columns,
    totalWidth,
    paneType,
    paneType.startsWith("frozen") ? "Player identity columns" : "Player stats columns",
  );
  table.append(document.createElement("tbody"));
  return table;
}

function createTableBase(columns, totalWidth, paneType, ariaLabel) {
  const table = document.createElement("table");
  table.className = "stats-table";
  table.dataset.pane = paneType;
  table.setAttribute("aria-label", ariaLabel);
  table.style.setProperty("--table-width", `${totalWidth}px`);

  const colgroup = document.createElement("colgroup");
  columns.forEach((column) => {
    const col = document.createElement("col");
    col.style.width = `${column.width}px`;
    col.style.minWidth = `${column.width}px`;
    col.style.maxWidth = `${column.width}px`;
    colgroup.append(col);
  });
  table.append(colgroup);
  return table;
}

function renderGridBodyRows(refs) {
  // Compute group-start columns for the scroll body so each body row can carry
  // a left-border class that visually connects to the group header row borders.
  const activeGroups = getActiveColumnGroups();
  const scrollGroupStartCols = getGroupStartColumnSet(activeGroups);

  renderTableBody(refs.frozenBodyTbody, refs.frozenColumns, false);
  renderTableBody(refs.scrollBodyTbody, refs.scrollColumns, true, scrollGroupStartCols);
}

function renderTableBody(tbody, columns, showEmptyState, groupStartCols = new Set()) {
  const fragment = document.createDocumentFragment();

  if (showEmptyState && !state.displayedRows.length) {
    fragment.append(createEmptyStateRow(columns.length));
  } else {
    state.displayedRows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      tr.className = "stats-table__body-row";
      tr.dataset.rowIndex = rowIndex;
      applyRookieCareerTierSeparatorRowState(tr, row, rowIndex);
      columns.forEach((column) => tr.append(createBodyCell(row, column, rowIndex, groupStartCols)));
      fragment.append(tr);
    });
  }

  tbody.replaceChildren(fragment);
}

function applyRookieCareerTierSeparatorRowState(tr, row, rowIndex) {
  if (!shouldRenderRookieCareerTierSeparators()) {
    return;
  }

  const tier = getRookieTierStyleLevel(row?.TIER);
  if (tier < 2 || tier > 8) {
    return;
  }

  const previousTier = rowIndex > 0
    ? getRookieTierStyleLevel(state.displayedRows[rowIndex - 1]?.TIER)
    : 0;
  if (previousTier === tier) {
    return;
  }

  // Rankings & Career Stats tier separators:
  // mark only the first rendered row for each T2+ tier in the default RK sort.
  // Any alternate table sort skips these classes so tier borders do not drift
  // into arbitrary positions after players are reordered.
  tr.classList.add(
    "stats-table__body-row--rookie-tier-start",
    `stats-table__body-row--rookie-tier-start-${tier}`,
  );
}

function shouldRenderRookieCareerTierSeparators() {
  if (!isDataHubRookiesCareerView()) {
    return false;
  }

  const defaultSort = createDefaultSort("rookies-career");
  return getActiveSortColumn() === defaultSort.column
    && state.sort.direction === defaultSort.direction;
}

function updateGridHeaderSortState(refs) {
  refs.headerCells.forEach((headerCell) => {
    const columnName = headerCell.dataset.columnName;
    headerCell.setAttribute("aria-sort", getAriaSort(columnName));

    const indicator = headerCell.querySelector(".stats-table__sort-indicator");
    if (!indicator) {
      return;
    }

    const sortIcon = createSortIndicatorIcon(columnName);
    indicator.replaceChildren();
    indicator.classList.toggle("is-active", Boolean(sortIcon));
    if (sortIcon) {
      indicator.append(sortIcon);
    }
  });
}

// Shared body-height contract:
// body wrappers are absolutely positioned, so one measured content height keeps
// the shared vertical scroller aligned without row-by-row height syncing.
function syncGridContentHeight(refs) {
  const maxHeight = Math.max(
    refs.frozenBodyTable.offsetHeight,
    refs.scrollBodyTable.offsetHeight,
    0,
  );

  const nextHeight = maxHeight > 0 ? `${maxHeight}px` : "100%";
  refs.frozenBody.style.height = nextHeight;
  refs.scrollBodyOverlay.style.height = nextHeight;
  refs.vscrollContent.style.height = nextHeight;
  refs.vscrollContent.style.minHeight = nextHeight;
}

function bindGridShellEvents(refs) {
  refs.hscrollBar.addEventListener("scroll", () => {
    state.gridScroll.horizontal = refs.hscrollBar.scrollLeft;
    scheduleGridHorizontalSync(refs, refs.hscrollBar.scrollLeft);
  }, { passive: true });

  refs.vscrollContainer.addEventListener("scroll", () => {
    state.gridScroll.vertical = refs.vscrollContainer.scrollTop;
  }, { passive: true });

  const surfaces = [
    refs.vscrollContainer,
    refs.frozenBody,
    refs.scrollBodyOverlay,
    refs.scrollHeaderShell,
  ];
  surfaces.forEach((surface) => {
    surface.addEventListener("wheel", (event) => {
      routeGridHorizontalWheel(event, refs);
    }, { passive: false });
  });

  attachGridTouchHorizontalScroll(refs.frozenBody, refs);
  attachGridTouchHorizontalScroll(refs.scrollBodyOverlay, refs);
  attachGridTouchHorizontalScroll(refs.scrollHeaderShell, refs);
}

function routeGridHorizontalWheel(event, refs) {
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
    ? event.deltaX
    : (event.shiftKey ? event.deltaY : 0);
  if (!delta) {
    return;
  }

  const previousScrollLeft = refs.hscrollBar.scrollLeft;
  refs.hscrollBar.scrollLeft += delta;
  if (refs.hscrollBar.scrollLeft !== previousScrollLeft) {
    state.gridScroll.horizontal = refs.hscrollBar.scrollLeft;
    scheduleGridHorizontalSync(refs, refs.hscrollBar.scrollLeft);
    event.preventDefault();
  }
}

function attachGridTouchHorizontalScroll(surface, refs) {
  let touchActive = false;
  let isHorizontalGesture = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTouchX = 0;
  let lastTimestamp = 0;
  const DECELERATION_RATE = 0.998;
  const VELOCITY_HISTORY_LIMIT = 6;
  const MOMENTUM_START_VELOCITY = 0.08;
  const MOMENTUM_STOP_VELOCITY = 0.015;
  const MIN_VELOCITY_SAMPLE_MS = 8;
  const HORIZONTAL_THRESHOLD = 1;
  const DIRECTION_LOCK_RATIO = 1.1;
  const velocitySamples = [];
  let lastVelocitySign = 0;
  let momentumFrame = 0;

  const cancelMomentum = () => {
    if (momentumFrame) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = 0;
    }
  };

  const applyImmediateScroll = (deltaX) => {
    const before = refs.hscrollBar.scrollLeft;
    const after = setGridHorizontalScrollLeft(refs, before - deltaX);
    return after !== before;
  };

  const startMomentum = (initialVelocity) => {
    cancelMomentum();
    if (!Number.isFinite(initialVelocity) || Math.abs(initialVelocity) < MOMENTUM_START_VELOCITY) {
      return;
    }

    let velocity = initialVelocity;
    let previousFrameTime = performance.now();
    const MAX_ELAPSED_MS = 64;
    const STEP_MAX_MS = 16;

    const step = (now) => {
      const elapsed = Math.min(now - previousFrameTime, MAX_ELAPSED_MS);
      previousFrameTime = now;
      let remaining = elapsed;

      while (remaining > 0) {
        const dt = Math.min(remaining, STEP_MAX_MS);
        const delta = velocity * dt;
        if (delta !== 0) {
          const moved = applyImmediateScroll(delta);
          if (!moved) {
            momentumFrame = 0;
            return;
          }
        }

        velocity *= Math.pow(DECELERATION_RATE, dt);
        remaining -= dt;
        if (Math.abs(velocity) <= MOMENTUM_STOP_VELOCITY) {
          break;
        }
      }

      if (Math.abs(velocity) > MOMENTUM_STOP_VELOCITY) {
        momentumFrame = requestAnimationFrame(step);
      } else {
        momentumFrame = 0;
      }
    };

    momentumFrame = requestAnimationFrame(step);
  };

  const resetTouchState = () => {
    touchActive = false;
    isHorizontalGesture = null;

    if (velocitySamples.length >= 2) {
      let weightedSum = 0;
      let weightTotal = 0;
      for (let index = 0; index < velocitySamples.length; index += 1) {
        const weight = index + 1;
        weightedSum += velocitySamples[index] * weight;
        weightTotal += weight;
      }
      startMomentum(weightTotal ? (weightedSum / weightTotal) : 0);
    }

    velocitySamples.length = 0;
    lastVelocitySign = 0;
  };

  surface.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    cancelMomentum();
    touchActive = true;
    isHorizontalGesture = null;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    lastTouchX = touch.clientX;
    lastTimestamp = event.timeStamp;
    velocitySamples.length = 0;
    lastVelocitySign = 0;
  }, { passive: true });

  surface.addEventListener("touchmove", (event) => {
    if (!touchActive || event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    const deltaXFromStart = touch.clientX - touchStartX;
    const deltaYFromStart = touch.clientY - touchStartY;
    const deltaX = touch.clientX - lastTouchX;
    const elapsed = event.timeStamp - lastTimestamp;

    if (isHorizontalGesture === null) {
      const absX = Math.abs(deltaXFromStart);
      const absY = Math.abs(deltaYFromStart);
      if (absX > HORIZONTAL_THRESHOLD && absX > absY * DIRECTION_LOCK_RATIO) {
        isHorizontalGesture = true;
      } else if (absY > HORIZONTAL_THRESHOLD && absY > absX * DIRECTION_LOCK_RATIO) {
        isHorizontalGesture = false;
      }
    }

    if (isHorizontalGesture) {
      event.preventDefault();

      if (elapsed >= MIN_VELOCITY_SAMPLE_MS) {
        const instantaneousVelocity = deltaX / elapsed;
        const sign = Math.sign(instantaneousVelocity);
        if (sign !== 0 && lastVelocitySign !== 0 && sign !== lastVelocitySign) {
          velocitySamples.length = 0;
        }
        if (sign !== 0) {
          lastVelocitySign = sign;
        }
        velocitySamples.push(instantaneousVelocity);
        if (velocitySamples.length > VELOCITY_HISTORY_LIMIT) {
          velocitySamples.shift();
        }
      }

      if (deltaX !== 0) {
        const moved = applyImmediateScroll(deltaX);
        if (!moved) {
          velocitySamples.length = 0;
          lastVelocitySign = 0;
        }
      }
    }

    lastTouchX = touch.clientX;
    lastTimestamp = event.timeStamp;
  }, { passive: false });

  surface.addEventListener("touchend", resetTouchState, { passive: true });
  surface.addEventListener("touchcancel", resetTouchState, { passive: true });
}

function setGridHorizontalScrollLeft(refs, nextScrollLeft) {
  refs.hscrollBar.scrollLeft = nextScrollLeft;
  const appliedScrollLeft = refs.hscrollBar.scrollLeft;
  state.gridScroll.horizontal = appliedScrollLeft;
  syncGridHorizontalOffset(refs, appliedScrollLeft);
  return appliedScrollLeft;
}

function scheduleGridHorizontalSync(refs, scrollLeft) {
  refs.pendingScrollLeft = scrollLeft;
  if (refs.horizontalSyncFrame) {
    return;
  }

  refs.horizontalSyncFrame = requestAnimationFrame(() => {
    refs.horizontalSyncFrame = 0;
    syncGridHorizontalOffset(refs, refs.pendingScrollLeft);
  });
}

function syncGridHorizontalOffset(refs, scrollLeft) {
  refs.scrollHeaderInner.style.transform = `translate3d(-${scrollLeft}px, 0, 0)`;
  refs.scrollBodyInner.style.transform = `translate3d(-${scrollLeft}px, 0, 0)`;
}

function saveGridScrollPositions() {
  const nextScroll = {
    horizontal: state.gridRefs?.hscrollBar?.scrollLeft ?? state.gridScroll.horizontal,
    vertical: state.gridRefs?.vscrollContainer?.scrollTop ?? state.gridScroll.vertical,
  };
  state.gridScroll = nextScroll;
  return nextScroll;
}

function restoreGridScrollPositions(refs, savedScroll = state.gridScroll) {
  const horizontal = Math.max(0, savedScroll?.horizontal ?? 0);
  refs.hscrollBar.scrollLeft = horizontal;
  syncGridHorizontalOffset(refs, refs.hscrollBar.scrollLeft);

  const maxVertical = Math.max(
    0,
    refs.vscrollContainer.scrollHeight - refs.vscrollContainer.clientHeight,
  );
  refs.vscrollContainer.scrollTop = Math.min(
    Math.max(0, savedScroll?.vertical ?? 0),
    maxVertical,
  );

  state.gridScroll = {
    horizontal: refs.hscrollBar.scrollLeft,
    vertical: refs.vscrollContainer.scrollTop,
  };
}

function isSortableColumn(columnName) {
  if (columnName === RK_COLUMN) {
    return state.activePageView === "rookies-career";
  }

  return !NON_SORTABLE_COLUMNS.has(columnName);
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

function appendDataHubIconMarkup(svg, iconMarkup) {
  if (!iconMarkup) {
    return;
  }

  if (iconMarkup.startsWith("<")) {
    svg.innerHTML = iconMarkup;
    return;
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconMarkup);
  svg.append(path);
}

function createHeaderCell(column, columnIconColor) {
  const th = document.createElement("th");
  th.className = "stats-table__header-cell";
  th.dataset.columnName = column.name;
  th.scope = "col";
  applyColumnStyle(th, column);
  th.setAttribute("aria-sort", getAriaSort(column.name));

  // RK header handling:
  // most DataHub views keep rank static, while rookies-career opts into source
  // rank sorting so the same header cell can become interactive in that mode.
  const isSortable = isSortableColumn(column.name);
  const headerControl = document.createElement(isSortable ? "button" : "div");
  headerControl.className = "stats-table__head-button";
  if (isSortable) {
    headerControl.type = "button";
    headerControl.setAttribute("aria-label", `Sort by ${column.name}`);
    headerControl.addEventListener("click", () => handleHeaderSort(column.name));
  } else {
    headerControl.classList.add("stats-table__head-button--static");
  }

  // Column icon coloring:
  // the Stats rebuild uses group-owned column colors that are separate from the
  // group-header icon color so future header-icon recolors stay isolated.
  const iconMarkup = getActiveColumnIconMarkup(column.name);
  if (iconMarkup) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.classList.add("stats-table__head-icon");
    if (columnIconColor) {
      svg.style.setProperty("--column-icon-color", columnIconColor);
    }
    appendDataHubIconMarkup(svg, iconMarkup);
    headerControl.append(svg);
  }

  const label = document.createElement("span");
  label.className = "stats-table__head-label";
  label.textContent = getColumnLabel(column.name);

  headerControl.append(label);

  if (isSortable) {
    const indicator = document.createElement("span");
    indicator.className = "stats-table__sort-indicator";
    indicator.setAttribute("aria-hidden", "true");
    const sortIcon = createSortIndicatorIcon(column.name);
    if (sortIcon) {
      indicator.classList.add("is-active");
      indicator.append(sortIcon);
    }
    headerControl.append(indicator);
  }

  th.append(headerControl);
  return th;
}

function createBodyCell(row, column, rowIndex, groupStartCols = new Set()) {
  const rawValue = row[column.name];
  const value = column.name === RK_COLUMN
    ? (state.activePageView === "rookies-career" ? rawValue : String(rowIndex + 1))
    : rawValue;
  const td = document.createElement("td");
  td.classList.add("stats-table__body-cell");

  // Mark body cells at column-group boundaries so CSS can draw a continuous
  // vertical separator that connects to the group header row border above.
  if (groupStartCols.has(column.name)) {
    td.classList.add("stats-table__body-cell--group-start");
  }

  applyColumnStyle(td, column);

  td.classList.add(...getCellClassNames(column.name, value, row));
  td.title = BLANK_PLACEHOLDER_COLUMNS.has(column.name) ? "" : formatCellValue(value);

  const content = document.createElement("div");
  content.className = "stats-table__cell-content";

  // DataHub player trigger:
  // the frozen PLAYER cell becomes the page-local game logs launcher so taps and
  // clicks can open the DataHub-owned modal without app.js.
  if (column.name === PLAYER_COLUMN) {
    content.append(createPlayerTriggerButton(row));
  } else if (column.name === RK_COLUMN) {
    // RK display rank:
    // rookies-career preserves the imported source rank text (including NR),
    // while the other DataHub views continue to show rendered table order.
    content.textContent = value;
  } else if (column.name === "TM") {
    // DataHub TM cell logo swap:
    // render the same team-logo treatment used by the local modal so the table
    // shows logos while sort/search still operate on the raw team abbreviation.
    content.append(createDataHubTableTeamLogo(rawValue));
  } else if (isDataHubTradeFamilyView() && isTradeValuesRichColumn(column.name)) {
    // Trade Values table renderers:
    // keep the stored cell data numeric for sorting and heat formatting, while
    // the displayed KTC and DIFF cells add the requested rank/suffix typography.
    content.append(createTradeValuesRichCell(column.name, row, value));
  } else if (column.name === FPTS_COLUMN && !isMissingValue(value)) {
    content.append(createFptsChip(value));
  } else if (column.name === "POS") {
    // POS column badge:
    // replace plain position text with a pill-shaped badge that shows a colored
    // dot + position abbreviation. Rendered for both desktop and mobile tables.
    content.append(createPosBadge(value));
  } else {
    content.textContent = formatDisplayValue(column.name, value);
  }

  td.append(content);
  return td;
}

function createPlayerTriggerButton(row) {
  const playerLabel = formatDisplayValue(PLAYER_COLUMN, row.PLAYER);
  if (!canOpenDataHubGameLogs(row)) {
    const text = document.createElement("span");
    text.className = "stats-player-btn stats-player-btn--static";
    text.textContent = playerLabel;
    return text;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "stats-player-btn";
  button.setAttribute("aria-label", `Open game logs for ${playerLabel}`);
  button.textContent = playerLabel;
  button.addEventListener("click", () => {
    openDataHubGameLogs(row, button);
  });
  return button;
}

function createDataHubTableTeamLogo(value) {
  const teamKey = String(value || "FA").trim().toUpperCase() || "FA";
  if (!teamKey || teamKey === "FA" || isMissingValue(teamKey)) {
    return createDataHubTableTeamFallback("FA");
  }

  // Trade Values sheet-only teams:
  // rookies currently use UD and pick rows use ordinal team placeholders like
  // 1st, so these entries should stay as clean text chips instead of loading
  // NFL logo assets that do not exist for those pseudo-team values.
  if (teamKey === "UD" || /\d+(?:ST|ND|RD|TH)$/.test(teamKey)) {
    return createDataHubTableTeamFallback(teamKey);
  }

  const logo = document.createElement("img");
  logo.className = "team-logo glow";
  logo.src = getDataHubTeamLogoSrc(teamKey);
  logo.alt = teamKey;
  logo.width = 20;
  logo.height = 20;
  logo.loading = "eager";
  logo.decoding = "async";
  logo.addEventListener("error", () => {
    if (logo.isConnected) {
      logo.replaceWith(createDataHubTableTeamFallback(teamKey));
    }
  }, { once: true });
  return logo;
}

function createDataHubTableTeamFallback(teamKey) {
  const fallback = document.createElement("span");
  fallback.className = "stats-table__team-fallback";
  fallback.textContent = teamKey;
  return fallback;
}

function canOpenDataHubGameLogs(rowOrMeta) {
  const meta = rowOrMeta?.__meta || rowOrMeta;
  return Boolean(meta?.hasGameLogsSupport && meta?.playerId && meta.pos !== "RDP");
}

function createFptsChip(value) {
  const chip = document.createElement("span");
  const tier = getFormattingTier(FPTS_COLUMN, value);
  chip.className = `stats-table__fpts-chip stats-table__fpts-chip--tier-${tier}`;
  chip.textContent = formatDisplayValue(FPTS_COLUMN, value);
  return chip;
}

// DataHub POS column badge:
// renders a compact pill-shaped position badge (QB/RB/WR/TE) with a colored
// dot and position text. Used in place of plain text in the POS column for
// both the Stats and Trade Values tables on desktop and mobile.
const POS_BADGE_COLORS = Object.freeze({
  QB: "#ff4187",
  RB: "#06ffa8",
  WR: "#3881ff",
  TE: "#7f2fff",
});

function createPosBadge(posValue) {
  const pos = String(posValue || "").trim().toUpperCase();
  const color = POS_BADGE_COLORS[pos] || "rgba(202, 222, 247, 0.7)";

  const badge = document.createElement("span");
  badge.className = `dh-pos-badge dh-pos-badge--${pos.toLowerCase()}`;

  // Colored dot — matches the badge text color per position spec
  const dot = document.createElement("span");
  dot.className = "dh-pos-badge__dot";
  dot.setAttribute("aria-hidden", "true");
  dot.style.background = color;

  const label = document.createElement("span");
  label.className = "dh-pos-badge__label";
  label.textContent = pos || "—";

  badge.append(dot, label);
  return badge;
}

function isTradeValuesRichColumn(columnName) {
  return columnName === "KTC 1QB"
    || columnName === "KTC SFLX"
    || columnName === "1QB DIFF"
    || columnName === "SFLX DIFF";
}

function createTradeValuesRichCell(columnName, row, value) {
  const meta = row.__meta || {};
  const wrapper = document.createElement("span");
  wrapper.className = "trade-value-metric";

  const valueNode = document.createElement("span");
  valueNode.className = "trade-value-metric__value";
  valueNode.textContent = formatDisplayValue(columnName, value);
  wrapper.append(valueNode);

  const annotation = buildTradeValuesAnnotation(columnName, meta);
  if (annotation) {
    wrapper.append(annotation);
  }

  return wrapper;
}

function buildTradeValuesAnnotation(columnName, meta) {
  if (columnName === "KTC 1QB" || columnName === "KTC SFLX") {
    const rank = columnName === "KTC 1QB" ? meta.ktcOneQbRank : meta.ktcSflxRank;
    if (!Number.isFinite(rank)) {
      return null;
    }

    const annotation = document.createElement("span");
    annotation.className = "trade-value-metric__annotation";

    const open = document.createElement("span");
    open.className = "trade-value-metric__annotation-bracket";
    open.textContent = "(";

    const rankNumber = document.createElement("span");
    rankNumber.className = "trade-value-metric__rank-number";
    rankNumber.textContent = String(Math.round(rank));

    const suffix = document.createElement("span");
    suffix.className = "trade-value-metric__rank-suffix";
    suffix.textContent = getDataHubOrdinalSuffix(rank);

    const close = document.createElement("span");
    close.className = "trade-value-metric__annotation-bracket";
    close.textContent = ")";

    annotation.append(open, rankNumber, suffix, close);
    return annotation;
  }

  if (columnName === "1QB DIFF" || columnName === "SFLX DIFF") {
    const winner = columnName === "1QB DIFF" ? meta.diffOneQbWinner : meta.diffSflxWinner;
    if (!winner) {
      return null;
    }

    const suffix = document.createElement("span");
    suffix.className = "trade-value-metric__diff-suffix";
    // Trade Values DIFF suffix:
    // mark the winner source on the suffix itself so CSS can color ADP and
    // KTC independently without affecting the numeric portion of the cell.
    suffix.dataset.diffWinner = winner;
    suffix.textContent = winner;
    return suffix;
  }

  return null;
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

function getColumnLabel(columnName) {
  const baseLabel = Object.prototype.hasOwnProperty.call(COLUMN_LABELS, columnName)
    ? COLUMN_LABELS[columnName]
    : columnName;

  if (!isDataHubRookiesCareerView()) {
    return baseLabel;
  }

  if (state.activeCategory === "overview" && columnName === "GRD") {
    return "GRADE";
  }

  if (columnName === "paATT_EFF") {
    return "ATT";
  }

  return baseLabel.replace(/^(pa|ru|rec)/, "");
}

// ---------------------------------------------------------------------------
// Group header row builder
// ---------------------------------------------------------------------------
function buildGroupHeaderRow(columns, groups) {
  const tr = document.createElement("tr");
  void columns;

  groups.forEach((group) => {
    const th = document.createElement("th");
    th.className = "stats-table__group-header-cell";
    th.colSpan = group.columns.length;
    if (group.ariaLabel) {
      th.setAttribute("aria-label", group.ariaLabel);
    }

    const inner = document.createElement("div");
    inner.className = "stats-table__group-header-inner";

    if (group.icon) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.classList.add("stats-table__group-header-icon");
      const groupIconColor = group.groupIconColor || group.iconColor;
      if (groupIconColor) {
        svg.style.setProperty("--group-icon-color", groupIconColor);
      }
      appendDataHubIconMarkup(svg, group.icon);
      inner.append(svg);
    }

    // Icon-only groups:
    // rookie career TM/AGE uses a General icon without repeating the General
    // text label; all regular groups continue to render their visible label.
    if (group.label) {
      const label = document.createElement("span");
      label.textContent = group.label;
      inner.append(label);
    }

    th.append(inner);
    tr.append(th);
  });

  return tr;
}

// ---------------------------------------------------------------------------
// Group separator helpers
// ---------------------------------------------------------------------------
// Compute a Set of column names that begin a new group boundary.
// The first group is skipped because there is no separator before it.
// Used to apply matching left-border classes on column header th and body td
// cells so the visual divider connects to the group header row border above.
function getGroupStartColumnSet(groups) {
  const set = new Set();
  if (!groups || groups.length < 2) return set;
  for (let i = 1; i < groups.length; i++) {
    const group = groups[i];
    if (group.columns && group.columns.length > 0) {
      set.add(group.columns[0]);
    }
  }
  return set;
}

// ---------------------------------------------------------------------------
// Sorting, filtering, and viewport responsiveness
// ---------------------------------------------------------------------------
function getAriaSort(columnName) {
  if (!isSortableColumn(columnName)) {
    return "none";
  }

  if (getActiveSortColumn() !== columnName) {
    return "none";
  }

  return state.sort.direction === "asc" ? "ascending" : "descending";
}

function createDefaultSort(pageView = "stats") {
  const defaultSort = DEFAULT_SORT_BY_VIEW[pageView] || DEFAULT_SORT_BY_VIEW.stats;
  return { ...defaultSort };
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
  if (!isSortableColumn(columnName)) {
    return null;
  }

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
  if (!isSortableColumn(columnName)) {
    return;
  }

  // DataHub table sort cycle:
  // most columns use preferred -> opposite -> reset-to-view-default, while the
  // active view's default column cycles default -> opposite -> default.
  const defaultSort = createDefaultSort(state.activePageView);

  if (columnName === defaultSort.column) {
    if (state.sort.column === columnName && state.sort.direction === defaultSort.direction) {
      state.sort = {
        column: columnName,
        direction: getOppositeSortDirection(defaultSort.direction),
      };
    } else {
      state.sort = defaultSort;
    }
    applySortedRows();
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
    state.sort = defaultSort;
  }

  applySortedRows();
}

function getVisibleRows() {
  const predicate = CATEGORY_FILTERS[state.activeCategory]
    || CATEGORY_FILTERS[getDefaultCategory(state.activePageView)]
    || CATEGORY_FILTERS.overview;
  return state.rows.filter((row) => {
    if (!predicate(row, state)) {
      return false;
    }

    if (state.activePageView === "stats" && !matchesStatsControlFilters(row)) {
      return false;
    }

    if (state.activePageView === "adp-values" && !matchesTradeEntityFilters(row)) {
      return false;
    }

    return true;
  });
}

function matchesStatsControlFilters(row) {
  return matchesStatsQualifierFilter(row) && matchesStatsTeamFilter(row);
}

function matchesStatsQualifierFilter(row) {
  if (state.statsFilters.showAll) {
    return true;
  }

  const qualifierValue = toComparableNumber(row[state.statsFilters.qualifierStat]);
  const thresholdValue = toComparableNumber(state.statsFilters.qualifierThreshold);

  if (!Number.isFinite(qualifierValue) || !Number.isFinite(thresholdValue)) {
    return false;
  }

  return qualifierValue >= thresholdValue;
}

function matchesStatsTeamFilter(row) {
  if (!state.statsFilters.team) {
    return true;
  }

  return String(row.TM || "").trim() === state.statsFilters.team;
}

function matchesTradeEntityFilters(row) {
  const tradeEntityBucket = String(row?.__meta?.tradeEntityBucket || "").trim().toLowerCase();
  if (tradeEntityBucket === "pick") {
    return Boolean(state.tradeEntityFilters.picks);
  }
  if (tradeEntityBucket === "rookie") {
    return Boolean(state.tradeEntityFilters.rookies);
  }
  if (tradeEntityBucket === "vet") {
    return Boolean(state.tradeEntityFilters.vets);
  }
  return true;
}

function matchesSearch(row) {
  const query = state.searchText.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return getActiveColumnSet().some((columnName) => {
    const value = row[columnName];
    return !isMissingValue(value) && String(value).toLowerCase().includes(query);
  });
}

function sortRows(rows) {
  const sortColumn = getActiveSortColumn();
  if (isDataHubRookiesCareerView() && sortColumn === RK_COLUMN) {
    return rows
      .map((row, index) => ({ row, index }))
      .sort((left, right) => {
        const rankResult = compareRookieCareerRankRows(
          left.row,
          right.row,
          state.sort.direction,
        );
        if (rankResult !== 0) {
          return rankResult;
        }

        const posFallback = comparePreparedGridValues(
          toComparableValue(left.row.POS),
          toComparableValue(right.row.POS),
        );
        if (posFallback !== 0) {
          return posFallback;
        }

        return left.index - right.index;
      })
      .map((entry) => entry.row);
  }

  const directionMultiplier = state.sort.direction === "desc" ? -1 : 1;
  const sortableRows = filterRowsForActiveSort(rows, sortColumn);

  return sortableRows
    .map((row, index) => ({
      row,
      index,
      rookieBottomPriority: getRookieSortBottomPriority(row, sortColumn),
      primaryValue: toComparableValue(row[sortColumn]),
      rankValue: sortColumn === "RK" ? null : toComparableValue(row.RK),
      playerValue: toComparableValue(row.PLAYER),
      posValue: toComparableValue(row.POS),
    }))
    .sort((left, right) => {
      const rookieBottomResult = left.rookieBottomPriority - right.rookieBottomPriority;
      if (rookieBottomResult !== 0) {
        return rookieBottomResult;
      }

      const primaryResult = comparePreparedGridValues(left.primaryValue, right.primaryValue);
      if (primaryResult !== 0) {
        return primaryResult * directionMultiplier;
      }

      if (sortColumn !== "RK") {
        const rankFallback = isDataHubRookiesCareerView()
          ? compareRookieCareerRankRows(left.row, right.row, "asc", { includePlayerFallback: false })
          : comparePreparedGridValues(left.rankValue, right.rankValue);
        if (rankFallback !== 0) {
          return rankFallback;
        }
      }

      const playerFallback = comparePreparedGridValues(left.playerValue, right.playerValue);
      if (playerFallback !== 0) {
        return playerFallback;
      }

      const posFallback = comparePreparedGridValues(left.posValue, right.posValue);
      if (posFallback !== 0) {
        return posFallback;
      }

      return left.index - right.index;
    })
    .map((entry) => entry.row);
}

function getRookieSortBottomPriority(row, sortColumn) {
  if (!isDataHubRookiesView()) {
    return 0;
  }

  // Rookies table active-sort bottom-pinning:
  // targets the currently sorted column only, so rows with "-", "NR", or "NA"
  // in that specific stat land below rows that have sortable data. Do not fall
  // back to RK here, because RK should not decide bottom placement for GRD,
  // tYDS, receiving, rushing, market, or any other active sort column.
  if (isRookieBottomSortValue(row?.[sortColumn])) {
    return 1;
  }

  return 0;
}

function isRookieBottomSortValue(value) {
  if (isMissingValue(value)) {
    return true;
  }

  const normalizedValue = String(value ?? "").trim().toUpperCase();
  return normalizedValue === "-" || normalizedValue === "NR" || normalizedValue === "N/A";
}

function compareRookieCareerRankRows(
  leftRow,
  rightRow,
  direction = "asc",
  { includePlayerFallback = true } = {},
) {
  const leftRank = getRookieCareerRankMeta(leftRow);
  const rightRank = getRookieCareerRankMeta(rightRow);

  if (leftRank.isRanked !== rightRank.isRanked) {
    return leftRank.isRanked ? -1 : 1;
  }

  if (leftRank.isRanked && rightRank.isRanked) {
    const rankResult = leftRank.value - rightRank.value;
    if (rankResult !== 0) {
      return direction === "desc" ? -rankResult : rankResult;
    }
  } else {
    const nrYardsResult = compareRookieCareerNrYards(leftRow, rightRow);
    if (nrYardsResult !== 0) {
      return nrYardsResult;
    }
  }

  if (!includePlayerFallback) {
    return 0;
  }

  return comparePreparedGridValues(
    toComparableValue(leftRow?.PLAYER),
    toComparableValue(rightRow?.PLAYER),
  );
}

function getRookieCareerRankMeta(row) {
  const rankNumber = toComparableNumber(row?.RK);
  return {
    isRanked: rankNumber != null,
    value: rankNumber,
  };
}

function compareRookieCareerNrYards(leftRow, rightRow) {
  const leftYards = toComparableNumber(leftRow?.tYDS);
  const rightYards = toComparableNumber(rightRow?.tYDS);

  if (leftYards == null && rightYards == null) {
    return 0;
  }

  if (leftYards == null) {
    return 1;
  }

  if (rightYards == null) {
    return -1;
  }

  return rightYards - leftYards;
}

// Active sort value guard:
// when a column is the selected sort key, rows without a real value in that
// column are removed from the rendered table so NA entries never linger.
function filterRowsForActiveSort(rows, sortColumn) {
  if (isDataHubRookiesView()) {
    return rows;
  }

  return rows.filter((row) => !isMissingValue(row[sortColumn]));
}

function getActiveSortColumn() {
  const columns = getActiveColumnSet();
  if (!columns.includes(state.sort.column) || !isSortableColumn(state.sort.column)) {
    return createDefaultSort(state.activePageView).column;
  }

  return state.sort.column;
}

function getColumnWidth(columnName) {
  const widths = getActiveWidthMap();
  return widths[columnName]
    ?? (state.isCompactViewport ? DEFAULT_COMPACT_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH);
}

function getActiveWidthMap() {
  // Trade-family table sizing:
  // widen only the market-data schemas so the shorter trade layouts fill more
  // of the grid width while the stats and rookie-career tables keep their
  // existing per-column sizing.
  if (state.activePageView === "adp-values") {
    return state.isCompactViewport ? TRADE_VALUES_MOBILE_COLUMN_WIDTHS : TRADE_VALUES_COLUMN_WIDTHS;
  }

  if (state.activePageView === "rookies-trade") {
    return state.isCompactViewport
      ? ROOKIES_TRADE_MOBILE_COLUMN_WIDTHS
      : ROOKIES_TRADE_COLUMN_WIDTHS;
  }

  return state.isCompactViewport ? MOBILE_COLUMN_WIDTHS : COLUMN_WIDTHS;
}

function isCompactViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

let resizeFrame = 0;

function handleViewportResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    closeAllDataHubTeamMenus();
    const nextCompact = isCompactViewport();
    if (nextCompact !== state.isCompactViewport) {
      if (!nextCompact && state.isChartModalOpen) {
        closeDataHubChartModal({ restoreFocus: false });
      }
      state.isCompactViewport = nextCompact;
      renderTable();
    }

    syncDataHubChartUi();
    resizeDataHubHeroCharts();
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
    if (BLANK_PLACEHOLDER_COLUMNS.has(columnName)) {
      normalized[columnName] = "";
      continue;
    }

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
// uses plain column/value/row inputs instead of old grid-library style params
// so future agents can read it as custom renderer logic, not adapter code.
function getCellClassNames(columnName, value, row = null) {
  const classes = ["dh-grid-cell"];

  if (columnName === PLAYER_COLUMN) {
    classes.push("player-cell");
  } else {
    classes.push("center-cell");
  }

  if (BLANK_PLACEHOLDER_COLUMNS.has(columnName)) {
    classes.push("plain-cell", "blank-placeholder-cell");
    return classes;
  }

  const missingValue = isMissingValue(value);

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

  // Rookie tier column:
  // use the explicit rookie tier palette instead of percentile-based heat so
  // each tier number keeps one stable color in both rookies subviews.
  if (columnName === "TIER" && isDataHubRookiesView()) {
    const rookieTierStyle = getRookieTierStyleLevel(value);
    classes.push("heat-cell", "heat-cell--rookie-tier", `heat-cell--tier-${rookieTierStyle}`);
    return classes;
  }

  // Rookie GRD column:
  // color grade cells from the row's TIER value so prospect grade values share
  // the same table-specific tier palette as their tier label.
  if (columnName === "GRD" && isDataHubRookiesView()) {
    const rookieTierStyle = getRookieTierStyleLevel(row?.TIER);
    classes.push("heat-cell", "heat-cell--rookie-tier", `heat-cell--tier-${rookieTierStyle}`);
    return classes;
  }

  // Rookie draft columns:
  // RD & PK# and OVR_PK use their own draft position values for conditional
  // formatting, but render through the same fixed 1-8 color palette as TIER so
  // draft capital reads consistently across both rookies subviews.
  if (ROOKIE_DRAFT_COLUMNS.has(columnName) && isDataHubRookiesView()) {
    const rookieDraftStyle = getRookieDraftStyleLevel(columnName, value);
    classes.push("heat-cell", "heat-cell--rookie-tier", `heat-cell--tier-${rookieDraftStyle}`);
    return classes;
  }

  if (!NON_FORMATTED_COLUMNS.has(columnName)) {
    const family = getFormattingFamily(columnName);
    const tier = getFormattingTier(columnName, value);
    classes.push("heat-cell", `heat-cell--${family}`, `heat-cell--tier-${tier}`);
  }

  return classes;
}

function getRookieDraftStyleLevel(columnName, value) {
  if (isMissingValue(value) || String(value).trim() === "--") {
    return 0;
  }

  // RD & PK# values are stored like "1.03"; the round prefix maps directly to
  // the TIER palette level so first-round picks get the best tier color.
  if (columnName === "RD & PK#") {
    const roundMatch = String(value).trim().match(/\d+/);
    if (!roundMatch) {
      return 0;
    }
    return clamp(Number.parseInt(roundMatch[0], 10), 1, 8);
  }

  // OVR_PK values are absolute draft picks. Bucket them by 32-pick NFL rounds
  // so the column uses the same 1-8 color scale as RD & PK# and TIER.
  const overallPick = toComparableNumber(value);
  if (overallPick == null || overallPick <= 0) {
    return 0;
  }
  return clamp(Math.ceil(overallPick / 32), 1, 8);
}

function formatCellValue(value) {
  return isMissingValue(value) ? (isDataHubRookiesView() ? "-" : "NA") : value;
}

function getRookieTierStyleLevel(value) {
  const numericTier = toComparableNumber(value);
  if (numericTier != null && numericTier >= 1 && numericTier <= 8) {
    return Math.round(numericTier);
  }

  const match = String(value ?? "").match(/\d+/);
  if (!match) {
    return 0;
  }

  const parsedTier = Number.parseInt(match[0], 10);
  return parsedTier >= 1 && parsedTier <= 8 ? parsedTier : 0;
}

function formatDisplayValue(columnName, value) {
  if (BLANK_PLACEHOLDER_COLUMNS.has(columnName)) {
    return "";
  }

  if (columnName === FPTS_COLUMN) {
    const numericValue = toComparableNumber(value);
    return numericValue == null ? formatCellValue(value) : numericValue.toFixed(1);
  }

  // Rookie GRD display:
  // targets the rookies career/trade grade column and keeps grade precision
  // stable across source CSVs. RB/WT career files store whole-number grades,
  // so render numeric grades with one decimal to match Overview and Passing.
  if (columnName === "GRD" && isDataHubRookiesView()) {
    const numericValue = toComparableNumber(value);
    return numericValue == null ? formatCellValue(value) : numericValue.toFixed(1);
  }

  const formattedValue = formatCellValue(value);

  // Rookie tier display:
  // keep the stored value numeric for sorting/filtering, but render the table
  // value with the requested T- prefix in both rookies subviews.
  if (columnName === "TIER" && isDataHubRookiesView() && !isMissingValue(value)) {
    return `T-${formattedValue}`;
  }

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
  const columns = getActiveColumnSet();

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

    formatting[columnName] = createColumnMetric(values, columnName);
  });

  return formatting;
}

function createColumnMetric(values, columnName) {
  const sorted = [...values].sort((left, right) => left - right);
  const isInverted = INVERTED_COLUMNS.has(columnName);
  const limitedSorted = sorted.length > FORMATTING_TOP_RANGE_LIMIT
    ? (isInverted
      ? sorted.slice(0, FORMATTING_TOP_RANGE_LIMIT)
      : sorted.slice(sorted.length - FORMATTING_TOP_RANGE_LIMIT))
    : sorted;
  const floorValue = limitedSorted.length
    ? (isInverted ? limitedSorted[limitedSorted.length - 1] : limitedSorted[0])
    : null;

  return {
    sorted: limitedSorted,
    isFlat: limitedSorted[0] === limitedSorted[limitedSorted.length - 1],
    isInverted,
    floorValue,
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

  if (
    metric.floorValue != null
    && (
      (metric.isInverted && numericValue >= metric.floorValue)
      || (!metric.isInverted && numericValue <= metric.floorValue)
    )
  ) {
    return 0;
  }

  const clampedValue = metric.floorValue == null
    ? numericValue
    : (metric.isInverted
      ? Math.min(numericValue, metric.floorValue)
      : Math.max(numericValue, metric.floorValue));
  const percentile = getPercentileRank(metric.sorted, clampedValue);
  const normalized = metric.isInverted
    ? 1 - percentile
    : percentile;

  return clamp(Math.round(normalized * 4), 0, 4);
}

function getRookieCareerFormattingFamily(columnName) {
  if (!isDataHubRookiesCareerView()) {
    return null;
  }

  // Rankings & Career Stats group heat:
  // resolve the active column group before choosing a CSS family so Overview,
  // Passing, Rushing, Receiving, and supporting groups no longer reuse one
  // generic heat color scale.
  const group = getActiveColumnGroups().find((groupConfig) =>
    groupConfig.formatFamily && groupConfig.columns.includes(columnName),
  );
  return group?.formatFamily || null;
}

function getFormattingFamily(columnName) {
  const rookieCareerFamily = getRookieCareerFormattingFamily(columnName);
  if (rookieCareerFamily) {
    return rookieCareerFamily;
  }

  if (NEUTRAL_COLUMNS.has(columnName)) {
    return "neutral";
  }

  if (PPG_COLUMNS.has(columnName)) {
    return "ppg";
  }

  if (isDataHubTradeFamilyView()) {
    if (KTC_COLUMNS.has(columnName)) {
      return "ktc";
    }
    if (ADP_COLUMNS.has(columnName)) {
      return "adp";
    }
    if (DIFF_COLUMNS.has(columnName)) {
      return "diff";
    }
  }

  return "heat";
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

function comparePreparedGridValues(valueA, valueB) {
  const aMissing = valueA == null;
  const bMissing = valueB == null;

  if (aMissing && bMissing) {
    return 0;
  }

  if (aMissing) {
    return 1;
  }

  if (bMissing) {
    return -1;
  }

  if (typeof valueA === "number" && typeof valueB === "number") {
    return valueA - valueB;
  }

  return GRID_TEXT_COLLATOR.compare(String(valueA), String(valueB));
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

// Consistency Chart Line Color
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
  const ktcOneQbRank = toComparableNumber(sourceRow.__oneQbOverallRank);
  const ktcSflxRank = toComparableNumber(sourceRow.__sflxOverallRank);
  const hasGameLogsSupport = sourceRow.__hasGameLogsSupport != null
    ? Boolean(sourceRow.__hasGameLogsSupport)
    : Boolean(playerId && pos !== "RDP");
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
    ktcOneQbRank,
    ktcSflxRank,
    diffOneQbWinner: String(sourceRow.__oneQbDiffWinner || ""),
    diffSflxWinner: String(sourceRow.__sflxDiffWinner || ""),
    tradeEntityType: String(sourceRow.__tradeEntityType || ""),
    tradeEntityBucket: String(sourceRow.__tradeEntityBucket || ""),
    hasGameLogsSupport,
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
  if (!canOpenDataHubGameLogs(meta)) {
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

    // Consistency Chart Line Stroke Width 
    
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
    // DataHub Ownership modal header:
    // targets the inline Ownership tab's vitals capsule and matches the regular
    // Game Logs header by sizing vitals to the rendered summary-chip row width.
    const ownershipVitalsElement = vitalsEl?.querySelector(".player-vitals--modal");
    const ownershipSummaryChipsWidth = chipsEl.offsetWidth;
    if (ownershipVitalsElement && ownershipSummaryChipsWidth > 0) {
      ownershipVitalsElement.style.width = `${ownershipSummaryChipsWidth}px`;
    }
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
  const rowMeta = state.statsRowsByPlayerId?.[playerId]?.__meta || null;
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
