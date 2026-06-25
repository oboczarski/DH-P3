import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "https://cdn.jsdelivr.net/npm/react@18.3.1/+esm";
import { createRoot } from "https://cdn.jsdelivr.net/npm/react-dom@18.3.1/client/+esm";
import {
  DEFAULT_WEEKLY_STAT,
  MAX_SELECTED_PLAYERS,
  buildDefaultSelection,
  buildSeasonRadarData,
  buildWeeklyChartData,
  buildWeeklySummaryCards,
  filterPlayers,
  getPositionAccentRank,
  getSelectedPlayers,
  resolveStatLabel,
  resolveWeeklyStatOptions,
} from "./comparisonData.js";
import { SeasonRadarComparison, WeeklyEChartsComparison } from "./comparisonCharts.js";

const h = React.createElement;

const EMPTY_SNAPSHOT = Object.freeze({
  players: [],
  weeks: Object.freeze([]),
  weeklyStatsByWeek: Object.freeze({}),
  weeklyRanksByWeekStatPlayer: Object.freeze({}),
  thresholdsByPositionStat: Object.freeze({}),
  statOptions: Object.freeze([]),
  seasonStatsByPlayerId: Object.freeze({}),
  seasonRanksByPlayerId: Object.freeze({}),
  seasonOverallRanksByStatPlayer: Object.freeze({}),
  seasonPosRanksByStatPlayer: Object.freeze({}),
  radarStatSets: Object.freeze({ qb: Object.freeze([]), skill: Object.freeze([]) }),
  currentNflWeek: null,
  statLabels: Object.freeze({}),
});

function normalizeSnapshot(snapshot) {
  return {
    ...EMPTY_SNAPSHOT,
    ...(snapshot || {}),
    players: Array.isArray(snapshot?.players) ? snapshot.players : [],
    weeks: Array.isArray(snapshot?.weeks) ? snapshot.weeks : [],
    weeklyStatsByWeek: snapshot?.weeklyStatsByWeek || {},
    weeklyRanksByWeekStatPlayer: snapshot?.weeklyRanksByWeekStatPlayer || {},
    thresholdsByPositionStat: snapshot?.thresholdsByPositionStat || {},
    statOptions: Array.isArray(snapshot?.statOptions) ? snapshot.statOptions : [],
    seasonStatsByPlayerId: snapshot?.seasonStatsByPlayerId || {},
    seasonRanksByPlayerId: snapshot?.seasonRanksByPlayerId || {},
    seasonOverallRanksByStatPlayer: snapshot?.seasonOverallRanksByStatPlayer || {},
    seasonPosRanksByStatPlayer: snapshot?.seasonPosRanksByStatPlayer || {},
    radarStatSets: snapshot?.radarStatSets || { qb: [], skill: [] },
    statLabels: snapshot?.statLabels || {},
  };
}

function createIcon(pathNodes, className = "datahub-player-comparison-icon") {
  return h(
    "svg",
    {
      className,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      focusable: "false",
    },
    pathNodes.map((node, index) => h("path", { key: index, d: node })),
  );
}

function formatPlayerMeta(player) {
  const parts = [player.pos, player.team].filter(Boolean);
  const rank = getPositionAccentRank(player);
  if (rank) {
    parts.push(rank);
  }
  return parts.join(" | ");
}

function formatRank(rank, prefix = "#") {
  return Number.isFinite(rank) ? `${prefix}${Math.round(rank)}` : "NA";
}

function PlayerChip({ player, onRemove }) {
  return h(
    "span",
    {
      className: `datahub-player-comparison-chip datahub-player-comparison-chip--${String(player.pos || "").toLowerCase()}`,
    },
    player.teamLogoSrc
      ? h("img", {
          className: "datahub-player-comparison-chip__logo",
          src: player.teamLogoSrc,
          alt: "",
          loading: "lazy",
        })
      : h("span", { className: "datahub-player-comparison-chip__team" }, player.team || "FA"),
    h(
      "span",
      { className: "datahub-player-comparison-chip__text" },
      h("span", { className: "datahub-player-comparison-chip__name" }, player.name),
      h("span", { className: "datahub-player-comparison-chip__meta" }, formatPlayerMeta(player)),
    ),
    h(
      "button",
      {
        type: "button",
        className: "datahub-player-comparison-chip__remove",
        "aria-label": `Remove ${player.name}`,
        onClick: () => onRemove(player.id),
      },
      createIcon(["M7 7l10 10M17 7 7 17"], "datahub-player-comparison-chip__remove-icon"),
    ),
  );
}

function PlayerSearch({
  inputRef,
  query,
  results,
  selectedIds,
  maxReached,
  isMenuOpen,
  onQueryChange,
  onFocus,
  onKeyDown,
  onTogglePlayer,
}) {
  const selectedCount = selectedIds.length;
  return h(
    "div",
    { className: "datahub-player-comparison-search" },
    h(
      "div",
      {
        className: "datahub-player-comparison-search__field",
        role: "combobox",
        "aria-expanded": isMenuOpen ? "true" : "false",
        "aria-haspopup": "listbox",
        "aria-controls": "datahub-player-comparison-results",
      },
      createIcon(
        ["M10.5 3a7.5 7.5 0 0 1 5.946 12.072l4.241 4.242-1.414 1.414-4.242-4.241A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"],
        "datahub-player-comparison-search__icon",
      ),
      h("input", {
        ref: inputRef,
        className: "datahub-player-comparison-search__input",
        type: "search",
        inputMode: "search",
        value: query,
        placeholder: maxReached ? "3 players selected" : "Search players...",
        "aria-label": "Search players to compare",
        autoComplete: "off",
        onChange: (event) => onQueryChange(event.target.value),
        onFocus,
        onKeyDown,
      }),
      h("span", { className: "datahub-player-comparison-search__count" }, `${selectedCount}/${MAX_SELECTED_PLAYERS}`),
    ),
    isMenuOpen
      ? h(
          "div",
          {
            id: "datahub-player-comparison-results",
            className: "datahub-player-comparison-search__menu",
            role: "listbox",
          },
          results.length
            ? results.map((player) =>
                h(
                  "button",
                  {
                    key: player.id,
                    type: "button",
                    className: `datahub-player-comparison-search__option${player.isSelected ? " is-selected" : ""}`,
                    role: "option",
                    "aria-selected": player.isSelected ? "true" : "false",
                    disabled: player.isDisabled,
                    onMouseDown: (event) => event.preventDefault(),
                    onClick: () => onTogglePlayer(player),
                  },
                  h(
                    "span",
                    { className: "datahub-player-comparison-search__option-main" },
                    h("span", { className: "datahub-player-comparison-search__option-name" }, player.name),
                    h("span", { className: "datahub-player-comparison-search__option-meta" }, formatPlayerMeta(player)),
                  ),
                  h(
                    "span",
                    { className: "datahub-player-comparison-search__option-state" },
                    player.isSelected ? "Selected" : (player.isDisabled ? "Max" : "Add"),
                  ),
                ),
              )
            : h("div", { className: "datahub-player-comparison-search__empty" }, "No matching players."),
        )
      : null,
  );
}

function WeeklySummaryCards({ cards }) {
  if (!cards?.length) {
    return null;
  }
  return h(
    "div",
    { className: "datahub-player-comparison-summary", "aria-label": "Selected stat season summary" },
    cards.map((card) =>
      h(
        "article",
        {
          key: card.player.id,
          className: `datahub-player-comparison-summary-card datahub-player-comparison-summary-card--${String(card.player.pos || "").toLowerCase()}`,
          style: { "--series-color": card.color },
        },
        h(
          "div",
          { className: "datahub-player-comparison-summary-card__head" },
          card.player.teamLogoSrc
            ? h("img", {
                className: "datahub-player-comparison-summary-card__logo",
                src: card.player.teamLogoSrc,
                alt: "",
                loading: "lazy",
              })
            : h("span", { className: "datahub-player-comparison-summary-card__team" }, card.player.team || "FA"),
          h(
            "span",
            { className: "datahub-player-comparison-summary-card__player" },
            h("strong", null, card.player.name),
            h("small", null, `${card.player.pos} | ${card.player.team}`),
          ),
        ),
        h(
          "div",
          { className: "datahub-player-comparison-summary-card__body" },
          h(
            "span",
            { className: "datahub-player-comparison-summary-card__value" },
            card.displayValue,
            h("small", null, card.statLabel),
          ),
          h(
            "span",
            { className: "datahub-player-comparison-summary-card__ranks" },
            h("span", null, `OVR ${formatRank(card.overallRank)}`),
            h("span", null, `${card.player.pos} ${formatRank(card.posRank, "")}`),
          ),
        ),
      ),
    ),
  );
}

function PlayerComparisonRoot({ api, subscribe }) {
  const [isOpen, setIsOpen] = useState(false);
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT);
  const [mode, setMode] = useState("weekly");
  const [weeklyStat, setWeeklyStat] = useState(DEFAULT_WEEKLY_STAT);
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dialogRef = useRef(null);
  const searchInputRef = useRef(null);
  const deferredQuery = useDeferredValue(query);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsMenuOpen(false);
    api?.onClose?.();
    api?.restoreFocus?.();
  }, [api]);

  useEffect(() => {
    return subscribe((event) => {
      if (event?.type === "open") {
        const nextSnapshot = normalizeSnapshot(event.snapshot || api?.getSnapshot?.());
        setSnapshot(nextSnapshot);
        setSelectedIds(buildDefaultSelection(nextSnapshot.players));
        setMode("weekly");
        setWeeklyStat(DEFAULT_WEEKLY_STAT);
        setQuery("");
        setIsMenuOpen(false);
        setIsOpen(true);
        return;
      }

      if (event?.type === "close") {
        closeModal();
      }
    });
  }, [api, closeModal, subscribe]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.body.classList.add("datahub-player-comparison-open");
    requestAnimationFrame(() => {
      // Comparison modal initial focus:
      // focus the dialog shell so the default weekly ECharts comparison is the
      // first visible state instead of an open search menu covering the chart.
      dialogRef.current?.focus?.({ preventScroll: true });
    });

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown, true);
    return () => {
      document.body.classList.remove("datahub-player-comparison-open");
      document.removeEventListener("keydown", handleKeydown, true);
    };
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (isOpen && selectedIds.length === 0) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus?.({ preventScroll: true });
      });
    }
  }, [isOpen, selectedIds.length]);

  const selectedPlayers = useMemo(
    () => getSelectedPlayers(snapshot.players, selectedIds),
    [snapshot.players, selectedIds],
  );
  const weeklyOptions = useMemo(
    () => resolveWeeklyStatOptions(snapshot, selectedIds),
    [snapshot, selectedIds],
  );
  const searchResults = useMemo(
    () => filterPlayers(snapshot.players, deferredQuery, selectedIds),
    [deferredQuery, selectedIds, snapshot.players],
  );
  const weeklyChartData = useMemo(
    () => buildWeeklyChartData({ snapshot, selectedPlayers, statKey: weeklyStat }),
    [selectedPlayers, snapshot, weeklyStat],
  );
  const weeklySummaryCards = useMemo(
    () => buildWeeklySummaryCards({ snapshot, selectedPlayers, statKey: weeklyStat }),
    [selectedPlayers, snapshot, weeklyStat],
  );
  const radarData = useMemo(
    () => buildSeasonRadarData({ snapshot, selectedPlayers }),
    [selectedPlayers, snapshot],
  );

  useEffect(() => {
    if (!weeklyOptions.some((option) => option.key === weeklyStat)) {
      setWeeklyStat(weeklyOptions[0]?.key || DEFAULT_WEEKLY_STAT);
    }
  }, [weeklyOptions, weeklyStat]);

  const removePlayer = useCallback((playerId) => {
    setSelectedIds((previous) => previous.filter((id) => id !== playerId));
  }, []);

  const togglePlayer = useCallback((player) => {
    // Heading player selector:
    // toggles selected comparison players without introducing a table, then
    // closes the dropdown so mobile users immediately see the updated chart.
    setSelectedIds((previous) => {
      if (previous.includes(player.id)) {
        return previous.filter((id) => id !== player.id);
      }
      if (previous.length >= MAX_SELECTED_PLAYERS) {
        return previous;
      }
      return [...previous, player.id];
    });
    setQuery("");
    setIsMenuOpen(false);
  }, []);

  const handleSearchKeyDown = useCallback((event) => {
    if (event.key === "Enter") {
      const firstAvailable = searchResults.find((player) => !player.isDisabled);
      if (firstAvailable) {
        event.preventDefault();
        togglePlayer(firstAvailable);
      }
      return;
    }

    if (event.key === "Backspace" && !query && selectedIds.length) {
      setSelectedIds((previous) => previous.slice(0, -1));
      return;
    }

    if (event.key === "Escape" && isMenuOpen) {
      event.stopPropagation();
      setIsMenuOpen(false);
    }
  }, [isMenuOpen, query, searchResults, selectedIds.length, togglePlayer]);

  if (!isOpen) {
    return null;
  }

  const maxReached = selectedIds.length >= MAX_SELECTED_PLAYERS;
  const activeStatLabel = resolveStatLabel(weeklyStat, snapshot.statLabels);
  const selectedSummary = selectedPlayers.length
    ? selectedPlayers.map((player) => `${player.name} ${player.pos}`).join(" vs ")
    : "No players selected";

  return h(
    "div",
    {
      id: "player-comparison-modal",
      className: "datahub-player-comparison-modal",
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      },
    },
    h(
      "section",
      {
        ref: dialogRef,
        className: "datahub-player-comparison-dialog",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "player-comparison-modal-title",
        "aria-describedby": "player-comparison-modal-context",
        tabIndex: -1,
      },
      h(
        "header",
        { className: "datahub-player-comparison-header" },
        h(
          "div",
          { className: "datahub-player-comparison-title-block" },
          h("span", { className: "datahub-player-comparison-kicker" }, "PLAYER COMPARISON"),
          h("h2", { id: "player-comparison-modal-title" }, mode === "weekly" ? `Weekly ${activeStatLabel}` : "Season Radar"),
          h("p", { id: "player-comparison-modal-context" }, selectedSummary),
        ),
        h(
          "button",
          {
            type: "button",
            className: "datahub-player-comparison-close",
            "aria-label": "Close player comparison",
            onClick: closeModal,
          },
          createIcon(["M7 7l10 10M17 7 7 17"], "datahub-player-comparison-close__icon"),
        ),
      ),
      h(
        "div",
        { className: "datahub-player-comparison-toolbar" },
        h(
          "div",
          { className: "datahub-player-comparison-mode", role: "tablist", "aria-label": "Comparison mode" },
          h(
            "button",
            {
              type: "button",
              className: `datahub-player-comparison-mode__button${mode === "weekly" ? " is-active" : ""}`,
              role: "tab",
              "aria-selected": mode === "weekly" ? "true" : "false",
              onClick: () => setMode("weekly"),
            },
            "Weekly",
          ),
          h(
            "button",
            {
              type: "button",
              className: `datahub-player-comparison-mode__button${mode === "season" ? " is-active" : ""}`,
              role: "tab",
              "aria-selected": mode === "season" ? "true" : "false",
              onClick: () => setMode("season"),
            },
            "Season",
          ),
        ),
        mode === "weekly"
          ? h(
              "label",
              { className: "datahub-player-comparison-stat" },
              h("span", { className: "datahub-player-comparison-stat__label" }, "Stat"),
              h(
                "select",
                {
                  className: "datahub-player-comparison-stat__select",
                  value: weeklyStat,
                  onChange: (event) => setWeeklyStat(event.target.value),
                },
                weeklyOptions.map((option) =>
                  h("option", { key: option.key, value: option.key }, option.label),
                ),
              ),
            )
          : null,
      ),
      h(
        "div",
        { className: "datahub-player-comparison-selector" },
        h(
          "div",
          { className: "datahub-player-comparison-chips", "aria-label": "Selected players" },
          selectedPlayers.length
            ? selectedPlayers.map((player) => h(PlayerChip, { key: player.id, player, onRemove: removePlayer }))
            : h("span", { className: "datahub-player-comparison-chips__empty" }, "Select up to 3 players"),
        ),
        h(PlayerSearch, {
          inputRef: searchInputRef,
          query,
          results: searchResults,
          selectedIds,
          maxReached,
          isMenuOpen,
          onQueryChange: (value) => {
            setQuery(value);
            setIsMenuOpen(true);
          },
          onFocus: () => setIsMenuOpen(true),
          onKeyDown: handleSearchKeyDown,
          onTogglePlayer: togglePlayer,
        }),
      ),
      h(
        "main",
        { className: "datahub-player-comparison-body" },
        selectedPlayers.length
          ? mode === "weekly"
            ? h(
                "div",
                { className: "datahub-player-comparison-view datahub-player-comparison-view--weekly" },
                h(WeeklySummaryCards, { cards: weeklySummaryCards }),
                h(WeeklyEChartsComparison, { chartData: weeklyChartData }),
              )
            : h(
                "div",
                { className: "datahub-player-comparison-view datahub-player-comparison-view--season" },
                h(SeasonRadarComparison, { radarData }),
              )
          : h(
              "div",
              { className: "datahub-player-comparison-empty datahub-player-comparison-empty--open" },
              h("span", null, "No players selected."),
            ),
      ),
    ),
  );
}

export function mountDataHubPlayerComparison(rootElement, api = {}) {
  const subscribers = new Set();
  let pendingEvent = null;
  const reactRoot = createRoot(rootElement);

  const emit = (event) => {
    if (!subscribers.size) {
      pendingEvent = event;
      return;
    }
    subscribers.forEach((subscriber) => subscriber(event));
  };

  const subscribe = (subscriber) => {
    subscribers.add(subscriber);
    if (pendingEvent) {
      const queuedEvent = pendingEvent;
      pendingEvent = null;
      queueMicrotask(() => subscriber(queuedEvent));
    }
    return () => subscribers.delete(subscriber);
  };

  reactRoot.render(h(PlayerComparisonRoot, { api, subscribe }));

  return {
    open(snapshot) {
      emit({ type: "open", snapshot });
    },
    close() {
      emit({ type: "close" });
    },
    unmount() {
      reactRoot.unmount();
      subscribers.clear();
      pendingEvent = null;
    },
  };
}
