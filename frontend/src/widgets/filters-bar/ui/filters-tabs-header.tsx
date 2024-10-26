import { ChevronLeftIcon } from '@/shared/ui'

export const FiltersTabsHeader = ({
  label,
  setValue,
}: {
  label: string
  setValue: (value: string) => void
}) => {
  return (
    <div className='flex items-center justify-between border-b border-gray-200 py-7'>
      <button
        onClick={() => setValue('')}
        className='flex items-center gap-2 text-2xl/none text-foreground'
      >
        <ChevronLeftIcon />
        {label}
      </button>
    </div>
  )
}
