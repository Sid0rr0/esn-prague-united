import { defineArrayMember, defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'details', title: 'Programme & info' },
    { name: 'tickets', title: 'Tickets' },
    { name: 'seo', title: 'Sharing' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'basics',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title' },
      group: 'basics',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts',
      type: 'datetime',
      group: 'basics',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'endsAt', title: 'Ends', type: 'datetime', group: 'basics' }),
    defineField({
      name: 'venue',
      type: 'object',
      group: 'basics',
      fields: [
        defineField({ name: 'name', type: 'string', description: 'e.g. Radiopalác' }),
        defineField({ name: 'address', type: 'string' }),
        defineField({ name: 'mapUrl', title: 'Map link', type: 'url' }),
        defineField({ name: 'transport', title: 'How to get there', type: 'text', rows: 2 }),
      ],
    }),
    defineField({ name: 'heroImage', title: 'Main image', type: 'imageWithAlt', group: 'basics' }),
    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      group: 'basics',
      validation: (r) => r.max(240),
    }),
    defineField({
      name: 'description',
      title: 'About the event',
      type: 'richText',
      group: 'details',
    }),
    defineField({
      name: 'programme',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'programmeItem' })],
    }),
    defineField({ name: 'dressCode', title: 'Dress code', type: 'richText', group: 'details' }),
    defineField({
      name: 'faq',
      title: 'Event FAQ',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'faqEntry' })],
    }),
    defineField({ name: 'ticketUrl', title: 'Ticket link', type: 'url', group: 'tickets' }),
    defineField({
      name: 'ticketInfo',
      title: 'Prices & ticket info',
      type: 'richText',
      group: 'tickets',
    }),
    defineField({
      name: 'album',
      title: 'Photo album (after the event)',
      type: 'reference',
      to: [{ type: 'album' }],
      group: 'details',
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'startsAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'startsAt', media: 'heroImage' },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('en-GB') : 'No date',
      media,
    }),
  },
})
