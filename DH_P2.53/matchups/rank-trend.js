// Matchup Trends compares two fixed CSV-derived summaries across the league.
// The position and metric select one set of values for the scatter and list.
(() => {
  "use strict";
  if (document.body?.dataset.page !== "matchups") return;
  const { TEAM_NAMES, TEAMS } = window.FPAData;
  const { pointBounds, spreadScatterPoints } = window.FPACharts;
  const logoUrl = team => `assets/NFL-Tags_webp/${team.toLowerCase()}.webp`;
  const rankTicks = [1, 8, 16, 24, 32];

  function create(season, recent, rangeLabel, fmt) {
    const chart = document.getElementById("trendChart");
    const note = document.getElementById("trendNote");
    const table = document.getElementById("trendTable");
    const counts = document.getElementById("trendCounts");
    const modeButtons = [...document.querySelectorAll("[data-trend-mode]")];
    let position, mode = "rank", rows = [];

    const displayValue = value => {
      if (!Number.isFinite(value)) return "—";
      return mode === "rank" ? `#${value}` : fmt(value, 1);
    };

    function renderChart() {
      if (!position) return;
      const points = rows.filter(row => row.change !== null);
      if (!points.length) {
        chart.innerHTML = `<p class="trendEmpty">${recent ? "No comparable results for this position." : "Recent trends begin after Week 7 is complete."}</p>`;
        note.textContent = "";
        return;
      }

      const width = chart.clientWidth, height = chart.clientHeight;
      if (!width || !height) return;
      const left = 40, right = width - 17, top = 18, bottom = height - 34;
      const ranked = mode === "rank";
      const bounds = ranked ? { low: 0, high: TEAMS.length + 1, ticks: rankTicks }
        : pointBounds(points.flatMap(row => [row.season, row.recent]));
      // A shared scale makes equality the rising diagonal in both modes.
      // Smaller recent values are improvements and fall below that line.
      const fraction = value => (value - bounds.low) / (bounds.high - bounds.low);
      const x = value => left + fraction(value) * (right - left);
      const y = value => bottom - fraction(value) * (bottom - top);
      const digits = ranked || bounds.step >= 1 ? 0 : Math.ceil(-Math.log10(bounds.step));
      const grid = bounds.ticks.map(value => `
        <path class="trendGrid" d="M${x(value)} ${top}V${bottom} M${left} ${y(value)}H${right}"/>
        <text x="${left - 6}" y="${y(value) + 3}" text-anchor="end" data-trend-axis="y">${fmt(value, digits)}</text>
        <text x="${x(value)}" y="${bottom + 14}" text-anchor="middle" data-trend-axis="x">${fmt(value, digits)}</text>`).join("");

      // Keep team logos visible in crowded regions, with a leader back to
      // each adjusted marker's exact coordinates.
      const markers = spreadScatterPoints(points.map(row => ({ ...row, x: x(row.season), y: y(row.recent) })),
        { left, right, top, bottom }, { radius: 10, gap: 2, maxOffset: 20 });
      const leaders = markers.filter(marker => Math.hypot(marker.x - marker.displayX, marker.y - marker.displayY) > 1)
        .map(marker => `<path class="trendLeader" d="M${marker.x} ${marker.y}L${marker.displayX} ${marker.displayY}"/>`).join("");
      const logos = markers.map(marker => `<g transform="translate(${marker.displayX} ${marker.displayY})">
        <title>${TEAM_NAMES[marker.team]} · ${displayValue(marker.season)} → ${displayValue(marker.recent)}</title>
        <image href="${logoUrl(marker.team)}" x="-10" y="-10" width="20" height="20"/></g>`).join("");
      const metric = ranked ? "FPA rank" : "FPA/G";
      chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${position} ${metric}, Regular Season versus ${rangeLabel}">
        <path class="trendZoneDown" d="M${left} ${bottom}V${top}H${right}Z"/>
        <path class="trendZoneUp" d="M${left} ${bottom}H${right}V${top}Z"/>${grid}
        <path class="trendEquality" d="M${left} ${bottom}L${right} ${top}"/>
        <text class="trendZone declined" x="${left + 7}" y="${top + 13}">Declined</text>
        <text class="trendZone improved" x="${right - 6}" y="${bottom - 8}" text-anchor="end">Improved</text>
        <text class="trendAxis" text-anchor="middle" x="${(left + right) / 2}" y="${height - 5}">Regular Season ${metric}</text>
        <text class="trendAxis" text-anchor="middle" transform="translate(10 ${(top + bottom) / 2}) rotate(-90)">${rangeLabel} ${metric}</text>
        ${leaders}${logos}</svg>`;
      note.textContent = ranked ? "Rank 1 allows the fewest points per game · Dashed line shows equal ranks"
        : "PPR points allowed per game · Dashed line shows equal averages";
    }

    function renderTable() {
      if (!recent) {
        counts.replaceChildren();
        table.replaceChildren();
        return;
      }
      const ranked = mode === "rank";
      const magnitude = Math.max(1, ...rows.map(row => Math.abs(row.change ?? 0)));
      const totals = { improved: 0, steady: 0, declined: 0 };
      const lines = rows.map(row => {
        // Negative change represents a lower rank or fewer points allowed.
        // The centered track puts improvements on the left in both modes.
        const change = row.change;
        const tone = change === null ? "unavailable" : change < 0 ? "improved" : change > 0 ? "declined" : "steady";
        if (change !== null) totals[tone]++;
        const amount = change === null ? "—" : (ranked ? Math.abs(change) : fmt(Math.abs(change), 1));
        const sign = change < 0 ? (ranked ? "↑ " : "−") : change > 0 ? (ranked ? "↓ " : "+") : "";
        const bar = change ? `<i style="--trend-bar-width:${Math.abs(change) / magnitude * 50}%"></i>` : "";
        return `<tr class="${tone}">
          <th scope="row"><span class="trendRowTeam" title="${TEAM_NAMES[row.team]}"><img src="${logoUrl(row.team)}" alt=""><span aria-label="${TEAM_NAMES[row.team]}">${row.team}</span></span></th>
          <td>${displayValue(row.season)}</td><td class="trendRecentValue">${displayValue(row.recent)}</td>
          <td><span class="trendRowChange"><span class="trendMeter" aria-hidden="true">${bar}</span><strong>${sign}${amount}</strong></span></td>
        </tr>`;
      }).join("");
      counts.innerHTML = Object.entries(totals).map(([tone, count]) =>
        `<span class="${tone}"><strong>${count}</strong> ${tone}</span>`).join("");
      table.innerHTML = `<thead><tr><th scope="col">Defense</th><th scope="col">Season</th><th scope="col">${rangeLabel}</th><th scope="col">${ranked ? "Δ Rank" : "Δ FPA/G"}</th></tr></thead><tbody>${lines}</tbody>`;
      table.parentElement.scrollTop = 0;
    }

    function render() {
      const metric = mode === "rank" ? "defenseRank" : "avg";
      rows = season.rows.map(row => {
        const fullValue = row.metrics[position][metric];
        const recentValue = recent?.byTeam.get(row.team)?.metrics[position][metric];
        const difference = Number.isFinite(fullValue) && Number.isFinite(recentValue) ? recentValue - fullValue : null;
        // Movement describes the displayed precision, while the plot keeps
        // the unrounded values and exact league ranks.
        const change = difference !== null && mode === "points" ? Number(fmt(difference, 1)) : difference;
        return { team: row.team, season: fullValue, recent: recentValue, change };
      }).sort((a, b) => (a.change ?? Infinity) - (b.change ?? Infinity) || a.team.localeCompare(b.team));
      renderChart();
      renderTable();
    }

    for (const button of modeButtons) button.addEventListener("click", () => {
      if (!position || mode === button.dataset.trendMode) return;
      mode = button.dataset.trendMode;
      modeButtons.forEach(toggle => toggle.setAttribute("aria-pressed", String(toggle === button)));
      render();
    });
    new ResizeObserver(renderChart).observe(chart);
    return { update(selectedPosition) {
      if (position === selectedPosition) return;
      position = selectedPosition;
      render();
    } };
  }
  window.FPARankTrend = { create };
})();
