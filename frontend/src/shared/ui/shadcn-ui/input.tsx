import * as React from 'react'

import { cn } from '@/shared/library/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full items-center rounded-md border border-border bg-background px-[22px] text-base transition-colors duration-300 file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground placeholder:text-sm/none placeholder:text-gray-500 focus:border-primary-200 focus:shadow-[0_0_0_4px_rgba(224,234,255,1)] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:!border-gray-400 disabled:bg-gray-200 aria-[invalid=true]:border-error-500',
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
