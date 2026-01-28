import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { checkPermission } from '@/util/permissionGuard'
import CountryForm from '@/components/pagesComponents/Countries/Form'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { CountryDetails } from '@/types/api/country'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/countries/$id')({
  beforeLoad: ({ context, params }) => {
    checkPermission('country.' + (params.id === 'add' ? 'store' : 'update'))
    return context
  },
  loader: ({ params, context }) => {
    if (params.id === 'add') return
    const { queryClient } = context as RouterContext
    queryClient.ensureQueryData(
      prefetchOptions({
        queryKey: getQueryKeys.getOne('countries', params.id),
        endpoint: `country/${params.id}`,
      }),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const isAdd = id === 'add'
  const { data } = useFetch<ApiResponse<CountryDetails>, CountryDetails>({
    queryKey: getQueryKeys.getOne('countries', id),
    endpoint: `country/${id}`,
    suspense: !isAdd,
    enabled: !isAdd,
    select: (res) => res.data as unknown as CountryDetails,
  })

  return (
    <>
      <SmartBreadcrumbs
        entityKey="menu.countries"
        entityTo="/countries"
        action={isAdd ? 'add' : 'edit'}
      />
      <CountryForm countryId={id} />
    </>
  )
}
