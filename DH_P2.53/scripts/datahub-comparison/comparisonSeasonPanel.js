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

// The matchup's center column stays narrow on phones. Full names stay
// available in the row heading's accessible name and on wider screens.
const COMPACT_METRIC_LABELS = Object.freeze({
  pass_yd: "Pass yds", pass_td: "Pass TDs", pass_cmp: "Comp", pass_rtg: "Pass rtg",
  cmp_pct: "CMP%", epa_per_db: "EPA/DB", ttt: "TTT", prs_pct: "PRS%",
  rush_yd: "Rush yds", rush_td: "Rush TDs", ypc: "YPC", yco_per_att: "YAC/att",
  mtf_per_att: "MTF/att", expl_ru_pct: "Expl rush%",
  rec_tgt: "Targets", rec: "Rec", rec_yd: "Rec yds", rec_td: "Rec TDs", rec_fd: "Rec 1D",
  rr: "Routes", yprr: "Yds/route", ypr: "Yds/rec", ts_per_rr: "TGT share",
  first_down_rec_rate: "1D/route", rec_yms: "Rec yd share",
  fpoe: "FPOE", yds_total: "Total yds", imp: "Impact", imp_per_g: "IMP/game",
  snp_pct: "Snap share", imp_per_opp: "IMP/opp",
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

const SCORING_FIELDS = [
  { key: "ppg", label: "PPG" },
  { key: "ceiling", label: "Ceiling" },
];

const ROSE_CENTER = { x: 166, y: 119 };

function rosePoint(radius, angle) {
  const radians = angle * Math.PI / 180;
  return [
    ROSE_CENTER.x + radius * Math.sin(radians),
    ROSE_CENTER.y - radius * Math.cos(radians),
  ].join(" ");
}

function roseArc(radius, start, end) {
  return `M${rosePoint(radius, start)} A${radius} ${radius} 0 0 1 ${rosePoint(radius, end)}`;
}

function roseSector(inner, outer, start, end) {
  return `${roseArc(outer, start, end)} L${rosePoint(inner, end)} A${inner} ${inner} 0 0 0 ${rosePoint(inner, start)}Z`;
}

function positionTowerLabels(row, yFor, top, bottom) {
  const labels = SCORING_FIELDS.flatMap(({ key }) => row[key] === null ? [] : [{
    key, value: row[key], scoreY: yFor(row[key]), labelY: yFor(row[key]),
  }]).sort((a, b) => a.scoreY - b.scoreY);
  // Tight averages and ceilings share the tower but keep independently
  // readable labels. Their connector lines retain the exact score heights.
  const [upper, lower] = labels;
  const spacing = 17;
  if (lower && lower.scoreY - upper.scoreY < spacing) {
    upper.labelY = Math.min(bottom - spacing, Math.max(top, (upper.scoreY + lower.scoreY - spacing) / 2));
    lower.labelY = upper.labelY + spacing;
  }
  return labels;
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

  function ScoringRose({ profile, palettes, description }) {
    const inner = 27;
    const outer = 95;
    const radiusFor = (value) => inner + profile.fraction(value) * (outer - inner);
    const origin = radiusFor(0);
    const solo = profile.rows.length === 1;
    const petals = SCORING_FIELDS.flatMap(({ key, label }, fieldIndex) => profile.rows.map((row, slot) => {
      const onLeft = (solo ? fieldIndex : slot) === 0;
      const angle = (onLeft ? -1 : 1) * (solo ? 90 : fieldIndex === 0 ? 46 : 134);
      const value = row[key];
      return {
        id: `dh-compare-rose-${key}-${slot}`, key, label, slot, value, onLeft,
        start: angle - 30, end: angle + 30, valueY: solo ? 132 : fieldIndex === 0 ? 76 : 175,
      };
    }));

    return h("figure", { className: "dh-compare-score-view dh-compare-score-view--rose" },
      h("figcaption", null, "Scoring rose"),
      h("svg", {
        className: "dh-compare-score-plot", viewBox: "0 0 332 238", role: "img",
        "aria-label": `Radial columns for PPG and ceiling on the same points scale. ${description}`,
      },
        // Each equal-angle petal grows by radius from the same true zero.
        // Fill the player's full spectrum over that radius, even in a short petal.
        h("defs", null, petals.filter(({ value }) => value !== null && value !== 0).map(({ id, slot, value }) => {
          const radius = radiusFor(value);
          const low = Math.min(origin, radius);
          const high = Math.max(origin, radius);
          return h("radialGradient", { key: id, id, gradientUnits: "userSpaceOnUse", cx: ROSE_CENTER.x, cy: ROSE_CENTER.y, r: high },
            gradientStops(palettes[slot]).map(({ color, offset }) => h("stop", {
              key: offset, offset: (low + (high - low) * offset) / high, stopColor: color,
            })),
          );
        })),
        ...petals.map(({ id, start, end }) => h("path", {
          key: `track-${id}`, className: "dh-compare-rose__track", d: roseSector(inner, outer, start, end),
        })),
        ...profile.ticks.map((tick) => h("circle", {
          key: `ring-${tick}`, className: `dh-compare-score-grid${tick === 0 ? " is-zero" : ""}`,
          cx: ROSE_CENTER.x, cy: ROSE_CENTER.y, r: radiusFor(tick),
        })),
        ...petals.map(({ id, slot, start, end, value }) => {
          if (value === null) return null;
          const radius = radiusFor(value);
          return h("g", { key: `petal-${id}`, "data-season-slot": slot },
            value === 0 ? null : h("path", {
              className: "dh-compare-rose__petal",
              d: roseSector(Math.min(origin, radius), Math.max(origin, radius), start, end), fill: `url(#${id})`,
            }),
            h("path", { className: "dh-compare-rose__edge", d: roseArc(radius, start, end) }),
          );
        }),
        h("circle", { className: "dh-compare-rose__hub", cx: ROSE_CENTER.x, cy: ROSE_CENTER.y, r: 18 }),
        h("text", { className: "dh-compare-score-axis", x: ROSE_CENTER.x, y: ROSE_CENTER.y + 4, textAnchor: "middle" }, "PPR"),
        ...profile.ticks.map((tick) => h("text", {
          key: `tick-${tick}`, x: ROSE_CENTER.x, y: ROSE_CENTER.y - radiusFor(tick) + 3,
          textAnchor: "middle", className: "dh-compare-score-tick dh-compare-rose__tick",
        }, tick)),
        solo ? null : SCORING_FIELDS.map(({ key, label }, index) => h("text", {
          key, className: "dh-compare-score-axis", x: ROSE_CENTER.x, y: index === 0 ? 12 : 232, textAnchor: "middle",
        }, label)),
        ...petals.map(({ id, key, label, value, onLeft, valueY, slot }) => {
          const x = onLeft ? 11 : 321;
          const textAnchor = onLeft ? "start" : "end";
          return h("g", { key: `label-${id}`, "data-season-slot": slot },
            solo ? h("text", { className: "dh-compare-score-axis", x, y: valueY - 23, textAnchor }, label) : null,
            h("text", { className: "dh-compare-score-number dh-compare-rose__number", x, y: valueY, textAnchor }, formatMetric(key, value)),
          );
        }),
      ),
    );
  }

  function ScoringColumns({ profile, palettes, description }) {
    const top = 15;
    const bottom = 222;
    const width = 58;
    const yFor = (value) => bottom - profile.fraction(value) * (bottom - top);
    const solo = profile.rows.length === 1;

    return h("figure", { className: "dh-compare-score-view dh-compare-score-view--range" },
      h("figcaption", null, "Scoring range"),
      h("svg", {
        className: "dh-compare-score-plot", viewBox: "0 0 332 238", role: "img",
        "aria-label": `Scoring columns with PPG filled solid and the ceiling shown in the lighter layer. ${description}`,
      },
        h("defs", null,
          h("pattern", { id: "dh-compare-range-glass", width: 7, height: 7, patternUnits: "userSpaceOnUse", patternTransform: "rotate(24)" },
            h("path", { d: "M0 0V7", stroke: "#e6f1ff", strokeOpacity: 0.36, strokeWidth: 1.35 })),
          palettes.map((palette, slot) => h("linearGradient", {
            key: slot, id: `dh-compare-range-fill-${slot}`, x1: "3%", y1: "100%", x2: "100%", y2: "3%",
          }, gradientStops(palette).map(({ color, offset }) => h("stop", { key: offset, offset, stopColor: color })))),
        ),
        ...profile.ticks.map((tick) => h("g", { key: tick },
          h("path", { className: `dh-compare-score-grid${tick === 0 ? " is-zero" : ""}`, d: `M28 ${yFor(tick)}H316` }),
          h("text", { className: "dh-compare-score-tick", x: 21, y: yFor(tick) + 4, textAnchor: "end" }, tick),
        )),
        ...profile.rows.map((row, slot) => {
          const x = (solo ? 166 : slot === 0 ? 109 : 229) - width / 2;
          const mask = `dh-compare-range-tiles-${slot}`;
          const gradient = `url(#dh-compare-range-fill-${slot})`;
          // The volume between zero and each score is continuous. Mask it
          // with etched intervals, keeping the two caps at their actual values.
          const tile = (value, className, fill, start = 0) => {
            if (value === null || value === start) return null;
            const y = yFor(value);
            const startY = yFor(start);
            return h("rect", { className, x, y: Math.min(startY, y), width, height: Math.abs(startY - y), fill });
          };
          const ceilingStart = row.ceiling > 0
            ? Math.max(0, Math.min(row.ppg ?? 0, row.ceiling))
            : Math.min(0, Math.max(row.ppg ?? 0, row.ceiling ?? 0));
          const alignLeft = !solo && slot === 0;
          const edge = alignLeft ? x : x + width;
          const direction = alignLeft ? -1 : 1;
          return h("g", { key: row.player.id, "data-season-slot": slot },
            h("defs", null, h("mask", { id: mask, maskUnits: "userSpaceOnUse", x, y: top, width, height: bottom - top },
              profile.ticks.slice(1).map((tick, index) => h("rect", {
                key: tick, x, y: yFor(tick) + 0.8, width, height: yFor(profile.ticks[index]) - yFor(tick) - 1.6, rx: 3.1, fill: "#fff",
              })),
            )),
            h("rect", { className: "dh-compare-range__case", x: x - 3, y: top - 3, width: width + 6, height: bottom - top + 6, rx: 7 }),
            h("g", { mask: `url(#${mask})` },
              h("rect", { className: "dh-compare-range__track", x, y: top, width, height: bottom - top }),
              tile(row.ceiling, "dh-compare-range__ceiling", gradient, ceilingStart),
              tile(row.ceiling, "dh-compare-range__texture", "url(#dh-compare-range-glass)", ceilingStart),
              tile(row.ppg, "dh-compare-range__average", gradient),
            ),
            ...positionTowerLabels(row, yFor, top, bottom).map(({ key, value, scoreY, labelY }) => h("g", {
              key, className: "dh-compare-range__marker", "data-scoring-stat": key,
            },
              h("path", { className: "dh-compare-range__cap", d: `M${x} ${scoreY}h${width}` }),
              h("path", {
                className: "dh-compare-range__leader",
                d: `M${edge} ${scoreY}h${direction * 3}L${edge + direction * 7} ${labelY}`,
              }),
              h("text", {
                className: "dh-compare-score-number", x: edge + direction * 11, y: labelY + 4.5,
                textAnchor: alignLeft ? "end" : "start",
              }, formatMetric(key, value)),
            )),
          );
        }),
      ),
      h("div", { className: "dh-compare-range__footer" },
        h("div", { className: "dh-compare-range__key" },
          h("span", null, h("i", { "aria-hidden": true }), "PPG"),
          h("span", null, h("i", { "aria-hidden": true }), "Ceiling"),
        ),
        h("div", { className: "dh-compare-range__difference" },
          h("span", null, "Ceiling − PPG"),
          ...profile.rows.map(({ player, ppg, ceiling }, slot) => {
            const delta = ppg === null || ceiling === null ? null : Number((ceiling - ppg).toFixed(1));
            const label = `${delta > 0 ? "+" : ""}${formatMetric("ppg", delta)}`;
            return h("b", { key: player.id, "data-season-slot": slot, title: getPlayerName(player) }, label);
          }),
        ),
      ),
    );
  }

  function ScoringProfile({ players, palettes }) {
    const profile = useMemo(() => buildScoringProfile(players), [players]);
    const description = profile.rows.map(({ player, ppg, ceiling }) =>
      `${getPlayerName(player)}. PPG ${ppg === null ? "unavailable" : formatMetric("ppg", ppg)}. Ceiling ${ceiling === null ? "unavailable" : formatMetric("ceiling", ceiling)}.`,
    ).join(" ");
    const hasScores = profile.rows.some(({ ppg, ceiling }) => ppg !== null || ceiling !== null);

    return h("section", { className: "dh-compare-scoring", "aria-labelledby": "dh-compare-scoring-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-scoring-title" }, "Scoring profile"),
        h("span", { className: "dh-compare-season-panel__unit" }, "PPR"),
      ),
      h("div", { className: "dh-compare-scoring__players" },
        profile.rows.map(({ player, fpts, games }, slot) => h("div", { key: player.id, "data-season-slot": slot },
          h(PlayerKey, { player, slot }),
          h("span", null,
            h("span", null, h("b", null, formatMetric("fpts", fpts)), " FPTS"),
            h("i", { "aria-hidden": true }),
            h("span", null, h("b", null, formatMetric("games_played", games)), games === 1 ? " game" : " games"),
          ),
        )),
      ),
      hasScores ? [
        h("div", { key: "charts", className: "dh-compare-score-views" },
          h(ScoringRose, { profile, palettes, description }),
          h(ScoringColumns, { profile, palettes, description }),
        ),
        h("p", { key: "ceiling", className: "dh-compare-season-note" }, "Ceiling is the average of the player’s best three games."),
      ] : h("p", { className: "dh-compare-no-data" }, "No scoring rates are available."),
    );
  }

  function StatMatchupRow({ row, players }) {
    const compact = COMPACT_METRIC_LABELS[row.key];
    const showCompact = compact && compact !== row.label;
    return h("div", { className: "dh-compare-rank-row" },
      h("h5", { className: "dh-compare-rank-row__metric", title: row.label, "aria-label": row.label },
        h("span", { className: showCompact ? "is-full" : undefined }, row.label),
        showCompact ? h("span", { className: "is-compact" }, compact) : null,
      ),
      // Each side starts at the center label. The readout follows its bar tip,
      // and only a ranked head-to-head loss dims the player's fill.
      players.map((player, slot) => {
        const rank = row.ranks[slot];
        const value = formatMetric(row.key, row.values[slot]);
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
