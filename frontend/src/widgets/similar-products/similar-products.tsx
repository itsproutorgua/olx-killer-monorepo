import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableProductList } from '@/widgets/scrollable-product-list/scrollable-product-list.tsx'
import { NEW_PRODUCTS } from '@/entities/product'

export const SimilarProducts: React.FC = () => {
  const { t } = useTranslation()

  return (
    <ScrollableProductList
      title={t('titles.similarProducts')}
      products={NEW_PRODUCTS}
      scrollStep={3} // Number of items to scroll
      className='absolute flex w-[107%] overflow-hidden'
    />
  )
}
