/**
 * The visitor's consent to Instagram content, the site's only third-party service. Server
 * HTML always holds placeholders; this module swaps them for Instagram's embeds once the
 * visitor accepts, and runs the banner, the placeholders' Allow buttons and Cookie settings.
 */

export type ConsentChoice = 'undecided' | 'accepted' | 'rejected'

/** The part of localStorage the module uses, so tests can hand in their own device. */
export type ConsentStorage = Pick<Storage, 'getItem' | 'setItem'>

const STORAGE_KEY = 'esn-instagram-consent'
const INSTAGRAM_SCRIPT_SRC = 'https://www.instagram.com/embed.js'
const INSTAGRAM_EMBED_VERSION = '14'

/** The stored choice; anything unreadable (blocked storage, junk value) counts as undecided. */
export function readConsent(storage: () => ConsentStorage): ConsentChoice {
  try {
    const value = storage().getItem(STORAGE_KEY)
    return value === 'accepted' || value === 'rejected' ? value : 'undecided'
  } catch {
    return 'undecided'
  }
}

/** Stores the choice when the device allows it; otherwise it lasts for this page only. */
export function writeConsent(
  storage: () => ConsentStorage,
  choice: Exclude<ConsentChoice, 'undecided'>,
): void {
  try {
    storage().setItem(STORAGE_KEY, choice)
  } catch {
    // Storage is blocked or full: the visitor is asked again on the next page.
  }
}

interface InstagramGlobal {
  instgrm?: { Embeds: { process: () => void } }
}

function loadInstagramScript(document: Document): void {
  if (document.querySelector(`script[src="${INSTAGRAM_SCRIPT_SRC}"]`)) {
    // Already loaded: it only scans the page on load, so ask it to pick up new embeds.
    ;(document.defaultView as InstagramGlobal | null)?.instgrm?.Embeds.process()
    return
  }
  const script = document.createElement('script')
  script.src = INSTAGRAM_SCRIPT_SRC
  script.async = true
  document.body.append(script)
}

/** A shown embed and the placeholder it replaced, so consent can be withdrawn in place. */
interface ShownEmbed {
  placeholder: HTMLElement
  container: HTMLElement
}

/** Builds the blockquote Instagram's script turns into an iframe, inside a stable container. */
function embedFor(document: Document, placeholder: HTMLElement): HTMLElement {
  const embed = document.createElement('blockquote')
  embed.className = 'instagram-media'
  embed.dataset.instgrmPermalink = placeholder.dataset.instagramPost ?? ''
  embed.dataset.instgrmVersion = INSTAGRAM_EMBED_VERSION
  // Until the script runs (or if it's blocked), the embed is the placeholder's own link.
  const link = placeholder.querySelector('a[href]')?.cloneNode(true)
  if (link) embed.append(link)

  // The script swaps the blockquote for an iframe; the container stays put for withdrawal.
  const container = document.createElement('div')
  container.dataset.instagramEmbed = ''
  container.append(embed)
  return container
}

/** Replaces each placeholder on the page with Instagram's embed. */
function showEmbeds(document: Document): ShownEmbed[] {
  const placeholders = [...document.querySelectorAll<HTMLElement>('[data-instagram-post]')]
  if (placeholders.length === 0) return []

  const shown = placeholders.map((placeholder) => {
    const container = embedFor(document, placeholder)
    placeholder.replaceWith(container)
    return { placeholder, container }
  })
  loadInstagramScript(document)
  return shown
}

/** Puts the placeholders back, removing Instagram's iframes from the page. */
function hideEmbeds(shown: ShownEmbed[]): void {
  shown.forEach(({ placeholder, container }) => container.replaceWith(placeholder))
}

/** Wires the banner, the Allow buttons and Cookie settings, then applies the stored choice. */
export function startConsent(document: Document, storage: () => ConsentStorage): void {
  const banner = document.querySelector<HTMLElement>('[data-consent-banner]')
  const setBannerShown = (isShown: boolean) => {
    if (banner) banner.hidden = !isShown
  }

  let shownEmbeds: ShownEmbed[] = []

  const accept = () => {
    writeConsent(storage, 'accepted')
    setBannerShown(false)
    shownEmbeds = [...shownEmbeds, ...showEmbeds(document)]
  }
  const reject = () => {
    writeConsent(storage, 'rejected')
    setBannerShown(false)
    hideEmbeds(shownEmbeds)
    shownEmbeds = []
  }

  banner?.querySelector('[data-consent-accept]')?.addEventListener('click', accept)
  banner?.querySelector('[data-consent-reject]')?.addEventListener('click', reject)
  document.querySelectorAll('[data-consent-allow]').forEach((button) => {
    button.addEventListener('click', accept)
  })
  document.querySelectorAll('[data-consent-settings]').forEach((button) => {
    button.addEventListener('click', () => {
      setBannerShown(true)
      banner?.querySelector<HTMLElement>('[data-consent-accept]')?.focus()
    })
  })

  const choice = readConsent(storage)
  setBannerShown(choice === 'undecided')
  if (choice === 'accepted') accept()
}
