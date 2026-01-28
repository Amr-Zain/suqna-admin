import { Filter } from '@/types/components/table'
import { CountryDetails, CountryFormData } from '@/types/api/country'
import { FieldProp } from '@/types/components/form'
import { PickedAction } from '@/hooks/useStatusMutations'
import { requiredNumber, requiredString, stringOrUidHashObject, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
  createActionColumn,
  imageColumn,
  textColumn,
  imageField,
} from '@/util/crudFactory'
import { ColumnDef } from '@tanstack/react-table'

export const countryColumns = (
  open: (type: PickedAction | 'edit', row: CountryDetails) => void,
): ColumnDef<CountryDetails>[] => [
    imageColumn<CountryDetails>('flag', 'table.columns.flag'),
    textColumn<CountryDetails>('name', 'table.columns.countryName'),
    textColumn<CountryDetails>('nationality', 'table.columns.nationality'),
    textColumn<CountryDetails>('phone_code', 'table.columns.phoneCode', {
      render: ({ getValue }) => (
        <div className="text-muted-foreground">+{getValue()}</div>
      ),
    }),
    textColumn<CountryDetails>('phone_number_limit', 'table.columns.phoneLength'),
    textColumn<CountryDetails>('national_id_limit', 'table.columns.nationalIdLimit'),
    createActionColumn('/countries', open as any, 'countries', { isModalEdit: true, hasDelete: true, hasEdit: true, hasShow: false, entityName: 'countries' }),
  ]

export const getCountryFilters = (t: TFn): Filter[] => [
  // Empty as text filter is not supported implicitly and search bar handles name search
]

export const fieldsBuilder = (t: TFn, _watchValues?: any): FieldProp<CountryFormData>[] => [
  imageField(t, 'flag', 'countries', 'Form.labels.flag'),
  {
    type: 'text',
    name: 'phone_code',
    label: t('Form.labels.phoneCode'),
    placeholder: t('Form.placeholders.phoneCode'),
  },
  {
    type: 'number',
    name: 'phone_number_limit',
    label: t('Form.labels.phoneLength'),
    placeholder: t('Form.placeholders.phoneLength'),
  },
  {
    type: 'number',
    name: 'national_id_limit',
    label: t('Form.labels.nationalIdLimit'),
    placeholder: t('Form.placeholders.nationalIdLimit'),
  },
  {
    type: 'multiLangField',
    name: 'name' as any,
    label: t('Form.labels.name'),
    placeholder: t('Form.placeholders.name'),
    span: 2,
  },
  {
    type: 'multiLangField',
    name: 'nationality' as any,
    label: t('Form.labels.nationality'),
    placeholder: t('Form.placeholders.nationality'),
    span: 2,
  },
  {
    type: 'multiLangField',
    name: 'short_name' as any,
    label: t('Form.labels.shortName'),
    placeholder: t('Form.placeholders.shortName'),
    span: 2,
  },
]

export const makeCountrySchema = (t: TFn) => {
  const languages = ['ar', 'en', 'fr', 'ur', 'tr', 'sw', 'bn', 'si']
  const langSchema: any = {}

  languages.forEach((lang) => {
    langSchema[`name_${lang}`] = lang === 'ar' || lang === 'en'
      ? requiredString(t, t('Form.labels.name'))
      : z.string().optional()
    langSchema[`nationality_${lang}`] = lang === 'ar' || lang === 'en'
      ? requiredString(t, t('Form.labels.nationality'))
      : z.string().optional()
    langSchema[`short_name_${lang}`] = lang === 'ar' || lang === 'en'
      ? requiredString(t, t('Form.labels.shortName'))
      : z.string().optional()
  })

  return z.object({
    phone_code: requiredString(t, t('Form.labels.phoneCode')),
    phone_number_limit: requiredNumber(t, t('Form.labels.phoneLength')),
    national_id_limit: requiredNumber(t, t('Form.labels.nationalIdLimit')),
    flag: stringOrUidHashObject(t),
    ...langSchema,
  })
}
