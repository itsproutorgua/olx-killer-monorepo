import { useTranslation } from 'react-i18next'

import { useCurrencies } from '@/entities/currency'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn-ui/select'

interface CurrencySelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function CurrencySelect({ value, onValueChange }: CurrencySelectProps) {
  const { currencies, isLoading } = useCurrencies({
    Skeleton: <div>Loading...</div>,
  })
  const { t } = useTranslation()
  const selectedCurrency = currencies?.find(c => c.id.toString() === value)

  return (
    <div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className='h-11 w-[103px] rounded-l-none rounded-r-[50px] focus:ring-0 focus:ring-offset-0'>
          <SelectValue placeholder='UAH'>
            {isLoading || !value ? (
              <p className='px-1 text-gray-500'>Loading</p>
            ) : (
              <p className='pl-3 text-gray-500'>
                {selectedCurrency?.code === 'USD'
                  ? '$'
                  : `${selectedCurrency?.code}`}
              </p>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className='w-[174px] rounded-[11px] border-none bg-white shadow-md'>
          {isLoading && (
            <SelectGroup>
              <SelectItem value='1' className='pl-0 text-gray-500'>
                <p className='px-1 text-gray-500'>Loading</p>
              </SelectItem>
            </SelectGroup>
          )}
          {currencies && (
            <SelectGroup className='px-0 py-3'>
              {currencies.map(currency => (
                <SelectItem
                  key={currency.id}
                  value={currency.id.toString()}
                  className={``}
                >
                  {currency.code === 'USD'
                    ? `${currency.symbol} - ${t('listingForm.fields.price.dollar')}`
                    : `${currency.code} - ${t('listingForm.fields.price.hryvna')}`}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
