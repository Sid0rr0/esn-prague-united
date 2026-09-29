import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImage } from './types'

const builder = createImageUrlBuilder({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'unset',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
})

/** crop: fill the box, cropped to the hotspot (photos). contain: fit inside the box, never cropped (logos). */
export type ImageFit = 'crop' | 'contain'

interface Size {
  width?: number
  height?: number
  fit?: ImageFit
}

/** CDN URL for a Sanity image, or undefined when no image is set. */
export function imageUrl(
  image: SanityImage | undefined | null,
  { width, height, fit = 'crop' }: Size,
) {
  if (!image?.asset) return undefined
  return fit === 'contain'
    ? containedUrl(image, { width, height })
    : croppedUrl(image, { width, height })
}

function croppedUrl(image: SanityImage, { width, height }: Size) {
  let url = builder.image(image).auto('format').fit('crop')
  if (width) url = url.width(width)
  if (height) url = url.height(height)
  return url.url()
}

/**
 * Logos are shown exactly as provided (docs/agents/brand-rules.md), so this ignores any crop or
 * hotspot, and bounds the image with max-w/max-h: given both w and h, the builder adds a rect
 * that crops the image to the box's shape.
 */
function containedUrl(image: SanityImage, { width, height }: Size) {
  let url = builder.image({ asset: image.asset }).auto('format').fit('max')
  if (width) url = url.maxWidth(width)
  if (height) url = url.maxHeight(height)
  return url.url()
}
