import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BEST_DEALS } from '@/entities/product'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible.tsx'
import { SectionTitle } from '@/shared/ui'
import { useMediaQuery } from '@/shared/lib/hooks'
import { ProductCard } from '../product-card'

export const BestDeals = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const { t } = useTranslation()

  return (
    <section className='container flex flex-col pt-[83px] xl:pt-[122px]'>
      <SectionTitle title={t('titles.bestDealsTitle')} />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className='grid grid-cols-2 gap-x-[10px] gap-y-[35px] self-center md:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-[50px]'>
          {BEST_DEALS.slice(0, isDesktop ? 16 : 8).map(item => (
            <ProductCard
              key={item.id}
              image={item.image}
              description={item.description}
              price={item.price}
            />
          ))}
        </div>
        <CollapsibleContent>
          <div className='mt-[35px] grid grid-cols-2 gap-x-[10px] gap-y-[35px] self-center md:grid-cols-3 xl:mt-[50px] xl:grid-cols-4 xl:gap-x-5 xl:gap-y-[50px]'>
            {BEST_DEALS.slice(
              isDesktop ? 16 : 8,
              isDesktop ? BEST_DEALS.length : 16,
            ).map(item => (
              <ProductCard
                key={item.id}
                image={item.image}
                description={item.description}
                price={item.price}
              />
            ))}
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger className='mt-[45px] w-full rounded-[60px] border border-border py-[13px] text-center text-[13px]/[13px] transition-colors duration-300 hover:bg-accent hover:text-accent-foreground xl:text-base/4'>
          {isOpen ? `${t('buttons.showLess')}` : `${t('buttons.loadMore')}`}
        </CollapsibleTrigger>
      </Collapsible>
    </section>
  )
}
