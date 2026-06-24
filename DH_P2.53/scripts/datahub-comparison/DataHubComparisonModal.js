import {
  COMPARISON_PLAYER_COLORS,
  COMPARISON_POSITION_TONES,
  MAX_COMPARISON_PLAYERS,
  formatComparisonValue,
  getComparisonPosition,
  getSeasonStatKeys,
  getStatLabel,
  getWeeklyStatOptions,
  normalizePlayerSearchText,
  toFiniteNumber,
} from "./comparisonStats.js";
import {
  buildSeasonChartOption,
  buildWeeklyChartOption,
} from "./comparisonChartOptions.js";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getPlayerName(player) {
  return player?.name || player?.fullName || "Player";
}

function getTeamLogoSrc(player) {
  return player?.teamLogoSrc || "";
}

function getInitialSelectedIds(payload) {
  return Array.isArray(payload?.defaults?.selectedPlayerIds)
    ? payload.defaults.selectedPlayerIds.slice(0, MAX_COMPARISON_PLAYERS)
    : [];
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

function getSearchResults(players, query, selectedIds) {
  const normalizedQuery = query.trim().toLowerCase();
  const results = players
    .filter((player) => playerMatchesQuery(player, normalizedQuery))
    .sort((left, right) => sortSearchResults(left, right, selectedIds));

  return results.slice(0, normalizedQuery ? 14 : 10);
}

function getSelectedPlayers(playersById, selectedIds) {
  return selectedIds
    .map((id) => playersById.get(id))
    .filter(Boolean);
}

function getWeeklyDisplayValue(player, statKey) {
  const values = (player?.weeklySeries || [])
    .map((entry) => toFiniteNumber(entry?.stats?.[statKey]))
    .filter((value) => value !== null);
  if (!values.length) {
    return null;
  }

  if (statKey === "fpts") {
    return values.reduce((sum, value) => sum + value, 0);
  }

  return values[values.length - 1];
}

function getChartFallbackRows({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys }) {
  if (mode === "season") {
    return seasonStatKeys.slice(0, 5).map((statKey) => ({
      key: statKey,
      label: getStatLabel(statKey),
      values: selectedPlayers.map((player) => ({
        player,
        value: player?.seasonStats?.[statKey],
      })),
    }));
  }

  return selectedPlayers.map((player) => ({
    key: player.id,
    label: getPlayerName(player),
    values: [{
      player,
      value: getWeeklyDisplayValue(player, weeklyStatKey),
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

  function PlayerChip({ player, index, onRemove }) {
    const color = COMPARISON_PLAYER_COLORS[index % COMPARISON_PLAYER_COLORS.length];
    const posColor = COMPARISON_POSITION_TONES[player.pos] || color;

    return h(
      "span",
      {
        className: "dh-compare-player-chip",
        style: {
          "--compare-player-color": color,
          "--compare-pos-color": posColor,
        },
      },
      h("span", { className: "dh-compare-player-chip__dot", "aria-hidden": "true" }),
      getTeamLogoSrc(player)
        ? h("img", {
          className: "dh-compare-player-chip__logo",
          src: getTeamLogoSrc(player),
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
        getTeamLogoSrc(player)
          ? h("img", {
            className: "dh-compare-search-option__logo",
            src: getTeamLogoSrc(player),
            alt: "",
            loading: "lazy",
          })
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

  function ComparisonChart({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys, weeks }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [hasEcharts, setHasEcharts] = useState(() => Boolean(window.echarts));
    const chartOption = useMemo(() => {
      if (!selectedPlayers.length) {
        return null;
      }

      return mode === "season"
        ? buildSeasonChartOption({ players: selectedPlayers, statKeys: seasonStatKeys })
        : buildWeeklyChartOption({ players: selectedPlayers, statKey: weeklyStatKey, weeks });
    }, [mode, seasonStatKeys, selectedPlayers, weeklyStatKey, weeks]);

    useEffect(() => {
      setHasEcharts(Boolean(window.echarts));
    }, []);

    useEffect(() => {
      const element = chartRef.current;
      if (!element || !window.echarts || !chartOption) {
        return undefined;
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

      return () => {
        resizeObserver?.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }, [chartOption]);

    useEffect(() => () => {
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed?.()) {
        chartInstanceRef.current.dispose();
      }
      chartInstanceRef.current = null;
    }, []);

    if (!selectedPlayers.length) {
      return h(
        "div",
        { className: "dh-compare-empty" },
        h("span", { className: "dh-compare-empty__title" }, "No players selected"),
      );
    }

    if (!hasEcharts || !chartOption) {
      const fallbackRows = getChartFallbackRows({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys });

      return h(
        "div",
        { className: "dh-compare-fallback" },
        h("div", { className: "dh-compare-warning" }, "Chart renderer unavailable"),
        h(
          "div",
          { className: "dh-compare-fallback__grid" },
          fallbackRows.map((row) => h(
            "div",
            { key: row.key, className: "dh-compare-fallback__card" },
            h("span", { className: "dh-compare-fallback__label" }, row.label),
            row.values.map(({ player, value }, index) => h(
              "span",
              {
                key: `${row.key}-${player.id}`,
                className: "dh-compare-fallback__value",
                style: { "--compare-player-color": COMPARISON_PLAYER_COLORS[index % COMPARISON_PLAYER_COLORS.length] },
              },
              mode === "season"
                ? `${getPlayerName(player)} ${formatComparisonValue(row.key, value, { compact: true })}`
                : formatComparisonValue(weeklyStatKey, value, { compact: true }),
            )),
          )),
        ),
      );
    }

    return h("div", { className: "dh-compare-chart", ref: chartRef, "aria-label": "Player comparison chart" });
  }

  function DataHubComparisonModal({ payload, onClose }) {
    const players = payload?.players || [];
    const weeks = payload?.weeks || [];
    const playersById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);
    const [selectedIds, setSelectedIds] = useState(() => getInitialSelectedIds(payload));
    const [mode, setMode] = useState(payload?.defaults?.mode || "weekly");
    const [weeklyStatKey, setWeeklyStatKey] = useState(payload?.defaults?.weeklyStat || "fpts");
    const [query, setQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const searchInputRef = useRef(null);
    const skipSearchOpenOnFocusRef = useRef(false);
    const dialogRef = useRef(null);
    const selectedPlayers = useMemo(() => getSelectedPlayers(playersById, selectedIds), [playersById, selectedIds]);
    const weeklyStatOptions = useMemo(() => getWeeklyStatOptions(selectedPlayers), [selectedPlayers]);
    const seasonStatKeys = useMemo(() => getSeasonStatKeys(selectedPlayers), [selectedPlayers]);
    const searchResults = useMemo(
      () => getSearchResults(players, query, selectedIds),
      [players, query, selectedIds],
    );
    const selectionPosition = getComparisonPosition(selectedPlayers);
    const isAtMax = selectedIds.length >= MAX_COMPARISON_PLAYERS;
    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    useEffect(() => {
      setSelectedIds(getInitialSelectedIds(payload));
      setMode(payload?.defaults?.mode || "weekly");
      setWeeklyStatKey(payload?.defaults?.weeklyStat || "fpts");
      setQuery("");
      setIsSearchOpen(false);
      setActiveOptionIndex(0);
    }, [payload?.revision]);

    useEffect(() => {
      if (!weeklyStatOptions.some((option) => option.key === weeklyStatKey)) {
        setWeeklyStatKey(weeklyStatOptions[0]?.key || "fpts");
      }
    }, [weeklyStatKey, weeklyStatOptions]);

    useEffect(() => {
      // The modal initially focuses the heading search for keyboard users while keeping the
      // default chart unobscured until the user intentionally opens the player dropdown.
      skipSearchOpenOnFocusRef.current = true;
      const frame = requestAnimationFrame(() => searchInputRef.current?.focus?.());
      return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
      const handleKeydown = (event) => {
        if (event.key === "Escape") {
          if (isSearchOpen) {
            setIsSearchOpen(false);
            return;
          }
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeydown);
      return () => document.removeEventListener("keydown", handleKeydown);
    }, [isSearchOpen, onClose]);

    useEffect(() => {
      setActiveOptionIndex(0);
    }, [query]);

    const removePlayer = (playerId) => {
      setSelectedIds((current) => current.filter((id) => id !== playerId));
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
        if (!player) {
          return;
        }
        const selected = selectedSet.has(player.id);
        if (!selected && isAtMax) {
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
      {
        className: "dh-compare-modal",
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        },
      },
      // The backdrop owns overlay dismissal so clicks outside the dialog close only this DataHub modal.
      h("div", { className: "dh-compare-modal__overlay", "aria-hidden": "true", onMouseDown: onClose }),
      h(
        "section",
        {
          className: "dh-compare-modal__dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "dh-compare-title",
          ref: dialogRef,
          onMouseDown: (event) => event.stopPropagation(),
        },
        h(
          "header",
          { className: "dh-compare-header" },
          h(
            "div",
            { className: "dh-compare-title-block" },
            h("span", { className: "dh-compare-eyebrow" }, "PLAYER COMPARISON"),
            h("h2", { id: "dh-compare-title" }, mode === "season" ? "Season Multi-Stat" : "Weekly Single-Stat"),
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
          h(
            "div",
            { className: "dh-compare-selector" },
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
                },
                onChange: (event) => {
                  setQuery(event.target.value);
                  setIsSearchOpen(true);
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
        h(
          "div",
          { className: "dh-compare-toolbar" },
          h(
            "div",
            { className: "dh-compare-mode-group", role: "group", "aria-label": "Comparison mode" },
            h(ModeButton, { value: "weekly", active: mode === "weekly", onSelect: setMode }, "Weekly"),
            h(ModeButton, { value: "season", active: mode === "season", onSelect: setMode }, "Season"),
          ),
          mode === "weekly"
            ? h(
              "div",
              { className: "dh-compare-stat-strip", role: "listbox", "aria-label": "Weekly stat" },
              weeklyStatOptions.map((stat) => h(
                "button",
                {
                  key: stat.key,
                  type: "button",
                  className: cx("dh-compare-stat", stat.key === weeklyStatKey && "is-active"),
                  "aria-selected": String(stat.key === weeklyStatKey),
                  onClick: () => setWeeklyStatKey(stat.key),
                },
                stat.label,
              )),
            )
            : h(
              "div",
              { className: "dh-compare-season-context" },
              selectionPosition ? `${selectionPosition} stat bundle` : "Cross-position stat bundle",
            ),
        ),
        h(
          "main",
          { className: "dh-compare-body" },
          h(ComparisonChart, {
            mode,
            selectedPlayers,
            weeklyStatKey,
            seasonStatKeys,
            weeks,
          }),
        ),
      ),
    );
  }

  return DataHubComparisonModal;
}
