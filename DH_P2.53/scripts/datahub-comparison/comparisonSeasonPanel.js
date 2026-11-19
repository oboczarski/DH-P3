import {
  formatComparisonValue,
  formatRank,
  getComparisonPositions,
  getPlayerName,
  getStatDefinition,
  isLowerBetterForPosition,
  toFiniteNumber,
} from "./comparisonStats.js?v=DH3.81-compare";

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
  const low = Math.min(0, ...scores);
  const high = Math.max(0, ...scores);
  const step = Math.max(5, Math.ceil((high - low) / 25) * 5);
  const min = Math.floor(low / step) * step;
  const max = Math.max(min + step, Math.ceil(high / step) * step);
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step);
  return { rows, ticks, fraction: (value) => (value - min) / (max - min), hasScores: scores.length > 0 };
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

export function createSeasonComparison(React) {
  const { createElement: h, useMemo, useState } = React;

  function ScoringProfile({ players }) {
    const { rows, ticks, fraction, hasScores } = useMemo(() => buildScoringProfile(players), [players]);
    const zero = fraction(0);
    const column = (className, value) => value === null ? null : h("span", {
      className,
      style: {
        "--column-base": `${Math.min(zero, fraction(value)) * 100}%`,
        "--column-height": `${Math.abs(fraction(value) - zero) * 100}%`,
      },
    });
    return h("article", { className: "dh-compare-season-panel dh-compare-scoring", "aria-labelledby": "dh-compare-scoring-title" },
      h("header", { className: "dh-compare-season-panel__header" },
        h("h4", { id: "dh-compare-scoring-title" }, "Scoring profile"),
        h("span", { className: "dh-compare-season-panel__unit" }, "PPR points"),
      ),
      hasScores
        ? h("div", { className: "dh-compare-scoring__plot", "aria-hidden": true },
          h("div", { className: "dh-compare-scoring__grid" },
            ticks.map((tick) => h("span", {
              key: tick, className: tick === 0 ? "is-zero" : undefined, style: { bottom: `${fraction(tick) * 100}%` },
            }, h("span", null, tick))),
          ),
          h("div", { className: "dh-compare-scoring__columns" },
            rows.map(({ player, ppg, ceiling }, index) => h("div", {
              className: "dh-compare-scoring__lane", key: player.id, "data-season-slot": index,
            },
              column("dh-compare-scoring__column dh-compare-scoring__column--ceiling", ceiling),
              column("dh-compare-scoring__column dh-compare-scoring__column--average", ppg),
              ppg === null ? null : h("i", { className: "dh-compare-scoring__mean", style: { bottom: `${fraction(ppg) * 100}%` } }),
              ceiling === null ? null : h("i", { className: "dh-compare-scoring__peak", style: { bottom: `${fraction(ceiling) * 100}%` } }),
            )),
          ),
        )
        : h("p", { className: "dh-compare-no-data" }, "Scoring rates are unavailable."),
      h("div", { className: "dh-compare-scoring__readouts" },
        rows.map(({ player, ppg, ceiling, fpts, games }, index) => h("div", {
          key: player.id, className: "dh-compare-scoring__readout", "data-season-slot": index,
        },
          h("strong", { className: "dh-compare-season-name", title: getPlayerName(player) }, h("i"), getPlayerName(player)),
          h("dl", null,
            h("div", null, h("dt", null, h("i", { className: "dh-compare-scoring__mean-key", "aria-hidden": true }), "PPG"), h("dd", null, formatMetric("ppg", ppg))),
            h("div", null, h("dt", null, h("i", { className: "dh-compare-scoring__peak-key", "aria-hidden": true }), "Ceiling"), h("dd", null, formatMetric("ceiling", ceiling))),
            h("div", null, h("dt", null, "FPTS"), h("dd", null, formatMetric("fpts", fpts))),
            h("div", null, h("dt", null, "Games"), h("dd", null, formatMetric("games_played", games))),
          ),
        )),
      ),
      h("p", { className: "dh-compare-season-note" }, "Ceiling is the average of the player’s best three games."),
    );
  }

  function SeasonMatchupChart({ players }) {
    const [mode, setMode] = useState("production");
    const rows = useMemo(() => buildSeasonMetricRows(players, mode), [players, mode]);
    return h("article", { className: "dh-compare-season-panel dh-compare-matchups", "aria-labelledby": "dh-compare-matchups-title" },
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
        players.map((player, index) => h("strong", {
          key: player.id, className: "dh-compare-season-name", "data-season-slot": index, title: getPlayerName(player),
        }, h("i"), getPlayerName(player))),
      ),
      h("div", { id: "dh-compare-season-metrics", className: "dh-compare-matchups__rows" },
        rows.length ? rows.map((row) => {
          const gap = formatGap(row);
          const leader = row.winner === null ? null : getPlayerName(players[row.winner]);
          const gapLabel = leader && !gap.startsWith("<") ? `${row.lowerBetter ? "−" : "+"}${gap}` : gap;
          const renderValue = (index) => {
            const player = players[index];
            if (!player) return null;
            const value = row.values[index];
            const rank = player.seasonPosRanks?.[row.key];
            return h("div", { className: "dh-compare-matchups__value", "data-season-slot": index },
              h("strong", null, formatMetric(row.key, value)),
              Number.isFinite(rank) && rank > 0 && value !== null ? h("span", null, formatRank(rank, player.pos)) : null,
            );
          };

          return h("div", { key: row.key, className: "dh-compare-matchup-row" },
            h("div", { className: "dh-compare-matchup-row__header" },
              renderValue(0),
              h("div", { className: "dh-compare-matchup-row__label" },
                h("strong", null, row.label),
                h("div", { className: "dh-compare-matchup-row__detail" },
                  row.lowerBetter ? h("span", { title: "Lower is better", "aria-label": "Lower is better" }, "↓") : null,
                  gap ? h("span", {
                    className: "dh-compare-matchup-row__gap", "data-season-slot": row.winner ?? undefined,
                    title: leader ? `${leader} leads by ${gap}` : "Tied",
                  }, leader ? [h("i", { key: "marker", "aria-hidden": true }), gapLabel] : gapLabel) : null,
                ),
              ),
              renderValue(1),
            ),
            h("div", {
              className: "dh-compare-matchup-row__tracks", "aria-hidden": true, style: { "--track-zero": `${row.zero * 100}%` },
            },
              row.ends.map((end, index) => h("div", {
                key: players[index].id, className: "dh-compare-matchup-row__track", "data-season-slot": index,
              },
                end === null ? null : h("i", {
                  style: {
                    "--track-start": `${Math.min(row.zero, end) * 100}%`,
                    "--track-fill": `${Math.abs(end - row.zero) * 100}%`,
                    "--track-end": `${end * 100}%`,
                  },
                }),
              )),
            ),
          );
        }) : h("p", { className: "dh-compare-no-data" }, "No season values are available for these stats."),
      ),
    );
  }

  return function SeasonComparison({ players, season, children }) {
    return h("section", { className: "dh-compare-season", "aria-labelledby": "dh-compare-season-title" },
      h("header", { className: "dh-compare-section-heading dh-compare-season__heading" },
        h("h3", { id: "dh-compare-season-title" }, "Season comparison"),
        h("span", { className: "dh-compare-section-context" }, season),
      ),
      h("div", { className: "dh-compare-season__grid" },
        h(ScoringProfile, { players }),
        h(SeasonMatchupChart, { players }),
      ),
      children,
    );
  };
}
