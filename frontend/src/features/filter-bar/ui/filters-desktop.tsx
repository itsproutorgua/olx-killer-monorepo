import { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/shadcn-ui/accordion'
import { Checkbox } from '@/shared/ui/shadcn-ui/checkbox'
import { Separator } from '@/shared/ui/shadcn-ui/separator'
import { Slider } from '@/shared/ui/shadcn-ui/slider'
import { COLOR_STYLES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'
import { FILTERS } from '../mock'

export const FiltersDesktop = () => {
  const [value, setValue] = useState<string[]>([
    'Subcategory',
    'Price',
    'Size',
    'Colors',
  ])

  const [price, setPrice] = useState([50, 40000])

  return (
    <form>
      {FILTERS.map(filter => (
        <Accordion
          key={filter.name}
          type='multiple'
          value={value}
          onValueChange={setValue}
        >
          <AccordionItem value={filter.name}>
            <AccordionTrigger className='flex items-center justify-between py-[18px] pr-8'>
              <p className='text-base/5 font-medium'>
                {filter.label}
                {filter.label === 'Price' && ', ₴'}
              </p>
            </AccordionTrigger>
            <AccordionContent className='p-0 pb-4'>
              {filter.type === 'Checkbox' && (
                <ul className='space-y-2'>
                  {filter.items.map(item => (
                    <li key={item.label} className='flex items-center gap-2'>
                      <Checkbox id={item.label} />
                      <label
                        htmlFor={item.label}
                        className='text-sm font-medium'
                      >
                        {filter.label === 'Colors' ? (
                          <span className='flex items-center gap-2'>
                            <span
                              className={cn(
                                'inline-block size-4 rounded-full border',
                                item.hex && COLOR_STYLES[item.label],
                              )}
                            />
                            <span>{item.label}</span>
                          </span>
                        ) : (
                          item.label
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              {filter.type === 'Slider' && (
                <div className='w-[234px] space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={String(price[0])}
                        onChange={e =>
                          setPrice([Number(e.target.value), price[1]])
                        }
                        className='inline-block w-[71px] rounded-lg border border-gray-300 bg-background py-[7px] text-center text-base/5 placeholder:text-gray-400 focus:border-primary-900 focus:outline-none'
                        placeholder={filter.items[0].label}
                      />
                      <Separator className='w-[14px] bg-gray-200' />
                      <input
                        type='text'
                        value={String(price[1])}
                        onChange={e =>
                          setPrice([price[0], Number(e.target.value)])
                        }
                        className='inline-block w-[71px] rounded-lg border border-gray-300 bg-background py-[7px] text-center text-base/5 placeholder:text-gray-400 focus:border-primary-900 focus:outline-none'
                        placeholder={filter.items[1].label}
                      />
                    </div>
                    <button className='flex h-[34px] w-[43px] items-center justify-center rounded-lg border border-gray-300 bg-background text-base/5 transition-colors duration-300 hover:border-primary-900 hover:bg-primary-100'>
                      ОК
                    </button>
                  </div>

                  <Slider
                    defaultValue={price}
                    min={Number(filter.items[0].label)}
                    max={Number(filter.items[1].label)}
                    step={1}
                    minStepsBetweenThumbs={1}
                    onValueChange={values => setPrice(values)}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </form>
  )
}
