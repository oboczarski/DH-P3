import test from 'node:test';
import assert from 'node:assert/strict';
import { get2026QualifierOptions as options, is2026RankQualified } from '../DH_P2.53/scripts/datahub-stats-season.js';

test('season ranking pools use position defaults and exclude players below the boundary', () => {
  for (const [pos, stat, minimum] of [['QB','paATT',16], ['RB','CAR',5], ['WR','RR',13], ['TE','RR',13]]) {
    assert.equal(is2026RankQualified({ POS: pos, [stat]: minimum - 1, FPTS: 1000 }), false);
    assert.equal(is2026RankQualified({ POS: pos, [stat]: minimum }), true);
    assert.equal(is2026RankQualified({ POS: pos, [stat]: minimum }, 2), false);
    assert.equal(is2026RankQualified({ POS: pos, [stat]: minimum * 2 }, 2), true);
    assert.equal(is2026RankQualified({ POS: pos, [stat]: 'NA' }), false);
  }
});

test('volume qualifiers scale every option and preserve the selected default through Week 18', () => {
  const expected = {
    RR: { values: [26, 22, 17, 13, 11], defaultValue: 13 },
    TGT: { values: [6, 5, 4, 3], defaultValue: 5 },
    CAR: { values: [10, 8, 5, 4, 2], defaultValue: 5 },
    paATT: { values: [20, 16, 10, 5], defaultValue: 16 },
    DB: { values: [26, 21, 16], defaultValue: 26 },
  };
  for (const [stat, { values, defaultValue }] of Object.entries(expected)) {
    for (let week = 1; week <= 18; week++) {
      const choices = options(stat, week);
      assert.deepEqual(choices.map((choice) => choice.threshold), values.map((value) => value * week));
      assert.equal(choices.find((choice) => choice.isDefault).threshold, defaultValue * week);
      assert.deepEqual(choices.map((choice) => choice.value), options(stat, 1).map((choice) => choice.value));
    }
  }
});

test('GM_P has three distinct tiers and follows every supplied weekly schedule', () => {
  const schedules = {
    high: [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    middle: [1, 1, 1, 2, 2, 2, 4, 4, 4, 4, 6, 6, 6, 9, 9, 9, 9, 9],
    low: [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4],
  };
  for (let week = 1; week <= 18; week++) {
    const choices = options('GM_P', week);
    assert.deepEqual(choices.map((choice) => choice.value), ['high', 'middle', 'low']);
    assert.equal(choices.find((choice) => choice.isDefault).value, 'middle');
    for (const choice of choices) assert.equal(choice.threshold, schedules[choice.value][week - 1]);
  }
});

test('snap percentages and their default never change with loaded weeks', () => {
  for (let week = 1; week <= 18; week++) {
    assert.deepEqual(options('SNP%', week).map((choice) => choice.label), ['70%', '60%', '50%', '40%', '30%']);
    assert.equal(options('SNP%', week).find((choice) => choice.isDefault).threshold, 70);
  }
});
