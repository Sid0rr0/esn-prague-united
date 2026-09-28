# 13: Scheduled daily rebuild

**What to build:** The site rebuilds once a day on its own, not only when an editor presses Publish. Whether an Event has ended is decided at build time, so today an ended Event keeps showing as upcoming (on `/events` and the homepage) and keeps offering tickets (on its Event page) until the next publish.

**Blocked by:** None (can start immediately).

**Status:** waiting-on-user

Manual setup is needed first; the repo has no CI or deploy configuration:

1. Create a Cloudflare Pages deploy hook for the web app.
2. Choose the trigger: a GitHub Actions scheduled workflow or a Cloudflare Worker cron trigger.
3. Store the deploy hook URL as a secret where that trigger runs. Never commit it.

- [ ] A deploy hook exists and is stored as a secret.
- [ ] A daily trigger calls the hook, early in the morning Prague time.
- [ ] An Event that ended yesterday shows as past the next day without anyone publishing.
