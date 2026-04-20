const PLAYERS = [
  { name: "Jeremiyah Love", grade: 94, tier: 1, pos: "RB" },
  { name: "Fernando Mendoza", grade: 90, tier: 2, pos: "QB" },
  { name: "Carnell Tate", grade: 89, tier: 2, pos: "WR" },
  { name: "Makai Lemon", grade: 88, tier: 2, pos: "WR" },
  { name: "Jordyn Tyson", grade: 87, tier: 2, pos: "WR" },
  { name: "KC Concepcion", grade: 84, tier: 3, pos: "WR" },
  { name: "Kenyon Sadiq", grade: 80, tier: 3, pos: "TE" },
  { name: "Omar Cooper", grade: 81, tier: 3, pos: "WR" },
  { name: "Denzel Boston", grade: 80, tier: 3, pos: "WR" },
  { name: "Jadarian Price", grade: 74, tier: 4, pos: "RB" },
  { name: "Ty Simpson", grade: 76, tier: 4, pos: "QB" },
  { name: "Eli Stowers", grade: 77, tier: 4, pos: "TE" },
  { name: "Mike Washington", grade: 73, tier: 4, pos: "RB" },
  { name: "Jonah Coleman", grade: 72, tier: 4, pos: "RB" },
  { name: "Elijah Sarratt", grade: 75, tier: 4, pos: "WR" },
  { name: "Emmett Johnson", grade: 70, tier: 4, pos: "RB" }
];

const TIER_LABELS = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
  4: "Tier 4"
};

const TIER_KEYS = [2, 3, 4];
const REFERENCE_CENTER_X = 600;
const REFERENCE_CENTER_Y = 600;

const GEOMETRY = {
  centerNodeRadius: 102,
  centerScale: 0.955,
  outerScale: 1.08,
  backdropInset: 18,
  chartPadding: { top: 12, right: 10, bottom: 10, left: 10 },
  coreOrbit3Radius: 170,
  coreRingInnerRadius: 128,
  bands: {
    2: { radius: 214, width: 76, nodeRadius: 58, angles: [0, 106, 180, 276] },
    3: { radius: 324, width: 74, nodeRadius: 52, angles: [56, 140, 228, 318] },
    4: {
      radius: 434,
      width: 72,
      nodeRadius: 46,
      angles: [34, 72, 126, 180, 234, 288, 326]
    }
  },
  radialOffsets: {
    "Jonah Coleman": 34,
    "Emmett Johnson": 34
  }
};

const shellEl = document.querySelector(".chart-shell");
const chartEl = document.getElementById("posChart");
const chart = echarts.init(chartEl, null, {
  renderer: "canvas",
  useDirtyRect: true
});

function cssVar(styles, name, fallback = "") {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

function cssNum(styles, name, fallback = 0) {
  const value = Number.parseFloat(cssVar(styles, name));
  return Number.isFinite(value) ? value : fallback;
}

function cssList(styles, name, fallback) {
  const matches = cssVar(styles, name).match(/-?\d*\.?\d+/g);
  return matches ? matches.map(Number.parseFloat) : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function alpha(color, value) {
  return echarts.color.modifyAlpha(color, value);
}

function isVisiblePaint(paint) {
  if (!paint || paint === "transparent" || paint === "none") {
    return false;
  }

  if (typeof paint !== "string") {
    return true;
  }

  const rgba = paint.match(/rgba?\(([^)]+)\)/i);

  if (!rgba) {
    return true;
  }

  const parts = rgba[1].split(",").map((part) => Number.parseFloat(part.trim()));

  return parts.length < 4 || parts[3] > 0.002;
}

function formatShortName(name) {
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.length === 1 ? name : `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

function polarToCartesian(cx, cy, radius, angleFromTop) {
  const angle = ((angleFromTop - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}

function vectorFromAngle(angleFromTop) {
  const angle = ((angleFromTop - 90) * Math.PI) / 180;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

function expandBounds(bounds, x, y, radius) {
  bounds.minX = Math.min(bounds.minX, x - radius);
  bounds.maxX = Math.max(bounds.maxX, x + radius);
  bounds.minY = Math.min(bounds.minY, y - radius);
  bounds.maxY = Math.max(bounds.maxY, y + radius);
}

function buildTierMap(builder) {
  return {
    2: builder(2),
    3: builder(3),
    4: builder(4)
  };
}

const REFERENCE_PLAYERS = (() => {
  const tierIndices = { 2: 0, 3: 0, 4: 0 };

  return PLAYERS.map((player) => {
    if (player.tier === 1) {
      return {
        ...player,
        shortName: formatShortName(player.name),
        angle: 0,
        x: REFERENCE_CENTER_X,
        y: REFERENCE_CENTER_Y,
        nodeRadius: GEOMETRY.centerNodeRadius
      };
    }

    const band = GEOMETRY.bands[player.tier];
    const angle = band.angles[tierIndices[player.tier]++];
    const radius = band.radius + (GEOMETRY.radialOffsets[player.name] || 0);
    const point = polarToCartesian(REFERENCE_CENTER_X, REFERENCE_CENTER_Y, radius, angle);

    return {
      ...player,
      shortName: formatShortName(player.name),
      angle,
      x: point.x,
      y: point.y,
      nodeRadius: band.nodeRadius
    };
  });
})();

const REFERENCE_EXTENTS = (() => {
  const bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  const outerBand = GEOMETRY.bands[4];

  expandBounds(
    bounds,
    REFERENCE_CENTER_X,
    REFERENCE_CENTER_Y,
    outerBand.radius + outerBand.nodeRadius + GEOMETRY.backdropInset
  );
  expandBounds(bounds, REFERENCE_CENTER_X, REFERENCE_CENTER_Y, GEOMETRY.coreOrbit3Radius);

  REFERENCE_PLAYERS.forEach((player) => {
    expandBounds(
      bounds,
      player.x,
      player.y,
      player.tier === 1 ? player.nodeRadius + 34 : player.nodeRadius + 15
    );
  });

  return {
    left: REFERENCE_CENTER_X - bounds.minX,
    right: bounds.maxX - REFERENCE_CENTER_X,
    top: REFERENCE_CENTER_Y - bounds.minY,
    bottom: bounds.maxY - REFERENCE_CENTER_Y
  };
})();

function readTheme() {
  const styles = getComputedStyle(shellEl);
  const tierColor = (tier) => cssVar(styles, `--tier-${tier}`);

  return {
    fontFamily: cssVar(
      styles,
      "--chart-font-family",
      '"Product Sans", "Google Sans", sans-serif'
    ),
    text: {
      strong: cssVar(styles, "--chart-text-strong", "#fff"),
      name: cssVar(styles, "--chart-text-name", "rgba(255,255,255,0.94)")
    },
    tooltip: {
      background: cssVar(styles, "--chart-tooltip-bg", "rgba(7,11,28,0.96)"),
      border: cssVar(styles, "--chart-tooltip-border", "rgba(255,255,255,0.08)"),
      muted: cssVar(styles, "--chart-tooltip-text-muted", "rgba(255,255,255,0.7)"),
      shadow: cssVar(styles, "--chart-tooltip-shadow", "0 16px 48px rgba(0,0,0,0.45)"),
      radius: cssVar(styles, "--chart-tooltip-radius", "14px"),
      padding: cssVar(styles, "--chart-tooltip-padding", "10px 12px")
    },
    positions: {
      QB: cssVar(styles, "--pos-qb", "#fc3688"),
      RB: cssVar(styles, "--pos-rb", "#25f4c5"),
      WR: cssVar(styles, "--pos-wr", "#48d1ff"),
      TE: cssVar(styles, "--pos-te", "#8d63ff")
    },
    tiers: {
      1: { color: tierColor(1), label: TIER_LABELS[1] },
      2: { color: tierColor(2), label: TIER_LABELS[2] },
      3: { color: tierColor(3), label: TIER_LABELS[3] },
      4: { color: tierColor(4), label: TIER_LABELS[4] }
    },
    bands: buildTierMap((tier) => ({
      stroke: cssVar(styles, `--tier-${tier}-band-stroke`),
      fill: cssVar(styles, `--tier-${tier}-band-fill`)
    })),
    graphics: {
      outerBackdropFill: cssVar(styles, "--chart-outer-backdrop-fill"),
      outerBackdropStroke: cssVar(styles, "--chart-outer-backdrop-stroke"),
      outerAccentStroke: cssVar(styles, "--chart-outer-accent-stroke"),
      bandEdgeInner: cssVar(styles, "--chart-band-edge-inner"),
      bandEdgeOuter: cssVar(styles, "--chart-band-edge-outer"),
      coreOrbitStroke: cssVar(styles, "--chart-core-orbit-3-stroke"),
      coreRingInnerStroke: cssVar(styles, "--chart-core-ring-inner-stroke"),
      bandDash: {
        aMin: cssNum(styles, "--chart-band-dash-a-min", 0.25),
        aScale: cssNum(styles, "--chart-band-dash-a-scale", 1),
        bMin: cssNum(styles, "--chart-band-dash-b-min", 4),
        bScale: cssNum(styles, "--chart-band-dash-b-scale", 1)
      },
      bandRingWidth: {
        min: cssNum(styles, "--chart-band-ring-line-min", 21),
        scale: cssNum(styles, "--chart-band-ring-line-scale", 15)
      },
      coreRingInnerDash: {
        aMin: cssNum(styles, "--chart-core-ring-inner-dash-a-min", 1),
        aScale: cssNum(styles, "--chart-core-ring-inner-dash-a-scale", 2.2),
        bMin: cssNum(styles, "--chart-core-ring-inner-dash-b-min", 1),
        bScale: cssNum(styles, "--chart-core-ring-inner-dash-b-scale", 1.4)
      },
      coreRingInnerWidth: {
        min: cssNum(styles, "--chart-core-ring-inner-line-min", 1),
        scale: cssNum(styles, "--chart-core-ring-inner-line-scale", 21.4)
      }
    },
    connectors: {
      opacity: cssNum(styles, "--connector-opacity", 0.62),
      shadowBlurMin: cssNum(styles, "--connector-shadow-blur-min", 4),
      shadowBlurScale: cssNum(styles, "--connector-shadow-blur-scale", 6.2),
      gradient: {
        start: cssNum(styles, "--connector-gradient-start-alpha", 0.04),
        mid: cssNum(styles, "--connector-gradient-mid-alpha", 0.48),
        end: cssNum(styles, "--connector-gradient-end-alpha", 0.84),
        tail: cssNum(styles, "--connector-gradient-tail-alpha", 0.28)
      },
      highlight: {
        widthFactor: cssNum(styles, "--connector-highlight-width-factor", 0.34),
        start: cssNum(styles, "--connector-highlight-start-alpha", 0.04),
        mid: cssNum(styles, "--connector-highlight-mid-alpha", 0.18),
        end: cssNum(styles, "--connector-highlight-end-alpha", 0.24)
      },
      tiers: buildTierMap((tier) => ({
        color: cssVar(styles, `--connector-tier-${tier}-color`, tierColor(tier)),
        widthMin: cssNum(styles, `--connector-tier-${tier}-width-min`, 1),
        widthScale: cssNum(styles, `--connector-tier-${tier}-width-scale`, 4)
      }))
    },
    nodes: {
      haloOpacity: {
        center: cssNum(styles, "--chart-node-halo-opacity-center", 0.06),
        outer: cssNum(styles, "--chart-node-halo-opacity-outer", 0.091)
      },
      haloBlur: {
        center: cssNum(styles, "--chart-node-halo-blur-center", 6),
        outer: cssNum(styles, "--chart-node-halo-blur-outer", 6),
        tiers: buildTierMap((tier) =>
          cssNum(styles, `--chart-node-halo-blur-tier-${tier}`, 6)
        )
      },
      haloSpread: {
        center: {
          min: cssNum(styles, "--chart-node-halo-spread-center-min", 16),
          scale: cssNum(styles, "--chart-node-halo-spread-center-scale", 34)
        },
        tiers: buildTierMap((tier) => ({
          min: cssNum(styles, `--chart-node-halo-spread-tier-${tier}-min`, 5),
          scale: cssNum(styles, `--chart-node-halo-spread-tier-${tier}-scale`, 11)
        }))
      },
      shadowFill: cssVar(styles, "--chart-node-sphere-shadow-fill", "rgba(3,8,20,0.6)"),
      shadowOffset: {
        center: cssNum(styles, "--chart-node-sphere-shadow-offset-center", 0.08),
        outer: cssNum(styles, "--chart-node-sphere-shadow-offset-outer", 0.12)
      },
      fill: {
        center: cssVar(styles, "--chart-node-shell-fill-center", "rgba(255,255,255,0.06)"),
        tiers: buildTierMap((tier) => cssVar(styles, `--chart-node-fill-tier-${tier}`))
      },
      shell: {
        highlight: {
          center: cssNum(styles, "--chart-node-shell-highlight-alpha-center", 0.2),
          outer: cssNum(styles, "--chart-node-shell-highlight-alpha-outer", 0.12)
        },
        edge: {
          center: cssNum(styles, "--chart-node-shell-edge-alpha-center", 0.42),
          outer: cssNum(styles, "--chart-node-shell-edge-alpha-outer", 0.3)
        }
      },
      rim: {
        alpha: {
          center: cssNum(styles, "--chart-node-rim-alpha-center", 0.96),
          outer: cssNum(styles, "--chart-node-rim-alpha-outer", 0.88)
        },
        width: {
          center: {
            min: cssNum(styles, "--chart-node-rim-width-center-min", 2.4),
            factor: cssNum(styles, "--chart-node-rim-width-center-factor", 0.082)
          },
          outer: {
            min: cssNum(styles, "--chart-node-rim-width-outer-min", 1.2),
            factor: cssNum(styles, "--chart-node-rim-width-outer-factor", 0.094)
          }
        },
        inner: {
          color: cssVar(styles, "--chart-node-inner-rim-color", "rgba(255,255,255,1)"),
          alpha: {
            center: cssNum(styles, "--chart-node-inner-rim-alpha-center", 0.18),
            outer: cssNum(styles, "--chart-node-inner-rim-alpha-outer", 0.12)
          },
          width: {
            center: cssNum(styles, "--chart-node-inner-rim-width-center", 1.35),
            outer: cssNum(styles, "--chart-node-inner-rim-width-outer", 0.9)
          }
        }
      },
      sphere: {
        edgeShadow: cssVar(styles, "--chart-node-sphere-edge-shadow", "rgba(6,10,24,0.94)"),
        specularCore: cssVar(styles, "--chart-node-sphere-specular-core", "rgba(255,255,255,0.98)"),
        specularSoft: cssVar(styles, "--chart-node-sphere-specular-soft", "rgba(255,255,255,0.58)"),
        specularGlint: cssVar(styles, "--chart-node-sphere-specular-glint", "rgba(255,255,255,0.82)"),
        highlightFade: cssVar(styles, "--chart-node-sphere-highlight-fade", "rgba(255,255,255,0)"),
        colorAlpha: {
          inner: cssNum(styles, "--chart-node-sphere-color-alpha-inner", 0.22),
          mid: cssNum(styles, "--chart-node-sphere-color-alpha-mid", 0.5),
          edge: cssNum(styles, "--chart-node-sphere-color-alpha-edge", 0.96)
        }
      },
      specular: {
        offset: {
          center: {
            x: cssNum(styles, "--chart-node-specular-offset-x-center", -0.52),
            y: cssNum(styles, "--chart-node-specular-offset-y-center", -0.72)
          },
          outer: {
            x: cssNum(styles, "--chart-node-specular-offset-x-outer", -0.2),
            y: cssNum(styles, "--chart-node-specular-offset-y-outer", -0.3)
          }
        },
        radius: {
          center: cssNum(styles, "--chart-node-specular-radius-center", 0.17),
          outer: cssNum(styles, "--chart-node-specular-radius-outer", 0.48)
        },
        opacity: {
          center: cssNum(styles, "--chart-node-specular-opacity-center", 0.04),
          outer: cssNum(styles, "--chart-node-specular-opacity-outer", 0.26)
        }
      },
      glint: {
        offset: {
          center: {
            x: cssNum(styles, "--chart-node-glint-offset-x-center", -0.22),
            y: cssNum(styles, "--chart-node-glint-offset-y-center", -0.52)
          },
          outer: {
            x: cssNum(styles, "--chart-node-glint-offset-x-outer", -0.12),
            y: cssNum(styles, "--chart-node-glint-offset-y-outer", -0.36)
          }
        },
        size: {
          center: cssNum(styles, "--chart-node-glint-size-center", 0.09),
          outer: cssNum(styles, "--chart-node-glint-size-outer", 0.12)
        },
        alpha: {
          center: cssNum(styles, "--chart-node-glint-alpha-center", 0.26),
          outer: cssNum(styles, "--chart-node-glint-alpha-outer", 0.58)
        }
      },
      centerInner: {
        fill: cssVar(styles, "--chart-node-inner-fill-center", "rgba(18,10,39,0.42)"),
        stroke: cssVar(styles, "--chart-node-inner-stroke-center", "rgba(255,255,255,0.16)"),
        strokeWidth: cssNum(styles, "--chart-node-inner-stroke-width-center", 1)
      },
      centerGradient: {
        start1: cssVar(styles, "--chart-center-gradient-stop-1", "rgba(246,237,255,0.98)"),
        start2: cssVar(styles, "--chart-center-gradient-stop-2", "rgba(196,162,244,0.94)"),
        end: cssVar(styles, "--chart-center-gradient-stop-4", "rgba(40,11,82,1)")
      },
      nameChip: {
        padding: {
          center: cssList(styles, "--chart-name-chip-padding-center", [1, 5, 3, 4]),
          outer: cssList(styles, "--chart-name-chip-padding-outer", [1, 3, 2, 3])
        },
        bg: {
          center: cssVar(styles, "--chart-name-chip-bg-center", "rgba(10,16,36,0.28)"),
          outer: cssVar(styles, "--chart-name-chip-bg-outer", "rgba(33,41,55,0.9)")
        },
        borderWidth: cssNum(styles, "--chart-name-chip-border-width", 1),
        borderRadius: cssNum(styles, "--chart-name-chip-border-radius", 999),
        borderAlpha: {
          center: cssNum(styles, "--chart-name-chip-border-alpha-center", 0.5),
          outer: cssNum(styles, "--chart-name-chip-border-alpha-outer", 0.38)
        },
        shadowBlur: {
          center: cssNum(styles, "--chart-name-chip-shadow-blur-center", 3),
          outer: cssNum(styles, "--chart-name-chip-shadow-blur-outer", 2)
        },
        shadowAlpha: {
          center: cssNum(styles, "--chart-name-chip-shadow-alpha-center", 0.3),
          outer: cssNum(styles, "--chart-name-chip-shadow-alpha-outer", 0.32)
        }
      }
    },
    type: {
      stackGap: {
        center: cssNum(styles, "--chart-pos-grade-gap-center", 1.15),
        outer: cssNum(styles, "--chart-pos-grade-gap-outer", 0.55)
      },
      posLift: {
        center: cssNum(styles, "--chart-pos-label-lift-center", 6),
        outer: cssNum(styles, "--chart-pos-label-lift-outer", 3.2)
      },
      pos: {
        center: {
          weight: cssNum(styles, "--chart-pos-font-weight-center", 700),
          factor: cssNum(styles, "--chart-pos-font-factor-center", 0.31),
          min: cssNum(styles, "--chart-pos-font-min-center", 14),
          max: cssNum(styles, "--chart-pos-font-max-center", 14.3)
        },
        outer: {
          weight: cssNum(styles, "--chart-pos-font-weight-outer", 700),
          factor: cssNum(styles, "--chart-pos-font-factor-outer", 0.42),
          min: cssNum(styles, "--chart-pos-font-min-outer", 8.5),
          max: cssNum(styles, "--chart-pos-font-max-outer", 9.5),
          bumpByTier: buildTierMap((tier) =>
            cssNum(styles, `--chart-pos-font-bump-tier-${tier}`, 0)
          )
        },
        shadow: {
          color: cssVar(styles, "--chart-pos-shadow-color", "rgba(0,0,0,0.58)"),
          blur: {
            center: cssNum(styles, "--chart-pos-shadow-blur-center", 4.2),
            outer: cssNum(styles, "--chart-pos-shadow-blur-outer", 2.2)
          },
          offsetX: cssNum(styles, "--chart-pos-shadow-offset-x", 0),
          offsetY: cssNum(styles, "--chart-pos-shadow-offset-y", 0.7),
          underlay: {
            center: {
              color: cssVar(styles, "--chart-pos-underlay-color-center", "rgba(4,1,12,0.9)"),
              bump: cssNum(styles, "--chart-pos-underlay-size-bump-center", 0.1),
              offsetX: cssNum(styles, "--chart-pos-underlay-offset-x-center", 0.3),
              offsetY: cssNum(styles, "--chart-pos-underlay-offset-y-center", 1.05)
            },
            outer: {
              color: cssVar(styles, "--chart-pos-underlay-color-outer", "rgba(4,1,12,0.82)"),
              bump: cssNum(styles, "--chart-pos-underlay-size-bump-outer", 0.05),
              offsetX: cssNum(styles, "--chart-pos-underlay-offset-x-outer", 0.15),
              offsetY: cssNum(styles, "--chart-pos-underlay-offset-y-outer", 0.8)
            },
            tier3: {
              color: cssVar(styles, "--chart-pos-underlay-color-tier-3", "rgba(4,1,12,0.9)"),
              bump: cssNum(styles, "--chart-pos-underlay-size-bump-tier-3", 0.08),
              offsetX: cssNum(styles, "--chart-pos-underlay-offset-x-tier-3", 0.2),
              offsetY: cssNum(styles, "--chart-pos-underlay-offset-y-tier-3", 0.95)
            }
          }
        }
      },
      grade: {
        center: {
          weight: cssNum(styles, "--chart-grade-font-weight-center", 400),
          factor: cssNum(styles, "--chart-grade-font-factor-center", 1),
          min: cssNum(styles, "--chart-grade-font-min-center", 42),
          max: cssNum(styles, "--chart-grade-font-max-center", 42)
        },
        outer: {
          weight: cssNum(styles, "--chart-grade-font-weight-outer", 400),
          factor: cssNum(styles, "--chart-grade-font-factor-outer", 0.82),
          min: cssNum(styles, "--chart-grade-font-min-outer", 9.2),
          max: cssNum(styles, "--chart-grade-font-max-outer", 13.4),
          bumpByTier: buildTierMap((tier) =>
            cssNum(styles, `--chart-grade-font-bump-tier-${tier}`, 0)
          )
        },
        shadow: {
          color: cssVar(styles, "--chart-grade-shadow-color-center", "rgba(3,1,12,0.98)"),
          blur: cssNum(styles, "--chart-grade-shadow-blur-center", 10.5),
          offsetX: cssNum(styles, "--chart-grade-shadow-offset-x-center", 0.45),
          offsetY: cssNum(styles, "--chart-grade-shadow-offset-y-center", 2.2),
          underlayColor: cssVar(styles, "--chart-grade-underlay-color-center", "rgba(2,1,10,0.96)"),
          underlayBump: cssNum(styles, "--chart-grade-underlay-size-bump-center", 0.15),
          underlayOffsetX: cssNum(styles, "--chart-grade-underlay-offset-x-center", 0.65),
          underlayOffsetY: cssNum(styles, "--chart-grade-underlay-offset-y-center", 2.85)
        }
      },
      name: {
        weight: cssNum(styles, "--chart-name-font-weight", 400),
        center: {
          factor: cssNum(styles, "--chart-name-font-factor-center", 0.34),
          min: cssNum(styles, "--chart-name-font-min-center", 11),
          max: cssNum(styles, "--chart-name-font-max-center", 14.2)
        },
        outer: {
          factor: cssNum(styles, "--chart-name-font-factor-outer", 0.5),
          min: cssNum(styles, "--chart-name-font-min-outer", 6),
          max: cssNum(styles, "--chart-name-font-max-outer", 8.5),
          floor: cssNum(styles, "--chart-name-font-floor-outer", 5.7),
          midCutoff: cssNum(styles, "--chart-name-font-mid-cutoff", 10),
          midReduction: cssNum(styles, "--chart-name-font-mid-reduction", 0.5),
          longCutoff: cssNum(styles, "--chart-name-font-long-cutoff", 13),
          longReduction: cssNum(styles, "--chart-name-font-long-reduction", 0.9)
        }
      }
    }
  };
}

function getOuterNameSize(shortName, nodeRadius, nameTheme) {
  let size = clamp(nodeRadius * nameTheme.factor, nameTheme.min, nameTheme.max);

  if (shortName.length >= nameTheme.longCutoff) {
    size -= nameTheme.longReduction;
  } else if (shortName.length >= nameTheme.midCutoff) {
    size -= nameTheme.midReduction;
  }

  return Math.max(nameTheme.floor, size);
}

function computeLayout(width, height, theme) {
  const { chartPadding } = GEOMETRY;
  const availableWidth = width - chartPadding.left - chartPadding.right;
  const availableHeight = height - chartPadding.top - chartPadding.bottom;
  const scale =
    Math.min(
      availableWidth / (2 * Math.max(REFERENCE_EXTENTS.left, REFERENCE_EXTENTS.right)),
      availableHeight / (2 * Math.max(REFERENCE_EXTENTS.top, REFERENCE_EXTENTS.bottom))
    ) * 0.985;
  const center = {
    x: chartPadding.left + availableWidth / 2,
    y: chartPadding.top + availableHeight / 2
  };
  const bands = TIER_KEYS.map((tier) => ({
    tier,
    radius: GEOMETRY.bands[tier].radius * scale,
    width: GEOMETRY.bands[tier].width * scale
  }));
  const players = REFERENCE_PLAYERS.map((player) => {
    const isCenter = player.tier === 1;
    const posTheme = isCenter ? theme.type.pos.center : theme.type.pos.outer;
    const gradeTheme = isCenter ? theme.type.grade.center : theme.type.grade.outer;
    const nameTheme = isCenter ? theme.type.name.center : theme.type.name.outer;
    const nodeRadius =
      player.nodeRadius * scale * (isCenter ? GEOMETRY.centerScale : GEOMETRY.outerScale);
    const posFontSize =
      clamp(nodeRadius * posTheme.factor, posTheme.min, posTheme.max) +
      (isCenter ? 0 : posTheme.bumpByTier[player.tier] || 0);
    const gradeFontSize =
      clamp(nodeRadius * gradeTheme.factor, gradeTheme.min, gradeTheme.max) +
      (isCenter ? 0 : gradeTheme.bumpByTier[player.tier] || 0);
    const posGap = isCenter ? theme.type.stackGap.center : theme.type.stackGap.outer;
    const posSeparation = Math.round(
      (posFontSize * (isCenter ? 0.58 : 0.54) +
        gradeFontSize * (isCenter ? 0.62 : 0.58)) /
        2 +
        posGap
    );

    return {
      ...player,
      color: theme.tiers[player.tier].color,
      posColor: theme.positions[player.pos],
      x: center.x + (player.x - REFERENCE_CENTER_X) * scale,
      y: center.y + (player.y - REFERENCE_CENTER_Y) * scale,
      nodeRadius,
      shellRadius: isCenter ? nodeRadius + Math.max(7, 10 * scale) : nodeRadius,
      haloRadius:
        nodeRadius +
        Math.max(
          isCenter
            ? theme.nodes.haloSpread.center.min
            : theme.nodes.haloSpread.tiers[player.tier].min,
          (isCenter
            ? theme.nodes.haloSpread.center.scale
            : theme.nodes.haloSpread.tiers[player.tier].scale) * scale
        ),
      innerRadius: isCenter ? Math.max(14, nodeRadius - Math.max(4, 14 * scale)) : 0,
      posFontSize,
      gradeFontSize,
      posSeparation,
      gradeOffsetY: isCenter ? -nodeRadius * 0.01 : nodeRadius * 0.04,
      nameFontSize: isCenter
        ? clamp(nodeRadius * nameTheme.factor, nameTheme.min, nameTheme.max)
        : getOuterNameSize(player.shortName, nodeRadius, nameTheme),
      nameOffsetY: isCenter
        ? nodeRadius * 0.73
        : player.tier === 4
          ? nodeRadius * 0.81
          : player.tier === 3
            ? nodeRadius * 0.75
            : nodeRadius * 0.68
    };
  });

  let bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  const outerBackdropRadius =
    (GEOMETRY.bands[4].radius + GEOMETRY.bands[4].nodeRadius + GEOMETRY.backdropInset) *
    scale;

  expandBounds(bounds, center.x, center.y, outerBackdropRadius);
  expandBounds(bounds, center.x, center.y, GEOMETRY.coreOrbit3Radius * scale);
  players.forEach((player) => expandBounds(bounds, player.x, player.y, player.haloRadius));

  let shiftX = 0;
  let shiftY = 0;
  const minX = chartPadding.left;
  const maxX = width - chartPadding.right;
  const minY = chartPadding.top;
  const maxY = height - chartPadding.bottom;

  if (bounds.minX < minX) {
    shiftX = minX - bounds.minX;
  } else if (bounds.maxX > maxX) {
    shiftX = maxX - bounds.maxX;
  }

  if (bounds.minY < minY) {
    shiftY = minY - bounds.minY;
  } else if (bounds.maxY > maxY) {
    shiftY = maxY - bounds.maxY;
  }

  const shiftedPlayers =
    shiftX || shiftY
      ? players.map((player) => ({
          ...player,
          x: player.x + shiftX,
          y: player.y + shiftY
        }))
      : players;

  return {
    width,
    height,
    scale,
    bands,
    center: { x: center.x + shiftX, y: center.y + shiftY },
    outerBackdropRadius,
    coreOrbit3Radius: GEOMETRY.coreOrbit3Radius * scale,
    coreRingInnerRadius: GEOMETRY.coreRingInnerRadius * scale,
    players: shiftedPlayers,
    centerPlayer: shiftedPlayers.find((player) => player.tier === 1),
    outerPlayers: shiftedPlayers.filter((player) => player.tier !== 1)
  };
}

function dashPair(config, scale) {
  return [
    Math.max(config.aMin, config.aScale * scale),
    Math.max(config.bMin, config.bScale * scale)
  ];
}

function connectorGradient(path, theme, isHighlight) {
  const { start, end, color } = path;
  const stops = isHighlight
    ? [
        { offset: 0, color: alpha(theme.text.strong, theme.connectors.highlight.start) },
        { offset: 0.36, color: alpha(theme.text.strong, theme.connectors.highlight.mid) },
        { offset: 0.84, color: alpha(color, theme.connectors.highlight.end) },
        { offset: 1, color: alpha(color, 0) }
      ]
    : [
        { offset: 0, color: alpha(theme.text.strong, theme.connectors.gradient.start) },
        {
          offset: 0.24,
          color: alpha(theme.text.strong, theme.connectors.gradient.start * 0.72)
        },
        { offset: 0.52, color: alpha(color, theme.connectors.gradient.mid) },
        { offset: 0.86, color: alpha(color, theme.connectors.gradient.end) },
        { offset: 1, color: alpha(color, theme.connectors.gradient.tail) }
      ];

  return new echarts.graphic.LinearGradient(
    start[0],
    start[1],
    end[0],
    end[1],
    stops,
    true
  );
}

function buildConnectorPaths(layout, theme) {
  const startRadius =
    layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale);

  return layout.outerPlayers.map((player) => {
    const direction = vectorFromAngle(player.angle);
    const tierTheme = theme.connectors.tiers[player.tier];
    const start = [
      layout.center.x + direction.x * startRadius,
      layout.center.y + direction.y * startRadius
    ];
    const end = [
      player.x - direction.x * player.shellRadius,
      player.y - direction.y * player.shellRadius
    ];

    return {
      tier: player.tier,
      color: tierTheme.color,
      start,
      end,
      coords: [start, end],
      width: Math.max(tierTheme.widthMin, tierTheme.widthScale * layout.scale),
      shadowBlur: Math.max(
        theme.connectors.shadowBlurMin,
        theme.connectors.shadowBlurScale * layout.scale
      )
    };
  });
}

function buildConnectorSeries(paths, theme, isHighlight) {
  return {
    type: "lines",
    coordinateSystem: "cartesian2d",
    polyline: false,
    silent: true,
    z: isHighlight ? 3 : 2,
    data: paths.map((path) => ({
      coords: path.coords,
      lineStyle: {
        color: connectorGradient(path, theme, isHighlight),
        width: path.width * (isHighlight ? theme.connectors.highlight.widthFactor : 1),
        opacity: isHighlight ? 1 : theme.connectors.opacity,
        shadowColor: path.color,
        shadowBlur: isHighlight ? 0 : path.shadowBlur,
        cap: "round"
      }
    }))
  };
}

function pushCircle(target, cx, cy, radius, fill, stroke, lineWidth, style = {}) {
  if (
    (!isVisiblePaint(fill) || radius <= 0) &&
    (!isVisiblePaint(stroke) || !lineWidth || radius <= 0)
  ) {
    return;
  }

  target.push({
    type: "circle",
    silent: true,
    shape: { cx, cy, r: radius },
    style: {
      fill,
      stroke,
      lineWidth,
      ...style
    }
  });
}

function buildGraphics(layout, theme) {
  const elements = [];
  const bandDash = dashPair(theme.graphics.bandDash, layout.scale);
  const innerDash = dashPair(theme.graphics.coreRingInnerDash, layout.scale);
  const bandRingWidth = Math.max(
    theme.graphics.bandRingWidth.min,
    theme.graphics.bandRingWidth.scale * layout.scale
  );

  pushCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.outerBackdropRadius,
    theme.graphics.outerBackdropFill,
    theme.graphics.outerBackdropStroke,
    1
  );

  pushCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.bands[layout.bands.length - 1].radius +
      layout.bands[layout.bands.length - 1].width / 2 +
      Math.max(2, 8 * layout.scale),
    "transparent",
    theme.graphics.outerAccentStroke,
    1
  );

  layout.bands.forEach((band) => {
    const bandTheme = theme.bands[band.tier];

    pushCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius,
      "transparent",
      bandTheme.fill,
      band.width
    );
    pushCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius,
      "transparent",
      bandTheme.stroke,
      bandRingWidth,
      { lineDash: bandDash }
    );
    pushCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius - band.width / 2,
      "transparent",
      theme.graphics.bandEdgeInner,
      1
    );
    pushCircle(
      elements,
      layout.center.x,
      layout.center.y,
      band.radius + band.width / 2,
      "transparent",
      theme.graphics.bandEdgeOuter,
      1
    );
  });

  pushCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.coreOrbit3Radius,
    "transparent",
    theme.graphics.coreOrbitStroke,
    1
  );

  pushCircle(
    elements,
    layout.center.x,
    layout.center.y,
    layout.coreRingInnerRadius,
    "transparent",
    theme.graphics.coreRingInnerStroke,
    Math.max(
      theme.graphics.coreRingInnerWidth.min,
      theme.graphics.coreRingInnerWidth.scale * layout.scale
    ),
    { lineDash: innerDash }
  );

  return elements;
}

function shellGradient(color, fillColor, theme, isCenter) {
  return new echarts.graphic.RadialGradient(0.28, 0.24, 1, [
    { offset: 0, color: alpha(theme.text.strong, isCenter ? theme.nodes.shell.highlight.center : theme.nodes.shell.highlight.outer) },
    { offset: 0.22, color: alpha(color, theme.nodes.sphere.colorAlpha.inner * 0.52) },
    { offset: 0.74, color: fillColor },
    { offset: 1, color: alpha(color, isCenter ? theme.nodes.shell.edge.center : theme.nodes.shell.edge.outer) }
  ]);
}

function outerBodyGradient(color, fillColor, theme) {
  return new echarts.graphic.RadialGradient(0.34, 0.26, 0.94, [
    { offset: 0, color: alpha(theme.text.strong, 0.12) },
    { offset: 0.16, color: alpha(color, theme.nodes.sphere.colorAlpha.inner) },
    { offset: 0.48, color: alpha(color, theme.nodes.sphere.colorAlpha.mid) },
    { offset: 0.8, color: fillColor },
    { offset: 0.96, color: alpha(color, theme.nodes.sphere.colorAlpha.edge) },
    { offset: 1, color: theme.nodes.sphere.edgeShadow }
  ]);
}

function centerBodyGradient(color, theme) {
  return new echarts.graphic.RadialGradient(0.3, 0.24, 1, [
    { offset: 0, color: alpha(theme.text.strong, 0.18) },
    { offset: 0.08, color: theme.nodes.centerGradient.start1 },
    { offset: 0.24, color: theme.nodes.centerGradient.start2 },
    { offset: 0.54, color: alpha(color, Math.max(0.68, theme.nodes.sphere.colorAlpha.mid)) },
    { offset: 0.8, color },
    { offset: 1, color: theme.nodes.centerGradient.end }
  ]);
}

function highlightGradient(theme, isCenter) {
  return new echarts.graphic.RadialGradient(0.34, 0.28, 1, [
    { offset: 0, color: alpha(theme.nodes.sphere.specularCore, isCenter ? 0.54 : 0.42) },
    { offset: 0.34, color: alpha(theme.nodes.sphere.specularSoft, isCenter ? 0.28 : 0.22) },
    { offset: 1, color: theme.nodes.sphere.highlightFade }
  ]);
}

function textLayer({ x, y, text, fill, font, shadow, padding, backgroundColor, borderColor, borderWidth, borderRadius, shadowBlur, shadowColor }) {
  return {
    type: "text",
    x,
    y,
    silent: true,
    style: {
      text,
      fill,
      font,
      ...(shadow
        ? {
            shadowColor: shadow.color,
            shadowBlur: shadow.blur,
            shadowOffsetX: shadow.offsetX,
            shadowOffsetY: shadow.offsetY
          }
        : {}),
      ...(padding ? { padding } : {}),
      ...(backgroundColor ? { backgroundColor } : {}),
      ...(borderColor ? { borderColor } : {}),
      ...(borderWidth ? { borderWidth } : {}),
      ...(borderRadius ? { borderRadius } : {}),
      ...(shadowBlur ? { shadowBlur } : {}),
      ...(shadowColor ? { shadowColor } : {}),
      textAlign: "center",
      textVerticalAlign: "middle"
    }
  };
}

function getPositionUnderlay(item, posShadow) {
  if (item.tier === 1) {
    return posShadow.underlay.center;
  }

  return item.tier === 3 ? posShadow.underlay.tier3 : posShadow.underlay.outer;
}

function buildNodeSeries(players, theme) {
  return {
    type: "custom",
    coordinateSystem: "cartesian2d",
    z: 10,
    data: players.map((player, index) => [player.x, player.y, index]),
    renderItem(params, api) {
      const item = players[api.value(2)];
      const isCenter = item.tier === 1;
      const point = api.coord([item.x, item.y]);
      const x = point[0];
      const y = point[1];
      const posTheme = isCenter ? theme.type.pos.center : theme.type.pos.outer;
      const gradeTheme = isCenter ? theme.type.grade.center : theme.type.grade.outer;
      const posShadow = theme.type.pos.shadow;
      const gradeShadow = theme.type.grade.shadow;
      const posTextY = Math.round(
        y +
          item.gradeOffsetY -
          item.posSeparation -
          (isCenter ? theme.type.posLift.center : theme.type.posLift.outer)
      );
      const gradeTextY = Math.round(y + item.gradeOffsetY);
      const underlay = getPositionUnderlay(item, posShadow);
      const rimWidth = Math.max(
        isCenter ? theme.nodes.rim.width.center.min : theme.nodes.rim.width.outer.min,
        item.nodeRadius *
          (isCenter ? theme.nodes.rim.width.center.factor : theme.nodes.rim.width.outer.factor)
      );
      const bodyRadius = item.shellRadius - Math.max(0.7, rimWidth * 0.72);
      const shadowOffsetFactor = isCenter
        ? theme.nodes.shadowOffset.center
        : theme.nodes.shadowOffset.outer;
      const specularOffset = isCenter
        ? theme.nodes.specular.offset.center
        : theme.nodes.specular.offset.outer;
      const glintOffset = isCenter
        ? theme.nodes.glint.offset.center
        : theme.nodes.glint.offset.outer;
      const posShadowStyle = {
        color: posShadow.color,
        blur: isCenter ? posShadow.blur.center : posShadow.blur.outer,
        offsetX: posShadow.offsetX,
        offsetY: posShadow.offsetY
      };
      const gradeShadowStyle = {
        color: gradeShadow.color,
        blur: gradeShadow.blur,
        offsetX: gradeShadow.offsetX,
        offsetY: gradeShadow.offsetY
      };
      const children = [];

      pushCircle(
        children,
        x + Math.round(item.nodeRadius * shadowOffsetFactor * 0.72),
        y + Math.round(item.nodeRadius * shadowOffsetFactor),
        item.shellRadius * (isCenter ? 1.08 : 1.05),
        theme.nodes.shadowFill,
        "transparent",
        0,
        { opacity: isCenter ? 0.58 : 0.82 }
      );
      pushCircle(
        children,
        x,
        y,
        item.haloRadius,
        item.color,
        "transparent",
        0,
        {
          opacity: isCenter ? theme.nodes.haloOpacity.center : theme.nodes.haloOpacity.outer,
          shadowBlur: isCenter
            ? theme.nodes.haloBlur.center
            : theme.nodes.haloBlur.tiers[item.tier],
          shadowColor: item.color
        }
      );
      pushCircle(
        children,
        x,
        y,
        item.shellRadius,
        shellGradient(
          item.color,
          isCenter ? theme.nodes.fill.center : theme.nodes.fill.tiers[item.tier],
          theme,
          isCenter
        ),
        "transparent",
        0
      );
      pushCircle(
        children,
        x,
        y,
        item.shellRadius - rimWidth * 0.5,
        "transparent",
        alpha(item.color, isCenter ? theme.nodes.rim.alpha.center : theme.nodes.rim.alpha.outer),
        rimWidth
      );
      pushCircle(
        children,
        x,
        y,
        bodyRadius,
        isCenter
          ? centerBodyGradient(item.color, theme)
          : outerBodyGradient(item.color, theme.nodes.fill.tiers[item.tier], theme),
        "transparent",
        0
      );
      pushCircle(
        children,
        x + bodyRadius * specularOffset.x,
        y + bodyRadius * specularOffset.y,
        bodyRadius *
          (isCenter ? theme.nodes.specular.radius.center : theme.nodes.specular.radius.outer),
        highlightGradient(theme, isCenter),
        "transparent",
        0,
        {
          opacity: isCenter
            ? theme.nodes.specular.opacity.center
            : theme.nodes.specular.opacity.outer
        }
      );
      pushCircle(
        children,
        x + bodyRadius * glintOffset.x,
        y + bodyRadius * glintOffset.y,
        bodyRadius * (isCenter ? theme.nodes.glint.size.center : theme.nodes.glint.size.outer),
        alpha(
          theme.nodes.sphere.specularGlint,
          isCenter ? theme.nodes.glint.alpha.center : theme.nodes.glint.alpha.outer
        ),
        "transparent",
        0
      );

      if (isCenter) {
        pushCircle(
          children,
          x,
          y,
          item.innerRadius,
          new echarts.graphic.RadialGradient(0.34, 0.28, 0.98, [
            { offset: 0, color: alpha(theme.text.strong, 0.14) },
            { offset: 0.26, color: theme.nodes.centerInner.fill },
            { offset: 1, color: alpha(item.color, 0.24) }
          ]),
          theme.nodes.centerInner.stroke,
          theme.nodes.centerInner.strokeWidth
        );
      }

      pushCircle(
        children,
        x,
        y,
        bodyRadius + Math.max(0.2, rimWidth * 0.12),
        "transparent",
        alpha(
          theme.nodes.rim.inner.color,
          isCenter ? theme.nodes.rim.inner.alpha.center : theme.nodes.rim.inner.alpha.outer
        ),
        isCenter ? theme.nodes.rim.inner.width.center : theme.nodes.rim.inner.width.outer
      );

      children.push(
        textLayer({
          x: x + underlay.offsetX,
          y: posTextY + underlay.offsetY,
          text: item.pos,
          fill: underlay.color,
          font: `${posTheme.weight} ${item.posFontSize + underlay.bump}px ${theme.fontFamily}`,
          shadow: posShadowStyle
        }),
        textLayer({
          x,
          y: posTextY,
          text: item.pos,
          fill: item.posColor,
          font: `${posTheme.weight} ${item.posFontSize}px ${theme.fontFamily}`,
          shadow: posShadowStyle
        })
      );

      if (isCenter) {
        children.push(
          textLayer({
            x: x + gradeShadow.offsetX * 0.7,
            y: gradeTextY + gradeShadow.offsetY * 0.7,
            text: String(item.grade),
            fill: alpha(gradeShadow.color, 0.82),
            font: `${gradeTheme.weight} ${item.gradeFontSize + 0.1}px ${theme.fontFamily}`,
            shadow: gradeShadowStyle
          }),
          textLayer({
            x: x + gradeShadow.underlayOffsetX,
            y: gradeTextY + gradeShadow.underlayOffsetY,
            text: String(item.grade),
            fill: gradeShadow.underlayColor,
            font: `${gradeTheme.weight} ${item.gradeFontSize + gradeShadow.underlayBump}px ${theme.fontFamily}`
          })
        );
      }

      children.push(
        textLayer({
          x,
          y: gradeTextY,
          text: String(item.grade),
          fill: theme.text.strong,
          font: `${gradeTheme.weight} ${item.gradeFontSize}px ${theme.fontFamily}`,
          shadow: isCenter
            ? {
                color: gradeShadow.color,
                blur: gradeShadow.blur * 0.34,
                offsetX: gradeShadow.offsetX * 0.32,
                offsetY: gradeShadow.offsetY * 0.32
              }
            : null
        }),
        textLayer({
          x,
          y: y + item.nameOffsetY,
          text: item.shortName,
          fill: theme.text.name,
          font: `${theme.type.name.weight} ${item.nameFontSize}px ${theme.fontFamily}`,
          padding: isCenter
            ? theme.nodes.nameChip.padding.center
            : theme.nodes.nameChip.padding.outer,
          backgroundColor: isCenter
            ? theme.nodes.nameChip.bg.center
            : theme.nodes.nameChip.bg.outer,
          borderColor: alpha(
            item.color,
            isCenter
              ? theme.nodes.nameChip.borderAlpha.center
              : theme.nodes.nameChip.borderAlpha.outer
          ),
          borderWidth: theme.nodes.nameChip.borderWidth,
          borderRadius: theme.nodes.nameChip.borderRadius,
          shadowBlur: isCenter
            ? theme.nodes.nameChip.shadowBlur.center
            : theme.nodes.nameChip.shadowBlur.outer,
          shadowColor: alpha(
            item.color,
            isCenter
              ? theme.nodes.nameChip.shadowAlpha.center
              : theme.nodes.nameChip.shadowAlpha.outer
          )
        })
      );

      return {
        type: "group",
        z2: isCenter ? 20 : 10 + item.tier,
        children
      };
    },
    tooltip: {
      formatter(params) {
        const item = players[params.dataIndex];

        return `
          <div style="font-family:${theme.fontFamily}; min-width:128px;">
            <div style="font-size:13px; font-weight:700; margin-bottom:5px;">${item.name}</div>
            <div style="font-size:11px; color:${theme.tooltip.muted};">${theme.tiers[item.tier].label} · ${item.pos}</div>
            <div style="margin-top:6px; font-size:12px; font-weight:700;">Grade: ${item.grade}</div>
          </div>
        `;
      }
    }
  };
}

let themeCache = null;
let lastWidth = 0;
let lastHeight = 0;
let resizeFrame = 0;

function getTheme(force = false) {
  if (!themeCache || force) {
    themeCache = readTheme();
  }

  return themeCache;
}

function syncShellAtmosphere(layout) {
  shellEl.style.setProperty("--core-x", `${layout.center.x}px`);
  shellEl.style.setProperty("--core-y", `${layout.center.y}px`);
}

function render(forceTheme = false) {
  const width = chartEl.clientWidth;
  const height = chartEl.clientHeight;

  if (!width || !height) {
    return;
  }

  if (!forceTheme && width === lastWidth && height === lastHeight) {
    return;
  }

  lastWidth = width;
  lastHeight = height;

  const theme = getTheme(forceTheme);
  const layout = computeLayout(width, height, theme);
  const connectorPaths = buildConnectorPaths(layout, theme);

  syncShellAtmosphere(layout);
  chart.resize({ width, height });
  chart.setOption(
    {
      animationDuration: 700,
      animationEasing: "cubicOut",
      backgroundColor: "transparent",
      grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
      xAxis: { type: "value", min: 0, max: width, show: false },
      yAxis: { type: "value", min: 0, max: height, inverse: true, show: false },
      tooltip: {
        trigger: "item",
        backgroundColor: theme.tooltip.background,
        borderColor: theme.tooltip.border,
        borderWidth: 1,
        textStyle: {
          color: theme.text.strong,
          fontFamily: theme.fontFamily
        },
        extraCssText: `box-shadow:${theme.tooltip.shadow}; border-radius:${theme.tooltip.radius}; padding:${theme.tooltip.padding};`
      },
      graphic: buildGraphics(layout, theme),
      series: [
        buildConnectorSeries(connectorPaths, theme, false),
        buildConnectorSeries(connectorPaths, theme, true),
        buildNodeSeries(layout.players, theme)
      ]
    },
    true
  );
}

function queueRender(forceTheme = false) {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => render(forceTheme));
}

queueRender(true);

const resizeObserver = new ResizeObserver(() => queueRender());
resizeObserver.observe(shellEl);

if (document.fonts?.ready) {
  document.fonts.ready.then(() => queueRender(true));
}
