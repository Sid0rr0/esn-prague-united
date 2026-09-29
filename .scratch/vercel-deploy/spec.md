# Spec: Deploy the website on Vercel

Status: ready-for-agent

## Problem Statement

The ESN Prague website isn't deployed anywhere yet. The docs say it runs on Cloudflare Pages, but it never did. There's no hosting project, no rebuild when an editor publishes, and no scheduled rebuild. The Studio README tells editors that "after you press Publish, the website rebuilds automatically (about a minute)", but nothing makes that happen. Because the site is static, whether an Event has ended is decided at build time. Without a daily rebuild, an ended Event keeps showing as upcoming and keeps offering tickets until someone happens to publish. The maintainers know Vercel much better than Cloudflare, so building the deploy pipeline on Cloudflare would mean learning a tool nobody on the team knows.

## Solution

The website is deployed on Vercel as a single static site, built from the repository on every push:

- Pushes to `main` go to production.
- Every pull request gets its own preview URL.
- When an editor publishes, updates or deletes content in the Studio, the site rebuilds on its own.
- The site also rebuilds once a day, early in the morning Prague time, so Events that ended yesterday show as past without anyone publishing.

The site launches on its `*.vercel.app` address. The real domain comes later. The Studio stays where it is, on Sanity's own hosting. The docs are updated to name Vercel, and the domain glossary no longer mentions hosting at all.

## User Stories

1. As an editor, I want the website to rebuild on its own after I press Publish, so that my changes go live without asking a developer.
2. As an editor, I want my published change to be live within about two minutes, so that I can check it on the site straight away.
3. As an editor, I want saving a draft _not_ to rebuild the site, so that half-finished content never goes live and builds aren't wasted.
4. As an editor, I want deleting a published document to rebuild the site, so that removed content disappears from the site.
5. As an editor, I want unpublishing a document to rebuild the site, so that content I took down stops showing.
6. As an editor, I want the Studio README to describe what really happens when I publish, so that I can trust the instructions.
7. As a visitor, I want an Event that ended yesterday to appear under Past events today, so that I don't plan to attend something that's over.
8. As a visitor, I want an ended Event's page to stop offering tickets by the next morning, so that I don't try to buy tickets I can't use.
9. As a visitor, I want the homepage to stop featuring Events that have ended, so that it only promotes things I can still attend.
10. As a visitor, I want the site served quickly from a CDN, so that pages load fast on mobile data.
11. As a developer, I want every pull request to get a preview URL, so that I can review visual changes before merging.
12. As a developer, I want a merge to `main` to reach production on its own, so that releasing needs no manual steps.
13. As a developer, I want Vercel to build the site with the same build command I run locally, including the Astro type check, so that a build that passes locally passes on Vercel too.
14. As a developer, I want a production build to fail loudly if the Sanity project ID is missing, so that a misconfigured project never publishes an empty site.
15. As a developer, I want the monorepo's pnpm workspace installed correctly on Vercel, so that the web app's dependencies resolve the same way as locally.
16. As a developer, I want to be able to run the daily rebuild by hand, so that I can check it works without waiting until the next morning.
17. As a developer, I want the daily rebuild's workflow definition to be linted, so that a typo doesn't silently stop the daily rebuild.
18. As a maintainer, I want the deploy hook URL kept only in Sanity's webhook settings and in a GitHub secret, never committed, so that nobody outside can trigger builds.
19. As a maintainer, I want the Vercel project owned by an ESN Prague account rather than one volunteer's personal account, so that the site survives when volunteers leave.
20. As a maintainer, I want the step-by-step setup in the Vercel, Sanity and GitHub dashboards written down, so that someone else can rebuild or audit the setup.
21. As a maintainer, I want the daily rebuild's trigger time documented in both UTC and Prague time, so that daylight saving time doesn't confuse anyone.
22. As a maintainer, I want to know the scheduled workflow stops after 60 days without repo activity, so that I know why it stopped and how to turn it back on.
23. As a maintainer, I want the READMEs to say the site is on Vercel, so that nobody goes looking for a Cloudflare project that doesn't exist.
24. As a maintainer, I want the domain glossary to contain no hosting details, so that it stays a glossary and doesn't go stale when the hosting changes.
25. As a maintainer, I want the Studio to stay on Sanity's own hosting at its current URL, so that editors' bookmarks and logins keep working.
26. As a maintainer, I want the site to stay a plain static build with no host-specific adapter, so that moving hosts again is only a settings change.

## Implementation Decisions

- **Why Vercel:** the maintainers already know it well. Cloudflare Pages was planned but never set up, so there's nothing to migrate or cut over.
- **Rendering stays fully static.** No `@astrojs/vercel` adapter, no server functions, and no ISR. Vercel runs the web app's existing build script and serves its static output.
- **One Vercel project, not services mode.** The project's Root Directory is the web app, and Vercel detects Astro and the pnpm workspace on its own. There's no `vercel.json`. The Studio isn't built on Vercel. The two apps never call each other, since the site reads Sanity's API directly, so there are no service bindings.
- **Plan:** Vercel Hobby, on an account owned by ESN Prague and signed up with an organisation email.
- **Git integration:** Vercel's GitHub app. The production branch is `main`, and preview deployments are on for all other branches and PRs.
- **No Ignored Build Step.** Every push builds, including Studio-only commits. That's cheap on Hobby, and a skip rule might also block builds started by the deploy hook.
- **Project settings:** `PUBLIC_SANITY_PROJECT_ID` (required) and `PUBLIC_SANITY_DATASET` (optional, defaults to `production`). Both are public values, not secrets. They're set for Production and Preview.
- **Domain:** the site launches on the project's `*.vercel.app` address. The real domain gets its own ticket later.
- **Rebuild on publish:** a Vercel Deploy Hook on `main`, called by a Sanity GROQ webhook.
  - It fires on create, update and delete.
  - Its filter skips drafts: `!(_id in path("drafts.**"))`.
  - It uses HTTP POST with no payload.
  - The hook URL is stored only in Sanity's webhook settings.
- **Daily rebuild:** a GitHub Actions workflow triggered on `schedule` at `0 2 * * *` UTC (03:00 in Prague in winter, 04:00 in summer) and on `workflow_dispatch`.
  - It POSTs to the deploy hook, which it reads from the `VERCEL_DEPLOY_HOOK_URL` repository secret.
  - It fails the run if the hook returns a non-2xx status.
  - It doesn't check out the repo or install dependencies.
- **Docs:**
  - The root README and the Studio README say "Vercel" instead of "Cloudflare Pages".
  - The Studio README's promise about rebuilding on publish now matches the real setup.
  - The domain glossary's intro drops the host.
  - A short setup runbook for the Vercel, Sanity and GitHub dashboards lives next to the web app's README.
- **This spec replaces site-design-alignment ticket 13** (Scheduled daily rebuild). That ticket is closed with a pointer here.
- **No ADR.** The decision is cheap to reverse, since the site is static with no adapter, so it fails the "hard to reverse" test.

## Testing Decisions

- **No new test seams.** Nothing in the site's behavior changes. The existing render seam and its tests stay as they are, and they cover how the site decides whether an Event has ended from the build time.
- **Build check:** `pnpm build` from the repo root still passes. That's the same build Vercel runs for the web app.
- **Workflow check:** the daily-rebuild workflow is linted with `actionlint`. Once the secret exists, it's run once by hand through `workflow_dispatch`, and it passes if a new deployment appears in Vercel.
- **Manual acceptance in the dashboards:**
  - A PR gets a preview URL.
  - A merge to `main` reaches production.
  - Publishing in the Studio starts a production build within about two minutes.
  - Saving a draft does _not_ start a build.
  - An Event whose end date has passed shows under Past events after the scheduled rebuild, with no publish in between.
- **No automated smoke check after deploys.** Automated tests only check behavior visible from outside the site. The hosting setup is covered by the manual checks above.

## Out of Scope

- A custom domain and its DNS, including any cutover from an old ESN Prague site.
- Hosting the Studio on Vercel (services mode, a `/studio` path, a changed Studio `basePath` or new CORS origins). The Studio stays on Sanity's hosting.
- Server rendering, ISR, on-demand revalidation or Vercel Cron Jobs (they would need functions).
- Draft previews or Sanity Visual Editing on preview deployments.
- An automated smoke check after deploys, and uptime monitoring.
- Skipping builds for Studio-only commits.
- Moving to a paid Vercel plan or applying for sponsorship.

## Further Notes

- **Hobby terms of service:** Vercel's Hobby plan is for non-commercial use. The site credits sponsoring Partners and links to ticket sales. If Vercel treats that as commercial, the fix is to move to Pro or apply for Vercel's nonprofit or open-source sponsorship. The static setup doesn't change either way.
- **GitHub pauses scheduled workflows** in public repositories after 60 days without repo activity. If the site goes quiet for that long, the daily rebuild stops until someone turns it back on in the Actions tab. The runbook should say so.
- **The cron time is in UTC** and doesn't follow Prague's daylight saving time. Either 03:00 or 04:00 local is fine for "early morning".
- **Vercel may queue several builds** when an editor publishes many documents quickly. That's acceptable at this site's scale.
