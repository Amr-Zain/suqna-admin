import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { cityColumns, getCityFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { CityDetails } from '@/types/api/city'
import { getModalTitle } from '@/util/helpers'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import CityForm from './Form'
import { Plus } from 'lucide-react'

type CitiesApi = ApiResponse<CityDetails[]> | { data: CityDetails[] }

const Cities = ({ data }: { data: CitiesApi }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/cities/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as CityDetails[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction | 'edit'
        row?: CityDetails
    } | null>(null)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCity, setEditingCity] = useState<CityDetails | undefined>(undefined)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'cities',
            getQueryKeys.getOne('cities', currentId),
            [getQueryKeys.getFiltered('cities', search as any)],
        )

    useEffect(() => {
        alert.setPending(deletePending)
    }, [deletePending])


    const openAction = (type: PickedAction | 'edit', row: CityDetails) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'edit') {
            setEditingCity(row)
            setIsFormOpen(true)
            return
        }

        if (type === 'delete') {
            const handler = async () => {
                await ChangeDeleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'city', t)

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
        setEditingCity(undefined)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingCity(undefined)
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
                columns={cityColumns(openAction)}
                filters={getCityFilters(t)}
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
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCity
                                ? t('actions.update', { entity: t('common.city') })
                                : t('actions.create', { entity: t('common.city') })}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <CityForm
                            cityId={editingCity?.id?.toString()}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Cities
