import { Notification } from '@/types/api/notification'
import { TFn } from '@/lib/schema/validation'
import { ColumnDef } from '@tanstack/react-table'
import { textColumn } from '@/util/crudFactory'
import { DateColumn } from '@/components/features/sharedColumns'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { ActionIcon } from '@/components/common/table/ActionIcon'
import { Check, Eye, Trash } from 'lucide-react'
import { PickedAction } from '@/hooks/useStatusMutations'

export const getNotificationTypeVariant = (type: string): any => {
    const variants: Record<string, string> = {
        comment: 'default',
        reply: 'secondary',
        like: 'success',
        rate: 'warning',
        report: 'destructive',
    }
    return variants[type] || 'outline'
}

export const notificationColumns = (
    open: (type: PickedAction, row: Notification) => void,
    t: TFn,
): ColumnDef<Notification>[] => [
        textColumn<Notification>('title', 'table.columns.title', {
            render: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="font-bold">{row.original.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{row.original.body}</span>
                </div>
            )
        }),
        textColumn<Notification>('type', 'table.columns.type', {
            render: ({ row }) => (
                <Badge variant={getNotificationTypeVariant(row.original.type)}>
                    {t(`notifications.types.${row.original.type}`)}
                </Badge>
            )
        }),
        DateColumn<any>('created_at', 'table.columns.createdAt') as ColumnDef<Notification>,
        textColumn<Notification>('read_at', 'table.columns.status', {
            render: ({ row }) => (
                <Badge variant={row.original.read_at ? 'outline' : 'default'} className=" whitespace-nowrap">
                    {row.original.read_at ? t('notifications.read') : t('notifications.unread')}
                </Badge>
            )
        }),
        {
            id: 'actions',
            header: () => <span className="text-foreground font-bold">{t('actions.entity')}</span>,
            cell: ({ row }) => {
                const id = row.original.id
                const rowData = row.original

                return (
                    <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                        <ActionIcon
                            icon={Eye}
                            label="actions.show"
                            to="/advertisements/show/$id"
                            params={{ id: String(rowData.notify_id) }}
                        />
                        {!rowData.read_at && (
                            <ActionIcon
                                icon={Check}
                                label="notifications.mark_as_read"
                                onClick={() => open('active', rowData)}
                            />
                        )}
                        <ActionIcon
                            icon={Trash}
                            label="actions.delete"
                            variant="destructive"
                            onClick={() => open('delete', rowData)}
                        />
                    </div>
                )
            }
        }
    ]
