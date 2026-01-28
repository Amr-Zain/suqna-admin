import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Edit } from 'lucide-react'
import {
    Card,
    CardHeader as ShadcnCardHeader,
    CardTitle as ShadcnCardTitle,
    CardDescription as ShadcnCardDescription,
    CardContent as ShadcnCardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import ImageWithPreview from '@/components/common/uiComponents/image/ImagePreview'
import { cn } from '@/util/helpers'

// --- Root Wrapper ---
export const ShowPage = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("mx-auto max-w-5xl space-y-6 pb-12", className)}>
        {children}
    </div>
)

// --- Header Composition ---
export const ShowHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center justify-between mb-6", className)}>
        {children}
    </div>
)

export const ShowTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>
)

export const ShowActions = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
)

// --- Summary Composition ---
export const ShowSummary = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn("mb-6", className)}>
        <ShadcnCardHeader className="flex flex-row items-start justify-between gap-4 p-6">
            {children}
        </ShadcnCardHeader>
    </Card>
)

export const ShowSummaryImage = ({ src, alt }: { src?: string | null, alt?: string }) => {
    if (!src) return null
    return (
        <div className="relative p-2 w-20 h-20 overflow-hidden rounded-md ring-1 ring-border flex items-center justify-center bg-muted/30">
            <ImageWithPreview
                src={src}
                alt={alt || 'Image'}
                className="object-contain"
            />
        </div>
    )
}

export const ShowSummaryContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("flex-1", className)}>{children}</div>
)

export const ShowSummaryTitle = ({ en, ar, id }: { en?: string | null, ar?: string | null, id?: string | number }) => {
    const { t } = useTranslation()
    return (
        <div>
            <ShadcnCardTitle className="flex items-center gap-2 flex-wrap text-xl">
                <span>{en || '—'}</span>
                {ar && (
                    <>
                        <Separator orientation="vertical" className="h-5 hidden sm:block" />
                        <span className="text-muted-foreground">{ar}</span>
                    </>
                )}
            </ShadcnCardTitle>
            {id && (
                <ShadcnCardDescription className="mt-1">
                    {t('table.columns.id')} #{id}
                </ShadcnCardDescription>
            )}
        </div>
    )
}

export const ShowSummaryStatus = ({
    status,
    onToggle,
    pending,
    extra
}: {
    status?: boolean,
    onToggle?: () => void,
    pending?: boolean,
    extra?: React.ReactNode
}) => {
    const { t } = useTranslation()
    return (
        <div className="flex flex-col items-end gap-2">
            {onToggle && (
                <div
                    className={cn(
                        "flex items-center gap-2 cursor-pointer transition-opacity",
                        pending && "opacity-50 pointer-events-none"
                    )}
                    onClick={onToggle}
                >
                    <Switch checked={status} />
                    <Badge variant={status ? 'default' : 'secondary'}>
                        {status ? t('status.active') : t('status.inactive')}
                    </Badge>
                </div>
            )}
            {extra}
        </div>
    )
}

// --- Layout Grid ---
export const ShowGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid gap-6 items-start md:grid-cols-2", className)}>
        {children}
    </div>
)

// Alias for backward compatibility
export const DetailGrid = ShowGrid

// --- Details Section ---
export const ShowSection = ({ title, description, children, className }: { title: string, description?: string, children: React.ReactNode, className?: string }) => (
    <Card className={cn("shadow-none", className)}>
        <ShadcnCardHeader>
            <ShadcnCardTitle className="text-base">{title}</ShadcnCardTitle>
            {description && <ShadcnCardDescription>{description}</ShadcnCardDescription>}
        </ShadcnCardHeader>
        <ShadcnCardContent>{children}</ShadcnCardContent>
    </Card>
)

export const ShowInfoTable = ({ rows }: { rows: { label: string, value: React.ReactNode }[] }) => (
    <Table>
        <TableBody>
            {rows.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-transparent border-b last:border-0">
                    <TableCell className="w-1/3 text-muted-foreground py-3">{row.label}</TableCell>
                    <TableCell className="font-medium py-3 text-right sm:text-left">{row.value ?? '—'}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export const ShowLocalizedTabs = ({
    tabs
}: {
    tabs: { value: string, label: string, rows: { label: string, value: React.ReactNode }[] }[]
}) => {
    return (
        <Tabs defaultValue={tabs[0]?.value} className="w-full">
            <TabsList className={cn("grid w-full", `grid-cols-${tabs.length}`)}>
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-4">
                    <ShowInfoTable rows={tab.rows} />
                </TabsContent>
            ))}
        </Tabs>
    )
}
// --- Children List Composition ---
export const ShowChildrenList = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn("mt-8", className)}>
        {children}
    </Card>
)

export const ShowChildrenHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <ShadcnCardHeader className={cn("flex flex-row items-center justify-between", className)}>
        {children}
    </ShadcnCardHeader>
)

export const ShowChildrenTitle = ({ children, count, className }: { children: React.ReactNode, count?: number, className?: string }) => (
    <div>
        <ShadcnCardTitle className={cn("text-lg flex items-center gap-2", className)}>
            {children}
            {count !== undefined && (
                <Badge variant="outline" className="ml-2">
                    {count}
                </Badge>
            )}
        </ShadcnCardTitle>
    </div>
)

export const ShowChildrenContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <ShadcnCardContent className={cn(className)}>
        {children}
    </ShadcnCardContent>
)

export const ShowEmptyState = ({ message }: { message?: string }) => {
    const { t } = useTranslation()
    return (
        <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground">
            <p>{message || t('common.no_data')}</p>
        </div>
    )
}
