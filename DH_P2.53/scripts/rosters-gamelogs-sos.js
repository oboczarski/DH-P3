// Rosters profile SOS only. Rank each team's average opponent positional FPA
// per game, with 1 = easiest and 32 = toughest. These are schedule ranks, not
// inversions/replacements of DRK defense ranks or published FPFA SOS ranks.
export const SOS_TEAMS = Object.freeze('ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS'.split(' '));
const POSITIONS = ['QB', 'RB', 'WR', 'TE'];
export const canonicalSosTeam = value => {
  const team = String(value ?? '').trim().toUpperCase();
  return ({ JAC: 'JAX', WSH: 'WAS', LA: 'LAR' })[team] || team;
};
const numeric = value => {
  const text = String(value ?? '').trim();
  return text && Number.isFinite(Number(text)) ? Number(text) : null;
};
const opponentTeam = value => {
  const match = /^(?:(?:@|vs\.?)\s*)?([A-Z]{2,3})$/i.exec(String(value ?? '').trim());
  const team = match && canonicalSosTeam(match[1]);
  return SOS_TEAMS.includes(team) ? team : null;
};

export function rankPositionSchedules(source, position) {
  const pos = String(position ?? '').toUpperCase();
  const cutoff = source?.latestRecordedWeek;
  if (!POSITIONS.includes(pos) || !Number.isInteger(cutoff) || cutoff < 0 || cutoff > 18) return null;
  const schedules = Object.fromEntries(Object.entries(source.scheduleByTeam || {}).map(([team, row]) => [canonicalSosTeam(team), row]));
  const defenses = Object.fromEntries(Object.entries(source.defenseByTeam || {}).map(([team, row]) => [canonicalSosTeam(team), row]));
  const result = { cutoff, faced: {}, remaining: {} };
  for (const period of ['faced', 'remaining']) {
    const start = period === 'faced' ? 1 : cutoff + 1;
    const end = period === 'faced' ? cutoff : 18;
    const scores = SOS_TEAMS.map(team => {
      const values = [];
      let missing = false;
      for (let week = start; week <= end; week++) {
        const cell = schedules[team]?.[week];
        if (/^BYE$/i.test(String(cell ?? '').trim())) continue;
        const opponent = opponentTeam(cell);
        const value = opponent ? numeric(defenses[opponent]?.[pos]) : null;
        if (value === null) missing = true;
        else values.push(value);
      }
      return { team, games: values.length, average: !missing && values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null };
    });
    // A /32 comparison requires complete schedules for all 32 teams. Missing
    // opponents/allowances are unavailable, never zero or a smaller rank pool.
    const complete = scores.every(score => score.average !== null);
    scores.sort((a, b) => b.average - a.average);
    let previous = null, rank = 0;
    scores.forEach((score, index) => {
      if (previous === null || Math.abs(score.average - previous) > 1e-10) rank = index + 1;
      previous = score.average;
      result[period][score.team] = { ...score, rank: complete ? rank : null };
    });
  }
  return result;
}

// Historical SOS uses the already-cached 2025 weekly CSVs' TM/VS/FPT_PPR
// columns. Reconstruct team schedules and positional allowances from those
// original rows; traded-player metadata and Sleeper's current teams are unused.
export function historicalSosSource(weeks) {
  const scheduleByTeam = {}, totals = {}, games = {};
  let latestRecordedWeek = 0;
  for (const { week, rows } of weeks) {
    if (!Number.isInteger(week) || week < 1 || week > 18) continue;
    let recorded = false;
    const seen = new Set();
    for (const row of rows) {
      const team = canonicalSosTeam(row.TM);
      const opponent = opponentTeam(row.VS);
      if (!SOS_TEAMS.includes(team)) continue;
      scheduleByTeam[team] ||= {};
      if (/^BYE$/i.test(String(row.VS).trim())) { scheduleByTeam[team][week] = 'BYE'; continue; }
      if (!opponent) continue;
      const prior = scheduleByTeam[team][week];
      // Conflicting CSV opponents must invalidate the schedule, not pick a row.
      scheduleByTeam[team][week] = prior && prior !== row.VS ? 'UNAVAILABLE' : row.VS;
      const pos = String(row.POS).toUpperCase();
      const points = numeric(row.FPT_PPR);
      const id = `${week}:${row.SLPR_ID}`;
      if (!POSITIONS.includes(pos) || points === null || seen.has(id)) continue;
      seen.add(id);
      totals[opponent] ||= {};
      totals[opponent][pos] = (totals[opponent][pos] || 0) + points;
      recorded ||= points !== 0 || ['GM_P', 'SNP', 'paATT', 'CAR', 'TGT', 'RR'].some(key => numeric(row[key]) > 0);
    }
    if (recorded) latestRecordedWeek = Math.max(latestRecordedWeek, week);
  }
  // Denominators count defensive games once, including games allowing zero
  // points to a position; a team's BYE never becomes a zero-point game.
  for (const team of SOS_TEAMS) games[team] = Object.entries(scheduleByTeam[team] || {}).filter(([week, opponent]) => Number(week) <= latestRecordedWeek && opponentTeam(opponent)).length;
  const defenseByTeam = Object.fromEntries(SOS_TEAMS.map(team => [team, Object.fromEntries(POSITIONS.map(pos => [pos,
    games[team] && totals[team]?.[pos] !== undefined ? totals[team][pos] / games[team] : null
  ]))]));
  return { scheduleByTeam, defenseByTeam, latestRecordedWeek };
}
