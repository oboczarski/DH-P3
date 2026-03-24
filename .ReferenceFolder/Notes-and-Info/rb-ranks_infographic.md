import React from "react"

const METRICS = [
  { key: "ypc", label: "Yards Per Carry", short: "YPC" },
  { key: "ycoa", label: "Yards After Contact Per Attempt", short: "YCO/A" },
  { key: "mtfa", label: "Missed Tackles Forced Per Attempt", short: "MTF/A" },
  { key: "ryoe", label: "Rush Yards Over Expected", short: "RYOE" },
  { key: "explsv", label: "Explosive Rush Rate", short: "EXPLSV%" },
  { key: "impg", label: "Impact Plays (TD + 1D) Per Game", short: "IMP/G" },
  { key: "recypg", label: "Receiving Yards Per Game", short: "recYPG" },
  { key: "ts", label: "Target Share", short: "TS%" },
]

const PLAYERS = [
  {
    name: "De'Von Achane",
    pos: "RB",
    team: "MIA",
    ypc: 1,
    ycoa: 1,
    mtfa: 2,
    ryoe: 4,
    explsv: 1,
    impg: 5,
    recypg: 4,
    ts: 3,
    avg: 2.6,
  },
  {
    name: "Bijan Robinson",
    pos: "RB",
    team: "ATL",
    ypc: 4,
    ycoa: 5,
    mtfa: 3,
    ryoe: 3,
    explsv: 8,
    impg: 3,
    recypg: 2,
    ts: 2,
    avg: 3.8,
  },
  {
    name: "Jonathan Taylor",
    pos: "RB",
    team: "IND",
    ypc: 9,
    ycoa: 7,
    mtfa: 12,
    ryoe: 5,
    explsv: 15,
    impg: 2,
    recypg: 11,
    ts: 8,
    avg: 8.6,
  },
  {
    name: "Jahmyr Gibbs",
    pos: "RB",
    team: "DET",
    ypc: 8,
    ycoa: 38,
    mtfa: 9,
    ryoe: 6,
    explsv: 16,
    impg: 5,
    recypg: 3,
    ts: 4,
    avg: 11.1,
  },
  {
    name: "Jaylen Warren",
    pos: "RB",
    team: "PIT",
    ypc: 20,
    ycoa: 4,
    mtfa: 1,
    ryoe: 8,
    explsv: 17,
    impg: 15,
    recypg: 15,
    ts: 21,
    avg: 12.6,
  },
  {
    name: "James Cook",
    pos: "RB",
    team: "BUF",
    ypc: 2,
    ycoa: 13,
    mtfa: 30,
    ryoe: 2,
    explsv: 7,
    impg: 9,
    recypg: 23,
    ts: 23,
    avg: 13.6,
  },
  {
    name: "Kenneth Gainwell",
    pos: "RB",
    team: "PIT",
    ypc: 14,
    ycoa: 15,
    mtfa: 16,
    ryoe: 25,
    explsv: 6,
    impg: 27,
    recypg: 5,
    ts: 5,
    avg: 14.1,
  },
  {
    name: "Kyren Williams",
    pos: "RB",
    team: "LAR",
    ypc: 11,
    ycoa: 9,
    mtfa: 20,
    ryoe: 7,
    explsv: 23,
    impg: 4,
    recypg: 28,
    ts: 18,
    avg: 15.0,
  },
  {
    name: "Chase Brown",
    pos: "RB",
    team: "CIN",
    ypc: 25,
    ycoa: 18,
    mtfa: 17,
    ryoe: 24,
    explsv: 20,
    impg: 15,
    recypg: 8,
    ts: 7,
    avg: 16.8,
  },
  {
    name: "Derrick Henry",
    pos: "RB",
    team: "BAL",
    ypc: 3,
    ycoa: 2,
    mtfa: 39,
    ryoe: 1,
    explsv: 10,
    impg: 5,
    recypg: 40,
    ts: 37,
    avg: 17.1,
  },
]

const average = (arr) => arr.reduce((sum, n) => sum + n, 0) / arr.length
const min = (arr) => Math.min(...arr)
const inverseScore = (rank, maxRank = 40) => Math.max(0, Math.min(100, ((maxRank + 1 - rank) / maxRank) * 100))

const panelClass =
  "rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.35)]"

function IconBadge({ children }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      {children}
    </div>
  )
}

function StatPill({ children, tone = "default" }) {
  const toneClass =
    tone === "elite"
      ? "border-[#d0b472]/35 bg-[linear-gradient(135deg,rgba(208,180,114,0.18),rgba(255,255,255,0.04))] text-[#f7dfb0]"
      : tone === "strong"
        ? "border-sky-300/20 bg-[linear-gradient(135deg,rgba(88,130,214,0.24),rgba(77,121,255,0.10))] text-[#e9f4ff]"
        : tone === "mid"
          ? "border-white/10 bg-[linear-gradient(135deg,rgba(64,83,116,0.28),rgba(255,255,255,0.03))] text-white/75"
          : tone === "weak"
            ? "border-fuchsia-300/15 bg-[linear-gradient(135deg,rgba(95,3,223,0.20),rgba(255,10,165,0.06))] text-[#f3e8ff]"
            : "border-white/10 bg-white/[0.06] text-white/70"

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${toneClass}`}>
      {children}
    </span>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(208,180,114,0.95),rgba(255,255,255,0.95))]"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

const getCellStyle = (rank) => {
  if (rank <= 5) {
    return {
      background: "linear-gradient(135deg, rgba(208,180,114,0.26), rgba(255,255,255,0.06))",
      border: "1px solid rgba(208,180,114,0.30)",
      color: "#f7dfb0",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(208,180,114,0.05)",
    }
  }
  if (rank <= 10) {
    return {
      background: "linear-gradient(135deg, rgba(88,130,214,0.26), rgba(77,121,255,0.10))",
      border: "1px solid rgba(121,163,255,0.22)",
      color: "#eef6ff",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    }
  }
  if (rank <= 20) {
    return {
      background: "linear-gradient(135deg, rgba(56,72,98,0.34), rgba(255,255,255,0.03))",
      border: "1px solid rgba(130,156,196,0.14)",
      color: "rgba(255,255,255,0.82)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
    }
  }
  return {
    background: "linear-gradient(135deg, rgba(95,3,223,0.18), rgba(255,10,165,0.07))",
    border: "1px solid rgba(186,113,255,0.18)",
    color: "#f5ebff",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  }
}

const getAvgTone = (avg) => {
  if (avg <= 5) {
    return {
      wrap: {
        background: "linear-gradient(180deg, rgba(20,28,40,0.95), rgba(14,20,31,0.88))",
        border: "1px solid rgba(208,180,114,0.24)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 18px 34px rgba(208,180,114,0.07)",
      },
      accent: "bg-[linear-gradient(90deg,rgba(208,180,114,0),rgba(208,180,114,0.95),rgba(255,244,216,0.95),rgba(208,180,114,0.95),rgba(208,180,114,0))]",
      value: "text-[#fff2cf]",
      label: "text-[#ead4a0]",
    }
  }
  if (avg <= 10) {
    return {
      wrap: {
        background: "linear-gradient(180deg, rgba(18,27,42,0.95), rgba(13,19,30,0.88))",
        border: "1px solid rgba(121,163,255,0.20)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 18px 34px rgba(88,130,214,0.07)",
      },
      accent: "bg-[linear-gradient(90deg,rgba(88,130,214,0),rgba(88,130,214,0.95),rgba(230,242,255,0.92),rgba(88,130,214,0.95),rgba(88,130,214,0))]",
      value: "text-[#edf6ff]",
      label: "text-sky-100/75",
    }
  }
  if (avg <= 15) {
    return {
      wrap: {
        background: "linear-gradient(180deg, rgba(23,31,44,0.95), rgba(15,21,32,0.88))",
        border: "1px solid rgba(138,158,188,0.16)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      accent: "bg-[linear-gradient(90deg,rgba(120,142,173,0),rgba(120,142,173,0.72),rgba(214,224,237,0.78),rgba(120,142,173,0.72),rgba(120,142,173,0))]",
      value: "text-white/88",
      label: "text-white/45",
    }
  }
  return {
    wrap: {
      background: "linear-gradient(180deg, rgba(28,23,44,0.95), rgba(18,16,31,0.90))",
      border: "1px solid rgba(186,113,255,0.16)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 18px 34px rgba(122,53,170,0.07)",
    },
    accent: "bg-[linear-gradient(90deg,rgba(164,105,255,0),rgba(164,105,255,0.88),rgba(245,235,255,0.88),rgba(164,105,255,0.88),rgba(164,105,255,0))]",
    value: "text-[#f5ecff]",
    label: "text-fuchsia-100/55",
  }
}

function buildDerivedPlayers() {
  return PLAYERS.map((player) => {
    const metricValues = METRICS.map((metric) => player[metric.key])
    const top3 = metricValues.filter((v) => v <= 3).length
    const top5 = metricValues.filter((v) => v <= 5).length
    const rushingComposite = average([player.ypc, player.ycoa, player.mtfa, player.ryoe, player.explsv])
    const receivingComposite = average([player.recypg, player.ts])
    const bestMetric = METRICS.reduce((best, metric) => {
      if (!best || player[metric.key] < player[best.key]) return metric
      return best
    }, null)

    return {
      ...player,
      top3,
      top5,
      rushingComposite,
      receivingComposite,
      bestMetric,
    }
  })
}

function runDataChecks(players) {
  return [
    { label: "10 players loaded", pass: players.length === 10 },
    { label: "8 metrics loaded", pass: METRICS.length === 8 },
    {
      label: "Average-rank leader is De'Von Achane",
      pass: [...players].sort((a, b) => a.avg - b.avg)[0]?.name === "De'Von Achane",
    },
    {
      label: "Best receiving composite is Bijan Robinson",
      pass: [...players].sort((a, b) => a.receivingComposite - b.receivingComposite)[0]?.name === "Bijan Robinson",
    },
    {
      label: "Worst average rank is Derrick Henry",
      pass: [...players].sort((a, b) => b.avg - a.avg)[0]?.name === "Derrick Henry",
    },
    {
      label: "Every player row has all metric values",
      pass: players.every((player) => METRICS.every((metric) => typeof player[metric.key] === "number")),
    },
    {
      label: "AVG conditional formatting buckets resolve for all players",
      pass: players.every((player) => !!getAvgTone(player.avg)?.accent),
    },
  ]
}

function AvgCell({ avg }) {
  const tone = getAvgTone(avg)

  return (
    <div className="relative flex h-full min-h-[72px] flex-col items-center justify-center overflow-hidden rounded-2xl px-2 py-3" style={tone.wrap}>
      <div className={`pointer-events-none absolute inset-x-3 top-2 h-[3px] rounded-full opacity-95 ${tone.accent}`} />
      <div className={`text-lg font-semibold ${tone.value}`}>{avg.toFixed(1)}</div>
      <div className={`text-[10px] uppercase tracking-[0.18em] ${tone.label}`}>avg</div>
    </div>
  )
}

function SectionTitle({ icon, eyebrow, title, subtitle }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <IconBadge>{icon}</IconBadge>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/52">{eyebrow}</p>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-white/68">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default function RBRankingInfographic() {
  const players = buildDerivedPlayers()
  const sortedByAvg = [...players].sort((a, b) => a.avg - b.avg)
  const sortedByRushing = [...players].sort((a, b) => a.rushingComposite - b.rushingComposite)
  const sortedByReceiving = [...players].sort((a, b) => a.receivingComposite - b.receivingComposite)

  const bestOverall = sortedByAvg[0]
  const runnerUp = sortedByAvg[1]
  const bestRusher = sortedByRushing[0]
  const bestReceiver = sortedByReceiving[0]

  const metricLeaders = METRICS.map((metric) => {
    const bestRank = min(players.map((player) => player[metric.key]))
    const leaders = players.filter((player) => player[metric.key] === bestRank)
    return { ...metric, bestRank, leaders }
  })

  const takeaways = [
    `${bestOverall.name} is the overall leader with a ${bestOverall.avg.toFixed(1)} average rank and no category rank worse than fifth.`,
    `${runnerUp.name} is the strongest all-around challenger, pairing top-end efficiency with one of the best receiving profiles.`,
    `${bestRusher.name} owns the best five-metric rushing composite, while ${bestReceiver.name} leads the receiving-side composite.`,
    `Derrick Henry and James Cook remain strong on ground-efficiency metrics, but weaker receiving ranks materially raise their overall average.`,
  ]

  const insightCards = [
    {
      icon: "👑",
      eyebrow: "Best overall average",
      title: bestOverall.name,
      detail: `${bestOverall.avg.toFixed(1)} average rank`,
      sub: `${bestOverall.top5}/8 top-5 placements with elite category balance.`,
    },
    {
      icon: "🥈",
      eyebrow: "Closest challenger",
      title: runnerUp.name,
      detail: `${runnerUp.avg.toFixed(1)} average rank`,
      sub: `${runnerUp.top3}/8 top-3 finishes and strong dual-threat positioning.`,
    },
    {
      icon: "🏃",
      eyebrow: "Best rushing composite",
      title: bestRusher.name,
      detail: `${bestRusher.rushingComposite.toFixed(1)} avg across 5 rushing metrics`,
      sub: `Best pure rushing score driven by top-end efficiency and explosiveness.`,
    },
    {
      icon: "🎯",
      eyebrow: "Best receiving footprint",
      title: bestReceiver.name,
      detail: `${bestReceiver.receivingComposite.toFixed(1)} avg across recYPG + TS%`,
      sub: `Best combination of receiving yardage rank and target share rank.`,
    },
  ]

  const checks = runDataChecks(players)

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#07111f] text-white">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(88,130,214,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(208,180,114,0.16),transparent_24%),radial-gradient(circle_at_70%_30%,rgba(255,10,165,0.12),transparent_24%),linear-gradient(180deg,#07111f_0%,#081525_38%,#07101a_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.10),transparent_18%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_20%)]" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-8 md:px-8 xl:px-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            <span className="text-[#d0b472]">✦</span>
            RB Ranking Infographic
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
            <div className="min-w-0 space-y-6">
              <div className={`${panelClass} relative overflow-hidden p-6 md:p-8`}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(208,180,114,0.12),transparent_32%)]" />
                <div className="relative">
                  <div className="mb-3 flex items-center gap-3">
                    <IconBadge>📊</IconBadge>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Lower rank = better performance</p>
                      <h1 className="mt-1 text-3xl font-semibold leading-tight md:text-5xl">Rushing + Receiving Rank Profile</h1>
                    </div>
                  </div>
                  <p className="max-w-[900px] text-sm leading-7 text-white/72 md:text-[15px]">
                    Single-page comparison of 10 RBs across eight ranking-based efficiency and usage metrics. The board highlights category leaders, overall average rank, and where each profile is strongest or most vulnerable.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {insightCards.map((card) => (
                  <div key={card.title + card.eyebrow} className={`${panelClass} relative overflow-hidden p-5`}>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(208,180,114,0.10),transparent_30%)]" />
                    <div className="relative">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/52">{card.eyebrow}</p>
                        <IconBadge>{card.icon}</IconBadge>
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight text-white">{card.title}</h2>
                      <p className="mt-1 text-sm font-medium text-[#f5deb3]">{card.detail}</p>
                      <p className="mt-3 text-sm leading-6 text-white/68">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`${panelClass} overflow-hidden p-5 md:p-6`}>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/52">Full leaderboard</p>
                    <h3 className="mt-1 text-2xl font-semibold">Overall average rank</h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Sorted best to worst</div>
                </div>

                <div className="space-y-3">
                  {sortedByAvg.map((player, index) => (
                    <div
                      key={player.name}
                      className={`rounded-[24px] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                        index === 0
                          ? "border-[#d0b472]/35 bg-[linear-gradient(135deg,rgba(208,180,114,0.18),rgba(255,255,255,0.05))]"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-base font-semibold text-white/90">{index + 1}</div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[15px] font-semibold text-white">{player.name}</p>
                            <StatPill>{player.team}</StatPill>
                            <StatPill>Top-3: {player.top3}</StatPill>
                            <StatPill>Top-5: {player.top5}</StatPill>
                          </div>
                          <div className="mt-3">
                            <ProgressBar value={inverseScore(player.avg, 40)} />
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-semibold text-[#f5deb3]">{player.avg.toFixed(1)}</p>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">avg rank</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${panelClass} overflow-hidden p-5 md:p-6`}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/52">Rank matrix</p>
                    <h3 className="mt-1 text-2xl font-semibold">Player-by-player category ranks</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatPill tone="elite">1–5 elite</StatPill>
                    <StatPill tone="strong">6–10 strong</StatPill>
                    <StatPill tone="mid">11–20 mid</StatPill>
                    <StatPill tone="weak">21+ weak</StatPill>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[980px]">
                    <div className="grid grid-cols-[220px_repeat(8,minmax(72px,1fr))_96px] gap-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/48">
                      <div className="px-3">Player</div>
                      {METRICS.map((metric) => (
                        <div key={metric.key} className="px-2 text-center">{metric.short}</div>
                      ))}
                      <div className="px-3 text-center">AVG</div>
                    </div>

                    <div className="space-y-2">
                      {sortedByAvg.map((player) => (
                        <div
                          key={player.name}
                          className="grid grid-cols-[220px_repeat(8,minmax(72px,1fr))_96px] gap-2 rounded-[24px] border border-white/10 bg-white/[0.03] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        >
                          <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{player.name}</p>
                              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">{player.team} • {player.pos}</p>
                            </div>
                          </div>

                          {METRICS.map((metric) => (
                            <div
                              key={player.name + metric.key}
                              className="flex min-h-[72px] items-center justify-center rounded-2xl px-2 py-3 text-sm font-semibold"
                              style={getCellStyle(player[metric.key])}
                            >
                              {player[metric.key]}
                            </div>
                          ))}

                          <AvgCell avg={player.avg} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${panelClass} p-5 md:p-6`}>
                <SectionTitle icon="🧪" eyebrow="Sanity checks" title="Embedded data tests" />
                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                  {checks.map((check) => (
                    <div
                      key={check.label}
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        check.pass
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                          : "border-rose-400/20 bg-rose-400/10 text-rose-100"
                      }`}
                    >
                      <div className="mb-1 text-base">{check.pass ? "✓" : "✕"}</div>
                      <div className="leading-6">{check.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-6">
              <div className={`${panelClass} p-6 md:p-7`}>
                <SectionTitle icon="📈" eyebrow="Average-rank leaderboard" title="Top five by AVG" subtitle="Overall ordering by the provided AVG column." />
                <div className="space-y-3">
                  {sortedByAvg.slice(0, 5).map((player, index) => (
                    <div
                      key={player.name}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-semibold text-white/90">{index + 1}</div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{player.name}</p>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/45">{player.team} • {player.pos}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-[#f5deb3]">{player.avg.toFixed(1)}</p>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">avg rank</p>
                        </div>
                      </div>
                      <ProgressBar value={inverseScore(player.avg, 40)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${panelClass} p-5 md:p-6`}>
                <SectionTitle icon="🏅" eyebrow="Category leaders" title="Best rank in each metric" />
                <div className="space-y-3">
                  {metricLeaders.map((metric) => (
                    <div
                      key={metric.key}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{metric.label}</p>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">{metric.short}</p>
                        </div>
                        <StatPill tone="elite">Rank {metric.bestRank}</StatPill>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {metric.leaders.map((leader) => (
                          <span
                            key={metric.key + leader.name}
                            className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/82"
                          >
                            {leader.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${panelClass} p-5 md:p-6`}>
                <SectionTitle icon="🧠" eyebrow="Key readouts" title="Analytical takeaways" />
                <div className="space-y-3">
                  {takeaways.map((line, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/74"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${panelClass} flex items-center justify-center p-6`}>
                <div className="text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">Best overall</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{bestOverall.name}</div>
                  <div className="mt-1 text-[#f5deb3]">{bestOverall.avg.toFixed(1)} avg rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
