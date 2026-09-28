const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const A = require('../DH_P2.53/scripts/leaguehub-analysis.js');
// Exercise the production lineup builder with reordered league slots, without
// fetching data or adding a test-only browser API to the deployed page.
const source = fs.readFileSync(require.resolve('../DH_P2.53/scripts/leaguehub.js'), 'utf8');
const start = source.indexOf('    function createDerivedSlotTotals(');
const end = source.indexOf('    function formatPlayerName(', start);
const context = { SLOT_ORDER: ['QB','RB','WR','TE','FLEX','SUPER_FLEX'], POSITION_ORDER: ['QB','RB','WR','TE'], RADAR_FLEX_ELIGIBLE: ['RB','WR','TE'] };
vm.createContext(context);
vm.runInContext(source.slice(start, end), context);
const players = [
 ['q1','QB',900,300], ['q2','QB',800,250], ['q3','QB',700,210],
 ['r1','RB',600,180], ['r2','RB',500,200], ['r3','RB',400,140], ['r4','RB',300,130],
 ['w1','WR',950,220], ['w2','WR',750,190], ['w3','WR',550,170], ['w4','WR',450,160],
 ['t1','TE',650,120], ['t2','TE',350,110], ['t3','TE',250,90],
].map(([id,pos,ktc,proj])=>({id,pos,ktc,proj,name:id}));
const slots = ['FLEX','QB','RB','WR','TE','SUPER_FLEX'].map(type=>({type,label:type}));
const build = metric => context.buildDerivedLineup(players, [], slots, metric);
// Keep these source fixtures aligned with the three ranking definitions.
function team() {
 const ownedPicks = [{season:'2027',round:1,ktc:600},{season:'2028',round:2,ktc:300},{season:'2029',round:3,ktc:100}];
 const overallPositional = {QB:2400,RB:1800,WR:2700,TE:1250,Picks:1000};
 return { allPlayers: players, derivedLineups: { value:build('value'),proj:build('proj') }, ownedPicks, totalValue:9150, overallPositional };
}
test('ROS starts at current week, future seasons at one, completed seasons have none',()=>{
 assert.deepEqual(A.projectionWeeks(2026,{season:'2026',week:7,season_type:'regular'}),[7,8,9,10,11,12,13,14,15,16,17,18]);
 assert.equal(A.projectionWeeks(2027,{season:'2026',week:7,season_type:'regular'}).length,18);
 assert.equal(A.projectionWeeks(2026,{season:'2026',week:0,season_type:'pre'}).length,18);
 assert.deepEqual(A.projectionWeeks(2025,{season:'2026',week:1,season_type:'regular'}),[]);
 assert.deepEqual(A.projectionWeeks(2026,{season:'2026',week:1,season_type:'post'}),[]);
});
test('league scoring includes custom passing TDs, turnovers and TE premium exactly once',()=>{
 assert.equal(A.scoreProjection({pass_yd:250,pass_td:2,pass_int:1,pts_ppr:16},{pass_yd:.04,pass_td:6,pass_int:-2},'QB'),20);
 assert.equal(A.scoreProjection({rec:5,rec_yd:50,bonus_rec_te:5,pts_ppr:10},{rec:1,rec_yd:.1,bonus_rec_te:.5},'TE'),12.5);
 assert.equal(A.scoreProjection({rec:5,rec_yd:50,pts_ppr:10},{rec:1,rec_yd:.1,bonus_rec_te:.5},'TE'),12.5);
});
test('missing data stays null while an explicitly projected zero is valid',()=>{
 assert.equal(A.scoreProjection({gp:1,adp_ppr:99},{rec:1},'WR'),null);
 assert.equal(A.scoreProjection({pts_ppr:0},{rec:1},'WR'),0);
 assert.equal(A.scoreProjection(null,{rec:1},'WR'),null);
 assert.equal(A.sumProjections([{proj:null},{proj:20}]),null);
});
test('position slots fill before FLEX even when FLEX is first; no player is reused',()=>{
 const lineup = build('proj');
 assert.deepEqual(Array.from(lineup.assignments,slot=>slot.player.id),['w2','q1','r2','w1','t1','q2']);
 assert.equal(new Set(lineup.assignments.map(slot=>slot.player.id)).size,6);
 assert.equal(lineup.totals.proj,1280);
});
test('Dynasty and Contender choose different starters with the same existing slot rules',()=>{
 assert.equal(build('value').assignments[2].player.id,'r1');
 assert.equal(build('proj').assignments[2].player.id,'r2');
 assert.equal(build('proj').assignments[5].player.id,'q2');
});
test('Contender power adds exactly the next QB and three RB/WR/TE to starters',()=>{
 const q=A.quality(team(),'proj');
 assert.deepEqual(q.depthPlayers.map(p=>p.id),['q3','r1','w3','w4']);
 assert.equal(q.depth,720);
 assert.equal(q.overall,2000);
 assert.equal(q.overall,q.starters+q.depth);
});
test('Dynasty reserves meet positional minimums with only 2027/2028 Rounds 1-2',()=>{
 const t=team();const q=A.quality(t,'value');
 const ids=new Set(t.derivedLineups.value.assignments.map(a=>a.player.id));
 assert.deepEqual(q.depthPlayers.map(p=>p.id),['q3','w3','r2','w4','t2','r3']);
 assert.ok(q.depthPlayers.every(p=>!ids.has(p.id)));
 assert.equal(new Set(q.depthPlayers.map(p=>p.id)).size,6);
 assert.equal(q.depth,2950);
 assert.equal(q.overall,8500);assert.equal(q.picks,900);
});
// Cover the explicit Dynasty pick years and Starter Balance rank ordering,
// including projection tie-breaks, identical rank pairs, and unavailable axes.
test('Dynasty excludes 2029 firsts and seconds while full roster value retains them',()=>{
 const t=team();t.ownedPicks.push({season:'2029',round:1,ktc:800},{season:'2029',round:2,ktc:400});
 t.totalValue+=1200;t.overallPositional.Picks+=1200;
 assert.equal(A.quality(t,'value').picks,900);
 assert.equal(A.quality(t,'roster').picks,2200);
});
test('starters scatter averages ranks and resolves equal averages by projections',()=>{
 const make=(username,value,projection)=>({username,quality:{value:{starters:value},proj:{starters:projection}}});
 const rows=A.starterScatterRankings([make('C',300,300),make('A',200,100),make('B',100,200)]);
 assert.deepEqual(rows.map(row=>[row.team.username,row.rank,row.averageRank]),[['C',1,1],['B',2,2.5],['A',3,2.5]]);
});
test('starters scatter shares identical rank pairs and leaves missing projections unranked',()=>{
 const make=(username,value,projection)=>({username,quality:{value:{starters:value},proj:{starters:projection}}});
 const rows=A.starterScatterRankings([make('A',200,200),make('B',200,200),make('C',100,100),make('D',50,null)]);
 assert.deepEqual(rows.map(row=>[row.team.username,row.rank]),[['A',1],['B',1],['C',3],['D',null]]);
});
test('Total Roster Value includes all reserves and picks without adding starters or depth twice',()=>{
 const t=team();const q=A.quality(t,'roster');
 const ids=new Set(t.derivedLineups.value.assignments.map(a=>a.player.id));
 assert.equal(q.depth,players.filter(p=>!ids.has(p.id)).reduce((sum,p)=>sum+p.ktc,0));
 assert.equal(q.overall,9150);assert.equal(q.picks,1000);
 assert.equal(q.overall,q.starters+q.depth+q.picks);
});
test('Contender depth can select a TE in any of its three FLEX places',()=>{
 const bench=players.filter(p=>['q3','r3','w4','t2','t3'].includes(p.id));
 assert.deepEqual(A.selectDepth(bench,'proj').map(p=>p.id),['q3','w4','r3','t2']);
});
test('bar totals match full league scores and Starters Only excludes both depth and picks',()=>{
 const t=team();t.quality=Object.fromEntries(['value','proj','roster'].map(metric=>[metric,A.quality(t,metric)]));
 for(const metric of ['value','proj','roster']) {
  assert.equal(A.barSegments(t,metric).reduce((sum,s)=>sum+s.value,0),t.quality[metric].overall);
 }
 for(const metric of ['value','proj']) {
  const segments=A.barSegments(t,metric,true);
  assert.ok(segments.every(s=>!['Depth','Picks'].includes(s.key)));
  assert.equal(segments.reduce((sum,s)=>sum+s.value,0),t.quality[metric].starters);
 }
});
test('ties share ranks and ring fill; absent projections do not receive rank one',()=>{
 assert.equal(A.rank(100,[100,100,80]),1);assert.equal(A.rank(80,[100,100,80]),3);
 assert.equal(A.rank(null,[null,null]),null);assert.equal(A.rankFill(1,12),1);
 assert.equal(A.rankFill(12,12),1/12);assert.equal(A.rankFill(null,12),0);
});

// Forecast regressions: exercise weekly selection through the shared builder,
// probability conservation, the sixth-seed bubble and the final Week 14 rollover.
context.Analysis = A;
test('weekly optimizer replaces bye starters and allows a WR in SUPER_FLEX', () => {
 const weeklyPlayers = [
  {id:'q',pos:'QB',proj:20}, {id:'q2',pos:'QB',proj:0},
  {id:'w1',pos:'WR',proj:25}, {id:'w2',pos:'WR',proj:18},
 ].map(player=>({...player,ktc:0,name:player.id}));
 const weeklySlots = ['SUPER_FLEX','WR','QB'].map(type=>({type,label:type}));
 const first = context.buildDerivedLineup(weeklyPlayers, [], weeklySlots, 'proj', true);
 assert.deepEqual(Array.from(first.assignments,slot=>slot.player.id).sort(),['q','w1','w2']);
 assert.equal(first.totals.proj,63);
 assert.ok(first.assignments[0].player.id.startsWith('w'));
 weeklyPlayers[3].proj=0; weeklyPlayers[1].proj=22;
 const second = context.buildDerivedLineup(weeklyPlayers, [], weeklySlots, 'proj', true);
 assert.equal(second.totals.proj,67);
 assert.ok(second.assignments.some(slot=>slot.player.id==='q2'));
 const strength=A.weeklyStrength(first,weeklyPlayers);
 assert.ok(Math.abs(strength.variance-(7.51**2+2*7.81**2))<1e-9);
});
test('overlapping restricted flex slots maximize points without reusing players', () => {
 const players=[{id:'r',pos:'RB',proj:30},{id:'w',pos:'WR',proj:25},{id:'t',pos:'TE',proj:20}];
 const slots=[{type:'FLEX',eligibility:['WR','TE']},{type:'FLEX',eligibility:['WR','RB']}];
 assert.deepEqual(A.selectWeeklyStarters(players,slots).map(player=>player.id),['w','r']);
});
test('forecast weeks follow actual results and never include Week 15', () => {
 const nfl={season:'2026',week:4,season_type:'regular'};
 const league={season:'2026',settings:{start_week:1}};
 const records=n=>Array.from({length:8},()=>({settings:{wins:n,losses:0,ties:0}}));
 assert.deepEqual(A.forecastWeeks(league,nfl,records(3)),[4,5,6,7,8,9,10,11,12,13,14]);
 assert.deepEqual(A.forecastWeeks(league,nfl,records(4)),[5,6,7,8,9,10,11,12,13,14]);
 assert.deepEqual(A.forecastWeeks({...league,settings:{last_scored_leg:4}},nfl,records(3)),[4,5,6,7,8,9,10,11,12,13,14]);
 assert.deepEqual(A.forecastWeeks(league,nfl,records(13)),[14]);
 assert.deepEqual(A.forecastWeeks(league,nfl,records(14)),[]);
 assert.deepEqual(A.forecastWeeks({...league,season:'2025'},nfl,records(0)),[]);
});
function forecastFixture() {
 const teams=Array.from({length:8},(_,i)=>({teamName:`Team ${i+1}`,roster:{roster_id:i+1,settings:{wins:6,losses:6,ties:1}}}));
 const entries=teams.map((team,i)=>({roster_id:i+1,matchup_id:Math.floor(i/2)+1}));
 const strengths=Object.fromEntries(teams.map((team,i)=>[i+1,{points:i%2?160:170,variance:625}]));
 const order=teams.map(team=>String(team.roster.roster_id));
 return {teams,entries,strengths,order};
}
test('expected wins conserve games; 170 vs 160 is about 61/39, not a guaranteed win', () => {
 const f=forecastFixture();
 const rows=A.seasonOutlook(f.teams,[14],{14:f.entries},{14:f.strengths},f.order);
 const a=rows.find(row=>row.id==='1'),b=rows.find(row=>row.id==='2');
 assert.ok(Math.abs((a.projectedWins-6)-.61135)<.001);
 assert.ok(Math.abs(a.projectedWins+b.projectedWins-13)<1e-10);
 assert.ok(Math.abs(a.projectedWins+a.projectedLosses+a.ties-14)<1e-10);
 assert.equal(a.games,1);
 assert.ok(a.variance>0);
 assert.equal(a.scheduleRank,1);
 assert.equal(b.scheduleRank,5);
 assert.equal(rows.find(row=>row.seed===6).playoffProbability,.5);
 assert.ok(rows.every((row,i)=>!i||rows[i-1].playoffProbability>=row.playoffProbability));
 assert.deepEqual(A.seasonOutlook(f.teams,[14],{14:f.entries},{14:f.strengths},f.order),rows);
});
test('settled records use standings tie breaks and show no ROS rank', () => {
 const f=forecastFixture();
 const rows=A.seasonOutlook(f.teams,[],{},{},f.order);
 assert.deepEqual(rows.map(row=>row.id),f.order);
 assert.ok(rows.slice(0,6).every(row=>row.playoffProbability===1));
 assert.ok(rows.slice(6).every(row=>row.playoffProbability===0));
 assert.ok(rows.every(row=>row.scheduleRank===null&&row.projectedWins===6&&row.ties===1));
});
test('incomplete future schedule is unavailable instead of a shortened projection', () => {
 const f=forecastFixture();
 assert.throws(()=>A.seasonOutlook(f.teams,[14],{14:[]},{14:f.strengths},f.order),/schedule/);
 assert.throws(()=>A.seasonOutlook(f.teams,[14],{14:f.entries.map(row=>({...row,matchup_id:null}))},{14:f.strengths},f.order),/scheduled/);
});
