// DataHub uses the same source units for build-time ranks and displayed stats.
export function normalizeSheetHeader(header) {
  // DataHub share labels follow the renamed DH/WK headers. Accept historical
  // TMS/YMS exports while preserving the existing internal stat/rank keys.
  return String(header || "").replace(/[\u00a0\u202f]/g, " ").trim()
    .replace(/^(pa|ru|rec)?TMS$/, "$1TDS%")
    .replace(/^(pa|ru|rec)?YMS$/, "$1YS%");
}

export function parseDataHubStatValue(header, value) {
  const trimmedValue = String(value ?? "").trim();
  if (!trimmedValue || trimmedValue.toUpperCase() === "NA") {
    return null;
  }
  // QB percentages and reception/yard/TD shares accept explicit percentages,
  // fractions, or percentage points. TPRR remains a decimal ratio from DH/WK.
  if (["SNP%", "BLTZ%", "TmPa%", "RECS%"].includes(header) || /^(pa|ru|rec)?(TDS|YS)%$/.test(normalizeSheetHeader(header))) {
    const numericPortion = Number.parseFloat(trimmedValue.replace("%", ""));
    if (!Number.isFinite(numericPortion)) {
      return null;
    }
    return trimmedValue.includes("%") || numericPortion > 1.5
      ? numericPortion
      : numericPortion * 100;
  }
  const numericValue = Number.parseFloat(trimmedValue);
  return Number.isFinite(numericValue) ? numericValue : null;
}
