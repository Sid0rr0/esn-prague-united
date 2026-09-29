# Spec: Instagram posts in Updates and on Event pages

Status: ready-for-agent

## Problem Statement

The latest news from ESN Prague United lives on the Sections' Instagram accounts: lineup reveals, ticket drops, recap reels. The website shows none of it. Visitors who land on the homepage or on an Event page (e.g. the Czech Ball) can't see what's been announced. Editors have no way to surface a post except by pasting a bare link into rich text. The site also has no privacy policy and no consent mechanism, so it can't show third-party content like Instagram embeds lawfully.

## Solution

Editors keep each **Instagram post** once in the Studio by pasting its link and giving it a short title that only editors see. On the homepage they pick and order up to 8 posts for the **Updates** block, which shows them in a carousel after the upcoming events. On any Event they pick that Event's own posts, shown under "On Instagram". The same post can appear in both places.

The posts render as Instagram's own embeds, and only after the visitor agrees. A site-wide consent banner asks once with equally weighted Accept and Reject buttons and links to a new **Privacy policy** page. Visitors who reject, or haven't chosen yet, see a branded placeholder for each post with a "View on Instagram" link and an "Allow Instagram content" button. A "Cookie settings" link in the footer lets visitors change their choice.

## User Stories

1. As an editor, I want to add an Instagram post by pasting the link I copied from the Instagram app, so that I don't have to download images or retype captions.
2. As an editor, I want the Studio to accept both post links and reel links, so that I can feature videos as well as photos.
3. As an editor, I want the Studio to reject profile, story and non-Instagram links with a clear message, so that I don't publish a link that can't be embedded.
4. As an editor, I want the tracking part of a copied link (`?igsh=…`) removed automatically, so that the stored link is clean and doesn't need hand-editing.
5. As an editor, I want to give each Instagram post a short title, so that I can recognise it when picking posts (e.g. "Czech Ball 2026 – lineup reveal").
6. As an editor, I want that title never to appear on the website, so that I can write it for myself without worrying about wording.
7. As an editor, I want Instagram posts listed in the Studio sidebar with their title and link, so that I can find, fix or reuse them.
8. As an editor, I want to create an Instagram post directly from the homepage or Event form, so that I don't have to leave the page I'm editing.
9. As an editor, I want to pick up to 8 Instagram posts for the homepage's Updates block, so that visitors see the latest news.
10. As an editor, I want to drag the picked posts into order, so that the most important one comes first.
11. As an editor, I want to show just one post if that's all I have, so that I'm not forced to pad the block.
12. As an editor, I want the Updates block to disappear when I remove every post, so that the homepage never shows an empty carousel.
13. As an editor, I want to edit the Updates heading in English and Czech, so that I can rename it for a campaign; it defaults to "Updates".
14. As an editor, I want to pick up to 8 Instagram posts for each Event, so that its page shows posts about that Event only.
15. As an editor, I want to reuse the same Instagram post on the homepage and on an Event, so that I don't paste the link twice.
16. As an editor, I want the Studio to flag the same post picked twice in one list, so that visitors don't see duplicates.
17. As an editor, I want the Studio to stop me deleting an Instagram post that is still picked somewhere, so that no page loses a post by accident.
18. As an editor, I want to write and update the Privacy policy in the Studio, in English and Czech, so that it stays correct without a developer.
19. As an editor, I want the Privacy policy to open directly from the Studio sidebar like the other Singletons, so that there's only ever one.
20. As a visitor, I want to see recent Instagram posts on the homepage, so that I know what ESN Prague United is up to.
21. As a visitor, I want the Updates block right after upcoming events, so that the most time-sensitive content is near the top.
22. As a visitor on a phone, I want to swipe through the posts, so that the carousel feels native.
23. As a visitor on a desktop, I want previous/next arrows, so that I can browse posts without a trackpad gesture.
24. As a visitor, I want a single post shown centred with no arrows, so that the block doesn't look broken.
25. As a visitor, I want the carousel not to move by itself, so that I can read a post in peace.
26. As a visitor on an Event page, I want to see that Event's Instagram posts under "On Instagram", so that I see the latest announcements about it.
27. As a visitor on a Past event, I want its Instagram posts still shown, so that I can see the recap.
28. As a visitor, I want to be asked before Instagram loads anything, so that Meta doesn't track me without my consent.
29. As a visitor, I want Accept and Reject to be equally easy, so that I can say no without hunting for it.
30. As a visitor, I want my choice remembered on this device, so that I'm not asked on every page.
31. As a visitor who rejected, I want each post shown as a placeholder with a "View on Instagram" link, so that I can still reach the content.
32. As a visitor who rejected, I want an "Allow Instagram content" button on the placeholder, so that I can change my mind right where I want the content.
33. As a visitor, I want a "Cookie settings" link in the footer, so that I can withdraw or give consent later.
34. As a visitor, I want the consent banner to link to the Privacy policy, so that I know what I'm agreeing to.
35. As a visitor, I want to read the Privacy policy on its own page, so that I understand how the site handles my data.
36. As a visitor reading the site in Czech, I want the banner, placeholders, Updates and "On Instagram" headings translated, so that everything matches the rest of the page.
37. As a visitor using a keyboard or screen reader, I want the banner buttons, the carousel arrows and the placeholders to be reachable and labelled, so that I can use them without a mouse.

## Implementation Decisions

- **New Instagram post document type** in the Studio schema, with two fields:
  - a **title** (plain string, required, Studio-only, never queried for the site)
  - a **link** (URL, required)

  The preview shows the title with the link as the subtitle. It has its own "Instagram posts" list in the Studio sidebar, next to Events and Photo albums, and can be created from the "+ Create" menu and inline from reference fields.

- **Link rules** live in one small pure helper that both the Studio and the site use:
  - It accepts `instagram.com/p/<code>` and `instagram.com/reel/<code>`, with or without `www.` and with or without a trailing slash.
  - Profile, story, highlight and non-Instagram links are rejected with the message "Paste a post or reel link, not a profile or story".
  - It normalises a link to `https://www.instagram.com/<p|reel>/<code>/` and drops the query string and fragment.
  - The Studio validates with it. The site normalises with it at render time, so links stored before a fix still work.
- **Shared list shape:** "a list of Instagram post references, maximum 8, no duplicates". It's defined once in the schema and reused by the Homepage and the Event.
- **Homepage singleton gets an Updates object** in its "Content blocks" group. It holds a translated heading (initial value "Updates") and the list of Instagram post references. The order of the list is the order on the site.
- **Event gets an `instagramPosts` list** in its "Programme & info" group, using the same shared shape.
- **New Privacy policy singleton:** a translated heading and translated rich text. Like the other Singletons, it has no list view and no delete action. It's added to the singleton list in the Studio structure and gets its own page on the site. The route and footer placement match the other Singleton pages.
- **Queries:** the homepage and Event queries project each list to just the normalised links, in order. Broken references and links that fail the link rules are dropped. The Updates block is hidden when no valid posts remain.
- **One shared carousel component** renders a list of Instagram posts. The homepage uses it for the Updates block, placed after upcoming events and before About. The Event page uses it under an "On Instagram" heading after the description and programme, before the Event FAQ. It's shown whether the Event is upcoming or past.
  - One post is centred with no arrows.
  - Two or more posts go in a horizontal scroll-snap row with the cards top-aligned: prev/next arrows on desktop, swipe on mobile, no autoplay.
- **Server-rendered markup is always the placeholder.** Each card is a branded placeholder with a "View on Instagram" link to the post (opens in a new tab) and an "Allow Instagram content" button. It carries the post link in a data attribute. The static HTML never includes Instagram's script or iframes.
- **Consent module** (client-side, the only browser behaviour on the site):
  - **Stored choice:** on the device. There are three states: undecided, accepted and rejected. Reading and writing the choice never throws. If storage is unavailable, the visitor is treated as undecided.
  - **Banner:** shown site-wide while the visitor is undecided. It has equally weighted Accept and Reject buttons and a link to the Privacy policy. It only asks about Instagram content, the site's only third-party service, so there are no cookie categories.
  - **Accept** (from the banner or from any placeholder's Allow button) stores the choice and turns every placeholder on the page into Instagram's embed. Instagram's embed script is loaded then, and only once.
  - **Reject** stores the choice and keeps the placeholders.
  - **"Cookie settings" link** in the footer: reopens the banner at any time.
- **i18n strings** (English, plus Czech entries that fall back to English) are added for the Updates default heading, "On Instagram", the banner copy and buttons, the placeholder copy and buttons, the carousel arrow labels and "Cookie settings".
- **Seed data:** a few sample Instagram posts, picked on the homepage and on the seeded Czech Ball, plus a placeholder Privacy policy text.
- **Domain terms:** use **Instagram post**, **Updates** and **Privacy policy** from `CONTEXT.md` in code, Studio labels and copy. Don't call a single post an "Update".

## Testing Decisions

- A good test drives the feature through a seam and checks only what an editor or visitor would observe: the rendered HTML, the page's state after a click, or the validation result. It doesn't test query shapes, component props or internal helpers directly.
- **Seam 1 is the existing page render seam** (in-memory Sanity documents, real GROQ, `now` pinned). Most cases go here:
  - Homepage with no Instagram posts picked: no Updates block.
  - Homepage with posts: the Updates block comes after upcoming events and before About, with posts in the editor's order and the editor's heading (the default heading if none is set).
  - One post renders without arrows. Two or more render with arrows.
  - A broken reference or invalid link is skipped, and the rest still render. If every reference is broken, the block is hidden.
  - Each card is a placeholder linking to the normalised post link, opening in a new tab. No Instagram script or iframe is in the static HTML.
  - An Event with posts shows "On Instagram" after the programme and before the Event FAQ. An Event without posts shows no such section. A Past event still shows its posts.
  - The footer contains a "Cookie settings" control.
  - The Privacy policy page renders its heading and rich text.
- **Seam 2 is a new consent seam:** the consent module run under jsdom against rendered placeholder markup. Cases:
  - An undecided visitor sees the banner.
  - Accept hides the banner, turns placeholders into embeds and loads the Instagram script exactly once.
  - Reject hides the banner and keeps the placeholders.
  - The choice survives a reload.
  - "Allow Instagram content" on a placeholder acts as Accept.
  - "Cookie settings" reopens the banner.
  - Storage that throws behaves as undecided without errors.
- **Seam 3 is the link rules as a plain function**:
  - Post and reel links are accepted, with and without `www.`, a trailing slash or `?igsh=`, and all normalise to the same canonical form.
  - Profile, story, highlight and non-Instagram links are rejected with the documented message.
- Studio-only behaviour isn't automatically tested; check it by hand in the Studio: the duplicate-in-list rule, the maximum of 8, deletion blocked while referenced, and the Privacy policy appearing as a Singleton.
- Prior art: the homepage, Event page and shell tests on the render seam, the existing fixtures helpers, and the Studio's plain vitest tests (seed content, site update).

## Out of Scope

- Fetching post images, captions, dates or authors from Instagram (oEmbed, Graph API, scraping). The embed is the only source.
- Attributing a post to a Section, or showing Instagram posts on Section pages.
- An automatic feed of the latest posts from any account.
- Stories, highlights, profiles and non-Instagram social embeds (TikTok, Facebook).
- Cookie categories, analytics consent or any third-party service other than Instagram.
- Detecting posts that were deleted on Instagram. Editors remove them by hand.
- A "Follow us" link in the Updates block.

## Further Notes

- The embeds load in the visitor's browser, so a post that's deleted or made private on Instagram shows up broken until an editor removes it. A Site update doesn't catch this.
- The consent banner is the first thing on the site that runs code in the browser before the visitor does anything. Any future third-party service (analytics, maps, video) should plug into the same consent module rather than add a second banner. At that point, cookie categories may be worth adding.
- Why official embeds behind a consent banner rather than self-hosted image cards: see ADR 0003 (`docs/adr/0003-instagram-embeds-behind-consent.md`).
