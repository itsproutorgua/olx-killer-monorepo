import { useState } from 'react'
import { CollapsibleContent } from '@radix-ui/react-collapsible'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { CATEGORIES } from '@/entities/category'
import {
  Collapsible,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible'
import { Picture, SectionTitle } from '@/shared/ui'
import { useMediaQuery } from '@/shared/lib/hooks'

export const PopularCategories = () => {
  const [isOpen, setIsOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const categories = [...CATEGORIES].sort((a, b) => b.rating - a.rating)
  const { t } = useTranslation()

  return (
    <section className='pt-[52px] xl:pt-[116px]'>
      <div className='container'>
        <SectionTitle title={t('titles.popularCategoriesTitle')} />

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className='mb-[45px]'>
            <ul className='grid grid-cols-2 gap-x-2.5 gap-y-[45px] xl:grid-cols-7 xl:gap-x-[38px]'>
              {categories.slice(0, isDesktop ? 14 : 6).map(cat => (
                <li
                  key={cat.name}
                  className='cursor-pointer transition duration-300 hover:scale-105'
                >
                  <Link to={`/public`} className='space-y-[15px]'>
                    <div className='size-[172px] rounded-full xl:size-[150px]'>
                      <Picture
                        src={cat.image.src}
                        alt={cat.image.alt}
                        srcset={cat.image.srcset}
                        type={cat.image.type}
                        styles='rounded-full'
                      />
                    </div>
                    <h3 className='line-clamp-1 text-center text-base/[20.8px] hover:overflow-visible'>
                      {cat.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
            <CollapsibleContent>
              <ul className='mt-[45px] grid grid-cols-2 gap-x-2.5 gap-y-8 xl:grid-cols-7 xl:gap-x-[38px]'>
                {categories
                  .slice(isDesktop ? 14 : 6, categories.length)
                  .map(cat => (
                    <li
                      key={cat.name}
                      className='cursor-pointer space-y-[15px] transition duration-300 hover:scale-105'
                    >
                      <div className='size-[172px] rounded-full xl:size-[150px]'>
                        <Picture
                          src={cat.image.src}
                          alt={cat.image.alt}
                          srcset={cat.image.srcset}
                          type={cat.image.type}
                          styles='rounded-full'
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

          <CollapsibleTrigger className='w-full rounded-[60px] border border-border py-[13px] text-center text-[13px]/[13px] transition-colors duration-300 hover:bg-accent hover:text-accent-foreground xl:text-base/4'>
            {isOpen
              ? `${t('buttons.showLess')}`
              : `${t('buttons.showAllCategories')}`}
          </CollapsibleTrigger>
        </Collapsible>
      </div>
    </section>
  )
}
