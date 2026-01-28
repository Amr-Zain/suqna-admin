import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { checkPermission } from '@/util/permissionGuard'
import StaticPageForm from '@/components/pagesComponents/Pages/Form'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { StaticPage } from '@/types/api/staticPage'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/pages/$type')({
  beforeLoad: ({ context }) => {
    checkPermission('page.update')
    return context
  },
  loader: ({ params, context }) => {
    const { queryClient } = context as RouterContext
    queryClient.ensureQueryData(
      prefetchOptions({
        queryKey: getQueryKeys.getOne('page', params.type),
        endpoint: `page/${params.type}`,
      }),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { type } = Route.useParams()
  const { data } = useFetch<ApiResponse<StaticPage>, StaticPage>({
    queryKey: getQueryKeys.getOne('page', type),
    endpoint: `page/${type}`,
    // The response is likely { data: { ... } }, useFetch usually handles ApiResponse structure if generic is passed.
    select: (res) => res.data as unknown as StaticPage,
  })

  return (
    <>
      <SmartBreadcrumbs
        entityKey="menu.pages"
        entityTo="/pages"
        action="edit"
      />
      <StaticPageForm staticPage={data} type={type} />
    </>
  )
}
