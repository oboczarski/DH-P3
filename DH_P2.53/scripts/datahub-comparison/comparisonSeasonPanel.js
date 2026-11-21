import {
  COMPARISON_RADAR_MAX_RANK_BY_POS,
  formatComparisonValue,
  getComparisonPositions,
  getPlayerName,
  getStatDefinition,
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
  return toFiniteNumber(player.seasonStats?.[key]);
}

export function buildSeasonMetricRows(players, mode) {
  const positions = getComparisonPositions(players);
  const set = positions.length === 1 ? METRICS[positions[0]] : positions.includes("QB") ? METRICS.MIXED : METRICS.SKILL;
  const rows = (set || METRICS.MIXED)[mode].flatMap((key) => {
    const values = players.map((player) => getSeasonValue(player, key));
    if (values.every((value) => value === null)) return [];
    // Use Data Hub's qualified positional ranks. The raw values stay visible
    // even when a player has no rank, and a recorded zero can still be ranked.
    const ranks = players.map((player, index) => {
      const rank = toFiniteNumber(player.seasonPosRanks?.[key]);
      return values[index] !== null && Number.isInteger(rank) && rank > 0 ? rank : null;
    });
    return [{ key, values, label: SEASON_METRIC_LABELS[key], ranks }];
  });

  // Keep one rank scale across the category so the same rank always occupies
  // the same length on either side, including in mixed-position comparisons.
  const rankLimit = Math.max(
    1,
    ...positions.map((pos) => COMPARISON_RADAR_MAX_RANK_BY_POS[pos] || 72),
    ...rows.flatMap(({ ranks }) => ranks.filter(Number.isInteger)),
  );
  return rows.map((row) => {
    const [firstRank, secondRank] = row.ranks;
    const trailing = row.ranks.length === 2 && row.ranks.every(Number.isInteger) && firstRank !== secondRank
      ? (secondRank > firstRank ? 1 : 0)
      : null;
    return {
      ...row,
      trailing,
      barFractions: row.ranks.map((rank) => rank === null ? null : (rankLimit - rank + 1) / rankLimit),
    };
  });
}

export function buildScoringProfile(players) {
  // Both scoring views share a points scale for PPG and top-three-game
  // ceilings. Season totals and games have their own units in the readouts.
  const rows = players.map((player) => ({
    player,
    ppg: getSeasonValue(player, "ppg"),
    ceiling: getSeasonValue(player, "ceiling"),
    fpts: getSeasonValue(player, "fpts"),
    games: getSeasonValue(player, "games_played"),
  }));
  const scores = rows.flatMap(({ ppg, ceiling }) => [ppg, ceiling]).filter(Number.isFinite);
  return { rows, ...pointsScale(scores) };
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

const SCORING_DIAL_SWEEP = 272;

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

  function ScoreDial({ row, slot, palette, profile }) {
    const { player, ppg, ceiling, fpts, games } = row;
    const toAngle = (value) => profile.fraction(value) * SCORING_DIAL_SWEEP;
    const min = profile.ticks[0];
    const max = profile.ticks.at(-1);
    const stats = [["ceiling", "Ceiling", ceiling], ["fpts", "FPTS", fpts], ["games_played", "Games", games]];
    let sweepFill;
    if (ppg !== null && ppg !== 0) {
      // Each player gets one ring. Its fill starts at zero, including on a
      // signed scale, and the separate index mark locates their ceiling.
      const from = toAngle(Math.min(0, ppg));
      const to = toAngle(Math.max(0, ppg));
      const stops = gradientStops(palette).map(({ color, offset }) => `${color} ${from + offset * (to - from)}deg`);
      sweepFill = `conic-gradient(from var(--score-origin), transparent ${from}deg, ${stops.join(", ")}, transparent ${to}deg)`;
    }
    const marker = (name, value) => value === null ? null : h("i", {
      className: `dh-compare-score-dial__index is-${name}`,
      style: { "--score-angle": `${toAngle(value)}deg` },
      "aria-hidden": "true",
    });

    return h("div", { className: "dh-compare-score-player", "data-season-slot": slot },
      h(PlayerKey, { player, slot }),
      h("div", {
        className: "dh-compare-score-dial",
        style: { "--score-sweep": `${SCORING_DIAL_SWEEP}deg` },
      },
        h("div", { className: "dh-compare-score-dial__track", "aria-hidden": "true" }),
        sweepFill ? h("div", {
          className: "dh-compare-score-dial__fill", style: { "--score-fill": sweepFill }, "aria-hidden": "true",
        }) : null,
        h("div", { className: "dh-compare-score-dial__face" },
          h("strong", null, formatMetric("ppg", ppg)),
          h("span", null, "PPG")),
        min < 0 ? marker("zero", 0) : null,
        marker("average", ppg),
        marker("ceiling", ceiling),
        h("div", { className: "dh-compare-score-dial__scale", "aria-hidden": "true" },
          h("span", null, min), h("span", null, max)),
      ),
      h("dl", { className: "dh-compare-score-player__stats" }, stats.map(([key, label, value]) => h("div", { key },
        h("dt", null, label), h("dd", null, formatMetric(key, value)),
      ))),
    );
  }

  function ScoringMap({ profile, palettes }) {
    const left = 30;
    const right = 316;
    const top = 25;
    const bottom = 140;
    const xFor = (value) => left + profile.fraction(value) * (right - left);
    const yFor = (value) => bottom - profile.fraction(value) * (bottom - top);
    const points = profile.rows.flatMap((row, slot) => {
      if (row.ppg === null || row.ceiling === null) return [];
      return [{ ...row, slot, x: xFor(row.ppg), y: yFor(row.ceiling) }];
    });
    const max = profile.ticks.at(-1);
    const ticks = profile.ticks.filter((_, index) => profile.ticks.length < 6 || index % 2 === 0);
    if (ticks.at(-1) !== max) ticks.push(max);
    const description = points.map(({ player, ppg, ceiling }) =>
      `${getPlayerName(player)}: ${formatMetric("ppg", ppg)} PPG, ${formatMetric("ceiling", ceiling)} ceiling`).join(". ");

    return h("figure", { className: "dh-compare-score-view dh-compare-score-map" },
      h("figcaption", null, "Ceiling vs. average"),
      points.length ? h("svg", {
        className: "dh-compare-score-map__plot", viewBox: "0 0 336 183", role: "img",
        "aria-label": `Ceiling versus PPG. The diagonal marks where they are equal. ${description}`,
      },
        h("defs", null, palettes.map((palette, slot) => h("linearGradient", {
          key: slot, id: `dh-compare-score-map-gradient-${slot}`, x1: "0%", x2: "100%", y1: "100%", y2: "0%",
        }, gradientStops(palette).map(({ color, offset }) => h("stop", { key: offset, offset, stopColor: color }))))),
        h("rect", {
          x: left, y: top, width: right - left, height: bottom - top, rx: 3,
          className: "dh-compare-score-map__field",
        }),
        ticks.map((tick) => h("g", { key: tick },
          h("path", {
            className: `dh-compare-score-map__grid${tick === 0 ? " is-zero" : ""}`,
            d: `M${left} ${yFor(tick)}H${right} M${xFor(tick)} ${top}V${bottom}`,
          }),
          h("text", { x: left - 8, y: yFor(tick) + 3.7, textAnchor: "end" }, tick),
          h("text", { x: xFor(tick), y: bottom + 17, textAnchor: "middle" }, tick),
        )),
        // With the same domain on both axes, the diagonal is ceiling = PPG.
        // The vertical guide to each point encodes its ceiling above average.
        h("path", { className: "dh-compare-score-map__equal", d: `M${left} ${bottom}L${right} ${top}` }),
        points.map(({ player, slot, ppg, x, y }) => h("path", {
          key: player.id, className: "dh-compare-score-map__lift",
          "data-season-slot": slot, d: `M${x} ${yFor(ppg)}V${y}`,
        })),
        points.map(({ player, slot, x, y, ppg, ceiling }) => {
          const gradient = `url(#dh-compare-score-map-gradient-${slot})`;
          // An outlined circle and a smaller solid diamond remain distinct
          // even when both players land on exactly the same coordinates.
          return h("g", { key: player.id, transform: `translate(${x} ${y})`, className: "dh-compare-score-map__mark", "data-season-slot": slot },
            h("title", null, `${getPlayerName(player)} · ${formatMetric("ppg", ppg)} PPG · ${formatMetric("ceiling", ceiling)} ceiling`),
            slot === 0
              ? h("circle", { r: 8, stroke: gradient, fill: "var(--compare-inset-fill)" })
              : h("path", { d: "M0 -5.5 5.5 0 0 5.5 -5.5 0Z", fill: gradient, stroke: "var(--season-light)" }),
          );
        }),
        h("text", { className: "dh-compare-score-map__axis", x: left, y: top - 11 }, "Ceiling"),
        h("text", { className: "dh-compare-score-map__axis", x: right, y: bottom + 33, textAnchor: "end" }, "PPG"),
      ) : h("p", { className: "dh-compare-no-data" }, "A scoring average and ceiling are needed to plot a player."),
      points.length ? h("div", { className: "dh-compare-score-map__key" },
        h("span", null, "Ceiling − PPG"),
        profile.rows.map(({ player, ppg, ceiling }, slot) => {
          const gap = ppg === null || ceiling === null ? null : Number((ceiling - ppg).toFixed(1));
          const label = gap === null ? "—" : `${gap > 0 ? "+" : ""}${formatMetric("ppg", gap)}`;
          return h("span", {
            key: player.id, className: "dh-compare-score-map__gap", "data-season-slot": slot,
            title: getPlayerName(player), "aria-label": `${getPlayerName(player)} ceiling minus PPG: ${label}`,
          }, h("i", { "aria-hidden": "true" }), label);
        }),
      ) : null,
    );
  }

  function ScoringProfile({ players, palettes }) {
    const profile = useMemo(() => buildScoringProfile(players), [players]);
    return h("section", { className: "dh-compare-scoring", "aria-labelledby": "dh-compare-scoring-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-scoring-title" }, "Scoring profile"),
        h("span", { className: "dh-compare-season-panel__unit" }, "PPR"),
      ),
      h("div", { className: "dh-compare-score-views" },
        h("figure", { className: "dh-compare-score-view" },
          h("figcaption", null, "Scoring dials",
            h("span", { className: "dh-compare-score-dial__key" }, h("i", { "aria-hidden": "true" }), "Ceiling")),
          h("div", { className: "dh-compare-score-dials" },
            profile.rows.map((row, slot) => h(ScoreDial, { key: row.player.id, row, slot, palette: palettes[slot], profile })),
          ),
        ),
        h(ScoringMap, { profile, palettes }),
      ),
      h("p", { className: "dh-compare-season-note" }, "Ceiling is the average of the player’s best three games."),
    );
  }

  function StatMatchupRow({ row, players }) {
    return h("div", { className: "dh-compare-rank-row" },
      h("h5", null, row.label),
      players.map((player, slot) => {
        const rank = row.ranks[slot];
        const value = formatMetric(row.key, row.values[slot]);
        return h("div", {
          key: player.id, className: "dh-compare-rank-side", "data-season-slot": slot,
          "data-trailing": row.trailing === slot || undefined,
        },
          h("div", {
            className: "dh-compare-rank-side__readout", role: "group",
            "aria-label": `${getPlayerName(player)} ${row.label}`,
          },
            h("strong", null, `${player.pos}·${rank ?? "—"}`),
            h("small", null, value),
          ),
          h("div", { className: "dh-compare-rank-side__track", "aria-hidden": "true" },
            rank === null ? null : h("i", { style: { "--rank-length": `${row.barFractions[slot] * 100}%` } }),
          ),
        );
      }),
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
      h("div", { id: "dh-compare-season-metrics", className: "dh-compare-matchups__rows" },
        rows.length ? rows.map((row) => h(StatMatchupRow, { key: row.key, row, players }))
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
