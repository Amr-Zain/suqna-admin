import { Filter } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { FieldProp } from '@/types/components/form'
import { FAQDetails, FAQFormData } from '@/types/api/faq'
import { requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
} from '@/util/crudFactory'
import { PickedAction } from '@/hooks/useStatusMutations'

export const faqColumns = (
    open: (type: PickedAction | 'edit', row: FAQDetails) => void,
): ColumnDef<FAQDetails>[] => [
        textColumn<FAQDetails>('id', 'table.columns.id'),
        textColumn<FAQDetails>('question', 'table.columns.question'),
        textColumn<FAQDetails>('answer', 'table.columns.answer', {
            render: ({ getValue }) => (
                <div className="max-w-[300px] truncate" title={getValue() as string}>
                    {getValue() as string}
                </div>
            )
        }),
        createActionColumn('/faqs', open as any, 'faqs', {
            isModalEdit: true,
            hasDelete: true,
            hasEdit: true,
            hasShow: false,
            entityName: 'questions'
        }),
    ]

export const getFAQFilters = (t: TFn): Filter[] => [
    {
        id: 'question',
        title: t('Form.labels.question'),
        type: 'text',
    } as any,
]

export const fieldsBuilder = (t: TFn): FieldProp<FAQFormData>[] => [
    {
        type: 'multiLangField',
        name: 'question' as any,
        label: t('Form.labels.question'),
        placeholder: t('Form.placeholders.question'),
        span: 2,
    },
    {
        type: 'multiLangField',
        name: 'answer' as any,
        label: t('Form.labels.answer'),
        placeholder: t('Form.placeholders.answer'),
        inputProps: {
            inputType: 'textarea',
        },
        span: 2,
    },
]

export const makeFAQSchema = (t: TFn) => {
    const languages = ['ar', 'en', 'fr', 'ur', 'tr', 'sw', 'bn', 'si']
    const langSchema: any = {}

    languages.forEach((lang) => {
        langSchema[`question_${lang}`] = lang === 'ar' || lang === 'en'
            ? requiredString(t, t('Form.labels.question'))
            : z.string().optional()
        langSchema[`answer_${lang}`] = lang === 'ar' || lang === 'en'
            ? requiredString(t, t('Form.labels.answer'))
            : z.string().optional()
    })

    return z.object({
        ...langSchema,
    })
}
