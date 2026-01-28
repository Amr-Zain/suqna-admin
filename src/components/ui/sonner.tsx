'use client'

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useTheme } from '../providers/themeProvider'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const isLight = theme === 'light';

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': isLight ? 'hsl(0 0% 100%)' : 'hsl(147 7.57% 6.66%)',
          '--normal-text': isLight
            ? 'hsl(150 24.74% 34.61%)'
            : 'hsl(146 7.36% 80.02%)',
          '--normal-border': isLight
            ? 'hsl(160 21.42% 84.58%)'
            : 'hsl(147 6.46% 13.72%;)',
          '--border-radius':' 0.25rem',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
