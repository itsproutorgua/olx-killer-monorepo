import { instanceBase } from '@/shared/api'

class ProductApi {
  private BASE_URL = '/products'

  // async findByFilters(page: number) {
  //   const params = new URLSearchParams()
  //   const response = await instanceBase.get(`${this.BASE_URL}/filters`)
  //   return response.data
  // }

  async getCategoryById(id: number) {
    const response = await instanceBase.get(`${this.BASE_URL}/${id}`)
    return response.data
  }
}

export const productApi = new ProductApi()
