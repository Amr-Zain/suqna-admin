import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { notificationColumns } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Notification } from '@/types/api/notification'
import { getModalTitle } from '@/util/helpers'
import { Button } from '@/components/ui/button'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { CheckCheck, Trash2 } from 'lucide-react'

type NotificationsApi = ApiResponse<Notification[]> | { data: Notification[] }

const Notifications = ({ data }: { data: NotificationsApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/notifications/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as Notification[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'read_all' | 'delete_all'
    } | null>(null)

    const currentId = selected?.id || ''

    // Single Delete
    const { mutateAsync: DeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'notifications',
            getQueryKeys.getOne('notifications', currentId),
            [getQueryKeys.getFiltered('notifications', search)],
        )

    // Single Read (using 'get' as per request "read not post")
    const { mutateAsync: ReadMutate, isPending: readPending } =
        useStatusMutation(
            currentId,
            'active',
            'notifications',
            getQueryKeys.getOne('notifications', currentId),
            [getQueryKeys.getFiltered('notifications', search)],
            undefined,
            'post'
        )

    // Read All
    const { mutateAsync: ReadAllMutate, isPending: readAllPending } = useMutate({
        mutationKey: ['notifications', 'read-all'],
        endpoint: 'notifications/read-all',
        method: 'post',
        onSuccess: () => {
            toast.success(t('notifications.all_read_success'))
        },
        mutationOptions: {
            meta: { invalidates: [getQueryKeys.getFiltered('notifications', search)] }
        }
    })

    // Delete All
    const { mutateAsync: DeleteAllMutate, isPending: deleteAllPending } = useMutate({
        mutationKey: ['notifications', 'delete-all'],
        endpoint: 'notifications',
        method: 'delete',
        onSuccess: () => {
            toast.success(t('notifications.all_deleted_success'))
        },
        mutationOptions: {
            meta: { invalidates: [getQueryKeys.getFiltered('notifications', search)] }
        }
    })

    useEffect(() => {
        alert.setPending(deletePending || readPending || readAllPending || deleteAllPending)
    }, [deletePending, readPending, readAllPending, deleteAllPending])

    const openAlert = (type: PickedAction | 'read_all' | 'delete_all', row?: Notification) => {
        setSelected({ id: row?.id || '', type })

        const handler = async () => {
            if (type === 'delete') {
                await DeleteMutate({})
            } else if (type === 'active') {
                await ReadMutate({})
            } else if (type === 'read_all') {
                await ReadAllMutate({})
            } else if (type === 'delete_all') {
                await DeleteAllMutate({})
            }
            alert.setIsOpen(false)
        }

        let title = ''
        let desc = ''

        if (type === 'read_all') {
            title = t('modals.read_all.title')
            desc = t('modals.read_all.desc')
        } else if (type === 'delete_all') {
            title = t('modals.delete_all.title')
            desc = t('modals.delete_all.desc')
        } else {
            const modalInfo = getModalTitle(type === 'active' ? 'read_note' : type, 'notifications.entity', t)
            title = modalInfo.title
            desc = modalInfo.desc
        }

        alert.setModel({
            isOpen: true,
            variant: (type === 'delete' || type === 'delete_all') ? 'destructive' : 'default',
            title,
            desc,
            pending: deletePending || readPending || readAllPending || deleteAllPending,
            handleConfirm: handler,
        })
        alert.setHandler(handler)
    }

    const customToolbar = (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => openAlert('read_all')}
                disabled={rows.length === 0}
            >
                <CheckCheck className="w-4 h-4 me-2" />
                {t('notifications.read_all')}
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => openAlert('delete_all')}
                disabled={rows.length === 0}
            >
                <Trash2 className="w-4 h-4 me-2" />
                {t('notifications.delete_all')}
            </Button>
        </div>
    )

    return (
        <DataTable
            data={rows}
            columns={notificationColumns(openAlert as any, t)}
            pagination={false}
            meta={(data as any).data?.meta}
            initialState={{
                pagination: {
                    pageIndex: ((data as any).data?.meta?.current_page || 1) - 1,
                    pageSize: (data as any).data?.meta?.per_page || 10,
                },
            }}
            toolbar={customToolbar}
            resizable
            enableUrlState
        />
    )
}

export default Notifications
