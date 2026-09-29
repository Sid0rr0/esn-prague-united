# 01: Deploy the site on Vercel, with PR previews

**What to build:** The website is live on Vercel as a static site. Every push to `main` deploys to the project's `*.vercel.app` production address, and every pull request gets its own preview URL. A Deploy Hook on `main` exists, ready for the automatic rebuilds in tickets 02 and 03. The docs say Vercel instead of Cloudflare Pages, the domain glossary no longer names a host, and a setup runbook next to the web app's README describes the Vercel dashboard steps so someone else can recreate the project.

See the spec: `.scratch/vercel-deploy/spec.md`.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

The agent writes the docs and runbook. The maintainer does the dashboard steps from the runbook:

1. Create the Vercel project on the ESN Prague account (Hobby plan, organisation email) through the GitHub integration, with the web app as Root Directory. Leave the Ignored Build Step off, and add no `vercel.json`.
2. Set `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` for Production and Preview.
3. Create a Deploy Hook on `main`. Keep its URL private and never commit it.

- [ ] `pnpm build` from the repo root passes.
- [ ] A merge to `main` shows up on the `*.vercel.app` production address.
- [ ] A pull request gets a preview URL that renders the site with content from Sanity.
- [ ] A Deploy Hook on `main` exists, and its URL isn't anywhere in the repo.
- [ ] The root README and the Studio README say the site is hosted on Vercel, and nothing in the repo still claims Cloudflare Pages.
- [ ] The domain glossary's intro no longer names a hosting provider.
- [ ] The runbook covers the account, project settings, variables and Deploy Hook steps.
