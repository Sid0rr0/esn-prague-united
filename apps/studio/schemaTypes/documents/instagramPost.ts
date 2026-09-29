import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import { checkInstagramLink } from '../../../web/src/lib/instagram-link.ts'

/** A link to one public Instagram post or reel, picked for Updates or an Event (CONTEXT.md). */
export const instagramPost = defineType({
  name: 'instagramPost',
  title: 'Instagram post',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description:
        'Only editors see this, to recognise the post when picking it (e.g. "Czech Ball 2026 – lineup reveal").',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'link',
      type: 'url',
      description: 'Paste the post or reel link from Instagram ("Copy link").',
      validation: (r) =>
        r.required().custom((value: string | undefined) => {
          if (!value) return true
          const check = checkInstagramLink(value)
          return check.ok || check.message
        }),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'link' } },
})
