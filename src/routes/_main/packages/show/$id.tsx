import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { checkPermission } from '@/util/permissionGuard'
import PackageShow from '@/components/pagesComponents/Packages/Show'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { PackageDetails } from '@/types/api/package'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/packages/show/$id')({
    beforeLoad: ({ context }) => {
        checkPermission('packages.show')
        return context
    },
    loader: ({ params, context }) => {
        const { queryClient } = context as RouterContext
        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getOne('packages', params.id),
                endpoint: `packages/${params.id}`,
            }),
        )
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { data } = useFetch<ApiResponse<PackageDetails>, PackageDetails>({
        queryKey: getQueryKeys.getOne('packages', id),
        endpoint: `packages/${id}`,
        suspense: true,
        select: (res) => res.data as unknown as PackageDetails,
    })

    return (
        <div className='space-y-6'>
            <SmartBreadcrumbs
                entityKey="menu.packages"
                entityTo="/packages"
                action="show"
            />
            <PackageShow pkg={data!} />
        </div>
    )
}
