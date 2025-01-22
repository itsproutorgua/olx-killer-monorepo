import { emptyInbox } from '@/shared/assets'
import { useTranslation } from 'react-i18next'

import { AddListingButton } from '@/features/announcement/ui/add-listing-button.tsx'

export const EmptyInbox = ({ type }: { type?: string }) => {
  const { t } = useTranslation()
  return (
    <div className='flex w-full flex-col items-center justify-center pt-[49px]'>
      <img
        src={emptyInbox}
        alt='empty-inbox'
        className='h-[182px] xl:h-[224px]'
      />
      <div className='flex flex-col items-center justify-center pt-[46px] text-center text-gray-950 xl:w-[512px]'>
        <h3 className='max-w-[271px] text-[20px] font-medium leading-[26px] xl:max-w-[512px]'>
          {t(`listings.${type}Empty`)}
        </h3>
        {type === 'favorite' ? (
          <p className='pb-[30px] pt-4 leading-5'>
            {t(`listings.addFavorite`)}
          </p>
        ) : (
          <p className='pb-[30px] pt-4 leading-5'>
            {t(`listings.addListings`)}
          </p>
        )}
        {type !== 'favorite' && <AddListingButton />}
      </div>
    </div>
  )
}
