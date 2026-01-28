import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { Role, RoleFormData } from '@/types/api/role'
import { requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'

export const roleColumns = (
    open: (type: PickedAction | 'edit' | 'permissions', row: Role) => void,
): ColumnDef<Role>[] => [
        textColumn<Role>('id', '#'),
        textColumn<Role>('name', 'table.columns.name'),
        createActionColumn('/roles', open as any, 'roles', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: false,
            // Permissions action enabled
            hasPermissions: true
        }),
    ]

export const getRoleFilters = (t: TFn): Filter[] => [
    {
        id: 'name',
        title: t('Form.labels.name'),
        type: 'text',
    },
]

export const fieldsBuilder = (t: TFn): FieldProp<RoleFormData>[] => {
    return [
        {
            type: 'text',
            name: 'name_en',
            label: t('Form.labels.nameEn'),
            placeholder: t('Form.placeholders.nameEn'),
        },
        {
            type: 'text',
            name: 'name_ar',
            label: t('Form.labels.nameAr'),
            placeholder: t('Form.placeholders.nameAr'),
        },
    ]
}

export const makeRoleSchema = (t: TFn) => {
    return z.object({
        name_en: requiredString(t, t('Form.labels.nameEn')),
        name_ar: requiredString(t, t('Form.labels.nameAr')),
        permissions: z.array(z.number()).optional(),
    })
}
