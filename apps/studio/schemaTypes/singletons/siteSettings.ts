import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'
import { localisedString, localisedText } from '../objects/locale'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      type: 'string',
      initialValue: 'ESN Prague United',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({
      name: 'announcement',
      title: 'Top banner',
      type: 'object',
      description:
        'Optional strip at the top of every page, e.g. "Tickets for the Czech Ball are live!"',
      fields: [
        defineField({ name: 'enabled', type: 'boolean', initialValue: false }),
        localisedString({ name: 'text', max: 90 }),
        defineField({ name: 'url', type: 'url' }),
        defineField({
          name: 'visibleUntil',
          title: 'Hide after',
          type: 'datetime',
          description:
            'Optional. The banner disappears automatically after this date (on the next rebuild).',
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Main menu',
      type: 'array',
      description: 'Links in the header. Use paths like /events or /faq for pages on this site.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            localisedString({ name: 'label', required: true }),
            defineField({
              name: 'href',
              title: 'Path or URL',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
      validation: (r) => r.max(6),
    }),
    defineField({ name: 'socials', type: 'socials' }),
    localisedText({ name: 'footerText', title: 'Footer text' }),
    defineField({ name: 'seo', title: 'Default sharing preview', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
