import { is2026RankQualified } from "./datahub-stats-season.js";

// DataHub Stats table ranks: use each position's default season-volume gate,
// independent of the visible category, user qualifier, search, and Show All.
const QUALIFIER_2025 = Object.freeze({
  QB: ["paATT", 200],
  RB: ["CAR", 100],
  WR: ["RR", 220],
  TE: ["RR", 220],
});
const IDENTITY_COLUMNS = new Set(["RK", "PLAYER", "POS", "TM", "AGE"]);
const LOWER_IS_BETTER_STATS = new Set(["SAC", "INT", "FUM", "TTT", "PRS%", "DP%"]);

function numericStat(value) {
  if (value == null || value === "" || value === "NA" || value === "#N/A") return null;
  const number = Number(String(value).replace(/,/g, "").replace(/%$/, ""));
  return Number.isFinite(number) ? number : null;
}

function isQualified(row, season, weeksOfData) {
  if (season === "2026") return is2026RankQualified(row, weeksOfData);
  const [stat, minimum] = QUALIFIER_2025[row.POS] || [];
  const value = numericStat(row[stat]);
  return value !== null && value >= minimum;
}

export function buildStatsPositionalRanks(rows, columns, season, weeksOfData = 1) {
  const ranksByRow = new WeakMap();
  const stats = [...new Set(columns)].filter((column) => !IDENTITY_COLUMNS.has(column));

  for (const position of ["QB", "RB", "WR", "TE"]) {
    const qualifiedRows = rows.filter((row) => row.POS === position && isQualified(row, season, weeksOfData));
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
