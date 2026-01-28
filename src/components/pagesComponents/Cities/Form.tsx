import AppForm from '@/components/common/form/AppForm'
import { useMemo, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { CityDetails, CityFormData } from '@/types/api/city'
import { fieldsBuilder, makeCitySchema } from './Config'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useFetch from '@/hooks/UseFetch'
import { Skeleton } from '@/components/ui/skeleton'

export default function CityForm({
    cityId,
    onSuccess,
}: {
    cityId?: string
    onSuccess?: () => void
}) {
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Fetch full city data if cityId is provided
    const { data: cityResponse, isLoading: isFetching } = useFetch<ApiResponse<CityDetails>>({
        endpoint: `cities/${cityId}`,
        queryKey: ['cities', cityId],
        enabled: !!cityId,
    })

    const city = cityResponse?.data

    const schema = useMemo(() => makeCitySchema(t), [t])

    const form = useForm<CityFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(city),
        mode: 'onChange',
    })

    useEffect(() => {
        if (city) {
            form.reset({ ...generateInitialValues(city), country_id: city.country?.id })
        }
    }, [city, form])


    const { mutate, isPending } = useMutate({
        endpoint: city?.id ? `cities/${city.id}` : 'cities',
        mutationKey: ['cities', city?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('cities')] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            if (onSuccess) {
                onSuccess()
            } else {
                navigate({ to: '/cities' })
            }
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = useMemo(() => fieldsBuilder(t), [t])

    const handleSubmit = (values: CityFormData) => {
        const finalOut = generateFinalOut(city, values)
        if (city?.id) {
            finalOut._method = 'put'
        }
        mutate(finalOut)
    }

    if (isFetching) {
        return (
            <div className="space-y-6 p-4">
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 col-span-2 w-full" />
                </div>
            </div>
        )
    }

    return (
        <AppForm<CityFormData>
            providedForm={form}
            schema={schema as any}
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={2}
            spacing="md"
            formClassName="p-4"
            submitButtonText={
                city?.id
                    ? t('actions.update', { entity: t('common.city') })
                    : t('actions.create', { entity: t('common.city') })
            }
        />
    )
}
