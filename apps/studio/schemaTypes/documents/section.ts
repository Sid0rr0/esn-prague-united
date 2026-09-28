import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

/**
 * One ESN section in Prague. There are exactly 5; the Studio structure
 * (sanity.config.ts) shows them as a fixed list and hides "create new",
 * so editors can't accidentally add a 6th.
 */
export const section = defineType({
  name: 'section',
  title: 'ESN section',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'contact', title: 'Contact & links' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      description: 'e.g. ESN CTU in Prague',
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short name',
      type: 'string',
      description: 'e.g. ESN CTU. Used on buttons and tags.',
      group: 'main',
      validation: (r) => r.required().max(16),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'shortName' },
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'university',
      title: 'University',
      type: 'string',
      description: 'e.g. Czech Technical University in Prague',
      group: 'main',
    }),
    defineField({ name: 'logo', type: 'image', group: 'main' }),
    defineField({
      name: 'coverImage',
      title: 'Cover photo',
      type: 'imageWithAlt',
      group: 'main',
    }),
    defineField({
      name: 'tagline',
      title: 'One-line description',
      type: 'string',
      group: 'main',
      validation: (r) => r.max(120),
    }),
    defineField({ name: 'about', title: 'About the section', type: 'richText', group: 'main' }),
    defineField({
      name: 'buddyProgramUrl',
      title: 'Buddy programme sign-up',
      type: 'url',
      group: 'contact',
    }),
    defineField({ name: 'email', type: 'string', group: 'contact', validation: (r) => r.email() }),
    defineField({
      name: 'office',
      title: 'Office / office hours',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Office on map (Google/Mapy.cz link)',
      type: 'url',
      group: 'contact',
    }),
    defineField({ name: 'socials', type: 'socials', group: 'contact' }),
    defineField({
      name: 'order',
      title: 'Order on the website',
      type: 'number',
      group: 'main',
      validation: (r) => r.integer().min(1).max(5),
    }),
  ],
  orderings: [
    { title: 'Website order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'name', subtitle: 'university', media: 'logo' } },
})
