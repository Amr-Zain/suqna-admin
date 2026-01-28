import AppForm from '@/components/common/form/AppForm'
import { useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { generateFinalOut, generateInitialValues, transformToBracketNotation } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { aboutFieldsBuilder, makeAboutSchema, AboutFormData } from './Config'
import { useTranslation } from 'react-i18next'
import useFetch from '@/hooks/UseFetch'
import { Skeleton } from '@/components/ui/skeleton'

export default function AboutTab() {
    const { t } = useTranslation()
    const endpoint = 'about'

    const { data: aboutData, isLoading: isFetching } = useFetch<ApiResponse<any>>({
        queryKey: getQueryKeys.all('about'),
        endpoint,
    })

    const about = aboutData?.data

    const { mutate, isPending } = useMutate({
        endpoint,
        mutationKey: ['about-update'],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('about')] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message || t('Form.messages.success'))
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message || t('Form.messages.error'))
        },
    })

    const preparedAbout = useMemo(() => {
        if (!about) return undefined
        return {
            ...about,
            ar: about.translations?.ar,
            en: about.translations?.en,
            image: about.image ? { ...about.image, mime_type: 'image/' } : undefined,
        }
    }, [about])

    const fields = aboutFieldsBuilder(t)
    const handleSubmit = (values: AboutFormData) => {
        mutate(transformToBracketNotation(values))
    }
    const schema = makeAboutSchema(t)

    if (isFetching) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    return (
        <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-6">
                <AppForm<AboutFormData>
                    schema={schema as any}
                    fields={fields}
                    defaultValues={generateInitialValues(preparedAbout)}
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                    gridColumns={2}
                    spacing="md"
                    formClassName="p-4"
                    submitButtonText={t('buttons.save')}
                />
            </div>
        </div>
    )
}
