import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { PageToolbar } from '@/widgets/page-toolbar'
import { ProductCard } from '@/widgets/product-card'
import { FiltersBar } from '@/features/filter-bar'
import { PagePagination } from '@/features/page-pagination'
import { productApi, type ProductResponse } from '@/entities/product'
import { SectionTitle } from '@/shared/ui'
import { QUERY_KEYS } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

export const ProductGrid = ({ path }: { path: string }) => {
  const { t } = useTranslation()
  const { isLoading, data } = useQuery<ProductResponse>({
    queryKey: [QUERY_KEYS.PRODUCTS, path],
    queryFn: () => productApi.findByFilters({ path, limit: 28 }),
  })

  return (
    <>
      {!isLoading && data && (
        <div>
          <PageToolbar />
          <div>
            <SectionTitle
              title={t('titles.announcementsAll')}
              className='xl:hidden'
            />
            <div className='xl:border-border flex xl:border-t'>
              <aside className='hidden xl:block xl:w-[305px]'>
                <FiltersBar />
              </aside>

              <div className='flex-1 space-y-5'>
                <div className='xl:border-border xl:border-b xl:border-l xl:pb-[60px] xl:pl-5 xl:pt-[18px]'>
                  <SectionTitle
                    title={t('titles.announcementsAll')}
                    className='hidden xl:block'
                  />
                  <ul className='mb-16 grid grid-cols-2 gap-x-2.5 gap-y-10 xl:mb-0 xl:grid-cols-3 xl:gap-x-5 xl:gap-y-[60px]'>
                    {data.results.map((product, index) => (
                      <li key={index}>
                        <ProductCard product={product} />
                      </li>
                    ))}
                  </ul>

                  <button className={cn('btn-secondary', 'xl:hidden')}>
                    {t('buttons.showMoreAnnouncements')}
                  </button>
                </div>

                <PagePagination />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
