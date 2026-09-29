# 02: Rebuild the site when an editor publishes

**What to build:** When an editor publishes, unpublishes or deletes a document in the Studio, the website rebuilds on its own and the change is live within about two minutes. Saving a draft doesn't rebuild the site. The Studio README describes this accurately, and the runbook has a section explaining how the Sanity webhook is set up.

See the spec: `.scratch/vercel-deploy/spec.md`.

**Blocked by:** 01 (Deploy the site on Vercel, with PR previews).

**Status:** ready-for-agent

The agent writes the docs. The maintainer does the dashboard step from the runbook:

1. In Sanity's API settings, add a GROQ webhook for the production dataset. It fires on create, update and delete, filters out drafts with `!(_id in path("drafts.**"))`, sends an HTTP POST with no payload, and targets the Deploy Hook URL from ticket 01.

- [ ] Publishing a document in the Studio starts a production build on Vercel, and the change is live within about two minutes.
- [ ] Deleting or unpublishing a published document starts a build.
- [ ] Editing a draft without publishing does not start a build.
- [ ] The Studio README's rebuild-on-publish note matches that timing.
- [ ] The runbook documents the webhook's triggers, filter and target, but not the hook URL itself.
