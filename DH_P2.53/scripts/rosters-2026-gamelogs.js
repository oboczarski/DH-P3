/*
 * Rosters-only 2026 Game Logs
 *
 * This file intentionally does not import or call DataHub code. It owns the
 * workbook/schedule loading and converts the source into the shared roster
 * modal state shape exposed by app.js.
 */
(() => {
    const WORKBOOK_ID = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
    const POSITIONS = new Set(['QB', 'RB', 'WR', 'TE']);
    const STAT_MAP = {
        paATT: 'pass_att', CMP: 'pass_cmp', 'CMP PCT': 'cmp_pct', 'CMP%': 'cmp_pct',
        // Rosters 2026 QB Game Logs: read these exact WK/DH passing headers for
        // the weekly table and its season footer; 2025 CSV parsing stays in app.js.
        paYDS: 'pass_yd', paTD: 'pass_td', pa1D: 'pass_fd', EPA: 'epa', 'EPA/DB': 'epa_per_db', CPOE: 'cpoe',
        'BLTZ%': 'blitz_pct', DB: 'dropbacks', 'TmPa%': 'team_pass_pct',
        'DP%': 'dp_pct', 'IMP/G': 'imp_per_g', paRTG: 'pass_rtg', pIMP: 'pass_imp', 'pIMP/A': 'pass_imp_per_att',
        INT: 'pass_int', SAC: 'pass_sack', TTT: 'ttt', 'PRS%': 'prs_pct', CAR: 'rush_att', ruYDS: 'rush_yd',
        // Rosters 2026 RB Game Logs: read these exact WK/DH rushing headers;
        // the weekly table renders the two attempt labels with a middle dot.
        YPC: 'ypc', ruTD: 'rush_td', ru1D: 'rush_fd', MTF: 'mtf', ELU: 'elu', RYOE: 'ryoe', 'RYOE/A': 'ryoe_per_att',
        'RZ Att': 'rz_att', 'GL Att': 'gl_att', YCO: 'rush_yac',
        // Rosters 2026 RB Season view: keep these totals and per-game rates
        // sourced from the exact DH headers rather than deriving substitutes.
        YBC: 'rush_ybc', 'YBC/A': 'ybc_per_att', 'CAR/G': 'car_per_g', 'TGT/G': 'tgt_per_g',
        'YCO/A': 'yco_per_att', 'ExplRu%': 'expl_ru_pct', 'EXPLSV%': 'expl_ru_pct', 'MTF/A': 'mtf_per_att',
        TGT: 'rec_tgt', REC: 'rec', recYDS: 'rec_yd', recTD: 'rec_td', rec1D: 'rec_fd', YAC: 'rec_yar', YPR: 'ypr',
        RR: 'rr', 'RZ Tgt': 'rz_tgt', 'TS%': 'ts_per_rr', 'CSTY%': 'csty_pct', YPRR: 'yprr', '1DRR': 'first_down_rec_rate',
        IMP: 'imp', FUM: 'fum', SNP: 'snp', 'SNP%': 'snp_pct', 'YDS(t)': 'yds_total', FPOE: 'fpoe', aFPOE: 'fpoe',
        CL: 'ceiling', 'YPG(t)': 'ypg', paYPG: 'pa_ypg', ruYPG: 'ru_ypg', recYPG: 'rec_ypg', 'AY%': 'ay_pct', PROJ: 'proj', FPT_PPR: 'fpt_ppr'
    };
    const normalizeTeam = (team) => ({ JAC: 'JAX', WSH: 'WAS', LA: 'LAR' })[String(team || '').trim().toUpperCase()] || String(team || '').trim().toUpperCase();
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
    const numberValue = (value) => {
        const text = String(value ?? '').trim();
        if (!text || text.toUpperCase() === 'NA') return null;
        if (text.includes('%')) {
            const percent = Number.parseFloat(text);
            return Number.isFinite(percent) ? percent : null;
        }
        const number = Number.parseFloat(text);
        return Number.isFinite(number) ? number : null;
    };
    const hasRecordedStats = (row) => ['GM_P', 'SNP', 'paATT', 'CAR', 'TGT', 'REC', 'RR'].some((key) => Number(row?.[key]) > 0)
        || (Number.isFinite(Number(row?.FPT_PPR)) && Number(row.FPT_PPR) !== 0);
    const isPlayer = (row) => /^\d+$/.test(String(row?.SLPR_ID || '').trim()) && POSITIONS.has(String(row?.POS || '').trim().toUpperCase());
    const parseStats = (row, weekly = false) => {
        const stats = {};
        Object.entries(row || {}).forEach(([header, rawValue]) => {
            const key = header.replace(/[\u00a0\u202f]/g, ' ').trim();
            if (['SLPR_ID', 'SZN', 'POS', 'TM', 'PLAYER NAME', 'GM_P'].includes(key)) return;
            if (key === 'VS') { if (String(rawValue || '').trim()) stats.opponent = String(rawValue).trim(); return; }
            if (key === 'vsRK') { const rank = numberValue(rawValue); if (rank !== null) stats.opponent_rank = rank; return; }
            const statKey = STAT_MAP[key];
            if (!statKey) return;
            if (statKey === 'proj') { stats.proj = String(rawValue ?? '').trim(); return; }
            let number = numberValue(rawValue);
            // Rosters 2026 QB percentages: WK/DH may encode a rate as a
            // fraction or as percentage points; display both on the same scale.
            if (['SNP%', 'BLTZ%', 'TmPa%'].includes(key) && number !== null && !String(rawValue).includes('%') && number <= 1.5) number *= 100;
            if (number !== null) stats[statKey] = number;
        });
        if (weekly) stats.__hasRecordedStats = Boolean(row.__hasRecordedStats);
        return stats;
    };
    const appRootUrl = (path) => new URL(`../${path}`, window.location.href).toString();
    const fetchRows = async (sheetName, requiredHeaders) => {
        const url = `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(sheetName)}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Rosters 2026 ${sheetName} could not load (${response.status}).`);
        const text = await response.text();
        if (!text.trim() && /^WK\d+$/.test(sheetName)) return [];
        const rows = parseCsv(text);
        if (!rows.length || requiredHeaders.some((header) => !(header in rows[0]))) throw new Error(`Rosters 2026 ${sheetName} has missing or invalid columns.`);
        return rows;
    };
    const buildRanks = (rows, weeksOfData = 1) => {
        const ranks = {};
        rows.forEach((row) => { ranks[String(row.SLPR_ID)] = {}; });
        const headersByStat = {};
        Object.entries(STAT_MAP).forEach(([header, stat]) => { if (!headersByStat[stat]) headersByStat[stat] = header; });
        const weeks = Math.max(1, Math.min(18, Number(weeksOfData) || 1));
        const qualifiers = { QB: ['paATT', 16 * weeks], RB: ['CAR', 5 * weeks], WR: ['RR', 13 * weeks], TE: ['RR', 13 * weeks] };
        const qualified = rows.filter((row) => qualifiers[row.POS] && Number(row[qualifiers[row.POS][0]]) >= qualifiers[row.POS][1]);
        const rankValues = (valueForRow, stat) => {
            ['QB', 'RB', 'WR', 'TE'].forEach((position) => {
                qualified.filter((row) => row.POS === position).map((row) => ({ id: String(row.SLPR_ID), value: valueForRow(row) }))
                    .filter((entry) => Number.isFinite(entry.value)).sort((a, b) => b.value - a.value)
                    .forEach((entry, index) => { ranks[entry.id][stat] = index + 1; });
            });
        };
        Object.entries(headersByStat).forEach(([stat, header]) => rankValues((row) => numberValue(row[header]), stat));
        rankValues((row) => numberValue(row.FPT_PPR), 'fpts');
        rankValues((row) => { const games = numberValue(row.GM_P); const fpts = numberValue(row.FPT_PPR); return games > 0 && fpts !== null ? fpts / games : null; }, 'ppg');
        return ranks;
    };
    let loadPromise = null;
    async function ensureRosters2026GameLogsLoaded() {
        const state = window.state;
        if (state.rosters2026GameLogs) return state.rosters2026GameLogs;
        if (loadPromise) return loadPromise;
        loadPromise = (async () => {
            const scheduleResponse = await fetch(appRootUrl('data/NFL-2026/Schedule2026.csv'), { cache: 'no-store' });
            if (!scheduleResponse.ok) throw new Error(`Rosters 2026 schedule could not load (${scheduleResponse.status}).`);
            const scheduleRows = parseCsv(await scheduleResponse.text());
            if (!scheduleRows.length || !('TM' in scheduleRows[0]) || !('18' in scheduleRows[0])) throw new Error('Rosters 2026 schedule is invalid.');
            const [seasonRows, defenseRows, ...weeks] = await Promise.all([
                fetchRows('DH', ['SZN', 'SLPR_ID', 'POS', 'TM', 'FPT_PPR']),
                fetchRows('DRK', ['TM', 'QBRK', 'RBRK', 'WRRK', 'TERK']),
                ...Array.from({ length: 18 }, (_, index) => fetchRows(`WK${index + 1}`, ['SZN', 'SLPR_ID', 'POS', 'TM', 'FPT_PPR']))
            ]);
            const players = seasonRows.filter(isPlayer);
            const weeksOfData = weeks.reduce((count, rows) => count + (rows.some(hasRecordedStats) ? 1 : 0), 0);
            const playersById = new Map(players.map((row) => [String(row.SLPR_ID), row]));
            const schedule = new Map(scheduleRows.map((row) => [normalizeTeam(row.TM), row]));
            const defense = new Map(defenseRows.map((row) => [normalizeTeam(row.TM), row]));
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
                    const rank = numberValue(defense.get(opponentTeam)?.[rankKey]);
                    weeklyStats[week][playerId] = parseStats({ ...(source || {}), VS: opponent, vsRK: rank && rank >= 1 && rank <= 32 ? rank : '', __hasRecordedStats: Boolean(source && hasRecordedStats(source)) }, true);
                });
            }
            const seasonStats = {};
            players.forEach((row) => {
                const stats = parseStats(row);
                const fpts = numberValue(row.FPT_PPR) || 0;
                const games = numberValue(row.GM_P) || 0;
                stats.pos = row.POS;
                stats.team = normalizeTeam(row.TM) || 'FA';
                stats.games_played = games;
                stats.fpts_ppr = fpts;
                stats.fpt_ppr = fpts;
                stats.ppg = games > 0 ? fpts / games : 0;
                seasonStats[String(row.SLPR_ID)] = stats;
            });
            const snapshot = { seasonStats, seasonRanks: buildRanks(players, weeksOfData), weeklyStats };
            state.rosters2026GameLogs = snapshot;
            return snapshot;
        })().finally(() => { loadPromise = null; });
        return loadPromise;
    }
    async function activateRosters2026GameLogs() {
        const snapshot = await ensureRosters2026GameLogsLoaded();
        const state = window.state;
        state.playerSeasonStats = snapshot.seasonStats;
        state.playerSeasonRanks = snapshot.seasonRanks;
        state.playerWeeklyStats = snapshot.weeklyStats;
        state.weeklyStats = snapshot.weeklyStats;
        state.playerProjectionWeeks = {};
        state.liveWeeklyStats = {};
        state.activeRostersGameLogsSeason = '2026';
        // 2026 consistency remains sheet-backed, while the weekly table and
        // summary ranks may use the selected league's Sleeper matchup scores.
        state.matchupDataLoaded = false;
        state.leagueMatchupStats = {};
        state.liveStatsLoaded = false;
        return snapshot;
    }
    window.ensureRosters2026GameLogsLoaded = ensureRosters2026GameLogsLoaded;
    window.activateRosters2026GameLogs = activateRosters2026GameLogs;
    window.getRosters2026PlayerRanks = (playerId) => {
        const ranks = window.state.rosters2026GameLogs?.seasonRanks?.[String(playerId)] || {};
        const stats = window.state.playerSeasonStats?.[String(playerId)] || {};
        return {
            total_pts: Number(stats.fpts_ppr || 0).toFixed(1),
            ppg: Number(stats.ppg || 0).toFixed(1),
            posRank: ranks.fpts || 'NA', overallRank: 'NA', ppgPosRank: ranks.ppg || 'NA', ppgOverallRank: 'NA',
            gamesPlayed: Number(stats.games_played || 0)
        };
    };
})();
