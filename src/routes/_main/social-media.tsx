import { createFileRoute } from '@tanstack/react-router'
import { checkPermission } from '@/util/permissionGuard'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useFetch from '@/hooks/UseFetch'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { makeSocialMediaSchema, SocialMediaFormData } from '@/lib/schema'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { RouterContext } from '@/main'
import { prefetchOptions } from '@/util/preFetcher'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { searchParamsValidate } from '@/types/api/general'

const endpoint = 'data/social-media'

export const Route = createFileRoute('/_main/social-media')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    checkPermission('socialmedia.index')
    return context
  },
  validateSearch: (search: Record<string, unknown>) =>
    searchParamsValidate(search),
  loaderDeps: ({ search }) => ({ search: searchParamsValidate(search) }),
  loader: ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext

    queryClient.ensureQueryData(
      prefetchOptions({
        queryKey: getQueryKeys.getFiltered('social-media', search as Record<string, unknown>),
        endpoint,
        params: search,
        general: true,
      }),
    )
  },
})

interface SocialMediaItem {
  id: number
  platform: string
  link: string
}

function RouteComponent() {
  const { t } = useTranslation()
  const search = Route.useLoaderDeps().search

  const { data, isLoading: isFetching } = useFetch<ApiResponse<SocialMediaItem[]>>({
    queryKey: getQueryKeys.getFiltered('social-media', search as Record<string, unknown>),
    endpoint,
    params: search,
    general: true,
    suspense: true,
  })

  const { mutateAsync, isPending: isUpdating } = useMutate<ApiResponse, SocialMediaFormData>({
    endpoint: 'social-media',
    mutationKey: ['social-media'],
    method: 'POST',
    mutationOptions: {
      meta: {
        invalidates: [getQueryKeys.all('social-media')],
      },
    },
    onSuccess: (res) => {
      toast.success(res.message || t('Form.messages.success'))
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message || t('Form.messages.error'))
    },
  })

  const defaultValues: Partial<SocialMediaFormData> = {}
  if (data?.data) {
    data.data.forEach((item) => {
      if (item.platform in ({} as SocialMediaFormData)) {
        // This is a bit tricky with TS, but we know the platforms
      }
      (defaultValues as any)[item.platform] = item.link
    })
  }
  console.log(defaultValues)

  const fields: FieldProp<SocialMediaFormData>[] = [
    {
      name: 'facebook',
      label: t('Form.labels.facebook'),
      type: 'text',
      placeholder: 'https://facebook.com/your-page',
    },
    {
      name: 'instagram',
      label: t('Form.labels.instagram'),
      type: 'text',
      placeholder: 'https://instagram.com/your-profile',
    },
    {
      name: 'twitter',
      label: t('Form.labels.twitter'),
      type: 'text',
      placeholder: 'https://twitter.com/your-handle',
    },
    {
      name: 'linkedin',
      label: t('Form.labels.linkedin'),
      type: 'text',
      placeholder: 'https://linkedin.com/in/your-profile',
    },
    {
      name: 'youtube',
      label: t('Form.labels.youtube'),
      type: 'text',
      placeholder: 'https://youtube.com/c/your-channel',
    },
    {
      name: 'tiktok',
      label: t('Form.labels.tiktok'),
      type: 'text',
      placeholder: 'https://tiktok.com/@your-handle',
    },
  ]

  const handleSubmit = async (values: SocialMediaFormData) => {
    await mutateAsync(values)
  }

  return (
    <div className="space-y-4">
      <SmartBreadcrumbs entityKey="menu.socialMedia" />
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">{t('menu.socialMedia')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('Form.labels.general')}
          </p>
        </div>
        <div className="p-6">
          <AppForm<SocialMediaFormData>
            schema={makeSocialMediaSchema(t)}
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

