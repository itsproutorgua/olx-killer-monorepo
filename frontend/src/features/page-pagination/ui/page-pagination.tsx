import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import { animateScroll as scroll } from 'react-scroll'

import { useMediaQuery, useQueryParams } from '@/shared/library/hooks'
import { cn } from '@/shared/library/utils'

export const PagePagination = ({
  count,
  limit,
  className,
}: {
  count: number
  limit: number
  className?: string
}) => {
  const pageCount = Math.ceil(count / limit)
  const { t } = useTranslation()
  const { getQueryParamByKey, setQueryParam } = useQueryParams()
  const [page, setPage] = useState(1)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const handleScroll = () => {
    scroll.scrollToTop({
      duration: 500,
      delay: 0,
      smooth: 'easeInOut',
    })
  }

  const handlePageClick = (data: { selected: number }) => {
    setQueryParam('page', (data.selected + 1).toString())
    handleScroll()
  }

  const handleDirectionClick = (direction: 'prev' | 'next') => {
    switch (direction) {
      case 'prev':
        setQueryParam('page', (page - 1).toString())
        break
      case 'next':
        setQueryParam('page', (page + 1).toString())
        break
      default:
        return
    }
    handleScroll()
  }

  useEffect(() => {
    if (getQueryParamByKey('page')) {
      setPage(Number(getQueryParamByKey('page')))
    }
  }, [getQueryParamByKey])

  return (
    <>
      {pageCount > 1 && (
        <div
          className={cn(
            'hidden justify-between xl:flex xl:items-center',
            className,
          )}
        >
          <button
            onClick={() => handleDirectionClick('prev')}
            disabled={page === 1}
            className='pagination-btn'
          >
            <ChevronLeft className='size-11 stroke-[1.5px]' />
            {!isMobile && t('buttons.previous')}
          </button>
          <ReactPaginate
            breakLabel='...'
            nextLabel={null}
            previousLabel={null}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            className='pagination-list'
            breakLinkClassName='pagination-dots'
            pageLinkClassName='pagination-item'
            activeLinkClassName='pagination-active'
            forcePage={page - 1}
          />
          <button
            onClick={() => handleDirectionClick('next')}
            disabled={page === pageCount}
            className='pagination-btn'
          >
            {!isMobile && t('buttons.next')}
            <ChevronRight className='size-11 stroke-[1.5px]' />
          </button>
        </div>
      )}
    </>
  )
}
