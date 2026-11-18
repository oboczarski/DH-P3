import { formatComparisonValue, formatRank, getPlayerName, getStatLabel, toFiniteNumber } from "./comparisonStats.js";
import {
  SEASON_PLAYER_TONES, buildSeasonMetricRows, buildSeasonProductionMix,
  buildSeasonScatter, getConsistencyDial, getSeasonPlayerLabel,
} from "./comparisonSeason.js?v=DH3.78-compare-season";

// Page-local React sections: every displayed season value comes from the
// existing Compare payload. Charts use HTML/SVG and need no extra data loader.
export function createSeasonComparisonSections(React) {
  const { createElement: h, useMemo, useState } = React;
  const slots = [0, 1];
  const toneStyle = index => ({
    "--season-start": SEASON_PLAYER_TONES[index].start,
    "--season-mid": SEASON_PLAYER_TONES[index].mid,
    "--season-end": SEASON_PLAYER_TONES[index].end,
  });
  const number = value => value === null ? "—" : value.toLocaleString("en-US", { maximumFractionDigits: 1 });

  function SectionHeading({ index, title, subtitle, children }) {
    return h("header", { className: "dh-compare-section-heading" },
      h("div", { className: "dh-compare-section-heading__copy" },
        h("span", { className: "dh-compare-section-index", "aria-hidden": "true" }, index),
        h("div", null, h("h3", null, title), subtitle ? h("p", null, subtitle) : null),
      ), children,
    );
  }

  function SeasonLegend({ players }) {
    return h("div", { className: "dh-compare-season-legend", "aria-label": "Season chart players" },
      slots.map(index => h("span", { key: index, style: toneStyle(index), title: players[index] ? getPlayerName(players[index]) : "Choose a second player" },
        h("i", { "aria-hidden": "true" }), getSeasonPlayerLabel(players[index]),
      )),
    );
  }

  function SegmentControl({ label, value, options, onChange }) {
    return h("div", { className: "dh-compare-segment", role: "group", "aria-label": label },
      options.map(([key, text]) => h("button", {
        key, type: "button", "aria-pressed": String(value === key),
        className: value === key ? "is-active" : "", onClick: () => onChange(key),
      }, text)),
    );
  }

  function ConsistencyComparison({ players }) {
    return h("section", { className: "dh-compare-consistency", "aria-label": "Season consistency rates" },
      slots.map(index => {
        const player = players[index];
        const dial = getConsistencyDial(player?.seasonStats?.csty_pct);
        const games = toFiniteNumber(player?.seasonStats?.games_played);
        const rank = toFiniteNumber(player?.seasonPosRanks?.csty_pct);
        return h("article", {
          key: player?.id || "empty", className: "dh-compare-consistency-card",
          "data-consistency-player": player?.id || "empty", "data-dial-tone": dial.tone,
          style: { "--dial-accent": dial.accent, "--dial-start": dial.start,
            "--dial-mid": dial.mid, "--dial-end": dial.end, "--progress": dial.progress },
        },
          h("div", { className: "dh-compare-consistency-card__identity", title: player ? getPlayerName(player) : "Choose a second player" },
            player?.teamLogoSrc ? h("img", { src: player.teamLogoSrc, alt: "" }) : null,
            h("strong", null, player ? getSeasonPlayerLabel(player) : "Choose opponent"),
          ),
          // Research dial construction, with the Game Logs rate-driven colors:
          // tick rim, gradient arc/echo, endpoint, and recessed percentage core.
          h("div", {
            className: "dh-compare-consistency-dial", role: "img", "data-has-progress": String(dial.hasProgress),
            "aria-label": `${player ? getPlayerName(player) : "Player 2"} season consistency: ${dial.rate === null ? "unavailable" : `${dial.rate.toFixed(1)}%`}`,
          },
            ...["glow", "arc", "echo", "origin", "cap"].map(layer => h("span", {
              key: layer, className: `dh-compare-dial-${layer}`, "aria-hidden": "true",
            })),
            h("span", { className: "dh-compare-dial-core", "aria-hidden": "true" },
              h("strong", null, dial.rate === null ? "—" : number(dial.rate), dial.rate === null ? null : h("small", null, "%")),
              h("span", null, "Consistency"),
            ),
          ),
          h("div", { className: "dh-compare-consistency-card__meta" },
            h("span", null, rank !== null && rank > 0 ? `${player.pos} · ${formatRank(rank)}` : "Season rate"),
            h("span", null, games === null ? "— games" : `${games} ${games === 1 ? "game" : "games"}`),
          ),
        );
      }),
    );
  }

  function MetricDuel({ players }) {
    const [mode, setMode] = useState("production");
    const rows = useMemo(() => buildSeasonMetricRows(players, mode), [players, mode]);
    return h("section", { className: "dh-compare-season-panel dh-compare-metric-duel", "aria-label": "Season stat comparison", "data-season-chart": "metrics" },
      h(SectionHeading, { index: "01", title: "Stat by stat", subtitle: "Same metric. Side by side." },
        h(SegmentControl, { label: "Season stat category", value: mode, onChange: setMode,
          options: [["production", "Production"], ["efficiency", "Efficiency"]] }),
      ),
      h(SeasonLegend, { players }),
      h("div", { className: "dh-compare-duel-rows", "data-stat-category": mode }, rows.map(row => {
        const [a, b] = row.positions;
        const comparable = a !== null && b !== null;
        return h("div", { key: row.key, className: "dh-compare-duel-row", "data-season-stat": row.key },
          h("div", { className: "dh-compare-duel-row__values" },
            h("strong", { style: toneStyle(0), className: row.winner === 0 ? "is-leading" : "" }, formatComparisonValue(row.key, row.values[0])),
            h("span", null, row.label, row.lowerBetter ? h("small", { title: "Lower is better", "aria-label": "Lower is better" }, " ↓") : null),
            h("strong", { style: toneStyle(1), className: row.winner === 1 ? "is-leading" : "" }, formatComparisonValue(row.key, row.values[1])),
          ),
          h("div", { className: "dh-compare-duel-row__plot", role: "img",
            "aria-label": `${row.label}: ${slots.map(i => `${getSeasonPlayerLabel(players[i])} ${formatComparisonValue(row.key, row.values[i])}`).join(", ")}` },
            h("span", { className: "dh-compare-duel-track" }),
            h("span", { className: "dh-compare-duel-zero", style: { left: `${row.zero / 3}%` } }),
            comparable && a !== b ? h("span", { className: "dh-compare-duel-link", style: {
              left: `${Math.min(a, b) / 3}%`, width: `${Math.abs(a - b) / 3}%`,
              background: `linear-gradient(90deg, ${SEASON_PLAYER_TONES[a < b ? 0 : 1].mid}, ${SEASON_PLAYER_TONES[a < b ? 1 : 0].mid})`,
            } }) : null,
            slots.map(i => row.positions[i] === null ? null : h("span", {
              key: i, className: `dh-compare-duel-point dh-compare-duel-point--${i}`,
              style: { ...toneStyle(i), left: `${row.positions[i] / 3}%` },
            })),
          ),
        );
      })),
      h("p", { className: "dh-compare-chart-note" }, "Each row has its own scale. Highlighted values lead the comparison."),
    );
  }

  function ProductionMix({ players }) {
    const [mode, setMode] = useState("yards");
    const model = useMemo(() => buildSeasonProductionMix(players, mode), [players, mode]);
    return h("section", { className: "dh-compare-season-panel dh-compare-production-mix", "aria-label": "Season production breakdown", "data-season-chart": "mix" },
      h(SectionHeading, { index: "02", title: "Production mix", subtitle: "How each player builds their total." },
        h(SegmentControl, { label: "Production breakdown", value: mode, onChange: setMode,
          options: [["yards", "Yards"], ["touchdowns", "TDs"]] }),
      ),
      h("div", { className: "dh-compare-mix-rows" }, model.rows.map((row, index) => h("div", {
        key: row.player.id, className: "dh-compare-mix-row", style: toneStyle(index),
      },
        h("div", { className: "dh-compare-mix-row__heading" },
          h("strong", null, getSeasonPlayerLabel(row.player)),
          h("span", null, row.complete ? "" : "Known ", h("b", null, number(row.total)), mode === "yards" ? " yds" : " TDs"),
        ),
        h("div", { className: "dh-compare-mix-track", role: "img", "aria-label": row.parts.map(part => `${part.label}: ${number(part.value)}`).join(", ") },
          row.parts.map(part => h("span", {
            key: part.key, className: `dh-compare-mix-part is-${part.label.toLowerCase()}`,
            style: { width: `${Math.max(0, part.value ?? 0) / model.max * 100}%` },
            title: `${part.label}: ${number(part.value)}`,
          })),
        ),
      ))),
      h("table", { className: "dh-compare-mix-table" },
        h("caption", { className: "dh-compare-sr-only" }, `${mode === "yards" ? "Yards" : "Touchdowns"} by source`),
        h("thead", null, h("tr", null, h("th", { scope: "col" }, "Source"),
          ...slots.map(i => h("th", { key: i, scope: "col", style: toneStyle(i) }, getSeasonPlayerLabel(players[i]))))),
        h("tbody", null, model.components.map(([key, label]) => h("tr", { key },
          h("th", { scope: "row" }, h("i", { className: `is-${label.toLowerCase()}`, "aria-hidden": "true" }), label),
          ...slots.map(i => h("td", { key: i }, number(toFiniteNumber(players[i]?.seasonStats?.[key])))),
        ))),
      ),
      model.rows.some(row => !row.complete) ? h("p", { className: "dh-compare-chart-note" }, "Unavailable components stay blank; totals include known values only.") : null,
      model.rows.some(row => row.hasNegative) ? h("p", { className: "dh-compare-chart-note" }, "Bars show positive production. Net totals and source values include losses.") : null,
    );
  }

  function VolumeEfficiency({ players }) {
    const model = useMemo(() => buildSeasonScatter(players), [players]);
    // Sparse/zero-volume plots need fractional tick text to avoid repeating
    // the same rounded integer at two different axis positions.
    const xTickDecimals = model.xMax - model.xMin < 2 ? 1 : 0;
    const x = value => 42 + (value - model.xMin) / (model.xMax - model.xMin) * 288;
    const y = value => 176 - (value - model.yMin) / (model.yMax - model.yMin) * 146;
    // Place names independently from the true coordinates, keeping zero/tied
    // observations legible without moving data points or covering axis ticks.
    const plotted = model.visible.map(point => ({ ...point, px: x(point.x), py: y(point.y),
      labelX: Math.max(70, Math.min(290, x(point.x))),
      labelY: Math.max(30, Math.min(166, y(point.y) + (point.index === 0 ? -17 : 23))),
    }));
    if (plotted.length === 2 && Math.abs(plotted[0].labelX - plotted[1].labelX) < 110
      && Math.abs(plotted[0].labelY - plotted[1].labelY) < 18) {
      plotted[1].labelY = plotted[0].labelY > 140 ? plotted[0].labelY - 20 : plotted[0].labelY + 20;
    }
    return h("section", { className: "dh-compare-season-panel dh-compare-volume-efficiency", "aria-label": "Volume and efficiency comparison", "data-season-chart": "scatter" },
      h(SectionHeading, { index: "03", title: "Volume × efficiency", subtitle: `${model.xLabel} meets ${model.yLabel.toLowerCase()}.` }),
      h(SeasonLegend, { players }),
      h("svg", { className: "dh-compare-volume-plot", viewBox: "0 0 360 224", role: "img",
        "aria-label": `Season ${model.xLabel} versus ${model.yLabel}. ${model.points.map(p => `${getPlayerName(p.player)}: ${formatComparisonValue(model.xKey, p.x)}, ${formatComparisonValue(model.yKey, p.y)}`).join(". ")}` },
        h("defs", null,
          h("linearGradient", { id: "dh-compare-scatter-wash", x1: "0", y1: "1", x2: "1", y2: "0" },
            h("stop", { stopColor: "#edaa7d", stopOpacity: ".02" }),
            h("stop", { offset: "1", stopColor: "#a293ed", stopOpacity: ".18" })),
          ...slots.map(i => h("radialGradient", { key: i, id: `dh-compare-scatter-point-${i}` },
            h("stop", { stopColor: SEASON_PLAYER_TONES[i].start, stopOpacity: ".4" }),
            h("stop", { offset: "1", stopColor: SEASON_PLAYER_TONES[i].end, stopOpacity: "0" }))),
        ),
        h("rect", { x: 42, y: 20, width: 288, height: 156, rx: 8, fill: "url(#dh-compare-scatter-wash)" }),
        ...[0, .25, .5, .75, 1].map(t => h("g", { key: t },
          h("line", { x1: 42, y1: 176 - t * 146, x2: 330, y2: 176 - t * 146, className: "dh-compare-volume-grid" }),
          h("line", { x1: 42 + t * 288, y1: 20, x2: 42 + t * 288, y2: 176, className: "dh-compare-volume-grid" }),
          t === 0 || t === .5 || t === 1 ? h("text", { x: 35, y: 179 - t * 146, textAnchor: "end", className: "dh-compare-volume-tick" }, formatComparisonValue(model.yKey, model.yMin + t * (model.yMax - model.yMin), { compact: true })) : null,
          t === 0 || t === .5 || t === 1 ? h("text", { x: 42 + t * 288, y: 192, textAnchor: "middle", className: "dh-compare-volume-tick" }, formatComparisonValue(model.xKey, model.xMin + t * (model.xMax - model.xMin), { compact: true, decimals: xTickDecimals })) : null,
        )),
        h("text", { x: 42, y: 11, className: "dh-compare-volume-axis" }, model.yLabel),
        h("text", { x: 186, y: 216, textAnchor: "middle", className: "dh-compare-volume-axis" }, model.xLabel),
        ...plotted.map(point => {
          const { px, py } = point, colors = SEASON_PLAYER_TONES[point.index];
          return h("g", { key: point.player.id },
            h("title", null, `${getPlayerName(point.player)}: ${model.xLabel} ${formatComparisonValue(model.xKey, point.x)}, ${model.yLabel} ${formatComparisonValue(model.yKey, point.y)}`),
            h("line", { x1: px, y1: py, x2: px, y2: 176, className: "dh-compare-volume-guide", stroke: colors.mid }),
            h("line", { x1: 42, y1: py, x2: px, y2: py, className: "dh-compare-volume-guide", stroke: colors.mid }),
            h("circle", { cx: px, cy: py, r: 25, fill: `url(#dh-compare-scatter-point-${point.index})` }),
            h("circle", { cx: px, cy: py, r: point.index === 0 ? 8 : 5, fill: point.index === 0 ? "#171b2d" : colors.start, stroke: colors.mid, strokeWidth: 2 }),
            h("text", { x: point.labelX, y: point.labelY, textAnchor: "middle", fill: colors.start, className: "dh-compare-volume-name" }, getSeasonPlayerLabel(point.player)),
          );
        }),
        !model.visible.length ? h("text", { x: 186, y: 102, textAnchor: "middle", className: "dh-compare-volume-axis" }, "No recorded values for these metrics") : null,
      ),
      h("div", { className: "dh-compare-volume-readout" }, slots.map(i => h("div", { key: i, style: toneStyle(i) },
        ...[[model.xKey, model.points[i]?.x], [model.yKey, model.points[i]?.y]].map(([key, value]) => h("span", { key },
          h("span", null, getStatLabel(key)), h("strong", null, formatComparisonValue(key, value)),
        )),
      ))),
      h("p", { className: "dh-compare-chart-note" }, model.visible.length < players.length ? "A player needs both season metrics to appear on this plot." : "Further right means more volume; higher means a higher rate."),
    );
  }

  function SeasonComparisonSections({ players, season }) {
    return h("section", { className: "dh-compare-season", "aria-label": "Season comparisons" },
      h("div", { className: "dh-compare-season-heading" },
        h("span", null, `${season || ""} SEASON`), h("h2", null, "The season, side by side"),
      ),
      h("div", { className: "dh-compare-season-grid" },
        h(MetricDuel, { players }), h(ProductionMix, { players }), h(VolumeEfficiency, { players }),
      ),
    );
  }
  return { ConsistencyComparison, SeasonComparisonSections };
}
