import { instanceBase } from '@/shared/api'
import { APP_VARIABLES } from '@/shared/constants/app.const'
import type { Product, ProductResponse, Sort } from '../model'

class ProductApi {
  private BASE_URL = '/products'

  async findByFilters({
    path,
    currency_code,
    page = 1,
    limit = APP_VARIABLES.LIMIT,
    price_max,
    price_min,
    sort,
  }: {
    path: string
    currency_code?: string
    page?: number
    limit?: number
    price_max?: number
    price_min?: number
    sort?: Sort
  }) {
    const params = new URLSearchParams()
    params.set('category_path', path.toString())
    params.set('page', page.toString())
    params.set('page_size', limit.toString())

    if (currency_code) params.set('currency_code', currency_code.toString())
    if (price_max) params.set('price_max', price_max.toString())
    if (price_min) params.set('price_min', price_min.toString())
    if (sort) params.set('sort_by', sort.toString())

    const url = `${this.BASE_URL}/filters/?${params.toString()}`

    const response = await instanceBase.get<ProductResponse>(url)
    return response.data
  }

  async findBySlug({ slug }: { slug: string }) {
    const url = `${this.BASE_URL}${slug}`
    const response = await instanceBase.get<Product>(url)
    return response.data
  }
}

export const productApi = new ProductApi()
