import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { Client, ClientFormData } from '@/types/api/client'
import { requiredString, TFn, emailSchema, requiredNumber } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
    booleanControlColumn,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'
import { ApiResponse } from '@/types/api/http'

export const clientColumns = (
    open: (type: PickedAction | 'edit' | 'ban', row: Client) => void,
): ColumnDef<Client>[] => [
        textColumn<Client>('id', '#'),
        textColumn<Client>('full_name', 'table.columns.name'),
        textColumn<Client>('email', 'table.columns.email'),
        textColumn<Client>('phone', 'table.columns.phone', {
            render: ({ row }) => (
                <div dir="ltr" className="rtl:text-right">
                    +{row.original.phone_code}{row.original.phone}
                </div>
            )
        }),
        booleanControlColumn<Client>(
            'is_ban',
            'table.columns.ban',
            open as any,
            'ban'
        ),
        createActionColumn<Client>('/clients', open as any, 'clients', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: true,
            entityName: 'clients'
        }),
    ]

export const getClientFilters = (t: TFn): Filter[] => [
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

export const fieldsBuilder = (t: TFn, isEdit: boolean): FieldProp<ClientFormData>[] => {
    return [
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
            type: 'password',
            name: 'password',
            label: t('Form.labels.password'),
            placeholder: t('Form.placeholders.password'),
            inputProps: {
                disabled: isEdit
            }
        },
    ]
}

export const makeClientSchema = (t: TFn, isEdit: boolean) => {
    return z.object({
        full_name: requiredString(t, t('Form.labels.full_name')),
        email: emailSchema(t),
        phone: requiredString(t, t('Form.labels.phone')),
        phone_code: requiredString(t, t('Form.labels.phone_code')),
        country_id: requiredNumber(t, t('Form.labels.country')),
        password: isEdit
            ? z.string().optional()
            : z.string().min(8, t('Validation.password_min', { min: 8 })),
    })
}
