import { escapeHTML, toHTML } from '@portabletext/to-html'
import { imageUrl } from './image'
import type { RichText, SanityImage } from './types'

const RICH_TEXT_IMAGE_WIDTH = 1200

/** Renders editor rich text to HTML; text is escaped by the serializer. */
export const richTextToHtml = (blocks: RichText | undefined): string =>
  blocks?.length
    ? toHTML(blocks, {
        components: {
          types: {
            imageWithAlt: ({ value }: { value: SanityImage }) => {
              const src = imageUrl(value, { width: RICH_TEXT_IMAGE_WIDTH })
              return src
                ? `<img src="${escapeHTML(src)}" alt="${escapeHTML(value.alt ?? '')}" loading="lazy">`
                : ''
            },
          },
        },
      })
    : ''
