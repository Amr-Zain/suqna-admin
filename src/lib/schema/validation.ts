import z from 'zod'

export type TFn = (key: string, values?: Record<string, unknown>) => string

export const L = (t: TFn, fieldKey: string) => t(`Form.labels.${fieldKey}`)
export const msg = {
  required: (t: TFn, field: string) => t('Validation.required', { field }),
  minChars: (t: TFn, field: string, min: number) =>
    t('Validation.minChars', { field, min }),
  maxChars: (t: TFn, field: string, max: number) =>
    t('Validation.maxChars', { field, max }),
  digitsOnly: (t: TFn, field: string) => t('Validation.digitsOnly', { field }),
  numberRequired: (t: TFn, field: string) =>
    t('Validation.numberRequired', { field }),
  numberMin: (t: TFn, field: string, min: number) =>
    t('Validation.numberMin', { field, min }),
  numberMax: (t: TFn, field: string, max: number) =>
    t('Validation.numberMax', { field, max }),
}

export const requiredString = (
  t: TFn,
  field: string,
  min?: number,
  max?: number,
) => {
  let s = z.string({ required_error: msg.required(t, field) }).trim()
  if (min) s = s.min(min | 1, msg.minChars(t, field, min | 1))
  if (max) s = s.max(max, msg.maxChars(t, field, max))

  // Preprocess to handle null/empty from select/inputs
  return z.preprocess((v) => (v === null ? undefined : v), s)
}

export const optionalString = () => {
  return z.preprocess((v) => (v === null || v === '' ? undefined : v), z.string().optional())
}
export const imageSchema = (t: TFn, field: string, required?: boolean) => {
  if (required)
    return z
      .string()
      .min(1, msg.required(t, field))
      .or(
        z.object({
          url: z.string().optional(),
          uid: z.string().optional(),
        }),
      )
  return z
    .string()
    .optional()
    .or(
      z.object({
        url: z.string(),
        uid: z.string().optional(),
      }),
    )
}
export const digitsOnlyString = (
  t: TFn,
  field: string,
  min?: number,
  max?: number,
) => {
  let s = z.string()
  if (min) s = s.min(min, msg.numberMin(t, field, min))
  if (max) s = s.max(max, msg.numberMax(t, field, max))
  return s.regex(/^\d+$/, msg.digitsOnly(t, field))
}

export const requiredId = (t: TFn, field: string) =>
  z.coerce.string().min(1, msg.required(t, field))

export const requiredNumber = (
  t: TFn,
  field: string,
  min?: number,
  max?: number,
) =>
  z.coerce
    .number({ message: msg.numberRequired(t, field) })
    .min(min || 0, msg.numberMin(t, field, min || 0))
    .max(
      max || Number.MAX_SAFE_INTEGER,
      msg.numberMax(t, field, max || Number.MAX_SAFE_INTEGER),
    )
/* 
export const requiredEnum = <T extends [string, ...string[]]>(
  t: TFn,
  field: string,
  values: T,
) => z.enum(values, { required_error: msg.required(t, field) }) */
export const requiredEnum = <T extends [string, ...string[]]>(
  t: TFn,
  field: string,
  values: T,
) =>
  z.preprocess(
    (v) => (v === '' || v == null ? undefined : String(v)),
    z
      .string({ required_error: msg.required(t, field) })
      .trim()
      .min(1, msg.required(t, field))
      .superRefine((val, ctx) => {
        if (!(values as readonly string[]).includes(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msg.required(t, field),
          })
        }
      }),
  )

export const shortCode = (t: TFn, field: string) =>
  requiredString(t, field, 2, 5)



const uidOrHashObject = (t: TFn) => z
  .object({
    uid: z.string().trim().min(1).optional().nullable(),
    hash: z.string().trim().min(1).optional().nullable(),
    path: z.string().trim().min(1).optional().nullable(),
    url: z.string().trim().min(1).optional().nullable(),
  })
  .refine((o) => !!o.uid || !!o.hash || !!o.path || !!o.url, {
    message: t('Validation.requiredImg'),
  })

/** preprocess: map "", null, {}, {uid:"",hash:""} -> undefined */
const emptyAsUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => {
    if (v === '' || v === null || v === undefined) return undefined
    if (typeof v === 'object' && v !== null) {
      const u = (v as any).uid
      const h = (v as any).hash
      const p = (v as any).path
      const url = (v as any).url

      const hasKeys =
        Object.prototype.hasOwnProperty.call(v, 'uid') ||
        Object.prototype.hasOwnProperty.call(v, 'hash') ||
        Object.prototype.hasOwnProperty.call(v, 'path') ||
        Object.prototype.hasOwnProperty.call(v, 'url')

      const allEmpty = !u && !h && !p && !url

      if (hasKeys && allEmpty) return undefined
      if (!hasKeys && Object.keys(v as any).length === 0) return undefined
    }
    return v
  }, schema)

/**
 * stringOrUidHashObject:
 * - required=true  (default): must be non-empty string OR object with uid/hash (non-empty)
 * - required=false: undefined / null / '' / {uid:'',hash:''} are allowed (treated as undefined).
 * - nullable=true: null also allowed when required=true (rare).
 */
export const stringOrUidHashObject = (
  t: TFn,
  opts?: { required?: boolean; nullable?: boolean },
) => {
  const base = z.union([
    z.string().trim().min(1, t('Validation.requiredSimple')),
    uidOrHashObject(t),
  ])

  if (opts?.required === false) {
    // allow empty values by mapping them to undefined
    const relaxed = emptyAsUndefined(base)
    return opts?.nullable ? relaxed.nullable().optional() : relaxed.optional()
  }

  // required case
  return opts?.nullable ? base.nullable() : base
}

export const emailSchema = (t: TFn) =>
  z.string({ required_error: msg.required(t, t('Form.labels.email')) })
    .email(t('Validation.invalidEmail'))