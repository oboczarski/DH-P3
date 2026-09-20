// DataHub-only 2026 source. Public CSV reads keep workbook credentials out of
// the app; DH supplies totals, numbered WK tabs supply results/projections.
export const DATAHUB_2026_WORKBOOK = '16fOWHEuPWkNz9AHLCiySjxwW_y4ulLemNaMVc3srE94';
const POSITIONS = new Set(['QB', 'RB', 'WR', 'TE']);
const DEFENSE_COLUMNS = { QB: 'QBRK', RB: 'RBRK', WR: 'WRRK', TE: 'TERK' };

export function normalize2026Team(team) {
  const value = String(team || '').trim().toUpperCase();
  return ({ JAC: 'JAX', WSH: 'WAS', LA: 'LAR' })[value] || value;
}

function isPlayer(row) {
  return /^\d+$/.test(String(row.SLPR_ID || '').trim()) && POSITIONS.has(row.POS);
}

// A pre-created week with names, opponents or projections is not a results week.
// Positive participation or nonzero fantasy points counts; zero placeholders do not.
export function has2026WeekResults(row) {
  return ['GM_P', 'SNP', 'paATT', 'CAR', 'TGT', 'REC', 'RR'].some((key) => Number(row[key]) > 0)
    || (Number.isFinite(Number(row.FPT_PPR)) && Number(row.FPT_PPR) !== 0);
}

export function build2026SourceData({ seasonRows, weeklyRows, scheduleRows, defenseRows }) {
  // Adapt the workbook's identity/game columns to the existing table contract.
  // Preserve every original stat field for the modal's header-based parser.
  const rawRows = seasonRows.filter(isPlayer).map((row) => ({ ...row, NM: row['PLAYER NAME'], G: row.GM_P }));
  const schedule = new Map(scheduleRows.map((row) => [normalize2026Team(row.TM), row]));
  const defense = new Map(defenseRows.map((row) => [normalize2026Team(row.TM), row]));
  const players = new Map(rawRows.map((row) => [String(row.SLPR_ID), row]));
  Object.values(weeklyRows).flat().filter(isPlayer).forEach((row) => {
    if (!players.has(String(row.SLPR_ID))) players.set(String(row.SLPR_ID), row);
  });
  const weeksWithResults = Object.entries(weeklyRows)
    .filter(([, rows]) => rows.some((row) => isPlayer(row) && has2026WeekResults(row)))
    .map(([week]) => Number(week)).sort((a, b) => a - b);
  const resolvedWeeks = {};
  for (let week = 1; week <= 18; week++) {
    const recorded = new Map((weeklyRows[week] || []).filter(isPlayer).map((row) => [String(row.SLPR_ID), row]));
    resolvedWeeks[week] = [...players.entries()].map(([id, player]) => {
      const source = recorded.get(id);
      const team = normalize2026Team(source?.TM || player.TM);
      const pos = source?.POS || player.POS;
      const opponent = String(schedule.get(team)?.[week] || '').trim();
      const opponentTeam = normalize2026Team(opponent.replace(/^(?:@|vs\.?)\s*/i, ''));
      const rawRank = defense.get(opponentTeam)?.[DEFENSE_COLUMNS[pos]];
      const rank = Number(rawRank);
      // Never copy season totals into a missing week's stat line. Schedule is
      // authoritative for all 18 weeks, including BYEs and weeks without a tab.
      return {
        SZN: String(week), SLPR_ID: id, 'PLAYER NAME': player['PLAYER NAME'], POS: pos, TM: team,
        ...source,
        __hasRecordedStats: Boolean(source && has2026WeekResults(source)),
        VS: opponent,
        vsRK: opponentTeam !== 'BYE' && Number.isInteger(rank) && rank >= 1 && rank <= 32 ? String(rank) : '',
      };
    });
  }
  return { rawRows, weeklyRows: resolvedWeeks, weeksWithResults, weeksOfData: Math.max(1, weeksWithResults.length) };
}

export async function load2026SourceData({ parseCsv, scheduleUrl, fetchImpl = fetch }) {
  async function sheet(name, requiredHeaders) {
    const url = `https://docs.google.com/spreadsheets/d/${DATAHUB_2026_WORKBOOK}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(name)}`;
    const response = await fetchImpl(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`2026 ${name} could not load (${response.status}).`);
    const text = await response.text();
    // Google returns an empty CSV for numbered tabs that do not exist yet.
    if (!text.trim() && /^WK\d+$/.test(name)) return [];
    const rows = parseCsv(text);
    if (!rows.length || requiredHeaders.some((header) => !(header in rows[0]))) {
      throw new Error(`2026 ${name} has missing or invalid columns.`);
    }
    return rows;
  }
  const [seasonRows, defenseRows, scheduleRows] = await Promise.all([
    sheet('DH', ['SZN', 'SLPR_ID', 'POS', 'TM', 'FPT_PPR']),
    sheet('DRK', ['TM', 'QBRK', 'RBRK', 'WRRK', 'TERK']),
    fetchImpl(scheduleUrl, { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error(`Schedule2026.csv could not load (${response.status}).`);
      const rows = parseCsv(await response.text());
      if (!rows.length || !('TM' in rows[0]) || !('18' in rows[0])) throw new Error('Invalid 2026 schedule.');
      return rows;
    }),
  ]);
  if (seasonRows.some((row) => isPlayer(row) && String(row.SZN) !== '2026')) throw new Error('DH contains a different season.');
  // Probe WK1–WK18 on every page load so newly added tabs need no code changes.
  // Limit concurrency to avoid a burst of 18 requests to the workbook.
  const weeklyRows = {};
  let nextWeek = 1;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (nextWeek <= 18) {
      const week = nextWeek++;
      const rows = await sheet(`WK${week}`, ['SZN', 'SLPR_ID', 'POS', 'TM', 'FPT_PPR']);
      if (rows.some((row) => isPlayer(row) && Number(row.SZN) !== week)) throw new Error(`WK${week} contains another week's rows.`);
      weeklyRows[week] = rows;
    }
  }));
  return build2026SourceData({ seasonRows, weeklyRows, scheduleRows, defenseRows });
}
