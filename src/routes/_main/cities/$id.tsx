import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { checkPermission } from '@/util/permissionGuard'
import CityForm from '@/components/pagesComponents/Cities/Form'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { CityDetails } from '@/types/api/city'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

import { z } from 'zod'

const searchSchema = z.object({
    country_id: z.number().optional(),
})

export const Route = createFileRoute('/_main/cities/$id')({
    beforeLoad: ({ context, params }) => {
        checkPermission('city.' + (params.id === 'add' ? 'store' : 'update'))
        return context
    },
    validateSearch: (search) => searchSchema.parse(search),
    loader: ({ params, context }) => {
        if (params.id === 'add') return
        const { queryClient } = context as RouterContext
        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getOne('cities', params.id),
                endpoint: `city/${params.id}`,
            }),
        )
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const isAdd = id === 'add'
    const { data } = useFetch<ApiResponse<CityDetails>, CityDetails>({
        queryKey: getQueryKeys.getOne('cities', id),
        endpoint: `city/${id}`,
        suspense: !isAdd,
        enabled: !isAdd,
        select: (res) => res.data as unknown as CityDetails,
    })

    return (
        <>
            <SmartBreadcrumbs
                entityKey="menu.cities"
                entityTo="/cities"
                action={isAdd ? 'add' : 'edit'}
            />
            <CityForm cityId={id} />
        </>
    )
}
