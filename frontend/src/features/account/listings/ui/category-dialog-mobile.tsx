import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryDialogProps } from '@/features/account/listings/ui/category-dialog-desktop.tsx'
import { CategoryResponse, Subcategory } from '@/entities/category'
import { useCategories } from '@/entities/category/library/hooks/use-categories.tsx'
import { Button } from '@/shared/ui/shadcn-ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn-ui/dialog'
import { ScrollArea, ScrollBar } from '@/shared/ui/shadcn-ui/scroll-area'
import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'
import { cn } from '@/shared/library/utils'

type CategoryHierarchy = (CategoryResponse | Subcategory)[]

export function CategoryDialogMobile({
  open,
  onOpenChange,
  onSelect,
}: CategoryDialogProps) {
  const { t } = useTranslation()
  const { categories, cursor } = useCategories({})
  const [selectedHierarchy, setSelectedHierarchy] = useState<CategoryHierarchy>(
    [],
  )

  const currentCategory = selectedHierarchy[selectedHierarchy.length - 1]
  const childCategories = currentCategory?.children || categories || []

  const handleCategorySelect = (category: CategoryResponse | Subcategory) => {
    if (category.children?.length > 0) {
      setSelectedHierarchy(prev => [...prev, category])
    } else {
      onSelect(category.id.toString(), category.title)
      onOpenChange(false)
      setSelectedHierarchy([])
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    setSelectedHierarchy(prev => prev.slice(0, index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className='w-full max-w-[355px] animate-contentShow rounded-[20px] p-7 pt-10'
      >
        <DialogHeader>
          <DialogTitle className='text-start text-[24px] font-medium leading-[38px] text-gray-900'>
            {t('listingForm.fields.category.label')}
          </DialogTitle>
        </DialogHeader>

        {/* Breadcrumbs */}
        {selectedHierarchy.length > 0 && (
          <div className='flex flex-wrap'>
            <Button
              variant='ghost'
              className='h-5 px-2 py-1 text-xs'
              onClick={() => setSelectedHierarchy([])}
            >
              {t('listingForm.fields.category.allCategories')}
            </Button>
            {selectedHierarchy.map((category, index) => (
              <div key={category.path} className='flex items-center'>
                <span className='text-xs'>/</span>
                <Button
                  variant='ghost'
                  className='h-5 px-2 py-1 text-xs'
                  onClick={() => handleBreadcrumbClick(index + 1)}
                >
                  {category.title}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className='flex max-h-[500px] gap-6'>
          {/* Categories List */}
          <ScrollArea className='w-full'>
            <div className='flex flex-col gap-2'>
              {cursor}
              {childCategories.map(category => (
                <Button
                  key={category.path}
                  variant='ghost'
                  className={cn(
                    'flex w-full max-w-[301px] justify-start gap-2 rounded-[89px] py-2 pl-4 pr-4',
                  )}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={category.title}
                      className='h-5 w-5'
                    />
                  )}
                  <span className='truncate'>{category.title}</span>
                  {category.children?.length > 0 && (
                    <span className='ml-auto'>
                      <ArrowDownSmall className='-rotate-90' />
                    </span>
                  )}
                </Button>
              ))}
            </div>
            <ScrollBar
              orientation='vertical'
              forceMount={true}
              className='rounded-xl bg-gray-200 px-0 dark:bg-primary-700'
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
