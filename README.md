<<<<<<< HEAD
# PRAXIS Frontend

Dark, minimalist Next.js App Router frontend for PRAXIS system visualization.
=======
# PRAXIS Frontend (Initial Scaffold)

Next.js App Router frontend scaffold for PRAXIS.
>>>>>>> main

## Run locally

```bash
npm install
npm run dev
```

<<<<<<< HEAD
## Core structure

- `app/` routes and layout shell
- `components/ui/` design system primitives (Button, Input, Panel, ToggleGroup)
- `components/layout/` navbar/sidebar
- `dashboard/` controls, graph canvas, node card, details panel, graph templates
- `forms/` upload + GitHub repo forms
- `store/` Zustand state
- `utils/pdfExport.ts` PDF report utility

## Deploy with GitHub + Vercel

1. Push branch to GitHub.
2. Import repo in Vercel.
3. Ensure settings:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: default/empty (not `public`)

## Troubleshooting build failures

### `SyntaxError ... package.json: Expected double-quoted property name`

This usually means `package.json` still has merge-conflict artifacts or invalid JSON syntax.

Run these checks before pushing:

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json valid')"
rg -n "^(<<<<<<<|=======|>>>>>>>)" package.json
```

If conflicts are present, remove markers and keep one valid JSON shape only (no comments/trailing commas).

### Conflict cleanup for branch merges

```bash
git fetch origin
git merge origin/main
# or: git rebase origin/main
rg -n "^(<<<<<<<|=======|>>>>>>>)" .
```

## Notes

- Graph data and insights are placeholder data for now.
- TODO comments mark backend AI analysis integration points.
=======
## Deploy with GitHub + Vercel (online-only workflow)

1. Push this branch/repo to GitHub.
2. In Vercel, click **Add New → Project** and import your GitHub repository.
3. Keep defaults for a Next.js app:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output: `.next` (auto)
4. Add environment variables in Vercel Project Settings if needed.
5. Deploy.

### Important build note

Vercel does **not** support `next.config.ts` in this setup. This project uses `next.config.mjs` for compatibility.

## Notes

- Tailwind CSS is configured for utility-first styling.
- Zustand holds placeholder graph-node selection state.
- API integration points are marked with TODO comments.
>>>>>>> main
