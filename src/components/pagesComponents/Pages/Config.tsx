import { Filter } from '@/types/components/table'
import { StaticPage, StaticPageFormData } from '@/types/api/staticPage'
import { FieldProp } from '@/types/components/form'
import { PickedAction } from '@/hooks/useStatusMutations'
import { requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
    createdAtColumn
} from '@/util/crudFactory'
import { ColumnDef } from '@tanstack/react-table'
import { ActionIcon } from '@/components/common/table/ActionIcon'
import { Edit, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const staticPageColumns = (
    open: (type: PickedAction, row: StaticPage) => void,
    t: TFn,
): ColumnDef<StaticPage>[] => [
        textColumn<StaticPage>('type', 'table.columns.type', {
            render: ({ row }) => <span className="uppercase">{t(`staticPage.types.${row.original.type}`)}</span>
        }),
        textColumn<StaticPage>('title', 'table.columns.title', {
            render: ({ row }) => (
                <span>{row.original.translations?.ar?.title || row.original.translations?.en?.title || '-'}</span>
            )
        }),
        createdAtColumn<StaticPage>(),
        {
            id: 'actions',
            header: () => {
                const { t } = useTranslation() // Hook inside component
                return <span className="text-foreground font-bold">{t('actions.entity')}</span>
            },
            cell: ({ row }) => {
                const { t } = useTranslation() // Hook inside component
                const type = row.original.type
                return (
                    <div className="flex items-center gap-1">
                        <ActionIcon
                            icon={Edit}
                            label="actions.edit"
                            to={`/pages/$type` as any}
                            params={{ type }}
                        />
                        <ActionIcon
                            icon={Eye}
                            label="actions.show"
                            to={`/pages/show/$type` as any}
                            params={{ type }}
                        />
                    </div>
                )
            }
        }
    ]

export const getStaticPageFilters = (t: TFn): Filter[] => [
    // {
    //     id: 'sort[created_at]',
    //     title: t('sort.title'),
    //     options: [
    //         { label: t('sort.asc'), value: 'asc' },
    //         { label: t('sort.desc'), value: 'desc' },
    //     ],
    //     multiple: false,
    // },
]

export const fieldsBuilder = (t: TFn): FieldProp<StaticPageFormData>[] => [
    {
        type: 'text',
        name: 'title_ar',
        label: t('Form.labels.titleAr'),
        placeholder: t('Form.placeholders.titleAr'),
    },
    {
        type: 'text',
        name: 'title_en',
        label: t('Form.labels.titleEn'),
        placeholder: t('Form.placeholders.titleEn'),
    },
    {
        type: 'editor',
        name: 'content_ar',
        label: t('Form.labels.contentAr'),
        inputProps: {
            placeholder: t('Form.placeholders.contentAr')
        }
    },
    {
        type: 'editor',
        name: 'content_en',
        label: t('Form.labels.contentEn'),
        inputProps: {
            placeholder: t('Form.placeholders.contentEn')
        }
    },
]


export const makeStaticPageSchema = (t: TFn) => {
    return z.object({
        title_ar: requiredString(t, t('Form.labels.titleAr')),
        title_en: requiredString(t, t('Form.labels.titleEn')),
        content_ar: requiredString(t, t('Form.labels.contentAr')),
        content_en: requiredString(t, t('Form.labels.contentEn')),
    })
}
