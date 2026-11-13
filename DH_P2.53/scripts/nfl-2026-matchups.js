// Shared, data-only 2026 matchup calculations. Pages retain their own rendering,
// modal state and assets; recorded results and box scores come only from the
// weekly CSV. Future PROJ cells never enter these totals or game denominators.
export const MATCHUP_POSITIONS = Object.freeze(['QB', 'RB', 'WR', 'TE']);
export const MATCHUP_TEAMS = Object.freeze('ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS'.split(' '));
const METRICS = [...MATCHUP_POSITIONS, 'ALL'];
const TEAMS = new Set(MATCHUP_TEAMS);
const UNKNOWN = new Set(['', 'NA', 'N/A', 'BYE', '-', '—', '–', 'FA', 'UD']);
const STAT_FIELDS = ['paATT', 'CMP', 'CMP%', 'paYDS', 'paTD', 'paRTG', 'CAR', 'ruYDS', 'YPC', 'TD(t)', 'REC', 'TGT', 'recYDS', 'recTD', 'YAC', 'YDS(t)', 'OPP'];
export const matchupTeam = value => {
  const team = String(value ?? '').trim().toUpperCase();
  return ({ JAC: 'JAX', WSH: 'WAS', WFT: 'WAS', LA: 'LAR', STL: 'LAR', SD: 'LAC', OAK: 'LV' })[team] || team;
};
export const has2026RecordedResult = row => ['GM_P', 'SNP', 'paATT', 'CAR', 'TGT', 'REC', 'RR'].some(key => Number(row[key]) > 0)
  || (Number.isFinite(Number(row.FPT_PPR)) && Number(row.FPT_PPR) !== 0);

// Header-based CSV parsing preserves quoted names, literal status cells, zeros
// and negatives. Reject a malformed file rather than shifting its stat columns.
export function parse2026Csv(text) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('The 2026 CSV is empty.');
  const matrix = []; let row = [], field = '', quoted = false, closed = false;
  const finishField = () => { row.push(field.trim()); field = ''; closed = false; };
  const finishRow = () => { finishField(); if (row.some(Boolean)) matrix.push(row); row = []; };
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { quoted = false; closed = true; }
      else field += ch;
    } else if (ch === '"') {
      if (field || closed) throw new Error('Unexpected quote in 2026 CSV.');
      quoted = true;
    } else if (ch === ',') finishField();
    else if (ch === '\n' || ch === '\r') { finishRow(); if (ch === '\r' && input[i + 1] === '\n') i++; }
    else if (closed) { if (!/\s/.test(ch)) throw new Error('Text after a closing CSV quote.'); }
    else field += ch;
  }
  if (quoted) throw new Error('Unclosed quote in 2026 CSV.');
  if (field || row.length || closed) finishRow();
  const headers = matrix.shift();
  if (!headers?.length || headers.some(h => !h) || new Set(headers).size !== headers.length) throw new Error('Invalid 2026 CSV headers.');
  return matrix.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`2026 CSV row ${index + 2} has ${values.length} columns; expected ${headers.length}.`);
    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
}

function opponent(value) {
  const text = String(value ?? '').trim();
  if (UNKNOWN.has(text.toUpperCase())) return null;
  const match = /^(vs\.?|@)\s+([a-z]{2,3})$/i.exec(text);
  const team = match && matchupTeam(match[2]);
  if (!TEAMS.has(team)) throw new Error(`Invalid 2026 matchup opponent “${text}”.`);
  return { team, home: match[1][0] !== '@' };
}
function cents(value, label) {
  const text = String(value ?? '').trim();
  if (!/^[+-]?\d+(?:\.\d{1,2})?$/.test(text)) throw new Error(`${label}: FPT_PPR must contain a recorded score with at most two decimals.`);
  const valueInCents = Math.round(Number(text) * 100);
  if (!Number.isSafeInteger(valueInCents)) throw new Error(`${label}: FPT_PPR is outside the supported numeric range.`);
  return valueInCents;
}
const fraction = (n, d = 1) => ({ n: BigInt(n), d: BigInt(d) });
const compare = (a, b) => a.n * b.d < b.n * a.d ? -1 : a.n * b.d > b.n * a.d ? 1 : 0;
const divide = (a, d) => ({ n: a.n, d: a.d * BigInt(d) });
const numeric = a => a ? Number(a.n) / Number(a.d) / 100 : null;
function add(a, b) {
  let n = a.n * b.d + b.n * a.d, d = a.d * b.d;
  let x = n < 0n ? -n : n, y = d;
  while (y) { const next = x % y; x = y; y = next; }
  return { n: n / (x || 1n), d: d / (x || 1n) };
}
// Rank exact cent/game fractions, including opponent averages. This prevents
// both floating-point false ties and false tie-breaks; competition ranks skip
// the occupied places (1, 1, 3). Only final presentation uses decimal numbers.
function rankFractions(rows, valueFor, ascending = false) {
  const pool = rows.filter(row => valueFor(row) !== null).sort((a, b) => (ascending ? 1 : -1) * compare(valueFor(a), valueFor(b)));
  const ranks = new Map(); let previous = null, rank = 0;
  pool.forEach((row, index) => {
    const value = valueFor(row);
    if (previous === null || compare(previous, value) !== 0) rank = index + 1;
    ranks.set(row.team, rank); previous = value;
  });
  return ranks;
}

export function build2026MatchupData({ weeklyRows, scheduleRows, rawCSV = '' }) {
  if (!weeklyRows?.length || !('WK' in weeklyRows[0] || 'SZN' in weeklyRows[0]) || ['SLPR_ID', 'POS', 'TM', 'FPT_PPR'].some(key => !(key in weeklyRows[0]))) throw new Error('2026_AllWKs.csv has missing or invalid matchup columns.');
  if (!scheduleRows?.length || !('TM' in scheduleRows[0])) throw new Error('Schedule2026.csv has missing matchup columns.');
  const scheduleByTeam = {};
  for (const row of scheduleRows) {
    const team = matchupTeam(row.TM);
    if (!TEAMS.has(team)) continue;
    if (scheduleByTeam[team]) throw new Error(`Duplicate 2026 schedule for ${team}.`);
    scheduleByTeam[team] = { ...row, TM: team };
  }
  const players = weeklyRows.filter(row => /^\d+$/.test(String(row.SLPR_ID)) && MATCHUP_POSITIONS.includes(String(row.POS).toUpperCase()));
  const candidates = players.map((row, index) => {
    const week = Number(row.WK ?? row.SZN), team = matchupTeam(row.TM), pos = String(row.POS).toUpperCase();
    if (!Number.isInteger(week) || week < 1 || week > 18) throw new Error(`Invalid 2026 matchup week: ${row.WK}.`);
    // Historical weekly identity/venue wins over current roster metadata. A
    // missing VS may use this same team's local schedule, never another feed.
    const vs = String(row.VS ?? scheduleByTeam[team]?.[week] ?? '').trim();
    const vsInfo = opponent(vs);
    return { row, week, team, pos, vs, vsInfo, line: index + 2 };
  });
  const recorded = new Set();
  let latestRecordedWeek = 0;
  for (const item of candidates) if (has2026RecordedResult(item.row) && item.vsInfo && TEAMS.has(item.team)) {
    recorded.add(`${item.team}|${item.week}`);
    latestRecordedWeek = Math.max(latestRecordedWeek, item.week);
  }
  const results = [], excluded = [], seen = new Set(), gamesByKey = new Map();
  for (const item of candidates) {
    const { row, week, team, pos, vsInfo, line } = item;
    if (week > latestRecordedWeek || (vsInfo && !recorded.has(`${team}|${week}`))) continue;
    if (!vsInfo) { excluded.push({ week, playerId: String(row.SLPR_ID), pos, reason: 'No recorded matchup' }); continue; }
    if (!TEAMS.has(team)) throw new Error(`Recorded matchup has an invalid offense: ${team}.`);
    const identity = `${week}|${row.SLPR_ID}`;
    if (seen.has(identity)) throw new Error(`Duplicate 2026 matchup result: ${identity}.`);
    seen.add(identity);
    const score = cents(row.FPT_PPR, identity);
    const scheduled = scheduleByTeam[team]?.[week];
    if (scheduled) {
      const expected = opponent(scheduled);
      if (!expected || expected.team !== vsInfo.team || expected.home !== vsInfo.home) throw new Error(`2026 CSV and schedule disagree for ${team}, Week ${week}.`);
    }
    const result = { week, player: String(row['PLAYER NAME'] || row.SLPR_ID), playerId: String(row.SLPR_ID), pos,
      pts: score / 100, cents: score, playerTeam: team, def: vsInfo.team,
      playerVenue: vsInfo.home ? 'home' : 'away', defenseVenue: vsInfo.home ? 'away' : 'home',
      vs: `${vsInfo.home ? 'vs' : '@'} ${vsInfo.team}`, line,
      stats: Object.fromEntries(STAT_FIELDS.map(field => {
        const text = String(row[field] ?? '').trim().replace(/%$/, '');
        return [field.toUpperCase(), /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) ? Number(text) : null];
      })) };
    results.push(result);
    const key = `${result.def}|${week}`;
    if (!gamesByKey.has(key)) gamesByKey.set(key, { def: result.def, week, offense: team, venue: result.defenseVenue,
      records: [], positionCents: Object.fromEntries(MATCHUP_POSITIONS.map(p => [p, null])) });
    const game = gamesByKey.get(key);
    if (game.offense !== team || game.venue !== result.defenseVenue) throw new Error(`Conflicting 2026 matchup for ${result.def}, Week ${week}.`);
    game.records.push(result); game.positionCents[pos] = (game.positionCents[pos] ?? 0) + score;
  }
  if (!results.length) throw new Error('No recorded 2026 matchup results in 2026_AllWKs.csv.');
  const games = [...gamesByKey.values()].sort((a, b) => a.week - b.week || a.def.localeCompare(b.def));
  const missingPositions = [], unpairedGames = [], matchups = new Set();
  for (const game of games) {
    const absent = MATCHUP_POSITIONS.filter(p => game.positionCents[p] === null);
    if (absent.length) missingPositions.push({ defense: game.def, week: game.week, positions: absent });
    game.totalCents = absent.length ? null : MATCHUP_POSITIONS.reduce((sum, p) => sum + game.positionCents[p], 0);
    const reverse = gamesByKey.get(`${game.offense}|${game.week}`);
    if (!reverse) unpairedGames.push({ defense: game.def, week: game.week });
    else if (reverse.offense !== game.def || reverse.venue === game.venue) throw new Error(`Conflicting reverse 2026 matchup for ${game.def}, Week ${game.week}.`);
    matchups.add(`${game.week}|${[game.def, game.offense].sort().join('|')}`);
  }
  const weeks = [...new Set(games.map(g => g.week))].sort((a, b) => a - b);
  const model = { name: '2026_AllWKs.csv', season: 2026, rawCSV, strictPositionCoverage: true, headers: Object.keys(weeklyRows[0]).map(h => h.toUpperCase()),
    results, excluded, games, gamesByKey, weeks, defenses: [...MATCHUP_TEAMS], minWeek: weeks[0], maxWeek: latestRecordedWeek,
    diagnostics: { missingPositions, unpairedGames },
    audit: { sourceRows: results.length + excluded.length, usedRows: results.length, excludedRows: excluded.length,
      sourcePlayers: new Set(candidates.filter(r => r.week <= latestRecordedWeek).map(r => r.row.SLPR_ID)).size,
      matchedPlayers: new Set(results.map(r => r.playerId)).size, zeroResults: results.filter(r => r.cents === 0).length,
      negativeResults: results.filter(r => r.cents < 0).length, totalPoints: results.reduce((sum, r) => sum + r.cents, 0) / 100,
      defenseGames: games.length, matchups: matchups.size } };
  const points = (game, pos) => pos === 'ALL' ? game.totalCents : game.positionCents[pos];
  const totals = (teamGames, pos) => teamGames.length && teamGames.every(g => points(g, pos) !== null)
    ? teamGames.reduce((sum, g) => sum + points(g, pos), 0) : null;
  const offenseRows = MATCHUP_TEAMS.map(team => {
    const played = games.filter(g => g.offense === team);
    return { team, games: played.length, metrics: Object.fromEntries(METRICS.map(pos => {
      const total = totals(played, pos);
      return [pos, { total: total === null ? null : total / 100, avg: total === null ? null : total / 100 / played.length, rank: null }];
    })) };
  });
  const offenseByTeam = new Map(offenseRows.map(row => [row.team, row]));
  const summaryRows = MATCHUP_TEAMS.map(team => {
    const played = games.filter(g => g.def === team);
    return { team, games: played.length, opponents: played.map(g => ({ week: g.week, offense: g.offense })),
      metrics: Object.fromEntries(METRICS.map(pos => {
        const total = totals(played, pos);
        return [pos, { total: total === null ? null : total / 100, avg: total === null ? null : total / 100 / played.length,
          rank: null, expectedTotal: null, expectedAvg: null, expectedRank: null }];
      })) };
  });
  for (const pos of METRICS) {
    const offenseTotal = row => row.metrics[pos].total === null ? null : fraction(Math.round(row.metrics[pos].total * 100));
    const offenseRanks = rankFractions(offenseRows, offenseTotal);
    offenseRows.forEach(row => { row.metrics[pos].rank = offenseRanks.get(row.team) ?? null; });
    const actual = row => row.metrics[pos].total === null ? null : fraction(Math.round(row.metrics[pos].total * 100), row.games);
    const actualRanks = rankFractions(summaryRows, actual);
    const defenseRanks = rankFractions(summaryRows, actual, true);
    const expected = new Map(summaryRows.map(row => {
      let value = fraction(0);
      for (const game of row.opponents) {
        const offense = offenseByTeam.get(game.offense), total = offenseTotal(offense);
        if (total === null || !offense.games) return [row.team, null];
        value = add(value, divide(total, offense.games));
      }
      return [row.team, row.games ? value : null];
    }));
    const expectedRanks = rankFractions(summaryRows, row => expected.get(row.team) ? divide(expected.get(row.team), row.games) : null, true);
    summaryRows.forEach(row => Object.assign(row.metrics[pos], { rank: actualRanks.get(row.team) ?? null,
      defenseRank: defenseRanks.get(row.team) ?? null,
      expectedTotal: numeric(expected.get(row.team)), expectedAvg: expected.get(row.team) ? numeric(expected.get(row.team)) / row.games : null,
      expectedRank: expectedRanks.get(row.team) ?? null }));
  }
  // Game Logs uses the same raw allowance ranks for every recorded/future tag
  // and upcoming matchup. Its SOS adapter averages these ranks over each local
  // schedule window; the modal's SOS separately ranks opposing offense PPG.
  const defenseByTeam = Object.fromEntries(summaryRows.map(row => [row.team, Object.fromEntries(MATCHUP_POSITIONS.flatMap(pos => [
    [pos, row.metrics[pos].avg], [`${pos}RK`, row.metrics[pos].rank]
  ]))]));
  // Legacy Game Logs renderers reverse a raw /32 rank. Adapt the independently
  // ranked defense strength here so ties at either end and partial NFL weeks
  // still display 1 = fewest points/game. SOS retains allowance ranks above.
  const matchupRanksByTeam = Object.fromEntries(summaryRows.map(row => [row.team, Object.fromEntries(MATCHUP_POSITIONS.map(pos => [
    `${pos}RK`, row.metrics[pos].defenseRank === null ? null : 33 - row.metrics[pos].defenseRank
  ]))]));
  return { season: 2026, model, summary: { name: 'Calculated 2026 defense matchups', rows: summaryRows,
    byTeam: new Map(summaryRows.map(row => [row.team, row])), weeks },
    offenses: { name: 'Calculated 2026 offense scoring', rows: offenseRows, byTeam: offenseByTeam },
    scheduleByTeam, defenseByTeam, matchupRanksByTeam, latestRecordedWeek };
}

// Share in-flight local reads within one page (Game Logs, projections and the
// lazy matchup modal). Reloading the page starts fresh no-store requests. A
// failed read is evicted so Retry can succeed without a Sheets fallback.
const reads = new WeakMap(), snapshots = new WeakMap();
const WEEKLY_URL = new URL('../data/NFL-2026_Stats/WeeklyStats/2026_AllWKs.csv', import.meta.url);
const SCHEDULE_URL = new URL('../data/NFL-2026_Stats/NFL-Schedule/Schedule2026.csv', import.meta.url);
function readLocal(url, fetchImpl) {
  let cache = reads.get(fetchImpl); if (!cache) reads.set(fetchImpl, cache = new Map());
  const key = String(url);
  if (!cache.has(key)) cache.set(key, (async () => {
    const response = await fetchImpl(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${new URL(url).pathname.split('/').at(-1)} could not load (${response.status}).`);
    const csv = await response.text(); return { csv, rows: parse2026Csv(csv) };
  })().catch(error => { cache.delete(key); throw error; }));
  return cache.get(key);
}
export function load2026WeeklyCsv({ fetchImpl = globalThis.fetch, weeklyUrl = WEEKLY_URL } = {}) {
  return readLocal(weeklyUrl, fetchImpl);
}
export function load2026ScheduleCsv({ fetchImpl = globalThis.fetch, scheduleUrl = SCHEDULE_URL } = {}) {
  return readLocal(scheduleUrl, fetchImpl).then(source => {
    if (!source.rows.length || !('TM' in source.rows[0]) || !('18' in source.rows[0])) {
      reads.get(fetchImpl)?.delete(String(scheduleUrl));
      throw new Error('Schedule2026.csv has missing or invalid columns.');
    }
    return source;
  });
}
export function load2026MatchupData({ fetchImpl = globalThis.fetch, weeklyUrl = WEEKLY_URL, scheduleUrl = SCHEDULE_URL } = {}) {
  let cache = snapshots.get(fetchImpl); if (!cache) snapshots.set(fetchImpl, cache = new Map());
  const key = `${weeklyUrl}|${scheduleUrl}`;
  if (!cache.has(key)) cache.set(key, Promise.all([load2026WeeklyCsv({ fetchImpl, weeklyUrl }), load2026ScheduleCsv({ fetchImpl, scheduleUrl })])
    .then(([weekly, schedule]) => build2026MatchupData({ weeklyRows: weekly.rows, scheduleRows: schedule.rows, rawCSV: weekly.csv }))
    .catch(error => {
      cache.delete(key);
      reads.get(fetchImpl)?.delete(String(weeklyUrl));
      reads.get(fetchImpl)?.delete(String(scheduleUrl));
      throw error;
    }));
  return cache.get(key);
}
