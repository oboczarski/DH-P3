// Shared URL configuration only: DataHub, Rosters and Matchups keep separate data/state
// loaders. Season totals live in 2026_Season.csv and weekly results in
// 2026_AllWKs.csv; unfinished-week PROJ cells
// have a separate, explicit export API so results never fall back to Sheets.
const WORKBOOK_ID = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
// Existing weekly tabs, verified against the live workbook. Add the gid when
// another projection tab is created; absent future tabs are never requested.
// Native exports preserve mixed numeric/status PROJ cells (gviz can drop text).
const PROJECTION_SHEET_GIDS = Object.freeze({
    1: '946140193', 2: '1480597852', 3: '3751902', 4: '2067451265',
    5: '749604963', 6: '677856696', 7: '696122995',
    // Verified WK8-WK10 exports supply future PROJ cells to the independent
    // Rosters/DataHub loaders; completed results still come only from the CSV.
    8: '1110983817', 9: '102083848', 10: '462792316',
    // WK11–WK13 are published projection tabs, verified in 2026-Wkly.
    // Only their PROJ cells supplement future Game Logs on either page.
    11: '993322654', 12: '16052130', 13: '1927039275'
});

export function get2026ProjectionWeeks(latestCompletedWeek) {
    if (!Number.isInteger(latestCompletedWeek) || latestCompletedWeek < 0 || latestCompletedWeek > 18) {
        throw new Error('Invalid completed-week cutoff for 2026 projections.');
    }
    return Object.keys(PROJECTION_SHEET_GIDS).map(Number).filter((week) => week > latestCompletedWeek);
}

export function get2026ProjectionCsvUrl(week) {
    const gid = PROJECTION_SHEET_GIDS[week];
    if (!gid) throw new Error(`No 2026 projection tab configured for Week ${week}.`);
    return `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/export?format=csv&gid=${gid}&sheet=WK${week}`;
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
