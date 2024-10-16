import { instanceBase } from '@/shared/api'

class CategoryApi {
  private BASE_URL = '/categories/'

  async findAll(page: number) {
    const params = new URLSearchParams()
    params.set('page', page.toString())

    const url = `${this.BASE_URL}` + `?` + `${params.toString()}`
    const response = await instanceBase.get(url)
    return response.data
  }

  async findById(id: number) {
    const url = `${this.BASE_URL}` + `${id}`
    const response = await instanceBase.get(url)
    return response.data
  }
}

export const categoryApi = new CategoryApi()
