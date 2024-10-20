import { cn } from '@/shared/library/utils'

export const SectionTitle = ({
  title,
  className,
}: {
  title: string
  className?: string
}) => {
  return (
    <h2
      className={cn(
        'mb-[15px] text-xl/[22px] font-medium xl:mb-5 xl:text-[26px]/[28.6px]',
        className,
      )}
    >
      {title}
    </h2>
  )
}
