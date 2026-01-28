import AppForm from '@/components/common/form/AppForm'
import { useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { Permission } from '@/types/api/role'
import { fieldsBuilder, permissionSchema } from './Config'
import { useTranslation } from 'react-i18next'

interface PermissionFormProps {
    permission?: Permission
    onSuccess?: () => void
}

export default function PermissionForm({ permission, onSuccess }: PermissionFormProps) {
    const { t } = useTranslation()

    const { mutate, isPending } = useMutate({
        endpoint: permission?.id ? `permissions/${permission.id}` : 'permissions',
        mutationKey: ['permissions', permission?.id],
        mutationOptions: {
            meta: { invalidates: [getQueryKeys.all('permissions')] },
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

    const fields = fieldsBuilder(t)
    const schema = permissionSchema(t)

    const defaultValues = useMemo(() => {
        if (!permission) return {}
        return {
            front_route_name: permission.front_route_name,
            // Use specific localized titles if available, otherwise fallback to title/empty
            'en[title]': permission.title_en || permission.title,
            'ar[title]': permission.title_ar || '',
            icon: permission.icon
        }
    }, [permission])

    const handleSubmit = (values: any) => {
        const fd = new FormData()

        // Append basic fields, handling nested array keys if any (not expected here except en[title])
        Object.keys(values).forEach((key) => {
            const val = values[key]
            if (val !== undefined && val !== null) {
                if (key === 'icon') {
                    if (val instanceof File) {
                        fd.append(key, val)
                    }
                } else {
                    fd.append(key, String(val))
                }
            }
        })

        // Ensure en[title] and ar[title] are handled if Object.keys didn't catch them correctly due to some transformation, 
        // but typically values will have keys 'en[title]' if that's what we registered.
        // However, if we use dot notation in schema/register (unlikely with this setup), we might need manual append.
        // The fieldsBuilder uses 'en[title]' as name, so values will have that key.

        if (permission?.id) {
            // fd.append('_method', 'put') // Postman didn't imply _method for permissions, but usually required for dirty updates via POST
        }

        mutate(fd as any)
    }

    return (
        <AppForm<any>
            schema={schema as any}
            fields={fields}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={isPending}
            gridColumns={1}
            spacing="md"
            formClassName="p-0"
            submitButtonText={
                permission?.id
                    ? t('actions.update', { entity: t('menu.permissions') })
                    : t('actions.add', { entity: t('menu.permissions') })
            }
        />
    )
}
