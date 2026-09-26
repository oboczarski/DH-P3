// DataHub stats help: one glossary supplies the page key and desktop table
// tooltips. Source keys stay separate from display labels, especially where
// rookie/career tables shorten passing, rushing, and receiving headers alike.
const stat = (abbr, name, aliases = [], note = "") => ({ abbr, name, aliases, note });

export const DATAHUB_STAT_SECTIONS = [
  { id: "general", label: "General", tone: "general", items: [
    stat("PLAYER", "Player Name"),
    stat("POS", "Position"),
    stat("TM", "Team"),
    stat("AGE", "Player Age"),
    stat("RK", "Overall Rank"),
    stat("G / Gs", "Games Played", ["G", "Gs", "GM_P", "games_played"]),
    stat("SNP%", "Snap Share", ["snp_pct"]),
    stat("YDS(t) / tYDS", "Total Yards", ["YDS(t)", "tYDS", "ttlYDS", "yds_total"]),
    stat("YPG(t)", "Total Yards per Game", ["ypg"]),
    stat("tTD", "Total Touchdowns", ["ttlTD"]),
    stat("OPP", "Opportunities", ["opp"], "Passing attempts + carries + targets."),
    stat("IMP", "Impact Plays", ["imp"], "First downs + touchdowns."),
    stat("IMP/G", "Impact Plays per Game", ["imp_per_g"]),
    stat("IMP/OPP", "Impact Plays per Opportunity", ["imp_per_opp"]),
    stat("FUM", "Fumbles Lost", ["fum"]),
    stat("SZN", "Season"),
    stat("WK · VS", "Week & Opponent", ["week"]),
  ] },
  { id: "fantasy", label: "Fantasy", tone: "fantasy", items: [
    stat("FPTS", "Fantasy Points", ["fpts", "FPTS_VALUE"], "PPR scoring."),
    stat("PPG", "Fantasy Points per Game", ["ppg", "PPG_VALUE"]),
    stat("FPOE", "Fantasy Points Over Expected", ["fpoe"]),
    stat("PROJ", "Projected Fantasy Points", ["proj"]),
    stat("CSTY%", "Consistency Percentage", ["csty_pct"], "Share of games reaching the position’s solid scoring threshold."),
    stat("CL", "Ceiling", ["ceiling"]),
    stat("FPTS POS·RK", "Fantasy Points Positional Rank", ["FPTS_POS_RK"]),
    stat("FPTS OVR·RK", "Fantasy Points Overall Rank", ["FPTS_OVR_RK"]),
    stat("PPG POS·RK", "Points per Game Positional Rank", ["PPG_POS_RK"]),
    stat("PPG OVR·RK", "Points per Game Overall Rank", ["PPG_OVR_RK"]),
  ] },
  { id: "passing", label: "Passing", tone: "passing", items: [
    stat("paATT", "Passing Attempts", ["pass_att"]),
    stat("CMP", "Completions", ["pass_cmp"]),
    stat("CMP%", "Completion Percentage", ["cmp_pct", "CMP PCT"]),
    stat("paYDS", "Passing Yards", ["pass_yd"]),
    stat("paYPG", "Passing Yards per Game", ["pa_ypg"]),
    stat("paTD", "Passing Touchdowns", ["pass_td"]),
    stat("pa1D", "Passing First Downs", ["pass_fd"]),
    stat("paRTG", "Passer Rating", ["pass_rtg"]),
    stat("YPA", "Passing Yards per Attempt"),
    stat("pIMP", "Passing Impact Plays", ["pass_imp"]),
    stat("pIMP/A / pIMP/ATT", "Passing Impact Plays per Attempt", ["pIMP/A", "pIMP/ATT", "pass_imp_per_att"]),
    stat("INT", "Interceptions", ["pass_int"]),
    stat("SAC", "Sacks Taken", ["pass_sack"]),
    stat("EPA", "Expected Points Added", ["epa"]),
    stat("EPA/DB", "Expected Points Added per Dropback", ["epa_per_db"]),
    stat("CPOE", "Completion Percentage Over Expected", ["cpoe"]),
    stat("DB", "Dropbacks", ["dropbacks"]),
    stat("TTT", "Time to Throw", ["ttt"], "Seconds."),
    stat("PRS%", "Pressure Rate", ["prs_pct"]),
    stat("BLTZ%", "Blitz Rate", ["blitz_pct"]),
    stat("DP%", "Deep Pass Rate", ["dp_pct"]),
    stat("TmPa%", "Team Passing Share", ["team_pass_pct"]),
  ] },
  { id: "rushing", label: "Rushing", tone: "rushing", items: [
    stat("CAR", "Carries", ["rush_att"]),
    stat("ruYDS", "Rushing Yards", ["rush_yd"]),
    stat("ruYPG", "Rushing Yards per Game", ["ru_ypg"]),
    stat("ruTD", "Rushing Touchdowns", ["rush_td"]),
    stat("ru1D", "Rushing First Downs", ["rush_fd"]),
    stat("YPC", "Yards per Carry", ["ypc"]),
    stat("MTF", "Missed Tackles Forced", ["mtf"]),
    stat("MTF/A", "Missed Tackles Forced per Attempt", ["mtf_per_att"]),
    stat("YCO", "Yards After Contact", ["rush_yac"]),
    stat("YCO/A", "Yards After Contact per Attempt", ["yco_per_att"]),
    stat("ELU", "Elusiveness Rating", ["elu"]),
    stat("EXPLSV%", "Explosive Rush Rate", ["ExplRu%", "expl_ru_pct"], "Share of carries gaining 10+ yards."),
    stat("RYOE", "Rushing Yards Over Expected", ["ryoe"]),
    stat("RYOE/A", "Rushing Yards Over Expected per Attempt", ["ryoe_per_att"]),
    stat("RZ·Att", "Red Zone Rushing Attempts", ["RZ Att", "rz_att"]),
    stat("GL·Att", "Goal Line Rushing Attempts", ["GL Att", "gl_att"]),
  ] },
  { id: "receiving", label: "Receiving", tone: "receiving", items: [
    stat("TGT", "Targets", ["rec_tgt"]),
    stat("REC", "Receptions", ["rec"]),
    stat("recYDS", "Receiving Yards", ["rec_yd"]),
    stat("recYPG", "Receiving Yards per Game", ["rec_ypg"]),
    stat("recTD", "Receiving Touchdowns", ["rec_td"]),
    stat("rec1D", "Receiving First Downs", ["rec_fd"]),
    stat("RR", "Routes Run", ["rr"]),
    stat("RZ Tgt", "Red Zone Targets", ["rz_tgt"]),
    stat("TS%", "Target Share", ["ts_per_rr"]),
    stat("TPRR", "Targets per Route Run", ["tprr"]),
    stat("TGT%", "Target Rate"),
    stat("YPR", "Yards per Reception", ["ypr"]),
    stat("YPRR", "Yards per Route Run", ["yprr"]),
    stat("1DRR", "First Downs per Route Run", ["first_down_rec_rate"]),
    stat("IMP/RR", "Impact Plays per Route Run"),
    stat("YAC", "Yards After Catch", ["rec_yar"]),
    stat("AY", "Air Yards"),
    stat("AY%", "Air Yards Share", ["ay_pct"]),
    stat("tgtQBR", "Passer Rating When Targeted"),
    stat("CTST%", "Contested Catch Rate"),
    stat("DROP%", "Drop Rate"),
  ] },
  { id: "market", label: "Trade Values & ADP", tone: "market", items: [
    stat("KTC 1QB", "KeepTradeCut Value · One Quarterback"),
    stat("KTC SFLX", "KeepTradeCut Value · Superflex"),
    stat("1QB ADP", "Average Draft Position · One Quarterback"),
    stat("SFLX ADP", "Average Draft Position · Superflex"),
    stat("1QB DIFF", "Rank Difference · One Quarterback", [], "Absolute gap between KTC overall rank and ADP."),
    stat("SFLX DIFF", "Rank Difference · Superflex", [], "Absolute gap between KTC overall rank and ADP."),
    stat("ADP", "Average Draft Position"),
    stat("POS·ADP", "Positional Average Draft Position"),
    stat("VALUE", "Trade Value"),
  ] },
  { id: "rookies", label: "Rookies & Prospects", tone: "rookies", items: [
    stat("Index", "Row Number", ["index"]),
    stat("TIER", "Prospect Tier"),
    stat("Prospect RK", "Prospect Rank", ["rookie-rank"]),
    stat("GRD", "Prospect Grade"),
    stat("OVR-RK", "Overall Prospect Rank"),
    stat("POS-RK", "Positional Prospect Rank"),
    stat("RD/PK", "NFL Draft Round & Pick", ["RD & PK#"]),
    stat("PK#", "Overall NFL Draft Pick", ["OVR_PK"]),
    stat("CFB", "College"),
    stat("HT", "Height"),
    stat("WT", "Weight", [], "Pounds."),
    stat("40dsh", "40-Yard Dash", [], "Seconds."),
  ] },
];

const definitions = new Map();
DATAHUB_STAT_SECTIONS.forEach((section) => {
  section.items.forEach((item) => {
    [item.abbr, ...item.aliases].forEach((key) => definitions.set(key, item));
  });
});

export function getDataHubStatDefinition(key, { rookie = false } = {}) {
  return definitions.get(rookie && key === "RK" ? "rookie-rank" : key) || null;
}

export function setDataHubStatTooltip(element, key, options) {
  const definition = getDataHubStatDefinition(key, options);
  if (definition) element.dataset.datahubStatName = definition.name;
}

export function attachDataHubStatsHelp() {
  const dialog = document.querySelector("#datahub-stats-key-modal");
  const tooltip = document.querySelector("#datahub-stat-tooltip");
  if (!dialog || !tooltip || document.body.dataset.page !== "datahub") return;
  const openButtons = Array.from(document.querySelectorAll("[data-stats-key-open]"));
  const search = dialog.querySelector("[data-stats-key-search]");
  const filters = dialog.querySelector("[data-stats-key-filters]");
  const content = dialog.querySelector("[data-stats-key-content]");
  const status = dialog.querySelector("[data-stats-key-status]");
  const empty = dialog.querySelector("[data-stats-key-empty]");
  let activeSection = "all";
  let opener = null;

  // Build this page-local key once with text nodes. Filtering only hides rows,
  // so searching never rebuilds the dialog or disturbs keyboard focus.
  [{ id: "all", label: "All" }, ...DATAHUB_STAT_SECTIONS].forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dh-stats-key__filter";
    button.dataset.keySection = section.id;
    button.textContent = section.id === "market" ? "Market" : section.id === "rookies" ? "Rookies" : section.label;
    button.setAttribute("aria-pressed", String(section.id === "all"));
    filters.append(button);
  });
  const renderedSections = DATAHUB_STAT_SECTIONS.map((section) => {
    const card = document.createElement("section");
    card.className = `dh-stats-key__section dh-stats-key__section--${section.tone}`;
    const heading = document.createElement("h3");
    heading.className = "dh-stats-key__section-title";
    heading.textContent = section.label;
    const list = document.createElement("dl");
    const rows = section.items.slice().sort((a, b) => a.abbr.localeCompare(b.abbr, undefined, { numeric: true })).map((item) => {
      const row = document.createElement("div");
      row.className = "dh-stats-key__entry";
      const abbr = document.createElement("dt");
      abbr.textContent = item.abbr;
      const description = document.createElement("dd");
      description.textContent = item.name;
      if (item.note) {
        const note = document.createElement("small");
        note.textContent = item.note;
        description.append(note);
      }
      row.append(abbr, description);
      list.append(row);
      return { row, text: [item.abbr, item.name, item.note, ...item.aliases].join(" ").toLowerCase() };
    });
    card.append(heading, list);
    content.append(card);
    return { id: section.id, card, rows };
  });
  const totalStats = renderedSections.reduce((total, section) => total + section.rows.length, 0);
  function filterKey() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    renderedSections.forEach((section) => {
      let sectionCount = 0;
      section.rows.forEach(({ row, text }) => {
        row.hidden = !(activeSection === "all" || activeSection === section.id) || !text.includes(query);
        if (!row.hidden) sectionCount++;
      });
      section.card.hidden = sectionCount === 0;
      count += sectionCount;
    });
    status.textContent = `${count} of ${totalStats} stats`;
    empty.hidden = count !== 0;
    filters.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.keySection === activeSection));
    });
  }
  search.addEventListener("input", filterKey);
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-key-section]");
    if (!button) return;
    activeSection = button.dataset.keySection;
    filterKey();
    content.parentElement.scrollTop = 0;
  });
  openButtons.forEach((button) => button.addEventListener("click", () => {
    opener = button;
    search.value = "";
    activeSection = "all";
    filterKey();
    hideTooltip();
    dialog.showModal();
    document.body.classList.add("dh-stats-key-open");
    openButtons.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
    content.parentElement.scrollTop = 0;
  }));
  dialog.querySelector("[data-stats-key-close]").addEventListener("click", () => dialog.close());
  // Native dialog handles Escape and the inert background. Cycle Tab at the
  // first/last control to keep keyboard navigation inside the stats reference.
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button, input")].filter((control) => !control.disabled && control.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  // Check bounds so clicks in padding don't act like clicks on the backdrop.
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dh-stats-key-open");
    openButtons.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    opener?.focus({ preventScroll: true });
  });
  filterKey();

  // Desktop tooltips are delegated so freshly rendered grids, weekly headers
  // and career tables work automatically. A body-level fixed surface avoids
  // clipping by the table's frozen panes and horizontal/vertical scrollers.
  const desktopHover = window.matchMedia("(min-width: 720px) and (hover: hover) and (pointer: fine)");
  let activeHeader = null;
  let showTimer = 0;
  function hideTooltip() {
    window.clearTimeout(showTimer);
    if (activeHeader) {
      const ids = (activeHeader.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== tooltip.id);
      if (ids.length) activeHeader.setAttribute("aria-describedby", ids.join(" "));
      else activeHeader.removeAttribute("aria-describedby");
    }
    activeHeader = null;
    tooltip.hidden = true;
  }
  function showTooltip(header) {
    if (!desktopHover.matches || dialog.open) return;
    hideTooltip();
    activeHeader = header;
    showTimer = window.setTimeout(() => {
      if (!header.isConnected) return hideTooltip();
      tooltip.textContent = header.dataset.datahubStatName;
      tooltip.hidden = false;
      const rect = header.getBoundingClientRect();
      const tip = tooltip.getBoundingClientRect();
      const left = Math.max(12, Math.min(rect.left + rect.width / 2 - tip.width / 2, window.innerWidth - tip.width - 12));
      const top = rect.top >= tip.height + 20 ? rect.top - tip.height - 10 : rect.bottom + 10;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.min(top, window.innerHeight - tip.height - 12)}px`;
      const ids = new Set((header.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
      ids.add(tooltip.id);
      header.setAttribute("aria-describedby", [...ids].join(" "));
    }, 180);
  }
  const findHeader = (target) => target?.closest?.("[data-datahub-stat-name]");
  document.addEventListener("pointerover", (event) => {
    const header = findHeader(event.target);
    if (event.pointerType !== "touch" && header && !header.contains(event.relatedTarget)) showTooltip(header);
  });
  document.addEventListener("pointerout", (event) => {
    const header = findHeader(event.target);
    if (header === activeHeader && !header?.contains(event.relatedTarget)) hideTooltip();
  });
  document.addEventListener("focusin", (event) => {
    const header = findHeader(event.target);
    if (header) showTooltip(header);
  });
  document.addEventListener("focusout", (event) => {
    if (findHeader(event.target) === activeHeader) hideTooltip();
  });
  document.addEventListener("scroll", hideTooltip, true);
  document.addEventListener("click", hideTooltip);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideTooltip();
  });
  window.addEventListener("resize", hideTooltip);
  desktopHover.addEventListener("change", hideTooltip);
}
