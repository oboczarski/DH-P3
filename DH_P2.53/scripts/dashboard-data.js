// Home dashboard owns its DH season adapter. Share only the workbook URL config;
// no weekly results, projections, DataHub state or Sleeper scoring enter these charts.
import { get2026SheetCsvUrl } from './nfl-2026-sheets.js';

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
  if (quoted) throw new Error('Dashboard DH export contains an unfinished quoted cell.');
  record.push(cell.trim());
  if (record.some(value => value !== '')) records.push(record);
  const [headers = [], ...rows] = records;
  const required = ['SZN', 'SLPR_ID', 'PLAYER NAME', 'POS', 'TM', 'FPT_PPR', 'GM_P', 'CSTY%', 'CL'];
  if (required.some(header => !headers.includes(header))) throw new Error('Dashboard DH export has missing columns.');
  return rows.map(values => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ''])));
}

// DH publishes formatted percentages and NA cells. Keep missing values distinct
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
      // DH has no PPG column. Use its PPR total and recorded games at full
      // precision so every dashboard PPG comparison uses the same denominator.
      ppg: games > 0 && fpts !== null ? fpts / games : null,
      csty: toPct(row['CSTY%']), ts: toPct(row['TS%']),
      ceiling: toNum(row.CL), cl: toNum(row.CL),
      epa_db: toNum(row['EPA/DB']), cpoe: toPct(row.CPOE),
      pa_ypg: toNum(row.paYPG), pass_rtg: toNum(row.paRTG),
      cmp_pct: toPct(row['CMP%']), ttt: toNum(row.TTT),
      yds_total: toNum(row['YDS(t)']), imp_per_g: toNum(row['IMP/G']),
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
  const response = await fetchImpl(get2026SheetCsvUrl('DH'), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Dashboard DH could not load (${response.status}).`);
  const rows = parseDashboardCsv(await response.text()).filter(row =>
    /^\d+$/.test(row.SLPR_ID) && POSITIONS.has(row.POS));
  if (!rows.length || rows.some(row => row.SZN !== '2026')) throw new Error('Dashboard DH has no valid 2026 season data.');
  return rows.map(normalizeDashboardPlayer).sort((a, b) => (b.stats.fpts ?? -Infinity) - (a.stats.fpts ?? -Infinity));
}

// The CSTY card honors exactly 100% first, then selects the largest DH FPTS total.
// An empty eligible pool remains unavailable instead of substituting a lower rate.
export function selectConsistencyRb(players) {
  return players.filter(player => player.position === 'RB' && player.stats.csty === 100
    && Number.isFinite(player.stats.fpts))
    .sort((a, b) => b.stats.fpts - a.stats.fpts)[0] ?? null;
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
  const [xMin, xMax] = extent('csty');
  const [yMin, yMax] = extent('ceiling');
  // Pad both extrema before the renderer rounds to readable ticks. Percentage
  // ticks stop at 100, but extra domain room keeps 100% dots/labels inside the grid.
  const xPadding = Math.max(4, (xMax - xMin) * 0.08);
  const yPadding = Math.max(2, (yMax - yMin) * 0.1);
  return {
    x: [Math.max(0, xMin - xPadding), xMax + xPadding],
    y: [Math.max(0, yMin - yPadding), yMax + yPadding]
  };
}
