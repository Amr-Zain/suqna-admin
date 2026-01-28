import { DashboardHeader } from '@/components/layout/Header'
import { AppSidebar } from '@/components/layout/Sidebar'
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import ConfirmModal from '@/components/common/uiComponents/ConfirmModal'
import { useAlertModal } from '@/stores/useAlertModal'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { setupZodI18n } from '@/errorMap'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_main')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState().user;
    const clearUser = useAuthStore.getState().clearUser
    if (!useAuthStore.getState().token) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
        
      })
    }
    // if (user?.is_banned) {
    //   toast('your account had bannded')
    //   clearUser()
    //   throw redirect({
    //     to: '/auth/login',
    //     search: {
    //       redirect: location.href,
    //     },
    //   })
    // }
    // if (!user?.is_active) {
    //   toast('your account not activated')
    //   clearUser()
    //   throw redirect({
    //     to: '/auth/login',
    //     search: {
    //       redirect: location.href,
    //     },
    //   })
    // }
  },
  component: Layout,
})

function LayoutContent() {
  //const { state } = useSidebar()
  const {
    isOpen,
    title,
    desc,
    variant,
    pending,
    setIsOpen,
    handleConfirm,
  } = useAlertModal();
  const { i18n } = useTranslation()


  setupZodI18n(i18n.t.bind(i18n))
  i18n.on('languageChanged', () => setupZodI18n(i18n.t.bind(i18n)))
  useEffect(() => {
    const dir = i18n.dir(i18n.language)
    document.documentElement.setAttribute('dir', dir)
  }, [i18n.language])
  return (
    <div
      className={cn(
        'flex-1 min-w-0 transition-all duration-300 ease-in-out')}
    >
      <div className="bg-background min-h-[calc(100vh-2rem)] rounded-2xl overflow-hidden border">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="w-full p-6 bg-background ">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmModal
        title={title!}
        desc={desc!}
        open={isOpen}
        setOpen={setIsOpen}
        onClick={handleConfirm!}
        Pending={!!pending}
        variant={variant}
      />
    </div>
  )
}

export function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full m-4">
          <AppSidebar />
          <LayoutContent />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
