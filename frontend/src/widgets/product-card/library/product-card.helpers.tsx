import i18n, { TFunction } from 'i18next'

import type { ProductPrice } from '@/entities/product'
import { PendingIcon, XCircleSmall } from '@/shared/ui/icons'

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

export const getStatusLabel = (
  t: TFunction<'translation', undefined>,
  listingStatus?: string,
) => {
  switch (listingStatus) {
    case 'active':
      return null
    case 'inactive':
      return {
        label: t('listings.listingInactive'),
        className: 'bg-error-300',
        icon: <XCircleSmall />,
      }
    case 'pending':
      return {
        label: t('listings.listingPending'),
        className: 'bg-[#FFE7A6]',
        icon: <PendingIcon />,
      }
    case 'rejected':
      return {
        label: t('listings.listingRejected'),
        className: 'bg-error-300',
        icon: <XCircleSmall />,
      }
    default:
      return null
  }
}
