# 04: Homepage hero and upcoming-events list

**What to build:** The homepage as in the design (3a/3b/3c).

**Event schema:** Events gain an ordered list of **Price tiers** and a one-line **Ticket note**.

- A Price tier is a label plus a whole, positive CZK amount.
- The Ticket note is plain text, about 60 characters at most, in the Tickets group.

**Hero:**

- **Featured event picked:** the hero shows it: date, title and summary.
  - With a ticket link, a Buy ticket button, plus a headline price pill from the first Price tier if there are tiers.
  - With no ticket link, the Ticket note in place of the button, or nothing if there's no Ticket note.
- **No Featured event:** the hero is the ESN Prague United one (heading, subheading, image and buttons from the Homepage).

**Upcoming-events list:**

- Upcoming Events excluding the Featured event, soonest first, at most 4. Rows show date and title only.
- When the list is empty and a Featured event is set, the block is hidden.
- When it's empty and nothing is featured, it shows "New events coming soon" with the Instagram link.
- There's no "Full calendar" link.
- The old next-event fallback is removed from the homepage query.

**Other blocks:** About ESN Prague United with its numbers, and the Quick links.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] The Studio's Event has Price tiers (label + whole CZK, positive) and a Ticket note limited to about 60 characters.
- [ ] Seam test: a Featured event with a ticket link and tiers shows Buy ticket plus the first tier's price.
- [ ] Seam test: a Featured event with a ticket link but no tiers shows Buy ticket with no price pill.
- [ ] Seam test: a Featured event without a ticket link shows its Ticket note, or nothing when there's no note.
- [ ] Seam test: with no Featured event, the hero shows the Homepage's own ESN Prague United content.
- [ ] Seam test: the upcoming list never contains the Featured event and is capped at 4.
- [ ] Seam test: the upcoming list is hidden when it's empty and a Featured event is set.
- [ ] Seam test: "New events coming soon" plus the Instagram link shows when the list is empty and nothing is featured.
- [ ] Seam test: no "Full calendar" link is rendered.
- [ ] The About block with its numbers (max 4) and the Quick links (max 4) render from the Homepage.
