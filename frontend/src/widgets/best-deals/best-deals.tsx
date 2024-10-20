import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  productApi,
  type Product,
  type ProductResponse,
} from '@/entities/product'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible.tsx'
import { SectionTitle } from '@/shared/ui'
import ProductCardLoader from '@/shared/ui/loaders/product-card.loader.tsx'
import { QUERY_KEYS } from '@/shared/constants'
import { useMediaQuery } from '@/shared/library/hooks'
import { ProductCard } from '../product-card'

const path = 'elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'

export const BestDeals = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const { t } = useTranslation()

  const { isLoading, data, isError } = useQuery<ProductResponse>({
    queryKey: [QUERY_KEYS.PRODUCTS, path],
    queryFn: () => productApi.findByFilters({ path, limit: 28 }),
  })

  if (isError) {
    return <div>Error during loading</div>
  }

  return (
    <section className='container flex flex-col pt-[91px] xl:pt-[100px]'>
      <SectionTitle title={t('titles.bestDealsTitle')} />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {isLoading && (
          <div className='grid grid-cols-2 gap-x-[10px] gap-y-[40px] self-center md:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-[60px]'>
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardLoader key={index} />
            ))}
          </div>
        )}
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
        <CollapsibleTrigger className='border-border mt-[40px] w-full rounded-[60px] border py-[13px] text-center text-[13px]/[13px] transition-colors duration-300 hover:bg-primary-500 hover:text-gray-50 xl:text-base/4'>
          {isOpen ? t('buttons.showLess') : t('buttons.loadMore')}
        </CollapsibleTrigger>
      </Collapsible>
    </section>
  )
}
