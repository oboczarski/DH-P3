// DataHub Stats 2026 qualifiers. The future season loader must supply the number
// of weeks actually loaded; never derive this from today's date or player GM_P.
// Stable option keys preserve the chosen tier as its numeric threshold changes.
const WEEK_ONE_OPTIONS = Object.freeze({
  RR: [26, 22, 17, 13, 11],
  TGT: [6, 5, 4, 3],
  CAR: [10, 8, 5, 4, 2],
  paATT: [20, 16, 10, 5],
  DB: [26, 21, 16],
  "SNP%": [70, 60, 50, 40, 30],
});
const DEFAULT_OPTION_INDEX = Object.freeze({ RR: 3, TGT: 1, CAR: 2, paATT: 1, DB: 0, "SNP%": 0 });

export function get2026QualifierOptions(stat, weeksOfData = 1) {
  const weeks = Math.max(1, Math.min(18, Math.floor(Number(weeksOfData) || 1)));
  if (stat === "GM_P") {
    const high = Math.max(1, weeks - 1);
    const middle = weeks >= 14 ? 9 : weeks >= 11 ? 6 : weeks >= 7 ? 4 : weeks >= 4 ? 2 : 1;
    const low = weeks >= 14 ? 4 : weeks >= 11 ? 3 : weeks >= 7 ? 2 : 1;
    return [
      { value: "high", threshold: high, label: `High · ${high}`, triggerLabel: String(high) },
      { value: "middle", threshold: middle, label: `Middle · ${middle}`, triggerLabel: String(middle), isDefault: true },
      { value: "low", threshold: low, label: `Low · ${low}`, triggerLabel: String(low) },
    ];
  }
  return (WEEK_ONE_OPTIONS[stat] || []).map((base, index) => {
    const threshold = stat === "SNP%" ? base : base * weeks;
    return {
      value: `tier-${index}`,
      threshold,
      label: stat === "SNP%" ? `${threshold}%` : String(threshold),
      isDefault: index === DEFAULT_OPTION_INDEX[stat],
    };
  });
}
