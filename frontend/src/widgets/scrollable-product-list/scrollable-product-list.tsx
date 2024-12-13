import React, { useEffect, useRef, useState } from 'react'

import { ProductCard } from '@/widgets/product-card'
import { useProducts, type Product } from '@/entities/product'
import { SectionTitle } from '@/shared/ui'
import { ScrollableListArrowLeft } from '@/shared/ui/icons/scrollableListArrowLeft.tsx'
import { ScrollableListArrowRight } from '@/shared/ui/icons/scrollableListArrowRight.tsx'
import { ScrollableProductsSkeleton } from '@/shared/ui/skeletons'
import { SortEnum } from '@/shared/constants/app.const'

interface ScrollableProductListProps {
  className?: string
  titleWidth?: string
  title: string
  path: string
  limit: number
  sort?: SortEnum
  scrollStep?: number
  onProductClick: (slug: string) => void
}

export const ScrollableProductList: React.FC<ScrollableProductListProps> = ({
  title,
  path,
  limit,
  sort,
  scrollStep = 3, // Default scroll step of 3 items
  className,
  titleWidth = '1280px',
  onProductClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLeftDisabled, setIsLeftDisabled] = useState(true)
  const [isRightDisabled, setIsRightDisabled] = useState(false)

  const { data, cursor } = useProducts(
    {
      path,
      limit,
      sort,
    },
    { Skeleton: <ScrollableProductsSkeleton /> },
  )

  useEffect(() => {
    // Disable buttons based on the scroll position
    const checkScrollPosition = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current
        setIsLeftDisabled(scrollLeft === 0)
        setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth)
      }
    }

    // Check scroll position initially and on resize
    checkScrollPosition()
    window.addEventListener('resize', checkScrollPosition)

    return () => window.removeEventListener('resize', checkScrollPosition)
  }, [cursor])

  const scrollByItems = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.children[0].clientWidth + 10 // Adjust the gap between items
      const scrollAmount = itemWidth * scrollStep
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current!
    setIsLeftDisabled(scrollLeft === 0)
    setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth)
  }

  return (
    <section className={className}>
      <div className='max-h-[460px] overflow-x-hidden overflow-y-hidden'>
        <div
          className={`flex w-full flex-row items-center pl-0 md:gap-28 xl:justify-between`}
          style={{ width: titleWidth }}
        >
          <SectionTitle title={title} />
          <div className='mb-5 flex flex-row gap-3'>
            <button
              onClick={() => scrollByItems('left')}
              disabled={isLeftDisabled}
              className={isLeftDisabled ? 'cursor-not-allowed opacity-50' : ''}
            >
              <ScrollableListArrowLeft
                stroke={isLeftDisabled ? '#A3A3A3' : '#292C6D'}
                className={
                  isLeftDisabled
                    ? 'stroke-[#A3A3A3]'
                    : 'fill-gray-50 stroke-[#292C6D] transition-colors duration-300 hover:fill-primary-900 hover:stroke-gray-50'
                }
              />
            </button>
            <button
              onClick={() => scrollByItems('right')}
              disabled={isRightDisabled}
              className={isRightDisabled ? 'cursor-not-allowed opacity-50' : ''}
            >
              <ScrollableListArrowRight
                stroke={isRightDisabled ? '#A3A3A3' : '#292C6D'}
                className={
                  isRightDisabled
                    ? 'stroke-[#A3A3A3]'
                    : 'fill-gray-50 stroke-[#292C6D] transition-colors duration-300 hover:fill-primary-900 hover:stroke-gray-50'
                }
              />
            </button>
          </div>
        </div>
        {cursor}
        <div
          className='flex gap-[7px] overflow-x-auto pb-[50px] pr-4 scrollbar-hide xl:gap-5'
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {data?.results.slice(0, 10).map((product: Product) => (
            <div
              key={product.slug}
              onClick={() => onProductClick(`/${product.slug}`)}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
