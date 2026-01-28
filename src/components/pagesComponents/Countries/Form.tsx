import AppForm from '@/components/common/form/AppForm'
import { useMemo, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { CountryDetails, CountryFormData } from '@/types/api/country'
import { fieldsBuilder, makeCountrySchema } from './Config'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useFetch from '@/hooks/UseFetch'
import { Skeleton } from '@/components/ui/skeleton'

export default function CountryForm({
  countryId,
  onSuccess,
}: {
  countryId?: string
  onSuccess?: () => void
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Fetch full country data if countryId is provided
  const { data: countryResponse, isLoading: isFetching } = useFetch<ApiResponse<CountryDetails>>({
    endpoint: `countries/${countryId}`,
    queryKey: ['countries', countryId],
    enabled: !!countryId,
  })

  const country = countryResponse?.data

  const schema = useMemo(() => makeCountrySchema(t), [t])

  const form = useForm<CountryFormData>({
    resolver: zodResolver(schema),
    defaultValues: generateInitialValues(country),
    mode: 'onChange',
  })

  useEffect(() => {
    if (country) {
      form.reset(generateInitialValues(country))
    }
  }, [country, form])

  const watchValues = form.watch()

  const { mutate, isPending } = useMutate({
    endpoint: country?.id ? `countries/${country.id}` : 'countries',
    mutationKey: ['countries', country?.id],
    mutationOptions: { meta: { invalidates: [getQueryKeys.all('countries')] } },
    method: 'post',
    onSuccess: (data: ApiResponse) => {
      toast.success(data.message)
      if (onSuccess) {
        onSuccess()
      } else {
        navigate({ to: '/countries' })
      }
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
  })

  const fields = useMemo(() => fieldsBuilder(t, watchValues), [t, watchValues])

  const handleSubmit = (values: CountryFormData) => {
    const finalOut = generateFinalOut(country, values)
    if (country?.id) {
      finalOut._method = 'put'
    }
    if (finalOut.flag) {
      if(!finalOut.flag.startsWith('http')){
        finalOut.flag = { media:finalOut.flag }
      }else{
        delete finalOut.flag
      }
    }
    mutate(finalOut)
  }

  if (isFetching) {
    return (
      <div className="space-y-6 p-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 col-span-2 w-full" />
          <Skeleton className="h-40 col-span-2 w-full" />
          <Skeleton className="h-40 col-span-2 w-full" />
        </div>
      </div>
    )
  }

  return (
    <AppForm<CountryFormData>
      providedForm={form}
      schema={schema as any}
      fields={fields}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      formClassName="p-4"
      submitButtonText={
        country?.id
          ? t('actions.update', { entity: t('common.country') })
          : t('actions.create', { entity: t('common.country') })
      }
    />
  )
}
