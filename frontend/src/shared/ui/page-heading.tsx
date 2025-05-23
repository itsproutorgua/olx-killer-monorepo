import { cn } from '../library/utils'

export const PageHeading = ({
  title,
  className = '',
}: {
  title: string
  className?: string
}) => {
  return (
    <h1
      className={cn(
        'mb-[14px] text-2xl/[29.05px] font-medium xl:mb-5 xl:text-[26px]/[31.47px]',
        className,
      )}
    >
      {title.charAt(0).toUpperCase() + title.slice(1)}
    </h1>
  )
}
