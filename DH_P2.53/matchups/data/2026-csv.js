// Matchups keeps its UI/state local and consumes the same CSV-derived data
// definitions as Game Logs and the Rosters modal. No workbook is read here.
import { load2026MatchupData } from '../../scripts/nfl-2026-matchups.js';

export const load2026MatchupSources = options => load2026MatchupData(options);
