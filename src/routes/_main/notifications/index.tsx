import Notifications from '@/components/pagesComponents/Notifications'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { ApiResponse } from '@/types/api/http'
import { createFileRoute } from '@tanstack/react-router'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Notification } from '@/types/api/notification'
import { searchParamsValidate } from '@/types/api/general'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { QueryClient } from '@tanstack/react-query'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'notifications'

export const Route = createFileRoute('/_main/notifications/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('notifications.index')
        return context
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.notifications' }} />,
    validateSearch: (search: Record<string, unknown>) =>
        searchParamsValidate(search),
    loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as { queryClient: QueryClient }
        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('notifications', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<Notification[]>>({
        queryKey: getQueryKeys.getFiltered('notifications', search as Record<string, unknown>),
        endpoint,
        suspense: true,
        params: search,
    })
    return (
        <>
            <SmartBreadcrumbs entityKey="menu.notifications" />
            <Notifications data={data!} />
        </>
    )
}
