import { useTranslation } from 'react-i18next'

import img from '../assets/images/no_results_catalog.png'

export const NoResults = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center gap-[30px] py-10 pt-[100px] md:gap-[34px] md:pt-[129px]'>
      <img
        src={img}
        alt='No results'
        className='w-60 overflow-hidden rounded-md md:w-[326px]'
      />
      <h3 className='text-xl font-medium md:text-[26px]'>
        {t('filters.noResults')}
      </h3>
    </div>
  )
}
