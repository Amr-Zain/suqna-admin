import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { permissionColumns, getPermissionFilters } from './Config'
import { PickedAction } from '@/hooks/useStatusMutations'
import { useState } from 'react'
import { Permission } from '@/types/api/role'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import PermissionForm from './Form'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'

type PermissionsApi = ApiResponse<Permission[]>

const Permissions = ({ data }: { data: PermissionsApi }) => {
    const { t } = useTranslation()
    const search = useSearch({ from: '/_main/permissions/' })

    const rows = (data.data || []) as Permission[]

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingPermission, setEditingPermission] = useState<Permission | undefined>(undefined)

    const openAlert = (type: PickedAction | 'edit', row: Permission) => {
        if (type === 'edit') {
            setEditingPermission(row)
            setIsFormOpen(true)
            return
        }
        // No delete or other actions for permissions based on requirements
    }

    return (
        <div className="space-y-4 shadow-sm pt-4">
            <div className="flex items-center justify-between px-4">
                <SmartBreadcrumbs entityKey="menu.permissions" />
            </div>

            <DataTable
                data={rows}
                meta={data.meta}
                columns={permissionColumns(openAlert)}
                filters={getPermissionFilters(t)}
                enableUrlState
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPermission
                                ? t('actions.edit', { entity: t('menu.permissions') })
                                : t('actions.add', { entity: t('menu.permissions') })}
                        </DialogTitle>
                    </DialogHeader>
                    <PermissionForm
                        permission={editingPermission}
                        onSuccess={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Permissions
