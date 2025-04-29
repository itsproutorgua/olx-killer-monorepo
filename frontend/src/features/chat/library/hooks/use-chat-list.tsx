import { useEffect, useState } from 'react'

import { Chat } from '@/features/chat/ui/chat-list.tsx'
import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useChatList = () => {
  const { data: user } = useUserProfile()
  const getIdToken = useIdToken()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchChats = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const token = await getIdToken()
      const response = await fetch(
        `https://api.house-community.site/en/api/v1/chat/recieve/?profile_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setChats(data.results)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch chats'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [user?.id])

  return { chats, isLoading, error, refreshChats: fetchChats }
}
