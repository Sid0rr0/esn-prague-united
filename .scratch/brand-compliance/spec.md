# Spec: Follow the ESN Visual Identity Manual on the site

Status: ready-for-agent

## Problem Statement

Every Section logo contains the ESN star. The site shows all 5 Section logos together twice: side by side in the homepage Sections block, and stacked on the Sections list. That puts 5 ESN stars in one view, which the ESN Visual Identity Manual (2023) forbids: "do not use more than one star in a visual and avoid using several logos" (p.18, Branding Overload).

The one place a Section logo belongs, the Section's own page, has two more problems:

- The logo is cropped to a fixed square. Section logos are wide (star, "ESN", then the descriptor with the Section's name), so the edges get cut off. The manual says "Don't cut or use portions of the logo" (p.16).
- The logo sits directly on the Section's brand colour. On ESN Green, Orange and Cyan this is the manual's "forbidden" example, "Every element of the logo must be legible against the background" (p.17), and it leaves no safe zone around the logo (p.13).

Nothing in the repo records the manual's rules either, so the next change could break them again without anyone noticing.

## Solution

- Section tiles on the homepage and the Sections list stop showing the Section logo. The Section's name, university and brand-colour stripe identify it.
- The Section page still shows its Section logo, now on a white plate with padding at least as wide as the safe zone, so it's legible on all 5 brand colours. The logo is scaled to fit that plate at its natural shape and is never cropped.
- The ESN Prague United logo in the site header stays as it is. It is site navigation and doesn't count toward the one-logo-per-view rule.
- A short brand rules document in the repo lists the manual's rules that apply to the site, with page numbers. `CLAUDE.md` links to it so agents follow it.
- Studio help text on photo fields reminds editors of the manual's content rules on alcohol and drunkenness.
- The unused ESN star image in the web app's public folder is deleted.

## User Stories

1. As an exchange student on the homepage, I want the Sections block to show each Section's name, university and colour without its logo, so that the page doesn't repeat the ESN star five times.
2. As an exchange student on the Sections list, I want to tell the Sections apart by name, university, tagline and colour stripe, so that I can pick mine without seeing 5 logos.
3. As an exchange student on the homepage on a phone, I want the Sections block to look the same as it does today (text rows with a colour stripe), so that nothing I'm used to disappears.
4. As an exchange student on a Section's page, I want to see that Section's full logo, so that I know I'm on the right Section's page.
5. As an exchange student on a Section's page, I want the whole logo visible, with nothing cut off at the edges, so that I can read the Section's name in the descriptor.
6. As an exchange student on the ESN CZU page (green) or the ESN VŠE page (orange), I want the logo on a clean white background, so that every part of it is readable.
7. As a board member of a Section, I want our logo shown with clear space around it, so that the site follows the ESN Visual Identity Manual and doesn't embarrass us with ESN International.
8. As an editor, I want to upload the logo file ESN gave us as it is, without choosing a crop, so that the site never shows a trimmed version.
9. As an editor, I want a Section with no logo yet to keep its plain placeholder, so that its page still looks finished.
10. As an editor adding photos to an Album, an Event or a Section, I want the photo field to remind me that the manual forbids photos showing drunkenness or with alcohol as the main subject, so that I don't publish something ESN would take down.
11. As a developer or an agent changing the site, I want one short brand rules document with the manual's page numbers, so that I can check a design change against the rules without reading the whole 33-page manual.
12. As a developer or an agent, I want `CLAUDE.md` to point at the brand rules, so that I read them before I touch logos, colours or copy.
13. As a developer reading the Section tile code, I want a comment saying why it shows no logo, so that I don't add it back.
14. As a developer, I want the brand rules to say that Partner logos are exempt from the one-star rule, so that I don't hide Partners on Event pages by mistake.
15. As a visitor, I want site copy in British English (colour, programme, organise), so that the site matches ESN's language.
16. As a visitor, I want only the 5 ESN colours, at their exact values, as brand colours, so that the site reads as ESN.
17. As a maintainer, I want the unused ESN star image deleted, so that nobody uses it as decoration later.

## Implementation Decisions

- **Section tile**: both variants (`list` on the Sections list, `band` on the homepage Sections block) stop rendering the Section logo and its placeholder. The layout otherwise keeps its brand-colour stripe, name, university, tagline (list only) and arrow. A short comment points to the brand rules document to explain why there's no logo.
- **Section summary query and types**: the Section summary used by tiles no longer needs `logo`. Drop it from the summary query and type if nothing else uses it. The full Section query keeps `logo` for the Section page.
- **Section page hero**: the Section logo sits inside a white plate with padding at least as wide as the logo's safe zone (p.13). The plate sits on the brand-colour band. With no logo, the page shows its current white placeholder at the plate's size.
- **Logo images are fitted, never cropped**: the image helper and the Picture component gain a "contain" mode. In this mode the Sanity CDN URL uses `fit=max`, never `fit=crop`, and the `<img>` uses `object-contain` in place of `object-cover`. The Section logo on the Section page uses this mode. The site header logo already requests a height only and keeps working. Photos (cover images, Album photos, Event images) keep their current crop-to-hotspot behaviour.
- **Studio**: the Section `logo` field stays a plain image with no hotspot or crop. Add a field description asking editors to upload the official Section logotype exactly as ESN provided it (SVG, or PNG with a transparent background).
- **Studio photo guidance**: the shared image-with-alt-text type (used for cover images and photos) gets a description noting that the manual forbids photos showing drunkenness, and photos with alcohol as the main subject (manual pp.27, 29).
- **Brand rules document**: a new doc next to the other agent docs lists these rules, each with its manual page:
  1. Only one ESN star or logo in any one view, apart from the site header. Partner logos are exempt (p.18).
  2. Show logos exactly as provided: no cropping, stretching, recolouring, effects, outlines or rotation (pp.8, 15–16).
  3. Every logo needs a legible background and a clear safe zone around it: no full-colour logo on a brand-colour fill or a busy photo (pp.13, 17).
  4. The ESN star is never decoration (bullets, dividers, patterns) (p.17).
  5. Use only the 5 ESN colours, with their exact values, as brand colours (p.9).
  6. Use British English in site copy (p.11).
     `CLAUDE.md` links to it in a short "Brand rules" section.
- **Glossary**: `CONTEXT.md` now defines **Section logo** and retires "section icon". Use that term in code comments and docs.
- **Asset cleanup**: delete the unused ESN star PNG from the web app's public folder.

## Testing Decisions

- A good test renders a real page through the existing page render seam (in-memory Sanity documents, real GROQ queries, current time pinned) and checks only the HTML a visitor receives. It doesn't test the image helper, the Picture component or the query shape directly.
- **The only seam is the page render seam** already used by the homepage and Sections tests. Extend those test files with cases for:
  - On the Sections list, where every Section has a logo in the fixtures, no Section tile contains an `<img>` and no tile contains a logo's asset URL.
  - On the homepage Sections block, where every Section has a logo, no Section tile contains an `<img>`.
  - On a Section page with a logo, the logo's image URL uses `fit=max` and has no `fit=crop` and no rect/crop parameters, and the `<img>` uses `object-contain`.
  - On a Section page with a logo, the logo sits inside a white plate marked with a data attribute the test can find.
  - On a Section page without a logo, the page still renders the placeholder and no `<img>` for the logo.
  - The Section page cover photo still uses `fit=crop` (the regression guard that photos are unaffected).
- Prior art: the existing Sections list tests, which find tiles by their data attribute, and the homepage Sections block tests. Add logos to the Section fixtures if they don't have them yet.
- There are no tests for the brand rules doc, the Studio descriptions or the asset deletion. Check those in review.

## Out of Scope

- Changing or recolouring the ESN Prague United logo in the header, or checking its file for safe-zone compliance.
- A white (monochrome) Section logo field. We chose a white plate behind the full-colour logo instead.
- The Studio's own lists, whose previews show Section logos side by side. They're internal tooling, not published material.
- Auditing all existing site copy for American spellings. The rules doc sets the rule; fixes happen as copy is touched.
- Checking Partner logos for co-branding with the ESN star.
- Watermarking photos or checking uploaded photos automatically.

## Further Notes

- Source: ESN Visual Identity Manual, 2023 revision (International Board 2021/2023). Page numbers in the rules doc refer to that edition.
- The favicon is a single ESN star, allowed as a standalone element (p.8), and stays.
- Brand colours and fonts already match the manual (5 ESN hex values; Kelson Sans for headings, Lato for body), so no changes are needed there.
