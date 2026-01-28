import AppForm from '@/components/common/form/AppForm'
import { useEffect, useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Client, ClientFormData } from '@/types/api/client'
import { fieldsBuilder, makeClientSchema } from './Config'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function ClientForm({
    client,
    onSuccess,
}: {
    client?: Client
    onSuccess?: () => void
}) {
    const { t } = useTranslation()
    const isEdit = !!client?.id

    const schema = useMemo(() => makeClientSchema(t, isEdit), [t, isEdit])

    const form = useForm<ClientFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(client),
        mode: 'onChange',
    })

    useEffect(() => {
        if (client) {
            form.reset(generateInitialValues(client))
        }
    }, [client, form])

    const { mutate, isPending } = useMutate({
        endpoint: isEdit ? `clients/${client?.id}` : 'clients',
        mutationKey: ['clients', client?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('clients')] } },
        method: 'post',
        formData: true,
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            onSuccess?.()
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = useMemo(() => fieldsBuilder(t, isEdit), [t, isEdit])

    const handleSubmit = (values: ClientFormData) => {
        const finalValues = generateFinalOut(client, values)

        const fd = new FormData()

        Object.keys(finalValues).forEach(key => {
            const val = finalValues[key]
            if (val !== undefined && val !== null) {
                fd.append(key, String(val))
            }
        })

        if (isEdit) {
            fd.append('_method', 'put')
        }

        mutate(fd as any)
    }

    return (
        <AppForm<ClientFormData>
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
                    ? t('actions.update', { entity: t('common.client') })
                    : t('actions.create', { entity: t('common.client') })
            }
        />
    )
}
