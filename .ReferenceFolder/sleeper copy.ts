import { SleeperUser, SleeperLeague, SleeperRoster, SleeperMatchup, TrophyResult, LeaguePlacement } from '../types';

const BASE_URL = 'https://api.sleeper.app/v1';

export const fetchUser = async (username: string): Promise<SleeperUser | null> => {
  try {
    const response = await fetch(`${BASE_URL}/user/${username}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error("Error fetching user", e);
    return null;
  }
};

export const fetchLeaguesForSeason = async (userId: string, season: string): Promise<SleeperLeague[]> => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/leagues/nfl/${season}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    console.error(`Error fetching leagues for ${season}`, e);
    return [];
  }
};

export const fetchLeagueDetails = async (leagueId: string) => {
  try {
    const [rostersRes, bracketRes, losersBracketRes] = await Promise.allSettled([
      fetch(`${BASE_URL}/league/${leagueId}/rosters`),
      fetch(`${BASE_URL}/league/${leagueId}/winners_bracket`),
      fetch(`${BASE_URL}/league/${leagueId}/losers_bracket`)
    ]);

    const rosters: SleeperRoster[] =
      rostersRes.status === 'fulfilled' && rostersRes.value.ok ? await rostersRes.value.json() : [];
    const bracket: SleeperMatchup[] =
      bracketRes.status === 'fulfilled' && bracketRes.value.ok ? await bracketRes.value.json() : [];
    const losersBracket: SleeperMatchup[] =
      losersBracketRes.status === 'fulfilled' && losersBracketRes.value.ok ? await losersBracketRes.value.json() : [];

    return { rosters, bracket, losersBracket };
  } catch (e) {
    console.error(`Error fetching league details for ${leagueId}`, e);
    return { rosters: [], bracket: [], losersBracket: [] };
  }
};

const formatRecord = (roster: SleeperRoster) => {
  const { wins, losses, ties } = roster.settings;
  if (ties && ties > 0) return `${wins}-${losses}-${ties}`;
  return `${wins}-${losses}`;
};

const getRosterPlacement = (userRoster: SleeperRoster, rosters: SleeperRoster[]) => {
  // Fallback: standings (or computed standings if rank is missing).
  const parsedRank = Number(userRoster.settings.rank);
  if (Number.isFinite(parsedRank) && parsedRank > 0) return parsedRank;

  const sorted = [...rosters].sort((a, b) => {
    const aWins = a.settings.wins ?? 0;
    const bWins = b.settings.wins ?? 0;
    if (bWins !== aWins) return bWins - aWins;

    const aTies = a.settings.ties ?? 0;
    const bTies = b.settings.ties ?? 0;
    if (bTies !== aTies) return bTies - aTies;

    const aPoints = a.settings.fpts ?? 0;
    const bPoints = b.settings.fpts ?? 0;
    return bPoints - aPoints;
  });

  const index = sorted.findIndex(r => r.roster_id === userRoster.roster_id);
  return index >= 0 ? index + 1 : null;
};

const getBracketPlacement = (
  rosterId: number,
  rosters: SleeperRoster[],
  winnersBracket: SleeperMatchup[] = [],
  losersBracket: SleeperMatchup[] = []
) => {
  const collectRosterIds = (matches: SleeperMatchup[]) => {
    const ids = new Set<number>();
    matches.forEach(m => {
      const candidates = [m.t1, m.t2, m.w, m.l];
      candidates.forEach((id) => {
        if (typeof id === 'number' && Number.isFinite(id)) ids.add(id);
      });
    });
    return ids;
  };

  const winnersIds = collectRosterIds(winnersBracket);
  const losersIds = collectRosterIds(losersBracket);
  const hasOverlap = (() => {
    for (const id of losersIds) {
      if (winnersIds.has(id)) return true;
    }
    return false;
  })();

  const losersPValues = losersBracket
    .map(m => m.p)
    .filter((p): p is number => typeof p === 'number' && Number.isFinite(p));
  const maxLosersP = losersPValues.length > 0 ? Math.max(...losersPValues) : 0;
  let losersOffset = 0;
  if (losersBracket.length > 0 && !hasOverlap) {
    const losersTeamCount = losersIds.size;
    const inferredOffset = Math.max(0, rosters.length - losersTeamCount);

    // If `p` values look like absolute league placements (e.g. 9/11/13), don't offset.
    // If `p` values look relative to the consolation bracket (e.g. 1/3/5), offset by how many teams are not in that bracket.
    losersOffset = maxLosersP > losersTeamCount ? 0 : inferredOffset;
  }

  const placements = new Map<number, number>();

  // The `p` field indicates the finishing position awarded to the winner of that matchup.
  // The loser is the next position (p + 1). This is consistent for 1/2, 3/4, 5/6, etc.
  const applyPlacementMatches = (matches: SleeperMatchup[], offset: number, skipExisting = false) => {
    matches.forEach(m => {
      if (typeof m.p !== 'number' || !Number.isFinite(m.p)) return;
      if (typeof m.w === 'number' && Number.isFinite(m.w)) {
        if (!skipExisting || !placements.has(m.w)) placements.set(m.w, m.p + offset);
      }
      if (typeof m.l === 'number' && Number.isFinite(m.l)) {
        if (!skipExisting || !placements.has(m.l)) placements.set(m.l, m.p + 1 + offset);
      }
    });
  };

  applyPlacementMatches(winnersBracket, 0);
  applyPlacementMatches(losersBracket, losersOffset, true);

  return placements.get(rosterId) ?? null;
};

export const getUserLeaguePlacement = (
  userId: string,
  league: SleeperLeague,
  rosters: SleeperRoster[],
  winnersBracket: SleeperMatchup[] = [],
  losersBracket: SleeperMatchup[] = []
): LeaguePlacement | null => {
  const userRoster = rosters.find(r =>
    r.owner_id === userId || (r.co_owners && r.co_owners.includes(userId))
  );

  if (!userRoster) return null;

  const standingsRank = getRosterPlacement(userRoster, rosters);
  if (!standingsRank) return null;

  // Prefer true playoff-bracket finish when we can infer it from placement matches.
  // Sleeper brackets expose placement games via `p` (e.g., p=1 decides 1st/2nd; p=3 decides 3rd/4th; p=5 decides 5th/6th, etc.).
  const bracketPlacement = getBracketPlacement(userRoster.roster_id, rosters, winnersBracket, losersBracket);
  const finalPlacement = bracketPlacement ?? standingsRank;

  return {
    leagueId: league.league_id,
    leagueName: league.name,
    season: league.season,
    placement: finalPlacement,
    previousLeagueId: league.previous_league_id ?? null,
    bracketPlacement,
    standingsRank,
    totalTeams: rosters.length,
    record: formatRecord(userRoster),
    points: userRoster.settings.fpts || 0,
    avatar: league.avatar
  };
};

export const analyzeLeaguePerformance = (
  userId: string,
  league: SleeperLeague,
  rosters: SleeperRoster[],
  bracket: SleeperMatchup[]
): TrophyResult | null => {
  // 1. Find user's roster (checking both owner_id and co_owners)
  const userRoster = rosters.find(r => 
    r.owner_id === userId || (r.co_owners && r.co_owners.includes(userId))
  );

  if (!userRoster) return null;

  // 2. If no bracket, we skip (Best Ball/Points only leagues are harder to determine podium without settings parsing)
  if (!bracket || bracket.length === 0) return null;

  // 3. Find the "Final Round" in the bracket
  const maxRound = Math.max(...bracket.map(m => m.r));
  
  // 4. Find matches in the final round involving the user
  const finalMatches = bracket.filter(m => m.r === maxRound);
  
  const userMatch = finalMatches.find(m => m.t1 === userRoster.roster_id || m.t2 === userRoster.roster_id);

  if (!userMatch) {
    // User didn't make it to the final round of the winners bracket.
    // They might have been eliminated earlier.
    return null;
  }

  // 5. Determine if this match is for 1st/2nd or 3rd/4th
  
  let isChampionshipMatch = false;
  let isThirdPlaceMatch = false;

  // Use 'p' (position) if available as it's the most reliable indicator
  // p: 1 indicates the winner takes 1st place (Championship match)
  // p: 3 indicates the winner takes 3rd place (3rd Place match)
  if (userMatch.p === 1) {
    isChampionshipMatch = true;
  } else if (userMatch.p === 3) {
    isThirdPlaceMatch = true;
  } else {
    // Fallback logic if 'p' is missing (older leagues or non-standard)
    // Championship match sources usually come from 'w' (winners of previous round).
    // 3rd place match sources usually come from 'l' (losers of previous round).
    const userIsT1 = userMatch.t1 === userRoster.roster_id;
    const source = userIsT1 ? userMatch.t1_from : userMatch.t2_from;

    if (source) {
      if (source.w) isChampionshipMatch = true;
      if (source.l) isThirdPlaceMatch = true;
    } else {
      // Fallback logic if sources aren't clear (e.g. 2 team playoff)
      // If there is only 1 match in the max round, it's the finals.
      if (finalMatches.length === 1) {
        isChampionshipMatch = true;
      }
    }
  }

  const record = `${userRoster.settings.wins}-${userRoster.settings.losses}`;
  const points = userRoster.settings.fpts || 0;

  if (isChampionshipMatch) {
    if (userMatch.w === userRoster.roster_id) {
      return { leagueId: league.league_id, leagueName: league.name, season: league.season, rank: 1, record, points, avatar: league.avatar };
    }
    if (userMatch.l === userRoster.roster_id) {
      return { leagueId: league.league_id, leagueName: league.name, season: league.season, rank: 2, record, points, avatar: league.avatar };
    }
  }

  if (isThirdPlaceMatch) {
    if (userMatch.w === userRoster.roster_id) {
      return { leagueId: league.league_id, leagueName: league.name, season: league.season, rank: 3, record, points, avatar: league.avatar };
    }
  }

  return null;
};
