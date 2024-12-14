import { useTranslation } from 'react-i18next'

export const FiltersTabsFooter = ({
  setValue,
}: {
  setValue: (value: string) => void
}) => {
  const { t } = useTranslation()

  return (
    <div className='space-y-4 border-t border-t-border pb-2.5 pt-4'>
      <p className='text-center text-[13px]/[15.6px] text-gray-400'>
        Find 200 announcements
      </p>
      <div className='grid grid-cols-2 gap-2.5'>
        <button onClick={() => setValue('')} className='btn-secondary'>
          {t('buttons.back')}
        </button>
        <button className='btn-primary'>{t('buttons.show')}</button>
      </div>
    </div>
  )
}
