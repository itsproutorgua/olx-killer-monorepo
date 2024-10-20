import i18n from 'i18next'

import type { ProductPrice } from '@/entities/product'

export const generatePriceString = (prices: ProductPrice[]) => {
  const lang = i18n.language

  // Default to showing the first available price if the language is not 'uk' or 'en'
  switch (lang) {
    case 'uk':
      return prices[0]
        ? `${prices[0].amount} ${prices[0].currency.code}`
        : 'Price Unavailable'
    case 'en':
      return prices[1]
        ? `${prices[1].amount} ${prices[1].currency.code}`
        : `${prices[0].amount} ${prices[0].currency.code}`
    default:
      // Default to English price or fallback to the first price
      return prices[1]
        ? `${prices[1].amount} ${prices[1].currency.code}`
        : `${prices[0].amount} ${prices[0].currency.code}`
  }
}
