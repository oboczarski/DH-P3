import {
  COMPARISON_RADAR_MAX_RANK_BY_POS,
  formatComparisonValue,
  getComparisonPosition,
  getComparisonPositions,
  getPlayerName,
  getStatDefinition,
  toFiniteNumber,
} from "./comparisonStats.js?v=DH3.87-compare-groups";
import { getWeeklyPalette, getWeeklyPaletteStops } from "./comparisonChartOptions.js?v=DH3.89-compare-weekly-alignment";

// These shorter labels belong to the Stat Matchups buttons. The group keys
// continue to come from the Stats table and drive selection and data lookup.
const STAT_MATCHUP_BUTTON_LABELS = Object.freeze({
  "PASSING PRODUCTION": "pass production",
  "PASSING EFFICIENCY": "pass efficiency",
  "RUSHING PRODUCTION": "rush production",
  "RUSHING EFFICIENCY": "rush efficiency",
  "RECEIVING PRODUCTION": "Rec production",
  "RECEIVING EFFICIENCY": "Rec efficiency",
});

function getSeasonValue(player, key) {
  return toFiniteNumber(player.seasonStats?.[key]);
}

export function buildSeasonMetricRows(players, columns) {
  // Keep each Stats group's column order, including missing cells. FPTS uses
  // Compare's positional rank because the table shows a dedicated FPTS chip.
  const rows = columns.map((column) => {
    const sides = players.map((player) => {
      const stat = player.seasonMatchupStats?.[column.key];
      const value = toFiniteNumber(stat?.value);
      const rank = toFiniteNumber(column.key === "FPTS" ? player.seasonPosRanks?.fpts : stat?.rank);
      return {
        value,
        display: value === null ? "—" : stat.display,
        rank: value !== null && Number.isInteger(rank) && rank > 0 ? rank : null,
      };
    });
    return { ...column, sides };
  });

  // One scale per group keeps equal positional ranks the same length, even
  // when the players have different positions or one has unavailable ranks.
  const rankLimit = Math.max(
    1,
    ...getComparisonPositions(players).map((pos) => COMPARISON_RADAR_MAX_RANK_BY_POS[pos] || 72),
    ...rows.flatMap(({ sides }) => sides.map(({ rank }) => rank).filter(Number.isInteger)),
  );
  return rows.map((row) => {
    const [first, second] = row.sides;
    const trailing = first?.rank != null && second?.rank != null && first.rank !== second.rank
      ? (first.rank > second.rank ? 0 : 1)
      : null;
    return {
      ...row,
      trailing,
      sides: row.sides.map((side) => ({ ...side, barFraction: side.rank === null ? null : (rankLimit - side.rank + 1) / rankLimit })),
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
        }, getWeeklyPaletteStops(palette).map(({ color, offset }) => h("stop", { key: offset, offset, stopColor: color })))) : null,
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

  function TableHeaderIcon({ icon, className }) {
    // Only locally generated Stats header SVG markup reaches this wrapper.
    return icon ? h("span", {
      className, "aria-hidden": "true", dangerouslySetInnerHTML: { __html: icon },
    }) : null;
  }

  function StatMatchupRow({ row, players }) {
    // Stat Matchups uses a shorter abbreviation with the same table key and icon.
    const label = row.key === "EXPLSV%" ? "XPLSV%" : row.label;
    return h("div", { className: "dh-compare-rank-row" },
      h("h5", { className: "dh-compare-rank-row__metric", title: row.name, "data-column-name": row.key },
        h(TableHeaderIcon, { icon: row.icon, className: "dh-compare-rank-row__icon" }),
        h("span", null, label),
      ),
      // Each side starts at the center label. The readout follows its bar tip,
      // and only a ranked head-to-head loss dims the player's fill.
      players.map((player, slot) => {
        const { rank, display, barFraction } = row.sides[slot];
        const edge = row.trailing === null ? undefined : row.trailing === slot ? "trailing" : "leading";
        return h("div", {
          key: player.id, className: "dh-compare-rank-side", "data-season-slot": slot, "data-rank-edge": edge,
        },
          h("div", {
            className: "dh-compare-rank-side__readout", role: "group", title: `${getPlayerName(player)} · ${label}`,
            "aria-label": `${getPlayerName(player)} ${label}`,
          },
            h("strong", null, `${player.pos}·${rank ?? "—"}`),
            h("small", null, display),
          ),
          rank === null ? null : h("i", { className: "dh-compare-rank-side__fill", "aria-hidden": "true",
            style: { "--rank-length": barFraction },
          }),
          h("svg", {
            className: "dh-compare-rank-side__chevrons", viewBox: "0 0 14 14", "aria-hidden": "true",
          }, h("path", { d: slot === 0 ? "M7 2.5 2.5 7 7 11.5 M12.5 2.5 8 7 12.5 11.5" : "M1.5 2.5 6 7 1.5 11.5 M7 2.5 11.5 7 7 11.5" })),
        );
      }),
    );
  }

  function SeasonMatchupChart({ players, groups }) {
    const [selectedKey, setSelectedKey] = useState(groups[0]?.key);
    const selectedGroup = groups.find(({ key }) => key === selectedKey) || groups[0];
    const rows = useMemo(() => buildSeasonMetricRows(players, selectedGroup?.columns || []), [players, selectedGroup]);
    return h("section", { className: "dh-compare-season-panel dh-compare-matchups", "aria-labelledby": "dh-compare-matchups-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-matchups-title" }, "Stat matchups"),
        // Drop the Game Logs modifier to restore the original Stat Matchups switcher style.
        h("div", {
          className: "dh-compare-stat-segment dh-compare-stat-segment--gamelogs",
          role: "group", "aria-label": "Season stat group", "data-group-count": groups.length,
        },
          groups.map(({ key, label, icon }) => h("button", {
            type: "button", key, "aria-pressed": selectedGroup?.key === key,
            onClick: () => setSelectedKey(key), "aria-controls": "dh-compare-season-metrics",
          },
            h(TableHeaderIcon, { icon, className: "dh-compare-stat-segment__icon" }),
            h("span", null, STAT_MATCHUP_BUTTON_LABELS[key] ?? label),
          )),
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

  return function SeasonComparison({ players, season, weeks, matchupGroups, children }) {
    const palettes = useMemo(() => players.map((_, index) => getWeeklyPalette(players, index)), [players]);
    const groupKey = getComparisonPosition(players) || "overview";
    const groups = matchupGroups?.[groupKey] || matchupGroups?.overview || [];
    const colors = Object.fromEntries(palettes.flatMap((palette, index) => [
      [`--season-accent-${index}`, palette.high],
      [`--season-high-mid-${index}`, palette.highMid],
      [`--season-deep-${index}`, palette.low],
      [`--season-spectrum-${index}`, `linear-gradient(105deg, ${getWeeklyPaletteStops(palette).map(({ color, offset }) => `${color} ${offset * 100}%`).join(", ")})`],
    ]));
    return h("section", { className: "dh-compare-season", "aria-labelledby": "dh-compare-season-title", style: colors },
      h("header", { className: "dh-compare-section-heading dh-compare-season__heading" },
        h("h3", { id: "dh-compare-season-title" }, "Season comparison"),
        h("span", { className: "dh-compare-section-context" }, season),
      ),
      h(ScoringProfile, { players, palettes }),
      // Remount the switcher when the selected positions change categories,
      // so mixed pairs start on Overview Stats instead of a stale group.
      h(SeasonMatchupChart, { key: `${season}-${groupKey}`, players, groups }),
      h(ScoringSpread, { players, weeks }),
      children,
    );
  };
}
