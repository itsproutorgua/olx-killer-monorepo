import { useState } from 'react'
import { CollapsibleContent } from '@radix-ui/react-collapsible'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { categoryApi } from '@/entities/category'
import { CategoryResponse } from '@/entities/category/model/category.types.ts'
import {
  Collapsible,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible'
import { SectionTitle } from '@/shared/ui'
import PopularCategoryLoader from '@/shared/ui/loaders/popular-categories.loader.tsx'
import { QUERY_KEYS } from '@/shared/constants'
import { useMediaQuery } from '@/shared/library/hooks'

export const PopularCategories = () => {
  const [isOpen, setIsOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 1440px)')

  const { t, i18n } = useTranslation()

  const {
    isLoading,
    isError,
    data: categories,
    error,
  } = useQuery<CategoryResponse[]>({
    queryKey: [QUERY_KEYS.CATEGORIES, i18n.language],
    queryFn: () => categoryApi.findAll(1),
    retry: 1,
    refetchOnWindowFocus: false,
  })

  if (isError) return <p>Error: {error.message}</p>

  return (
    <section className='pt-[78px] xl:pt-[116px]'>
      <div className='container'>
        <SectionTitle title={t('titles.popularCategoriesTitle')} />

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div>
            {isLoading && (
              <ul className='grid grid-cols-2 gap-x-2.5 gap-y-[45px] pb-[83px] xl:grid-cols-7 xl:gap-x-[38px] xl:pb-0'>
                {Array.from({ length: isDesktop ? 14 : 6 }).map((_, index) => (
                  <li key={index}>
                    <PopularCategoryLoader />
                  </li>
                ))}
              </ul>
            )}
            <ul className='grid grid-cols-2 gap-x-2.5 gap-y-[45px] xl:grid-cols-7 xl:gap-x-[38px]'>
              {categories?.slice(0, isDesktop ? 13 : 6).map(cat => (
                <li
                  key={cat.path}
                  className='cursor-pointer transition duration-300 hover:scale-105'
                >
                  <Link
                    to={`/catalog/${cat.path}`}
                    reloadDocument
                    className='space-y-[15px]'
                  >
                    <div className='size-[150px] rounded-full'>
                      <img
                        src={cat.img}
                        alt={cat.title}
                        className='rounded-full'
                      />
                    </div>
                    <h3 className='line-clamp-1 w-[150px] text-center text-base/[20.8px] hover:overflow-visible'>
                      {cat.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
            <CollapsibleContent>
              <ul className='mt-[45px] grid grid-cols-2 gap-x-2.5 gap-y-8 xl:grid-cols-7 xl:gap-x-[38px]'>
                {categories
                  ?.slice(isDesktop ? 13 : 6, categories.length)
                  .map(cat => (
                    <li
                      key={cat.path}
                      className='cursor-pointer space-y-[15px] transition duration-300 hover:scale-105'
                    >
                      <div className='size-[172px] rounded-full xl:size-[150px]'>
                        <img
                          src={cat.img}
                          alt={cat.title}
                          className='rounded-full'
                        />
                      </div>
                      <h3 className='line-clamp-1 text-center text-base/[20.8px]'>
                        {cat.title}
                      </h3>
                    </li>
                  ))}
              </ul>
            </CollapsibleContent>
          </div>

          {categories && categories.length > (isDesktop ? 14 : 6) && (
            <CollapsibleTrigger className='mt-[42px] w-full rounded-[60px] border border-border py-[13px] text-center text-[13px]/[13px] transition-colors duration-300 hover:bg-primary-500 hover:text-gray-50 active:bg-primary-900 active:text-gray-50 active:duration-0 xl:text-base/4'>
              {isOpen
                ? `${t('buttons.showLess')}`
                : `${t('buttons.showAllCategories')}`}
            </CollapsibleTrigger>
          )}
        </Collapsible>
      </div>
    </section>
  )
}
