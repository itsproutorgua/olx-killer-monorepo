import { useTranslation } from 'react-i18next'

import { useListingsState } from '@/entities/user-listings/library'
import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'
import { tabs } from '@/shared/constants/user-listings-tabs.const.ts'

export const UserListingsTabs = ({
  activeTab,
  onChangeTab,
}: {
  activeTab: string
  onChangeTab: (tabId: string) => void
}) => {
  const { t } = useTranslation()
  const { getTabCount } = useListingsState()
  return (
    <div className='flex flex-col xl:flex-row'>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChangeTab(tab.id)}
          className={`flex items-center justify-between border-b-[1px] px-0 py-[14px] text-start hover:text-primary-500 xl:px-[35px] xl:py-[10px] xl:pt-0 xl:text-center xl:text-sm xl:font-medium ${
            activeTab === tab.id
              ? 'xl:border-b-[3px] xl:border-primary-900 xl:text-primary-900'
              : 'xl:border-b-[1px] xl:border-gray-200 xl:pb-3 xl:text-gray-500'
          }`}
        >
          {t(tab.label)} ({getTabCount(tab.id)})
          <ArrowDownSmall className='-rotate-90 xl:hidden' />
        </button>
      ))}
    </div>
  )
}
