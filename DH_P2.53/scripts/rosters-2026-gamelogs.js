/*
 * Rosters-only 2026 Game Logs
 *
 * This file intentionally does not import or call DataHub code. It owns the
 * season-CSV/weekly-CSV/schedule loading and converts into the shared roster
 * modal state shape exposed by app.js.
 */
(() => {
    // Start loading the pure Rosters adapter once. The build uses the same
    // stat conversions and rank rules for the first-view data.
    const statsModule = import('./rosters-2026-stats.js');
    const generatedModule = import('./generated-2026-data.js');
    const csvLine = (line) => {
        const values = [];
        let value = '';
        let quoted = false;
        for (let i = 0; i < line.length; i += 1) {
            const char = line[i];
            if (quoted && char === '"' && line[i + 1] === '"') { value += '"'; i += 1; }
            else if (char === '"') quoted = !quoted;
            else if (char === ',' && !quoted) { values.push(value); value = ''; }
            else value += char;
        }
        values.push(value);
        return values;
    };
    const parseCsv = (text) => {
        const lines = String(text || '').split(/\r?\n/).filter((line) => line.trim());
        if (!lines.length) return [];
        const headers = csvLine(lines[0]).map((header) => header.replace(/[\u00a0\u202f]/g, ' ').trim());
        return lines.slice(1).map((line) => {
            const columns = csvLine(line);
            return Object.fromEntries(headers.map((header, index) => [header, columns[index] ?? '']));
        });
    };
    const appRootUrl = (path) => new URL(`../${path}`, window.location.href).toString();
    let loadPromise = null;
    let seasonRowsCache = null;
    let seasonRowsLoadPromise = null;
    let weeklyRowsLoadPromise = null;
    let projectionsLoadPromise = null;
    let cardsLoadPromise = null;
    let projectionSource = null;
    // Load the full weekly source when a detailed Rosters view requests it.
    // Source-only static previews also use it to determine the PROJ cutoff.
    function ensureRosters2026WeeklyRowsLoaded() {
        if (!weeklyRowsLoadPromise) weeklyRowsLoadPromise = (async () => {
            const { isPlayer, hasRecordedStats } = await statsModule;
            const weeks = Array.from({ length: 18 }, () => []);
            const weekErrors = {};
            try {
                // The projection cutoff, Game Logs and breakdown reuse one
                // no-store CSV read. Each page still owns its adapted state.
                const { load2026WeeklyCsv } = await import('./nfl-2026-matchups.js');
                const local = await load2026WeeklyCsv({ fetchImpl: fetch, weeklyUrl: appRootUrl('data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv') });
                const rows = local.rows.map(row => ({ ...row }));
                rows.forEach((row) => { if ('WK' in row) row.SZN = row.WK; });
                if (!rows.length || ['SZN', 'SLPR_ID', 'POS', 'TM', 'FPT_PPR'].some((header) => !(header in rows[0]))) {
                    throw new Error('Rosters 2026_AllWKs.csv has missing or invalid columns.');
                }
                const players = rows.filter(isPlayer);
                if (players.some((row) => !Number.isInteger(Number(row.SZN)) || Number(row.SZN) < 1 || Number(row.SZN) > 18)) {
                    throw new Error('Rosters 2026_AllWKs.csv contains an invalid week number.');
                }
                players.forEach((row) => { weeks[Number(row.SZN) - 1].push(row); });
            } catch (error) {
                // Missing results remain blank. Without a valid CSV cutoff,
                // projection preparation cannot request the PROJ sheet.
                for (let week = 1; week <= 18; week++) weekErrors[week] = error.message;
            }
            const latestRecordedWeek = weeks.reduce((latest, rows, index) => rows.some(hasRecordedStats) ? index + 1 : latest, 0);
            return { weeks, weekErrors, latestRecordedWeek };
        })();
        return weeklyRowsLoadPromise;
    }
    // Apply only raw future PROJ cells to the Rosters-owned 2026 snapshot.
    // Cached 2025 state, completed results, season ranks and chart cutoffs stay
    // independent. Late arrivals also update an already-created 2026 snapshot.
    function applyRosters2026Projections(snapshot, { normalizeTeam, parseStats }) {
        if (!snapshot || !projectionSource) return;
        snapshot.projectionErrors = projectionSource.projectionErrors;
        Object.entries(projectionSource.projectionRows).forEach(([week, rows]) => {
            if (Number(week) <= snapshot.latestRecordedWeek) return;
            rows.forEach((row) => {
                const id = String(row.SLPR_ID);
                if (!snapshot.weeklyStats[week][id]) {
                    const team = normalizeTeam(row.TM);
                    const opponent = String(snapshot.scheduleByTeam?.[team]?.[week] || '').trim();
                    const opponentTeam = normalizeTeam(opponent.replace(/^(?:@|vs\.?)\s*/i, ''));
                    // Projection-only players share the calculated header/weekly rank;
                    // a late PROJ merge must never restore a retired sheet rank.
                    const rank = Number(snapshot.matchupRanksByTeam?.[opponentTeam]?.[`${row.POS}RK`]);
                    snapshot.weeklyStats[week][id] = parseStats({ VS: opponent, vsRK: Number.isInteger(rank) && rank >= 1 && rank <= 32 ? rank : '', __hasRecordedStats: false }, true);
                }
                snapshot.weeklyStats[week][id].proj = row.PROJ;
            });
        });
    }
    // Rosters Game Logs independently reads the single PROJ export. Only its
    // numbered 10–18 columns supply future amounts/statuses; v/inj metadata and
    // any sheet statistics stay outside this page's recorded results/state.
    function ensureRosters2026ProjectionsLoaded() {
        if (!projectionsLoadPromise) projectionsLoadPromise = (async () => {
            const stats = await statsModule;
            const { isPlayer } = stats;
            const { load2026DataManifest } = await generatedModule;
            const manifest = await load2026DataManifest(fetch);
            const local = manifest ?? await ensureRosters2026WeeklyRowsLoaded();
            const projectionRows = {};
            const projectionErrors = {};
            if (!Object.keys(local.weekErrors || {}).length) {
                const { get2026ProjectionWeeks, get2026ProjectionCsvUrl } = await import('./nfl-2026-sheets.js?v=DH3.76-proj-sheet');
                const weeks = get2026ProjectionWeeks(local.latestRecordedWeek);
                if (weeks.length) {
                    try {
                        const response = await fetch(get2026ProjectionCsvUrl(), { cache: 'no-store' });
                        if (!response.ok) throw new Error(`PROJ projections could not load (${response.status}).`);
                        const rows = parseCsv(await response.text());
                        if (!rows.length || ['SZN', 'SLPR_ID', 'POS', 'TM'].some((header) => !(header in rows[0]))) {
                            throw new Error('PROJ projections have missing or invalid columns.');
                        }
                        const players = rows.filter(isPlayer);
                        if (!players.length) throw new Error('PROJ projections have no valid player rows.');
                        if (players.some((row) => String(row.SZN).trim() !== '2026')) throw new Error('PROJ contains a different season.');
                        weeks.forEach((week) => {
                            if (!(String(week) in rows[0])) {
                                projectionErrors[week] = `PROJ is missing the Week ${week} projection column.`;
                                return;
                            }
                            projectionRows[week] = players.map((row) => ({ SLPR_ID: row.SLPR_ID, POS: row.POS, TM: row.TM, PROJ: String(row[week] ?? '').trim() }));
                        });
                    } catch (error) { weeks.forEach((week) => { projectionErrors[week] = error.message; }); }
                }
            }
            projectionSource = { projectionRows, projectionErrors };
            applyRosters2026Projections(window.state.rosters2026Cards, stats);
            applyRosters2026Projections(window.state.rosters2026GameLogs, stats);
            if (Object.keys(projectionErrors).length) console.warn('Rosters skipped unavailable 2026 projections:', projectionErrors);
            return projectionSource;
        })().catch((error) => { projectionsLoadPromise = null; throw error; });
        return projectionsLoadPromise;
    }
    // Rosters Career needs only season CSV totals, even when the selected Game Logs
    // year is 2025. Reuse this read in the full loader without activating a year
    // or making Career depend on weekly CSV/schedule availability.
    async function ensureRosters2026SeasonRowsLoaded() {
        if (seasonRowsCache) return seasonRowsCache;
        if (!seasonRowsLoadPromise) {
            // Cards, Game Logs, Compare, Team and Career reuse one validated
            // local read. A failed file can retry; it never activates a different
            // season or falls back to Sheets, weekly results or Sleeper stats.
            seasonRowsLoadPromise = (async () => {
                const response = await fetch(appRootUrl('data/NFL-2026_Stats/SeasonStats/2026_Season.csv'), { cache: 'no-store' });
                if (!response.ok) throw new Error(`Rosters 2026_Season.csv could not load (${response.status}).`);
                const rows = parseCsv(await response.text());
                const { isPlayer } = await statsModule;
                if (!rows.length || ['SZN', 'SLPR_ID', 'PLAYER NAME', 'POS', 'TM', 'FPT_PPR', 'GM_P'].some((header) => !(header in rows[0]))) {
                    throw new Error('Rosters 2026_Season.csv has missing or invalid columns.');
                }
                const players = rows.filter(isPlayer);
                if (!players.length) throw new Error('Rosters 2026_Season.csv has no valid player rows.');
                if (players.some((row) => String(row.SZN) !== '2026')) throw new Error('Rosters 2026_Season.csv contains a different season.');
                seasonRowsCache = players;
                return seasonRowsCache;
            })()
                .finally(() => { seasonRowsLoadPromise = null; });
        }
        return seasonRowsLoadPromise;
    }

    // Cards need season totals, bye information and the inputs for custom
    // league scoring. Detailed Game Logs still hydrate on their first use.
    function ensureRosters2026CardsLoaded() {
        if (!cardsLoadPromise) cardsLoadPromise = (async () => {
            const { loadGenerated2026Data } = await generatedModule;
            const data = await loadGenerated2026Data('rosters', fetch);
            if (!data) return ensureRosters2026GameLogsLoaded();
            const { scoringSchemas, scoringCells, ...snapshot } = data;
            const weeklyStats = Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 1, {}]));
            for (const [week, id, schema, ...cells] of scoringCells) {
                weeklyStats[week][id] = Object.fromEntries(scoringSchemas[schema].map((stat, i) => [stat, cells[i]]));
            }
            snapshot.weeklyStats = weeklyStats;
            snapshot.projectionWeeks = getProjectionWeeks(snapshot.latestRecordedWeek);
            applyRosters2026Projections(snapshot, await statsModule);
            window.state.rosters2026Cards = snapshot;
            return snapshot;
        })().catch(error => { cardsLoadPromise = null; throw error; });
        return cardsLoadPromise;
    }

    function getProjectionWeeks(latestRecordedWeek) {
        return Object.fromEntries(Array.from({ length: 18 - latestRecordedWeek }, (_, index) => [latestRecordedWeek + index + 1, true]));
    }
    async function ensureRosters2026GameLogsLoaded() {
        const state = window.state;
        if (state.rosters2026GameLogs) return state.rosters2026GameLogs;
        if (loadPromise) return loadPromise;
        loadPromise = (async () => {
            const stats = await statsModule;
            const { POSITIONS, normalizeTeam, parseStats, isPlayer, hasRecordedStats, numberValue, buildRanks } = stats;
            const { load2026ScheduleCsv, load2026MatchupData } = await import('./nfl-2026-matchups.js');
            const scheduleUrl = appRootUrl('data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv');
            const weeklyUrl = appRootUrl('data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv');
            const scheduleSource = await load2026ScheduleCsv({ fetchImpl: fetch, scheduleUrl });
            const scheduleRows = scheduleSource.rows;
            if (!scheduleRows.length || !('TM' in scheduleRows[0]) || !('18' in scheduleRows[0])) throw new Error('Rosters 2026 schedule is invalid.');
            let matchupRankError = null;
            const localPromise = ensureRosters2026WeeklyRowsLoaded();
            const [seasonRows, local, matchups] = await Promise.all([
                ensureRosters2026SeasonRowsLoaded(),
                localPromise,
                // Derive every defense rank from recorded local results. A
                // failed calculation leaves ranks unavailable, never stale.
                localPromise.then(local => {
                    if (Object.keys(local.weekErrors).length) throw new Error(Object.values(local.weekErrors)[0]);
                    return load2026MatchupData({ fetchImpl: fetch, weeklyUrl, scheduleUrl });
                }).catch((error) => {
                    matchupRankError = error.message;
                    console.warn('Rosters 2026 matchup ranks unavailable.', error);
                    return null;
                })
            ]);
            const { weeks, weekErrors, latestRecordedWeek } = local;
            if (Object.keys(weekErrors).length) {
                console.warn('Rosters skipped unavailable or invalid 2026 weeks:', weekErrors);
            }
            const players = seasonRows.filter(isPlayer);
            const weeksOfData = weeks.reduce((count, rows) => count + (rows.some(hasRecordedStats) ? 1 : 0), 0);
            const playersById = new Map(players.map((row) => [String(row.SLPR_ID), row]));
            const schedule = new Map(scheduleRows.map((row) => [normalizeTeam(row.TM), row]));
            const defense = new Map(Object.entries(matchups?.defenseByTeam || {}));
            const matchupRanks = new Map(Object.entries(matchups?.matchupRanksByTeam || {}).map(([team, row]) => [team,
                Object.fromEntries([...POSITIONS].map((pos) => [`${pos}RK`, row[`${pos}RK`]]))]));
            const weeklyStats = {};
            for (let week = 1; week <= 18; week += 1) {
                const recorded = new Map((weeks[week - 1] || []).filter((row) => playersById.has(String(row.SLPR_ID))).map((row) => [String(row.SLPR_ID), row]));
                weeklyStats[week] = {};
                playersById.forEach((player, playerId) => {
                    const source = recorded.get(playerId);
                    const team = normalizeTeam(source?.TM || player.TM);
                    const opponent = String(schedule.get(team)?.[week] || '').trim();
                    const opponentTeam = normalizeTeam(opponent.replace(/^(?:@|vs\.?)\s*/i, ''));
                    const rankKey = { QB: 'QBRK', RB: 'RBRK', WR: 'WRRK', TE: 'TERK' }[source?.POS || player.POS];
                    // Weekly opponent tags use the calculated positional rank,
                    // reversed only by the existing renderer just like rankMetric.
                    const rank = Number(matchupRanks.get(opponentTeam)?.[rankKey]);
                    weeklyStats[week][playerId] = parseStats({ ...(source || {}), VS: opponent, vsRK: Number.isInteger(rank) && rank >= 1 && rank <= 32 ? rank : '', __hasRecordedStats: Boolean(source && hasRecordedStats(source)) }, true);
                });
            }
            const seasonStats = {};
            players.forEach((row) => {
                const stats = parseStats(row);
                const fpts = numberValue(row.FPT_PPR) || 0;
                const games = numberValue(row.GM_P) || 0;
                stats.pos = row.POS;
                stats.team = normalizeTeam(row.TM) || 'FA';
                // Overview's age is identity metadata, never a performance rank.
                stats.age = numberValue(row.AGE);
                stats.games_played = games;
                stats.fpts_ppr = fpts;
                stats.fpt_ppr = fpts;
                stats.ppg = games > 0 ? fpts / games : 0;
                seasonStats[String(row.SLPR_ID)] = stats;
            });
            // Card fantasy ranks keep their existing volume pool. Game Logs
            // owns the expanded stat/summary pool requested for this modal.
            // Future schedule placeholders are projection weeks even if a tab
            // is not published yet; they must never count as played results.
            const projectionWeeks = getProjectionWeeks(latestRecordedWeek);
            const snapshot = { seasonStats, seasonRanks: buildRanks(players, weeksOfData, latestRecordedWeek),
                cardSeasonRanks: buildRanks(players, weeksOfData, latestRecordedWeek, false), weeklyStats,
                // Regular roster badges need the team's bye even for IR/rookie
                // players who have no DH season row or recorded weekly result.
                scheduleByTeam: Object.fromEntries(schedule),
                // Header SOS averages the calculated allowance rank columns
                // (QBRK/RBRK/WRRK/TERK) over the local schedule.
                defenseByTeam: Object.fromEntries(defense),
                // Keep display rank adaptation separate from the allowance SOS map.
                // Both the profile header and weekly tags use this calculated map.
                matchupRanksByTeam: Object.fromEntries(matchupRanks), matchupRankError,
                latestRecordedWeek, rankQualifierWeeks: Math.max(1, weeksOfData), weekErrors, projectionWeeks };
            applyRosters2026Projections(snapshot, stats);
            state.rosters2026GameLogs = snapshot;
            return snapshot;
        })().finally(() => { loadPromise = null; });
        return loadPromise;
    }
    async function activateRosters2026GameLogs() {
        const snapshot = await ensureRosters2026GameLogsLoaded();
        activateRosters2026Snapshot(snapshot);
        return snapshot;
    }
    async function activateRosters2026Cards(snapshot) {
        activateRosters2026Snapshot(window.state.rosters2026GameLogs ?? snapshot);
    }
    function activateRosters2026Snapshot(snapshot) {
        const state = window.state;
        state.playerSeasonStats = snapshot.seasonStats;
        state.playerSeasonRanks = snapshot.seasonRanks ?? snapshot.cardSeasonRanks;
        state.playerWeeklyStats = snapshot.weeklyStats;
        state.weeklyStats = snapshot.weeklyStats;
        state.playerProjectionWeeks = snapshot.projectionWeeks;
        // A historical modal may leave week 18 active. Reset to the upcoming
        // CSV week before app.js refreshes the actual NFL week from Sleeper.
        state.currentNflWeek = Math.min(18, snapshot.latestRecordedWeek + 1);
        state.liveWeeklyStats = {};
        state.activeRostersGameLogsSeason = '2026';
        // Season changes invalidate the league-specific modal rank pool too.
        state.calculatedRankCache = null;
        // 2026 consistency uses the weekly CSV, while the weekly table and
        // summary ranks may use the selected league's Sleeper matchup scores.
        state.matchupDataLoaded = false;
        state.leagueMatchupStats = {};
        state.liveStatsLoaded = false;
    }
    window.ensureRosters2026CardsLoaded = ensureRosters2026CardsLoaded;
    window.activateRosters2026Cards = activateRosters2026Cards;
    window.ensureRosters2026GameLogsLoaded = ensureRosters2026GameLogsLoaded;
    window.ensureRosters2026SeasonRowsLoaded = ensureRosters2026SeasonRowsLoaded;
    window.ensureRosters2026ProjectionsLoaded = ensureRosters2026ProjectionsLoaded;
    window.activateRosters2026GameLogs = activateRosters2026GameLogs;
    window.getRosters2026PlayerRanks = (playerId) => {
        const snapshot = window.state.rosters2026GameLogs ?? window.state.rosters2026Cards;
        const ranks = (snapshot?.cardSeasonRanks || snapshot?.seasonRanks)?.[String(playerId)] || {};
        const stats = window.state.playerSeasonStats?.[String(playerId)] || {};
        return {
            total_pts: Number(stats.fpts_ppr || 0).toFixed(1),
            ppg: Number(stats.ppg || 0).toFixed(1),
            posRank: ranks.fpts || 'NA', overallRank: 'NA', ppgPosRank: ranks.ppg || 'NA', ppgOverallRank: 'NA',
            gamesPlayed: Number(stats.games_played || 0)
        };
    };
    // Start future projections as soon as Rosters' deferred script runs. This
    // promise is deliberately outside every page/league loading barrier.
    if (window.document?.body?.dataset.page === 'rosters') {
        void ensureRosters2026ProjectionsLoaded().catch((error) => console.warn('Rosters projection preload failed.', error));
    }
})();
