import { useTranslation } from 'react-i18next'

import { ChevronLeftIcon } from '@/shared/ui'

export const FiltersTabsHeader = ({
  label,
  setValue,
}: {
  label: string
  setValue: (value: string) => void
}) => {
  const { t } = useTranslation()
  return (
    <div className='flex items-center justify-between border-b border-gray-200 py-7'>
      <button
        onClick={() => setValue('')}
        className='flex items-center gap-2 text-2xl/none text-foreground'
      >
        <ChevronLeftIcon />
        {t(label)}
      </button>
    </div>
  )
}
