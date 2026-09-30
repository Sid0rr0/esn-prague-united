import { defineField, defineType, type FieldDefinition, type Rule } from 'sanity'

/**
 * Field-level translation (ADR 0002): each translatable field stores one value per
 * language. English is required wherever the field is; Czech is optional and the
 * site falls back to English when it's empty.
 */
export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'cs', title: 'Czech' },
] as const

export const localeString = defineType({
  name: 'localeString',
  title: 'Text',
  type: 'object',
  fields: LANGUAGES.map(({ id, title }) => defineField({ name: id, title, type: 'string' })),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Text',
  type: 'object',
  fields: LANGUAGES.map(({ id, title }) => defineField({ name: id, title, type: 'text', rows: 3 })),
})

export const localeRichText = defineType({
  name: 'localeRichText',
  title: 'Text',
  type: 'object',
  fields: LANGUAGES.map(({ id, title }) => defineField({ name: id, title, type: 'richText' })),
})

type LocaleType = 'localeString' | 'localeText' | 'localeRichText'

interface LocalisedFieldOptions {
  name: string
  title?: string
  description?: string
  group?: string
  initialValue?: string
  required?: boolean
  /** A missing English value only warns instead of blocking publish. */
  warnOnly?: boolean
  max?: number
  hidden?: boolean
  /** A further rule for this field, next to the required and max checks. */
  extraRule?: (rule: Rule) => Rule
}

const isBlank = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)

const validateLocalised =
  ({ required, max }: Pick<LocalisedFieldOptions, 'required' | 'max'>) =>
  (value: Record<string, unknown> | undefined) => {
    if (required && isBlank(value?.en)) return 'English is required.'
    if (max === undefined) return true
    const tooLong = LANGUAGES.find(({ id }) => {
      const text = value?.[id]
      return typeof text === 'string' && text.length > max
    })
    return tooLong ? `${tooLong.title} must be at most ${max} characters.` : true
  }

const localised =
  (type: LocaleType) =>
  ({
    required,
    warnOnly,
    max,
    initialValue,
    extraRule,
    ...field
  }: LocalisedFieldOptions): FieldDefinition =>
    defineField({
      ...field,
      type,
      ...(initialValue === undefined ? {} : { initialValue: { en: initialValue } }),
      validation: (rule) => {
        const custom = rule.custom(validateLocalised({ required, max }))
        const own = warnOnly ? custom.warning() : custom
        return extraRule ? [own, extraRule(rule)] : own
      },
    })

/** A translatable single line. */
export const localisedString = localised('localeString')
/** A translatable multi-line plain text. */
export const localisedText = localised('localeText')
/** Translatable rich text. */
export const localisedRichText = localised('localeRichText')
