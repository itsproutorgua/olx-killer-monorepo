import { useState } from 'react'

import { CategoryResponse, Subcategory } from '@/entities/category'
import { useCategories } from '@/entities/category/library/hooks/use-categories.tsx'
import { Button } from '@/shared/ui/shadcn-ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/shadcn-ui/dialog'
import { Input } from '@/shared/ui/shadcn-ui/input'
import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area'
import { cn } from '@/shared/library/utils'

export function CategoryDialog() {
  const { categories, cursor } = useCategories({})
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null)

  const handleCategoryClick = (category: CategoryResponse) => {
    setSelectedCategory(category)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Select Category</Button>
      </DialogTrigger>
      <DialogContent
        className='animate-contentShow w-full max-w-3xl rounded-lg p-6'
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Select a Category</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className='relative mb-4'>
          <Input
            placeholder="I'm looking for..."
            className='h-12 rounded-full pl-10'
          />
        </div>

        {/* Category Selection UI */}
        <div className='flex max-h-[537px] gap-6'>
          {/* Root Categories */}
          <ScrollArea className='w-[305px] border-r pr-5'>
            <div className='flex flex-col gap-2'>
              {cursor}
              {categories?.map(category => (
                <Button
                  key={category.path}
                  variant={
                    selectedCategory?.path === category.path
                      ? 'default'
                      : 'ghost'
                  }
                  className={cn(
                    'flex w-full justify-start gap-2 px-4 py-2',
                    selectedCategory?.path === category.path &&
                      'bg-primary-600 text-white',
                  )}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={category.title}
                      className='h-5 w-5'
                    />
                  )}
                  {category.title}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Subcategories */}
          <ScrollArea className='w-2/3'>
            {selectedCategory && (
              <div className='flex flex-col gap-2'>
                {selectedCategory.children.length > 0 ? (
                  selectedCategory.children.map((sub: Subcategory) => (
                    <Button
                      key={sub.path}
                      variant='ghost'
                      className='flex w-full items-center justify-start gap-2 px-4 py-2 text-left'
                    >
                      {sub.icon && (
                        <img
                          src={sub.icon}
                          alt={sub.title}
                          className='h-5 w-5'
                        />
                      )}
                      {sub.title}
                    </Button>
                  ))
                ) : (
                  <p className='text-gray-500'>No subcategories available.</p>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
