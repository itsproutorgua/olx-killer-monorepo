import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Product } from '@/entities/product'
import { SpinnerIcon } from '@/shared/ui/icons'

interface SearchResultsProps {
  results: Product[]
  isLoading: boolean
  isError: boolean
  isExpanded: boolean
}

export const SearchBox = ({
  results,
  isLoading,
  isError,
  isExpanded,
}: SearchResultsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  if (!isExpanded) {
    return null
  }

  return (
    <div className='absolute left-1/2 z-[100] mt-[10px] w-[calc(100%-1rem)] max-w-[638px] -translate-x-1/2 rounded-[10px] bg-white p-6 shadow-lg'>
      <div className='flex items-center gap-2 px-4 pb-[18px]'>
        <SearchIcon className='h-4 w-4 text-primary-700' />
        <span className='text-xs xl:text-base'>{t('search.searchResult')}</span>
      </div>
      <div className='max-h-[300px] overflow-y-auto'>
        {isLoading ? (
          <div className='space-y-3 px-4 py-2'>
            <SpinnerIcon className='animate-spin' />
          </div>
        ) : isError ? (
          <div className='px-4 py-3 text-sm text-gray-500'>
            {t('search.searchError')}
          </div>
        ) : results.length === 0 ? (
          <div className='px-4 py-3 text-sm text-gray-700'>
            {t('search.searchNotFound')}
            <p className='text-xs text-gray-500'>{t('search.tryFullWord')}</p>
          </div>
        ) : (
          results.slice(0, 5).map(result => (
            <div
              key={result.id}
              onClick={() => navigate(`/products/${result.slug}`)}
              className='flex cursor-pointer flex-col items-start space-y-[34px] px-4 py-4 transition-colors hover:bg-gray-50'
            >
              <div className='p-0'>
                <div className='text-sm font-medium xl:text-base'>
                  {result.title}
                </div>
                <div className='text-xs text-gray-600 xl:text-sm'>
                  {result.category.parent?.parent?.title && (
                    <>
                      {result.category.parent.parent.title}
                      <span className='px-1'>/</span>
                    </>
                  )}
                  {result.category.parent?.title && (
                    <>
                      {result.category.parent.title}
                      <span className='px-1'>/</span>
                    </>
                  )}
                  {result.category.title}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
