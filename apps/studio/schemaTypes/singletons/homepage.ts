import { defineArrayMember, defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons/Home'
import { INSTAGRAM_POST_LIST_MAX, instagramPostList } from '../objects/instagramPostList'
import { localisedRichText, localisedString, localisedText } from '../objects/locale'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'content', title: 'Content blocks' },
    { name: 'seo', title: 'Sharing' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Top of page',
      type: 'object',
      group: 'hero',
      fields: [
        localisedString({ name: 'heading', required: true, max: 70 }),
        localisedText({ name: 'subheading', max: 200 }),
        defineField({ name: 'image', type: 'imageWithAlt' }),
        defineField({ name: 'primaryButton', title: 'Main button', type: 'cta' }),
        defineField({ name: 'secondaryButton', title: 'Second button', type: 'cta' }),
      ],
    }),
    defineField({
      name: 'featuredEvent',
      title: 'Featured event',
      type: 'reference',
      to: [{ type: 'event' }],
      group: 'hero',
      description:
        'Takes over the top of the homepage (e.g. the Czech Ball during its ticket sales). Clear it to return the top section to ESN Prague United content.',
    }),
    defineField({
      name: 'updates',
      title: 'Updates',
      type: 'object',
      group: 'content',
      description:
        'Instagram posts in a carousel after the upcoming events. Hidden when no posts are picked.',
      fields: [
        localisedString({ name: 'heading', initialValue: 'Updates' }),
        instagramPostList({
          name: 'posts',
          title: 'Instagram posts',
          description: `Drag to reorder: the first one is shown first. Max ${INSTAGRAM_POST_LIST_MAX}.`,
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About ESN Prague United',
      type: 'object',
      group: 'content',
      fields: [
        localisedString({ name: 'heading', initialValue: 'What is ESN Prague United?' }),
        localisedRichText({ name: 'text' }),
        defineField({
          name: 'stats',
          title: 'Numbers',
          type: 'array',
          description: 'e.g. "5" / "sections", "2000+" / "students a year". Max 4.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
                localisedString({ name: 'label', required: true }),
              ],
              preview: { select: { title: 'value', subtitle: 'label.en' } },
            }),
          ],
          validation: (r) => r.max(4),
        }),
      ],
    }),
    defineField({
      name: 'showSections',
      title: 'Show the 5 sections block',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'showGallery',
      title: 'Show latest photo albums',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'highlightedLinks',
      title: 'Quick links',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'linkItem' })],
      validation: (r) => r.max(4),
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
})
