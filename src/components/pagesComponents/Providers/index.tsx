import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { providerColumns, getProviderFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Provider } from '@/types/api/provider'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import ProviderForm from './Form'
import { Plus } from 'lucide-react'

type ProvidersApi = ApiResponse<Provider[]> | { data: Provider[] }

const Providers = ({ data }: { data: ProvidersApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/providers/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as Provider[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit' | 'ban'
        row?: Provider
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProvider, setEditingProvider] = useState<Provider | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'providers',
            getQueryKeys.getOne('providers', currentId),
            [getQueryKeys.getFiltered('providers', search as any)],
        )

    // Handle Ban mutation
    const { mutateAsync: ChangeBanMutate, isPending: banPending } =
        useStatusMutation(
            `${currentId}/ban`, // Endpoint suffix
            'active', // Action type (used for success/error messages)
            'providers', // Entity type
            getQueryKeys.getOne('providers', currentId),
            [getQueryKeys.getFiltered('providers', search as any)],
            undefined, // baseURL
            'post' // method
        )

    useEffect(() => {
        alert.setPending(deletePending || banPending)
    }, [deletePending, banPending])


    const openAction = (type: PickedAction | 'edit' | 'ban', row: Provider) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'edit') {
            setEditingProvider(row)
            setIsFormOpen(true)
            return
        }

        if (type === 'delete') {
            const handler = async () => {
                await ChangeDeleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'provider', t)

            alert.setModel({
                isOpen: true,
                variant: 'destructive',
                title,
                desc,
                pending: deletePending,
                handleConfirm: handler,
            })
            alert.setHandler(handler)
            return
        }

        if (type === 'ban') {
            const handler = async () => {
                await ChangeBanMutate({ _method: 'put' })
                alert.setIsOpen(false)
            }

            const isCurrentlyBanned = row.is_ban === 1
            const actionLabel = isCurrentlyBanned ? t('common.unban') : t('common.ban')

            alert.setModel({
                isOpen: true,
                variant: isCurrentlyBanned ? 'default' : 'destructive',
                title: t('modals.active.title', { entity: actionLabel }),
                desc: t('modals.active.desc', { entity: actionLabel }),
                pending: banPending,
                handleConfirm: handler,
            })
            alert.setHandler(handler)
            return
        }
    }

    const handleCreate = () => {
        setEditingProvider(undefined)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingProvider(undefined)
    }

    const customToolbar = (
        <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t('buttons.add')}
        </Button>
    )

    return (
        <>
            <DataTable
                data={rows}
                columns={providerColumns(openAction)}
                filters={getProviderFilters(t)}
                pagination={true}
                searchKey='keyword'
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

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProvider
                                ? t('actions.update', { entity: t('common.provider') })
                                : t('actions.create', { entity: t('common.provider') })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <ProviderForm
                            provider={editingProvider}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Providers
