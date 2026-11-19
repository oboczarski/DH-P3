import { getConsistencyDialTone } from "../datahub-gamelogs-controls.js?v=DH3.81-compare";
import { formatComparisonValue, formatRank, getPlayerName, getStatLabel, getWeeklyComparisonEdges, toFiniteNumber } from "./comparisonStats.js?v=DH3.81-compare";
import {
  buildWeeklyChartOption,
  getWeeklyChartLayout,
  getWeeklyPlayerAccentColor,
  getWeeklyWeekEntry,
} from "./comparisonChartOptions.js?v=DH3.81-compare";

export function createWeeklyComparison(React) {
  const { createElement: h, useLayoutEffect, useMemo, useRef, useState } = React;

  function ConsistencyCard({ player, index, color, edge, statKey }) {
    // Use the same season CSV stat as the modal's radar, independent of the
    // selected weekly metric. The Game Logs bands and CSS stops style the dial.
    const value = toFiniteNumber(player.seasonStats?.csty_pct);
    const rate = value !== null && value >= 0 && value <= 100 ? value : null;
    const progress = rate === null ? null : rate / 100;
    const label = getPlayerName(player);
    return h("article", { className: "dh-compare-consistency-card", style: { "--compare-player-color": color } },
      h("div", {
        className: "dh-compare-dial",
        style: { "--arc-end": `${(progress ?? 0) * 360}deg`, "--arc-mid": `${(progress ?? 0) * 180}deg` },
        "data-dial-tone": getConsistencyDialTone(progress),
        "data-has-progress": progress > 0,
        role: rate === null ? "img" : "meter",
        "aria-label": `${label} season consistency rate${rate === null ? " unavailable" : ""}`,
        "aria-valuemin": rate === null ? undefined : 0,
        "aria-valuemax": rate === null ? undefined : 100,
        "aria-valuenow": rate ?? undefined,
        "aria-valuetext": rate === null ? undefined : `${rate.toFixed(1)} percent`,
      },
        ...["glow", "arc", "echo", "origin", "cap"].map((part) => h("span", {
          key: part, className: `dh-compare-dial__${part}`, "aria-hidden": true,
        })),
        h("span", { className: "dh-compare-dial__core", "aria-hidden": true },
          h("strong", null, rate === null ? "—" : rate.toFixed(1), rate === null ? null : h("small", null, "%")),
          h("span", null, "CSTY"),
        ),
      ),
      h("div", { className: "dh-compare-consistency-card__details" },
        h("strong", { className: "dh-compare-consistency-card__name", title: label }, label),
        h("span", { className: "dh-compare-consistency-card__label" }, "Consistency rate"),
        h("span", { className: "dh-compare-series-key" },
          h("i", {
            className: `dh-compare-series-mark dh-compare-series-mark--${index}`,
            role: "img", "aria-label": index === 0 ? "Solid weekly line" : "Dashed weekly line",
          }),
          edge?.compared > 0
            ? h("span", {
              className: `dh-compare-weekly-edge is-${edge.status}`,
              title: `${label} led in ${edge.betterWeeks} of ${edge.compared} comparable ${getStatLabel(statKey)} weeks`,
              "aria-label": `${edge.betterWeeks} better weeks out of ${edge.compared}`,
            }, h("b", null, edge.betterWeeks), " better wks")
            : h("span", null, [player.pos, player.team].filter(Boolean).join(" · ")),
        ),
      ),
    );
  }

  function SharedWeeklyPlot({ players, statKey, weeks, thresholds, activeWeek, onWeekChange }) {
    const canvas = useRef(null);
    const chartRef = useRef(null);
    const [size, setSize] = useState(null);
    const engine = window.echarts;
    const layout = useMemo(() => size && getWeeklyChartLayout(size.width, size.height, weeks.length), [size, weeks.length]);
    const option = useMemo(
      () => layout && buildWeeklyChartOption({ players, statKey, weeks, thresholds, layout }),
      [layout, players, statKey, weeks, thresholds],
    );
    const hasValues = useMemo(
      () => players.some((player) => weeks.some((week) => getWeeklyWeekEntry(player, week, statKey).value !== null)),
      [players, statKey, weeks],
    );

    // One ECharts instance owns both lines. Observe the real plot dimensions
    // for label density and edge positions, and dispose it on Clear All/close.
    useLayoutEffect(() => {
      const element = canvas.current;
      if (!engine || !element) return;
      const chart = engine.init(element, null, { renderer: "svg" });
      chartRef.current = chart;
      const measure = () => {
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (width && height) {
          setSize((current) => current?.width === width && current?.height === height ? current : { width, height });
        }
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => {
        observer.disconnect();
        chart.dispose();
        chartRef.current = null;
      };
    }, [engine]);

    useLayoutEffect(() => {
      if (!option || !chartRef.current) return;
      chartRef.current.resize({ width: layout.width, height: layout.height, silent: true });
      chartRef.current.setOption(option, true);
    }, [layout, option]);

    const inspectPointer = (event) => {
      if (!layout || (event.type === "pointermove" && event.pointerType !== "mouse")) return;
      const position = event.clientX - event.currentTarget.getBoundingClientRect().left;
      const nextWeek = weeks[layout.indexAtX(position)];
      if (nextWeek !== activeWeek) onWeekChange(nextWeek);
    };
    const activeIndex = weeks.indexOf(activeWeek);

    return h("div", { className: "dh-compare-weekly-plot", onClick: inspectPointer, onPointerMove: inspectPointer },
      engine
        ? h("div", {
          ref: canvas, className: "dh-compare-weekly-plot__canvas", role: "img",
          "aria-label": `${getStatLabel(statKey)} for ${players.map(getPlayerName).join(" and ")}, Week ${weeks[0]} through Week ${weeks.at(-1)}. Use the week picker for exact values.`,
        })
        : h("p", { className: "dh-compare-weekly-plot__empty" }, "Chart unavailable. Choose a week below to see its values."),
      engine && !hasValues
        ? h("p", { className: "dh-compare-weekly-plot__empty" }, `No ${getStatLabel(statKey)} values recorded for these players.`)
        : null,
      engine && layout && activeIndex >= 0 && hasValues
        ? h("span", {
          "aria-hidden": true,
          className: "dh-compare-weekly-plot__cursor",
          style: { left: layout.xForIndex(activeIndex), top: layout.top, bottom: layout.bottom },
        })
        : null,
    );
  }

  function WeekReadout({ players, weeks, statKey, activeWeek, setActiveWeek }) {
    return h("div", { className: "dh-compare-week-readout" },
      h("label", { className: "dh-compare-week-readout__control" },
        h("span", null, "Inspect week"),
        h("select", { value: activeWeek, onChange: (event) => setActiveWeek(Number(event.target.value)) },
          weeks.map((week) => h("option", { key: week, value: week }, `Week ${week}`)),
        ),
      ),
      h("div", { className: "dh-compare-week-readout__values" },
        players.map((player, index) => {
          const { value, rank, status, opponent } = getWeeklyWeekEntry(player, activeWeek, statKey);
          return h("div", {
            key: player.id, className: "dh-compare-week-readout__player",
            style: { "--compare-player-color": getWeeklyPlayerAccentColor(players, index) },
          },
            h("i", { className: `dh-compare-series-mark dh-compare-series-mark--${index}`, "aria-hidden": true }),
            h("div", { className: "dh-compare-week-readout__player-info" },
              h("strong", { title: getPlayerName(player) }, getPlayerName(player)),
              h("span", null, opponent || player.team),
            ),
            h("div", { className: "dh-compare-week-readout__stat" },
              h("strong", null, status || (value === null ? "—" : formatComparisonValue(statKey, value, { compact: true }))),
              rank > 0 && value !== null ? h("span", null, formatRank(rank, player.pos)) : null,
            ),
          );
        }),
      ),
    );
  }

  return function WeeklyComparison({ players, statKey, weeks, thresholds }) {
    const [inspectedWeek, setInspectedWeek] = useState(null);
    const activeWeek = weeks.includes(inspectedWeek) ? inspectedWeek : weeks.at(-1);
    const edges = useMemo(() => getWeeklyComparisonEdges(players, statKey, weeks), [players, statKey, weeks]);
    return h("section", { className: "dh-compare-weekly", "aria-labelledby": "dh-compare-weekly-title" },
      h("header", { className: "dh-compare-section-heading" },
        h("h3", { id: "dh-compare-weekly-title" }, "Weekly comparison"),
        h("span", { className: "dh-compare-section-context" }, weeks.length > 1 ? `Weeks 1–${weeks.at(-1)}` : weeks.length ? "Week 1" : "No recorded weeks"),
      ),
      h("div", { className: "dh-compare-consistency" },
        players.map((player, index) => h(ConsistencyCard, {
          key: player.id, player, index, statKey,
          color: getWeeklyPlayerAccentColor(players, index),
          edge: edges.get(player.id),
        })),
      ),
      weeks.length
        ? h("div", { className: "dh-compare-weekly-card" },
          h(SharedWeeklyPlot, { players, statKey, weeks, thresholds, activeWeek, onWeekChange: setInspectedWeek }),
          h(WeekReadout, { players, weeks, statKey, activeWeek, setActiveWeek: setInspectedWeek }),
        )
        : h("p", { className: "dh-compare-no-data" }, "Weekly results will appear here once games are recorded."),
    );
  };
}
