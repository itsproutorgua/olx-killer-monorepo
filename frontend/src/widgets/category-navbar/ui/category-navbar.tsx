import type { CategoryChild } from '@/entities/category'
import { useMediaQuery } from '@/shared/library/hooks'
import { CategoryNavbarDesktop } from './cat-navbar-desktop'
import { CategoryNavbarMobile } from './cat-navbar-mobile'

export const CategoryNavbar = ({ data }: { data: CategoryChild[] }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <>
      {data.length > 0 && (
        <div className='pb-5 xl:pb-0'>
          {isMobile ? (
            <CategoryNavbarMobile data={data} />
          ) : (
            <CategoryNavbarDesktop data={data} />
          )}
        </div>
      )}
    </>
  )
}
