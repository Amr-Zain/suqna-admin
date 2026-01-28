import z from 'zod'
import { useTranslation } from 'react-i18next'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { Control } from 'react-hook-form'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'
import { useAuthStore, UserAuth } from '@/stores/authStore'

import {
  buildEditProfileSchema,
  EditProfileFormData,
} from '@/lib/schema'
import { generateFinalOut } from '@/util/helpers'
import { useState } from 'react'

export default function EditProfileForm({
  initialValues,
}: {
  initialValues: any
}) {
  const { t } = useTranslation()
  const [currentPhoneLimit, setCurrentPhoneLimit] = useState<number>(0)
  const [phoneStartingNumber, setPhoneStartingNumber] = useState<number | null>(null)

  const fields: FieldProp<EditProfileFormData>[] = [
    {
      type: 'imgUploader',
      name: 'avatar',
      label: t('Form.labels.image'),
      span: 2,
      inputProps: {
        maxFiles: 1,
        acceptedFileTypes: ['image/*'],
      },
    },
    {
      type: 'text',
      name: 'name',
      label: t('Form.labels.name'),
      placeholder: t('Form.labels.namePlaceholder'),
    },
    {
      type: 'email',
      name: 'email',
      label: t('Form.labels.email'),
      placeholder: t('Form.labels.emailPlaceholder'),
    },

    {
      type: 'phone',
      name: 'phone',
      label: t('Form.labels.phone'),
      inputProps: {
        phoneCodeName: 'phone_code',
        phoneNumberName: 'phone',
        setCurrentPhoneLimit,
        setPhoneStartingNumber
      },
      span: 2,
    },
  ]
  const setUser = useAuthStore(state => state.setUser)
  const { mutate, isPending } = useMutate<ApiResponse<UserAuth>>({
    mutationKey: ['profile'],
    endpoint: 'profile',
    onSuccess: (data) => {
      setUser(data.data)
      toast.success(data.message)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    method: 'post',
  })

  const handleSubmit = (values: EditProfileFormData) => {
    mutate(generateFinalOut(initialValues, values))
  }

  return (
    <div>
      <AppForm<EditProfileFormData>
        schema={buildEditProfileSchema(t, currentPhoneLimit, phoneStartingNumber) as any}
        fields={fields}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isPending}
        gridColumns={2}
        spacing="md"
        className="bg-card border border-border rounded-lg shadow-sm"
        formClassName="p-6"
        submitButtonText={t('buttons.edit')}
        key={`form_${initialValues?.id ?? 'profile'}`}
      />
    </div>
  )
}
