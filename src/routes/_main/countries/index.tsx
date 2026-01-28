import Countries from '@/components/pagesComponents/Countries'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { createFileRoute } from '@tanstack/react-router'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { CountryDetails } from '@/types/api/country'
import { cleanObject, searchParamsValidate } from '@/types/api/general'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'countries'

export const Route = createFileRoute('/_main/countries/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    checkPermission('countries.index')
    return context
  },
  pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.countries' }} />,
  validateSearch: (search: Record<string, unknown>) =>
    searchParamsValidate(search),
  loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
  loader: ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext
    queryClient.ensureQueryData(
      prefetchOptions({
        queryKey: getQueryKeys.getFiltered('countries', search as Record<string, unknown>),
        endpoint,
        params: search,
      }),
    )
  },
})

function RouteComponent() {
  const search = Route.useLoaderDeps().search
  const { data } = useFetch<ApiResponse<CountryDetails[]>>({
    queryKey: getQueryKeys.getFiltered('countries', search as Record<string, unknown>),
    endpoint,
    suspense: true,
    params: search,
  })
  return (
    <>
      <SmartBreadcrumbs entityKey="menu.countries" />
      <Countries data={data!} />
    </>
  )
}
