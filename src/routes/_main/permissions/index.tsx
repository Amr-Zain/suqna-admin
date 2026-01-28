import { createFileRoute } from '@tanstack/react-router'
import { checkPermission } from '@/util/permissionGuard'

export const Route = createFileRoute('/_main/permissions/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    checkPermission('permissions.index')
    return context
  },
})

function RouteComponent() {
  return <div>Hello "/_main/permissions/"!</div>
}
