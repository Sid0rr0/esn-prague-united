import { defineArrayMember, defineField, defineType } from 'sanity'
import { HelpCircleIcon, EnvelopeIcon, LinkIcon } from '@sanity/icons'
import { localisedString, localisedText } from '../objects/locale'

/** /faq: questions grouped by topic, drag & drop to reorder. */
export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    localisedString({ name: 'title', initialValue: 'Frequently asked questions' }),
    localisedText({ name: 'intro' }),
    defineField({
      name: 'groups',
      title: 'Topics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqGroup',
          fields: [
            localisedString({
              name: 'title',
              title: 'Topic',
              description:
                'General topics, e.g. ESN card, Buddy programme, Joining ESN. Questions about one Event go in that Event’s FAQ.',
              required: true,
            }),
            defineField({
              name: 'items',
              title: 'Questions',
              type: 'array',
              of: [defineArrayMember({ type: 'faqEntry' })],
            }),
          ],
          preview: {
            select: { title: 'title.en', items: 'items' },
            prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} questions` }),
          },
        }),
      ],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'FAQ' }) },
})

/** /contacts: general contact + each section's contact (pulled from section docs). */
export const contactsPage = defineType({
  name: 'contactsPage',
  title: 'Contacts',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    localisedString({ name: 'title', initialValue: 'Contact us' }),
    localisedText({ name: 'intro' }),
    defineField({
      name: 'generalEmail',
      title: 'General email',
      type: 'string',
      validation: (r) => r.email(),
    }),
    defineField({ name: 'address', title: 'Postal / office address', type: 'text', rows: 3 }),
    defineField({
      name: 'showSectionContacts',
      title: 'Also list the 5 sections’ contacts',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'socials', type: 'socials' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Contacts' }) },
})

/** /links: link-in-bio page for Instagram, QR codes on posters, etc. */
export const linksPage = defineType({
  name: 'linksPage',
  title: 'Links page',
  type: 'document',
  icon: LinkIcon,
  fields: [
    localisedString({ name: 'title', initialValue: 'ESN Prague' }),
    localisedString({ name: 'intro', max: 120 }),
    defineField({ name: 'avatar', title: 'Logo / picture', type: 'image' }),
    defineField({
      name: 'links',
      type: 'array',
      description: 'Drag to reorder. Highlighted links appear as big buttons at the top.',
      of: [defineArrayMember({ type: 'linkItem' })],
      validation: (r) => r.min(1),
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Links page' }) },
})
