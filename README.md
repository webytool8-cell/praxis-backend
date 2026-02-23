# PRAXIS Frontend

Dark, minimalist Next.js App Router frontend for PRAXIS system visualization.

## Run locally

```bash
npm install
npm run dev
```

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

## Conflict-resolution workflow (GitHub web editor + CLI)

If GitHub says this branch has conflicts, resolve them before merging:

### Option A: GitHub web editor

1. Open the PR and click **Resolve conflicts**.
2. For each conflicted file, keep the newer dark-dashboard implementation unless you intentionally need older content.
3. Remove all conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Mark as resolved and commit merge.

### Option B: command line

```bash
git fetch origin
git merge origin/main
# or: git rebase origin/main
```

Then edit each conflicted file, remove conflict markers, and finish with:

```bash
git add .
git commit
# if rebasing: git rebase --continue
```

Validation commands:

```bash
rg -n "^(<<<<<<<|=======|>>>>>>>)" .
git status
```

## Notes

- Graph data and insights are placeholder data for now.
- TODO comments mark backend AI analysis integration points.
