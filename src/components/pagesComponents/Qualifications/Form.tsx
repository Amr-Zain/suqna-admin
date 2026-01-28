import AppForm from '@/components/common/form/AppForm'
import { useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Qualification, QualificationFormData } from '@/types/api/qualification'
import { fieldsBuilder, makeQualificationSchema } from './Config'
import { useTranslation } from 'react-i18next'

export default function QualificationForm({
    qualification,
    onSuccess,
}: {
    qualification?: Qualification
    onSuccess?: () => void
}) {
    const { t } = useTranslation()

    const { mutate, isPending } = useMutate({
        endpoint: qualification?.id ? `qualifications/${qualification.id}` : 'qualifications',
        mutationKey: ['qualifications', qualification?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('qualifications')] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            onSuccess?.()
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const preparedQualification = useMemo(() => {
        if (!qualification) return undefined
        return {
            ...qualification,
            ...qualification as any, // In case languages are spread at root in API
        }
    }, [qualification])

    const fields = fieldsBuilder(t)
    const schema = makeQualificationSchema(t)

    const handleSubmit = (values: QualificationFormData) => {
        const finalOut = generateFinalOut(preparedQualification, values)
        if (qualification?.id) {
            finalOut._method = 'put'
        }
        mutate(finalOut)
    }

    return (
        <AppForm<QualificationFormData>
            schema={schema as any}
            fields={fields}
            defaultValues={generateInitialValues(preparedQualification)}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={2}
            spacing="md"
            formClassName="p-4"
            submitButtonText={
                qualification?.id
                    ? t('actions.update', { entity: t('common.qualification') })
                    : t('actions.create', { entity: t('common.qualification') })
            }
        />
    )
}
