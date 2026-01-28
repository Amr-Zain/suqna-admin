import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { Permission } from '@/types/api/role'
import { requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'

export const permissionColumns = (
    open: (type: PickedAction | 'edit', row: Permission) => void,
): ColumnDef<Permission>[] => [
        textColumn<Permission>('id', '#'),
        textColumn<Permission>('title', 'table.columns.name'),
        textColumn<Permission>('back_route_name', 'table.columns.back_route'),
        textColumn<Permission>('front_route_name', 'table.columns.front_route'),
        createActionColumn('/permissions', open as any, 'permissions', {
            isModalEdit: true,
            hasDelete: false, // Postman doesn't show a delete endpoint for permissions
            hasEdit: true,
            hasShow: false
        }),
    ]

export const getPermissionFilters = (t: TFn): Filter[] => [
    {
        id: 'title',
        title: t('Form.labels.title'),
        type: 'text',
    },
]

export const fieldsBuilder = (t: TFn): FieldProp<any>[] => {
    return [
        {
            type: 'text',
            name: 'front_route_name',
            label: t('Form.labels.front_route'),
            placeholder: t('Form.placeholders.front_route'),
        },
        {
            type: 'text',
            name: 'en[title]',
            label: t('Form.labels.titleEn'),
            placeholder: t('Form.placeholders.titleEn'),
        },
        {
            type: 'text',
            name: 'ar[title]',
            label: t('Form.labels.titleAr'),
            placeholder: t('Form.placeholders.titleAr'),
        },
        {
            type: 'imgUploader',
            name: 'icon',
            label: t('Form.labels.icon'),
        },
    ]
}

export const permissionSchema = (t: TFn) => {
    return z.object({
        front_route_name: requiredString(t, t('Form.labels.front_route')),
        'en[title]': requiredString(t, t('Form.labels.titleEn')),
        'ar[title]': requiredString(t, t('Form.labels.titleAr')),
        icon: z.any().optional(),
    })
}
