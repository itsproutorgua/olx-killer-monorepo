import { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import i18n from 'i18next'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageToolbar } from '@/widgets/page-toolbar'
import { ProductCard } from '@/widgets/product-card'
import { useFilters } from '@/entities/filter'
import { productApi, ProductsContext } from '@/entities/product'
import { PageLoader, SectionTitle } from '@/shared/ui'
import { NoResults } from '@/shared/ui/no-results.tsx'
import { QUERY_KEYS } from '@/shared/constants'
import { APP_VARIABLES } from '@/shared/constants/app.const'
import { useStrictContext } from '@/shared/library/hooks'
import { cn } from '@/shared/library/utils'

export const ProductGridMobile = ({ path }: { path: string }) => {
  const { t } = useTranslation()
  const { sort, filters } = useFilters()
  const { setCount } = useStrictContext(ProductsContext)
  const currency_code = i18n.language === 'uk' ? 'UAH' : 'USD'

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        QUERY_KEYS.PRODUCTS,
        path,
        sort,
        filters.status,
        filters.price,
        currency_code,
      ],
      queryFn: meta =>
        productApi.findByFilters(
          {
            path,
            limit: APP_VARIABLES.LIMIT_MOBILE,
            page: meta.pageParam ? meta.pageParam : 1,
            price_min: filters.price
              ? Number(filters.price.split('-')[0])
              : undefined,
            price_max: filters.price
              ? Number(filters.price.split('-')[1])
              : undefined,
            status: filters.status,
            sort,
            currency_code,
          },
          meta,
        ),
      enabled: !!path,
      initialPageParam: 1,
      getNextPageParam: result => {
        if (result.next) {
          return Number(result.next.split('page=')[1].split('&')[0])
        }
        return undefined
      },
      select: result => ({
        count: result.pages[0].count,
        items: result.pages.flatMap(page => page.results),
      }),
    })

  useEffect(() => {
    setCount(data?.count ?? 0)
  }, [data?.count, setCount])

  return (
    <>
      <div>
        <PageToolbar />

        {isLoading && <PageLoader />}
        {data?.count === 0 ? (
          <NoResults />
        ) : (
          <>
            <SectionTitle
              title={t('title.announcementsAll')}
              className='pt-[53px]'
            />

            <div className='space-y-[67px]'>
              {data && data.items.length > 0 && (
                <ul className='grid grid-cols-2 gap-x-2.5 gap-y-10'>
                  {data.items.map((product, index) => (
                    <li key={index}>
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className={cn('btn-secondary', !hasNextPage && 'hidden')}
              >
                {isFetchingNextPage ? (
                  <LoaderCircle className='size-6 animate-spin' />
                ) : (
                  t('buttons.showMoreAnnouncements')
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
