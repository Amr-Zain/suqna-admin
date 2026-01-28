import Contacts from '@/components/pagesComponents/Contacts'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Contact } from '@/types/api/contact'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate, toStr } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'contacts'

export const Route = createFileRoute('/_main/contacts/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('contacts.index')
        return context
    },
    pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.contacts' }} />,
    validateSearch: (search: Record<string, unknown>) =>
        ({ phone: toStr(search.phone), name: toStr(search.name) }),
    loaderDeps: ({ search }) => ({ search: { phone: toStr(search.phone), name: toStr(search.name) } }),
    loader: ({ context, deps: { search } }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.getFiltered('contacts', search as Record<string, unknown>),
                endpoint,
                params: search,
            }),
        )
    },
})

function RouteComponent() {
    const search = Route.useLoaderDeps().search
    console.log(search)
    const { data } = useFetch<ApiResponse<Contact[]>>({
        queryKey: getQueryKeys.getFiltered('contacts', search as Record<string, unknown>),
        endpoint,
        params: search,
        suspense: true,
    })

    return (
        <div className="space-y-4">
            <SmartBreadcrumbs entityKey="menu.contacts" />
            <Contacts data={data!} />
        </div>
    )
}
