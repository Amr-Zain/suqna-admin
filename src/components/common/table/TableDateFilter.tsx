import React from 'react'
import { Calendar as CalendarIcon, PlusCircle, X } from 'lucide-react'
import { formatDate } from '@/util/date'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function DataTableDateFilter({
    id,
    title,
    setParam,
    currentValue,
}: {
    id: string
    title: string
    setParam: (key: string, value: string | undefined) => void
    currentValue?: string
}) {
    const [open, setOpen] = React.useState(false)
    const date = currentValue ? new Date(currentValue) : undefined

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Use YYYY-MM-DD format as requested (string)
            const formatted = formatDate(selectedDate, 'yyyy-MM-dd')
            setParam(id, formatted)
        } else {
            setParam(id, undefined)
        }
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed mb-2"
                >
                    <PlusCircle className="me-2 h-4 w-4" />
                    {title}
                    {currentValue && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal"
                            >
                                {currentValue}
                            </Badge>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                />
                {currentValue && (
                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-center text-center text-xs"
                            onClick={() => {
                                setParam(id, undefined)
                                setOpen(false)
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
