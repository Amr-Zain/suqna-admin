import Profile from '@/components/pagesComponents/Profile'
import { createFileRoute } from '@tanstack/react-router'
import { checkPermission } from '@/util/permissionGuard'

export const Route = createFileRoute('/_main/profile/')({
  component: Profile,
  beforeLoad: ({ context }) => {
    checkPermission('profile.index')
    return context
  },
})
