import { is2026RankQualified } from "./datahub-stats-season.js";

// DataHub Stats table ranks: use each position's default season-volume gate
// or its high-scoring participation exception, independent of visible filters.
const QUALIFIER_2025 = Object.freeze({
  QB: ["paATT", 200],
  RB: ["CAR", 100],
  WR: ["RR", 220],
  TE: ["RR", 220],
});
// FPTS keeps its existing pill and G/GM_P has no positional annotation.
const IDENTITY_COLUMNS = new Set(["RK", "PLAYER", "POS", "TM", "AGE", "FPTS", "G", "GM_P"]);
const LOWER_IS_BETTER_STATS = new Set(["SAC", "INT", "FUM", "TTT", "PRS%", "DP%"]);

function numericStat(value) {
  if (value == null || value === "" || value === "NA" || value === "#N/A") return null;
  const number = Number(String(value).replace(/,/g, "").replace(/%$/, ""));
  return Number.isFinite(number) ? number : null;
}

// DataHub Stats exception: use unrounded season FPTS divided by games played,
// admitting a player only after participation in at least half the elapsed weeks.
export function hasStatsScoringQualifierException(row, elapsedWeeks) {
  if (!Object.prototype.hasOwnProperty.call(QUALIFIER_2025, row.POS)) return false;
  const games = numericStat(row.GM_P) ?? numericStat(row.G) ?? numericStat(row.__meta?.gmPlayed);
  const points = numericStat(row.__meta?.fpts ?? row.FPTS);
  return games !== null && games > 0 && games >= Math.ceil(Math.max(1, elapsedWeeks) / 2)
    && points !== null && points / games >= 20;
}

// Export the table's eligibility rule for DataHub's independent modal ranks.
export function isStatsSeasonRankQualified(row, season, weeksOfData, elapsedWeeks) {
  if (hasStatsScoringQualifierException(row, elapsedWeeks)) return true;
  if (season === "2026") return is2026RankQualified(row, weeksOfData);
  const [stat, minimum] = QUALIFIER_2025[row.POS] || [];
  const value = numericStat(row[stat]);
  return value !== null && value >= minimum;
}

export function buildStatsPositionalRanks(rows, columns, season, weeksOfData = 1, elapsedWeeks = season === "2026" ? weeksOfData : 18) {
  const ranksByRow = new WeakMap();
  const stats = [...new Set(columns)].filter((column) => !IDENTITY_COLUMNS.has(column));

  for (const position of ["QB", "RB", "WR", "TE"]) {
    const qualifiedRows = rows.filter((row) => row.POS === position && isStatsSeasonRankQualified(row, season, weeksOfData, elapsedWeeks));
    for (const stat of stats) {
      const candidates = qualifiedRows
        .map((row) => ({ row, value: numericStat(row[stat]) }))
        .filter(({ value }) => value !== null);
      const direction = LOWER_IS_BETTER_STATS.has(stat) ? 1 : -1;
      candidates.sort((left, right) => direction * (left.value - right.value));
      let previousValue = null;
      let rank = 0;
      candidates.forEach(({ row, value }, index) => {
        if (value !== previousValue) rank = index + 1;
        previousValue = value;
        if (!ranksByRow.has(row)) ranksByRow.set(row, Object.create(null));
        ranksByRow.get(row)[stat] = rank;
      });
    }
  }

  return ranksByRow;
}
