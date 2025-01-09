import type { Filter } from '../mock'
import { ConditionForm, PriceForm } from './form'

export const FiltersTabsContent = ({ filter }: { filter: Filter }) => {
  return (
    <div className='pt-[11px]'>
      {filter.name === 'price' && <PriceForm />}
      {filter.name === 'status' && <ConditionForm />}
    </div>
  )
}
