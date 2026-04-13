const chartData = [
  { rank: 1, QB: 0, RB: 1, WR: 0, TE: 0 },
  { rank: 2, QB: 0, RB: 1, WR: 1, TE: 0 },
  { rank: 3, QB: 1, RB: 1, WR: 1, TE: 0 },
  { rank: 4, QB: 1, RB: 2, WR: 1, TE: 0 },
  { rank: 5, QB: 1, RB: 3, WR: 1, TE: 0 },
  { rank: 6, QB: 1, RB: 4, WR: 1, TE: 0 },
  { rank: 7, QB: 2, RB: 4, WR: 1, TE: 0 },
  { rank: 8, QB: 2, RB: 4, WR: 2, TE: 0 },
  { rank: 9, QB: 3, RB: 4, WR: 2, TE: 0 },
  { rank: 10, QB: 4, RB: 4, WR: 2, TE: 0 },
  { rank: 11, QB: 5, RB: 4, WR: 2, TE: 0 },
  { rank: 12, QB: 5, RB: 4, WR: 3, TE: 0 },
  { rank: 13, QB: 6, RB: 4, WR: 3, TE: 0 },
  { rank: 14, QB: 6, RB: 5, WR: 3, TE: 0 },
  { rank: 15, QB: 6, RB: 5, WR: 3, TE: 1 },
  { rank: 16, QB: 7, RB: 5, WR: 3, TE: 1 },
  { rank: 17, QB: 7, RB: 5, WR: 4, TE: 1 },
  { rank: 18, QB: 8, RB: 5, WR: 4, TE: 1 },
  { rank: 19, QB: 9, RB: 5, WR: 4, TE: 1 },
  { rank: 20, QB: 9, RB: 6, WR: 4, TE: 1 },
  { rank: 21, QB: 10, RB: 6, WR: 4, TE: 1 },
  { rank: 22, QB: 11, RB: 6, WR: 4, TE: 1 },
  { rank: 23, QB: 12, RB: 6, WR: 4, TE: 1 },
  { rank: 24, QB: 12, RB: 6, WR: 5, TE: 1 },
  { rank: 25, QB: 12, RB: 7, WR: 5, TE: 1 },
  { rank: 26, QB: 12, RB: 7, WR: 5, TE: 2 },
  { rank: 27, QB: 12, RB: 7, WR: 6, TE: 2 },
  { rank: 28, QB: 12, RB: 8, WR: 6, TE: 2 },
  { rank: 29, QB: 13, RB: 8, WR: 6, TE: 2 },
  { rank: 30, QB: 14, RB: 8, WR: 6, TE: 2 },
  { rank: 31, QB: 14, RB: 8, WR: 7, TE: 2 },
  { rank: 32, QB: 14, RB: 9, WR: 7, TE: 2 },
  { rank: 33, QB: 15, RB: 9, WR: 7, TE: 2 },
  { rank: 34, QB: 15, RB: 10, WR: 7, TE: 2 },
  { rank: 35, QB: 15, RB: 11, WR: 7, TE: 2 },
  { rank: 36, QB: 16, RB: 11, WR: 7, TE: 2 },
  { rank: 37, QB: 17, RB: 11, WR: 7, TE: 2 },
  { rank: 38, QB: 18, RB: 11, WR: 7, TE: 2 },
  { rank: 39, QB: 18, RB: 11, WR: 8, TE: 2 },
  { rank: 40, QB: 19, RB: 11, WR: 8, TE: 2 },
  { rank: 41, QB: 19, RB: 12, WR: 8, TE: 2 },
  { rank: 42, QB: 19, RB: 13, WR: 8, TE: 2 },
  { rank: 43, QB: 19, RB: 14, WR: 8, TE: 2 },
  { rank: 44, QB: 19, RB: 14, WR: 9, TE: 2 },
  { rank: 45, QB: 20, RB: 14, WR: 9, TE: 2 },
  { rank: 46, QB: 20, RB: 14, WR: 10, TE: 2 },
  { rank: 47, QB: 20, RB: 15, WR: 10, TE: 2 },
  { rank: 48, QB: 20, RB: 15, WR: 11, TE: 2 },
  { rank: 49, QB: 20, RB: 15, WR: 12, TE: 2 },
  { rank: 50, QB: 20, RB: 15, WR: 13, TE: 2 },
  { rank: 51, QB: 20, RB: 15, WR: 14, TE: 2 },
  { rank: 52, QB: 20, RB: 16, WR: 14, TE: 2 },
  { rank: 53, QB: 21, RB: 16, WR: 14, TE: 2 },
  { rank: 54, QB: 21, RB: 17, WR: 14, TE: 2 },
  { rank: 55, QB: 21, RB: 18, WR: 14, TE: 2 },
  { rank: 56, QB: 21, RB: 18, WR: 15, TE: 2 },
  { rank: 57, QB: 21, RB: 18, WR: 16, TE: 2 },
  { rank: 58, QB: 21, RB: 18, WR: 17, TE: 2 },
  { rank: 59, QB: 21, RB: 19, WR: 17, TE: 2 },
  { rank: 60, QB: 21, RB: 20, WR: 17, TE: 2 }
];

const seriesMeta = [
  {
    key: "QB",
    count: 21,
    pct: 35.0,
    lineStart: "#ff9a3d",
    lineEnd: "#ff4187",
    areaStart: "#ff9a3d",
    areaEnd: "#ff4187",
    glow: "rgba(255, 120, 90, 0.34)"
  },
  {
    key: "RB",
    count: 20,
    pct: 33.3,
    lineStart: "#1ac2ff",
    lineEnd: "#06ff97",
    areaStart: "#64d8ff",
    areaEnd: "#06ffa8",
    glow: "rgba(100, 216, 255, 0.34)"
  },
  {
    key: "WR",
    count: 17,
    pct: 28.3,
    lineStart: "#8153ff",
    lineEnd: "#0299fe",
    areaStart: "#6e10fb",
    areaEnd: "#0d72ff",
    glow: "rgba(124, 111, 255, 0.34)"
  },
  {
    key: "TE",
    count: 2,
    pct: 3.3,
    lineStart: "#ff6bc8",
    lineEnd: "#7f2fff",
    areaStart: "#ff6bc8",
    areaEnd: "#7f2fff",
    glow: "rgba(255, 107, 200, 0.30)"
  }
];

function buildSummaryChips() {
  const chips = document.getElementById("summaryChips");

  chips.innerHTML = seriesMeta
    .map(
      (item) => `
        <div
          class="stat-chip"
          style="
            --chip-line: linear-gradient(90deg, ${item.lineStart}, ${item.lineEnd});
            --chip-dot: linear-gradient(135deg, ${item.lineStart}, ${item.lineEnd});
            box-shadow:
              0 2px 8px rgba(0,0,0,0.28),
              inset 0 1px 0 rgba(255,255,255,0.03),
              0 0 0 1px rgba(255,255,255,0.02),
              0 -3px 10px ${item.glow};
          "
        >
          <div class="stat-chip-top">
            <span class="stat-dot"></span>
            <span class="stat-label">${item.key}</span>
          </div>

          <div class="stat-chip-bottom">
            <span class="stat-count">${item.count}</span>
            <span class="stat-meta">
              <span class="stat-sub">Top 60</span>
              <span class="stat-pct">${item.pct.toFixed(1)}%</span>
            </span>
          </div>
        </div>
      `
    )
    .join("");
}

function lineGradient(start, end) {
  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: start },
    { offset: 0.42, color: start },
    { offset: 0.82, color: end },
    { offset: 1, color: end }
  ]);
}

function areaGradient(start, end) {
  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: echarts.color.modifyAlpha(start, 0.44) },
    { offset: 0.4, color: echarts.color.modifyAlpha(start, 0.32) },
    { offset: 0.82, color: echarts.color.modifyAlpha(end, 0.21) },
    { offset: 1, color: echarts.color.modifyAlpha(end, 0.14) }
  ]);
}

function buildSeries() {
  return seriesMeta.map((item) => ({
    name: item.key,
    type: "line",
    smooth: 0.55,
    showSymbol: false,
    symbol: "none",
    z: 3,
    lineStyle: {
      width: 3,
      color: lineGradient(item.lineStart, item.lineEnd),
      cap: "round",
      join: "round"
    },
    areaStyle: {
      color: areaGradient(item.areaStart, item.areaEnd)
    },
    emphasis: {
      focus: "series"
    },
    data: chartData.map((row) => [row.rank, row[item.key]])
  }));
}

function initChart() {
  const el = document.getElementById("posChart");
  const chart = echarts.init(el, null, { renderer: "svg" });

  chart.setOption({
    animationDuration: 450,
    backgroundColor: "transparent",
    grid: {
      left: 30,
      right: 8,
      top: 16,
      bottom: 44,
      containLabel: false
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(5,6,11,0.96)",
      borderColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      textStyle: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif"
      },
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgba(255,255,255,0.14)",
          width: 1
        }
      },
      extraCssText:
        "border-radius:16px; box-shadow:0 16px 40px rgba(0,0,0,.45); padding:10px 12px;",
      formatter(params) {
        const items = params
          .map((p) => {
            const meta = seriesMeta.find((s) => s.key === p.seriesName);
            return `
              <div style="display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:4px;">
                <div style="display:flex; align-items:center; gap:8px; color:rgba(255,255,255,.78);">
                  <span style="
                    width:10px;
                    height:10px;
                    border-radius:999px;
                    display:inline-block;
                    background: linear-gradient(135deg, ${meta.lineStart}, ${meta.lineEnd});
                  "></span>
                  ${p.seriesName}
                </div>
                <div style="font-weight:700; color:#fff;">${p.value[1]}</div>
              </div>
            `;
          })
          .join("");

        return `
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:.18em; color:rgba(255,255,255,.55); margin-bottom:6px;">
            Rank ${params[0]?.axisValue ?? ""}
          </div>
          ${items}
        `;
      }
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 60,
      interval: 12,
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 300,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif",
        formatter(value) {
          return Number.isInteger(value) ? String(value) : "";
        }
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.14)"
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 22,
      interval: 2,
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 300,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif"
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0)"
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.05)",
          type: "dotted"
        }
      }
    },
    series: buildSeries()
  });

  const ro = new ResizeObserver(() => chart.resize());
  ro.observe(el);

  window.addEventListener("resize", () => chart.resize());
}

buildSummaryChips();
initChart();
