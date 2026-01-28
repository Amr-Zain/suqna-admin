// import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
// import { CityShow } from '@/components/pagesComponents/Cities/Show'
// import useFetch from '@/hooks/UseFetch'
// import { RouterContext } from '@/main'
// import { CityDetails } from '@/types/api/city'
// import { ApiResponse } from '@/types/api/http'
// import { prefetchOptions } from '@/util/preFetcher'
// import { getQueryKeys } from '@/util/queryKeysFactory'
// import { createFileRoute } from '@tanstack/react-router'
// import { Skeleton } from '@/components/ui/skeleton'

// export const Route = createFileRoute('/_main/cities/show/$id')({
//   loader: ({ params, context }) => {
//     const { queryClient } = context as RouterContext
//     queryClient.ensureQueryData(
//       prefetchOptions({
//         queryKey: getQueryKeys.getOne('cities', params.id),
//         endpoint: `city/${params.id}`,
//       }),
//     )
//   },
//   pendingComponent: () => (
//     <div className='space-y-6'>
//       <SmartBreadcrumbs
//         entityKey="menu.cities"
//         entityTo="/cities"
//         action="show"
//       />
//       <div className="space-y-4">
//         <Skeleton className="h-48 w-full" />
//         <div className="grid grid-cols-2 gap-4">
//           <Skeleton className="h-64 w-full" />
//           <Skeleton className="h-64 w-full" />
//         </div>
//       </div>
//     </div>
//   ),
//   component: RouteComponent,
// })

// function RouteComponent() {
//   const { id } = Route.useParams()
//   const { data } = useFetch<ApiResponse<CityDetails>, CityDetails>({
//     queryKey: getQueryKeys.getOne('cities', id),
//     endpoint: `city/${id}`,
//     suspense: true,
//     select: (res) => res.data as unknown as CityDetails,
//   })

//   return (
//     <div className='space-y-6'>
//       <SmartBreadcrumbs
//         entityKey="menu.cities"
//         entityTo="/cities"
//         action="show"
//       />
//       <CityShow city={data!} />
//     </div>
//   )
// }
