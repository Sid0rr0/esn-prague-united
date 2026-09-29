# 01: Instagram posts in the Updates block on the homepage

**What to build:** Editors can pick Instagram posts for the homepage, and visitors see them in the Updates block as branded placeholders. No Instagram script is loaded yet; that comes in ticket 04 (see `../spec.md`):

- **Studio document:** a new Instagram post document type with a required Studio-only title and a required link. It has its own "Instagram posts" list in the sidebar and can be created inline from reference fields. The preview shows the title with the link as the subtitle.
- **Link rules:** one shared pure helper. It accepts `instagram.com/p/<code>` and `/reel/<code>` links, with or without `www.`, a trailing slash or query string. It rejects profile, story, highlight and non-Instagram links with "Paste a post or reel link, not a profile or story". It normalises links to `https://www.instagram.com/<p|reel>/<code>/`. The Studio validates with it, and the site normalises with it.
- **Shared list shape:** "Instagram post references, max 8, no duplicates", defined once so that ticket 02 can reuse it.
- **Homepage singleton:** gets an Updates object in "Content blocks", with a translated heading (initial value "Updates") and that list.
- **Site:** the Updates block renders after upcoming events and before About, in the editor's order.
  - One post is centred with no arrows. Two or more go in a horizontal scroll-snap row (top-aligned cards, prev/next arrows on desktop, swipe on mobile, no autoplay).
  - Each card is a branded placeholder with a "View on Instagram" link to the normalised link (opens in a new tab) and a data attribute holding the link.
  - The block is hidden when no valid posts remain. Broken references and invalid links are skipped.
  - Build the carousel as one shared component so the Event page can reuse it.
- **i18n:** strings for the default heading, the placeholder copy and the arrow labels.
- **Seed data:** a few sample Instagram posts, picked on the homepage.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Plain test: the link rules accept post and reel links in their `www.`, trailing-slash and `?igsh=` variants, and all normalise to the same canonical form.
- [ ] Plain test: the link rules reject profile, story, highlight and non-Instagram links with the documented message.
- [ ] Seam test: a homepage with no posts picked renders no Updates block.
- [ ] Seam test: the Updates block comes after upcoming events and before About, with posts in the editor's order.
- [ ] Seam test: the editor's heading is shown, and "Updates" is shown when none is set.
- [ ] Seam test: one post renders without arrows, and two or more render with arrows.
- [ ] Seam test: each card links to the normalised post link in a new tab, and the static HTML contains no Instagram script or iframe.
- [ ] Seam test: a broken reference or invalid link is skipped, and the block is hidden if none remain.
- [ ] Manual check in the Studio: an Instagram post can be created from the sidebar and inline, a duplicate in the list is flagged, a 9th post is refused, and a referenced post can't be deleted.
