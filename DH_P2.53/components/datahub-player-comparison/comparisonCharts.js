import React from "https://cdn.jsdelivr.net/npm/react@18.3.1/+esm";
import { formatStatValue, getPlayerColor } from "./comparisonData.js";

const h = React.createElement;

function isFinitePoint(point) {
  return Number.isFinite(point?.value);
}

function formatAxisValue(value) {
  if (!Number.isFinite(value)) {
    return "";
  }
  if (Math.abs(value) >= 100) {
    return value.toFixed(0);
  }
  return value.toFixed(1);
}

function buildPath(points) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

function buildSegments(points) {
  const segments = [];
  let segment = [];
  points.forEach((point) => {
    if (point) {
      segment.push(point);
      return;
    }
    if (segment.length) {
      segments.push(segment);
      segment = [];
    }
  });
  if (segment.length) {
    segments.push(segment);
  }
  return segments;
}

function getLastPoint(points) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    if (points[index]) {
      return points[index];
    }
  }
  return null;
}

export function WeeklyLineChart({ weeklySeries, statLabel }) {
  const axisWeeks = weeklySeries?.[0]?.points?.map((point) => point.week) || [];
  const numericValues = (weeklySeries || [])
    .flatMap((series) => series.points || [])
    .map((point) => point.value)
    .filter(Number.isFinite);

  if (!axisWeeks.length || !numericValues.length) {
    return h(
      "div",
      { className: "datahub-player-comparison-empty" },
      h("span", null, "No weekly data for the selected players."),
    );
  }

  const width = 760;
  const height = 330;
  const margin = { top: 34, right: 38, bottom: 44, left: 44 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const minValue = Math.min(0, ...numericValues);
  const maxValue = Math.max(1, ...numericValues);
  const range = maxValue === minValue ? 1 : maxValue - minValue;
  const zeroY = margin.top + plotHeight - (((0 - minValue) / range) * plotHeight);
  const yScale = (value) => margin.top + plotHeight - (((value - minValue) / range) * plotHeight);
  const xScale = (index) => {
    if (axisWeeks.length === 1) {
      return margin.left + plotWidth / 2;
    }
    return margin.left + (plotWidth * (index / (axisWeeks.length - 1)));
  };
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = maxValue - (range * ratio);
    return {
      value,
      y: yScale(value),
    };
  });

  return h(
    "div",
    { className: "datahub-player-comparison-weekly" },
    h(
      "svg",
      {
        className: "datahub-player-comparison-weekly__svg",
        viewBox: `0 0 ${width} ${height}`,
        role: "img",
        "aria-label": `Weekly ${statLabel} comparison chart`,
      },
      h(
        "defs",
        null,
        weeklySeries.map((series, index) =>
          h(
            "linearGradient",
            {
              key: `gradient-${series.player.id}`,
              id: `comparison-area-${series.player.id}`,
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1",
            },
            h("stop", { offset: "0%", stopColor: series.color, stopOpacity: "0.34" }),
            h("stop", { offset: "100%", stopColor: getPlayerColor(index), stopOpacity: "0" }),
          ),
        ),
      ),
      yTicks.map((tick) =>
        h(
          React.Fragment,
          { key: `tick-${tick.value}` },
          h("line", {
            className: "datahub-player-comparison-weekly__grid",
            x1: margin.left,
            x2: width - margin.right,
            y1: tick.y,
            y2: tick.y,
          }),
          h(
            "text",
            {
              className: "datahub-player-comparison-weekly__axis-label",
              x: margin.left - 12,
              y: tick.y + 4,
              textAnchor: "end",
            },
            formatAxisValue(tick.value),
          ),
        ),
      ),
      h("line", {
        className: "datahub-player-comparison-weekly__zero",
        x1: margin.left,
        x2: width - margin.right,
        y1: zeroY,
        y2: zeroY,
      }),
      axisWeeks.map((week, index) =>
        h(
          "text",
          {
            key: `week-${week}`,
            className: "datahub-player-comparison-weekly__week",
            x: xScale(index),
            y: height - 14,
            textAnchor: "middle",
          },
          `W${week}`,
        ),
      ),
      weeklySeries.map((series) => {
        const transformedPoints = series.points.map((point, index) => {
          if (!isFinitePoint(point)) {
            return null;
          }
          return {
            ...point,
            x: xScale(index),
            y: yScale(point.value),
          };
        });
        const segments = buildSegments(transformedPoints);
        const lastPoint = getLastPoint(transformedPoints);

        return h(
          "g",
          {
            key: series.player.id,
            className: "datahub-player-comparison-weekly__series",
            style: { "--series-color": series.color },
          },
          segments.map((segment, segmentIndex) => {
            const path = buildPath(segment);
            const areaPath = segment.length > 1
              ? `${path} L ${segment[segment.length - 1].x.toFixed(2)} ${zeroY.toFixed(2)} L ${segment[0].x.toFixed(2)} ${zeroY.toFixed(2)} Z`
              : "";
            return h(
              React.Fragment,
              { key: `${series.player.id}-${segmentIndex}` },
              areaPath
                ? h("path", {
                    className: "datahub-player-comparison-weekly__area",
                    d: areaPath,
                    fill: `url(#comparison-area-${series.player.id})`,
                  })
                : null,
              h("path", {
                className: "datahub-player-comparison-weekly__line",
                d: path,
                fill: "none",
                stroke: series.color,
              }),
            );
          }),
          transformedPoints.map((point) => {
            if (!point) {
              return null;
            }
            const titleParts = [
              `${series.player.name} WK${point.week}: ${point.value.toFixed(1)} ${statLabel}`,
            ];
            if (point.opponent) titleParts.push(point.opponent);
            if (point.injury && point.injury !== "·") titleParts.push(point.injury);
            return h(
              "circle",
              {
                key: `${series.player.id}-${point.week}`,
                className: "datahub-player-comparison-weekly__point",
                cx: point.x,
                cy: point.y,
                r: 4.5,
                fill: series.color,
              },
              h("title", null, titleParts.join(" | ")),
            );
          }),
          lastPoint
            ? h(
                "text",
                {
                  className: "datahub-player-comparison-weekly__last-value",
                  x: lastPoint.x + (lastPoint.x > width - 120 ? -9 : 9),
                  y: lastPoint.y - 8,
                  textAnchor: lastPoint.x > width - 120 ? "end" : "start",
                  fill: series.color,
                },
                lastPoint.value.toFixed(1),
              )
            : null,
        );
      }),
    ),
    h(
      "div",
      { className: "datahub-player-comparison-legend", "aria-label": "Compared players" },
      weeklySeries.map((series) =>
        h(
          "span",
          {
            key: series.player.id,
            className: "datahub-player-comparison-legend__item",
            style: { "--series-color": series.color },
          },
          h("span", { className: "datahub-player-comparison-legend__dot" }),
          h("span", null, series.player.name),
          h("span", { className: "datahub-player-comparison-legend__meta" }, series.player.pos),
        ),
      ),
    ),
  );
}

export function SeasonMultiStatChart({ metrics, selectedPlayers }) {
  if (!selectedPlayers?.length) {
    return h(
      "div",
      { className: "datahub-player-comparison-empty" },
      h("span", null, "Select players to compare season metrics."),
    );
  }

  return h(
    "div",
    { className: "datahub-player-comparison-season", role: "img", "aria-label": "Season multi-stat comparison chart" },
    metrics.map((metric) =>
      h(
        "section",
        { key: metric.key, className: "datahub-player-comparison-season__row" },
        h(
          "div",
          { className: "datahub-player-comparison-season__metric" },
          h("span", { className: "datahub-player-comparison-season__metric-label" }, metric.label),
        ),
        h(
          "div",
          { className: "datahub-player-comparison-season__bars" },
          metric.values.map((entry, index) => {
            const color = getPlayerColor(index);
            const rankLabel = Number.isFinite(entry.rank) ? `#${Math.round(entry.rank)}` : "";
            return h(
              "div",
              {
                key: `${metric.key}-${entry.player.id}`,
                className: `datahub-player-comparison-season__bar-row${entry.isNegative ? " is-negative" : ""}`,
                style: {
                  "--series-color": color,
                  "--bar-pct": `${entry.percent}%`,
                },
              },
              h(
                "span",
                { className: "datahub-player-comparison-season__player" },
                entry.player.name,
              ),
              h(
                "span",
                { className: "datahub-player-comparison-season__track" },
                h("span", { className: "datahub-player-comparison-season__bar" }),
              ),
              h(
                "span",
                { className: "datahub-player-comparison-season__value" },
                entry.displayValue || formatStatValue(entry.value, metric),
                rankLabel ? h("span", { className: "datahub-player-comparison-season__rank" }, rankLabel) : null,
              ),
            );
          }),
        ),
      ),
    ),
  );
}
