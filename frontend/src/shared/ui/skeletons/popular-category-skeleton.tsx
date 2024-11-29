import PopularCategoryLoader from '@/shared/ui/loaders/popular-categories.loader.tsx'
import { useMediaQuery } from '@/shared/library/hooks'

export const PopularCategorySkeleton = () => {
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  return (
    <ul className='flex items-center gap-[16px] px-1 pt-1 xl:mb-[86px] xl:grid xl:grid-cols-7 xl:gap-x-[38px] xl:gap-y-[45px] xl:pb-0'>
      {Array.from({ length: isDesktop ? 7 : 6 }).map((_, index) => (
        <li key={index}>
          <PopularCategoryLoader
            width={isDesktop ? 150 : 70}
            height={isDesktop ? 185.8 : 119}
          />
        </li>
      ))}
    </ul>
  )
}
