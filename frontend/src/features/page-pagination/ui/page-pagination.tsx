import { useTranslation } from 'react-i18next'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/shadcn-ui/pagination'

export const PagePagination = () => {
  const { t } = useTranslation()

  return (
    <div className='hidden xl:block'>
      <Pagination className='relative text-sm font-medium'>
        <PaginationContent className='gap-0.5'>
          <PaginationItem className='absolute left-0 top-1/2 -translate-y-1/2 font-semibold'>
            <PaginationPrevious href='#' className='gap-2'>
              {t('buttons.previous')}
            </PaginationPrevious>
          </PaginationItem>

          <PaginationItem className=''>
            <PaginationLink
              href='#'
              className='bg-purple-light text-purple-dark hover:bg-purple-light hover:text-purple-dark rounded-full'
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href='#'
              className='hover:bg-purple-light hover:text-purple-dark rounded-full bg-transparent text-foreground'
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href='#'
              className='hover:bg-purple-light hover:text-purple-dark rounded-full bg-transparent text-foreground'
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href='#'
              className='hover:bg-purple-light hover:text-purple-dark rounded-full bg-transparent text-foreground'
            >
              7
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href='#'
              className='hover:bg-purple-light hover:text-purple-dark rounded-full bg-transparent text-foreground'
            >
              8
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href='#'
              className='hover:bg-purple-light hover:text-purple-dark rounded-full bg-transparent text-foreground'
            >
              9
            </PaginationLink>
          </PaginationItem>

          <PaginationItem className='absolute right-0 top-1/2 -translate-y-1/2 font-semibold'>
            <PaginationNext href='#' className='gap-2'>
              {t('buttons.next')}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
