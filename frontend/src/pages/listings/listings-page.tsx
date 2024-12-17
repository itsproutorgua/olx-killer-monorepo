import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EmptyInbox } from '@/widgets/account/empty-inbox/empty-inbox.tsx'

export const ListingsPage = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('active')

  const tabs = [
    { id: 'active', label: t('listings.active') },
    { id: 'pending', label: t('listings.pending') },
    { id: 'unpaid', label: t('listings.unpaid') },
    { id: 'inactive', label: t('listings.inactive') },
    { id: 'rejected', label: t('listings.rejected') },
  ]

  const renderEmptyContent = () => {
    switch (activeTab) {
      case 'active':
        return <EmptyInbox type='active' />
      case 'pending':
        return <EmptyInbox type='pending' />
      case 'unpaid':
        return <EmptyInbox type='unpaid' />
      case 'inactive':
        return <EmptyInbox type='inactive' />
      case 'rejected':
        return <EmptyInbox type='rejected' />
      default:
        return null
    }
  }

  return (
    <div className='h-full flex-1 pl-[54px] pt-[42px]'>
      {/* Tab Navigation */}
      <div className='mb-10 flex'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-[3px] px-[35px] py-[10px] text-sm font-medium ${
              activeTab === tab.id
                ? 'border-primary-900 text-primary-900'
                : 'border-b-[1px] border-gray-200 pb-3 text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} (0)
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderEmptyContent()}</div>
    </div>
  )
}
