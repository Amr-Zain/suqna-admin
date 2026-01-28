import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { termColumns } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { TermDetails } from '@/types/api/terms'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import TermForm from './Form'
import { Plus } from 'lucide-react'

type TermsApi = ApiResponse<TermDetails[]> | { data: TermDetails[] }

const Terms = ({ data }: { data: TermsApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/terms/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as TermDetails[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit'
        row?: TermDetails
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTerm, setEditingTerm] = useState<TermDetails | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'terms',
            getQueryKeys.getOne('terms', currentId),
            [getQueryKeys.getFiltered('terms', search as any)],
        )

    useEffect(() => {
        alert.setPending(deletePending)
    }, [deletePending])


    const openAction = (type: PickedAction | 'edit', row: TermDetails) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'edit') {
            setEditingTerm(row)
            setIsFormOpen(true)
            return
        }

        if (type === 'delete') {
            const handler = async () => {
                await ChangeDeleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'term', t)

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
        setEditingTerm(undefined)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingTerm(undefined)
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
                columns={termColumns(openAction)}
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

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTerm
                                ? t('actions.update', { entity: t('common.term') })
                                : t('actions.create', { entity: t('common.term') })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <TermForm
                            term={editingTerm}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Terms
