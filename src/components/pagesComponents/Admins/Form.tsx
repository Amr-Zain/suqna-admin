import AppForm from '@/components/common/form/AppForm'
import useFetch from '@/hooks/UseFetch'
import { useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Admin, AdminFormData } from '@/types/api/admin'
import { fieldsBuilder, adminSchema } from './Config'
import { useTranslation } from 'react-i18next'

interface AdminFormProps {
    admin?: Admin
    onSuccess?: () => void
}

export default function AdminForm({ admin, onSuccess }: AdminFormProps) {
    const { t } = useTranslation()

    const { data: fetchedAdmin, isLoading: isLoadingAdmin } = useFetch<ApiResponse<Admin>>({
        endpoint: admin?.id ? `admins/${admin.id}` : 'admins',
        queryKey: ['admin', admin?.id],
        enabled: !!admin?.id,
    })

    const { mutate, isPending } = useMutate({
        endpoint: admin?.id ? `admins/${admin.id}` : 'admins',
        mutationKey: ['admins', admin?.id],
        mutationOptions: {
            meta: { invalidates: [getQueryKeys.all('admins')] },
        },
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

    const fields = fieldsBuilder(t, !!admin)
    const schema = adminSchema(t, !!admin)

    const activeAdmin = fetchedAdmin?.data || admin

    const defaultValues = useMemo(() => {
        if (!activeAdmin) return {}
        return {
            full_name: activeAdmin.full_name,
            email: activeAdmin.email,
            phone: activeAdmin.phone || '',
            phone_code: activeAdmin.phone_code || '',
            role_id: activeAdmin.role?.id ?? activeAdmin.role_id,
            country_id: activeAdmin.country?.id ?? activeAdmin.country_id,
            image: activeAdmin.image
        }
    }, [activeAdmin])

    if (isLoadingAdmin) {
        return <div className="p-8 text-center">{t('Text.loading')}</div>
    }

    const handleSubmit = (values: AdminFormData) => {
        const fd = new FormData()

        Object.keys(values).forEach((key) => {
            const val = values[key as keyof AdminFormData]
            if (val !== undefined && val !== null) {
                fd.append(key, String(val))
            }
        })

        if (admin?.id) {
            fd.append('_method', 'put')
        }

        mutate(fd as any)
    }

    return (
        <AppForm<AdminFormData>
            schema={schema as any}
            fields={fields}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={1}
            spacing="md"
            formClassName="p-0"
            submitButtonText={
                admin?.id
                    ? t('actions.update', { entity: t('common.admin') })
                    : t('actions.add', { entity: t('common.admin') })
            }
        />
    )
}