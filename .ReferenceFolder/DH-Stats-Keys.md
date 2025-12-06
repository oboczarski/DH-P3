# Dynasty Hub – Stats Keys Reference

This reference aggregates every stat abbreviation surfaced on the **Dashboard (home)**, the **Stats page**, and in the **Game Logs modal** (including Performance and Consistency tabs). Stats are grouped by context; if a stat appears in multiple places, it is repeated under each relevant key for clarity.

---

## 1. Dashboard / Home (Welcome Screen & Radar / Scatter)

### Core Fantasy & Usage Metrics

- **FPTS** – Fantasy points (PPR), season total.
- **PPG** – Points per game (fantasy points per game).
- **CSTY%** – Consistency rate; percent of games at or above a “solid/high” fantasy output threshold.
- **TS%** – Target share; percentage of team pass targets directed to the player.
- **REC** – Receptions.
- **recYPG** – Receiving yards per game.
- **YDS(t)** – Total yards (combined rushing + receiving, plus passing where applicable).
- **SNP%** – Snap share; percentage of team offensive snaps played.
- **YPC** – Yards per carry (rushing yards ÷ rushing attempts).
- **TGT** – Targets (pass attempts directed to the player).
- **IMP/G** – Impact plays per game (1st downs + touchdowns, averaged).

### Efficiency & Advanced Receiving Metrics

- **YPRR** – Yards per route run (receiving yards ÷ routes run).
- **1DRR** – First downs per route run (receiving first downs ÷ routes run).

### Passing Efficiency (QB Radar)

- **paRTG** – Passer rating.
- **CMP%** – Completion percentage.
- **paYPG** – Passing yards per game.
- **TTT** – Time to throw; average time from snap to pass attempt, in seconds.

### Rushing Efficiency (RB Radar)

- **MTF/A** – Missed tackles forced per rushing attempt.
- **YCO/A** – Yards after contact per rushing attempt.

### Ceiling & Consistency Grid (Scatter Chart)

- **CSTY%** – Consistency rate (x‑axis of scatter: CSTY%).
- **CL** – Ceiling; high-end weekly fantasy output metric used on y‑axis (“Ceiling (CL)”).

---

## 2. Stats Page (STAT_1QB / STAT_SFLX Tables)

### Global / Meta Columns

- **RK** – Overall rank (by fantasy points or value for the dataset).
- **PLAYER** – Player name.
- **POS** – Position (QB, RB, WR, TE, RDP, etc.).
- **TM** – Team.
- **AGE** – Player age (years, with one decimal).
- **G** – Games played.
- **FPTS** – Fantasy points (PPR), season total.
- **PPG** – Fantasy points per game.
- **VALUE** – Trade value (Dynasty Hub value score / KTC-aligned scale).
- **SNP%** – Snap share; percentage of team offensive snaps played.
- **YDS(t)** – Total yards (rushing + receiving + passing where applicable).
- **YPG(t)** – Total yards per game.
- **OPP** – Opponent difficulty / matchup index (sheet-provided opponent metric).
- **IMP** – Impact plays (1st downs + touchdowns).
- **IMP/OPP** – Impact plays per opportunity (impact ÷ combined opportunities).
- **CSTY%** – Consistency percentage; sheet-based seasonal consistency rate.
- **CL** – Ceiling; sheet-based ceiling score for spike weeks.

### QB – Passing & Rushing Columns

- **paRTG** – Passer rating.
- **paYDS** – Passing yards.
- **paTD** – Passing touchdowns.
- **CMP%** – Completion percentage.
- **paATT** – Passing attempts.
- **CMP** – Completions.
- **pa1D** – Passing first downs.
- **paYPG** – Passing yards per game.
- **ruYDS** – Rushing yards.
- **ruTD** – Rushing touchdowns.
- **ruYPG** – Rushing yards per game.
- **CAR** – Carries (rushing attempts).
- **YPC** – Yards per carry (rushing yards ÷ carries).
- **ru1D** – Rushing first downs.
- **IMP/G** – Impact plays per game (1D + TD per game).
- **pIMP** – Passing impact plays (passing 1st downs + passing TDs).
- **pIMP/A** – Passing impact per attempt (pIMP ÷ passing attempts).
- **TTT** – Time to throw; average seconds from snap to pass attempt.
- **PRS%** – Pressure rate; percent of dropbacks under pressure.
- **SAC** – Sacks taken.
- **INT** – Interceptions thrown.
- **FUM** – Fumbles lost.
- **FPOE** – Fantasy points over expected (vs usage / opportunity model).

### RB – Rushing & Receiving Columns

- **CAR** – Carries (rushing attempts).
- **ruYDS** – Rushing yards.
- **YPC** – Yards per carry.
- **ruTD** – Rushing touchdowns.
- **REC** – Receptions.
- **recYDS** – Receiving yards.
- **TGT** – Targets.
- **YDS(t)** – Total yards (rush + receive).
- **ruYPG** – Rushing yards per game.
- **ELU** – Elusiveness rating (missed tackles / yards after contact composite).
- **MTF** – Missed tackles forced.
- **MTF/A** – Missed tackles forced per rushing attempt.
- **YCO** – Yards after contact (rushing).
- **YCO/A** – Yards after contact per rushing attempt.
- **ru1D** – Rushing first downs.
- **recTD** – Receiving touchdowns.
- **rec1D** – Receiving first downs.
- **YAC** – Yards after catch (receiving).
- **IMP/G** – Impact plays per game.
- **FUM** – Fumbles lost.
- **FPOE** – Fantasy points over expected.

### WR / TE – Receiving & Hybrid Columns

- **TGT** – Targets.
- **REC** – Receptions.
- **TS%** – Target share; percent of team targets.
- **recYDS** – Receiving yards.
- **recTD** – Receiving touchdowns.
- **YPRR** – Yards per route run.
- **rec1D** – Receiving first downs.
- **1DRR** – First downs per route run (receiving 1st downs ÷ routes run).
- **recYPG** – Receiving yards per game.
- **YAC** – Yards after catch.
- **YPR** – Yards per reception.
- **IMP/G** – Impact plays per game.
- **RR** – Routes run.
- **YDS(t)** – Total yards (includes any rushing yards).
- **CAR** – Carries (rushing attempts).
- **ruYDS** – Rushing yards.
- **ruTD** – Rushing touchdowns.
- **YPC** – Yards per carry.
- **FUM** – Fumbles lost.
- **FPOE** – Fantasy points over expected.

---

## 3. Game Logs Modal (GM‑Logs, Performance, Consistency Tabs)

### 3.1 Weekly Game Log Table (GM‑Logs Tab)

#### Row Header / Context

- **WK‑X** – Week number in the NFL season.
- **VS (Opponent)** – Opponent team abbreviation for that week.
- **Opponent Rank** – Defensive rank versus the player’s position (1st, 2nd, 3rd, etc. hardest/easiest matchup).
- **BYE** – Week in which the player’s team has a bye (no game played).

#### General Fantasy & Projection Columns

- **FPTS** – Weekly fantasy points (PPR).  
  - On the Stats page: from sheet `FPT_PPR`.  
  - On Rosters/other pages: from league-specific matchup data.
- **PROJ** – Projection / status from PROJ column (numeric point projection or status text such as injury or bye designation).
- **SNP%** – Snap share for that game (percent of offensive snaps played).
- **YDS(t)** – Total yards that week (rushing + receiving + passing where applicable).
- **IMP/G** – Impact plays in the game (1D + TD in that week; displayed with per‑game label).
- **FUM** – Fumbles lost in that game.
- **FPOE** – Fantasy points over expected for that game.

#### Passing Game‑Log Stats (QB & Passing‑Usage Players)

- **paRTG** – Passer rating for the game.
- **paYDS** – Passing yards.
- **paTD** – Passing touchdowns.
- **CMP%** – Completion percentage.
- **paATT** – Passing attempts.
- **CMP** – Completions.
- **pa1D** – Passing first downs.
- **pIMP** – Passing impact plays (passing 1st downs + passing TDs).
- **pIMP/A** – Passing impact per attempt (pIMP ÷ passing attempts).
- **TTT** – Time to throw; average time from snap to pass attempt in that game.
- **PRS%** – Pressure rate; percentage of dropbacks under pressure.
- **SACK / SAC** – Sacks taken.
- **INT** – Interceptions thrown.

#### Rushing Game‑Log Stats

- **CAR** – Carries (rushing attempts).
- **ruYDS** – Rushing yards.
- **ruTD** – Rushing touchdowns.
- **ru1D** – Rushing first downs.
- **YPC** – Yards per carry (rushing yards ÷ carries).
- **ELU** – Elusiveness rating (missed tackles / YAC composite from the sheet).
- **MTF** – Missed tackles forced.
- **MTF/A** – Missed tackles forced per rushing attempt.
- **YCO** – Yards after contact (rushing).
- **YCO/A** – Yards after contact per rushing attempt.

#### Receiving Game‑Log Stats

- **TGT** – Targets.
- **REC** – Receptions.
- **recYDS** – Receiving yards.
- **recTD** – Receiving touchdowns.
- **rec1D** – Receiving first downs.
- **YAC** – Yards after catch.
- **YPRR** – Yards per route run.
- **1DRR** – First downs per route run (receiving 1st downs ÷ routes run).
- **RR** – Routes run.
- **TS%RR** – Target share on routes run; targets per route (targets ÷ routes run, expressed as a percentage).
- **YPR** – Yards per reception (receiving yards ÷ receptions).

### 3.2 Performance Tab (Radar – Season Profile Within Game Logs)

The Performance tab reuses the same radar configuration as the dashboard, but driven by season‑long/game‑log data and positional ranks.

#### Radar Core Stats (by Position)

**QB Radar Rings**

- **FPTS** – Season fantasy points (PPR).
- **PPG** – Points per game.
- **paRTG** – Passer rating.
- **CMP%** – Completion percentage.
- **paYPG** – Passing yards per game.
- **TTT** – Time to throw (seconds).
- **YDS(t)** – Total yards.
- **IMP/G** – Impact plays per game.

**RB Radar Rings**

- **FPTS** – Season fantasy points.
- **PPG** – Points per game.
- **YDS(t)** – Total yards.
- **SNP%** – Snap share.
- **YPC** – Yards per carry.
- **TGT** – Targets.
- **MTF/A** – Missed tackles forced per rushing attempt.
- **YCO/A** – Yards after contact per rushing attempt.

**WR / TE Radar Rings**

- **FPTS** – Season fantasy points.
- **PPG** – Points per game.
- **REC** – Receptions.
- **recYPG** – Receiving yards per game.
- **TS%** – Target share.
- **YPRR** – Yards per route run.
- **1DRR** – First downs per route run.
- **IMP/G** – Impact plays per game.

#### Radar Rank Annotations

- **POS RK (FPTS)** – Positional rank by total fantasy points (lower is better).
- **PPG POS RK** – Positional rank by points per game.
- **Axis‑specific ranks** – For each radar metric, a positional rank (1st, 2nd, 3rd, etc.) shown as an ordinal overlay around the rings.

### 3.3 Consistency Tab (CSTY & Ceiling Panel)

#### HUD Metrics

- **CSTY%** – Season consistency rate (from sheet `CSTY%`), expressed as a percentage.
- **CSTY% POS RK** – Positional rank for consistency percentage.
- **CL** – Ceiling score (sheet `CL`), representing high‑end weekly outcome.
- **CL POS RK** – Positional rank for ceiling.
- **Best Game** – Highest weekly fantasy output (best FPTS week), shown as `X.X fpts`.
- **Last 5 Avg** – Average fantasy points over the last 5 charted games (`X.X fpts`).
- **CSTY Count** – Number of “solid/high” weeks over total charted weeks (e.g., `10/11`).
- **Weeks charted** – Count of weeks with valid sheet fantasy points used in the consistency chart.
- **Week range** – Range of weeks included (e.g., `Weeks 1–9`).

#### Consistency Zones

- **Low zone** – Weeks below the “solid” FPTS threshold for the player’s position.
- **Solid zone** – Weeks between the solid and high thresholds.
- **High zone** – Weeks at or above the “high” ceiling threshold.
- **Zone thresholds** – Displayed as:
  - `Low (<X)` – below the solid threshold.
  - `Solid (X–Y)` – between solid and high thresholds.
  - `High (≥Y)` – at or above the high threshold.

### 3.4 Player Vitals & Summary (Header Area)

#### Summary Chips

- **FPTS** – Season total fantasy points.
- **POS RK** – Positional rank by FPTS.
- **RK** – Overall rank by FPTS.
- **PPG** – Points per game.
- **PPG POS RK** – Positional rank by PPG.
- **PPG RK** – Overall rank by PPG.
- **KTC** – KeepTradeCut trade value.
- **KTC POS RK** – Positional rank by KTC value.

#### Vitals Block

- **AGE** – Age in years.
- **HEIGHT** – Height (e.g., `6'1"`), internally normalized to inches for coloring.
- **WEIGHT** – Weight in pounds.
- **EXP** – Experience; NFL seasons played.
- **RY** – Rookie year; the player’s NFL rookie season.

---

_File: `.ReferenceFolder/DH-Stats-Keys.md` – maintained as the single source of truth for stats abbreviations across the Dashboard, Stats page, and Game Logs modal._

