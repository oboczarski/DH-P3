(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'analyzer') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const initialUsername = params.get('username');
    const initialLeagueId = params.get('leagueId');

    const elements = {
      usernameInput: document.getElementById('usernameInput'),
      leagueSelect: document.getElementById('leagueSelect'),
      loading: document.getElementById('loading'),
      summaryStats: document.getElementById('summaryStats'),
      content: document.getElementById('infographicContent'),
      lineupToggle: document.querySelectorAll('#lineup-panel .toggle-option'),
      radarToggle: document.querySelectorAll('#radar-panel .toggle-option'),
      startersCanvas: document.getElementById('startersValueChart'),
      overallCanvas: document.getElementById('overallValueChart'),
      radarCanvas: document.getElementById('radarChart'),
      standingsBody: document.getElementById('standingsTableBody'),
      leaderboardBody: document.getElementById('leaderboardTableBody'),
      leaderboardFilters: document.querySelectorAll('.analyzer-filter-group .filter-chip'),
    };

    const SLOT_ORDER = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPER_FLEX'];
    const SLOT_LABELS = {
      QB: 'QB',
      RB: 'RB',
      WR: 'WR',
      TE: 'TE',
      FLEX: 'FLX',
      SUPER_FLEX: 'SFLX',
      Picks: 'Draft Picks',
    };

    const SLOT_ALIASES = {
      'WR/RB': 'FLEX',
      'RB/WR': 'FLEX',
      'WR/RB/TE': 'FLEX',
      'RB/WR/TE': 'FLEX',
      'W/R/T': 'FLEX',
      'FLEX': 'FLEX',
      'SUPER_FLEX': 'SUPER_FLEX',
      'QB/RB/WR/TE': 'SUPER_FLEX',
      'Q/W/R/T': 'SUPER_FLEX',
    };

    const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE'];

    const LINEUP_VALUE_COLORS = {
      QB: '#15607a',
      RB: '#0c8184',
      WR: '#0da0a4',
      TE: '#09bb9f',
      FLEX: '#2ad2a0',
      SUPER_FLEX: '#37ebb5',
    };

    const LINEUP_PPG_COLORS = {
      QB: '#003c63',
      RB: '#005d91',
      WR: '#006da2',
      TE: '#007bb4',
      FLEX: '#008cd1',
      SUPER_FLEX: '#00a3ff',
    };

    const OVERALL_VALUE_COLORS = {
      QB: '#3700B3',
      RB: '#4c02de',
      WR: '#6300ff',
      TE: '#7100ff',
      FLEX: '#8700ff',
      Picks: '#9400ff',
    };

    const RADAR_SLOT_TYPES = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPER_FLEX'];
    const RADAR_FLEX_ELIGIBLE = ['RB', 'WR', 'TE'];

    const radarBackgroundPlugin = {
      id: 'analyzerRadarBackground',
      beforeDraw(chart, args, options) {
        const scale = chart.scales?.r;
        if (!scale || !options?.levels?.length || !chart.data.labels?.length) return;

        const { ctx } = chart;
        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const angleStep = (Math.PI * 2) / chart.data.labels.length;
        const startAngle = scale.getIndexAngle(0);
        const maxRadius = scale.drawingArea;

        ctx.save();
        options.levels.forEach((level) => {
          const radius = maxRadius * (level.ratio ?? 1);
          if (radius <= 0) return;
          ctx.beginPath();
          chart.data.labels.forEach((label, index) => {
            const angle = startAngle + angleStep * index;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          if (level.fill) {
            ctx.fillStyle = level.fill;
            ctx.fill();
          }
          if (level.stroke) {
            ctx.strokeStyle = level.stroke;
            ctx.lineWidth = level.lineWidth ?? 1;
            ctx.stroke();
          }
        });
        ctx.restore();
      },
    };

    const radarPointLabelsPlugin = {
      id: 'analyzerRadarLabels',
      afterDatasetsDraw(chart, args, options) {
        const scale = chart.scales?.r;
        if (!scale) return;
        const datasets = chart.data.datasets || [];
        datasets.forEach((dataset, datasetIndex) => {
          if (!dataset?.analyzerLabels) return;
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta?.data) return;

          const font = dataset.labelFont || options?.font || '11px "Product Sans", "Google Sans", sans-serif';
          const defaultColor = dataset.labelColor || options?.color || dataset.borderColor || '#EAEBF0';
          const formatter =
            dataset.labelFormatter || options?.formatter || ((val) => `${Number(val).toFixed(0)}`);

          meta.data.forEach((point, index) => {
            const value = dataset.data?.[index];
            if (!Number.isFinite(value)) return;
            const label = formatter(value, index, dataset, chart.data.labels?.[index]);
            if (!label) return;

            const { x, y } = point.tooltipPosition();
            const angle = Math.atan2(y - scale.yCenter, x - scale.xCenter);
            const offsetX = Math.cos(angle) * (options?.offset ?? 18);
            const offsetY = Math.sin(angle) * (options?.offset ?? 18);

            const ctx = chart.ctx;
            ctx.save();
            ctx.font = font;
            const color = Array.isArray(dataset.labelColors)
              ? dataset.labelColors[index] || defaultColor
              : defaultColor;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x + offsetX, y + offsetY);
            ctx.restore();
          });
        });
      },
    };

    const RANK_GLYPHS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫'];

    const formatRankGlyph = (rank) => {
      if (!Number.isFinite(rank) || rank <= 0) return '';
      if (rank <= RANK_GLYPHS.length) {
        return RANK_GLYPHS[rank - 1];
      }
      return `${rank}.`;
    };

    const getCssFontValue = (variableName) => {
      if (!variableName) return null;
      const target = document.body || document.documentElement;
      if (!target) return null;
      const styles = getComputedStyle(target);
      if (!styles) return null;
      const value = styles.getPropertyValue(variableName);
      return value ? value.trim() || null : null;
    };

    const scaleFontSize = (fontString, scale) => {
      if (!fontString || typeof fontString !== 'string' || !Number.isFinite(scale)) {
        return fontString;
      }
      const match = fontString.match(/(\d+(?:\.\d+)?)px/);
      if (!match) return fontString;
      const size = parseFloat(match[1]);
      if (!Number.isFinite(size) || size <= 0) return fontString;
      const scaled = size * scale;
      const rounded = Math.round(scaled * 10) / 10;
      return fontString.replace(match[0], `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded}px`);
    };

    const barTotalsPlugin = {
      id: 'analyzerBarTotals',
      afterDatasetsDraw(chart, args, options) {
        if (!options || options.enabled === false) return;

        const datasets = chart.data?.datasets || [];
        if (!datasets.length) return;

        const metas = datasets
          .map((dataset, index) => ({ meta: chart.getDatasetMeta(index), dataset }))
          .filter(({ meta }) => meta && !meta.hidden);

        if (!metas.length) return;

        const isHorizontal = chart.options?.indexAxis === 'y';
        const primaryScale = isHorizontal ? chart.scales?.x : chart.scales?.y;
        if (!primaryScale) return;

        const labelCount = chart.data?.labels?.length || 0;
        if (!labelCount) return;

        const totals = new Array(labelCount).fill(0);
        const positions = new Array(labelCount).fill(null);

        metas.forEach(({ meta, dataset }) => {
          meta.data.forEach((element, index) => {
            if (!element) return;
            const value = Number(dataset.data?.[index]) || 0;
            totals[index] += value;
            if (!positions[index]) {
              positions[index] = element;
            }
          });
        });

        const rankedTotals = totals
          .map((value, index) => ({ value, index }))
          .filter(({ value }) => Number.isFinite(value))
          .sort((a, b) => {
            if (b.value === a.value) {
              return a.index - b.index;
            }
            return b.value - a.value;
          });

        const ranks = new Array(labelCount).fill(null);
        let previousValue = null;
        let previousRank = 0;
        rankedTotals.forEach(({ value, index }, position) => {
          if (!Number.isFinite(value)) return;
          if (previousValue !== null && value === previousValue) {
            ranks[index] = previousRank;
            return;
          }
          const rank = position + 1;
          ranks[index] = rank;
          previousRank = rank;
          previousValue = value;
        });

        const ctx = chart.ctx;
        const offset = options.offset ?? 12;
        const font = options.font || '10px "Product Sans", "Google Sans", sans-serif';
        const mobileFont = options.mobileFont || '9px "Product Sans", "Google Sans", sans-serif';
        const color = options.color || '#EAEBF0';
        const formatter = options.formatter || ((val) => val.toFixed(0));
        const isMobileViewport = window.matchMedia('(max-width: 640px)').matches;
        const labelFont = isMobileViewport ? mobileFont : font;
        const cssGlyphFont = getCssFontValue(options.rankFontCssVar);
        const glyphFont = cssGlyphFont
          || (isMobileViewport ? options.rankMobileFont : options.rankFont)
          || scaleFontSize(labelFont, options.rankFontScale ?? 1.6);
        const glyphColor = options.rankColor || color;
        const glyphSpacing = options.rankSpacing ?? (isHorizontal ? 7 : 5);

        totals.forEach((total, index) => {
          if (!Number.isFinite(total) || total === 0) return;
          const element = positions[index];
          if (!element) return;

          const formatted = formatter(total, index);
          if (!formatted) return;
          const rankGlyph = formatRankGlyph(ranks[index]);

          const center = isHorizontal ? element.y : element.x;
          const primaryPixel = primaryScale.getPixelForValue(total);
          const chartArea = chart.chartArea;

          ctx.save();
          ctx.textBaseline = isHorizontal ? 'middle' : 'bottom';

          const layoutPadding = chart.options?.layout?.padding || 0;
          const resolvePadding = (side) =>
            (typeof layoutPadding === 'number' ? layoutPadding : layoutPadding?.[side] ?? 0);
          const paddingRight = resolvePadding('right');
          const paddingLeft = resolvePadding('left');

          let glyphWidth = 0;
          let labelWidth = 0;
          let totalWidth = 0;
          let glyphMetrics = null;
          let glyphLeftBearing = 0;

          if (rankGlyph) {
            ctx.font = glyphFont;
            glyphMetrics = ctx.measureText(rankGlyph);
            const actualLeft = glyphMetrics.actualBoundingBoxLeft ?? 0;
            const actualRight = glyphMetrics.actualBoundingBoxRight ?? 0;
            glyphLeftBearing = actualLeft;
            glyphWidth = actualLeft + actualRight;
            if (!glyphWidth || glyphWidth <= 0) {
              glyphWidth = glyphMetrics.width;
            }
            ctx.font = labelFont;
            labelWidth = ctx.measureText(formatted).width;
            totalWidth = glyphWidth + glyphSpacing + labelWidth;
          } else {
            ctx.font = labelFont;
            labelWidth = ctx.measureText(formatted).width;
            totalWidth = labelWidth;
          }

          const glyphGap = rankGlyph ? options.rankGlyphGap ?? (isHorizontal ? -4 : -4) : 0;
          let x = isHorizontal ? primaryPixel + offset + glyphGap : center;
          let y = isHorizontal ? center : primaryPixel - offset;

          if (isHorizontal) {
            const maxX = chart.width - paddingRight - 4;
            const minX = chartArea.left + paddingLeft + 4;
            const maxStart = maxX - totalWidth;
            if (Number.isFinite(maxStart)) {
              x = Math.min(x, maxStart);
            }
            const minStart = Math.max(minX, primaryPixel + offset + glyphGap);
            if (x < minStart) {
              x = minStart;
            }
            y = center;
          } else if (y < chartArea.top + 12) {
            y = chartArea.top + 12;
          }

          if (rankGlyph) {
            ctx.textAlign = 'left';

            if (isHorizontal) {
              ctx.font = glyphFont;
              ctx.fillStyle = glyphColor;
              const glyphStart = x - glyphLeftBearing;
              ctx.fillText(rankGlyph, glyphStart, y);

              ctx.font = labelFont;
              ctx.fillStyle = color;
              ctx.fillText(formatted, x + glyphWidth + glyphSpacing, y);
            } else {
              const minStart = chartArea.left + paddingLeft + 4;
              const maxStart = chartArea.right - paddingRight - 4 - totalWidth;
              let startX = x - totalWidth / 2;
              if (Number.isFinite(maxStart)) {
                startX = Math.min(startX, maxStart);
              }
              if (startX < minStart) {
                startX = minStart;
              }

              ctx.font = glyphFont;
              ctx.fillStyle = glyphColor;
              const glyphStart = startX - glyphLeftBearing;
              ctx.fillText(rankGlyph, glyphStart, y);

              ctx.font = labelFont;
              ctx.fillStyle = color;
              ctx.fillText(formatted, startX + glyphWidth + glyphSpacing, y);
            }
          } else {
            ctx.font = labelFont;
            ctx.fillStyle = color;
            ctx.textAlign = isHorizontal ? 'left' : 'center';

            if (isHorizontal) {
              const maxX = chart.width - paddingRight - 4 - totalWidth;
              const minX = chartArea.left + paddingLeft + 4;
              let startX = x;
              if (Number.isFinite(maxX)) {
                startX = Math.min(startX, maxX);
              }
              if (startX < minX) {
                startX = minX;
              }
              ctx.fillText(formatted, startX, y);
            } else {
              ctx.fillText(formatted, x, y);
            }
          }
          ctx.restore();
        });
      },
    };

    Chart.register(radarBackgroundPlugin, radarPointLabelsPlugin, barTotalsPlugin);

    const state = {
      userId: null,
      leagues: [],
      players: {},
      ktcOneQb: {},
      ktcSflx: {},
      playerStats: {},
      playerStatsSeason: null,
      leaguePlayerStats: {},
      currentLeagueId: null,
      currentLineupMetric: 'value',
      currentRadarMetric: 'ppg',
      isSuperflex: false,
      cache: {},
      championCache: {},
      charts: {
        lineup: null,
        overall: null,
        radar: null,
      },
      lineupData: null,
      teams: [],
      leaderboards: { ALL: [], QB: [], RB: [], WR: [], TE: [] },
      activeLeaderboard: 'ALL',
      radarSlots: [],
    };

    elements.usernameInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleFetchData();
      }
    });

    elements.leagueSelect?.addEventListener('change', () => {
      const leagueId = elements.leagueSelect.value;
      if (leagueId) {
        analyzeLeague(leagueId);
      }
    });

    elements.lineupToggle.forEach((button) => {
      button.addEventListener('click', () => {
        const metric = button.dataset.metric;
        if (!metric || metric === state.currentLineupMetric) return;
        state.currentLineupMetric = metric;
        elements.lineupToggle.forEach((btn) => {
          const isActive = btn.dataset.metric === metric;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        updateLineupChart();
      });
    });

    elements.radarToggle.forEach((button) => {
      button.addEventListener('click', () => {
        const metric = button.dataset.metric;
        if (!metric || metric === state.currentRadarMetric) return;
        state.currentRadarMetric = metric;
        elements.radarToggle.forEach((btn) => {
          const isActive = btn.dataset.metric === metric;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        updateRadarChart();
      });
    });

    elements.leaderboardFilters.forEach((button) => {
      button.addEventListener('click', () => {
        const pos = button.dataset.pos;
        if (!pos || pos === state.activeLeaderboard) return;
        state.activeLeaderboard = pos;
        elements.leaderboardFilters.forEach((btn) => {
          const isActive = btn.dataset.pos === pos;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderLeagueLeaders();
      });
    });

    if (initialUsername) {
      elements.usernameInput.value = initialUsername;
      // If arriving via nav with username in query, blur to avoid mobile keyboard
      setTimeout(() => { try { elements.usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { } }, 50);
      handleFetchData(initialLeagueId);
    }

    async function handleFetchData(targetLeagueId) {
      const username = elements.usernameInput.value.trim();
      if (!username) {
        alert('Please enter a Sleeper username.');
        return;
      }

      setLoading(true);
      hideContent();

      try {
        await Promise.all([fetchSleeperPlayers(), fetchKTCData()]);
        await fetchUserAndLeagues(username);

        if (state.leagues.length === 0) {
          throw new Error('No active dynasty leagues found for this user in the current season.');
        }

        if (targetLeagueId) {
          const target = state.leagues.find((league) => league.league_id === targetLeagueId);
          if (target) {
            elements.leagueSelect.value = targetLeagueId;
            await analyzeLeague(targetLeagueId);
            return;
          }
        }

        elements.leagueSelect.selectedIndex = 1;
        await analyzeLeague(state.leagues[0].league_id);
      } catch (error) {
        console.error('Analyzer fetch error:', error);
        alert(`An error occurred while loading data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    function hideContent() {
      elements.content.classList.add('hidden');
      elements.summaryStats.classList.add('hidden');
    }

    async function fetchWithCache(url) {
      if (state.cache[url]) {
        return state.cache[url];
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      state.cache[url] = data;
      return data;
    }

    async function fetchSleeperPlayers() {
      if (Object.keys(state.players).length > 0) return;
      state.players = await fetchWithCache('/api/sleeper/players/nfl');
    }

    async function fetchKTCData() {
      if (Object.keys(state.ktcOneQb).length > 0) return;

      const GOOGLE_SHEET_ID = '1MDTf1IouUIrm4qabQT9E5T0FsJhQtmaX55P32XK5c_0';
      const parseCsvData = async (sheet) => {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`);
        if (!response.ok) throw new Error('Failed to load KTC data.');
        return response.text();
      };

      const [oneQbCsv, sflxCsv] = await Promise.all([
        parseCsvData('KTC_1QB'),
        parseCsvData('KTC_SFLX'),
      ]);

      state.ktcOneQb = parseKtcCsv(oneQbCsv);
      state.ktcSflx = parseKtcCsv(sflxCsv);
    }

    function parseKtcCsv(csvText) {
      if (!csvText) return {};
      const lines = csvText.split('\n').filter(Boolean);
      if (lines.length <= 1) return {};

      const parseLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i += 1) {
          const char = line[i];
          if (inQuotes) {
            if (char === '"' && line[i + 1] === '"') {
              current += '"';
              i += 1;
            } else if (char === '"') {
              inQuotes = false;
            } else {
              current += char;
            }
          } else if (char === '"') {
            inQuotes = true;
          } else if (char === ',') {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const normalize = (header) => header.replace(/[\u00a0\u202f]/g, ' ').trim().toUpperCase();
      const headers = parseLine(lines[0]);
      const headerIndex = new Map();
      headers.forEach((header, idx) => {
        headerIndex.set(normalize(header), idx);
      });

      const getValue = (columns, names) => {
        const keys = Array.isArray(names) ? names : [names];
        for (const key of keys) {
          const index = headerIndex.get(normalize(key));
          if (index !== undefined && columns[index] !== undefined) {
            return columns[index].trim();
          }
        }
        return '';
      };

      const toInt = (value) => {
        const num = parseInt(value, 10);
        return Number.isNaN(num) ? null : num;
      };

      const dataMap = {};
      lines.slice(1).forEach((line) => {
        const columns = parseLine(line);
        if (!columns.length) return;

        const pos = getValue(columns, 'POS');
        const sleeperId = getValue(columns, 'SLPR_ID');
        const ktcValue = toInt(getValue(columns, ['VALUE', 'KTC']));

        if (pos === 'RDP') {
          const pickName = getValue(columns, 'PLAYER NAME');
          if (pickName) {
            dataMap[pickName] = { ktc: ktcValue ?? 0 };
          }
          return;
        }

        if (!sleeperId || sleeperId === 'NA') return;
        dataMap[sleeperId] = { ktc: ktcValue ?? 0 };
      });

      return dataMap;
    }

    async function fetchUserAndLeagues(username) {
      const user = await fetchWithCache(`https://api.sleeper.app/v1/user/${username}`);
      if (!user || !user.user_id) {
        throw new Error('Sleeper user not found.');
      }
      state.userId = user.user_id;

      const currentYear = 2025;
      const leagues = await fetchWithCache(`https://api.sleeper.app/v1/user/${state.userId}/leagues/nfl/${currentYear}`);
      if (!Array.isArray(leagues) || leagues.length === 0) {
        throw new Error('No active leagues found for this user in the current season.');
      }

      // Analyzer league source:
      // targets the analyzer dropdown and every chart/table driven by the selected league.
      // Reuse the shared dynasty-only filter from `app.js` when available so analyzer stays
      // in sync with Rosters, Ownership, and the Stats modal; fall back to the same Sleeper
      // `settings.type = 2` rule if the shared helper is unavailable.
      const dynastyOnlyLeagues = (typeof window !== 'undefined' && typeof window.filterDynastyLeagues === 'function')
        ? window.filterDynastyLeagues(leagues)
        : leagues.filter((league) => Number.parseInt(league?.settings?.type, 10) === 2);
      if (dynastyOnlyLeagues.length === 0) {
        throw new Error('No active dynasty leagues found for this user in the current season.');
      }

      state.leagues = dynastyOnlyLeagues.sort((a, b) => a.name.localeCompare(b.name));
      populateLeagueSelect(state.leagues);
    }

    async function ensurePlayerStats(season) {
      if (state.playerStatsSeason === season && Object.keys(state.playerStats).length > 0) {
        return;
      }
      const url = `https://api.sleeper.app/v1/stats/nfl/regular/${season}`;
      const rawStats = await fetchWithCache(url);
      state.playerStats = transformSeasonStats(rawStats);
      state.playerStatsSeason = season;
    }

    /**
     * Fetch league-specific FPTS & PPG by aggregating per-player points
     * from every regular-season matchup week (1–18).
     * Each matchup entry contains a `players_points` object keyed by
     * player ID with the fantasy points scored under that league's
     * scoring settings.
     */
    async function fetchLeaguePlayerStats(leagueId) {
      const TOTAL_WEEKS = 18;
      const weekPromises = [];
      for (let week = 1; week <= TOTAL_WEEKS; week += 1) {
        weekPromises.push(
          fetchWithCache(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`)
            .catch(() => null),
        );
      }
      const allWeeks = await Promise.all(weekPromises);

      const aggregated = {}; // playerId -> { total, games }

      allWeeks.forEach((weekMatchups) => {
        if (!Array.isArray(weekMatchups)) return;
        weekMatchups.forEach((entry) => {
          const pointsMap = entry.players_points;
          if (!pointsMap || typeof pointsMap !== 'object') return;
          Object.entries(pointsMap).forEach(([playerId, pts]) => {
            const points = toNumber(pts);
            if (!aggregated[playerId]) {
              aggregated[playerId] = { total: 0, games: 0 };
            }
            aggregated[playerId].total += points;
            // Count a game played if the player scored any non-zero points
            if (points !== 0) {
              aggregated[playerId].games += 1;
            }
          });
        });
      });

      // Compute PPG
      const result = {};
      Object.entries(aggregated).forEach(([playerId, data]) => {
        const ppg = data.games > 0 ? data.total / data.games : 0;
        result[playerId] = {
          total: data.total,
          games: data.games,
          ppg,
        };
      });

      state.leaguePlayerStats = result;
    }

    function transformSeasonStats(rawStats) {
      const result = {};
      if (!rawStats) return result;

      const processEntry = (playerId, stats) => {
        if (!playerId || !stats) return;
        const total = toNumber(stats.pts_ppr ?? stats.fpts_ppr ?? stats.fpts ?? 0);
        const games = toNumber(stats.gp ?? stats.games_played ?? stats.gm ?? 0);
        const ppg = games > 0 ? total / games : 0;
        result[playerId] = {
          total,
          games,
          ppg,
        };
      };

      if (Array.isArray(rawStats)) {
        rawStats.forEach((entry) => {
          if (!entry) return;
          const playerId = entry.player_id || entry.playerId || entry.id;
          processEntry(playerId, entry);
        });
      } else if (typeof rawStats === 'object') {
        Object.entries(rawStats).forEach(([playerId, stats]) => {
          processEntry(playerId, stats);
        });
      }

      return result;
    }

    function toNumber(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function resolveChampionSourceLeagueId(leagueInfo) {
      const season = Number.parseInt(leagueInfo?.season, 10);
      if (season === 2025) {
        return leagueInfo?.league_id || null;
      }
      return leagueInfo?.previous_league_id || null;
    }

    // Analyzer champion lookup:
    // mirrors the rosters bracket winner lookup but stays self-contained so the
    // standings crown does not rely on app.js or shared roster rendering state.
    async function fetchAnalyzerChampionData(leagueInfo) {
      const sourceLeagueId = resolveChampionSourceLeagueId(leagueInfo);
      if (!sourceLeagueId) return null;

      if (state.championCache[sourceLeagueId]) {
        return state.championCache[sourceLeagueId];
      }

      try {
        const [rosters, winnersBracket] = await Promise.all([
          fetchWithCache(`https://api.sleeper.app/v1/league/${sourceLeagueId}/rosters`),
          fetchWithCache(`https://api.sleeper.app/v1/league/${sourceLeagueId}/winners_bracket`),
        ]);

        let winnerRosterId = null;
        if (Array.isArray(winnersBracket) && winnersBracket.length) {
          const maxRound = Math.max(...winnersBracket.map((match) => Number(match?.r) || 0));
          const finals = winnersBracket.filter((match) => (Number(match?.r) || 0) === maxRound);
          const champMatch = finals.find((match) => Number(match?.p) === 1);
          if (champMatch?.w) {
            winnerRosterId = champMatch.w;
          } else if (finals.length === 1 && finals[0]?.w) {
            winnerRosterId = finals[0].w;
          }
        }

        const rostersByOwner = {};
        (Array.isArray(rosters) ? rosters : []).forEach((roster) => {
          if (!roster?.owner_id) return;
          rostersByOwner[roster.owner_id] = roster;
        });

        const result = { sourceLeagueId, rostersByOwner, winnerRosterId };
        state.championCache[sourceLeagueId] = result;
        return result;
      } catch (error) {
        console.warn('Analyzer champion lookup failed:', error);
        const fallback = { sourceLeagueId, rostersByOwner: {}, winnerRosterId: null };
        state.championCache[sourceLeagueId] = fallback;
        return fallback;
      }
    }

    function applyChampionFlags(teams, championData) {
      return (teams || []).map((team) => {
        const previousRoster = championData?.rostersByOwner?.[team?.roster?.owner_id];
        const isChamp = Boolean(
          previousRoster
          && championData?.winnerRosterId
          && championData.winnerRosterId === previousRoster.roster_id,
        );
        return {
          ...team,
          isChamp,
        };
      });
    }

    async function analyzeLeague(leagueId) {
      try {
        setLoading(true);
        hideContent();

        const leagueInfo = state.leagues.find((league) => league.league_id === leagueId);
        if (!leagueInfo) throw new Error('League not found.');

        state.currentLeagueId = leagueId;
        const qbSlots = leagueInfo.roster_positions.filter((slot) => slot === 'QB').length;
        const superflexSlots = leagueInfo.roster_positions.filter((slot) => slot === 'SUPER_FLEX').length;
        state.isSuperflex = qbSlots > 1 || superflexSlots > 0;

        await ensurePlayerStats(leagueInfo.season ?? 2025);
        await fetchLeaguePlayerStats(leagueId);

        const [rosters, users, tradedPicks, championData] = await Promise.all([
          fetchWithCache(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
          fetchWithCache(`https://api.sleeper.app/v1/league/${leagueId}/users`),
          fetchWithCache(`https://api.sleeper.app/v1/league/${leagueId}/traded_picks`),
          fetchAnalyzerChampionData(leagueInfo),
        ]);

        const radarSlots = buildRadarSlots(leagueInfo.roster_positions || []);
        const processed = processLeagueData(rosters, users, tradedPicks, leagueInfo, radarSlots);
        const teamsWithChampionFlags = applyChampionFlags(processed.teams, championData);

        state.teams = teamsWithChampionFlags;
        state.leaderboards = processed.leaderboards;
        state.radarSlots = processed.radarSlots;

        renderSummaryStats(state.teams);
        renderLineupChart(state.teams);
        renderOverallChart(state.teams);
        renderRadarChart(state.teams, state.radarSlots);
        renderStandings(state.teams);
        renderLeagueLeaders();

        elements.content.classList.remove('hidden');
        if (!elements.summaryStats.classList.contains('hidden')) {
          // already visible
        } else {
          elements.summaryStats.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Analyze league error:', error);
        alert(`Failed to analyze league: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    function processLeagueData(rosters, users, tradedPicks, leagueInfo, radarSlots = []) {
      const userMap = Array.isArray(users)
        ? users.reduce((acc, user) => {
          acc[user.user_id] = user;
          return acc;
        }, {})
        : {};

      const leaderboards = { ALL: [], QB: [], RB: [], WR: [], TE: [] };
      const globalTotals = [];
      const slotSequence = Array.isArray(radarSlots) && radarSlots.length
        ? radarSlots
        : buildRadarSlots(leagueInfo?.roster_positions || []);

      const teams = (Array.isArray(rosters) ? rosters : []).map((roster) => {
        const owner = userMap[roster.owner_id] || userMap[roster.co_owner_id];
        const teamName = roster.metadata?.team_name || owner?.display_name || `Team ${roster.roster_id}`;

        const startersBySlot = {};
        SLOT_ORDER.forEach((slot) => {
          startersBySlot[slot] = { value: 0, ppg: 0, players: [] };
        });

        const startersValueByPos = { QB: 0, RB: 0, WR: 0, TE: 0 };
        const starterIds = roster.starters || [];
        const rosterPositions = leagueInfo.roster_positions || [];
        let topScorer = null;

        starterIds.forEach((playerId, index) => {
          const slotRaw = rosterPositions[index] || 'BN';
          const slot = normalizeSlot(slotRaw);
          if (!slot) return;
          if (!startersBySlot[slot]) {
            startersBySlot[slot] = { value: 0, ppg: 0, players: [] };
          }

          const playerInfo = state.players[playerId];
          const leagueStats = state.leaguePlayerStats[playerId] || {};
          const playerStats = state.playerStats[playerId] || {};
          const ktc = getKtcValue(playerId);
          const ppg = leagueStats.ppg ?? playerStats.ppg ?? 0;

          startersBySlot[slot].value += ktc;
          startersBySlot[slot].ppg += ppg;

          const playerName = formatPlayerName(playerInfo);
          startersBySlot[slot].players.push({ name: playerName, value: ktc, ppg });

          const pos = playerInfo?.position;
          if (pos && startersValueByPos[pos] !== undefined) {
            startersValueByPos[pos] += ktc;
          }
        });

        const overallPositional = { QB: 0, RB: 0, WR: 0, TE: 0, Picks: 0 };
        const allPlayers = (roster.players || [])
          .map((playerId) => {
            const playerInfo = state.players[playerId];
            const leagueStats = state.leaguePlayerStats[playerId] || {};
            const stats = state.playerStats[playerId] || {};
            const ktc = getKtcValue(playerId);
            const pos = playerInfo?.position;
            const ppg = leagueStats.ppg ?? stats.ppg ?? (stats.games ? stats.total / stats.games : 0);
            if (pos && overallPositional[pos] !== undefined) {
              overallPositional[pos] += ktc;
            }
            return {
              id: playerId,
              pos,
              ktc,
              ppg,
              name: formatPlayerName(playerInfo),
            };
          })
          .sort((a, b) => b.ktc - a.ktc);

        getOwnedPicks(roster.roster_id, rosters, tradedPicks, leagueInfo).forEach((pick) => {
          overallPositional.Picks += getKtcValue(pick.label);
        });

        // Analyzer lineup derivation:
        // rebuilds the lineup charts from league starter settings instead of Sleeper's
        // manual starter slots. FLEX pulls from leftover RB/WR/TE options, while
        // SUPER_FLEX only consumes the next remaining QB for the selected metric.
        const derivedLineups = {
          value: buildDerivedLineup(allPlayers, leagueInfo?.roster_positions || [], slotSequence, 'value'),
          ppg: buildDerivedLineup(allPlayers, leagueInfo?.roster_positions || [], slotSequence, 'ppg'),
        };

        const totalValue = Object.values(overallPositional).reduce((sum, value) => sum + value, 0);
        const startersValueTotal = SLOT_ORDER.reduce((sum, slot) => sum + (startersBySlot[slot]?.value ?? 0), 0);
        const starterPpgTotal = SLOT_ORDER.reduce((sum, slot) => sum + (startersBySlot[slot]?.ppg ?? 0), 0);

        const settings = roster.settings || {};
        const wins = toNumber(settings.wins);
        const losses = toNumber(settings.losses);
        const ties = toNumber(settings.ties);
        const pf = combineScore(settings.fpts, settings.fpts_decimal);
        const pa = combineScore(settings.fpts_against, settings.fpts_against_decimal);
        const gamesPlayed = wins + losses + ties;
        const teamPpg = gamesPlayed > 0 ? pf / gamesPlayed : 0;

        const record = ties ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;

        (roster.players || []).forEach((playerId) => {
          const playerInfo = state.players[playerId];
          if (!playerInfo) return;
          const pos = playerInfo.position;
          if (!leaderboards[pos]) return;
          const leagueStats = state.leaguePlayerStats[playerId] || {};
          const stats = state.playerStats[playerId] || {};
          const total = leagueStats.total ?? stats.total ?? 0;
          const ppg = leagueStats.ppg ?? stats.ppg ?? (stats.games ? stats.total / stats.games : 0);
          if (total <= 0) return;
          if (!topScorer || total > topScorer.total) {
            topScorer = {
              playerId,
              name: formatPlayerName(playerInfo),
              total,
              ppg,
            };
          }
          globalTotals.push({ playerId, total });
          const entry = {
            playerId,
            name: formatPlayerName(playerInfo),
            pos,
            owner: teamName,
            nflTeam: playerInfo.team || '--',
            total,
            ppg,
          };
          leaderboards[pos].push(entry);
          leaderboards.ALL.push(entry);
        });

        return {
          teamName,
          roster,
          overallPositional,
          startersBySlot,
          startersValueByPos,
          allPlayers,
          derivedLineups,
          totalValue,
          startersValueTotal,
          starterPpgTotal,
          wins,
          losses,
          ties,
          record,
          totalFpts: pf,
          pointsAgainst: pa,
          teamPpg,
          isUserTeam: roster.owner_id === state.userId,
          topScorer,
        };
      });

      const rankMap = {};
      globalTotals
        .filter((entry) => entry.total > 0)
        .sort((a, b) => b.total - a.total)
        .forEach((entry, index) => {
          if (!rankMap[entry.playerId]) {
            rankMap[entry.playerId] = index + 1;
          }
        });

      teams.forEach((team) => {
        if (team.topScorer?.playerId) {
          team.topScorer.rank = rankMap[team.topScorer.playerId] || null;
        }
      });

      Object.keys(leaderboards).forEach((pos) => {
        leaderboards[pos] = leaderboards[pos]
          .sort((a, b) => {
            if (b.total !== a.total) return b.total - a.total;
            if (b.ppg !== a.ppg) return b.ppg - a.ppg;
            return a.name.localeCompare(b.name);
          })
          .slice(0, 100);
      });

      teams.sort((a, b) => b.totalValue - a.totalValue);
      return { teams, leaderboards, radarSlots: slotSequence };
    }

    function normalizeSlot(slot) {
      if (!slot) return null;
      if (SLOT_ORDER.includes(slot)) return slot;
      const normalized = SLOT_ALIASES[slot];
      if (normalized) return normalized;
      if (slot.includes('FLEX')) return 'FLEX';
      if (slot.includes('QB')) return 'QB';
      if (slot.includes('RB')) return 'RB';
      if (slot.includes('WR')) return 'WR';
      if (slot.includes('TE')) return 'TE';
      return null;
    }

    function buildRadarSlots(rosterPositions = []) {
      const counts = {};
      const slots = [];

      (rosterPositions || []).forEach((slot) => {
        const normalized = normalizeSlot(slot);
        if (!normalized || !RADAR_SLOT_TYPES.includes(normalized)) return;
        counts[normalized] = (counts[normalized] || 0) + 1;
        slots.push({
          type: normalized,
          label: buildRadarLabel(normalized, counts[normalized]),
        });
      });

      if (!slots.length) {
        ['QB', 'RB', 'WR', 'TE'].forEach((type) => {
          slots.push({ type, label: buildRadarLabel(type, 1) });
        });
      }

      return slots;
    }

    function buildRadarLabel(type, count) {
      switch (type) {
        case 'QB':
          return count > 1 ? `QB${count}` : 'QB';
        case 'RB':
          return `RB${count}`;
        case 'WR':
          return `WR${count}`;
        case 'TE':
          return count > 1 ? `TE${count}` : 'TE';
        case 'FLEX':
          return count > 1 ? `Flex ${count}` : 'Flex';
        case 'SUPER_FLEX':
          return count > 1 ? `SFlex ${count}` : 'SFlex';
        default:
          return type;
      }
    }

    function createDerivedSlotTotals() {
      const slotTotals = {};
      SLOT_ORDER.forEach((slot) => {
        slotTotals[slot] = { value: 0, ppg: 0, players: [] };
      });
      return slotTotals;
    }

    function compareDerivedCandidates(a, b, metricKey) {
      const primaryDiff = (Number(b?.[metricKey]) || 0) - (Number(a?.[metricKey]) || 0);
      if (primaryDiff !== 0) return primaryDiff;

      const secondaryKey = metricKey === 'ppg' ? 'ktc' : 'ppg';
      const secondaryDiff = (Number(b?.[secondaryKey]) || 0) - (Number(a?.[secondaryKey]) || 0);
      if (secondaryDiff !== 0) return secondaryDiff;

      return (a?.name || '').localeCompare(b?.name || '');
    }

    function buildDerivedLineup(players = [], rosterPositions = [], slotSequence = [], metric = 'value') {
      const orderedSlots = Array.isArray(slotSequence) && slotSequence.length
        ? slotSequence
        : buildRadarSlots(rosterPositions || []);
      const startersBySlot = createDerivedSlotTotals();
      const assignments = orderedSlots.map((slot) => ({ ...slot, score: 0, player: null }));
      const totals = { value: 0, ppg: 0 };

      if (!orderedSlots.length) {
        return { startersBySlot, assignments, totals };
      }

      const metricKey = metric === 'ppg' ? 'ppg' : 'ktc';
      const availableByPos = { QB: [], RB: [], WR: [], TE: [] };

      (players || []).forEach((player) => {
        if (!player?.pos || !availableByPos[player.pos]) return;
        availableByPos[player.pos].push({
          ...player,
          ktc: Number(player.ktc) || 0,
          ppg: Number(player.ppg) || 0,
        });
      });

      Object.keys(availableByPos).forEach((pos) => {
        availableByPos[pos].sort((a, b) => compareDerivedCandidates(a, b, metricKey));
      });

      const used = new Set();
      const indices = {};

      const takeAt = (pos, forcedIndex) => {
        const list = availableByPos[pos] || [];
        if (!list.length) return null;

        let idx = forcedIndex ?? indices[pos] ?? 0;
        while (idx < list.length && used.has(list[idx]?.id)) {
          idx += 1;
        }

        if (idx >= list.length) return null;
        indices[pos] = idx + 1;

        const player = list[idx];
        used.add(player.id);
        return player;
      };

      const peekNext = (pos) => {
        const list = availableByPos[pos] || [];
        let idx = indices[pos] ?? 0;
        while (idx < list.length && used.has(list[idx]?.id)) {
          idx += 1;
        }
        return { player: list[idx], index: idx };
      };

      const takeBestFlex = () => {
        let bestPlayer = null;
        let bestPos = null;
        let bestIndex = null;

        RADAR_FLEX_ELIGIBLE.forEach((pos) => {
          const { player, index } = peekNext(pos);
          if (!player) return;
          if (!bestPlayer || compareDerivedCandidates(player, bestPlayer, metricKey) < 0) {
            bestPlayer = player;
            bestPos = pos;
            bestIndex = index;
          }
        });

        if (!bestPlayer || !bestPos) return null;
        return takeAt(bestPos, bestIndex);
      };

      const applySelection = (slot, idx, selected) => {
        const playerValue = Number(selected.ktc) || 0;
        const playerPpg = Number(selected.ppg) || 0;
        const score = metric === 'ppg' ? playerPpg : playerValue;

        startersBySlot[slot.type].value += playerValue;
        startersBySlot[slot.type].ppg += playerPpg;
        startersBySlot[slot.type].players.push({
          name: selected.name,
          value: playerValue,
          ppg: playerPpg,
        });

        totals.value += playerValue;
        totals.ppg += playerPpg;

        assignments[idx] = {
          ...slot,
          score,
          player: {
            id: selected.id,
            name: selected.name,
            value: playerValue,
            ppg: playerPpg,
            score,
          },
        };
      };

      // Analyzer lineup slot filling:
      // exact position requirements are always filled before FLEX leftovers, so the chart
      // follows league starter counts even if Sleeper's slot array order varies.
      const fillSlots = (slotMatcher, takePlayer) => {
        orderedSlots.forEach((slot, idx) => {
          if (!slotMatcher(slot)) return;

          const selected = takePlayer(slot);
          if (!selected) {
            assignments[idx] = { ...slot, score: 0, player: null };
            return;
          }

          applySelection(slot, idx, selected);
        });
      };

      fillSlots((slot) => POSITION_ORDER.includes(slot.type), (slot) => takeAt(slot.type));
      fillSlots((slot) => slot.type === 'FLEX', () => takeBestFlex());
      fillSlots((slot) => slot.type === 'SUPER_FLEX', () => takeAt('QB'));

      return { startersBySlot, assignments, totals };
    }

    function formatPlayerName(playerInfo) {
      if (!playerInfo) return 'Unknown Player';
      if (playerInfo.full_name) return playerInfo.full_name;
      const first = playerInfo.first_name ? `${playerInfo.first_name} ` : '';
      const last = playerInfo.last_name || '';
      const name = `${first}${last}`.trim();
      return name || 'Unknown Player';
    }

    function combineScore(base, decimal) {
      const whole = toNumber(base);
      const fraction = typeof decimal === 'string' || typeof decimal === 'number'
        ? toNumber(decimal) / 100
        : 0;
      return whole + fraction;
    }

    function getKtcValue(id) {
      if (!id) return 0;
      const source = state.isSuperflex ? state.ktcSflx : state.ktcOneQb;
      return source[id]?.ktc ?? 0;
    }

    function getOwnedPicks(rosterId, allRosters, tradedPicks, leagueInfo) {
      const currentYear = new Date().getFullYear();
      const picks = [];
      const draftRounds = leagueInfo?.settings?.draft_rounds || 4;

      (allRosters || []).forEach((roster) => {
        for (let year = 1; year <= 4; year += 1) {
          const season = String(currentYear + year);
          for (let round = 1; round <= draftRounds; round += 1) {
            picks.push({
              season,
              round,
              roster_id: roster.roster_id,
              owner_id: roster.roster_id,
            });
          }
        }
      });

      (tradedPicks || []).forEach((trade) => {
        const pickIndex = picks.findIndex(
          (pick) => pick.season === trade.season && pick.round === trade.round && pick.roster_id === trade.roster_id,
        );
        if (pickIndex !== -1) {
          picks[pickIndex].owner_id = trade.owner_id;
        }
      });

      return picks
        .filter((pick) => pick.owner_id === rosterId)
        .sort((a, b) => a.season.localeCompare(b.season) || a.round - b.round)
        .map((pick) => ({ ...pick, label: `${pick.season} Mid ${ordinal(pick.round)}` }));
    }

    function ordinal(i) {
      const j = i % 10;
      const k = i % 100;
      if (j === 1 && k !== 11) return `${i}st`;
      if (j === 2 && k !== 12) return `${i}nd`;
      if (j === 3 && k !== 13) return `${i}rd`;
      return `${i}th`;
    }

    function abbreviateFirstName(fullName) {
      if (typeof fullName !== 'string') return fullName || '';
      const trimmed = fullName.trim();
      if (!trimmed) return '';
      const parts = trimmed.split(/\s+/);
      if (parts.length === 1) {
        return parts[0];
      }
      const [first, ...rest] = parts;
      const initial = first ? `${first.charAt(0).toUpperCase()}.` : '';
      const remainder = rest.join(' ');
      return remainder ? `${initial} ${remainder}`.trim() : initial;
    }

    function renderSummaryStats(teams) {
      const userTeam = teams.find((team) => team.isUserTeam);
      if (!userTeam) {
        elements.summaryStats.classList.add('hidden');
        return;
      }

      const totalTeams = teams.length;
      const standingsOrder = sortTeamsByStandings(teams);
      const overallRank = computeRank(standingsOrder, (team) => team.isUserTeam);

      const starterValueRank = computeRank(
        [...teams].sort((a, b) => b.startersValueTotal - a.startersValueTotal),
        (team) => team.isUserTeam,
      );

      const totalValueRank = computeRank(
        [...teams].sort((a, b) => b.totalValue - a.totalValue),
        (team) => team.isUserTeam,
      );

      const fptsRank = computeRank(
        [...teams].sort((a, b) => b.totalFpts - a.totalFpts),
        (team) => team.isUserTeam,
      );

      const starterPpgRank = computeRank(
        [...teams].sort((a, b) => b.starterPpgTotal - a.starterPpgTotal),
        (team) => team.isUserTeam,
      );

      const rankingValue = overallRank ? `#${overallRank}` : '—';
      const rankingMetaParts = [];
      if (userTeam.record) rankingMetaParts.push(userTeam.record);
      if (totalTeams) rankingMetaParts.push(`${totalTeams} Teams`);
      const rankingMeta = rankingMetaParts.length ? rankingMetaParts.join(' • ') : '—';

      const topScorer = userTeam.topScorer;
      const topScorerMeta = topScorer?.total
        ? [
          topScorer.rank ? `Rank ${topScorer.rank}` : 'Rank NA',
          `${topScorer.total.toFixed(1)} FPTS`,
        ]
          .filter(Boolean)
          .join(' • ')
        : 'No scoring data';

      const chips = [
        {
          label: 'Ranking',
          value: rankingValue,
          meta: rankingMeta,
          accent: overallRank ? getRankColor(overallRank, totalTeams) : undefined,
        },
        {
          label: 'TTL Team Value',
          value: formatNumber(userTeam.totalValue),
          meta: totalValueRank ? `Rank ${totalValueRank}/${totalTeams}` : 'KTC',
          accent: totalValueRank ? getRankColor(totalValueRank, totalTeams) : undefined,
        },
        {
          label: 'Starter Value',
          value: formatNumber(userTeam.startersValueTotal),
          meta: starterValueRank ? `Rank ${starterValueRank}/${totalTeams}` : 'Rank NA',
          accent: starterValueRank ? getRankColor(starterValueRank, totalTeams) : undefined,
        },
        {
          label: 'Total FPTS',
          value: userTeam.totalFpts.toFixed(1),
          meta: fptsRank ? `Rank ${fptsRank}/${totalTeams}` : 'Rank NA',
          accent: fptsRank ? getRankColor(fptsRank, totalTeams) : undefined,
        },
        {
          label: 'Starter PPG',
          value: userTeam.starterPpgTotal.toFixed(1),
          meta: starterPpgRank ? `Rank ${starterPpgRank}/${totalTeams}` : 'Rank NA',
          accent: starterPpgRank ? getRankColor(starterPpgRank, totalTeams) : undefined,
        },
        {
          label: 'Top Scorer',
          value: topScorer?.name ? abbreviateFirstName(topScorer.name) : '—',
          meta: topScorerMeta,
          accent: topScorer?.total ? 'var(--color-accent-secondary)' : undefined,
          className: 'analyzer-chip--top-scorer',
        },
      ];

      elements.summaryStats.innerHTML = chips
        .map((chip) => `
          <article class="analyzer-chip${chip.className ? ` ${chip.className}` : ''}">
            <span class="chip-label">${chip.label}</span>
            <span class="chip-value"${chip.accent ? ` style="color: ${chip.accent};"` : ''}>${chip.value}</span>
            <span class="chip-meta">${chip.meta}</span>
          </article>
        `)
        .join('');

      elements.summaryStats.classList.remove('hidden');
    }

    function renderLineupChart(teams) {
      state.lineupData = buildLineupDatasets(teams);
      if (state.charts.lineup) {
        state.charts.lineup.destroy();
      }
      const metricConfig = state.lineupData[state.currentLineupMetric];
      state.charts.lineup = createStackedBarChart(
        elements.startersCanvas,
        teams.map((team) => truncateLabel(team.teamName)),
        metricConfig.datasets,
        buildLineupOptions(metricConfig.max, state.currentLineupMetric, teams),
      );
    }

    function updateLineupChart() {
      if (!state.charts.lineup || !state.lineupData) return;
      const metricConfig = state.lineupData[state.currentLineupMetric];
      state.charts.lineup.data.datasets = metricConfig.datasets;
      const teamLabels = (state.teams || []).map((team) => truncateLabel(team.teamName));
      if (teamLabels.length) {
        state.charts.lineup.data.labels = teamLabels;
      }
      state.charts.lineup.options = buildLineupOptions(
        metricConfig.max,
        state.currentLineupMetric,
        state.teams || [],
      );
      state.charts.lineup.update();
    }

    function updateRadarChart() {
      if (!state.teams?.length) return;
      renderRadarChart(state.teams, state.radarSlots);
    }

    function buildLineupDatasets(teams) {
      const createDatasetForMetric = (metric) => {
        const datasets = [];
        SLOT_ORDER.forEach((slot) => {
          const values = teams.map((team) => team.derivedLineups?.[metric]?.startersBySlot?.[slot]?.[metric] ?? 0);
          if (!values.some((value) => value > 0)) return;
          const colorSource = metric === 'value' ? LINEUP_VALUE_COLORS : LINEUP_PPG_COLORS;
          const hex = colorSource[slot] || colorSource.FLEX || '#37ebb5';
          const gradientPair = buildGradientPair(hex);
          datasets.push({
            label: SLOT_LABELS[slot] || slot,
            slotKey: slot,
            data: values,
            backgroundColor: (context) => createGradient(context, gradientPair),
            borderColor: hexToRgba(hex, 0.95),
            borderWidth: 1,
            borderRadius: 10,
            barPercentage: 0.9,
            categoryPercentage: 0.7,
            stack: 'lineup',
          });
        });

        const maxValue = Math.max(
          0,
          ...teams.map((team) => team.derivedLineups?.[metric]?.totals?.[metric] ?? 0),
        );

        return { datasets, max: maxValue };
      };

      return {
        value: createDatasetForMetric('value'),
        ppg: createDatasetForMetric('ppg'),
      };
    }

    function buildLineupOptions(max, metric, teams) {
      const formatter = metric === 'value' ? formatNumber : formatPpg;
      const paddedMax = max > 0 ? max * 1.06 : max;
      const axisMax = metric === 'value'
        ? roundUpTo(paddedMax, 5000)
        : roundUpTo(paddedMax, 5);
      const isMobile = window.matchMedia('(max-width: 640px)').matches;

      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        interaction: { mode: 'nearest', intersect: false },
        onClick: (evt, elements, chart) => {
          const tooltip = chart.tooltip;
          if (!tooltip) return;

          const activeElements = tooltip.getActiveElements();

          if (activeElements.length > 0) {
            const lastActiveElement = activeElements[0];
            tooltip.setActiveElements([], { x: 0, y: 0 });

            if (elements.length > 0) {
              const newElement = elements[0];
              if (lastActiveElement.datasetIndex !== newElement.datasetIndex || lastActiveElement.index !== newElement.index) {
                tooltip.setActiveElements(elements, evt);
              }
            }
          } else if (elements.length > 0) {
            tooltip.setActiveElements(elements, evt);
          }

          chart.update();
        },
        layout: {
          padding: {
            left: isMobile ? 2 : 4,
            right: isMobile ? 34 : 46,
            top: 6,
            bottom: 6,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(234, 235, 240, 0.08)' },
            ticks: {
              color: '#EAEBF0',
              callback: (value) => formatter(value),
              font: {
                size: isMobile ? 10 : 12,
                family: "'Product Sans', 'Google Sans', sans-serif",
              },
            },
            max: axisMax,
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: {
              color: '#EAEBF0',
              padding: isMobile ? 1 : 2,
              font: {
                size: isMobile ? 10 : 12,
                family: "'Product Sans', 'Google Sans', sans-serif",
                weight: '600',
              },
              callback(value) {
                const label = this.getLabelForValue ? this.getLabelForValue(value) : value;
                return truncateLabel(label);
              },
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#EAEBF0',
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(13, 14, 35, 0.92)',
            borderColor: 'rgba(118, 109, 255, 0.5)',
            borderWidth: 1,
            callbacks: {
              title: (items) => {
                if (!items?.length) return '';
                const index = items[0].dataIndex;
                return teams[index]?.teamName || '';
              },
              label: (context) => {
                const value = context.raw ?? 0;
                return `${context.dataset.label}: ${formatter(value)}`;
              },
              footer: (tooltipItems) => {
                if (!tooltipItems.length) return '';
                const teamIndex = tooltipItems[0].dataIndex;
                const slotKey = tooltipItems[0].dataset.slotKey;
                const team = teams[teamIndex];
                const players = team?.derivedLineups?.[metric]?.startersBySlot?.[slotKey]?.players || [];
                const valueKey = metric === 'value' ? 'value' : 'ppg';
                return players
                  .slice()
                  .sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0))
                  .slice(0, 3)
                  .map((player) => `${player.name}: ${formatter(player[valueKey] || 0)}`)
                  .join('\n');
              },
            },
          },
          analyzerBarTotals: {
            enabled: true,
            offset: isMobile ? 10 : 18,
            formatter: (value) => formatter(value),
            mobileFont: '9px "Product Sans", "Google Sans", sans-serif',
            rankFontCssVar: '--analyzer-rank-glyph-font',
          },
        },
      };
    }

    function createGradient(context, colors = ['rgba(118, 109, 255, 0.8)', 'rgba(118, 109, 255, 0.4)']) {
      const { chart } = context;
      const { ctx, chartArea } = chart;
      if (!chartArea) return colors[0];
      const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1] ?? colors[0]);
      return gradient;
    }

    function hexToRgba(hex, alpha = 1) {
      if (!hex) return `rgba(255, 255, 255, ${alpha})`;
      let sanitized = hex.replace('#', '');
      if (sanitized.length === 3) {
        sanitized = sanitized
          .split('')
          .map((char) => char + char)
          .join('');
      }
      const bigint = parseInt(sanitized, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function buildGradientPair(hex) {
      return [hexToRgba(hex, 0.8), hexToRgba(hex, 0.32)];
    }

    function createStackedBarChart(canvas, labels, datasets, options) {
      return new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets },
        options,
      });
    }

    function renderOverallChart(teams) {
      if (state.charts.overall) {
        state.charts.overall.destroy();
      }

      const labels = teams.map((team) => truncateLabel(team.teamName));
      const positions = ['QB', 'RB', 'WR', 'TE', 'Picks'];
      const datasets = positions
        .map((pos) => {
          const values = teams.map((team) => team.overallPositional[pos] || 0);
          if (!values.some((value) => value > 0)) return null;
          const hex = OVERALL_VALUE_COLORS[pos] || '#3700B3';
          const gradientPair = buildGradientPair(hex);
          return {
            label: SLOT_LABELS[pos] || pos,
            slotKey: pos,
            data: values,
            backgroundColor: (context) => createGradient(context, gradientPair),
            borderColor: hexToRgba(hex, 0.92),
            borderWidth: 1,
            borderRadius: 10,
            barPercentage: 0.9,
            categoryPercentage: 0.7,
            stack: 'overall',
          };
        })
        .filter(Boolean);

      const maxValue = Math.max(0, ...teams.map((team) => team.totalValue));
      const paddedMaxValue = maxValue > 0 ? maxValue * 1.06 : maxValue;
      const isMobile = window.matchMedia('(max-width: 640px)').matches;

      const totalsPluginOffset = isMobile ? 10 : 18;

      state.charts.overall = createStackedBarChart(
        elements.overallCanvas,
        labels,
        datasets,
        {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          interaction: { mode: 'nearest', intersect: false },
          onClick: (evt, elements, chart) => {
            const tooltip = chart.tooltip;
            if (!tooltip) return;

            const activeElements = tooltip.getActiveElements();

            if (activeElements.length > 0) {
              const lastActiveElement = activeElements[0];
              tooltip.setActiveElements([], { x: 0, y: 0 });

              if (elements.length > 0) {
                const newElement = elements[0];
                if (lastActiveElement.datasetIndex !== newElement.datasetIndex || lastActiveElement.index !== newElement.index) {
                  tooltip.setActiveElements(elements, evt);
                }
              }
            } else if (elements.length > 0) {
              tooltip.setActiveElements(elements, evt);
            }

            chart.update();
          },
          layout: {
            padding: {
              left: isMobile ? 2 : 4,
              right: isMobile ? 34 : 46,
              top: 6,
              bottom: 6,
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: { color: 'rgba(234, 235, 240, 0.08)' },
              ticks: {
                color: '#EAEBF0',
                callback: (value) => formatNumber(value),
                font: {
                  size: isMobile ? 10 : 12,
                  family: "'Product Sans', 'Google Sans', sans-serif",
                },
              },
              max: roundUpTo(paddedMaxValue, 10000),
            },
            y: {
              stacked: true,
              grid: { display: false },
              ticks: {
                color: '#EAEBF0',
                padding: isMobile ? 1 : 2,
                font: {
                  size: isMobile ? 10 : 12,
                  family: "'Product Sans', 'Google Sans', sans-serif",
                  weight: '600',
                },
                callback(value) {
                  const label = this.getLabelForValue ? this.getLabelForValue(value) : value;
                  return truncateLabel(label);
                },
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#EAEBF0', usePointStyle: true },
            },
            tooltip: {
              backgroundColor: 'rgba(13, 14, 35, 0.92)',
              borderColor: 'rgba(118, 109, 255, 0.5)',
              borderWidth: 1,
              callbacks: {
                title: (items) => {
                  if (!items?.length) return '';
                  const index = items[0].dataIndex;
                  return teams[index]?.teamName || '';
                },
                label: (context) => {
                  const value = context.raw ?? 0;
                  return `${context.dataset.label}: ${formatNumber(value)}`;
                },
                footer: (tooltipItems) => {
                  if (!tooltipItems.length) return '';
                  const teamIndex = tooltipItems[0].dataIndex;
                  const slotKey = tooltipItems[0].dataset.slotKey;
                  const players = teams[teamIndex]?.allPlayers || [];
                  const list = players.filter((player) => player.pos === slotKey).slice(0, 3);
                  return list
                    .map((player) => `${player.name}: ${formatNumber(player.ktc)}`)
                    .join('\n');
                },
              },
            },
            analyzerBarTotals: {
              enabled: true,
              offset: totalsPluginOffset,
              formatter: (value) => formatNumber(value),
              mobileFont: '9px "Product Sans", "Google Sans", sans-serif',
              rankFontCssVar: '--analyzer-rank-glyph-font',
            },
          },
        },
      );
    }

    function renderRadarChart(teams, radarSlots = state.radarSlots) {
      const userTeam = teams.find((team) => team.isUserTeam);
      if (!userTeam) return;

      const slots = Array.isArray(radarSlots) && radarSlots.length ? radarSlots : buildRadarSlots();
      const labels = slots.map((slot) => slot.label);
      const radarMetric = state.currentRadarMetric === 'value' ? 'value' : 'ppg';
      const radarMetricLabel = radarMetric === 'value' ? 'Value' : 'PPG';
      const radarValueFormatter = radarMetric === 'value' ? formatNumber : formatPpg;
      const comparisonTeams = teams.filter((team) => !team.isUserTeam);
      const leagueAverageTeams = comparisonTeams.length ? comparisonTeams : teams;
      const usingRestOfLeague = comparisonTeams.length > 0;

      // Analyzer positional strength radar:
      // reuses the shared derived lineup selections for both Value and PPG, and averages
      // each slot against the rest of the league so position-by-position comparisons stay aligned.
      const userAssignments = userTeam.derivedLineups?.[radarMetric]?.assignments || [];
      const userData = slots.map((slot, index) => userAssignments[index]?.score ?? 0);

      const leagueAverageDetails = slots.map((slot, index) => {
        const totalMetric = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.score ?? 0),
          0,
        );
        const totalValue = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.player?.value ?? 0),
          0,
        );
        const totalPpg = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.player?.ppg ?? 0),
          0,
        );
        const populatedCount = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.player ? 1 : 0),
          0,
        );
        const teamCount = leagueAverageTeams.length;
        return {
          metricAverage: teamCount ? totalMetric / teamCount : 0,
          valueAverage: teamCount ? totalValue / teamCount : 0,
          ppgAverage: teamCount ? totalPpg / teamCount : 0,
          teamCount,
          populatedCount,
          comparisonLabel: usingRestOfLeague ? `Across ${teamCount} other teams` : `Across ${teamCount} teams`,
        };
      });
      const leagueAverages = leagueAverageDetails.map((detail) => detail.metricAverage);

      const maxValue = Math.max(0, ...userData, ...leagueAverages);
      const fixedValueRadarMax = 11500;
      const scaleMax = radarMetric === 'value'
        ? fixedValueRadarMax
        : (maxValue > 0 ? roundUpTo(maxValue * 1.05, 5) : 10);
      const labelColors = userData.map((value, index) =>
        getRadarLabelColor(value, leagueAverages[index]),
      );

      const isMobileRadar = window.matchMedia('(max-width: 640px)').matches;
      const radarLayoutPadding = {
        top: isMobileRadar ? 2 : 4,
        bottom: isMobileRadar ? 4 : 4,
        left: isMobileRadar ? 0 : 4,
        right: isMobileRadar ? 0 : 4,
      };
      const radarPointLabelPadding = isMobileRadar ? 4 : 6;
      const radarLabelOffset = isMobileRadar ? 14 : 18;

      if (state.charts.radar) {
        state.charts.radar.destroy();
      }

      // Analyzer radar hover details:
      // each point carries its own derived lineup context so Chart.js tooltips can explain
      // either the selected team starter or the league-average slot aggregate.
      const userPointDetails = slots.map((slot, index) => {
        const assignment = userAssignments[index];
        if (!assignment?.player) {
          return ['No eligible player for this slot.'];
        }
        return [
          assignment.player.name,
          `Value: ${formatNumber(assignment.player.value)}`,
          `PPG: ${formatPpg(assignment.player.ppg)}`,
        ];
      });

      const leagueAveragePointDetails = leagueAverageDetails.map((detail) => {
        if (!detail.populatedCount) {
          return [usingRestOfLeague ? 'No eligible starters for this slot across the rest of the league.' : 'No eligible starters for this slot across the league.'];
        }
        return [
          `Avg Value: ${formatNumber(detail.valueAverage)}`,
          `Avg PPG: ${formatPpg(detail.ppgAverage)}`,
          detail.comparisonLabel,
        ];
      });

      state.charts.radar = new Chart(elements.radarCanvas, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            {
              label: 'League Average',
              data: leagueAverages,
              fill: true,
              backgroundColor: 'rgba(82, 90, 119, 0.23)',
              borderColor: 'rgba(151, 166, 210, 0.55)',
              borderWidth: 1.1,
              pointBackgroundColor: 'rgba(188, 210, 255, 0.85)',
              pointBorderColor: '#0D0E1B',
              pointRadius: 3,
              pointHitRadius: 14,
              pointHoverRadius: 5,
              analyzerPointDetails: leagueAveragePointDetails,
              order: 1,
            },
            {
              label: 'Your Team',
              data: userData,
              fill: true,
              backgroundColor: 'rgba(83, 0, 255, 0.33)',
              borderColor: '#6700ff',
              borderWidth: 2,
              pointBackgroundColor: '#6300ff',
              pointBorderColor: '#0D0E1B',
              pointRadius: 4.5,
              pointHitRadius: 16,
              pointHoverRadius: 6,
              analyzerLabels: true,
              labelColors,
              labelFormatter: (value) => `${radarValueFormatter(value)} ${radarMetricLabel}`,
              analyzerPointDetails: userPointDetails,
              order: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'nearest',
            intersect: true,
          },
          layout: {
            padding: radarLayoutPadding,
          },
          elements: {
            line: { tension: 0.32 },
          },
          scales: {
            r: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: scaleMax,
              max: scaleMax,
              grid: { display: false },
              angleLines: { display: false },
              ticks: { display: false },
              pointLabels: {
                color: '#EAEBF0',
                font: { size: 13, weight: '600', family: "'Product Sans', 'Google Sans', sans-serif" },
                padding: radarPointLabelPadding,
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(13, 14, 35, 0.94)',
              borderColor: 'rgba(118, 109, 255, 0.5)',
              borderWidth: 1,
              callbacks: {
                title: (items) => {
                  if (!items?.length) return '';
                  return labels[items[0].dataIndex] || '';
                },
                label: (context) => {
                  const value = context.raw ?? 0;
                  return `${context.dataset.label}: ${radarValueFormatter(value)} ${radarMetricLabel}`;
                },
                footer: (items) => {
                  if (!items?.length) return '';
                  const pointDetails = items[0].dataset?.analyzerPointDetails?.[items[0].dataIndex];
                  return Array.isArray(pointDetails) ? pointDetails : '';
                },
              },
            },
            analyzerRadarBackground: {
              levels: [
                { ratio: 0.95, fill: '#2c334f62', stroke: '#525a7739', lineWidth: 1 },
                { ratio: 0.75, fill: '#2D345153', stroke: '#525a7729', lineWidth: 1 },
                { ratio: 0.55, fill: '#2F365250', stroke: '#525a7729', lineWidth: 1 },
                { ratio: 0.35, fill: '#30375455', stroke: '#525a7729', lineWidth: 1 },
                { ratio: 0.18, fill: '#31385565', stroke: '#525a7735', lineWidth: 1 },
              ],
            },
            analyzerRadarLabels: {
              font: '10px "Product Sans", "Google Sans", sans-serif',
              offset: radarLabelOffset,
            },
          },
        },
      });
    }

    function escapeHtml(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderStandings(teams) {
      const standings = sortTeamsByStandings(teams).map((team, index) => ({
        rank: index + 1,
        teamName: team.teamName,
        record: team.record || '—',
        pf: Number(team.totalFpts) || 0,
        pa: Number(team.pointsAgainst) || 0,
        isChamp: Boolean(team.isChamp),
      }));

      // Analyzer standings team cell:
      // keeps the champion crown self-contained in analyzer rendering rather than
      // depending on the roster page header implementation in app.js.
      const renderStandingsTeamCell = (team) => {
        const safeTeamName = escapeHtml(team.teamName);
        const championTitle = escapeHtml(team.isChamp ? `${team.teamName} - Previous Champion` : team.teamName);
        const crownHtml = team.isChamp
          ? '<i class="fa-solid fa-crown team-record-champ" aria-hidden="true" title="Previous Champion"></i>'
          : '';
        return `
          <span class="analyzer-standings-team" title="${championTitle}">
            <span class="analyzer-standings-team-name">${safeTeamName}</span>
            ${crownHtml}
          </span>
        `;
      };

      elements.standingsBody.innerHTML = standings
        .map((team) => `
          <tr>
            <td data-label="RK" class="analyzer-standings-rank">${team.rank}</td>
            <td data-label="Team">${renderStandingsTeamCell(team)}</td>
            <td data-label="REC" class="analyzer-standings-rec">${team.record}</td>
            <td data-label="PF">${team.pf.toFixed(1)}</td>
            <td data-label="PA">${team.pa.toFixed(1)}</td>
          </tr>
        `)
        .join('');
    }

    function computeWinPct(wins, losses, ties) {
      const games = wins + losses + ties;
      if (games === 0) return 0;
      return (wins + ties * 0.5) / games;
    }

    function sortTeamsByStandings(teams = []) {
      return [...teams].sort((a, b) => {
        const aWinPct = computeWinPct(a.wins || 0, a.losses || 0, a.ties || 0);
        const bWinPct = computeWinPct(b.wins || 0, b.losses || 0, b.ties || 0);
        if (bWinPct !== aWinPct) return bWinPct - aWinPct;
        if ((b.wins || 0) !== (a.wins || 0)) return (b.wins || 0) - (a.wins || 0);
        if ((b.totalFpts || 0) !== (a.totalFpts || 0)) return (b.totalFpts || 0) - (a.totalFpts || 0);
        const aName = a.teamName || '';
        const bName = b.teamName || '';
        return aName.localeCompare(bName);
      });
    }

    /* Rank-based color scale for FPTS / PPG (mirrors Stats page OVERVIEW_RANK_COLOR_SCALE) */
    const LEADERBOARD_RANK_COLORS = [
      { rank: 12, color: '#00ffc4ba' },
      { rank: 24, color: '#85fff3ba' },
      { rank: 36, color: '#7dd1ffba' },
      { rank: 48, color: '#48a6ffba' },
      { rank: 60, color: '#957cffba' },
      { rank: 72, color: '#a642ffba' },
      { rank: 84, color: '#cf60ffba' },
      { rank: 96, color: '#ff6fe1ba' },
      { rank: Infinity, color: '#ff0080ba' },
    ];

    function getLeaderboardRankColor(rank) {
      if (!Number.isFinite(rank) || rank <= 0) return null;
      for (const tier of LEADERBOARD_RANK_COLORS) {
        if (rank <= tier.rank) return tier.color;
      }
      return LEADERBOARD_RANK_COLORS[LEADERBOARD_RANK_COLORS.length - 1]?.color || null;
    }

    const LOGO_KEY_MAP = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };

    function renderTeamCell(teamAbbr) {
      const key = (teamAbbr || 'FA').toUpperCase();
      if (!key || key === 'FA' || key === '--') {
        return `<span class="al-team-chip">${key === '--' ? 'FA' : key}</span>`;
      }
      const normalized = LOGO_KEY_MAP[key] || key.toLowerCase();
      return `<img class="al-team-logo" src="../assets/NFL_logos_svg/${normalized}.svg" alt="${key}" width="20" height="20">`;
    }

    function renderLeagueLeaders() {
      const position = state.activeLeaderboard;
      const leaders = state.leaderboards[position] || [];
      if (!leaders.length) {
        elements.leaderboardBody.innerHTML = '<tr><td colspan="7" class="empty-row">No scoring data available.</td></tr>';
        return;
      }

      // Build rank maps for FPTS and PPG conditional formatting
      // Sort all current leaders by FPTS descending to assign color ranks
      const byFpts = [...leaders].sort((a, b) => b.total - a.total);
      const byPpg = [...leaders].sort((a, b) => b.ppg - a.ppg);
      const fptsRankMap = new Map();
      const ppgRankMap = new Map();
      byFpts.forEach((entry, i) => { fptsRankMap.set(entry.playerId, i + 1); });
      byPpg.forEach((entry, i) => { ppgRankMap.set(entry.playerId, i + 1); });

      elements.leaderboardBody.innerHTML = leaders
        .map((entry, index) => {
          const pos = (entry.pos || '').toUpperCase();
          const fptsColor = getLeaderboardRankColor(fptsRankMap.get(entry.playerId));
          const ppgColor = getLeaderboardRankColor(ppgRankMap.get(entry.playerId));
          const fptsStyle = fptsColor ? ` style="color:${fptsColor}"` : '';
          const ppgStyle = ppgColor ? ` style="color:${ppgColor}"` : '';

          return `
          <tr>
            <td>${index + 1}</td>
            <td class="al-cell-player">${abbreviateFirstName(entry.name) || '—'}</td>
            <td><span class="al-pos-tag ${pos}">${pos || '—'}</span></td>
            <td>${renderTeamCell(entry.nflTeam)}</td>
            <td class="al-cell-owner">${truncateLabel(entry.owner, 11) || '—'}</td>
            <td class="al-fpts-cell"${fptsStyle}>${entry.total.toFixed(1)}</td>
            <td class="al-ppg-cell"${ppgStyle}>${entry.ppg.toFixed(1)}</td>
          </tr>`;
        })
        .join('');
    }

    function populateLeagueSelect(leagues) {
      const select = elements.leagueSelect;
      if (!select) return;
      select.innerHTML = '<option value="">Select a league...</option>';
      leagues.forEach((league) => {
        const option = document.createElement('option');
        option.value = league.league_id;
        option.textContent = league.name;
        select.appendChild(option);
      });
      select.disabled = false;
    }

    function setLoading(isLoading) {
      if (!elements.loading) return;
      if (isLoading) {
        elements.loading.classList.remove('hidden');
      } else {
        elements.loading.classList.add('hidden');
      }
    }

    function roundUpTo(value, step) {
      if (value <= 0) return step;
      return Math.ceil(value / step) * step;
    }

    function computeRank(list, predicate) {
      const index = list.findIndex(predicate);
      return index === -1 ? null : index + 1;
    }

    const trimTrailingZeros = (numericString) => {
      if (typeof numericString !== 'string') return numericString;
      if (!numericString.includes('.')) return numericString;
      return numericString.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0$/, '');
    };

    function formatNumber(value) {
      if (!Number.isFinite(value)) return '0';

      const abs = Math.abs(value);
      const suffixes = [
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'k' },
      ];

      for (let i = 0; i < suffixes.length; i += 1) {
        const { value: threshold, suffix } = suffixes[i];
        if (abs >= threshold) {
          let scaled = Math.round((value / threshold) * 10) / 10;
          if (i > 0 && Math.abs(scaled) >= 1000) {
            const { value: nextThreshold, suffix: nextSuffix } = suffixes[i - 1];
            scaled = Math.round((value / nextThreshold) * 10) / 10;
            return `${trimTrailingZeros(scaled.toFixed(1))}${nextSuffix}`;
          }
          return `${trimTrailingZeros(scaled.toFixed(1))}${suffix}`;
        }
      }

      return Math.round(value).toLocaleString();
    }

    function formatPpg(value) {
      if (!Number.isFinite(value)) return '0.0';
      return value.toFixed(1);
    }

    function truncateLabel(value, limit = 11) {
      if (!value) return '';
      const trimmed = String(value).trim();
      if (trimmed.length <= limit) return trimmed;
      return `${trimmed.slice(0, limit - 1)}…`;
    }

    function getRadarLabelColor(value, average) {
      if (!Number.isFinite(value)) return '#bcd2ff';
      if (!Number.isFinite(average) || average === 0) {
        return value > 0 ? '#00ffaf' : '#bcd2ff';
      }
      const ratio = value / average;
      if (ratio >= 1.15) return '#00ffaf';
      if (ratio >= 0.95) return '#58a7ff';
      return '#bcd2ff';
    }

    function getRankColor(rank, total) {
      const percentile = (total - rank + 1) / total;
      if (percentile >= 0.8) return '#00EBC7';
      if (percentile >= 0.6) return '#58A7FF';
      if (percentile >= 0.4) return '#EAEBF0';
      if (percentile >= 0.2) return '#FF7F50';
      return '#FF3A75';
    }

    function hideAllActiveTooltips() {
      Object.values(state.charts).forEach(chart => {
        if (chart && chart.tooltip && chart.tooltip.getActiveElements().length) {
          chart.tooltip.setActiveElements([], { x: 0, y: 0 });
          chart.update();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.nodeName !== 'CANVAS') {
        hideAllActiveTooltips();
      }
    });
  });
})();
