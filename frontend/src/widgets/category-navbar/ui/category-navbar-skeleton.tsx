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
        <ul className='grid grid-cols-7 gap-[38px]'>
          {Array.from({ length: 7 }).map((_, idx) => (
            <li key={idx} className='space-y-4'>
              <Skeleton className='size-[150px] rounded-full' />
              <Skeleton className='h-5' />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
