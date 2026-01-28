import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { RowAction } from '@/types/components/table'
import { cn } from '@/lib/utils'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import i18n from '@/i18n'

interface RowActionsOptions<RowData> {
  actions: RowAction<RowData>[]
  menuLabel?: string,
}

export function RowActions<RowData>({
  actions,
  menuLabel = 'Actions',
}: RowActionsOptions<RowData>) {
  return function RenderActions(row: { original: RowData }) {
    const r = row.original
    const queryClient = useQueryClient()
    const isRTL = i18n.language.startsWith('ar')
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Open menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>

          {actions
            .filter((a) => !(a.hidden?.(r) ?? false))
            .map((a, idx) => {
              const params =
                typeof a.params === 'function' ? a.params(r) : a.params
              const to = typeof a.to === 'function' ? a.to(r) : a.to

              const item = a.to ? (
                <DropdownMenuItem
                  key={`${idx}-${a.label}`}
                  asChild
                  disabled={a.disabled ?? false}
                  className={cn(
                    'cursor-pointer',
                    a.danger ? 'text-red-600' : '',
                  )}
                >
                  <Link
                    to={to!}
                    params={params as any}
                    // preload="intent"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (a.queryKey && r) {
                        const id = (r as any).id?.toString()
                        if (id) {
                          const key = [...a.queryKey(id), isRTL]
                          queryClient.setQueryData(key, { data: r })
                          //queryClient.setQueryDefaults(key, { staleTime: 6000_000 })
                        }
                      }
                    }}
                    state={(r ? { rowData: r } : undefined) as any}
                  >
                    {typeof a.label === 'function' ? a.label(r) : a.label}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={`${idx}-${a.label}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (a.queryKey && r) {
                      const id = (r as any).id?.toString()
                      if (id) {
                        const key = [...a.queryKey(id), isRTL]
                        queryClient.setQueryData(key, { data: r })
                        queryClient.setQueryDefaults(key, { staleTime: 6000_000 })
                      }
                    }
                    if (!a.disabled) a.onClick?.(r)
                  }}
                  disabled={a.disabled ?? false}
                  className={a.danger ? 'text-red-600' : undefined}
                >
                  {typeof a.label === 'function' ? a.label(r) : a.label}
                </DropdownMenuItem>
              )

              return (
                <React.Fragment key={`${idx}-${a.label}-wrap`}>
                  {a.dividerAbove && <DropdownMenuSeparator />}
                  {item}
                </React.Fragment>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
