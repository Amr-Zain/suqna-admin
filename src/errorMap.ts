import { z, ZodIssueCode, type ZodErrorMap } from 'zod'
import i18n from './i18n' // your i18next instance
import { TFn } from './lib/schema/validation'

// Optionally extract last path segment as a "field" label
const last = (arr: unknown[]) =>
  arr?.length ? String(arr[arr.length - 1]) : ''

export const makeErrorMap =
  (t: TFn): ZodErrorMap =>
  (issue, ctx) => {
    // Missing value -> "required"
    if (
      issue.code === ZodIssueCode.invalid_type &&
      issue.received === 'undefined'
    ) {
      // Try to produce a field-aware message if you prefer:
      const fieldKey = last(issue.path)
      // If you keep labels in code, map fieldKey -> label here if needed.
      return { message: t('Validation.requiredSimple') }
    }

    // Optional: normalize other common cases if you like
    if (issue.code === ZodIssueCode.too_small && issue.type === 'string') {
      const min = (issue.minimum ?? 1) as number
      return {
        message: t('Validation.minChars', { field: last(issue.path), min }),
      }
    }

    if (
      issue.code === ZodIssueCode.invalid_string &&
      issue.validation === 'email'
    ) {
      return { message: t('Validation.email') }
    }

    // Fallback to Zod’s default (will still show i18n for our explicit messages)
    return { message: ctx.defaultError }
  }

// Call this once at app start, and re-apply on language change
export const setupZodI18n = (t: TFn) => {
  z.setErrorMap(makeErrorMap(t))
}
