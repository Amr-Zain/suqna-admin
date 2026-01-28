interface MenuItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  isActive?: boolean
  items?: MenuItem[]  // Support nested menu items
  subItems?: Array<{
    title: string
    url: string
  }>
  permission?: string;
}
