import {
  COMPARISON_RADAR_MAX_RANK_BY_POS,
  COMPARISON_STAT_DEFINITIONS,
  formatComparisonValue,
  getComparisonPositions,
  getPlayerName,
  getStatDefinition,
  getStatLabel,
  toFiniteNumber,
} from "./comparisonStats.js?v=DH3.81-compare";
import { getDataHubStatDefinition } from "../datahub-stats-help.js?v=DH3.64a-air-yards-icon";
import { getWeeklyPalette } from "./comparisonChartOptions.js?v=DH3.82-compare-previews";

// Stat Matchups groups the season fields by their position and role. Mixed
// comparisons use the shared families; any field absent for both players is
// skipped, including current-season columns the 2025 archive never published.
const PASSING = {
  production: [
    "pass_att", "pass_cmp", "pass_yd", "pass_td", "pass_fd", "epa",
    "pass_imp", "pass_sack", "pass_int", "dropbacks",
  ],
  efficiency: [
    "cmp_pct", "pass_rtg", "epa_per_db", "cpoe", "ttt", "prs_pct", "blitz_pct",
    "dp_pct", "adjusted_ypa", "pa_ypg", "pass_imp_per_att", "team_pass_pct",
  ],
};

const SHARED_RUSHING = {
  production: ["rush_att", "rush_yd", "rush_td", "rush_fd"],
  efficiency: ["ypc", "ru_ypg"],
};

const RUSHING = {
  production: [...SHARED_RUSHING.production, "mtf", "rush_yac", "rush_ybc", "ryoe", "rz_att", "gl_att"],
  efficiency: [
    "ypc", "elu", "mtf_per_att", "yco_per_att", "expl_ru_pct", "ryoe_per_att", "ybc_per_att",
    "ru_ypg", "car_per_g", "rush_yms", "rush_tms",
  ],
};

const RECEIVING = {
  production: ["rec_tgt", "rec", "rec_yd", "rec_td", "rec_fd", "rec_yar", "rr", "rz_tgt", "tgt_10_plus", "AY"],
  efficiency: [
    "ts_per_rr", "yprr", "tprr", "first_down_rec_rate", "rec_ypg", "tgt_per_g", "recIMP/R",
    "rec_yacr", "ay_pct", "ay_per_tgt", "ypr", "rec_per_g", "recs_pct", "rec_yms", "rec_tms",
  ],
};

const GENERAL = {
  production: ["yds_total", "td_total", "opp", "imp", "fum"],
  efficiency: ["snp_pct", "ypg", "imp_per_g", "imp_per_opp", "ys_pct", "tds_pct", "fpoe"],
};

const RECEIVER_GROUPS = [RECEIVING, SHARED_RUSHING, GENERAL];
const MATCHUP_GROUPS = {
  QB: [PASSING, SHARED_RUSHING, GENERAL],
  RB: [RUSHING, RECEIVING, GENERAL],
  WR: RECEIVER_GROUPS,
  TE: RECEIVER_GROUPS,
  SKILL: RECEIVER_GROUPS,
  MIXED: [SHARED_RUSHING, GENERAL],
};

const MATCHUP_PRECISE_RATES = new Set(["tprr", "first_down_rec_rate", "recIMP/R"]);

function getSeasonValue(player, key) {
  return toFiniteNumber(player.seasonStats?.[key]);
}

export function buildSeasonMetricRows(players, mode) {
  const positions = getComparisonPositions(players);
  const positionGroup = positions.length === 1 ? positions[0] : positions.includes("QB") ? "MIXED" : "SKILL";
  const groups = MATCHUP_GROUPS[positionGroup] || MATCHUP_GROUPS.MIXED;
  const keys = [mode === "production" ? "fpts" : "ppg", ...groups.flatMap((group) => group[mode])];
  const rows = keys.flatMap((key) => {
    const values = players.map((player) => getSeasonValue(player, key));
    if (values.every((value) => value === null)) return [];
    // Use Data Hub's qualified positional ranks. The raw values stay visible
    // even when a player has no rank, and a recorded zero can still be ranked.
    const ranks = players.map((player, index) => {
      const rankSource = Object.hasOwn(player.seasonMatchupRanks || {}, key) ? player.seasonMatchupRanks : player.seasonPosRanks;
      const rank = toFiniteNumber(rankSource?.[key]);
      return values[index] !== null && Number.isInteger(rank) && rank > 0 ? rank : null;
    });
    // Use the glossary's primary abbreviation at every width. Some entries
    // also list alternate labels for other views after a spaced slash.
    const definition = getDataHubStatDefinition(key);
    const label = definition?.abbr.split(" / ")[0] ?? getStatLabel(key);
    return [{ key, values, label, name: definition?.name ?? label, ranks }];
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
  // The scoring gauges use one points scale for the PPG arc and ceiling marker.
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
  // Round to a readable step that fits at least four full intervals.
  // Both endpoints get labels, including in a tiny or all-zero sample.
  const target = Math.max(1, (high - low) / 4);
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const step = [5, 2.5, 2, 1].find((size) => size * magnitude <= target) * magnitude;
  const first = Math.floor(low / step);
  const last = Math.max(first + 4, Math.ceil(high / step));
  const min = first * step;
  const max = last * step;
  return {
    ticks: Array.from({ length: last - first + 1 }, (_, index) => (first + index) * step),
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
    return { player, games, ceiling: getSeasonValue(player, "ceiling"), low: percentile(0.25), median: percentile(0.5), high: percentile(0.75) };
  });
  // The published season ceiling lives on the same axis as the weekly scores,
  // even if the loaded points don't reach that value.
  const scores = rows.flatMap(({ games, ceiling }) => [ceiling, ...games.map(({ score }) => score)]).filter(Number.isFinite);
  return { rows, ...pointsScale(scores) };
}

function formatMatchupValue({ key, label }, value) {
  if (value === null) return "—";
  if (COMPARISON_STAT_DEFINITIONS[key] && !MATCHUP_PRECISE_RATES.has(key)) return formatMetric(key, value);
  const digits = MATCHUP_PRECISE_RATES.has(key) ? 3 : 2;
  const display = value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    signDisplay: key === "epa" ? "exceptZero" : "auto",
  });
  return label.endsWith("%") || key === "pass_imp_per_att" ? `${display}%` : display;
}

function formatMetric(key, value) {
  if (value === null) return "—";
  const { decimals, unit } = getStatDefinition(key);
  if (decimals === 0) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return formatComparisonValue(key, value, { compact: unit !== "s" });
}

const SCORE_GAUGE_CENTER = { x: 86, y: 82 };
const SCORE_GAUGE_RADIUS = 60;

function gaugePoint(fraction, radius = SCORE_GAUGE_RADIUS) {
  const angle = Math.PI * (1 - fraction);
  return [
    SCORE_GAUGE_CENTER.x + radius * Math.cos(angle),
    SCORE_GAUGE_CENTER.y - radius * Math.sin(angle),
  ];
}

function gaugeArc(from, to, radius = SCORE_GAUGE_RADIUS) {
  return `M${gaugePoint(from, radius).join(" ")} A${radius} ${radius} 0 0 1 ${gaugePoint(to, radius).join(" ")}`;
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

  function ScoringGauge({ row, slot, palette, profile }) {
    const { player, ppg, ceiling, fpts, games } = row;
    const { ticks, fraction } = profile;
    const track = gaugeArc(0, 1);
    const zero = fraction(0);
    const score = ppg === null ? zero : fraction(ppg);
    const from = Math.min(zero, score);
    const to = Math.max(zero, score);
    const [startX, startY] = gaugePoint(from);
    const [endX, endY] = gaugePoint(to);
    const [scoreX, scoreY] = gaugePoint(score);
    const gradientId = `dh-compare-score-fill-${slot}`;
    const hasFill = to > from;
    const ceilingPosition = ceiling === null ? null : fraction(ceiling);
    const [ceilingX, ceilingY] = ceilingPosition === null ? [] : gaugePoint(ceilingPosition, 76);
    const metrics = [["ceiling", "Ceiling", ceiling], ["fpts", "FPTS", fpts], ["games_played", "Games", games]];

    return h("article", { className: "dh-compare-score-gauge", "data-season-slot": slot },
      h(PlayerKey, { player, slot }),
      h("svg", {
        className: "dh-compare-score-gauge__plot", viewBox: "0 0 172 111", role: "img",
        "aria-label": `${getPlayerName(player)}: ${formatMetric("ppg", ppg)} PPG, ceiling ${formatMetric("ceiling", ceiling)}. Scale ${ticks[0]} to ${ticks.at(-1)} PPR points.`,
      },
        // Fill the semicircle only between zero and the average. The ceiling
        // is its own marker on the same scale, even for signed scoring data.
        hasFill ? h("defs", null, h("linearGradient", {
          id: gradientId, gradientUnits: "userSpaceOnUse", x1: startX, y1: startY, x2: endX, y2: endY,
        }, gradientStops(palette).map(({ color, offset }) => h("stop", { key: offset, offset, stopColor: color })))) : null,
        h("path", { className: "dh-compare-score-gauge__rim", d: track }),
        h("path", { className: "dh-compare-score-gauge__track", d: track }),
        ticks.map((tick) => {
          const position = fraction(tick);
          return h("path", {
            key: tick, className: `dh-compare-score-gauge__tick${tick === 0 ? " is-zero" : ""}`,
            d: `M${gaugePoint(position, 73.5).join(" ")} L${gaugePoint(position, tick === 0 ? 80 : 77.5).join(" ")}`,
          });
        }),
        hasFill ? h("path", { className: "dh-compare-score-gauge__fill", d: gaugeArc(from, to), stroke: `url(#${gradientId})` }) : null,
        hasFill ? h("path", { className: "dh-compare-score-gauge__shine", d: gaugeArc(from, to, 66) }) : null,
        ppg === null ? null : h("circle", { className: "dh-compare-score-gauge__cap", cx: scoreX, cy: scoreY, r: 3.1 }),
        ceilingPosition === null ? null : h("rect", {
          className: "dh-compare-score-gauge__ceiling", x: ceilingX - 3.2, y: ceilingY - 3.2,
          width: 6.4, height: 6.4, rx: 0.8, transform: `rotate(45 ${ceilingX} ${ceilingY})`,
        }),
        h("text", { className: "dh-compare-score-gauge__value", x: 86, y: 66, textAnchor: "middle" }, formatMetric("ppg", ppg)),
        h("text", { className: "dh-compare-score-gauge__label", x: 86, y: 83, textAnchor: "middle" }, "PPG"),
        h("text", { className: "dh-compare-score-gauge__end", x: 26, y: 108, textAnchor: "middle" }, ticks[0]),
        h("text", { className: "dh-compare-score-gauge__end", x: 146, y: 108, textAnchor: "middle" }, ticks.at(-1)),
      ),
      h("dl", { className: "dh-compare-score-gauge__stats" },
        metrics.map(([key, label, value]) => h("div", { key, "data-score-stat": key },
          h("dt", null, label), h("dd", null, formatMetric(key, value)),
        )),
      ),
    );
  }

  function ScoringProfile({ players, palettes }) {
    const profile = useMemo(() => buildScoringProfile(players), [players]);
    return h("section", { className: "dh-compare-scoring", "aria-labelledby": "dh-compare-scoring-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-scoring-title" }, "Scoring profile"),
        h("span", { className: "dh-compare-season-panel__unit" }, "PPR"),
      ),
      h("div", { className: "dh-compare-score-gauges" },
        profile.rows.map((row, slot) => h(ScoringGauge, { key: row.player.id, row, slot, palette: palettes[slot], profile })),
      ),
      h("p", { className: "dh-compare-season-note" }, "Ceiling is the average of the player’s best three games."),
    );
  }

  function StatMatchupRow({ row, players }) {
    return h("div", { className: "dh-compare-rank-row" },
      h("h5", { className: "dh-compare-rank-row__metric", title: row.name }, row.label),
      // Each side starts at the center label. The readout follows its bar tip,
      // and only a ranked head-to-head loss dims the player's fill.
      players.map((player, slot) => {
        const rank = row.ranks[slot];
        const value = formatMatchupValue(row, row.values[slot]);
        const edge = row.trailing === null ? undefined : row.trailing === slot ? "trailing" : "leading";
        return h("div", {
          key: player.id, className: "dh-compare-rank-side", "data-season-slot": slot, "data-rank-edge": edge,
        },
          h("div", {
            className: "dh-compare-rank-side__readout", role: "group", title: `${getPlayerName(player)} · ${row.label}`,
            "aria-label": `${getPlayerName(player)} ${row.label}`,
          },
            h("strong", null, `${player.pos}·${rank ?? "—"}`),
            h("small", null, value),
          ),
          rank === null ? null : h("i", { className: "dh-compare-rank-side__fill", "aria-hidden": "true",
            style: { "--rank-length": row.barFractions[slot] },
          }),
          h("svg", {
            className: "dh-compare-rank-side__chevrons", viewBox: "0 0 14 14", "aria-hidden": "true",
          }, h("path", { d: slot === 0 ? "M7 2.5 2.5 7 7 11.5 M12.5 2.5 8 7 12.5 11.5" : "M1.5 2.5 6 7 1.5 11.5 M7 2.5 11.5 7 7 11.5" })),
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
      h("div", { className: "dh-compare-matchups__board", "data-player-count": players.length },
        h("div", { className: "dh-compare-matchups__legend" },
          players.map((player, index) => h(PlayerKey, { key: player.id, player, slot: index })),
        ),
        h("div", { id: "dh-compare-season-metrics", className: "dh-compare-matchups__rows" },
          rows.length ? rows.map((row) => h(StatMatchupRow, { key: row.key, row, players }))
            : h("p", { className: "dh-compare-no-data" }, "No season values are available for these stats."),
        ),
      ),
    );
  }

  function ScoringSpread({ players, weeks }) {
    const { rows, ticks, fraction } = useMemo(() => buildScoringSpread(players, weeks), [players, weeks]);
    const hasData = rows.some(({ games, ceiling }) => games.length || ceiling !== null);
    const xFor = (value) => `${100 * fraction(value)}%`;
    return h("section", { className: "dh-compare-season-panel dh-compare-spread", "aria-labelledby": "dh-compare-spread-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-spread-title" }, "Scoring distribution"),
        h("span", { className: "dh-compare-season-panel__unit" }, "Weekly PPR"),
      ),
      hasData ? h("div", { className: "dh-compare-spread__rows" },
        rows.map(({ player, games, low, median, high, ceiling }, index) => h("article", {
          key: player.id, className: "dh-compare-spread__row", "data-season-slot": index,
        },
          h("div", { className: "dh-compare-spread__identity" },
            h(PlayerKey, { player, slot: index }),
            h("div", { className: "dh-compare-spread__facts" },
              h("span", null, median === null ? "No recorded games" : `${formatMetric("fpts", median)} median · ${games.length} ${games.length === 1 ? "game" : "games"}`),
              ceiling === null ? null : h("span", { className: "dh-compare-spread__ceiling-label" },
                h("i", { "aria-hidden": true }), "Ceiling ", h("b", null, formatMetric("ceiling", ceiling))),
            ),
          ),
          h("div", {
            className: "dh-compare-spread__strip", role: "img",
            "aria-label": [
              games.length ? games.map(({ week, score }) => `Week ${week}: ${score}`).join(", ") : "No recorded games",
              ceiling === null ? null : `Ceiling: ${formatMetric("ceiling", ceiling)} PPR points`,
            ].filter(Boolean).join(". "),
          },
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
            ceiling === null ? null : h("i", {
              className: "dh-compare-spread__ceiling",
              style: { left: xFor(ceiling) },
              title: `Ceiling: ${formatMetric("ceiling", ceiling)} PPR points`,
            }),
          ),
        )),
        h("div", { className: "dh-compare-spread__axis", "aria-hidden": true },
          ticks.map((tick) => h("span", { key: tick, style: { left: xFor(tick) } }, tick)),
        ),
      ) : h("p", { className: "dh-compare-no-data" }, "No recorded weekly scores are available."),
      hasData ? h("p", { className: "dh-compare-season-note" }, "The band covers the middle half of weekly scores. The solid line marks the median and the diamond marks the season ceiling.") : null,
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
