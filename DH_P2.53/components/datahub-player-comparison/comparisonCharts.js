import React, { useEffect, useRef } from "https://cdn.jsdelivr.net/npm/react@18.3.1/+esm";
import { formatStatValue } from "./comparisonData.js";

const h = React.createElement;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getEchartsApi() {
  return window.echarts || null;
}

function dataHubAlpha(echartsApi, color, amount) {
  if (echartsApi?.color?.modifyAlpha) {
    return echartsApi.color.modifyAlpha(color, amount);
  }
  return color;
}

function getViewportFlags() {
  return {
    isMobile: window.matchMedia?.("(max-width: 640px)")?.matches || false,
    isTablet: window.matchMedia?.("(max-width: 900px)")?.matches || false,
  };
}

function createResizeWatcher(element, chart) {
  if (!element || !chart) {
    return () => {};
  }
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(element);
    return () => observer.disconnect();
  }
  const handleResize = () => chart.resize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}

function buildWeeklyOption(chartData, echartsApi) {
  const { isMobile, isTablet } = getViewportFlags();
  const axis = chartData.axis || { min: 0, max: 1, inverse: false };
  const visualMap = chartData.series.map((series, seriesIndex) => ({
    type: "piecewise",
    show: false,
    seriesIndex,
    dimension: 1,
    pieces: series.visualPieces || [{ color: series.color }],
    outOfRange: { color: series.color },
  }));

  return {
    animation: true,
    animationDuration: 360,
    backgroundColor: "transparent",
    color: chartData.series.map((series) => series.color),
    grid: {
      top: isMobile ? 34 : 38,
      right: isMobile ? 16 : 30,
      bottom: isMobile ? 42 : 48,
      left: isMobile ? 34 : 50,
      containLabel: true,
    },
    visualMap,
    tooltip: {
      trigger: "axis",
      confine: true,
      appendToBody: false,
      borderWidth: 1,
      borderColor: "rgba(190,216,255,0.18)",
      backgroundColor: "rgba(5,10,18,0.96)",
      textStyle: {
        color: "rgba(240,247,255,0.95)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
      },
      axisPointer: {
        type: "line",
        lineStyle: { color: "rgba(151, 221, 255, 0.22)", width: 1 },
      },
      formatter(params) {
        const rows = (params || [])
          .filter((param) => Number.isFinite(param?.data?.realValue))
          .map((param) => {
            const data = param.data || {};
            const meta = [
              data.rankLabel || "",
              data.opponent ? `vs ${data.opponent}` : "",
              data.injury && data.injury !== "NA" ? data.injury : "",
            ].filter(Boolean).join(" | ");
            return `
              <div class="datahub-player-comparison-tooltip-row">
                <span class="datahub-player-comparison-tooltip-dot" style="background:${escapeHtml(param.color)}"></span>
                <span class="datahub-player-comparison-tooltip-name">${escapeHtml(param.seriesName)}</span>
                <strong>${escapeHtml(formatStatValue(data.realValue, { key: chartData.statKey }))}</strong>
                <small>${escapeHtml(meta)}</small>
              </div>
            `;
          })
          .join("");
        const week = params?.[0]?.axisValue || "";
        return `<div class="datahub-player-comparison-tooltip"><b>${escapeHtml(String(week).toUpperCase())}</b>${rows}</div>`;
      },
    },
    xAxis: {
      type: "category",
      data: chartData.weekLabels,
      boundaryGap: false,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "rgba(185, 205, 238, 0.18)" } },
      axisLabel: {
        interval: 0,
        margin: isMobile ? 10 : 12,
        color: "rgba(187, 205, 233, 0.68)",
        fontSize: isMobile ? 9 : 11,
        fontWeight: 700,
        fontFamily: "Product Sans, Google Sans, sans-serif",
      },
    },
    yAxis: {
      type: "value",
      min: axis.min,
      max: axis.max,
      inverse: Boolean(axis.inverse),
      scale: true,
      splitNumber: isMobile ? 4 : 5,
      axisLabel: {
        color: "rgba(187, 205, 233, 0.68)",
        fontSize: isMobile ? 10 : 11,
        fontWeight: 700,
        fontFamily: "Product Sans, Google Sans, sans-serif",
        formatter(value) {
          if (Math.abs(value) >= 100) return Number(value).toFixed(0);
          if (Math.abs(value) >= 10) return Number(value).toFixed(1);
          return Number(value).toFixed(2).replace(/0$/, "").replace(/\\.0$/, "");
        },
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "rgba(204, 222, 255, 0.09)" } },
    },
    series: chartData.series.map((series, seriesIndex) => {
      const areaColor = new echartsApi.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: dataHubAlpha(echartsApi, series.color, isMobile ? 0.2 : 0.26) },
        { offset: 1, color: dataHubAlpha(echartsApi, series.color, 0.02) },
      ]);
      return {
        name: series.player.name,
        type: "line",
        smooth: 0.36,
        connectNulls: false,
        showSymbol: true,
        symbolSize: isMobile ? 17 : 22,
        z: 8 + seriesIndex,
        lineStyle: {
          width: isMobile ? 2.7 : 3.4,
          shadowColor: dataHubAlpha(echartsApi, series.color, 0.36),
          shadowBlur: 10,
        },
        areaStyle: {
          color: areaColor,
          opacity: isTablet ? 0.18 : 0.28,
        },
        emphasis: {
          focus: "series",
          lineStyle: { width: isMobile ? 3.2 : 4.1 },
        },
        label: {
          show: true,
          position: "top",
          distance: isMobile ? 5 : 8,
          color: "rgba(248, 252, 255, 0.96)",
          fontSize: isMobile ? 9 : 11,
          fontWeight: 850,
          fontFamily: "Product Sans, Google Sans, sans-serif",
          textBorderColor: "rgba(2, 7, 13, 0.94)",
          textBorderWidth: isMobile ? 2 : 3,
          formatter(param) {
            return param?.data?.labelText || "";
          },
        },
        labelLayout: {
          hideOverlap: true,
          moveOverlap: "shiftY",
        },
        data: series.data.map((point) => {
          const value = Number.isFinite(point.plotValue) ? point.plotValue : null;
          return {
            value: [point.weekLabel, value],
            realValue: point.realValue,
            rank: point.rank,
            rankLabel: point.rankLabel,
            labelText: Number.isFinite(point.realValue) ? point.label : "",
            opponent: point.opponent,
            injury: point.injury,
            projection: point.projection,
            symbol: point.logoSrc ? `image://${point.logoSrc}` : "circle",
            symbolSize: point.logoSrc ? (isMobile ? 18 : 24) : (isMobile ? 7 : 9),
            itemStyle: {
              color: point.color || series.color,
              borderColor: "rgba(2, 7, 13, 0.95)",
              borderWidth: point.logoSrc ? 0 : 2,
              shadowColor: dataHubAlpha(echartsApi, point.color || series.color, 0.42),
              shadowBlur: 8,
            },
          };
        }),
      };
    }),
  };
}

function buildRadarOption(radarData, echartsApi) {
  const { isMobile } = getViewportFlags();
  return {
    animation: true,
    animationDuration: 360,
    backgroundColor: "transparent",
    color: radarData.players.map((entry) => entry.color),
    tooltip: {
      trigger: "item",
      confine: true,
      borderWidth: 1,
      borderColor: "rgba(190,216,255,0.18)",
      backgroundColor: "rgba(5,10,18,0.96)",
      textStyle: {
        color: "rgba(240,247,255,0.95)",
        fontFamily: "Product Sans, Google Sans, sans-serif",
      },
      formatter(param) {
        const data = param.data || {};
        const rows = (data.metrics || [])
          .map((metric) => `
            <div class="datahub-player-comparison-tooltip-row">
              <span>${escapeHtml(metric.label)}</span>
              <strong>${escapeHtml(metric.rank ? `${data.position}·${Math.round(metric.rank)}` : "NA")}</strong>
              <small>${escapeHtml(metric.displayValue)}</small>
            </div>
          `)
          .join("");
        return `<div class="datahub-player-comparison-tooltip"><b>${escapeHtml(data.name || "")}</b>${rows}</div>`;
      },
    },
    legend: {
      bottom: isMobile ? 0 : 6,
      icon: "roundRect",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "rgba(226, 238, 255, 0.82)",
        fontSize: isMobile ? 10 : 12,
        fontFamily: "Product Sans, Google Sans, sans-serif",
        fontWeight: 800,
      },
    },
    radar: {
      indicator: radarData.indicators.map((indicator) => ({ name: indicator.name, max: indicator.max })),
      center: ["50%", isMobile ? "49%" : "48%"],
      radius: isMobile ? "62%" : "66%",
      startAngle: 90,
      splitNumber: 4,
      shape: "polygon",
      axisName: {
        color: "rgba(231, 241, 255, 0.84)",
        fontSize: isMobile ? 10 : 12,
        fontWeight: 850,
        fontFamily: "Product Sans, Google Sans, sans-serif",
      },
      axisLine: { lineStyle: { color: "rgba(190, 216, 255, 0.14)" } },
      splitLine: { lineStyle: { color: "rgba(190, 216, 255, 0.1)" } },
      splitArea: {
        areaStyle: {
          color: [
            "rgba(255,255,255,0.025)",
            "rgba(116,239,255,0.035)",
            "rgba(168,140,255,0.035)",
            "rgba(255,255,255,0.02)",
          ],
        },
      },
    },
    series: [{
      type: "radar",
      symbol: "circle",
      symbolSize: isMobile ? 4 : 5,
      lineStyle: { width: isMobile ? 2 : 2.6 },
      emphasis: { focus: "series" },
      data: radarData.players.map((entry) => ({
        name: entry.player.name,
        value: entry.scores,
        metrics: entry.metrics,
        position: entry.player.pos,
        lineStyle: {
          color: entry.color,
          shadowColor: dataHubAlpha(echartsApi, entry.color, 0.3),
          shadowBlur: 10,
        },
        itemStyle: {
          color: entry.color,
        },
        areaStyle: {
          color: dataHubAlpha(echartsApi, entry.color, 0.18),
        },
      })),
    }],
  };
}

function EChartsSurface({ className, emptyMessage, optionBuilder, data }) {
  const chartElRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const echartsApi = getEchartsApi();
    if (!chartElRef.current || !echartsApi) {
      return undefined;
    }
    chartRef.current = echartsApi.init(chartElRef.current, null, { renderer: "svg" });
    const stopResize = createResizeWatcher(chartElRef.current, chartRef.current);
    return () => {
      stopResize();
      chartRef.current?.dispose?.();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const echartsApi = getEchartsApi();
    if (!chartRef.current || !echartsApi || !data) {
      return;
    }
    chartRef.current.setOption(optionBuilder(data, echartsApi), true);
    chartRef.current.resize();
  }, [data, optionBuilder]);

  if (!data) {
    return h("div", { className: "datahub-player-comparison-empty" }, h("span", null, emptyMessage));
  }

  if (!getEchartsApi()) {
    return h("div", { className: "datahub-player-comparison-empty" }, h("span", null, "ECharts is unavailable."));
  }

  return h("div", { ref: chartElRef, className });
}

export function WeeklyEChartsComparison({ chartData }) {
  const hasData = chartData?.series?.some((series) =>
    series.data?.some((point) => Number.isFinite(point.realValue)),
  );
  if (!hasData) {
    return h("div", { className: "datahub-player-comparison-empty" }, h("span", null, "No weekly data for the selected players."));
  }
  return h(EChartsSurface, {
    className: "datahub-player-comparison-echart datahub-player-comparison-echart--weekly",
    emptyMessage: "No weekly data for the selected players.",
    optionBuilder: buildWeeklyOption,
    data: chartData,
  });
}

export function SeasonRadarComparison({ radarData }) {
  if (!radarData?.players?.length || !radarData?.indicators?.length) {
    return h("div", { className: "datahub-player-comparison-empty" }, h("span", null, "Select players to compare season rankings."));
  }
  return h(
    "div",
    { className: "datahub-player-comparison-radar" },
    h(EChartsSurface, {
      className: "datahub-player-comparison-echart datahub-player-comparison-echart--radar",
      emptyMessage: "No season radar data for the selected players.",
      optionBuilder: buildRadarOption,
      data: radarData,
    }),
    h(
      "div",
      { className: "datahub-player-comparison-rank-grid", "aria-label": "Season positional ranks" },
      radarData.indicators.map((indicator, metricIndex) =>
        h(
          "section",
          { key: indicator.key, className: "datahub-player-comparison-rank-grid__item" },
          h("span", { className: "datahub-player-comparison-rank-grid__metric" }, indicator.name),
          h(
            "span",
            { className: "datahub-player-comparison-rank-grid__players" },
            radarData.players.map((entry) => {
              const metric = entry.metrics[metricIndex] || {};
              const rankText = Number.isFinite(metric.rank) ? `${entry.player.pos}·${Math.round(metric.rank)}` : "NA";
              return h(
                "span",
                {
                  key: `${indicator.key}-${entry.player.id}`,
                  className: "datahub-player-comparison-rank-grid__rank",
                  style: { "--series-color": entry.color },
                  title: `${entry.player.name}: ${metric.displayValue}`,
                },
                rankText,
              );
            }),
          ),
        ),
      ),
    ),
  );
}
