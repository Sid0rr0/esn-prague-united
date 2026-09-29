# Vercel setup runbook

The site is a plain static Astro build hosted on Vercel. Follow these steps to recreate the project. The Studio is not hosted on Vercel; it stays on Sanity's own hosting.

## 1. Account

Sign up for Vercel on the **Hobby** plan with an ESN Prague organisation email, not a volunteer's personal account, so the site survives when volunteers leave. Vercel's Hobby plan is for non-commercial use. If Vercel objects to the sponsor credits or ticket links, move to Pro or apply for their nonprofit sponsorship; the static setup doesn't change.

## 2. Project

1. **Add New… → Project** and import this repository through the Vercel GitHub integration.
2. Set **Root Directory** to `apps/web`. Vercel detects Astro and the pnpm workspace on its own.
3. Leave the build settings on their defaults (the `build` script runs `astro check && astro build`).
4. Leave **Ignored Build Step** off, so every push builds and deploy-hook builds are never skipped.
5. Do not add a `vercel.json` or an Astro adapter.
6. Production branch: `main`. Preview deployments stay on for all other branches and pull requests.

The site is served at the project's `*.vercel.app` address. A custom domain is a later ticket.

## 3. Environment variables

Under **Settings → Environment Variables**, set for both **Production** and **Preview**:

| Variable                   | Value                              |
| -------------------------- | ---------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID` | required: the Sanity project ID    |
| `PUBLIC_SANITY_DATASET`    | optional, defaults to `production` |

Both are public values, not secrets. The build fails loudly if the project ID is missing.

## 4. Deploy Hook

Under **Settings → Git → Deploy Hooks**, create a hook named `site-update` on branch `main`.

Keep the URL private and **never commit it**. Anyone holding it can trigger builds. It is used later in two places only: Sanity's webhook settings (Update website button) and the `VERCEL_DEPLOY_HOOK_URL` GitHub repository secret (daily rebuild).

## 5. Sanity webhook (Update website button)

The **Update website** button in the Studio writes the `siteUpdateRequest` document. A Sanity webhook on that type calls the Deploy Hook, so pressing the button starts a Site update. In [sanity.io/manage](https://www.sanity.io/manage) → project → **API → Webhooks**, create:

| Setting     | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Dataset     | `production`                                          |
| Trigger on  | Create and Update (not Delete)                        |
| Filter      | `_type == "siteUpdateRequest"`                        |
| URL         | the Deploy Hook URL from step 4 (paste it here only)  |
| HTTP method | `POST`                                                |
| Payload     | none: leave the projection empty and disable the body |

Do not add a webhook on publish: publishing must not start a build. Drafts never match, because the request is a published document.

## 6. Check it works

- Merge to `main`: the change appears on the `*.vercel.app` production address.
- Open a pull request: it gets a preview URL that renders the site with Sanity content.
- Press **Update website** in the Studio: a production build starts within moments and the button shows "Updating…" for 45 seconds.
- Publish, unpublish, delete or save a draft: no build starts.
