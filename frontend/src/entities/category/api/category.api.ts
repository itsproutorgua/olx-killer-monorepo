import { instanceBase } from '@/shared/api'

class CategoryApi {
  private BASE_URL = '/categories'

  async getCategories() {
    const response = await instanceBase.get(`${this.BASE_URL}`)
    return response.data
  }

  async getCategoryById(id: number) {
    const response = await instanceBase.get(`${this.BASE_URL}/${id}`)
    return response.data
  }
}

export const categoryApi = new CategoryApi()
