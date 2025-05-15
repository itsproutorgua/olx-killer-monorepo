import { AboutUsBanner } from '@/widgets/about-us-banner/about-us-banner.tsx'
import { AsideNav } from '@/widgets/aside-nav'
import { NewProducts } from '@/widgets/new-products'
import { AddAnnouncement } from '@/features/announcement/add-announcement'
import { HeroSlider } from './ui'

export const Hero = () => {
  return (
    <section className='flex items-start gap-5'>
      <div className='flex-shrink-0'>
        <AsideNav />
      </div>
      <div className='flex-1'>
        <div className='flex max-w-[955px] gap-5'>
          <HeroSlider />
          <div className='flex flex-col items-center justify-between'>
            <AboutUsBanner />
            <AddAnnouncement />
          </div>
        </div>
        <NewProducts />
      </div>
    </section>
  )
}
