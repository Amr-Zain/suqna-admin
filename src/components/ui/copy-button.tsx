'use client'

import { useState } from 'react'

import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const ButtonCopy = ({content }:{content:string}) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button variant='ghost' className='relative disabled:opacity-100' onClick={handleCopy} disabled={copied}>
      <span className={cn('transition-all', copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}>
        <CheckIcon className='stroke-primary dark:stroke-primary' />
      </span>
      <span className={cn('absolute left-4 transition-all', copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}>
        <CopyIcon />
      </span>
      {/* {copied ? 'Copied!' : 'Copy'} */}
    </Button>
  )
}

export default ButtonCopy
