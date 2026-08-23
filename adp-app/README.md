# Rookie ADP and NFL Draft Hit Rates

Responsive fantasy-football dashboards that visualize career hit rates by
rookie ADP and NFL Draft capital. The application uses the Next.js App Router,
React, TypeScript, Recharts, and Tailwind CSS.

## Requirements

- Node.js `>=22.13.0` (Node 24 is selected in `.nvmrc`)
- npm

## Local development

Install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000/adp/](http://localhost:3000/adp/).

The NFL Draft study is available at
[http://localhost:3000/adp/nfl-draft/](http://localhost:3000/adp/nfl-draft/).

## Validation

```bash
npm test
```

The test command runs ESLint, creates the production static export, and copies
that export into `../DH_P2.53/adp/`. You can also run those checks separately
with `npm run lint` and `npm run build`.

## Repository layout

- `app/` contains the dashboard route, global styles, and metadata.
- `public/` contains static assets.
- `next.config.ts` contains Next.js configuration.
- `package-lock.json` pins the npm dependency tree.

Dependencies and generated output such as `node_modules/`, `.next/`, coverage,
logs, local environment files, and `.netlify/` are intentionally ignored by
Git.

## Dynasty Hub integration

This source remains an isolated Next.js application under the Dynasty Hub
repository. `next.config.ts` exports it beneath `/adp/`, and the postbuild script
publishes only that generated route into the Vanilla app's existing
`DH_P2.53` directory. The root `netlify.toml` runs this locked build before it
publishes Dynasty Hub; no separate Next.js runtime or deployment is required.
