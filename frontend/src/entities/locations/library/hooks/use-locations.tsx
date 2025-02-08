import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Location, locationApi } from '@/entities/locations'
import { FetchError } from '@/shared/ui/error/fetch-error'

export const useLocations = (
  searchTerm: string,
  { Skeleton }: { Skeleton?: React.ReactNode },
) => {
  const { t } = useTranslation()
  const {
    isLoading,
    isError,
    data: locations,
  } = useQuery<Location[]>({
    ...locationApi.searchLocationsQueryOptions(searchTerm),
  })

  const cursor = (
    <>
      {isLoading &&
        (Skeleton || (
          <div className='p-2'>{t('profileForm.fields.city.searching')}</div>
        ))}
      {isError && <FetchError />}
    </>
  )

  return { locations, cursor, isLoading }
}
