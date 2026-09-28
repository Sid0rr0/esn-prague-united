import { defineArrayMember, defineField, defineType } from 'sanity'
import { HelpCircleIcon, EnvelopeIcon, LinkIcon } from '@sanity/icons'

/** /faq: questions grouped by topic, drag & drop to reorder. */
export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Frequently asked questions' }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({
      name: 'groups',
      title: 'Topics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqGroup',
          fields: [
            defineField({
              name: 'title',
              title: 'Topic',
              type: 'string',
              description: 'e.g. Tickets, Dress code, Getting there',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'items',
              title: 'Questions',
              type: 'array',
              of: [defineArrayMember({ type: 'faqEntry' })],
            }),
          ],
          preview: {
            select: { title: 'title', items: 'items' },
            prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} questions` }),
          },
        }),
      ],
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'FAQ' }) },
})

/** /contacts: general contact + people + each section's contact (pulled from section docs). */
export const contactsPage = defineType({
  name: 'contactsPage',
  title: 'Contacts',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Contact us' }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({
      name: 'generalEmail',
      title: 'General email',
      type: 'string',
      validation: (r) => r.email(),
    }),
    defineField({ name: 'address', title: 'Postal / office address', type: 'text', rows: 3 }),
    defineField({
      name: 'people',
      title: 'Contact people',
      type: 'array',
      description: 'Remember to update after each board handover.',
      of: [defineArrayMember({ type: 'contactPerson' })],
    }),
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
    defineField({ name: 'title', type: 'string', initialValue: 'ESN Prague' }),
    defineField({ name: 'intro', type: 'string', validation: (r) => r.max(120) }),
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
