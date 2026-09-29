# 04: Explore ways to show the Section logo on the Section page

**What to build:** Nothing yet. Find a way to show a Section's own Section logo on its page that follows the brand rules and looks right, then write the build ticket for it. See the parent spec: `.scratch/brand-compliance/spec.md` and `docs/agents/brand-rules.md`.

**Blocked by:** None (can start immediately)

**Status:** needs-triage

## Background

The Section page used to show the Section logo cropped to a square and set straight on the brand colour. Ticket 03 fixed the cropping and put the logo on a white plate on the brand-colour band. By eye the plate looked out of place, above the name and beside it alike, so the Section page now shows no Section logo at all.

What a solution must respect (manual 2023, see `docs/agents/brand-rules.md`):

- The whole logo, at its own shape: no cropping, stretching or recolouring (pp.8, 15–16).
- A legible background and a clear safe zone. The full-colour logo can't sit on ESN Green, Orange or Cyan, or on a busy photo (pp.13, 17).
- At most one ESN star in view, apart from the site header (p.18). The header logo already carries a star, so a Section logo may count as a second one near the top of the page.

## Options to try

- Move the logo out of the brand-colour band into a white part of the page, e.g. the About section or the page footer area.
- A white (monochrome) Section logo on the brand colour, if ESN provides one. That needs a second Studio field, which the spec ruled out, so it needs a decision.
- A white band or card for the whole hero (name, university, tagline) with a thinner brand-colour stripe, so the logo sits on white without a separate plate.
- Show no logo at all, and close this ticket.

## Done when

- [ ] At least two options are prototyped on real Section pages, desktop and phone, and compared by eye.
- [ ] The chosen option is checked against the rules above, including whether the header logo plus the Section logo breaks the one-star rule.
- [ ] A build ticket is written for the chosen option, or this ticket is closed with "no logo" recorded as the decision.

## Notes for whoever builds it

- Commit `bda56ba` has an image "contain" mode, removed when the plate was dropped. Logos need `fit=max` with `max-w`/`max-h`, never `w` and `h` together: given both, `@sanity/image-url` adds a `rect` that crops the image to the box's shape, even with `fit=max`. The real logos are 144×80 SVGs with their own margin built in.
- In the current dataset only ESN CTU has a Section logo uploaded.
