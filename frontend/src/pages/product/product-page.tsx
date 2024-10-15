import {
  ProductsBySeller,
  ProductsBySellerSlider,
} from '@/widgets/other-products-by-seller'
import { ProductDetails } from '@/widgets/product-details/product-details.tsx'
import {
  SimilarProducts,
  SimilarProductsSlider,
} from '@/widgets/similar-products'

export const ProductPage = () => {
  return (
    <div className='container mt-[27px] md:mt-[38px]'>
      <ProductDetails className="mb-20 md:mb-32"/>
      <div className='hidden min-h-[277px] md:relative mb-[53px] md:block xl:min-h-[440px]'>
        <ProductsBySeller />
      </div>
      <div className='mb-20 md:hidden'>
        <ProductsBySellerSlider />
      </div>
      <div className='hidden min-h-[277px] md:relative mb-[53px] md:block xl:min-h-[440px]'>
        <SimilarProducts />
      </div>
      <div className='mb-20 md:hidden'>
        <SimilarProductsSlider />
      </div>
    </div>
  )
}
