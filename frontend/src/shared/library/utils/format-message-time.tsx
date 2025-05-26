export const formatMessageTime = (
  dateString: string,
  locale: 'en' | 'uk' = 'en',
): string => {
  const date = new Date(dateString)
  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  const time = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // ✅ 24-hour format
  })

  const labels: Record<typeof locale, { today: string; yesterday: string }> = {
    en: {
      today: 'Today',
      yesterday: 'Yesterday',
    },
    uk: {
      today: 'Сьогодні',
      yesterday: 'Вчора',
    },
  }

  const label = labels[locale] ?? labels['en']

  if (isToday) return `${label.today} ${time}`
  if (isYesterday) return `${label.yesterday} ${time}`

  const formattedDate = date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return `${formattedDate} ${time}`
}
