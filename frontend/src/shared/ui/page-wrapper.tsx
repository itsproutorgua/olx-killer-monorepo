import { cn } from '../library/utils'

export const PageWrapper = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn('pb-[53px] pt-10 xl:pb-[104px] xl:pt-[60px]', className)}
    >
      <div className='container'>{children}</div>
    </div>
  )
}
