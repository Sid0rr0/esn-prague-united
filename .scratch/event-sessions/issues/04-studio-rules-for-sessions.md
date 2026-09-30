# 04: Studio rules for Sessions

**What to build:** The Studio catches mistakes in an Event's Sessions (see `../spec.md`):

- A Session whose Ends is before its Starts is an **error**.
- A Session outside the Event's Starts to Ends span (or before Starts when the Event has no Ends) is a **warning**.
- More than 40 Sessions is a **warning**, not an error.
- An Event Ticket link or Ticket note filled while the Event has Sessions gets a **warning** on that field, saying it's ignored while the Event has Sessions.
- The limit of 40 is a named constant, like the Related events limit.

**Blocked by:** 01 (Sessions table on the Event page)

**Status:** ready-for-agent

- [ ] Checked by hand in the Studio: a Session ending before it starts can't be published.
- [ ] Checked by hand: a Session outside the Event's span shows a warning but can be published.
- [ ] Checked by hand: 41 Sessions show a warning but can be published.
- [ ] Checked by hand: the Event's Ticket link and Ticket note show the "ignored" warning while Sessions exist, and not otherwise.
- [ ] The Studio typechecks.
