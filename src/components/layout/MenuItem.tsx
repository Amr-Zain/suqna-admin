import { hasPermission, isPathActive } from '@/util/helpers'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useTranslation } from 'react-i18next'

const activeStyle = "font-semibold"

export const MenuItem = ({ item }: { item: MenuItem }) => {
  const pathname = useLocation().pathname
  const hasSubItems = item.subItems && item.subItems.length > 0
  const isActive = useMemo(
    () => isPathActive(item.url, pathname),
    [item.url, pathname],
  )
  const { i18n, t } = useTranslation()
  const { state } = useSidebar()

  const isRTL = useMemo(() => i18n.dir() === 'rtl', [i18n])

  const translatedTitle = useMemo(() => t(item.title), [item.title, t])

  //if(item.permission && !hasPermission(item.permission)) return null

  if (hasSubItems) {
    return (
      <Collapsible
        key={item.title}
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem data-expanded={state === 'expanded'}>
          {isActive && (
            <div className={cn(
              "absolute -start-2 top-1/2 -translate-y-1/2 rounded-sm w-1 bg-primary z-20",
              state === 'collapsed' ? "h-8" : "h-6"
            )} />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isActive} tooltip={translatedTitle} className={cn(isActive && activeStyle)}>
                  <item.icon />
                  <span>{translatedTitle}</span>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="ms-auto h-5 w-fit px-1 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="rtl:rotate-180 ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </TooltipTrigger>
            <TooltipContent side={isRTL ? 'left' : 'right'} align="center">
              {translatedTitle}
            </TooltipContent>
          </Tooltip>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item?.subItems?.map((subItem) => {
                const subIsActive = isPathActive(subItem.url, pathname)
                const translatedSubTitle = t(subItem.title)
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={subIsActive}
                      className={cn(subIsActive && activeStyle)}
                    >
                      <Link to={subItem.url} preload="intent">
                        <span>{translatedSubTitle}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem key={item.title}>
      {isActive && (
        <div className={cn(
          "absolute -start-2 top-1/2 -translate-y-1/2 rounded-sm w-1 bg-primary z-20",
          state === 'collapsed' ? "h-8" : "h-6"
        )} />
      )}
      <SidebarMenuButton asChild isActive={isActive} tooltip={translatedTitle} className={cn(isActive && activeStyle)}>
        <Link to={item.url} preload="intent">
          <item.icon />
          <span>{translatedTitle}</span>
          {item.badge && (
            <Badge variant="outline" className="ms-auto h-5 w-fit px-1 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
