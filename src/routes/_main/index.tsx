import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'
import { Dashboard } from '@/components/pagesComponents/Dashboard'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_main/')({
  component: Index,
})

function Index() {
  return (
    <>
        <SmartBreadcrumbs  />
        <Dashboard />
    </>
  )
}

export default Index
