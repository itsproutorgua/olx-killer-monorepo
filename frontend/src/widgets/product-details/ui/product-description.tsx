import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'

interface ProductDescriptionProps {
  description: string
  maxClampLength: number
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  maxClampLength,
}) => {
  const { t } = useTranslation()
  const [showFullDescription, setShowFullDescription] = useState(false)

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const truncatedDescription = (length: number) =>
    description.length > length
      ? description.slice(0, length) + '...'
      : description

  return (
    <>
      <p className='mt-[14px] text-[13px] leading-5 md:text-base'>
        {showFullDescription
          ? description
          : truncatedDescription(maxClampLength)}
      </p>
      {description.length > maxClampLength && (
        <button
          onClick={toggleDescription}
          className='mt-2 flex items-center text-sm font-semibold text-gray-700 hover:underline'
        >
          {showFullDescription ? (
            <>
              {t('buttons.showLess')} <ArrowDownSmall className='rotate-180' />
            </>
          ) : (
            <>
              {t('buttons.showMore')} <ArrowDownSmall />
            </>
          )}
        </button>
      )}
    </>
  )
}
