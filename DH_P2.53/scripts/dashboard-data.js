// Home owns its local 2026 season CSV adapter. Only the pure DataHub qualification
// rule is shared; no other page's state, data loader or Sheets configuration runs.
import { isStatsSeasonRankQualified } from './datahub-stats-positional-ranks.js';

const POSITIONS = new Set(['QB', 'RB', 'WR', 'TE']);

export function parseDashboardCsv(text) {
  const records = [];
  let record = [], cell = '', quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (!quoted && (char === ',' || char === '\n' || char === '\r')) {
      record.push(cell.trim());
      cell = '';
      if (char !== ',') {
        if (record.some(value => value !== '')) records.push(record);
        record = [];
        if (char === '\r' && source[i + 1] === '\n') i += 1;
      }
    } else cell += char;
  }
  if (quoted) throw new Error('Dashboard 2026_Season.csv contains an unfinished quoted cell.');
  record.push(cell.trim());
  if (record.some(value => value !== '')) records.push(record);
  const [headers = [], ...rows] = records;
  const required = ['SZN', 'SLPR_ID', 'PLAYER NAME', 'POS', 'TM', 'FPT_PPR', 'GM_P', 'CSTY%', 'CL'];
  if (required.some(header => !headers.includes(header))) throw new Error('Dashboard 2026_Season.csv has missing columns.');
  return rows.map(values => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ''])));
}

// The season CSV retains formatted percentages and NA cells. Keep missing values distinct
// from numeric zero, and do not multiply an explicit "1%" cell by 100.
const toNum = value => {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const number = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(number) ? number : null;
};
const toPct = value => {
  const explicitPercent = String(value ?? '').includes('%');
  const number = toNum(String(value ?? '').replace(/%/g, ''));
  if (number === null) return null;
  return !explicitPercent && Math.abs(number) <= 1 ? number * 100 : number;
};

export function normalizeDashboardPlayer(row) {
  const fpts = toNum(row.FPT_PPR);
  const games = toNum(row.GM_P);
  return {
    id: String(row.SLPR_ID), name: row['PLAYER NAME'], position: row.POS, team: row.TM,
    trend: 'stable', games,
    stats: {
      fpts,
      // The CSV has no PPG column. Use its PPR total and recorded games at full
      // precision so every dashboard PPG comparison uses the same denominator.
      ppg: games > 0 && fpts !== null ? fpts / games : null,
      // Summary cards use the same position volume fields as DataHub's ranks.
      pass_att: toNum(row.paATT), rush_att: toNum(row.CAR), rr: toNum(row.RR),
      csty: toPct(row['CSTY%']), ts: toPct(row['TS%']),
      ceiling: toNum(row.CL), cl: toNum(row.CL),
      epa_db: toNum(row['EPA/DB']), cpoe: toPct(row.CPOE),
      pa_ypg: toNum(row.paYPG), pass_rtg: toNum(row.paRTG),
      cmp_pct: toPct(row['CMP%']), ttt: toNum(row.TTT),
      yds_total: toNum(row['YDS(t)']), imp_per_g: toNum(row['IMP/G']),
      // Ground / Air uses recorded rushing and receiving yards only. Missing
      // components stay null; they are never treated as a zero-yard result.
      rushing_yards: toNum(row.ruYDS), receiving_yards: toNum(row.recYDS),
      snp_pct: toPct(row['SNP%']), ypc: toNum(row.YPC), rec_tgt: toNum(row.TGT),
      mtf_per_att: toNum(row['MTF/A']), yco_per_att: toNum(row['YCO/A']),
      rec: toNum(row.REC), rec_ypg: toNum(row.recYPG),
      ts_per_rr: toPct(row['TS%']), yprr: toNum(row.YPRR),
      first_down_rec_rate: toNum(row['1DRR'])
    },
    ranks: { posRank: null, ppgPosRank: null }, statRanks: {}
  };
}

export async function loadDashboardPlayers(fetchImpl = fetch) {
  // Read the maintained file once per dashboard initialization. Module-relative
  // URLs support the root page; each reload gets fresh data without a Sheets fallback.
  const url = new URL('../data/NFL-2026_Stats/SeasonStats/2026_Season.csv', import.meta.url);
  const response = await fetchImpl(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Dashboard 2026_Season.csv could not load (${response.status}).`);
  const rows = parseDashboardCsv(await response.text()).filter(row =>
    /^\d+$/.test(row.SLPR_ID) && POSITIONS.has(row.POS));
  if (!rows.length || rows.some(row => row.SZN !== '2026')) throw new Error('Dashboard 2026_Season.csv has no valid 2026 season data.');
  return rows.map(normalizeDashboardPlayer).sort((a, b) => (b.stats.fpts ?? -Infinity) - (a.stats.fpts ?? -Infinity));
}

// The CSTY card honors exactly 100% first, then selects the largest DH FPTS total.
// An empty eligible pool remains unavailable instead of substituting a lower rate.
export function selectConsistencyRb(players) {
  return players.filter(player => player.position === 'RB' && player.stats.csty === 100
    && Number.isFinite(player.stats.fpts))
    .sort((a, b) => b.stats.fpts - a.stats.fpts)[0] ?? null;
}

export function getDashboardQualifierWeeks(players) {
  // Mirror DH's games-based progression, including 14 games => Week 15.
  // Only valid recorded season games advance the summary-card minimums.
  const maxGames = players.reduce((highest, player) => Number.isInteger(player.games)
    && player.games >= 0 && player.games <= 17 ? Math.max(highest, player.games) : highest, 0);
  return Math.max(1, maxGames >= 14 ? maxGames + 1 : maxGames);
}

export function selectSummaryLeaders(players) {
  const qualified = selectDashboardQualifiedPlayers(players);
  const leader = (key, position) => qualified
    .filter(player => (!position || player.position === position) && Number.isFinite(player.stats[key]))
    .sort((a, b) => b.stats[key] - a.stats[key])[0] ?? null;
  return {
    topFpts: leader('fpts'),
    topEPAQB: leader('epa_db', 'QB'),
    topCstyRB: selectConsistencyRb(qualified),
    topTSWR: leader('ts', 'WR')
  };
}

// Home summary cards, the Player Lens and Ground / Air share the maintained
// DataHub qualification rule without importing DataHub's application state.
export function selectDashboardQualifiedPlayers(players) {
  const weeks = getDashboardQualifierWeeks(players);
  // All four home cards use DataHub's default positional-ranking eligibility,
  // including its half-season/20-PPR-PPG exception. Use the complete DH pool;
  // the Performance Map's top-100 picker is unrelated to minimum qualification.
  return players.filter(player => isStatsSeasonRankQualified({
    POS: player.position, GM_P: player.games, FPTS: player.stats.fpts,
    paATT: player.stats.pass_att, CAR: player.stats.rush_att, RR: player.stats.rr
  }, '2026', weeks, weeks));
}

// Twelve PPG rows stay consistent across mobile/desktop and position switches.
// The three-game gate is independent of the other stats' volume qualifiers.
export function selectPpgLeaders(players, position = 'all', limit = 12) {
  return players.filter(player => player.games >= 3 && Number.isFinite(player.stats.ppg)
    && (position === 'all' || player.position === position))
    .sort((a, b) => b.stats.ppg - a.stats.ppg || b.stats.fpts - a.stats.fpts || a.name.localeCompare(b.name))
    .slice(0, limit);
}

// The distribution is rebuilt from this season's recorded total PPR points.
// Each prefix must sum to its overall rank; no reference/snapshot counts enter it.
export function buildPositionalDistribution(players, limit = 60) {
  const leaders = players.filter(player => player.games > 0 && POSITIONS.has(player.position)
    && Number.isFinite(player.stats.fpts))
    .sort((a, b) => b.stats.fpts - a.stats.fpts || a.name.localeCompare(b.name))
    .slice(0, limit);
  const counts = { QB: 0, RB: 0, WR: 0, TE: 0 };
  const rows = [{ rank: 0, ...counts }];
  leaders.forEach((player, index) => {
    counts[player.position] += 1;
    rows.push({ rank: index + 1, ...counts, player });
  });
  return { rows, counts: { ...counts }, total: leaders.length };
}

export function selectYardageLeaders(players, limit = 6) {
  return selectDashboardQualifiedPlayers(players)
    .filter(player => ['RB', 'WR', 'TE'].includes(player.position)
      && Number.isFinite(player.stats.rushing_yards) && Number.isFinite(player.stats.receiving_yards))
    .map(player => ({ ...player, totalYards: player.stats.rushing_yards + player.stats.receiving_yards }))
    .sort((a, b) => b.totalYards - a.totalYards || b.stats.fpts - a.stats.fpts)
    .slice(0, limit);
}

// Player Lens ranks preserve missing/unqualified values and competition ties.
// Only PPG uses its separate 3-game pool; TTT is the sole inverted radar metric.
export function rankDashboardPlayers(players) {
  const qualified = new Set(selectDashboardQualifiedPlayers(players));
  const keys = ['fpts', 'ppg', 'pass_rtg', 'cmp_pct', 'yds_total', 'ttt', 'epa_db', 'cpoe',
    'snp_pct', 'ypc', 'rec_tgt', 'mtf_per_att', 'yco_per_att', 'rec', 'rec_ypg',
    'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g', 'cl', 'csty'];
  players.forEach(player => { player.ranks = { posRank: null, ppgPosRank: null }; player.statRanks = {}; });
  for (const position of POSITIONS) {
    for (const key of keys) {
      const pool = players.filter(player => player.position === position
        && Number.isFinite(player.stats[key]) && (key === 'ppg' ? player.games >= 3 : qualified.has(player)))
        .sort((a, b) => key === 'ttt' ? a.stats[key] - b.stats[key] : b.stats[key] - a.stats[key]);
      let previous = null, rank = 0;
      pool.forEach((player, index) => {
        if (player.stats[key] !== previous) rank = index + 1;
        previous = player.stats[key];
        if (key === 'fpts') player.ranks.posRank = rank;
        else if (key === 'ppg') player.ranks.ppgPosRank = rank;
        else player.statRanks[key] = rank;
      });
    }
  }
  return players;
}

export function selectScatterPlayers(players) {
  // Match the three-recorded-game PPG rank minimum. Choose each true top eight
  // before dropping unavailable CSTY/CL cells; missing metrics never promote #9.
  return [...POSITIONS].flatMap(position => players
    .filter(player => player.position === position && player.games >= 3 && Number.isFinite(player.stats.ppg))
    .sort((a, b) => b.stats.ppg - a.stats.ppg || b.stats.fpts - a.stats.fpts)
    .slice(0, 8)
    .filter(player => Number.isFinite(player.stats.csty) && Number.isFinite(player.stats.ceiling)));
}

export function getScatterBounds(players) {
  const extent = key => {
    const values = players.map(player => player.stats[key]).filter(Number.isFinite);
    return values.length ? [Math.min(...values), Math.max(...values)] : [0, 1];
  };
  const [xMin] = extent('csty');
  const [yMin, yMax] = extent('ceiling');
  // Home scatter uses the nearest lower 10% / 5-CL steps, without an extra
  // padding pass: 42.9% starts at 40%, and 16.8 CL starts at 15. Retain the
  // tighter two percentage points after 100% to reduce unused right-side space.
  const yLower = Math.floor(yMin / 5) * 5;
  const yUpper = Math.ceil(yMax / 5) * 5;
  return {
    x: [Math.max(0, Math.min(90, Math.floor(xMin / 10) * 10)), 102],
    y: [yLower, yUpper > yMax ? yUpper : yUpper + 5]
  };
}
