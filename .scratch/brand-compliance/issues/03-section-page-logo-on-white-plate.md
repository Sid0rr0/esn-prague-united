# 03: Section page shows its whole Section logo on a white plate

**What to build:** On a Section's page, the Section logo appears in full at its natural shape, with nothing cut off, on a white plate with clear space around it. It's legible on all 5 brand colours, including ESN Green, Orange and Cyan. Photos elsewhere keep their current cropping. See the parent spec: `.scratch/brand-compliance/spec.md`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Images can be requested in a "contain" mode. The Sanity CDN URL then uses `fit=max` (never `fit=crop` or crop rect parameters), and the `<img>` uses `object-contain` instead of `object-cover`.
- [x] The Section logo on the Section page uses contain mode.
- [x] The Section logo sits inside a white plate on the brand-colour band, with padding at least as wide as the logo's safe zone (manual p.13). The plate has a data attribute tests can find.
- [x] A Section with no Section logo still shows the white placeholder at the plate's size, and no `<img>` for the logo.
- [x] Cover photos, Album photos and Event images keep cropping to their hotspot (`fit=crop`).
- [x] New tests go through the page render seam. They cover: the logo URL uses `fit=max` and no crop, the `<img>` is `object-contain`, the logo is inside the plate, the no-logo placeholder, and the cover photo on the same page still uses `fit=crop`.
- [x] Checked by eye on all 5 Section pages (magenta, blue, orange, green, cyan): the logo is legible with clear space around it.

## Comments

- Checked by eye at 1280px wide: in the current dataset only ESN CTU has a Section logo (whole, legible, clear space on blue). The other four pages show the white placeholder plate on magenta, orange, green and cyan. Recheck each page once its Section logo is uploaded.
- The plate's padding is half the logo's height (24px / 32px on desktop). Check it against the manual's safe-zone definition (p.13) and widen it if that asks for more.
