import { useState } from 'react'
import { CollapsibleContent } from '@radix-ui/react-collapsible'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useCategories } from '@/entities/category/library/hooks/use-categories.tsx'
import {
  Collapsible,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible'
import { SectionTitle } from '@/shared/ui'
import { PopularCategorySkeleton } from '@/shared/ui/skeletons'
import { useMediaQuery } from '@/shared/library/hooks'

export const PopularCategories = () => {
  const [isOpen, setIsOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 1440px)')

  const { t } = useTranslation()

  const { categories, cursor } = useCategories({
    Skeleton: <PopularCategorySkeleton />,
  })

  return (
    <section className='pt-[78px] xl:pt-[116px]'>
      <div className='container'>
        <SectionTitle title={t('titles.popularCategoriesTitle')} />

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div>
            {cursor}
            <ul className='-mr-5 flex items-start gap-[16px] overflow-scroll px-1 pt-1 scrollbar-hide xl:container xl:grid xl:grid-cols-7 xl:gap-x-[38px] xl:gap-y-[45px] xl:px-1'>
              {categories
                ?.slice(0, isDesktop ? 7 : categories.length)
                .map(cat => (
                  <li
                    key={cat.path}
                    className='cursor-pointer transition duration-300 xl:h-[215px] xl:w-[150px] xl:overflow-visible xl:pt-1 xl:hover:scale-105'
                  >
                    <Link
                      to={`/catalog/${cat.path}`}
                      className='xl:space-y-[15px]'
                    >
                      <div className='size-[70px] rounded-[30px] xl:size-[150px]'>
                        <img
                          src={cat.img}
                          alt={cat.title}
                          className='rounded-[30px]'
                        />
                      </div>
                      <h3 className='line-clamp-2 text-center text-[13px] hover:overflow-visible xl:line-clamp-2 xl:text-base/[20.8px]'>
                        {cat.title}
                      </h3>
                    </Link>
                  </li>
                ))}
            </ul>
            <CollapsibleContent className='mt-9'>
              <ul className='-mr-5 flex items-start gap-[16px] overflow-scroll px-1 pt-2 scrollbar-hide xl:container xl:grid xl:grid-cols-7 xl:gap-x-[38px] xl:gap-y-[45px] xl:px-1'>
                {categories
                  ?.slice(isDesktop ? 7 : 6, categories.length)
                  .map(cat => (
                    <li
                      key={cat.path}
                      className='cursor-pointer space-y-[15px] transition duration-300 hover:scale-105 xl:h-[215px] xl:w-[150px]'
                    >
                      <Link
                        to={`/catalog/${cat.path}`}
                        className='xl:space-y-[15px]'
                      >
                        <div className='size-[70px] rounded-[30px] xl:size-[150px]'>
                          <img
                            src={cat.img}
                            alt={cat.title}
                            className='rounded-[30px]'
                          />
                        </div>
                        <h3 className='line-clamp-2 text-center text-base/[20.8px] hover:line-clamp-none'>
                          {cat.title}
                        </h3>
                      </Link>
                    </li>
                  ))}
              </ul>
            </CollapsibleContent>
          </div>

          {categories && categories.length > (isDesktop ? 7 : 6) && (
            <CollapsibleTrigger className='mt-[42px] hidden w-full rounded-[60px] border border-border py-[13px] text-center text-[13px]/[13px] transition-colors duration-300 hover:bg-primary-500 hover:text-gray-50 active:bg-primary-900 active:text-gray-50 active:duration-0 xl:block xl:text-base/4'>
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
