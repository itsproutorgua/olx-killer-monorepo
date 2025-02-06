import { queryOptions } from '@tanstack/react-query'
import i18n from 'i18next'

import { instanceBase } from '@/shared/api'
import { QUERY_KEYS } from '@/shared/constants'

export interface Currency {
  id: string
  code: string
  symbol: string
  name: string
}

interface CurrencyResponse {
  results: Currency[]
}

class CurrencyApi {
  private BASE_URL = '/currencies'

  async findAllCurrencies({ signal }: { signal: AbortSignal }) {
    const url = `${this.BASE_URL}/`
    const response = await instanceBase.get<CurrencyResponse>(url, { signal })
    return response.data.results
  }

  findAllCurrenciesQueryOptions() {
    return queryOptions<Currency[]>({
      queryKey: [QUERY_KEYS.CURRENCIES, i18n.language],
      queryFn: meta => this.findAllCurrencies(meta),
      retry: 1,
      refetchOnWindowFocus: false,
    })
  }
}

export const currencyApi = new CurrencyApi()
