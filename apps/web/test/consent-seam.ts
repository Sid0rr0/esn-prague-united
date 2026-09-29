import { JSDOM } from 'jsdom'
import { startConsent, type ConsentStorage } from '../src/lib/consent'

/** Device storage that lives across visits of one test, like localStorage across reloads. */
export const deviceStorage = (): ConsentStorage => {
  const items = new Map<string, string>()
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
  }
}

/** Storage the browser refuses to open, e.g. with site data blocked. */
export const blockedStorage = (): ConsentStorage => {
  throw new DOMException('The operation is insecure.', 'SecurityError')
}

/** Storage that opens but throws on every read and write, e.g. with the quota exhausted. */
export const failingStorage: ConsentStorage = {
  getItem: () => {
    throw new DOMException('Quota exceeded', 'QuotaExceededError')
  },
  setItem: () => {
    throw new DOMException('Quota exceeded', 'QuotaExceededError')
  },
}

/** Loads rendered page HTML in a browser-like DOM and starts the consent module, as a visit. */
export function visit(html: string, storage: () => ConsentStorage) {
  const { window } = new JSDOM(html)
  const document = window.document
  startConsent(document, storage)

  const banner = () => document.querySelector<HTMLElement>('[data-consent-banner]')
  const click = (selector: string) => document.querySelector<HTMLElement>(selector)!.click()

  return {
    document,
    isBannerShown: () => banner() !== null && !banner()!.hidden,
    accept: () => click('[data-consent-banner] [data-consent-accept]'),
    reject: () => click('[data-consent-banner] [data-consent-reject]'),
    allowOnFirstPlaceholder: () => click('[data-instagram-post] [data-consent-allow]'),
    openCookieSettings: () => click('footer [data-consent-settings]'),
    placeholders: () => document.querySelectorAll('[data-instagram-post]').length,
    embeds: () =>
      [...document.querySelectorAll('blockquote.instagram-media')].map((embed) =>
        embed.getAttribute('data-instgrm-permalink'),
      ),
    instagramScripts: () =>
      document.querySelectorAll('script[src="https://www.instagram.com/embed.js"]').length,
  }
}
