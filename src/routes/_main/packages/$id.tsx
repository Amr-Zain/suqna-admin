import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { checkPermission } from '@/util/permissionGuard'
import PackageForm from '@/components/pagesComponents/Packages/Form'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { PackageDetails } from '@/types/api/package'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/packages/$id')({
  beforeLoad: ({ context, params }) => {
    checkPermission('packages.' + (params.id === 'add' ? 'store' : 'update'))
    return context
  },
  loader: ({ params, context }) => {
    if (params.id === 'add') return
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
  const isAdd = id === 'add'
  const { data } = useFetch<ApiResponse<PackageDetails>, PackageDetails>({
    queryKey: getQueryKeys.getOne('packages', id),
    endpoint: `package/${id}`,
    suspense: !isAdd,
    enabled: !isAdd,
    select: (res) => res.data as unknown as PackageDetails,
  })

  return (
    <>
      <SmartBreadcrumbs
        entityKey="menu.packages"
        entityTo="/packages"
        action={isAdd ? 'add' : 'edit'}
      />
      <PackageForm pkg={data} />
    </>
  )
}
