// Shared URL configuration only: DataHub, Rosters and Matchups keep separate data/state
// loaders. Weekly results live in 2026_AllWKs.csv; unfinished-week PROJ cells
// have a separate, explicit export API so results never fall back to Sheets.
const WORKBOOK_ID = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
// Existing weekly tabs, verified against the live workbook. Add the gid when
// another projection tab is created; absent future tabs are never requested.
// Native exports preserve mixed numeric/status PROJ cells (gviz can drop text).
const PROJECTION_SHEET_GIDS = Object.freeze({
    1: '946140193', 2: '1480597852', 3: '3751902', 4: '2067451265',
    5: '749604963', 6: '677856696', 7: '696122995'
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
// Matchups reads the three existing 2026-Wkly tabs by their verified gids.
// Native CSV exports preserve the exact headers, literal opponents and scores;
// this adds URL configuration only, without changing any other page's loader.
const MATCHUPS_SHEET_GIDS = Object.freeze({
    FPF: '2006116709',
    FPFA: '1845231826',
    FPA: '1398845421'
});

export function get2026SheetCsvUrl(sheetName) {
    // Prevent retired weekly-tab requests from silently reaching Google Sheets.
    if (/^WK\d+$/.test(sheetName)) throw new Error('2026 weekly stats use 2026_AllWKs.csv.');
    const gid = MATCHUPS_SHEET_GIDS[sheetName];
    // gid selects the export; keep the tab name in the URL for diagnostics.
    if (gid) return `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/export?format=csv&gid=${gid}&sheet=${encodeURIComponent(sheetName)}`;
    return `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(sheetName)}`;
}
