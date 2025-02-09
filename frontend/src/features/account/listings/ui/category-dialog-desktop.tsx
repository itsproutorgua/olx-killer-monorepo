import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryResponse, Subcategory } from '@/entities/category'
import { useCategories } from '@/entities/category/library/hooks/use-categories.tsx'
import { Button } from '@/shared/ui/shadcn-ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn-ui/dialog'
import { Input } from '@/shared/ui/shadcn-ui/input.tsx'
import { ScrollArea, ScrollBar } from '@/shared/ui/shadcn-ui/scroll-area'
import { SearchIcon } from '@/shared/ui'
import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'
import { cn } from '@/shared/library/utils'

export interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (id: string, title: string) => void
}

export function CategoryDialogDesktop({
  open,
  onOpenChange,
  onSelect,
}: CategoryDialogProps) {
  const { t } = useTranslation()
  const { categories, cursor } = useCategories({})
  const [selectedRootCategory, setSelectedRootCategory] =
    useState<CategoryResponse | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null)

  const handleRootCategorySelect = (category: CategoryResponse) => {
    setSelectedRootCategory(category)
    setSelectedSubcategory(null)
  }

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    if (subcategory.children?.length > 0) {
      setSelectedSubcategory(subcategory)
    } else {
      onSelect(subcategory.id.toString(), subcategory.title)
      onOpenChange(false)
    }
  }

  const handleChildCategorySelect = (childCategory: Subcategory) => {
    onSelect(childCategory.id.toString(), childCategory.title)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className='w-full max-w-[1160px] animate-contentShow gap-10 rounded-[20px] p-10'
      >
        <DialogHeader>
          <DialogTitle className='text-start text-[32px] font-medium leading-[38px] text-gray-900'>
            {t('listingForm.fields.category.label')}
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className='relative'>
          <Input
            placeholder={t('inputs.searchPlaceholder')}
            className='h-12 rounded-full border-none bg-gray-50 pl-14'
          />
          <button className='absolute right-[4.81px] top-1/2 flex h-9 w-[91px] -translate-y-1/2 items-center justify-center rounded-[60px] bg-primary-900 text-[13px] text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 xl:right-[4.89px] xl:w-[117px]'>
            {t('buttons.searchButton')}
          </button>
          <SearchIcon className='absolute left-[22.49px] top-1/2 -translate-y-1/2' />
        </div>

        <div className='flex max-h-[537px] gap-[26px] text-gray-900'>
          {/* Root Categories */}
          <ScrollArea className='w-[331px] pr-[30px]'>
            <div className='flex flex-col gap-2'>
              {cursor}
              {categories?.map(category => (
                <Button
                  key={category.path}
                  variant={
                    selectedRootCategory?.path === category.path
                      ? 'default'
                      : 'ghost'
                  }
                  className={cn(
                    'flex w-full justify-start gap-2 rounded-[89px] py-2 pl-4 pr-1',
                    selectedRootCategory?.path === category.path &&
                      'bg-primary-700 text-gray-50',
                  )}
                  onClick={() => handleRootCategorySelect(category)}
                >
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={category.title}
                      className={`h-5 w-5 ${
                        selectedRootCategory?.path === category.path && 'invert'
                      }`}
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

          {/* Subcategories */}
          <ScrollArea className='w-[331px] pr-[30px]'>
            <div className='flex flex-col gap-2'>
              {selectedRootCategory?.children?.map(subcategory => (
                <Button
                  key={subcategory.path}
                  variant={
                    selectedSubcategory?.path === subcategory.path
                      ? 'default'
                      : 'ghost'
                  }
                  className={cn(
                    'flex max-w-[301px] justify-start gap-2 rounded-[89px] py-2 pl-4 pr-1',
                    selectedSubcategory?.path === subcategory.path &&
                      'bg-primary-700 text-gray-50',
                  )}
                  onClick={() => handleSubcategorySelect(subcategory)}
                >
                  <span className='truncate'>{subcategory.title}</span>
                  {subcategory.children?.length > 0 && (
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

          {/* Child Categories */}
          <ScrollArea className=''>
            <div className='flex flex-col gap-2'>
              {selectedSubcategory?.children?.map(childCategory => (
                <Button
                  key={childCategory.path}
                  variant='ghost'
                  className='flex justify-start gap-2 px-4 py-2 text-left'
                  onClick={() => handleChildCategorySelect(childCategory)}
                >
                  {childCategory.title}
                </Button>
              ))}
            </div>
            <ScrollBar
              orientation='vertical'
              forceMount={true}
              className='w-[5px] rounded-xl bg-gray-200 px-0 dark:bg-primary-700'
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
