import AppForm from '@/components/common/form/AppForm'
import { useMemo, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { FAQDetails, FAQFormData } from '@/types/api/faq'
import { fieldsBuilder, makeFAQSchema } from './Config'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function FAQForm({
    faq,
    onSuccess,
}: {
    faq?: FAQDetails
    onSuccess?: () => void
}) {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const schema = useMemo(() => makeFAQSchema(t), [t])

    const form = useForm<FAQFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(faq),
        mode: 'onChange',
    })

    useEffect(() => {
        if (faq) {
            form.reset(generateInitialValues(faq))
        }
    }, [faq, form])

    const { mutate, isPending } = useMutate({
        endpoint: faq?.id ? `questions/${faq.id}` : 'questions',
        mutationKey: ['faqs', faq?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('faqs')] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            if (onSuccess) {
                onSuccess()
            } else {
                navigate({ to: '/faqs' })
            }
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = useMemo(() => fieldsBuilder(t), [t])

    const handleSubmit = (values: FAQFormData) => {
        const finalOut = generateFinalOut(faq, values)
        if (faq?.id) {
            finalOut._method = 'put'
        }
        mutate(finalOut)
    }

    return (
        <AppForm<FAQFormData>
            providedForm={form}
            schema={schema as any}
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={2}
            spacing="md"
            formClassName="p-4"
            submitButtonText={
                faq?.id
                    ? t('actions.update', { entity: t('faq.entity') })
                    : t('actions.create', { entity: t('faq.entity') })
            }
        />
    )
}
