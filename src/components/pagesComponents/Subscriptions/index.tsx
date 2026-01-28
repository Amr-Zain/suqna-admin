import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/common/table/AppTable'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Subscription } from '@/types/api/subscription'
import { getSubscriptionColumns, getSubscriptionFilters } from './Config'
import { ApiResponse } from '@/types/api/http'
import { useSearch } from '@tanstack/react-router'

type SubscriptionsApi = ApiResponse<Subscription[]>

export default function Subscriptions({ data }: { data: SubscriptionsApi }) {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/subscriptions/' })

    const [selectedId, setSelectedId] = useState<string>('')

    const rows = (data.data || []) as Subscription[]

    const { mutateAsync: deleteMutate, isPending: deletePending } = useStatusMutation(
        selectedId,
        'delete',
        'subscriptions',
        ['subscriptions', 'delete', selectedId],
        [getQueryKeys.getFiltered('subscriptions', search as any)],
        undefined,
        'delete'
    )

    const handleDelete = (row: Subscription) => {
        const handler = async () => {
            await deleteMutate({})
            alert.setIsOpen(false)
        }

        setSelectedId(String(row.id))

        alert.setModel({
            isOpen: true,
            variant: 'destructive',
            title: t('modals.delete.title', { entity: t('common.subscription') || 'Subscription' }),
            desc: t('modals.delete.desc', { entity: t('common.subscription') || 'Subscription' }),
            pending: deletePending,
            handleConfirm: handler,
        })
        alert.setHandler(handler)
    }

    const openAlert = (type: 'delete', row: Subscription) => {
        if (type === 'delete') handleDelete(row)
    }

    return (
        <div className="space-y-4 shadow-sm pt-4">
            <div className="flex items-center justify-between px-4">
                <SmartBreadcrumbs entityKey="menu.subscriptions" />
            </div>

            <DataTable
                data={rows}
                searchKey='keyword'
                meta={data.meta}
                columns={getSubscriptionColumns(openAlert)}
                filters={getSubscriptionFilters(t)}
                enableUrlState
            />
        </div>
    )
}
