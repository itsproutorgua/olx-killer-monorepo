import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EmptyInbox } from '@/widgets/account/empty-inbox/empty-inbox.tsx'
import { HorizontalProductCard } from '@/widgets/product-card/ui/horizontal-product-card.tsx'
import { PagePagination } from '@/features/page-pagination'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'
import { useListings } from '@/entities/user/library/hooks/use-listings.tsx'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { PageLoader } from '@/shared/ui'
import { tabs } from '@/shared/constants/listings-tabs.const.ts'
import { useQueryParams } from '@/shared/library/hooks'

export const ListingsPage = () => {
  const { t } = useTranslation()
  const getIdToken = useIdToken()
  const { getQueryParamByKey, setQueryParam, setQueryParams } = useQueryParams()
  const [idToken, setIdToken] = useState<string>('')
  const PAGE_SIZE = 3

  // Retrieve the current tab and page from the URL
  const currentPageFromUrl = parseInt(getQueryParamByKey('page') || '1')
  const activeTabFromUrl =
    getQueryParamByKey('active') === 'true' ? 'active' : 'inactive'

  const [activeTab, setActiveTab] = useState(activeTabFromUrl)
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl)

  useEffect(() => {
    if (!getQueryParamByKey('active')) {
      setQueryParam('active', 'true')
    }
    if (!getQueryParamByKey('page')) {
      setQueryParam('page', '1')
    }
  }, [getQueryParamByKey, setQueryParam])

  // Sync activeTab and currentPage state with the URL
  useEffect(() => {
    setActiveTab(activeTabFromUrl)
    setCurrentPage(currentPageFromUrl)
  }, [activeTabFromUrl, currentPageFromUrl])

  // Retrieve idToken on component mount
  useEffect(() => {
    const fetchIdToken = async () => {
      const token = await getIdToken()
      setIdToken(token)
    }
    fetchIdToken().catch(error =>
      console.error('Failed to get ID token:', error),
    )
  }, [getIdToken])

  const { data, cursor } = useListings(
    { idToken, activeTab, currentPage, PAGE_SIZE },
    { Skeleton: <PageLoader /> },
  )

  const renderContent = () => {
    if (!data) return <div>{cursor}</div>
    if (data.results.length === 0) return <EmptyInbox type={activeTab} />

    return (
      <div className='flex flex-col gap-5'>
        {data.results.map(product => (
          <div key={product.id}>
            <HorizontalProductCard key={product.id} product={product} />
            <Separator className='mt-5 w-[898px] bg-gray-200' />
          </div>
        ))}
      </div>
    )
  }

  const getTabCount = (tabId: string): number => {
    if (tabId === 'active') return data?.total_active ?? 0
    if (tabId === 'inactive') return data?.total_inactive ?? 0
    return 0 // For other tabs
  }

  const handleTabChange = (tabId: string) => {
    const newActiveValue = tabId === 'active' ? 'true' : 'false'
    setActiveTab(tabId)
    setCurrentPage(1) // Reset to page 1 on tab change
    setQueryParams({
      active: newActiveValue,
      page: '1',
    })
  }

  return (
    <div className='h-full flex-1 pl-[54px] pt-[42px]'>
      <div className='mb-10 flex'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`border-b-[1px] px-[35px] py-[10px] text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-[3px] border-primary-900 text-primary-900'
                : 'border-b-[1px] border-gray-200 pb-3 text-gray-500 hover:text-primary-500'
            }`}
          >
            {t(tab.label)} ({getTabCount(tab.id)})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderContent()}</div>

      {/* Pagination */}
      <PagePagination count={getTabCount(activeTab)} limit={PAGE_SIZE} />
    </div>
  )
}
