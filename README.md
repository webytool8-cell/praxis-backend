# PRAXIS Frontend

Dark + minimal + gradient modern PRAXIS UI built with Next.js App Router, TypeScript, Tailwind, Zustand, and React Flow.

## Run locally

```bash
npm install
npm run dev
npm run validate:merge
```

## Implemented structure

- `components/shell/` AppShell + TopBar
- `components/controls/` control panel, templates, filters, layers, export action
- `components/graph/` GraphCanvas + NodeCard
- `components/details/` right-side details panel and metrics UI
- `lib/graph/` mock graph + template layout builder
- `lib/theme/` tokens + class utility
- `store/useAppStore.ts` central dashboard UI state
- `scripts/` merge + config validation tooling

## Safety checks (must pass before merge)

```bash
npm run validate:merge
node scripts/validate-config.mjs
```

## Conflict helper for recurring 22-file set

```bash
npm run resolve:conflicts
```

## Notes

- Graph/templates are mock data and ready for backend AI integration.
- PDF export is available via left panel Export button.
