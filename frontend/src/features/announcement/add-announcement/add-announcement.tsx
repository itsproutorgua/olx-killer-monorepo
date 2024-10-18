import { useTranslation } from 'react-i18next'

import { PenIcon } from '@/shared/ui'

export const AddAnnouncement = () => {
  const { t } = useTranslation()
  return (
    <div className='max-h-[329px] w-[305px] flex-none space-y-7 rounded-[15px] border border-border/60 pb-[89px] pl-[35px] pt-[99px]'>
      <h2 className='w-[189px] text-[24px]/[28.6px] font-medium'>
        {t('titles.announcementTitle')}
      </h2>
      <button className='flex items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pl-[37px] pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500'>
        <span>{t('buttons.addAdvert')}</span>
        <span className='flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
          <PenIcon />
        </span>
      </button>
    </div>
  )
}
