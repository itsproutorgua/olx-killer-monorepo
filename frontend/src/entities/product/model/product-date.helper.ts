export function formatDate(timestamp: string, locale: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
