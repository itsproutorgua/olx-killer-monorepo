import * as React from 'react'
import { cn } from '@/shared/library/utils'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'focus-visible:ring-ring peer h-5 w-5 shrink-0 rounded-[4px] border border-gray-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-light data-[state=checked]:text-purple-dark',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('text-current flex items-center justify-center')}
    >
      <Check className='h-4 w-4' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
