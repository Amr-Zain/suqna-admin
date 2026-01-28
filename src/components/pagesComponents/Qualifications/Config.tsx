import { Filter } from '@/types/components/table'
import { Qualification, QualificationFormData } from '@/types/api/qualification'
import { FieldProp } from '@/types/components/form'
import { PickedAction } from '@/hooks/useStatusMutations'
import { requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
} from '@/util/crudFactory'
import { ColumnDef } from '@tanstack/react-table'

export const qualificationColumns = (
    open: (type: PickedAction | 'edit', row: Qualification) => void,
): ColumnDef<Qualification>[] => [
        textColumn<Qualification>('id', '#'),
        textColumn<Qualification>('name', 'table.columns.name'),
        createActionColumn('/qualifications', open as any, 'qualifications', { isModalEdit: true, hasDelete: true, hasEdit: true, hasShow: false, entityName: 'qualifications' }),
    ]

export const getQualificationFilters = (t: TFn): Filter[] => []

export const fieldsBuilder = (t: TFn): FieldProp<QualificationFormData>[] => [
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
]

export const makeQualificationSchema = (t: TFn) => {
    return z.object({
        name_ar: requiredString(t, t('common.qualification')),
        name_en: requiredString(t, t('common.qualification')),
        name_fr: requiredString(t, t('common.qualification')),
        name_ur: requiredString(t, t('common.qualification')),
        name_tr: requiredString(t, t('common.qualification')),
        name_sw: requiredString(t, t('common.qualification')),
        name_bn: requiredString(t, t('common.qualification')),
        name_si: requiredString(t, t('common.qualification')),
    })
}
