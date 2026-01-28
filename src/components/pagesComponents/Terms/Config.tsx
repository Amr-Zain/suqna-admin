import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { TermDetails, TermFormData } from '@/types/api/terms'
import { requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'

export const termColumns = (
    open: (type: PickedAction | 'edit', row: TermDetails) => void,
): ColumnDef<TermDetails>[] => [
        textColumn<TermDetails>('id', 'table.columns.id'),
        textColumn<TermDetails>('title', 'table.columns.title'),
        textColumn<TermDetails>('text', 'table.columns.text', {
            render: ({ getValue }) => (
                <div className="max-w-[300px] truncate" title={getValue() as string}>
                    {getValue() as string}
                </div>
            )
        }),
        createActionColumn('/terms', open as any, 'terms', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: false
        }),
    ]



export const fieldsBuilder = (t: TFn): FieldProp<TermFormData>[] => [
    {
        type: 'multiLangField',
        name: 'title' as any,
        label: t('Form.labels.title'),
        placeholder: t('Form.placeholders.title'),
        span: 2,
    },
    {
        type: 'multiLangField',
        name: 'text' as any,
        label: t('Form.labels.text'),
        placeholder: t('Form.placeholders.text'),
        inputProps: {
            inputType: 'textarea',
        },
        span: 2,
    },
]

export const makeTermSchema = (t: TFn) => {
    const languages = ['ar', 'en', 'fr', 'ur', 'tr', 'sw', 'bn', 'si']
    const langSchema: any = {}

    languages.forEach((lang) => {
        langSchema[`title_${lang}`] = lang === 'ar' || lang === 'en'
            ? requiredString(t, t('Form.labels.title'))
            : z.string().optional()
        langSchema[`text_${lang}`] = lang === 'ar' || lang === 'en'
            ? requiredString(t, t('Form.labels.text'))
            : z.string().optional()
    })

    return z.object({
        ...langSchema,
    })
}
