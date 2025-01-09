import { useEffect, useState } from 'react'

import { useListings } from '@/entities/user-listings/library'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'
import { PageLoader } from '@/shared/ui'
import { useQueryParams } from '@/shared/library/hooks'

export const useListingsState = () => {
  const PAGE_SIZE = 3
  const { getQueryParamByKey, setQueryParam } = useQueryParams()
  const getIdToken = useIdToken()

  const activeTabFromUrl =
    getQueryParamByKey('active') === 'true' ? 'active' : 'inactive'
  const currentPageFromUrl = parseInt(getQueryParamByKey('page') || '1')

  const [activeTab, setActiveTab] = useState(activeTabFromUrl)
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl)
  const [idToken, setIdToken] = useState<string>('')

  useEffect(() => {
    if (!getQueryParamByKey('active')) setQueryParam('active', 'true')
    if (!getQueryParamByKey('page')) setQueryParam('page', '1')
  }, [getQueryParamByKey, setQueryParam])

  useEffect(() => {
    setActiveTab(activeTabFromUrl)
    setCurrentPage(currentPageFromUrl)
  }, [activeTabFromUrl, currentPageFromUrl])

  useEffect(() => {
    getIdToken()
      .then(idToken => setIdToken(idToken))
      .catch(error => console.error('Failed to get ID token:', error))
  }, [getIdToken])

  const { data, cursor } = useListings(
    { idToken, activeTab, currentPage, PAGE_SIZE },
    { Skeleton: <PageLoader /> },
  )

  const getTabCount = (tabId: string): number => {
    if (tabId === 'active') return data?.total_active ?? 0
    if (tabId === 'inactive') return data?.total_inactive ?? 0
    return 0 // For other tabs
  }

  return {
    data,
    activeTab,
    cursor,
    setActiveTab,
    currentPage,
    setCurrentPage,
    getTabCount,
    PAGE_SIZE,
  }
}
