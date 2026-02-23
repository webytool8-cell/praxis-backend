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
```


### If Vercel still fails with the same package.json parse error

That means the deployed branch already contains a malformed `package.json` blob. Repair it by restoring a known-good file and pushing a clean commit:

```bash
# from your target branch (main or preview branch)
git fetch origin
git checkout <target-branch>

# restore package.json from a known-good branch or commit
git checkout origin/work -- package.json
# or: git checkout <good_commit_sha> -- package.json

node scripts/validate-config.mjs
git add package.json
git commit -m "Restore valid package.json after bad merge resolution"
git push
```

Also enable **branch protection** on `main` and require the `JSON Guard` check before merge.


### One-shot safe merge command block

```bash
git fetch origin
git checkout <feature-branch>
git merge origin/main
git checkout --ours package.json .eslintrc.json vercel.json
git add package.json .eslintrc.json vercel.json
node scripts/validate-config.mjs
rg -n "^(<<<<<<<|=======|>>>>>>>)" .
git add .
git commit -m "Resolve merge conflicts safely"
git push
```

## Notes

- Graph data and insights are placeholder data for now.
- TODO comments mark backend AI analysis integration points.
