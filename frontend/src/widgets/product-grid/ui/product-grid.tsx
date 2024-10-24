import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { PageToolbar } from '@/widgets/page-toolbar'
import { ProductCard } from '@/widgets/product-card'
import { FiltersBar } from '@/features/filter-bar'
import { PagePagination } from '@/features/page-pagination'
import { productApi, type ProductResponse } from '@/entities/product'
import { SectionTitle } from '@/shared/ui'
import { QUERY_KEYS } from '@/shared/constants'
import { APP_VARIABLES } from '@/shared/constants/app.const'
import { useQueryParams } from '@/shared/library/hooks'
import { cn } from '@/shared/library/utils'

export const ProductGrid = ({ path }: { path: string }) => {
  const { getQueryParamByKey } = useQueryParams()
  const { t } = useTranslation()
  const page = getQueryParamByKey('page')
    ? Number(getQueryParamByKey('page'))
    : 1
  const limit = APP_VARIABLES.LIMIT

  const { isLoading, data } = useQuery<ProductResponse>({
    queryKey: [QUERY_KEYS.PRODUCTS, path, page, limit],
    queryFn: () =>
      productApi.findByFilters({
        path,
        limit,
        page,
      }),
    placeholderData: keepPreviousData,
    enabled: !!path,
  })

  return (
    <>
      {!isLoading && data && (
        <div>
          <PageToolbar count={data.count} />
          <div className='flex border-t border-border'>
            <aside className='w-[305px]'>
              <FiltersBar />
            </aside>

            <div className='flex-1 space-y-5'>
              <div className='border-b border-l border-border pb-[60px] pl-5 pt-[18px]'>
                <SectionTitle title={t('titles.announcementsAll')} />
                <ul className='grid grid-cols-3 gap-x-5 gap-y-[60px]'>
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

              <PagePagination count={data.count} limit={limit} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
