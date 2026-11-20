// Rosters season ranks and stat normalization run in both the Netlify build
// and the independently loaded Game Logs view.
export const POSITIONS = new Set(['QB', 'RB', 'WR', 'TE']);
const STAT_MAP = {
    // Rosters owns its share mappings. Stable keys preserve Season/footer
    // ranks and Performance values when the workbook headers are renamed.
    'TDS%': 'tds_pct', 'YS%': 'ys_pct',
    'ruTDS%': 'rush_tms', 'ruYS%': 'rush_yms',
    'paTDS%': 'pass_tms', 'paYS%': 'pass_yms',
    paATT: 'pass_att', CMP: 'pass_cmp', 'CMP PCT': 'cmp_pct', 'CMP%': 'cmp_pct',
    // Rosters 2026 QB Game Logs: read these exact WK/DH passing headers for
    // the weekly table and its season footer; 2025 CSV parsing stays in app.js.
    paYDS: 'pass_yd', paTD: 'pass_td', pa1D: 'pass_fd', EPA: 'epa', 'EPA/DB': 'epa_per_db', CPOE: 'cpoe',
    'BLTZ%': 'blitz_pct', DB: 'dropbacks', 'TmPa%': 'team_pass_pct',
    // Rosters owns the 2026 QB AYA source mapping for Weekly/Season and ranks.
    AYA: 'adjusted_ypa',
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
    // Rosters owns these 2026 receiving mappings for weekly/Season views
    // and positional ranks; missing sheet fields remain unavailable.
    TPRR: 'tprr', YACR: 'rec_yacr', "recYS%": 'rec_yms',
    // WR/TE production, efficiency, and weekly additions use exact DH/WK headers.
    "recTDS%": 'rec_tms', '10+ Tgt': 'tgt_10_plus', 'AY/Tgt': 'ay_per_tgt', 'REC/G': 'rec_per_g',
    RR: 'rr', 'RZ Tgt': 'rz_tgt', 'TS%': 'ts_per_rr', 'CSTY%': 'csty_pct', YPRR: 'yprr', '1DRR': 'first_down_rec_rate',
    // Rosters comparison's mixed-position Overview reads these literal DH
    // fields. Do not manufacture touchdowns, opportunities or impact rates.
    'TD(t)': 'td_total', OPP: 'opp', 'IMP/OPP': 'imp_per_opp',
    IMP: 'imp', FUM: 'fum', SNP: 'snp', 'SNP%': 'snp_pct', 'YDS(t)': 'yds_total', FPOE: 'fpoe', aFPOE: 'fpoe',
    CL: 'ceiling', 'YPG(t)': 'ypg', paYPG: 'pa_ypg', ruYPG: 'ru_ypg', recYPG: 'rec_ypg', 'AY%': 'ay_pct', PROJ: 'proj', FPT_PPR: 'fpt_ppr'
};
export const normalizeTeam = (team) => ({ JAC: 'JAX', WSH: 'WAS', LA: 'LAR' })[String(team || '').trim().toUpperCase()] || String(team || '').trim().toUpperCase();
// Accept both share-header generations in DH totals and the weekly CSV.
// This parser remains independently owned by Rosters.
const normalizeStatHeader = (header) => header.replace(/[\u00a0\u202f]/g, ' ').trim()
    .replace(/^(pa|ru|rec)?TMS$/, '$1TDS%')
    .replace(/^(pa|ru|rec)?YMS$/, '$1YS%');

export const numberValue = (value) => {
    const text = String(value ?? '').trim();
    if (!text || text.toUpperCase() === 'NA') return null;
    if (text.includes('%')) {
        const percent = Number.parseFloat(text);
        return Number.isFinite(percent) ? percent : null;
    }
    const number = Number.parseFloat(text);
    return Number.isFinite(number) ? number : null;
};
export const hasRecordedStats = (row) => ['GM_P', 'SNP', 'paATT', 'CAR', 'TGT', 'REC', 'RR'].some((key) => Number(row?.[key]) > 0)
    || (Number.isFinite(Number(row?.FPT_PPR)) && Number(row.FPT_PPR) !== 0);
export const isPlayer = (row) => /^\d+$/.test(String(row?.SLPR_ID || '').trim()) && POSITIONS.has(String(row?.POS || '').trim().toUpperCase());
export const parseStats = (row, weekly = false) => {
    const stats = {};
    Object.entries(row || {}).forEach(([header, rawValue]) => {
        const key = normalizeStatHeader(header);
        // An explicit renamed column wins even when its cell is unavailable.
        if (key !== header && key in row) return;
        if (['SLPR_ID', 'SZN', 'POS', 'TM', 'PLAYER NAME', 'GM_P'].includes(key)) return;
        if (key === 'VS') { if (String(rawValue || '').trim()) stats.opponent = String(rawValue).trim(); return; }
        if (key === 'vsRK') { const rank = numberValue(rawValue); if (rank !== null) stats.opponent_rank = rank; return; }
        const statKey = STAT_MAP[key];
        if (!statKey) return;
        if (statKey === 'proj') { stats.proj = String(rawValue ?? '').trim(); return; }
        let number = numberValue(rawValue);
        // QB percentages and yard/touchdown shares accept fractions or
        // percentage points; TPRR retains its source decimal-ratio units.
        if ((['SNP%', 'BLTZ%', 'TmPa%'].includes(key) || /^(pa|ru|rec)?(TDS|YS)%$/.test(key)) && number !== null && !String(rawValue).includes('%') && number <= 1.5) number *= 100;
        if (number !== null) stats[statKey] = number;
    });
    if (weekly) stats.__hasRecordedStats = Boolean(row.__hasRecordedStats);
    return stats;
};

export const buildRanks = (rows, weeksOfData = 1, elapsedWeeks = weeksOfData, modal = true, stats = null) => {
    const ranks = {};
    rows.forEach((row) => { ranks[String(row.SLPR_ID)] = {}; });
    const headersByStat = {};
    Object.entries(STAT_MAP).forEach(([header, stat]) => { if (!headersByStat[stat]) headersByStat[stat] = header; });
    const weeks = Math.max(1, Math.min(18, Number(weeksOfData) || 1));
    const qualifiers = { QB: ['paATT', 15 * weeks], RB: ['CAR', 4 * weeks], WR: ['RR', 12 * weeks], TE: ['RR', 12 * weeks] };
    // Rosters' non-PPG modal stats retain the half-season scoring exception.
    // PPG uses only GM_P >= 3, and modal FPTS has no participation gate.
    const qualified = rows.filter((row) => {
        const gate = qualifiers[row.POS];
        if (!gate) return false;
        const games = numberValue(row.GM_P);
        const points = numberValue(row.FPT_PPR);
        return Number(row[gate[0]]) >= gate[1]
            || (modal && games > 0 && games >= Math.ceil(Math.max(1, elapsedWeeks) / 2) && points !== null && points / games >= 20);
    });
    const rankValues = (valueForRow, stat) => {
        const pool = stat === 'ppg' ? rows.filter((row) => numberValue(row.GM_P) >= 3)
            : modal && ['fpts', 'fpt_ppr', 'fpts_ppr'].includes(stat) ? rows : qualified;
        ['QB', 'RB', 'WR', 'TE'].forEach((position) => {
            const entries = pool.filter((row) => row.POS === position).map((row) => ({ id: String(row.SLPR_ID), value: valueForRow(row) }))
                .filter((entry) => Number.isFinite(entry.value)).sort((a, b) => b.value - a.value);
            let previous = null;
            let rank = 0;
            entries.forEach((entry, index) => {
                if (entry.value !== previous) rank = index + 1;
                previous = entry.value;
                ranks[entry.id][stat] = modal ? rank : index + 1;
            });
        });
    };
    // Parse aliases exactly as displayed, so alternate percentage headers
    // cannot leave the corresponding Season/footer rank missing.
    const rankStats = stats ?? [...Object.keys(headersByStat), 'fpts', 'ppg'];
    const parsedById = rankStats.some(stat => stat !== 'fpts' && stat !== 'ppg')
        ? new Map(rows.map(row => [String(row.SLPR_ID), parseStats(row)])) : null;
    rankStats.forEach(stat => {
        if (stat === 'fpts') rankValues(row => numberValue(row.FPT_PPR), stat);
        else if (stat === 'ppg') rankValues(row => {
            const games = numberValue(row.GM_P);
            const fpts = numberValue(row.FPT_PPR);
            return games > 0 && fpts !== null ? fpts / games : null;
        }, stat);
        else rankValues(row => parsedById.get(String(row.SLPR_ID))[stat], stat);
    });
    return ranks;
};
