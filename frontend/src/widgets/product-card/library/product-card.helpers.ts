import i18n from 'i18next'

import type { ProductPrice } from '@/entities/product'

export const generatePriceString = (prices: ProductPrice[]) => {
  const lang = i18n.language

  switch (lang) {
    case 'uk':
      return `${prices[0].amount} ${prices[0].currency.code}`
    case 'en':
      return `${prices[1].amount} ${prices[1].currency.code}`
    default:
      break
  }
}
