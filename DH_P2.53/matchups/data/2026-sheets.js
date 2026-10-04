// Matchups owns these source reads and shares only DH's workbook URL configuration.
// Keep the original three-source contract: FPF is offense scoring, FPFA is the
// published defense summary, and FPA replaces FPAv2's player/weekly CSV.
import { get2026SheetCsvUrl } from '../../scripts/nfl-2026-sheets.js?v=DH3.49-matchups-sheets';

const SOURCES = Object.freeze([
  ['offense', 'FPF'],
  ['summary', 'FPFA'],
  ['weekly', 'FPA'],
]);

export async function load2026MatchupSources({ fetchImpl = fetch } = {}) {
  // Read every tab fresh on each page load, like DH's existing Sheets loaders.
  // Google responses are never stored by DH's same-origin service worker, and
  // there is no bundled-data fallback that could silently show a stale week.
  const entries = await Promise.all(SOURCES.map(async ([key, sheet]) => {
    try {
      const response = await fetchImpl(get2026SheetCsvUrl(sheet), { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const csv = await response.text();
      if (!csv.trim()) throw new Error('The sheet is empty.');
      return [key, { name: `2026-Wkly / ${sheet}`, csv }];
    } catch (error) {
      throw new Error(`2026 ${sheet} could not load: ${error.message}`, { cause: error });
    }
  }));
  // Existing Matchups parsers validate all three schemas before publishing any
  // model or chart state; their calculations and source ownership stay intact.
  return { season: 2026, ...Object.fromEntries(entries) };
}
