import { defineField, defineType } from 'sanity'
import { RefreshIcon } from '@sanity/icons/Refresh'

/**
 * Written by the "Update website" navbar button. A Sanity webhook on this type
 * starts a Site update. The website never reads it.
 */
export const siteUpdateRequest = defineType({
  name: 'siteUpdateRequest',
  title: 'Site update request',
  type: 'document',
  icon: RefreshIcon,
  readOnly: true,
  fields: [
    defineField({ name: 'pressedAt', type: 'datetime' }),
    defineField({ name: 'pressedBy', type: 'string' }),
  ],
})
