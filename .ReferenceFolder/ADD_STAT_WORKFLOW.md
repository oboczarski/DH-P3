# ADD STAT WORKFLOW — Full Implementation Guide

> **Purpose**: Step-by-step reference for adding a new stat column across all three surfaces (Stats Page Table, Game Logs Weekly Table + Footer, Game Logs Season View). Written for a custom agent to carry out autonomously given only the formatted input examples at the end of this doc.

---

## TABLE OF CONTENTS

1. [Prerequisite: CSV Column Exists](#1-prerequisite-csv-column-exists)
2. [Surface 1 — Stats Page Main Table](#2-surface-1--stats-page-main-table)
3. [Surface 2 — Game Logs Modal: Weekly Table + Season Footer](#3-surface-2--game-logs-modal-weekly-table--season-footer)
4. [Surface 3 — Game Logs Modal: Season (SZN) View](#4-surface-3--game-logs-modal-season-szn-view)
5. [Color Category System (shared reference)](#5-color-category-system-shared-reference)
6. [Optional / Conditional Edits](#6-optional--conditional-edits)
7. [Verification Checklist](#7-verification-checklist)
8. [Examples of What Input Looks Like](#8-examples-of-what-input-looks-like)

---

## 1. PREREQUISITE: CSV COLUMN EXISTS

Before any code changes, the stat must already exist as a column in the source CSV file(s).

| CSV File | Path | Used By |
|----------|------|---------|
| Season totals | `DH_P2.53/data/NFL-2025_Stats/SZN.csv` | Stats page table, Game Logs SZN view |
| Season ranks | `DH_P2.53/data/NFL-2025_Stats/SZN_RKS.csv` | Game Logs SZN view (rank bars) |
| Weekly stats | `DH_P2.53/data/NFL-2025_Stats/Weeks/WK1.csv` … `WK18.csv` | Game Logs weekly table |

The CSV column header name is the "raw header" — it may or may not match the display abbreviation. If it differs, `HEADER_ALIASES` (stats.js) or `PLAYER_STAT_HEADER_MAP` (app.js) handles the mapping.

---

## 2. SURFACE 1 — Stats Page Main Table

**Files touched**: `DH_P2.53/scripts/stats.js`, `DH_P2.53/stats/stats.html` (optional)

### 2A. Header Alias (if CSV header differs from display name)

**File**: `stats.js` — `HEADER_ALIASES` map  
**Line ref**: ~Line 17  
**What**: If the CSV column header is different from the desired display abbreviation, add a mapping.

```
Pattern:  ['CSV_HEADER_NAME', 'DISPLAY_ABBR']
```

> Skip if the CSV header already matches the display abbreviation exactly.

---

### 2B. Column Category (controls header color)

**File**: `stats.js` — `COLUMN_CATEGORY` object  
**Line ref**: ~Line 43  
**What**: Map the display abbreviation to one of the four color categories.

```
Pattern:  'DISPLAY_ABBR': 'rushing'
```

**Available categories and their header colors (in stats.css)**:
| Category | Color | CSS Class (auto-applied) |
|----------|-------|--------------------------|
| `all` | `#ADA2FF` (purple) | `.stats-header-all` |
| `passing` | `#FFB2D8` (pink) | `.stats-header-passing` |
| `rushing` | `#9cf7d4` (green) | `.stats-header-rushing` |
| `receiving` | `#A0C2F7` (blue) | `.stats-header-receiving` |

**How the class gets applied** (no code changes needed): `getColumnCategory(col)` (stats.js ~Line 967) reads from `COLUMN_CATEGORY`, and `renderHeaderCells()` (stats.js ~Line 1857) applies the matching `stats-header-{category}` class to each `<th>`.

> **IMPORTANT**: If a stat is NOT added to `COLUMN_CATEGORY`, it defaults to `'all'`. This fallback is in `getColumnCategory()`.

---

### 2C. Column Sets (controls which positions show the stat)

**File**: `stats.js` — `COLUMN_SETS` object  
**Line ref**: ~Line 31  
**What**: Add the display abbreviation to the array for each position that should show it. The array order = column order in the table.

```
Structure:
COLUMN_SETS = {
  default: [...],   // Overview (ALL) filter — shown for all positions
  QB: [...],        // Passing (QB) filter
  RB: [...],        // Rushing (RB) filter
  WR: [...],        // Receiving (W/T) filter — WR subset
  TE: [...],        // Receiving (W/T) filter — TE subset
  RDP: [...]        // Pick Values — separate layout, rarely touched
}
```

**Placement rule**: Insert the display abbreviation at the desired position in the array. Adjacent columns in the array are adjacent columns in the rendered table.

> The `default` set appears when the "Overview (ALL)" filter button is active. Position-specific sets appear when their filter button is active.

---

### 2D. Column Width

**File**: `stats.js` — `STATS_COLUMN_WIDTHS` object  
**Line ref**: ~Line 266  
**What**: Define the base pixel width for the column.

```
Pattern:  'DISPLAY_ABBR': 76
```

Common widths in the codebase: `64` (narrow), `76` (standard), `90` (wide).

> If not added, `DEFAULT_COLUMN_WIDTH` (`76`) is used.

---

### 2E. Numeric Sort Registration

**File**: `stats.js` — `NUMERIC_SORT_COLUMNS` Set  
**Line ref**: ~Line 323  
**What**: Add the display abbreviation so the column sorts numerically rather than alphabetically.

```
Pattern:  Add 'DISPLAY_ABBR' to the Set
```

> Almost every stat column should be in this set. Only text columns (PLAYER, POS, TM) are excluded.

---

### 2F. Efficiency Column Registration (conditional)

**File**: `stats.js` — `EFFICIENCY_COLUMNS` Set  
**Line ref**: ~Line 333  
**What**: If the stat is a rate/efficiency/per-game metric (not a volume/counting stat), add it here.

```
Pattern:  Add 'DISPLAY_ABBR' to the Set
```

**Effect**: Efficiency columns have different sort threshold behavior. Whether a stat is "efficiency" affects how filtered sort logic treats minimum-game thresholds.

> Examples of efficiency stats: `YPC`, `PPG`, `CMP%`, `YPRR`, `ELU`, `MTF/A`.  
> Examples of volume/counting stats: `ruYDS`, `CAR`, `TGT`, `FPTS`.

---

### 2G. Integer Column Registration (conditional)

**File**: `stats.js` — `INTEGER_COLUMNS` Set  
**Line ref**: ~Line 107  
**What**: If the stat is a whole-number counting/volume stat, add it here so values display without decimals.

```
Pattern:  Add 'DISPLAY_ABBR' to the Set
```

> Examples of integer stats: `ruYDS`, `CAR`, `TGT`, `REC`, `paYDS`, `FUM`, `YAC`, `MTF`.  
> Do NOT add rate/efficiency/percentage stats here (those use 2H or 2I instead).

---

### 2H. Decimal Precision (conditional)

**File**: `stats.js` — `DECIMAL_PRECISION` Map  
**Line ref**: ~Line 113  
**What**: If the stat needs specific decimal places beyond the default, add it.

```
Pattern:  ['DISPLAY_ABBR', 2]    // 2 decimal places
```

> Use for non-percentage decimal stats like `YPC` (2 decimals), `AGE` (1 decimal), `FPOE` (1 decimal).

---

### 2I. Percent Precision (conditional)

**File**: `stats.js` — `PERCENT_PRECISION` Map  
**Line ref**: ~Line 139  
**What**: If the stat is a percentage displayed with format like `68.5%`, register it here.

```
Pattern:  ['DISPLAY_ABBR', 1]    // 1 decimal place with % suffix
```

> Use for stats whose display name ends in `%` (e.g., `CMP%`, `SNP%`, `TS%`, `AY%`, `CSTY%`).

---

### Formatting Decision Tree (2G / 2H / 2I are mutually exclusive)

```
Is the stat a percentage (name ends in %)? → 2I (PERCENT_PRECISION)
Is the stat a whole-number counting stat?  → 2G (INTEGER_COLUMNS)
Is the stat a non-% decimal/rate stat?     → 2H (DECIMAL_PRECISION)
None of the above (shows raw CSV value)?   → Skip all three
```

---

### 2J. Stats Key Popup (conditional)

**File**: `stats.html` — Key popup body  
**Line ref**: ~Line 209 area  
**What**: Add an abbreviation + description entry to the stats key popup so users can look up the stat meaning.

```html
<div class="stats-key-item">
  <span class="stats-key-abbr">DISPLAY_ABBR</span>
  <span class="stats-key-desc">Full description of the stat</span>
</div>
```

> This is static HTML in `stats.html`, inside the `#statsKeyPopup .stats-key-popup-body` container.

---

### STATS PAGE SUMMARY CHECKLIST

| Step | Structure | File | Required? |
|------|-----------|------|-----------|
| 2A | `HEADER_ALIASES` | stats.js ~L17 | Only if CSV header ≠ display name |
| 2B | `COLUMN_CATEGORY` | stats.js ~L43 | **YES** (defaults to `all` if missing) |
| 2C | `COLUMN_SETS` | stats.js ~L31 | **YES** — determines visibility & order |
| 2D | `STATS_COLUMN_WIDTHS` | stats.js ~L266 | Recommended (defaults to 76px) |
| 2E | `NUMERIC_SORT_COLUMNS` | stats.js ~L326 | **YES** for all numeric stats |
| 2F | `EFFICIENCY_COLUMNS` | stats.js ~L336 | Only for rate/efficiency stats |
| 2G | `INTEGER_COLUMNS` | stats.js ~L107 | Only for whole-number counting stats |
| 2H | `DECIMAL_PRECISION` | stats.js ~L113 | Only for non-% decimal stats |
| 2I | `PERCENT_PRECISION` | stats.js ~L139 | Only for percentage stats |
| 2J | Key popup HTML | stats.html ~L209 | Recommended |

---

## 3. SURFACE 2 — Game Logs Modal: Weekly Table + Season Footer

**Files touched**: `DH_P2.53/scripts/app.js`

The game logs modal shows a weekly table (one row per game) and a footer row with season aggregates. Both share the same column definitions and color system.

### 3A. Player Stat Header Map (CSV → internal key)

**File**: `app.js` — `PLAYER_STAT_HEADER_MAP` object  
**Line ref**: ~Line 2978  
**What**: Maps the CSV column header to an internal stat key. This is the **master ingestion dictionary** — if a stat is not in this map, it will not be parsed from CSV files.

```
Pattern:  'CSV_HEADER': 'internal_key'
```

**Naming convention for internal keys**: Reference the existing `PLAYER_STAT_HEADER_MAP` entries to match the pattern. General rules: lowercase, snake_case, position prefix where ambiguous.
- Rushing: `rush_` prefix (e.g., `rush_yd`, `rush_td`, `rush_att`, `rush_fd`)
- Passing: `pass_` prefix (e.g., `pass_yd`, `pass_td`, `pass_att`)
- Receiving: `rec_` prefix (e.g., `rec_yd`, `rec_td`, `rec_tgt`)

**Reverse mapping**: `buildStatLabels()` (~Line 3044) auto-generates display labels from this map. The **first** CSV header mapped to an internal key becomes its display label. If a computed stat (no CSV header) needs a label, add it manually in `buildStatLabels()`.

> No separate label step is needed for most stats — `buildStatLabels()` handles it automatically.

---

### 3B. Stat Group by Key (controls header + footer color)

**File**: `app.js` — `statGroupByKey` Map (built via `assignStatGroup()`)  
**Line ref**: ~Line 5288  
**What**: Assigns each internal stat key to a color group for the game logs header and footer.

```
Pattern:  Add 'internal_key' to the appropriate assignStatGroup() call
```

```javascript
// Existing structure:
assignStatGroup('all',       ['fpts', 'ppg', 'proj', 'snp_pct', ...]);
assignStatGroup('passing',   ['pass_rtg', 'pass_yd', 'pass_td', ...]);
assignStatGroup('rushing',   ['rush_att', 'rush_yd', 'ypc', ...]);
assignStatGroup('receiving', ['rec', 'rec_yd', 'rec_tgt', ...]);
```

**Available categories and their colors (in styles.css)**:
| Category | Header/Footer Color | CSS Class (auto-applied) |
|----------|---------------------|--------------------------|
| `all` | `#b7adfe` (purple) | `.gamelog-header-all` |
| `passing` | `#FFB2D8` (pink) | `.gamelog-header-passing` |
| `rushing` | `#75e0b7` (green) | `.gamelog-header-rushing` |
| `receiving` | `#63b0de` (blue) | `.gamelog-header-receiving` |

**How the class gets applied** (no code changes needed): The game logs column builder loop (~Line 5331) reads `statGroupByKey.get(key)` and assigns `gamelog-header-${group}` as the `headerClass` and `footerClass` in column meta.

> **CSS References** (styles.css):
> - `thead th.gamelog-header-*` — Line 5660
> - `tfoot th.gamelog-header-*` — Line 5660 (same rules target both thead and tfoot)

---

### 3C. Position-Specific Stat Order (controls column appearance & order)

**File**: `app.js` — `qbStatOrder`, `rbStatOrder`, `wrTeStatOrder` arrays  
**Line ref**: ~Line 5051  
**What**: These arrays control **which stats appear** in the game logs table for each position, and **in what order** (left to right).

```
Structure:
const qbStatOrder = ['fpts', 'proj', 'pass_rtg', 'pass_yd', ...];
const rbStatOrder = ['fpts', 'proj', 'snp_pct', 'rush_att', ...];
const wrTeStatOrder = ['fpts', 'proj', 'snp_pct', 'rec_tgt', ...];
```

**Insertion rule**: Place the internal key at the desired position in the array. Adjacent keys = adjacent columns.

**Position selection logic** (~Line 5308):
```
if (player.pos === 'QB')            → qbStatOrder
else if (player.pos === 'RB')       → rbStatOrder
else if (player.pos === 'WR' || 'TE') → wrTeStatOrder
else                                → fallback array (Line ~5310)
```

> If a stat should appear for QB + RB but NOT WR/TE, add it to `qbStatOrder` and `rbStatOrder` only.

---

### 3D. Column Width for Game Logs (optional)

**File**: `app.js` — `COLUMN_WIDTHS` object (inside game logs render function)  
**Line ref**: ~Line 5371  
**What**: Set pixel width for the stat column in the game logs table.

```
Pattern:  internal_key: 40
```

> If not added, `DEFAULT_COLUMN_WIDTH` (`54`) is used.

---

### GAME LOGS TABLE SUMMARY CHECKLIST

| Step | Structure | File | Required? |
|------|-----------|------|-----------|
| 3A | `PLAYER_STAT_HEADER_MAP` | app.js ~L2978 | **YES** — stat won't parse without it |
| 3B | `statGroupByKey` via `assignStatGroup()` | app.js ~L5288 | **YES** — controls header/footer color |
| 3C | Position stat order arrays | app.js ~L5051 | **YES** — stat won't render without it |
| 3D | `COLUMN_WIDTHS` | app.js ~L5371 | Recommended (defaults to 54px) |

---

## 4. SURFACE 3 — Game Logs Modal: Season (SZN) View

**Files touched**: `DH_P2.53/scripts/app.js`

The SZN view replaces the weekly table in-place. It shows season totals organized into labeled sections, each stat as a row with a progress bar, rank, and value.

> **IMPORTANT — Shared Prerequisites**: Even if Surface 2 (Game Logs Weekly Table) is NOT being requested, **Steps 3A and 3B are still required** for the SZN view to work:
> - **3A** (`PLAYER_STAT_HEADER_MAP`): The SZN view relies on `buildStatLabels()` (which inverts this map) to generate display labels for each stat row. Without this entry, the stat row will have no label.
> - **3B** (`statGroupByKey`): The SZN view reads this map (Step 4C below) to color each stat row's label. Without this entry, the stat row will have no label color.
>
> If the agent is only implementing Surface 3, it must still perform Steps 3A and 3B from the Surface 2 section above.

### THE KEY CONCEPT: Two Independent Color Systems

In the SZN view, there are **two separate** color systems working simultaneously:

1. **Section header color** — driven by the `tone` field in `SZN_STAT_SECTIONS_BY_POS`
2. **Stat row label color** — driven by `statGroupByKey` (the same map used for the weekly table in Step 3B)

These are **independent**. A stat can be in a section with `tone: 'rushing'` but have its individual label colored as `'all'` if that's what `statGroupByKey` says. In practice they usually align, but the mechanism is separate.

### 4A. Add Stat to Section Config

**File**: `app.js` — `SZN_STAT_SECTIONS_BY_POS` constant  
**Line ref**: ~Line 4495  
**What**: Add the internal stat key to the `stats` array of the appropriate section for each relevant position.

**Full current structure**:

```javascript
SZN_STAT_SECTIONS_BY_POS = {
  QB: [
    { id: 'fantasy',              label: 'FANTASY',              tone: 'all',       stats: ['fpts', 'ppg', 'fpoe'] },
    { id: 'passing-production',   label: 'PASSING PRODUCTION',   tone: 'passing',   stats: ['pass_att', 'pass_cmp', 'pass_yd', 'pass_td', 'pass_fd', 'pass_imp', 'pass_sack', 'pass_int'] },
    { id: 'passing-efficiency',   label: 'PASSING EFFICIENCY',   tone: 'passing',   stats: ['epa_per_db', 'cpoe', 'pass_rtg', 'cmp_pct', 'pass_imp_per_att', 'ttt', 'prs_pct', 'dp_pct', 'pa_ypg'] },
    { id: 'rushing-production',   label: 'RUSHING PRODUCTION',   tone: 'rushing',   stats: ['rush_att', 'rush_yd', 'rush_td'] },
    { id: 'rushing-efficiency',   label: 'RUSHING EFFICIENCY',   tone: 'rushing',   stats: ['ypc'] },
    { id: 'general-production',   label: 'GENERAL PRODUCTION',   tone: 'all',       stats: ['yds_total', 'fum'] },
    { id: 'general-efficiency',   label: 'GENERAL EFFICIENCY',   tone: 'all',       stats: ['imp_per_g'] }
  ],
  RB: [
    { id: 'fantasy',              label: 'FANTASY',              tone: 'all',       stats: ['fpts', 'ppg', 'fpoe'] },
    { id: 'rushing-production',   label: 'RUSHING PRODUCTION',   tone: 'rushing',   stats: ['snp_pct', 'rush_att', 'rush_yd', 'rush_td', 'rush_fd', 'rush_yac', 'mtf'] },
    { id: 'rushing-efficiency',   label: 'RUSHING EFFICIENCY',   tone: 'rushing',   stats: ['ypc', 'elu', 'mtf_per_att', 'yco_per_att', 'ryoe', 'ru_ypg'] },
    { id: 'receiving-production', label: 'RECEIVING PRODUCTION', tone: 'receiving', stats: ['rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar'] },
    { id: 'receiving-efficiency', label: 'RECEIVING EFFICIENCY', tone: 'receiving', stats: ['ts_per_rr', 'yprr'] },
    { id: 'general-production',   label: 'GENERAL PRODUCTION',   tone: 'all',       stats: ['yds_total', 'fum'] },
    { id: 'general-efficiency',   label: 'GENERAL EFFICIENCY',   tone: 'all',       stats: ['imp_per_g'] }
  ],
  WR: [
    { id: 'fantasy',              label: 'FANTASY',              tone: 'all',       stats: ['fpts', 'ppg', 'fpoe'] },
    { id: 'receiving-production', label: 'RECEIVING PRODUCTION', tone: 'receiving', stats: ['rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'rr'] },
    { id: 'receiving-efficiency', label: 'RECEIVING EFFICIENCY', tone: 'receiving', stats: ['ts_per_rr', 'yprr', 'first_down_rec_rate', 'ypr', 'rec_ypg', 'ay_pct'] },
    { id: 'general-production',   label: 'GENERAL PRODUCTION',   tone: 'all',       stats: ['yds_total', 'rush_att', 'rush_yd', 'rush_td', 'fum'] },
    { id: 'general-efficiency',   label: 'GENERAL EFFICIENCY',   tone: 'all',       stats: ['snp_pct', 'imp_per_g'] }
  ],
  TE: [
    { id: 'fantasy',              label: 'FANTASY',              tone: 'all',       stats: ['fpts', 'ppg', 'fpoe'] },
    { id: 'receiving-production', label: 'RECEIVING PRODUCTION', tone: 'receiving', stats: ['rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'rr'] },
    { id: 'receiving-efficiency', label: 'RECEIVING EFFICIENCY', tone: 'receiving', stats: ['ts_per_rr', 'yprr', 'first_down_rec_rate', 'ypr', 'rec_ypg', 'ay_pct'] },
    { id: 'general-production',   label: 'GENERAL PRODUCTION',   tone: 'all',       stats: ['yds_total', 'rush_att', 'rush_yd', 'rush_td'] },
    { id: 'general-efficiency',   label: 'GENERAL EFFICIENCY',   tone: 'all',       stats: ['snp_pct', 'fum', 'imp_per_g'] }
  ]
}
```

**Insertion rule**: Add the internal key to the `stats` array at the desired position within the desired section. The array order = the display order of stat rows within that section.

> **Default placement**: If the prompt's Additional Notes do not indicate specific placement for the stat relative to its location, append to the end of the section's `stats` array.

### 4B. Section Header Color (tone)

No code change needed if placing the stat into an **existing** section — the section's `tone` already controls the header color.

**Section header CSS classes** (auto-applied from `tone`, styles.css):
| Tone | Header Color | CSS Class |
|------|-------------|-----------|
| `all` | `#b7adfe` (purple) | `.gamelogs-szn-section-header--all` (Line 5338) |
| `passing` | `#FFB2D8` (pink) | `.gamelogs-szn-section-header--passing` (Line 5323) |
| `rushing` | `#75e0b7` (green) | `.gamelogs-szn-section-header--rushing` (Line 5328) |
| `receiving` | `#63b0de` (blue) | `.gamelogs-szn-section-header--receiving` (Line 5333) |

**How it's applied** (~Line 4960 in app.js):
```javascript
if (section.tone) header.classList.add(`gamelogs-szn-section-header--${section.tone}`);
```

### 4C. Stat Row Label Color

**Already handled** by Step 3B (`statGroupByKey`). The SZN view row renderer reads the same map:

```javascript
// ~Line 5008 in app.js
const group = statGroupByKey?.get(statKey);
if (group) row.classList.add(`gamelogs-szn-row--${group}`);
```

**Row CSS classes** (styles.css):
| Category | Label Color | CSS Class |
|----------|------------|-----------|
| `all` | `#b7adfe` | `.gamelogs-szn-row--all` (Line 5377) |
| `passing` | `#FFB2D8` | `.gamelogs-szn-row--passing` (Line 5365) |
| `rushing` | `#75e0b7` | `.gamelogs-szn-row--rushing` (Line 5369) |
| `receiving` | `#63b0de` | `.gamelogs-szn-row--receiving` (Line 5373) |

> **No additional CSS changes needed** for any of the three surfaces, as long as the stat uses one of the four existing categories.

---

### SZN VIEW SUMMARY CHECKLIST

| Step | Structure | File | Required? |
|------|-----------|------|-----------|
| 4A | `SZN_STAT_SECTIONS_BY_POS` | app.js ~L4495 | **YES** — stat won't appear in SZN view without it |
| 4B | Section `tone` | (already set per section) | Only if creating a NEW section |
| 4C | `statGroupByKey` | (already done in Step 3B) | Already handled — no duplicate work |

---

## 5. COLOR CATEGORY SYSTEM (Shared Reference)

There are **three independent color category maps** in the codebase. They use the same four category names but are defined separately and serve different surfaces:

| Map | File | Line | Used By | CSS Prefix |
|-----|------|------|---------|------------|
| `COLUMN_CATEGORY` | stats.js | ~L43 | Stats page table headers | `stats-header-` |
| `statGroupByKey` | app.js | ~L5288 | Game logs table headers/footer + SZN row labels | `gamelog-header-` / `gamelogs-szn-row--` |
| Section `tone` field | app.js | ~L4495 | SZN view section headers | `gamelogs-szn-section-header--` |

**When adding a new stat to all three surfaces, you must register it in all three maps** (or two if the stat only appears on some surfaces). The category choice should be consistent across all three for visual coherence.

### Color Values by Surface

| Category | Stats Page Header | GL Header/Footer | SZN Section Header | SZN Row Label |
|----------|-------------------|-------------------|--------------------|---------------|
| `all` | `#ADA2FF` | `#b7adfe` | `#b7adfe` | `#b7adfe` |
| `passing` | `#FFB2D8` | `#FFB2D8` | `#FFB2D8` | `#FFB2D8` |
| `rushing` | `#9cf7d4` | `#75e0b7` | `#75e0b7` | `#75e0b7` |
| `receiving` | `#A0C2F7` | `#63b0de` | `#63b0de` | `#63b0de` |

> Note: Stats page rushing green (`#9cf7d4`) is slightly different from game logs rushing green (`#75e0b7`). This is by design — they are independent CSS rules in different files.

---

## 6. OPTIONAL / CONDITIONAL EDITS

These steps are **not always needed** — only apply them when their condition is met.

### 6A. `NO_FALLBACK_KEYS` (app.js ~Line 3057)

**Condition**: The stat is a pre-computed rate/efficiency stat from the CSV that should NOT be recalculated from raw totals if missing.

```
Pattern:  Add 'internal_key' to the Set
```

### 6B. Custom Display Value Logic in SZN View

**File**: `app.js` — `getGameLogsSeasonDisplayValue()` function  
**Line ref**: ~Line 4860  
**Condition**: The stat needs special calculation logic (e.g., `snp_pct` averages snap percentages, `cmp_pct` computes completion rate from totals).

> Most stats just use the default path: read from `seasonTotals[key]` or `aggregatedTotals[key]`. Only add custom logic if the stat cannot be displayed as a simple total or needs special formatting.

### 6C. Game Logs Column Width Customization

**File**: `app.js` — `COLUMN_WIDTHS` inside game logs render  
**Line ref**: ~Line 5371  
**Condition**: Default width of 54px is too narrow or too wide for the stat's typical values.

---

## 7. VERIFICATION CHECKLIST

After implementing, verify:

- [ ] **Stats page**: Stat column appears in the table for the correct position filters
- [ ] **Stats page**: Column header has the correct color (matches its category)
- [ ] **Stats page**: Column sorts correctly (numeric, ascending/descending as appropriate)
- [ ] **Game logs modal**: Stat column appears in weekly table for the correct player position(s)
- [ ] **Game logs modal**: Weekly table header has the correct color
- [ ] **Game logs modal**: Footer row shows season total/average for the stat
- [ ] **Game logs modal**: Footer header has the correct color (same as weekly header)
- [ ] **SZN view**: Stat appears in the correct section for the correct position(s)
- [ ] **SZN view**: Section header has the correct label and color
- [ ] **SZN view**: Stat row label has the correct color
- [ ] **SZN view**: Progress bar and rank display correctly
- [ ] No cross-page side effects (other pages/positions unaffected)

---

## 8. EXAMPLES OF WHAT INPUT LOOKS LIKE

The following examples show the format an agent will receive when asked to add a stat. The agent should use this document to look up every step needed for each surface listed.

### Input Format Legend

```
✦  Year / context

    ◎  Position(s) the stat applies to

        →  Category / color group (rushing, passing, receiving, all)

Additional Notes: placement hints, special instructions, or "NA"
```

---

### EXAMPLE: Adding a Rushing Stat (e.g., `ruBTKL`) for QB and RB

**1. STATS PAGE MAIN TABLE**

STAT: ruBTKL

✦ 2025

  ◎ QB and RB

    → Rushing

Additional Notes: "Place column to the right of YPC in QB and RB column sets"


**Workflow the agent would follow**:

| Step | Action | File | Line Area |
|------|--------|------|-----------|
| 2A | Add `['ruBTKL', 'ruBTKL']` to `HEADER_ALIASES` if CSV header differs | stats.js | ~L17 |
| 2B | Add `'ruBTKL': 'rushing'` to `COLUMN_CATEGORY` | stats.js | ~L43 |
| 2C | Insert `'ruBTKL'` after `'YPC'` in `COLUMN_SETS.QB` and `COLUMN_SETS.RB` | stats.js | ~L31 |
| 2D | Add `'ruBTKL': 64` to `STATS_COLUMN_WIDTHS` | stats.js | ~L266 |
| 2E | Add `'ruBTKL'` to `NUMERIC_SORT_COLUMNS` | stats.js | ~L326 |
| 2F | Skip — volume stat, not efficiency | stats.js | — |
| 2G | Add `'ruBTKL'` to `INTEGER_COLUMNS` — counting stat, display as whole number | stats.js | ~L107 |
| 2J | Add HTML key-item entry to stats.html | stats.html | ~L209 area |

---

**2. GAME LOGS MODAL: WEEKLY TABLE + SEASON FOOTER**

STAT: ruBTKL

✦ 2025

  ◎ QB and RB

    → Rushing

Additional Notes: "Place column to right of YPC stat column"


**Workflow the agent would follow**:

| Step | Action | File | Line Area |
|------|--------|------|-----------|
| 3A | Add `'ruBTKL': 'rush_btkl'` to `PLAYER_STAT_HEADER_MAP` | app.js | ~L2978 |
| 3B | Add `'rush_btkl'` to the `rushing` group in `assignStatGroup()` | app.js | ~L5288 |
| 3C | Insert `'rush_btkl'` after `'ypc'` in `qbStatOrder` AND `rbStatOrder` | app.js | ~L5051 |
| 3D | Optionally add `rush_btkl: 40` to game logs `COLUMN_WIDTHS` | app.js | ~L5371 |

---

**3. GAME LOGS MODAL: SEASON (SZN) VIEW**

STAT: ruBTKL

✦ 2025

  ◎ QB and RB

    → Rushing Production

Additional Notes: NA


**Workflow the agent would follow**:

| Step | Action | File | Line Area |
|------|--------|------|-----------|
| 4A | Add `'rush_btkl'` to QB's `rushing-production` section `stats` array | app.js | ~L4495 |
| 4A | Add `'rush_btkl'` to RB's `rushing-production` section `stats` array | app.js | ~L4495 |
| 4B | No change — using existing section with `tone: 'rushing'` | — | — |
| 4C | Already handled in Step 3B (`statGroupByKey` has `rush_btkl` → `rushing`) | — | — |

---

### CRITICAL NOTES FOR AGENT EXECUTION

1. **Internal key naming**: When adding a stat to `PLAYER_STAT_HEADER_MAP` (Step 3A), the internal key must be consistent across ALL surfaces. The Stats page uses display abbreviations (e.g., `ruBTKL`), while Game Logs uses internal keys (e.g., `rush_btkl`). The bridge between them is `PLAYER_STAT_HEADER_MAP` which maps `'ruBTKL' → 'rush_btkl'`.

2. **Three separate category registrations**: Registering in `COLUMN_CATEGORY` (stats.js) does NOT register in `statGroupByKey` (app.js), and vice versa. Both must be done.

3. **SZN sections use internal keys**: All keys in `SZN_STAT_SECTIONS_BY_POS` are internal keys (e.g., `rush_btkl`), not display abbreviations.

4. **Position stat order arrays use internal keys**: Similarly, `qbStatOrder`, `rbStatOrder`, `wrTeStatOrder` use internal keys.

5. **`COLUMN_SETS` uses display abbreviations**: The stats page column sets use the display abbreviation (e.g., `ruBTKL`), not the internal key.

6. **No CSS changes needed**: The four color categories (`all`, `passing`, `rushing`, `receiving`) already have CSS rules defined for all surfaces. Adding a stat to an existing category requires zero CSS changes.

7. **The "Additional Notes" field** in the input tells the agent WHERE to place the column (relative to other columns). When it says "to the right of X", insert after X in the relevant array.

8. **The `→` arrow** in the input always tells the agent the color category. If it says `→ Rushing`, the stat goes in the `rushing` category in all relevant maps. If the SZN view input says `→ Rushing Production`, it means add the stat to the section with `id: 'rushing-production'` and `tone: 'rushing'`.
