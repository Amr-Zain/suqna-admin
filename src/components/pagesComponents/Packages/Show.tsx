import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PackageDetails } from '@/types/api/package'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Edit, Package, Clock, DollarSign, LayoutGrid, CheckCircle2, XCircle, UserCircle, Briefcase, Power } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { formatDate, getModalTitle } from '@/util/helpers'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { useEffect } from 'react'

export default function PackageShow({ pkg }: { pkg: PackageDetails }) {
    const { t } = useTranslation()
    const alert = useAlertModal()

    const { mutateAsync: ChangeStatusMutate, isPending: statusPending } =
        useStatusMutation(
            `${pkg.id}/toggle`,
            'active',
            'packages',
            getQueryKeys.getOne('packages', String(pkg.id)),
            [getQueryKeys.all('packages' as any)],
            undefined,
            'post'
        )

    useEffect(() => {
        alert.setPending(statusPending)
    }, [statusPending])

    const handleToggleStatus = () => {
        const handler = async () => {
            await ChangeStatusMutate({ _method: 'put' })
            alert.setIsOpen(false)
        }
        const { title, desc } = getModalTitle('active', 'package', t)
        alert.setModel({
            isOpen: true,
            variant: 'default',
            title,
            desc,
            pending: statusPending,
            handleConfirm: handler,
        })
        alert.setHandler(handler)
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('menu.packages')}</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleToggleStatus}
                        className={pkg.is_active ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-green-500 hover:text-green-600 hover:bg-green-50"}
                    >
                        <Power className="w-4 h-4 me-2" />
                        {pkg.is_active ? t('actions.deactivate') || 'Deactivate' : t('actions.activate') || 'Activate'}
                    </Button>
                    <Link
                        to={`/packages/$id`}
                        params={{ id: pkg.id.toString() }}
                    >
                        <Button>
                            <Edit className="w-4 h-4 me-2" />
                            {t('actions.edit')}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <Card className="md:col-span-1 border-t-4 border-t-primary">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="size-16 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                <Package className="size-8" />
                            </div>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <CardDescription>
                            {pkg.price} SAR / {pkg.duration_translated}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <Separator />
                        <div className="space-y-3 font-medium">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t('table.columns.status')}</span>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer transition-colors ${pkg.is_active
                                        ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                                        : "bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                                        }`}
                                    onClick={handleToggleStatus}
                                >
                                    {pkg.is_active ? (
                                        <>
                                            <CheckCircle2 className="size-3 me-1" />
                                            {t('status.active')}
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="size-3 me-1" />
                                            {t('status.inactive')}
                                        </>
                                    )}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t('table.columns.type')}</span>
                                <Badge variant="outline" className="capitalize">
                                    {pkg.type === 'provider' ? <Briefcase className="size-3 me-1" /> : <UserCircle className="size-3 me-1" />}
                                    {t(`common.${pkg.type}`)}
                                </Badge>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            {pkg.created_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t('table.columns.createdAt')}</span>
                                    <span className="font-medium text-xs">{formatDate(pkg.created_at)}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Translations */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <LayoutGrid className="size-5 text-primary" />
                                {t('common.titles')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {pkg.translations && Object.entries(pkg.translations).map(([lang, data]: [string, any]) => (
                                    <div key={lang} className="p-4 rounded-lg bg-muted/30 border">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t(`languages.${lang}`)}</p>
                                            <Badge variant="secondary" className="text-[10px] h-4 px-1">{lang}</Badge>
                                        </div>
                                        <p className="text-lg font-bold" dir={lang === 'ar' || lang === 'ur' ? 'rtl' : 'ltr'}>
                                            {data.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                        <Card>
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Clock className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('Form.labels.duration')}</p>
                                    <p className="text-xl font-bold">{pkg.duration_translated}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <DollarSign className="size-5 text-green-500" />
                                {t('common.pricing')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
                                <span className="text-green-700 dark:text-green-400 font-medium">{t('Form.labels.price')}</span>
                                <span className="text-3xl font-black text-green-600 dark:text-green-500">{pkg.price} <span className="text-sm font-normal">SAR</span></span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
