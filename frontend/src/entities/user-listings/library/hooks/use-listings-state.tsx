import { useEffect, useState } from 'react'

import { useListings } from '@/entities/user-listings/library'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'
import { PageLoader } from '@/shared/ui'
import { useQueryParams } from '@/shared/library/hooks'

export const useListingsState = () => {
  const PAGE_SIZE = 10
  const { getQueryParamByKey } = useQueryParams()
  const getIdToken = useIdToken()

  const activeTabFromUrl = getQueryParamByKey('status') || 'active'
  const currentPageFromUrl = parseInt(getQueryParamByKey('page') || '1')

  const [activeTab, setActiveTab] = useState(activeTabFromUrl)
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl)
  const [idToken, setIdToken] = useState<string>('')

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

  const getListingsTabCount = (tabId: string): number => {
    switch (tabId) {
      case 'active':
        return data?.total_active ?? 0
      case 'inactive':
        return data?.total_inactive ?? 0
      case 'pending':
        return data?.total_draft ?? 0
      case 'rejected':
        return data?.total_rejected ?? 0
      default:
        return 0
    }
  }

  return {
    data,
    activeTab,
    cursor,
    setActiveTab,
    currentPage,
    setCurrentPage,
    getListingsTabCount,
    PAGE_SIZE,
  }
}
