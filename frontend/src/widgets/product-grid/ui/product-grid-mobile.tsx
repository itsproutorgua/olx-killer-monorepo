import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageToolbar } from '@/widgets/page-toolbar'
import { ProductCard } from '@/widgets/product-card'
import { Product, productApi, type ProductResponse } from '@/entities/product'
import { SectionTitle } from '@/shared/ui'
import { QUERY_KEYS } from '@/shared/constants'
import { APP_VARIABLES } from '@/shared/constants/app.const'
import { cn } from '@/shared/library/utils'

export const ProductGridMobile = ({ path }: { path: string }) => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [announcements, setAnnouncements] = useState<Product[]>([])
  const pages = useRef(1)

  const { isLoading, data } = useQuery<ProductResponse>({
    queryKey: [QUERY_KEYS.PRODUCTS, path, page],
    queryFn: () =>
      productApi.findByFilters({
        path,
        limit: APP_VARIABLES.LIMIT_MOBILE,
        page,
      }),
    enabled: !!path,
  })

  const calculateTotalPages = useCallback((count: number) => {
    return Math.ceil(count / APP_VARIABLES.LIMIT_MOBILE)
  }, [])

  useEffect(() => {
    if (data) {
      pages.current = calculateTotalPages(data.count)
      setAnnouncements(prev => [...prev, ...data.results])
    }
  }, [calculateTotalPages, data])

  return (
    <>
      <div>
        <PageToolbar count={0} />
        <SectionTitle title={t('titles.announcementsAll')} />

        <div className='space-y-[67px]'>
          {announcements.length > 0 && (
            <ul className='grid grid-cols-2 gap-x-2.5 gap-y-10'>
              {announcements.map((product, index) => (
                <li key={index}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setPage(page + 1)}
            className={cn('btn-secondary', pages.current === page && 'hidden')}
          >
            {isLoading ? (
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
