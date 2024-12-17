import { emptyInbox } from '@/shared/assets'
import { useTranslation } from 'react-i18next'

export const EmptyInbox = ({ type }: { type: string }) => {
  const { t } = useTranslation()
  return (
    <div className='flex w-full flex-col items-center justify-center pt-[49px]'>
      <img src={emptyInbox} height='225' width='249' alt='empty-inbox' />
      <div className='flex h-[167px] w-[512px] flex-col items-center justify-center pt-[46px] text-center'>
        <h3 className='text-[20px] font-medium leading-[26px]'>
          {t(`listings.${type}Empty`)}
        </h3>
        <p className='pt-4 leading-5'>{t(`listings.addListings`)}</p>
      </div>
    </div>
  )
}
