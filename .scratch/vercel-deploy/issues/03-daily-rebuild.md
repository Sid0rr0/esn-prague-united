# 03: Rebuild the site every morning

**What to build:** The website rebuilds once a day on its own, early in the morning Prague time, so an Event that ended yesterday shows under Past events and stops offering tickets without anyone publishing. A maintainer can also start the rebuild by hand. The runbook explains the schedule in both UTC and Prague time, and tells you what to do if GitHub pauses the schedule.

This replaces site-design-alignment ticket 13. See the spec: `.scratch/vercel-deploy/spec.md`.

**Blocked by:** 01 (Deploy the site on Vercel, with PR previews).

**Status:** ready-for-agent

The agent writes the workflow and docs. The maintainer does the dashboard step from the runbook:

1. Add the Deploy Hook URL from ticket 01 as the `VERCEL_DEPLOY_HOOK_URL` repository secret on GitHub.

- [ ] A GitHub Actions workflow runs on a schedule at 02:00 UTC and can also be started by hand.
- [ ] The workflow POSTs to the Deploy Hook from the secret, fails if the response isn't 2xx, and doesn't check out the repo or install dependencies.
- [ ] `actionlint` passes on the workflow.
- [ ] A manual run creates a new production deployment on Vercel.
- [ ] An Event whose end date has passed shows under Past events after the next scheduled run, with no publish in between.
- [ ] The runbook covers the secret, the schedule (03:00 in Prague in winter, 04:00 in summer) and turning the workflow back on after GitHub's 60-day pause.
