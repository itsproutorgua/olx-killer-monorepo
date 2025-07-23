import {
  about_hero_image,
  avatar_1,
  avatar_2,
  avatar_3,
  avatar_5,
  avatar_6,
} from '@/shared/assets'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { LongArrowAltRightIcon } from '@/shared/ui'
import { cn } from '@/shared/library/utils'

export const HeroSection = () => {
  const { t } = useTranslation()
  return (
    <div className='container pt-12 xl:flex xl:justify-between xl:pt-[112px]'>
      <div className='mx-auto xl:mx-0'>
        {/* Trust indicator */}
        <div className='mb-[30px] flex items-center gap-2'>
          <div className='flex -space-x-2'>
            <div className='h-8 w-8 rounded-full ring-2 ring-white'>
              <img src={avatar_1} alt='user-picture' className='rounded-full' />
            </div>
            <div className='h-8 w-8 rounded-full ring-2 ring-white'>
              <img src={avatar_2} alt='user-picture' className='rounded-full' />
            </div>
            <div className='h-8 w-8 rounded-full ring-2 ring-white'>
              <img src={avatar_3} alt='user-picture' className='rounded-full' />
            </div>
            <div className='h-8 w-8 rounded-full ring-2 ring-white'>
              <img src={avatar_5} alt='user-picture' className='rounded-full' />
            </div>
            <div className='h-8 w-8 rounded-full ring-2 ring-white'>
              <img src={avatar_6} alt='user-picture' className='rounded-full' />
            </div>
          </div>
          <span className='text-sm text-gray-600'>
            loved by over 2 million worldwide
          </span>
        </div>

        {/* Main heading */}
        <h1 className='mb-[20px] text-4xl leading-none text-gray-950 xl:text-[76px]'>
          Dolorem quia
          <br />
          debitis quod fugit
        </h1>

        {/* Description */}
        <p className='mb-[20px] max-w-lg text-gray-700'>
          Error perspiciatis aut quisquam. Omnis maiores et dolor. Ea nostrum
          placeat assumenda est tempore deleniti ut sunt. Aspernatur voluptatem
          nulla expedita doloribus voluptatem.
        </p>

        {/* Back To Main Button */}
        <Link
          to='/'
          className={cn(
            `relative mb-[60px] flex h-[53px] w-[197px] items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pl-6 pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0`,
          )}
        >
          <span className='mr-14 flex flex-1 items-center justify-center xl:mr-14'>
            {t('buttons.backToMain')}
          </span>
          <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
            <LongArrowAltRightIcon />
          </span>
        </Link>

        {/* Statistics */}
        <div className='grid max-w-[548px] grid-cols-1 gap-1 md:grid-cols-3 md:gap-[40px]'>
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className='max-w-[156px] border-r-[1px] border-gray-200 leading-none'
            >
              <div className='text-[32px] font-semibold text-primary-900'>
                99<span className='text-gray-400'>%</span>
              </div>
              <div className='mt-2 text-gray-700'>Error perspiciat</div>
            </div>
          ))}
        </div>
      </div>
      <img
        src={about_hero_image}
        alt='hero-image'
        className='hidden h-[550px] w-[550px] xl:block'
      />
    </div>
  )
}
