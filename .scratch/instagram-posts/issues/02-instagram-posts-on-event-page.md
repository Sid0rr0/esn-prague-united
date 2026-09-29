# 02: Instagram posts on the Event page ("On Instagram")

**What to build:** Editors can pick an Event's own Instagram posts, and visitors see them on that Event's page (see `../spec.md`):

- **Studio:** the Event gets an `instagramPosts` list in "Programme & info", using the shared "Instagram post references, max 8, no duplicates" shape from ticket 01. The same Instagram post can be picked on the homepage and on any number of Events.
- **Site:** the Event page renders the shared carousel from ticket 01 under an "On Instagram" heading, after the description and programme and before the Event FAQ.
  - It shows on Upcoming and Past events alike.
  - An Event with no valid posts has no such section.
  - Broken references and invalid links are skipped.
- **i18n:** a string for "On Instagram".
- **Seed data:** the seeded Czech Ball picks a couple of the sample Instagram posts.

**Blocked by:** 01 (Instagram posts in the Updates block on the homepage)

**Status:** ready-for-agent

- [ ] Seam test: an Event with no Instagram posts renders no "On Instagram" section.
- [ ] Seam test: an Event's posts render under "On Instagram" after the programme and before the Event FAQ, in the editor's order.
- [ ] Seam test: a Past event still shows its Instagram posts.
- [ ] Seam test: a broken reference is skipped and the rest still render.
- [ ] Manual check in the Studio: the same post can be picked on the homepage and on an Event.
