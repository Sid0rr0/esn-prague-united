# Instagram posts as official embeds behind a consent banner

An Instagram post is stored as nothing but its link and rendered with Instagram's own embed. The embed loads only after the visitor accepts a site-wide consent banner. Until then, visitors see a branded placeholder linking to the post. We chose this so that editors only paste a link: no image uploads, no captions retyped, and no Meta API token to keep alive. The cost is that the site now has its first third-party tracker, a consent banner and a Privacy policy page. On top of that, posts look like Instagram rather than ESN, and a post deleted on Instagram shows up broken until an editor removes it.

## Considered Options

- **Self-hosted cards** (the editor uploads the post image and an optional caption, and the site renders its own branded card linking out): no tracking and no banner, fully on-brand. It was rejected because it's an extra step for editors on every post.
- **Meta oEmbed at build time** (thumbnail and caption fetched during a Site update): it was rejected because it needs a Meta app and token, and Meta keeps removing oEmbed fields.
- **Loading the embed without consent**: it was rejected because Meta sets cookies before the visitor agrees, which EU law requires consent for.

## Consequences

Any future third-party service (analytics, maps, video) must go through the same consent module rather than add a second banner. Switching to self-hosted cards later would mean asking editors to add an image to every existing Instagram post.
