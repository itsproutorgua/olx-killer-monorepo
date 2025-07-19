import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Chat } from '@/features/chat/ui/chat-list.tsx'
import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

// Fetch chats
const fetchChats = async (userId: number, token: string): Promise<Chat[]> => {
  const response = await fetch(
    `https://api.house-community.site/en/api/v1/chat/recieve/?profile_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data.results
}

// Delete chat
const deleteChatApi = async ({
  roomId,
  token,
}: {
  roomId: string
  token: string
}) => {
  const response = await fetch(
    `https://api.house-community.site/en/api/v1/chat/delete/${roomId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
  if (!response.ok) {
    throw new Error(`Failed to delete chat: ${response.status}`)
  }
}

export const useChatList = () => {
  const { data: user } = useUserProfile()
  const getIdToken = useIdToken()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // === Fetch Chats ===
  const {
    data: chats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Chat[], Error>({
    queryKey: ['chatList', user?.id],
    queryFn: async () => {
      const token = await getIdToken()
      if (!user?.id) throw new Error('User not loaded')
      return fetchChats(user?.id, token)
    },
    enabled: !!user?.id,
  })

  // === Delete Chat Mutation ===
  const {
    mutate: deleteChat,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async (roomId: string) => {
      const token = await getIdToken()
      return deleteChatApi({ roomId, token })
    },
    onSuccess: (_, roomId) => {
      queryClient.setQueryData<Chat[]>(['chatList', user?.id], prev =>
        prev ? prev.filter(chat => chat.room_id !== roomId) : [],
      )
      navigate('/account/chat')
    },
    onError: err => {
      console.error('Failed to delete chat:', err)
    },
  })

  return {
    chats,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    deleteChat,
    isDeleting,
    deleteError,
  }
}
