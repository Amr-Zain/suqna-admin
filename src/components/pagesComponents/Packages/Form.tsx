import AppForm from '@/components/common/form/AppForm'
import { useMemo, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { PackageDetails } from '@/types/api/package'
import { fieldsBuilder, makePackageSchema } from './Config'
import { PackageFormData } from '@/types/api/package'
import { useTranslation } from 'react-i18next'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function PackageForm({ pkg }: { pkg?: PackageDetails }) {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const schema = useMemo(() => makePackageSchema(t), [t])

    const preparedPackage = useMemo(() => {
        if (!pkg) return undefined
        return {
            ...pkg,
            ...pkg.translations,
        }
    }, [pkg])

    const form = useForm<PackageFormData>({
        resolver: zodResolver(schema),
        defaultValues: generateInitialValues(preparedPackage),
        mode: 'onChange',
    })

    const watchType = useWatch({
        control: form.control,
        name: 'type',
    })

    const { mutate, isPending } = useMutate({
        endpoint: pkg?.id ? `packages/${pkg.id}` : 'packages',
        mutationKey: ['packages', pkg?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('packages' as any)] } },
        method: 'post',
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            navigate({ to: '/packages' })
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const fields = useMemo(() => fieldsBuilder(t, watchType), [t, watchType])

    const handleSubmit = (values: PackageFormData) => {
        const finalOut = generateFinalOut(preparedPackage, values)
        if (pkg?.id) {
            finalOut._method = 'put'
        }

        if (typeof finalOut.is_active !== 'undefined') {
            finalOut.is_active = finalOut.is_active ? 1 : 0
        }

        mutate(finalOut)
    }

    return (
        <AppForm<PackageFormData>
            providedForm={form}
            schema={schema as any}
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={2}
            spacing="md"
            className="bg-card border border-border rounded-lg shadow-sm max-w-5xl mx-auto mt-8"
            formClassName="p-6"
            submitButtonText={
                pkg?.id
                    ? t('actions.update', { entity: t('common.package') })
                    : t('actions.create', { entity: t('common.package') })
            }
        />
    )
}
