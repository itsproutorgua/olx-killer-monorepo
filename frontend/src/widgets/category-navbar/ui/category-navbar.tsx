import type { CategoryChild } from '@/entities/category'
import { CategoryNavbarDesktop } from './cat-navbar-desktop'
import { CategoryNavbarMobile } from './cat-navbar-mobile'

export const CategoryNavbar = ({ data }: { data: CategoryChild[] }) => {
  return (
    <>
      {data.length > 0 && (
        <div className='pb-5 xl:pb-0'>
          <CategoryNavbarMobile data={data} />
          <CategoryNavbarDesktop data={data} />
        </div>
      )}
    </>
  )
}
