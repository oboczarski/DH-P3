// Shared URL configuration only: DataHub, Rosters and Matchups keep separate data/state
// loaders. Weekly player stats live in 2026_AllWKs.csv; this module configures
// only the remaining workbook feeds (season totals, ranks and Matchups).
const WORKBOOK_ID = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
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
