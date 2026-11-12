const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Exercise the page-owned archive behavior without a live Sleeper account or
// exposing test hooks in the deployed LeagueHub script.
const source = fs.readFileSync(require.resolve('../DH_P2.53/scripts/leaguehub.js'), 'utf8');
function archiveContext() {
  const trades = [
    { id: 'ab-2026', participantOwnerIds: ['a', 'b'], season: '2026', assetTypes: ['player'], searchTokens: 'alpha beta receiver' },
    { id: 'ac-2026', participantOwnerIds: ['a', 'c'], season: '2026', assetTypes: ['pick'], searchTokens: 'alpha charlie first' },
    { id: 'bc-2026', participantOwnerIds: ['b', 'c'], season: '2026', assetTypes: ['player'], searchTokens: 'beta charlie quarterback' },
    { id: 'ab-2025', participantOwnerIds: ['a', 'b'], season: '2025', assetTypes: ['pick'], searchTokens: 'alpha beta first' },
    { id: 'abc-2026', participantOwnerIds: ['a', 'b', 'c'], season: '2026', assetTypes: ['player', 'pick'], searchTokens: 'alpha beta charlie receiver' },
  ];
  const currentMembers = ['a', 'b', 'c'].map(ownerId => ({ ownerId, teamName: ownerId.toUpperCase() }));
  const context = {
    state: { trades: {
      selectedMembers: [], selectedSeason: 'ALL', selectedAssetType: 'ALL', searchTerm: '', allTrades: trades,
      currentMembers, currentMemberMap: Object.fromEntries(currentMembers.map(member => [member.ownerId, member])),
    } },
    elements: { tradesAnalytics: { classList: { add() {}, remove() {} } }, tradesAnalysisHeading: {} },
    renderSelectedMemberTradeAnalytics(ownerId) { context.analytics = { member: ownerId }; },
    renderAllMemberTradeAnalytics(members) { context.analytics = { members: members.map(member => member.ownerId) }; },
  };
  vm.createContext(context);
  for (const name of ['toggleTradeMemberSelection', 'getFilteredTrades', 'getTradeRenderSides', 'renderTradeAnalytics']) {
    const start = source.indexOf(`    function ${name}(`);
    assert.notEqual(start, -1, `Production function ${name} exists`);
    const end = source.indexOf('\n    function ', start + 1);
    vm.runInContext(source.slice(start, end), context);
  }
  return context;
}
const tradeIds = context => Array.from(context.getFilteredTrades(), trade => trade.id);

test('member choices toggle, stop at two, and reset with All League Members', () => {
  const context = archiveContext();
  const selected = () => Array.from(context.state.trades.selectedMembers);
  context.toggleTradeMemberSelection('a');
  assert.deepEqual(selected(), ['a']);
  context.toggleTradeMemberSelection('b');
  context.toggleTradeMemberSelection('c');
  assert.deepEqual(selected(), ['a', 'b']);
  context.toggleTradeMemberSelection('a');
  assert.deepEqual(selected(), ['b']);
  context.toggleTradeMemberSelection('b');
  assert.deepEqual(selected(), []);
  context.toggleTradeMemberSelection('c');
  context.toggleTradeMemberSelection('ALL');
  assert.deepEqual(selected(), []);
});

test('one owner keeps all their trades; a pair requires both owners in each trade', () => {
  const context = archiveContext();
  assert.equal(tradeIds(context).length, 5);
  context.toggleTradeMemberSelection('a');
  assert.deepEqual(tradeIds(context), ['ab-2026', 'ac-2026', 'ab-2025', 'abc-2026']);
  context.toggleTradeMemberSelection('b');
  assert.deepEqual(tradeIds(context), ['ab-2026', 'ab-2025', 'abc-2026']);
  context.toggleTradeMemberSelection('a');
  assert.deepEqual(tradeIds(context), ['ab-2026', 'bc-2026', 'ab-2025', 'abc-2026']);
  context.toggleTradeMemberSelection('b');
  assert.equal(tradeIds(context).length, 5);
});

test('pair filtering composes with season, assets, and search, including no matches', () => {
  const context = archiveContext();
  Object.assign(context.state.trades, { selectedMembers: ['a', 'b'], selectedSeason: '2026', selectedAssetType: 'pick', searchTerm: '  RECEIVER  ' });
  assert.deepEqual(tradeIds(context), ['abc-2026']);
  context.state.trades.searchTerm = 'quarterback';
  assert.deepEqual(tradeIds(context), []);
  context.state.trades.searchTerm = '';
  context.state.trades.selectedSeason = '2025';
  assert.deepEqual(tradeIds(context), ['ab-2025']);
  assert.equal(context.state.trades.allTrades.length, 5);
});

test('selected owners lead the card without losing or mutating multi-team sides', () => {
  const context = archiveContext();
  const trade = { sides: ['c', 'b', 'a'].map(ownerId => ({ ownerId })) };
  context.state.trades.selectedMembers = ['a', 'b'];
  assert.deepEqual(Array.from(context.getTradeRenderSides(trade), side => side.ownerId), ['a', 'b', 'c']);
  assert.deepEqual(trade.sides.map(side => side.ownerId), ['c', 'b', 'a']);
  context.state.trades.selectedMembers = ['b'];
  assert.deepEqual(Array.from(context.getTradeRenderSides(trade), side => side.ownerId), ['b', 'c', 'a']);
});

test('analytics keeps single-member mode and limits pair insights to the two owners', () => {
  const context = archiveContext();
  context.renderTradeAnalytics();
  assert.deepEqual(context.analytics.members, ['a', 'b', 'c']);
  context.state.trades.selectedMembers = ['a'];
  context.renderTradeAnalytics();
  assert.equal(context.analytics.member, 'a');
  context.state.trades.selectedMembers = ['a', 'b'];
  context.renderTradeAnalytics();
  assert.deepEqual(Array.from(context.analytics.members), ['a', 'b']);
  assert.equal(context.elements.tradesAnalysisHeading.textContent, 'A & B');
});
