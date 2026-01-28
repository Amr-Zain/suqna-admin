import Subscriptions from '@/components/pagesComponents/Subscriptions'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Subscription } from '@/types/api/subscription'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { searchParamsValidate, toStr } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'subscriptions'

export const Route = createFileRoute('/_main/subscriptions/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('subscriptions.index')
        return context
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.subscriptions' }} />,
    validateSearch: (search: Record<string, unknown>) =>
    ({
        ...searchParamsValidate(search),
        type: toStr(search.type),
        user_name: toStr(search.user_name),
        is_active: toStr(search.is_active),
    }),
    loaderDeps: ({ search }) => ({ search }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('subscriptions', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Subscription[]>>({
        queryKey: getQueryKeys.getFiltered('subscriptions', search as Record<string, unknown>),
        endpoint,
        params: search,
        suspense: true,
    })

    return (
        <Subscriptions data={data!} />
    )
}
