import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { faqColumns, getFAQFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { FAQDetails } from '@/types/api/faq'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import FAQForm from './Form'
import { Plus } from 'lucide-react'

type FAQsApi = ApiResponse<FAQDetails[]> | { data: FAQDetails[] }

const FAQs = ({ data }: { data: FAQsApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/faqs/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as FAQDetails[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit'
        row?: FAQDetails
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingFAQ, setEditingFAQ] = useState<FAQDetails | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'questions',
            getQueryKeys.getOne('faqs', currentId),
            [getQueryKeys.getFiltered('faqs', search as any)],
        )

    useEffect(() => {
        alert.setPending(deletePending)
    }, [deletePending])


    const openAction = (type: PickedAction | 'edit', row: FAQDetails) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'edit') {
            setEditingFAQ(row)
            setIsFormOpen(true)
            return
        }

        if (type === 'delete') {
            const handler = async () => {
                await ChangeDeleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'faq', t)

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
        setEditingFAQ(undefined)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingFAQ(undefined)
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
                columns={faqColumns(openAction)}
                filters={getFAQFilters(t)}
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
                            {editingFAQ
                                ? t('actions.update', { entity: t('faq.entity') })
                                : t('actions.create', { entity: t('faq.entity') })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <FAQForm
                            faq={editingFAQ}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FAQs
