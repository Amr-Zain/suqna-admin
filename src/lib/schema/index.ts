import z from 'zod'
import {
  L,
  TFn,
  digitsOnlyString,
  imageSchema,
  msg,
  requiredEnum,
  requiredId,
  requiredNumber,
  requiredString,
  stringOrUidHashObject,
} from './validation'
// import { FAQ_TYPE_OPTIONS } from '@/types/api/faq'
// import { STATIC_PAGE_TYPE_OPTIONS } from '@/components/pagesComponents/StaticPages/Config'

// export const makePageSchema = (t: TFn) => {
//   return z.object({
//     image: stringOrUidHashObject(t, { required: false }),
//     type: requiredEnum(
//       t,
//       t('Form.labels.type'),
//       STATIC_PAGE_TYPE_OPTIONS.map((item) => item.value) as [
//         string,
//         ...string[],
//       ],
//     ),
//     // EN
//     title_en: requiredString(t, t('Form.labels.titleAr'), 5),
//     content_en: requiredString(t, t('Form.labels.contentEn'), 10),

//     // AR
//     title_ar: requiredString(t, t('Form.labels.titleAr'), 5),
//     content_ar: requiredString(t, t('Form.labels.contentAr'), 10),
//   })
// }
// export type StaticPageFormData = z.infer<ReturnType<typeof makePageSchema>>
const extractPlainText = (html?: string) =>
  (html ?? '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .trim()




export const makeCitySchema = (t: TFn) => {
  return z.object({
    country_id: requiredId(t, t('Form.labels.country')),
    map: z.object({
      lat: requiredNumber(t, t('Form.labels.lat')),
      lng: requiredNumber(t, t('Form.labels.lng')),
    }),
    postal_code: digitsOnlyString(t, t('Form.labels.postalCode'), 4, 10).optional().or(z.literal('')),
    status: z.boolean().default(true),
    name_ar: requiredString(t, t('Form.labels.nameAr'), 3, 20),
    slug_ar: requiredString(t, t('Form.labels.slugAr'), 3, 20),
    name_en: requiredString(t, t('Form.labels.nameEn'), 3, 20),
    slug_en: requiredString(t, t('Form.labels.slugEn'), 3, 20),
  })
}

export type CityFormData = z.infer<ReturnType<typeof makeCitySchema>>

// -------------------- Country --------------------

// -------------------- Page Additional --------------------
export const makePageAdditionalSchema = (t: TFn) => {
  const labels = {
    image: t('Form.labels.image'),
    titleEn: t('Form.labels.titleEn'),
    contentEn: t('Form.labels.contentEn'),
    titleAr: t('Form.labels.titleAr'),
    contentAr: t('Form.labels.contentAr'),
  }

  return z.object({
    image: stringOrUidHashObject(t, { required: false }),
    title_en: requiredString(t, labels.titleEn, 5),
    content_en: requiredString(t, labels.contentEn, 10),
    title_ar: requiredString(t, labels.titleAr, 5),
    content_ar: requiredString(t, labels.contentAr, 10),
  })
}
export type PageAdditionalForm = z.infer<
  ReturnType<typeof makePageAdditionalSchema>
>

// -------------------- Change Password --------------------
export const buildChangePasswordSchema = (t: TFn) => {
  const labels = { password: L(t, 'password') }
  return z
    .object({
      current_password: requiredString(t, labels.password, 8),
      password: requiredString(t, labels.password, 8),
      password_confirmation: requiredString(t, labels.password, 8),
    })
    .refine((v) => v.password === v.password_confirmation, {
      path: ['password_confirmation'],
      message: t('Validation.passwordsDoNotMatch'),
    })
}
export type ChangePasswordFormData = z.infer<
  ReturnType<typeof buildChangePasswordSchema>
>

// -------------------- Edit Profile --------------------
export const buildEditProfileSchema = (
  t: TFn,
  currentPhoneLimit: number,
  phoneStartingNumber: number | null,
) => {
  const labels = {
    image: L(t, 'image'),
    name: L(t, 'name'),
    phoneCode: L(t, 'phoneCode'),
    phone: L(t, 'phone'),
    email: t('Validation.email'),
  }

  return z
    .object({
      avatar: stringOrUidHashObject(t, { required: false }),
      name: requiredString(t, labels.name, 2),
      phone_code: requiredString(t, labels.phoneCode, 1, 3).optional().or(z.literal('')),
      // If you need non-digit phones, swap to requiredString
      phone: digitsOnlyString(
        t,
        labels.phone,
        currentPhoneLimit,
        currentPhoneLimit,
      ),
      email: z.string().email(labels.email),
    })
    .superRefine((v, ctx) => {
      if (typeof phoneStartingNumber !== 'number') return

      const requiredPrefix = String(phoneStartingNumber)
      const phone = String(v.phone ?? '')

      if (!phone.startsWith(requiredPrefix)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: t('Validation.phoneStartingNumber', {
            prefix: requiredPrefix,
          }),
        })
      }
    })
}
export type EditProfileFormData = z.infer<
  ReturnType<typeof buildEditProfileSchema>
>

// -------------------- Profile Settings --------------------
export const buildProfileSettingsSchema = (_t: TFn) =>
  z.object({
    is_notify: z.boolean(),
    locale: z.enum(['ar', 'en']),
  })
export type ProfileSettingsFormData = z.infer<
  ReturnType<typeof buildProfileSettingsSchema>
>

// -------------------- Supervisor --------------------
export const makeSupervisorSchema = (t: TFn, currentPhoneLimit: number, phoneStartingNumber?: number,
) => {
  const labels = {
    role: t('Form.labels.role'),
    fullName: t('Form.labels.fullName'),
    email: t('Form.labels.email'),
    password: L(t, 'password'),
    passwordConfirmation: t('Form.labels.passwordConfirmation'),
    phoneCode: t('Form.labels.phoneCode'),
    phone: t('Form.labels.phone'),
    image: t('Form.labels.image'),
    gender: t('Form.labels.gender'),
  }

  const base = z.object({
    role_id: requiredId(t, labels.role),
    full_name: requiredString(t, labels.fullName, 2),
    email: z.string().email(t('Validation.email')),
    phone_code: requiredString(t, labels.phoneCode, 1, 3),
    phone: digitsOnlyString(
      t,
      labels.phone,
      currentPhoneLimit,
      currentPhoneLimit,
    ),
    image: stringOrUidHashObject(t), // keep as-is (file path / url)
    gender: requiredEnum(t, labels.gender, ['male', 'female'] as const),
  })

  return base
    .extend({
      password: requiredString(t, labels.password, 8),
      password_confirmation: requiredString(t, labels.passwordConfirmation, 8),
    })
    .refine(
      (v) => {
        const anyProvided = !!v.password || !!v.password_confirmation
        return (
          !anyProvided ||
          (v.password &&
            v.password_confirmation &&
            v.password === v.password_confirmation)
        )
      },
      {
        path: ['password_confirmation'],
        message: t('Validation.passwordsDoNotMatch'),
      },
    )
    .superRefine((v, ctx) => {
      if (typeof phoneStartingNumber !== 'number') return

      const requiredPrefix = String(phoneStartingNumber)
      const phone = String(v.phone ?? '')
      console.log('pre', requiredPrefix, phone)

      if (!phone.startsWith(requiredPrefix)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: t('Validation.phoneStartingNumber', {
            prefix: requiredPrefix,
          }),
        })
      }
    })
}
export const updateSupervisorSchema = (
  t: TFn,
  currentPhoneLimit: number,
  phoneStartingNumber?: number,
) => {
  const labels = {
    role: t('Form.labels.role'),
    fullName: t('Form.labels.fullName'),
    email: t('Form.labels.email'),
    password: L(t, 'password'),
    passwordConfirmation: t('Form.labels.passwordConfirmation'),
    phoneCode: t('Form.labels.phoneCode'),
    phone: t('Form.labels.phone'),
    image: t('Form.labels.image'),
    gender: t('Form.labels.gender'),
  }

  const base = z.object({
    role_id: requiredId(t, labels.role),
    full_name: requiredString(t, labels.fullName, 2),
    email: z.string().email(t('Validation.email')),
    phone_code: requiredString(t, labels.phoneCode, 1, 3),
    phone: digitsOnlyString(
      t,
      labels.phone,
      currentPhoneLimit,
      currentPhoneLimit,
    ),
    image: stringOrUidHashObject(t), // keep as-is (file path / url)
    gender: requiredEnum(t, labels.gender, ['male', 'female'] as const),
  })

  return base
    .extend({
      password: requiredString(t, labels.password, 8).optional(),
      password_confirmation: requiredString(
        t,
        labels.passwordConfirmation,
        8,
      ).optional(),
    })
    .refine(
      (v) => {
        const anyProvided = !!v.password || !!v.password_confirmation
        return (
          !anyProvided ||
          (v.password &&
            v.password_confirmation &&
            v.password === v.password_confirmation)
        )
      },
      {
        path: ['password_confirmation'],
        message: t('Validation.passwordsDoNotMatch'),
      },
    )
    .superRefine((v, ctx) => {
      // if (typeof phoneStartingNumber !== 'number') return

      const requiredPrefix = String(phoneStartingNumber)
      const phone = String(v.phone ?? '')

      if (!phone.startsWith(requiredPrefix)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: t('Validation.phoneStartingNumber', {
            prefix: requiredPrefix,
          }),
        })
      }
    })
}
export type SupervisorFormData = z.infer<
  ReturnType<typeof makeSupervisorSchema>
>

// -------------------- Role --------------------
export const makeRoleSchema = (t: TFn) => {
  const labels = {
    nameEn: t('Form.labels.nameEn'),
    nameAr: t('Form.labels.nameAr'),
  }
  return z.object({
    name_en: requiredString(t, labels.nameEn, 3, 20),
    name_ar: requiredString(t, labels.nameAr, 3, 20),
  })
}
export type RoleFormData = z.infer<ReturnType<typeof makeRoleSchema>>

// -------------------- Category --------------------
export const makeCategorySchema = (t: TFn) => {
  const labels = {
    image: L(t, 'image'),
    sortOrder: L(t, 'sortOrder'),
    parent: L(t, 'parentCategory'),
    nameEn: L(t, 'nameEn'),
    nameAr: L(t, 'nameAr'),
    descEn: L(t, 'descriptionEn'),
    descAr: L(t, 'descriptionAr'),
  }

  return z.object({
    image: stringOrUidHashObject(t),
    sort_order: digitsOnlyString(t, labels.sortOrder, 1, 4),
    parent_id: z.union([z.string().optional().nullable(), z.number().optional().nullable()]),

    name_en: requiredString(t, labels.nameEn, 3),
    name_ar: requiredString(t, labels.nameAr, 1),

    description_en: requiredString(t, labels.descEn, 6),
    description_ar: requiredString(t, labels.descAr, 6),
  })
}
export type CategoryFormData = z.infer<ReturnType<typeof makeCategorySchema>>

// -------------------- Show Room --------------------
export const makeShowRoomSchema = (
  t: TFn,
  currentPhoneLimit: number,
  phoneStartingNumber?: number,
) =>
  z
    .object({
      country_id: requiredId(t, t('Form.labels.country')),
      city_id: requiredId(t, t('Form.labels.city')),

      phone_code: requiredString(t, t('Form.labels.phoneCode'), 1, 3),
      phone: digitsOnlyString(
        t,
        t('Form.labels.phone'),
        currentPhoneLimit,
        currentPhoneLimit,
      ),

      email: z
        .string()
        .email(t('Validation.email'))
        .optional()
        .or(z.literal('')),
      url: z.string().url(t('Validation.url')).or(z.literal('')),

      map: z.object({
        lat: requiredNumber(t, t('Form.labels.lat'))/* .refine(
          (v) => v >= -90 && v <= 90,
          t('Validation.lat'),
        ) */,
        lng: requiredNumber(t, t('Form.labels.lng'))/* .refine(
          (v) => v >= -180 && v <= 180,
          t('Validation.lng'),
        ) */,
      }),

      name_en: requiredString(t, t('Form.labels.nameEn'), 1),
      name_ar: requiredString(t, t('Form.labels.nameAr'), 1),
      address_en: requiredString(t, t('Form.labels.addressEn'), 1),
      address_ar: requiredString(t, t('Form.labels.addressAr'), 1),

      image: stringOrUidHashObject(t),
    })
    .superRefine((v, ctx) => {
      // if (typeof phoneStartingNumber !== 'number') return

      const requiredPrefix = String(phoneStartingNumber)
      const phone = String(v.phone ?? '')

      if (!phone.startsWith(requiredPrefix)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'],
          message: t('Validation.phoneStartingNumber', {
            prefix: requiredPrefix,
          }),
        })
      }
    })
export type ShowRoomFormData = z.infer<ReturnType<typeof makeShowRoomSchema>>

// -------------------- Attribute --------------------
export const makeAttributeSchema = (t: TFn) => {
  const labels = {
    nameEn: L(t, 'nameEn'),
    nameAr: L(t, 'nameAr'),
  }
  return z.object({
    name_en: requiredString(t, labels.nameEn, 3),
    name_ar: requiredString(t, labels.nameAr, 3),
    is_active: z.boolean().default(false),
  })
}
export type AttributeFormData = z.infer<ReturnType<typeof makeAttributeSchema>>

// -------------------- Attribute values --------------------

export const makeValueSchema = (t: (k: string) => string) => {
  const labels = {
    nameEn: L(t, 'nameEn'),
    nameAr: L(t, 'nameAr'),
  }
  return z.object({
    name_en: requiredString(t, labels.nameEn, 3),
    name_ar: requiredString(t, labels.nameAr, 3),
    is_active: z.boolean().default(false),
    attribute_id: requiredId(t, t('Form.labels.attribute')),
  })
}

export type ValueFormData = z.infer<ReturnType<typeof makeValueSchema>>
// -------------------- Product --------------------
export const makeProductSchema = (t: TFn) => {
  const labels = {
    image: L(t, 'image'),
    category: L(t, 'category'),
    nameEn: L(t, 'nameEn'),
    nameAr: L(t, 'nameAr'),
    descEn: L(t, 'descriptionEn'),
    descAr: L(t, 'descriptionAr'),
    price: L(t, 'price'),
    discountType: L(t, 'discountType'),
    discountValue: L(t, 'discountValue'),
    stock: L(t, 'stock'),
    sku: L(t, 'sku'),
  }

  return z
    .object({
      image: stringOrUidHashObject(t),
      gallery: z.array(z.any()).nonempty({ message: t('Validations.') }),
      /* z.array(
        z.string() || z.object({ url: z.string(), uid: z.string() }),
      ) */
      category_id: z.union([
        z.string().optional(),
        z.number().optional(),
      ]),

      // Flat multilingual fields like your other forms
      name_en: requiredString(t, labels.nameEn, 3, 60),
      name_ar: requiredString(t, labels.nameAr, 1, 60),

      description_en: requiredString(t, labels.descEn, 5),
      description_ar: requiredString(t, labels.descAr, 5),

      price: z.coerce
        .number({ message: t('Validation.requiredSimple') })
        .positive({ message: t('Validation.positive') }),
      tags: z
        .array(z.string().min(1, t('Validation.requiredSimple')))
        .nullable(),

      // UI-only fields; you later map to discount[type] / discount[value]
      /*  discount_type: z
        .enum(['fixed', 'percentage'] as const, {
          invalid_type_error: msg.required(t, labels.discountType),
        })
        .optional()
        .or(z.literal('')),
      discount_value: z.coerce.number().min(0).optional().nullable(), */

      stock: z.coerce
        .number({ message: t('Validation.requiredSimple') })
        .int({ message: t('Validation.int') })
        .positive({ message: t('Validation.positive') }),
      sku: z.string().max(100).or(z.literal('')),
      barcode: z.string().max(100).or(z.literal('')),
      // is_active: z.boolean().default(false).optional(),
      // if you expose tags as a comma list, validate upstream; otherwise keep array:
      // tags: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      const MIN_VISIBLE_CHARS = 5

      const plainAr = extractPlainText(data.description_ar)
      const plainEn = extractPlainText(data.description_en)

      if (plainAr.length < MIN_VISIBLE_CHARS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['description_ar'],
          message: t('Validation.minChars', {
            field: t('Form.labels.descriptionAr'),
            min: MIN_VISIBLE_CHARS,
          }),
        })
      }

      if (plainEn.length < MIN_VISIBLE_CHARS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['description_en'],
          message: t('Validation.minChars', {
            field: t('Form.labels.descriptionEn'),
            min: MIN_VISIBLE_CHARS,
          }),
        })
      }
    })

  /*  if (
    (!data.discount_type && data.discount_value) ||
    (data.discount_type && !data.discount_value)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [
        (!data.discount_value && 'discount_value') ||
          ((!data.discount_type && 'discount_type') as any),
      ],
      message: t('Validation.requiredSimple'),
    })
  }
  if (
    data.discount_type === 'percentage' &&
    data.discount_value &&
    +data.discount_value >= 100
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discount_value'],
      message: t('Validation.percentageUnder100'),
    })
  }
  if (
    data.discount_type === 'fixed' &&
    data.discount_value &&
    +data.discount_value >= data.price
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discount_value'],
      message: t('Validation.priceGreaterThanDiscount'),
    })
  } */
  // })
}
export type ProductFormData = z.infer<ReturnType<typeof makeProductSchema>>

export const makeSliderSchema = (t: any) =>
  z
    .object({
      attachment: stringOrUidHashObject(t),
      is_active: z.boolean().optional(),
      discount_type: requiredString(t, t('Form.labels.discountType'), 1),
      discount_value: requiredNumber(t, t('Form.labels.discountValue'), 1),
      start_at: z.date(),
      end_at: z.date(),
      title_ar: requiredString(t, t('Form.labels.titleAr'), 3),
      title_en: requiredString(t, t('Form.labels.titleEn'), 3),
      products: z.array(z.string()).nonempty({
        message: t('Validation.required', { field: t('Form.labels.products') }),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.start_at && data.end_at && data.start_at >= data.end_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['start_at'],
          message: t('Validation.startBeforeEnd'),
        })
      }
      if (data.products.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['products'],
          message: t('Validation.requiredSimple'),
        })
      }

      if (data.discount_type === 'percentage' && +data.discount_value >= 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['discount_value'],
          message:
            t('Validation.percentageUnder100') ||
            'Percentage discount must be less than 100',
        })
      }
    })

export type SliderFormData = z.infer<ReturnType<typeof makeSliderSchema>>
export const makeEarningRuleSchema = (t: (k: string) => string) =>
  z
    .object({
      points_type: z.enum(['fixed', 'percentage'], {
        errorMap: () => ({ message: t('Validation.requiredSimple') }),
      }),
      points_value: z.coerce
        .number({ message: t('Validation.requiredSimple') })
        .positive({ message: t('Validation.positive') }),
      min_order_amount: z
        .union([
          z.coerce.number().positive().nullable(),
          z.literal('').transform(() => null),
        ])
        .optional(),
      event_key: z.string().max(191).or(z.literal('')).optional(),
      is_active: z.enum(['1', '0']).optional().nullable(),
      image: z.any().optional(),
      name: z.any(),
      description: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.points_type === 'percentage' &&
        data.points_value &&
        +data.points_value >= 100
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['points_value'],
          message: t('Validation.percentageUnder100'),
        })
      }
    })

export type EarningRuleFormData = z.infer<ReturnType<typeof makeEarningRuleSchema>>
// -------------------- Social Media --------------------
export const makeSocialMediaSchema = (t: TFn) => {
  return z.object({
    youtube: z.string().url({ message: t('Validation.url') }).or(z.literal('')),
    tiktok: z.string().url({ message: t('Validation.url') }).or(z.literal('')),
    linkedin: z.string().url({ message: t('Validation.url') }).or(z.literal('')),
    twitter: z.string().url({ message: t('Validation.url') }).or(z.literal('')),
    facebook: z.string().url({ message: t('Validation.url') }).or(z.literal('')),
    instagram: z.string().url({ message: t('Validation.url') }).or(z.literal('')),
  })
}
export type SocialMediaFormData = z.infer<ReturnType<typeof makeSocialMediaSchema>>
// -------------------- Settings --------------------
export const makeSettingsSchema = (t: TFn) => {
  return z.object({
    phone: requiredString(t, t('Form.labels.phone')),
    email: z.string().email(t('Validation.email')),
  })
}
export type SettingsFormData = z.infer<ReturnType<typeof makeSettingsSchema>>
