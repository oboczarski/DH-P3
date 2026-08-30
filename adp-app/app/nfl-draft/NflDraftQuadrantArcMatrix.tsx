"use client";

import { arc } from "d3-shape";
import {
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import type {
  NflDraftPosition,
  NflDraftTrendRow,
} from "./data";

type MatrixGradientMap = Record<NflDraftPosition, readonly string[]>;

type NflDraftQuadrantArcMatrixProps = {
  data: readonly NflDraftTrendRow[];
  gradients: MatrixGradientMap;
};

type PolarPoint = { x: number; y: number };

type MatrixRange =
  | "RD 1"
  | "RD 2"
  | "RD 3"
  | "RD 4"
  | "RD 5"
  | "RD 6"
  | "RD 7";

type MatrixTooltip = {
  x: number;
  y: number;
  position: NflDraftPosition;
  range: MatrixRange;
  value: number;
};

const rangeDefinitions = [
  { source: "Round 1", label: "RD 1" },
  { source: "Round 2", label: "RD 2" },
  { source: "Round 3", label: "RD 3" },
  { source: "Round 4", label: "RD 4" },
  { source: "Round 5", label: "RD 5" },
  { source: "Round 6", label: "RD 6" },
  { source: "Round 7", label: "RD 7" },
] as const;

const positions: NflDraftPosition[] = ["QB", "RB", "WR", "TE"];
const quadrantStartAngles = [-35, 55, 145, 235];

// NFL matrix arc geometry: the seven fourteen-pixel bars keep their existing
// size and spacing while the guide rings below occupy only the gaps between them.
const rangeRadii = [221, 199, 177, 155, 133, 111, 89];
const guideRings = [
  { radius: 78, stroke: "rgba(132,151,196,0.0)" },
  { radius: 78, stroke: "rgba(132,151,196,0.22)" },
  { radius: 100, stroke: "rgba(132,151,196,0.22)" },
  { radius: 122, stroke: "rgba(132,151,196,0.22)" },
  { radius: 144, stroke: "rgba(132,151,196,0.22)" },
  { radius: 166, stroke: "rgba(132,151,196,0.22)" },
  { radius: 188, stroke: "rgba(132,151,196,0.22)" },
  { radius: 210, stroke: "rgba(132,151,196,0.22)" },
  { radius: 238, stroke: "rgba(132,151,196,0.22)" },
] as const;
const annularArc = arc();

const matrixGradientDirections = {
  QB: { x1: "0%", x2: "100%", y1: "50%", y2: "50%" },
  RB: { x1: "0%", x2: "100%", y1: "0%", y2: "100%" },
  WR: { x1: "100%", x2: "0%", y1: "50%", y2: "50%" },
  TE: { x1: "50%", x2: "50%", y1: "100%", y2: "0%" },
} satisfies Record<NflDraftPosition, { x1: string; x2: string; y1: string; y2: string }>;

const dividerAngles = [
  { angle: 45, rotation: 45 },
  { angle: 135, rotation: -45 },
  { angle: 225, rotation: 45 },
  { angle: 315, rotation: -45 },
] as const;

const labelPlacement = {
  QB: { dx: 6, dy: 0, textAnchor: "start", dominantBaseline: "central" },
  RB: { dx: 0, dy: 6, textAnchor: "middle", dominantBaseline: "hanging" },
  WR: { dx: -6, dy: 0, textAnchor: "end", dominantBaseline: "central" },
  TE: { dx: 0, dy: -6, textAnchor: "middle", dominantBaseline: "auto" },
} as const;

// Equal or near-equal late-round values can terminate on adjacent radial rails.
// These horizontal micro-slots spread only the affected labels, retaining every
// value and its direct visual relationship to the endpoint dot.
const matrixLabelNudges: Record<NflDraftPosition, readonly { dx: number; dy: number }[]> = {
  QB: rangeDefinitions.map(() => ({ dx: 0, dy: 0 })),
  RB: [
    { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 },
    { dx: 15, dy: 0 }, { dx: 3, dy: 0 }, { dx: -3, dy: 0 }, { dx: -9, dy: 0 },
  ],
  WR: rangeDefinitions.map(() => ({ dx: 0, dy: 0 })),
  TE: [
    { dx: 0, dy: 0 }, { dx: -6, dy: 0 }, { dx: 6, dy: 0 },
    { dx: 0, dy: 0 }, { dx: -6, dy: 0 }, { dx: 0, dy: 0 }, { dx: 6, dy: 0 },
  ],
};

// NFL side-label spacing: TE and RB now use the same outer radius as QB/WR,
// adding clearance from their arcs without changing the SVG viewport or chart.
const positionLabelRadius = {
  QB: 252,
  RB: 252,
  WR: 252,
  TE: 252,
} satisfies Record<NflDraftPosition, number>;

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function polarPoint(radius: number, angle: number): PolarPoint {
  const radians = degreesToRadians(angle);
  return {
    x: Math.sin(radians) * radius,
    y: -Math.cos(radians) * radius,
  };
}

function arcPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  cornerRadius = 4,
) {
  return (
    annularArc.cornerRadius(cornerRadius)({
      innerRadius,
      outerRadius,
      startAngle: degreesToRadians(startAngle),
      endAngle: degreesToRadians(endAngle),
    }) ?? ""
  );
}

function formatMatrixPercent(value: number) {
  return `${Math.round(value)}%`;
}

function formatOverallPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function MatrixDefinitions({ gradients }: { gradients: MatrixGradientMap }) {
  return (
    <defs>
      {positions.map((position) => {
        const colors = gradients[position];
        const direction = matrixGradientDirections[position];
        return (
          <linearGradient id={`nfl-matrix-${position}`} key={position} {...direction}>
            {colors.map((color, index) => (
              <stop
                key={`${position}-${color}-${index}`}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        );
      })}

      {/* NFL matrix knob: these route-local layers reproduce the stat-core
          bezel, navy face, neutral highlight, and inset depth. */}
      <linearGradient id="nfl-matrix-core-bezel" x1="20%" y1="4%" x2="80%" y2="96%">
        <stop offset="0%" stopColor="#18223a" />
        <stop offset="34%" stopColor="#091020" />
        <stop offset="100%" stopColor="#02050d" />
      </linearGradient>
      <linearGradient id="nfl-matrix-core-base" x1="18%" y1="4%" x2="82%" y2="96%">
        <stop offset="0%" stopColor="#0f1930" />
        <stop offset="72%" stopColor="#050914" />
        <stop offset="100%" stopColor="#040712" />
      </linearGradient>
      <radialGradient id="nfl-matrix-core-highlight" cx="33%" cy="24%" r="48%">
        <stop offset="0%" stopColor="#2c3d66" stopOpacity="0.62" />
        <stop offset="58%" stopColor="#2c3d66" stopOpacity="0.20" />
        <stop offset="100%" stopColor="#2c3d66" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="nfl-matrix-core-depth" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0" />
        <stop offset="48%" stopColor="#000000" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.50" />
      </linearGradient>

      <filter id="nfl-matrix-core-shadow" x="-45%" y="-45%" width="190%" height="210%">
        <feDropShadow
          dx="0"
          dy="8"
          stdDeviation="7"
          floodColor="#000000"
          floodOpacity="0.38"
        />
      </filter>

      <filter id="nfl-matrix-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export default function NflDraftQuadrantArcMatrix({
  data,
  gradients,
}: NflDraftQuadrantArcMatrixProps) {
  const [selectedPosition, setSelectedPosition] = useState<NflDraftPosition | "ALL">("ALL");
  const [tooltip, setTooltip] = useState<MatrixTooltip | null>(null);

  const matrixData = useMemo(
    () => positions.map((position) => ({
      position,
      colors: gradients[position],
      values: Object.fromEntries(
        rangeDefinitions.map(({ source, label }) => {
          const row = data.find((item) => item.range === source);
          return [label, row?.[position] ?? 0];
        }),
      ) as Record<MatrixRange, number>,
    })),
    [data, gradients],
  );

  const roundOneOverall = data.find((row) => row.range === "Round 1")?.overall ?? 0;

  const togglePosition = (position: NflDraftPosition) => {
    setSelectedPosition((current) => (current === position ? "ALL" : position));
  };

  const handleKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    position: NflDraftPosition,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePosition(position);
    }
  };

  const showTooltip = (
    event: PointerEvent<SVGGElement>,
    position: NflDraftPosition,
    range: MatrixRange,
    value: number,
  ) => {
    setTooltip({
      x: Math.max(12, Math.min(event.clientX + 16, window.innerWidth - 242)),
      y: Math.max(12, Math.min(event.clientY + 16, window.innerHeight - 138)),
      position,
      range,
      value,
    });
  };

  return (
    <div className="viz-shell matrix-shell nfl-matrix-shell">
      <svg
        viewBox="36 36 548 548"
        className="viz-svg matrix-svg nfl-matrix-svg"
        role="img"
        aria-labelledby="nfl-quadrant-matrix-title nfl-quadrant-matrix-description"
      >
        <title id="nfl-quadrant-matrix-title">NFL Draft positional quadrant arc matrix</title>
        <desc id="nfl-quadrant-matrix-description">
          Hit rates for quarterbacks, running backs, wide receivers, and tight ends across
          all seven NFL Draft rounds on a shared zero to one hundred percent scale.
        </desc>
        <MatrixDefinitions gradients={gradients} />

        <g transform="translate(310 310)">
          {guideRings.map(({ radius, stroke }, index) => (
            <circle
              key={`${radius}-${index}`}
              r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              aria-hidden="true"
              strokeDasharray="1 2"
            />
          ))}

          {dividerAngles.map(({ angle, rotation }) => {
            // NFL divider bounds terminate exactly on the innermost and
            // outermost guide rings instead of projecting beyond the matrix.
            const start = polarPoint(78, angle);
            const end = polarPoint(238, angle);
            return (
              <g key={angle} aria-hidden="true" data-nfl-matrix-divider={angle}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(177,196,238,.11)"
                  strokeWidth="1"
                />
                {rangeDefinitions.map(({ label }, rangeIndex) => {
                  const labelPoint = polarPoint(rangeRadii[rangeIndex], angle);
                  return (
                    <text
                      x={labelPoint.x}
                      y={labelPoint.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="matrix-divider-label nfl-matrix-divider-label"
                      key={label}
                      transform={`rotate(${rotation} ${labelPoint.x} ${labelPoint.y})`}
                    >
                      {label.replace(" ", "")}
                    </text>
                  );
                })}
              </g>
            );
          })}

          {matrixData.map(({ position, colors, values }, positionIndex) => {
            const startAngle = quadrantStartAngles[positionIndex];
            const positionPoint = polarPoint(positionLabelRadius[position], startAngle + 35);
            const opacity = selectedPosition === "ALL" || selectedPosition === position ? 1 : 0.18;

            return (
              <g key={position} data-nfl-matrix-quadrant={position}>
                <text
                  x={positionPoint.x}
                  y={positionPoint.y - 3}
                  textAnchor="middle"
                  className="matrix-position nfl-matrix-position"
                  fill={colors[1]}
                  opacity={opacity}
                >
                  {position}
                </text>
                <text
                  x={positionPoint.x}
                  y={positionPoint.y + 12}
                  textAnchor="middle"
                  className="matrix-position-caption nfl-matrix-position-caption"
                  opacity={opacity}
                >
                  POSITION
                </text>

                {rangeDefinitions.map(({ label }, rangeIndex) => {
                  const value = values[label];
                  const radius = rangeRadii[rangeIndex];
                  const endAngle = startAngle + (70 * value) / 100;
                  const point = polarPoint(radius, endAngle);
                  const nudge = matrixLabelNudges[position][rangeIndex];
                  const placement = {
                    x: point.x + labelPlacement[position].dx + nudge.dx,
                    y: point.y + labelPlacement[position].dy + nudge.dy,
                    textAnchor: labelPlacement[position].textAnchor,
                    dominantBaseline: labelPlacement[position].dominantBaseline,
                  };
                  const accessibleLabel = `${position} · ${label}: ${formatMatrixPercent(value)}`;

                  return (
                    <g
                      className="viz-hit-target"
                      role="button"
                      tabIndex={0}
                      aria-label={accessibleLabel}
                      aria-pressed={selectedPosition === position}
                      opacity={opacity}
                      data-position={position}
                      data-range={label}
                      data-value={value}
                      key={label}
                      onClick={() => togglePosition(position)}
                      onKeyDown={(event) => handleKeyDown(event, position)}
                      onPointerMove={(event) => showTooltip(event, position, label, value)}
                      onPointerLeave={() => setTooltip(null)}
                    >
                      <title>{accessibleLabel}</title>
                      <path
                        d={arcPath(radius - 7, radius + 7, startAngle, startAngle + 70, 7)}
                        fill="rgba(151,169,212,.07)"
                        stroke="rgba(192,205,240,.065)"
                        strokeWidth="1"
                      />
                      <path
                        d={arcPath(radius - 7, radius + 7, startAngle, endAngle, 7)}
                        fill={`url(#nfl-matrix-${position})`}
                        filter="url(#nfl-matrix-glow)"
                      />
                      <circle cx={point.x} cy={point.y} r="3.25" fill="#f7fbff" />
                      <text
                        x={placement.x}
                        y={placement.y}
                        textAnchor={placement.textAnchor}
                        dominantBaseline={placement.dominantBaseline}
                        className="matrix-value nfl-matrix-value"
                      >
                        {formatMatrixPercent(value)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* NFL-only knob construction mirrors the progress-circle centers:
              raised bezel, recessed rim, bordered face, inset depth, and sheen. */}
          <g
            className="nfl-matrix-core-stack"
            aria-hidden="true"
            filter="url(#nfl-matrix-core-shadow)"
          >
            <circle
              r="72"
              fill="url(#nfl-matrix-core-bezel)"
              stroke="rgba(255,255,255,.075)"
              strokeWidth="1"
            />
            <circle
              r="69.5"
              fill="#02050d"
              stroke="rgba(3,7,17,.92)"
              strokeWidth="2.5"
            />
            <circle
              r="66"
              fill="url(#nfl-matrix-core-base)"
              stroke="rgba(50,50,55,0.685)"
              strokeWidth="2"
            />
            <circle r="67" fill="url(#nfl-matrix-core-highlight)" />
            <circle r="67" fill="#3342" />
            <circle r="67" fill="url(#nfl-matrix-core-depth)" />
            <circle
              r="63"
              fill="none"
              stroke="rgba(115,120,125,.055)"
              strokeWidth="1"
            />
            <path
              d={arcPath(61.5, 62.5, -66, 36, 1)}
              fill="rgba(255,255,255,.05)"
            />
          </g>
          <text y="-20" textAnchor="middle" className="core-eyebrow nfl-core-eyebrow">
            OVERALL · RD 1
          </text>
          <text y="11" textAnchor="middle" className="core-value nfl-core-value">
            {formatOverallPercent(roundOneOverall)}
          </text>
          <text y="31" textAnchor="middle" className="core-label nfl-core-label">
            HIT PROBABILITY
          </text>
        </g>
      </svg>

      {tooltip ? (
        <div
          className="matrix-data-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          role="status"
        >
          <strong>{tooltip.position} · {tooltip.range}</strong>
          <div><span>Hit rate</span><b>{formatMatrixPercent(tooltip.value)}</b></div>
          <div><span>NFL round</span><b>{tooltip.range}</b></div>
        </div>
      ) : null}
    </div>
  );
}
