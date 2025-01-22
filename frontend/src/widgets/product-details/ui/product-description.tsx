import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'

interface ProductDescriptionProps {
  description: string
  maxClampLength: number
}

const sanitizeDescription = (description: string): string => {
  // Replace <br /> with spaces and strip other HTML tags
  const withoutBreaks = description.replace(/<br\s*\/?>/gi, ' ')
  return withoutBreaks.replace(/<\/?[^>]+(>|$)/g, '')
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

  const sanitizedDescription = sanitizeDescription(description)

  const truncatedDescription = (length: number) =>
    sanitizedDescription.length > length
      ? sanitizedDescription.slice(0, length) + '...'
      : sanitizedDescription

  return (
    <>
      <p className='mt-[14px] text-[13px] leading-5 md:text-base'>
        {showFullDescription
          ? sanitizedDescription
          : truncatedDescription(maxClampLength)}
      </p>
      {sanitizedDescription.length > maxClampLength && (
        <button
          onClick={toggleDescription}
          className='mt-2 flex items-center text-[13px] font-semibold text-gray-700 hover:underline'
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
