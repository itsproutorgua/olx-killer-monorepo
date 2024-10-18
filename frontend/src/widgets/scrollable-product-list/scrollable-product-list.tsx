import React, { useEffect, useRef, useState } from 'react'

import { ProductCard } from '@/widgets/product-card'
import { SectionTitle } from '@/shared/ui'

interface ScrollableProductListProps {
  className?: string
  titleWidth?: string
  title: string
  products: Array<{
    id: number
    image: {
      alt: string
      src: string
      type: string
      srcset: { width: number; items: string[] }[]
    }
    description: string
    price: string
  }>
  scrollStep?: number
}

export const ScrollableProductList: React.FC<ScrollableProductListProps> = ({
  title,
  products,
  scrollStep = 3, // Default scroll step of 3 items
  className,
  titleWidth = '1280px',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLeftDisabled, setIsLeftDisabled] = useState(true)
  const [isRightDisabled, setIsRightDisabled] = useState(false)

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
  }, [])

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
      <div className='overflow-x-hidden'>
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
              <svg
                width='44'
                height='44'
                viewBox='0 0 44 44'
                fill='none'
                className={isLeftDisabled ? 'stroke-[#A3A3A3]' : 'transition-colors fill-gray-50 duration-300 stroke-[#292C6D] hover:fill-primary-900 hover:stroke-gray-50'}
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='22.0003'
                  cy='22'
                  r='18.3333'
                  stroke={isLeftDisabled ? '#A3A3A3' : '#292C6D'}
                  strokeWidth='1.5'
                />
                <path
                  d='M24.75 16.5L19.25 22L24.75 27.5'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            <button
              onClick={() => scrollByItems('right')}
              disabled={isRightDisabled}
              className={isRightDisabled ? 'cursor-not-allowed opacity-50' : ''}
            >
              <svg
                width='44'
                height='44'
                viewBox='0 0 44 44'
                fill='none'
                className={isRightDisabled ? 'stroke-[#A3A3A3]' : 'transition-colors duration-300 fill-gray-50 stroke-[#292C6D] hover:fill-primary-900 hover:stroke-gray-50'}
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='22.0003'
                  cy='22'
                  r='18.3333'
                  stroke={isRightDisabled ? '#A3A3A3' : '#292C6D'}
                  strokeWidth='1.5'
                />
                <path
                  d='M19.25 16.5L24.75 22L19.25 27.5'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          className='flex gap-[7px] overflow-x-auto pb-[50px] pr-4 xl:gap-5 scrollbar-hide'
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {products.map(product => (
            <div key={product.id}>
              <ProductCard
                image={product.image}
                description={product.description}
                price={product.price}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
