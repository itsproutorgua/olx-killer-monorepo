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

  return (
    <div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className='h-11 w-[103px] rounded-l-none rounded-r-[50px]'>
          <SelectValue placeholder='UAH' className='text-gray-500' />
        </SelectTrigger>
        <SelectContent className='rounded-[11px] border-none bg-white shadow-md'>
          {isLoading && (
            <SelectGroup>
              <SelectItem value='1' className='text-gray-500'>
                <p className='text-gray-500'>Loading</p>
              </SelectItem>
            </SelectGroup>
          )}
          {currencies && (
            <SelectGroup>
              {currencies.map(currency => (
                <SelectItem key={currency.id} value={currency.id.toString()}>
                  {currency.code}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
