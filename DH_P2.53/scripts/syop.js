(function () {
  const PAGE_ID = 'research';
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const colors = {
    bg: '#0B0E16',
    panel: 'rgba(18, 21, 38, 0.78)',
    panelBorder: 'rgba(132, 146, 255, 0.16)',
    text: '#F5F7FF',
    subtext: '#A7AFD4',
    muted: '#303854',
    grid: 'rgba(148, 163, 255, 0.16)',
    accentA: '#3BE4E4',
    accentB: '#7C83FF',
    accentC: '#FF75D1',
    qb: '#6000ff',
    rb: '#690fff',
    wr: '#7621ff',
    te: '#842fff'
  };

  const SUNBURST_NODES = [
    { id: 'root', parent: null, label: 'SYOP Averages', subtitle: 'SYOP[ႽP] • BRKOUT[BO]', value: 51.6 },
    { id: 'qb', parent: 'root', label: 'QB', subtitle: 'Quarterbacks', value: 16.46, series: 'QB' },
    { id: 'qb-prime-lambda', parent: 'qb', label: 'Prime Λ', subtitle: '7.2 yrs', value: 6.5, abbr: 'SPᴧ', stat: '7.2' },
    { id: 'qb-breakout-lambda', parent: 'qb', label: 'Breakout Λ', subtitle: '2.3 yrs', value: 2.49, abbr: 'BOᴧ', stat: '2.3' },
    { id: 'qb-prime-mode', parent: 'qb', label: 'Prime M', subtitle: '6.0 yrs', value: 5.35, abbr: 'SPϻ', stat: '6.0' },
    { id: 'qb-baseline-mode', parent: 'qb', label: 'Baseline M', subtitle: '1.0 yrs', value: 2.1, abbr: 'BOϻ', stat: '1.0' },
    { id: 'rb', parent: 'root', label: 'RB', subtitle: 'Running Backs', value: 9.8, series: 'RB' },
    { id: 'rb-prime-lambda', parent: 'rb', label: 'Prime Λ', subtitle: '3.4 yrs', value: 3.31, abbr: 'SPᴧ', stat: '3.4' },
    { id: 'rb-breakout-lambda', parent: 'rb', label: 'Breakout Λ', subtitle: '2.2 yrs', value: 2.5, abbr: 'BOᴧ', stat: '2.2' },
    { id: 'rb-prime-mode', parent: 'rb', label: 'Prime M', subtitle: '0.7 yrs', value: 1.89, abbr: 'SPϻ', stat: '0.7' },
    { id: 'rb-baseline-mode', parent: 'rb', label: 'Baseline M', subtitle: '1.7 yrs', value: 2.1, abbr: 'BOϻ', stat: '1.7' },
    { id: 'wr', parent: 'root', label: 'WR', subtitle: 'Wide Receivers', value: 12.82, series: 'WR' },
    { id: 'wr-prime-lambda', parent: 'wr', label: 'Prime Λ', subtitle: '4.9 yrs', value: 4.92, abbr: 'SPᴧ', stat: '4.9' },
    { id: 'wr-breakout-lambda', parent: 'wr', label: 'Breakout Λ', subtitle: '2.9 yrs', value: 2.84, abbr: 'BOᴧ', stat: '2.9' },
    { id: 'wr-prime-mode', parent: 'wr', label: 'Prime M', subtitle: '3.0 yrs', value: 3, abbr: 'SPϻ', stat: '3.0' },
    { id: 'wr-baseline-mode', parent: 'wr', label: 'Baseline M', subtitle: '2.0 yrs', value: 2, abbr: 'BOϻ', stat: '2.0' },
    { id: 'te', parent: 'root', label: 'TE', subtitle: 'Tight Ends', value: 12.5, series: 'TE' },
    { id: 'te-prime-lambda', parent: 'te', label: 'Prime Λ', subtitle: '4.0 yrs', value: 4.01, abbr: 'SPᴧ', stat: '4.0' },
    { id: 'te-breakout-lambda', parent: 'te', label: 'Breakout Λ', subtitle: '3.5 yrs', value: 3.49, abbr: 'BOᴧ', stat: '3.5' },
    { id: 'te-prime-mode', parent: 'te', label: 'Prime M', subtitle: '2.0 yrs', value: 2, abbr: 'SPϻ', stat: '2.0' },
    { id: 'te-baseline-mode', parent: 'te', label: 'Baseline M', subtitle: '3.0 yrs', value: 3, abbr: 'BOϻ', stat: '3.0' }
  ];

  const SYOP_DATA = [
    { SYOP: '1', 'QB %': 6.67, 'RB %': 27.54, 'WR %': 13.0, 'TE %': 26.92 },
    { SYOP: '2', 'QB %': 11.11, 'RB %': 20.29, 'WR %': 14.1, 'TE %': 26.92 },
    { SYOP: '3', 'QB %': 8.89, 'RB %': 11.59, 'WR %': 14.1, 'TE %': 7.69 },
    { SYOP: '4', 'QB %': 8.89, 'RB %': 11.4, 'WR %': 12.0, 'TE %': 7.69 },
    { SYOP: '5', 'QB %': 4.44, 'RB %': 13.04, 'WR %': 5.4, 'TE %': 0.4 },
    { SYOP: '6', 'QB %': 13.33, 'RB %': 5.8, 'WR %': 7.6, 'TE %': 7.69 },
    { SYOP: '7', 'QB %': 8.89, 'RB %': 1.45, 'WR %': 13.0, 'TE %': 7.69 },
    { SYOP: '8', 'QB %': 4.44, 'RB %': 2.9, 'WR %': 9.8, 'TE %': 0.4 },
    { SYOP: '9', 'QB %': 11.11, 'RB %': 3.3, 'WR %': 2.2, 'TE %': 3.85 },
    { SYOP: '10', 'QB %': 2.22, 'RB %': 1.45, 'WR %': 4.49, 'TE %': 3.51 },
    { SYOP: '11', 'QB %': 0.4, 'RB %': 1.45, 'WR %': 2.2, 'TE %': 3.85 },
    { SYOP: '12+', 'QB %': 20.0, 'RB %': 0.4, 'WR %': 2.2, 'TE %': 3.85 }
  ];

  const POSITION_CONFIG = [
    { key: 'QB', percentKey: 'QB %', label: 'Quarterbacks', color: colors.qb },
    { key: 'RB', percentKey: 'RB %', label: 'Running Backs', color: colors.rb },
    { key: 'WR', percentKey: 'WR %', label: 'Wide Receivers', color: colors.wr },
    { key: 'TE', percentKey: 'TE %', label: 'Tight Ends', color: colors.te }
  ];

  // SYOP bar-chart gradients: QB establishes the translation pattern from a
  // simple 2-color reference gradient into SVG stops — a tuned lead color,
  // the exact reference endpoint at the mid stop, then a slightly deeper tail
  // color for the final stops using the same opacity ramp.
  const BAR_GRADIENTS = {
    QB: [
      { offset: '0%', color: '#ff906e', opacity: 0.14 },
      { offset: '34%', color: '#ff4187', opacity: 0.26 },
      { offset: '70%', color: '#FF3A75', opacity: 0.34 },
      { offset: '100%', color: '#FF3A75', opacity: 0.5 }
    ],
    RB: [
      { offset: '0%', color: '#26ccff', opacity: 0.14 },
      { offset: '34%', color: '#45ffd0', opacity: 0.26 },
      { offset: '70%', color: '#05efb4', opacity: 0.34 },
      { offset: '100%', color: '#05efb4', opacity: 0.5 }
    ],
    WR: [
      { offset: '0%', color: '#8b5fff', opacity: 0.14 },
      { offset: '34%', color: '#0299fe', opacity: 0.26 },
      { offset: '70%', color: '#028eea', opacity: 0.34 },
      { offset: '100%', color: '#028eea', opacity: 0.5 }
    ],
    TE: [
      { offset: '0%', color: '#ff74d2', opacity: 0.14 },
      { offset: '34%', color: '#7f2fff', opacity: 0.26 },
      { offset: '70%', color: '#7429ed', opacity: 0.34 },
      { offset: '100%', color: '#7429ed', opacity: 0.5 }
    ],
    DEFAULT: [
      { offset: '0%', color: '#8F97FF', opacity: 0.2 },
      { offset: '100%', color: '#5C4BFF', opacity: 0.54 }
    ]
  };

  const POSITION_TOTALS = {
    QB: 52,
    RB: 96,
    WR: 107,
    TE: 42
  };

  const GAUGES = [
    { key: 'QB', value: 7.22, color: colors.qb },
    { key: 'RB', value: 3.39, color: colors.wr },
    { key: 'WR', value: 4.9, color: colors.rb },
    { key: 'TE', value: 4.0, color: colors.te }
  ];

  const DRAFT_OVERALL = [
    { rd: '1', hit: 78.4 },
    { rd: '2', hit: 47.7 },
    { rd: '3', hit: 38.5 },
    { rd: '4', hit: 18.0 },
    { rd: '5', hit: 15.0 },
    { rd: '6', hit: 14.1 },
    { rd: '7', hit: 9.4 }
  ];

  const DRAFT_POSITIONAL = [
    { rd: '1', QB: 78, RB: 83, TE: 78, WR: 76 },
    { rd: '2', QB: 42, RB: 50, TE: 40, WR: 51 },
    { rd: '3', QB: 31, RB: 62, TE: 36, WR: 30 },
    { rd: '4', QB: 20, RB: 27, TE: 23, WR: 9 },
    { rd: '5', QB: 7, RB: 27, TE: 9, WR: 13 },
    { rd: '6', QB: 11, RB: 18, TE: 8, WR: 15 },
    { rd: '7', QB: 13, RB: 9, TE: 4, WR: 11 }
  ];

  const DRAFT_SERIES = [
    { key: 'QB', color: '#ff4187' },
    { key: 'RB', color: '#06ffa8e8' },
    { key: 'TE', color: '#7f2fff' },
    { key: 'WR', color: '#3881ff' }
  ];

  const DRAFT_OVERALL_MAX = Math.max(...DRAFT_OVERALL.map((row) => row.hit));
  const DRAFT_POSITIONAL_MAX = Math.max(
    ...DRAFT_POSITIONAL.flatMap((row) => DRAFT_SERIES.map((series) => Number(row[series.key]) || 0))
  );
  const DRAFT_CHART_NICE_MAX = Math.max(10, Math.ceil(Math.max(DRAFT_OVERALL_MAX, DRAFT_POSITIONAL_MAX) / 10) * 10);

  const SERIES_CONFIG = [
    { key: 'QB %', label: 'QB %', color: colors.qb },
    { key: 'RB %', label: 'RB %', color: colors.rb },
    { key: 'WR %', label: 'WR %', color: colors.wr },
    { key: 'TE %', label: 'TE %', color: colors.te }
  ];

  const syopChartState = {
    activePosition: POSITION_CONFIG[0]?.key || null,
    showTable: false
  };

  // Positional Analysis tab:
  // - targets only the new Research tab panel and its unique .pos-analysis-* DOM
  // - loads the historical player-level dataset directly, not Sheets/proxies
  // - keeps chart state separate from SYOP/Draft renderers so tab changes do not
  //   leak behavior into the existing Research views.
  const POS_ANALYSIS_DATA_PATH = '../data/POS-DIST_2007-2015/POS-DIST_2007-2025.csv';
  const POS_ANALYSIS_YEARS = Array.from({ length: 19 }, (_, index) => 2007 + index);
  const POS_ANALYSIS_POSITIONS = ['QB', 'RB', 'WR', 'TE'];
  const POS_ANALYSIS_RANGE_OPTIONS = ['Top 6', 'Top 12', 'Top 24', 'Top 36', 'Top 48', 'Top 60'];
  // Positional Analysis supply grid: order ranges from the tightest tier to the
  // broadest so the two-by-two layout reads 24/36 across, then 48/60 below.
  const POS_ANALYSIS_GRID_RANGES = ['Top 24', 'Top 36', 'Top 48', 'Top 60'];
  const POS_ANALYSIS_CUTS = {
    'Top 6': 6,
    'Top 12': 12,
    'Top 24': 24,
    'Top 36': 36,
    'Top 48': 48,
    'Top 60': 60
  };
  const POS_ANALYSIS_POS_CONFIG = {
    QB: { label: 'Quarterbacks', low: '#FF916B', mid: '#FF666B', high: '#F94095' },
    RB: { label: 'Running Backs', low: '#0d7efe', mid: '#1fa9f9', high: '#00ffae' },
    WR: { label: 'Wide Receivers', low: '#5c47ff', mid: '#0051ff', high: '#1b7eff' },
    TE: { label: 'Tight Ends', low: '#ff6bc8', mid: '#bf4be4', high: '#7f2fff' }
  };
  const POS_ANALYSIS_RANGE_COLORS = {
    12: { RB: '#00ad87', WR: '#0467c1' },
    36: { RB: '#00ffc6', WR: '#2c9cff' },
    60: { RB: '#6afff6', WR: '#6ab7fc' }
  };
  // Mini year-grid lines use their own requested RB/WR palette so changing
  // these colors cannot alter the supply, tier-stack, or combined charts.
  const POS_ANALYSIS_MINI_LINE_COLORS = { RB: '#06ff97', WR: '#0299fe' };
  const POS_ANALYSIS_STATE = {
    rows: [],
    counts: null,
    loaded: false,
    loadingPromise: null,
    interactionsBound: false,
    range: 'Top 60',
    mode: 'single',
    positionView: 'rbWr',
    activePositions: ['RB', 'WR'],
    minYear: 2014,
    maxYear: 2025,
    personnel: '12'
  };

  // Positional Analysis icon system:
  // - mirrors DataHub's local inline-SVG approach instead of adding a shared icon dependency
  // - targets only .pos-analysis-* UI elements through hydrated data attributes or direct render helpers
  // - keeps all icons decorative/aria-hidden so chart and control labels remain the accessible names.
  const POS_ANALYSIS_ICON_PATHS = {
    radar: '<circle cx="12" cy="12" r="8"/><path d="M12 4v8l5 3"/><path d="M4 12h3"/><path d="M17 12h3"/>',
    'line-chart': '<path d="M3 19h18"/><path d="M5 16l4-5 4 3 6-8"/><circle cx="9" cy="11" r="1.4"/><circle cx="13" cy="14" r="1.4"/><circle cx="19" cy="6" r="1.4"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1.2"/><rect x="14" y="4" width="6" height="6" rx="1.2"/><rect x="4" y="14" width="6" height="6" rx="1.2"/><rect x="14" y="14" width="6" height="6" rx="1.2"/>',
    users: '<path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="7" r="3.5"/><path d="M20 20v-1.2a3 3 0 0 0-2.2-2.9"/><path d="M15.5 4.4a3.2 3.2 0 0 1 0 5.2"/>',
    split: '<path d="M5 4v5a4 4 0 0 0 4 4h10"/><path d="M16 10l3 3-3 3"/><path d="M5 20v-3a4 4 0 0 1 4-4"/>',
    cards: '<rect x="5" y="6" width="14" height="12" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/><path d="M3 9V7a3 3 0 0 1 3-3h9"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/><path d="M8 14h2"/><path d="M14 14h2"/>',
    stack: '<path d="M5 19V9"/><path d="M12 19V5"/><path d="M19 19v-7"/><path d="M3 19h18"/><path d="M5 13h4"/><path d="M12 11h4"/><path d="M19 16h2"/>',
    'bar-gap': '<path d="M4 20V9"/><path d="M8 20V5"/><path d="M16 20v-7"/><path d="M20 20V8"/><path d="M3 20h18"/><path d="M11 9h2"/><path d="M11 15h2"/>',
    strategy: '<path d="M4 18l6-6 4 4 6-8"/><path d="M14 8h6v6"/><circle cx="7" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="17" cy="16" r="2"/>',
    formula: '<path d="M5 7h14"/><path d="M5 12h8"/><path d="M5 17h14"/><path d="M16 10l3 2-3 2"/>',
    trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5a2 2 0 0 0 2 4h1"/><path d="M16 6h3a2 2 0 0 1-2 4h-1"/><path d="M12 12v5"/><path d="M8 20h8"/><path d="M10 17h4"/>',
    switch: '<path d="M5 7h11"/><path d="M13 4l3 3-3 3"/><path d="M19 17H8"/><path d="M11 14l-3 3 3 3"/>',
    spread: '<path d="M4 17h16"/><circle cx="12" cy="17" r="1.4"/><circle cx="6" cy="10" r="1.4"/><circle cx="18" cy="10" r="1.4"/><circle cx="9" cy="7" r="1.4"/><circle cx="15" cy="7" r="1.4"/>',
    heavy: '<path d="M4 17h16"/><circle cx="12" cy="17" r="1.4"/><circle cx="8" cy="10" r="1.4"/><circle cx="16" cy="10" r="1.4"/><rect x="9" y="5" width="6" height="4" rx="1.2"/>',
    jumbo: '<path d="M4 17h16"/><circle cx="12" cy="18" r="1.4"/><rect x="5" y="8" width="4" height="4" rx="1"/><rect x="10" y="6" width="4" height="4" rx="1"/><rect x="15" y="8" width="4" height="4" rx="1"/>',
    field: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 5v14"/><path d="M16 5v14"/><path d="M4 12h16"/><circle cx="12" cy="12" r="2"/>',
    milestone: '<path d="M5 19h14"/><path d="M7 19V8l5-3 5 3v11"/><path d="M9 11h6"/><path d="M9 15h6"/>',
    network: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><path d="M8 7.5l2.5 3"/><path d="M16 7.5l-2.5 3"/><path d="M8 16.5l2.5-3"/><path d="M16 16.5l-2.5-3"/>',
    runner: '<circle cx="12" cy="4" r="2"/><path d="M10 9l4 2 3-2"/><path d="M14 11l-2 4 4 5"/><path d="M10 9l-3 4"/><path d="M12 15l-5 4"/>',
    route: '<path d="M4 18c5 0 4-12 10-12h5"/><path d="M16 3l3 3-3 3"/><circle cx="4" cy="18" r="2"/><circle cx="10" cy="11" r="1.4"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-5"/>',
    helmet: '<path d="M4 13a8 8 0 0 1 15.6-2.5"/><path d="M19 11v5h-5l-2-3H8v5H6a2 2 0 0 1-2-2v-3"/><path d="M14 16h5"/>',
    timeline: '<path d="M5 4v16"/><circle cx="5" cy="6" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="18" r="2"/><path d="M9 6h10"/><path d="M9 12h7"/><path d="M9 18h10"/>',
    warning: '<path d="M12 4l9 16H3L12 4Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    cycle: '<path d="M20 12a8 8 0 0 1-13.5 5.8"/><path d="M4 12A8 8 0 0 1 17.5 6.2"/><path d="M7 18H4v-3"/><path d="M17 6h3v3"/>',
    ground: '<path d="M4 18c4-4 12-4 16 0"/><path d="M6 14c3-2 9-2 12 0"/><path d="M8 10c2-1 6-1 8 0"/><path d="M12 4v4"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>',
    diff: '<path d="M4 8h16"/><path d="M4 16h16"/><path d="M8 4v8"/><path d="M16 12v8"/>',
    'trend-up': '<path d="M4 16l5-5 4 4 7-8"/><path d="M15 7h5v5"/>',
    'trend-down': '<path d="M4 8l5 5 4-4 7 8"/><path d="M15 17h5v-5"/>'
  };

  const { distributionByPosition: SYOP_DISTRIBUTION, summaryByPosition: SYOP_POSITION_SUMMARY } = buildSyopSummary();

  let resizeTimer = null;

  function buildSyopSummary() {
    const distributionByPosition = {};
    const summaryByPosition = {};

    POSITION_CONFIG.forEach((config) => {
      const totalPlayers = POSITION_TOTALS[config.key] || 0;
      const allocation = allocateBucketCounts(config.percentKey, totalPlayers);
      const valueSamples = [];

      allocation.forEach(({ bucket, count }) => {
        const numericValue = bucketToNumeric(bucket);
        for (let i = 0; i < count; i += 1) {
          valueSamples.push(numericValue);
        }
      });

      valueSamples.sort((a, b) => a - b);
      const { median, q1, q3 } = computeQuantiles(valueSamples);
      const iqr = q3 - q1;
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      const shareTwoPlus = valueSamples.filter((value) => value >= 2).length / (valueSamples.length || 1);
      const shareThreePlus = valueSamples.filter((value) => value >= 3).length / (valueSamples.length || 1);
      const outlierCount = valueSamples.filter((value) => value < lowerFence || value > upperFence).length;

      distributionByPosition[config.key] = SYOP_DATA.map((row) => ({
        bucket: row.SYOP,
        percentage: row[config.percentKey] || 0
      }));

      summaryByPosition[config.key] = {
        total: totalPlayers,
        median,
        q1,
        q3,
        iqr,
        shareTwoPlus,
        shareThreePlus,
        min: valueSamples[0] || 0,
        max: valueSamples[valueSamples.length - 1] || 0,
        outliers: outlierCount
      };
    });

    return { distributionByPosition, summaryByPosition };
  }

  function allocateBucketCounts(percentKey, totalPlayers) {
    const rows = SYOP_DATA.map((row) => ({
      bucket: row.SYOP,
      raw: (row[percentKey] || 0) * totalPlayers / 100
    }));

    const rounded = rows.map((entry) => Math.round(entry.raw));
    let diff = totalPlayers - rounded.reduce((sum, value) => sum + value, 0);

    if (diff !== 0) {
      const adjustments = rows
        .map((entry, index) => ({ index, fraction: entry.raw - Math.round(entry.raw) }))
        .sort((a, b) => (diff > 0 ? b.fraction - a.fraction : a.fraction - b.fraction));

      for (let i = 0; i < Math.abs(diff); i += 1) {
        const target = adjustments[i % adjustments.length]?.index ?? 0;
        rounded[target] += diff > 0 ? 1 : -1;
      }
    }

    return rows.map((row, index) => ({
      bucket: row.bucket,
      count: Math.max(0, rounded[index])
    }));
  }

  function bucketToNumeric(bucket) {
    if (typeof bucket !== 'string') return Number(bucket) || 0;
    if (bucket.includes('+')) {
      const base = parseFloat(bucket.replace('+', ''));
      return Number.isNaN(base) ? 0 : base + 0.5;
    }
    const value = parseFloat(bucket);
    return Number.isNaN(value) ? 0 : value;
  }

  function formatSyopValue(value) {
    if (value == null || Number.isNaN(value)) return '—';
    if (value >= 12.25) return '12+';
    const rounded = Math.round(value * 10) / 10;
    if (Math.abs(rounded - Math.round(rounded)) < 1e-6) {
      return String(Math.round(rounded));
    }
    return rounded.toFixed(1);
  }

  function computeQuantiles(values) {
    if (!values.length) {
      return { median: 0, q1: 0, q3: 0 };
    }
    const sorted = values.slice().sort((a, b) => a - b);
    const median = quantile(sorted, 0.5);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    return { median, q1, q3 };
  }

  function quantile(values, p) {
    if (values.length === 0) return 0;
    const pos = (values.length - 1) * p;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    if (lower === upper) {
      return values[lower];
    }
    const weight = pos - lower;
    return values[lower] * (1 - weight) + values[upper] * weight;
  }

  function createEl(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class') {
          el.className = value;
        } else if (key === 'dataset') {
          Object.entries(value).forEach(([dKey, dValue]) => {
            el.dataset[dKey] = dValue;
          });
        } else if (key === 'style' && typeof value === 'object') {
          Object.entries(value).forEach(([styleKey, styleValue]) => {
            if (styleKey.startsWith('--')) {
              el.style.setProperty(styleKey, styleValue);
            } else {
              el.style[styleKey] = styleValue;
            }
          });
        } else if (key in el) {
          try {
            el[key] = value;
          } catch (_) {
            el.setAttribute(key, value);
          }
        } else {
          el.setAttribute(key, value);
        }
      });
    }
    children.forEach((child) => {
      if (child == null) return;
      if (Array.isArray(child)) {
        child.forEach((nested) => nested != null && el.appendChild(typeof nested === 'string' ? document.createTextNode(nested) : nested));
      } else {
        el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
      }
    });
    return el;
  }

  function createSVG(tag, attrs, ...children) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
      });
    }
    children.forEach((child) => {
      if (child == null) return;
      el.appendChild(child);
    });
    return el;
  }

  const sunburstNodeById = new Map(SUNBURST_NODES.map((node) => [node.id, node]));

  function childrenOf(id) {
    return SUNBURST_NODES.filter((node) => node.parent === id);
  }

  function polar(cx, cy, r, a) {
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function arcPath(cx, cy, rInner, rOuter, a0, a1) {
    const p0 = polar(cx, cy, rOuter, a0);
    const p1 = polar(cx, cy, rOuter, a1);
    const p2 = polar(cx, cy, rInner, a1);
    const p3 = polar(cx, cy, rInner, a0);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${p0.x} ${p0.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rInner} ${rInner} 0 ${large} 0 ${p3.x} ${p3.y} Z`;
  }

  function labelAt(cx, cy, r, a) {
    return polar(cx, cy, r, a);
  }

  function seriesColor(series) {
    switch (series) {
      case 'QB':
        return colors.qb;
      case 'RB':
        return colors.rb;
      case 'WR':
        return colors.wr;
      case 'TE':
        return colors.te;
      default:
        return '#6b7280';
    }
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace('#', '');
    const value = parseInt(normalized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function stripYearSuffix(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/\s*yrs?\.?/gi, '').trim();
  }

  const SYOP_CHART_FONT_FAMILY = '"Product Sans", "Google Sans", "Quicksand"';

  function getSunburstMetricParts(abbr) {
    if (typeof abbr !== 'string') return null;
    const chars = Array.from(abbr.trim());
    if (chars.length < 3) return null;
    const base = chars.slice(0, -1).join('');
    const suffix = chars[chars.length - 1];
    const baseKind = base === 'SP' ? 'sp' : base === 'BO' ? 'bo' : null;
    const suffixKind = suffix === 'ᴧ' ? 'lambda' : suffix === 'ϻ' ? 'mode' : null;
    if (baseKind && suffixKind) return { baseKind, suffixKind, base, suffix };
    return null;
  }

  const labelAccent = '#9096C0';

  function renderSunburst() {
    const container = document.getElementById('syop-sunburst');
    if (!container) return;

    const root = sunburstNodeById.get('root');
    const ring1Nodes = childrenOf(root?.id || 'root');
    const ring1Total = ring1Nodes.reduce((sum, node) => sum + node.value, 0) || 1;
    const baseSize = 480;
    const containerWidth = container.clientWidth || baseSize;
    const constrained = Math.max(320, containerWidth);
    const size = Math.min(baseSize, constrained);
    const rawScale = size / baseSize;
    const scale = Math.pow(rawScale, 0.85);
    const pad = 64 * scale;
    const cx = size / 2;
    const cy = size / 2;
    const inner1 = 104 * scale;
    const outer1 = 178 * scale;
    const inner2 = 184 * scale;
    const outer2 = 284 * scale;
    const ring1Opacity = 0.75;
    const ring2Opacity = 0.45;
    const centerRadius = 94 * scale;
    const textStroke = 'rgba(11, 14, 22, 0.68)';
    const fontSize = (value, floor = 12) => Math.max(value * scale, floor);
    const startAngle = -Math.PI / 2;

    const svg = createSVG('svg', {
      viewBox: `${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`,
      width: String(size),
      height: String(size),
      class: 'syop-sunburst-svg',
      style: `--syop-sunburst-scale: ${scale};`,
      role: 'img',
      'aria-labelledby': 'syop-infographic-heading'
    });

    let cursor = startAngle;
    const ring1Segments = ring1Nodes.map((node) => {
      const span = (node.value / ring1Total) * Math.PI * 2;
      const segment = { node, a0: cursor, a1: cursor + span };
      cursor += span;
      return segment;
    });

    const ring2Segments = [];
    ring1Segments.forEach((segment) => {
      const children = childrenOf(segment.node.id);
      const total = children.reduce((sum, child) => sum + child.value, 0) || 1;
      let childCursor = segment.a0;
      children.forEach((child) => {
        const span = (child.value / total) * (segment.a1 - segment.a0);
        ring2Segments.push({ parent: segment, node: child, a0: childCursor, a1: childCursor + span });
        childCursor += span;
      });
    });

    ring1Segments.forEach((segment) => {
      const color = seriesColor(segment.node.series);
      const path = createSVG('path', {
        d: arcPath(cx, cy, inner1, outer1, segment.a0, segment.a1),
        fill: hexToRgba(color, ring1Opacity),
        stroke: colors.bg,
        'stroke-width': (1.2 * scale).toFixed(3)
      });
      svg.appendChild(path);

      const mid = (segment.a0 + segment.a1) / 2;
      const pos = labelAt(cx, cy, (inner1 + outer1) / 2, mid);
      const text = createSVG('text', {
        x: pos.x,
        y: pos.y - 6 * scale,
        fill: colors.text,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': fontSize(26, 24),
        'font-weight': '600',
        'paint-order': 'stroke',
        stroke: textStroke,
        'stroke-width': Math.max(0.45, 0.6 * scale).toFixed(3),
        'font-family': SYOP_CHART_FONT_FAMILY
      });
      text.appendChild(document.createTextNode(segment.node.label));
      const subtitleText = stripYearSuffix(segment.node.subtitle);
      if (subtitleText && !segment.node.series) {
        const subtitle = createSVG('tspan', {
          x: pos.x,
          dy: `${18 * scale}`,
          'font-size': fontSize(15, 13),
          'font-weight': '700',
          fill: colors.text,
          'font-family': SYOP_CHART_FONT_FAMILY
        }, document.createTextNode(subtitleText));
        text.appendChild(subtitle);
      }
      svg.appendChild(text);
    });

    ring2Segments.forEach((segment) => {
      const parentColor = seriesColor(segment.parent.node.series);
      const path = createSVG('path', {
        d: arcPath(cx, cy, inner2, outer2, segment.a0, segment.a1),
        fill: hexToRgba(parentColor, ring2Opacity),
        stroke: colors.bg,
        'stroke-width': (1.1 * scale).toFixed(3)
      });
      svg.appendChild(path);

      const mid = (segment.a0 + segment.a1) / 2;
      const radius = (inner2 + outer2) / 2;
      const center = labelAt(cx, cy, radius, mid);
      const metricAbbr = segment.node.abbr || segment.node.label;
      const metricParts = getSunburstMetricParts(metricAbbr);
      const label = createSVG('text', {
        x: center.x,
        y: center.y - 2 * scale,
        class: metricParts ? `syop-sunburst-metric-label syop-sunburst-metric-label--${metricParts.baseKind} syop-sunburst-metric-label--${metricParts.suffixKind}` : 'syop-sunburst-metric-label',
        fill: labelAccent,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'paint-order': 'stroke',
        stroke: textStroke,
        'stroke-width': Math.max(0.4, 0.6 * scale).toFixed(3)
      });

      // SYOP Sunburst metric labels: JS only splits label parts into semantic
      // classes; CSS owns base/suffix colors, sizing, weight, and spacing.
      if (metricParts) {
        label.appendChild(createSVG('tspan', {
          class: `syop-sunburst-metric-base syop-sunburst-metric-base--${metricParts.baseKind}`
        }, document.createTextNode(metricParts.base)));
        label.appendChild(createSVG('tspan', {
          class: `syop-sunburst-metric-suffix syop-sunburst-metric-suffix--${metricParts.suffixKind}`
        }, document.createTextNode(metricParts.suffix)));
      } else {
        label.appendChild(document.createTextNode(metricAbbr));
      }

      const statRaw = segment.node.stat || (segment.node.subtitle ? segment.node.subtitle.replace(/[^0-9.]+/g, '') : '');
      const stat = stripYearSuffix(statRaw);
      if (stat) {
        label.appendChild(createSVG('tspan', {
          x: center.x,
          dy: `${26 * scale}`,
          'font-size': fontSize(20, 16),
          'font-weight': '800',
          fill: colors.text,
          'paint-order': 'stroke',
          stroke: textStroke,
          'stroke-width': Math.max(0.42, 0.65 * scale).toFixed(3),
          'font-family': SYOP_CHART_FONT_FAMILY
        }, document.createTextNode(stat)));
      }
      svg.appendChild(label);
    });

    const centerCircle = createSVG('circle', {
      cx,
      cy,
      r: centerRadius,
      fill: '#111628',
      stroke: colors.bg,
      'stroke-width': (1.2 * scale).toFixed(3)
    });
    svg.appendChild(centerCircle);

    const titleTop = createSVG('text', {
      x: cx,
      y: cy - 30 * scale,
      fill: colors.text,
      'font-size': fontSize(23, 21),
      'font-weight': '800',
      'text-anchor': 'middle',
      'paint-order': 'stroke',
      stroke: textStroke,
      'stroke-width': Math.max(0.45, 0.64 * scale).toFixed(3),
      'font-family': SYOP_CHART_FONT_FAMILY
    }, document.createTextNode('Λ | Mean'));
    svg.appendChild(titleTop);

    const titleBottom = createSVG('text', {
      x: cx,
      y: cy + 0 * scale,
      fill: colors.text,
      'font-size': fontSize(23, 21),
      'font-weight': '800',
      'text-anchor': 'middle',
      'paint-order': 'stroke',
      stroke: textStroke,
      'stroke-width': Math.max(0.45, 0.64 * scale).toFixed(3),
      'font-family': SYOP_CHART_FONT_FAMILY
    }, document.createTextNode('ϻ | Mode'));
    svg.appendChild(titleBottom);

    if (root?.subtitle) { svg.appendChild(createSVG('text', { x: cx, y: cy + 29 * scale, fill: colors.subtext, 'font-size': '11px', 'font-weight': '400',
        'text-anchor': 'middle',
        'font-family': SYOP_CHART_FONT_FAMILY
      }, document.createTextNode(root.subtitle)));
    }

    container.innerHTML = '';
    container.appendChild(svg);
  }

  function renderBarChart() {
    const container = document.getElementById('syop-bar-chart');
    if (!container) return;
    container.innerHTML = '';

    const controls = createEl('div', { class: 'syop-bar-controls' });
    controls.appendChild(createEl('span', { class: 'syop-filter-label' }, 'Positions'));

    if (!syopChartState.activePosition && POSITION_CONFIG.length) {
      syopChartState.activePosition = POSITION_CONFIG[0].key;
    }

    const legend = createEl('div', { class: 'syop-position-legend', role: 'group', 'aria-label': 'SYOP position filter' });
    POSITION_CONFIG.forEach((config) => {
      const isActive = syopChartState.activePosition === config.key;
      const chip = createEl('button', {
        type: 'button',
        class: `syop-legend-chip${isActive ? ' active' : ''}`,
        style: { '--chip-accent': config.color },
        'aria-pressed': String(isActive)
      },
      createEl('span', { class: 'chip-label' }, config.key));

      chip.addEventListener('click', () => {
        if (syopChartState.activePosition === config.key) return;
        syopChartState.activePosition = config.key;
        renderBarChart();
      });
      legend.appendChild(chip);
    });
    controls.appendChild(legend);

    const viewToggle = createEl('button', {
      type: 'button',
      class: 'syop-view-toggle',
      'aria-pressed': String(syopChartState.showTable),
      'aria-controls': 'syop-distribution-view'
    }, syopChartState.showTable ? 'View chart' : 'View as table');
    viewToggle.addEventListener('click', () => {
      syopChartState.showTable = !syopChartState.showTable;
      renderBarChart();
    });
    controls.appendChild(viewToggle);

    container.appendChild(controls);

    const viewWrapper = createEl('div', { class: 'syop-bar-wrapper', id: 'syop-distribution-view' });
    container.appendChild(viewWrapper);

    const tooltip = createEl('div', { class: 'syop-bar-tooltip', role: 'tooltip', id: 'syop-bar-tooltip' });
    container.appendChild(tooltip);

    if (syopChartState.showTable) {
      renderSyopTable(viewWrapper);
      tooltip.classList.add('hidden');
      return;
    }

    tooltip.classList.remove('hidden');
    const activeConfig = POSITION_CONFIG.find((config) => config.key === syopChartState.activePosition)
      || POSITION_CONFIG[0];

    if (!activeConfig) {
      viewWrapper.appendChild(createEl('p', { class: 'syop-violin-empty' }, 'No positions available.'));
      return;
    }

    const metrics = SYOP_POSITION_SUMMARY[activeConfig.key];
    const distribution = SYOP_DISTRIBUTION[activeConfig.key] || [];
    const panel = createEl('section', { class: 'syop-violin-panel' });

    const header = createEl('header', { class: 'syop-violin-header' },
      createEl('div', { class: 'syop-violin-title-block' },
        createEl('h4', { class: 'syop-violin-title' }, activeConfig.label),
        createEl('div', { class: 'syop-violin-meta' },
          createEl('span', null, `${metrics?.total ?? 0} players`),
          createEl('span', null, `Median ${formatSyopValue(metrics?.median)} yrs`)
        )
      )
    );

    panel.appendChild(header);

    const plot = createEl('div', { class: 'syop-bar-plot' });
    panel.appendChild(plot);
    viewWrapper.appendChild(panel);

    drawSyopBarChart(plot, activeConfig, distribution, tooltip, container);
  }

  function drawSyopBarChart(plotContainer, config, distribution, tooltip, rootContainer) {
    const containerWidth = plotContainer.clientWidth || plotContainer.parentElement?.clientWidth || 320;
    const isCompact = window.innerWidth < 720 || containerWidth < 360;
    const width = Math.max(280, containerWidth);
    // SYOP tab bar-chart SVG: keep the generated viewBox tight around the
    // x-axis labels/title so the chart card does not render dead space below.
    const height = isCompact ? 226 : 280;
    const margin = isCompact
      ? { top: 20, right: 16, bottom: 44, left: 44 }
      : { top: 26, right: 20, bottom: 48, left: 48 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const values = distribution.map((entry) => entry.percentage || 0);
    const maxValue = Math.max(...values, 0);
    const yMax = maxValue === 0 ? 5 : Math.ceil(maxValue / 5) * 5;
    const tickStep = yMax > 40 ? 10 : yMax > 20 ? 5 : yMax > 10 ? 2 : 1;

    const scaleY = (value) => {
      if (yMax === 0) return margin.top + chartHeight;
      const clamped = Math.max(0, value);
      return margin.top + chartHeight - (clamped / yMax) * chartHeight;
    };

    plotContainer.innerHTML = '';
    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      class: 'syop-bar-svg'
    });

    const gradientStops = BAR_GRADIENTS[config.key] || BAR_GRADIENTS.DEFAULT;
    const gradientId = `syop-bar-gradient-${config.key.toLowerCase()}`;
    const defs = createSVG('defs');
    const gradient = createSVG('linearGradient', {
      id: gradientId,
      gradientUnits: 'userSpaceOnUse',
      x1: margin.left,
      y1: margin.top + chartHeight,
      x2: margin.left,
      y2: margin.top
    });

    gradientStops.forEach((stop) => {
      if (!stop) return;
      const attrs = {
        offset: stop.offset ?? '0%',
        'stop-color': stop.color || '#7C83FF'
      };
      if (typeof stop.opacity === 'number') {
        attrs['stop-opacity'] = String(stop.opacity);
      }
      gradient.appendChild(createSVG('stop', attrs));
    });

    defs.appendChild(gradient);
    svg.appendChild(defs);

    svg.appendChild(createSVG('rect', {
      x: margin.left,
      y: margin.top,
      width: chartWidth,
      height: chartHeight,
      class: 'syop-bar-area'
    }));

    const axisGroup = createSVG('g');

    for (let tick = 0; tick <= yMax; tick += tickStep) {
      const y = scaleY(tick);
      axisGroup.appendChild(createSVG('line', {
        x1: margin.left,
        x2: margin.left + chartWidth,
        y1: y,
        y2: y,
        class: 'syop-bar-grid'
      }));
      axisGroup.appendChild(createSVG('text', {
        x: margin.left - 8,
        y: y + 4,
        class: 'syop-bar-tick-label'
      }, document.createTextNode(`${tick}%`)));
    }

    axisGroup.appendChild(createSVG('line', {
      x1: margin.left,
      x2: margin.left,
      y1: margin.top,
      y2: margin.top + chartHeight,
      class: 'syop-bar-axis'
    }));

    axisGroup.appendChild(createSVG('line', {
      x1: margin.left,
      x2: margin.left + chartWidth,
      y1: margin.top + chartHeight,
      y2: margin.top + chartHeight,
      class: 'syop-bar-axis'
    }));

    const axisTitleY = createSVG('text', {
      x: margin.left - 35,
      y: margin.top + chartHeight / 2,
      class: 'syop-bar-axis-title syop-bar-axis-title-y',
      transform: `rotate(-90 ${margin.left - 35} ${margin.top + chartHeight / 2})`
    }, document.createTextNode('% of position'));

    axisGroup.appendChild(axisTitleY);

    const axisTitleX = createSVG('text', {
      x: margin.left + chartWidth / 2,
      y: margin.top + chartHeight + 30,
      class: 'syop-bar-axis-title syop-bar-axis-title-x'
    }, document.createTextNode('SYOP'));

    axisGroup.appendChild(axisTitleX);

    svg.appendChild(axisGroup);

    const bandWidth = chartWidth / Math.max(distribution.length, 1);
    const barWidth = Math.max(10, bandWidth * 0.64);

    const gradientStroke = (gradientStops[gradientStops.length - 1] || {}).color || config.color;

    distribution.forEach((entry, index) => {
      const value = entry.percentage || 0;
      const barHeight = Math.max(0, margin.top + chartHeight - scaleY(value));
      const x = margin.left + index * bandWidth + (bandWidth - barWidth) / 2;
      const y = scaleY(value);
      const rect = createSVG('rect', {
        x,
        y,
        width: barWidth,
        height: barHeight,
        rx: 6,
        class: 'syop-bar-rect',
        style: `--bar-stroke: ${gradientStroke}; fill: url(#${gradientId});`,
        tabindex: '0',
        role: 'button',
        'aria-label': `${config.key} ${Math.round(value * 10) / 10}%`
      });
      attachBarInteractions(rect, config, value, tooltip, rootContainer, gradientStroke);
      svg.appendChild(rect);

      const labelX = margin.left + index * bandWidth + bandWidth / 2;
      svg.appendChild(createSVG('text', {
        x: labelX,
        y: margin.top + chartHeight + 18,
        class: 'syop-bar-x-label'
      }, document.createTextNode(entry.bucket)));
    });

    plotContainer.appendChild(svg);
  }

  function attachBarInteractions(element, config, percentage, tooltip, rootContainer, accentColor) {
    if (!tooltip) return;
    const color = accentColor || config.color;
    const formattedPercent = `${Math.round(percentage * 10) / 10}%`;

    const hideTooltip = () => {
      element.classList.remove('active');
      tooltip.classList.remove('visible');
    };

    const showTooltip = () => {
      element.classList.add('active');
      tooltip.innerHTML = '';
      tooltip.style.setProperty('--tooltip-accent', color);
      tooltip.appendChild(createEl('div', { class: 'tooltip-name' }, config.key));
      tooltip.appendChild(createEl('div', { class: 'tooltip-meta' }, formattedPercent));

      const rootRect = rootContainer.getBoundingClientRect();
      const barRect = element.getBoundingClientRect();
      const containerWidth = rootRect.width;
      let left = barRect.left - rootRect.left + barRect.width / 2;
      left = Math.max(20, Math.min(containerWidth - 20, left));
      const top = barRect.top - rootRect.top - 8;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.classList.add('visible');
    };

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('focus', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
    element.addEventListener('blur', hideTooltip);
    element.addEventListener('click', (event) => {
      event.preventDefault();
      showTooltip();
    });
  }
  function renderSyopTable(wrapper) {
    wrapper.innerHTML = '';
    const tableWrapper = createEl('div', { class: 'syop-table-wrapper' });
    const table = createEl('table', { class: 'syop-table' });
    table.appendChild(createEl('caption', null, 'SYOP distribution summary by position'));

    const thead = createEl('thead', null,
      createEl('tr', null,
        createEl('th', null, 'Position'),
        createEl('th', null, 'Players'),
        createEl('th', null, 'Median SYOP'),
        createEl('th', null, 'IQR (25%–75%)'),
        createEl('th', null, '≥2 SYOP'),
        createEl('th', null, '≥3 SYOP'),
        createEl('th', null, 'Max'),
        createEl('th', null, 'Outliers')
      )
    );
    table.appendChild(thead);

    const tbody = createEl('tbody');
    POSITION_CONFIG.forEach((config) => {
      const metrics = SYOP_POSITION_SUMMARY[config.key];
      tbody.appendChild(createEl('tr', null,
        createEl('th', { scope: 'row' }, `${config.key} · ${config.label}`),
        createEl('td', null, metrics ? String(metrics.total) : '0'),
        createEl('td', null, metrics ? formatSyopValue(metrics.median) : '—'),
        createEl('td', null, metrics ? `${formatSyopValue(metrics.q1)} – ${formatSyopValue(metrics.q3)}` : '—'),
        createEl('td', null, metrics ? `${Math.round((metrics.shareTwoPlus || 0) * 100)}%` : '—'),
        createEl('td', null, metrics ? `${Math.round((metrics.shareThreePlus || 0) * 100)}%` : '—'),
        createEl('td', null, metrics ? formatSyopValue(metrics.max) : '—'),
        createEl('td', null, metrics ? String(metrics.outliers || 0) : '0')
      ));
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    wrapper.appendChild(tableWrapper);
  }

  function renderGauges() {
    const container = document.getElementById('syop-gauges');
    if (!container) return;
    container.innerHTML = '';

    GAUGES.forEach((gauge) => {
      const gaugeWrapper = createEl('div', { class: 'syop-gauge-card' });
      const svg = renderGaugeSVG(gauge);
      const label = createEl('div', { class: 'syop-gauge-label' },
        createEl('span', { class: 'gauge-value', style: { color: gauge.color } }, gauge.key),
        createEl('span', { class: 'gauge-title', style: { color: colors.subtext } }, 'AVG SYOP (YRS)')
      );
      gaugeWrapper.appendChild(svg);
      gaugeWrapper.appendChild(label);
      container.appendChild(gaugeWrapper);
    });
  }

  function renderGaugeSVG(gauge) {
    const min = 2;
    const max = 8;
    const width = 240;
    const height = 160;
    const cx = width / 2;
    const cy = height - 18;
    const radius = 112;
    const trackWidth = 18;

    const start = -Math.PI;
    const end = 0;
    const map = (value) => start + ((value - min) / (max - min)) * (end - start);
    const valueAngle = map(Math.max(min, Math.min(max, gauge.value)));

    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      class: 'syop-gauge-svg'
    });

    const defs = createSVG('defs');
    const gradient = createSVG('linearGradient', {
      id: `gauge-gradient-${gauge.key}`,
      x1: '0',
      y1: '1',
      x2: '1',
      y2: '0'
    });
    gradient.appendChild(createSVG('stop', { offset: '0%', 'stop-color': hexToRgba(gauge.color, 0.4) }));
    gradient.appendChild(createSVG('stop', { offset: '100%', 'stop-color': gauge.color }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const track = createSVG('path', {
      d: describeArc(cx, cy, radius, start, end),
      stroke: 'rgba(31, 36, 55, 0.8)',
      'stroke-width': trackWidth,
      'stroke-linecap': 'round',
      fill: 'none'
    });
    svg.appendChild(track);

    const valuePath = createSVG('path', {
      d: describeArc(cx, cy, radius, start, valueAngle),
      stroke: `url(#gauge-gradient-${gauge.key})`,
      'stroke-width': trackWidth,
      'stroke-linecap': 'round',
      fill: 'none'
    });
    svg.appendChild(valuePath);

    const ticks = [2, 3.5, 5, 6.5, 8];
    ticks.forEach((tick) => {
      const angle = map(tick);
      const inner = polar(cx, cy, radius - trackWidth / 2 - 4, angle);
      const outer = polar(cx, cy, radius + trackWidth / 2 + 4, angle);
      const line = createSVG('line', {
        x1: inner.x,
        y1: inner.y,
        x2: outer.x,
        y2: outer.y,
        stroke: 'rgba(255,255,255,0.7)',
        'stroke-width': '1.5'
      });
      svg.appendChild(line);

      const label = createSVG('text', {
        x: outer.x,
        y: outer.y - 6,
        fill: colors.subtext,
        'font-size': '11',
        'text-anchor': 'middle'
      }, document.createTextNode(tick.toString()));
      svg.appendChild(label);
    });

    const valueText = createSVG('text', {
      x: cx,
      y: cy - 40,
      fill: gauge.color,
      'font-size': '30',
      'font-weight': '800',
      'text-anchor': 'middle',
      'paint-order': 'stroke',
      stroke: 'rgba(11, 14, 22, 0.72)',
      'stroke-width': '0.6'
    }, document.createTextNode(gauge.value.toFixed(2)));
    svg.appendChild(valueText);

    svg.appendChild(createSVG('text', {
      x: cx,
      y: cy - 16,
      fill: colors.subtext,
      'font-size': '16',
      'font-weight': '700',
      'text-anchor': 'middle'
    }, document.createTextNode('YRS')));

    return svg;
  }

  function describeArc(cx, cy, radius, a0, a1) {
    const start = polar(cx, cy, radius, a0);
    const end = polar(cx, cy, radius, a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  function renderDraftOverall() {
    const container = document.getElementById('draft-overall-chart');
    if (!container) return;
    container.innerHTML = '';

    const containerWidth = container.clientWidth || 0;
    const fallbackWidth = 360;
    const width = containerWidth > 0 ? containerWidth : fallbackWidth;
    const height = width < 520 ? 270 : 320;
    const margin = width < 520
      ? { top: 26, right: 14, bottom: 48, left: 46 }
      : { top: 32, right: 24, bottom: 56, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      width: String(width),
      height: String(height)
    });

    const defs = createSVG('defs');
    const gradient = createSVG('linearGradient', { id: 'draft-bar-fill', x1: '0', x2: '0', y1: '0', y2: '1' });
    gradient.appendChild(createSVG('stop', { offset: '0%', 'stop-color': colors.accentA }));
    gradient.appendChild(createSVG('stop', { offset: '100%', 'stop-color': colors.accentC }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const g = createSVG('g', { transform: `translate(${margin.left},${margin.top})` });
    svg.appendChild(g);

    const groupWidth = chartWidth / DRAFT_OVERALL.length;
    const niceMax = DRAFT_CHART_NICE_MAX || 10;

    const ticks = [];
    for (let value = 0; value <= niceMax + 0.0001; value += 10) {
      ticks.push(value);
    }

    ticks.forEach((tick) => {
      const y = chartHeight - (tick / niceMax) * chartHeight;
      g.appendChild(createSVG('line', {
        x1: 0,
        x2: chartWidth,
        y1: y,
        y2: y,
        stroke: tick === 0 ? 'rgba(255,255,255,0.16)' : colors.grid
      }));
      g.appendChild(createSVG('text', {
        x: -12,
        y: y + 4,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'end'
      }, document.createTextNode(`${tick}%`)));
    });

    DRAFT_OVERALL.forEach((row, index) => {
      const baseX = index * groupWidth;
      const barWidth = Math.min(54, groupWidth * 0.62);
      const barHeight = (row.hit / niceMax) * chartHeight;
      const y = chartHeight - barHeight;
      const rect = createSVG('rect', {
        x: baseX + (groupWidth - barWidth) / 2,
        y,
        width: barWidth,
        height: Math.max(0, barHeight),
        fill: 'url(#draft-bar-fill)',
        rx: 12,
        ry: 12,
        opacity: '0.95'
      });
      g.appendChild(rect);

      g.appendChild(createSVG('text', {
        x: baseX + groupWidth / 2,
        y: y - 8,
        fill: colors.text,
        'font-size': '12',
        'text-anchor': 'middle',
        'font-weight': '600'
      }, document.createTextNode(`${row.hit.toFixed(1)}%`)));

      g.appendChild(createSVG('text', {
        x: baseX + groupWidth / 2,
        y: chartHeight + 26,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'middle'
      }, document.createTextNode(`RD ${row.rd}`)));
    });

    g.appendChild(createSVG('line', {
      x1: 0,
      x2: chartWidth,
      y1: chartHeight,
      y2: chartHeight,
      stroke: 'rgba(255,255,255,0.2)'
    }));

    g.appendChild(createSVG('text', {
      x: chartWidth / 2,
      y: chartHeight + 42,
      fill: colors.subtext,
      'font-size': '12',
      'font-weight': '700',
      'text-anchor': 'middle'
    }, document.createTextNode('Draft Round')));

    container.appendChild(svg);

    const tiles = document.getElementById('draft-round-tiles');
    if (tiles) {
      tiles.innerHTML = '';
      DRAFT_OVERALL.forEach((row) => {
        const tile = createEl('div', { class: 'draft-tile' },
          createEl('span', { class: 'draft-tile-round' }, row.rd),
          createEl('span', { class: 'draft-tile-value' }, `${row.hit.toFixed(1)}%`)
        );
        tiles.appendChild(tile);
      });
    }
  }

  function catmullRomPath(points) {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    const segments = [`M ${points[0].x} ${points[0].y}`];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      segments.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
    }
    return segments.join(' ');
  }

  function renderDraftPositional() {
    const container = document.getElementById('draft-positional-chart');
    if (!container) return;
    container.innerHTML = '';

    const legend = createEl('div', { class: 'syop-line-legend' });
    DRAFT_SERIES.forEach((series) => {
      legend.appendChild(createEl('span', { class: 'legend-item' },
        createEl('span', { class: 'legend-swatch', style: { backgroundColor: series.color } }),
        createEl('span', { class: 'legend-label' }, series.key)
      ));
    });

    const legendHost = document.getElementById('draft-positional-legend');
    if (legendHost) {
      legendHost.innerHTML = '';
      legendHost.appendChild(legend);
    } else {
      container.appendChild(legend);
    }

    const containerWidth = container.clientWidth || 0;
    const fallbackWidth = 360;
    const width = containerWidth > 0 ? containerWidth : fallbackWidth;
    const isCompact = width < 520;
    const height = isCompact ? 300 : 320;
    const margin = isCompact
      ? { top: 48, right: 20, bottom: 56, left: 54 }
      : { top: 32, right: 24, bottom: 56, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      width: String(width),
      height: String(height)
    });

    const g = createSVG('g', { transform: `translate(${margin.left},${margin.top})` });
    svg.appendChild(g);

    const rounds = DRAFT_POSITIONAL.map((row) => row.rd);
    const stepX = chartWidth / (rounds.length - 1 || 1);
    const niceMax = DRAFT_CHART_NICE_MAX || 10;
    const yTicks = [];
    for (let value = 0; value <= niceMax + 0.0001; value += 10) {
      yTicks.push(value);
    }

    yTicks.forEach((tick) => {
      const y = chartHeight - (tick / niceMax) * chartHeight;
      g.appendChild(createSVG('line', {
        x1: 0,
        x2: chartWidth,
        y1: y,
        y2: y,
        stroke: tick === 0 ? 'rgba(255,255,255,0.16)' : colors.grid
      }));
      g.appendChild(createSVG('text', {
        x: -12,
        y: y + 4,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'end'
      }, document.createTextNode(`${tick}%`)));
    });

    rounds.forEach((round, index) => {
      const x = index * stepX;
      g.appendChild(createSVG('text', {
        x,
        y: chartHeight + 26,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'middle'
      }, document.createTextNode(`RD ${round}`)));
    });

    const dotRadius = isCompact ? 3.6 : 4.4;

    DRAFT_SERIES.forEach((series) => {
      const points = DRAFT_POSITIONAL.map((row, index) => ({
        x: index * stepX,
        y: chartHeight - ((Number(row[series.key]) || 0) / niceMax) * chartHeight,
        value: row[series.key],
        roundIndex: index
      }));

      const path = createSVG('path', {
        d: catmullRomPath(points),
        fill: 'none',
        stroke: series.color,
        'stroke-width': '3',
        'stroke-linecap': 'round'
      });
      g.appendChild(path);

      points.forEach((point) => {
        g.appendChild(createSVG('circle', {
          cx: point.x,
          cy: point.y,
          r: String(dotRadius),
          fill: colors.bg,
          stroke: series.color,
          'stroke-width': '2'
        }));
      });
    });

    g.appendChild(createSVG('line', {
      x1: 0,
      x2: chartWidth,
      y1: chartHeight,
      y2: chartHeight,
      stroke: 'rgba(255,255,255,0.18)'
    }));

    g.appendChild(createSVG('text', {
      x: chartWidth / 2,
      y: chartHeight + 42,
      fill: colors.subtext,
      'font-size': '12',
      'font-weight': '700',
      'text-anchor': 'middle'
    }, document.createTextNode('Draft Round')));

    container.appendChild(svg);

    const chipsContainer = createEl('div', {
      class: 'draft-round-chip-container',
      style: {
        padding: `0 ${margin.right}px 0 ${margin.left}px`
      }
    });
    const chipGrid = createEl('div', {
      class: 'draft-round-chip-grid',
      style: { '--round-count': rounds.length }
    });

    rounds.forEach((round, index) => {
      const column = createEl('div', {
        class: 'draft-round-chip-col',
        dataset: { round }
      });
      const roundData = DRAFT_POSITIONAL[index] || {};
      const sortedSeries = DRAFT_SERIES
        .map((series) => ({
          key: series.key,
          color: series.color,
          value: Number(roundData[series.key]) || 0
        }))
        .sort((a, b) => b.value - a.value);

      sortedSeries.forEach((entry) => {
        const chip = createEl('div', {
          class: 'draft-round-chip',
          style: {
            '--chip-accent': entry.color,
            borderColor: hexToRgba(entry.color, 0.55)
          }
        },
        createEl('span', {
          class: 'draft-round-chip-dot',
          style: { backgroundColor: entry.color }
        }),
        createEl('span', {
          class: 'draft-round-chip-value'
        }, `${entry.value}%`));

        column.appendChild(chip);
      });

      chipGrid.appendChild(column);
    });

    chipsContainer.appendChild(chipGrid);
    container.appendChild(chipsContainer);
  }

  function getPosAnalysisRoot() {
    return document.getElementById('pos-analysis-root');
  }

  function posAnalysisIcon(name, extraClass = '') {
    const paths = POS_ANALYSIS_ICON_PATHS[name] || POS_ANALYSIS_ICON_PATHS.target;
    const className = `pos-analysis-icon${extraClass ? ` ${extraClass}` : ''}`;
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  }

  function hydratePosAnalysisIcons(root = getPosAnalysisRoot()) {
    if (!root) return;
    root.querySelectorAll('[data-pos-analysis-icon]').forEach((node) => {
      if (node.dataset.posAnalysisIconReady === 'true') return;
      const iconName = node.dataset.posAnalysisIcon || 'target';
      const iconClass = node.classList.contains('pos-analysis-button-icon')
        ? 'pos-analysis-icon--button'
        : 'pos-analysis-icon--shell';
      node.innerHTML = posAnalysisIcon(iconName, iconClass);
      node.dataset.posAnalysisIconReady = 'true';
    });
  }

  function escapePosAnalysisHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function escapePosAnalysisAttr(value) {
    return escapePosAnalysisHtml(value).replace(/`/g, '&#96;');
  }

  function posAnalysisNumber(value) {
    const number = Number(String(value ?? '').replace(/,/g, '').trim());
    return Number.isFinite(number) ? number : null;
  }

  function parsePosAnalysisCSV(text) {
    const rows = [];
    let row = [];
    let value = '';
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          value += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(value);
        value = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') index += 1;
        row.push(value);
        if (row.some((cell) => String(cell).trim() !== '')) rows.push(row);
        row = [];
        value = '';
      } else {
        value += char;
      }
    }

    if (value.length || row.length) {
      row.push(value);
      if (row.some((cell) => String(cell).trim() !== '')) rows.push(row);
    }

    return rows;
  }

  async function loadPosAnalysisRows() {
    const response = await fetch(POS_ANALYSIS_DATA_PATH, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Could not load positional analysis data: ${response.status}`);
    }

    const csvRows = parsePosAnalysisCSV(await response.text());
    if (!csvRows.length) throw new Error('Dataset is empty.');

    const header = csvRows[0].map((heading) => String(heading).trim());
    const columnIndex = Object.fromEntries(header.map((heading, index) => [heading, index]));
    const requiredColumns = ['YEAR', 'Player', 'POS', 'FPTS RK', 'FPTS'];
    const missingColumns = requiredColumns.filter((column) => !(column in columnIndex));
    if (missingColumns.length) {
      throw new Error(`Dataset missing required columns: ${missingColumns.join(', ')}`);
    }

    return csvRows.slice(1).map((csvRow) => ({
      year: posAnalysisNumber(csvRow[columnIndex.YEAR]),
      player: String(csvRow[columnIndex.Player] ?? '').trim(),
      pos: String(csvRow[columnIndex.POS] ?? '').trim().toUpperCase(),
      rank: posAnalysisNumber(csvRow[columnIndex['FPTS RK']]),
      fpts: posAnalysisNumber(csvRow[columnIndex.FPTS])
    })).filter((row) => row.year && row.pos && Number.isFinite(row.rank));
  }

  function computePosAnalysisCounts(rows) {
    const rowsByYear = new Map();
    POS_ANALYSIS_YEARS.forEach((year) => rowsByYear.set(year, []));
    rows.forEach((row) => {
      if (!rowsByYear.has(row.year)) rowsByYear.set(row.year, []);
      rowsByYear.get(row.year).push(row);
    });

    const sortedRowsByYear = new Map();
    POS_ANALYSIS_YEARS.forEach((year) => {
      sortedRowsByYear.set(year, (rowsByYear.get(year) || []).slice().sort((a, b) => (
        a.rank - b.rank
        || (Number.isFinite(b.fpts) ? b.fpts : 0) - (Number.isFinite(a.fpts) ? a.fpts : 0)
        || String(a.player).localeCompare(String(b.player))
      )));
    });

    const counts = {};
    POS_ANALYSIS_RANGE_OPTIONS.forEach((range) => {
      counts[range] = Object.fromEntries(POS_ANALYSIS_POSITIONS.map((pos) => [pos, []]));
      const cut = POS_ANALYSIS_CUTS[range];
      POS_ANALYSIS_YEARS.forEach((year) => {
        const topRows = (sortedRowsByYear.get(year) || []).slice(0, cut);
        POS_ANALYSIS_POSITIONS.forEach((pos) => {
          counts[range][pos].push(topRows.filter((row) => row.pos === pos).length);
        });
      });
    });

    return counts;
  }

  function ensurePosAnalysisData() {
    if (POS_ANALYSIS_STATE.loaded) return Promise.resolve(POS_ANALYSIS_STATE.rows);
    if (POS_ANALYSIS_STATE.loadingPromise) return POS_ANALYSIS_STATE.loadingPromise;

    POS_ANALYSIS_STATE.loadingPromise = loadPosAnalysisRows().then((rows) => {
      POS_ANALYSIS_STATE.rows = rows;
      POS_ANALYSIS_STATE.counts = computePosAnalysisCounts(rows);
      POS_ANALYSIS_STATE.loaded = true;
      return rows;
    });

    return POS_ANALYSIS_STATE.loadingPromise;
  }

  function posAnalysisValues(range, pos) {
    return (POS_ANALYSIS_STATE.counts?.[range]?.[pos] || []).map((value) => {
      const number = Number(value);
      return Number.isFinite(number) ? Math.max(0, number) : 0;
    });
  }

  function getPosAnalysisDisplayPositions() {
    const allowed = POS_ANALYSIS_STATE.positionView === 'rbWr' ? ['RB', 'WR'] : POS_ANALYSIS_POSITIONS;
    const active = allowed.filter((pos) => POS_ANALYSIS_STATE.activePositions.includes(pos));
    return active.length ? active : allowed;
  }

  function getPosAnalysisPositionControlPositions() {
    return POS_ANALYSIS_STATE.positionView === 'rbWr' ? ['RB', 'WR'] : POS_ANALYSIS_POSITIONS;
  }

  function getPosAnalysisPositionIcon(pos) {
    return {
      QB: 'helmet',
      RB: 'runner',
      WR: 'route',
      TE: 'shield'
    }[pos] || 'target';
  }

  function getPosAnalysisDynamicDomain(range, positions) {
    const values = positions.flatMap((pos) => posAnalysisValues(range, pos));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const min = minValue <= 3 ? 0 : Math.max(0, minValue - 1);
    const max = maxValue + 1;
    return { min, max: Math.max(max, min + 1) };
  }

  function getPosAnalysisMiniYears() {
    return POS_ANALYSIS_YEARS.filter((year) => year >= 2011 && year <= 2025);
  }

  function posAnalysisTickValues(min, max, targetCount = 6) {
    const span = Math.max(1, max - min);
    const step = Math.max(1, Math.ceil(span / targetCount));
    const ticks = [];
    for (let value = min; value <= max; value += step) {
      ticks.push(value);
    }
    if (!ticks.includes(max)) ticks.push(max);
    return ticks;
  }

  function formatPosAnalysisDelta(value) {
    if (!Number.isFinite(value)) return 'NA';
    if (value > 0) return `+${value}`;
    if (value < 0) return String(value);
    return '0';
  }

  function meanPosAnalysis(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  function rankPosAnalysisHighToLow(current, values) {
    return 1 + values.filter((value) => value > current).length;
  }

  function posAnalysisYearsMatching(values, target) {
    return POS_ANALYSIS_YEARS.filter((_, index) => values[index] === target).join(', ');
  }

  function posAnalysisLatestYearMatching(values, target) {
    const years = POS_ANALYSIS_YEARS.filter((_, index) => values[index] === target);
    return years.length ? String(years.at(-1)) : '';
  }

  function getPosAnalysisTiers(values) {
    const tiers = Array(values.length).fill('high');
    values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value || a.index - b.index)
      .forEach((item, index) => {
        tiers[item.index] = index < 6 ? 'low' : index < 12 ? 'mid' : 'high';
      });
    return tiers;
  }

  function getPosAnalysisPositionStats(range, pos) {
    const values = posAnalysisValues(range, pos);
    const current = values.at(-1) ?? 0;
    const previous = values.at(-2) ?? current;
    const avg = meanPosAnalysis(values);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    return {
      pos,
      values,
      current,
      previous,
      changeFromPrevious: current - previous,
      avg,
      min,
      max,
      bestYears: posAnalysisYearsMatching(values, max),
      worstYears: posAnalysisYearsMatching(values, min),
      rank: rankPosAnalysisHighToLow(current, values),
      vsAverage: current - avg
    };
  }

  function getPosAnalysisRangeSummary(range) {
    const stats = Object.fromEntries(POS_ANALYSIS_POSITIONS.map((pos) => [pos, getPosAnalysisPositionStats(range, pos)]));
    const current = Object.fromEntries(POS_ANALYSIS_POSITIONS.map((pos) => [pos, stats[pos].current]));
    const rbValues = posAnalysisValues(range, 'RB');
    const wrValues = posAnalysisValues(range, 'WR');
    const year2020Index = POS_ANALYSIS_YEARS.indexOf(2020);
    const latestIndex = POS_ANALYSIS_YEARS.indexOf(2025);
    return {
      range,
      stats,
      current,
      rbWrDiff: (current.RB || 0) - (current.WR || 0),
      rb2020To2025: (rbValues[latestIndex] || 0) - (rbValues[year2020Index] || 0),
      wr2020To2025: (wrValues[latestIndex] || 0) - (wrValues[year2020Index] || 0)
    };
  }

  function posAnalysisSmoothPath(points, smoothing = 0.18) {
    if (!points.length) return '';
    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const p0 = points[index - 1] || points[index];
      const p1 = points[index];
      const p2 = points[index + 1];
      const p3 = points[index + 2] || p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) * smoothing;
      const cp1y = p1[1] + (p2[1] - p0[1]) * smoothing;
      const cp2x = p2[0] - (p3[0] - p1[0]) * smoothing;
      const cp2y = p2[1] - (p3[1] - p1[1]) * smoothing;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
  }

  // Positional Supply chart: each year-to-year segment gets its own subtle curve so gradients can follow the original tier-colored line behavior.
  function posAnalysisSmoothSegmentPath(points, index, smoothing = 0.12) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) * smoothing;
    const cp1y = p1[1] + (p2[1] - p0[1]) * smoothing;
    const cp2x = p2[0] - (p3[0] - p1[0]) * smoothing;
    const cp2y = p2[1] - (p3[1] - p1[1]) * smoothing;
    return `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }

  function renderPosAnalysisProfileSparkline(pos, range) {
    const values = posAnalysisValues(range, pos);
    const config = POS_ANALYSIS_POS_CONFIG[pos];
    const width = 260;
    const height = 62;
    const m = { l: 6, r: 9, t: 8, b: 8 };
    const plotW = width - m.l - m.r;
    const plotH = height - m.t - m.b;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);
    const x = (index) => m.l + index / Math.max(1, values.length - 1) * plotW;
    const y = (value) => m.t + plotH - (value - min) / span * plotH;
    const points = values.map((value, index) => [x(index), y(value)]);
    const last = points.at(-1) || [width - m.r, height / 2];
    const lastValue = values.at(-1) ?? 0;
    return `<svg class="pos-analysis-profile-sparkline" viewBox="0 0 ${width} ${height}" aria-label="${escapePosAnalysisAttr(pos)} ${escapePosAnalysisAttr(range)} historical sparkline"><line class="pos-analysis-profile-spark-base" x1="${m.l}" x2="${width - m.r}" y1="${height - m.b}" y2="${height - m.b}"/><path d="${posAnalysisSmoothPath(points, 0.16)}" fill="none" stroke="${config.high}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="4.2" fill="${config.high}" stroke="#050711" stroke-width="2"/><title>${pos} ${range}: ${lastValue} in 2025</title></svg>`;
  }

  function posAnalysisRectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  // Positional Analysis supply-chart data labels: SVG text positions use the
  // baseline, so visually equal above/below gaps require asymmetric y offsets.
  // Near-point candidates always come first; larger offsets are reserved for a
  // label that genuinely collides with one already placed.
  function getPosAnalysisSupplyLabelOffsets(fontSize, preferBelow, compact) {
    const above = -4;
    const below = fontSize + 4;
    const horizontalNudge = compact ? 6 : 9;
    const widerNudge = horizontalNudge * 2;
    const fartherAbove = above - fontSize - 5;
    const fartherBelow = below + fontSize + 5;
    const extremeAbove = fartherAbove - fontSize;
    const extremeBelow = fartherBelow + fontSize;
    const preferred = preferBelow ? below : above;
    const alternate = preferBelow ? above : below;
    const fartherPreferred = preferBelow ? fartherBelow : fartherAbove;
    const fartherAlternate = preferBelow ? fartherAbove : fartherBelow;
    return [
      [0, preferred],
      [0, alternate],
      [-horizontalNudge, preferred],
      [horizontalNudge, preferred],
      [-horizontalNudge, alternate],
      [horizontalNudge, alternate],
      [0, fartherPreferred],
      [0, fartherAlternate],
      [-horizontalNudge, fartherPreferred],
      [horizontalNudge, fartherPreferred],
      [-horizontalNudge, fartherAlternate],
      [horizontalNudge, fartherAlternate],
      [-widerNudge, preferred],
      [widerNudge, preferred],
      [-widerNudge, alternate],
      [widerNudge, alternate],
      [0, preferBelow ? extremeBelow : extremeAbove],
      [0, preferBelow ? extremeAbove : extremeBelow],
      [-horizontalNudge, preferBelow ? extremeBelow : extremeAbove],
      [horizontalNudge, preferBelow ? extremeBelow : extremeAbove]
    ];
  }

  function placePosAnalysisLabels(candidates, bounds) {
    const placed = [];
    candidates.forEach((candidate) => {
      const fontSize = candidate.fontSize || 10;
      const width = Math.max(14, String(candidate.text).length * fontSize * 0.62 + 8);
      const height = fontSize + 7;
      const offsets = candidate.offsets || [[0, -12], [0, 15], [-16, -12], [16, 15], [0, -28], [0, 30]];
      let chosen = null;

      for (const offset of offsets) {
        const x = Math.max(bounds.left + width / 2, Math.min(bounds.right - width / 2, candidate.x + offset[0]));
        const y = Math.max(bounds.top + height, Math.min(bounds.bottom - 2, candidate.y + offset[1]));
        const rect = {
          left: x - width / 2,
          right: x + width / 2,
          top: y - height + 2,
          bottom: y + 3
        };
        if (!placed.some((label) => posAnalysisRectsOverlap(rect, label.rect))) {
          chosen = { x, y, rect, width, height };
          break;
        }
      }

      if (!chosen && candidate.force) {
        const fallback = offsets[offsets.length - 1] || [0, -12];
        const x = Math.max(bounds.left + width / 2, Math.min(bounds.right - width / 2, candidate.x + fallback[0]));
        const y = Math.max(bounds.top + height, Math.min(bounds.bottom - 2, candidate.y + fallback[1]));
        chosen = {
          x,
          y,
          rect: { left: x - width / 2, right: x + width / 2, top: y - height + 2, bottom: y + 3 },
          width,
          height
        };
      }

      if (chosen) {
        placed.push({ ...candidate, ...chosen });
      }
    });
    return placed;
  }

  function renderPosAnalysisTextLabels(labels, className = 'pos-analysis-svg-value-label') {
    return labels.map((label) => {
      // Point-origin attributes keep label-distance behavior directly testable
      // without changing the visible SVG or the chart's tooltip interaction.
      const pointAttrs = Number.isFinite(label.pointX) && Number.isFinite(label.pointY)
        ? ` data-pos-analysis-point-x="${label.pointX.toFixed(1)}" data-pos-analysis-point-y="${label.pointY.toFixed(1)}" data-pos-analysis-series="${escapePosAnalysisAttr(label.series || '')}" data-pos-analysis-year="${escapePosAnalysisAttr(label.year || '')}"`
        : '';
      return `<text class="${className}"${pointAttrs} x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="middle" fill="${label.color}" font-size="${label.fontSize || 10}" font-weight="800">${escapePosAnalysisHtml(label.text)}</text>`;
    }).join('');
  }

  function renderPosAnalysisLabelPills(labels) {
    return labels.map((label) => (
      `<g class="pos-analysis-label-pill"><rect x="${label.rect.left.toFixed(1)}" y="${label.rect.top.toFixed(1)}" width="${label.width.toFixed(1)}" height="${label.height.toFixed(1)}" rx="5" fill="rgba(5,7,17,.78)" stroke="${label.color}" stroke-opacity=".38"/><text x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="middle" fill="${label.color}" font-size="${label.fontSize || 9}" font-weight="900">${escapePosAnalysisHtml(label.text)}</text></g>`
    )).join('');
  }

  function attachPosAnalysisTooltips(host) {
    const tooltip = document.getElementById('pos-analysis-tooltip');
    if (!host || !tooltip) return;

    const show = (event, target) => {
      tooltip.innerHTML = target.dataset.posAnalysisTip || '';
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY - 12}px`;
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
    };
    const move = (event) => {
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY - 12}px`;
    };
    const hide = () => {
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    };

    host.querySelectorAll('[data-pos-analysis-tip]').forEach((node) => {
      node.addEventListener('mouseenter', (event) => show(event, node));
      node.addEventListener('mousemove', move);
      node.addEventListener('focus', (event) => {
        const rect = node.getBoundingClientRect();
        show({ clientX: rect.left + rect.width / 2, clientY: rect.top }, node);
      });
      node.addEventListener('mouseleave', hide);
      node.addEventListener('blur', hide);
      node.addEventListener('touchstart', (event) => {
        const touch = event.touches?.[0];
        if (touch) show(touch, node);
      }, { passive: true });
    });
  }

  function setPosAnalysisMessage(message, tone = 'loading') {
    const root = getPosAnalysisRoot();
    if (!root) return;
    const safeMessage = escapePosAnalysisHtml(message);
    root.querySelectorAll('.pos-analysis-chart-host, .pos-analysis-mini-grid, .pos-analysis-profile-grid, .pos-analysis-stat-grid').forEach((node) => {
      node.innerHTML = `<div class="pos-analysis-message pos-analysis-message--${tone}">${safeMessage}</div>`;
    });
  }

  function refreshPosAnalysisControls() {
    const root = getPosAnalysisRoot();
    if (!root || !POS_ANALYSIS_STATE.counts) return;
    const summary = getPosAnalysisRangeSummary(POS_ANALYSIS_STATE.range);
    const rangeHost = document.getElementById('pos-analysis-range-buttons');
    const positionHost = document.getElementById('pos-analysis-position-buttons');

    if (rangeHost) {
      rangeHost.innerHTML = POS_ANALYSIS_RANGE_OPTIONS.map((range) => (
        `<button class="pos-analysis-range-btn${POS_ANALYSIS_STATE.range === range ? ' is-active' : ''}" type="button" data-pos-analysis-range="${range}" aria-pressed="${POS_ANALYSIS_STATE.range === range}">${range}</button>`
      )).join('');
      rangeHost.querySelectorAll('[data-pos-analysis-range]').forEach((button) => {
        button.addEventListener('click', () => {
          POS_ANALYSIS_STATE.range = button.dataset.posAnalysisRange;
          renderPosAnalysisAll();
        });
      });
    }

    if (positionHost) {
      const controlPositions = getPosAnalysisPositionControlPositions();
      positionHost.innerHTML = controlPositions.map((pos) => {
        const config = POS_ANALYSIS_POS_CONFIG[pos];
        const active = POS_ANALYSIS_STATE.activePositions.includes(pos);
        const current = summary.current[pos] ?? 0;
        return `<button class="pos-analysis-pos-btn${active ? ' is-active' : ''}" type="button" data-pos-analysis-position="${pos}" aria-pressed="${active}" style="--pos-low:${config.low};--pos-mid:${config.mid};--pos-high:${config.high}"><span class="pos-analysis-pos-icon">${posAnalysisIcon(getPosAnalysisPositionIcon(pos), 'pos-analysis-icon--pos')}</span><span class="pos-analysis-pos-name">${pos}</span><span class="pos-analysis-pos-current">${current}</span></button>`;
      }).join('');
      positionHost.querySelectorAll('[data-pos-analysis-position]').forEach((button) => {
        button.addEventListener('click', () => {
          const pos = button.dataset.posAnalysisPosition;
          const activeControlCount = controlPositions.filter((item) => POS_ANALYSIS_STATE.activePositions.includes(item)).length;
          if (POS_ANALYSIS_STATE.activePositions.includes(pos) && activeControlCount > 1) {
            POS_ANALYSIS_STATE.activePositions = POS_ANALYSIS_STATE.activePositions.filter((item) => item !== pos);
          } else if (!POS_ANALYSIS_STATE.activePositions.includes(pos)) {
            POS_ANALYSIS_STATE.activePositions.push(pos);
          }
          renderPosAnalysisAll();
        });
      });
    }

    root.querySelectorAll('[data-pos-analysis-mode]').forEach((button) => {
      const active = button.dataset.posAnalysisMode === POS_ANALYSIS_STATE.mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    root.querySelectorAll('[data-pos-analysis-position-view]').forEach((button) => {
      const active = button.dataset.posAnalysisPositionView === POS_ANALYSIS_STATE.positionView;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function refreshPosAnalysisYearControls() {
    const minSelect = document.getElementById('pos-analysis-min-year');
    const maxSelect = document.getElementById('pos-analysis-max-year');
    if (!minSelect || !maxSelect) return;

    const options = POS_ANALYSIS_YEARS.map((year) => `<option value="${year}">${year}</option>`).join('');
    if (!minSelect.options.length) minSelect.innerHTML = options;
    if (!maxSelect.options.length) maxSelect.innerHTML = options;

    minSelect.value = String(POS_ANALYSIS_STATE.minYear);
    maxSelect.value = String(POS_ANALYSIS_STATE.maxYear);
    minSelect.onchange = () => {
      POS_ANALYSIS_STATE.minYear = Number(minSelect.value) || 2014;
      if (POS_ANALYSIS_STATE.minYear > POS_ANALYSIS_STATE.maxYear) {
        POS_ANALYSIS_STATE.maxYear = POS_ANALYSIS_STATE.minYear;
      }
      renderPosAnalysisAll();
    };
    maxSelect.onchange = () => {
      POS_ANALYSIS_STATE.maxYear = Number(maxSelect.value) || 2025;
      if (POS_ANALYSIS_STATE.maxYear < POS_ANALYSIS_STATE.minYear) {
        POS_ANALYSIS_STATE.minYear = POS_ANALYSIS_STATE.maxYear;
      }
      renderPosAnalysisAll();
    };
  }

  function renderPosAnalysisSummaryChips() {
    const host = document.getElementById('pos-analysis-summary-chips');
    if (!host) return;
    const summary = getPosAnalysisRangeSummary(POS_ANALYSIS_STATE.range);
    const diffLabel = `2025  ${summary.range.toUpperCase()} · RB vs. WR`;
    // Positional Analysis stat-chip copy stays source-specific by breakpoint:
    // mobile omits the tier because the Range chip already supplies that context.
    const mobileDiffLabel = '2025 · RB vs. WR';
    const chips = [
      { key: 'range', label: 'SELECTED RANGE', mobileLabel: 'RANGE', value: summary.range, mobileValue: summary.range, tone: '', icon: 'target' },
      { key: 'difference', label: diffLabel, mobileLabel: mobileDiffLabel, value: formatPosAnalysisDelta(summary.rbWrDiff), mobileValue: `${formatPosAnalysisDelta(summary.rbWrDiff)} RB`, tone: summary.rbWrDiff >= 0 ? 'up' : 'down', icon: 'diff' },
      { key: 'rb-trend', label: 'RB 2020 ➜ 2025', mobileLabel: 'RB 2020 ➜ 2025', value: formatPosAnalysisDelta(summary.rb2020To2025), mobileValue: formatPosAnalysisDelta(summary.rb2020To2025), tone: summary.rb2020To2025 >= 0 ? 'up' : 'down', icon: summary.rb2020To2025 >= 0 ? 'trend-up' : 'trend-down' },
      { key: 'wr-trend', label: 'WR 2020 ➜ 2025', mobileLabel: 'WR 2020 ➜ 2025', value: formatPosAnalysisDelta(summary.wr2020To2025), mobileValue: formatPosAnalysisDelta(summary.wr2020To2025), tone: summary.wr2020To2025 >= 0 ? 'up' : 'down', icon: summary.wr2020To2025 >= 0 ? 'trend-up' : 'trend-down' }
    ];
    // Positional Analysis stat chips: both breakpoints place the icon beside the
    // value; duplicate label/value nodes preserve their breakpoint-specific copy.
    host.innerHTML = chips.map((chip) => {
      const toneClass = chip.tone ? `pos-analysis-stat-chip--${chip.tone}` : '';
      const chipClass = `pos-analysis-stat-chip--${chip.key}`;
      const desktopIcon = posAnalysisIcon(chip.icon, 'pos-analysis-icon--chip');
      const mobileIcon = posAnalysisIcon(chip.icon, 'pos-analysis-icon--chip');
      return `<div class="pos-analysis-stat-chip ${chipClass} ${toneClass}"><span class="pos-analysis-stat-chip-label pos-analysis-stat-chip-label--desktop"><span>${escapePosAnalysisHtml(chip.label)}</span></span><span class="pos-analysis-stat-chip-label pos-analysis-stat-chip-label--mobile"><span>${escapePosAnalysisHtml(chip.mobileLabel)}</span></span><strong class="pos-analysis-stat-chip-value pos-analysis-stat-chip-value--desktop">${desktopIcon}<span>${escapePosAnalysisHtml(chip.value)}</span></strong><strong class="pos-analysis-stat-chip-value pos-analysis-stat-chip-value--mobile">${mobileIcon}<span>${escapePosAnalysisHtml(chip.mobileValue)}</span></strong></div>`;
    }).join('');
  }

  function renderPosAnalysisGlobalChart() {
    const title = document.getElementById('pos-analysis-global-title');
    const subtitle = document.getElementById('pos-analysis-global-subtitle');
    const viewTitle = POS_ANALYSIS_STATE.positionView === 'rbWr'
      ? '2007-2025 Positional Distribution: RB vs. WR'
      : '2007-2025 Positional Distribution: ALL POS';
    if (title) title.textContent = viewTitle;
    if (subtitle) {
      subtitle.textContent = window.innerWidth <= 700 && POS_ANALYSIS_STATE.positionView === 'rbWr'
        ? 'RB and WR distribution per szn inside the selected PPR FPTS rank range.'
        : POS_ANALYSIS_STATE.mode === 'grid'
          ? 'Four-range comparison: Top 24, Top 36, Top 48, and Top 60.'
          : POS_ANALYSIS_STATE.positionView === 'rbWr'
            ? 'Running back and wide receiver counts inside the selected fantasy-points rank range.'
            : 'Position counts inside the selected fantasy-points rank range.';
    }

    if (POS_ANALYSIS_STATE.mode === 'grid') {
      renderPosAnalysisGlobalGrid();
    } else {
      renderPosAnalysisGlobalSingle();
    }
    renderPosAnalysisSummaryChips();
  }

  function renderPosAnalysisGlobalSingle() {
    const host = document.getElementById('pos-analysis-global-chart');
    if (!host) return;
    const range = POS_ANALYSIS_STATE.range;
    const active = getPosAnalysisDisplayPositions();
    const compact = window.innerWidth < 640;
    // Positional Analysis top supply chart:
    // mobile uses its own compact SVG coordinate system so the RB/WR x-axis
    // years sit close together and the chart does not need horizontal scroll.
    const w = compact ? 440 : 1200;
    const h = compact ? 342 : 472;
    const m = compact
      ? { l: 30, r: 28, t: 34, b: 36 }
      : { l: 52, r: 72, t: 34, b: 58 };
    const plotW = w - m.l - m.r;
    const plotH = h - m.t - m.b;
    const maxValue = Math.max(...active.flatMap((pos) => posAnalysisValues(range, pos)), 0);
    const domain = POS_ANALYSIS_STATE.positionView === 'rbWr'
      ? getPosAnalysisDynamicDomain(range, active)
      : { min: 0, max: Math.max(POS_ANALYSIS_CUTS[range] <= 12 ? 6 : 12, Math.ceil((maxValue + 2) / 2) * 2) };
    const yMin = domain.min;
    const yMax = domain.max;
    const x = (index) => m.l + index / (POS_ANALYSIS_YEARS.length - 1) * plotW;
    const y = (value) => m.t + plotH - (value - yMin) / Math.max(1, yMax - yMin) * plotH;
    const labels = [];

    let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapePosAnalysisAttr(range)} positional supply">`;
    svg += '<defs>';
    active.forEach((pos) => {
      const values = posAnalysisValues(range, pos);
      const tiers = getPosAnalysisTiers(values);
      const config = POS_ANALYSIS_POS_CONFIG[pos];
      for (let index = 0; index < values.length - 1; index += 1) {
        const gradientId = `pos-analysis-supply-${range.replace(/\s+/g, '')}-${pos}-${index}`;
        svg += `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${x(index)}" y1="${y(values[index])}" x2="${x(index + 1)}" y2="${y(values[index + 1])}"><stop offset="0%" stop-color="${config[tiers[index]]}"/><stop offset="100%" stop-color="${config[tiers[index + 1]]}"/></linearGradient>`;
      }
    });
    svg += `</defs><rect class="pos-analysis-plot-bg" x="0" y="0" width="${w}" height="${h}" rx="22"/>`;

    posAnalysisTickValues(yMin, yMax, 6).forEach((tick) => {
      svg += `<line class="pos-analysis-supply-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-supply-axis-label" x="${m.l - 12}" y="${y(tick) + 4}" text-anchor="end">${tick}</text>`;
    });
    POS_ANALYSIS_YEARS.forEach((year, index) => {
      const xx = x(index);
      svg += `<line class="pos-analysis-supply-year-line" x1="${xx}" x2="${xx}" y1="${m.t}" y2="${h - m.b}"/>`;
      if (index % 2 === 0 || index === POS_ANALYSIS_YEARS.length - 1) {
        svg += `<text class="pos-analysis-supply-axis-label" x="${xx}" y="${compact ? h - 12 : h - 24}" text-anchor="middle">${year}</text>`;
      }
    });

    active.forEach((pos, posIndex) => {
      const values = posAnalysisValues(range, pos);
      const config = POS_ANALYSIS_POS_CONFIG[pos];
      const tiers = getPosAnalysisTiers(values);
      const points = values.map((value, index) => [x(index), y(value)]);
      for (let index = 0; index < values.length - 1; index += 1) {
        const gradientId = `pos-analysis-supply-${range.replace(/\s+/g, '')}-${pos}-${index}`;
        svg += `<path class="pos-analysis-supply-line" d="${posAnalysisSmoothSegmentPath(points, index, 0.105)}" stroke="url(#${gradientId})" stroke-width="6.3" fill="none"/>`;
      }
      values.forEach((value, index) => {
        const labelFontSize = compact ? 9 : 12;
        labels.push({
          x: points[index][0],
          y: points[index][1],
          pointX: points[index][0],
          pointY: points[index][1],
          series: pos,
          year: POS_ANALYSIS_YEARS[index],
          text: String(value),
          color: config[tiers[index]],
          fontSize: labelFontSize,
          offsets: getPosAnalysisSupplyLabelOffsets(labelFontSize, posIndex % 2 === 1, compact)
        });
        const tip = `<strong>${pos} · ${POS_ANALYSIS_YEARS[index]}</strong><br>${range} count: ${value}`;
        svg += `<circle class="pos-analysis-supply-point" cx="${points[index][0]}" cy="${points[index][1]}" r="${index === values.length - 1 ? 6 : 6}" fill="#050711" stroke="${config[tiers[index]]}" tabindex="0" data-pos-analysis-tip="${escapePosAnalysisAttr(tip)}"/>`;
      });
      const lastPoint = points.at(-1);
      svg += `<text class="pos-analysis-supply-series-label pos-analysis-supply-series-label--single" x="${lastPoint[0] + 12}" y="${lastPoint[1] + 4}" fill="${config.high}">${pos}</text>`;
    });

    svg += renderPosAnalysisTextLabels(placePosAnalysisLabels(labels, {
      left: m.l - 4,
      right: w - m.r + 26,
      top: m.t - 4,
      bottom: h - m.b + (compact ? 6 : 12)
    }), 'pos-analysis-supply-value-label');
    const scaleLabel = POS_ANALYSIS_STATE.positionView === 'rbWr'
      ? compact ? ` · scale ${yMin}-${yMax}` : ` · dynamic scale ${yMin}-${yMax}`
      : '';
    svg += `<text class="pos-analysis-supply-chart-title" x="${m.l}" y="22">${escapePosAnalysisHtml(range)} · active positions: ${escapePosAnalysisHtml(active.join(', '))}${scaleLabel}</text></svg>`;
    host.innerHTML = svg;
    attachPosAnalysisTooltips(host);
  }

  function renderPosAnalysisGlobalGrid() {
    const host = document.getElementById('pos-analysis-global-chart');
    if (!host) return;
    const active = getPosAnalysisDisplayPositions();
    const panelW = 560;
    const panelH = 228;
    const gap = 18;
    const w = panelW * 2 + gap;
    const h = panelH * 2 + gap;
    let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Four range supply comparison">`;

    // Positional Analysis grid x-axis: desktop shows a three-year cadence while
    // phones use a six-year cadence to keep every label clear in each mini chart.
    const mobile = window.innerWidth <= 700;
    const xLabelYears = mobile
      ? [2007, 2013, 2019, 2025]
      : [2007, 2010, 2013, 2016, 2019, 2022, 2025];
    const xLabelIndexes = xLabelYears.map((year) => POS_ANALYSIS_YEARS.indexOf(year));

    POS_ANALYSIS_GRID_RANGES.forEach((range, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const ox = col * (panelW + gap);
      const oy = row * (panelH + gap);
      const m = { l: 34, r: 42, t: 34, b: 36 };
      const plotW = panelW - m.l - m.r;
      const plotH = panelH - m.t - m.b;
      const domain = POS_ANALYSIS_STATE.positionView === 'rbWr'
        ? getPosAnalysisDynamicDomain(range, active)
        : { min: 0, max: Math.max(8, ...active.flatMap((pos) => posAnalysisValues(range, pos))) + 2 };
      const x = (pointIndex) => ox + m.l + pointIndex / (POS_ANALYSIS_YEARS.length - 1) * plotW;
      const y = (value) => oy + m.t + plotH - (value - domain.min) / Math.max(1, domain.max - domain.min) * plotH;
      svg += '<defs>';
      active.forEach((pos) => {
        const values = posAnalysisValues(range, pos);
        const tiers = getPosAnalysisTiers(values);
        const config = POS_ANALYSIS_POS_CONFIG[pos];
        for (let segmentIndex = 0; segmentIndex < values.length - 1; segmentIndex += 1) {
          const gradientId = `pos-analysis-grid-${range.replace(/\s+/g, '')}-${pos}-${index}-${segmentIndex}`;
          svg += `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${x(segmentIndex)}" y1="${y(values[segmentIndex])}" x2="${x(segmentIndex + 1)}" y2="${y(values[segmentIndex + 1])}"><stop offset="0%" stop-color="${config[tiers[segmentIndex]]}"/><stop offset="100%" stop-color="${config[tiers[segmentIndex + 1]]}"/></linearGradient>`;
        }
      });
      svg += `</defs><rect class="pos-analysis-small-plot-bg" x="${ox}" y="${oy}" width="${panelW}" height="${panelH}" rx="22"/><text class="pos-analysis-supply-grid-title" x="${ox + 18}" y="${oy + 24}">${range}</text>`;
      [domain.min, Math.round((domain.min + domain.max) / 2), domain.max].forEach((tick) => {
        svg += `<line class="pos-analysis-supply-grid-line" x1="${ox + m.l}" x2="${ox + panelW - m.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-supply-grid-axis-label" x="${ox + m.l - 8}" y="${y(tick) + 3}" text-anchor="end">${tick}</text>`;
      });
      xLabelIndexes.forEach((pointIndex) => {
        svg += `<text class="pos-analysis-supply-grid-axis-label" x="${x(pointIndex)}" y="${oy + panelH - 12}" text-anchor="middle">${POS_ANALYSIS_YEARS[pointIndex]}</text>`;
      });
      active.forEach((pos) => {
        const config = POS_ANALYSIS_POS_CONFIG[pos];
        const values = posAnalysisValues(range, pos);
        const points = values.map((value, pointIndex) => [x(pointIndex), y(value)]);
        for (let segmentIndex = 0; segmentIndex < values.length - 1; segmentIndex += 1) {
          const gradientId = `pos-analysis-grid-${range.replace(/\s+/g, '')}-${pos}-${index}-${segmentIndex}`;
          svg += `<path class="pos-analysis-supply-line" d="${posAnalysisSmoothSegmentPath(points, segmentIndex, 0.095)}" fill="none" stroke="url(#${gradientId})" stroke-width="3.4"/>`;
        }
        const lastPoint = points.at(-1);
        svg += `<text class="pos-analysis-supply-series-label pos-analysis-supply-series-label--grid" x="${lastPoint[0] + 6}" y="${lastPoint[1] + 3}" fill="${config.high}">${pos}</text>`;
      });
    });

    svg += '</svg>';
    host.innerHTML = svg;
  }

  function renderPosAnalysisProfiles() {
    const host = document.getElementById('pos-analysis-position-profiles');
    if (!host) return;
    const summary = getPosAnalysisRangeSummary(POS_ANALYSIS_STATE.range);
    host.innerHTML = POS_ANALYSIS_POSITIONS.map((pos) => {
      const stat = summary.stats[pos];
      const config = POS_ANALYSIS_POS_CONFIG[pos];
      const trendClass = stat.changeFromPrevious >= 0 ? 'up' : 'down';
      const latestPeakYear = posAnalysisLatestYearMatching(posAnalysisValues(POS_ANALYSIS_STATE.range, pos), stat.max);
      // Position-profile metrics use explicit mobile/desktop copy hooks: phones
      // omit "Rank", while the peak year can move inline without altering desktop.
      return `<article class="pos-analysis-profile-card" style="--pos-low:${config.low};--pos-mid:${config.mid};--pos-high:${config.high}"><div class="pos-analysis-profile-top"><div class="pos-analysis-profile-id"><span class="pos-analysis-profile-icon">${posAnalysisIcon(getPosAnalysisPositionIcon(pos), 'pos-analysis-icon--profile')}</span><div><strong>${pos}</strong></div></div><em class="pos-analysis-trend-pill pos-analysis-trend-pill--${trendClass}">${posAnalysisIcon(stat.changeFromPrevious >= 0 ? 'trend-up' : 'trend-down', 'pos-analysis-icon--trend')} ${formatPosAnalysisDelta(stat.changeFromPrevious)} YoY</em></div><div class="pos-analysis-profile-metrics"><div class="pos-analysis-profile-current"><span>Current</span><strong>${stat.current}</strong><small class="pos-analysis-profile-rank pos-analysis-profile-rank--desktop">Rank #${stat.rank} of 19</small><small class="pos-analysis-profile-rank pos-analysis-profile-rank--mobile">#${stat.rank} of 19</small></div><div class="pos-analysis-profile-stack"><div><span>Avg</span><strong>${stat.avg.toFixed(1)}</strong></div><div class="pos-analysis-profile-peak"><span>Peak</span><strong>${stat.max}</strong><small class="pos-analysis-profile-peak-year">${escapePosAnalysisHtml(latestPeakYear)}</small></div></div></div>${renderPosAnalysisProfileSparkline(pos, POS_ANALYSIS_STATE.range)}</article>`;
    }).join('');
  }

  function renderPosAnalysisMiniYearGrid() {
    const host = document.getElementById('pos-analysis-mini-year-grid');
    if (!host) return;
    const cuts = [6, 12, 24, 36, 48, 60];
    const maxY = 30;
    host.innerHTML = getPosAnalysisMiniYears().map((year) => {
      const width = 250;
      const height = 162;
      const m = { l: 34, r: 14, t: 28, b: 34 };
      const plotW = width - m.l - m.r;
      const plotH = height - m.t - m.b;
      const yearIndex = POS_ANALYSIS_YEARS.indexOf(year);
      const x = (index) => m.l + index / (cuts.length - 1) * plotW;
      const y = (value) => m.t + plotH - value / maxY * plotH;
      const wr = cuts.map((cut) => POS_ANALYSIS_STATE.counts[`Top ${cut}`].WR[yearIndex]);
      const rb = cuts.map((cut) => POS_ANALYSIS_STATE.counts[`Top ${cut}`].RB[yearIndex]);
      const wrPoints = wr.map((value, index) => [x(index), y(value)]);
      const rbPoints = rb.map((value, index) => [x(index), y(value)]);
      let svg = `<svg viewBox="0 0 ${width} ${height}" aria-label="${year} WR and RB cumulative counts">`;
      [0, 15, 30].forEach((tick) => {
        svg += `<line class="pos-analysis-mini-grid-line" x1="${m.l}" x2="${width - m.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-mini-axis-label" x="${m.l - 7}" y="${y(tick) + 3}" text-anchor="end">${tick}</text>`;
      });
      cuts.forEach((cut, index) => {
        if ([12, 36, 60].includes(cut)) {
          svg += `<text class="pos-analysis-mini-axis-label" x="${x(index)}" y="${height - 12}" text-anchor="middle">T${cut}</text>`;
        }
      });
      svg += `<path d="${posAnalysisSmoothPath(wrPoints, 0.2)}" class="pos-analysis-mini-line" stroke="${POS_ANALYSIS_MINI_LINE_COLORS.WR}"/><path d="${posAnalysisSmoothPath(rbPoints, 0.2)}" class="pos-analysis-mini-line" stroke="${POS_ANALYSIS_MINI_LINE_COLORS.RB}"/>`;
      wrPoints.forEach((point) => { svg += `<circle class="pos-analysis-mini-dot" cx="${point[0]}" cy="${point[1]}" r="2.2" fill="${POS_ANALYSIS_MINI_LINE_COLORS.WR}"/>`; });
      rbPoints.forEach((point) => { svg += `<circle class="pos-analysis-mini-dot" cx="${point[0]}" cy="${point[1]}" r="2.2" fill="${POS_ANALYSIS_MINI_LINE_COLORS.RB}"/>`; });
      // The wider legend x-offset keeps the WR and RB count groups distinct.
      svg += `<text class="pos-analysis-mini-year" x="14" y="18">${year}</text><text class="pos-analysis-mini-legend" x="72" y="18" fill="${POS_ANALYSIS_MINI_LINE_COLORS.WR}">WR ${wr.at(-1)}</text><text class="pos-analysis-mini-legend" x="142" y="18" fill="${POS_ANALYSIS_MINI_LINE_COLORS.RB}">RB ${rb.at(-1)}</text></svg>`;
      return `<article class="pos-analysis-mini-card">${svg}</article>`;
    }).join('');
  }

  function renderPosAnalysisTierStackBars() {
    const host = document.getElementById('pos-analysis-tier-stack-chart');
    if (!host) return;
    const compact = window.innerWidth < 640;
    const w = 1180;
    const h = compact ? 354 : 382;
    // Positional Analysis G1 tier stack chart:
    // compact margins pull the y-axis labels toward the mobile edge while
    // leaving the desktop chart geometry unchanged.
    const m = compact
      ? { l: 28, r: 12, t: 34, b: 52 }
      : { l: 46, r: 28, t: 34, b: 52 };
    const plotW = w - m.l - m.r;
    const plotH = h - m.t - m.b;
    const yMax = 26;
    const y = (value) => m.t + plotH - value / yMax * plotH;
    const groupW = plotW / POS_ANALYSIS_YEARS.length;
    const barW = Math.min(27, Math.max(16.5, groupW * 0.27));
    const pairGap = Math.min(10, Math.max(6, groupW * 0.1));
    const labelCutoff = compact ? 17 : 15;
    let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="RB and WR stacked tier supply bars">`;

    [0, 5, 10, 15, 20, 26].forEach((tick) => {
      svg += `<line class="pos-analysis-tier-stack-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-tier-stack-axis-label" x="${m.l - 8}" y="${y(tick) + 4}" text-anchor="end">${tick}</text>`;
    });

    POS_ANALYSIS_YEARS.forEach((year, yearIndex) => {
      const yearCenter = m.l + yearIndex * groupW + groupW / 2;
      ['WR', 'RB'].forEach((pos, posOffset) => {
        const x0 = yearCenter + (posOffset === 0 ? -(barW + pairGap) / 2 : pairGap / 2);
        const top12 = POS_ANALYSIS_STATE.counts['Top 12'][pos][yearIndex];
        const top36 = POS_ANALYSIS_STATE.counts['Top 36'][pos][yearIndex];
        const top60 = POS_ANALYSIS_STATE.counts['Top 60'][pos][yearIndex];
        const segments = [
          { cut: '12', label: 'T12', from: 0, to: top12, value: top12 },
          { cut: '36', label: 'T36', from: top12, to: top36, value: top36 },
          { cut: '60', label: 'T60', from: top36, to: top60, value: top60 }
        ];
        svg += `<g class="pos-analysis-tier-stack-bar" aria-label="${pos} ${year} tier stack">`;
        segments.forEach((segment) => {
          const y1 = y(segment.to);
          const y2 = y(segment.from);
          const segmentH = Math.max(0, y2 - y1);
          const fill = POS_ANALYSIS_RANGE_COLORS[segment.cut][pos];
          const tip = `<strong>${pos} ${segment.label} · ${year}</strong><br>Cumulative count: ${segment.value}<br>Segment count: ${segment.to - segment.from}`;
          svg += `<rect class="pos-analysis-tier-stack-segment" x="${x0}" y="${y1}" width="${barW}" height="${segmentH}" fill="${fill}" rx="${segment.cut === '60' ? Math.min(5, barW / 2) : 0}" data-pos-analysis-tip="${escapePosAnalysisAttr(tip)}" tabindex="0"/>`;
          if (segmentH >= labelCutoff) {
            const labelX = x0 + barW / 2;
            const labelY = y1 + segmentH / 2;
            svg += `<g class="pos-analysis-tier-stack-label-badge"><rect x="${x0 + 1.5}" y="${labelY - 10}" width="${barW - 3}" height="20" rx="5"/><text class="pos-analysis-tier-stack-label" x="${labelX}" y="${labelY - 2}" text-anchor="middle"><tspan class="pos-analysis-tier-stack-label-range" x="${labelX}">${segment.label}</tspan><tspan class="pos-analysis-tier-stack-label-count" x="${labelX}" dy="10">${segment.value}</tspan></text></g>`;
          }
        });
        svg += `</g><text class="pos-analysis-tier-stack-pos-label" x="${x0 + barW / 2}" y="${h - 34}" text-anchor="middle" fill="${POS_ANALYSIS_POS_CONFIG[pos].high}">${pos}</text>`;
      });
      svg += `<text class="pos-analysis-tier-stack-year-label" x="${yearCenter}" y="${h - 16}" text-anchor="middle">${year}</text>`;
    });

    svg += `<text class="pos-analysis-tier-stack-chart-title" x="${m.l}" y="24">Stack height = Top 60 total · section labels show cumulative T12, T36, and T60 counts</text></svg>`;
    host.innerHTML = svg;
    attachPosAnalysisTooltips(host);
  }

  function renderPosAnalysisCombo() {
    const host = document.getElementById('pos-analysis-combo-chart');
    if (!host) return;
    const years = POS_ANALYSIS_YEARS.filter((year) => year >= POS_ANALYSIS_STATE.minYear && year <= POS_ANALYSIS_STATE.maxYear);
    const container = host.closest('.pos-analysis-chart-scroll');
    const compact = window.innerWidth < 640;
    // Positional Analysis combined count + difference chart:
    // mobile removes extra side gutter from the SVG so the y-axis labels align
    // closer to the card edge without changing desktop spacing.
    const w = Math.max(360, Math.floor((container?.clientWidth || host.clientWidth || 1120) - (compact ? 6 : 24)));
    const h = 462;
    const m = compact ? { l: 28, r: 8 } : { l: 46, r: 24 };
    const markerTop = 34;
    const barTop = 112;
    const barBottom = 396;
    const barMax = 26;
    const cuts = ['12', '36', '60'];
    const allGaps = POS_ANALYSIS_YEARS.flatMap((year) => {
      const yearIndex = POS_ANALYSIS_YEARS.indexOf(year);
      return cuts.map((cut) => POS_ANALYSIS_STATE.counts[`Top ${cut}`].WR[yearIndex] - POS_ANALYSIS_STATE.counts[`Top ${cut}`].RB[yearIndex]);
    });
    const gapMin = Math.min(-16, Math.min(...allGaps, 0) - 1);
    const gapMax = Math.max(12, Math.max(...allGaps, 0) + 1);
    const barY = (value) => barTop + (barBottom - barTop) - Math.min(value, barMax) / barMax * (barBottom - barTop);
    const gapMinY = barY(barMax);
    const gapMaxY = markerTop;
    const gapY = (value) => gapMinY - (value - gapMin) / (gapMax - gapMin) * (gapMinY - gapMaxY);
    const gapZero = gapY(0);
    const plotW = Math.max(1, w - m.l - m.r);
    const groupW = plotW / Math.max(1, years.length);
    const clusterW = groupW * 0.78;
    const rangeStep = Math.min(clusterW / 2, Math.max(17, groupW * 0.29));
    const barW = Math.max(4, Math.min(10.8, rangeStep * 0.31));
    const barGap = Math.max(1, Math.min(1.4, barW * 0.12));
    const showAllYears = groupW >= 38;
    let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Combined WR and RB count bars with difference markers">`;

    [0, 5, 10, 15, 20, 26].forEach((tick) => {
      svg += `<line class="pos-analysis-combo-count-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${barY(tick)}" y2="${barY(tick)}"/><text class="pos-analysis-combo-axis-label" x="${m.l - 10}" y="${barY(tick) + 4}" text-anchor="end">${tick}</text>`;
    });
    [0, gapMax].forEach((tick) => {
      svg += `<line class="pos-analysis-combo-gap-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${gapY(tick)}" y2="${gapY(tick)}"/><text class="pos-analysis-combo-axis-label" x="${m.l - 10}" y="${gapY(tick) + 4}" text-anchor="end">${tick}</text>`;
    });

    years.forEach((year, yearOffset) => {
      const yearIndex = POS_ANALYSIS_YEARS.indexOf(year);
      const yearCenter = m.l + yearOffset * groupW + groupW / 2;
      cuts.forEach((cut, cutIndex) => {
        const markerX = yearCenter + (cutIndex - 1) * rangeStep;
        const wr = POS_ANALYSIS_STATE.counts[`Top ${cut}`].WR[yearIndex];
        const rb = POS_ANALYSIS_STATE.counts[`Top ${cut}`].RB[yearIndex];
        const gap = wr - rb;
        const wrColor = POS_ANALYSIS_RANGE_COLORS[cut].WR;
        const rbColor = POS_ANALYSIS_RANGE_COLORS[cut].RB;
        const gapColor = gap >= 0 ? wrColor : rbColor;
        const markerY = gapY(gap);
        const tip = `<strong>${year} · T${cut}</strong><br>WR ${wr} · RB ${rb}<br>WR-RB gap: ${formatPosAnalysisDelta(gap)}`;
        const wrX = markerX - barW - barGap / 2;
        const rbX = markerX + barGap / 2;
        // Positional Analysis combined chart:
        // mobile moves the tier context into the compact title so the bottom
        // axis stays clean; desktop keeps per-cluster T12/T36/T60 labels.
        const cutLabel = !compact
          ? `<text class="pos-analysis-combo-cut-label" x="${markerX}" y="${h - 48}" text-anchor="middle">T${cut}</text>`
          : '';
        svg += `<line class="pos-analysis-combo-gap-stem" x1="${markerX}" x2="${markerX}" y1="${gapZero}" y2="${markerY}" stroke="${gapColor}"/><circle class="pos-analysis-combo-gap-marker" cx="${markerX}" cy="${markerY}" r="5.1" stroke="${gapColor}" data-pos-analysis-tip="${escapePosAnalysisAttr(tip)}" tabindex="0"/><text class="pos-analysis-combo-gap-label" x="${markerX}" y="${gap >= 0 ? markerY - 9 : markerY + 16}" text-anchor="middle" fill="${gapColor}">${formatPosAnalysisDelta(gap)}</text><rect class="pos-analysis-combo-bar" x="${wrX}" y="${barY(wr)}" width="${barW}" height="${barBottom - barY(wr)}" rx="${barW / 2}" fill="${wrColor}"/><rect class="pos-analysis-combo-bar" x="${rbX}" y="${barY(rb)}" width="${barW}" height="${barBottom - barY(rb)}" rx="${barW / 2}" fill="${rbColor}"/>${cutLabel}`;
      });
      if (showAllYears || yearOffset % 2 === 0 || yearOffset === years.length - 1) {
        svg += `<text class="pos-analysis-combo-year-label" x="${yearCenter}" y="${h - 20}" text-anchor="middle">${year}</text>`;
      }
    });

    const comboTitle = w < 620
      ? 'T12/T36/T60 counts · Markers = WR-RB gap'
      : 'Bars = WR/RB counts · Markers = WR-RB gap · Count scale max = 26';
    svg += `<text class="pos-analysis-combo-chart-title" x="${m.l}" y="23">${comboTitle}</text></svg>`;
    host.innerHTML = svg;
    attachPosAnalysisTooltips(host);
  }

  function setupPosAnalysisInteractions() {
    const root = getPosAnalysisRoot();
    if (!root || POS_ANALYSIS_STATE.interactionsBound) return;

    root.querySelectorAll('[data-pos-analysis-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        POS_ANALYSIS_STATE.mode = button.dataset.posAnalysisMode || 'single';
        renderPosAnalysisAll();
      });
    });

    root.querySelectorAll('[data-pos-analysis-position-view]').forEach((button) => {
      button.addEventListener('click', () => {
        POS_ANALYSIS_STATE.positionView = button.dataset.posAnalysisPositionView || 'rbWr';
        POS_ANALYSIS_STATE.activePositions = POS_ANALYSIS_STATE.positionView === 'all'
          ? POS_ANALYSIS_POSITIONS.slice()
          : ['RB', 'WR'];
        renderPosAnalysisAll();
      });
    });

    root.querySelectorAll('[data-pos-analysis-personnel]').forEach((button) => {
      button.addEventListener('click', () => {
        POS_ANALYSIS_STATE.personnel = button.dataset.posAnalysisPersonnel || '12';
        renderPosAnalysisPersonnel();
      });
    });

    POS_ANALYSIS_STATE.interactionsBound = true;
  }

  function posAnalysisPlayer(label, x, y, type, note = '', role = type) {
    const roleClass = String(role).trim() ? ` pos-analysis-field-player--${escapePosAnalysisAttr(role)}` : '';
    return `<div class="pos-analysis-field-player pos-analysis-field-player--${type}${roleClass}" style="left:${x}%;bottom:${y}%"><strong>${escapePosAnalysisHtml(label)}</strong>${note ? `<span>${escapePosAnalysisHtml(note)}</span>` : ''}</div>`;
  }

  function renderPosAnalysisSimStat(icon, label, value) {
    return `<span class="pos-analysis-sim-stat-label">${posAnalysisIcon(icon, 'pos-analysis-icon--sim')}<span>${escapePosAnalysisHtml(label)}</span></span><strong>${escapePosAnalysisHtml(value)}</strong>`;
  }

  function renderPosAnalysisPersonnel() {
    const field = document.getElementById('pos-analysis-field-grid');
    const copy = document.getElementById('pos-analysis-shift-copy');
    const rbStat = document.getElementById('pos-analysis-sim-rb');
    const wrStat = document.getElementById('pos-analysis-sim-wr');
    const teStat = document.getElementById('pos-analysis-sim-te');
    const qbStat = document.getElementById('pos-analysis-sim-qb');
    if (!field || !copy || !rbStat || !wrStat || !teStat || !qbStat) return;

    const root = getPosAnalysisRoot();
    root?.querySelectorAll('[data-pos-analysis-personnel]').forEach((button) => {
      const active = button.dataset.posAnalysisPersonnel === POS_ANALYSIS_STATE.personnel;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    let players = '<div class="pos-analysis-line-of-scrimmage"></div><div class="pos-analysis-linemen"><span>LT</span><span>LG</span><span>C</span><span>RG</span><span>RT</span></div>';
    // Personnel coordinates keep TE/WR chips below the line row and place
    // inline tight ends outside the tackle area to avoid overlap in every state.
    // Stamp current personnel on the field grid so CSS @media desktop rules can
    // override left/bottom per-personnel without duplicating JS rendering.
    field.dataset.personnel = POS_ANALYSIS_STATE.personnel;

    if (POS_ANALYSIS_STATE.personnel === '11') {
      // 11 Personnel — MOBILE positions: WR1(X) 7%/37%, TE(Inline) 73%/37%,
      // WR3(Slot) 23%/31%, WR2(Z) 89%/31%.
      // Desktop overrides are in research.css @media (min-width: 869px)
      //   [data-personnel="11"] .pos-analysis-field-player--* { left/bottom }
      players += [
        posAnalysisPlayer('QB', 50, 23, 'qb', 'Shotgun', 'backfield-qb'),
        posAnalysisPlayer('RB', 42, 23, 'rb', 'Offset', 'backfield-rb'),
        posAnalysisPlayer('TE', 73, 37, 'te', 'Inline', 'inline-te-right'),
        posAnalysisPlayer('WR1', 7, 37, 'wr', 'X', 'wideout-left'),
        posAnalysisPlayer('WR2', 89, 31, 'wr', 'Z', 'wideout-right'),
        posAnalysisPlayer('WR3', 23, 31, 'wr', 'Slot', 'slot-left')
      ].join('');
      copy.innerHTML = '<strong>11 Personnel Layout (1 RB, 1 TE, 3 WR):</strong> spread targets, lighter run surface, and maximum three-WR route availability.';
      rbStat.innerHTML = renderPosAnalysisSimStat('runner', 'RB opportunity', 'Volume decreased');
      wrStat.innerHTML = renderPosAnalysisSimStat('route', 'WR opportunity', 'Max route availability');
      teStat.innerHTML = renderPosAnalysisSimStat('shield', 'TE role', '1 Receiving focused TE');
      qbStat.innerHTML = renderPosAnalysisSimStat('helmet', 'QB protection', 'Varied');
    } else if (POS_ANALYSIS_STATE.personnel === '13') {
      // 13 Personnel — MOBILE positions: WR1(X) 11%/31%, TE1(Inline) 72%/37%,
      // TE2(Off-Line) 80%/31%, TE3(Inline) 27%/37%.
      // Desktop overrides are in research.css @media (min-width: 869px)
      players += [
        posAnalysisPlayer('QB', 50, 31, 'qb', 'Under C', 'under-center-qb'),
        posAnalysisPlayer('RB', 50, 12, 'rb', 'Power', 'deep-back'),
        posAnalysisPlayer('TE1', 72, 37, 'te', 'Inline', 'inline-te-right'),
        posAnalysisPlayer('TE2', 80, 31, 'te', 'Off-Line', 'wing-te-right'),
        posAnalysisPlayer('TE3', 27, 37, 'te', 'Inline', 'inline-te-left'),
        posAnalysisPlayer('WR1', 11, 31, 'wr', 'X', 'wideout-left')
      ].join('');
      copy.innerHTML = '<strong>13 Personnel Layout (1 RB, 3 TE, 1 WR):</strong> maximum blocking structure, reduced WR depth, and peak ground leverage.';
      rbStat.innerHTML = renderPosAnalysisSimStat('runner', 'RB opportunity', 'Peak leverage');
      wrStat.innerHTML = renderPosAnalysisSimStat('route', 'WR opportunity', 'WR2/WR3 benched');
      teStat.innerHTML = renderPosAnalysisSimStat('shield', 'TE role', 'Triple snap expansion');
      qbStat.innerHTML = renderPosAnalysisSimStat('helmet', 'QB protection', 'Secure pocket');
    } else {
      // 12 Personnel — MOBILE positions: WR1(X) 7%/37%, TE1(Inline) 72%/37%,
      // TE2(Off-Line) 28%/31%, WR2(Z) 89%/31%.
      // Desktop overrides are in research.css @media (min-width: 869px)
      players += [
        posAnalysisPlayer('QB', 50, 31, 'qb', 'Under C', 'under-center-qb'),
        posAnalysisPlayer('RB', 50, 12, 'rb', 'Workhorse', 'deep-back'),
        posAnalysisPlayer('TE1', 72, 37, 'te', 'Inline', 'inline-te-right'),
        posAnalysisPlayer('TE2', 28, 31, 'te', 'Off-Line', 'inline-te-left'),
        posAnalysisPlayer('WR1', 7, 37, 'wr', 'X', 'wideout-left'),
        posAnalysisPlayer('WR2', 89, 31, 'wr', 'Z', 'wideout-right')
      ].join('');
      copy.innerHTML = '<strong>12 Personnel Layout (1 RB, 2 TE, 2 WR):</strong> added blocking surface, WR3 removed, and more sustainable RB environment.';
      rbStat.innerHTML = renderPosAnalysisSimStat('runner', 'RB opportunity', 'Volume & routes up');
      wrStat.innerHTML = renderPosAnalysisSimStat('route', 'WR opportunity', 'WR3 compressed');
      teStat.innerHTML = renderPosAnalysisSimStat('shield', 'TE role', 'Two on-field TEs');
      qbStat.innerHTML = renderPosAnalysisSimStat('helmet', 'QB protection', 'Extra inline help');
    }

    field.innerHTML = players;
  }

  function renderPosAnalysisAll() {
    if (!POS_ANALYSIS_STATE.loaded || !POS_ANALYSIS_STATE.counts) return;
    refreshPosAnalysisControls();
    refreshPosAnalysisYearControls();
    renderPosAnalysisGlobalChart();
    renderPosAnalysisProfiles();
    renderPosAnalysisMiniYearGrid();
    renderPosAnalysisTierStackBars();
    renderPosAnalysisCombo();
    renderPosAnalysisPersonnel();
  }

  function renderPositionalAnalysis() {
    const root = getPosAnalysisRoot();
    if (!root) return;
    hydratePosAnalysisIcons(root);
    setupPosAnalysisInteractions();
    renderPosAnalysisPersonnel();

    if (!POS_ANALYSIS_STATE.loaded) {
      setPosAnalysisMessage('Loading positional analysis data...');
      ensurePosAnalysisData()
        .then(() => renderPosAnalysisAll())
        .catch((error) => {
          console.error(error);
          POS_ANALYSIS_STATE.loadingPromise = null;
          setPosAnalysisMessage('Failed to load positional analysis data.', 'error');
        });
      return;
    }

    renderPosAnalysisAll();
  }

  function handleResize() {
    if (document.body.dataset.page !== PAGE_ID) return;
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      const activeTarget = document.querySelector('.syop-tab.active')?.dataset.target;
      if (activeTarget === 'draft-tab-panel') {
        renderDraftOverall();
        renderDraftPositional();
      } else if (activeTarget === 'positional-analysis-tab-panel') {
        renderPositionalAnalysis();
      } else {
        renderSunburst();
        renderBarChart();
        renderGauges();
      }
    }, 180);
  }

  function setupTabs() {
    const tabs = Array.from(document.querySelectorAll('.syop-tab'));
    if (tabs.length === 0) return;

    const panels = new Map();
    tabs.forEach((tab) => {
      const target = tab.dataset.target;
      if (target) {
        const panel = document.getElementById(target);
        if (panel) {
          panels.set(target, panel);
        }
      }
    });

    const activate = (tab, { focusTab } = { focusTab: false }) => {
      tabs.forEach((btn) => {
        const isActive = btn === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
        const target = btn.dataset.target;
        const panel = target ? panels.get(target) : null;
        if (panel) {
          if (isActive) {
            panel.classList.add('active');
            panel.removeAttribute('hidden');
          } else {
            panel.classList.remove('active');
            panel.setAttribute('hidden', '');
          }
        }
      });
      if (focusTab) {
        tab.focus();
      }

      window.requestAnimationFrame(() => {
        if (tab.dataset.target === 'draft-tab-panel') {
          renderDraftOverall();
          renderDraftPositional();
        } else if (tab.dataset.target === 'positional-analysis-tab-panel') {
          renderPositionalAnalysis();
        } else {
          renderSunburst();
          renderBarChart();
          renderGauges();
        }
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab, { focusTab: false }));
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          const delta = event.key === 'ArrowRight' ? 1 : -1;
          const nextIndex = (index + delta + tabs.length) % tabs.length;
          activate(tabs[nextIndex], { focusTab: true });
        }
      });
    });

    const currentActive = tabs.find((tab) => tab.classList.contains('active')) || tabs[0];
    if (currentActive) {
      activate(currentActive, { focusTab: false });
    }
  }

  function applyUsernameFromQuery() {
    const input = document.getElementById('usernameInput');
    if (!input) return;
    const params = new URLSearchParams(window.location.search);
    const uname = params.get('username');
    if (uname) {
      input.value = uname;
      // Prevent mobile keyboard from opening when landing with ?username
      setTimeout(() => { try { input.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {} }, 50);
    }
  }

  function init() {
    if (document.body.dataset.page !== PAGE_ID) return;
    applyUsernameFromQuery();
    setupTabs();
    renderSunburst();
    renderBarChart();
    renderGauges();
    renderDraftOverall();
    renderDraftPositional();
    setupPosAnalysisInteractions();
    renderPosAnalysisPersonnel();
    window.addEventListener('resize', handleResize);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
