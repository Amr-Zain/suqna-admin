import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { LucideIcon } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'
import { cn } from '@/util/helpers'

import { QueryKey, useQueryClient } from '@tanstack/react-query'
import i18n from '@/i18n'

interface ActionIconProps {
    icon: LucideIcon
    label: string
    to?: string
    params?: Record<string, string>
    onClick?: () => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    disabled?: boolean
    queryKey?: QueryKey
    rowData?: any
    className?: string
}

export const ActionIcon = ({
    icon: Icon,
    label,
    to,
    params,
    onClick,
    variant = 'ghost',
    disabled,
    queryKey,
    rowData,
    className,
}: ActionIconProps) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const translatedLabel = t(label)

    const isRTL = i18n.language.startsWith('ar')
    const finalQueryKey = queryKey ? [...(queryKey as any[]), isRTL] : undefined

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (finalQueryKey && rowData) {
            queryClient.setQueryData(finalQueryKey, { data: rowData })
            queryClient.setQueryDefaults(finalQueryKey, { staleTime: 6000_000 })
        }
        onClick?.()
    }

    const content = (
        <Button
            variant={variant}
            size="icon"
            onClick={to ? undefined : handleAction}
            disabled={disabled}
            className={cn('h-8 w-8', className)}
            type="button"
        >
            <Icon className="h-4 w-4 pointer-events-none" />
            <span className="sr-only">{translatedLabel}</span>
        </Button>
    )

    const wrappedContent = to ? (
        <Link
            to={to}
            params={params as any}
            onClick={(e) => {
                e.stopPropagation()
                if (finalQueryKey && rowData) {
                    queryClient.setQueryData(finalQueryKey, { data: rowData })
                    queryClient.setQueryDefaults(finalQueryKey, { staleTime: 6000_000 })
                }
            }}
        //state={(rowData ? { rowData } : undefined) as any}
        >
            {content}
        </Link>
    ) : (
        content
    )

    return (
        <Tooltip>
            <TooltipTrigger asChild>{wrappedContent}</TooltipTrigger>
            <TooltipContent>
                <p>{translatedLabel}</p>
            </TooltipContent>
        </Tooltip>
    )
}
