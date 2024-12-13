import { Checkbox } from '@/shared/ui/shadcn-ui/checkbox'
import { COLOR_STYLES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

export const FiltersTabsItem = ({
  name,
  item,
}: {
  name: string
  item: { name?: string; label: string; hex?: string }
}) => {
  return (
    <div className='flex items-center gap-2'>
      <Checkbox id={item.label} />
      <label htmlFor={item.label} className='text-sm font-normal'>
        {name === 'Colors' ? (
          <span className='flex items-center gap-2'>
            <span
              className={cn(
                'inline-block size-4 rounded-full border',
                item.hex && COLOR_STYLES[item.name!],
              )}
            />
            <span>{item.label}</span>
          </span>
        ) : (
          item.label
        )}
      </label>
    </div>
  )
}
