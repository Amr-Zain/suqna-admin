import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { checkPermission } from '@/util/permissionGuard'
import StaticPageShow from '@/components/pagesComponents/Pages/Show'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { StaticPage } from '@/types/api/staticPage'
import { ApiResponse } from '@/types/api/http'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/pages/show/$type')({
  beforeLoad: ({ context }) => {
    checkPermission('page.show')
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
    select: (res) => res.data as unknown as StaticPage,
  })

  return (
    <div className='space-y-6'>
      <SmartBreadcrumbs
        entityKey="menu.pages"
        entityTo="/pages"
        action="show"
      />
      <StaticPageShow page={data!} />
    </div>
  )
}
