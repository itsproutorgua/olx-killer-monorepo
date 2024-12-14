import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/shadcn-ui/accordion'
import { ConditionForm, PriceForm } from './form'

export const FiltersForm = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState<string[]>(['price'])

  return (
    <>
      <Accordion type='multiple' value={value} onValueChange={setValue}>
        <AccordionItem value='price'>
          <AccordionTrigger className='flex items-center justify-between py-[18px] pr-8 text-base/5 font-medium'>
            {t('filters.price')}, {t('currency.symbol')}
          </AccordionTrigger>
          <AccordionContent className='p-0 pb-4 pr-12'>
            <PriceForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type='multiple' value={value} onValueChange={setValue}>
        <AccordionItem value='condition'>
          <AccordionTrigger className='flex items-center justify-between py-[18px] pr-8 text-base/5 font-medium'>
            {t('filters.condition.title')}
          </AccordionTrigger>
          <AccordionContent className='p-0 pb-4 pr-12'>
            <ConditionForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
