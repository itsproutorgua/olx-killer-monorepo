import { useEffect } from 'react'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'

import { PageToolbar } from '@/widgets/page-toolbar'
import { FiltersBar } from '@/features/filters-bar'
import { PagePagination } from '@/features/page-pagination'
import { ProductsContext, useProducts } from '@/entities/product'
import { SectionTitle } from '@/shared/ui'
import { NoResults } from '@/shared/ui/no-results'
import {
  APP_VARIABLES,
  FilterEnum,
  type SortEnum,
} from '@/shared/constants/app.const'
import { useQueryParams, useStrictContext } from '@/shared/library/hooks'
import { ProductList } from './product-list'

export const ProductGrid = ({ path }: { path: string }) => {
  const { t } = useTranslation()
  const { getQueryParamByKey } = useQueryParams()

  const limit = APP_VARIABLES.LIMIT
  const sort = getQueryParamByKey('sort') as SortEnum
  const page = getQueryParamByKey('page')
    ? Number(getQueryParamByKey('page'))
    : 1
  const priceRange =
    getQueryParamByKey(FilterEnum.PRICE)?.split('-').map(Number) || []
  const price_min = Number.isInteger(priceRange[0]) ? priceRange[0] : undefined
  const price_max = Number.isInteger(priceRange[1]) ? priceRange[1] : undefined
  const status = getQueryParamByKey(FilterEnum.STATUS)
  const currency_code = i18n.language === 'uk' ? 'UAH' : 'USD'

  const { data, cursor } = useProducts(
    {
      path,
      page,
      limit,
      price_min,
      price_max,
      status,
      sort,
      currency_code,
    },
    {},
  )

  const { setCount } = useStrictContext(ProductsContext)

  useEffect(() => {
    setCount(data?.count ?? 0)
  }, [data?.count, setCount, data])

  return (
    <>
      {cursor}

      {data && (
        <div>
          <PageToolbar />

          <div className='flex border-t border-border'>
            <aside className='w-[305px]'>
              <FiltersBar />
            </aside>

            <div className='flex-1 space-y-5'>
              <div className='border-b border-l border-border pb-[60px] pl-5 pt-[18px]'>
                {data.count === 0 ? (
                  <NoResults />
                ) : (
                  <>
                    <SectionTitle title={t('title.announcementsAll')} />
                    <ProductList data={data.results} />
                  </>
                )}
              </div>

              <PagePagination count={data.count} limit={limit} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
