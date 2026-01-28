import { Users, CreditCard, Zap, Building2, Briefcase } from 'lucide-react'
import { StatsCard } from '@/components/common/charts/StatsCard'
import dashboardHero from '@/assets/dashboard-hero.jpg'
import { useTranslation } from 'react-i18next'
import useFetch from '@/hooks/UseFetch'
import { ApiResponse } from '@/types/api/http'
import { Skeleton } from '@/components/ui/skeleton'

interface Statistics {
  total_workers: number;
  total_companies: number;
  total_clients: number;
  total_employees: number;
  total_current_subscriptions: number;
  total_expired_subscriptions: number;
}

export function Dashboard() {
  const { t } = useTranslation()

  const { data: statsData, isLoading } = useFetch<ApiResponse<Statistics>>({
    queryKey: ['statistics'],
    endpoint: 'statistic',
    enabled: false
  })

  const stats = statsData?.data ? [
    {
      title: t('dashboard.total_workers'),
      value: statsData.data.total_workers.toLocaleString(),
      icon: Briefcase,
      to: '/providers?user_type=worker' as any,
    },
    {
      title: t('dashboard.total_companies'),
      value: statsData.data.total_companies.toLocaleString(),
      icon: Building2,
      to: '/providers?user_type=company' as any,
    },
    {
      title: t('dashboard.total_clients'),
      value: statsData.data.total_clients.toLocaleString(),
      icon: Users,
      to: '/clients' as any,
    },
    {
      title: t('dashboard.total_employees'),
      value: statsData.data.total_employees.toLocaleString(),
      icon: Users,
      to: '/providers?user_type=employee' as any,
    },
    {
      title: t('dashboard.total_current_subscriptions'),
      value: statsData.data.total_current_subscriptions.toLocaleString(),
      icon: Zap,
      to: '/subscriptions?is_active=1' as any,
    },
    {
      title: t('dashboard.total_expired_subscriptions'),
      value: statsData.data.total_expired_subscriptions.toLocaleString(),
      icon: CreditCard,
      to: '/subscriptions?is_active=0' as any,
    },
  ] : []

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-hero p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
            {t('Text.welcomeBack')}
          </h1>
          <p className="text-lg opacity-90 animate-in fade-in slide-in-from-left-8 duration-1000">
            {t('Text.businessToday')}
          </p>
        </div>
        <div className="absolute inset-0 opacity-20 transition-transform duration-10000 hover:scale-110">
          <img
            src={dashboardHero}
            alt="Dashboard"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          stats.map((stat, index) => (
            <div key={stat.title} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
