# PRAXIS Frontend (Initial Scaffold)

Next.js App Router frontend scaffold for PRAXIS.

## Run locally

```bash
npm install
npm run dev
```

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
