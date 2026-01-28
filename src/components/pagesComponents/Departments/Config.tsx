
import { Department } from '@/types/api/department'
import { Filter } from '@/types/components/table'
import { FieldProp } from '@/types/components/form'
import { PickedAction } from '@/hooks/useStatusMutations'
import { TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    imageColumn,
    textColumn,
    imageField,
    booleanControlColumn,
    statusFilter,
} from '@/util/crudFactory'
import { ColumnDef } from '@tanstack/react-table'

export const departmentColumns = (
    open: (type: PickedAction | 'edit', row: Department) => void,
    t: TFn,
): ColumnDef<Department>[] => [
        textColumn<Department>('id', '#'),
        imageColumn<Department>('image', 'table.columns.image'),
        textColumn<Department>('name', 'table.columns.name'),
        booleanControlColumn('is_active', 'table.columns.status', open),
        createActionColumn('/departments', open, 'departments', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: false,
            entityName: 'departments'
        }),
    ]

export const getDepartmentFilters = (t: TFn): Filter[] => [
    statusFilter(t)
]

export const fieldsBuilder = (t: TFn): FieldProp<DepartmentFormData>[] => [
    {
        type: 'multiLangField',
        name: 'name' as any,
        label: t('Form.labels.name'),
        placeholder: t('Form.placeholders.name'),
        inputProps: {
            type: 'input',
        } as any
    },
    imageField(t, 'image', 'departments'),
]
export const makeDepartmentSchema = (t: TFn) => {
    return z.object({
        name_ar: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        name_en: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        name_fr: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        name_ur: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        name_tr: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        name_sw: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        name_bn: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        name_si: z.string().min(1, t('Validation.required', { field: t('common.department') })),
        image: z.any().optional(), // Handle File or string
    })
}

export type DepartmentFormData = z.infer<ReturnType<typeof makeDepartmentSchema>>
