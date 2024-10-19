import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { use } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  CategoryNavbar,
  CategoryNavbarSkeleton,
} from '@/widgets/category-navbar'
import { FiltersButton } from '@/widgets/filters-button'
import { PageToolbar } from '@/widgets/page-toolbar'
import { formatPriceString } from '@/widgets/product-card'
import { ProductGrid } from '@/widgets/product-grid'
import { SortButton } from '@/widgets/sort-button'
import { FiltersBar } from '@/features/filter-bar'
import { PagePagination } from '@/features/page-pagination'
import { categoryApi, type Category } from '@/entities/category'
import { Breadcrumbs, HeartIcon, PageHeading, SectionTitle } from '@/shared/ui'
import { PageHeadingSkeleton } from '@/shared/ui/skeletons/page-heading-skeleton'
import { QUERY_KEYS } from '@/shared/constants'
import type { Crumb } from '@/shared/library/types/types'
import { generateCrumbs } from '@/shared/library/utils/generate-crumbs'

export const CatalogPage = () => {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname.replace('/catalog', '')
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ text: '...' }])

  const { isLoading, isError, data } = useQuery<Category>({
    queryKey: [QUERY_KEYS.CATEGORY, path, i18n.language],
    queryFn: () => categoryApi.findByPath(path),
  })

  if (location.pathname === '/catalog') navigate('/')

  useEffect(() => {
    if (data) {
      generateCrumbs(data, setCrumbs)
    }
  }, [data])

  return (
    <div className='pb-32 pt-[27px] xl:pb-[53px] xl:pt-[38px]'>
      <div className='container'>
        <Breadcrumbs crumbs={crumbs} />

        {isLoading && (
          <>
            <PageHeadingSkeleton />
            <CategoryNavbarSkeleton />
          </>
        )}

        {!isLoading && data && (
          <>
            <PageHeading title={data.title} />
            <CategoryNavbar data={data.children} />
            <ProductGrid path={data.path} />
          </>
        )}
      </div>

      {/* Mobile screen */}
      {/* <section className='xl:hidden'>
        <div className='container'>
          <SectionTitle title='All announcements' />
          <ul className='mb-[67px] grid grid-cols-2 gap-x-2.5 gap-y-10'>
            {Array.from({ length: 16 }).map((_, index) => (
              <li key={index} className='relative'>
                <img
                  src='https://placehold.co/200x200'
                  alt='Product image'
                  className='mb-[15px] block h-[120px] w-[172px] rounded-[15px] object-cover'
                />
                <p className='mb-[25px] text-[13px]/[15.6px]'>
                  Ipsum est magni consectetur in et est maxime necessitatibus.
                </p>
                <p className='text-base/none'>123 UAH</p>

                <span className='absolute right-2.5 top-[7px]'>
                  <HeartIcon />
                </span>
              </li>
            ))}
          </ul>

          <button className='border-border w-full rounded-full border py-[13px] text-center text-[13px]/[15.73px] font-medium'>
            Show more announcements
          </button>
        </div>
      </section> */}

      {/* Desktop screen */}
      {/* <div className='container hidden xl:block'>
        <div className='flex border-t border-gray-200'>
          <div className='w-[305px]'>
            <FiltersBar />
          </div>
          <div className='flex-1 space-y-7'>
            <div className='border-b border-l border-gray-200 pb-[55px] pl-5 pt-[18px]'>
              <SectionTitle title='All announcements' />
              <ul className='grid grid-cols-3 gap-x-5 gap-y-[60px]'>
                {Array.from({ length: 21 }).map((_, index) => (
                  <li key={index}>
                    <Link to='/products/89'>
                      <img
                        src='https://placehold.co/305x305'
                        alt='Product image'
                        className='mb-[15px] block h-[213px] w-[305px] rounded-[15px] object-cover'
                      />
                      <p className='mb-[38px] text-base/[19.36px]'>
                        Ipsum est magni consectetur in et est maxime
                        necessitatibus.
                      </p>

                      <div className='flex items-center justify-between'>
                        <p className='text-2xl/[29.05px]'>123 UAH</p>
                        <HeartIcon />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <PagePagination />
          </div>
        </div>
      </div> */}
    </div>
  )
}
