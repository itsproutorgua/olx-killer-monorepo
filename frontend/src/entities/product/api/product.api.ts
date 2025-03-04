import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { i18n } from 'i18next'

import { instanceBase } from '@/shared/api'
import { QUERY_KEYS } from '@/shared/constants'
import { APP_VARIABLES, SortEnum } from '@/shared/constants/app.const'
import type { Product, ProductResponse } from '../model'

export interface FilterParams {
  path: string
  currency_code?: string
  page?: number
  limit?: number
  price_max?: number
  price_min?: number
  sort?: SortEnum
  status?: string
}

class ProductApi {
  private BASE_URL = '/products'

  async findByFilters(
    {
      path,
      currency_code,
      page = 1,
      limit = APP_VARIABLES.LIMIT,
      price_max,
      price_min,
      sort,
      status,
    }: FilterParams,
    { signal }: { signal: AbortSignal },
  ) {
    const params = new URLSearchParams()
    params.set('category_path', path.toString())
    params.set('page', page.toString())
    params.set('page_size', limit.toString())

    if (currency_code) params.set('currency_code', currency_code.toString())
    if (price_max) params.set('price_max', price_max.toString())
    if (price_min) params.set('price_min', price_min.toString())
    if (status) params.set('status', status.toString())
    if (sort && sort !== SortEnum.CREATED_AT_DESC)
      params.set('sort_by', sort.toString())

    const url = `${this.BASE_URL}/filters/?${params.toString()}`

    const response = await instanceBase.get<ProductResponse>(url, {
      signal,
    })
    return response.data
  }

  async findBySlug(
    { slug }: { slug: string },
    { signal }: { signal: AbortSignal },
  ) {
    const url = `${this.BASE_URL}${slug}/`
    const response = await instanceBase.get<Product>(url, { signal })
    return response.data
  }

  async findLatest({ signal }: { signal: AbortSignal }) {
    const url = `${this.BASE_URL}/latest`
    const response = await instanceBase.get<Product[]>(url, { signal })
    return response.data
  }

  findByFiltersQueryOptions({
    path,
    currency_code,
    page = 1,
    limit = APP_VARIABLES.LIMIT,
    price_max,
    price_min,
    status,
    sort = SortEnum.CREATED_AT_DESC,
  }: FilterParams) {
    return queryOptions<ProductResponse>({
      queryKey: [
        'posts',
        'many',
        path,
        currency_code,
        page,
        limit,
        price_max,
        price_min,
        status,
        sort,
      ],
      queryFn: meta =>
        this.findByFilters(
          {
            path,
            currency_code,
            page,
            limit,
            price_max,
            price_min,
            status,
            sort,
          },
          meta,
        ),
      placeholderData: keepPreviousData,
      enabled: !!path,
    })
  }

  findBySlugQueryOptions({ slug }: { slug: string }, i18n: i18n) {
    return queryOptions<Product>({
      queryKey: [QUERY_KEYS.PRODUCT, i18n.language, slug],
      queryFn: meta => this.findBySlug({ slug }, meta),
    })
  }

  findLatestQueryOptions(i18n: i18n) {
    return queryOptions<Product[]>({
      queryKey: [QUERY_KEYS.PRODUCT, i18n.language],
      queryFn: meta => this.findLatest(meta),
    })
  }

  async createProduct(productData: FormData, idToken: string) {
    const url = `${this.BASE_URL}/`
    const response = await instanceBase.post(url, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${idToken}`,
      },
    })
    return response.data
  }

  async updateProduct(productData: FormData, idToken: string, slug: string) {
    const url = `${this.BASE_URL}${slug}/`
    const response = await instanceBase.patch(url, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${idToken}`,
      },
    })
    return response.data
  }

  async deleteProduct(slug: string, idToken: string) {
    const url = `${this.BASE_URL}/${slug}/`
    const response = await instanceBase.delete(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return response.data
  }

  async deactivateProduct(
    productId: number,
    feedbackData: { answer: string; description?: string },
    idToken: string,
  ) {
    const url = `${this.BASE_URL}/feedback/`
    const response = await instanceBase.post(
      url,
      {
        product: productId,
        answer: feedbackData.answer,
        ...(feedbackData.description
          ? { description: feedbackData.description }
          : {}),
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  }
}

export const productApi = new ProductApi()
