import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AppForm from '../../common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { useMutate } from '@/hooks/UseMutate'
import { useAuthStore, UserAuth } from '@/stores/authStore'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { ApiResponse } from '@/types/api/http'
import { Logo } from '@/components/common/Icons'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function LoginForm() {
  const { t } = useTranslation()
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  const loginSchema = useMemo(
    () =>
      z.object({
        auth: z.string().email(t('Validation.email')),
        password: z.string().min(6, t('Validation.passwordMin', { min: 6, field: t('Auth.fields.password.label') })),
      }),
    [t],
  )
  type LoginFormValues = z.infer<typeof loginSchema>
  const { mutate, isPending } = useMutate<ApiResponse<UserAuth>>({
    endpoint: 'login',
    mutationKey: ['login'],
    onSuccess: (data) => {
      const userData = data?.data
      if (userData) {
        setUser(userData)
      }
      toast.success(data.message)
      navigate({ to: '/', replace: true })
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
  })

  const fields: FieldProp<LoginFormValues>[] = [
    {
      type: 'email',
      name: 'auth',
      label: t('Auth.fields.email.label'),
      placeholder: t('Auth.fields.email.placeholder'),
      span: 2,
    },
    {
      type: 'password',
      name: 'password',
      label: t('Auth.fields.password.label'),
      placeholder: t('Auth.fields.password.placeholder'),
      span: 2,
    },
  ]

  const onSubmit = async (values: LoginFormValues) => {
    mutate(values)
  }

  return (
    <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-32 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Logo />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">
          {t('Auth.login.title')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('Auth.login.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppForm<LoginFormValues>
          schema={loginSchema}
          fields={fields}
          onSubmit={onSubmit}
          isLoading={isPending}
          gridColumns={1}
          spacing="lg"
          className="bg-card border border-border rounded-lg shadow-sm"
          formClassName="p-6"
        />
      </CardContent>
    </Card>
  )
}
