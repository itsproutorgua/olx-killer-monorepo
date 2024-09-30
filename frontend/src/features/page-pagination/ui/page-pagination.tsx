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
  return (
    <Pagination className='relative text-sm font-medium'>
      <PaginationContent className='gap-0.5'>
        <PaginationItem className='absolute left-0 top-1/2 -translate-y-1/2 font-semibold'>
          <PaginationPrevious href='#' className='gap-2' />
        </PaginationItem>

        <PaginationItem className=''>
          <PaginationLink
            href='#'
            className='rounded-full bg-purple-light text-purple-dark hover:bg-purple-light hover:text-purple-dark'
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href='#'
            className='rounded-full bg-transparent text-foreground hover:bg-purple-light hover:text-purple-dark'
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href='#'
            className='rounded-full bg-transparent text-foreground hover:bg-purple-light hover:text-purple-dark'
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
            className='rounded-full bg-transparent text-foreground hover:bg-purple-light hover:text-purple-dark'
          >
            7
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href='#'
            className='rounded-full bg-transparent text-foreground hover:bg-purple-light hover:text-purple-dark'
          >
            8
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href='#'
            className='rounded-full bg-transparent text-foreground hover:bg-purple-light hover:text-purple-dark'
          >
            9
          </PaginationLink>
        </PaginationItem>

        <PaginationItem className='absolute right-0 top-1/2 -translate-y-1/2 font-semibold'>
          <PaginationNext href='#' className='gap-2' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
