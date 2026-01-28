import Roles from '@/components/pagesComponents/Roles'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Role } from '@/types/api/role'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { searchParamsValidate } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'roles'

export const Route = createFileRoute('/_main/roles/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('roles.index')
        return context
    },
    validateSearch: (search: Record<string, unknown>) =>
        ({ ...searchParamsValidate(search) }),
    loaderDeps: ({ search }) => ({ search }),
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.roles' }} />,
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('roles', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Role[]>>({
        queryKey: getQueryKeys.getFiltered('roles', search as Record<string, unknown>),
        endpoint,
        params: search,
        suspense: true,
    })

    return (
        <Roles data={data!} />
    )
}
