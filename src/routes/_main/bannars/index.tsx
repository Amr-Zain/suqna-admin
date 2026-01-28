import Bannars from '@/components/pagesComponents/Bannars'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Bannar } from '@/types/api/bannar'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'bannars'

export const Route = createFileRoute('/_main/bannars/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('bannars.index')
        return context
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.bannars' }} />,
    validateSearch: (search: Record<string, unknown>) => ({
        ...searchParamsValidate(search),
        start_date: search.start_date as string,
        end_date: search.end_date as string,
    } as any),
    loaderDeps: ({ search }) => ({
        search: {
            ...searchParamsValidate(search),
            start_date: search.start_date as string,
            end_date: search.end_date as string,
        } as any,
    }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('bannars', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Bannar[]>>({
        queryKey: getQueryKeys.getFiltered('bannars', search as Record<string, unknown>),
        endpoint,
        suspense: true,
        params: search,
    })
    return (
        <>
            <SmartBreadcrumbs entityKey="menu.bannars" />
            <Bannars data={data!} />
        </>
    )
}
