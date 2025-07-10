# Time Life Tracker — SSR Deploy (Render/Netlify)

## Production SSR Deployment Checklist

- Ensure `.env` contains all secrets (GitHub token, repo, Telegram bot token) and is NOT committed.
- `netlify.toml` configures SSR for Next.js (see file).
- `.gitignore` excludes sensitive and unnecessary files.
- For Render.com, set build command to `npm run build` and start command to `npm run start`.
- All API routes must be server-only (no secrets leak to client!).
- Use dynamic imports with `ssr: false` only for client-only UI parts.
- Use `next/dynamic` for heavy/animated components.
- Avoid direct usage of `window`/`localStorage` outside `useEffect`.
- All fetches to `/api` should work both on server (SSR) and client.
- Test with `npm run build && npm start` locally before deploying.

## Netlify
- Deploy via GitHub or CLI (`netlify deploy`).
- Ensure SSR is enabled in Netlify dashboard.

## Render.com
- Connect repo, set build/start commands.
- Set environment variables in dashboard.
- Enable SSR and Node 18+.

---

For any issues, see Next.js/Netlify/Render docs or contact maintainer.
