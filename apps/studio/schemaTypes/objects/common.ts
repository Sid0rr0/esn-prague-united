import { defineArrayMember, defineField, defineType } from 'sanity'
import { localisedString, localisedText, localisedRichText } from './locale'

/** Image with required alt text and hotspot/crop. Used everywhere. */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    localisedString({
      name: 'alt',
      title: 'Short description (for screen readers)',
      description: 'Please describe the photo in a few words.',
      required: true,
      warnOnly: true,
    }),
    localisedString({ name: 'caption', title: 'Caption' }),
  ],
})

/** Rich text, kept deliberately small so editors can't break the layout. */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h3' },
      ],
      lists: [
        { title: 'Bullets', value: 'bullet' },
        { title: 'Numbers', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
  ],
})

/** Call-to-action button. */
export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    localisedString({ name: 'label', title: 'Button text', required: true, max: 30 }),
    defineField({ name: 'url', title: 'Link', type: 'url', validation: (r) => r.required() }),
  ],
})

/** Social profiles, reused by settings, sections and contacts. */
export const socials = defineType({
  name: 'socials',
  title: 'Social media',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'facebook', type: 'url' }),
    defineField({ name: 'tiktok', type: 'url' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp community', type: 'url' }),
    defineField({ name: 'linkedin', type: 'url' }),
    defineField({ name: 'website', type: 'url' }),
  ],
})

/** SEO / link preview when shared on WhatsApp, Instagram, etc. */
export const seo = defineType({
  name: 'seo',
  title: 'Sharing preview (SEO)',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    localisedString({ name: 'title', max: 60 }),
    localisedText({ name: 'description', max: 160 }),
    defineField({
      name: 'image',
      title: 'Preview image',
      type: 'image',
      description: 'Shown when the link is shared. Ideal size 1200 x 630.',
    }),
  ],
})

/** One line in an event programme. */
export const programmeItem = defineType({
  name: 'programmeItem',
  title: 'Programme item',
  type: 'object',
  fields: [
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g. 18:00',
      validation: (r) => r.required().regex(/^\d{1,2}:\d{2}$/, { name: 'HH:MM' }),
    }),
    localisedString({ name: 'title', title: 'What happens', required: true }),
    localisedText({ name: 'description', title: 'Details' }),
  ],
  preview: {
    select: { time: 'time', title: 'title.en' },
    prepare: ({ time, title }) => ({ title: `${time}  ${title}` }),
  },
})

/** Question + answer, used by the FAQ page and by events. */
export const faqEntry = defineType({
  name: 'faqEntry',
  title: 'Question',
  type: 'object',
  fields: [
    localisedString({ name: 'question', required: true }),
    localisedRichText({ name: 'answer', required: true }),
  ],
  preview: { select: { title: 'question.en' } },
})
