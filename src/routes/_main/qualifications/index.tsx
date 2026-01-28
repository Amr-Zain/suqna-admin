import Qualifications from '@/components/pagesComponents/Qualifications'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Qualification } from '@/types/api/qualification'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'qualifications'

export const Route = createFileRoute('/_main/qualifications/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('qualifications.index')
        return context
    },
    validateSearch: (search: Record<string, unknown>) =>
        searchParamsValidate(search),
    loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.qualifications' }} />,
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('qualifications', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Qualification[]>>({
        queryKey: getQueryKeys.getFiltered('qualifications', search as Record<string, unknown>),
        endpoint,
        suspense: true,
        params: search,
    })
    return (
        <>
            <SmartBreadcrumbs entityKey="menu.qualifications" />
            <Qualifications data={data!} />
        </>
    )
}
