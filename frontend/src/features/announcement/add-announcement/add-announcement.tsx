import { useTranslation } from 'react-i18next'

import { AddListingButton } from '@/features/announcement/ui/add-listing-button.tsx'

export const AddAnnouncement = () => {
  const { t } = useTranslation()
  return (
    <div className='flex max-h-[329px] w-full max-w-[305px] flex-col items-center rounded-[15px] border border-border/60 pb-[89px] pt-[99px]'>
      <div className='space-y-7'>
        <h2 className='w-[189px] text-[26px]/[28.6px] font-medium'>
          {t('title.announcementTitle')}
        </h2>
        <AddListingButton />
      </div>
    </div>
  )
}
