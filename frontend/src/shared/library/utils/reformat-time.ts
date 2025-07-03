import { format, formatDistanceToNow, isYesterday, parseISO } from 'date-fns'
import { enGB, uk } from 'date-fns/locale'
import i18n from 'i18next'

export const localeMap = {
  en: enGB,
  uk: uk,
}

export const formatLastOnline = (timestamp: string | null) => {
  if (!timestamp) {
    return i18n.t('date.never')
  }

  const date = parseISO(timestamp)
  const lang = i18n.language as keyof typeof localeMap
  const locale = localeMap[lang] || enGB

  if (isYesterday(date)) {
    const time = format(date, 'HH:mm', { locale })
    return i18n.t('date.yesterdayAt', { time })
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale,
  })
}
