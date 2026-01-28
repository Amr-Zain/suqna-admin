import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { useSearch } from '@tanstack/react-router'
import { staticPageColumns, getStaticPageFilters } from './Config'
import { PickedAction } from '@/hooks/useStatusMutations'
import { useState } from 'react'
import { StaticPage } from '@/types/api/staticPage'

type StaticPagesApi = ApiResponse<StaticPage[]> | { data: StaticPage[] }

const Pages = ({ data }: { data: StaticPagesApi }) => {
    const { t } = useTranslation()
    const search = useSearch({ from: '/_main/pages/' })

    const rows = (
        Array.isArray((data as any).data)
            ? (data as any).data
            : (data as any).data
    ) as StaticPage[]

    const [, setSelected] = useState<{
        id: string
        type: PickedAction
    } | null>(null)


    const openAlert = (type: PickedAction, row: StaticPage) => {
        setSelected({ id: String(row.id), type })
        // Since delete is disabled, we might not need this handler for delete.
        // But for 'active' toggle if implemented later.
    }

    return (
        <DataTable
            data={rows}
            columns={staticPageColumns(openAlert, t)}
            // searchKey="search"
            filters={getStaticPageFilters(t)}
            pagination={false}
            meta={(data as any).data?.meta}
            initialState={{
                pagination: {
                    pageIndex: ((data as any).data?.meta?.current_page || 1) - 1,
                    pageSize: (data as any).data?.meta?.per_page || 10,
                },
            }}
            resizable
            enableUrlState
        />
    )
}

export default Pages
