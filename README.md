<<<<<<< HEAD
# PRAXIS Frontend

Dark, minimalist Next.js App Router frontend for PRAXIS system visualization.
=======
<<<<<<< HEAD
# PRAXIS Frontend

Dark, minimalist Next.js App Router frontend for PRAXIS system visualization.
=======
# PRAXIS Frontend (Initial Scaffold)

Next.js App Router frontend scaffold for PRAXIS.
>>>>>>> codex/generate-next.js-project-structure-for-praxis
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1

## Run locally

```bash
npm install
npm run dev
```

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
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

<<<<<<< HEAD
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
=======
## Conflict-resolution workflow (GitHub web editor + CLI)

If GitHub says this branch has conflicts, resolve them before merging:

### Option A: GitHub web editor

1. Open the PR and click **Resolve conflicts**.
2. For each conflicted file, keep the newer dark-dashboard implementation unless you intentionally need older content.
3. Remove all conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Mark as resolved and commit merge.

### Option B: command line
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1

```bash
git fetch origin
git merge origin/main
# or: git rebase origin/main
<<<<<<< HEAD
rg -n "^(<<<<<<<|=======|>>>>>>>)" .
```


### Prevent recurring merge corruption

To avoid re-introducing malformed `package.json` during future merges, this repo uses `.gitattributes` to prefer the current branch version for high-risk JSON config files (`package.json`, `.eslintrc.json`, `vercel.json`).

If you need the other side explicitly, override with:

```bash
git checkout --theirs package.json .eslintrc.json vercel.json
git add package.json .eslintrc.json vercel.json
```


### CI guard for merge-related JSON breakage

A GitHub Actions workflow (`JSON Guard`) now validates that `package.json`, `.eslintrc.json`, and `vercel.json`:

- contain no conflict markers
- parse as strict JSON

You can run the same check locally:

```bash
node scripts/validate-config.mjs
=======
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
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
```

## Notes

- Graph data and insights are placeholder data for now.
- TODO comments mark backend AI analysis integration points.
<<<<<<< HEAD
=======
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
>>>>>>> codex/generate-next.js-project-structure-for-praxis
>>>>>>> codex/generate-next.js-project-structure-for-praxis-tnp5m1
