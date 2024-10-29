import { useState } from 'react'
import i18n from 'i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn-ui/select.tsx'
import { LANGUAGES } from '@/shared/config/i18next/constants.ts'

export const LangSwitcher = () => {
  // Initialize the state with the value from localStorage or default to 'EN'
  const initialLang = localStorage.getItem('language')?.toUpperCase() || 'EN'
  const [value, setValue] = useState(initialLang)
  const handleChangeLanguage = (newLang: keyof typeof LANGUAGES) => {
    setValue(newLang)
    const lngIsoCode = LANGUAGES[newLang][0]
    i18n.changeLanguage(lngIsoCode) // Change the language using i18n
    localStorage.setItem('language', newLang) // Save the selected language to localStorage
  }
  return (
    <Select value={value} onValueChange={handleChangeLanguage}>
      <SelectTrigger className='w-[35px] border-0 bg-primary-900 p-0 text-[13px] text-gray-50 ring-0 ring-offset-0 transition-colors duration-300 hover:text-primary-300 focus:ring-0 focus:ring-offset-0 data-[state=open]:text-primary-300'>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>

      <SelectContent className='m-0 space-y-2 rounded-[11px] bg-background px-[21px] py-3 shadow-[1px_1px_5px_0_rgba(78,78,78,0.19)]'>
        <SelectItem
          value='EN'
          className='cursor-pointer rounded-xl px-1 py-0 text-[13px] font-medium transition-colors duration-300 focus:bg-primary-300 focus:text-primary-900 data-[state=open]:text-primary-900'
        >
          {LANGUAGES.EN[1]}
        </SelectItem>
        <SelectItem
          className='cursor-pointer rounded-xl px-1 py-0 text-[13px] font-medium transition-colors duration-300 focus:bg-primary-300 focus:text-primary-900 data-[state=open]:text-primary-900'
          value='UA'
        >
          {LANGUAGES.UA[1]}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
