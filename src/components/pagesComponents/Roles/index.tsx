import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { roleColumns, getRoleFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Role } from '@/types/api/role'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import RoleForm from './Form'
import { Plus } from 'lucide-react'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import useFetch from '@/hooks/UseFetch'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type RolesApi = ApiResponse<Role[]>

const RolePermissionsDialog = ({ role, open, onOpenChange }: { role?: Role, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const { t } = useTranslation()
    const { data: roleDetails, isLoading } = useFetch<ApiResponse<Role>>({
        endpoint: `roles/${role?.id}`,
        queryKey: ['role', role?.id],
        enabled: open && !!role?.id
    })

    const permissions = roleDetails?.data?.permissions || roleDetails?.data?.permission || []

    // Group permissions by category (back_route_name usually)
    const categorizedPermissions = permissions.reduce((acc, perm) => {
        const cat = perm.back_route_name ? perm.back_route_name.split('.')[0] : 'General'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(perm)
        return acc
    }, {} as Record<string, typeof permissions>)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('Form.labels.permissions')} - {role?.name}</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="py-8 text-center">{t('Text.loading')}</div>
                ) : (
                    <div className="grid gap-4">
                        {Object.entries(categorizedPermissions).map(([category, perms]) => (
                            <Card key={category} className="shadow-sm">
                                <CardHeader className="py-2 bg-muted/20">
                                    <CardTitle className="text-sm font-medium uppercase">{t(`permission_categories.${category}`, { defaultValue: category })}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {perms.map(p => (
                                        <div key={p.id} className="flex items-center gap-2">
                                            <Checkbox checked disabled />
                                            <Label className="text-xs text-muted-foreground">{p.title}</Label>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                        {permissions.length === 0 && (
                            <div className="text-center text-muted-foreground py-4">{t('Text.no_results')}</div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

const Roles = ({ data }: { data: RolesApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/roles/' })

    const rows = (data.data || []) as Role[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit' | 'permissions'
        row?: Role
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'roles',
            getQueryKeys.getOne('roles', currentId),
            [getQueryKeys.getFiltered('roles', search as any)],
        )

    const openAlert = (type: PickedAction | 'edit' | 'permissions', row: Role) => {
        if (type === 'edit') {
            setEditingRole(row)
            setIsPermissionsOpen(false)
            setIsFormOpen(true)
            return
        }

        if (type === 'permissions') {
            setEditingRole(row)
            setIsFormOpen(false)
            setIsPermissionsOpen(true)
            return
        }

        const handler = async () => {
            if (type === 'delete') {
                await ChangeDeleteMutate({})
            }
            alert.setIsOpen(false)
        }

        setSelected({ id: String(row.id), type, row })

        const { title, desc } = getModalTitle(type as PickedAction, 'role', t)

        alert.setModel({
            isOpen: true,
            variant: type === 'delete' ? 'destructive' : 'default',
            title,
            desc,
            pending: deletePending,
            handleConfirm: handler,
        })
        alert.setHandler(handler)
    }

    return (
        <div className="space-y-4 shadow-sm pt-4">
            <div className="flex items-center justify-between px-4">
                <SmartBreadcrumbs entityKey="menu.roles" />
                <Button onClick={() => {
                    setEditingRole(undefined)
                    setIsFormOpen(true)
                }} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('actions.add', { entity: t('common.role') })}
                </Button>
            </div>

            <DataTable
                data={rows}
                meta={data.meta}
                columns={roleColumns(openAlert)}
                filters={getRoleFilters(t)}
                enableUrlState
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingRole
                                ? t('actions.edit', { entity: t('common.role') })
                                : t('actions.add', { entity: t('common.role') })}
                        </DialogTitle>
                    </DialogHeader>
                    <RoleForm
                        role={editingRole as any}
                        onSuccess={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <RolePermissionsDialog
                role={editingRole}
                open={isPermissionsOpen}
                onOpenChange={setIsPermissionsOpen}
            />
        </div>
    )
}

export default Roles
