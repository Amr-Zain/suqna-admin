import { ColumnDef } from '@tanstack/react-table'
import { Subscription } from '@/types/api/subscription'
import { Filter } from '@/types/components/table'
import { TFn } from '@/lib/schema/validation'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { ActionIcon } from '@/components/common/table/ActionIcon'
import { Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SARIcon } from '@/components/common/Icons'

export const getSubscriptionColumns = (
    openAlert: (type: 'delete', row: Subscription) => void
): ColumnDef<Subscription>[] => {
    return [
        {
            accessorKey: 'id',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('table.columns.id')}</span>
            },
        },
        {
            accessorKey: 'user.name',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('table.columns.user')}</span>
            },
            cell: ({ row }) => {
                const user = row.original.user
                const isClient = row.original.package.type === 'client'
                const to = isClient ? '/clients/show/$id' : '/providers/show/$id'
                return (
                    <Link
                        to={to as any}
                        params={{ id: String(user.id) } as any}
                        className="text-primary hover:underline font-medium"
                    >
                        {user.name}
                    </Link>
                )
            },
        },
        {
            accessorKey: 'package.name',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('table.columns.package')}</span>
            },
            cell: ({ row }) => (
                <Link
                    to="/packages/show/$id"
                    params={{ id: String(row.original.package.id) } as any}
                    className="text-primary hover:underline font-medium"
                >
                    {row.original.package.name}
                </Link>
            ),
        },
        {
            accessorKey: 'package.price',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('table.columns.price')}</span>
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {row.original.package.price}
                    <span className="text-[10px] text-muted-foreground"><SARIcon /></span>
                </div>
            ),
        },
        {
            accessorKey: 'start_date',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('common.start_date')}</span>
            },
            cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
        },
        {
            accessorKey: 'end_date',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('common.end_date')}</span>
            },
            cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString(),
        },
        {
            accessorKey: 'remaining_duration',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('common.duration')}</span>
            },
        },
        {
            accessorKey: 'is_canceled',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('table.columns.status')}</span>
            },
            cell: ({ row }) => {
                const { t } = useTranslation()
                return (
                    <Badge variant={row.original.is_canceled ? 'destructive' : 'outline'} className={!row.original.is_canceled ? "text-green-600 bg-green-50 border-green-200" : ""}>
                        {row.original.is_canceled ? t('common.canceled') : t('common.active')}
                    </Badge>
                )
            },
        },
        {
            id: 'actions',
            header: () => {
                const { t } = useTranslation()
                return <span className="font-bold">{t('actions.entity')}</span>
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <ActionIcon
                        icon={Trash}
                        label="actions.delete"
                        variant="destructive"
                        onClick={() => openAlert('delete', row.original)}
                    />
                </div>
            ),
        },
    ]
}

export const getSubscriptionFilters = (t: TFn): Filter[] => [

    {
        id: 'user_name',
        title: t('Form.labels.user_name'),
        type: 'text',
    },
    {
        id: 'type',
        title: t('table.columns.type'),
        type: 'select',
        options: [
            { label: t('common.provider'), value: 'provider' },
            { label: t('common.client'), value: 'client' },
        ],
    },
    {
        id: 'is_active',
        title: t('common.active'),
        type: 'select',
        options: [
            { label: t('common.yes'), value: '1' },
            { label: t('common.no'), value: '0' },
        ],
    },
]
