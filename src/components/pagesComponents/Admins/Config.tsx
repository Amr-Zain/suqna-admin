import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { Admin, AdminFormData } from '@/types/api/admin'
import { requiredString, TFn, emailSchema, requiredNumber } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
    booleanControlColumn,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'
import { ApiResponse } from '@/types/api/http'
import { imageColumn } from '@/components/features/sharedColumns'

export const adminColumns = (
    open: (type: PickedAction | 'edit' | 'active', row: Admin) => void,
): ColumnDef<Admin>[] => [
        textColumn<Admin>('id', '#'),
        imageColumn<Admin>('image', 'table.columns.image'),
        textColumn<Admin>('full_name', 'table.columns.name'),
        textColumn<Admin>('email', 'table.columns.email'),
        textColumn<Admin>('phone_complete_form', 'table.columns.phone'),
        booleanControlColumn<Admin>(
            'is_admin_active_user',
            'table.columns.status',
            open as any,
            'active'
        ),
        createActionColumn('/admins', open as any, 'admins', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: false,
            entityName: 'admins'
        }),
    ]



export const fieldsBuilder = (t: TFn, isEdit: boolean): FieldProp<AdminFormData>[] => {
    return [
        {
            type: 'imgUploader',
            name: 'image',
            label: t('Form.labels.image'),
            inputProps: {
                model: 'bannars'
            }
        },
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
            inputProps: {
                phoneNumberName: 'phone'
            }
        },
        {
            type: 'select',
            name: 'role_id',
            label: t('common.role'),
            inputProps: {
                endpoint: 'roles/role-names',
                placeholder: t('Form.placeholders.role'),
                select: (res: ApiResponse<any[]>) => res.data.map((r) => ({
                    label: r.name,
                    value: r.id
                } as any)) as any,
            }
        },
        {
            type: 'password',
            name: 'password',
            label: t('Form.labels.password'),
            placeholder: t('Form.placeholders.password'),
            inputProps: {
                // If edit, password might be optional
            }
        },
    ]
}

export const adminSchema = (t: TFn, isEdit: boolean) => {
    return z.object({
        full_name: requiredString(t, t('Form.labels.full_name')),
        email: emailSchema(t),
        phone: requiredString(t, t('Form.labels.phone')),
        phone_code: requiredString(t, t('Form.labels.phone_code')),
        role_id: requiredNumber(t, t('common.role')),
        password: isEdit
            ? z.string().optional()
            : z.string().min(8, t('Validation.password_min', { min: 8 })),
        image: z.any().optional(),
    })
}
