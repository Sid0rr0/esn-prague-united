import { defineArrayMember, defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { localisedRichText, localisedString, localisedText } from '../objects/locale'

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
    localisedString({ name: 'title', group: 'basics', required: true }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title.en' },
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
        localisedText({ name: 'transport', title: 'How to get there' }),
      ],
    }),
    defineField({ name: 'heroImage', title: 'Main image', type: 'imageWithAlt', group: 'basics' }),
    localisedText({ name: 'summary', title: 'Short summary', group: 'basics', max: 240 }),
    localisedRichText({ name: 'description', title: 'About the event', group: 'details' }),
    defineField({
      name: 'programme',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'programmeItem' })],
    }),
    localisedRichText({ name: 'dressCode', title: 'Dress code', group: 'details' }),
    defineField({
      name: 'faq',
      title: 'Event FAQ',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'faqEntry' })],
    }),
    defineField({ name: 'ticketUrl', title: 'Ticket link', type: 'url', group: 'tickets' }),
    localisedRichText({ name: 'ticketInfo', title: 'Prices & ticket info', group: 'tickets' }),
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
    select: { title: 'title.en', date: 'startsAt', media: 'heroImage' },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('en-GB') : 'No date',
      media,
    }),
  },
})
