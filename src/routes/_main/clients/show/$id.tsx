import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { checkPermission } from '@/util/permissionGuard'
import ClientShow from '@/components/pagesComponents/Clients/Show'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Client } from '@/types/api/client'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/clients/show/$id')({
    beforeLoad: ({ context }) => {
        checkPermission('clients.show')
        return context
    },
    loader: ({ params, context }) => {
        const { queryClient } = context as RouterContext
        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getOne('clients', params.id),
                endpoint: `clients/${params.id}`,
            }),
        )
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { data } = useFetch<ApiResponse<Client>, Client>({
        queryKey: getQueryKeys.getOne('clients', id),
        endpoint: `clients/${id}`,
        suspense: true,
        select: (res) => res.data as unknown as Client,
    })

    return (
        <div className='space-y-6'>
            <SmartBreadcrumbs
                entityKey="menu.clients"
                entityTo="/clients"
                action="show"
            />
            <ClientShow client={data!} />
        </div>
    )
}
