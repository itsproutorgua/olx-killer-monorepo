import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { ProductCard } from '@/widgets/product-card'
import { useSearch } from '@/entities/search/library/hooks/use-search.ts'
import { Breadcrumbs, PageLoader } from '@/shared/ui'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'
import { NoResults } from '@/shared/ui/no-results.tsx'

export const SearchPage = () => {
  const [params] = useSearchParams()
  const { t } = useTranslation()
  const query = params.get('query') || ''
  const { data: results, isLoading, error } = useSearch(query, !!query)
  const crumbs = [{ text: t('search.searchResult') }]

  return (
    <div className='container min-h-screen py-[27px] xl:py-[42px]'>
      <Breadcrumbs crumbs={crumbs} />
      {isLoading && <PageLoader />}
      {error && <FetchError />}
      {!isLoading && results?.length !== 0 ? (
        <>
          <h1 className='text-[26px] font-medium text-gray-900'>
            {t('search.foundListings', { count: results?.length || 0 })}
          </h1>
          <div className='grid grid-cols-2 gap-4 pt-[20px] md:grid-cols-3 xl:grid-cols-4'>
            {results?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <>
          <NoResults />
          <p className='mx-auto -mt-8 w-max text-sm text-gray-600 xl:text-base'>
            {t('search.tryFullWord')}
          </p>
        </>
      )}
    </div>
  )
}
