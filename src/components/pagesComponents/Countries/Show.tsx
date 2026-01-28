// import * as React from 'react'
// import { useState, useEffect } from 'react'
// import { useTranslation } from 'react-i18next'
// import { Link } from '@tanstack/react-router'
// import { Edit, Plus } from 'lucide-react'

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
// import { Switch } from '@/components/ui/switch'
// import { Button } from '@/components/ui/button'

// import { useStatusMutation } from '@/hooks/useStatusMutations'
// import { getQueryKeys } from '@/util/queryKeysFactory'
// import { useAlertModal } from '@/stores/useAlertModal'
// import { CountryDetails, City } from '@/types/api/country'
// import { ActionIcon } from '@/components/common/table/ActionIcon'
// import { formatDate } from '@/util/helpers'
// import {
//   ShowPage,
//   ShowHeader,
//   ShowTitle,
//   ShowActions,
//   ShowSummary,
//   ShowSummaryImage,
//   ShowSummaryContent,
//   ShowSummaryTitle,
//   ShowSummaryStatus,
//   ShowGrid,
//   ShowSection,
//   ShowInfoTable,
//   ShowLocalizedTabs,
//   DetailGrid,
//   ShowChildrenList,
//   ShowChildrenHeader,
//   ShowChildrenTitle,
//   ShowChildrenContent,
//   ShowEmptyState,
// } from '@/components/common/uiComponents/ShowLayout'

// function titleCaseContinentIntl(c: string, t: (k: string, o?: any) => string) {
//   if (!c) return ''
//   const key = `continent.${String(c).toLowerCase().trim()}`
//   return t(key, { defaultValue: c })
// }

// export function CountryShow({ country }: { country: CountryDetails }) {
//   const { t } = useTranslation()
//   const alert = useAlertModal()

//   const {
//     flag,
//     status,
//     short_name,
//     phone_code,
//     phone_limit,
//     continent,
//     created_at,
//     translations,
//     id,
//   } = country

//   const [selectedCity, setSelectedCity] = useState<City | null>(null)

//   const { mutateAsync: ChangeCountryStatus, isPending: countryPending } =
//     useStatusMutation(
//       String(id),
//       'active',
//       'country',
//       getQueryKeys.getOne('countries', String(id)),
//       [getQueryKeys.all('countries')],
//     )

//   const { mutateAsync: ChangeCityStatus, isPending: cityPending } =
//     useStatusMutation(
//       String(selectedCity?.id || ''),
//       'active',
//       'city',
//       getQueryKeys.getOne('cities', String(selectedCity?.id || '')),
//       [getQueryKeys.getOne('countries', String(id))],
//     )

//   useEffect(() => {
//     alert.setPending(countryPending || cityPending)
//   }, [countryPending, cityPending])

//   const handleCountryStatusToggle = async () => {
//     const handler = async () => {
//       await ChangeCountryStatus({ status: !status })
//       alert.setIsOpen(false)
//     }

//     alert.setModel({
//       isOpen: true,
//       variant: 'default',
//       title: t('modals.active.title', { entity: t('common.country') }),
//       desc: t('modals.active.desc', { entity: t('common.country') }),
//       pending: countryPending,
//       handleConfirm: handler,
//     })
//   }

//   const handleCityStatusToggle = async (city: City) => {
//     setSelectedCity(city)
//     const handler = async () => {
//       await ChangeCityStatus({ status: !city.status })
//       alert.setIsOpen(false)
//     }

//     alert.setModel({
//       isOpen: true,
//       variant: 'default',
//       title: t('modals.active.title', { entity: t('common.city') }),
//       desc: t('modals.active.desc', { entity: t('common.city') }),
//       pending: cityPending,
//       handleConfirm: handler,
//     })
//   }

//   const en = translations?.en
//   const ar = translations?.ar

//   return (
//     <ShowPage>
//       <ShowHeader>
//         <ShowTitle>{t('menu.countries')}</ShowTitle>
//         <ShowActions>
//           <Link to="/countries/$id" params={{ id: id.toString() }}>
//             <Button>
//               <Edit className="w-4 h-4 me-2" />
//               {t('actions.edit')}
//             </Button>
//           </Link>
//         </ShowActions>
//       </ShowHeader>

//       <ShowSummary>
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
//           <ShowSummaryImage src={flag?.url} alt={en?.name} />
//           <ShowSummaryContent>
//             <ShowSummaryTitle id={id} en={en?.name} ar={ar?.name} />
//           </ShowSummaryContent>
//         </div>
//         <ShowSummaryStatus
//           status={status}
//           onToggle={handleCountryStatusToggle}
//           pending={countryPending}
//           extra={
//             <div className="flex flex-col items-end gap-1">
//               <span className="text-xs text-muted-foreground">
//                 {t('table.columns.continent')}: {titleCaseContinentIntl(continent, t)}
//               </span>
//               <span className="text-[10px] text-muted-foreground">
//                 {t('table.columns.createdAt')} {formatDate(created_at)}
//               </span>
//             </div>
//           }
//         />
//       </ShowSummary>

//       <DetailGrid>
//         <ShowSection title={t('table.columns.general')}>
//           <ShowInfoTable
//             rows={[
//               { label: t('Form.labels.shortName'), value: short_name },
//               { label: t('table.columns.phoneCode'), value: `+${phone_code}` },
//               { label: t('table.columns.phoneLength'), value: phone_limit },
//               { label: t('table.columns.continent'), value: titleCaseContinentIntl(continent, t) },
//             ]}
//           />
//         </ShowSection>

//         <ShowSection title={t('countryShow.localized.title')}>
//           <ShowLocalizedTabs
//             tabs={[
//               {
//                 value: 'en',
//                 label: t('en'),
//                 rows: [
//                   { label: t('Form.labels.name'), value: en?.name },
//                   { label: t('Form.labels.slug'), value: en?.slug },
//                   { label: t('Form.labels.currency'), value: en?.currency },
//                   { label: t('Form.labels.nationality'), value: en?.nationality },
//                 ]
//               },
//               {
//                 value: 'ar',
//                 label: t('ar'),
//                 rows: [
//                   { label: t('Form.labels.name'), value: ar?.name },
//                   { label: t('Form.labels.slug'), value: ar?.slug },
//                   { label: t('Form.labels.currency'), value: ar?.currency },
//                   { label: t('Form.labels.nationality'), value: ar?.nationality },
//                 ]
//               }
//             ]}
//           />
//         </ShowSection>
//       </DetailGrid>

//       {/* Cities Table */}
//       <ShowChildrenList>
//         <ShowChildrenHeader>
//           <ShowChildrenTitle count={country.cities?.length || 0}>
//             {t('menu.cities')}
//           </ShowChildrenTitle>
//           <Link to="/cities/$id" params={{ id: 'add' }} search={{ country_id: id }}>
//             <Button size="sm" variant="default">
//               <Plus className="w-4 h-4 me-2" />
//               {t('buttons.add')}
//             </Button>
//           </Link>
//         </ShowChildrenHeader>
//         <ShowChildrenContent>
//           <CardDescription className="mb-4">
//             {t('countryShow.cities.subtitle')}
//           </CardDescription>
//           {country.cities && country.cities.length > 0 ? (
//             <div className="rounded-md border">
//               <Table>
//                 <TableBody>
//                   <TableRow className="bg-muted/50 font-bold hover:bg-muted/50">
//                     <TableCell className="w-16">#</TableCell>
//                     <TableCell>{t('table.columns.name')}</TableCell>
//                     <TableCell>{t('Form.labels.slug')}</TableCell>
//                     <TableCell>{t('table.columns.status')}</TableCell>
//                     <TableCell className="text-right">
//                       {t('table.columns.createdAt')}
//                     </TableCell>
//                     <TableCell className="text-center">{t('table.actions')}</TableCell>
//                   </TableRow>
//                   {country.cities.map((city) => (
//                     <TableRow key={city.id} className="hover:bg-muted/30 transition-colors">
//                       <TableCell className="font-mono text-xs">{city.id}</TableCell>
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span className="font-medium">
//                             {typeof city.name === 'object' ? city.name.ar : city.name}
//                           </span>
//                           <span className="text-[10px] text-muted-foreground">
//                             {typeof city.name === 'object' ? city.name.en : city.name}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <span className="text-xs">
//                           {typeof city.slug === 'object' ? city.slug.en : city.slug}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         <div
//                           className="flex items-center gap-2 cursor-pointer"
//                           onClick={() => handleCityStatusToggle(city)}
//                         >
//                           <Switch checked={!!city.status} className="scale-75" />
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right text-xs text-muted-foreground">
//                         {formatDate(city.created_at)}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <ActionIcon
//                           icon={Edit}
//                           label={t('actions.edit')}
//                           to="/cities/$id"
//                           params={{ id: city.id.toString() }}
//                           queryKey={getQueryKeys.getOne('cities', city.id.toString())}
//                           rowData={city}
//                           variant="ghost"
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           ) : (
//             <ShowEmptyState />
//           )}
//         </ShowChildrenContent>
//         <CardFooter className="flex items-center justify-between text-[10px] text-muted-foreground border-t bg-muted/5 py-3 px-6">
//           <span>
//             {t('Form.labels.phone_placeholder_example')}
//             &nbsp;
//             <code className="rounded bg-muted px-1.5 py-0.5" dir="ltr">
//               +{phone_code} ••••••••
//             </code>
//           </span>
//         </CardFooter>
//       </ShowChildrenList>
//     </ShowPage>
//   )
// }
