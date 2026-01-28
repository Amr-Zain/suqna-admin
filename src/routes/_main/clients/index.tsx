import Clients from '@/components/pagesComponents/Clients'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Client } from '@/types/api/client'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate, toStr } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'clients'

export const Route = createFileRoute('/_main/clients/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('clients.index')
        return context
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.clients' }} />,
    validateSearch: (search: Record<string, unknown>) =>
        ({ ...searchParamsValidate(search), is_ban: toStr(search.is_ban) }),
    loaderDeps: ({ search }) => ({ search: { ...searchParamsValidate(search), is_ban: toStr(search.is_ban) } }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('clients', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Client[]>>({
        queryKey: getQueryKeys.getFiltered('clients', search as Record<string, unknown>),
        endpoint,
        params: search,
        suspense: true,
    })

    return (
        <div className="space-y-4">
            <SmartBreadcrumbs entityKey="menu.clients" />
            <Clients data={data!} />
        </div>
    )
}
