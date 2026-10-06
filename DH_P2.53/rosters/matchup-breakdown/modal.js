// Rosters-owned defense panel: retain the current panel renderer, chart geometry,
// tooltips, filters and player expansion in an isolated modal, with no Matchups imports.
import Data from './model.js?v=DH3.49d-matchups-mobile-nav-injuries';
import { createMatchupStore, resolveMatchupSelection } from './data.js?v=DH3.49d-matchups-mobile-nav-injuries';

export function createMatchupBreakdown({ onDataChange = () => {} } = {}) {
  if (document.body?.dataset.page !== 'rosters') throw new Error('Matchup Breakdown belongs to Rosters.');
  const store = createMatchupStore();
  const host = document.createElement('div');
  host.id = 'rosters-matchup-breakdown';
  const root = host.attachShadow({ mode: 'open' });
  document.body.append(host);
  const $ = id => root.getElementById(id);
  const assetUrl = team => new URL(`./assets/NFL-Tags_webp/${team.toLowerCase()}.webp`, import.meta.url).href;
  const POSITIONS = ["QB", "RB", "WR", "TE", "ALL"];
  const COLORS = { QB: "#ffb2d8", RB: "#75e0b7", WR: "#63b0de", TE: "#ab9bff", ALL: "#aabaff" };
  const LABELS = { QB: "quarterbacks", RB: "running backs", WR: "wide receivers", TE: "tight ends", ALL: "all positions" };
  // Restore the original division picker and its team-logo glow colors.
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
  let pickerRoots = [];
  const state = { team: 'BAL', pos: 'QB', venue: 'all', query: '', hideZero: true,
    playerSort: { key: 'week', direction: 'desc' } };
  let model = null, summary = null, offenses = null, analysis = null, openPicker = null;
  const tooltips = new Map();
  let mountPromise = null, preparationPromise = null, launch = 0, scrollState = null, triggerPlayerId = null;
  const images = [];

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const fmt = (value, digits = 2) => value !== null && Number.isFinite(value) ? value.toFixed(digits) : "—";
  const signed = (value, digits = 1) => value === null ? "—" : `${value > 0 ? "+" : ""}${fmt(Math.abs(value) < 1e-9 ? 0 : value, digits)}`;
  const logo = team => team ? `<img src="${assetUrl(team)}" alt="" width="24" height="24">` : "";
  const venueLabel = () => state.venue === "home" ? "Defense at home" : state.venue === "away" ? "Defense away" : "All games";
  const weekLabel = () => model.minWeek === model.maxWeek ? `Week ${model.maxWeek}` : `Weeks ${model.minWeek}–${model.maxWeek}`;
  const comparison = team => analysis.byTeam.get(team || state.team).metrics[state.pos];
  const direction = value => value > 0 ? "is-easy" : value < 0 ? "is-tough" : "";
  const empty = (title, detail) => `<div class="emptyState"><strong>${esc(title)}</strong>${esc(detail)}</div>`;

  function pickerLogo(team) {
    const image = `${assetUrl(team)}`;
    return `<span class="teamLogoStack" aria-hidden="true" style="--team-glow:${TEAM_GLOWS[team] || "transparent"}"><img class="teamLogo teamLogoStack__glow" src="${image}" alt=""><img class="teamLogo teamLogoStack__img" src="${image}" alt=""></span>`;
  }
  function buildPickers() {
    for (const root of pickerRoots) {
      const isTeam = root.dataset.pickerKind === "team", label = isTeam ? "Opponent defense" : "Defense venue";
      const options = isTeam ? DIVISIONS.map(division => `<div class="teamPickerDiv" role="group" aria-label="${division.conf} ${division.name}">
        <div class="teamPickerDiv__title" aria-hidden="true"><img class="teamPickerDiv__confLogo" src="${assetUrl(division.conf)}" alt=""><span>${division.name}</span></div>
        ${division.teams.filter(team => model.defenses.includes(team)).map(team => `<button type="button" class="teamOption" role="option" aria-selected="false" tabindex="-1" data-picker-value="${team}" aria-label="${esc(Data.TEAM_NAMES[team])}" title="${esc(Data.TEAM_NAMES[team])}">${pickerLogo(team)}<span class="teamOption__code">${team}</span></button>`).join("")}</div>`).join("") :
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
    const options = [...panel.querySelectorAll("[data-picker-value]")];
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
    const options = [...$(`${root.id}Panel`).querySelectorAll("[data-picker-value]")];
    const index = options.indexOf(host.shadowRoot.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length;
    focusPickerOption(options[next]);
  }

  function heatColor(stat) {
    if (stat.rank === null) return "#7b81a5";
    const normalized = stat.pool < 2 ? .5 : (stat.rank - 1) / (stat.pool - 1);
    const fraction = stat.rankOrder === "descending" ? 1 - normalized : normalized;
    const a = fraction <= .5 ? [255, 178, 216] : [171, 155, 255];
    const b = fraction <= .5 ? [171, 155, 255] : [117, 224, 183];
    const t = fraction <= .5 ? fraction * 2 : (fraction - .5) * 2;
    return "#" + a.map((value, i) => Math.round(value + (b[i] - value) * t).toString(16).padStart(2, "0")).join("");
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
    root.querySelectorAll("[data-position]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.position === state.pos)));
    host.style.setProperty("--position", COLORS[state.pos]);
  }
  function render() {
    if (!model) return;
    analysis = store.analysis(state.venue);
    syncControls(); tooltips.clear(); hideTooltip();
    $('scopeNote').textContent = `Season to date · ${weekLabel()}`;
    renderProfile(); renderWeekly(); renderPlayers();
    $('analysis').setAttribute('aria-busy', 'false');
  }
  function renderProfile() {
    const c = comparison(), stat = c.actual;
    $("defenseLogo").innerHTML = logo(state.team);
    $("defenseTitle").textContent = Data.TEAM_NAMES[state.team];
    $("defenseSubtitle").textContent = `vs. ${LABELS[state.pos]} · ${venueLabel()}`;
    $("selectedPosition").textContent = state.pos; $("selectedPosition").dataset.pos = state.pos;
    const deltaValue = c.deltaPct !== null ? `${signed(c.deltaPct)}%` : signed(c.delta, 2);
    const baselineNote = c.expectedTotal !== null ? `${fmt(c.expectedAvg, 1)} per game` : analysis.summaryAvailable ? "Not supplied in FPFA" : "Opponent average unavailable";
    // The SOS card uses the positional season vRK, with low ranks colored easy
    // like the published matchup ranks. It never reverses or re-ranks the feed.
    // CSS switches the mobile spans to one-decimal Actual FPA and shorter notes;
    // desktop text and every underlying comparison retain their existing precision.
    const sosColor = heatColor({ rank: c.sosRank, pool: Data.TEAMS.length, rankOrder: "descending" });
    $("metrics").innerHTML = `
      <div class="metric"><div class="metricLabel">Actual FPA</div><div class="metricValue"><span class="metricDesktop">${fmt(stat.total)}</span><span class="metricMobile">${fmt(stat.total, 1)}</span></div><div class="metricSub">${fmt(stat.avg, 1)} per game</div></div>
      <div class="metric"><div class="metricLabel">Expected FPA</div><div class="metricValue">${fmt(c.expectedTotal, 1)}</div><div class="metricSub">${baselineNote}</div></div>
      <div class="metric"><div class="metricLabel">Vs expected</div><div class="metricValue ${direction(c.delta)}">${deltaValue}</div><div class="metricSub">${c.delta === null ? "Comparison unavailable" : `${signed(c.delta, 2)} points`}</div></div>
      <div class="metric"><div class="metricLabel" title="Rank 1 = ${stat.rankOrder === "descending" ? "most" : "fewest"} points allowed">Matchup rank</div><div class="metricValue" style="color:${heatColor(stat)}">${stat.rank ?? "—"}${stat.rank === null ? "" : `<small>/ ${stat.pool}</small>`}</div><div class="metricSub"><span class="metricDesktop">${stat.games} recorded game${stat.games === 1 ? "" : "s"}</span><span class="metricMobile">${stat.games} game${stat.games === 1 ? "" : "s"}</span></div></div>
      <div class="metric metric--sos" title="Season-to-date strength of opponents already faced vs. ${LABELS[state.pos]}. FPFA ${state.pos}vRK: 1 = easiest schedule, 32 = toughest. Applies to all games."><div class="metricLabel">SOS Ranking</div><div class="metricValue" style="color:${sosColor}">${c.sosRank ?? "—"}${c.sosRank === null ? "" : `<small>/ ${Data.TEAMS.length}</small>`}</div><div class="metricSub"><span class="metricDesktop">1 easy · 32 tough</span><span class="metricMobile">1 → 32</span></div></div>`;
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
    // Rosters owns this matching chip layout: opponent logos sit below their
    // labels without changing weekly data or importing Matchups page files.
    $("weeklyMatchups").innerHTML = entries.map(entry => `<div class="weekMatchup"><span class="weekNumber">W${entry.week}</span><span class="weekOpponent">${entry.offense ? `${entry.venue === "home" ? "vs" : "@"} ${entry.offense}` : "Offense unknown"}</span>${logo(entry.offense)}</div>`).join("");
    if (!entries.some(entry => entry.actual !== null)) { $("weeklyChart").innerHTML = empty("No recorded games", "Choose another defense venue or position."); return; }
    const W = width("weeklyChart"), H = 196, left = 31, right = W - 9, top = 22, bottom = H - 19;
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
    entries.forEach((entry, i) => {
      const key = `week:${entry.week}`;
      tooltips.set(key, `<strong>${state.team} vs. ${state.pos} · Week ${entry.week}</strong><br>Actual: ${fmt(entry.actual)} PPR points<br>Expected: ${fmt(entry.expected, 1)} · ${entry.offense || "Opponent"} season average<br>Offense rank: ${entry.offenseRank === null ? "—" : `#${entry.offenseRank}`}<br><span class="tooltipMuted">${entry.venue === "home" ? "Defense at home" : "Defense away"}</span>`);
      if (entry.actual !== null) {
        const labelY = entry.actual >= 0 ? y(entry.actual) - 7 : Math.min(bottom - 6, y(entry.actual) + 13);
        content += `<g class="chartPoint" role="img" tabindex="0" data-tooltip="${key}" aria-label="Week ${entry.week}: ${fmt(entry.actual)} actual, ${fmt(entry.expected, 1)} expected ${state.pos} points"><rect x="${x(i) - barWidth / 2}" y="${Math.min(y(0), y(entry.actual))}" width="${barWidth}" height="${Math.max(2, Math.abs(y(entry.actual) - y(0)))}" rx="4" fill="url(#weekly-bar)"/><text class="chartValue" x="${x(i)}" y="${labelY}" text-anchor="middle">${fmt(entry.actual, 1)}</text></g>`;
      }
      const delta = entry.actual !== null && entry.expected !== null ? entry.actual - entry.expected : 0;
      const expectedFill = delta > 1e-9 ? "#8af7ffb5" : delta < -1e-9 ? "#e3b3ffa8" : "#aabaff";
      if (entry.expected !== null) content += `<circle class="chartPoint" cx="${x(i)}" cy="${y(entry.expected)}" r="3" style="fill:${expectedFill}" tabindex="0" role="img" data-tooltip="${key}" aria-label="${entry.offense || "Opponent"} expected Week ${entry.week} ${state.pos}: ${fmt(entry.expected, 1)} points"/>`;
      if (entries.length <= 10 || i % 2 === 0) content += `<text x="${x(i)}" y="${bottom + 14}" text-anchor="middle">W${entry.week}</text>`;
    });
    $("weeklyChart").innerHTML = frame(W, H, `${state.team} ${state.pos}: actual weekly totals versus opposing offense averages`, content);
  }

  // The player list is directly below the bars and shares their matchup scope.
  // Search/hide-zero/sort only change records displayed, never FPA aggregates.
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
    const body = rows.length ? rows.map(row => `<tr><td>W${row.week}</td><td>${state.pos === "ALL" ? `<span class="playerPosition" data-pos="${row.pos}">${row.pos}</span>` : ""}<span class="playerName">${esc(row.player)}</span></td><td class="offenseColumn"><span class="offenseCell" title="${esc(Data.TEAM_NAMES[row.playerTeam] || "Offense not supplied")}">${logo(row.playerTeam)}${row.playerTeam || "—"}</span></td><td><span class="playerOpponent">${esc(row.vs)}</span></td><td class="${row.cents < 0 ? "scoreNegative" : row.cents === 0 ? "scoreZero" : ""}">${fmt(row.pts)}</td></tr>`).join("") : `<tr><td colspan="5">${empty("No matching player results", "Change the matchup or clear the player filters.")}<div class="emptyState"><button type="button" data-clear-search>Clear player filters</button></div></td></tr>`;
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
    $("playerTotal").textContent = `${fmt(total)} displayed PPR points`;
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
  }

  function closeOnBackdrop(event, dialog) {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  }
  function bindEvents() {
    for (const id of ['playerSearch', 'expandedSearch']) $(id).addEventListener('input', event => {
      if (model) { state.query = event.target.value; renderPlayers(); }
    });
    for (const id of ['hideZero', 'expandedHideZero']) $(id).addEventListener('change', event => {
      if (model) { state.hideZero = event.target.checked; renderPlayers(); }
    });
    $('expandPlayers').addEventListener('click', () => {
      if (!model) return;
      closePicker(); hideTooltip(); $('playersDialog').showModal(); renderPlayers();
    });
    $('playersDialog').addEventListener('close', () => { closePicker(); hideTooltip(); });
    for (const id of ['playersDialog', 'breakdownDialog']) {
      const dialog = $(id);
      dialog.addEventListener('cancel', event => {
        hideTooltip();
        if (openPicker) { event.preventDefault(); closePicker(true); }
      });
      dialog.addEventListener('click', event => closeOnBackdrop(event, dialog));
    }
    $('breakdownDialog').addEventListener('close', () => {
      launch++; closePicker(); hideTooltip();
      if ($('playersDialog').open) $('playersDialog').close();
      // Native dialog traps focus. Restore the prior scroll locks, including
      // any lock held by another Rosters modal, rather than resetting blindly.
      if (scrollState) {
        document.documentElement.style.overflow = scrollState.html;
        document.body.style.overflow = scrollState.body;
        scrollState = null;
      }
      const trigger = [...document.querySelectorAll('[data-start-sit-matchup-id]')]
        .find(button => button.dataset.startSitMatchupId === triggerPlayerId);
      trigger?.focus({ preventScroll: true });
    });
    // Listen only inside this panel's shadow root. Its original data-position,
    // picker and sorting attributes cannot trigger another Rosters feature.
    root.addEventListener('click', event => {
      if (openPicker && !openPicker.contains(event.target)) closePicker();
      const target = event.target.closest('button');
      if (!target) return;
      if (target.hasAttribute('data-close-breakdown')) { close(); return; }
      if (target.hasAttribute('data-close-dialog')) { $('playersDialog').close(); return; }
      if (target.hasAttribute('data-retry-load')) { prepare().catch(() => {}); return; }
      if (!model) return;
      if (target.dataset.pickerToggle) {
        const picker = $(target.dataset.pickerToggle);
        if (openPicker === picker) closePicker(true); else showPicker(picker);
      } else if (target.dataset.pickerValue) {
        const picker = target.closest('[data-picker-kind]'), value = target.dataset.pickerValue;
        closePicker(true);
        if (picker.dataset.pickerKind === 'team') choose(value);
        else { state.venue = value; render(); }
      } else if (target.dataset.position) choose(state.team, target.dataset.position);
      else if (target.dataset.playerSort) {
        const key = target.dataset.playerSort;
        state.playerSort.direction = state.playerSort.key === key ? state.playerSort.direction === 'desc' ? 'asc' : 'desc' : ['week', 'pts'].includes(key) ? 'desc' : 'asc';
        state.playerSort.key = key; renderPlayers();
      } else if (target.hasAttribute('data-clear-search')) { state.query = ''; state.hideZero = false; renderPlayers(); }
    });
    root.addEventListener('keydown', event => {
      pickerKeys(event);
      if (event.key === 'Escape') hideTooltip();
      // Escape belongs to the top native dialog; existing player/comparison
      // modal handlers must not also close an underlying Rosters surface.
      if ($('breakdownDialog').open) event.stopPropagation();
    });
    root.addEventListener('pointerover', event => { const target = event.target.closest('[data-tooltip]'); if (target) showTooltip(target, event); });
    root.addEventListener('pointerout', event => {
      if (event.target.closest('[data-tooltip]') && !event.relatedTarget?.closest?.('[data-tooltip]')) hideTooltip();
    });
    root.addEventListener('focusin', event => { const target = event.target.closest('[data-tooltip]'); if (target) showTooltip(target); else hideTooltip(); });
    root.addEventListener('scroll', event => {
      hideTooltip();
      if (openPicker && !$(`${openPicker.id}Panel`).contains(event.target)) closePicker();
    }, true);
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer); closePicker(); hideTooltip();
      resizeTimer = setTimeout(() => { if (model && $('breakdownDialog').open) renderWeekly(); }, 120);
    });
    if (document.fonts?.ready) document.fonts.ready.then(() => {
      if (model && $('breakdownDialog').open) renderWeekly();
    });
  }

  function mount() {
    if (mountPromise) return mountPromise;
    mountPromise = (async () => {
      const response = await fetch(new URL('./panel.html?v=DH3.49d-matchups-mobile-nav-injuries', import.meta.url));
      if (!response.ok) throw new Error(`Matchup panel could not load (${response.status}).`);
      root.innerHTML = await response.text();
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = new URL('./matchup-brkdwn.css?v=DH3.49f-matchup-week-chips', import.meta.url).href;
      const styled = new Promise((resolve, reject) => {
        stylesheet.onload = resolve;
        stylesheet.onerror = () => reject(new Error('Matchup panel styling could not load.'));
      });
      root.prepend(stylesheet);
      // Match the original panel's Google Sans Flex without changing Rosters'
      // existing font variable or importing the Matchups document stylesheet.
      if (!document.getElementById('rosters-matchup-font')) {
        const font = document.createElement('link');
        font.id = 'rosters-matchup-font'; font.rel = 'stylesheet';
        font.href = 'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,GRAD,ROND@6..144,-10..0,25..151,1..1000,0..100,0..100&display=swap';
        document.head.append(font);
      }
      await styled;
      pickerRoots = [...root.querySelectorAll('[data-picker-kind]')];
      bindEvents();
    })().catch(error => { mountPromise = null; throw error; });
    return mountPromise;
  }

  function showLoading() {
    if (!$('loadStatus')) return;
    $('loadStatus').hidden = false;
    $('loadError').hidden = true;
    root.querySelector('[data-retry-load]').hidden = true;
    $('analysis').setAttribute('aria-busy', 'true');
  }
  function prepare() {
    if (preparationPromise) return preparationPromise;
    // The Start/Sit handler calls this before awaiting projections. Mounting,
    // fresh sheet reads, parsing and all three venue analyses run in advance.
    showLoading();
    preparationPromise = Promise.all([mount(), store.prepare()]).then(([, snapshot]) => {
      const firstLoad = !model;
      ({ model, summary, offenses } = snapshot);
      if (firstLoad) {
        buildPickers();
        // Picker markup starts loading every copied team logo in the background.
        // Preload any images needed by the weekly/result rows as well.
        for (const team of model.defenses) {
          const image = new Image(); image.src = assetUrl(team); images.push(image);
        }
      }
      $('loadStatus').hidden = true; $('loadError').hidden = true;
      root.querySelector('[data-retry-load]').hidden = true;
      $('analysis').hidden = false;
      if ($('breakdownDialog').open) render();
      onDataChange();
      return snapshot;
    }).catch(error => {
      if ($('loadError')) {
        $('loadStatus').hidden = true;
        $('loadError').textContent = `Matchup data could not load: ${error.message}`;
        $('loadError').hidden = false;
        root.querySelector('[data-retry-load]').hidden = false;
        $('analysis').hidden = true;
        $('analysis').setAttribute('aria-busy', 'false');
      }
      onDataChange();
      throw error;
    }).finally(() => { preparationPromise = null; });
    onDataChange();
    return preparationPromise;
  }

  async function open(selection, trigger) {
    const resolved = resolveMatchupSelection(selection);
    if (!resolved) throw new Error('No opponent defense is available for this player.');
    const request = ++launch;
    await mount();
    if (request !== launch) return;
    closePicker(); hideTooltip();
    // Every entry starts with that player's defense/position. Table search and
    // venue changes remain modal-local and never alter projections or selection.
    state.team = resolved.team; state.pos = resolved.pos; state.venue = 'all';
    state.query = ''; state.hideZero = true; state.playerSort = { key: 'week', direction: 'desc' };
    triggerPlayerId = String(selection.id);
    $('breakdownPlayer').textContent = `${selection.label} · ${selection.matchup.opponent} · ${resolved.pos}`;
    const dialog = $('breakdownDialog');
    if (!dialog.open) {
      scrollState = { html: document.documentElement.style.overflow, body: document.body.style.overflow };
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
    }
    if (model) render();
    else {
      showLoading();
      // A user can open while background loading is still in flight. Reuse that
      // promise and keep the dialog responsive; no duplicate requests or stale data.
      prepare().catch(() => {});
    }
    trigger?.blur();
  }
  function close() {
    launch++;
    if ($('playersDialog')?.open) $('playersDialog').close();
    if ($('breakdownDialog')?.open) $('breakdownDialog').close();
  }
  return { prepare, open, close, canOpen: selection => Boolean(resolveMatchupSelection(selection)),
    preview: selection => store.preview(selection),
    get status() { return store.status; } };
}
