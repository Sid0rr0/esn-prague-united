import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { localisedString } from '../objects/locale'

export const album = defineType({
  name: 'album',
  title: 'Photo album',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    localisedString({ name: 'title', required: true }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title.en' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'date', type: 'date', validation: (r) => r.required() }),
    defineField({
      name: 'cover',
      title: 'Cover photo',
      type: 'imageWithAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photos',
      type: 'array',
      description:
        'Drag & drop many photos at once. Keep it to the best 10 to 40; link the rest below.',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      options: { layout: 'grid' },
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'fullAlbumUrl',
      title: 'Full album link (Google Photos, Flickr...)',
      type: 'url',
    }),
    defineField({
      name: 'photographer',
      title: 'Photo credit',
      type: 'string',
    }),
  ],
  orderings: [
    { title: 'Date, newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title.en', subtitle: 'date', media: 'cover' } },
})
