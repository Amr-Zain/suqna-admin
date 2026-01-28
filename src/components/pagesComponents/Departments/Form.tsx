
import AppForm from '@/components/common/form/AppForm'
import { useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Department } from '@/types/api/department'
import { fieldsBuilder, makeDepartmentSchema, DepartmentFormData } from './Config'
import { useTranslation } from 'react-i18next'

interface DepartmentFormProps {
    department?: Department
    onSuccess?: () => void
}

export default function DepartmentForm({ department, onSuccess }: DepartmentFormProps) {
    const { t } = useTranslation()

    const { mutate, isPending } = useMutate({
        endpoint: department?.id ? `departments/${department.id}` : 'departments',
        mutationKey: ['departments', department?.id],
        mutationOptions: {
            meta: { invalidates: [getQueryKeys.all('departments')] },
        },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            onSuccess?.()
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = fieldsBuilder(t)
    const schema = makeDepartmentSchema(t)

    const handleSubmit = (values: DepartmentFormData) => {
        console.log(values)
        const finalOut = generateFinalOut(department, values)
        if (department?.id) {
            finalOut['_method'] = 'put'
        }

        // Check if we need FormData (if image is a File)
        // Assuming useMutate or the fetcher handles object -> FormData conversion if needed,
        // or we might need to do it here manually if the system requires it.
        // Given the instructions, we adhere to generateFinalOut.

        mutate(finalOut)
    }

    return (
        <AppForm<DepartmentFormData>
            schema={schema as any}
            fields={fields}
            defaultValues={generateInitialValues(department)}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={1}
            spacing="md"
            formClassName="p-0"
            submitButtonText={
                department?.id
                    ? t('actions.update', { entity: t('common.department') })
                    : t('actions.create', { entity: t('common.department') })
            }
        />
    )
}
