import { Filter } from '@/types/components/table'
import { Package } from '@/types/api/package'
import { FieldProp } from '@/types/components/form'
import { PickedAction } from '@/hooks/useStatusMutations'
import { requiredString, TFn, requiredNumber } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
    statusFilter,
    booleanControlColumn,
} from '@/util/crudFactory'
import { ColumnDef } from '@tanstack/react-table'
import { SARIcon } from '@/components/common/Icons'
import { PackageFormData } from '@/types/api/package'

export const packageColumns = (
    open: (type: PickedAction, row: Package) => void,
    t: TFn,
): ColumnDef<Package>[] => [
        textColumn<Package>('id', '#'),
        textColumn<Package>('name', 'table.columns.name'),
        textColumn<Package>('price', 'table.columns.price', {
            render: ({ row }) => <div className='flex items-center gap-2'>{row.original.price} <SARIcon className='text-primary' /></div>
        }),
        textColumn<Package>('duration_translated', 'table.columns.duration'),
        textColumn<Package>('type', 'table.columns.type', {
            render: ({ row }) => <div className='flex items-center gap-2'>{t(`common.${row.original.type}`)} </div>
        }),
        booleanControlColumn('is_active', 'table.columns.status', open as any),
        createActionColumn('/packages', open as any, 'packages', { hasDelete: true, hasEdit: true, hasShow: true, entityName: 'packages' }),
    ]

export const getPackageFilters = (t: TFn): Filter[] => [
    statusFilter(t),
]

export const fieldsBuilder = (t: TFn, watchType?: string): FieldProp<PackageFormData>[] => {
    const fields: FieldProp<PackageFormData>[] = [
        {
            type: 'multiLangField',
            name: 'name' as any,
            label: t('Form.labels.name'),
            placeholder: t('Form.placeholders.name'),
            inputProps: {
                type: 'input',
            } as any,
            span: 2
        },
        {
            type: 'number',
            name: 'price',
            label: t('Form.labels.price'),
            placeholder: t('Form.placeholders.price'),
        },
        {
            type: 'select',
            name: 'type',
            label: t('Form.labels.type'),
            inputProps: {
                placeholder: t('Form.placeholders.type'),
                options: [
                    { label: t('common.provider'), value: 'provider' },
                    { label: t('common.client'), value: 'client' },
                ]
            } as any
        },

    ]

    if (watchType === 'provider') {
        fields.push(
            {
                type: 'number',
                name: 'duration',
                label: t('Form.labels.duration'),
                placeholder: t('Form.placeholders.duration'),
            },
            {
                type: 'select',
                name: 'duration_type',
                label: t('Form.labels.durationType'),
                inputProps: {
                    placeholder: t('Form.placeholders.durationType'),
                    options: [
                        { label: t('common.day'), value: 'day' },
                        { label: t('common.month'), value: 'month' },
                        { label: t('common.year'), value: 'year' },
                    ]
                } as any
            }
        )
    }

    if (watchType === 'client') {
        fields.push({
            type: 'number',
            name: 'connection_count',
            label: t('Form.labels.connection_count'),
            placeholder: t('Form.placeholders.connection_count'),
        })
    }

    fields.push({
        name: 'is_active',
        label: t('Form.labels.active'),
        type: 'switch',
        span: 2
    })

    return fields
}

export const makePackageSchema = (t: TFn) => {
    return z.object({
        name_ar: requiredString(t, t('common.package')),
        name_en: requiredString(t, t('common.package')),
        name_fr: requiredString(t, t('common.package')),
        name_ur: requiredString(t, t('common.package')),
        name_tr: requiredString(t, t('common.package')),
        name_sw: requiredString(t, t('common.package')),
        name_bn: requiredString(t, t('common.package')),
        name_si: requiredString(t, t('common.package')),
        price: requiredNumber(t, t('Form.labels.price')),
        duration: z.string().optional(),
        duration_type: z.enum(['day', 'month', 'year']).optional(),
        connection_count: z.string().optional(),
        type: z.string().min(1, t('Validation.required', { field: t('Form.labels.type') })),
        is_active: z.any().optional(),
    }).superRefine((data, ctx) => {
        if (data.type === 'provider') {
            if (!data.duration) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.duration') }),
                    path: ['duration'],
                })
            }
            if (!data.duration_type) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.durationType') }),
                    path: ['duration_type'],
                })
            }
        }
        if (data.type === 'client') {
            if (!data.connection_count) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.connection_count') }),
                    path: ['connection_count'],
                })
            }
        }
    })
}