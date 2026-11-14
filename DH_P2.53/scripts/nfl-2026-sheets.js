// Shared URL configuration only: DataHub, Rosters and Matchups keep separate data/state
// loaders. Season totals live in 2026_Season.csv and weekly results in
// 2026_AllWKs.csv; future Game Logs projections come from the dedicated PROJ
// tab through a native CSV export that preserves numeric and status cells.
const WORKBOOK_ID = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
// Verified in 2026-Wkly: PROJ has one player per SLPR_ID and numbered 10–18
// projection columns. v10/inj10 etc. are separate metadata, never PROJ values.
const PROJECTION_SHEET_GID = '1097963859';
const PROJECTION_WEEKS = Object.freeze(Array.from({ length: 9 }, (_, index) => index + 10));

export function get2026ProjectionWeeks(latestCompletedWeek) {
    if (!Number.isInteger(latestCompletedWeek) || latestCompletedWeek < 0 || latestCompletedWeek > 18) {
        throw new Error('Invalid completed-week cutoff for 2026 projections.');
    }
    return PROJECTION_WEEKS.filter((week) => week > latestCompletedWeek);
}

export function get2026ProjectionCsvUrl() {
    return `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/export?format=csv&gid=${PROJECTION_SHEET_GID}&sheet=PROJ`;
}
export function get2026SheetCsvUrl(sheetName) {
    // The retired DH season feed must never be requested, including by a new
    // indirect caller. Separate team metadata and future PROJ feeds stay live.
    if (String(sheetName).trim().toUpperCase() === 'DH') throw new Error('2026 season stats use 2026_Season.csv.');
    // Defense/offense summaries and Players Faced now derive from the weekly
    // CSV. Reject indirect callers too, so a later feature cannot restore an
    // unnecessary workbook request or a stale Sheets fallback.
    if (['DRK', 'FPF', 'FPFA', 'FPA', 'ALLWKS'].includes(String(sheetName).trim().toUpperCase())) {
        throw new Error('2026 matchup statistics use 2026_AllWKs.csv.');
    }
    // Prevent retired weekly-tab requests from silently reaching Google Sheets.
    if (/^WK\d+$/.test(sheetName)) throw new Error('2026 weekly stats use 2026_AllWKs.csv.');
    return `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(sheetName)}`;
}
