import test from "node:test";
import assert from "node:assert/strict";
import { buildStatsPositionalRanks } from "../DH_P2.53/scripts/datahub-stats-positional-ranks.js";

test("2026 Stats ranks use default volume gates and keep WR and TE separate", () => {
  const qbTop = { POS: "QB", paATT: "80", "CSTY%": "80%", INT: "5", FPTS: "60" };
  const qbTie = { POS: "QB", paATT: "64", "CSTY%": "80%", INT: "2", FPTS: "50" };
  const qbUnqualified = { POS: "QB", paATT: "63", "CSTY%": "99%", INT: "0", FPTS: "100" };
  const wr = { POS: "WR", RR: "52", FPTS: "35" };
  const te = { POS: "TE", RR: "52", FPTS: "20" };
  const wrUnqualified = { POS: "WR", RR: "51", FPTS: "90" };
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
