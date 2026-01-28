import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, LogOut, Menu, Search, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import ConfirmModal from '../common/uiComponents/ConfirmModal'
import { Link, useNavigate } from '@tanstack/react-router'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'
import PopoverNotifications from './Notifications'

export function DashboardHeader() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const navigate = useNavigate()
  const initials = useMemo(() => {
    const name = user?.name?.trim()
    if (!name) return 'A'
    return name
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }, [user?.name])

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

  return (
    <header className="h-14 border-b border-border backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4 relative">
          <SidebarTrigger className="p-2 hover:bg-accent rounded-md transition-colors flex md:hidden cursor-pointer" />

          <div className="relative hidden sm:block">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="ps-10 h-9 w-64 bg-background/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverNotifications />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('notifications')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                aria-label={t('profile')}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar?.path || ''}
                    alt={user?.name ?? 'Profile'}
                    className='object-cover'
                  />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={'/profile'}>
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
          <ConfirmModal
            title={t('modals.logout.title')}
            desc={
              t('modals.logout.desc')
            }
            open={confirmOpen}
            setOpen={setConfirmOpen}
            onClick={handleConfirmLogout}
            Pending={isLoggingOut}
            variant="destructive"
          />
        </div>
      </div>
    </header >
  )
}
// export default ThemeToggleVariantsDemo