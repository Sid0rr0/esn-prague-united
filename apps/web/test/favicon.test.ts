import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { renderPage } from './seam'
import { homepage, siteSettings } from './fixtures'

const PUBLIC_DIR = join(__dirname, '..', 'public')
const NOW = '2026-10-01T10:00:00Z'

const ICON_FILES = [
  'favicon.svg',
  'favicon.ico',
  'favicon-96x96.png',
  'apple-touch-icon.png',
  'web-app-manifest-192x192.png',
  'web-app-manifest-512x512.png',
  'site.webmanifest',
]

const readPublic = (file: string) => readFileSync(join(PUBLIC_DIR, file), 'utf8')

describe('favicon', () => {
  it('ships every icon file the head and the manifest point to', () => {
    const missing = ICON_FILES.filter((file) => !existsSync(join(PUBLIC_DIR, file)))

    expect(missing).toEqual([])
  })

  it('links the icons and the manifest from every page head', async () => {
    const html = await renderPage(Home, { now: NOW, documents: [homepage(), siteSettings()] })

    expect(html).toContain('href="/favicon-96x96.png"')
    expect(html).toContain('href="/favicon.svg"')
    expect(html).toContain('href="/favicon.ico"')
    expect(html).toContain('href="/apple-touch-icon.png"')
    expect(html).toContain('href="/site.webmanifest"')
  })

  it('names the manifest after ESN Prague United and opens in the browser', () => {
    const manifest = JSON.parse(readPublic('site.webmanifest'))

    expect(manifest.name).toBe('ESN Prague United')
    expect(manifest.short_name).toBe('ESN Prague United')
    expect(manifest.display).toBe('browser')
    expect(manifest.icons.every((icon: { purpose: string }) => icon.purpose === 'any')).toBe(true)
    expect(manifest.icons.map((icon: { src: string }) => icon.src)).toEqual([
      '/web-app-manifest-192x192.png',
      '/web-app-manifest-512x512.png',
    ])
  })

  it('shows the star on a transparent background, filling the icon', () => {
    const svg = readPublic('favicon.svg')
    const [, , width] = svg
      .match(/viewBox="([\d. ]+)"/)![1]
      .split(' ')
      .map(Number)

    expect(svg).not.toContain('<rect')
    expect(width).toBeLessThanOrEqual(44)
  })
})
