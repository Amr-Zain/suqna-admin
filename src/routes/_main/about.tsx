import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useFetch from '@/hooks/UseFetch'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { AboutDetails, AboutFormData } from '@/types/api/about'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { RouterContext } from '@/main'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { requiredString, TFn } from '@/lib/schema/validation'
import z from 'zod'
import { useMemo, useEffect } from 'react'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkPermission } from '@/util/permissionGuard'

const endpoint = 'about'

export const Route = createFileRoute('/_main/about')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('about.index')
        return context
    },
    loader: ({ context }) => {
        const { queryClient } = context as RouterContext

        queryClient.ensureQueryData(
            prefetchOptions({
                queryKey: getQueryKeys.all('about'),
                endpoint,
            }),
        )
    },
})

const makeAboutSchema = (t: TFn) => {
    const languages = ['ar', 'en', 'fr', 'ur', 'tr', 'sw', 'bn', 'si']
    const langSchema: any = {}

    languages.forEach((lang) => {
        langSchema[`text_${lang}`] = lang === 'ar' || lang === 'en'
            ? requiredString(t, t('Form.labels.text'))
            : z.string().optional()
    })

    return z.object({
        ...langSchema,
    })
}

function RouteComponent() {
    const { t } = useTranslation()

    const { data, isLoading: isFetching } = useFetch<ApiResponse<AboutDetails>>({
        queryKey: getQueryKeys.all('about'),
        endpoint,
        suspense: true,
    })

    const { mutateAsync, isPending: isUpdating } = useMutate<ApiResponse, AboutFormData>({
        endpoint: 'about',
        mutationKey: getQueryKeys.all('about'),
        method: 'POST',
        mutationOptions: {
            meta: {
                invalidates: [['about']],
            },
        },
        onSuccess: (res) => {
            toast.success(res.message || t('Form.messages.success'))
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message || t('Form.messages.error'))
        },
    })

    const schema = useMemo(() => makeAboutSchema(t), [t])

    const form = useForm<AboutFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(data?.data),
        mode: 'onChange',
    })

    useEffect(() => {
        if (data?.data) {
            form.reset(generateInitialValues(data.data))
        }
    }, [data, form])

    const fields: FieldProp<AboutFormData>[] = [
        {
            type: 'multiLangField',
            name: 'text' as any,
            label: t('Form.labels.text'),
            placeholder: t('Form.placeholders.text'),
            inputProps: {
                type: 'editor',
            },
            span: 2,
        },
    ]

    const handleSubmit = async (values: AboutFormData) => {
        const finalOut = generateFinalOut(data?.data, values)
        await mutateAsync(finalOut)
    }

    return (
        <div className="space-y-4">
            <SmartBreadcrumbs entityKey="menu.about" />
            <div className="bg-card border border-border rounded-lg shadow-sm">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">{t('menu.about')}</h2>
                </div>
                <div className="p-6 max-w-5xl mx-auto">
                    <AppForm<AboutFormData>
                        providedForm={form}
                        schema={schema as any}
                        fields={fields}
                        onSubmit={handleSubmit}
                        isLoading={isUpdating || isFetching}
                        gridColumns={1}
                        spacing="lg"
                        submitButtonText={t('buttons.save')}
                    />
                </div>
            </div>
        </div>
    )
}
