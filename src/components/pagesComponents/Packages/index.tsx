import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { Link, useSearch } from '@tanstack/react-router'
import { packageColumns, getPackageFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Package } from '@/types/api/package'
import { getModalTitle } from '@/util/helpers'

type PackagesApi = ApiResponse<Package[]> | { data: Package[] }

const Packages = ({ data }: { data: PackagesApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/packages/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as Package[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction
        row?: Package
    } | null>(null)

    const currentId = selected?.id || ''
    // Use row.id for delete
    const deleteId = selected?.type === 'delete' ? currentId : ''
    // Use id/toggle for active
    const activeId = selected?.type === 'active' ? `${currentId}/toggle` : ''

    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            deleteId,
            'delete',
            'packages',
            getQueryKeys.getOne('packages', deleteId),
            [getQueryKeys.getFiltered('packages', search)],
        )

    const { mutateAsync: ChangeStatusMutate, isPending: statusPending } =
        useStatusMutation(
            activeId,
            'active',
            'packages', // results in packages/{id}/toggle
            getQueryKeys.getOne('packages', currentId),
            [getQueryKeys.getFiltered('packages', search)],
            undefined,
            'post'
        )


    useEffect(() => {
        alert.setPending(deletePending || statusPending)
    }, [deletePending, statusPending])

    const openAlert = (type: PickedAction, row: Package) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'active') {
            const handler = async () => {
                await ChangeStatusMutate({ _method: 'put' })
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'package', t)
            alert.setModel({
                isOpen: true,
                variant: 'default',
                title,
                desc,
                pending: statusPending,
                handleConfirm: handler,
            })
            alert.setHandler(handler)
            return
        }

        if (type === 'delete') {
            const handler = async () => {
                await ChangeDeleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'package', t)

            alert.setModel({
                isOpen: true,
                variant: 'destructive',
                title,
                desc,
                pending: deletePending,
                handleConfirm: handler,
            })
            alert.setHandler(handler)
        }
    }

    const customToolbar = (
        <Link to="/packages/$id" params={{ id: 'add' }}>
            <Button size="sm">{t('buttons.add')}</Button>
        </Link>
    )

    return (
        <DataTable
            data={rows}
            columns={packageColumns(openAlert, t)}
            filters={getPackageFilters(t)}
            searchKey="keyword"
            pagination={true}

            meta={(data as any).meta}
            initialState={{
                pagination: {
                    pageIndex: ((data as any).meta?.current_page || 1) - 1,
                    pageSize: (data as any).meta?.per_page || 10,
                },
            }}
            toolbar={customToolbar}
            resizable
            enableUrlState
        />
    )
}

export default Packages
