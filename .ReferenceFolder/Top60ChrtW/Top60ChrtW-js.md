const chartData = [
  { name: "J.Allen", fullName: "Josh Allen", pos: "QB", ktc: 3, adp: 1.5 },
  { name: "Bijan", fullName: "Bijan Robinson", pos: "RB", ktc: 2, adp: 2.6 },
  { name: "J.Chase", fullName: "Ja'Marr Chase", pos: "WR", ktc: 1, adp: 4.4 },
  { name: "Maye", fullName: "Drake Maye", pos: "QB", ktc: 6, adp: 3.4 },
  { name: "Gibbs", fullName: "Jahmyr Gibbs", pos: "RB", ktc: 5, adp: 5.9 },
  { name: "JSN", fullName: "Jaxon Smith-Njigba", pos: "WR", ktc: 4, adp: 7.5 },
  { name: "Nacua", fullName: "Puka Nacua", pos: "WR", ktc: 7, adp: 6.4 },
  { name: "Daniels", fullName: "Jayden Daniels", pos: "QB", ktc: 11, adp: 8 },
  { name: "Nabers", fullName: "Malik Nabers", pos: "WR", ktc: 9, adp: 12.8 },
  { name: "St.Brown", fullName: "Amon-Ra St. Brown", pos: "WR", ktc: 13, adp: 9.1 },
  { name: "C.Williams", fullName: "Caleb Williams", pos: "QB", ktc: 8, adp: 14.1 },
  { name: "Bowers", fullName: "Brock Bowers", pos: "TE", ktc: 10, adp: 13.2 },
  { name: "L.Jackson", fullName: "Lamar Jackson", pos: "QB", ktc: 14, adp: 11.8 },
  { name: "Jefferson", fullName: "Justin Jefferson", pos: "WR", ktc: 12, adp: 16.3 },
  { name: "Burrow", fullName: "Joe Burrow", pos: "QB", ktc: 18, adp: 10.4 }
].sort((a, b) => b.adp - a.adp);

function formatName(name) {
  return name;
}

const colorKTC = "#4800ff";
const colorMid = "#ca18fb"; // Editable middle gradient color
const colorADP = "#ff6441";

function buildSummaryChips() {
  const chips = document.getElementById("summaryChips");
  
  const positions = [
    { key: "QB", lineStart: "#ff9a3d", lineEnd: "#ff4187", glow: "rgba(255,120,90,0.34)" },
    { key: "RB", lineStart: "#1ac2ff", lineEnd: "#06ff97", glow: "rgba(100,216,255,0.34)" },
    { key: "WR", lineStart: "#8153ff", lineEnd: "#0299fe", glow: "rgba(124,111,255,0.34)" },
    { key: "TE", lineStart: "#ff4187", lineEnd: "#6a00ff", glow: "rgba(255,107,200,0.30)" }
  ];

  const summaries = positions.map(posGroup => {
    const players = chartData.filter(d => d.pos === posGroup.key);
    const count = players.length;
    let avgDiff = 0;
    if (count > 0) {
      const totalDiff = players.reduce((sum, p) => sum + (p.adp - p.ktc), 0);
      avgDiff = totalDiff / count;
    }
    
    return {
      ...posGroup,
      count,
      avgDiff
    };
  });

  chips.innerHTML = summaries
    .map(
      (item) => `
        <div class="stat-chip" style="--chip-line: linear-gradient(90deg, ${item.lineStart}, ${item.lineEnd}); --chip-dot: linear-gradient(135deg, ${item.lineStart}, ${item.lineEnd}); box-shadow: 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(255,255,255,0.02), 0 -3px 10px ${item.glow};">
          <div class="stat-chip-top" style="margin-bottom: 2px;">
            <span class="stat-dot"></span>
            <span class="stat-label" style="font-size:13px; color:rgba(255,255,255,0.8);">${item.key}</span>
          </div>
          <div class="stat-chip-bottom" style="flex-direction:row; align-items:center; gap:4px; margin-top:2px;">
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span class="stat-count" style="font-size:18px; font-weight:700;">${item.count}</span>
              <span class="stat-sub" style="font-size:8px; color:rgba(255,255,255,0.4);">COUNT</span>
            </div>
            <div style="width:1px; height:16px; background:rgba(255,255,255,0.1);"></div>
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span class="stat-count" style="font-size:14px; font-weight:500; color:${item.count > 0 ? (item.avgDiff > 0 ? '#06ff97' : '#ff4187') : 'inherit'}">${item.count > 0 ? (item.avgDiff > 0 ? '+' : '') + item.avgDiff.toFixed(1) : '-'}</span>
              <span class="stat-sub" style="font-size:8px; color:rgba(255,255,255,0.4);">AVG SHIFT</span>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function initChart() {
  const el = document.getElementById("posChart");
  const chart = echarts.init(el, null, { renderer: "svg" });

  const adpData = chartData.map(d => d.adp);
  const ktcData = chartData.map(d => d.ktc);

  chart.setOption({
    animationDuration: 450,
    backgroundColor: "transparent",
    grid: {
      left: 90, // Increased since label is inline again
      right: 20,
      top: 6,
      bottom: 24,
      containLabel: false
    },
    legend: {
      top: 6,
      right: 24,
      itemHeight: 14,
      itemWidth: 14,
      data: [
        { name: "ADP", icon: "roundRect" },
        { name: "KTC Rank", icon: "roundRect" }
      ],
      textStyle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif"
      }
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10, 11, 16, 0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: { color: "#fff", fontSize: 13, fontFamily: "'Product Sans', 'Google Sans', sans-serif" },
      axisPointer: { type: "shadow", shadowStyle: { color: "rgba(255,255,255,0.03)" } },
      extraCssText: "border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.6); padding: 6px 9px; backdrop-filter: blur(8px);",
      formatter: function (params) {
        // Find player object for the raw axis string
        const pIndex = params[0].dataIndex;
        const player = chartData[pIndex];
        let title = player && player.fullName ? player.fullName : (player ? formatName(player.name) : params[0].name);
        let pos = player ? player.pos : "";

        let pADP = params.find(p => p.seriesName === "ADP");
        let pKTC = params.find(p => p.seriesName === "KTC Rank");
        
        let posBadge = "";
        if (pos === "QB") posBadge = `<span style="background:rgba(211,123,233,0.15); color:#d37be9; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">QB</span>`;
        if (pos === "RB") posBadge = `<span style="background:rgba(102,252,204,0.15); color:#66fccc; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">RB</span>`;
        if (pos === "WR") posBadge = `<span style="background:rgba(96,181,255,0.15); color:#60b5ff; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">WR</span>`;
        if (pos === "TE") posBadge = `<span style="background:rgba(126,81,252,0.15); color:#7e51fc; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">TE</span>`;

        return `
          <div style="font-size:12px; font-weight:600; color:rgba(255,255,255,0.9); margin-bottom:6px; display:flex; align-items:center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">
            ${title}${posBadge}
          </div>
          <div style="display:flex; justify-content:space-between; gap:24px; margin-bottom:2px; align-items: center;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="width:8px; height:8px; border-radius:50%; background:${colorADP};"></span>
              <span style="color:rgba(255,255,255,0.7); font-size:12px;">ADP</span>
            </div>
            <strong style="font-size:14px; color:#fff;">${pADP ? pADP.value : ''}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; gap:24px; align-items: center;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="width:8px; height:8px; border-radius:50%; background:${colorKTC};"></span>
              <span style="color:rgba(255,255,255,0.7); font-size:12px;">KTC Rank</span>
            </div>
            <strong style="font-size:14px; color:#fff;">${pKTC ? pKTC.value : ''}</strong>
          </div>
        `;
      }
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 20,
      interval: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 500,
        margin: 0,
      },
      splitLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.05)", type: "dotted" } }
    },
    yAxis: {
      type: "category",
      data: chartData.map(d => d.name),
      axisLabel: {
        formatter: function (value) {
          const player = chartData.find(d => d.name === value);
          if (!player) return value;
          const formattedName = formatName(player.name);
          return `{name|${formattedName}  •  }{pos${player.pos}|${player.pos}}`;
        },
        rich: {
          name: {
            color: "rgba(255,255,255,0.76)",
            fontSize: 9,
            fontWeight: 600,
            fontFamily: "'Product Sans', 'Google Sans', sans-serif"
          },
          posQB: { color: "#d37be9", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" },
          posRB: { color: "#66fccc", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" },
          posWR: { color: "#60b5ff", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" },
          posTE: { color: "#7e51fc", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" }
        },
        interval: 0,
        margin: 4
      },
      axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.10)" } },
      axisTick: { show: false }
    },
    series: [
      {
        name: "Connector",
        type: "custom",
        renderItem: function (params, api) {
          const y = api.coord([0, api.value(2)])[1];
          const x0 = api.coord([api.value(0), api.value(2)])[0]; // KTC
          const x1 = api.coord([api.value(1), api.value(2)])[0]; // ADP
          const minX = Math.min(x0, x1);
          const maxX = Math.max(x0, x1);
          const width = maxX - minX;

          // True range bar connection
          return {
            type: "rect",
            transition: ["shape"],
            shape: {
              x: minX - 6,
              y: y - 6,
              width: width + 12,
              height: 12,
              r: 6
            },
            style: api.style({
              fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: x0 < x1 ? colorKTC : colorADP },
                { offset: 0.5, color: colorMid },
                { offset: 1, color: x0 < x1 ? colorADP : colorKTC }
              ])
            })
          };
        },
        data: chartData.map((d, i) => [d.ktc, d.adp, i]),
        z: 3,
        tooltip: { show: false }
      },
      {
        name: "KTC Rank",
        type: "scatter",
        symbol: "circle",
        symbolSize: 12,
        itemStyle: { color: colorKTC },
        data: ktcData,
        z: 2
      },
      {
        name: "ADP",
        type: "scatter",
        symbol: "circle",
        symbolSize: 12,
        itemStyle: { color: colorADP },
        data: adpData,
        z: 2
      }
    ]
  });

  const ro = new ResizeObserver(() => chart.resize());
  ro.observe(el);

  window.addEventListener("resize", () => chart.resize());
}

buildSummaryChips();
initChart();
