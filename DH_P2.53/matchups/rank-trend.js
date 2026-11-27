// Matchup Trends compares two fixed CSV-derived summaries across the league.
// The position and metric select one set of values for the scatter and list.
(() => {
  "use strict";
  if (document.body?.dataset.page !== "matchups") return;
  const { TEAM_NAMES, TEAMS } = window.FPAData;
  const { plotWidth, scatterPlot, scatterLeaders, spreadScatterPoints } = window.FPACharts;
  const logoUrl = team => `assets/NFL-Tags_webp/${team.toLowerCase()}.webp`;
  const logoSize = 22;

  function create(season, recent, rangeLabel, fmt, tick) {
    const chart = document.getElementById("trendChart");
    const heading = chart.closest(".trendPanel").querySelector(".panelHeader > :first-child");
    const referenceHeading = document.querySelector('[data-matchups-area="comparison"] .panelHeader > :first-child');
    const note = document.getElementById("trendNote");
    const table = document.getElementById("trendTable");
    const counts = document.getElementById("trendCounts");
    const expand = document.getElementById("expandTrend");
    const dialog = document.getElementById("trendDialog");
    const dialogScope = document.getElementById("trendDialogScope");
    const dialogTables = document.getElementById("trendDialogTables");
    const dialogCounts = document.getElementById("trendDialogCounts");
    const modeButtons = [...document.querySelectorAll("[data-trend-mode]")];
    let position, mode = "rank", rows = [], tableRows = [];
    expand.disabled = !recent;

    const displayValue = value => {
      if (!Number.isFinite(value)) return "—";
      return mode === "rank" ? `#${value}` : fmt(value, 1);
    };

    function renderChart() {
      if (!position) return;
      const points = rows.filter(row => row.change !== null).map(row => ({ ...row, x: row.season, y: row.recent }));
      if (!points.length) {
        chart.innerHTML = `<p class="emptyState">${recent ? "No comparable results for this position." : "Recent trends begin after Week 7 is complete."}</p>`;
        note.textContent = "";
        return;
      }
      if (!chart.clientWidth) return;
      const width = plotWidth(chart.clientWidth, getComputedStyle(chart));
      const ranked = mode === "rank", metric = ranked ? "FPA rank" : "FPA · Points/Game";
      const plot = scatterPlot(points, { width, mobile: innerWidth <= 620, ranked, pool: TEAMS.length, tick,
        xTitle: `Regular Season ${metric}`, yTitle: `${rangeLabel} ${metric}`,
        aboveLabel: "Declined", belowLabel: "Improved" });

      // The logo is the only marker layer. Keep it clear of the edges and
      // retain the reference chart's exact-value leaders in crowded areas.
      const radius = logoSize / 2, inset = ranked ? 0 : radius;
      const markers = spreadScatterPoints(points.map(row => ({ ...row, x: plot.x(row.x), y: plot.y(row.y) })),
        { left: plot.left + inset, right: plot.right - inset, top: plot.top + inset, bottom: plot.bottom - inset },
        { radius, gap: 2, maxOffset: 20 });
      const logos = markers.map(marker => `<g class="trendLogo" transform="translate(${marker.displayX} ${marker.displayY})">
        <title>${TEAM_NAMES[marker.team]} · ${displayValue(marker.season)} → ${displayValue(marker.recent)}</title>
        <image href="${logoUrl(marker.team)}" x="${-radius}" y="${-radius}" width="${logoSize}" height="${logoSize}"/></g>`).join("");
      chart.innerHTML = `<svg viewBox="0 0 ${width} ${plot.height}" role="img" aria-label="${position} ${metric}, Regular Season versus ${rangeLabel}">
        ${plot.content}${scatterLeaders(markers)}${logos}</svg>`;
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
      tableRows = rows.map(row => {
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
      });
      counts.innerHTML = Object.entries(totals).map(([tone, count]) =>
        `<span class="${tone}"><strong>${count}</strong> ${tone}</span>`).join("");
      table.innerHTML = leagueTable(tableRows, rangeLabel);
      table.parentElement.scrollTop = 0;
      if (dialog.open) renderExpanded();
    }

    function leagueTable(lines, recentLabel, compact = false) {
      const changeLabel = mode === "rank" ? "Δ Rank" : compact ? "Δ Pts" : "Δ FPA/G";
      return `<thead><tr><th scope="col" aria-label="Defense">${compact ? "DEF" : "Defense"}</th><th scope="col">Season</th><th scope="col">${recentLabel}</th><th scope="col">${changeLabel}</th></tr></thead><tbody>${lines.join("")}</tbody>`;
    }

    // Two balanced tables show the entire league in one dialog, in the same
    // order and with the same values as the condensed panel.
    function renderExpanded() {
      const split = Math.ceil(tableRows.length / 2);
      dialogScope.textContent = `${position} · ${mode === "rank" ? "FPA ranks" : "Points allowed per game"} · ${rangeLabel}`;
      dialogCounts.innerHTML = counts.innerHTML;
      dialogTables.innerHTML = [tableRows.slice(0, split), tableRows.slice(split)]
        .map((lines, index) => `<table aria-label="League movement, teams ${index * split + 1} through ${index * split + lines.length}">${leagueTable(lines, "Recent", true)}</table>`).join("");
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
    expand.addEventListener("click", () => {
      if (!tableRows.length) return;
      renderExpanded();
      dialog.showModal();
    });
    // The different eyebrow text must reserve the same space as the
    // reference so both control groups wrap at the same viewport width.
    const syncHeadingWidth = () => {
      heading.style.minInlineSize = `${referenceHeading.getBoundingClientRect().width}px`;
    };
    syncHeadingWidth();
    new ResizeObserver(syncHeadingWidth).observe(referenceHeading);
    new ResizeObserver(renderChart).observe(chart);
    return { update(selectedPosition) {
      if (position === selectedPosition) return;
      position = selectedPosition;
      render();
    } };
  }
  window.FPARankTrend = { create };
})();
