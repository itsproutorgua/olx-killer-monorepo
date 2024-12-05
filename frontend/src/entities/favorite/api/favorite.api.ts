import { FavoriteItem } from '@/entities/favorite/model/favorite.types'
import { instanceBase } from '@/shared/api'

class FavoriteApi {
  private BASE_URL = '/favorites/'

  async getFavorites(idToken: string) {
    const response = await instanceBase.get<FavoriteItem[]>(this.BASE_URL, {
      headers: { Authorization: `Bearer ${idToken}` },
    })
    return response.data
  }

  async addToFavorites(idToken: string, productId: number) {
    const response = await instanceBase.post(
      this.BASE_URL,
      { product: productId },
      {
        headers: { Authorization: `Bearer ${idToken}` },
      },
    )
    return response.data
  }

  async removeFromFavorites(idToken: string, productId: number) {
    const response = await instanceBase.delete(
      `${this.BASE_URL}${productId}/`,
      {
        headers: { Authorization: `Bearer ${idToken}` },
      },
    )
    return response.data
  }

  async getFavoriteCount(idToken: string) {
    const response = await instanceBase.get<{ favorite_count: number }>(
      `${this.BASE_URL}user-favorite-count/`,
      {
        headers: { Authorization: `Bearer ${idToken}` },
      },
    )
    return response.data.favorite_count
  }
}

export const favoriteApi = new FavoriteApi()
