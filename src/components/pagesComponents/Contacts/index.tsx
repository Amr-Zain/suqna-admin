import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { PickedAction, useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { Contact } from '@/types/api/contact'
import { getModalTitle } from '@/util/helpers'
import { ColumnDef } from '@tanstack/react-table'
import {
    createActionColumn,
    textColumn,
    createdAtColumn,
} from '@/util/crudFactory'



const Contacts = ({ data }: { data: ApiResponse<Contact[]> }) => {
    const { t } = useTranslation()
    const alert = useAlertModal()
    const search = useSearch({ from: '/_main/contacts/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as Contact[]

    const [selected, setSelected] = useState<{
        id: string
        type: PickedAction
        row?: Contact
    } | null>(null)

    const currentId = selected?.id || ''

    // Handle Delete mutation
    const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
        useStatusMutation(
            currentId,
            'delete',
            'contacts',
            getQueryKeys.getOne('contacts', currentId),
            [getQueryKeys.getFiltered('contacts', search as any)],
        )

    useEffect(() => {
        alert.setPending(deletePending)
    }, [deletePending])


    const openAction = (type: PickedAction, row: Contact) => {
        setSelected({ id: String(row.id), type, row })

        if (type === 'delete') {
            const handler = async () => {
                await ChangeDeleteMutate({})
                alert.setIsOpen(false)
            }
            const { title, desc } = getModalTitle(type, 'contact', t)

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

    return (
        <>
            <DataTable
                data={rows}
                columns={[
                    textColumn<Contact>('id', 'table.columns.id'),
                    textColumn<Contact>('full_name', 'table.columns.fullName'),
                    textColumn<Contact>('phone', 'table.columns.phone'),
                    createdAtColumn() as ColumnDef<Contact>,
                    createActionColumn<Contact>('/contacts', openAction as any, 'contacts', {
                        hasDelete: true,
                        hasEdit: false,
                        hasShow: false
                    }),
                ]}
                filters={[
                    {
                        id:'name',
                        title: t('table.columns.name'),
                        type: 'text',
                    },
                    {
                        id:'phone',
                        title: t('table.columns.phone'),
                        type: 'text',
                    },
                ]}
                pagination={true}
                meta={(data as any).meta}
                initialState={{
                    pagination: {
                        pageIndex: ((data as any).meta?.current_page || 1) - 1,
                        pageSize: (data as any).meta?.per_page || 10,
                    },
                }}
                resizable
                enableUrlState
            />
        </>
    )
}

export default Contacts
