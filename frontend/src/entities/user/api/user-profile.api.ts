import { instanceBase } from '@/shared/api'

class UserProfileApi {
  private BASE_URL = '/users/profile'

  async fetchUserProfile(idToken: string) {
    const url = `${this.BASE_URL}/`
    const response = await instanceBase.get(url, {
      headers: { Authorization: `Bearer ${idToken}` },
    })
    return response.data
  }

  async updateUserProfile(idToken: string, formData: FormData) {
    const url = `${this.BASE_URL}/`
    const response = await instanceBase.patch(url, formData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}

export const userApi = new UserProfileApi()
