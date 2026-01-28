import { createFileRoute } from '@tanstack/react-router'
import { checkPermission } from '@/util/permissionGuard'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useFetch from '@/hooks/UseFetch'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { makeSettingsSchema, SettingsFormData } from '@/lib/schema'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { RouterContext } from '@/main'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { searchParamsValidate } from '@/types/api/general'

const endpoint = 'settings'

export const Route = createFileRoute('/_main/settings')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    checkPermission('settings.index')
    return context
  },
  validateSearch: (search: Record<string, unknown>) =>
    searchParamsValidate(search),
  loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
  loader: ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext

    queryClient.ensureQueryData(
      prefetchOptions({
        queryKey: getQueryKeys.getFiltered('settings', search as Record<string, unknown>),
        endpoint,
        params: search,
      }),
    )
  },
})

interface SettingItem {
  id: number
  key: string
  value: string
}

function RouteComponent() {
  const { t } = useTranslation()
  const search = Route.useLoaderDeps().search

  const { data, isLoading: isFetching } = useFetch<ApiResponse<SettingItem[]>>({
    queryKey: getQueryKeys.getFiltered('settings', search as Record<string, unknown>),
    endpoint,
    params: search,
    suspense: true,
  })

  const { mutateAsync, isPending: isUpdating } = useMutate<ApiResponse, SettingsFormData>({
    endpoint: 'settings',
    mutationKey: ['settings'],
    method: 'POST',
    mutationOptions: {
      meta: {
        invalidates: [getQueryKeys.all('settings')],
      },
    },
    onSuccess: (res) => {
      toast.success(res.message || t('Form.messages.success'))
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message || t('Form.messages.error'))
    },
  })

  const defaultValues: Partial<SettingsFormData> = {}

  if (data?.data) {
    data.data.forEach((item) => {

      (defaultValues as any)[item.key] = item.value
    })
  }

  const fields: FieldProp<SettingsFormData>[] = [

    {
      name: 'phone',
      label: t('Form.labels.free_ad_count'),
      type: 'text',
      placeholder: t('Form.placeholders.free_ad_count'),
    },
    {
      name: 'email',
      label: t('Form.labels.free_ad_duration'),
      type: 'text',
      placeholder: t('Form.placeholders.free_ad_duration'),
    },
    // {
    //   type:"multiLangField",
    //   name:"title",
    //   label: t('Form.labels.title'),
    //   placeholder: t('Form.placeholders.title'),
    // }
  ]

  const handleSubmit = async (values: SettingsFormData) => {
    await mutateAsync(values)
  }

  return (
    <div className="space-y-4">
      <SmartBreadcrumbs entityKey="menu.settings" />
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">{t('menu.settings')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('Form.labels.general')}
          </p>
        </div>
        <div className="p-6">
          <AppForm<SettingsFormData>
            schema={makeSettingsSchema(t) as any}
            fields={fields}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={isUpdating || isFetching}
            gridColumns={2}
            spacing="lg"
            submitButtonText={t('buttons.save')}
          />
        </div>
      </div>
    </div>
  )
}
