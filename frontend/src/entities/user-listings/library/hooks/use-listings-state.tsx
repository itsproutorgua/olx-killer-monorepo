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
    const tabCounts: Record<string, number | undefined> = {
      active: data?.total_active,
      inactive: data?.total_inactive,
      pending: data?.total_pending,
      rejected: data?.total_rejected,
    }

    return tabCounts[tabId] ?? 0
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
