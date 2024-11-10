import { Skeleton } from '@/shared/ui/shadcn-ui/skeleton'

export const CategoryNavbarSkeleton = () => {
  return (
    <div className='pb-5 xl:pb-7'>
      {/* Mobile screen */}
      <div className='space-y-5 xl:hidden'>
        <ul className='grid grid-cols-2 border-t border-t-border'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <li key={idx} className='border-b border-border odd:border-r'>
              <div className='flex items-center gap-3 p-2.5'>
                <Skeleton className='size-[34px] flex-none rounded-full' />
                <Skeleton className='h-5 w-full' />
              </div>
            </li>
          ))}
        </ul>
        <Skeleton className='h-[42px] rounded-full border border-border' />
      </div>

      {/* Desktop screen */}
      <div className='hidden xl:block'>
        <ul className='grid grid-cols-4 gap-x-12 gap-y-2.5 overflow-hidden border-b border-border pb-5'>
          {Array.from({ length: 8 }).map((_, idx) => (
            <li
              key={idx}
              className='relative after:absolute after:-right-6 after:top-0 after:h-40 after:w-px after:bg-border [&nth-child(4n)]:after:hidden'
            >
              <Skeleton className='h-5 w-1/2' />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
