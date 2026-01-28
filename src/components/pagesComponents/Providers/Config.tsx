import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { Provider, ProviderFormData } from '@/types/api/provider'
import { requiredString, TFn, emailSchema, requiredNumber } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
    booleanControlColumn,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'
import { ApiResponse } from '@/types/api/http'

export const providerColumns = (
    open: (type: PickedAction | 'edit' | 'ban', row: Provider) => void,
): ColumnDef<Provider>[] => [
        textColumn<Provider>('id', '#'),
        textColumn<Provider>('full_name', 'table.columns.name'),
        textColumn<Provider>('email', 'table.columns.email'),
        textColumn<Provider>('phone', 'table.columns.phone', {
            render: ({ row }) => (
                <div dir="ltr" className="rtl:text-right">
                    +{row.original.phone_code}{row.original.phone}
                </div>
            )
        }),
        textColumn<Provider>('user_type', 'table.columns.type', {
            render: ({ getValue }) => (
                <span className="capitalize">{getValue() as string}</span>
            )
        }),
        booleanControlColumn<Provider>(
            'is_ban',
            'table.columns.ban',
            open as any,
            'ban'
        ),
        createActionColumn('/providers', open as any, 'providers', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: false,
            entityName: 'providers'
        }),
    ]

export const getProviderFilters = (t: TFn): Filter[] => [

    {
        id: 'user_type',
        title: t('Form.labels.type'),
        type: 'select',
        options: [
            { label: t('common.worker'), value: 'worker' },
            { label: t('common.company'), value: 'company' },
        ]
    },
    {
        id: 'is_ban',
        title: t('table.columns.ban'),
        type: 'select',
        options: [
            { label: t('common.banned'), value: '1' },
            { label: t('common.active'), value: '0' },
        ]
    }
]

export const fieldsBuilder = (t: TFn, isEdit: boolean, watchType?: string, watchCountry?: string | number): FieldProp<ProviderFormData>[] => {
    const fields: FieldProp<ProviderFormData>[] = [
        {
            type: 'text',
            name: 'full_name',
            label: t('Form.labels.full_name'),
            placeholder: t('Form.placeholders.full_name'),
        },
        {
            type: 'email',
            name: 'email',
            label: t('Form.labels.email'),
            placeholder: t('Form.placeholders.email'),
        },
        {
            type: 'phone',
            name: 'phone' as any,
            label: t('Form.labels.phone'),
            placeholder: t('Form.placeholders.phone'),
            inputProps: {
                phoneNumberName: 'phone'
            }
        },
        {
            type: 'select',
            name: 'country_id',
            label: t('Form.labels.country'),
            inputProps: {
                endpoint: 'countries_without_pagination',
                placeholder: t('Form.placeholders.country'),
                select: (res: ApiResponse<any[]>) => res.data.map((country) => ({
                    label: country.name,
                    value: country.id
                } as any)) as any,
                general: false
            }
        },
        {
            type: 'select',
            name: 'city_id',
            label: t('Form.labels.city'),
            inputProps: {
                endpoint: watchCountry ? `countries/${watchCountry}/cities` : 'cities_without_pagination',
                placeholder: t('Form.placeholders.city'),
                select: (res: ApiResponse<any[]>) => res.data.map((city) => ({
                    label: city.name,
                    value: city.id
                } as any)) as any,
                general: false,
                disabled: !watchCountry
            }
        },
        {
            type: 'select',
            name: 'user_type',
            label: t('Form.labels.type'),
            inputProps: {
                options: [
                    { label: t('common.worker'), value: 'worker' },
                    { label: t('common.company'), value: 'company' },
                ],
                placeholder: t('Form.placeholders.type'),

            }
        },
        {
            type: 'password',
            name: 'password',
            label: t('Form.labels.password'),
            placeholder: t('Form.placeholders.password'),
            inputProps: {
                disabled: isEdit
            }
        },
    ]

    if (watchType === 'company') {
        fields.push(
            {
                type: 'number',
                name: 'workers_count_from',
                label: t('Form.labels.workers_count_from'),
                placeholder: t('Form.placeholders.workers_count_from'),
            },
            {
                type: 'number',
                name: 'workers_count_to',
                label: t('Form.labels.workers_count_to'),
                placeholder: t('Form.placeholders.workers_count_to'),
            },
            {
                type: 'text',
                name: 'commercial_number',
                label: t('Form.labels.commercial_number'),
                placeholder: t('Form.placeholders.commercial_number'),
            }
        )
    }

    if (watchType === 'worker') {
        fields.push(
            {
                type: 'number',
                name: 'experience_from',
                label: t('Form.labels.experience_from'),
                placeholder: t('Form.placeholders.experience_from'),
            },
            {
                type: 'number',
                name: 'experience_to',
                label: t('Form.labels.experience_to'),
                placeholder: t('Form.placeholders.experience_to'),
            },
            {
                type: 'select',
                name: 'qualification_id',
                label: t('Form.labels.qualification'),
                inputProps: {
                    endpoint: 'qualifications',
                    placeholder: t('Form.placeholders.qualification'),
                    select: (res: ApiResponse<any[]>) => res.data.map((q) => ({
                        label: q.name,
                        value: q.id
                    } as any)) as any,
                }
            },
            {
                type: 'select',
                name: 'departments' as any,
                label: t('Form.labels.departments'),
                inputProps: {
                    endpoint: 'departments',
                    placeholder: t('Form.placeholders.departments'),
                    multiple: true,
                    select: (res: ApiResponse<any[]>) => res.data.map((d) => ({
                        label: d.name,
                        value: d.id
                    } as any)) as any,
                }
            }
        )
    }

    return fields
}

export const makeProviderSchema = (t: TFn, isEdit: boolean) => {
    return z.object({
        full_name: requiredString(t, t('Form.labels.full_name')),
        email: emailSchema(t),
        phone: requiredString(t, t('Form.labels.phone')),
        phone_code: requiredString(t, t('Form.labels.phone_code')),
        country_id: requiredNumber(t, t('Form.labels.country')),
        city_id: requiredNumber(t, t('Form.labels.city')),
        user_type: z.enum(['worker', 'company'], {
            required_error: t('Validation.required', { field: t('Form.labels.type') })
        }),
        password: isEdit
            ? z.string().optional()
            : z.string().min(8, t('Validation.password_min', { min: 8 })),
        workers_count_from: z.string().optional(),
        workers_count_to: z.string().optional(),
        commercial_number: z.string().optional(),
        experience_from: z.string().optional(),
        experience_to: z.string().optional(),
        qualification_id: z.any().optional(),
        departments: z.array(z.any()).optional(),
    }).superRefine((data, ctx) => {
        if (data.user_type === 'company') {
            if (!data.workers_count_from) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.workers_count_from') }),
                    path: ['workers_count_from'],
                })
            }
            if (!data.workers_count_to) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.workers_count_to') }),
                    path: ['workers_count_to'],
                })
            }
            if (+data.workers_count_to! < +data.workers_count_from!) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.greater_than', { field: t('Form.labels.workers_count_to'), value: data.workers_count_from }),
                    path: ['workers_count_to'],
                })
            }
            if (!data.commercial_number) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.commercial_number') }),
                    path: ['commercial_number'],
                })
            }
        }
        if (data.user_type === 'worker') {
            if (!data.experience_from) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.experience_from') }),
                    path: ['experience_from'],
                })
            }
            if (!data.experience_to) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.experience_to') }),
                    path: ['experience_to'],
                })
            }
            if (!data.qualification_id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.qualification') }),
                    path: ['qualification_id'],
                })
            }
            if (+data.experience_to! < +data.experience_from!) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.greater_than', { field: t('Form.labels.experience_to'), value: data.experience_from }),
                    path: ['experience_to'],
                })
            }
            if (!data.departments || data.departments.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('Validation.required', { field: t('Form.labels.departments') }),
                    path: ['departments'],
                })
            }
        }
    })
}
