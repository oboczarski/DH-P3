// Rosters owns these presentation helpers independently of Matchups. Convert
// published matchup ranks only at the display boundary: 1 is the best defense
// (fewest FPA/game). Venue ranks already run this way; SOS/offense ranks do not.
export function defenseMetric(stat) {
  const valid = Number.isInteger(stat.rank) && stat.rank >= 1 && stat.rank <= stat.pool;
  return { ...stat, rank: valid ? stat.rankOrder === 'descending' ? stat.pool + 1 - stat.rank : stat.rank : null,
    rankOrder: 'ascending' };
}

// Match the Matchups defense gradient: strong defenses are pink, weak defenses
// green. A descending scale is reserved for the unchanged low-rank/easy SOS.
export function rankColor(stat) {
  if (stat.rank === null) return '#7b81a5';
  const normalized = stat.pool < 2 ? .5 : (stat.rank - 1) / (stat.pool - 1);
  const fraction = stat.rankOrder === 'descending' ? 1 - normalized : normalized;
  const a = fraction <= .5 ? [255, 178, 216] : [171, 155, 255];
  const b = fraction <= .5 ? [171, 155, 255] : [117, 224, 183];
  const t = fraction <= .5 ? fraction * 2 : (fraction - .5) * 2;
  return '#' + a.map((value, i) => Math.round(value + (b[i] - value) * t).toString(16).padStart(2, '0')).join('');
}

// The defense heading shares the metric card's rank, including missing values
// and the 11th/12th/13th ordinal exceptions.
export function ordinalRank(rank) {
  if (!Number.isInteger(rank) || rank < 1) return '—';
  const lastTwo = rank % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[rank % 10] || 'th');
  return `${rank}${suffix}`;
}
