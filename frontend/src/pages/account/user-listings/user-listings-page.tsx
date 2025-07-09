import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AddListingButton } from '@/features/announcement/ui/add-listing-button.tsx'
import { PagePagination } from '@/features/page-pagination'
import {
  renderListingsContent,
  useListingsState,
} from '@/entities/user-listings/library'
import { ListingResponse } from '@/entities/user-listings/models/types.ts'
import { UserListingsTabs } from '@/entities/user-listings/ui/user-listings-tabs.tsx'
import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'
import { PRIVATE_PAGES } from '@/shared/constants'
import { useQueryParams } from '@/shared/library/hooks'

export const UserListingsPage = () => {
  const { t } = useTranslation()
  const {
    data,
    cursor,
    activeTab,
    setActiveTab,
    setCurrentPage,
    getListingsTabCount,
    PAGE_SIZE,
  } = useListingsState()

  const { setQueryParams } = useQueryParams()

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setCurrentPage(1) // Reset to page 1 on tab change
    setQueryParams({
      status: tabId,
      page: '1',
    })
  }

  const tabKey = `total_${activeTab}` as keyof ListingResponse
  const totalCount = data?.[tabKey]

  return (
    <div className='px-2 pt-10 md:px-0 xl:min-h-[calc(100dvh-200px)] xl:pl-[42px] xl:pt-[55px]'>
      <Link
        to={PRIVATE_PAGES.ACCOUNT}
        className='mb-[30px] flex items-center gap-[14px] xl:hidden'
      >
        <ArrowDownSmall className='rotate-90' />
        <h1 className='text-2xl font-semibold text-black'>
          {t(`listings.${activeTab}`)} {t('account.listings').toLowerCase()}
        </h1>
      </Link>
      <div className='mb-10 hidden xl:flex xl:justify-between'>
        <UserListingsTabs activeTab={activeTab} onChangeTab={handleTabChange} />
        {typeof totalCount === 'number' && totalCount > 0 && (
          <AddListingButton className='-my-2 hidden xl:flex' />
        )}
      </div>

      {data ? (
        <div className='h-full w-full'>
          {renderListingsContent(activeTab, data)}
        </div>
      ) : (
        <div>{cursor}</div>
      )}

      <div className='my-5'>
        <PagePagination
          count={getListingsTabCount(activeTab)}
          limit={PAGE_SIZE}
          className='flex'
        />
      </div>
    </div>
  )
}
