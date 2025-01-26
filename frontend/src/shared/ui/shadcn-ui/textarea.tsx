import * as React from 'react'

import { cn } from '@/shared/library/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-border bg-background p-4 text-base shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] placeholder:text-sm/[19.6px] placeholder:text-gray-500 focus:border-primary-200 focus:shadow-[0_0_0_4px_rgba(224,234,255,1)] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:!border-gray-400 disabled:bg-gray-200 aria-[invalid=true]:border-error-500',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
