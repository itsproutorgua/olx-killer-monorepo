import type { CategoryChild } from '@/entities/category'
import { CategoryNavbarDesktop } from './cat-navbar-desktop'
import { CategoryNavbarMobile } from './cat-navbar-mobile'

export const CategoryNavbar = ({ data }: { data: CategoryChild[] }) => {
  return (
    <div className='pb-5 xl:pb-7'>
      <CategoryNavbarMobile data={data} />
      <CategoryNavbarDesktop data={data} />
    </div>
  )
}
