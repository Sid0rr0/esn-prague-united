import { defineField, defineType } from 'sanity'
import { CaseIcon } from '@sanity/icons/Case'

/** An outside organisation that supports Events, kept once and credited on each Event. */
export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: "Also read out to screen readers as the logo's description.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      type: 'image',
      description: 'Upload an SVG, or a PNG with a transparent background.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website link',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
})
