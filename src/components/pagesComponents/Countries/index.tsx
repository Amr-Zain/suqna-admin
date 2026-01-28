import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { countryColumns, getCountryFilters } from './Config'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { CountryDetails } from '@/types/api/country'
import { getModalTitle } from '@/util/helpers'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import CountryForm from './Form'
import { Plus } from 'lucide-react'

type CountriesApi = ApiResponse<CountryDetails[]> | { data: CountryDetails[] }

const Countries = ({ data }: { data: CountriesApi }) => {
  const { t } = useTranslation()
  const alert = useAlertModal()
  const search = useSearch({ from: '/_main/countries/' })

  const rows = (
    Array.isArray((data as any).data)
      ? (data as any).data
      : (data as any).data
  ) as CountryDetails[]

  const [selected, setSelected] = useState<{
    id: string
    type: PickedAction | 'edit'
    row?: CountryDetails
  } | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState<CountryDetails | undefined>(undefined)

  const currentId = selected?.id || ''

  // Handle Delete mutation
  const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
    useStatusMutation(
      currentId,
      'delete',
      'countries',
      getQueryKeys.getOne('countries', currentId),
      [getQueryKeys.getFiltered('countries', search as any)],
    )

  useEffect(() => {
    alert.setPending(deletePending)
  }, [deletePending])


  const openAction = (type: PickedAction | 'edit', row: CountryDetails) => {
    setSelected({ id: String(row.id), type, row })

    if (type === 'edit') {
      setEditingCountry(row)
      setIsFormOpen(true)
      return
    }

    if (type === 'delete') {
      const handler = async () => {
        await ChangeDeleteMutate({})
        alert.setIsOpen(false)
      }
      const { title, desc } = getModalTitle(type, 'country', t)

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
    setEditingCountry(undefined)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingCountry(undefined)
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
        columns={countryColumns(openAction)}
        filters={getCountryFilters(t)}
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
              {editingCountry
                ? t('actions.update', { entity: t('common.country') })
                : t('actions.create', { entity: t('common.country') })}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <CountryForm
              countryId={editingCountry?.id?.toString()}
              onSuccess={handleCloseForm}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Countries
