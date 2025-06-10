import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useProducts, type Product } from '@/entities/product'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible.tsx'
import { SectionTitle } from '@/shared/ui'
import { BestDealsSkeleton } from '@/shared/ui/skeletons'
import { useMediaQuery } from '@/shared/library/hooks'
import { ProductCard } from '../product-card'

const path = 'elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'

export const BestDeals = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const { t } = useTranslation()
  const limit = 28
  const sectionRef = useRef<HTMLElement | null>(null)
  const prevOpen = useRef(false)

  const { data, cursor } = useProducts(
    {
      path,
      limit,
    },
    { Skeleton: <BestDealsSkeleton /> },
  )

  // Scroll back into view when collapsing
  useEffect(() => {
    if (prevOpen.current && !isOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    prevOpen.current = isOpen
  }, [isOpen])

  return (
    <section
      ref={sectionRef}
      className='container flex flex-col pt-[91px] xl:pt-[100px]'
    >
      <SectionTitle title={t('title.bestDealsTitle')} />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {cursor}
        <div className='grid grid-cols-2 gap-x-[10px] gap-y-[40px] self-center md:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-[60px]'>
          {data?.results
            .slice(0, 8)
            .map((product: Product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
        </div>
        <CollapsibleContent>
          <div className='mt-[35px] grid grid-cols-2 gap-x-[10px] gap-y-[40px] self-center md:grid-cols-3 xl:mt-[50px] xl:grid-cols-4 xl:gap-x-5 xl:gap-y-[60px]'>
            {data?.results
              .slice(8, isDesktop ? data?.results.length : 16)
              .map((product: Product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger className='mt-[40px] w-full rounded-[60px] border border-border py-[13px] text-center text-[13px]/[13px] transition-colors duration-300 hover:bg-primary-500 hover:text-gray-50 active:bg-primary-900 active:text-gray-50 active:duration-0 xl:text-base/4'>
          {isOpen ? t('buttons.showLess') : t('buttons.loadMore')}
        </CollapsibleTrigger>
      </Collapsible>
    </section>
  )
}
