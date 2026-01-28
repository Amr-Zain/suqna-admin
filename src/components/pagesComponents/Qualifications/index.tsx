import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { qualificationColumns, getQualificationFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Qualification } from '@/types/api/qualification'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import QualificationForm from './Form'
import { Plus } from 'lucide-react'

type QualificationsApi = ApiResponse<Qualification[]> | { data: Qualification[] }

const Qualifications = ({ data }: { data: QualificationsApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/qualifications/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as Qualification[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit'
        row?: Qualification
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingQualification, setEditingQualification] = useState<Qualification | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'qualifications',
            getQueryKeys.getOne('qualifications', currentId),
            [getQueryKeys.getFiltered('qualifications', search)],
        )

    useEffect(() => {
        alert.setPending(deletePending)
    }, [deletePending])

    const openAction = (type: PickedAction | 'edit', row: Qualification) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'edit') {
            setEditingQualification(row)
            setIsFormOpen(true)
            return
        }

        if (type === 'delete') {
            const handler = async () => {
                await ChangeDeleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'qualification', t)

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
        setEditingQualification(undefined)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingQualification(undefined)
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
                columns={qualificationColumns(openAction)}
                filters={getQualificationFilters(t)}
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
                searchKey="keyword"
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingQualification
                                ? t('actions.update', { entity: t('common.qualification') })
                                : t('actions.create', { entity: t('common.qualification') })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <QualificationForm
                            qualification={editingQualification}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Qualifications
