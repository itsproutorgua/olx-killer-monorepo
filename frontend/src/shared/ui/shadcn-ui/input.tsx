import * as React from 'react'

import { cn } from '@/shared/library/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full items-center rounded-md border border-border bg-background px-3 py-1 text-base transition-colors file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 focus:border-gray-950 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
