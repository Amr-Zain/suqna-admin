import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { adminColumns } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Admin } from '@/types/api/admin'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import AdminForm from './Form'
import { Plus } from 'lucide-react'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'

type AdminsApi = ApiResponse<Admin[]>

const Admins = ({ data }: { data: AdminsApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/admins/' })

    const rows = (data.data || []) as Admin[]
    console.log(rows)
    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit' | 'active'
        row?: Admin
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingAdmin, setEditingAdmin] = useState<Admin | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'admins',
            getQueryKeys.getOne('admins', currentId),
            [getQueryKeys.getFiltered('admins', search as any)],
        )

    // Handle Active/Toggle mutation
    const { mutateAsync: ChangeStatusMutate, isPending: statusPending } =
        useStatusMutation(
            `${currentId}/toggle-active-user`,
            'active',
            'admins',
            getQueryKeys.getOne('admins', currentId),
            [getQueryKeys.getFiltered('admins', search as any)],
            undefined,
            'post'
        )

    const openAlert = (type: PickedAction | 'edit' | 'active', row: Admin) => {
        if (type === 'edit') {
            setEditingAdmin(row)
            setIsFormOpen(true)
            return
        }

        const handler = async () => {
            if (type === 'delete') {
                await ChangeDeleteMutate({})
            } else if (type === 'active') {
                await ChangeStatusMutate({})
            }
            alert.setIsOpen(false)
        }

        setSelected({ id: String(row?.id), type, row })

        const { title, desc } = getModalTitle(type as PickedAction, 'admin', t)

        alert.setModel({
            isOpen: true,
            variant: type === 'delete' ? 'destructive' : 'default',
            title,
            desc,
            pending: deletePending || statusPending,
            handleConfirm: handler,
        })
        alert.setHandler(handler)
    }

    return (
        <div className="space-y-4 shadow-sm pt-4">
            <div className="flex items-center justify-between px-4">
                <SmartBreadcrumbs entityKey="menu.admins" />
                <Button onClick={() => {
                    setEditingAdmin(undefined)
                    setIsFormOpen(true)
                }} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('actions.add', { entity: t('common.admin') })}
                </Button>
            </div>

            <DataTable
                data={rows}
                meta={data.meta}
                columns={adminColumns(openAlert)}
                enableUrlState
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAdmin
                                ? t('actions.edit', { entity: t('common.admin') })
                                : t('actions.add', { entity: t('common.admin') })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <AdminForm
                            admin={editingAdmin}
                            onSuccess={() => setIsFormOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Admins
