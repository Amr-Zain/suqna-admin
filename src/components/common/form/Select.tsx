'use client'
import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import { ChevronsUpDown, Check, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'

import useFetch from '@/hooks/UseFetch'
import { FieldOption } from '@/types/components/form'
import { ApiResponse } from '@/types/api/http'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { QueryKey } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export type SelectInputProps<T extends FieldValues, TData = unknown> = {
  placeholder: string
  field: ControllerRenderProps<T, Path<T>>
  disabled?: boolean
  options?: FieldOption[]
  endpoint?: string
  general?: boolean
  queryKey?: QueryKey
  select?: (data: ApiResponse<TData[]>) => FieldOption[]
  debounceMs?: number
  multiple?: boolean
  clearable?: boolean
}

function AppSelect<T extends FieldValues, TData>({
  placeholder,
  field,
  disabled,
  options,
  endpoint,
  queryKey,
  general,
  multiple = false,
  select,
  debounceMs = 300,
  clearable = false,
}: SelectInputProps<T, TData>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, debounceMs)

  const { data, isPending, isFetching } = useFetch<ApiResponse<TData[]>, FieldOption[]>({
    endpoint,
    queryKey: queryKey ? [...queryKey, debouncedQuery] : [endpoint, debouncedQuery],
    params: { keyword: debouncedQuery },
    staleTime: 1200_000,
    general,
    select,
    enabled: !!endpoint,
    placeholderData: keepPreviousData,
  })
  const { t } = useTranslation()

  const dataOptions = useMemo<FieldOption[]>(() => {
    if (endpoint) return data ?? []
    return options ?? []
  }, [endpoint, data, options])

  const filteredOptions = useMemo(() => {
    if (!debouncedQuery) return dataOptions
    const lower = debouncedQuery.toLowerCase()
    return dataOptions.filter(
      (o) =>
        String(o.label ?? '')
          .toLowerCase()
          .includes(lower) || String(o.value).toLowerCase().includes(lower),
    )
  }, [debouncedQuery, dataOptions])

  // normalize value depending on mode
  const singleValue = !multiple
    ? field.value !== undefined && field.value !== null
      ? String(field.value)
      : ''
    : ''
  const multiValue = multiple
    ? Array.isArray(field.value)
      ? field.value
      : field.value
        ? [field.value]
        : []
    : []

  const selectedLabel = useMemo(() => {
    if (!multiple) {
      const selected = dataOptions?.find(
        (o) => String(o.value) === String(singleValue),
      )
      return selected?.label ?? ''
    }

    if (!multiValue.length) return ''
    const selected = dataOptions.filter((o) =>
      multiValue.map(String).includes(String(o.value)),
    )
    return selected.map((o) => o.label).join(', ')
  }, [multiple, dataOptions, singleValue, multiValue])

  const hasValue = multiple
    ? multiValue.length > 0
    : !!singleValue && singleValue !== ''

  const handleClear = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (multiple) {
      field.onChange([])
    } else {
      // Try both undefined and empty string to ensure compatibility
      field.onChange(null)
    }

    // Trigger blur to ensure form state updates
    if (field.onBlur) {
      field.onBlur()
    }

    setOpen(false)
  }

  const handleSelectSingle = (valueStr: string) => {
    // If clicking the same value, deselect it (toggle behavior)
    if (valueStr === singleValue) {
      field.onChange(null)
      // Trigger blur to ensure form state updates
      if (field.onBlur) {
        field.onBlur()
      }
    } else {
      field.onChange(valueStr)
    }
    setOpen(false)
  }

  const handleSelectMultiple = (valueStr: string) => {
    const current = Array.isArray(field.value)
      ? field.value.map(String)
      : field.value
        ? [String(field.value)]
        : []

    const exists = current.includes(valueStr)

    let next: string[]
    if (exists) {
      next = current.filter((v: any) => v !== valueStr)
    } else {
      next = [...current, valueStr]
    }

    field.onChange(next)
    // don't close on multi
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12"
          disabled={disabled}
          onClick={(e) => {
            // Prevent button click if clicking on clear button area
            const target = e.target as HTMLElement
            if (target.closest('[data-clear-button]')) {
              e.preventDefault()
              return
            }
          }}
        >
          <span className="truncate flex-1 text-start">
            {selectedLabel || (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <div className="flex items-center gap-1 ms-2 shrink-0">
            {clearable && hasValue && !disabled && (
              <div
                data-clear-button
                role="button"
                onClick={handleClear}
                className="hover:bg-muted rounded-sm p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5 opacity-50 hover:opacity-100" />
              </div>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-56">
        <Command shouldFilter={false}>
          <div className="relative">
            <CommandInput
              placeholder={t('Text.search')}
              value={query}
              onValueChange={setQuery}
            />
            {isFetching && !!endpoint && (
              <div className="absolute end-2 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin opacity-40" />
              </div>
            )}
          </div>

          {isPending && !dataOptions.length && !!endpoint && (
            <div className="p-3 text-sm flex items-center gap-2 opacity-80">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('Text.loading') ?? 'Loading...'}
            </div>
          )}

          {filteredOptions.length === 0 && !isFetching && !isPending ? (
            <CommandEmpty>{t('Text.noResults')}</CommandEmpty>
          ) : (
            <CommandList
              style={{
                maxHeight: 300,
                overflowY: 'auto',
                padding: 0,
              }}
            >
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const valueStr = String(option.value)

                  const isSelected = multiple
                    ? multiValue.map(String).includes(valueStr)
                    : valueStr === singleValue

                  return (
                    <CommandItem
                      key={valueStr}
                      value={valueStr}
                      onSelect={() => {
                        if (multiple) {
                          handleSelectMultiple(valueStr)
                        } else {
                          handleSelectSingle(valueStr)
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          'h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default AppSelect
