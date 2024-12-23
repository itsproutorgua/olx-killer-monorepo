import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small'
import { cn } from '@/shared/library/utils'

export const ScrollToButton = ({ styles }: { styles: string }) => {
  return (
    <button
      className={cn(
        'relative flex size-[51px] items-center justify-center rounded-full border border-border bg-white text-primary-400',
        styles,
      )}
    >
      <ArrowDownSmall />
      <span className='absolute -top-3 left-1/2 flex size-6 -translate-x-1/2 transform items-center justify-center rounded-full bg-primary-900 text-xs/none text-background'>
        10
      </span>
    </button>
  )
}
