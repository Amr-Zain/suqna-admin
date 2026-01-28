import AppForm from '@/components/common/form/AppForm'
import { useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { StaticPage, StaticPageFormData } from '@/types/api/staticPage'
import { fieldsBuilder, makeStaticPageSchema } from './Config'
import { useTranslation } from 'react-i18next'

interface StaticPageFormProps {
    staticPage?: StaticPage
    type?: string
}

export default function StaticPageForm({ staticPage, type }: StaticPageFormProps) {
    const navigate = useNavigate()
    const { t } = useTranslation()

    // If we have a page, use its type, otherwise fallback to the prop (though for update strictly we expect staticPage to be present)
    const pageType = staticPage?.type || type

    const { mutate, isPending } = useMutate({
        endpoint: `page/${pageType}`,
        mutationKey: ['page', pageType],
        mutationOptions: {
            meta: {
                invalidates: [
                    getQueryKeys.all('page' as any),
                    getQueryKeys.getOne('page', pageType || '')
                ]
            }
        },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            navigate({ to: '/pages' })
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const preparedData = useMemo(() => {
        if (!staticPage) return undefined
        return {
            ...staticPage,
            ar: staticPage.translations?.ar,
            en: staticPage.translations?.en,
        }
    }, [staticPage])

    const fields = fieldsBuilder(t)
    const schema = makeStaticPageSchema(t)

    const handleSubmit = (values: StaticPageFormData) => {
        const finalOut: any = generateFinalOut(preparedData, values)
        //finalOut._method = 'put';
        mutate(finalOut)
    }

    return (
        <AppForm<StaticPageFormData>
            schema={schema as any}
            fields={fields}
            defaultValues={generateInitialValues(preparedData)}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={1}
            spacing="md"
            className="bg-card border border-border rounded-lg shadow-sm max-w-5xl mx-auto mt-8"
            formClassName="p-6"
            submitButtonText={t('actions.update', { entity: t('common.page') })}
        />
    )
}
