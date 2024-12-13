import type { Filter } from '../mock'
import { FiltersTabsItem } from './filters-tabs-item'

export const FiltersTabsContent = ({ filter }: { filter: Filter }) => {
  return (
    <div className='pt-[11px]'>
      <ul className='space-y-3'>
        {filter.items.map(item => (
          <li key={item.label}>
            <FiltersTabsItem name={filter.name} item={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}
