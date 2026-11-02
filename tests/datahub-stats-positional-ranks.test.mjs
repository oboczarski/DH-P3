import test from "node:test";
import assert from "node:assert/strict";
import { buildStatsPositionalRanks, isStatsPpgRankQualified } from "../DH_P2.53/scripts/datahub-stats-positional-ranks.js";

test("2026 Stats ranks use default volume gates and keep WR and TE separate", () => {
  const qbTop = { POS: "QB", paATT: "80", "CSTY%": "80%", INT: "5", FPTS: "60" };
  const qbTie = { POS: "QB", paATT: "60", "CSTY%": "80%", INT: "2", FPTS: "50" };
  const qbUnqualified = { POS: "QB", paATT: "59", "CSTY%": "99%", INT: "0", FPTS: "100" };
  const wr = { POS: "WR", RR: "48", FPTS: "35" };
  const te = { POS: "TE", RR: "48", FPTS: "20" };
  const wrUnqualified = { POS: "WR", RR: "47", FPTS: "90" };
  const ranks = buildStatsPositionalRanks(
    [qbTop, qbTie, qbUnqualified, wr, te, wrUnqualified],
    ["FPTS", "CSTY%", "INT", "paATT", "RR"],
    "2026",
    4,
  );

  assert.equal(ranks.get(qbTop)["CSTY%"], 1);
  assert.equal(ranks.get(qbTie)["CSTY%"], 1);
  assert.equal(ranks.get(qbTie).INT, 1);
  assert.equal(ranks.get(qbTop).INT, 2);
  assert.equal(ranks.get(qbTop).FPTS, undefined);
  assert.equal(ranks.get(qbTie).FPTS, undefined);
  assert.equal(ranks.get(qbUnqualified), undefined);
  assert.equal(ranks.get(wr).RR, 1);
  assert.equal(ranks.get(te).RR, 1);
  assert.equal(ranks.get(wrUnqualified), undefined);
});

test("PPG ranks require three games independently of volume, scoring exceptions and season", () => {
  for (const season of ["2025", "2026"]) {
    for (const position of ["QB", "RB", "WR", "TE"]) {
      const short = { POS: position, GM_P: "2", paATT: "1000", CAR: "1000", RR: "1000", FPTS: "100", PPG: "50" };
      const lowVolume = { POS: position, G: "3", paATT: "0", CAR: "0", RR: "0", FPTS: "30", PPG: "10" };
      const tied = { ...lowVolume, G: undefined, GP: "4", FPTS: "40" };
      const zero = { ...lowVolume, FPTS: "0", PPG: "0" };
      const negative = { ...lowVolume, FPTS: "-3", PPG: "-1" };
      const missing = { ...lowVolume, G: "NA" };
      const noValue = { ...lowVolume, PPG: "NA" };
      const ranks = buildStatsPositionalRanks([short, lowVolume, tied, zero, negative, missing, noValue], ["PPG", "paATT", "CAR", "RR"], season, 4);
      assert.equal(ranks.get(short).PPG, undefined, 'volume and high PPR scoring cannot bypass three games');
      assert.equal(ranks.get(lowVolume).PPG, 1);
      assert.equal(ranks.get(tied).PPG, 1);
      assert.equal(ranks.get(zero).PPG, 3);
      assert.equal(ranks.get(negative).PPG, 4);
      assert.equal(ranks.get(lowVolume).paATT, undefined, 'PPG eligibility does not qualify other stats');
      assert.equal(ranks.get(missing), undefined);
      assert.equal(ranks.get(noValue), undefined);
    }
  }
  assert.equal(isStatsPpgRankQualified({ __meta: { gmPlayed: 3 } }), true);
  assert.equal(isStatsPpgRankQualified({ games_played: 2 }), false);
});

test("2025 Stats ranks use full-season QB, RB, WR, and TE defaults", () => {
  const qualified = [
    { POS: "QB", paATT: "200", FPTS: "1" },
    { POS: "RB", CAR: "100", FPTS: "1" },
    { POS: "WR", RR: "220", FPTS: "1" },
    { POS: "TE", RR: "220", FPTS: "1" },
  ];
  const unqualified = [
    { POS: "QB", paATT: "199", FPTS: "99" },
    { POS: "RB", CAR: "99", FPTS: "99" },
    { POS: "WR", RR: "219", FPTS: "99" },
    { POS: "TE", RR: "219", FPTS: "99" },
  ];
  const ranks = buildStatsPositionalRanks([...qualified, ...unqualified], ["FPTS", "paATT", "CAR", "RR"], "2025");
  qualified.forEach((row) => {
    const stat = { QB: "paATT", RB: "CAR", WR: "RR", TE: "RR" }[row.POS];
    assert.equal(ranks.get(row)[stat], 1);
    assert.equal(ranks.get(row).FPTS, undefined);
  });
  unqualified.forEach((row) => assert.equal(ranks.get(row), undefined));
});
