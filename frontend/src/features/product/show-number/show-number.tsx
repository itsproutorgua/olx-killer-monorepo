import { useTranslation } from 'react-i18next'

import { PhoneIcon } from '@/shared/ui'

export const ShowNumber = () => {
  const { t } = useTranslation()
  return (
    <button className='hover:bg-accent hover:text-accent-foreground relative hidden h-[53px] items-center justify-center rounded-[60px] border border-border bg-background text-base/4 text-foreground transition-colors duration-300 md:min-w-[214px]'>
      <span className='md:mr-8'>{t('buttons.showNumber')}</span>
      <span className='bg-primary absolute bottom-1 right-1 flex size-[43px] items-center justify-center rounded-full text-background'>
        <PhoneIcon />
      </span>
    </button>
  )
}
