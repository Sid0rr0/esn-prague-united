# 02: "Update website" button in the Studio

**What to build:** An editor presses **Update website** in the Studio navbar and the website starts a Site update: the published content goes live within about two minutes. Publishing a document does not start a Site update by itself. After a press the button shows "Updating…" for 45 seconds, for every editor, and a toast says "Site update started, live in about two minutes". The Studio README describes this accurately, and the runbook has a section explaining how the Sanity webhook is set up.

See the spec: `.scratch/vercel-deploy/spec.md`. The term is **Site update** in `CONTEXT.md`.

**Blocked by:** 01 (Deploy the site on Vercel, with PR previews).

**Status:** done

How it works:

- A **Site update request** singleton (hidden from the sidebar and the Create menu, like the other singletons). Pressing the button overwrites it as a published document with the press time and the user.
- A pure module (for example `siteUpdate.ts`) builds the request document from the user and the current time, and decides whether the 45-second cooldown is still running. It has `node --test` tests next to the existing ones.
- A navbar button uses that module, shows the cooldown from the request document's press time, and shows an error toast if the write fails.
- The site doesn't read the request document.

The agent writes the code and docs. The maintainer does the dashboard step from the runbook:

1. In Sanity's API settings, add a GROQ webhook for the production dataset. It fires on create and update, filters on the Site update request type, sends an HTTP POST with no payload, and targets the Deploy Hook URL from ticket 01.

- [ ] Pressing Update website in the Studio starts a production build on Vercel, and the change is live within about two minutes.
- [ ] Publishing, unpublishing or deleting a document, or saving a draft, does not start a build.
- [ ] The button stays in "Updating…" for 45 seconds after any editor presses it, and a second press in that time does nothing.
- [ ] A failed write shows an error toast, not the success one.
- [x] `pnpm test` covers building the request document and the cooldown check, including the edges (never pressed, just under and just over 45 seconds).
- [x] The Studio README says published content goes live when someone presses Update website, and otherwise at the next morning's rebuild.
- [x] The runbook documents the webhook's triggers, filter and target, but not the hook URL itself.

## Comments

Agent part done: `siteUpdate/` module with tests, hidden `siteUpdateRequest` singleton, navbar button, README and runbook (section 5). Typecheck, `pnpm test` and `sanity build` pass. Still for the maintainer: create the Sanity webhook from the runbook, then check the first three boxes by hand (button starts a production build; publish/unpublish/delete/draft do not; 45-second shared cooldown) and the error-toast box by simulating a failed write.
