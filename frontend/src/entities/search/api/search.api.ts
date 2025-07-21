import { Product } from '@/entities/product'
import { instanceBase } from '@/shared/api'

class SearchApi {
  private BASE_URL = '/search/'

  async getResults(query: string): Promise<Product[]> {
    const response = await instanceBase.get(
      `${this.BASE_URL}?query=${encodeURIComponent(query)}`,
    )
    return response.data.results
  }
}

export const searchApi = new SearchApi()
