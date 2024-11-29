import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableProductList } from '@/widgets/scrollable-product-list/scrollable-product-list.tsx'

export interface SimilarProductProps {
  onProductClick: (slug: string) => void
}

export const SimilarProducts: React.FC<SimilarProductProps> = ({
  onProductClick,
}) => {
  const { t } = useTranslation()

  return (
    <ScrollableProductList
      title={t('titles.similarProducts')}
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      limit={10}
      scrollStep={3} // Number of items to scroll
      className='absolute flex w-[107%] overflow-hidden'
      onProductClick={onProductClick}
    />
  )
}
