import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import Rosters from '../DH_P2.53/rosters/matchup-breakdown/model.js';
import { load2026MatchupSources } from '../DH_P2.53/matchups/data/2026-sheets.js';

const Matchups = createRequire(import.meta.url)('../DH_P2.53/matchups/data-model.js');
const read = path => fs.readFileSync(new URL(`../DH_P2.53/${path}`, import.meta.url), 'utf8');
const slice = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const fpa = 'WK,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,VS\n1,1,Quarter,QB,BUF,12.5,@ JAX\n2,1,Quarter,QB,BUF,0,vs BAL\n1,2,Runner,RB,BUF,-1,@ JAX';
const details = 'WK,SLPR_ID,POS,TM,VS,paATT,CMP,CMP%,paYDS,paTD,paRTG,CAR,ruYDS,YPC,TD(t),REC,TGT,recYDS,recTD,YAC,YDS(t),OPP,FPT_PPR\n'
  + '1,1,QB,BUF,@ JAC,29,20,69.0%,334,2,130.50,6,23,3.83,4,0,0,0,0,0,357,35,999\n'
  + '2,1,QB,BUF,vs BAL,0,0,NA,-5,0,,0,0,0,0,0,0,0,0,0,-5,0,999\n'
  + '1,2,RB,BUF,@ JAX,0,0,0%,0,0,0,10,-4,-0.4,0,3,4,20,0,12,16,14,999\n'
  + '13,1,QB,BUF,@ JAX,99,99,100%,999,9,158.3,0,0,0,9,0,0,0,0,0,999,99,999';

// Use the existing chart controllers as the scoring-zone oracle so boundary
// checks catch future drift between the chart rules and both owned tables.
const consistencyReferences = [
  ['scripts/rosters-gamelogs-consistency.js', 'ROSTERS', 'Rosters', '// Install only'],
  ['scripts/DataHub.js', 'DATAHUB', 'DataHub', '// DataHub ownership league filtering:'],
].map(([path, prefix, name, end]) => {
  const source = read(path), context = vm.createContext({});
  vm.runInContext(
    slice(source, `const ${prefix}_CONSISTENCY_THRESHOLD_MAP =`, `const ${prefix}_MAX_CONSISTENCY_POINTS`)
      + slice(source, `const ${prefix}_CONSISTENCY_BUCKET_STYLES =`, `const ${prefix}_CONSISTENCY_HUD_CONDITIONAL_COLORS`)
      + slice(source, `function get${name}ConsistencyThresholds(`, `function render${name}ConsistencyZoneSummary(`)
      + slice(source, `function get${name}ConsistencyBucket(`, end), context);
  return { thresholds: pos => context[`get${name}ConsistencyThresholds`](pos),
    bucket: (value, thresholds) => context[`get${name}ConsistencyBucket`](value, thresholds) };
});

for (const [name, Data] of [['Matchups', Matchups], ['Rosters', Rosters]]) {
  test(`${name}: exact-game box scores preserve FPA ownership, aliases, zeros, negatives and missing cells`, () => {
    const model = Data.readSource(fpa), audit = structuredClone(model.audit);
    Data.attachPlayerStats(model, details);
    assert.equal(model.results.length, 3, 'a supplemental future game never creates a result');
    assert.deepEqual(model.audit, audit);
    assert.equal(model.results[0].pts, 12.5, 'the conflicting box-score FPTS cell cannot replace FPA');
    assert.equal(model.results[0].stats.PAYDS, 334);
    assert.equal(model.results[0].stats['CMP%'], 69);
    assert.equal(model.results[1].stats.PAATT, 0);
    assert.equal(model.results[1].stats.PAYDS, -5);
    assert.equal(model.results[1].stats['CMP%'], null);
    assert.equal(model.results[1].stats.PARTG, null);
    assert.equal(model.results[2].stats.RUYDS, -4);
    assert.equal(model.results[2].stats['TD(T)'], 0);
    assert.equal(model.maxWeek, 2);
  });
  test(`${name}: wrong team, position, venue, week, opponent and duplicate details remain unavailable`, () => {
    const header = details.split('\n')[0], row = details.split('\n')[1];
    for (const changed of [row.replace(',BUF,', ',CIN,'), row.replace(',QB,', ',RB,'), row.replace('@ JAC', 'vs JAC'),
      row.replace(/^1,/, '3,'), row.replace('@ JAC', '@ BAL'), `${row}\n${row}`]) {
      const model = Data.attachPlayerStats(Data.readSource(fpa), `${header}\n${changed}`);
      assert.equal(model.results[0].stats, null);
    }
  });
}

for (const path of ['matchups/app.js', 'rosters/matchup-breakdown/modal.js']) {
  const source = read(path);
  const state = { team: 'JAX', pos: 'QB', playerSort: { key: 'week', direction: 'desc' } };
  const model = Matchups.attachPlayerStats(Matchups.readSource(fpa), details);
  const ctx = vm.createContext({ state, model, Data: Matchups, esc: String, logo: () => '',
    fmt: (value, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—',
    weekLabel: () => 'All weeks', venueLabel: () => 'All games', empty: () => 'Empty' });
  vm.runInContext(slice(source, '  function selectedPlayers()', '  function renderPlayers()'), ctx);
  test(`${path}: active view determines exact columns, including mixed-position ALL`, () => {
    const expected = {
      QB: ['paATT/CMP', 'CMP%', 'paYDS', 'paTD', 'paRTG'],
      RB: ['CAR', 'ruYDS', 'YPC', 'TD(t)', 'REC', 'TGT', 'recYDS'],
      WR: ['TGT', 'REC', 'recYDS', 'recTD', 'YAC'], TE: ['TGT', 'REC', 'recYDS', 'recTD', 'YAC'],
      ALL: ['YDS(t)', 'TD(t)', 'OPP', 'REC'],
    };
    for (const [pos, labels] of Object.entries(expected)) {
      state.pos = pos;
      const html = ctx.playersTable(model.results);
      assert.deepEqual([...html.matchAll(/data-player-sort="[^"]+"[^>]*>([^<]+)/g)].map(match => match[1]), ['Wk', 'Player', 'TM', 'Site', 'PPR', ...labels]);
      assert.equal((html.match(/class="statColumn"/g) || []).length, labels.length * 4);
      assert.match(html, /class="playerOpponent">@ JAX</);
      assert.match(html, /class="playerOpponent">BUF</);
      assert.match(ctx.playersTable([]), new RegExp(`colspan="${labels.length + 5}"`));
    }
    state.pos = 'RB';
    const rbBody = ctx.playersTable([model.results[2]]).split('<tbody>')[1];
    const rbCells = [...rbBody.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(match => match[1].replace(/<[^>]+>/g, ''));
    assert.deepEqual(rbCells, ['W1', 'Runner', 'BUF', '@ JAX', '-1.0', '10', '-4', '-0.40', '0', '3', '4', '20']);
    state.pos = 'QB';
    assert.match(ctx.playersTable([model.results[0]]), />29\/20</);
    assert.match(ctx.playersTable([model.results[0]]), />69\.0%</);
    state.pos = 'ALL';
    assert.doesNotMatch(ctx.playersTable(model.results), /paYDS|CAR|YPC|recYDS|paATT/);
  });
  test(`${path}: PPR tiers match both Consistency charts at raw-score boundaries and use each row's position in ALL`, () => {
    for (const view of ['QB', 'RB', 'WR', 'TE', 'ALL']) {
      state.pos = view;
      for (const pos of ['QB', 'RB', 'WR', 'TE']) {
        const { solid, high } = consistencyReferences[0].thresholds(pos);
        for (const pts of [-2, 0, solid - 0.01, solid, high - 0.01, high, 45]) {
          const row = { ...model.results[0], pos, pts, cents: Math.round(pts * 100) };
          for (const reference of consistencyReferences) {
            const expected = reference.bucket(pts, reference.thresholds(pos)).name;
            assert.equal(ctx.playerPprTier(row), expected, `${view} view / ${pos} / ${pts}`);
            assert.match(ctx.playersTable([row]), new RegExp(`class="scoreColumn" data-ppr-tier="${expected}"`));
          }
        }
      }
    }
    for (const pts of [undefined, null, NaN, Infinity, '18']) assert.equal(ctx.playerPprTier({ pos: 'RB', pts }), '');
    for (const pos of [undefined, 'ALL', 'K']) assert.equal(ctx.playerPprTier({ pos, pts: 20 }), '');
  });
  test(`${path}: numeric stat sorting keeps unavailable last in either direction`, () => {
    state.pos = 'ALL'; state.team = 'JAX';
    model.results[0].stats.OPP = null;
    for (const direction of ['asc', 'desc']) {
      state.playerSort = { key: 'OPP', direction };
      assert.deepEqual(Array.from(ctx.selectedPlayers(), row => row.player), ['Runner', 'Quarter']);
    }
  });
}

test('supplemental feed failures are isolated from the three required live matchup feeds', async () => {
  const fetchImpl = async url => {
    if (new URL(url).searchParams.get('sheet') === 'AllWKs') throw new Error('offline');
    return { ok: true, text: async () => fpa };
  };
  const sources = await load2026MatchupSources({ fetchImpl });
  assert.equal(sources.playerStats.csv, null);
  assert.match(sources.playerStats.error, /offline/);
  assert.equal(sources.weekly.csv, fpa);
});

// Exercise actual profile badge rendering with a minimal heading DOM. This
// catches stale injury badges after healthy/player switches without UI mocks
// that simply repeat the implementation's expected markup.
for (const surface of ['rosters', 'datahub']) {
  test(`${surface}: current injury appends after the name and clears on player changes`, () => {
    let injury = { designation: 'Q', color: '#fd9a3dff' }, badge = null;
    const heading = { textContent: 'Player', querySelector: () => badge,
      append(node) { badge = node; } };
    const context = vm.createContext({ find: () => heading,
      getSleeperInjuryDesignation: () => injury, getInjuryDesignation: () => injury,
      INJURY_DESIGNATION_COLORS: { Q: '#fd9a3dff', IR: '#d93d76' },
      document: { createElement: () => ({ style: {}, setAttribute() {}, remove() { badge = null; } }) } });
    const code = read(`scripts/${surface}-gamelogs-profile.js`);
    vm.runInContext(slice(code, '  function renderProfileName(', '  function resetSchedule('), context);
    context.renderProfileName({ id: '1' }, 'Injured Player');
    assert.equal(heading.textContent, 'Injured Player');
    assert.equal(badge.textContent, 'Q');
    assert.equal(badge.style.color, '#fd9a3dff');
    injury = { designation: 'IR', color: '#d93d76' };
    context.renderProfileName({ id: '2' }, 'Other Player');
    assert.equal(badge.textContent, 'IR');
    injury = null;
    context.renderProfileName({ id: '3' }, 'Healthy Player');
    assert.equal(badge, null);
    assert.equal(heading.textContent, 'Healthy Player');
  });
}
