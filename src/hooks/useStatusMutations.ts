import { ApiResponse } from '@/types/api/http'
import { useTranslation } from 'react-i18next'
import { useMutate } from './UseMutate'
import { toast } from 'sonner'
import { QueryKey } from '@tanstack/react-query'
export type PickedAction =
  | 'active'
  | 'inactive'
  | 'delete'
  | 'verify'
  | 'ban'
  | 'suspend'
  | 'allow_notifications'
  | 'read_note'
  | 'upgrade'

export const useStatusMutation = (
  id: string,
  type: PickedAction,
  endpoint: string,
  mutationKey: QueryKey,
  invalidates: QueryKey[],
  baseURL?: string,
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete',
) => {
  const { t } = useTranslation()
  const defaultMethod = type === 'delete' ? 'delete' : 'put'
  const toggleMutation = {
    mutationKey,
    endpoint: `${endpoint}/${id}`,
    method: method ?? defaultMethod,
    successMessage: type === 'delete' ? t('deleted_successfully') : t('status_changed_successfully'),
  } as const

  const { mutateAsync, isPending } = useMutate<ApiResponse>({
    mutationKey: toggleMutation.mutationKey,
    endpoint: toggleMutation.endpoint,
    method: toggleMutation.method,
    mutationOptions: {
      meta: { invalidates: invalidates },
    },
    onSuccess: (data) => {
      toast.success(data.message || toggleMutation.successMessage)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    customBaseUrl: baseURL,
  })

  return { mutateAsync, isPending }
}
