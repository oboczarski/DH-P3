import {
  formatComparisonValue,
  formatRank,
  getComparisonPositions,
  getPlayerName,
  getStatDefinition,
  isLowerBetterForPosition,
  toFiniteNumber,
} from "./comparisonStats.js?v=DH3.81-compare";
import { getWeeklyPalette } from "./comparisonChartOptions.js?v=DH3.82-compare-previews";

const SEASON_METRIC_LABELS = Object.freeze({
  pass_yd: "Passing yards", pass_td: "Passing TDs", pass_cmp: "Completions", pass_rtg: "Passer rating",
  cmp_pct: "Completion rate", epa_per_db: "EPA / dropback", cpoe: "CPOE", ttt: "Time to throw", prs_pct: "Pressure rate",
  rush_yd: "Rushing yards", rush_td: "Rushing TDs", rush_att: "Carries", ypc: "Yards / carry",
  yco_per_att: "YAC / carry", mtf_per_att: "Missed tackles / carry", expl_ru_pct: "Explosive rush rate",
  rec_tgt: "Targets", rec: "Receptions", rec_yd: "Receiving yards", rec_td: "Receiving TDs", rec_fd: "Receiving first downs",
  rr: "Routes run", yprr: "Yards / route", ypr: "Yards / reception", ts_per_rr: "Target share",
  first_down_rec_rate: "First downs / route", rec_yms: "Receiving yards share",
  fpoe: "Points over expected", yds_total: "Total yards", imp: "Impact plays", imp_per_g: "Impact plays / game",
  snp_pct: "Snap share", imp_per_opp: "Impact plays / opportunity",
});

const RECEIVING = {
  production: ["rec_yd", "rec_td", "rec", "rec_tgt", "rec_fd", "rr"],
  efficiency: ["yprr", "ypr", "ts_per_rr", "first_down_rec_rate", "rec_yms", "imp_per_g"],
};

const METRICS = {
  QB: {
    production: ["pass_yd", "pass_td", "pass_cmp", "rush_yd", "rush_td", "imp"],
    efficiency: ["epa_per_db", "cpoe", "pass_rtg", "cmp_pct", "ttt", "prs_pct"],
  },
  RB: {
    production: ["rush_yd", "rush_td", "rush_att", "rec_yd", "rec", "imp"],
    efficiency: ["ypc", "yco_per_att", "mtf_per_att", "expl_ru_pct", "yprr", "imp_per_g"],
  },
  WR: RECEIVING,
  TE: RECEIVING,
  SKILL: {
    production: ["yds_total", "rec_yd", "rec_td", "rec", "rec_tgt", "imp"],
    efficiency: ["yprr", "ypr", "ts_per_rr", "first_down_rec_rate", "snp_pct", "imp_per_g"],
  },
  MIXED: {
    production: ["yds_total", "imp", "fpoe", "rush_yd", "rush_td"],
    efficiency: ["imp_per_opp", "imp_per_g", "snp_pct"],
  },
};

function getSeasonValue(player, key) {
  if (key === "imp_per_opp") {
    // The two season CSVs export IMP/OPP with different units. Derive the
    // percentage from their same-season counts so mixed comparisons agree.
    const impact = toFiniteNumber(player.seasonStats?.imp);
    const opportunities = toFiniteNumber(player.seasonStats?.opp);
    return impact !== null && opportunities > 0 ? impact / opportunities * 100 : null;
  }
  return toFiniteNumber(player.seasonStats?.[key]);
}

export function buildSeasonMetricRows(players, mode) {
  const positions = getComparisonPositions(players);
  const set = positions.length === 1 ? METRICS[positions[0]] : positions.includes("QB") ? METRICS.MIXED : METRICS.SKILL;
  return (set || METRICS.MIXED)[mode].flatMap((key) => {
    const values = players.map((player) => getSeasonValue(player, key));
    const available = values.filter(Number.isFinite);
    if (!available.length) return [];
    // Both tracks use zero and the same raw domain, including negatives.
    // Missing data has no endpoint and never participates in declaring a lead.
    const min = Math.min(0, ...available);
    const max = Math.max(0, ...available);
    const fraction = (value) => max > min ? (value - min) / (max - min) : 0;
    const lowerBetter = players.every((player) => isLowerBetterForPosition(player.pos, key));
    const comparable = values.length === 2 && available.length === 2;
    const difference = comparable ? values[0] - values[1] : null;
    const winner = difference === null || difference === 0 ? null : (lowerBetter ? difference < 0 : difference > 0) ? 0 : 1;
    return [{
      key, values, label: SEASON_METRIC_LABELS[key], lowerBetter,
      zero: fraction(0),
      ends: values.map((value) => value === null ? null : fraction(value)),
      difference, winner,
    }];
  });
}

export function buildScoringProfile(players) {
  // Use one points scale for both PPG columns and top-three-game ceilings.
  // Totals and games stay in the readouts because they have different units.
  const rows = players.map((player) => ({
    player,
    ppg: getSeasonValue(player, "ppg"),
    ceiling: getSeasonValue(player, "ceiling"),
    fpts: getSeasonValue(player, "fpts"),
    games: getSeasonValue(player, "games_played"),
  }));
  const scores = rows.flatMap(({ ppg, ceiling }) => [ppg, ceiling]).filter(Number.isFinite);
  return { rows, ...pointsScale(scores), hasScores: scores.length > 0 };
}

function pointsScale(scores) {
  const low = Math.min(0, ...scores);
  const high = Math.max(0, ...scores);
  const step = Math.max(5, Math.ceil((high - low) / 20) * 5);
  const min = Math.floor(low / step) * step;
  const max = Math.max(min + step, Math.ceil(high / step) * step);
  return {
    ticks: Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step),
    fraction: (value) => (value - min) / (max - min),
  };
}

const SEASON_SPECTRA = [
  { colors: ["#126966", "#19b397", "#64e9c4", "#dcffe1"], accent: "#78eacc" },
  { colors: ["#8f244b", "#dc4678", "#ff7884", "#ffe1cb"], accent: "#ff95a2" },
];

// The Start/Sit comparison's current scoring spectra (including the second
// series' authored stops/alpha). Compare owns these values locally and does
// not initialize the Rosters renderer or its theme on DataHub.
const START_SIT_SPECTRA = [
  { colors: ["#1264FF", "#118FFF", "#00C6EF", "#19EDDD"], accent: "#18ebdc" },
  { colors: ["rgba(115,244,255,.72)", "rgba(91,127,255,.72)", "rgba(219,109,255,.82)"], offsets: [0, 0.52, 1], accent: "#b69aff" },
];

export function getSeasonPalettes(players, mode) {
  return players.map((_, index) => {
    if (mode === "weekly") {
      const { low, lowMid, highMid, high } = getWeeklyPalette(players, index);
      return { colors: [low, lowMid, highMid, high], accent: high };
    }
    return (mode === "start-sit" ? START_SIT_SPECTRA : SEASON_SPECTRA)[index];
  });
}

function gradientStops({ colors, offsets }) {
  return colors.map((color, index) => ({ color, offset: offsets?.[index] ?? index / (colors.length - 1) }));
}

export function buildScoringSpread(players, weeks) {
  // Each point is a recorded PPR score in this season's calendar. Show zero
  // and negative games, and leave BYEs, injury placeholders and future rows out.
  const recorded = new Set(weeks);
  const rows = players.map((player) => {
    const games = (player.weeklySeries || []).flatMap((entry) => {
      const score = toFiniteNumber(entry.stats?.fpts);
      return recorded.has(entry.week) && !entry.skipped && !entry.isSkipped && (entry.played || entry.isPlayed) && score !== null
        ? [{ week: entry.week, score }] : [];
    }).sort((a, b) => a.score - b.score || a.week - b.week);
    const percentile = (share) => {
      if (!games.length) return null;
      const index = (games.length - 1) * share;
      const lower = Math.floor(index);
      return games[lower].score + (games[Math.ceil(index)].score - games[lower].score) * (index - lower);
    };
    return { player, games, low: percentile(0.25), median: percentile(0.5), high: percentile(0.75) };
  });
  return { rows, ...pointsScale(rows.flatMap(({ games }) => games.map(({ score }) => score))) };
}

function formatMetric(key, value) {
  if (value === null) return "—";
  const { decimals, unit } = getStatDefinition(key);
  if (decimals === 0) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return formatComparisonValue(key, value, { compact: unit !== "s" });
}

function formatGap(row) {
  if (row.difference === null) return "";
  if (row.difference === 0) return "Tie";
  const gap = Number(Math.abs(row.difference).toPrecision(12));
  const { decimals, percent, unit } = getStatDefinition(row.key);
  const minimum = 10 ** -decimals;
  const text = gap < minimum ? `<${minimum}` : gap.toLocaleString("en-US", { maximumFractionDigits: decimals });
  return `${text}${percent ? " pp" : unit === "s" ? " s" : ""}`;
}

const DIAL_ANGLES = [-115, 115];

function arcPoint(radius, angle) {
  const radians = angle * Math.PI / 180;
  return [172 + radius * Math.sin(radians), 116 - radius * Math.cos(radians)];
}

function arcPath(radius, from, to) {
  const [x1, y1] = arcPoint(radius, from);
  const [x2, y2] = arcPoint(radius, to);
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${Math.abs(to - from) > 180 ? 1 : 0} ${to >= from ? 1 : 0} ${x2} ${y2}`;
}

function placeSpreadMarks(games, fraction) {
  // Exact ties share a mark and a count. Near neighbors are stacked in lanes
  // without moving their score left or right on the shared axis.
  const groups = new Map();
  games.forEach(({ score, week }) => {
    if (!groups.has(score)) groups.set(score, []);
    groups.get(score).push(week);
  });
  const lanes = [0, -1, 1, -2, 2].map((lane) => ({ lane, end: -Infinity }));
  return [...groups].map(([score, weeks]) => {
    const x = fraction(score);
    const lane = lanes.find((item) => x - item.end >= 0.045)
      || lanes.reduce((a, b) => a.end < b.end ? a : b);
    lane.end = x;
    return { score, weeks, x, lane: lane.lane };
  });
}

export function createSeasonComparison(React) {
  const { createElement: h, useMemo, useState } = React;

  function PlayerKey({ player, slot }) {
    return h("strong", { className: "dh-compare-season-name", "data-season-slot": slot, title: getPlayerName(player) },
      h("i", { "aria-hidden": true }), getPlayerName(player));
  }

  function SpectrumDefs({ palettes, prefix }) {
    return h("defs", null, palettes.map((palette, index) => h("linearGradient", {
      id: `${prefix}-${index}`, key: index,
      // A flat slope still needs a nonzero gradient coordinate space.
      ...(prefix === "dh-score-slope" ? { gradientUnits: "userSpaceOnUse", x1: 61, y1: 137, x2: 287, y2: 17 }
        : { x1: "0%", x2: "100%", y1: "100%", y2: "0%" }),
    }, gradientStops(palette).map(({ color, offset }) => h("stop", { key: offset, offset, stopColor: color })))));
  }

  function ScoreMark({ point: [x, y], ceiling, index }) {
    return ceiling
      ? h("rect", { x: x - 3.2, y: y - 3.2, width: 6.4, height: 6.4, rx: 0.8,
        transform: `rotate(45 ${x} ${y})`, className: "dh-compare-score-mark is-ceiling", "data-season-slot": index })
      : h("circle", { cx: x, cy: y, r: 3.6, className: "dh-compare-score-mark", "data-season-slot": index });
  }

  function ScoringArcs({ profile, palettes }) {
    const { rows, fraction, ticks } = profile;
    const [start, end] = DIAL_ANGLES;
    const theta = (value) => start + fraction(value) * (end - start);
    return h("svg", { className: "dh-compare-score-svg dh-compare-score-svg--arcs", viewBox: "0 0 344 175", "aria-hidden": true },
      h(SpectrumDefs, { palettes, prefix: "dh-score-arc" }),
      h("path", { className: "dh-compare-arc__rim", d: arcPath(96, start, end) }),
      ticks.map((tick) => {
        const angle = theta(tick);
        const [x1, y1] = arcPoint(57, angle);
        const [x2, y2] = arcPoint(95, angle);
        const [x, y] = arcPoint(108, angle);
        return h("g", { key: tick },
          h("line", { className: "dh-compare-score-grid", x1, y1, x2, y2 }),
          h("text", { className: "dh-compare-score-tick", x, y: y + 3, textAnchor: "middle" }, tick));
      }),
      rows.map(({ player, ppg, ceiling }, index) => {
        const radius = index === 0 ? 85 : 66;
        const gradient = `url(#dh-score-arc-${index})`;
        // Each concentric lane shares the angle and zero used by both players.
        // The dim extension shows the ceiling and the solid arc shows PPG.
        return h("g", { key: player.id, "data-season-slot": index },
          h("path", { className: "dh-compare-arc__track", d: arcPath(radius, start, end) }),
          ceiling !== null && ceiling !== (ppg ?? 0) ? h("path", {
            className: "dh-compare-arc__ceiling", d: arcPath(radius, theta(ppg ?? 0), theta(ceiling)), stroke: gradient,
          }) : null,
          ppg !== null && ppg !== 0 ? h("path", {
            className: "dh-compare-arc__average", d: arcPath(radius, theta(0), theta(ppg)), stroke: gradient,
          }) : null,
          ppg !== null ? h(ScoreMark, { point: arcPoint(radius, theta(ppg)), index }) : null,
          ceiling !== null ? h(ScoreMark, { point: arcPoint(radius, theta(ceiling)), ceiling: true, index }) : null);
      }),
      h("text", { className: "dh-compare-score-center", x: 172, y: 114, textAnchor: "middle" }, "PPR"),
      h("text", { className: "dh-compare-score-tick", x: 172, y: 127, textAnchor: "middle" }, "points"),
    );
  }

  function ScoringSlope({ profile, palettes }) {
    const x1 = 61;
    const x2 = 287;
    const yFor = (value) => 17 + (1 - profile.fraction(value)) * 120;
    return h("svg", { className: "dh-compare-score-svg dh-compare-score-svg--slope", viewBox: "0 0 344 175", "aria-hidden": true },
      h(SpectrumDefs, { palettes, prefix: "dh-score-slope" }),
      profile.ticks.map((tick) => h("g", { key: tick },
        h("path", { className: "dh-compare-score-grid", d: `M35 ${yFor(tick)}H318` }),
        h("text", { className: "dh-compare-score-tick", x: 29, y: yFor(tick) + 3, textAnchor: "end" }, tick),
      )),
      h("path", { className: "dh-compare-score-guide", d: `M${x1} 14V142 M${x2} 14V142` }),
      profile.rows.map(({ player, ppg, ceiling }, index) => h("g", { key: player.id },
        // The slope connects two distinct stats. The dots stay at their exact
        // positions on the same points scale as the scoring arcs.
        ppg !== null && ceiling !== null ? h("path", {
          className: "dh-compare-score-slope", stroke: `url(#dh-score-slope-${index})`,
          d: `M${x1} ${yFor(ppg)}L${x2} ${yFor(ceiling)}`,
          strokeDasharray: index === 1 ? "5 3" : undefined,
        }) : null,
        ppg !== null ? h(ScoreMark, { point: [x1, yFor(ppg)], index }) : null,
        ceiling !== null ? h(ScoreMark, { point: [x2, yFor(ceiling)], ceiling: true, index }) : null,
      )),
      h("text", { className: "dh-compare-score-caption", x: x1, y: 159, textAnchor: "middle" }, "PPG"),
      h("text", { className: "dh-compare-score-caption", x: x2, y: 159, textAnchor: "middle" }, "Ceiling"),
    );
  }

  function ScoringProfile({ players, palettes }) {
    const profile = useMemo(() => buildScoringProfile(players), [players]);
    const lifts = profile.rows.flatMap(({ player, ppg, ceiling }, index) => {
      if (ppg === null || ceiling === null) return [];
      const delta = Number((ceiling - ppg).toFixed(1));
      return [{ player, index, text: `${delta > 0 ? "+" : ""}${delta.toFixed(1)}` }];
    });
    const fields = [
      ["PPG", "ppg", "ppg"], ["Ceiling", "ceiling", "ceiling"], ["FPTS", "fpts", "fpts"], ["Games", "games_played", "games"],
    ];
    return h("section", { className: "dh-compare-scoring", "aria-labelledby": "dh-compare-scoring-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-scoring-title" }, "Scoring profile"),
        h("span", { className: "dh-compare-season-panel__unit" }, "PPR"),
      ),
      h("div", { className: "dh-compare-scoring__readouts" },
        profile.rows.map((row, index) => h("div", {
          key: row.player.id, className: "dh-compare-scoring__readout", "data-season-slot": index,
        },
          h(PlayerKey, { player: row.player, slot: index }),
          h("dl", null, fields.map(([label, key, field]) => h("div", { key },
            h("dt", null, label), h("dd", null, formatMetric(key, row[field])),
          ))),
        )),
      ),
      profile.hasScores
        ? h("div", { className: "dh-compare-score-views" },
          h("figure", { className: "dh-compare-score-view" },
            h("figcaption", null, "Scoring arcs"),
            h(ScoringArcs, { profile, palettes }),
            h("div", { className: "dh-compare-score-legend" }, h("span", null, h("i"), "PPG"), h("span", null, h("i"), "Ceiling")),
          ),
          h("figure", { className: "dh-compare-score-view" },
            h("figcaption", null, "Average to ceiling"),
            h(ScoringSlope, { profile, palettes }),
            lifts.length ? h("div", { className: "dh-compare-score-legend dh-compare-score-lift" },
              h("span", null, "Ceiling lift"),
              lifts.map(({ player, index, text }) => h("span", {
                key: player.id, "data-season-slot": index, title: `${getPlayerName(player)}: ${text} PPR points`,
                "aria-label": `${getPlayerName(player)} ceiling lift: ${text} PPR points`,
              }, h("i", { "aria-hidden": true }), text)),
            ) : null,
          ),
        )
        : h("p", { className: "dh-compare-no-data" }, "Scoring rates are unavailable."),
      h("p", { className: "dh-compare-season-note" }, "Ceiling is the average of the player’s best three games."),
    );
  }

  function StatMatchupTile({ row, players }) {
    const gap = formatGap(row);
    const leader = row.winner === null ? null : getPlayerName(players[row.winner]);
    const delta = leader && !gap.startsWith("<") ? `${row.lowerBetter ? "−" : "+"}${gap}` : gap;
    const domainX = (fraction) => `${8 + fraction * 84}%`;
    const comparable = row.ends.length === 2 && row.ends.every(Number.isFinite);
    const [start, end] = comparable ? [...row.ends].sort((a, b) => a - b) : [];
    return h("article", { className: "dh-compare-duel" },
      h("div", { className: "dh-compare-duel__header" },
        h("h5", null, row.label, row.lowerBetter ? h("span", { title: "Lower is better", "aria-label": "Lower is better" }, "↓") : null),
        gap ? h("span", {
          className: "dh-compare-duel__delta", "data-season-slot": row.winner ?? undefined,
          title: leader ? `${leader} leads by ${gap}` : "Tied",
          "aria-label": leader ? `${leader} leads by ${gap}` : "Tied",
        }, delta) : null,
      ),
      // Both players use the same per-stat scale. The joined span encodes the
      // difference between their actual marks, with a distinct origin for signed stats.
      h("div", { className: "dh-compare-duel__plot", "aria-hidden": true },
        h("span", { className: "dh-compare-duel__zero", style: { left: domainX(row.zero) } }),
        comparable && start !== end ? h("span", {
          className: "dh-compare-duel__bridge", "data-season-slot": row.winner,
          style: { left: domainX(start), width: `${(end - start) * 84}%` },
        }) : null,
        row.ends.map((point, index) => point === null ? null : h("i", {
          key: players[index].id, className: "dh-compare-duel__mark", "data-season-slot": index,
          style: { left: domainX(point) },
        })),
      ),
      h("div", { className: "dh-compare-duel__values" },
        players.map((player, index) => {
          const value = row.values[index];
          const rank = player.seasonPosRanks?.[row.key];
          return h("div", {
            key: player.id, "data-season-slot": index,
            "aria-label": `${getPlayerName(player)} ${row.label}: ${formatMetric(row.key, value)}`,
          },
            h("i", { "aria-hidden": true }),
            h("strong", null, formatMetric(row.key, value)),
            Number.isFinite(rank) && rank > 0 && value !== null ? h("small", null, formatRank(rank, player.pos)) : null,
          );
        }),
      ),
    );
  }

  function SeasonMatchupChart({ players }) {
    const [mode, setMode] = useState("production");
    const rows = useMemo(() => buildSeasonMetricRows(players, mode), [players, mode]);
    return h("section", { className: "dh-compare-season-panel dh-compare-matchups", "aria-labelledby": "dh-compare-matchups-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-matchups-title" }, "Stat matchups"),
        h("div", { className: "dh-compare-stat-segment", role: "group", "aria-label": "Season stat category" },
          ["production", "efficiency"].map((category) => h("button", {
            type: "button", key: category,
            "aria-pressed": mode === category, onClick: () => setMode(category), "aria-controls": "dh-compare-season-metrics",
          }, category === "production" ? "Production" : "Efficiency")),
        ),
      ),
      h("div", { className: "dh-compare-matchups__legend" },
        players.map((player, index) => h(PlayerKey, { key: player.id, player, slot: index })),
      ),
      h("div", { id: "dh-compare-season-metrics", className: "dh-compare-matchups__tiles" },
        rows.length ? rows.map((row) => h(StatMatchupTile, { key: row.key, row, players }))
          : h("p", { className: "dh-compare-no-data" }, "No season values are available for these stats."),
      ),
    );
  }

  function ScoringSpread({ players, weeks }) {
    const { rows, ticks, fraction } = useMemo(() => buildScoringSpread(players, weeks), [players, weeks]);
    const hasGames = rows.some((row) => row.games.length);
    const xFor = (value) => `${100 * fraction(value)}%`;
    return h("section", { className: "dh-compare-season-panel dh-compare-spread", "aria-labelledby": "dh-compare-spread-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-spread-title" }, "Scoring distribution"),
        h("span", { className: "dh-compare-season-panel__unit" }, "Weekly PPR"),
      ),
      hasGames ? h("div", { className: "dh-compare-spread__rows" },
        rows.map(({ player, games, low, median, high }, index) => h("article", {
          key: player.id, className: "dh-compare-spread__row", "data-season-slot": index,
        },
          h("div", { className: "dh-compare-spread__identity" },
            h(PlayerKey, { player, slot: index }),
            h("span", null, median === null ? "No recorded games" : `${formatMetric("fpts", median)} median · ${games.length} ${games.length === 1 ? "game" : "games"}`),
          ),
          h("div", { className: "dh-compare-spread__strip", role: "img", "aria-label": games.length
            ? games.map(({ week, score }) => `Week ${week}: ${score}`).join(", ") : "No recorded games" },
            ticks.map((tick) => h("span", { key: tick, className: "dh-compare-spread__gridline", style: { left: xFor(tick) } })),
            median !== null ? [
              h("span", { key: "band", className: "dh-compare-spread__band", style: { left: xFor(low), width: `${100 * (fraction(high) - fraction(low))}%` },
                title: `Middle half: ${formatMetric("fpts", low)} to ${formatMetric("fpts", high)} points` }),
              h("span", { key: "median", className: "dh-compare-spread__median", style: { left: xFor(median) } }),
              ...placeSpreadMarks(games, fraction).map(({ score, weeks, x, lane }) => h("i", {
                key: score, className: "dh-compare-spread__point", "data-count": weeks.length > 1 ? weeks.length : undefined,
                style: { left: `${100 * x}%`, "--spread-lane": lane },
                title: `${weeks.length === 1 ? "Week" : "Weeks"} ${weeks.join(", ")}: ${formatMetric("fpts", score)} PPR`,
              })),
            ] : null,
          ),
        )),
        h("div", { className: "dh-compare-spread__axis", "aria-hidden": true },
          ticks.map((tick) => h("span", { key: tick, style: { left: xFor(tick) } }, tick)),
        ),
      ) : h("p", { className: "dh-compare-no-data" }, "No recorded weekly scores are available."),
      hasGames ? h("p", { className: "dh-compare-season-note" }, "Dots show played weeks. The band covers the middle half of scores, with a line at the median.") : null,
    );
  }

  return function SeasonComparison({ players, season, weeks, paletteMode, children }) {
    const palettes = useMemo(() => getSeasonPalettes(players, paletteMode), [players, paletteMode]);
    const colors = Object.fromEntries(palettes.flatMap((palette, index) => [
      [`--season-accent-${index}`, palette.accent],
      [`--season-deep-${index}`, palette.colors[0]],
      [`--season-spectrum-${index}`, `linear-gradient(105deg, ${gradientStops(palette).map(({ color, offset }) => `${color} ${offset * 100}%`).join(", ")})`],
    ]));
    return h("section", { className: "dh-compare-season", "aria-labelledby": "dh-compare-season-title", style: colors, "data-chart-palette": paletteMode },
      h("header", { className: "dh-compare-section-heading dh-compare-season__heading" },
        h("h3", { id: "dh-compare-season-title" }, "Season comparison"),
        h("span", { className: "dh-compare-section-context" }, season),
      ),
      h(ScoringProfile, { players, palettes }),
      h(SeasonMatchupChart, { players }),
      h(ScoringSpread, { players, weeks }),
      children,
    );
  };
}
