import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { CityDetails, CityFormData } from '@/types/api/city'
import { requiredId, requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
    selectField,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'

export const cityColumns = (
    openAlert: (type: PickedAction | 'edit', row: CityDetails) => void,
): ColumnDef<CityDetails>[] => [
        textColumn<CityDetails>('id', 'table.columns.id'),
        textColumn<CityDetails>('name', 'table.columns.name'),
        textColumn<CityDetails>('country' as any, 'table.columns.countryName', {
            render: ({ row }) => (
                <div className="font-medium text-foreground">
                    {row.original.country?.name || '-'}
                </div>
            )
        }),
        createActionColumn('/cities', openAlert as any, 'cities', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: false,
            entityName: 'cities'
        }),
    ]

export const getCityFilters = (t: TFn): Filter[] => [
    {
        id: 'name',
        title: t('Form.labels.name'),
        type: 'text',
    } as any,
]

export const fieldsBuilder = (t: TFn): FieldProp<CityFormData>[] => [
    selectField(
        t,
        'country_id',
        'Form.labels.country',
        'Form.placeholders.country',
        'countries_without_pagination',
        (res: any) => res.data.map((item: any) => ({
            label: item.name,
            value: item.id
        })),
        false,
        ['countries_without_pagination']
    ),
    {
        type: 'multiLangField',
        name: 'name' as any,
        label: t('Form.labels.name'),
        placeholder: t('Form.placeholders.name'),
        span: 2,
    },
]

export const makeCitySchema = (t: TFn) => {
    const languages = ['ar', 'en', 'fr', 'ur', 'tr', 'sw', 'bn', 'si']
    const langSchema: any = {}

    languages.forEach((lang) => {
        langSchema[`name_${lang}`] = lang === 'ar' || lang === 'en'
            ? requiredString(t, t('Form.labels.name'))
            : z.string().optional()
    })

    return z.object({
        country_id: requiredId(t, t('Form.labels.country')),
        ...langSchema,
    })
}
