// import * as React from 'react'
// import { useEffect } from 'react'
// import { useTranslation } from 'react-i18next'
// import { Link } from '@tanstack/react-router'
// import { Edit } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { CityDetails } from '@/types/api/city'

// import { useStatusMutation } from '@/hooks/useStatusMutations'
// import { getQueryKeys } from '@/util/queryKeysFactory'
// import { useAlertModal } from '@/stores/useAlertModal'
// import {
//     ShowPage,
//     ShowHeader,
//     ShowTitle,
//     ShowActions,
//     ShowSummary,
//     ShowSummaryContent,
//     ShowSummaryTitle,
//     ShowSummaryStatus,
//     ShowGrid,
//     ShowSection,
//     ShowInfoTable,
//     ShowLocalizedTabs,
// } from '@/components/common/uiComponents/ShowLayout'

// export function CityShow({ city }: { city: CityDetails }) {
//     const { t } = useTranslation()
//     const alert = useAlertModal()

//     const {
//         id,
//         status,
//         postal_code,
//         lat,
//         lng,
//         translations,
//         country_id,
//         name,
//     } = city

//     const { mutateAsync: ChangeCityStatus, isPending: cityPending } =
//         useStatusMutation(
//             String(id),
//             'active',
//             'city',
//             getQueryKeys.getOne('cities', String(id)),
//             [getQueryKeys.all('cities'), getQueryKeys.getOne('countries', String(country_id))],
//         )

//     useEffect(() => {
//         alert.setPending(cityPending)
//     }, [cityPending])

//     const handleCityStatusToggle = async () => {
//         const handler = async () => {
//             await ChangeCityStatus({ status: !status })
//             alert.setIsOpen(false)
//         }

//         alert.setModel({
//             isOpen: true,
//             variant: 'default',
//             title: t('modals.active.title', { entity: t('common.city') }),
//             desc: t('modals.active.desc', { entity: t('common.city') }),
//             pending: cityPending,
//             handleConfirm: handler,
//         })
//     }

//     const en = translations?.en
//     const ar = translations?.ar

//     return (
//         <ShowPage>
//             <ShowHeader>
//                 <ShowTitle>{t('menu.cities')}</ShowTitle>
//                 <ShowActions>
//                     <Link to="/cities/$id" params={{ id: id.toString() }}>
//                         <Button>
//                             <Edit className="w-4 h-4 me-2" />
//                             {t('actions.edit')}
//                         </Button>
//                     </Link>
//                 </ShowActions>
//             </ShowHeader>

//             <ShowSummary>
//                 <ShowSummaryContent>
//                     <ShowSummaryTitle id={id} en={en?.name || name} ar={ar?.name} />
//                 </ShowSummaryContent>
//                 <ShowSummaryStatus
//                     status={status}
//                     onToggle={handleCityStatusToggle}
//                     pending={cityPending}
//                     extra={
//                         <div className="flex flex-col items-end gap-1">
//                             <span className="text-xs text-muted-foreground">
//                                 {t('Form.labels.country')}: {country_id}
//                             </span>
//                         </div>
//                     }
//                 />
//             </ShowSummary>

//             <ShowGrid>
//                 <ShowSection title={t('table.columns.general')}>
//                     <ShowInfoTable
//                         rows={[
//                             { label: t('Form.labels.country'), value: country_id },
//                             { label: t('Form.labels.postalCode'), value: postal_code || '-' },
//                             { label: t('Form.labels.lat'), value: lat },
//                             { label: t('Form.labels.lng'), value: lng },
//                         ]}
//                     />
//                 </ShowSection>

//                 <ShowSection title={t('cityShow.localized.title')}>
//                     <ShowLocalizedTabs
//                         tabs={[
//                             {
//                                 value: 'en',
//                                 label: t('en'),
//                                 rows: [
//                                     { label: t('Form.labels.name'), value: en?.name },
//                                     { label: t('Form.labels.slug'), value: en?.slug },
//                                 ]
//                             },
//                             {
//                                 value: 'ar',
//                                 label: t('ar'),
//                                 rows: [
//                                     { label: t('Form.labels.name'), value: ar?.name },
//                                     { label: t('Form.labels.slug'), value: ar?.slug },
//                                 ]
//                             }
//                         ]}
//                     />
//                 </ShowSection>
//             </ShowGrid>
//         </ShowPage>
//     )
// }
