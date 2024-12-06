import { formatDistanceToNow, isYesterday, parseISO } from 'date-fns'
import { format } from 'date-fns/format' // Optional, to set locale
import { enGB, uk } from 'date-fns/locale'
import i18n from 'i18next'

export const localeMap = {
  en: enGB,
  uk: uk,
}

export const formatLastOnline = (timestamp: string | null) => {
  if (!timestamp) {
    return 'Never logged in' // Default message if no login exists
  }
  const date = parseISO(timestamp) // Parse the ISO 8601 date string

  const locale = localeMap[i18n.language as keyof typeof localeMap] || enGB

  // Check if the date is yesterday
  if (isYesterday(date)) {
    // Format as "yesterday at HH:mm"
    return `yesterday at ${format(date, 'HH:mm')}`
  }

  // If not yesterday, return the normal relative time format
  return formatDistanceToNow(date, { addSuffix: true, locale })
}
