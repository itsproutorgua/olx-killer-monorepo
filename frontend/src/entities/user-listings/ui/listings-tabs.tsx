import { useTranslation } from 'react-i18next'

import { useListingsState } from '@/entities/user-listings/library'
import { tabs } from '@/shared/constants/listings-tabs.const.ts'

export const ListingsTabs = ({
  activeTab,
  onChangeTab,
}: {
  activeTab: string
  onChangeTab: (tabId: string) => void
}) => {
  const { t } = useTranslation()
  const { getTabCount } = useListingsState()
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChangeTab(tab.id)}
          className={`border-b-[1px] px-[35px] py-[10px] text-sm font-medium ${
            activeTab === tab.id
              ? 'border-b-[3px] border-primary-900 text-primary-900'
              : 'border-b-[1px] border-gray-200 pb-3 text-gray-500 hover:text-primary-500'
          }`}
        >
          {t(tab.label)} ({getTabCount(tab.id)})
        </button>
      ))}
    </>
  )
}
