import { instanceBase } from '@/shared/api'

class CategoryApi {
  private BASE_URL = '/categories'

  async findAll(page: number) {
    const params = new URLSearchParams()
    params.set('page', page.toString())

    const url = `${this.BASE_URL}/?${params.toString()}`
    const response = await instanceBase.get(url)
    return response.data
  }

  async findByPath(path: string) {
    const url = `${this.BASE_URL}/${path}`
    const response = await instanceBase.get(url)
    return response.data
  }
}

export const categoryApi = new CategoryApi()
