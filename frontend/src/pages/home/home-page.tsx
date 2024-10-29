import { BestDeals } from '@/widgets/best-deals'
import { PopularCategories } from '@/widgets/category-popular'
import { Hero, HeroSlider } from '@/widgets/hero'
import { NewProductsSlider } from '@/widgets/new-products'
import { PromoSection } from '@/widgets/promo'

export const HomePage = () => {
  return (
    <div className='overflow-x-hidden pb-[197px] pt-[15px] xl:pb-[100px] xl:pt-[27px]'>
      <div className='xl:hidden'>
        <div className='container'>
          <HeroSlider />
        </div>
      </div>

      <div className='xl:hidden'>
        <div className='container'>
          <NewProductsSlider />
        </div>
      </div>

      <div className='hidden xl:block'>
        <div className='container'>
          <Hero />
        </div>
      </div>

      <PopularCategories />
      <BestDeals />

      <PromoSection />
    </div>
  )
}
