import Cities from '@/components/pagesComponents/Cities'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { CityDetails } from '@/types/api/city'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { searchParamsValidate } from '@/types/api/general'

const endpoint = 'cities'

export const Route = createFileRoute('/_main/cities/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    checkPermission('city.index')
    return context
  },
  validateSearch: (search: Record<string, unknown>) =>
    searchParamsValidate(search),
  loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
  loader: ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext

    queryClient.ensureQueryData(
      prefetchOptions({
        queryKey: getQueryKeys.getFiltered('cities', search as Record<string, unknown>),
        endpoint,
        params: search,
      }),
    )
  },
})

function RouteComponent() {
  const search = Route.useLoaderDeps().search
  const { data } = useFetch<ApiResponse<CityDetails[]>>({
    queryKey: getQueryKeys.getFiltered('cities', search as Record<string, unknown>),
    endpoint,
    params: search,
    suspense: true,
  })

  return (
    <div className="space-y-4">
      <SmartBreadcrumbs entityKey="menu.cities" />
      <Cities data={data!} />
    </div>
  )
}
