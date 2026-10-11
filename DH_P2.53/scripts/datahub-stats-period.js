import { has2026WeekResults } from './datahub-2026-data.js';

// DataHub's Stats period menu uses only recorded CSV weeks. Future projections
// and empty pre-created weeks cannot become selectable results periods.
export function getDataHubStatsPeriodOptions(weeklyRows = {}) {
  const weeks = Object.entries(weeklyRows)
    .filter(([week, rows]) => Number.isInteger(Number(week)) && Number(week) >= 1 && Number(week) <= 18
      && rows.some((row) => /^\d+$/.test(String(row.SLPR_ID || ''))
        && ['QB', 'RB', 'WR', 'TE'].includes(row.POS) && has2026WeekResults(row)))
    .map(([week]) => Number(week)).sort((a, b) => a - b);
  return [
    { value: '2026', label: '2026 Season', season: '2026', week: null },
    ...weeks.map((week) => ({ value: `2026-wk-${week}`, label: `2026 WK·${week}`, season: '2026', week })),
    { value: '2025', label: '2025 Season', season: '2025', week: null, divider: true },
  ];
}

// Match the 2026 season schema, removing only the eight requested per-game
// columns. Copy group arrays so weekly visibility cannot mutate season views.
const WEEKLY_EXCLUDED_COLUMNS = new Set(['YPG(t)', 'paYPG', 'CAR/G', 'ruYPG', 'TGT/G', 'IMP/G', 'REC/G', 'recYPG']);
export function getDataHubWeeklyColumns(columns) {
  return columns.filter((column) => !WEEKLY_EXCLUDED_COLUMNS.has(column));
}
export function getDataHubWeeklyColumnGroups(groups) {
  return groups.map((group) => ({ ...group, columns: getDataHubWeeklyColumns(group.columns) }))
    .filter((group) => group.columns.length);
}

// Adapt only the selected week's original CSV rows to the season table's
// identity aliases. Never merge DH totals, other weeks, or Sheets projections.
export function getDataHubWeeklyTableSourceRows(weeklyRows, week) {
  return (weeklyRows[week] || []).map((row) => ({
    ...row, NM: row['PLAYER NAME'], G: row.GM_P,
    ...(['WR', 'TE'].includes(row.POS) ? { AY: row.recAY } : {}),
  }));
}
