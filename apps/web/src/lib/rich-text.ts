import { escapeHTML, toHTML } from '@portabletext/to-html'
import { imageUrl } from './image'
import type { RichText, SanityImage } from './shapes'

const RICH_TEXT_IMAGE_WIDTH = 1200

const renderImage = ({ value }: { value: SanityImage }) => {
  const src = imageUrl(value, { width: RICH_TEXT_IMAGE_WIDTH })
  return src
    ? `<img src="${escapeHTML(src)}" alt="${escapeHTML(value.alt ?? '')}" class="img-${value.size ?? 'large'}" loading="lazy">`
    : ''
}

/** Renders editor rich text to HTML; text is escaped by the serializer. */
export const richTextToHtml = (blocks: RichText | undefined): string =>
  blocks?.length
    ? toHTML(blocks, {
        // imageWithAlt: legacy images saved before richTextImage existed.
        components: { types: { richTextImage: renderImage, imageWithAlt: renderImage } },
      })
    : ''
