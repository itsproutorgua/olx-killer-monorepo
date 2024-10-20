import { useTranslation } from 'react-i18next'

import { FiltersBar } from '@/features/filter-bar'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/shadcn-ui/sheet'
import { ChevronLeftIcon } from '@/shared/ui'
import { cn } from '@/shared/library/utils'

export const FiltersButton = ({ className }: { className?: string }) => {
  const { t } = useTranslation()

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          'rounded-lg bg-primary-900 px-[14px] py-2.5 text-[13px]/6 text-gray-50',
          className,
        )}
      >
        {t('buttons.filters')}
      </SheetTrigger>

      <SheetContent
        side='left'
        className='w-[304px] border-0 bg-gray-50 p-0 px-2.5 shadow-none'
      >
        <SheetHeader>
          <SheetTitle className='hidden' />
          <SheetDescription className='hidden' />
        </SheetHeader>

        {/* Title */}
        <div className='flex items-center justify-between border-b border-gray-200 py-7'>
          <SheetClose className='flex items-center gap-2 text-2xl/none text-foreground'>
            <ChevronLeftIcon />
            {t('buttons.filters')}
          </SheetClose>
        </div>

        {/* Content */}
        <div>
          <FiltersBar />
        </div>
      </SheetContent>
    </Sheet>
  )
}
