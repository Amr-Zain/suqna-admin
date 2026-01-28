// import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
// import { CountryShow } from '@/components/pagesComponents/Countries/Show'
// import { CountryShowSkeleton } from '@/components/pagesComponents/Countries/ShowSkeleton'
// import useFetch from '@/hooks/UseFetch'
// import { RouterContext } from '@/main'
// import { CountryDetails } from '@/types/api/country'
// import { ApiResponse } from '@/types/api/http'
// import { prefetchOptions } from '@/util/preFetcher'
// import { getQueryKeys } from '@/util/queryKeysFactory'
// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/_main/countries/show/$id')({
//   loader: ({ params, context }) => {
//     const { queryClient } = context as RouterContext
//     queryClient.ensureQueryData(
//       prefetchOptions({
//         queryKey: getQueryKeys.getOne('countries', params.id),
//         endpoint: `country/${params.id}`,
//       }),
//     )
//   },
//   pendingComponent: () => (
//     <div className='space-y-6'>
//       <SmartBreadcrumbs
//         entityKey="menu.countries"
//         entityTo="/countries"
//         action="show"
//       />
//       <CountryShowSkeleton />
//     </div>
//   ),
//   component: RouteComponent,
// })

// function RouteComponent() {
//   const { id } = Route.useParams()
//   const { data } = useFetch<ApiResponse<CountryDetails>, CountryDetails>({
//     queryKey: getQueryKeys.getOne('countries', id),
//     endpoint: `country/${id}`,
//     suspense: true,
//     select: (res) => res.data as unknown as CountryDetails,
//   })

//   return (
//     <div className='space-y-6'>
//       <SmartBreadcrumbs
//         entityKey="menu.countries"
//         entityTo="/countries"
//         action="show"
//       />
//       <CountryShow country={data!} />
//     </div>
//   )
// }
