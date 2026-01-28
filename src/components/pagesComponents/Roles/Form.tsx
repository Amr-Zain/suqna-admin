import AppForm from '@/components/common/form/AppForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState, useEffect } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
// import { useNavigate } from '@tanstack/react-router'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { RoleDetails, RoleFormData, Permission } from '@/types/api/role'
import { fieldsBuilder, makeRoleSchema } from './Config'
import { useTranslation } from 'react-i18next'
import useFetch from '@/hooks/UseFetch'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

interface RoleFormProps {
    role?: RoleDetails
    onSuccess?: () => void
}

export default function RoleForm({ role, onSuccess }: RoleFormProps) {
    const { t } = useTranslation()
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

    const { data: permissionsData, isLoading: isLoadingPermissions } = useFetch<ApiResponse<Permission[]>>({
        queryKey: ['permissions-list'],
        endpoint: 'permissionlistWithoutPagination',
        staleTime: 60 * 60 * 1000 * 24,
    })

    // Categorize permissions client-side
    const categorizedData = useMemo(() => {
        if (!permissionsData?.data) return {}
        const groups: Record<string, Permission[]> = {}
        permissionsData.data.forEach(p => {
            const cat = p.back_route_name ? p.back_route_name.split('.')[0] : 'General'
            if (!groups[cat]) groups[cat] = []
            groups[cat].push(p)
        })
        return groups
    }, [permissionsData])

    const { mutate, isPending } = useMutate({
        endpoint: role?.id ? `roles/${role.id}` : 'roles',
        mutationKey: ['role', role?.id],
        mutationOptions: { meta: { invalidates: [getQueryKeys.all('roles')] } },
        method: role?.id ? 'post' : 'post', // Update typically uses POST with _method=put in this API
        formData: true,
        onSuccess: (data: ApiResponse) => {
            toast.success(data.message)
            onSuccess?.()
        },
        onError: (_err, normalized) => {
            toast.error(normalized.message)
        },
    })

    const schema = makeRoleSchema(t)
    const form = useForm<RoleFormData>({
        resolver: zodResolver(schema),
        defaultValues: role ? {
            name_ar: role.name_ar,
            name_en: role.name_en || '',
            permissions: role.permissions?.map(p => p.id) || role.permission?.map(p => p.id) || []
        } : { name_ar: '', name_en: '', permissions: [] }
    })

    useEffect(() => {
        if (role) {
            const perms = role.permissions || role.permission;
            const ids = perms ? perms.map(p => p.id) : [];
            setSelectedPermissions(ids)

            form.reset({
                name_ar: role.name_ar || '',
                name_en: role.name_en || '',
                permissions: ids
            })
        }
    }, [role, form])

    const allIds = useMemo(() => {
        if (!permissionsData?.data) return []
        return permissionsData.data.map(p => p.id)
    }, [permissionsData])

    const isAllSelected = useMemo(() => {
        return allIds.length > 0 && allIds.every((id) => selectedPermissions.includes(id))
    }, [allIds, selectedPermissions])

    useEffect(() => {
        form.setValue('permissions', selectedPermissions, { shouldValidate: true })
    }, [selectedPermissions, form])

    const fields = fieldsBuilder(t)

    const togglePermission = (id: number) => {
        setSelectedPermissions(prev => {
            const newSelection = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
            return newSelection
        })
    }

    const toggleCategory = (categoryPermissions: { id: number }[]) => {
        const categoryIds = categoryPermissions.map(p => p.id)
        const allSelected = categoryIds.every(id => selectedPermissions.includes(id))

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !categoryIds.includes(id)))
        } else {
            setSelectedPermissions(prev => Array.from(new Set([...prev, ...categoryIds])))
        }
    }

    const handleSubmit = (values: any) => {
        const fd = {} as any
        fd.en = { name: values.name_en }
        fd.ar = { name: values.name_ar }
        fd.permission_ids = values.permissions

        if (role?.id) {
            fd._method = 'put'
        }

        mutate(fd)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto mt-8">
            <AppForm<RoleFormData>
                providedForm={form}
                schema={schema as any}
                fields={fields}
                onSubmit={handleSubmit}
                isLoading={isPending}
                gridColumns={2}
                spacing="md"
                className="bg-card border border-border rounded-lg shadow-sm"
                formClassName="p-6"
                submitButtonText={
                    role?.id
                        ? t('actions.update', { entity: t('common.role') })
                        : t('actions.create', { entity: t('common.role') })
                }
            >
                <div className="col-span-2 space-y-4 px-6 pb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{t('Form.labels.permissions')}</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (isAllSelected) {
                                    setSelectedPermissions([])
                                } else {
                                    setSelectedPermissions(allIds)
                                }
                            }}
                        >
                            {isAllSelected ? t('actions.deselectAll') : t('actions.selectAll')}
                        </Button>
                    </div>
                    <Separator />
                    {isLoadingPermissions ? (
                        <div className="py-10 text-center text-muted-foreground">{t('Text.loading')}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {categorizedData && Object.entries(categorizedData).map(([category, perms]) => (
                                <Card key={category} className="shadow-none border-border p-2 gap-0">
                                    <CardHeader className="py-0 px-4 bg-muted/30 pt-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-bold uppercase tracking-wider">{t(`permission_categories.${category}`, { defaultValue: category })}</CardTitle>
                                            <Checkbox
                                                id={`category-${category}`}
                                                checked={perms.every(p => selectedPermissions.includes(p.id))}
                                                onCheckedChange={() => toggleCategory(perms)}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 grid grid-cols-1 gap-2">
                                        {perms.map(p => (
                                            <div key={p.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`perm-${p.id}`}
                                                    checked={selectedPermissions.includes(p.id)}
                                                    onCheckedChange={() => togglePermission(p.id)}
                                                />
                                                <Label htmlFor={`perm-${p.id}`} className="text-xs cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {p.title}
                                                </Label>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </AppForm>
        </div>
    )
}
