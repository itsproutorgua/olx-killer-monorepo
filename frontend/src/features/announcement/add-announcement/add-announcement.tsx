import { useTranslation } from 'react-i18next'

import { AddListingButton } from '@/features/announcement/ui/add-listing-button.tsx'

export const AddAnnouncement = () => {
  const { t } = useTranslation()
  return (
    <div className='flex max-h-[158px] w-full max-w-[305px] flex-col items-center rounded-[15px] border border-border/60 px-[20px] pb-[19px] pt-[20px]'>
      <div className='space-y-[14px]'>
        <h2 className='w-[189px] text-[24px]/[26px] font-medium text-primary-800'>
          {t('title.announcementTitle')}
        </h2>
        <AddListingButton />
      </div>
    </div>
  )
}
