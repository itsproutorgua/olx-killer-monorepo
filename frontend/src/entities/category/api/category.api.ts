import { queryOptions } from '@tanstack/react-query'
import i18n from 'i18next'

import { CategoryResponse } from '@/entities/category'
import { instanceBase } from '@/shared/api'
import { QUERY_KEYS } from '@/shared/constants'

class CategoryApi {
  private BASE_URL = '/categories'

  async findAllCategories(page: number, { signal }: { signal: AbortSignal }) {
    const params = new URLSearchParams()
    params.set('page', page.toString())

    const url = `${this.BASE_URL}/?${params.toString()}`
    const response = await instanceBase.get(url, { signal })
    return response.data
  }

  async findCategoryByPath(path: string) {
    const url = `${this.BASE_URL}/${path}`
    const response = await instanceBase.get(url)
    return response.data
  }

  findAllCategoriesQueryOptions(page: number) {
    return queryOptions<CategoryResponse[]>({
      queryKey: [QUERY_KEYS.CATEGORIES, i18n.language, page],
      queryFn: meta => this.findAllCategories(page, meta),
      retry: 1,
      refetchOnWindowFocus: false,
    })
  }
}

export const categoryApi = new CategoryApi()
