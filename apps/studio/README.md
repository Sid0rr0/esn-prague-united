# ESN Prague: Sanity Studio

Content schemas for the ESN Prague website (Astro + Sanity; the site is hosted on Vercel, the Studio on Sanity).

## Content types

| Type           | Kind                | Used on                                             |
| -------------- | ------------------- | --------------------------------------------------- |
| `siteSettings` | singleton           | header, footer, top banner, default sharing preview |
| `homepage`     | singleton           | `/`                                                 |
| `event`        | collection          | `/events`, `/events/[slug]` (Czech Ball lives here) |
| `section`      | collection, fixed 5 | `/sections`, `/sections/[slug]`                     |
| `album`        | collection          | `/gallery`, `/gallery/[slug]`                       |
| `faqPage`      | singleton           | `/faq`                                              |
| `contactsPage` | singleton           | `/contacts`                                         |
| `linksPage`    | singleton           | `/links` (Instagram bio, QR codes)                  |

Reusable objects: `imageWithAlt`, `richText`, `cta`, `socials`, `seo`, `programmeItem`, `faqEntry`, `contactPerson`, `linkItem`.

## Run

```bash
npm install
cp .env.example .env         # fill SANITY_STUDIO_PROJECT_ID
npm run dev                  # http://localhost:3333
npx sanity schema validate
npm run deploy               # -> https://esnprague.sanity.studio
```

## Editor notes

- Singletons (Homepage, FAQ, Contacts, Links page, Site settings) open directly and cannot be deleted.
- Sections cannot be created from the "+" menu; there are exactly 5. Admins create them once.
- Publishing a document does not update the website by itself. The website picks up everything published at the next Site update: the daily early-morning rebuild, or sooner when an editor starts one with the **Update website** button (coming soon).
- Links page: tick "Highlight" for 1 to 2 main links; set "Hide after" for time-limited links (ticket sales).

`astro-queries.ts` contains the GROQ queries for the Astro site.
