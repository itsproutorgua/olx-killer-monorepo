import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

export const useQueryParams = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [allQueryParams, setAllQueryParams] = useState(
    Object.fromEntries(searchParams),
  )

  useEffect(() => {
    setAllQueryParams(Object.fromEntries(searchParams))
  }, [searchParams])

  const getQueryParamByKey = (key: string) => {
    const params = new URLSearchParams(location.search)
    return params.get(key) || ''
  }

  const setQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(location.search)
    const currentParams = Object.fromEntries(params.entries())
    const updatedParams = { ...currentParams, [key]: value }
    const newParams = new URLSearchParams(updatedParams)
    setSearchParams(newParams.toString())
  }

  const setQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(location.search)
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value)
    })
    setSearchParams(params.toString())
  }

  const removeQueryParamByKey = (keys: string[]) => {
    const params = new URLSearchParams(location.search)
    keys.forEach(key => {
      params.delete(key)
    })
    setSearchParams(params.toString())
  }

  return {
    allQueryParams,
    getQueryParamByKey,
    setQueryParam,
    setQueryParams,
    removeQueryParamByKey,
  }
}
