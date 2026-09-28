import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'
import { localisedString } from './locale'

/**
 * Preset icons: editors pick from a list instead of uploading SVGs.
 * The Astro site maps each value to an icon component.
 */
export const ICON_OPTIONS = [
  { title: 'Website', value: 'globe' },
  { title: 'Instagram', value: 'instagram' },
  { title: 'Facebook', value: 'facebook' },
  { title: 'WhatsApp', value: 'whatsapp' },
  { title: 'TikTok', value: 'tiktok' },
  { title: 'LinkedIn', value: 'linkedin' },
  { title: 'YouTube', value: 'youtube' },
  { title: 'Spotify', value: 'spotify' },
  { title: 'Ticket', value: 'ticket' },
  { title: 'Calendar / event', value: 'calendar' },
  { title: 'Form / sign-up', value: 'form' },
  { title: 'Map / location', value: 'map' },
  { title: 'Email', value: 'mail' },
  { title: 'Photos', value: 'camera' },
  { title: 'Document / PDF', value: 'file' },
  { title: 'ESN star', value: 'esn' },
]

export const linkItem = defineType({
  name: 'linkItem',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    localisedString({ name: 'label', title: 'Display text', required: true, max: 60 }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'Full address, e.g. https://instagram.com/esnprague, or mailto:hello@...',
      validation: (r) => r.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: { list: ICON_OPTIONS },
      initialValue: 'globe',
    }),
    defineField({
      name: 'highlight',
      title: 'Highlight this link',
      type: 'boolean',
      description: 'Shows it as a big coloured button (use for 1 to 2 links at most).',
      initialValue: false,
    }),
    defineField({
      name: 'visibleUntil',
      title: 'Hide after',
      type: 'datetime',
      description:
        'Optional. The link disappears automatically after this date (on the next rebuild).',
    }),
  ],
  preview: {
    select: { title: 'label.en', subtitle: 'url', highlight: 'highlight' },
    prepare: ({ title, subtitle, highlight }) => ({
      title: highlight ? `★ ${title}` : title,
      subtitle,
    }),
  },
})
