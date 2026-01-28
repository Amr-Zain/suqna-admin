
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { departmentColumns, getDepartmentFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Department } from '@/types/api/department'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import DepartmentForm from './Form'
import { Plus } from 'lucide-react'

type DepartmentsApi = ApiResponse<Department[]> | { data: Department[] }

const Departments = ({ data }: { data: DepartmentsApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/departments/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as Department[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit'
        row?: Department
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<Department | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete/Status mutations
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'departments',
            getQueryKeys.getOne('departments', currentId),
            [getQueryKeys.getFiltered('departments', search)],
        )

    // Status check (is_active toggle)
    const { mutateAsync: ChangeStatusMutate, isPending: statusPending } =
        useStatusMutation(
            currentId,
            'active',
            'departments',
            getQueryKeys.getOne('departments', currentId),
            [getQueryKeys.getFiltered('departments', search)],
        )


    useEffect(() => {
        alert.setPending(deletePending)
    }, [deletePending])

    const openAction = (type: PickedAction | 'edit', row: Department) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'edit') {
            setEditingDepartment(row)
            setIsFormOpen(true)
            return
        }

        if (type === 'active') {
            const handler = async () => {
                await ChangeStatusMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'department', t)
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
            const { title, desc } = getModalTitle(type, 'department', t)

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
    }

    const handleCreate = () => {
        setEditingDepartment(undefined)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingDepartment(undefined)
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
                columns={departmentColumns(openAction, t)}
                filters={getDepartmentFilters(t)}
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
                            {editingDepartment
                                ? t('actions.update', { entity: t('common.department') })
                                : t('actions.create', { entity: t('common.department') })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <DepartmentForm
                            department={editingDepartment}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Departments
