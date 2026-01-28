import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Client } from '@/types/api/client'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Edit, User, Mail, Phone, Globe, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Power, ListTodo, History, CreditCard } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getModalTitle } from '@/util/helpers'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SARIcon } from '@/components/common/Icons'

export default function ClientShow({ client }: { client: Client }) {
    const { t } = useTranslation()
    const alert = useAlertModal()

    const { mutateAsync: ChangeBanMutate, isPending: banPending } =
        useStatusMutation(
            `${client.id}/ban`,
            'active',
            'clients',
            getQueryKeys.getOne('clients', String(client.id)),
            [getQueryKeys.all('clients' as any)],
            undefined,
            'post'
        )

    useEffect(() => {
        alert.setPending(banPending)
    }, [banPending])

    const handleToggleBan = () => {
        const handler = async () => {
            await ChangeBanMutate({ _method: 'put' })
            alert.setIsOpen(false)
        }
        const isBanned = client.is_ban === 1
        const actionLabel = isBanned ? t('common.unban') : t('common.ban')

        alert.setModel({
            isOpen: true,
            variant: isBanned ? 'default' : 'destructive',
            title: t('modals.active.title', { entity: actionLabel }),
            desc: t('modals.active.desc', { entity: actionLabel }),
            pending: banPending,
            handleConfirm: handler,
        })
        alert.setHandler(handler)
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="size-20 border-2 border-primary/20 p-1 bg-white">
                        <AvatarImage src={client.image} alt={client.full_name} className="rounded-full object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary">
                            <User className="size-10" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {client.full_name}
                            {client.is_completed_data ? (
                                <CheckCircle2 className="size-5 text-green-500">
                                    <title>{t('common.profile_completed') || 'Profile Completed'}</title>
                                </CheckCircle2>
                            ) : (
                                <XCircle className="size-5 text-yellow-500">
                                    <title>{t('common.profile_incomplete') || 'Profile Incomplete'}</title>
                                </XCircle>
                            )}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-1">
                            <Mail className="size-3" /> {client.email}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleToggleBan}
                        className={client.is_ban ? "text-green-500 hover:text-green-600 hover:bg-green-50" : "text-red-500 hover:text-red-600 hover:bg-red-50"}
                    >
                        <Power className="w-4 h-4 me-2" />
                        {client.is_ban ? t('common.unban') : t('common.ban')}
                    </Button>
                    {/* Assuming we might want to edit from here as well, linked to modal or page */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Cards Side */}
                <div className="space-y-6">
                    {/* Basic Info Card */}
                    <Card className="border-t-4 border-t-primary shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-5 text-primary" />
                                {t('common.personal_info')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Phone className="size-4" /> {t('table.columns.phone')}
                                </span>
                                <span className="font-medium" dir="ltr">+{client.phone_code}{client.phone}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Globe className="size-4" /> {t('Form.labels.country')}
                                </span>
                                <span className="font-medium">{client.country.name}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    {client.is_ban ? <ShieldAlert className="size-4 text-red-500" /> : <ShieldCheck className="size-4 text-green-500" />}
                                    {t('table.columns.status')}
                                </span>
                                <Badge variant={client.is_ban ? "destructive" : "outline"} className={!client.is_ban ? "text-green-600 bg-green-50 border-green-200" : ""}>
                                    {client.is_ban ? t('common.banned') : t('common.active')}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Departments Card */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ListTodo className="size-5 text-primary" />
                                {t('Form.labels.departments')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {client.departments.length > 0 ? (
                                    client.departments.map(dept => (
                                        <Badge key={dept.id} variant="secondary">{dept.name}</Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">{t('common.no_departments') || 'No departments'}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Nationalities Card */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="size-5 text-primary" />
                                {t('Form.labels.nationalities')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {client.nationalities.length > 0 ? (
                                    client.nationalities.map(nat => (
                                        <Badge key={nat.id} variant="outline" className="flex items-center gap-1">
                                            {nat.flag && <img src={nat.flag} alt="" className="w-4 h-3 object-cover rounded" />}
                                            {nat.nationality}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">{t('common.no_nationalities') || 'No nationalities'}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscriptions History Table */}
                <div className="md:col-span-2">
                    <Card className="shadow-sm h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <History className="size-5 text-primary" />
                                    {t('common.subscription_history') || 'Subscription History'}
                                </CardTitle>
                                <CardDescription>
                                    {t('common.subscription_history_desc') || 'Manage and view client subscription records'}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>{t('common.package') || 'Package'}</TableHead>
                                            <TableHead>{t('common.price') || 'Price'}</TableHead>
                                            <TableHead>{t('common.start_date') || 'Start Date'}</TableHead>
                                            <TableHead>{t('common.end_date') || 'End Date'}</TableHead>
                                            <TableHead>{t('table.columns.status')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {client.histroy_subscriptions.length > 0 ? (
                                            client.histroy_subscriptions.map((sub) => (
                                                <TableRow key={sub.id}>
                                                    <TableCell className="font-semibold">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1 rounded bg-primary/10 text-primary">
                                                                <CreditCard className="size-3" />
                                                            </div>
                                                            {sub.package.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-primary flex items-center gap-1">{sub.package.price} <span className="text-[10px] text-muted-foreground uppercase"><SARIcon className="text-primary" /></span></TableCell>
                                                    <TableCell className="text-xs">{new Date(sub.start_date).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-xs">{new Date(sub.end_date).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={sub.is_canceled ? "destructive" : "outline"} className={!sub.is_canceled ? "border-green-200 text-green-600 bg-green-50" : ""}>
                                                            {sub.is_canceled ? t('common.canceled') : t('common.active')}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                                                    {t('common.no_history') || 'No subscription history found'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
