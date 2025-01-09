import { PagePagination } from '@/features/page-pagination'
import {
  renderListingsContent,
  useListingsState,
} from '@/entities/user-listings/library'
import { ListingsTabs } from '@/entities/user-listings/ui/listings-tabs.tsx'
import { useQueryParams } from '@/shared/library/hooks'

export const ListingsPage = () => {
  const {
    data,
    cursor,
    activeTab,
    setActiveTab,
    setCurrentPage,
    getTabCount,
    PAGE_SIZE,
  } = useListingsState()

  const { setQueryParams } = useQueryParams()

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
        <ListingsTabs activeTab={activeTab} onChangeTab={handleTabChange} />
      </div>

      {data ? (
        <div>{renderListingsContent(activeTab, data)}</div>
      ) : (
        <div>{cursor}</div>
      )}

      <div className='mt-5'>
        <PagePagination count={getTabCount(activeTab)} limit={PAGE_SIZE} />
      </div>
    </div>
  )
}
