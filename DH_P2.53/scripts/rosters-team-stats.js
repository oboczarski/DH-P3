// Rosters team-modal summary only. TM_STAT is a 2026 workbook tab without a
// season column; never reuse these team totals for a historical player season.
// This page owns its loader/rank model and shares only the workbook URL config.
import { get2026SheetCsvUrl } from './nfl-2026-sheets.js';

export const TEAM_SUMMARY_FIELDS = Object.freeze(['Pa%', 'Ru%', 'paYds', 'ruYds']);
const NFL_TEAMS = new Set('ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS'.split(' '));

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
    if (!NFL_TEAMS.has(team)) continue;
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

export function build2026TeamRanks(teams) {
  // Team-modal ranks use the entire NFL feed, independent of player filters.
  // Higher values rank first for each metric; ties use competition ranks (1,1,3).
  const ranks = {};
  for (const key of TEAM_SUMMARY_FIELDS) {
    const pool = Object.entries(teams).filter(([team, stats]) => NFL_TEAMS.has(team) && Number.isFinite(stats[key]))
      .sort((a, b) => b[1][key] - a[1][key]);
    let previous = null, rank = 0;
    pool.forEach(([team, stats], index) => {
      if (stats[key] !== previous) rank = index + 1;
      previous = stats[key];
      (ranks[team] ||= {})[key] = rank;
    });
  }
  return ranks;
}

export function get2026TeamStatColor(key, rank) {
  // Rosters team-summary values use the requested eight-team rank bands.
  // Missing/out-of-range ranks stay neutral; preserve the top yardage band's alpha.
  if (!Number.isInteger(rank) || rank < 1 || rank > 32) return '';
  const colors = key === 'Pa%' || key === 'Ru%'
    ? ['#b178ff', '#78d3ff', '#78baff', '#e678ff']
    : key === 'paYds' || key === 'ruYds'
      ? ['#79ffd6eb', '#5aa7ff', '#957CFF', '#FF6FE1'] : null;
  return colors?.[Math.floor((rank - 1) / 8)] || '';
}

export async function load2026TeamStats({ parseCsv, fetchImpl = fetch }) {
  const response = await fetchImpl(get2026SheetCsvUrl('TM_STAT'), { cache: 'no-store' });
  if (!response.ok) throw new Error(`2026 TM_STAT could not load (${response.status}).`);
  return build2026TeamStats(parseCsv(await response.text()));
}
