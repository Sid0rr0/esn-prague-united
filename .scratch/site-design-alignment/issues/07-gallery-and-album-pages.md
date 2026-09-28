# 07: Gallery and Album pages

**What to build:**

- **Gallery page** (3f/3h): every Album, newest first, each with its cover, title, date and photo count.
- **Album page** (3g/3i):
  - A header with the date, title, photo count, photo credit and a "Full album ↗" link when one is set.
  - An "Event page" link when an Event links to this Album.
  - A grid of the Album's photos.
  - On mobile, tapping a photo opens a full-screen viewer with a counter, previous/next, close and swipe.
- **Homepage:** a "Latest albums" block (up to 4) when the Homepage's "Show latest photo albums" is on.

Albums don't belong to Sections.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] Seam test: Gallery lists Albums newest first, each with its photo count.
- [ ] Seam test: the Album page shows the photo credit and "Full album ↗" only when they're set.
- [ ] Seam test: the Album page shows the "Event page" link only when an Event links to the Album.
- [ ] The mobile photo viewer opens on tap, shows "n / total", moves previous/next (wrapping), and closes. It works with keyboard and swipe.
- [ ] Seam test: the homepage shows up to 4 latest Albums when "Show latest photo albums" is on, and none when it's off.
- [ ] No Section is rendered on Album cards or pages.
