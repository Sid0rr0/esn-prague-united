# ESN Prague: Sanity Studio

Content schema and editorial model for the ESN Prague website. Editors manage all site content through Sanity Studio; the Astro site reads it through one content-read module per page (`apps/web/src/lib/`).

## Language

**ESN Prague United**:
The umbrella organisation formed by the 5 Sections. Site-wide content (About, Contacts, FAQ) speaks for ESN Prague United, not for any one Section. ESN Prague United has no social accounts of its own; only the Sections do.
_Avoid_: ESN Prague (on its own), ESN Praha

**Section**:
One of the exactly 5 ESN local chapters in Prague, each based at a different university (e.g. "ESN CTU in Prague"). Sections are created once by an admin; editors cannot add or delete them from the Studio UI. Each Section has a fixed brand colour that editors can't change.
_Avoid_: Chapter, branch, club

**Section logo**:
A Section's official ESN logotype (the ESN star, "ESN" and the descriptor with the Section's name), used exactly as provided by ESN. It appears only on that Section's own page, never where several Sections are listed together.
_Avoid_: Section icon, badge, avatar

**Event**:
A single ESN Prague United event with a date, venue, optional programme, and ticket info (e.g. the Czech Ball). Events belong to ESN Prague United as a whole, not to individual Sections. Ticket availability is inferred from whether a ticket link is set — there's no separate status field; without a link, the Event shows its Ticket note instead (e.g. "Sold out", "Free entry"). Once an Event has ended it no longer offers tickets and points to its Album instead, if it has one.
_Avoid_: Party, activity

**Price tier**:
One named ticket price for an Event, in CZK (e.g. "With ESN card" 590, "Without ESN card" 690). The first tier is the Event's headline price. An Event with no tiers shows no price.
_Avoid_: Ticket type, fare

**Ticket note**:
A one-line message shown in place of the Buy button when an Event has no ticket link (e.g. "Sold out. Watch Instagram for returned tickets"). Longer ticket details go in the Event's ticket info.
_Avoid_: Ticket status

**Featured event**:
The Event an editor picks to promote on the homepage. Only a picked Event takes over the homepage hero; when none is picked, the hero stays about ESN Prague United. The homepage's upcoming-events list never repeats the Featured event; if that leaves it empty, the list is hidden.
_Avoid_: Highlighted event, main event

**Upcoming event** vs **Past event**:
An Event is upcoming until it has ended, and past from then on. An Event has ended once its end time has passed, or its start time when it has no end time. Outside the homepage hero, the Featured event is an Upcoming event like any other.
_Avoid_: Finished event, old event, archived event

**Related event**:
Another Event an editor picks to show on an Event's page (e.g. last year's Czech Ball on this year's). An Event has at most 3 Related events, listed in the order the editor picked them, and can't be its own Related event. The link is one-way: picking B on A's page doesn't show A on B's page. Related events are shown whether they're upcoming or past, and an Event with none picked shows no Related events. Deleting an Event quietly removes it from other Events' Related events.
_Avoid_: Similar event, recommended event, "More events"

**Partner**:
An outside organisation credited on an Event's page for supporting it, whether with money, a venue, drinks or media coverage. A Partner is known once and can support many Events, at a different level each time. Partners appear only on Event pages; ESN Prague United has no site-wide partner list. A Partner's name is its brand and is never translated. An Event keeps crediting its Partners after it has ended.
_Avoid_: Sponsor, supporter

**Partner tier**:
How prominently an Event credits one of its Partners: General partner, Partner, or Media partner. The tier belongs to the Partner's role in that one Event, not to the Partner itself. A Partner holds exactly one tier per Event. The set of tiers is fixed; editors pick from it and cannot invent new ones.
_Avoid_: Sponsor level, partner type, category

**Album**:
A set of photos shown on `/gallery`, optionally linked from one Event (not every Event has one yet, and an Album doesn't need an Event). Albums don't belong to Sections.
_Avoid_: Gallery (that's the page; Album is the content type)

**Instagram post**:
A link to one public Instagram post or reel, shown on the site as Instagram's own embed. It is usually from a Section's account, but can be anyone's (e.g. a Partner's). It isn't attributed to a Section on the site. One Instagram post can be shown in several places, such as the homepage and an Event's page. An Event keeps showing its Instagram posts after it has ended.
_Avoid_: Update (that's the block), IG post, story

**Updates**:
The block on the homepage that shows a hand-picked, ordered set of Instagram posts in a carousel. It is hidden when no posts are picked.
_Avoid_: Feed, news, Instagram feed

**FAQ** vs **Event FAQ**:
The FAQ is the site-wide list of general questions about ESN Prague United (ESN card, buddy programme, joining). An Event FAQ holds questions about one Event (e.g. the Czech Ball) and lives on that Event's page. Event-specific questions never go in the FAQ.
_Avoid_: Ball FAQ (as a separate page)

**Singleton**:
A document type with exactly one instance, opened directly from the Studio sidebar with no list view and no delete action (Homepage, FAQ, Contacts, Links page, Privacy policy, Site settings).
_Avoid_: Page (ambiguous — Event and Album also render as pages, but aren't singletons)

**Highlight** (Links page):
Marks a link to render as a large coloured button instead of a plain list row.

**Site update**:
The moment published content goes live on the website. An editor starts one with the "Update website" button in the Studio; it also happens by itself every morning so that ended Events show as past. Publishing a document does not start a Site update, so published content waits until the next one.
_Avoid_: Deploy, rebuild, release (Sanity uses Release for something else), "publish all"
