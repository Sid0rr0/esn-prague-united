import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImage } from './shapes'

const builder = createImageUrlBuilder({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'unset',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
})

interface Size {
  width?: number
  height?: number
}

/** CDN URL for a Sanity image, cropped to its hotspot, or undefined when no image is set. */
export function imageUrl(image: SanityImage | undefined | null, { width, height }: Size) {
  if (!image?.asset) return undefined
  let url = builder.image(image).auto('format').fit('crop')
  if (width) url = url.width(width)
  if (height) url = url.height(height)
  return url.url()
}
