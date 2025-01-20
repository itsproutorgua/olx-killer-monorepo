import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FiltersBar } from '@/features/filters-bar'
import { useFilters } from '@/entities/filter'
import { ProductsContext } from '@/entities/product'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/shadcn-ui/sheet'
import { ChevronLeftIcon } from '@/shared/ui'
import { useStrictContext } from '@/shared/library/hooks'
import { cn } from '@/shared/library/utils'

export const FiltersSheet = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { isFiltersEmpty, clearFilters } = useFilters()
  const { count } = useStrictContext(ProductsContext)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
        className='h-full w-[304px] border-0 bg-gray-50 p-0 px-2.5 pb-2.5 shadow-none'
      >
        <SheetHeader className='flex h-20 w-full flex-row items-center justify-between border-b border-gray-200'>
          <SheetTitle className='text-2xl/none text-foreground'>
            <SheetClose className='flex items-center gap-2'>
              <ChevronLeftIcon />
              {t('buttons.filters')}
            </SheetClose>
          </SheetTitle>

          {!isFiltersEmpty && (
            <button
              onClick={clearFilters}
              className='rounded-[60px] bg-error-700 px-3 py-1.5 text-[10px]/none text-background'
            >
              {t('buttons.cancelAll')}
            </button>
          )}
        </SheetHeader>

        <div className='flex h-[calc(100%-80px)] flex-col justify-between overflow-y-auto'>
          <FiltersBar onCloseSheet={() => setIsSheetOpen(false)} />

          <div className='space-y-4'>
            {!isFiltersEmpty && (
              <p className='border-t border-t-border pt-4 text-center text-[13px]/[15.6px] text-gray-400'>
                {t('words.found')} {count} {t('words.announcements')}
              </p>
            )}

            <button
              onClick={() => setIsSheetOpen(false)}
              className='btn-primary'
            >
              {t('buttons.back')}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// h-[calc(100%-160px)] overflow-y-auto
