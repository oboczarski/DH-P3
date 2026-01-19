import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { fetchUser, fetchLeaguesForSeason, fetchLeagueDetails, analyzeLeaguePerformance, getUserLeaguePlacement } from './services/sleeper';
import { TrophyResult, SleeperUser, LoadingState, SeasonStats, LeaguePlacement } from './types';
import { TrophyCard } from './components/TrophyCard';
import { PlacementCard } from './components/PlacementCard';
import { Sidebar } from './components/Sidebar';
import { CircularProgress } from './components/CircularProgress';
import { IconSearch, IconLoader, IconTrophy, IconCrown, IconMedal, IconActivity } from './components/Icons';
import { HomePage } from './components/HomePage';
import { Award, Camera, ChevronDown, CalendarRange, CalendarSync, Focus, Fullscreen, Gem, Hexagon, House, Maximize, Orbit } from 'lucide-react';
import dhLogo from './Logo/gold_icon-256_dh-logo.png';
import { DYNASTY_HUB_MAIN_APP_URL } from './constants';

const currentYear = new Date().getFullYear();
const END_YEAR = currentYear - 1;

type ParsedUserRoute = {
	username: string | null;
	// Canonical, shareable URL for the user (includes Vite BASE_URL prefix if any).
	canonicalUrl: string | null;
};

const appBase = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
const addBase = (path: string) => `${appBase}${path.startsWith('/') ? path : `/${path}`}` || '/';
const stripBase = (pathname: string) => {
	if (!appBase) return pathname || '/';
	if (pathname?.startsWith(appBase)) return pathname.slice(appBase.length) || '/';
	return pathname || '/';
};

// Query-param URL is the most reliable share format for static hosts (no SPA rewrite needed).
const buildUserUrl = (name: string) => addBase(`/?user=${encodeURIComponent(name)}`);

const TwoDotTruncatedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
	const containerRef = useRef<HTMLSpanElement | null>(null);
	const measureRef = useRef<HTMLSpanElement | null>(null);
	const [displayText, setDisplayText] = useState(text);

	const compute = useCallback(() => {
		const containerEl = containerRef.current;
		const measureEl = measureRef.current;
		if (!containerEl || !measureEl) return;

		const maxWidth = containerEl.clientWidth;
		if (maxWidth <= 0) {
			setDisplayText((prev) => (prev === text ? prev : text));
			return;
		}

		measureEl.textContent = text;
		if (measureEl.scrollWidth <= maxWidth) {
			setDisplayText((prev) => (prev === text ? prev : text));
			return;
		}

		const suffix = '..';
		let low = 0;
		let high = text.length;

		while (low < high) {
			const mid = Math.ceil((low + high) / 2);
			measureEl.textContent = `${text.slice(0, mid)}${suffix}`;
			if (measureEl.scrollWidth <= maxWidth) {
				low = mid;
			} else {
				high = mid - 1;
			}
		}

		const next = low > 0 ? `${text.slice(0, low)}${suffix}` : suffix;
		setDisplayText((prev) => (prev === next ? prev : next));
	}, [text]);

	useLayoutEffect(() => {
		compute();
	}, [compute]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => compute());
		ro.observe(el);
		return () => ro.disconnect();
	}, [compute]);

	return (
		<>
			<span ref={containerRef} className={className} title={text}>
				{displayText}
			</span>
			<span
				ref={measureRef}
				className="md:hidden fixed left-[-9999px] top-0 whitespace-nowrap pointer-events-none opacity-0 select-none"
				aria-hidden="true"
			/>
		</>
	);
};

const parseUserRoute = (pathname: string, search: string, hash: string): ParsedUserRoute => {
	const rawPath = stripBase(pathname).replace(/\/+$/, '') || '/';
	const pathMatch = rawPath.match(/(?:^|\/)user\/([^/]+)$/i);
	if (pathMatch?.[1]) {
		const decoded = (() => {
			try {
				return decodeURIComponent(pathMatch[1]);
			} catch {
				return pathMatch[1];
			}
		})();
		const username = decoded.trim();
		return username ? { username, canonicalUrl: buildUserUrl(username) } : { username: null, canonicalUrl: null };
	}

	const params = new URLSearchParams(search);
	const queryUsername = (params.get('user') || params.get('username') || params.get('u') || '').trim();
	if (queryUsername) return { username: queryUsername, canonicalUrl: buildUserUrl(queryUsername) };

	// Support simple `/username` share links (no nested segments).
	const singleSegment = rawPath.match(/^\/([^/]+)$/);
	if (singleSegment?.[1]) {
		const seg = (() => {
			try {
				return decodeURIComponent(singleSegment[1]);
			} catch {
				return singleSegment[1];
			}
		})();
		const username = seg.trim();
		const usernameLower = username.toLowerCase();
		if (username && usernameLower !== 'user' && !username.includes('.')) {
			return { username, canonicalUrl: buildUserUrl(username) };
		}
	}

	const hashValue = (hash || '').replace(/^#/, '');
	// Support hash-based share links as well (e.g. `/#/user/name` or `/#?user=name`).
	const hashQuery = (() => {
		if (!hashValue) return '';
		if (hashValue.startsWith('?')) return hashValue;
		if (hashValue.includes('?')) return `?${hashValue.split('?')[1] ?? ''}`;
		if (hashValue.includes('=')) return `?${hashValue}`;
		return '';
	})();
	const hashParams = new URLSearchParams(hashQuery);
	const hashUsername = (hashParams.get('user') || hashParams.get('username') || hashParams.get('u') || '').trim();
	if (hashUsername) return { username: hashUsername, canonicalUrl: buildUserUrl(hashUsername) };

	const hashPath = hashValue.startsWith('/') ? hashValue : `/${hashValue}`;
	const hashMatch = hashPath.replace(/\/+$/, '').match(/(?:^|\/)user\/([^/]+)$/i);
	if (hashMatch?.[1]) {
		const decoded = (() => {
			try {
				return decodeURIComponent(hashMatch[1]);
			} catch {
				return hashMatch[1];
			}
		})();
		const username = decoded.trim();
		return username ? { username, canonicalUrl: buildUserUrl(username) } : { username: null, canonicalUrl: null };
	}

	return { username: null, canonicalUrl: null };
};

const App: React.FC = () => {
	const [routeUsername, setRouteUsername] = useState<string | null>(() => {
		if (typeof window === 'undefined') return null;
		return parseUserRoute(window.location.pathname, window.location.search, window.location.hash).username;
	});
	const [username, setUsername] = useState(() => routeUsername ?? '');
	const [user, setUser] = useState<SleeperUser | null>(null);
	const [loadingState, setLoadingState] = useState<LoadingState>(() =>
		routeUsername ? LoadingState.FETCHING_USER : LoadingState.IDLE
	);
	const [progress, setProgress] = useState(0);
	const [results, setResults] = useState<TrophyResult[]>([]);
	const [seasonStats, setSeasonStats] = useState<SeasonStats[]>([]);
	const [leaguePlacements, setLeaguePlacements] = useState<LeaguePlacement[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [mobileView, setMobileView] = useState<'seasons' | 'career'>('career');
	const [screenshotMenuOpen, setScreenshotMenuOpen] = useState(false);
	const screenshotMenuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!screenshotMenuOpen) return;

		const onPointerDown = (event: PointerEvent) => {
			const el = screenshotMenuRef.current;
			if (!el) return;
			if (event.target instanceof Node && !el.contains(event.target)) {
				setScreenshotMenuOpen(false);
			}
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setScreenshotMenuOpen(false);
		};

		window.addEventListener('keydown', onKeyDown);
		// Use capture so this works even if other handlers stop propagation.
		document.addEventListener('pointerdown', onPointerDown, true);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('pointerdown', onPointerDown, true);
		};
	}, [screenshotMenuOpen]);

	const fetchHistoryForUsername = useCallback(
		async (
			rawUsername: string,
			options?: { updateUrl?: boolean; urlMode?: 'push' | 'replace' }
		) => {
			const trimmed = rawUsername.trim();
			if (!trimmed) return;

			setUsername(trimmed);
			setRouteUsername(trimmed);

			const shouldUpdateUrl = options?.updateUrl !== false;
			const urlMode = options?.urlMode ?? 'push';
			if (shouldUpdateUrl && typeof window !== 'undefined') {
				const nextUrl = buildUserUrl(trimmed);
				if (urlMode === 'replace') window.history.replaceState({}, '', nextUrl);
				else window.history.pushState({}, '', nextUrl);
			}

			setMobileView('career');
			setLoadingState(LoadingState.FETCHING_USER);
			setError(null);
			setResults([]);
			setSeasonStats([]);
			setLeaguePlacements([]);
			setProgress(0);

			const userData = await fetchUser(trimmed);
			if (!userData) {
				setError(`We couldn't find a Sleeper user named "${trimmed}". Check the spelling and try again.`);
				setLoadingState(LoadingState.ERROR);
				return;
			}
			setUser(userData);

			setLoadingState(LoadingState.FETCHING_LEAGUES);

			// 1. Fetch leagues by season.
			// NOTE: Do not hardcode an "earliest year" (users can have older league history).
			// We scan backward from the last completed season until we've gone far enough back
			// that earlier seasons are overwhelmingly unlikely to exist.
			const leaguesByYear: Record<string, any[]> = {};
			const stats: SeasonStats[] = [];

			let processedYears = 0;
			let foundAnyDynasty = false;
			let emptyStreakAfterHit = 0;
			const EMPTY_STREAK_STOP = 30;
			const NO_HIT_LOOKBACK_STOP = 80;

			for (let y = END_YEAR; y >= 0; y--) {
				const year = String(y);
				const allLeagues = await fetchLeaguesForSeason(userData.user_id, year);

				// --- DYNASTY FILTER ---
				// Sleeper settings.type: 2 is Dynasty. 0 is Redraft, 1 is Keeper.
				const dynastyLeagues = allLeagues.filter((l) => l.settings.type === 2);

				leaguesByYear[year] = dynastyLeagues;
				stats.push({
					year,
					totalLeagues: dynastyLeagues.length,
					gold: 0,
					silver: 0,
					bronze: 0,
				});

				processedYears++;
				// We don't know the full scan length up-front; ramp the first stage to 20% over ~20 seasons.
				setProgress(Math.min(20, Math.round((processedYears / 20) * 20)));

				if (dynastyLeagues.length > 0) {
					foundAnyDynasty = true;
					emptyStreakAfterHit = 0;
				} else if (foundAnyDynasty) {
					emptyStreakAfterHit++;
					if (emptyStreakAfterHit >= EMPTY_STREAK_STOP) break;
				} else {
					// Safety valve: if we can't find ANY dynasty leagues after a very deep lookback,
					// assume the user either has no dynasty leagues or Sleeper doesn't have data.
					if (processedYears >= NO_HIT_LOOKBACK_STOP) break;
				}
			}

			if (!foundAnyDynasty) {
				setError(
					`No dynasty leagues found for "${trimmed}" in the last ${NO_HIT_LOOKBACK_STOP} seasons. ` +
						`If you believe your dynasty history is older than that, let me know and we can make the scan deeper.`
				);
				setLoadingState(LoadingState.ERROR);
				return;
			}

			setLoadingState(LoadingState.ANALYZING);

			const analyzedResults: TrophyResult[] = [];
			const placements: LeaguePlacement[] = [];
			const allLeaguesFlat = Object.values(leaguesByYear).flat();
			const totalLeaguesToAnalyze = allLeaguesFlat.length;

			const BATCH_SIZE = 5;
			for (let i = 0; i < totalLeaguesToAnalyze; i += BATCH_SIZE) {
				const batch = allLeaguesFlat.slice(i, i + BATCH_SIZE);

				await Promise.all(
					batch.map(async (league) => {
						try {
							const { rosters, bracket, losersBracket } = await fetchLeagueDetails(league.league_id);
							const placement = getUserLeaguePlacement(
								userData.user_id,
								league,
								rosters,
								bracket,
								losersBracket
							);
							const result = analyzeLeaguePerformance(userData.user_id, league, rosters, bracket);
							if (result) {
								analyzedResults.push(result);

								// Update stats
								const statObj = stats.find((s) => s.year === result.season);
								if (statObj) {
									if (result.rank === 1) statObj.gold++;
									if (result.rank === 2) statObj.silver++;
									if (result.rank === 3) statObj.bronze++;
								}
								if (placement) {
									placement.placement = result.rank;
								}
							}
							if (placement) {
								placements.push(placement);
							}
						} catch (e) {
							console.error(`Error analyzing league ${league?.league_id}`, e);
						}
					})
				);

				const currentProgress = 20 + Math.round(((i + BATCH_SIZE) / totalLeaguesToAnalyze) * 80);
				setProgress(Math.min(currentProgress, 100));
			}

			// Sort Results: 1st, then 2nd, then 3rd
			analyzedResults.sort((a, b) => a.rank - b.rank);

			// Sort Stats (Newest First)
			stats.sort((a, b) => parseInt(b.year) - parseInt(a.year));

			setResults(analyzedResults);
			setSeasonStats(stats);
			setLeaguePlacements(placements);
			setLoadingState(LoadingState.COMPLETE);
		},
		[]
	);

	const fetchHistory = useCallback(async () => {
		await fetchHistoryForUsername(username, { updateUrl: true, urlMode: 'push' });
	}, [fetchHistoryForUsername, username]);

	const resetToHome = useCallback(() => {
		setRouteUsername(null);
		setUsername('');
		setUser(null);
		setLoadingState(LoadingState.IDLE);
		setProgress(0);
		setResults([]);
		setSeasonStats([]);
		setLeaguePlacements([]);
		setError(null);
		setMobileView('career');
	}, []);

	// Deep link support (canonical): `/?user=<username>`
	// Also accepts `/user/<username>` and hash/query variants, then canonicalizes to the query URL.
	// - Ensures the shareable URL bypasses the HomePage.
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const route = parseUserRoute(window.location.pathname, window.location.search, window.location.hash);
		if (!route.username) return;

		const canonicalUrl = route.canonicalUrl;
		if (canonicalUrl) {
			const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
			if (currentUrl !== canonicalUrl) window.history.replaceState({}, '', canonicalUrl);
		}

		void fetchHistoryForUsername(route.username, { updateUrl: false });
	}, [fetchHistoryForUsername]);

	// Handle browser back/forward to keep state in sync with the URL.
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const onPopState = () => {
			const route = parseUserRoute(window.location.pathname, window.location.search, window.location.hash);
			if (!route.username) {
				resetToHome();
				return;
			}
			void fetchHistoryForUsername(route.username, { updateUrl: false });
		};

		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, [fetchHistoryForUsername, resetToHome]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') fetchHistory();
	};

	// Group results by year for the main view
	const resultsByYear = useMemo(() => {
		const grouped: Record<string, TrophyResult[]> = {};
		results.forEach(r => {
			if (!grouped[r.season]) grouped[r.season] = [];
			grouped[r.season].push(r);
		});
		return grouped;
	}, [results]);

	const placementsByYear = useMemo(() => {
		const grouped: Record<string, LeaguePlacement[]> = {};
		leaguePlacements.forEach(p => {
			if (!grouped[p.season]) grouped[p.season] = [];
			grouped[p.season].push(p);
		});
		return grouped;
	}, [leaguePlacements]);

	const yearsWithLeagues = useMemo(() => {
		return seasonStats.filter(s => s.totalLeagues > 0).map(s => s.year);
	}, [seasonStats]);

	const totalGold = results.filter(r => r.rank === 1).length;
	const totalSilver = results.filter(r => r.rank === 2).length;
	const totalBronze = results.filter(r => r.rank === 3).length;
	const combinedSeasonsCount = useMemo(() => seasonStats.reduce((acc, s) => acc + s.totalLeagues, 0), [seasonStats]);
	const yearsPlayedCount = yearsWithLeagues.length;
	const activeLeaguesCount = useMemo(() => {
		const seasonsWithLeagues = seasonStats.filter((s) => s.totalLeagues > 0);
		if (seasonsWithLeagues.length === 0) return 0;

		let maxYear = -Infinity;
		for (const s of seasonsWithLeagues) {
			const y = Number(s.year);
			if (Number.isFinite(y)) maxYear = Math.max(maxYear, y);
		}
		if (!Number.isFinite(maxYear)) return 0;
		const activeSeasonYear = String(maxYear);

		const activeLeagueIds = new Set(leaguePlacements.filter((p) => p.season === activeSeasonYear).map((p) => p.leagueId));
		return activeLeagueIds.size;
	}, [leaguePlacements, seasonStats]);

	const allTimeRecord = useMemo(() => {
		const recordTotals = leaguePlacements.reduce(
			(acc, placement) => {
				const parts = placement.record.split('-').map(Number);
				if (Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
					acc.wins += parts[0];
					acc.losses += parts[1];
					if (Number.isFinite(parts[2])) acc.ties += parts[2];
					acc.count += 1;
				}
				return acc;
			},
			{ wins: 0, losses: 0, ties: 0, count: 0 }
		);

		const totalGames = recordTotals.wins + recordTotals.losses + recordTotals.ties;
		const combinedWinPct = totalGames > 0
			? ((recordTotals.wins + recordTotals.ties * 0.5) / totalGames) * 100
			: 0;

		const avgWins = recordTotals.count > 0 ? recordTotals.wins / recordTotals.count : 0;
		const avgLosses = recordTotals.count > 0 ? recordTotals.losses / recordTotals.count : 0;
		const avgTies = recordTotals.count > 0 ? recordTotals.ties / recordTotals.count : 0;

		const combinedRecordDisplay = totalGames > 0
			? `${recordTotals.wins}-${recordTotals.losses}${recordTotals.ties > 0 ? `-${recordTotals.ties}` : ''}`
			: '--';

		const averageRecordDisplay = recordTotals.count > 0
			? `${avgWins.toFixed(1)}-${avgLosses.toFixed(1)}${avgTies > 0 ? `-${avgTies.toFixed(1)}` : ''}`
			: '--';

		return {
			wins: recordTotals.wins,
			losses: recordTotals.losses,
			ties: recordTotals.ties,
			combinedWinPct,
			combinedRecordDisplay,
			averageRecordDisplay,
		};
	}, [leaguePlacements]);

	const showHome = !routeUsername && (loadingState === LoadingState.IDLE || (loadingState === LoadingState.ERROR && !user));
	const isBusy =
		loadingState === LoadingState.FETCHING_USER ||
		loadingState === LoadingState.FETCHING_LEAGUES ||
		loadingState === LoadingState.ANALYZING;
	const canSearch = username.trim().length > 0;

	return (
		<div className="relative z-10 flex flex-col min-h-screen min-h-[100svh] bg-transparent text-gray-100 font-sans selection:bg-[#D0B472]/30">
			{showHome ? (
				<HomePage
					username={username}
					onUsernameChange={(value) => {
						setUsername(value);
						if (error) setError(null);
						if (loadingState === LoadingState.ERROR && !user) setLoadingState(LoadingState.IDLE);
					}}
					onSubmit={fetchHistory}
					error={loadingState === LoadingState.ERROR && !user ? error : null}
				/>
			) : (
				<>
					{/* --- STICKY NAV --- */}
					<header className="sticky top-0 z-50 bg-[#020202]/95 border-b border-white/5 min-h-[64px] md:h-[90px] flex items-center shadow-lg shadow-black/20 py-0.5 md:py-0">
						<div className="w-full pt-0.5 px-3 md:px-8">
								{/* Mobile layout */}
								<div className="md:hidden">
									<div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-1">
										<div className="mt-0.5">
											<div className="relative">
												<div className="absolute inset-0 bg-[#D0B472]/20 blur-md rounded-full"></div>
												<Hexagon
													viewBox="0 0.5 24 24"
													className="w-11 h-11 text-[#D0B472] relative z-10 fill-[#D0B472]/10"
													strokeWidth={1.5}
												/>
												<img
													src={dhLogo}
													alt="Dynasty Hub"
													className="absolute inset-0 z-20 m-auto w-[95%] h-[95%] object-contain pointer-events-none select-none"
														draggable={false}
													/>
												</div>
											</div>

										<div className="gap-4 min-w-0 flex flex-col items-center">
											<span className="self-start mt-3 font-['Product_Sans','Quicksand',sans-serif] font-light text-[21px] text-[#FFFE] leading-none tracking-tight whitespace-nowrap">
												Dynasty Hub
											</span>
										</div>

											<div className="mr-1 flex items-start gap-3">
												<div ref={screenshotMenuRef} className="relative">
													<button
														type="button"
														onClick={() => setScreenshotMenuOpen((prev) => !prev)}
														className="mt-1 inline-flex items-center justify-center gap-1 h-9 px-2.5 rounded-xl !shadow-[inset_0_0_22px_#E5CEA27b] border border-[#d0b472] text-[#D0B472] hover:border-[#D0B472] transition-all"
														aria-label="Screenshot options"
														aria-haspopup="menu"
														aria-expanded={screenshotMenuOpen}
													>
														<span className="relative w-8 h-8" aria-hidden="true">
															<Maximize className="absolute inset-0 w-8 h-8" strokeWidth={1.5} />
															<Camera className="absolute inset-0 m-auto w-[18px] h-[18px]" />
														</span>
														<ChevronDown className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
													</button>

												{screenshotMenuOpen && (
													<div
														className="absolute right-[-50px] mt-1 w-44 rounded-xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-md shadow-2xl shadow-black/70 overflow-hidden z-50"
														role="menu"
													>
														<button
															type="button"
															onClick={() => setScreenshotMenuOpen(false)}
															className="w-full flex items-center gap-2 px-2 py-2 text-[13px] font-bold text-gray-200 hover:bg-white/5 transition-colors text-left"
															role="menuitem"
														>
															<Fullscreen className="w-6 h-6 text-[#D0B472]" aria-hidden="true" />
															Career Screenshot 
														</button>
														<div className="h-px bg-white/10" aria-hidden="true" />
														<button
															type="button"
															onClick={() => setScreenshotMenuOpen(false)}
															className="w-full flex items-center gap-2 px-2 py-2 text-[13px] font-bold text-gray-200 hover:bg-white/5 transition-colors text-left"
															role="menuitem"
														>
															<Focus className="w-6 h-6 text-[#D0B472]" aria-hidden="true" />
															2025 Screenshot
														</button>
													</div>
												)}
											</div>

												<a
													href="https://dynastyhub.netlify.app/"
													className="mt-1 inline-flex items-center justify-center w-11 h-9 rounded-xl bg-[#d0b472]/0 border border-[#d0b472] text-[#D0B472] shadow-[inset_0_0_20px_#e5cea27B] hover:bg-[#d0b472]/15 hover:border-[#D0B472] hover:shadow-[0_0_14px_rgba(208,180,114,0.18)] transition-all shrink-0"
													aria-label="Dynasty Hub Home"
												>
													<House className="w-6 h-6" aria-hidden="true" />
												</a>
											</div>
										</div>

									<div className="mt-1.5 h-px w-full bg-[#D0B472]/25" aria-hidden="true" />
									<div className="mt-1 flex items-center justify-center space-x-2">
										<IconTrophy className="w-7 h-7 text-[#D0B472]" />
										<span className="font-black tracking-tight text-[26px] whitespace-nowrap uppercase drop-shadow-sm text-center leading-tight">
											<span className="mr-0.5 text-transparent bg-clip-text bg-gradient-to-r from-[#FFF] via-[#FFFE] to-[#FFFD] drop-shadow-[0_0_18px_rgba(208,180,114,0.18)]">
												DYNASTY
											</span>{' '}
											<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#D0B472] to-[#B89A4B] drop-shadow-[0_0_18px_rgba(208,180,114,0.18)]">
												TROPHY&nbsp;&nbsp;ROOM
											</span>
										</span>
									</div>

									<div className="mt-2 px-2 w-full">
										<div className="relative group w-full">
											<IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-[#D0B472] transition-colors" />
										<input
											type="text"
											disabled={isBusy}
											className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-14 text-[16px] font-mono text-white focus:outline-none focus:border-[#D0B472]/50 focus:bg-white/10 w-full transition-all shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
											placeholder="Search Sleeper Username..."
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											onKeyDown={handleKeyDown}
										/>
										<button
											type="button"
											onClick={fetchHistory}
											disabled={!canSearch || isBusy}
											className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#D0B472] hover:bg-[#D0B472]/90 text-black h-9 w-9 rounded-full flex items-center justify-center transition-colors hover:shadow-[0_0_15px_rgba(208,180,114,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
										>
											{loadingState === LoadingState.IDLE ||
												loadingState === LoadingState.COMPLETE ||
												loadingState === LoadingState.ERROR ? (
												<IconTrophy className="w-4 h-4 fill-black/20" />
											) : (
												<IconLoader className="w-4 h-4 animate-spin text-black" />
											)}
										</button>
									</div>
								</div>
							</div>

							{/* Desktop layout */}
							<div className="hidden md:flex items-center justify-between w-full">
								{/* LEFT: PARENT BRAND */}
								<div className="flex items-center space-x-3 group cursor-pointer w-full md:w-1/3 justify-center md:justify-start">
									<div className="relative">
										<div className="absolute inset-0 bg-[#D0B472]/20 blur-md rounded-full group-hover:bg-[#D0B472]/40 transition-all"></div>
										<Hexagon
											viewBox="0 0.5 24 24"
											className="w-9 h-9 md:w-16 md:h-16 text-[#D0B472] relative z-10 fill-[#D0B472]/10"
											strokeWidth={1.5}
										/>
										<img
											src={dhLogo}
											alt="Dynasty Hub"
											className="absolute inset-0 z-20 m-auto w-[95%] h-[95%] md:w-[90%] md:h-[90%] object-contain pointer-events-none select-none"
											draggable={false}
										/>
									</div>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<span className="font-bold text-lg md:text-2xl text-white leading-none tracking-tight whitespace-nowrap">
												Dynasty Hub
											</span>
											<a
												href={DYNASTY_HUB_MAIN_APP_URL}
												onClick={(e) => {
													if (DYNASTY_HUB_MAIN_APP_URL === '#') e.preventDefault();
												}}
												className="text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-gray-500 hover:text-[#D0B472] transition-colors"
											>
												Main App
											</a>
										</div>
									</div>
								</div>

								{/* CENTER: APP TITLE */}
								<div className="flex items-center justify-center space-x-2 md:space-x-3 w-full md:w-1/3">
									<IconTrophy className="w-6 h-6 md:w-12 md:h-12 text-[#D0B472]" />
									<span className="font-black tracking-wider md:tracking-tight text-lg sm:text-sm md:text-[49px] uppercase drop-shadow-sm text-center leading-tight whitespace-normal">
										<span className="text-white">DYNASTY</span>{' '}
										<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#D0B472] to-[#B89A4B] drop-shadow-[0_0_18px_rgba(208,180,114,0.18)]">
											TROPHY ROOM
										</span>
									</span>
								</div>

								{/* RIGHT: SEARCH */}
								<div className="flex items-center justify-end space-x-2 md:space-x-3 w-full md:w-1/3">
									<div className="relative group w-full md:w-72">
										<IconSearch className="absolute left-3 md:left-4 top-2.5 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-gray-500 group-focus-within:text-[#D0B472] transition-colors" />
										<input
											type="text"
											disabled={isBusy}
											className="bg-white/5 border border-white/10 rounded-full py-2 md:py-3.5 pl-10 md:pl-12 pr-4 md:pr-6 text-[16px] md:text-sm font-mono text-white focus:outline-none focus:border-[#D0B472]/50 focus:bg-white/10 w-full transition-all shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
											placeholder="Search Sleeper Username..."
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											onKeyDown={handleKeyDown}
										/>
									</div>
									<button
										onClick={fetchHistory}
										disabled={!canSearch || isBusy}
										className="bg-[#D0B472] hover:bg-[#D0B472]/90 text-black p-2.5 md:p-3.5 rounded-full transition-colors hover:shadow-[0_0_15px_rgba(208,180,114,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
									>
										{loadingState === LoadingState.IDLE ||
											loadingState === LoadingState.COMPLETE ||
											loadingState === LoadingState.ERROR ? (
											<IconTrophy className="w-4 h-4 md:w-5 md:h-5 fill-black/20" />
										) : (
											<IconLoader className="w-4 h-4 md:w-5 md:h-5 animate-spin text-black" />
										)}
									</button>
								</div>
							</div>
						</div>
					</header>

					{/* --- MAIN LAYOUT (SIDEBAR + CONTENT) --- */}
					<div className="flex flex-1 relative z-10 w-full">
						{/* SIDEBAR (Desktop Only) */}
						{user && loadingState === LoadingState.COMPLETE && (
							<Sidebar user={user} seasonStats={seasonStats} leaguePlacements={leaguePlacements} />
						)}

						<main className="flex-1 min-w-0">

							{/* --- HERO SECTION (USER & BIG STATS) --- */}
							{user && loadingState === LoadingState.COMPLETE && (
								<div className="border-b border-white/5 bg-transparent shadow-2xl shadow-black/50">
									<div className="w-full max-w-[1600px] mx-auto px-2 md:px-8 py-2 sm:py-3 md:py-6">
										<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 md:flex md:flex-col md:items-center md:gap-10 xl:grid xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center xl:gap-x-12 xl:gap-y-0 2xl:gap-x-20">

											{/* LEFT: ALL-TIME RECORD (Desktop Main Header) */}
											<div className="hidden xl:block xl:col-start-1 xl:row-start-1 relative z-20">
												<div className="w-full max-w-[340px] 2xl:max-w-[420px]">
													<div className="bg-gradient-to-br from-[#0c1118] to-[#050505] border border-white/10 rounded-2xl px-4 py-4 relative overflow-hidden shadow-xl shadow-black/40">
														<div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D0B472]/5 rounded-full blur-3xl pointer-events-none"></div>
														<div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

														<div className="flex items-center justify-between gap-4 mb-3">
															<div className="flex items-center gap-2 min-w-0">
																<div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#D0B472]">
																	<IconActivity className="w-4 h-4" />
																</div>
																<span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold whitespace-nowrap">All-Time Record</span>
															</div>
															{(() => {
																const pct = allTimeRecord.combinedWinPct;
																const isWinSide = pct > 50;
																const isLossSide = pct < 50;
																const chipColor = isWinSide ? '#D0B472' : isLossSide ? '#B6C1DD' : undefined;
																const chipGlow = isWinSide
																	? 'drop-shadow-[0_0_10px_rgba(208,180,114,0.35)]'
																	: isLossSide
																		? 'drop-shadow-[0_0_10px_rgba(182,193,221,0.35)]'
																		: '';

																return (
																	<div
																		className={`px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-mono text-sm font-bold shrink-0 ${chipGlow}`}
																		style={chipColor ? { color: chipColor } : undefined}
																	>
																		{pct.toFixed(1)}%
																	</div>
																);
															})()}
														</div>

														{(() => {
															const wins = allTimeRecord.wins;
															const losses = allTimeRecord.losses;
															const ties = allTimeRecord.ties;
															const winsLead = wins > losses;
															const lossesLead = losses > wins;
															// Opacity rule: ONLY the wins count should fade when it's the smaller number.
															const winOpacity = wins < losses ? 0.55 : 1;
															const lossOpacity = 1;
															const winGlow = winsLead ? 'drop-shadow-[0_0_10px_rgba(208,180,114,0.35)]' : '';
															const lossGlow = lossesLead ? 'drop-shadow-[0_0_10px_rgba(182,193,221,0.35)]' : '';

															return (
																<div className="text-3xl 2xl:text-4xl font-mono font-black tracking-tighter leading-none flex items-baseline justify-center text-center">
																	<span className={`${winGlow}`} style={{ color: '#D0B472', opacity: winOpacity }}>
																		{wins}
																	</span>
																	<span className="mx-1 text-gray-200">-</span>
																	<span className={`${lossGlow}`} style={{ color: '#B6C1DD', opacity: lossOpacity }}>
																		{losses}
																	</span>
																	{ties > 0 && (
																		<>
																			<span className="mx-1 text-gray-200">-</span>
																			<span className="text-gray-400">{ties}</span>
																		</>
																	)}
																</div>
															);
														})()}

														<div className="mt-3">
															<div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
																<div
																	className="bg-gradient-to-r from-[#D0B472]/90 to-[#D0B472] h-2 rounded-full shadow-[0_0_10px_rgba(208,180,114,0.22)] transition-all duration-1000 ease-out"
																	style={{ width: `${Math.max(0, Math.min(100, allTimeRecord.combinedWinPct))}%` }}
																></div>
															</div>
															<div className="mt-3 flex items-center justify-between text-xs text-gray-600">
																<span className="uppercase tracking-wider">Avg Record</span>
																<span className="font-mono text-gray-300">{allTimeRecord.averageRecordDisplay}</span>
															</div>
														</div>
													</div>
												</div>
											</div>

											{/* CENTER: USER PROFILE */}
											<div className="pl-2 flex items-center justify-center gap-1.5 md:gap-8 xl:col-start-2 xl:col-span-1 xl:row-start-1 xl:justify-self-center relative z-10 min-w-0 -ml-4 w-[calc(100%+1rem)] md:ml-0 md:w-auto">
												<div className="shrink-0 relative w-[72px] h-[72px] sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full p-0.5 md:p-1.5 bg-gradient-to-br from-[#D0B472] via-[#B89A4B] to-yellow-900 shadow-[0_0_30px_rgba(208,180,114,0.2)]">
													<div className="absolute inset-0 rounded-full bg-black/20 pointer-events-none"></div>
													<img
														src={`https://sleepercdn.com/avatars/thumbs/${user.avatar}`}
														className="w-full h-full rounded-full border-2 border-[#020202] md:border-4 md:border-[#020202] object-cover relative z-10"
														alt=""
													/>
												</div>
												<div className="min-w-0 md:flex-none">
													<h1 className="text-[25px] sm:text-3xl md:text-6xl font-black text-white tracking-tighter mb-1 md:mb-2 min-w-0 overflow-hidden">
														<span className="hidden md:inline">{user.display_name}</span>
														<TwoDotTruncatedText
															text={user.display_name}
															className="md:hidden block min-w-0 whitespace-nowrap overflow-hidden"
														/>
													</h1>
													<div className="flex items-center space-x-3 min-w-0">
														<span className="hidden md:inline-flex bg-[#D0B472]/10 text-[#D0B472] text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-[#D0B472]/20">Dynasty Manager</span>
														<p className="text-gray-500 font-mono text-xs sm:text-sm md:text-lg uppercase tracking-wider min-w-0 whitespace-nowrap overflow-hidden">
															@{user.username}
														</p>
													</div>
												</div>
											</div>

											{/* Mobile-only: Totals panel (Total Seasons + Years Played + Active Leagues) */}
											<div className="md:hidden col-start-2 row-start-1 justify-self-end self-center">
												<div className="flex flex-col gap-1">
													<div className="flex flex-col items-center">
														<span className="text-[8px] uppercase font-bold tracking-[0.08em] text-gray-400 text-center whitespace-nowrap leading-none">
															Total Seasons
														</span>
														<div className="mt-0.5 flex items-center justify-center gap-1.5">
															<CalendarRange className="w-3.5 h-3.5 text-[#D0B472]" aria-hidden="true" />
															<span className="text-[14px] font-black text-white leading-none">{combinedSeasonsCount}</span>
														</div>
													</div>

													<div className="h-px w-full bg-[#D0B472]/20" aria-hidden="true" />

													<div className="flex flex-col items-center">
														<span className="text-[8px] uppercase font-bold tracking-[0.08em] text-gray-400 text-center whitespace-nowrap leading-none">
															Years Played
														</span>
														<div className="mt-0.5 flex items-center justify-center gap-1.5">
															<CalendarSync className="w-3.5 h-3.5 text-[#D0B472]" aria-hidden="true" />
															<span className="text-[14px] font-black text-white leading-none">{yearsPlayedCount}</span>
														</div>
													</div>

													<div className="h-px w-full bg-[#D0B472]/20" aria-hidden="true" />

													<div className="flex flex-col items-center">
														<span className="text-[8px] uppercase font-bold tracking-[0.08em] text-gray-400 text-center whitespace-nowrap leading-none">
															Active Leagues
														</span>
														<div className="mt-0.5 flex items-center justify-center gap-1.5">
															<Orbit className="w-3.5 h-3.5 text-[#D0B472]" aria-hidden="true" />
															<span className="text-[14px] font-black text-white leading-none">{activeLeaguesCount}</span>
														</div>
													</div>
												</div>
											</div>

											{/* RIGHT: BIG STATS DISPLAY */}
											<div className="col-span-2 row-start-2 mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 w-full md:w-auto md:flex-nowrap md:justify-start xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:justify-self-end xl:justify-end xl:gap-4 relative z-20">
												{/* Gold Stat */}
												<div className="relative flex-1 md:flex-none flex flex-col items-center justify-center px-4 md:px-3.5 py-2 md:py-5 rounded-2xl bg-gradient-to-b from-[#1F1600] to-[#050505] border border-[#D0B472]/60 shadow-[0_0_35px_-5px_rgba(208,180,114,0.15)] min-w-[96px] sm:min-w-[110px] md:min-w-[150px] xl:min-w-[135px] group overflow-hidden">
													<div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-[#D0B472]/10 blur-[40px] rounded-full pointer-events-none"></div>
													<IconCrown className="w-4 h-4 md:w-9 md:h-9 text-[#D0B472] mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(208,180,114,0.6)]" />
													<span className="text-lg sm:text-xl md:text-5xl font-black text-white tracking-tight leading-none group-hover:scale-105 transition-transform duration-300">{totalGold}</span>
													<span className="text-[9px] md:text-sm uppercase font-extrabold text-[#D0B472] tracking-[0.06em] mt-1 md:mt-2 text-center">Championships</span>
												</div>

												{/* Silver Stat */}
												<div className="relative flex-1 md:flex-none flex flex-col items-center justify-center px-4 md:px-8 py-2 md:py-5 rounded-2xl bg-gradient-to-b from-[#0f1115] to-[#050505] border border-slate-300/25 shadow-[0_0_35px_-5px_rgba(148,163,184,0.14)] min-w-[96px] sm:min-w-[110px] md:min-w-[130px] xl:min-w-[115px] overflow-hidden">
													<div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-slate-300/10 blur-[40px] rounded-full pointer-events-none"></div>
													<IconMedal className="w-4 h-4 md:w-8 md:h-8 text-slate-300 mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(148,163,184,0.55)]" />
													<span className="text-lg sm:text-xl md:text-4xl font-black text-white leading-none">{totalSilver}</span>
													<span className="text-[9px] md:text-xs uppercase font-bold text-slate-400 tracking-[0.08em] mt-1 md:mt-2 text-center">Runner-Up</span>
												</div>

												{/* Bronze Stat */}
												<div className="relative flex-1 md:flex-none flex flex-col items-center justify-center px-4 md:px-7 py-2 md:py-4 rounded-2xl bg-gradient-to-b from-[#120c06] to-[#050505] border border-[#b87333]/25 shadow-[0_0_35px_-5px_rgba(184,115,51,0.14)] min-w-[96px] sm:min-w-[110px] md:min-w-[120px] xl:min-w-[105px] overflow-hidden">
													<div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-[#b87333]/10 blur-[40px] rounded-full pointer-events-none"></div>
													<Award className="w-4 h-4 md:w-7 md:h-7 text-[#b87333] mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(184,115,51,0.55)]" aria-hidden="true" />
													<span className="text-lg sm:text-xl md:text-4xl font-black text-white leading-none">{totalBronze}</span>
													<span className="text-[9px] md:text-xs uppercase font-bold text-[#b87333]/80 tracking-[0.08em] mt-1 md:mt-2 text-center">3rd Place</span>
												</div>
											</div>

											{/* Mobile-only tabs (below the career summary counts) */}
											<div className="md:hidden col-span-2 row-start-3 w-full max-w-[520px] mx-auto mt-2">
												<div className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 p-0.5 shadow-inner">
													<button
														type="button"
														onClick={() => setMobileView('career')}
														className={[
															"flex-1 flex items-center justify-center gap-3 py-1.5 rounded-full text-[15px] font-['Product_Sans','Quicksand',sans-serif] font-light uppercase tracking-[0.08em] transition-all select-none",
															mobileView === 'career'
																? 'bg-gradient-to-b from-white/[0.10] to-black/[0.30] border border-white/[0.16] text-white shadow-[0_0_14px_rgba(208,180,114,0.12)]'
																: 'text-gray-400 hover:text-gray-200',
														].join(' ')}
														aria-pressed={mobileView === 'career'}
													>
														<Gem
															className={[
																'w-5 h-5 opacity-90',
																mobileView === 'career'
																	? 'text-[#D0B472] drop-shadow-[0_0_10px_rgba(208,180,114,0.25)]'
																	: 'text-gray-500',
															].join(' ')}
															aria-hidden="true"
														/>
														Career
													</button>
													<button
														type="button"
														onClick={() => setMobileView('seasons')}
														className={[
															"flex-1 flex items-center justify-center gap-3 py-1.5 rounded-full text-[15px] font-['Product_Sans','Quicksand',sans-serif] font-light uppercase tracking-[0.08em] transition-all select-none",
															mobileView === 'seasons'
																? 'bg-gradient-to-b from-[#D0B472]/[0.10] to-[#0b0b0b]/[0.55] border border-[#D0B472]/40 text-[#D0B472] shadow-[0_0_16px_rgba(208,180,114,0.22)]'
																: 'text-gray-400 hover:text-gray-200',
														].join(' ')}
														aria-pressed={mobileView === 'seasons'}
													>
														<IconTrophy
															className={[
																'w-5 h-5 opacity-90',
																mobileView === 'seasons'
																	? 'text-[#D0B472] drop-shadow-[0_0_10px_rgba(208,180,114,0.25)]'
																	: 'text-gray-500',
															].join(' ')}
															aria-hidden="true"
														/>
														Seasons
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* --- CONTENT CONTAINER (CENTERED) --- */}
							<div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-1 pb-4 sm:pt-3 sm:pb-5 md:py-12">

								{/* Initial State */}
								{loadingState === LoadingState.IDLE && (
									<div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-30">
										<IconTrophy className="w-20 h-20 md:w-32 md:h-32 mb-6 text-white" />
										<h2 className="text-2xl md:text-4xl font-light text-white tracking-widest uppercase">Enter Username</h2>
									</div>
								)}

								{/* Loading State */}
								{(loadingState === LoadingState.FETCHING_USER || loadingState === LoadingState.FETCHING_LEAGUES || loadingState === LoadingState.ANALYZING) && (
									<div className="h-[50vh] flex flex-col items-center justify-center">
										<IconLoader className="w-8 h-8 md:w-12 md:h-12 text-[#D0B472] animate-spin mb-8" />
										<div className="w-48 md:w-64 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
											<div className="h-full bg-[#D0B472] transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
										</div>
										<p className="mt-4 text-xs font-mono text-gray-600 uppercase tracking-widest">{loadingState === LoadingState.ANALYZING ? 'Calculating Results...' : 'Loading Data...'}</p>
									</div>
								)}

								{/* Error State */}
								{loadingState === LoadingState.ERROR && (
									<div className="flex flex-col items-center justify-center py-20 text-center">
										<div className="bg-red-500/10 p-4 rounded-full mb-4">
											<IconTrophy className="w-8 h-8 text-red-500" />
										</div>
										<h3 className="text-xl font-bold text-white mb-2">User Not Found</h3>
										<p className="text-gray-500 max-w-md">{error || "We couldn't find a Sleeper user with that username. Please check the spelling and try again."}</p>
									</div>
								)}

								{/* Results Loop */}
								{loadingState === LoadingState.COMPLETE && (
									<>
										{/* Mobile tab: Career summary (renders the desktop sidebar content) */}
										<div className={`${mobileView === 'career' ? 'block' : 'hidden'} md:hidden`}>
											{user && (
												<div className="pb-16 animate-slide-up">
													<Sidebar user={user} seasonStats={seasonStats} leaguePlacements={leaguePlacements} variant="mobile" />
												</div>
											)}
										</div>

										{/* Seasons tab (current year-by-year layout). Always visible on desktop. */}
										<div className={`${mobileView === 'career' ? 'hidden' : 'block'} md:block`}>
											<div className="space-y-6 sm:space-y-7 md:space-y-12 animate-slide-up pb-20">
												{yearsWithLeagues.map((year) => {
													const stats = seasonStats.find(s => s.year === year);
													const yearResults = resultsByYear[year] || [];
													const yearPlacements = placementsByYear[year] || [];
													const trophyLeagueIds = new Set(yearResults.map(result => result.leagueId));
													const nonPodiumPlacements = yearPlacements.filter(p => !trophyLeagueIds.has(p.leagueId));
													const sortedNonPodiumPlacements = [...nonPodiumPlacements].sort((a, b) => {
														const aTop6 = a.standingsRank > 0 && a.standingsRank <= 6;
														const bTop6 = b.standingsRank > 0 && b.standingsRank <= 6;
														if (aTop6 !== bTop6) return aTop6 ? -1 : 1;
														// Within each group, keep a stable-ish order: better standings first.
														const aRank = a.standingsRank > 0 ? a.standingsRank : 999;
														const bRank = b.standingsRank > 0 ? b.standingsRank : 999;
														return aRank - bRank;
													});
													// Centering logic: if items < 6, center them. Else, start alignment allows scroll without clip.
													const justifyClass = yearResults.length > 0 && yearResults.length < 6 ? 'md:justify-center' : 'justify-start';
													const placementJustifyClass = sortedNonPodiumPlacements.length > 0 && sortedNonPodiumPlacements.length < 8 ? 'md:justify-center' : 'justify-start';

													const winPercentage = stats && stats.totalLeagues > 0 ? (stats.gold / stats.totalLeagues) * 100 : 0;

													// Divider sits directly under the last row of cards for the year.

													return (
														<div key={year} className="relative isolate">
															{/* Watermark */}
															<span className="absolute -top-5 sm:-top-6 md:-top-12 -left-4 md:-left-6 text-[4.5rem] sm:text-[5.5rem] md:text-[11rem] text-white/[0.055] sm:text-white/[0.04] md:text-white/[0.03] font-black leading-none select-none pointer-events-none z-0 tracking-tighter">
																{year}
															</span>

															{/* Year Header & Stats */}
															<div className="relative z-10 flex flex-col md:flex-row md:items-end mb-2 md:mb-8 pb-0 md:pb-2 gap-0.5 md:gap-16">
																<div className="w-full md:w-auto shrink-0">
																	{/* Mobile: align Leagues + progress with the 3-column summary below */}
																	<div className="md:hidden w-full">
																		<div className="grid grid-cols-3 items-center gap-x-3">
																			<div className="min-w-0">
																				<h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-700 leading-none tracking-tighter shadow-xl pr-2">
																					{year}
																				</h2>
																				<span className="mt-0.5 block text-[10px] font-mono text-gray-600 uppercase tracking-widest">
																					Season
																				</span>
																			</div>

																			{stats ? (
																				<>
																					<div className="flex items-center justify-center">
																						<div className="flex flex-col items-center justify-center h-[60px]">
																							<span className="flex h-8 items-center justify-center text-[9px] uppercase text-gray-500 font-bold tracking-[0.12em] leading-tight text-center">
																								Leagues
																							</span>
																							<span className="mt-1 text-white font-mono font-black text-lg leading-none">{stats.totalLeagues}</span>
																						</div>
																					</div>
																					<div className="flex items-center justify-center">
																						<div className="shrink-0">
																							<CircularProgress percentage={winPercentage} size={60} strokeWidth={4} />
																						</div>
																					</div>
																				</>
																			) : (
																				<>
																					<div />
																					<div />
																				</>
																			)}
																		</div>
																	</div>

																	{/* Desktop: keep the existing year + Season inline */}
																	<div className="hidden md:flex items-baseline">
																		<h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-700 leading-none tracking-tighter shadow-xl pr-2">
																			{year}
																		</h2>
																		<span className="ml-4 text-[10px] md:text-sm font-mono text-gray-600 uppercase tracking-widest mb-3">
																			Season
																		</span>
																	</div>
																</div>

																{/* Detailed Year Stats */}
																{stats && (
																	<>
																		{/* Mobile: remaining season summary */}
																		<div className="md:hidden w-full -mt-1">
																			<div className="grid grid-cols-3 gap-x-3">
																				<div className="flex flex-col items-center justify-center min-w-0 group">
																					<span
																						className={`flex h-6 items-center justify-center text-[9px] uppercase font-bold tracking-[0.12em] leading-tight text-center transition-colors ${stats.gold > 0 ? 'text-[#D0B472]' : 'text-gray-700'}`}
																					>
																						Championships
																					</span>
																					<span
																						className={`font-mono font-black text-lg leading-none transition-all ${stats.gold > 0 ? 'text-[#D0B472] drop-shadow-[0_0_15px_rgba(208,180,114,0.5)]' : 'text-gray-800'}`}
																					>
																						{stats.gold}
																					</span>
																				</div>

																				<div className="flex flex-col items-center justify-center min-w-0 group">
																					<span
																						className={`flex h-6 items-center justify-center text-[9px] uppercase font-bold tracking-[0.12em] leading-tight text-center transition-colors ${stats.silver > 0 ? 'text-slate-500' : 'text-gray-700'}`}
																					>
																						Runner-Up
																					</span>
																					<span className={`font-mono font-black text-lg leading-none transition-all ${stats.silver > 0 ? 'text-slate-300' : 'text-gray-800'}`}>
																						{stats.silver}
																					</span>
																				</div>

																				<div className="flex flex-col items-center justify-center min-w-0 group">
																					<span
																						className={`flex h-6 items-center justify-center text-[9px] uppercase font-bold tracking-[0.12em] leading-tight text-center transition-colors ${stats.bronze > 0 ? 'text-orange-800' : 'text-gray-700'}`}
																					>
																						3rd Place
																					</span>
																					<span className={`font-mono font-black text-lg leading-none transition-all ${stats.bronze > 0 ? 'text-orange-600' : 'text-gray-800'}`}>
																						{stats.bronze}
																					</span>
																				</div>
																			</div>
																		</div>

																		{/* Desktop: preserve the existing inline layout */}
																		<div className="hidden md:flex md:items-center gap-4 md:gap-10 flex-1 md:pl-4">
																			{/* Circular Progress Indicator */}
																			<div className="flex items-start">
																				<div className="hidden md:block -mt-2">
																					<CircularProgress percentage={winPercentage} size={80} strokeWidth={5} />
																				</div>
																			</div>

																			<div className="w-px h-12 bg-white/10 mt-2"></div>

																			<div className="flex items-center gap-16 pb-2 mt-2">
																				<div className="flex flex-col items-center group">
																					<span className="text-[10px] md:text-[10px] uppercase text-gray-500 font-bold tracking-[0.15em] mb-1 group-hover:text-gray-400 transition-colors">
																						Leagues
																					</span>
																					<span className="text-white font-mono font-black text-xl md:text-4xl leading-none">{stats.totalLeagues}</span>
																				</div>

																				<div className="w-px h-10 bg-white/5"></div>

																				<div className="flex flex-col items-center group">
																					<span
																						className={`text-[10px] md:text-[10px] uppercase font-bold tracking-[0.15em] mb-1 transition-colors ${stats.gold > 0 ? 'text-[#D0B472] group-hover:text-[#D0B472]/90' : 'text-gray-700'}`}
																					>
																						Championships
																					</span>
																					<span
																						className={`font-mono font-black text-xl md:text-4xl leading-none transition-all ${stats.gold > 0 ? 'text-[#D0B472] drop-shadow-[0_0_15px_rgba(208,180,114,0.5)]' : 'text-gray-800'}`}
																					>
																						{stats.gold}
																					</span>
																				</div>

																				<div className="flex flex-col items-center group">
																					<span
																						className={`text-[10px] md:text-[10px] uppercase font-bold tracking-[0.15em] mb-1 transition-colors ${stats.silver > 0 ? 'text-slate-500 group-hover:text-slate-400' : 'text-gray-700'}`}
																					>
																						Runner-Up
																					</span>
																					<span className={`font-mono font-black text-xl md:text-4xl leading-none transition-all ${stats.silver > 0 ? 'text-slate-300' : 'text-gray-800'}`}>
																						{stats.silver}
																					</span>
																				</div>

																				<div className="flex flex-col items-center group">
																					<span
																						className={`text-[10px] md:text-[10px] uppercase font-bold tracking-[0.15em] mb-1 transition-colors ${stats.bronze > 0 ? 'text-orange-800 group-hover:text-orange-700' : 'text-gray-700'}`}
																					>
																						3rd Place
																					</span>
																					<span className={`font-mono font-black text-xl md:text-4xl leading-none transition-all ${stats.bronze > 0 ? 'text-orange-600' : 'text-gray-800'}`}>
																						{stats.bronze}
																					</span>
																				</div>
																			</div>
																		</div>
																	</>
																)}
															</div>

															{/* Horizontal Scrolling Layout */}
															{/* Added justify-center conditional class */}
															{yearResults.length > 0 && (
																<div className="relative z-10 flex items-center gap-2 md:gap-3">
																	<div className="hidden md:flex shrink-0 w-24 lg:w-28 text-xs md:text-sm font-mono uppercase tracking-widest text-gray-600/80 items-center justify-end text-right">
																		Podium Finishes
																	</div>
																	<div className="flex-1 min-w-0">
																		<div className={`flex flex-nowrap overflow-x-auto gap-2 sm:gap-3 md:gap-8 pb-2 md:pb-6 px-2 sm:px-2.5 md:px-4 md:-mx-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x ${justifyClass}`}>
																			{yearResults.map((result) => (
																				<TrophyCard key={result.leagueId} result={result} />
																			))}
																			{/* Spacer for right side scrolling if aligned start */}
																			<div className="w-4 flex-shrink-0"></div>
																		</div>
																	</div>
																</div>
															)}
															{yearResults.length === 0 && nonPodiumPlacements.length === 0 && (
																<div className="relative z-10 w-full py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
																	<p className="text-gray-700 text-xs font-mono uppercase tracking-widest">No Podium Finishes</p>
																</div>
															)}
															{sortedNonPodiumPlacements.length > 0 && (
																<div className="relative z-10 mt-2 flex items-center gap-2 md:gap-3">
																	<div className="hidden md:flex shrink-0 w-24 lg:w-28 text-xs md:text-sm font-mono uppercase tracking-widest text-gray-600/80 items-center justify-end text-right">
																		Didn't Place
																	</div>
																	<div className="flex-1 min-w-0">
																		<div className={`flex flex-nowrap overflow-x-auto gap-2 md:gap-3 pb-3 md:pb-5 px-2.5 sm:px-3 md:px-4 md:-mx-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent ${placementJustifyClass}`}>
																			{sortedNonPodiumPlacements.map((placement) => (
																				<PlacementCard key={placement.leagueId} placement={placement} />
																			))}
																			<div className="w-4 flex-shrink-0"></div>
																		</div>
																	</div>
																</div>
															)}

															<div className="relative z-20 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
														</div>
													);
												})}

												{yearsWithLeagues.length === 0 && (
													<div className="text-center py-24">
														<p className="text-gray-500 font-light text-xl">No Dynasty championships found in history.</p>
													</div>
												)}
											</div>
										</div>
									</>
								)}
							</div>
						</main>
					</div>
				</>
			)}
		</div>
	);
};

export default App;
