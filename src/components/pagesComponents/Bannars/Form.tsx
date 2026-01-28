import AppForm from '@/components/common/form/AppForm'
import { useMemo, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Bannar, BannarFormData } from '@/types/api/bannar'
import { fieldsBuilder, makeBannarSchema } from './Config'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function BannarForm({
    bannar,
    onSuccess,
}: {
    bannar?: Bannar
    onSuccess?: () => void
}) {
    const { t } = useTranslation()
    const schema = useMemo(() => makeBannarSchema(t), [t])

    const form = useForm<BannarFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(bannar),
        mode: 'onChange',
    })

    useEffect(() => {
        form.reset(generateInitialValues(bannar))
    }, [bannar, form])

    const watchValues = form.watch()

    const { mutate, isPending } = useMutate({
        endpoint: bannar?.id ? `bannars/${bannar.id}` : 'bannars',
        mutationKey: ['bannars', bannar?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('bannars')] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            onSuccess?.()
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = useMemo(() => fieldsBuilder(t, watchValues), [t, watchValues])

    const handleSubmit = (values: BannarFormData) => {
        const finalOut = generateFinalOut(bannar, values)
        if (bannar?.id) {
            finalOut._method = 'put'
        }
        mutate(finalOut)
    }

    return (
        <AppForm<BannarFormData>
            providedForm={form}
            schema={schema as any}
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={2}
            spacing="md"
            formClassName="p-4"
            submitButtonText={
                bannar?.id
                    ? t('actions.update', { entity: t('common.bannar') })
                    : t('actions.create', { entity: t('common.bannar') })
            }
        />
    )
}
