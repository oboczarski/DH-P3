# SZN View Stat Sections (Game Logs Modal)

This project’s **SZN** view (the single-player season stats screen inside the Game Logs modal) is grouped into **position-based sections** with headers.

## Where to edit the section setup

Open:

- `DH_P2.53/scripts/app.js`

Search for:

- `SZN_STAT_SECTIONS_BY_POS`

That constant is the **single source of truth** for:

- Which sections exist for each position
- The order the sections appear
- Which stats appear in each section
- The order stats appear inside each section

## How the config works

`SZN_STAT_SECTIONS_BY_POS` is an object with one entry per position:

- `QB`
- `RB`
- `WR`
- `TE`

Each position has an array of section objects:

```js
{ id, label, tone, stats }
```

- `id`: Internal identifier (safe to rename).
- `label`: The header text shown in the UI.
- `tone`: Optional styling hook used to color the header (`passing`, `rushing`, `receiving`, `all`).
- `stats`: Array of **stat keys** in the exact order you want them rendered.

## Common edits

### Reorder sections

In `SZN_STAT_SECTIONS_BY_POS.<POSITION>`, move the section objects up/down in the array.

### Add a new section

Add a new object to the position’s array:

```js
{
  id: 'my-section',
  label: 'MY SECTION',
  tone: 'all',
  stats: ['fpts', 'yds_total']
}
```

### Remove a section

Delete that section object from the position’s array.

### Move stats between sections

Cut the stat key from one `stats: [...]` list and paste it into another section’s `stats: [...]` list.

### Change stat order inside a section

Reorder the stat keys inside that section’s `stats: [...]` array.

### Hide a stat from SZN

Remove the stat key from all `stats: [...]` arrays for that position.

## Finding valid stat keys

The SZN renderer will only show keys that have a label in `buildStatLabels()` and are not `proj`.

To see the existing stat keys used in the modal today, look in:

- `DH_P2.53/scripts/app.js` inside `renderGameLogs(...)`
  - `const qbStatOrder = [...]`
  - `const rbStatOrder = [...]`
  - `const wrTeStatOrder = [...]`

Those arrays are the easiest “menu” of stat keys that already work in the modal.

## Styling section headers

Section headers are styled in:

- `DH_P2.53/styles/styles.css`

Search for:

- `.gamelogs-szn-section-header`

`tone` maps to these classes:

- `.gamelogs-szn-section-header--passing`
- `.gamelogs-szn-section-header--rushing`
- `.gamelogs-szn-section-header--receiving`
- `.gamelogs-szn-section-header--all`

If you add a new `tone` value, add a matching CSS rule for it.

