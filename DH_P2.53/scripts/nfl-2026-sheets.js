// Shared URL configuration only: DataHub and Rosters keep separate data/state
// loaders. Native CSV exports preserve mixed PROJ cells (numbers, OUT, IR,
// BYE, etc.); gviz infers a numeric column and silently drops those text cells.
const WORKBOOK_ID = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
// These are the workbook's existing numbered tabs, verified by tab name.
// Add each new WK tab's gid here when it is created; absent tabs retain the
// existing named-tab read and the callers' missing/mismatched-week handling.
const WEEKLY_SHEET_GIDS = Object.freeze({
    WK1: '946140193',
    WK2: '1480597852',
    WK3: '3751902',
    WK4: '1759479235',
    WK5: '1939087638'
});

export function get2026SheetCsvUrl(sheetName) {
    const gid = WEEKLY_SHEET_GIDS[sheetName];
    // gid selects the export; keep the tab name in the URL for diagnostics.
    if (gid) return `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/export?format=csv&gid=${gid}&sheet=${encodeURIComponent(sheetName)}`;
    return `https://docs.google.com/spreadsheets/d/${WORKBOOK_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(sheetName)}`;
}
