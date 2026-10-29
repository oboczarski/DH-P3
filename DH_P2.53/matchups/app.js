/* Current-season matchups: FPFA defense summaries, FPF offenses and FPAv2 games. */
(() => {
  "use strict";
  // This copied dashboard owns only the integrated Matchups document.
  if (document.body?.dataset.page !== "matchups") return;
  const Data = window.FPAData, Charts = window.FPACharts, View = window.FPAChartLabData, $ = id => document.getElementById(id);
  const POSITIONS = ["QB", "RB", "WR", "TE", "ALL"];
  const COLORS = { QB: "#ffb2d8", RB: "#75e0b7", WR: "#63b0de", TE: "#ab9bff", ALL: "#aabaff" };
  const LABELS = { QB: "quarterbacks", RB: "running backs", WR: "wide receivers", TE: "tight ends", ALL: "all positions" };
  // Preserve the polar chart's division order. Defense pickers independently
  // alphabetize displayed team abbreviations within AFC and NFC at every width.
  const DIVISIONS = [
    { conf: "AFC", name: "East", teams: ["BUF", "MIA", "NE", "NYJ"] },
    { conf: "AFC", name: "North", teams: ["BAL", "CIN", "CLE", "PIT"] },
    { conf: "AFC", name: "South", teams: ["HOU", "IND", "JAX", "TEN"] },
    { conf: "AFC", name: "West", teams: ["DEN", "KC", "LV", "LAC"] },
    { conf: "NFC", name: "East", teams: ["DAL", "NYG", "PHI", "WAS"] },
    { conf: "NFC", name: "North", teams: ["CHI", "DET", "GB", "MIN"] },
    { conf: "NFC", name: "South", teams: ["ATL", "CAR", "NO", "TB"] },
    { conf: "NFC", name: "West", teams: ["ARI", "LAR", "SF", "SEA"] },
  ];
  const TEAM_GLOWS = {
    ARI: "rgba(151,35,63,.95)", ATL: "rgba(255,56,95,.93)", BAL: "rgba(158,43,246,.95)", BUF: "rgba(198,12,48,.93)",
    CAR: "rgba(0,133,202,.95)", CHI: "rgba(120,90,240,.93)", CIN: "rgba(251,79,20,.95)", CLE: "rgba(225,135,0,.68)",
    DAL: "rgba(134,147,151,.86)", DEN: "rgba(251,79,20,.93)", DET: "rgba(0,183,235,.86)", GB: "rgba(0,235,150,.68)",
    HOU: "rgba(167,25,48,.95)", IND: "rgba(0,183,235,.93)", JAX: "rgba(0,103,120,.95)", KC: "rgba(255,0,64,.84)",
    LAC: "rgba(0,191,255,.74)", LAR: "rgba(0,91,200,.93)", LV: "rgba(165,172,175,.86)", MIA: "rgba(0,142,151,.93)",
    MIN: "rgba(115,0,255,.95)", NE: "rgba(255,56,95,.93)", NO: "rgba(160,148,101,.86)", NYG: "rgba(55,56,200,.95)",
    NYJ: "rgba(64,160,120,.95)", PHI: "rgba(43,140,78,.95)", PIT: "rgba(255,182,18,.61)", SEA: "rgba(105,190,40,.86)",
    SF: "rgba(179,153,93,.74)", TB: "rgba(247,122,97,.74)", TEN: "rgba(75,146,219,.95)", WAS: "rgba(180,36,36,.95)",
  };
  const VENUES = { all: "All games", home: "At home", away: "On the road" };
  const pickerRoots = [...document.querySelectorAll("[data-picker-kind]")];
  const state = { team: "BAL", pos: "QB", venue: "all", mode: "points", query: "", hideZero: true,
    heatSort: { pos: "QB", direction: "desc" }, playerSort: { key: "week", direction: "desc", activeKey: null, step: 0 } };
  let model = null, summary = null, offenses = null, analysis = null, openPicker = null;
  const tooltips = new Map();

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const fmt = (value, digits = 2) => value !== null && Number.isFinite(value) ? value.toFixed(digits) : "—";
  const signed = (value, digits = 1) => value === null ? "—" : `${value > 0 ? "+" : ""}${fmt(Math.abs(value) < 1e-9 ? 0 : value, digits)}`;
  const logo = team => team ? `<img src="assets/NFL-Tags_webp/${team.toLowerCase()}.webp" alt="" width="24" height="24">` : "";
  const venueLabel = () => state.venue === "home" ? "Defense at home" : state.venue === "away" ? "Defense away" : "All games";
  const weekLabel = () => model.minWeek === model.maxWeek ? `Week ${model.maxWeek}` : `Weeks ${model.minWeek}–${model.maxWeek}`;
  const comparison = team => analysis.byTeam.get(team || state.team).metrics[state.pos];
  const direction = value => value > 0 ? "is-easy" : value < 0 ? "is-tough" : "";
  const empty = (title, detail) => `<div class="emptyState"><strong>${esc(title)}</strong>${esc(detail)}</div>`;

  // The defense heading displays the defense-strength rank as an ordinal. Missing
  // ranks stay unavailable; 11th/12th/13th retain "th" despite their last digit.
  function ordinalRank(rank) {
    if (!Number.isInteger(rank) || rank < 1) return "—";
    const lastTwo = rank % 100;
    const suffix = lastTwo >= 11 && lastTwo <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[rank % 10] || "th");
    return `${rank}${suffix}`;
  }

  function pickerLogo(team) {
    const image = `assets/NFL-Tags_webp/${team.toLowerCase()}.webp`;
    return `<span class="teamLogoStack" aria-hidden="true" style="--team-glow:${TEAM_GLOWS[team] || "transparent"}"><img class="teamLogo teamLogoStack__glow" src="${image}" alt=""><img class="teamLogo teamLogoStack__img" src="${image}" alt=""></span>`;
  }
  function buildPickers() {
    for (const root of pickerRoots) {
      const isTeam = root.dataset.pickerKind === "team", label = isTeam ? "Opponent defense" : "Defense venue";
      // Both Matchups defense controls use one conference menu on mobile and
      // desktop; full team names remain available in accessible labels/tooltips.
      const conferenceTeams = ["AFC", "NFC"].map(conference => {
        const teams = DIVISIONS.filter(division => division.conf === conference).flatMap(division => division.teams)
          .filter(team => model.defenses.includes(team)).sort();
        return `<div class="teamPickerConference" role="group" aria-label="${conference}">
          <div class="teamPickerConference__title"><img src="assets/NFL-Tags_webp/${conference.toLowerCase()}.webp" alt="">${conference}</div>
          ${teams.map(team => `<button type="button" class="teamOption" role="option" aria-selected="false" tabindex="-1" data-picker-value="${team}" aria-label="${esc(Data.TEAM_NAMES[team])}" title="${esc(Data.TEAM_NAMES[team])}">${pickerLogo(team)}<span class="teamOption__code">${team}</span></button>`).join("")}</div>`;
      }).join("");
      const options = isTeam ? `<div class="teamPickerConferences">${conferenceTeams}</div>` :
        Object.entries(VENUES).map(([value, text]) => `<button type="button" class="teamOption venueOption" role="option" aria-selected="false" tabindex="-1" data-picker-value="${value}">${text}</button>`).join("");
      root.innerHTML = `<button type="button" class="teamPicker__btn" id="${root.id}Btn" data-picker-toggle="${root.id}" aria-haspopup="listbox" aria-expanded="false" aria-controls="${root.id}Panel" aria-label="${label}"><span class="teamPicker__left"></span><span class="teamPicker__chev" aria-hidden="true">▾</span></button><div class="teamPicker__panel" id="${root.id}Panel" popover="manual" role="listbox" aria-label="${label} options">${options}</div>`;
    }
  }
  function closePicker(restoreFocus = false) {
    if (!openPicker) return;
    const root = openPicker, panel = $(`${root.id}Panel`), button = $(`${root.id}Btn`);
    openPicker = null; panel.hidePopover(); root.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    if (restoreFocus) button.focus({ preventScroll: true });
  }
  function focusPickerOption(option) {
    if (!option) return;
    option.focus({ preventScroll: true });
    const panel = option.closest(".teamPicker__panel"), box = option.getBoundingClientRect(), bounds = panel.getBoundingClientRect();
    if (box.top < bounds.top + 10) panel.scrollTop -= bounds.top + 10 - box.top;
    else if (box.bottom > bounds.bottom - 10) panel.scrollTop += box.bottom - bounds.bottom + 10;
  }
  function showPicker(root, last = false) {
    closePicker();
    const panel = $(`${root.id}Panel`), button = $(`${root.id}Btn`);
    panel.showPopover(); root.classList.add("is-open"); button.setAttribute("aria-expanded", "true"); openPicker = root;
    const anchor = button.getBoundingClientRect(), padding = 8, gap = 6;
    const viewportWidth = document.documentElement.clientWidth, viewportHeight = innerHeight;
    panel.style.maxHeight = `${Math.max(36, viewportHeight - padding * 2)}px`;
    const box = panel.getBoundingClientRect();
    panel.style.left = `${Math.max(padding, Math.min(anchor.left, viewportWidth - box.width - padding))}px`;
    const below = viewportHeight - anchor.bottom - gap - padding, above = anchor.top - gap - padding;
    const placeAbove = box.height > below && above > below;
    panel.style.maxHeight = `${Math.max(36, placeAbove ? above : below)}px`;
    panel.style.top = `${placeAbove ? Math.max(padding, anchor.top - gap - Math.min(box.height, above)) : anchor.bottom + gap}px`;
    const options = [...panel.querySelectorAll("[data-picker-value]")].filter(option => option.getClientRects().length);
    const selected = options.find(option => option.getAttribute("aria-selected") === "true");
    focusPickerOption(last ? options.at(-1) : selected || options[0]);
  }
  function pickerKeys(event) {
    const root = event.target.closest("[data-picker-kind]");
    if (!root || !model) return;
    if (!openPicker && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault(); showPicker(root, event.key === "ArrowUp"); return;
    }
    if (openPicker !== root) return;
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closePicker(true); return; }
    if (event.key === "Tab") { closePicker(true); return; }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const options = [...$(`${root.id}Panel`).querySelectorAll("[data-picker-value]")].filter(option => option.getClientRects().length);
    const index = options.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length;
    focusPickerOption(options[next]);
  }

  // Defense and SOS displays share the tested color scale but retain their own
  // rank direction; reversing a defense's displayed number preserves its color.
  const heatColor = View.rankColor;

  // Keep only current matchup selection in the URL. Removed week-range controls
  // and saved uploads cannot carry an old dataset or recent window into this app.
  function readURL() {
    const params = new URLSearchParams(location.search);
    if (model.defenses.includes(params.get("team"))) state.team = params.get("team");
    else if (!model.defenses.includes(state.team)) state.team = model.defenses[0];
    if (POSITIONS.includes(params.get("pos"))) state.pos = params.get("pos");
    if (["all", "home", "away"].includes(params.get("venue"))) state.venue = params.get("venue");
    state.heatSort.pos = state.pos;
  }
  function saveURL() {
    const url = new URL(location.href);
    for (const key of ["team", "pos", "venue"]) url.searchParams.set(key, state[key]);
    for (const key of ["range", "recent", "from", "to"]) url.searchParams.delete(key);
    try { history.replaceState(null, "", url); } catch { /* Some direct-file browsers restrict history. */ }
  }
  function syncControls() {
    for (const root of pickerRoots) {
      const isTeam = root.dataset.pickerKind === "team", value = isTeam ? state.team : state.venue;
      const button = $(`${root.id}Btn`);
      button.querySelector(".teamPicker__left").innerHTML = isTeam ? `${pickerLogo(value)}<span class="teamPicker__code">${value}</span>` : `<span class="venueMenuLabel">${VENUES[value]}</span>`;
      button.setAttribute("aria-label", isTeam ? `Opponent defense: ${Data.TEAM_NAMES[value]}` : `Defense venue: ${venueLabel()}`);
      root.querySelectorAll("[data-picker-value]").forEach(option => {
        const selected = option.dataset.pickerValue === value;
        option.classList.toggle("is-selected", selected); option.setAttribute("aria-selected", String(selected));
      });
    }
    document.querySelectorAll("[data-position]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.position === state.pos)));
    document.documentElement.style.setProperty("--position", COLORS[state.pos]);
  }
  function render() {
    if (!model) return;
    analysis = Data.matchupAnalysis(model, summary, { venue: state.venue }, offenses);
    syncControls(); tooltips.clear(); hideTooltip();
    $("coverage").innerHTML = `<strong>${weekLabel()}</strong> · ${model.defenses.length} defenses · ${model.audit.usedRows.toLocaleString("en-US")} player records`;
    $("scopeNote").textContent = `Season to date · ${weekLabel()}`;
    $("footerCoverage").textContent = `2026 · ${weekLabel()} · PPR`;
    renderProfile(); renderWeekly(); renderPlayers(); renderScatter(); renderOpponents(); renderHeatmap();
    $("analysis").setAttribute("aria-busy", "false"); saveURL();
    // Additive chart views consume the current analysis and share its selection.
    // Their deferred library/bootstrap never blocks the existing dashboard render.
    window.FPAChartContext = { analysis, team: state.team, pos: state.pos, venue: state.venue,
      divisions: DIVISIONS, positionColor: COLORS[state.pos], select: choose, heatColor };
    window.FPAChartLab?.update(window.FPAChartContext);
  }
  function renderProfile() {
    const c = comparison(), stat = View.defenseMetric(c.actual);
    $("defenseLogo").innerHTML = logo(state.team);
    $("defenseTitle").textContent = Data.TEAM_NAMES[state.team];
    $("defenseSubtitle").textContent = `vs. ${LABELS[state.pos]} · ${venueLabel()}`;
    $("selectedPosition").textContent = state.pos; $("selectedPosition").dataset.pos = state.pos;
    // Mirror RANK's defense-strength rank for this team/position/venue. Keep
    // the existing styled position badge as the final part of "14th vs. QB".
    $("defenseRank").textContent = `${ordinalRank(stat.rank)} vs.`;
    $("defenseRank").title = `Defense rank vs. ${LABELS[state.pos]} · ${venueLabel()} · Rank 1 = best defense / fewest FPA per game`;
    // Summary copy controls its own case; the percent unit is sized separately.
    const deltaValue = c.deltaPct !== null ? `${signed(c.deltaPct)}<span class="metricPercent">%</span>` : signed(c.delta, 2);
    const baselineNote = c.expectedTotal !== null ? `${fmt(c.expectedAvg, 1)} per game` : analysis.summaryAvailable ? "Not supplied in FPFA" : "Opponent average unavailable";
    // The SOS card keeps the positional season vRK and its low-rank/easy color
    // direction. Defense-rank reversal never applies to schedule or offense ranks.
    // CSS switches the mobile spans to one-decimal Actual FPA and shorter notes;
    // desktop text and every underlying comparison retain their existing precision.
    const sosColor = heatColor({ rank: c.sosRank, pool: Data.TEAMS.length, rankOrder: "descending" });
    $("metrics").innerHTML = `
      <div class="metric"><div class="metricLabel">ACTUAL FPA</div><div class="metricValue"><span class="metricDesktop">${fmt(stat.total)}</span><span class="metricMobile">${fmt(stat.total, 1)}</span></div><div class="metricSub">${fmt(stat.avg, 1)} per game</div></div>
      <div class="metric"><div class="metricLabel">EXPECTED FPA</div><div class="metricValue">${fmt(c.expectedTotal, 1)}</div><div class="metricSub">${baselineNote}</div></div>
      <div class="metric"><div class="metricLabel">vs EXPECTED</div><div class="metricValue ${direction(c.delta)}">${deltaValue}</div><div class="metricSub">${c.delta === null ? "Comparison unavailable" : `${signed(c.delta, 2)} points`}</div></div>
      <div class="metric"><div class="metricLabel" title="Defense rank: 1 = best defense / fewest FPA per game">RANK</div><div class="metricValue" style="color:${heatColor(stat)}">${stat.rank ?? "—"}${stat.rank === null ? "" : `<small>/ ${stat.pool}</small>`}</div><div class="metricSub"><span class="metricDesktop">${stat.games} recorded game${stat.games === 1 ? "" : "s"}</span><span class="metricMobile">${stat.games} game${stat.games === 1 ? "" : "s"}</span></div></div>
      <div class="metric metric--sos" title="Season-to-date strength of opponents already faced vs. ${LABELS[state.pos]}. FPFA ${state.pos}vRK: 1 = easiest schedule, 32 = toughest. Applies to all games."><div class="metricLabel">SOS RK</div><div class="metricValue" style="color:${sosColor}">${c.sosRank ?? "—"}${c.sosRank === null ? "" : `<small>/ ${Data.TEAMS.length}</small>`}</div><div class="metricSub"><span class="metricDesktop">1 easy · 32 tough</span><span class="metricMobile">1 → 32</span></div></div>`;
  }
  function width(id) {
    const element = $(id), style = getComputedStyle(element);
    return Math.max(260, Math.round((element.clientWidth || 500) - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0)));
  }
  function scale(values) {
    const finite = values.filter(value => value !== null && Number.isFinite(value));
    let low = Math.min(0, ...finite), high = Math.max(0, ...finite);
    if (high - low < 1) high = low + 1;
    const rough = (high - low) / 4, magnitude = 10 ** Math.floor(Math.log10(rough));
    const step = ([1, 2, 5, 10].find(value => value * magnitude >= rough) || 10) * magnitude;
    low = Math.floor(low / step) * step; high = Math.ceil(high / step) * step;
    const ticks = [];
    for (let n = low; n <= high + step / 100; n += step) ticks.push(Math.abs(n) < 1e-9 ? 0 : n);
    return { low, high, ticks, step };
  }
  const tick = (value, bounds) => fmt(value, bounds.step ? Math.max(0, -Math.floor(Math.log10(bounds.step))) : 0);
  const frame = (W, H, label, content) => `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(label)}">${content}</svg>`;

  // Each opponent's positional scoring average supplies its weekly expected line.
  function renderWeekly() {
    const entries = comparison().entries;
    // Matchups owns a single week track for its plot and opponent chips. The
    // same filtered entry order drives both; weeks remain in accessible chip
    // labels/tooltips while the visible W# is shown only on the chart axis.
    const timeline = $("weeklyTimelineContent");
    timeline.style.setProperty("--weekly-week-count", Math.max(1, entries.length));
    const W = width("weeklyChart"), H = 196, left = 31, right = W - 9, top = 22, bottom = H - 19;
    // Percentage insets mirror the SVG viewBox even at fractional CSS widths.
    // Zero grid gap keeps each chip center at the bar/week slot's exact center.
    timeline.style.setProperty("--weekly-plot-left", `${left / W * 100}%`);
    timeline.style.setProperty("--weekly-plot-right", `${(W - right) / W * 100}%`);
    $("weeklyMatchups").innerHTML = entries.map(entry => {
      const opponent = entry.offense ? `${entry.venue === "home" ? "vs" : "@"} ${entry.offense}` : "Offense unknown";
      const label = esc(`Week ${entry.week}: ${opponent}`);
      return `<div class="weekMatchup" role="group" aria-label="${label}" title="${label}"><span class="weekOpponentStack"><span class="weekOpponent">${esc(opponent)}</span>${logo(entry.offense)}</span></div>`;
    }).join("");
    if (!entries.some(entry => entry.actual !== null)) { $("weeklyChart").innerHTML = empty("No recorded games", "Choose another defense venue or position."); return; }
    const bounds = scale(entries.flatMap(entry => [entry.actual, entry.expected]));
    const y = value => bottom - (value - bounds.low) / (bounds.high - bounds.low) * (bottom - top);
    const slot = (right - left) / entries.length, x = index => left + slot * (index + .5), barWidth = Math.min(49, slot * .4);
    let content = `<defs><linearGradient id="weekly-bar" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${COLORS[state.pos]}" stop-opacity=".83"/><stop offset="1" stop-color="${COLORS[state.pos]}" stop-opacity=".24"/></linearGradient><linearGradient id="weekly-expected-line" gradientUnits="userSpaceOnUse" x1="${left}" y1="0" x2="${right}" y2="0"><stop stop-color="#8af7ff" stop-opacity=".71"/><stop offset="1" stop-color="#e3b3ff" stop-opacity=".66"/></linearGradient></defs>`;
    content += bounds.ticks.map(n => `<line class="${n === 0 ? "zeroLine" : "gridLine"}" x1="${left}" x2="${right}" y1="${y(n)}" y2="${y(n)}"/><text x="${left - 6}" y="${y(n) + 3}" text-anchor="end">${tick(n, bounds)}</text>`).join("");
    let segment = [];
    const finish = () => {
      if (segment.length > 1) content += `<polyline class="expectedLine" points="${segment.join(" ")}"/>`;
      segment = [];
    };
    entries.forEach((entry, i) => {
      if (entry.expected === null) finish(); else segment.push(`${x(i)},${y(entry.expected)}`);
    }); finish();
    let labels = "";
    entries.forEach((entry, i) => {
      const key = `week:${entry.week}`;
      tooltips.set(key, `<strong>${state.team} vs. ${state.pos} · Week ${entry.week}</strong><br>Actual: ${fmt(entry.actual)} PPR points<br>Expected: ${fmt(entry.expected, 1)} · ${entry.offense || "Opponent"} season average<br>Offense rank: ${entry.offenseRank === null ? "—" : `#${entry.offenseRank}`}<br><span class="tooltipMuted">${entry.venue === "home" ? "Defense at home" : "Defense away"}</span>`);
      if (entry.actual !== null) {
        const labelY = entry.actual >= 0 ? y(entry.actual) - 7 : Math.min(bottom - 6, y(entry.actual) + 13);
        content += `<g class="chartPoint" role="img" tabindex="0" data-tooltip="${key}" aria-label="Week ${entry.week}: ${fmt(entry.actual)} actual, ${fmt(entry.expected, 1)} expected ${state.pos} points"><rect x="${x(i) - barWidth / 2}" y="${Math.min(y(0), y(entry.actual))}" width="${barWidth}" height="${Math.max(2, Math.abs(y(entry.actual) - y(0)))}" rx="4" fill="url(#weekly-bar)"/></g>`;
        labels += `<text class="chartValue" x="${x(i)}" y="${labelY}" text-anchor="middle">${fmt(entry.actual, 1)}</text>`;
      }
      const delta = entry.actual !== null && entry.expected !== null ? entry.actual - entry.expected : 0;
      const expectedFill = delta > 1e-9 ? "#8af7ffb5" : delta < -1e-9 ? "#e3b3ffa8" : "#aabaff";
      if (entry.expected !== null) content += `<circle class="chartPoint" cx="${x(i)}" cy="${y(entry.expected)}" r="3" style="fill:${expectedFill}" tabindex="0" role="img" data-tooltip="${key}" aria-label="${entry.offense || "Opponent"} expected Week ${entry.week} ${state.pos}: ${fmt(entry.expected, 1)} points"/>`;
      // The shared track provides room for every week label, including long
      // seasons; skipping alternate ticks would leave chips without a label.
      content += `<text x="${x(i)}" y="${bottom + 14}" text-anchor="middle">W${entry.week}</text>`;
    });
    // SVG paint order puts this unfiltered label layer above bars, lines and dots.
    content += `<g class="weeklyDataLabels" aria-hidden="true" pointer-events="none">${labels}</g>`;
    $("weeklyChart").innerHTML = frame(W, H, `${state.team} ${state.pos}: actual weekly totals versus opposing offense averages`, content);
  }

  // Both scatter modes describe per-game defense quality. Points divide the
  // original totals by games played; defense ranks reverse only the displayed matchup
  // number, while published SOS stays intact. Venue expected ranks use averages.
  function renderScatter() {
    document.querySelectorAll("[data-scatter-mode]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.scatterMode === state.mode)));
    const ranked = state.mode === "rank";
    const seasonRanks = ranked && analysis.summaryAvailable;
    const points = View.scatterRows(analysis, state.pos).map(point => ({ ...point,
      x: ranked ? point.expectedRank : point.expectedAvg, y: ranked ? point.actual.rank : point.actual.avg,
    })).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));
    renderScatterDetail(state.team);
    $("comparisonNote").textContent = ranked ? `${seasonRanks ? "Defense rank: 1 = best · SOS: 1 = easiest schedule" : "Defense rank: 1 = fewest FPA/game · Expected rank: 1 = lowest opponent average"}. ${points.length} comparable defenses. Select a logo.` : `Per-game averages · Above the line = more FPA/game than expected. ${points.length} comparable defenses. Select a logo.`;
    if (!points.length) { $("comparisonChart").innerHTML = empty("No complete comparisons", analysis.unavailableReason); return; }
    const W = width("comparisonChart"), H = innerWidth <= 620 ? 320 : 330, left = 43, right = W - 16, top = 18, bottom = H - 34;
    const pool = Data.TEAMS.length;
    const rankBounds = { low: 0, high: Math.max(2, pool + 1), ticks: [...new Set([1, Math.ceil(pool / 4), Math.ceil(pool / 2), Math.ceil(pool * 3 / 4), pool])] };
    const xBounds = ranked ? rankBounds : Charts.pointBounds(points.map(point => point.x));
    const yBounds = ranked ? rankBounds : Charts.pointBounds(points.map(point => point.y));
    const x = value => left + (value - xBounds.low) / (xBounds.high - xBounds.low) * (right - left);
    const y = value => bottom - (value - yBounds.low) / (yBounds.high - yBounds.low) * (bottom - top);
    const geometry = Charts.comparisonGeometry(xBounds, yBounds);
    const polygon = (vertices, color) => vertices.length < 3 ? "" : `<polygon points="${vertices.map(([a, b]) => `${x(a)},${y(b)}`).join(" ")}" fill="${color}" fill-opacity=".025"/>`;
    // A larger defense rank now means more permissive defense. In both modes,
    // the region above the baseline is easier/green and below is tougher/pink.
    let content = polygon(geometry.above, "#75e0b7") + polygon(geometry.below, "#ffb2d8");
    // FPA vs Expected tick labels sit 5px farther right and 4px higher on both
    // layouts; only label offsets change, preserving the plot and axis titles.
    content += yBounds.ticks.map(n => `<line class="gridLine" x1="${left}" x2="${right}" y1="${y(n)}" y2="${y(n)}"/><text x="${left - 2}" y="${y(n) + 3}" text-anchor="end">${tick(n, yBounds)}</text>`).join("");
    content += xBounds.ticks.map(n => `<line class="gridLine" x1="${x(n)}" x2="${x(n)}" y1="${top}" y2="${bottom}"/><text x="${x(n)}" y="${bottom + 9}" text-anchor="middle">${tick(n, xBounds)}</text>`).join("");
    if (geometry.equality.length) {
      const [a, b] = geometry.equality;
      content += `<line x1="${x(a[0])}" y1="${y(a[1])}" x2="${x(b[0])}" y2="${y(b[1])}" stroke="#9eb0d9" stroke-opacity=".6" stroke-dasharray="4 4"/>`;
    }
    if (yBounds.high - 9 / (bottom - top) * (yBounds.high - yBounds.low) > xBounds.low + 5 / (right - left) * (xBounds.high - xBounds.low)) content += `<text class="zoneLabel" x="${left + 5}" y="${top + 9}">${ranked ? "Weaker Defense vs. Baseline" : "Above Expected FPA/Game"}</text>`;
    if (yBounds.low + 6 / (bottom - top) * (yBounds.high - yBounds.low) < xBounds.high - 5 / (right - left) * (xBounds.high - xBounds.low)) content += `<text class="zoneLabel" x="${right - 5}" y="${bottom - 6}" text-anchor="end">${ranked ? "Stronger Defense vs. Baseline" : "Below Expected FPA/Game"}</text>`;
    content += `<text class="axisTitle" x="${(left + right) / 2}" y="${H - 10}" text-anchor="middle">${ranked ? seasonRanks ? "SOS Rank · 1 = Easiest" : "Expected FPA/Game · Rank" : "Expected FPA · Points | [Opponent Weekly Avg.]"}</text><text class="axisTitle" transform="translate(19 ${(top + bottom) / 2}) rotate(-90)" text-anchor="middle">${ranked ? "Defense Rank · 1 = Best" : "Actual FPA · Points/Game"}</text>`;
    // This scatter alone uses smaller logos and bounded collision spacing at
    // both widths. Lay out before selection sorting so picking a team never
    // reshuffles the cluster; connectors retain each team's exact data anchor.
    // Point domains provide anchor padding; also keep collision-adjusted logos
    // fully inside the plot. Rank-mode spacing retains its existing bounds.
    const markerBounds = ranked ? { left, right, top, bottom } : { left: left + 11, right: right - 11, top: top + 11, bottom: bottom - 11 };
    const markers = Charts.spreadScatterPoints(points.map(point => ({ team: point.team, x: x(point.x), y: y(point.y) })), markerBounds);
    const markerByTeam = new Map(markers.map(marker => [marker.team, marker]));
    const moved = markers.filter(marker => Math.hypot(marker.displayX - marker.x, marker.displayY - marker.y) > 1);
    if (moved.length) {
      content += `<g class="scatterLeaders" aria-hidden="true" pointer-events="none" stroke="#9eb0d9" stroke-width=".8" stroke-opacity=".45">${moved.map(marker => `<line x1="${marker.x}" y1="${marker.y}" x2="${marker.displayX}" y2="${marker.displayY}"/><circle cx="${marker.x}" cy="${marker.y}" r="1.4" fill="#9eb0d9" fill-opacity=".55" stroke="none"/>`).join("")}</g>`;
      $("comparisonNote").textContent += " Crowded logos are nudged slightly; connectors mark exact values.";
    }
    points.sort((a, b) => Number(a.team === state.team) - Number(b.team === state.team)).forEach(point => {
      const c = point.c, selected = point.team === state.team, key = `scatter:${point.team}`;
      const marker = markerByTeam.get(point.team);
      // Scatter readouts round only for display, to one decimal. Plot coordinates
      // and axis domains continue using the precise total/game calculations.
      tooltips.set(key, `<strong>${esc(Data.TEAM_NAMES[point.team])} · ${state.pos}</strong><br>Expected: ${fmt(point.expectedAvg, 1)} PPR points/game<br>Actual: ${fmt(point.actual.avg, 1)} PPR points/game<br><span class="${direction(point.deltaAvg)}">${signed(point.deltaAvg, 1)} points/game versus expected</span><br><span class="tooltipMuted">${c.games} games · Defense rank ${point.actual.rank ?? "—"} (1 = best)${ranked ? ` · ${seasonRanks ? "SOS" : "Expected FPA/game"} rank ${point.expectedRank}` : ""}</span>`);
      content += `<g class="chartPoint" role="button" tabindex="0" aria-pressed="${selected}" data-chart-team="${point.team}" data-tooltip="${key}" aria-label="Explore ${point.team}: ${ranked && seasonRanks ? "SOS" : "expected"} ${fmt(point.x, ranked ? 0 : 1)}, ${ranked ? "defense rank" : "actual"} ${fmt(point.y, ranked ? 0 : 1)} ${ranked ? "" : "points/game"}"><circle cx="${marker.displayX}" cy="${marker.displayY}" r="${selected ? 10.5 : 8.5}" fill="#10182b" stroke="${selected ? COLORS[state.pos] : heatColor(point.actual)}" stroke-width="${selected ? 2 : .9}"/><image href="assets/NFL-Tags_webp/${point.team.toLowerCase()}.webp" x="${marker.displayX - 7}" y="${marker.displayY - 7}" width="14" height="14"/></g>`;
    });
    $("comparisonChart").innerHTML = frame(W, H, `${state.pos} ${ranked ? seasonRanks ? "SOS versus defense ranks" : "expected FPA/game versus defense ranks" : "expected versus actual FPA per game"}, ${venueLabel()}`, content);
  }
  function renderScatterDetail(team) {
    const point = View.scatterRows(analysis, state.pos).find(row => row.team === team), ranked = state.mode === "rank";
    const expected = ranked ? point.expectedRank === null ? "—" : `#${point.expectedRank}` : fmt(point.expectedAvg, 1);
    const actual = ranked ? point.actual.rank === null ? "—" : `#${point.actual.rank}` : fmt(point.actual.avg, 1);
    const delta = ranked ? point.actual.rank === null || point.expectedRank === null ? null : point.actual.rank - point.expectedRank : point.deltaAvg;
    const seasonRanks = ranked && analysis.summaryAvailable;
    $("comparisonDetail").innerHTML = `<span class="comparisonTeam">${logo(team)}<strong>${team}</strong></span><span>${ranked ? seasonRanks ? "SOS" : "Expected" : "Expected/game"} <strong>${expected}</strong></span><span>${ranked ? "Defense" : "Actual/game"} <strong>${actual}</strong></span><span class="${direction(delta)}">${signed(delta, ranked ? 0 : 1)} ${ranked ? "ranks" : "pts/game"}</span>`;
  }
  function renderOpponents() {
    const c = comparison();
    // Layout-only preview row: never add it to the analysis or matchup entries.
    const placeholder = c.entries.some(entry => entry.week === 4) ? "" : '<tr class="opponentPlaceholder" aria-label="Week 4 layout placeholder; no matchup or scoring data"><td>W4</td><td><span class="offenseCell"><i class="placeholderLogo" aria-hidden="true"></i>Placeholder</span></td><td>—</td><td>—</td><td>—</td><td>—</td></tr>';
    $("opponentsScope").textContent = `${state.team} · ${state.pos}`;
    $("opponentsTable").innerHTML = `<caption class="srOnly">${state.team} opposing offenses, supplied ${state.pos} scoring averages and actual FPA</caption><thead><tr><th>Wk</th><th>Offense</th><th title="FPF offense position rank; 1 is the most points scored">Off. rank</th><th title="Supplied FPF average, counted once for this game">Expected</th><th>Actual</th><th>Δ FPA</th></tr></thead><tbody>${c.entries.length ? c.entries.map(entry => {
      const delta = entry.actual !== null && entry.expected !== null ? (Math.round(entry.actual * 100) - Math.round(entry.expected * 100)) / 100 : null;
      return `<tr><td>W${entry.week}</td><td><span class="offenseCell" title="${esc(Data.TEAM_NAMES[entry.offense] || "Offense unavailable")}">${logo(entry.offense)}${entry.offense || "—"}</span></td><td>${entry.offenseRank === null ? "—" : `#${entry.offenseRank}`}</td><td>${fmt(entry.expected, 1)}</td><td>${fmt(entry.actual)}</td><td class="${direction(delta)}">${signed(delta)}</td></tr>`;
    }).join("") : '<tr><td colspan="6">No recorded games in this venue.</td></tr>'}${placeholder}</tbody>`;
  }
  function renderHeatmap() {
    $("heatRankNote").textContent = "Rank 1 = best defense / fewest FPA per game";
    document.querySelectorAll("[data-heat-order]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.heatOrder === state.heatSort.pos)));
    const sorted = [...analysis.actual.rows].sort((a, b) => {
      const first = a.metrics[state.heatSort.pos].avg, second = b.metrics[state.heatSort.pos].avg;
      if (first === null || second === null) return first === second ? a.team.localeCompare(b.team) : first === null ? 1 : -1;
      return (state.heatSort.direction === "desc" ? second - first : first - second) || a.team.localeCompare(b.team);
    });
    const head = POSITIONS.map(pos => `<th scope="col" data-pos="${pos}" aria-sort="${state.heatSort.pos === pos ? state.heatSort.direction === "desc" ? "descending" : "ascending" : "none"}"><button type="button" data-heat-sort="${pos}" aria-label="Sort defenses by ${pos} FPA per game">${pos}${state.heatSort.pos === pos ? `<span class="sortArrow">${state.heatSort.direction === "desc" ? "↓" : "↑"}</span>` : ""}</button></th>`).join("");
    const body = sorted.map(row => `<tr class="${row.team === state.team ? "selectedTeam" : ""}"><td><button type="button" class="heatTeamButton" data-team="${row.team}" aria-label="Explore ${esc(Data.TEAM_NAMES[row.team])}">${logo(row.team)}${row.team}</button></td>${POSITIONS.map(pos => {
      const stat = View.defenseMetric(row.metrics[pos]);
      return `<td><button type="button" class="heatCell" data-team="${row.team}" data-cell-position="${pos}" style="--heat-color:${heatColor(stat)}" aria-pressed="${row.team === state.team && state.pos === pos}" aria-label="${row.team} ${pos}: ${fmt(stat.avg)} FPA per game, defense rank ${stat.rank ?? "unavailable"} of ${stat.pool} (1 = best), ${stat.games} games"${stat.avg === null ? " disabled" : ""}>${fmt(stat.avg, 1)}${stat.rank === null ? "" : `<sup>#${stat.rank}</sup>`}</button></td>`;
    }).join("")}</tr>`).join("");
    $("heatTable").innerHTML = `<caption class="srOnly">2026 FPA per game and defense ranks, ${venueLabel()}</caption><thead><tr><th scope="col">DEF</th>${head}</tr></thead><tbody>${body}</tbody>`;
  }

  // The player list is directly below the bars and shares their matchup scope.
  // Search/hide-zero/sort only change records displayed, never FPA aggregates.
  // Players faced and its expanded table share a three-click cycle. The third
  // click restores latest week, highest exact score, then player-name order;
  // display rounding never changes the score used to sort or total records.
  function cyclePlayerSort(key) {
    const step = state.playerSort.activeKey === key ? state.playerSort.step + 1 : 1;
    const firstDirection = key === "pts" ? "desc" : "asc";
    state.playerSort = step === 3 ? { key: "week", direction: "desc", activeKey: null, step: 0 } :
      { key, direction: step === 1 ? firstDirection : firstDirection === "desc" ? "asc" : "desc", activeKey: key, step };
  }
  function selectedPlayers() {
    const getters = { week: row => row.week, player: row => row.player, team: row => row.playerTeam || "", vs: row => row.vs, pts: row => row.cents };
    const sort = state.playerSort;
    return Data.selectResults(model, { team: state.team, pos: state.pos, venue: state.venue, query: state.query, hideZero: state.hideZero, minPoints: state.hideZero ? 1 : null }).sort((a, b) => {
      const first = getters[sort.key](a), second = getters[sort.key](b);
      const difference = typeof first === "string" ? first.localeCompare(second) : first - second;
      return (sort.direction === "asc" ? difference : -difference) || b.week - a.week || b.cents - a.cents || a.player.localeCompare(b.player);
    });
  }
  function playersTable(rows) {
    const columns = [["week", "Wk", ""], ["player", "Player", ""], ["team", "Offense", "offenseColumn"], ["vs", "Player VS", ""], ["pts", "PPR", ""]];
    const head = columns.map(([key, label, className]) => `<th class="${className}" scope="col" aria-sort="${state.playerSort.key === key ? state.playerSort.direction === "desc" ? "descending" : "ascending" : "none"}"><button type="button" data-player-sort="${key}" aria-label="Sort players by ${label}">${label}${state.playerSort.key === key ? `<span class="sortArrow">${state.playerSort.direction === "desc" ? "↓" : "↑"}</span>` : ""}</button></th>`).join("");
    const body = rows.length ? rows.map(row => `<tr><td>W${row.week}</td><td>${state.pos === "ALL" ? `<span class="playerPosition" data-pos="${row.pos}">${row.pos}</span>` : ""}<span class="playerName">${esc(row.player)}</span></td><td class="offenseColumn"><span class="offenseCell" title="${esc(Data.TEAM_NAMES[row.playerTeam] || "Offense not supplied")}">${logo(row.playerTeam)}${row.playerTeam || "—"}</span></td><td><span class="playerOpponent">${esc(row.vs)}</span></td><td class="${row.cents < 0 ? "scoreNegative" : row.cents === 0 ? "scoreZero" : ""}">${fmt(row.pts, 1)}</td></tr>`).join("") : `<tr><td colspan="5">${empty("No matching player results", "Change the matchup or clear the player filters.")}<div class="emptyState"><button type="button" data-clear-search>Clear player filters</button></div></td></tr>`;
    return `<caption class="srOnly">${state.pos} recorded player scores against ${state.team}, ${weekLabel()}, ${venueLabel()}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody>`;
  }
  function renderPlayers() {
    const rows = selectedPlayers(), total = rows.reduce((sum, row) => sum + row.cents, 0) / 100;
    $("playerScope").textContent = `${state.team} · ${state.pos}`;
    for (const id of ["playerSearch", "expandedSearch"]) if ($(id).value !== state.query) $(id).value = state.query;
    for (const id of ["hideZero", "expandedHideZero"]) $(id).checked = state.hideZero;
    $("playerTable").innerHTML = playersTable(rows);
    $("expandedSubtitle").textContent = `${Data.TEAM_NAMES[state.team]} defense vs. ${LABELS[state.pos]} · ${venueLabel()}`;
    if ($("playersDialog").open) $("expandedTable").innerHTML = playersTable(rows);
    const label = `${rows.length} player record${rows.length === 1 ? "" : "s"}${state.hideZero ? " · scores below 1 hidden" : ""}`;
    $("playerCount").textContent = label; $("expandedCount").textContent = label;
    $("playerTotal").textContent = `${fmt(total, 1)} displayed PPR points`;
  }
  function choose(team, pos = state.pos) {
    if (!model.defenses.includes(team) || !POSITIONS.includes(pos)) return;
    if (state.team !== team || state.pos !== pos) state.query = "";
    state.team = team; state.pos = pos; render();
  }
  function hideTooltip() { $("chartTooltip").hidden = true; }
  function showTooltip(target, event) {
    const text = tooltips.get(target.dataset.tooltip);
    if (!text) return;
    const tip = $("chartTooltip"); tip.innerHTML = text; tip.hidden = false;
    const box = target.getBoundingClientRect(), x = event?.clientX ?? box.left + box.width / 2, y = event?.clientY ?? box.top + box.height / 2;
    tip.style.left = `${Math.max(8, Math.min(innerWidth - tip.offsetWidth - 8, x + 10))}px`;
    tip.style.top = `${Math.max(8, Math.min(innerHeight - tip.offsetHeight - 8, y + 13))}px`;
    renderScatterDetail(target.dataset.chartTeam || state.team);
  }
  // Matchups keeps its LeagueHub-style navigation independent of matchup loads
  // and shared DH handlers. Native popover supplies light dismissal; keyboard
  // movement and viewport placement keep the More links accessible on phones.
  function bindNavigation() {
    const button = $("matchupsMoreButton"), menu = $("matchupsMoreMenu");
    if (!button || !menu) return;
    const links = [...menu.querySelectorAll("a")];
    menu.addEventListener("beforetoggle", event => {
      if (event.newState !== "open") return;
      closePicker(); hideTooltip();
      const bounds = button.getBoundingClientRect(), viewport = document.documentElement.clientWidth;
      const menuWidth = Math.min(168, viewport - 24), top = bounds.bottom + 6;
      menu.style.left = `${Math.max(8, Math.min(bounds.right - menuWidth, viewport - menuWidth - 8))}px`;
      menu.style.top = `${top}px`;
      menu.style.maxHeight = `${Math.max(38, innerHeight - top - 8)}px`;
    });
    menu.addEventListener("toggle", () => button.setAttribute("aria-expanded", String(menu.matches(":popover-open"))));
    button.addEventListener("keydown", event => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      if (!menu.matches(":popover-open")) button.click();
      (event.key === "ArrowUp" ? links.at(-1) : links[0]).focus({ preventScroll:true });
    });
    menu.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault(); menu.hidePopover(); button.focus({ preventScroll:true }); return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const index = links.indexOf(document.activeElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + links.length) % links.length;
      links[next].focus({ preventScroll:true });
    });
    window.addEventListener("resize", () => { if (menu.matches(":popover-open")) menu.hidePopover(); });
    document.addEventListener("scroll", event => { if (menu.matches(":popover-open") && !menu.contains(event.target)) menu.hidePopover(); }, true);
  }
  function bindEvents() {
    bindNavigation();
    for (const id of ["playerSearch", "expandedSearch"]) $(id).addEventListener("input", event => { if (model) { state.query = event.target.value; renderPlayers(); } });
    for (const id of ["hideZero", "expandedHideZero"]) $(id).addEventListener("change", event => { if (model) { state.hideZero = event.target.checked; renderPlayers(); } });
    $("expandPlayers").addEventListener("click", () => {
      if (!model) return;
      closePicker(); hideTooltip(); $("playersDialog").showModal(); document.documentElement.style.overflow = "hidden"; renderPlayers();
    });
    $("playersDialog").addEventListener("close", () => { closePicker(); document.documentElement.style.overflow = ""; });
    $("playersDialog").addEventListener("cancel", event => { if (openPicker) { event.preventDefault(); closePicker(true); } });
    $("playersDialog").addEventListener("click", event => {
      const dialog = $("playersDialog"), box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    document.addEventListener("click", event => {
      if (openPicker && !openPicker.contains(event.target)) closePicker();
      const target = event.target.closest("button,[data-chart-team]");
      if (!target) return;
      if (target.hasAttribute("data-close-dialog")) { $("playersDialog").close(); return; }
      if (!model) return;
      if (target.dataset.pickerToggle) {
        const root = $(target.dataset.pickerToggle);
        if (openPicker === root) closePicker(true); else showPicker(root);
      } else if (target.dataset.pickerValue) {
        const root = target.closest("[data-picker-kind]"), value = target.dataset.pickerValue;
        closePicker(true);
        if (root.dataset.pickerKind === "team") choose(value);
        else { state.venue = value; render(); }
      } else if (target.dataset.position) choose(state.team, target.dataset.position);
      else if (target.dataset.team || target.dataset.chartTeam) choose(target.dataset.team || target.dataset.chartTeam, target.dataset.cellPosition || state.pos);
      else if (target.dataset.scatterMode) { state.mode = target.dataset.scatterMode; hideTooltip(); renderScatter(); }
      else if (target.dataset.heatOrder && POSITIONS.includes(target.dataset.heatOrder)) {
        state.heatSort = { pos: target.dataset.heatOrder, direction: "desc" }; renderHeatmap();
      }
      else if (target.dataset.heatSort) {
        state.heatSort.direction = state.heatSort.pos === target.dataset.heatSort && state.heatSort.direction === "desc" ? "asc" : "desc";
        state.heatSort.pos = target.dataset.heatSort; renderHeatmap();
      } else if (target.dataset.playerSort) {
        const key = target.dataset.playerSort;
        cyclePlayerSort(key); renderPlayers();
      } else if (target.hasAttribute("data-clear-search")) { state.query = ""; state.hideZero = false; renderPlayers(); }
    });
    document.addEventListener("keydown", event => {
      pickerKeys(event);
      if (event.key === "Escape") hideTooltip();
      const target = event.target.closest("[data-chart-team]");
      if (model && target && ["Enter", " "].includes(event.key)) { event.preventDefault(); choose(target.dataset.chartTeam); }
    });
    document.addEventListener("pointerover", event => { const target = event.target.closest("[data-tooltip]"); if (target) showTooltip(target, event); });
    document.addEventListener("pointerout", event => { if (event.target.closest("[data-tooltip]") && !event.relatedTarget?.closest?.("[data-tooltip]")) { hideTooltip(); if (model) renderScatterDetail(state.team); } });
    document.addEventListener("focusin", event => { const target = event.target.closest("[data-tooltip]"); if (target) showTooltip(target); else { hideTooltip(); if (model) renderScatterDetail(state.team); } });
    document.addEventListener("scroll", event => { hideTooltip(); if (openPicker && !$(`${openPicker.id}Panel`).contains(event.target)) closePicker(); }, true);
    let resizeTimer;
    window.addEventListener("resize", () => { clearTimeout(resizeTimer); closePicker(); hideTooltip(); resizeTimer = setTimeout(() => { if (model) { renderWeekly(); renderScatter(); } }, 120); });
    if (document.fonts?.ready) document.fonts.ready.then(() => { if (model) { renderWeekly(); renderScatter(); } });
  }
  async function init() {
    bindEvents();
    try {
      // Load the same workbook configuration as DH, with page-local source
      // state. Keep the original parsers and publish only a valid three-tab set.
      const { load2026MatchupSources } = await import("./data/2026-sheets.js?v=DH3.49-matchups-sheets");
      const sources = await load2026MatchupSources();
      if (!Data || sources?.season !== 2026 || !sources.weekly?.csv || !sources.summary?.csv || !sources.offense?.csv) throw new Error("The 2026 weekly, defense-summary and offense sources are unavailable.");
      const nextModel = Data.readSource(sources.weekly.csv, { name: sources.weekly.name });
      const nextSummary = Data.readFPFA(sources.summary.csv, { name: sources.summary.name });
      const nextOffenses = Data.readOffenses(sources.offense.csv, { name: sources.offense.name });
      model = nextModel; summary = nextSummary; offenses = nextOffenses; readURL();
      buildPickers();
      const differences = Data.summaryDifferences(model, summary);
      const repeatedExpectations = summary.rows.length > 0 && summary.rows.every(row => {
        const rb = row.metrics.RB, wr = row.metrics.WR;
        return rb.expectedTotal === wr.expectedTotal && rb.expectedAvg === wr.expectedAvg && rb.expectedRank === wr.expectedRank;
      });
      $("sourceNotes").textContent = `Live 2026-Wkly sheets: FPA (formerly FPAv2), FPFA and FPF. ${model.audit.excludedRows} rows without an opposing defense are excluded. ` +
        (differences.length ? "FPFA season totals and FPAv2 weekly totals differ beyond rounding for " + [...new Set(differences.map(row => row.team))].join(", ") + ". Each view preserves its source. " : "") +
        (repeatedExpectations ? "FPFA supplies identical RB and WR expected totals, averages, and ranks for every team; these are retained as provided. " : "") +
        "FPFA values stay intact; displayed season defense rank = 33 minus the published matchup rank. SOS and FPF offense ranks retain their supplied direction. The scatter divides actual and expected totals by games played and displays one decimal; the other average-based panels retain their published averages. Rounded positional averages may sum differently from the supplied ALL average.";
      render();
    } catch (error) {
      $("loadError").textContent = `Matchup data could not load: ${error.message}`; $("loadError").hidden = false;
      $("coverage").textContent = "2026 matchup data unavailable"; $("analysis").setAttribute("aria-busy", "false");
    }
  }
  init();
})();
