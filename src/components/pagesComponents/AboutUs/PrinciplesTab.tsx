import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/common/table/AppTable'
import { ApiResponse } from '@/types/api/http'
import useFetch from '@/hooks/UseFetch'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { principleColumns, principleFieldsBuilder, makePrincipleSchema, PrincipleFormData } from './Config'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody } from '@/components/ui/dialog'
import AppForm from '@/components/common/form/AppForm'
import { generateFinalOut, generateInitialValues, getModalTitle, transformToBracketNotation } from '@/util/helpers'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { useAlertModal } from '@/stores/useAlertModal'
import { useStatusMutation, PickedAction } from '@/hooks/useStatusMutations'
import { TableLoader } from '@/components/common/table/TableLoader'

export default function PrinciplesTab() {
    const { t } = useTranslation()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const alert = useAlertModal()
    const endpoint = 'our-principle'

    const { data, isLoading: isFetching } = useFetch<ApiResponse<any[]>>({
        queryKey: getQueryKeys.all('principles'),
        endpoint,
    })

    const { mutate, isPending: isMutating } = useMutate({
        endpoint: editingItem ? `${endpoint}/${editingItem.id}` : endpoint,
        mutationKey: ['principles-mutate'],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('principles')] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message || t('Form.messages.success'))
            setIsModalOpen(false)
            setEditingItem(null)
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message || t('Form.messages.error'))
        },
    })

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const { mutateAsync: deleteMutate, isPending: isDeleting } = useStatusMutation(
        selectedId || '',
        'delete',
        'our-principle',
        getQueryKeys.getOne('principles', selectedId || ''),
        [getQueryKeys.all('principles')],
    )

    useEffect(() => {
        alert.setPending(isDeleting)
    }, [isDeleting])

    const openAlert = (type: PickedAction | 'edit', row: any) => {
        if (type === 'delete') {
            setSelectedId(String(row.id))
            const handler = async () => {
                await deleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle('delete', 'principle', t)
            alert.setModel({
                isOpen: true,
                variant: 'destructive',
                title,
                desc,
                pending: isDeleting,
                handleConfirm: handler,
            })
            alert.setHandler(handler)
        } else if (type === 'edit') {
            setEditingItem(row)
            setIsModalOpen(true)
        }
    }

    const preparedItem = useMemo(() => {
        if (!editingItem) return undefined
        return {
            ...editingItem,
            ar: editingItem.translations?.ar,
            en: editingItem.translations?.en,
            icon: editingItem.icon ? { ...editingItem.icon, mime_type: 'image/' } : undefined,
        }
    }, [editingItem])

    const handleSubmit = (values: PrincipleFormData) => {
        mutate(transformToBracketNotation(values))
    }

    const customToolbar = (
        <Button size="sm" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
            {t('buttons.add')}
        </Button>
    )

    if (isFetching) return <TableLoader colCount={4} rowCount={8} />

    return (
        <div className="space-y-4">
            <DataTable
                data={data?.data || []}
                columns={principleColumns(openAlert)}
                toolbar={customToolbar}
                pagination={false}
                meta={data?.meta}
            />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? t('actions.edit') : t('buttons.add')}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <div className="py-4">
                            <AppForm<PrincipleFormData>
                                schema={makePrincipleSchema(t) as any}
                                fields={principleFieldsBuilder(t)}
                                defaultValues={generateInitialValues(preparedItem)}
                                onSubmit={handleSubmit}
                                isLoading={isMutating}
                                submitButtonText={t('buttons.save')}
                                gridColumns={2}
                            />
                        </div>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </div>
    )
}
