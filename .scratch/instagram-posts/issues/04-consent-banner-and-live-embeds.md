# 04: Consent banner and live Instagram embeds

**What to build:** Visitors are asked before Instagram loads anything. Once they accept, every Instagram post placeholder becomes Instagram's own embed (see `../spec.md`):

- **Consent module:** a client-side module that stores the visitor's choice on the device. There are three states: undecided, accepted and rejected. Reading and writing never throws, and storage that's unavailable counts as undecided.
- **Banner:** shown site-wide while the visitor is undecided. It has equally weighted Accept and Reject buttons and a link to the Privacy policy (ticket 03). It only asks about Instagram content, so there are no cookie categories.
- **Accept**, from the banner or from any placeholder's "Allow Instagram content" button:
  - stores the choice
  - hides the banner
  - turns every placeholder on the page into Instagram's embed
  - loads Instagram's embed script exactly once
- **Reject:** stores the choice, hides the banner and keeps the placeholders.
- **Placeholders** gain the "Allow Instagram content" button next to "View on Instagram".
- **"Cookie settings":** a control in the footer that reopens the banner at any time.
- **Pages covered:** everything works on the homepage's Updates block and, once ticket 02 lands, on Event pages, because both use the shared carousel.
- **Accessibility:** the banner and its buttons are keyboard-reachable and labelled.
- **i18n:** strings for the banner copy and buttons, "Allow Instagram content" and "Cookie settings".
- **New seam:** this ticket adds the consent seam, which runs the consent module under jsdom against rendered placeholder markup.

**Blocked by:** 01 (Instagram posts in the Updates block on the homepage), 03 (Privacy policy page)

**Status:** ready-for-agent

- [ ] Consent seam test: an undecided visitor sees the banner.
- [ ] Consent seam test: Accept hides the banner, turns placeholders into embeds and loads the Instagram script exactly once.
- [ ] Consent seam test: Reject hides the banner and keeps the placeholders.
- [ ] Consent seam test: the stored choice survives a reload (accepted loads embeds without a banner, rejected shows placeholders without a banner).
- [ ] Consent seam test: "Allow Instagram content" on a placeholder behaves like Accept.
- [ ] Consent seam test: "Cookie settings" reopens the banner.
- [ ] Consent seam test: storage that throws behaves as undecided, without errors.
- [ ] Seam test: the footer contains the "Cookie settings" control, and the banner markup links to the Privacy policy.
- [ ] Manual check in a browser: accepting shows real Instagram embeds in the carousel, and no request goes to Instagram before consent.
