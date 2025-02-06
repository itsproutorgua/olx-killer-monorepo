import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { Currency, currencyApi } from '@/entities/currency/api/currency.api.ts'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

export const useCurrencies = ({ Skeleton }: { Skeleton?: React.ReactNode }) => {
  const {
    isLoading,
    isError,
    data: currencies,
  } = useQuery<Currency[]>({
    ...currencyApi.findAllCurrenciesQueryOptions(),
  })

  const cursor = (
    <>
      {isLoading && (Skeleton || <div>Loading...</div>)}
      {isError && <FetchError />}
    </>
  )

  return { currencies, cursor, isLoading }
}
