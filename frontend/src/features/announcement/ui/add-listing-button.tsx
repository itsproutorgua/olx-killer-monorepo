import { useTranslation } from 'react-i18next'

import { PenIcon } from '@/shared/ui'

export const AddListingButton = () => {
  const { t } = useTranslation()
  return (
    <>
      <button className='flex items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pl-[37px] pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0'>
        <span>{t('buttons.addAdvert')}</span>
        <span className='flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
          <PenIcon />
        </span>
      </button>
    </>
  )
}
