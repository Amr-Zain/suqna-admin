import Providers from '@/components/pagesComponents/Providers'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Provider } from '@/types/api/provider'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate, toStr } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'providers'

export const Route = createFileRoute('/_main/providers/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('providers.index')
        return context
    },
    validateSearch: (search: Record<string, unknown>) =>
        ({ ...searchParamsValidate(search), is_ban: toStr(search.is_ban), user_type: toStr(search.user_type) }),
    loaderDeps: ({ search }) => ({ search: { ...searchParamsValidate(search), is_ban: toStr(search.is_ban), user_type: toStr(search.user_type) } }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('providers', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.providers' }} />,
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Provider[]>>({
        queryKey: getQueryKeys.getFiltered('providers', search as Record<string, unknown>),
        endpoint,
        params: search,
        suspense: true,
    })

    return (
        <div className="space-y-4">
            <SmartBreadcrumbs entityKey="menu.providers" />
            <Providers data={data!} />
        </div>
    )
}
