import AppForm from '@/components/common/form/AppForm'
import { useMemo, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { TermDetails, TermFormData } from '@/types/api/terms'
import { fieldsBuilder, makeTermSchema } from './Config'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function TermForm({
    term,
    onSuccess,
}: {
    term?: TermDetails
    onSuccess?: () => void
}) {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const schema = useMemo(() => makeTermSchema(t), [t])

    const form = useForm<TermFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(term),
        mode: 'onChange',
    })

    useEffect(() => {
        if (term) {
            form.reset(generateInitialValues(term))
        }
    }, [term, form])

    const { mutate, isPending } = useMutate({
        endpoint: term?.id ? `terms/${term.id}` : 'terms',
        mutationKey: ['terms', term?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('terms')] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            if (onSuccess) {
                onSuccess()
            } else {
                navigate({ to: '/terms' })
            }
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = useMemo(() => fieldsBuilder(t), [t])

    const handleSubmit = (values: TermFormData) => {
        const finalOut = generateFinalOut(term, values)
        if (term?.id) {
            finalOut._method = 'put'
        }
        mutate(finalOut)
    }

    return (
        <AppForm<TermFormData>
            providedForm={form}
            schema={schema as any}
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={2}
            spacing="md"
            formClassName="p-4"
            submitButtonText={
                term?.id
                    ? t('actions.update', { entity: t('common.term') })
                    : t('actions.create', { entity: t('common.term') })
            }
        />
    )
}
