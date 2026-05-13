(() => {
  const POSITIONS = ["QB", "RB", "WR", "TE"];
  const RANGE_OPTIONS = ["Top 6", "Top 12", "Top 24", "Top 36", "Top 48", "Top 60"];
  const RANGE_OPTIONS_WIDE_FIRST = ["Top 60", "Top 48", "Top 36", "Top 24", "Top 12", "Top 6"];
  const GRID_RANGES = ["Top 60", "Top 48", "Top 36", "Top 24"];

  const POSITION_COLORS = {
    QB: { low: "#ff9a3d", high: "#ff4187" },
    RB: { low: "#1ac2ff", high: "#06ff97" },
    WR: { low: "#8153ff", high: "#0299fe" },
    TE: { low: "#ff6bc8", high: "#7f2fff" },
  };

  const SYSTEM_PALETTES = {
    A: ["#ff0aa5", "#fe26f7", "#d747ff", "#a74eff", "#7866ff", "#4d79ff", "#00a9f1", "#00ddfa"],
    D: ["#00ff99", "#00ffcc", "#0099ff", "#0066ff", "#4c00ff", "#5d00ff", "#8f00ff", "#d200ff"],
  };

  const GRID_RANGE_LABEL_COLORS = {
    "Top 60": "#00DDFA",
    "Top 48": "#7866FF",
    "Top 36": "#FFB847",
    "Top 24": "#00FF99",
  };

  const state = {
    years: [],
    posData: {},
    selectedRange: "Top 60",
    activePositions: [...POSITIONS],
    chartMode: "single",
  };

  const iconPaths = {
    Activity: '<path d="M22 12h-4l-3 8-6-16-3 8H2" />',
    AlertTriangle: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" />',
    ArrowDownRight: '<path d="M7 7h10v10" /><path d="m7 17 10-10" />',
    ArrowUpRight: '<path d="M7 17 17 7" /><path d="M7 7h10v10" />',
    Gauge: '<path d="M4 14a8 8 0 0 1 16 0" /><path d="M12 14l4-4" /><path d="M5 19h14" />',
    Layers3: '<path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /><path d="m3 18 9 5 9-5" />',
    LineChart: '<path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-7" />',
    Minus: '<path d="M5 12h14" />',
    Sparkles: '<path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />',
    Target: '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />',
    Trophy: '<path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M5 5H3v2a4 4 0 0 0 4 4" /><path d="M19 5h2v2a4 4 0 0 1-4 4" />',
    Zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />',
  };

  const icon = (name, className = "icon") => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">${iconPaths[name] || ""}</svg>
  `;

  function sanitizeCount(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, n);
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  function rgbToHex({ r, g, b }) {
    const toHex = (v) => Math.round(v).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function blendHex(a, b, amount = 0.5) {
    const c1 = hexToRgb(a);
    const c2 = hexToRgb(b);
    return rgbToHex({
      r: c1.r + (c2.r - c1.r) * amount,
      g: c1.g + (c2.g - c1.g) * amount,
      b: c1.b + (c2.b - c1.b) * amount,
    });
  }

  const POS_CONFIG = Object.fromEntries(POSITIONS.map((pos) => {
    const base = POSITION_COLORS[pos];
    return [pos, { ...base, mid: blendHex(base.low, base.high, 0.5) }];
  }));

  const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const stdDev = (values) => {
    const avg = mean(values);
    return Math.sqrt(mean(values.map((value) => (value - avg) ** 2)));
  };
  const fmt = (value, digits = 1) => Number(value).toFixed(digits);
  const fmtDelta = (value) => value > 0 ? `+${value}` : value < 0 ? `${value}` : "±0";
  const rangeSize = (range) => Number(range.replace("Top ", ""));
  const slug = (value) => String(value).replace(/[^a-zA-Z0-9]/g, "");

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) throw new Error("CSV is empty.");
    const headers = lines[0].split(",").map((cell) => cell.trim());
    const years = headers.slice(2).map(Number).filter((year) => Number.isFinite(year));
    const posData = {};

    for (const line of lines.slice(1)) {
      const cells = line.split(",").map((cell) => cell.trim());
      const range = cells[0];
      const pos = cells[1];
      if (!range || !pos) continue;
      if (!posData[range]) posData[range] = {};
      posData[range][pos] = cells.slice(2).map((value) => Number(value));
    }

    for (const range of RANGE_OPTIONS) {
      if (!posData[range]) throw new Error(`Missing range in CSV: ${range}`);
      for (const pos of POSITIONS) {
        if (!posData[range][pos]) throw new Error(`Missing ${range} / ${pos} row in CSV.`);
      }
    }

    return { years, posData };
  }

  function getValues(range, pos) {
    return state.posData[range][pos].map(sanitizeCount);
  }

  function getRawValues(range, pos) {
    return state.posData[range][pos];
  }

  function getTiers(values) {
    const sorted = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value || a.index - b.index);
    const tiers = Array(values.length).fill("high");
    sorted.forEach((item, sortedIndex) => {
      tiers[item.index] = sortedIndex < 6 ? "low" : sortedIndex < 12 ? "mid" : "high";
    });
    return tiers;
  }

  function yearsMatching(values, target) {
    return state.years.filter((_, index) => values[index] === target).join(", ");
  }

  function rankHighToLow(current, values) {
    return 1 + values.filter((value) => value > current).length;
  }

  function getPositionStats(range, pos) {
    const values = getValues(range, pos);
    const current = values.at(-1);
    const previous = values.at(-2);
    const avg = mean(values);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const yoyRecords = values.slice(1).map((value, i) => ({ pos, from: state.years[i], year: state.years[i + 1], value, change: value - values[i] }));
    const biggestJump = [...yoyRecords].sort((a, b) => b.change - a.change)[0];
    const biggestDrop = [...yoyRecords].sort((a, b) => a.change - b.change)[0];
    const threeYearRecords = values.slice(2).map((value, i) => ({ from: state.years[i], year: state.years[i + 2], change: value - values[i] }));
    const worstThreeYear = [...threeYearRecords].sort((a, b) => a.change - b.change)[0];

    return {
      pos,
      values,
      current,
      previous,
      changeFromPrevious: current - previous,
      avg,
      min,
      max,
      bestYears: yearsMatching(values, max),
      worstYears: yearsMatching(values, min),
      std: stdDev(values),
      spread: max - min,
      rank: rankHighToLow(current, values),
      recent3Avg: mean(values.slice(-3)),
      biggestJump,
      biggestDrop,
      worstThreeYear,
      vsAverage: current - avg,
      vsPeak: current - max,
      vsFloor: current - min,
    };
  }

  function getRangeSummary(range) {
    const stats = Object.fromEntries(POSITIONS.map((pos) => [pos, getPositionStats(range, pos)]));
    const current = Object.fromEntries(POSITIONS.map((pos) => [pos, stats[pos].current]));
    const sortedCurrent = POSITIONS.map((pos) => ({ pos, value: current[pos] })).sort((a, b) => b.value - a.value);
    const leader = sortedCurrent[0];
    const rb = getValues(range, "RB");
    const wr = getValues(range, "WR");
    const qb = getValues(range, "QB");
    const firstRbOverWrIndex = state.years.findIndex((_, i) => rb[i] > wr[i]);
    const firstRbOverWr = firstRbOverWrIndex >= 0 ? state.years[firstRbOverWrIndex] : null;
    const wrThreeYear = wr.slice(2).map((value, i) => ({ from: state.years[i], year: state.years[i + 2], change: value - wr[i] }));
    const wrWorstThreeYear = [...wrThreeYear].sort((a, b) => a.change - b.change)[0];
    const idx2023 = state.years.indexOf(2023);
    const wr2325 = idx2023 >= 0 ? wr.at(-1) - wr[idx2023] : 0;
    const wr2325IsWorst = wrWorstThreeYear?.from === 2023 && wrWorstThreeYear?.year === 2025;
    const rbMax = Math.max(...rb);
    const wrMin = Math.min(...wr);
    const qbCurrentLeader = current.QB === Math.max(...POSITIONS.map((pos) => current[pos]));

    let qbLeadSince = null;
    if (qbCurrentLeader) {
      for (let i = state.years.length - 1; i >= 0; i -= 1) {
        const maxAtYear = Math.max(...POSITIONS.map((pos) => getValues(range, pos)[i]));
        if (qb[i] !== maxAtYear) {
          qbLeadSince = state.years[i + 1] ?? state.years[0];
          break;
        }
      }
      if (!qbLeadSince) qbLeadSince = state.years[0];
    }

    const parts = [];
    if (current.RB > current.WR && firstRbOverWr === 2025) parts.push("first RB > WR season");
    else if (current.RB > current.WR) parts.push(`RB > WR; first crossover ${firstRbOverWr}`);
    else if (current.WR > current.RB) parts.push("WR still ahead of RB");
    else parts.push("RB and WR tied");
    if (current.WR === wrMin) parts.push("WR dataset low");
    if (current.RB === rbMax) parts.push("RB dataset high/tie");
    if (wr2325IsWorst) parts.push("worst WR 3-year drop");

    return { range, size: rangeSize(range), stats, current, leader, rbWrDiff: current.RB - current.WR, firstRbOverWr, wr2325, wr2325IsWorst, wrWorstThreeYear, rbMax, wrMin, qbLeadSince, read: parts.join(" • ") };
  }

  function getAllSummaries() {
    return Object.fromEntries(RANGE_OPTIONS.map((range) => [range, getRangeSummary(range)]));
  }

  function getChartModel(range, activePositions) {
    const series = POSITIONS.filter((pos) => activePositions.includes(pos)).map((pos) => {
      const values = getValues(range, pos);
      const tiers = getTiers(values);
      return { pos, values: values.map((value, index) => ({ year: state.years[index], value, rawValue: getRawValues(range, pos)[index], tier: tiers[index] })) };
    });
    const yearRows = state.years.map((year, index) => {
      const row = { year };
      POSITIONS.forEach((pos) => { row[pos] = getValues(range, pos)[index]; });
      return row;
    });
    return { series, yearRows };
  }

  function gradientId(range, pos, index, prefix = "grad") {
    return `${prefix}-${slug(range)}-${pos}-${index}`;
  }

  function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
  }

  function arcPath(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  const panel = (inner, className = "", glow = true) => `
    <section class="panel ${className}">
      ${glow ? '<div class="panel-glow"></div>' : ''}
      <div class="panel-inner">${inner}</div>
    </section>
  `;

  const sectionTitle = (iconName, title, subtitle) => `
    <div class="section-title-row">
      <div>
        <div class="section-title-label">${icon(iconName, "icon icon-sm")}<h3 class="card-title">${title}</h3></div>
        ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
      </div>
    </div>
  `;

  function renderHeader() {
    return `
      <header class="page-header">
        <div class="header-inner">
          <div class="brand-row">
            <div class="brand-icon">${icon("Sparkles", "icon icon-lg")}</div>
            <div>
              <div class="brand-title-line">
                <h1>Fantasy Position Supply Dashboard</h1>
                <span class="brand-pill">2007—2025</span>
              </div>
              <p class="brand-subtitle">A one-page trend engine for positional density, crossovers, volatility, and peak/floor context inside fantasy-points rank ranges.</p>
            </div>
          </div>
          <div class="range-tabs">
            ${RANGE_OPTIONS.map((range) => `<button class="range-btn ${state.selectedRange === range ? 'active' : ''}" data-range="${range}">${range}</button>`).join('')}
          </div>
        </div>
      </header>
    `;
  }

  function statChip(label, value, tone = "neutral") {
    return `<div class="stat-chip ${tone}"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
  }

  function renderStatGrid(summary) {
    return `
      <div class="stat-grid">
        ${statChip("Selected Range", state.selectedRange)}
        ${statChip("2025 Leader", `${summary.leader.pos} ${summary.leader.value}`, "hot")}
        ${statChip("RB minus WR", fmtDelta(summary.rbWrDiff), summary.rbWrDiff > 0 ? "up" : summary.rbWrDiff < 0 ? "down" : "neutral")}
        ${statChip("WR 2023→2025", fmtDelta(summary.wr2325), summary.wr2325 < 0 ? "down" : summary.wr2325 > 0 ? "up" : "neutral")}
      </div>
    `;
  }

  function renderInsightCards(summary) {
    const cards = [
      { title: "2025 Leader", value: `${summary.leader.pos} ${summary.leader.value}`, body: `${summary.leader.pos} owns ${summary.leader.value} of ${summary.size} available slots.`, icon: "Trophy", tone: "neutral" },
      { title: "RB vs WR Gap", value: fmtDelta(summary.rbWrDiff), body: summary.rbWrDiff > 0 ? `RB is ahead of WR by ${summary.rbWrDiff}. ${summary.firstRbOverWr === 2025 ? "This is the first RB-over-WR season in this range." : `First RB-over-WR season: ${summary.firstRbOverWr}.`}` : summary.rbWrDiff < 0 ? `WR remains ahead of RB by ${Math.abs(summary.rbWrDiff)}.` : "RB and WR are tied.", icon: "Layers3", tone: summary.rbWrDiff > 0 ? "up" : summary.rbWrDiff < 0 ? "down" : "neutral" },
      { title: "WR 2023→2025", value: fmtDelta(summary.wr2325), body: summary.wr2325IsWorst ? `Worst three-season WR drop in the 2007–2025 dataset for ${summary.range}.` : `WR changed by ${fmtDelta(summary.wr2325)} from 2023 to 2025.`, icon: "ArrowDownRight", tone: summary.wr2325 < 0 ? "down" : "up" },
      { title: "RB Current Level", value: `${summary.current.RB}/${summary.rbMax}`, body: summary.current.RB === summary.rbMax ? `RB is at or tied with its historical high for ${summary.range}.` : `RB is ${summary.rbMax - summary.current.RB} below its historical high.`, icon: "Zap", tone: summary.current.RB === summary.rbMax ? "hot" : "neutral" },
    ];
    return `<div class="grid-4">${cards.map((card) => panel(`
      <div class="insight-top">
        <div><div class="insight-label">${card.title}</div><div class="insight-value">${card.value}</div></div>
        <div class="insight-icon ${card.tone}">${icon(card.icon, "icon")}</div>
      </div>
      <p class="insight-body">${card.body}</p>
    `, "insight-card", false)).join('')}</div>`;
  }

  function renderPositionToggle(pos, current) {
    const active = state.activePositions.includes(pos);
    const cfg = POS_CONFIG[pos];
    return `
      <button class="pos-toggle ${active ? '' : 'inactive'}" data-pos="${pos}">
        <span class="pos-toggle-bar" style="background: linear-gradient(90deg, ${cfg.low}, ${cfg.mid}, ${cfg.high})"></span>
        <span class="pos-toggle-content">
          <span class="pos-dot" style="color: ${cfg.high}; background: linear-gradient(135deg, ${cfg.low}, ${cfg.high})"></span>
          <span class="pos-name">${pos}</span>
          <span class="pos-count">${current}</span>
        </span>
      </button>
    `;
  }

  function renderMainChart(active, selectedRange) {
    const width = 1460;
    const height = 560;
    const margin = { top: 54, right: 34, bottom: 58, left: 54 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const visibleSeries = active.series.filter((series) => state.activePositions.includes(series.pos));
    const maxValue = Math.max(...visibleSeries.flatMap((series) => series.values.map((point) => point.value)), 1);
    const yMax = Math.max(rangeSize(selectedRange) <= 12 ? 6 : 12, Math.ceil(maxValue + 2));
    const tickStep = yMax <= 8 ? 1 : 2;
    const yTicks = Array.from({ length: Math.floor(yMax / tickStep) + 1 }, (_, i) => i * tickStep);
    const xScale = (index) => (index / (state.years.length - 1)) * innerWidth;
    const yScale = (value) => innerHeight - (value / yMax) * innerHeight;

    const labelOffset = (yearIndex, pos) => {
      const row = active.yearRows[yearIndex];
      const value = row[pos];
      const close = state.activePositions.map((p) => ({ pos: p, value: row[p] })).filter((item) => Math.abs(item.value - value) <= 0.45).sort((a, b) => POSITIONS.indexOf(a.pos) - POSITIONS.indexOf(b.pos));
      const stackIndex = Math.max(0, close.findIndex((item) => item.pos === pos));
      const y = yScale(value);
      const direction = y < 34 ? 1 : -1;
      return direction * (17 + stackIndex * 15);
    };

    const defs = visibleSeries.flatMap((series) => series.values.slice(0, -1).map((point, index) => {
      const next = series.values[index + 1];
      const id = gradientId(selectedRange, series.pos, index);
      return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${xScale(index)}" y1="${yScale(point.value)}" x2="${xScale(index + 1)}" y2="${yScale(next.value)}"><stop offset="0%" stop-color="${POS_CONFIG[series.pos][point.tier]}" /><stop offset="100%" stop-color="${POS_CONFIG[series.pos][next.tier]}" /></linearGradient>`;
    })).join('');

    const grid = yTicks.map((tick) => `<g transform="translate(0, ${yScale(tick)})"><line x2="${innerWidth}" stroke="rgba(255,255,255,0.045)" stroke-width="1" /><text x="-18" y="4" text-anchor="end" class="svg-text-dim" font-size="11">${tick}</text></g>`).join('');
    const years = state.years.map((year, index) => `<g transform="translate(${xScale(index)}, 0)"><line y1="0" y2="${innerHeight}" stroke="rgba(255,255,255,0.022)" stroke-dasharray="4 8" /><text y="${innerHeight + 34}" text-anchor="middle" class="svg-text-muted" font-size="11">${year}</text></g>`).join('');
    const lines = visibleSeries.map((series) => `<g>${series.values.slice(0, -1).map((point, index) => {
      const next = series.values[index + 1];
      return `<line x1="${xScale(index)}" y1="${yScale(point.value)}" x2="${xScale(index + 1)}" y2="${yScale(next.value)}" stroke="url(#${gradientId(selectedRange, series.pos, index)})" stroke-width="4.5" stroke-linecap="round" opacity="0.95" />`;
    }).join('')}</g>`).join('');
    const points = visibleSeries.map((series) => `<g>${series.values.map((point, index) => {
      const color = POS_CONFIG[series.pos][point.tier];
      const x = xScale(index);
      const y = yScale(point.value);
      return `<g><circle cx="${x}" cy="${y}" r="6.5" fill="rgba(0,0,0,0.9)" stroke="${color}" stroke-width="3" /><circle cx="${x}" cy="${y}" r="2" fill="${color}" opacity="0.9" /><text x="${x}" y="${y + labelOffset(index, series.pos)}" text-anchor="middle" class="svg-label" font-size="13" fill="${color}" style="paint-order:stroke;stroke:#08090d;stroke-width:6px;stroke-linejoin:round">${point.value}</text></g>`;
    }).join('')}</g>`).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
        <defs>
          <radialGradient id="chartGlow" cx="50%" cy="18%" r="78%"><stop offset="0%" stop-color="rgba(0,221,250,0.14)" /><stop offset="55%" stop-color="rgba(168,85,247,0.035)" /><stop offset="100%" stop-color="rgba(0,0,0,0)" /></radialGradient>
          ${defs}
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" rx="28" fill="url(#chartGlow)" opacity="0.9" />
        <g transform="translate(${margin.left}, ${margin.top})">
          ${grid}
          ${years}
          <text x="0" y="-18" fill="#67e8f9" font-size="11" font-weight="950" letter-spacing=".28em" text-transform="uppercase">Count</text>
          <text x="${innerWidth}" y="${innerHeight + 52}" text-anchor="end" fill="#52525b" font-size="10" font-weight="950" letter-spacing=".28em">Year 2007—2025</text>
          ${lines}
          ${points}
        </g>
      </svg>
    `;
  }

  function renderMiniLineChart(range) {
    const model = getChartModel(range, state.activePositions);
    const width = 660;
    const height = 245;
    const margin = { top: 42, right: 18, bottom: 30, left: 28 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxValue = Math.max(...model.series.flatMap((series) => series.values.map((point) => point.value)), 1);
    const yMax = Math.max(8, Math.ceil(maxValue + 1));
    const xScale = (index) => (index / (state.years.length - 1)) * innerWidth;
    const yScale = (value) => innerHeight - (value / yMax) * innerHeight;
    const rangeColor = GRID_RANGE_LABEL_COLORS[range] || "#ffffff";

    const defs = model.series.flatMap((series) => series.values.slice(0, -1).map((point, index) => {
      const next = series.values[index + 1];
      const id = gradientId(range, series.pos, index, "mini");
      return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${xScale(index)}" y1="${yScale(point.value)}" x2="${xScale(index + 1)}" y2="${yScale(next.value)}"><stop offset="0%" stop-color="${POS_CONFIG[series.pos][point.tier]}" /><stop offset="100%" stop-color="${POS_CONFIG[series.pos][next.tier]}" /></linearGradient>`;
    })).join('');

    const lines = model.series.map((series) => `<g>${series.values.slice(0, -1).map((point, index) => {
      const next = series.values[index + 1];
      return `<line x1="${xScale(index)}" y1="${yScale(point.value)}" x2="${xScale(index + 1)}" y2="${yScale(next.value)}" stroke="url(#${gradientId(range, series.pos, index, "mini")})" stroke-width="3.25" stroke-linecap="round" />`;
    }).join('')}</g>`).join('');

    const labels = model.series.map((series) => `<g>${series.values.map((point, index) => {
      const color = POS_CONFIG[series.pos][point.tier];
      return `<g><circle cx="${xScale(index)}" cy="${yScale(point.value)}" r="4" fill="#05060a" stroke="${color}" stroke-width="2" /><text x="${xScale(index)}" y="${yScale(point.value) - 8}" text-anchor="middle" font-size="10" font-weight="950" fill="${color}" style="paint-order:stroke;stroke:#05060a;stroke-width:4px">${point.value}</text></g>`;
    }).join('')}</g>`).join('');

    return `
      <div class="mini-card">
        <div class="mini-head">
          <div class="mini-title" style="color:${rangeColor}; text-shadow:0 0 24px ${rangeColor}33">${range}</div>
          <div class="mini-pill">2007—2025</div>
        </div>
        <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
          <defs>${defs}</defs>
          <g transform="translate(${margin.left}, ${margin.top})">
            ${[0, .25, .5, .75, 1].map((tick) => `<line x1="0" x2="${innerWidth}" y1="${tick * innerHeight}" y2="${tick * innerHeight}" stroke="rgba(255,255,255,.045)" />`).join('')}
            ${state.years.map((year, index) => `<text x="${xScale(index)}" y="${innerHeight + 22}" text-anchor="middle" class="svg-text-muted" font-size="11">${year}</text>`).join('')}
            ${lines}
            ${labels}
          </g>
        </svg>
      </div>
    `;
  }

  function renderChartPanel(active, summary) {
    const body = state.chartMode === "grid"
      ? `<div class="mini-grid">${GRID_RANGES.map(renderMiniLineChart).join('')}</div>`
      : renderMainChart(active, state.selectedRange);

    return panel(`
      <div class="chart-header">
        <div class="chart-title-side">
          <button class="grid-toggle ${state.chartMode === 'grid' ? 'active' : ''}" id="gridToggle">Grid</button>
          <div class="chart-icon-box">${icon("LineChart", "icon icon-sm")}</div>
          <div>
            <h2 class="card-title">Global Tier Supply Dynamics</h2>
            <p class="card-subtitle">${state.chartMode === "grid" ? "Four-range comparison: Top 60, Top 48, Top 36, and Top 24." : "Position counts inside the selected fantasy-points rank range."}</p>
          </div>
        </div>
        <div class="pos-toggle-wrap">${POSITIONS.map((pos) => renderPositionToggle(pos, summary.current[pos])).join('')}</div>
      </div>
      ${body}
    `, "chart-panel");
  }

  function renderPositionProfileCards(summary) {
    return `<div class="grid-4">${POSITIONS.map((pos) => {
      const stat = summary.stats[pos];
      const muted = !state.activePositions.includes(pos);
      const cfg = POS_CONFIG[pos];
      const trendTone = stat.changeFromPrevious > 0 ? "up" : stat.changeFromPrevious < 0 ? "down" : "neutral";
      const trendIcon = stat.changeFromPrevious > 0 ? "ArrowUpRight" : stat.changeFromPrevious < 0 ? "ArrowDownRight" : "Minus";
      const sparkId = `spark-${pos}`;
      const sparkPoints = stat.values.map((value, i) => `${(i / (state.years.length - 1)) * 260},${46 - ((value - stat.min) / Math.max(1, stat.max - stat.min)) * 38}`).join(" ");
      const sparkCircles = stat.values.map((value, i) => `<circle cx="${(i / (state.years.length - 1)) * 260}" cy="${46 - ((value - stat.min) / Math.max(1, stat.max - stat.min)) * 38}" r="${i === state.years.length - 1 ? 4 : 1.7}" fill="${i === state.years.length - 1 ? cfg.high : 'rgba(255,255,255,.45)'}" />`).join('');
      return panel(`
        <div class="profile-bar" style="background:linear-gradient(90deg, ${cfg.low}, ${cfg.mid}, ${cfg.high})"></div>
        <div class="profile-header">
          <div><div class="profile-pos" style="color:${cfg.high}">${pos}</div><div class="profile-sub">2025 position file</div></div>
          <div class="profile-badge ${trendTone}">${icon(trendIcon, "icon icon-sm")} ${fmtDelta(stat.changeFromPrevious)} YoY</div>
        </div>
        <div class="profile-metrics">
          <div class="profile-box big"><div class="profile-box-label">Current</div><div class="profile-box-value">${stat.current}</div><div class="profile-rank">Rank #${stat.rank} of 19</div></div>
          <div class="profile-side"><div class="profile-box"><div class="profile-box-label">Avg</div><div class="profile-box-value">${fmt(stat.avg)}</div></div><div class="profile-box"><div class="profile-box-label">Peak</div><div class="profile-box-value">${stat.max}</div></div></div>
        </div>
        <svg viewBox="0 0 260 52" class="sparkline">
          <defs><linearGradient id="${sparkId}" x1="0" x2="260" y1="0" y2="0"><stop offset="0" stop-color="${cfg.low}" /><stop offset=".5" stop-color="${cfg.mid}" /><stop offset="1" stop-color="${cfg.high}" /></linearGradient></defs>
          <line x1="0" x2="260" y1="48" y2="48" stroke="rgba(255,255,255,.07)" />
          <polyline fill="none" stroke="url(#${sparkId})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${sparkPoints}" />
          ${sparkCircles}
        </svg>
      `, `profile-panel profile-card ${muted ? 'muted' : ''}`);
    }).join('')}</div>`;
  }

  function renderThesisPanel(summary) {
    const lines = [
      summary.firstRbOverWr === 2025 && summary.rbWrDiff > 0 ? `${summary.range}: 2025 is the first RB-over-WR season in this range.` : summary.rbWrDiff > 0 ? `${summary.range}: RB is ahead of WR; crossover first appeared in ${summary.firstRbOverWr}.` : `${summary.range}: WR still holds the RB/WR edge.`,
      summary.wr2325IsWorst ? `WR's 2023→2025 move is the worst three-year WR drop for this range.` : `WR's 2023→2025 move is ${fmtDelta(summary.wr2325)} for this range.`,
      summary.current.RB === summary.rbMax ? `RB is at/tied with its historical high in ${summary.range}.` : `RB is ${summary.rbMax - summary.current.RB} below its historical high.`,
    ];
    return panel(`
      <div class="thesis-layout">
        <div><div class="thesis-kicker">Selected-range thesis</div><div class="thesis-title">${summary.range} read</div></div>
        <div class="thesis-cards">${lines.map((line, i) => `<div class="thesis-card"><div class="thesis-card-label" style="color:${SYSTEM_PALETTES.A[i * 2]}">Signal ${i + 1}</div><p>${line}</p></div>`).join('')}</div>
      </div>
    `, "thesis-panel span-12");
  }

  function renderMomentumStreams(summary) {
    const rows = POSITIONS.map((pos) => ({ pos, changes: summary.stats[pos].values.slice(1).map((value, i) => value - summary.stats[pos].values[i]) }));
    const maxAbs = Math.max(...rows.flatMap((row) => row.changes.map((value) => Math.abs(value))), 1);
    const width = 1080;
    const laneHeight = 108;
    const height = rows.length * laneHeight + 70;
    const left = 72;
    const right = 34;
    const top = 44;
    const innerWidth = width - left - right;
    const step = innerWidth / 17;
    const amp = 42;

    return panel(`
      ${sectionTitle("Activity", "Momentum Streams", "Single-season slot changes by position. Tall spikes show major supply shocks; 2025 is emphasized at the far right.")}
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
        <defs>${POSITIONS.map((pos) => `<linearGradient id="momentum-${pos}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${POS_CONFIG[pos].low}" /><stop offset="50%" stop-color="${POS_CONFIG[pos].mid}" /><stop offset="100%" stop-color="${POS_CONFIG[pos].high}" /></linearGradient>`).join('')}</defs>
        ${state.years.slice(1).map((year, i) => (i % 2 === 0 || year === 2025) ? `<text x="${left + i * step}" y="24" text-anchor="middle" class="svg-text-dim" font-size="10">${year}</text>` : '').join('')}
        ${rows.map((row, rowIndex) => {
          const y = top + 38 + rowIndex * laneHeight;
          const biggest = row.changes.reduce((best, change, i) => Math.abs(change) > Math.abs(best.change) ? { change, i } : best, { change: 0, i: 0 });
          return `<g>
            <rect x="0" y="${y - 45}" width="${width}" height="92" rx="22" fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.035)" />
            <text x="22" y="${y + 5}" font-size="18" font-weight="950" fill="${POS_CONFIG[row.pos].high}">${row.pos}</text>
            <text x="22" y="${y + 25}" fill="#3f3f46" font-size="9" font-weight="950" letter-spacing=".16em">YoY slots</text>
            <line x1="${left - 8}" x2="${width - right + 8}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,0.11)" stroke-dasharray="5 8" />
            ${row.changes.map((change, i) => {
              const x = left + i * step;
              const h = Math.max(4, (Math.abs(change) / maxAbs) * amp);
              const positive = change >= 0;
              const endY = positive ? y - h : y + h;
              const color = positive ? POS_CONFIG[row.pos].high : POS_CONFIG[row.pos].low;
              const important = Math.abs(change) >= 3 || i === 17 || i === biggest.i;
              return `<g><line x1="${x}" x2="${x}" y1="${y}" y2="${endY}" stroke="${color}" stroke-width="${i === 17 ? 7 : 5}" stroke-linecap="round" opacity="${change === 0 ? .25 : .9}" /><circle cx="${x}" cy="${endY}" r="${i === 17 ? 6 : 4}" fill="#05060a" stroke="${color}" stroke-width="2.25" />${important ? `<text x="${x}" y="${positive ? endY - 10 : endY + 18}" text-anchor="middle" fill="#f4f4f5" font-size="11" font-weight="950" style="paint-order:stroke;stroke:#05060a;stroke-width:4px">${fmtDelta(change)}</text>` : ''}</g>`;
            }).join('')}
          </g>`;
        }).join('')}
      </svg>
    `, "momentum-panel span-7");
  }

  function renderVolatilityOrbit(summary) {
    const rows = POSITIONS.map((pos) => ({ pos, stat: summary.stats[pos] })).sort((a, b) => b.stat.std - a.stat.std);
    const maxStd = Math.max(...rows.map((row) => row.stat.std), 1);
    const maxSpread = Math.max(...rows.map((row) => row.stat.spread), 1);

    return panel(`
      ${sectionTitle("Sparkles", "Volatility Orbit Board", "A compact volatility profile: outer arc = standard deviation, inner pulse = total historical spread.")}
      <div class="orbit-grid">
        ${rows.map((row, index) => {
          const { pos, stat } = row;
          const stdPct = stat.std / maxStd;
          const spreadPct = stat.spread / maxSpread;
          const stdEnd = -132 + stdPct * 264;
          const spreadEnd = -132 + spreadPct * 264;
          const trendTone = stat.changeFromPrevious > 0 ? "tone-up" : stat.changeFromPrevious < 0 ? "tone-down" : "tone-neutral";
          return `<div class="orbit-card">
            <div class="orbit-rank">#${index + 1}</div>
            <svg viewBox="0 0 190 148" class="chart-svg">
              <path d="${arcPath(95, 92, 58, -132, 132)}" stroke="rgba(255,255,255,.08)" stroke-width="12" fill="none" stroke-linecap="round" />
              <path d="${arcPath(95, 92, 58, -132, stdEnd)}" stroke="${POS_CONFIG[pos].high}" stroke-width="12" fill="none" stroke-linecap="round" />
              <path d="${arcPath(95, 92, 39, -132, 132)}" stroke="rgba(255,255,255,.055)" stroke-width="8" fill="none" stroke-linecap="round" />
              <path d="${arcPath(95, 92, 39, -132, spreadEnd)}" stroke="${POS_CONFIG[pos].mid}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.85" />
              <circle cx="95" cy="92" r="31" fill="rgba(0,0,0,.55)" stroke="rgba(255,255,255,.08)" />
              <text x="95" y="82" text-anchor="middle" font-size="20" font-weight="950" fill="${POS_CONFIG[pos].high}">${pos}</text>
              <text x="95" y="104" text-anchor="middle" fill="#fff" font-size="20" font-weight="950">σ ${fmt(stat.std)}</text>
              <text x="95" y="124" text-anchor="middle" fill="#52525b" font-size="10" font-weight="950" letter-spacing=".12em">spread ${stat.spread}</text>
            </svg>
            <div class="orbit-stats">
              <div class="orbit-stat"><div class="orbit-stat-label">Avg</div><div class="orbit-stat-value">${fmt(stat.avg)}</div></div>
              <div class="orbit-stat"><div class="orbit-stat-label">Now</div><div class="orbit-stat-value" style="color:#fff">${stat.current}</div></div>
              <div class="orbit-stat"><div class="orbit-stat-label">YoY</div><div class="orbit-stat-value ${trendTone}">${fmtDelta(stat.changeFromPrevious)}</div></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    `, "volatility-panel span-5");
  }

  function renderRbWrCrossover(summary) {
    const rb = summary.stats.RB.values;
    const wr = summary.stats.WR.values;
    const diffs = state.years.map((year, i) => ({ year, diff: rb[i] - wr[i] }));
    const maxAbs = Math.max(...diffs.map((d) => Math.abs(d.diff)), 1);
    const width = 620, height = 260, left = 34, right = 18, centerY = 125, amp = 82, step = (width - left - right) / (state.years.length - 1);
    return panel(`
      ${sectionTitle("Target", "RB / WR Crossover Meter", "Positive means RB has more players than WR. Negative means WR has more players than RB.")}
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
        <line x1="${left - 8}" x2="${width - right + 8}" y1="${centerY}" y2="${centerY}" stroke="rgba(255,255,255,.10)" stroke-width="2" />
        <text x="${left}" y="28" fill="#a7f3d0" font-size="10" font-weight="950" letter-spacing=".14em">RB Lead</text>
        <text x="${left}" y="236" fill="#93c5fd" font-size="10" font-weight="950" letter-spacing=".14em">WR Lead</text>
        ${diffs.map((item, i) => {
          const x = left + i * step;
          const h = Math.abs(item.diff) / maxAbs * amp;
          const positive = item.diff >= 0;
          const color = positive ? "#00ff99" : "#4d79ff";
          return `<g><line x1="${x}" x2="${x}" y1="${centerY}" y2="${positive ? centerY - h : centerY + h}" stroke="${color}" stroke-width="${item.year === 2025 ? 7 : 4}" stroke-linecap="round" opacity="${item.year === 2025 ? 1 : .72}" /><circle cx="${x}" cy="${positive ? centerY - h : centerY + h}" r="${item.year === 2025 ? 6 : 3.5}" fill="#05060a" stroke="${color}" stroke-width="2" />${(item.year === 2025 || Math.abs(item.diff) >= 5) ? `<text x="${x}" y="${positive ? centerY - h - 12 : centerY + h + 18}" text-anchor="middle" fill="#fff" font-size="11" font-weight="950">${fmtDelta(item.diff)}</text>` : ''}<text x="${x}" y="154" text-anchor="middle" class="svg-text-dim" font-size="9">${String(item.year).slice(2)}</text></g>`;
        }).join('')}
      </svg>
    `, "crossover-panel span-7");
  }

  function renderPeakGauges(summary) {
    return panel(`
      ${sectionTitle("Gauge", "Peak / Floor Dial Board", "Each dial places 2025 between the historical floor and peak for the selected range.")}
      <div class="gauge-grid">
        ${state.activePositions.map((pos) => {
          const stat = summary.stats[pos];
          const pct = stat.max === stat.min ? 1 : (stat.current - stat.min) / Math.max(1, stat.max - stat.min);
          const endAngle = -132 + pct * 264;
          return `<div class="gauge-card">
            <svg viewBox="0 0 180 138" class="chart-svg">
              <path d="${arcPath(90, 96, 58, -132, 132)}" stroke="rgba(255,255,255,.08)" stroke-width="14" fill="none" stroke-linecap="round" />
              <path d="${arcPath(90, 96, 58, -132, endAngle)}" stroke="${POS_CONFIG[pos].high}" stroke-width="14" fill="none" stroke-linecap="round" />
              <circle cx="90" cy="96" r="40" fill="rgba(0,0,0,.50)" stroke="rgba(255,255,255,.08)" />
              <text x="90" y="84" text-anchor="middle" font-size="20" font-weight="950" fill="${POS_CONFIG[pos].high}">${pos}</text>
              <text x="90" y="108" text-anchor="middle" fill="#fff" font-size="26" font-weight="950">${stat.current}</text>
              <text x="34" y="130" text-anchor="middle" fill="#52525b" font-size="10" font-weight="950">${stat.min}</text>
              <text x="146" y="130" text-anchor="middle" fill="#52525b" font-size="10" font-weight="950">${stat.max}</text>
            </svg>
            <div class="gauge-meta"><div>Floor <span>${stat.worstYears}</span></div><div>Peak <span>${stat.bestYears}</span></div></div>
          </div>`;
        }).join('')}
      </div>
    `, "gauge-panel");
  }

  function renderBiggestMovers(summary) {
    const movers = state.activePositions.flatMap((pos) => {
      const values = summary.stats[pos].values;
      return values.slice(1).map((value, i) => ({ pos, from: state.years[i], year: state.years[i + 1], change: value - values[i], abs: Math.abs(value - values[i]) }));
    }).sort((a, b) => b.abs - a.abs || b.change - a.change).slice(0, 8);

    return panel(`
      ${sectionTitle("Zap", "Biggest Shock Moves", "Largest single-season jumps and drops among visible positions.")}
      <div class="movers-list">
        ${movers.map((mover, index) => `<div class="mover-row">
          <div class="mover-strip" style="background:linear-gradient(180deg, ${POS_CONFIG[mover.pos].low}, ${POS_CONFIG[mover.pos].high})"></div>
          <div class="mover-inner">
            <div class="mover-left"><div class="mover-rank">#${index + 1}</div><div class="mover-pos" style="color:${POS_CONFIG[mover.pos].high}">${mover.pos}</div><div><div class="mover-years">${mover.from} → ${mover.year}</div><div class="mover-sub">absolute move: ${mover.abs}</div></div></div>
            <div class="mover-delta ${mover.change > 0 ? 'up' : 'down'}">${fmtDelta(mover.change)}</div>
          </div>
        </div>`).join('')}
      </div>
    `, "movers-panel");
  }

  function renderRangeComparison(allSummaries) {
    return panel(`
      ${sectionTitle("Layers3", "Range Comparison Deck", "How the 2025 positional mix changes as the window expands from elite-only to deeper leaderboards.")}
      <div class="range-deck">
        ${RANGE_OPTIONS_WIDE_FIRST.map((range, rangeIndex) => {
          const summary = allSummaries[range];
          const total = POSITIONS.reduce((sum, pos) => sum + summary.current[pos], 0) || 1;
          return `<div class="range-card">
            <div class="range-card-head"><div><div class="range-title">${range}</div><div class="range-read">${summary.read}</div></div><div class="range-leader-pill" style="background:${SYSTEM_PALETTES.D[rangeIndex + 1]}">${summary.leader.pos} ${summary.leader.value}</div></div>
            <div class="range-stack">${POSITIONS.map((pos) => `<div class="range-stack-part" style="width:${(summary.current[pos] / total) * 100}%; min-width:${summary.current[pos] > 0 ? 20 : 0}px; background:linear-gradient(90deg, ${POS_CONFIG[pos].low}, ${POS_CONFIG[pos].high})">${summary.current[pos] > 0 ? summary.current[pos] : ''}</div>`).join('')}</div>
            <div class="range-pos-grid">${POSITIONS.map((pos) => `<div class="range-pos-cell"><div class="range-pos-name" style="color:${POS_CONFIG[pos].high}">${pos}</div><div class="range-pos-count">${summary.current[pos]}</div></div>`).join('')}</div>
          </div>`;
        }).join('')}
      </div>
    `, "range-deck-panel span-12");
  }

  function renderFooter() {
    return `
      <footer class="footer-note">
        <div class="footer-inner">
          <div class="footer-left">${icon("AlertTriangle", "icon")}<p>Source anomaly handled: the file contains an impossible value for <strong>Top 36 / TE / 2024 = -1</strong>. Visual calculations clamp negative counts to 0 so the dashboard never displays an impossible player count.</p></div>
          <div class="footer-tags"><span>Line labels on every active point</span><span>Position filter toggles</span><span>No heat maps</span><span>Low 6 / Mid 6 / High 7 gradient tiering</span></div>
        </div>
      </footer>
    `;
  }

  function render() {
    const allSummaries = getAllSummaries();
    const selectedSummary = allSummaries[state.selectedRange];
    const active = {
      summary: selectedSummary,
      ...getChartModel(state.selectedRange, POSITIONS),
    };

    document.getElementById("app").innerHTML = `
      ${renderHeader()}
      ${renderStatGrid(selectedSummary)}
      <main class="dashboard-stack">
        ${renderInsightCards(selectedSummary)}
        ${renderChartPanel(active, selectedSummary)}
        ${renderPositionProfileCards(selectedSummary)}
        <div class="grid-12">
          ${renderThesisPanel(selectedSummary)}
          ${renderMomentumStreams(selectedSummary)}
          ${renderVolatilityOrbit(selectedSummary)}
          ${renderRbWrCrossover(selectedSummary)}
          <div class="stack span-5">${renderPeakGauges(selectedSummary)}${renderBiggestMovers(selectedSummary)}</div>
          ${renderRangeComparison(allSummaries)}
        </div>
        ${renderFooter()}
      </main>
    `;
  }

  function setSelectedRange(range) {
    state.selectedRange = range;
    render();
  }

  function togglePosition(pos) {
    if (state.activePositions.includes(pos)) {
      if (state.activePositions.length === 1) return;
      state.activePositions = state.activePositions.filter((item) => item !== pos);
    } else {
      state.activePositions = [...state.activePositions, pos].sort((a, b) => POSITIONS.indexOf(a) - POSITIONS.indexOf(b));
    }
    render();
  }

  document.addEventListener("click", (event) => {
    const rangeButton = event.target.closest(".range-btn");
    if (rangeButton) {
      setSelectedRange(rangeButton.dataset.range);
      return;
    }

    const posButton = event.target.closest(".pos-toggle");
    if (posButton) {
      togglePosition(posButton.dataset.pos);
      return;
    }

    const gridButton = event.target.closest("#gridToggle");
    if (gridButton) {
      state.chartMode = state.chartMode === "grid" ? "single" : "grid";
      render();
    }
  });

  async function init() {
    try {
      const response = await fetch("POS-DIST_2007-2025.csv", { cache: "no-store" });
      if (!response.ok) throw new Error(`CSV request failed: ${response.status}`);
      const text = await response.text();
      const parsed = parseCsv(text);
      state.years = parsed.years;
      state.posData = parsed.posData;
      render();
    } catch (error) {
      document.getElementById("app").innerHTML = `
        <div class="error-panel">
          <strong>Unable to load POS-DIST_2007-2025.csv.</strong><br />
          This app expects the CSV file to sit beside index.html. If opened directly from the filesystem and your browser blocks local fetch requests, run it from a local server such as VS Code Live Server or <code>python3 -m http.server</code> inside the PosDist folder.<br />
          <br />Error: ${String(error.message || error)}
        </div>
      `;
    }
  }

  init();
})();
