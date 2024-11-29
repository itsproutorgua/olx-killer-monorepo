export const capitalizeFirstWord = (str: string): string => {
  const words = str.trim().split(' ')
  if (words.length === 0) return str // Handle empty strings
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()
  return words.join(' ')
}
