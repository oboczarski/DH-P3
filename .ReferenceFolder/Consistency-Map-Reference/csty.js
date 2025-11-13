const canvas = document.getElementById("infographicCanvas");
const ctx = canvas.getContext("2d");

const weeks = [
  { week: "WK1", value: 27.9 },
  { week: "WK2", value: 18.8 },
  { week: "WK3", value: 15.6 },
  { week: "WK4", value: 14.5 },
  { week: "WK5", value: 15.6 },
  { week: "WK6", value: 18.8 },
  { week: "WK7", value: 29.9 },
  { week: "WK8", value: 26.3 },
  { week: "WK9", value: 28.7 }
];

const minVal = 0;
const maxVal = 40;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}

function valueToY(v, top, height) {
  const pct = (v - minVal) / (maxVal - minVal);
  return top + height - pct * height;
}

function drawRoundedPanel(x, y, w, h, r = 22) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.save();

  // tuned padding
  const padLeft = 90;
  const padRight = 50;
  const padTop = 52;
  const padBottom = 100;

  const chartX = padLeft;
  const chartY = padTop;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  // glass panel with tuned bottom space
  const panelX = chartX - 10;
  const panelY = chartY - 32;
  const panelW = chartW + 20;
  const panelH = chartH + 90; // ← this is the space under x-axis title
  const panelGrad = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
  panelGrad.addColorStop(0, "rgba(118, 109, 255, 0.085)");
  panelGrad.addColorStop(0.3, "rgba(66, 194, 255, 0.025)");
  panelGrad.addColorStop(1, "rgba(13, 14, 27, 0)");
  ctx.fillStyle = panelGrad;
  ctx.strokeStyle = "rgba(128, 138, 189, 0.18)";
  ctx.lineWidth = 1.2;
  drawRoundedPanel(panelX, panelY, panelW, panelH, 22);
  ctx.fill();
  ctx.stroke();

  // zone lines/areas
  const zoneLowMax = 16;
  const zoneMidMax = 22;
  const yLow = valueToY(zoneLowMax, chartY, chartH);
  const yMid = valueToY(zoneMidMax, chartY, chartH);

  // Elite (22–40)
  ctx.fillStyle = "rgba(66, 194, 255, 0.038)";
  ctx.fillRect(chartX, chartY, chartW, yMid - chartY);

  // Solid (16–22)
  ctx.fillStyle = "rgba(118, 109, 255, 0.045)";
  ctx.fillRect(chartX, yMid, chartW, yLow - yMid);

  // Low (0–16)
  ctx.fillStyle = "rgba(255, 71, 166, 0.028)";
  ctx.fillRect(chartX, yLow, chartW, chartY + chartH - yLow);

  // zone separator lines
  ctx.strokeStyle = "rgba(234, 235, 240, 0.035)";
  ctx.lineWidth = 1;
  [zoneLowMax, zoneMidMax, maxVal].forEach((val) => {
    const y = valueToY(val, chartY, chartH);
    ctx.beginPath();
    ctx.moveTo(chartX, y);
    ctx.lineTo(chartX + chartW, y);
    ctx.stroke();
  });

  // y-axis labels
  ctx.font = "12.5px system-ui, -apple-system, Segoe UI, sans-serif";
  for (let v = 0; v <= maxVal; v += 10) {
    const y = valueToY(v, chartY, chartH);
    const t = v + " pts";
    ctx.strokeStyle = "rgba(6, 7, 11, 0.85)";
    ctx.lineWidth = 3;
    ctx.strokeText(t, chartX - 52, y + 3);
    ctx.fillStyle = "rgba(234, 235, 240, 0.82)";
    ctx.fillText(t, chartX - 52, y + 3);

    // faint horizontal line
    ctx.beginPath();
    ctx.strokeStyle = "rgba(234, 235, 240, 0.018)";
    ctx.moveTo(chartX, y);
    ctx.lineTo(chartX + chartW, y);
    ctx.stroke();
  }

  // x positions
  const xLabelPad = 16;
  const spacing = (chartW - xLabelPad * 2) / (weeks.length - 1);
  const points = weeks.map((wk, idx) => {
    const x = chartX + xLabelPad + idx * spacing;
    const y = valueToY(wk.value, chartY, chartH);
    return { ...wk, x, y };
  });

  // performance line
  const lineGrad = ctx.createLinearGradient(chartX, chartY, chartX + chartW, chartY + chartH);
  lineGrad.addColorStop(0, "#5600FF");
  lineGrad.addColorStop(0.5, "#6211FF");
  lineGrad.addColorStop(1, "#43A5F0");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2.3;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // fill under line, straight sides
  const fillGrad = ctx.createLinearGradient(chartX, chartY, chartX, chartY + chartH);
  fillGrad.addColorStop(0, "rgba(118, 109, 255, 0.44)");
  fillGrad.addColorStop(1, "rgba(13, 14, 27, 0)");
  ctx.fillStyle = fillGrad;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.lineTo(chartX + chartW, points[points.length - 1].y);
  ctx.lineTo(chartX + chartW, chartY + chartH);
  ctx.lineTo(chartX, chartY + chartH);
  ctx.lineTo(chartX, points[0].y);
  ctx.closePath();
  ctx.fill();

  // points + chips + x labels
  points.forEach((p, idx) => {
    // zone color for this point
    let zoneColor = "rgba(66, 194, 255, 1)"; // elite
    let zoneGlow = "rgba(66, 194, 255, 0.5)";
    if (p.value <= 16) {
      zoneColor = "rgba(255, 71, 166, 1)";
      zoneGlow = "rgba(255, 71, 166, 0.5)";
    } else if (p.value <= 22) {
      zoneColor = "rgba(118, 109, 255, 1)";
      zoneGlow = "rgba(118, 109, 255, 0.55)";
    }

    // point glow - single, tight, lighter for blue/purple
    const glowRadius = 16;
    let glowColor = "rgba(255, 71, 166, 0.9)"; // low
    if (p.value > 22) {
      // elite - lighter blue so halo is visible
      glowColor = "rgba(170, 255, 255, 0.95)";
    } else if (p.value > 16) {
      // solid - lighter lavender
      glowColor = "rgba(186, 192, 255, 0.95)";
    }
    const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
    radial.addColorStop(0, glowColor);
    radial.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // optional soft ring to tie to chip
    const outerRadial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 22);
    outerRadial.addColorStop(0, zoneGlow);
    outerRadial.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = outerRadial;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
    ctx.fill();

    // point core
    ctx.fillStyle = "#99B6";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#CCF";
    ctx.lineWidth = 1;
    ctx.stroke();

    // data label chip
    const labelY = p.y - 34;
    const labelText = p.value.toFixed(1);
    ctx.font = "12.4px system-ui, -apple-system, Segoe UI, sans-serif";
    const textWidth = ctx.measureText(labelText).width;
    const labelWidth = textWidth + 20;
    const labelX = Math.min(Math.max(p.x - labelWidth / 2, chartX), chartX + chartW - labelWidth);
    const bh = 24;
    const br = 8;

    // chip base
    const chipGrad = ctx.createLinearGradient(labelX, labelY - 8, labelX + labelWidth, labelY + 23);
    chipGrad.addColorStop(0, "rgba(13, 14, 27, 0.95)");
    chipGrad.addColorStop(1, "rgba(30, 31, 48, 0.35)");
    ctx.fillStyle = chipGrad;
    ctx.strokeStyle = zoneGlow;
    ctx.lineWidth = 1;
    drawRoundedPanel(labelX, labelY, labelWidth, bh, br);
    ctx.fill();
    ctx.stroke();

    // full-chip inset glow
    ctx.save();
    ctx.globalAlpha = 0.45;
    const chipGlow = ctx.createLinearGradient(labelX, labelY, labelX, labelY + bh);
    chipGlow.addColorStop(0, zoneGlow);
    chipGlow.addColorStop(1, "rgba(13, 14, 27, 0)");
    ctx.fillStyle = chipGlow;
    drawRoundedPanel(labelX, labelY, labelWidth, bh, br);
    ctx.fill();
    ctx.restore();

    // chip text
    const textOffsetX = labelX + 10;
    const textOffsetY = labelY + 17;
    ctx.strokeStyle = "rgba(6, 7, 11, 0.95)";
    ctx.lineWidth = 3;
    ctx.strokeText(labelText, textOffsetX, textOffsetY);
    ctx.fillStyle = zoneColor;
    ctx.fillText(labelText, textOffsetX, textOffsetY);

    // x-axis label (WK • n)
    const weekLabel = weeks[idx].week.replace("WK", "WK • ");
    ctx.font = "12.2px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.strokeStyle = "rgba(6, 7, 11, 0.85)";
    ctx.lineWidth = 3;
    ctx.strokeText(weekLabel, p.x - 23, chartY + chartH + 20);
    ctx.fillStyle = "rgba(234, 235, 240, 0.9)";
    ctx.fillText(weekLabel, p.x - 23, chartY + chartH + 20);
  });

  // y-axis title
  ctx.save();
  ctx.translate(chartX - 68, chartY + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = "16px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(234, 235, 240, 0.9)";
  ctx.textAlign = "center";
  ctx.fillText("Fantasy Points", 0, 0);
  ctx.restore();

  // x-axis title
  ctx.font = "16px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillStyle = "rgba(234, 235, 240, 0.9)";
  ctx.textAlign = "center";
  ctx.fillText("Week #", chartX + chartW / 2, chartY + chartH + 46);

  ctx.restore();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
