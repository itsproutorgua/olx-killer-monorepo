import React from 'react'

import { ArrowIcon, LocationIcon } from '@/shared/ui'

interface Props {
  className?: string
  location: {
    place: string
    region: string
    fullLocation: string
  }
}

export const ProductLocation: React.FC<Props> = ({ location, className }) => {
  return (
    <div className={className}>
      <div className='flex h-full flex-col gap-6 rounded-[15px] border border-border px-[34px] py-6'>
        <h3 className='font-semibold leading-none'>LOCATION</h3>
        <div className='flex flex-row justify-between gap-4'>
          <div className='h-[24px] w-[24px]'>
            <LocationIcon className='text-primary' />
          </div>
          <div className='flex flex-col gap-3'>
            <h4 className='text-xl leading-none'>{location.place}</h4>
            <p className='text-primary-gray text-xs leading-none'>
              {location.region}
            </p>
            <p className='text-primary-gray text-xs leading-none'>
              {location.fullLocation}
            </p>
            <button className='mt-2 flex flex-row items-center gap-[9px] text-xs'>
              View on map <ArrowIcon className='w-6 font-bold' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
