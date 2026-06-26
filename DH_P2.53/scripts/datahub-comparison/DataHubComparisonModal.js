import {
  MAX_COMPARISON_PLAYERS,
  formatComparisonValue,
  formatRank,
  getPlayerAccentColor,
  getPlayerName,
  getSeasonStatKeys,
  getStatLabel,
  getWeeklyStatOptions,
  normalizePlayerSearchText,
  toFiniteNumber,
} from "./comparisonStats.js";
import {
  buildSeasonRadarOption,
  buildWeeklyChartOption,
} from "./comparisonChartOptions.js";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getInitialSelectedIds(payload) {
  return Array.isArray(payload?.defaults?.selectedPlayerIds)
    ? payload.defaults.selectedPlayerIds.slice(0, MAX_COMPARISON_PLAYERS)
    : [];
}

function getSelectedPlayers(playersById, selectedIds) {
  return selectedIds
    .map((id) => playersById.get(id))
    .filter(Boolean);
}

function playerMatchesQuery(player, query) {
  if (!query) {
    return true;
  }
  return (player.searchText || normalizePlayerSearchText(player)).includes(query);
}

function sortSearchResults(left, right, selectedIds) {
  const leftSelected = selectedIds.includes(left.id);
  const rightSelected = selectedIds.includes(right.id);
  if (leftSelected !== rightSelected) {
    return leftSelected ? -1 : 1;
  }
  const leftFpts = toFiniteNumber(left.fpts) ?? -Infinity;
  const rightFpts = toFiniteNumber(right.fpts) ?? -Infinity;
  if (leftFpts !== rightFpts) {
    return rightFpts - leftFpts;
  }
  return getPlayerName(left).localeCompare(getPlayerName(right));
}

const POSITION_FILTERS = Object.freeze([
  { key: "all", label: "All" },
  { key: "QB", label: "QB" },
  { key: "RB", label: "RB" },
  { key: "WR", label: "WR" },
  { key: "TE", label: "TE" },
  { key: "FLX", label: "FLX" },
]);

function playerMatchesPositionFilter(player, positionFilter) {
  const pos = String(player?.pos || "").trim().toUpperCase();
  if (!positionFilter || positionFilter === "all") {
    return true;
  }
  if (positionFilter === "FLX") {
    return pos === "RB" || pos === "WR" || pos === "TE";
  }
  return pos === positionFilter;
}

function getSearchResults(players, query, selectedIds, positionFilter) {
  const normalizedQuery = query.trim().toLowerCase();
  return players
    .filter((player) => playerMatchesQuery(player, normalizedQuery))
    .filter((player) => playerMatchesPositionFilter(player, positionFilter))
    .sort((left, right) => sortSearchResults(left, right, selectedIds))
}

function getWeeklyDisplayValue(player, statKey) {
  const values = (player?.weeklySeries || [])
    .map((entry) => toFiniteNumber(entry?.stats?.[statKey]))
    .filter((value) => value !== null);
  if (!values.length) {
    return null;
  }
  return statKey === "fpts"
    ? values.reduce((sum, value) => sum + value, 0)
    : values[values.length - 1];
}

function getFallbackRows({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys }) {
  if (mode === "season") {
    return seasonStatKeys.slice(0, 6).map((statKey) => ({
      key: statKey,
      label: getStatLabel(statKey),
      values: selectedPlayers.map((player) => ({
        player,
        value: player?.seasonStats?.[statKey],
        rank: player?.seasonPosRanks?.[statKey],
      })),
    }));
  }
  return selectedPlayers.map((player) => ({
    key: player.id,
    label: getPlayerName(player),
    values: [{
      player,
      value: getWeeklyDisplayValue(player, weeklyStatKey),
      rank: null,
    }],
  }));
}

export function createDataHubComparisonModal(React) {
  const {
    createElement: h,
    useEffect,
    useMemo,
    useRef,
    useState,
  } = React;

  function ModeButton({ value, active, onSelect, children }) {
    return h(
      "button",
      {
        type: "button",
        className: cx("dh-compare-mode", active && "is-active"),
        "aria-pressed": String(active),
        onClick: () => onSelect(value),
      },
      children,
    );
  }

  function StatDropdown({ options, value, open, onToggleOpen, onSelect }) {
    const activeOption = options.find((option) => option.key === value) || options[0] || { key: "fpts", label: "FPTS" };
    return h(
      "div",
      { className: "dh-compare-stat-select" },
      h(
        "button",
        {
          type: "button",
          className: "dh-compare-stat-trigger",
          "aria-haspopup": "listbox",
          "aria-expanded": String(open),
          onClick: () => onToggleOpen(!open),
        },
        h("span", null, activeOption.label),
        h("span", { className: "dh-compare-stat-trigger__icon", "aria-hidden": "true" }),
      ),
      open
        ? h(
          "div",
          { className: "dh-compare-stat-menu", role: "listbox", "aria-label": "Weekly stat" },
          options.map((option) => h(
            "button",
            {
              key: option.key,
              type: "button",
              role: "option",
              "aria-selected": String(option.key === value),
              className: cx("dh-compare-stat-option", option.key === value && "is-active"),
              onClick: () => {
                onSelect(option.key);
                onToggleOpen(false);
              },
            },
            h("span", null, option.label),
          )),
        )
        : null,
    );
  }

  function ChartHeader({ mode, selectedPlayers, weeklyStatKey }) {
    const title = mode === "season" ? "Season Radar" : getStatLabel(weeklyStatKey);
    return h(
      "div",
      { className: "dh-compare-chart-header" },
      h("div", { className: "dh-compare-chart-title" }, title),
      h(
        "div",
        { className: "dh-compare-chart-legend", "aria-label": "Compared players" },
        selectedPlayers.map((player, index) => {
          const color = getPlayerAccentColor(player, index);
          return h(
            "span",
            {
              key: player.id,
              className: "dh-compare-chart-legend__item",
              style: { "--compare-player-color": color },
            },
            player.teamLogoSrc
              ? h("img", {
                className: "dh-compare-chart-legend__logo",
                src: player.teamLogoSrc,
                alt: "",
                loading: "eager",
              })
              : h("span", { className: "dh-compare-chart-legend__logo-fallback" }, player.team || "FA"),
            h("span", { className: "dh-compare-chart-legend__name" }, getPlayerName(player)),
          );
        }),
      ),
    );
  }

  function PlayerChip({ player, index, onRemove }) {
    const color = getPlayerAccentColor(player, index);
    return h(
      "span",
      {
        className: "dh-compare-player-chip",
        style: { "--compare-player-color": color },
      },
      h("span", { className: "dh-compare-player-chip__dot", "aria-hidden": "true" }),
      player.teamLogoSrc
        ? h("img", {
          className: "dh-compare-player-chip__logo",
          src: player.teamLogoSrc,
          alt: "",
          loading: "eager",
        })
        : null,
      h("span", { className: "dh-compare-player-chip__name" }, getPlayerName(player)),
      h("span", { className: "dh-compare-player-chip__pos" }, player.pos || "FA"),
      h(
        "button",
        {
          type: "button",
          className: "dh-compare-player-chip__remove",
          "aria-label": `Remove ${getPlayerName(player)}`,
          onClick: () => onRemove(player.id),
        },
        "×",
      ),
    );
  }

  function PlayerSearchOption({ player, selected, disabled, active, onToggle }) {
    return h(
      "button",
      {
        type: "button",
        role: "option",
        "aria-selected": String(selected),
        "aria-disabled": String(disabled),
        className: cx(
          "dh-compare-search-option",
          selected && "is-selected",
          active && "is-active",
          disabled && "is-disabled",
        ),
        disabled,
        onClick: () => onToggle(player.id),
      },
      h(
        "span",
        { className: "dh-compare-search-option__main" },
        player.teamLogoSrc
          ? h(
            "span",
            { className: "dh-compare-search-option__logo-well", "aria-hidden": "true" },
            h("img", {
              className: "dh-compare-search-option__logo",
              src: player.teamLogoSrc,
              alt: "",
              loading: "lazy",
            }),
          )
          : h("span", { className: "dh-compare-search-option__logo-fallback" }, player.team || "FA"),
        h(
          "span",
          { className: "dh-compare-search-option__copy" },
          h("span", { className: "dh-compare-search-option__name" }, player.fullName || player.name),
          h("span", { className: "dh-compare-search-option__meta" }, `${player.pos || "FA"} · ${player.team || "FA"}`),
        ),
      ),
      h(
        "span",
        { className: "dh-compare-search-option__stats" },
        h("span", { className: "dh-compare-search-option__fpts" }, formatComparisonValue("fpts", player.fpts, { compact: true })),
        h("span", { className: "dh-compare-search-option__status" }, selected ? "Selected" : "Add"),
      ),
    );
  }

  function SummaryCard({ player, playerIndex, statKey }) {
    const color = getPlayerAccentColor(player, playerIndex);
    return h(
      "article",
      {
        className: "dh-compare-summary-card",
        style: { "--compare-player-color": color },
      },
      h(
        "div",
        { className: "dh-compare-summary-card__player" },
        player.teamLogoSrc
          ? h("img", { src: player.teamLogoSrc, alt: "", loading: "eager" })
          : h("span", { className: "dh-compare-summary-card__logo-fallback" }, player.team || "FA"),
        h(
          "span",
          { className: "dh-compare-summary-card__identity" },
          h("strong", null, getPlayerName(player)),
          h("span", null, `${player.pos || "FA"} · ${player.team || "FA"}`),
        ),
      ),
      h(
        "div",
        { className: "dh-compare-summary-card__metric" },
        h("span", null, `${getStatLabel(statKey)} Season`),
        h("strong", null, formatComparisonValue(statKey, player?.seasonStats?.[statKey], { compact: true })),
      ),
      h(
        "div",
        { className: "dh-compare-summary-card__ranks" },
        h("span", null, `OVR ${formatRank(player?.seasonOverallRanks?.[statKey])}`),
        h("span", null, `${player.pos || "POS"}·${formatRank(player?.seasonPosRanks?.[statKey])}`),
      ),
    );
  }

  function ChartFallback({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys }) {
    const rows = getFallbackRows({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys });
    return h(
      "div",
      { className: "dh-compare-fallback" },
      h("div", { className: "dh-compare-warning" }, "Chart renderer unavailable"),
      h(
        "div",
        { className: "dh-compare-fallback__grid" },
        rows.map((row) => h(
          "div",
          { key: row.key, className: "dh-compare-fallback__card" },
          h("span", { className: "dh-compare-fallback__label" }, row.label),
          row.values.map(({ player, value, rank }, index) => h(
            "span",
            {
              key: `${row.key}-${player.id}`,
              className: "dh-compare-fallback__value",
              style: { "--compare-player-color": getPlayerAccentColor(player, index) },
            },
            mode === "season"
              ? `${getPlayerName(player)} ${formatComparisonValue(row.key, value, { compact: true })} (${player.pos}·${formatRank(rank)})`
              : `${getPlayerName(player)} ${formatComparisonValue(weeklyStatKey, value, { compact: true })}`,
          )),
        )),
      ),
    );
  }

  function ComparisonChart({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys, weeks, thresholds }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [hasEcharts, setHasEcharts] = useState(() => Boolean(window.echarts));
    const chartOption = useMemo(() => {
      if (!selectedPlayers.length) {
        return null;
      }
      return mode === "season"
        ? buildSeasonRadarOption({ players: selectedPlayers, statKeys: seasonStatKeys })
        : buildWeeklyChartOption({ players: selectedPlayers, statKey: weeklyStatKey, weeks, thresholds });
    }, [mode, seasonStatKeys, selectedPlayers, thresholds, weeklyStatKey, weeks]);

    useEffect(() => {
      setHasEcharts(Boolean(window.echarts));
    }, []);

    useEffect(() => {
      const element = chartRef.current;
      if (!element || !window.echarts || !chartOption) {
        return undefined;
      }
      const existingChart = chartInstanceRef.current;
      if (existingChart?.getDom && existingChart.getDom() !== element && !existingChart.isDisposed?.()) {
        existingChart.dispose();
        chartInstanceRef.current = null;
      }
      const chart = chartInstanceRef.current || window.echarts.init(element, null, { renderer: "svg" });
      chartInstanceRef.current = chart;
      chart.setOption(chartOption, true);
      const resizeObserver = typeof ResizeObserver === "function"
        ? new ResizeObserver(() => chart.resize())
        : null;
      resizeObserver?.observe(element);
      const handleResize = () => chart.resize();
      window.addEventListener("resize", handleResize, { passive: true });
      requestAnimationFrame(() => chart.resize());
      return () => {
        resizeObserver?.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }, [chartOption]);

    useEffect(() => {
      // DataHub comparison chart reset:
      // dispose the ECharts instance when Clear All swaps the chart for an
      // empty state so the next selected player initializes against fresh DOM.
      if (selectedPlayers.length || !chartInstanceRef.current) {
        return;
      }
      if (!chartInstanceRef.current.isDisposed?.()) {
        chartInstanceRef.current.dispose();
      }
      chartInstanceRef.current = null;
    }, [selectedPlayers.length]);

    useEffect(() => () => {
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed?.()) {
        chartInstanceRef.current.dispose();
      }
      chartInstanceRef.current = null;
    }, []);

    if (!selectedPlayers.length) {
      return h("div", { className: "dh-compare-empty" }, h("span", null, "No players selected"));
    }
    if (!hasEcharts || !chartOption) {
      return h(ChartFallback, { mode, selectedPlayers, weeklyStatKey, seasonStatKeys });
    }
    return h(
      "div",
      { className: "dh-compare-chart-shell" },
      h(ChartHeader, { mode, selectedPlayers, weeklyStatKey }),
      h("div", { className: "dh-compare-chart", ref: chartRef, "aria-label": "Player comparison chart" }),
    );
  }

  function DataHubComparisonModal({ payload, onClose }) {
    const players = payload?.players || [];
    const weeks = payload?.weeks || [];
    const thresholds = payload?.thresholds || {};
    const playersById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);
    const [selectedIds, setSelectedIds] = useState(() => getInitialSelectedIds(payload));
    const [mode, setMode] = useState(payload?.defaults?.mode || "weekly");
    const [weeklyStatKey, setWeeklyStatKey] = useState(payload?.defaults?.weeklyStat || "fpts");
    const [query, setQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isStatOpen, setIsStatOpen] = useState(false);
    const [positionFilter, setPositionFilter] = useState("all");
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const selectorRef = useRef(null);
    const searchInputRef = useRef(null);
    const skipSearchOpenOnFocusRef = useRef(false);
    const selectedPlayers = useMemo(() => getSelectedPlayers(playersById, selectedIds), [playersById, selectedIds]);
    const weeklyStatOptions = useMemo(() => getWeeklyStatOptions(selectedPlayers, thresholds), [selectedPlayers, thresholds]);
    const seasonStatKeys = useMemo(() => getSeasonStatKeys(selectedPlayers), [selectedPlayers]);
    const searchResults = useMemo(
      () => getSearchResults(players, query, selectedIds, positionFilter),
      [players, query, selectedIds, positionFilter],
    );
    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const isAtMax = selectedIds.length >= MAX_COMPARISON_PLAYERS;
    const summaryStatKey = mode === "weekly" ? weeklyStatKey : "fpts";

    useEffect(() => {
      setSelectedIds(getInitialSelectedIds(payload));
      setMode(payload?.defaults?.mode || "weekly");
      setWeeklyStatKey(payload?.defaults?.weeklyStat || "fpts");
      setQuery("");
      setIsSearchOpen(false);
      setIsStatOpen(false);
      setPositionFilter("all");
      setActiveOptionIndex(0);
    }, [payload?.revision]);

    useEffect(() => {
      if (!weeklyStatOptions.some((option) => option.key === weeklyStatKey)) {
        setWeeklyStatKey(weeklyStatOptions[0]?.key || "fpts");
      }
    }, [weeklyStatKey, weeklyStatOptions]);

    useEffect(() => {
      // DataHub comparison focus target:
      // focus the heading search for keyboard users without auto-opening the
      // dropdown over the default chart on first modal render.
      skipSearchOpenOnFocusRef.current = true;
      const frame = requestAnimationFrame(() => searchInputRef.current?.focus?.());
      return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
      const handleKeydown = (event) => {
        if (event.key !== "Escape") {
          return;
        }
        if (isSearchOpen) {
          setIsSearchOpen(false);
          return;
        }
        if (isStatOpen) {
          setIsStatOpen(false);
          return;
        }
        onClose();
      };
      document.addEventListener("keydown", handleKeydown);
      return () => document.removeEventListener("keydown", handleKeydown);
    }, [isSearchOpen, isStatOpen, onClose]);

    useEffect(() => {
      setActiveOptionIndex(0);
    }, [positionFilter, query]);

    useEffect(() => {
      setActiveOptionIndex((index) => Math.min(index, Math.max(0, searchResults.length - 1)));
    }, [searchResults.length]);

    useEffect(() => {
      if (!isSearchOpen && !isStatOpen) {
        return undefined;
      }
      const handlePointerDown = (event) => {
        if (selectorRef.current?.contains(event.target)) {
          return;
        }
        setIsSearchOpen(false);
        setIsStatOpen(false);
      };
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [isSearchOpen, isStatOpen]);

    const removePlayer = (playerId) => {
      setSelectedIds((current) => current.filter((id) => id !== playerId));
    };

    const clearAllPlayers = () => {
      setSelectedIds([]);
      setQuery("");
      setActiveOptionIndex(0);
      setIsSearchOpen(true);
      requestAnimationFrame(() => searchInputRef.current?.focus?.());
    };

    const togglePlayer = (playerId) => {
      setSelectedIds((current) => {
        if (current.includes(playerId)) {
          return current.filter((id) => id !== playerId);
        }
        if (current.length >= MAX_COMPARISON_PLAYERS) {
          return current;
        }
        return [...current, playerId];
      });
      setQuery("");
      setIsSearchOpen(true);
      setIsStatOpen(false);
      requestAnimationFrame(() => searchInputRef.current?.focus?.());
    };

    const handleInputKeydown = (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setIsSearchOpen(true);
        setActiveOptionIndex((index) => Math.min(index + 1, Math.max(0, searchResults.length - 1)));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveOptionIndex((index) => Math.max(0, index - 1));
        return;
      }
      if (event.key === "Enter" && isSearchOpen) {
        event.preventDefault();
        const player = searchResults[activeOptionIndex];
        if (!player || (!selectedSet.has(player.id) && isAtMax)) {
          return;
        }
        togglePlayer(player.id);
        return;
      }
      if (event.key === "Backspace" && !query && selectedIds.length) {
        removePlayer(selectedIds[selectedIds.length - 1]);
      }
    };

    return h(
      "div",
      { className: "dh-compare-modal" },
      // DataHub comparison backdrop:
      // closes only this lazy React modal and leaves the existing DataHub chart
      // and game-log modal event wiring untouched.
      h("div", { className: "dh-compare-modal__overlay", "aria-hidden": "true", onMouseDown: onClose }),
      h(
        "section",
        {
          className: "dh-compare-modal__dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "dh-compare-title",
          onMouseDown: (event) => event.stopPropagation(),
        },
        h(
          "header",
          { className: "dh-compare-header" },
          h(
            "div",
            { className: "dh-compare-heading" },
            h("span", { className: "dh-compare-eyebrow" }, "PLAYER COMPARISON"),
            h("h2", { id: "dh-compare-title" }, mode === "season" ? "Season Radar" : "Weekly Single-Stat"),
          ),
          h(
            "div",
            { className: "dh-compare-header__actions" },
            h(
              "div",
              { className: "dh-compare-mode-group", role: "group", "aria-label": "Comparison mode" },
              h(ModeButton, { value: "weekly", active: mode === "weekly", onSelect: setMode }, "Weekly"),
              h(ModeButton, { value: "season", active: mode === "season", onSelect: setMode }, "Season"),
            ),
            h(
              "button",
              {
                type: "button",
                className: "dh-compare-close",
                "aria-label": "Close comparison",
                onClick: onClose,
              },
              "×",
            ),
          ),
          h(
            "div",
            { className: "dh-compare-selector", ref: selectorRef },
            h(
              "div",
              { className: "dh-compare-selected", "aria-label": "Selected players" },
              selectedPlayers.map((player, index) => h(PlayerChip, {
                key: player.id,
                player,
                index,
                onRemove: removePlayer,
              })),
            ),
            h(
              "div",
              { className: cx("dh-compare-controls", mode === "season" && "dh-compare-controls--season") },
              mode === "weekly"
                ? h(StatDropdown, {
                  options: weeklyStatOptions,
                  value: weeklyStatKey,
                  open: isStatOpen,
                  onToggleOpen: (nextOpen) => {
                    setIsStatOpen(nextOpen);
                    if (nextOpen) {
                      setIsSearchOpen(false);
                    }
                  },
                  onSelect: setWeeklyStatKey,
                })
                : null,
              h(
                "div",
                { className: "dh-compare-search" },
                h("input", {
                  ref: searchInputRef,
                  className: "dh-compare-search__input",
                  type: "search",
                  placeholder: "Search players...",
                  value: query,
                  "aria-label": "Search players to compare",
                  "aria-expanded": String(isSearchOpen),
                  "aria-controls": "dh-compare-search-results",
                  autoComplete: "off",
                  onFocus: () => {
                    if (skipSearchOpenOnFocusRef.current) {
                      skipSearchOpenOnFocusRef.current = false;
                      return;
                    }
                    setIsSearchOpen(true);
                    setIsStatOpen(false);
                  },
                  onChange: (event) => {
                    setQuery(event.target.value);
                    setIsSearchOpen(true);
                    setIsStatOpen(false);
                  },
                  onClick: () => {
                    setIsSearchOpen(true);
                    setIsStatOpen(false);
                  },
                  onKeyDown: handleInputKeydown,
                }),
                isSearchOpen
                  ? h(
                    "div",
                    {
                      id: "dh-compare-search-results",
                      className: "dh-compare-search__menu",
                      role: "listbox",
                      "aria-label": "Player search results",
                    },
                    h(
                      "div",
                      { className: "dh-compare-search__tools", role: "presentation" },
                      h(
                        "div",
                        { className: "dh-compare-filter-row", role: "group", "aria-label": "Filter players by position" },
                        POSITION_FILTERS.map((filter) => h(
                          "button",
                          {
                            key: filter.key,
                            type: "button",
                            className: cx("dh-compare-filter", positionFilter === filter.key && "is-active"),
                            "aria-pressed": String(positionFilter === filter.key),
                            onClick: () => setPositionFilter(filter.key),
                          },
                          filter.label,
                        )),
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          className: "dh-compare-clear-all",
                          disabled: selectedIds.length === 0,
                          onClick: clearAllPlayers,
                        },
                        "Clear All",
                      ),
                    ),
                    searchResults.length
                      ? searchResults.map((player, index) => {
                        const selected = selectedSet.has(player.id);
                        const disabled = !selected && isAtMax;
                        return h(PlayerSearchOption, {
                          key: player.id,
                          player,
                          selected,
                          disabled,
                          active: index === activeOptionIndex,
                          onToggle: togglePlayer,
                        });
                      })
                      : h("div", { className: "dh-compare-search__empty" }, "No matching players"),
                    isAtMax
                      ? h("div", { className: "dh-compare-search__limit" }, `Max ${MAX_COMPARISON_PLAYERS} active players`)
                      : null,
                  )
                  : null,
              ),
            ),
          ),
        ),
        h(
          "main",
          { className: "dh-compare-main" },
          h(
            "section",
            { className: "dh-compare-summary-grid", "aria-label": "Selected stat summary" },
            selectedPlayers.map((player, index) => h(SummaryCard, {
              key: player.id,
              player,
              playerIndex: index,
              statKey: summaryStatKey,
            })),
          ),
          h(
            "div",
            { className: "dh-compare-body" },
            h(ComparisonChart, {
              mode,
              selectedPlayers,
              weeklyStatKey,
              seasonStatKeys,
              weeks,
              thresholds,
            }),
          ),
        ),
      ),
    );
  }

  return DataHubComparisonModal;
}
