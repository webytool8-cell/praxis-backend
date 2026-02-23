#!/usr/bin/env bash
set -euo pipefail

FILES=(
  .eslintrc.json
  .github/workflows/json-guard.yml
  README.md
  app/globals.css
  app/layout.tsx
  app/page.tsx
  app/repo/page.tsx
  app/upload/page.tsx
  components/layout/Navbar.tsx
  components/layout/Sidebar.tsx
  components/ui/Button.tsx
  components/ui/Input.tsx
  dashboard/ControlsPanel.tsx
  dashboard/DetailsPanel.tsx
  dashboard/GraphViewport.tsx
  forms/FileUploadForm.tsx
  forms/RepoSelectorForm.tsx
  package.json
  store/usePraxisStore.ts
  tailwind.config.ts
  types/graph.ts
  views/DashboardView.tsx
)

echo "Resolving listed files by preferring current branch content..."
for f in "${FILES[@]}"; do
  if git checkout --ours -- "$f" 2>/dev/null; then
    :
  else
    git checkout HEAD -- "$f"
  fi
  git add "$f"
done

echo "Running merge-state validation..."
npm run validate:merge
node scripts/validate-config.mjs

echo "Done. Review with: git status"
