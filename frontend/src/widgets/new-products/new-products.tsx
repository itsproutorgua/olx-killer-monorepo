import { useTranslation } from 'react-i18next'

import { ScrollableProductList } from '@/widgets/scrollable-product-list/scrollable-product-list.tsx'

export const NewProducts = () => {
  const { t } = useTranslation()

  return (
    <div className='mt-[50px] flex w-[1058px] overflow-hidden'>
      <ScrollableProductList
        title={t('titles.newProductsTitle')}
        path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
        limit={10}
        scrollStep={3} // Number of items to scroll
        className='max-w-[1150px] overflow-x-auto xl:w-[calc(100vw-var(--aside-nav-width)-var(--extra-padding))] xl:min-w-[1030px]'
        titleWidth='958px'
        onProductClick={() => {}}
      />
    </div>
  )
}
