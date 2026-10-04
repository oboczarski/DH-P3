import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise both page-owned directory models from the shipped source. Fixtures
// cover traded teams, missing stats/value data, zeros, and position-specific TDs.
function model(page, fixture = {}) {
  const prefix = page === 'datahub' ? 'dataHub' : 'rosters';
  const filename = page === 'datahub' ? 'DataHub.js' : 'rosters-gamelogs.js';
  const text = fs.readFileSync(new URL(`../DH_P2.53/scripts/${filename}`, import.meta.url), 'utf8');
  const source = text.split('// TEAM DIRECTORY MODEL START')[1].split('// TEAM DIRECTORY MODEL END')[0];
  const state = {
    players: fixture.players || {}, sleeperPlayers: fixture.players || {},
    playerSeasonStats: fixture.stats || {}, currentModalSeason: '2025',
    oneQbData: fixture.values || {}, sflxData: fixture.sflx || {}, isSuperflex: Boolean(fixture.isSuperflex),
  };
  const context = vm.createContext({ state, getDataHubStatsRowsForSeason: () => fixture.rows || [],
    getActiveKtcLookup: () => fixture.isSuperflex ? fixture.sflx || {} : fixture.values || {} });
  new vm.Script(`${source}\nglobalThis.api = { players: ${prefix}TeamPlayers, stats: ${prefix}TeamStats, format: ${prefix}TeamFormat, key: ${prefix}TeamKey, columns: ${prefix}TeamStatColumns };`).runInContext(context);
  return context.api;
}

for (const page of ['datahub', 'rosters']) {
  test(`${page}: QB TD(t) includes passing and rushing; RB TD(t) includes rushing and receiving`, () => {
    const api = model(page);
    const source = { pass_td: 25, rush_td: 14, rec_td: 1 };
    assert.equal(api.stats(source, 'QB').team_total_td, 39);
    assert.equal(api.stats(source, 'RB').team_total_td, 15);
    assert.equal(api.stats({ ...source, 'TD(t)': '40' }, 'QB').team_total_td, 40);
    assert.equal(api.stats({ pass_td: 3 }, 'QB').team_total_td, null);
    assert.equal(api.stats({ rush_td: 3 }, 'RB').team_total_td, null);
    assert.equal(api.stats({ rush_td: 0, rec_td: 0 }, 'RB').team_total_td, 0);
  });
  test(`${page}: zero stats remain zero and missing stats remain unavailable`, () => {
    const api = model(page);
    assert.equal(api.format(0), '0');
    for (const value of [null, undefined, '', 'NA', '—', 'NaN']) assert.equal(api.format(value), '—');
    assert.equal(api.format(69.3, 'percent'), '69.3%');
    assert.equal(api.format(10000), '10000');
    const stats = api.stats({ games_played: 2, fpts_ppr: -2, rush_yd: 80, rec_yd: 20, rush_att: 16, pass_cmp: 20, pass_att: 25 }, 'RB');
    assert.equal(stats.ppg, -1);
    assert.equal(stats.yds_total, 100);
    assert.equal(stats.ypc, 5);
    assert.equal(stats.cmp_pct, 80);
    assert.equal(api.stats(undefined, 'RB').games_played, undefined);
  });
  test(`${page}: all team players are grouped by position, then descending KTC, including players without stats`, () => {
    const api = model(page, {
      players: {
        q: { full_name: 'Quarterback', position: 'QB', team: 'BUF' },
        r1: { full_name: 'Low value', position: 'RB', team: 'BUF' },
        r2: { full_name: 'High value', position: 'RB', team: 'BUF' },
        r3: { full_name: 'Missing value', position: 'RB', team: 'BUF' },
        r4: { full_name: 'Zero value', position: 'RB', team: 'BUF' },
        w: { full_name: 'Receiver', position: 'WR', team: 'BUF' },
        t: { full_name: 'Tight end', position: 'TE', team: 'BUF' },
        d: { full_name: 'Defender', position: 'LB', team: 'BUF' },
        other: { full_name: 'Other team', position: 'WR', team: 'NYJ' },
      }, values: { q: { ktc: 100 }, r1: { ktc: 300 }, r2: { ktc: 900, posRank: 2 }, r4: { ktc: 0 }, w: { ktc: 800 } },
      stats: { r2: { pos: 'RB', team: 'BUF', games_played: 0, fpts_ppr: 0 } },
    });
    const players = api.players('BUF');
    assert.deepEqual(Array.from(players, p => p.id), ['q', 'r2', 'r1', 'r4', 'r3', 'w', 't']);
    assert.equal(players.find(p => p.id === 'r3').stats.fpts, null);
    assert.equal(players.find(p => p.id === 'r2').stats.fpts, 0);
    assert.equal(players.find(p => p.id === 'r2').posRank, 'RB·2');
  });
  test(`${page}: season team membership wins over current metadata and aliases match`, () => {
    const api = model(page, { players: {
      traded: { position: 'WR', team: 'BUF', full_name: 'Traded player' },
      alias: { position: 'RB', team: 'JAC', full_name: 'Alias player' },
    }, stats: { traded: { pos: 'WR', team: 'WSH' }, orphan: { pos: 'TE', team: 'WAS', games_played: 3 } } });
    assert.equal(api.players('BUF').length, 0);
    assert.deepEqual(Array.from(api.players('WAS'), p => p.id).sort(), ['orphan', 'traded']);
    assert.deepEqual(Array.from(api.players('JAX'), p => p.id), ['alias']);
    assert.equal(api.key('LA'), 'LAR');
  });
  test(`${page}: labels and receiving YAC mapping match the requested contract`, () => {
    const api = model(page);
    assert.deepEqual(Array.from(api.columns.QB, c => c[0]), ['CMP%', 'paRTG', 'paYDS', 'ruYDS', 'TD(t)']);
    assert.deepEqual(Array.from(api.columns.RB, c => c[0]), ['SNP%', 'CAR', 'YPC', 'YDS(t)', 'TD(t)']);
    for (const pos of ['WR', 'TE']) {
      assert.deepEqual(Array.from(api.columns[pos], c => c[0]), ['TGT', 'REC', 'recYDS', 'recTD', 'YAC']);
      assert.equal(api.columns[pos][4][1], 'rec_yar');
    }
  });
  test(`${page}: active format KTC drives values and sorting`, () => {
    const fixture = { players: { a: { position: 'QB', team: 'BUF' }, b: { position: 'QB', team: 'BUF' } },
      values: { a: { ktc: 100 }, b: { ktc: 200 } }, sflx: { a: { ktc: 300 }, b: { ktc: 250 } }, isSuperflex: true };
    assert.deepEqual(Array.from(model(page, fixture).players('BUF'), p => p.id), ['a', 'b']);
    assert.deepEqual(Array.from(model(page, { ...fixture, isSuperflex: false }).players('BUF'), p => p.id), ['b', 'a']);
  });
}
