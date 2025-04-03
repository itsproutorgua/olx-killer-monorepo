export const fetchUserId = async (
  profileId: number,
  token: string,
): Promise<number | null> => {
  try {
    const response = await fetch(
      `https://api.house-community.site/uk/api/v1/users/profile/getuserid/${profileId}/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) throw new Error('Failed to fetch user ID')

    const data = await response.json()
    return data.user_id
  } catch (error) {
    console.error(`Error fetching user ID for profile ${profileId}:`, error)
    return null
  }
}
