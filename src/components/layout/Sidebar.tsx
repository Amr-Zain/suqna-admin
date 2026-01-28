import {
  ChevronDown,
  User2,
  LogOut,
  User,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useTranslation } from 'react-i18next'
import {
  getDashboardMenuItems,
  getSettingsMenuItems,
  usersMenuItems,
} from '@/util/data'
import { MenuItem } from './MenuItem'
import { cn } from '@/lib/utils'
import { Logo } from '../common/Icons'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import ConfirmModal from '../common/uiComponents/ConfirmModal'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'
import { filterMenuItemsByPermission } from '@/util/permissionGuard'

export function AppSidebar() {
  const { t, i18n } = useTranslation()
  const { state } = useSidebar()
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const navigate = useNavigate()
  const isRTL = useMemo(() => i18n.dir(i18n.language) === 'rtl', [i18n.language]);
  const { mutateAsync: logoutAsync, isPending: isLoggingOut } = useMutate<ApiResponse>({
    endpoint: 'logout',
    mutationKey: ['logout'],
    method: 'post',
    onSuccess: (data) => {
      clearUser()
      toast.success(data.message)
      navigate({ to: '/auth/login' })
    },
    onError: (_err, error) => {
      toast.success(error.message)
    }
  })

  const handleConfirmLogout = async () => {
    await logoutAsync({})
  }
  const groups = [
    {
      label: t('menu.dashboard'),
      items: getDashboardMenuItems,
    },
    {
      label: t('menu.users'),
      items: usersMenuItems,
    },
    {
      label: t('menu.settings'),
      items: getSettingsMenuItems,
    },
  ]

  // const filteredGroups = useMemo(() => {
  //   return groups.map(group => ({
  //     ...group,
  //     items: filterMenuItemsByPermission(group.items)
  //   })).filter(group => group.items.length > 0) // Remove empty groups
  // }, [groups, user?.permissions])

  return (
    <Sidebar
      side={isRTL ? 'right' : 'left'}
      variant="floating"
      collapsible="icon"
      className="border-none py-4"
    >
      <SidebarHeader className="group pb-0">
        <SidebarMenu>
          <SidebarMenuItem className={cn("flex", state === 'collapsed' ? "flex-col items-center justify-center gap-4" : "justify-between items-center")}>
            <Link to="/" >
              <div
                className={cn(
                  'rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow w-20 h-10',
                  state === 'collapsed' && 'w-10 h-10'
                )}
              >
                <Logo className="size-20 text-white" />
              </div>
            </Link>

            <SidebarTrigger
              className={cn(
                'p-2 size-9 rounded-md transition-colors cursor-w-resize ',
                'block',
              )}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="rounded-0 overflow-y-auto overflow-x-hidden">
        {groups.map((group, index) => (
          <div key={group.label}>
            <SidebarGroup>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <MenuItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index < groups.length - 1 && <SidebarSeparator />}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className={cn(state === 'collapsed' && "flex flex-col items-center justify-center")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square bg-gradient-primary size-9 items-center justify-center rounded-lg text-sidebar-primary-foreground shadow-glow group-data-[collapsible=icon]:flex!">
                    <User2 className="size-5" />
                  </div>
                  {state !== 'collapsed' && (
                    <>
                      <div className="grid flex-1 text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name || 'Admin User'}
                        </span>
                        <span className="truncate text-xs">
                          {user?.email || 'admin@company.com'}
                        </span>
                      </div>
                      <ChevronDown className="ml-auto" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1 text-start">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={'/profile'} preload="intent">
                  <DropdownMenuItem>
                    <User className="me-2 h-4 w-4" />
                    {t('Text.profile')}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setConfirmOpen(true)
                  }}
                >
                  <LogOut className="me-2 h-4 w-4" />
                  {t('Text.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <ConfirmModal
        title={t('modals.logout.title')}
        desc={
          t('modals.logout.desc')}
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onClick={handleConfirmLogout}
        Pending={isLoggingOut}
        variant="destructive"
      />
    </Sidebar>
  )
}
