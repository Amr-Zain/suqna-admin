import { Award, BarChart3, Bell, Book, Briefcase, Building2, ChartColumnStacked, ClipboardList, CreditCard, Database, Flag, HelpCircle, Home, Megaphone, PhoneCall, Scale, ScrollText, Settings, Share2, Shield, ShoppingCart, Sliders, Users2 } from "lucide-react";

export const getDashboardMenuItems: MenuItem[] = [
  {
    title: 'menu.overview',
    url: '/',
    icon: Home,
  },
  {
    title: 'menu.analytics',
    url: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'menu.departments',
    url: '/departments',
    icon: Briefcase,
  },
  {
    title: 'menu.packages',
    url: '/packages',
    icon: Award,
  },
  {
    title: 'menu.qualifications',
    url: '/qualifications',
    icon: ClipboardList,
  },
  {
    title: 'menu.bannars',
    url: '/bannars',
    icon: Megaphone,
  },
  {
    title: 'menu.subscriptions',
    url: '/subscriptions',
    icon: CreditCard,
  },
]


export const getSettingsMenuItems: MenuItem[] = [
  {
    title: 'menu.generalSettings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'menu.cities',
    url: '/cities',
    icon: Building2,
  },
  // {
  //   title: 'menu.regions',
  //   url: '/regions',
  //   icon: Building2,
  // },
  {
    title: 'menu.countries',
    url: '/countries',
    icon: Flag,
  },
  {
    title: 'menu.contacts',
    url: '/contacts',
    icon: PhoneCall,
  },
  {
    title: 'menu.terms',
    url: '/terms',
    icon: ScrollText,
  },
  {
    title: 'menu.about',
    url: '/about',
    icon: Book,
  },
  {
    title: 'menu.faqs',
    url: '/faqs',
    icon: HelpCircle,
  },
 
]
export const usersMenuItems: MenuItem[] = [
  {
    title: 'menu.roles',
    url: '/roles',
    icon: Shield,
  },
  {
    title: 'menu.admins',
    url: '/admins',
    icon: Shield,
  },
  {
    title: 'menu.providers',
    url: '/providers',
    icon: Users2,
  },
  {
    title: 'menu.clients',
    url: '/clients',
    icon: Users2,
  },

]
