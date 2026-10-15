/* Read-only chart views of FPFA averages, FPF baselines and FPA individual games. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FPAChartLabData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const POSITIONS = Object.freeze(["QB", "RB", "WR", "TE", "ALL"]);

  function build(analysis, pos, order = []) {
    const teams = [...new Set([...order, ...analysis.rows.map(row => row.team)])].filter(team => analysis.byTeam.has(team));
    const cells = teams.flatMap(team => POSITIONS.map(position => {
      const c = analysis.byTeam.get(team).metrics[position], stat = c.actual;
      return { team, pos: position, avg: stat.avg, rank: stat.rank, pool: stat.pool, games: stat.games,
        rankOrder: stat.rankOrder, expectedAvg: c.expectedAvg };
    }));
    // ALL labels retain the supplied average; independently rounded positional
    // averages can sum 0.1 differently. ALL is never a fifth stacked segment.
    // Keep zero values and the original positional averages without inventing bar area.
    const breakdown = teams.map(team => ({
      ...cells.find(row => row.team === team && row.pos === "ALL"),
      ...Object.fromEntries(cells.filter(row => row.team === team).map(row => [row.pos, row.avg])),
    }));
    const dumbbell = teams.flatMap(team => {
      const c = analysis.byTeam.get(team).metrics[pos];
      // Dumbbells compare the existing per-game averages directly. FPFA owns
      // all-games averages; venue averages already come from the scoped analysis.
      if (!Number.isFinite(c.actual.avg) || !Number.isFinite(c.expectedAvg)) return [];
      const deltaAvg = c.actual.avg - c.expectedAvg;
      return [{ team, pos, expectedOnLeft: c.expectedAvg <= c.actual.avg,
        actualAvg: c.actual.avg, expectedAvg: c.expectedAvg, games: c.games,
        deltaAvg,
        lowAvg: Math.min(c.actual.avg, c.expectedAvg), highAvg: Math.max(c.actual.avg, c.expectedAvg) }];
    });
    dumbbell.sort((a, b) => b.actualAvg - a.actualAvg || a.team.localeCompare(b.team));
    const bands = ["highest", "upper", "lower", "lowest"];
    dumbbell.forEach((row, index) => { row.gradientKey = bands[Math.min(3, Math.floor(index * 4 / dumbbell.length))]; });
    const weeks = [...new Set(teams.flatMap(team => analysis.byTeam.get(team).metrics[pos].entries.map(entry => entry.week)))].sort((a, b) => a - b);
    const polar = teams.flatMap((team, index) => analysis.byTeam.get(team).metrics[pos].entries.filter(entry => Number.isFinite(entry.actual)).map(entry => ({
      ...entry, team, pos, logoTeam: entry.offense, location: .5, angle: -90 + (index + .5) * 360 / teams.length,
    })));
    return { teams, positions: [...POSITIONS], cells, breakdown, dumbbell, polar, weeks, pos };
  }
  function dumbbellBounds(rows) {
    const values = rows.flatMap(row => [row.actualAvg, row.expectedAvg]).filter(Number.isFinite);
    if (!values.length) return { min: 0, max: 7 };
    // Per-game padding keeps endpoint labels clear without the old total-scale
    // margins overwhelming the smaller range, including zero/equal averages.
    const min = Math.min(...values), max = Math.max(...values), span = max - min;
    return { min: min - Math.max(3, span * .12), max: max + Math.max(4, span * .15) };
  }
  function extent(values, unit = 5, includeZero = false) {
    const finite = values.filter(Number.isFinite);
    if (includeZero) finite.push(0);
    if (!finite.length) return { min: 0, max: unit };
    let min = Math.floor(Math.min(...finite) / unit) * unit, max = Math.ceil(Math.max(...finite) / unit) * unit;
    if (min === max) { min -= unit; max += unit; }
    return { min, max };
  }
  return Object.freeze({ POSITIONS, build, extent, dumbbellBounds });
});
