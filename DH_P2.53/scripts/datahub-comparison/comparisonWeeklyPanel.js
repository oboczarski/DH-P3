import { getConsistencyDialTone } from "../datahub-gamelogs-controls.js?v=DH3.81-compare";
import { formatComparisonValue, formatRank, getPlayerName, getStatLabel, getWeeklyComparisonEdges, toFiniteNumber } from "./comparisonStats.js?v=DH3.87-compare-groups";
import {
  buildWeeklyChart,
  getWeeklyPlayerAccentColor,
  getWeeklyWeekEntry,
} from "./comparisonChartOptions.js?v=DH3.89-compare-weekly-alignment";

function placeWeeklyLabels(chart, layer, labels, layout, activeWeek) {
  const grid = { top: 2, bottom: layout.height - layout.bottom };
  // Start/Sit's chips are HTML anchored to the renderer's data coordinates.
  // Fit their actual boxes here so a long season keeps its full-width plot,
  // with the inspected week and endpoints taking priority when space is tight.
  const measured = labels.map((label, index) => {
    const node = layer.children[index];
    return { ...label, node, width: node.offsetWidth, height: node.offsetHeight };
  });
  const priority = (item) => item.week === activeWeek ? 3 : item.atEdge ? 2 : item.status ? 0 : 1;
  const occupied = [];
  measured.sort((a, b) => priority(b) - priority(a)).forEach((item) => {
    const target = item.status
      ? [layout.xForIndex(item.weekIndex), grid.bottom - 6 - item.side * 12]
      : chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [`wk${item.week}`, item.value]);
    if (!target?.every(Number.isFinite)) {
      item.node.dataset.visible = "false";
      return;
    }
    // The measured plot insets already give the endpoint chips enough room.
    // Center each chip on the same x coordinate as its point and week tick.
    const left = Math.max(2, Math.min(layout.width - item.width - 2, target[0] - item.width / 2));
    const positions = item.status ? [target[1] - item.height] : [
      target[1] - item.height - 5, target[1] + 5,
    ];
    if (item.below) positions.reverse();
    // Tied endpoint values near the plot's ceiling or floor can stack on the
    // same side of the point while keeping each chip horizontally aligned.
    if (item.atEdge && !item.status) positions.push(target[1] - 2 * item.height - 8, target[1] + item.height + 8);
    const top = positions.find((y) => Number.isFinite(y) && y >= grid.top && y + item.height <= grid.bottom
      && occupied.every((box) => left + item.width + 2 < box.left || left > box.right + 2
        || y + item.height + 1 < box.top || y > box.bottom + 1));
    item.node.dataset.visible = String(top !== undefined);
    if (top !== undefined) {
      item.node.style.left = `${left}px`;
      item.node.style.top = `${top}px`;
      occupied.push({ left, right: left + item.width, top, bottom: top + item.height });
    }
  });
}

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
    const labelLayer = useRef(null);
    const [size, setSize] = useState(null);
    const engine = window.echarts;
    const chartConfig = useMemo(
      () => engine && size && buildWeeklyChart({
        players, statKey, weeks, thresholds, size,
        measureText: (text, font) => engine.format.getTextRect(text, font).width,
      }),
      [engine, size, players, statKey, weeks, thresholds],
    );
    const { layout, option } = chartConfig || {};
    const hasValues = useMemo(
      () => players.some((player) => weeks.some((week) => getWeeklyWeekEntry(player, week, statKey).value !== null)),
      [players, statKey, weeks],
    );
    const labels = useMemo(() => weeks.flatMap((week, weekIndex) => {
      const pair = players.map((player) => getWeeklyWeekEntry(player, week, statKey));
      return pair.flatMap(({ value, status }, side) => value === null && !status ? [] : [{
        value, status, side, week, weekIndex,
        atEdge: weekIndex === 0 || weekIndex === weeks.length - 1,
        otherValue: pair[1 - side]?.value,
        text: status || formatComparisonValue(statKey, value, { compact: true }),
      }]);
    }), [weeks, players, statKey]);

    // One ECharts instance owns both lines and is disposed on Clear All/close.
    useLayoutEffect(() => {
      const element = canvas.current;
      if (!engine || !element) return;
      const chart = engine.init(element, null, { renderer: "svg" });
      chartRef.current = chart;
      return () => {
        chart.dispose();
        chartRef.current = null;
      };
    }, [engine]);

    // Measure the HTML endpoint chips before drawing the plot. Repeat on a
    // resize or font load so both the chip and its week tick stay centered.
    useLayoutEffect(() => {
      const element = canvas.current;
      const layer = labelLayer.current;
      if (!element || !layer) return;
      const measure = (fontSettled = false) => {
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (!width || !height) return;
        let firstChipWidth = 0;
        let lastChipWidth = 0;
        labels.forEach((label, index) => {
          if (!label.atEdge) return;
          const chipWidth = layer.children[index].offsetWidth;
          if (label.weekIndex === 0) firstChipWidth = Math.max(firstChipWidth, chipWidth);
          else lastChipWidth = Math.max(lastChipWidth, chipWidth);
        });
        setSize((current) => !fontSettled && current?.width === width && current.height === height
          && current.firstChipWidth === firstChipWidth && current.lastChipWidth === lastChipWidth
          ? current : { width, height, firstChipWidth, lastChipWidth });
      };
      measure();
      const observer = new ResizeObserver(() => measure());
      observer.observe(element);
      let current = true;
      if (document.fonts?.status === "loading") document.fonts.ready.then(() => { if (current) measure(true); });
      return () => {
        current = false;
        observer.disconnect();
      };
    }, [engine, labels]);

    useLayoutEffect(() => {
      if (!option || !chartRef.current) return;
      chartRef.current.resize({ width: layout.width, height: layout.height, silent: true });
      chartRef.current.setOption(option, true);
    }, [layout, option]);

    useLayoutEffect(() => {
      const chart = chartRef.current;
      if (!chart || !layout || !labelLayer.current) return;
      const layer = labelLayer.current;
      const inverse = option.yAxis.inverse;
      const entries = labels.map((label) => ({
        ...label,
        below: Number.isFinite(label.otherValue) && (label.value === label.otherValue
          ? label.side === 1
          : inverse ? label.value > label.otherValue : label.value < label.otherValue),
      }));
      placeWeeklyLabels(chart, layer, entries, layout, activeWeek);
    }, [layout, option, labels, activeWeek]);

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
      // Keep these as measurable HTML chips. The slot hooks let CSS style
      // the two players independently while JS supplies the line colors.
      engine ? h("div", {
        className: "dh-compare-weekly-labels", ref: labelLayer, "aria-hidden": "true",
        style: Object.fromEntries(players.map((_, slot) => [
          `--weekly-label-ink-${slot}`, getWeeklyPlayerAccentColor(players, slot),
        ])),
      },
        labels.map(({ week, side, status, text }) => h("span", {
          key: `${week}-${side}`, className: `dh-compare-weekly-label${status ? " is-status" : ""}`,
          "data-weekly-label-side": side,
        }, text)),
      ) : null,
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
