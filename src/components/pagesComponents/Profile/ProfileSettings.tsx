import z from 'zod'
import { useTranslation } from 'react-i18next'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import {
  buildProfileSettingsSchema,
  ProfileSettingsFormData,
} from '@/lib/schema'



export default function ProfileSettings() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const fields: FieldProp<ProfileSettingsFormData>[] = [
    {
      type: 'checkbox',
      name: 'is_notify',
      label: t('Form.labels.allow_notifications'),
      span: 2,
    },
    {
      type: 'select',
      name: 'locale',
      inputProps: {
        placeholder: 'prefered language',
        options: [
          { label: 'Arabic', value: 'ar' },
          { label: 'English', value: 'en' },
        ],
      },
      label: t('Form.labels.language'),
      placeholder: t('Form.labels.newPasswordPlaceholder'),
    },
  ]


  const { mutateAsync, isPending } = useMutate<ApiResponse, any>({
    mutationKey: ['rofile/settings'],
    endpoint: 'profile/settings',
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
    method: 'POST',
  })

  const handleSubmit = async (values: ProfileSettingsFormData) => {
    await mutateAsync(values)
    updateUser({
      locale: values.locale,
      is_notify: values.is_notify,
    })
  }

  return (
    <AppForm<ProfileSettingsFormData>
      schema={buildProfileSettingsSchema(t)}
      fields={fields}
      defaultValues={{
        is_notify: user?.is_notify,
        locale: user?.locale as any,
      }}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      className="bg-card border border-border rounded-lg shadow-sm"
      formClassName="p-6"
      submitButtonText={t('buttons.edit')}
    />
  )
}
