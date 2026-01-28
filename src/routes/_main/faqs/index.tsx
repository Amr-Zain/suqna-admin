import FAQs from '@/components/pagesComponents/FAQs'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { FAQDetails } from '@/types/api/faq'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'questions'

export const Route = createFileRoute('/_main/faqs/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('questions.index')
        return context
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.faqs' }} />,
    validateSearch: (search: Record<string, unknown>) =>
        searchParamsValidate(search),
    loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('faqs', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    const { data } = useFetch<ApiResponse<FAQDetails[]>>({
        queryKey: getQueryKeys.getFiltered('faqs', search as Record<string, unknown>),
        endpoint,
        params: search,
        suspense: true,
    })

    return (
        <div className="space-y-4">
            <SmartBreadcrumbs entityKey="menu.faqs" />
            <FAQs data={data!} />
        </div>
    )
}
