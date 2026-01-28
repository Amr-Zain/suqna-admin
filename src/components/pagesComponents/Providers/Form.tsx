import AppForm from '@/components/common/form/AppForm'
import { useMemo, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Provider, ProviderFormData } from '@/types/api/provider'
import { fieldsBuilder, makeProviderSchema } from './Config'
import { useTranslation } from 'react-i18next'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function ProviderForm({
    provider,
    onSuccess,
}: {
    provider?: Provider
    onSuccess?: () => void
}) {
    const { t } = useTranslation()
    const isEdit = !!provider?.id

    const schema = useMemo(() => makeProviderSchema(t, isEdit), [t, isEdit])

    const form = useForm<ProviderFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(provider),
        mode: 'onChange',
    })

    const watchType = useWatch({
        control: form.control,
        name: 'user_type',
    })

    const watchCountry = useWatch({
        control: form.control,
        name: 'country_id',
    })

    useEffect(() => {
        if (provider) {
            form.reset(generateInitialValues(provider))
        }
    }, [provider, form])

    const { mutate, isPending } = useMutate({
        endpoint: isEdit ? `providers/${provider?.id}` : 'providers',
        mutationKey: ['providers', provider?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('providers')] } },
        method: 'post',
        formData: true, // Use form-data as per Postman image
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            onSuccess?.()
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = useMemo(() => fieldsBuilder(t, isEdit, watchType, watchCountry), [t, isEdit, watchType, watchCountry])

    const handleSubmit = (values: ProviderFormData) => {
        const finalValues = generateFinalOut(provider, values)

        // Manual conversion to FormData to support brackets notation for Laravel
        const fd = new FormData()

        Object.keys(finalValues).forEach(key => {
            const val = finalValues[key]

            if (key === 'departments' && Array.isArray(val)) {
                val.forEach((id, index) => {
                    fd.append(`departments[${index}][id]`, String(id))
                })
            } else if (val !== undefined && val !== null) {
                fd.append(key, String(val))
            }
        })

        if (isEdit) {
            fd.append('_method', 'put')
        }

        mutate(fd as any)
    }

    return (
        <AppForm<ProviderFormData>
            providedForm={form}
            schema={schema as any}
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={2}
            spacing="md"
            formClassName="p-4"
            submitButtonText={
                isEdit
                    ? t('actions.update', { entity: t('common.provider') })
                    : t('actions.create', { entity: t('common.provider') })
            }
        />
    )
}
