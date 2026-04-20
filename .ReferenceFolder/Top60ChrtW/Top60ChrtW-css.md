:root {
  --surface: #040714;
  --border: rgba(255, 255, 255, 0.1);
  --border-soft: rgb(255 255 255 / 0%);
  --text: rgba(255, 255, 255, 0.97);
  --tier-1: #7637ff;
  --tier-2: #5e28ff;
  --tier-3: #25d2f4;
  --tier-4: #ff84ad;
  --tier-1-rgb: 118, 55, 255;
  --tier-2-rgb: 94, 40, 255;
  --tier-3-rgb: 37, 210, 244;
  --tier-4-rgb: 255, 132, 173;
  --core-x: 54%;
  --core-y: 62%;
  --chart-font-family: "Product Sans", "Google Sans", sans-serif;
  --chart-text-strong: #fff;
  --chart-text-name: rgba(255, 255, 255, 0.94);
  --chart-tooltip-bg: rgba(7, 11, 28, 0.96);
  --chart-tooltip-border: rgba(255, 255, 255, 0.08);
  --chart-tooltip-text-muted: rgba(255, 255, 255, 0.7);
  --chart-tooltip-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
  --chart-tooltip-radius: 14px;
  --chart-tooltip-padding: 10px 12px;
  --chart-name-font-weight: 400;
  --chart-pos-font-weight-center: 700;
  --chart-pos-font-weight-outer: 700;
  --chart-grade-font-weight-center: 400;
  --chart-grade-font-weight-outer: 400;
  --chart-pos-font-factor-center: 0.31;
  --chart-pos-font-min-center: 14;
  --chart-pos-font-max-center: 14.3;
  --chart-pos-font-factor-outer: 0.42;
  --chart-pos-font-min-outer: 8.5;
  --chart-pos-font-max-outer: 9.5;
  --chart-pos-grade-gap-center: 1.15;
  --chart-pos-grade-gap-outer: 0.55;
  --chart-pos-label-lift-center: 6;
  --chart-pos-label-lift-outer: 3.2;
  --chart-pos-font-bump-tier-2: 1.5;
  --chart-pos-font-bump-tier-3: 0.24;
  --chart-pos-font-bump-tier-4: 0;
  --chart-grade-font-factor-center: 1;
  --chart-grade-font-min-center: 40;
  --chart-grade-font-max-center: 40;
  --chart-grade-font-factor-outer: 0.82;
  --chart-grade-font-min-outer: 9.2;
  --chart-grade-font-max-outer: 13.4;
  --chart-grade-font-bump-tier-2: 6;
  --chart-grade-font-bump-tier-3: 3.5;
  --chart-grade-font-bump-tier-4: 0;
  --chart-name-font-factor-center: 0.34;
  --chart-name-font-min-center: 12;
  --chart-name-font-max-center: 12;
  --chart-name-font-factor-outer: 0.5;
  --chart-name-font-min-outer: 6;
  --chart-name-font-max-outer: 8.5;
  --chart-name-font-floor-outer: 5.7;
  --chart-name-font-mid-cutoff: 10;
  --chart-name-font-mid-reduction: 0.5;
  --chart-name-font-long-cutoff: 13;
  --chart-name-font-long-reduction: 0.9;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  background: #0000;
  color: var(--text);
  font-family:
    "Product Sans",
    "Google Sans",
    sans-serif;
}

body {
  min-height: 100vh;
}

.page {
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding: 14px;
  background: radial-gradient(circle at 18% 14%, rgba(187, 116, 255, 0.12), transparent 24%), radial-gradient(circle at 82% 18%, rgba(72, 209, 255, 0.08), transparent 20%), linear-gradient(180deg, #242d3c 0%, #03050f 100%);
}

.widget-card {
  width: 348px;
  max-width: 375px;
  border: 1px solid var(--border);
  border-radius: 26px;
  overflow: hidden;
  background: #0000;
  box-shadow:
    0 24px 72px rgba(0, 0, 0, 0.0042),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.widget-header {
  padding: 3px 24px 0px;
}

.widget-header h2 {
  margin: 0;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text);
  text-align: center;
}

.tier-legend {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: -14px;
  margin-top: 5px;
}

.tier-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 0px;
  min-width: 0;
  padding: 3px 5px 3px 4px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgb(93 100 124 / 25%);
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0em;
  text-wrap-mode: nowrap;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
}

.tier-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: 0 0 auto;
}

.tier-legend-item-1 .tier-legend-dot {
  background: #a071ff;
  box-shadow: 0 0 5px rgba(var(--tier-1-rgb), 0.72);
}

.tier-legend-item-2 .tier-legend-dot {
  background: var(--tier-2);
  box-shadow: 0 0 10px rgba(var(--tier-2-rgb), 0.72);
}

.tier-legend-item-3 .tier-legend-dot {
  background: var(--tier-3);
  box-shadow: 0 0 10px rgba(var(--tier-3-rgb), 0.72);
}

.tier-legend-item-4 .tier-legend-dot {
  background: var(--tier-4);
  box-shadow: 0 0 10px rgba(var(--tier-4-rgb), 0.72);
}

.widget-body {
  padding: 0 0px 0px;
}

.chart-shell {
  max-height: 336px;
  --pos-qb: #ff6363;
  --pos-rb: #25f4c5;
  --pos-wr: #3cbbfb;
  --pos-te: #c072ff;

  /* 3 rings of chart and dashedline color */
  --tier-2-band-stroke: rgba(121, 0, 255, 0.54);
  --tier-2-band-fill: rgba(141, 99, 255, 0);
  --tier-3-band-stroke: rgba(37, 210, 244, 0.12);
  --tier-3-band-fill: rgba(37, 210, 244, 0);
  --tier-4-band-stroke: rgba(255, 132, 173, 0.12);
  --tier-4-band-fill: rgba(255, 132, 173, 0);

  /* dash distance and stuff */
  --chart-band-dash-a-min: 0.25;
  --chart-band-dash-a-scale: 1;
  --chart-band-dash-b-min: 4;
  --chart-band-dash-b-scale: 1;

  /*dash thickness ithink */
  --chart-band-ring-line-min: 21;
  --chart-band-ring-line-scale: 15;
  
  /* Chart Circle BG color */
  --chart-outer-backdrop-fill: rgba(0, 0, 0, 0.007);
  --chart-outer-backdrop-stroke: rgba(255, 255, 255, 0.004);
  --chart-outer-accent-stroke: rgba(141, 99, 255, 0.008);

  /* border for each ring */
  --chart-band-edge-inner: rgba(205, 215, 255, 0.051);
  --chart-band-edge-outer: rgba(205, 215, 255, 0.061);
  --chart-core-orbit-3-stroke: rgba(123, 15, 255, 0.15);
  --chart-core-ring-inner-stroke: rgba(255, 88, 214, 0);
  --chart-core-ring-inner-dash-a-min: 1;
  --chart-core-ring-inner-dash-a-scale: 2.2;
  --chart-core-ring-inner-dash-b-min: 1;
  --chart-core-ring-inner-dash-b-scale: 1.4;
  --chart-core-ring-inner-line-min: 1;
  --chart-core-ring-inner-line-scale: 21.4;
  --connector-opacity: 0.62;
  --connector-shadow-blur-min: 4;
  --connector-shadow-blur-scale: 6.2;
  --connector-gradient-start-alpha: 0.04;
  --connector-gradient-mid-alpha: 0.48;
  --connector-gradient-end-alpha: 0.84;
  --connector-gradient-tail-alpha: 0.28;
  --connector-highlight-width-factor: 0.34;
  --connector-highlight-start-alpha: 0.04;
  --connector-highlight-mid-alpha: 0.18;
  --connector-highlight-end-alpha: 0.24;
  --connector-tier-2-color: #7b5aff;
  --connector-tier-2-width-min: 1;
  --connector-tier-2-width-scale: 5.88;
  --connector-tier-3-color: #25d2f4;
  --connector-tier-3-width-min: 1;
  --connector-tier-3-width-scale: 5.04;
  --connector-tier-4-color: #ff84ad;
  --connector-tier-4-width-min: 1;
  --connector-tier-4-width-scale: 4.2;
  --chart-node-halo-opacity-center: 0.06;
  --chart-node-halo-opacity-outer: 0.091;
  --chart-node-halo-blur-center: 6;
  --chart-node-halo-blur-outer: 6;
  --chart-node-halo-blur-tier-2: 5.8;
  --chart-node-halo-blur-tier-3: 4.8;
  --chart-node-halo-blur-tier-4: 4.4;
  --chart-node-halo-spread-center-min: 16;
  --chart-node-halo-spread-center-scale: 34;
  --chart-node-halo-spread-tier-2-min: 6;
  --chart-node-halo-spread-tier-2-scale: 13;
  --chart-node-halo-spread-tier-3-min: 5;
  --chart-node-halo-spread-tier-3-scale: 11;
  --chart-node-halo-spread-tier-4-min: 5.1;
  --chart-node-halo-spread-tier-4-scale: 10.8;
  --chart-node-shell-fill-center: rgba(255, 255, 255, 0.06);
  --chart-node-fill-tier-2: #5900ff43;
  --chart-node-fill-tier-3: #25d2f418;
  --chart-node-fill-tier-4: #ff84ad18;
  --chart-node-sphere-shadow-fill: rgba(3, 8, 20, 0.6);
  --chart-node-sphere-shadow-offset-center: 0.08;
  --chart-node-sphere-shadow-offset-outer: 0.12;
  --chart-node-shell-highlight-alpha-center: 0.2;
  --chart-node-shell-highlight-alpha-outer: 0.12;
  --chart-node-shell-edge-alpha-center: 0.42;
  --chart-node-shell-edge-alpha-outer: 0.3;
  --chart-node-rim-alpha-center: 0.96;
  --chart-node-rim-alpha-outer: 0.88;
  --chart-node-rim-width-center-min: 2.4;
  --chart-node-rim-width-center-factor: 0.082;
  --chart-node-rim-width-outer-min: 1.2;
  --chart-node-rim-width-outer-factor: 0.094;
  --chart-node-inner-rim-color: rgba(255, 255, 255, 1);
  --chart-node-inner-rim-alpha-center: 0.18;
  --chart-node-inner-rim-alpha-outer: 0.12;
  --chart-node-inner-rim-width-center: 1.35;
  --chart-node-inner-rim-width-outer: 0.9;
  --chart-node-sphere-edge-shadow: rgba(6, 10, 24, 0.94);
  --chart-node-sphere-specular-core: rgba(255, 255, 255, 0.98);
  --chart-node-sphere-specular-soft: rgba(255, 255, 255, 0.58);
  --chart-node-sphere-specular-glint: rgba(255, 255, 255, 0.82);
  --chart-node-sphere-highlight-fade: rgba(255, 255, 255, 0);
  --chart-node-sphere-color-alpha-inner: 0.22;
  --chart-node-sphere-color-alpha-mid: 0.5;
  --chart-node-sphere-color-alpha-edge: 0.96;
  --chart-node-specular-offset-x-center: -0.52;
  --chart-node-specular-offset-y-center: -0.72;
  --chart-node-specular-offset-x-outer: -0.2;
  --chart-node-specular-offset-y-outer: -0.3;
  --chart-node-specular-radius-center: 0.17;
  --chart-node-specular-radius-outer: 0.48;
  --chart-node-specular-opacity-center: 0.04;
  --chart-node-specular-opacity-outer: 0.26;
  --chart-node-glint-offset-x-center: -0.22;
  --chart-node-glint-offset-y-center: -0.52;
  --chart-node-glint-offset-x-outer: -0.12;
  --chart-node-glint-offset-y-outer: -0.36;
  --chart-node-glint-size-center: 0.09;
  --chart-node-glint-size-outer: 0.12;
  --chart-node-glint-alpha-center: 0.26;
  --chart-node-glint-alpha-outer: 0.58;
  --chart-node-inner-fill-center: rgba(18, 10, 39, 0.42);
  --chart-node-inner-stroke-center: rgba(255, 255, 255, 0.16);
  --chart-node-inner-stroke-width-center: 1;
  --chart-center-gradient-stop-1: rgba(246, 237, 255, 0.98);
  --chart-center-gradient-stop-2: rgba(196, 162, 244, 0.94);
  --chart-center-gradient-stop-4: rgba(40, 11, 82, 1);
  
  /*Chart name chips stuff */
  --chart-name-chip-padding-center: 1 5 3 4;
  --chart-name-chip-padding-outer: 1 3 2 3;
  --chart-name-chip-bg-center: rgba(10, 16, 36, 0.28);
  --chart-name-chip-bg-outer: rgba(33, 41, 55, 0.8);
  --chart-name-chip-border-width: 1;
  --chart-name-chip-border-radius: 999;
  --chart-name-chip-border-alpha-center: 0.5;
  --chart-name-chip-border-alpha-outer: 0.3;
  --chart-name-chip-shadow-blur-center: 3;
  --chart-name-chip-shadow-blur-outer: 2;
  --chart-name-chip-shadow-alpha-center: 0.3;
  --chart-name-chip-shadow-alpha-outer: 0.02;
  --chart-pos-shadow-color: rgba(0, 0, 0, 0.58);
  --chart-pos-shadow-blur-center: 4.2;
  --chart-pos-shadow-blur-outer: 2.2;
  --chart-pos-shadow-offset-x: 0;
  --chart-pos-shadow-offset-y: 0.7;
  --chart-pos-underlay-color-center: rgba(4, 1, 12, 0.9);
  --chart-pos-underlay-size-bump-center: 0.1;
  --chart-pos-underlay-offset-x-center: 0.3;
  --chart-pos-underlay-offset-y-center: 1.05;
  --chart-pos-underlay-color-outer: rgba(4, 1, 12, 0.82);
  --chart-pos-underlay-size-bump-outer: 0.05;
  --chart-pos-underlay-offset-x-outer: 0.15;
  --chart-pos-underlay-offset-y-outer: 0.8;
  --chart-pos-underlay-color-tier-3: rgba(4, 1, 12, 0.9);
  --chart-pos-underlay-size-bump-tier-3: 0.08;
  --chart-pos-underlay-offset-x-tier-3: 0.2;
  --chart-pos-underlay-offset-y-tier-3: 0.95;
  --chart-grade-shadow-color-center: rgba(3, 1, 12, 0.98);
  --chart-grade-shadow-blur-center: 10.5;
  --chart-grade-shadow-offset-x-center: 0.45;
  --chart-grade-shadow-offset-y-center: 2.2;
  --chart-grade-underlay-color-center: rgba(2, 1, 10, 0.96);
  --chart-grade-underlay-size-bump-center: 0.15;
  --chart-grade-underlay-offset-x-center: 0.65;
  --chart-grade-underlay-offset-y-center: 2.85;
  position: relative;
  height: 388px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid var(--border-soft);
  border-radius: 22px;
  background:
    radial-gradient(
      circle at var(--core-x) var(--core-y),
      rgba(187, 116, 255, 0.1) 0,
      rgba(187, 116, 255, 0.06) 14%,
      transparent 44%
    ),
    radial-gradient(circle at 22% 26%, rgba(72, 209, 255, 0.06), transparent 22%),
    linear-gradient(180deg, rgba(5, 9, 24, 0.044), rgba(7, 10, 28, 0.048));
  box-shadow: 0 16px 6px rgba(0, 0, 0, 0.32);
}

.chart-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.64;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 0.52px, transparent 0.88px),
    radial-gradient(circle, rgba(255, 255, 255, 0.7) 0 0.62px, transparent 0.98px),
    radial-gradient(circle, rgba(255, 255, 255, 0.48) 0 0.74px, transparent 1.08px),
    radial-gradient(circle, rgba(109, 226, 255, 0.78) 0 0.58px, transparent 0.94px),
    radial-gradient(circle, rgba(132, 74, 255, 0.72) 0 0.66px, transparent 1.02px),
    radial-gradient(circle, rgba(255, 128, 102, 0.7) 0 0.68px, transparent 1.04px),
    radial-gradient(circle, rgba(255, 255, 255, 0.38) 0 0.52px, transparent 0.9px),
    radial-gradient(circle, rgba(109, 226, 255, 0.42) 0 0.56px, transparent 0.94px),
    radial-gradient(circle, rgba(255, 128, 102, 0.38) 0 0.6px, transparent 0.96px);
  background-size:
    72px 72px,
    94px 94px,
    126px 126px,
    144px 144px,
    168px 168px,
    196px 196px,
    112px 112px,
    184px 184px,
    212px 212px;
  background-position:
    6px 10px,
    24px 18px,
    48px 40px,
    18px 26px,
    40px 16px,
    62px 52px,
    30px 58px,
    88px 24px,
    54px 96px;
}

.chart-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      circle at var(--core-x) var(--core-y),
      rgba(255, 255, 255, 0.08) 0,
      rgba(187, 116, 255, 0.12) 12%,
      rgba(72, 209, 255, 0.04) 26%,
      transparent 44%
    ),
    radial-gradient(circle at 18% 34%, rgba(141, 99, 255, 0.07), transparent 18%);
}

.chart {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 999px;
}
