import { Link } from 'react-router-dom'

import { CategoryCollapsible } from '@/widgets/category-collapsible'
import { CategorySlider } from '@/widgets/category-slider'
import { FiltersButton } from '@/widgets/filters-button'
import { SortButton } from '@/widgets/sort-button'
import { FiltersBar } from '@/features/filter-bar'
import { PagePagination } from '@/features/page-pagination'
import { Breadcrumbs, HeartIcon, PageHeading, SectionTitle } from '@/shared/ui'

const CRUMBS = [{ text: 'Women’s clothing' }]

export const CatalogPage = () => {
  return (
    <div className='pb-32 pt-[27px] xl:pb-[53px] xl:pt-[38px]'>
      <div className='container'>
        <Breadcrumbs crumbs={CRUMBS} />
        <PageHeading title='Women’s clothing' />
        <CategoryCollapsible />
        <CategorySlider />
      </div>

      <div className='container md:hidden'>
        <div className='mb-[53px] grid grid-cols-2 gap-3'>
          <FiltersButton />
          <SortButton />
        </div>
      </div>

      <div className='container hidden xl:block'>
        <div className='flex items-center justify-between border-t border-gray-200 py-[18px]'>
          <p className='text-base/5 font-medium'>Found 3568 announcements</p>
          <SortButton />
        </div>
      </div>

      {/* Mobile screen */}
      <section className='xl:hidden'>
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

          <button className='w-full rounded-full border border-border py-[13px] text-center text-[13px]/[15.73px] font-medium'>
            Show more announcements
          </button>
        </div>
      </section>

      {/* Desktop screen */}
      <div className='container hidden xl:block'>
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
      </div>
    </div>
  )
}
