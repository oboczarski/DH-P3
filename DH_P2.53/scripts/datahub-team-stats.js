// DataHub team-modal summary only. TM_STAT is a 2026 workbook tab without a
// season column; never reuse these team totals for a historical player season.
import { get2026SheetCsvUrl } from './nfl-2026-sheets.js';

export const TEAM_SUMMARY_FIELDS = Object.freeze(['Pa%', 'Ru%', 'paYds', 'ruYds']);

export function build2026TeamStats(rows) {
  const required = ['TM', ...TEAM_SUMMARY_FIELDS];
  if (!rows.length || required.some(key => !(key in rows[0]))) {
    throw new Error('2026 TM_STAT has missing or invalid columns.');
  }
  const teams = {};
  for (const row of rows) {
    if ('SZN' in row && String(row.SZN).trim() !== '2026') continue;
    const rawTeam = String(row.TM || '').trim().toUpperCase();
    const team = ({ WSH: 'WAS', JAC: 'JAX', LA: 'LAR' })[rawTeam] || rawTeam;
    if (!/^[A-Z]{2,3}$/.test(team)) continue;
    if (teams[team]) throw new Error(`2026 TM_STAT has duplicate ${team} rows.`);
    teams[team] = Object.fromEntries(TEAM_SUMMARY_FIELDS.map(key => {
      // The sheet supplies percentage points with a % suffix, and total yards.
      // Keep blanks unavailable, preserve real zeros, and never substitute DH sums.
      const raw = String(row[key] ?? '').trim();
      const value = raw ? Number(raw.replace(/[,%]/g, '')) : NaN;
      return [key, Number.isFinite(value) && value >= 0 ? value : null];
    }));
  }
  return teams;
}

export async function load2026TeamStats({ parseCsv, fetchImpl = fetch }) {
  const response = await fetchImpl(get2026SheetCsvUrl('TM_STAT'), { cache: 'no-store' });
  if (!response.ok) throw new Error(`2026 TM_STAT could not load (${response.status}).`);
  return build2026TeamStats(parseCsv(await response.text()));
}
