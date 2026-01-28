import Departments from '@/components/pagesComponents/Departments'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Department } from '@/types/api/department'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'departments'

export const Route = createFileRoute('/_main/departments/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('departments.index')
        return context
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.departments' }} />,
    validateSearch: (search: Record<string, unknown>) =>
        searchParamsValidate(search),
    loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('departments', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Department[]>>({
        queryKey: getQueryKeys.getFiltered('departments', search as Record<string, unknown>),
        endpoint,
        suspense: true,
        params: search,
    })
    return (
        <>
            <SmartBreadcrumbs entityKey="menu.departments" />
            <Departments data={data!} />
        </>
    )
}
