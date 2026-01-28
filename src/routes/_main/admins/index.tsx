import Admins from '@/components/pagesComponents/Admins'
import { checkPermission } from '@/util/permissionGuard'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { Admin } from '@/types/api/admin'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { searchParamsValidate } from '@/types/api/general'
import { TableLoader } from '@/components/common/table/TableLoader'

const endpoint = 'admins'

export const Route = createFileRoute('/_main/admins/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    checkPermission('admins.index')
    return context
  },
  validateSearch: (search: Record<string, unknown>) =>
    ({ ...searchParamsValidate(search) }),
  loaderDeps: ({ search }) => ({ search }),
  pendingComponent: () => <TableLoader breadcrumbs={{ entityKey: 'menu.admins' }} />,
  loader: ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext

    queryClient.ensureQueryData(
      prefetchOptions({
        queryKey: getQueryKeys.getFiltered('admins', search as Record<string, unknown>),
        endpoint,
        params: search,
      }),
    )
  },
})

function RouteComponent() {
  const search = Route.useLoaderDeps().search
  const { data } = useFetch<ApiResponse<Admin[]>>({
    queryKey: getQueryKeys.getFiltered('admins', search as Record<string, unknown>),
    endpoint,
    params: search,
    suspense: true,
  })

  return (
    <Admins data={data!} />
  )
}
