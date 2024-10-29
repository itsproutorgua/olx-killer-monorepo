import { useTranslation } from 'react-i18next'

import { FiltersBar } from '@/widgets/filters-bar'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/shadcn-ui/sheet'
import { ChevronLeftIcon } from '@/shared/ui'
import { cn } from '@/shared/library/utils'

export const FiltersSheet = ({ className }: { className?: string }) => {
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
        aria-describedby={undefined}
        className='w-[304px] border-0 bg-gray-50 p-0 px-2.5 pb-2.5 shadow-none'
      >
        <div>
          <SheetHeader className='border-b border-gray-200 py-7 text-start'>
            <SheetTitle className='text-2xl/none text-foreground'>
              <SheetClose className='flex items-center gap-2'>
                <ChevronLeftIcon />
                {t('buttons.filters')}
              </SheetClose>
            </SheetTitle>
          </SheetHeader>

          <FiltersBar />
        </div>
        <div className='absolute bottom-0 left-0 w-full px-2.5 pb-2.5'>
          <SheetClose className={cn('btn-primary')}>
            {t('buttons.back')}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
