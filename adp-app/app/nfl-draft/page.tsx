"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DynastyHubResearchShell from "../components/DynastyHubResearchShell";
import NflDraftQuadrantArcMatrix from "./NflDraftQuadrantArcMatrix";
import {
  nflDraftPositionGradients,
  nflDraftStatNotes,
  nflDraftStatPalettes,
  nflDraftTrendData,
  nflDraftTrendLabelOffsets,
  type NflDraftPosition,
} from "./data";
import "./nfl-draft.css";

const trendPositions = Object.keys(nflDraftPositionGradients) as NflDraftPosition[];

const statCards = nflDraftTrendData.map((metric, index) => ({
  ...metric,
  note: nflDraftStatNotes[metric.range].desktop,
  mobileNote: nflDraftStatNotes[metric.range].mobile,
  palette: nflDraftStatPalettes[index],
  sequence: String(index + 1).padStart(2, "0"),
}));

type NflStatCardStyle = CSSProperties & {
  "--accent": string;
  "--accent-rgb": string;
  "--ring-start": string;
  "--ring-mid": string;
  "--ring-end": string;
  "--arc-end": string;
  "--arc-mid": string;
};

type ReadinessPhase = "loading" | "exiting" | "hidden";

function OverallPercentLabel({
  x,
  y,
  value,
}: {
  x?: number;
  y?: number;
  value?: number;
}) {
  if (x == null || y == null || value == null) return null;
  return (
    <text x={x} y={y - 15} textAnchor="middle" className="chart-value nfl-overall-value">
      {value.toFixed(1)}%
    </text>
  );
}

function PositionalPercentLabel({
  x,
  y,
  index,
  position,
  values,
  compact,
}: {
  x?: number;
  y?: number;
  index?: number;
  position: NflDraftPosition;
  values: readonly number[];
  compact: boolean;
}) {
  const pointIndex = index ?? 0;
  const value = values[pointIndex];
  const baseOffset = nflDraftTrendLabelOffsets[position][pointIndex] ?? { dx: 0, dy: -12 };
  // The first mobile x-coordinate sits beside the y-axis. Pull its four-label
  // fan inward while preserving the vertical slots used to separate 76–83%.
  const offset = compact && pointIndex === 0
    ? {
        QB: { dx: -10, dy: -13 },
        RB: { dx: 0, dy: -17 },
        WR: { dx: 0, dy: 18 },
        TE: { dx: 15, dy: -4 },
      }[position]
    : baseOffset;
  if (x == null || y == null || value == null) return null;

  return (
    <text
      x={x + offset.dx}
      y={y + offset.dy}
      textAnchor="middle"
      className={`chart-value nfl-trend-value nfl-trend-value--${position.toLowerCase()}`}
    >
      {value.toFixed(1)}%
    </text>
  );
}

type TooltipDatum = {
  dataKey?: string | number;
  value?: string | number | null;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipDatum[];
  label?: string | number;
};

function NflDraftTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <span className="tooltip-kicker">{label}</span>
      {payload
        .filter((item, index, items) => (
          items.findIndex((candidate) => candidate.dataKey === item.dataKey) === index
        ))
        .map((item) => {
          const dataKey = String(item.dataKey);
          const position = dataKey as NflDraftPosition;
          const displayLabel = dataKey === "overall" ? "Overall" : dataKey;
          const color = position in nflDraftPositionGradients
            ? nflDraftPositionGradients[position][3]
            : "#d747ff";
          return (
            <div className="tooltip-row" key={dataKey}>
              <span><i style={{ background: color }} />{displayLabel}</span>
              <strong>{Number(item.value).toFixed(1)}%</strong>
            </div>
          );
        })}
    </div>
  );
}

export default function NflDraftHitRatesPage() {
  const [compactCharts, setCompactCharts] = useState(false);
  const [readinessPhase, setReadinessPhase] = useState<ReadinessPhase>("loading");
  const [hiddenTrendPositions, setHiddenTrendPositions] = useState<NflDraftPosition[]>([]);

  useEffect(() => {
    const update = () => setCompactCharts(window.innerWidth <= 560);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toggleTrendPosition = (position: NflDraftPosition) => {
    setHiddenTrendPositions((current) => (
      current.includes(position)
        ? current.filter((candidate) => candidate !== position)
        : [...current, position]
    ));
  };

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 760px)");

    // NFL Draft mobile readiness gate: all charts stay mounted behind the
    // polished loading surface until both Recharts canvases, fonts, and the
    // denser seven-ring matrix have stable physical dimensions.
    if (!mobileViewport.matches) {
      const desktopReleaseFrame = window.requestAnimationFrame(() => {
        setReadinessPhase("hidden");
      });
      return () => window.cancelAnimationFrame(desktopReleaseFrame);
    }

    let cancelled = false;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = performance.now();
    const minimumDisplayMs = 1050;
    const readinessTimeoutMs = 3800;
    const nextFrame = () => new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
    const shortDelay = (duration: number) => new Promise<void>((resolve) => {
      window.setTimeout(resolve, duration);
    });

    document.documentElement.classList.add("adp-page-loading");

    const criticalVisualsHaveLayout = () => {
      const chartSurfaces = Array.from(
        document.querySelectorAll<SVGSVGElement>(
          ".nfl-draft-dashboard .recharts-responsive-container svg.recharts-surface",
        ),
      );
      const matrix = document.querySelector<SVGSVGElement>(".nfl-matrix-svg");
      const chartsReady = chartSurfaces.length >= 2 && chartSurfaces.every((surface) => {
        const bounds = surface.getBoundingClientRect();
        return bounds.width > 180 && bounds.height > 180 && surface.querySelectorAll("path").length > 0;
      });
      const matrixBounds = matrix?.getBoundingClientRect();
      const matrixReady = Boolean(
        matrixBounds && matrixBounds.width > 180 && matrixBounds.height > 180,
      );

      return chartsReady && matrixReady;
    };

    const revealWhenReady = async () => {
      await Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        shortDelay(1600),
      ]);

      let stableFrames = 0;
      while (!cancelled && performance.now() - startedAt < readinessTimeoutMs) {
        await nextFrame();
        stableFrames = criticalVisualsHaveLayout() ? stableFrames + 1 : 0;
        if (stableFrames >= 3 && performance.now() - startedAt >= minimumDisplayMs) break;
      }

      if (cancelled) return;
      await nextFrame();
      await nextFrame();
      if (cancelled) return;

      document.documentElement.classList.remove("adp-page-loading");
      setReadinessPhase("exiting");
      exitTimer = setTimeout(() => {
        if (!cancelled) setReadinessPhase("hidden");
      }, 520);
    };

    void revealWhenReady();

    return () => {
      cancelled = true;
      document.documentElement.classList.remove("adp-page-loading");
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  return (
    <>
      {readinessPhase !== "hidden" ? (
        <div
          className={`adp-readiness adp-readiness--${readinessPhase}`}
          role="status"
          aria-live="polite"
          aria-label="Preparing the NFL Draft hit-rate dashboard"
        >
          <div className="adp-readiness-grid" aria-hidden="true" />
          <div className="adp-readiness-module">
            <span className="adp-readiness-kicker"><i aria-hidden="true" />DYNASTY HUB RESEARCH</span>
            <div className="adp-readiness-emblem" aria-hidden="true">
              <span className="adp-readiness-orbit adp-readiness-orbit--outer" />
              <span className="adp-readiness-orbit adp-readiness-orbit--inner" />
              <span className="adp-readiness-core">NFL</span>
              <i className="adp-readiness-node adp-readiness-node--one" />
              <i className="adp-readiness-node adp-readiness-node--two" />
              <i className="adp-readiness-node adp-readiness-node--three" />
            </div>
            <div className="adp-readiness-copy">
              <h2>NFL Draft Intelligence</h2>
              <p>Calibrating seven-round hit-rate models</p>
            </div>
            <div className="adp-readiness-progress" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </div>
            <div className="adp-readiness-signals" aria-hidden="true">
              <span><i />DATASET</span><span><i />CHARTS</span><span><i />MATRIX</span>
            </div>
          </div>
        </div>
      ) : null}

      <DynastyHubResearchShell activeResearchTab="nfl-draft" />

      <main className="nfl-draft-dashboard" aria-busy={readinessPhase !== "hidden"}>
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="dashboard-shell">
          <header className="topbar">
            <div className="brand">
              <span className="brand-mark"><i /><i /><i /></span>
              <span>Dynasty Hub Research</span>
            </div>
            <div className="sample-badge" aria-label="Sample: 2008 to 2022 NFL Draft classes; Rounds 1 to 7">
              <i className="sample-status-dot" aria-hidden="true" />
              <div>
                <strong>2008–2022 DRAFT CLASSES</strong>
                <small>RDS 1–7<em>✦</em>NFL DRAFT</small>
              </div>
            </div>
          </header>

          <section className="hero">
            <div className="eyebrow"><span>CAREER HIT STUDY</span><i /></div>
            <h1>Player Career Hit Rates<br /><em>by NFL Draft Capital.</em></h1>
            <p>
              Overall and positional hit probabilities across fifteen NFL Draft classes—tracking how often quarterbacks, running backs, wide receivers, and tight ends reach a career fantasy benchmark from Round 1 through Round 7.
            </p>
          </section>

          <section className="stat-grid nfl-stat-grid" aria-label="Overall hit probability by NFL Draft round">
            {statCards.map(({ range, shortRange, overall, note, mobileNote, palette, sequence }, index) => {
              const arcEnd = overall * 3.6;
              const cardStyle = {
                "--accent": palette.accent,
                "--accent-rgb": palette.rgb,
                "--ring-start": palette.start,
                "--ring-mid": palette.mid,
                "--ring-end": palette.end,
                "--arc-end": `${arcEnd}deg`,
                "--arc-mid": `${arcEnd / 2}deg`,
              } as NflStatCardStyle;
              const titleId = `nfl-stat-title-${index + 1}`;
              const noteId = `nfl-stat-note-${index + 1}`;

              return (
                <article
                  className="stat-card nfl-stat-card"
                  style={cardStyle}
                  aria-labelledby={titleId}
                  key={range}
                >
                  <div className="stat-top">
                    <div className="stat-heading">
                      <span className="stat-kicker">NFL ROUND</span>
                      <strong id={titleId}>{shortRange}</strong>
                    </div>
                    <span className="stat-index" aria-hidden="true"><i />{sequence}</span>
                  </div>

                  <div
                    className="stat-dial"
                    style={{ "--arc-end": `${arcEnd}deg`, "--arc-mid": `${arcEnd / 2}deg` } as CSSProperties}
                    role="meter"
                    aria-label={`${range} overall hit rate`}
                    aria-describedby={noteId}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={overall}
                    aria-valuetext={`${overall.toFixed(1)} percent`}
                  >
                    <span className="stat-arc-glow" aria-hidden="true" />
                    <span className="stat-arc" aria-hidden="true" />
                    <span className="stat-arc-echo" aria-hidden="true" />
                    <span className="stat-origin" aria-hidden="true" />
                    <span className="stat-cap" aria-hidden="true" />
                    <span className="stat-core" aria-hidden="true">
                      <strong className="stat-value">{overall.toFixed(1)}<small>%</small></strong>
                      <em>HIT RATE</em>
                    </span>
                  </div>

                  <div className="stat-note" id={noteId}>
                    <span className="stat-status" aria-hidden="true" />
                    <strong>
                      <span className="stat-note-desktop">{note}</span>
                      <span className="stat-note-mobile">{mobileNote}</span>
                    </strong>
                    <small aria-hidden="true">0—100</small>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="panel overall-panel">
            <div className="panel-header overall-header">
              <div>
                <span className="section-index">01 / OVERALL PROBABILITY</span>
                <h2>Overall Hit Rate by Draft Round</h2>
                <p>Aggregate Hit Probability · NFL Draft · Rounds 1–7</p>
              </div>
              <div className="overall-drop">
                <small>ROUND 1 → ROUND 7</small>
                <strong>−69.0<em> %</em></strong>
              </div>
            </div>
            <div className="overall-chart" role="img" aria-label="Area chart showing overall hit rate from NFL Draft Round 1 through Round 7">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={nflDraftTrendData}
                  margin={compactCharts ? { top: 24, right: 18, bottom: 4, left: -4 } : { top: 42, right: 34, bottom: 8, left: 0 }}
                >
                  <defs>
                    <linearGradient id="nflOverallLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff0aa5" />
                      <stop offset="32%" stopColor="#d747ff" />
                      <stop offset="66%" stopColor="#4d79ff" />
                      <stop offset="100%" stopColor="#00dcca" />
                    </linearGradient>
                    <linearGradient id="nflOverallArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b6cff" stopOpacity=".42" />
                      <stop offset="52%" stopColor="#4d79ff" stopOpacity=".13" />
                      <stop offset="100%" stopColor="#00dcca" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,.065)" strokeDasharray="2 9" />
                  <XAxis dataKey="shortRange" interval={0} axisLine={false} tickLine={false} tick={{ fill: "#b4bbcc", fontSize: compactCharts ? 8 : 10, fontWeight: 750 }} dy={12} />
                  <YAxis domain={[0, 90]} ticks={[0, 20, 40, 60, 80]} axisLine={false} tickLine={false} width={compactCharts ? 31 : 42} tickFormatter={(value) => `${value}%`} tick={{ fill: "#626b84", fontSize: compactCharts ? 8 : 10 }} />
                  <Tooltip content={<NflDraftTooltip />} cursor={{ stroke: "rgba(255,255,255,.15)", strokeDasharray: "3 6" }} />
                  <Area type="monotone" dataKey="overall" stroke="url(#nflOverallLine)" strokeWidth={4} fill="url(#nflOverallArea)" dot={{ r: compactCharts ? 4 : 6, fill: "#080f20", stroke: "#d747ff", strokeWidth: compactCharts ? 2 : 3 }} activeDot={{ r: 8, fill: "#fff", stroke: "#7866FF", strokeWidth: 4 }} isAnimationActive={false}>
                    <LabelList content={<OverallPercentLabel />} />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel trend-panel">
            <div className="trend-card-chrome">
              <div className="trend-card-number">02</div>
              <div className="trend-card-heading">
                <h2>Positional Hit Probabilities by Draft Round</h2>
                <div className="trend-card-meta-row">
                  <p>Positional Hit % · NFL Draft · Rounds 1–7</p>
                  <div className="legend" aria-label="Toggle positional chart lines">
                    {trendPositions.map((position) => {
                      const colors = nflDraftPositionGradients[position];
                      const isActive = !hiddenTrendPositions.includes(position);
                      return (
                        <button
                          type="button"
                          className={`legend-toggle${isActive ? "" : " is-inactive"}`}
                          aria-pressed={isActive}
                          aria-label={`${position} chart line ${isActive ? "shown" : "hidden"}`}
                          key={position}
                          onClick={() => toggleTrendPosition(position)}
                        >
                          <i
                            className="gradient-legend-mark"
                            style={{
                              background: `linear-gradient(270deg, ${colors.join(",")})`,
                              boxShadow: isActive ? `0 0 14px ${colors[3]}` : "none",
                            }}
                          />
                          {position}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="trend-chart" role="img" aria-label="Line chart showing positional hit rate across all seven NFL Draft rounds">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={nflDraftTrendData}
                  margin={compactCharts ? { top: 34, right: 30, bottom: 4, left: -5 } : { top: 38, right: 46, bottom: 5, left: 0 }}
                >
                  <defs>
                    {Object.entries(nflDraftPositionGradients).map(([position, colors]) => (
                      <linearGradient id={`nfl-line-${position}`} key={`line-${position}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor={colors[0]} />
                        <stop offset="33%" stopColor={colors[1]} />
                        <stop offset="67%" stopColor={colors[2]} />
                        <stop offset="100%" stopColor={colors[3]} />
                      </linearGradient>
                    ))}
                    {Object.entries(nflDraftPositionGradients).map(([position, colors]) => (
                      <linearGradient id={`nfl-area-${position}`} key={`area-${position}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor={colors[0]} stopOpacity=".01" />
                        <stop offset="55%" stopColor={colors[2]} stopOpacity=".045" />
                        <stop offset="100%" stopColor={colors[3]} stopOpacity=".09" />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,.07)" strokeDasharray="2 8" />
                  <XAxis dataKey="shortRange" interval={0} axisLine={false} tickLine={false} tick={{ fill: "#a8b0c7", fontSize: compactCharts ? 8 : 10, fontWeight: 650 }} dy={12} />
                  <YAxis domain={[0, 90]} ticks={[0, 20, 40, 60, 80]} axisLine={false} tickLine={false} width={compactCharts ? 31 : 42} tickFormatter={(value) => `${value}%`} tick={{ fill: "#626b84", fontSize: compactCharts ? 8 : 10 }} />
                  <Tooltip content={<NflDraftTooltip />} cursor={{ stroke: "rgba(255,255,255,.16)", strokeDasharray: "3 6" }} />
                  {trendPositions.filter((position) => !hiddenTrendPositions.includes(position)).map((position) => (
                    <Area key={`area-${position}`} type="monotone" dataKey={position} stroke="none" fill={`url(#nfl-area-${position})`} isAnimationActive={false} />
                  ))}
                  {trendPositions.filter((position) => !hiddenTrendPositions.includes(position)).map((position) => {
                    const colors = nflDraftPositionGradients[position];
                    const values = nflDraftTrendData.map((row) => row[position]);
                    return (
                      <Line
                        key={position}
                        type="monotone"
                        dataKey={position}
                        name={position}
                        stroke={`url(#nfl-line-${position})`}
                        strokeWidth={compactCharts ? 3 : 4}
                        dot={{ r: compactCharts ? 3.7 : 5, fill: colors[0], stroke: colors[3], strokeWidth: compactCharts ? 2 : 3 }}
                        activeDot={{ r: 7, fill: colors[3], stroke: "#07101d", strokeWidth: 4 }}
                        isAnimationActive={false}
                      >
                        <LabelList content={<PositionalPercentLabel position={position} values={values} compact={compactCharts} />} />
                      </Line>
                    );
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footnote"><span>NOTE</span> Every label reports the supplied position-by-round hit rate; legend controls isolate individual position paths.</div>
          </section>

          <section className="analysis-grid">
            <article className="panel comparison-panel matrix-panel nfl-matrix-panel">
              <div className="matrix-card-chrome">
                <div className="matrix-card-number">03</div>
                <div className="matrix-card-heading">
                  <div className="matrix-card-title-row">
                    <h2>Positional Hit % Quadrant Matrix</h2>
                    <span className="matrix-card-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m14.31 8 5.74 9.94" /><path d="M9.69 8h11.48" />
                        <path d="m7.38 12 5.74-9.94" /><path d="M9.69 16 3.95 6.06" />
                        <path d="M14.31 16H2.83" /><path d="m16.62 12-5.74 9.94" />
                      </svg>
                    </span>
                  </div>
                  <p>Seven concentric NFL Draft rounds inside each isolated position quadrant</p>
                </div>
              </div>
              <NflDraftQuadrantArcMatrix data={nflDraftTrendData} gradients={nflDraftPositionGradients} />
              <div className="chart-footnote"><span>KEY</span> Arc order runs from Round 1 outside to Round 7 inside; select any arc to isolate its position.</div>
            </article>

            <aside className="insight-stack">
              <article className="panel insight-hero">
                <span className="section-index">04 / SIGNAL</span>
                <div className="signal-orbit"><div className="signal-ring"><span>69.0<small>%</small></span></div></div>
                <h2>The cost of waiting</h2>
                <p>Overall hit probability falls <strong>69.0 percentage points</strong> from NFL Draft Round 1 to Round 7.</p>
                <div className="signal-scale">
                  <span><i style={{ width: "78.4%" }} /><b>78.4%</b><small>ROUND 1</small></span>
                  <span><i style={{ width: "9.4%" }} /><b>9.4%</b><small>ROUND 7</small></span>
                </div>
              </article>
              <article className="panel mini-insight rb-insight">
                <span className="mini-number">62.0%</span>
                <div><strong>RB retains a Round 3 pocket</strong><p>The position rebounds above its Round 2 hit rate.</p></div>
              </article>
              <article className="panel mini-insight te-insight">
                <span className="mini-number">4.0%</span>
                <div><strong>TE carries the lowest Round 7 rate</strong><p>The final round produces the study&apos;s thinnest position signal.</p></div>
              </article>
            </aside>
          </section>

          <section className="method-panel" aria-labelledby="nfl-study-frame-title">
            <div className="dataset-parameters">
              <span className="section-index">05 / STUDY FRAME</span>
              <span className="dataset-title">NFL DRAFT DATASET PARAMETERS</span>
              <div className="dataset-parameter-grid">
                {[
                  ["DRAFT CLASSES", "2008–2022", "#ff0aa5"],
                  ["DRAFT CAPITAL", "RDs 1–7", "#00FF99"],
                  ["POSITIONS", "QB–TE", "#0099FF"],
                ].map(([label, value, color]) => (
                  <div className="dataset-parameter" key={label}>
                    <span>{label}</span><strong style={{ color }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="method-heading">
              <span className="method-segment-label">HIT DEFINITION</span>
              <h2 id="nfl-study-frame-title">What counts as a hit?</h2>
            </div>
            <div className="method-definition">
              <span>PLAYER HIT</span>
              <strong>Threshold reached ≥ 1 time</strong>
              <p>Across the player&apos;s career</p>
            </div>
            <div className="threshold-grid">
              {[
                ["QB", "179", "#ff0aa5"], ["RB", "179", "#00FF99"],
                ["WR", "179", "#0099FF"], ["TE", "151", "#8F00FF"],
              ].map(([position, threshold, color]) => (
                <div className="threshold-item" key={position}>
                  <span style={{ color }}>{position}</span><strong>≥ {threshold}</strong><small>PPR FPTS</small>
                </div>
              ))}
            </div>
            <div className="benchmark-copy">
              <span>BENCHMARK</span>
              <p>Thresholds derived from the average minimum for <strong>QB2, RB2, WR2 and TE1</strong> PPR finishes.</p>
            </div>
          </section>

          <footer>
            <span>NFL DRAFT CAPITAL OUTCOME STUDY</span>
            <div className="palette-rail" aria-label="Chart color palettes">
              {["#ff0aa5", "#d747ff", "#8b6cff", "#4d79ff", "#00a9ff", "#00dcca", "#55e58f", "#F94095", "#00FF99", "#0099FF", "#8F00FF"].map((color, index) => <i key={`${color}-${index}`} style={{ background: color }} />)}
            </div>
            <span>2008–2022 SAMPLE</span>
          </footer>
        </div>
      </main>
    </>
  );
}
