import { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageToolbar } from '@/widgets/page-toolbar'
import { ProductCard } from '@/widgets/product-card'
import { useFilters } from '@/entities/filter'
import { productApi, ProductsContext } from '@/entities/product'
import { SectionTitle } from '@/shared/ui'
import { QUERY_KEYS } from '@/shared/constants'
import { APP_VARIABLES } from '@/shared/constants/app.const'
import { useStrictContext } from '@/shared/library/hooks'
import { cn } from '@/shared/library/utils'

export const ProductGridMobile = ({ path }: { path: string }) => {
  const { t } = useTranslation()
  const { sort, filters } = useFilters()
  const { setCount } = useStrictContext(ProductsContext)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [QUERY_KEYS.PRODUCTS, path, sort, filters.status],
      queryFn: meta =>
        productApi.findByFilters(
          {
            path,
            limit: APP_VARIABLES.LIMIT_MOBILE,
            page: meta.pageParam ? meta.pageParam : 1,
            price_min: Number(filters.price?.split('-')[0]),
            price_max: Number(filters.price?.split('-')[1]),
            status: filters.status,
            sort,
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
    if (data?.count) {
      setCount(data.count)
    }
  }, [data?.count, setCount])

  return (
    <>
      <div>
        <PageToolbar />
        <SectionTitle title={t('titles.announcementsAll')} />

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
      </div>
    </>
  )
}
