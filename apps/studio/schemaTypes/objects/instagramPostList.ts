import { defineArrayMember, defineField, type FieldDefinition } from 'sanity'

/** At most this many Instagram posts in one picked list (Updates, an Event). */
export const INSTAGRAM_POST_LIST_MAX = 8

interface InstagramPostListOptions {
  name: string
  title?: string
  description?: string
  group?: string
}

/** A list of Instagram post references, at most INSTAGRAM_POST_LIST_MAX, no duplicates, shown in the editor's order. */
export const instagramPostList = (field: InstagramPostListOptions): FieldDefinition =>
  defineField({
    ...field,
    type: 'array',
    of: [defineArrayMember({ type: 'reference', to: [{ type: 'instagramPost' }] })],
    validation: (r) => r.unique().max(INSTAGRAM_POST_LIST_MAX),
  })
