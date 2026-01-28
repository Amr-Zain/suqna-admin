import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { AnalyticsCharts } from '@/components/pagesComponents/Analytics'
import { createFileRoute } from '@tanstack/react-router'
import { checkPermission } from '@/util/permissionGuard'

export const Route = createFileRoute('/_main/analytics')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        checkPermission('statistic.index')
        return context
    },
})

function RouteComponent() {
    return (
        <>
            <SmartBreadcrumbs entityKey="menu.analytics" />
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Track your performance metrics</p>
            </div>
            <AnalyticsCharts />
        </>
    )
}
