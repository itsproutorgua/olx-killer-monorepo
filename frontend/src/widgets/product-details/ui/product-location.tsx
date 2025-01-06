import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/shadcn-ui/hover-card.tsx'
import { ArrowIcon, LocationIcon } from '@/shared/ui'

interface Props {
  className?: string
  location: {
    name: string
    region: string
    location_type: string
  }
}

export const ProductLocation: React.FC<Props> = ({ location, className }) => {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <div className='flex h-full flex-col gap-6 rounded-[15px] border border-border px-[24px] py-6'>
        <h3 className='font-semibold uppercase leading-none'>
          {t('words.location')}
        </h3>
        <div className='flex flex-row gap-6'>
          <div className='h-[24px] w-[24px]'>
            <LocationIcon className='text-primary' />
          </div>
          <div className='flex h-[104px] flex-col justify-between'>
            <div className='flex flex-col gap-3'>
              <HoverCard openDelay={500} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <h4 className='line-clamp-1 text-xl leading-none'>
                    {location.name ?? t('words.defaultLocation')}
                  </h4>
                </HoverCardTrigger>
                {/* Only render HoverCardContent if title length exceeds threshold */}
                {location.name && location.name.length > 9 && (
                  <HoverCardContent side='top' className='w-fit bg-gray-50'>
                    {location.name}
                  </HoverCardContent>
                )}
              </HoverCard>
              <p className='text-xs leading-none text-gray-400'>
                {location.region ?? t('words.defaultLocation')}
              </p>
            </div>
            <button className='mt-2 flex flex-row items-center gap-[9px] text-xs'>
              {t('words.viewOnMap')} <ArrowIcon className='w-6 font-bold' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
