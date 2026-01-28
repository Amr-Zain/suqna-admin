import * as React from 'react'
import {
  ChevronsRight,
  Home as HomeIcon,
  Edit,
  Plus,
  Eye,
  HelpCircle,
  Shield,
  Building2,
  Flag,
  Book,
  UsersRound,
  ChartAreaIcon,
  ChartColumnStacked,
  ClipboardList,
  ContactRound,
  Award,
  Scale,
  Sliders,
  CreditCard,
  Briefcase,
  Settings,
  PhoneCall,
  ScrollText,
  Megaphone,
  Users2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Link,
  type LinkProps,
  type RegisteredRouter,
} from '@tanstack/react-router'

type RouterTo = LinkProps<RegisteredRouter>['to']
type CrudAction = 'add' | 'edit' | 'show' | 'none'

const entityIconMap: Record<string, React.ReactNode> = {
  'menu.categories': <ChartColumnStacked />,
  'menu.home': <HomeIcon />,
  'menu.faqs': <HelpCircle />,
  'menu.roles': <Shield />,
  'menu.cities': <Building2 />,
  'menu.regions': <Building2 />,
  'menu.countries': <Flag />,
  'menu.showRooms': <Building2 />,
  'menu.pages': <Book />,
  'menu.supervisors': <UsersRound />,
  'menu.analytics': <ChartAreaIcon />,
  'menu.attributes': <ClipboardList />,
  'menu.values': <ClipboardList />,
  'menu.profile': <ContactRound />,
  'menu.rewards': <Award />,
  'menu.earning_rules': <Scale />,
  'menu.bankAccounts': <Building2 />,
  'menu.packages': <Award />,
  'menu.bank_transfers': <Building2 />,
  "menu.contact_us": <HelpCircle />,
  "menu.sliders": <Sliders />,
  "menu.subscriptions": <CreditCard />,
  "menu.departments": <Briefcase />,
  "menu.settings": <Settings />,
  "menu.contacts": <PhoneCall />,
  "menu.terms": <ScrollText />,
  "menu.about": <Book />,
  "menu.banners": <Megaphone />,
  "menu.providers": <Users2 />,
  "menu.clients": <Users2 />,
  "menu.admins": <Shield />,
  "menu.permissions": <Shield />,
}

const actionPresets: Record<
  Exclude<CrudAction, 'none'>,
  { key: string; icon: React.ReactNode }
> = {
  add: { key: 'buttons.add', icon: <Plus /> },
  edit: { key: 'buttons.edit', icon: <Edit /> },
  show: { key: 'buttons.show', icon: <Eye /> },
}

type BuiltCrumb = {
  label: React.ReactNode
  to?: RouterTo
  icon?: React.ReactNode
}

export function SmartBreadcrumbs(props: {
  entityKey?: string
  entityTo?: RouterTo
  action?: CrudAction
  includeHome?: boolean
  entityIconOverride?: React.ReactNode
  extra?: BuiltCrumb[]
  className?: string
}) {
  const { t } = useTranslation()
  const {
    entityKey,
    entityTo,
    action = 'none',
    includeHome = true,
    entityIconOverride,
    extra = [],
    className,
  } = props

  const base: BuiltCrumb[] = [
    ...(includeHome
      ? [
        {
          label: t('menu.home'),
          to: '/' as const,
          icon: entityIconMap['menu.home'] ?? <HomeIcon />,
        },
      ]
      : []),
    ...(!!entityKey ? [{
      label: t(entityKey),
      to: entityTo,
      icon: entityIconOverride ?? entityIconMap[entityKey],
    }] : []),
  ]

  // optional Action crumb
  const actionCrumbs: BuiltCrumb[] =
    action !== 'none'
      ? [
        {
          label: t(actionPresets[action].key),
          icon: actionPresets[action].icon,
        },
      ]
      : []

  // final list (no slice!)
  const finalCrumbs = [...base, ...extra, ...actionCrumbs]

  return (
    <Breadcrumb>
      <BreadcrumbList className={['mb-4', className].filter(Boolean).join(' ')}>
        {finalCrumbs.map((item, index) => {
          const isLast = index === finalCrumbs.length - 1
          const { to, label, icon } = item
          const key =
            (typeof label === 'string' ? label : `bc-${index}`) + `-${index}`

          return (
            <React.Fragment key={to ?? key}>
              <BreadcrumbItem className="flex items-center">
                {to ? (
                  <BreadcrumbLink
                    asChild
                    className="page-title inline-flex items-center gap-1"
                  >
                    <Link to={to}>
                      {icon} {label}
                    </Link>
                  </BreadcrumbLink>
                ) : isLast ? (
                  <BreadcrumbPage className="page-title text-primary font-semibold inline-flex items-center gap-1">
                    {icon} {label}
                  </BreadcrumbPage>
                ) : (
                  <span className="page-title inline-flex items-center gap-1">
                    {icon} {label}
                  </span>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator aria-hidden="true" className="mx-2">
                  <ChevronsRight className="size-5 rtl:rotate-180" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
