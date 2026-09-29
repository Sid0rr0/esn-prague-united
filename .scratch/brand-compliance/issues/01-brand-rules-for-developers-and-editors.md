# 01: Write down the brand rules for developers and editors

**What to build:** A developer or agent changing the site can check a design against a short list of ESN Visual Identity Manual rules without reading the 33-page manual, and `CLAUDE.md` points them to it. Editors in the Studio see guidance where they upload a Section logo and where they add photos. The unused ESN star image is gone, so nobody reuses it as decoration. See the parent spec: `.scratch/brand-compliance/spec.md`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] A brand rules doc sits next to the other agent docs and lists each rule with its manual page (2023 edition):
  1. Only one ESN star or logo in any one view, apart from the site header. Partner logos are exempt (p.18).
  2. Show logos exactly as provided: no cropping, stretching, recolouring, effects, outlines or rotation (pp.8, 15–16).
  3. Every logo needs a legible background and a clear safe zone around it: no full-colour logo on a brand-colour fill or a busy photo (pp.13, 17).
  4. The ESN star is never decoration (bullets, dividers, patterns) (p.17).
  5. Use only the 5 ESN colours, with their exact values, as brand colours (p.9).
  6. Use British English in site copy (p.11).
- [x] The doc uses the glossary term **Section logo**, never "section icon".
- [x] `CLAUDE.md` has a short "Brand rules" section linking to the doc.
- [x] The Section logo field in the Studio has a description asking editors to upload the official Section logotype exactly as ESN provided it (SVG, or PNG with a transparent background). The field still has no hotspot or crop.
- [x] The shared image-with-alt-text type has a description saying the manual forbids photos showing drunkenness, and photos with alcohol as the main subject (pp.27, 29).
- [x] The unused ESN star PNG is deleted from the web app's public folder, and nothing references it.
- [x] Studio and web builds and tests still pass.
