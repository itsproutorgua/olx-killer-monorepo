import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableProductList } from '@/widgets/scrollable-product-list/scrollable-product-list.tsx'

export interface SellerProductProps {
  onProductClick: (slug: string) => void
}

export const ProductsBySeller: React.FC<SellerProductProps> = ({
  onProductClick,
}) => {
  const { t } = useTranslation()

  return (
    <ScrollableProductList
      title={t('titles.productsBySeller')}
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      limit={10}
      scrollStep={3} // Number of items to scroll
      className='absolute flex w-[107%] overflow-hidden'
      onProductClick={onProductClick}
    />
  )
}
