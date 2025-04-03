import { useEffect, useState } from 'react'
import { profileDefault } from '@/shared/assets'

import { useChatContext } from '@/features/chat/chat-context/chat-context.tsx'
import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'
import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area.tsx'
import { CheckedDoubleIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'

interface Chat {
  first_user_profile: {
    id: number
    picture: string | null
  }
  second_user_profile: {
    id: number
    picture: string | null
  }
  last_message: {
    content: string
    created_at: string
    sender: string
  } | null
}

export const ChatList = ({ initialSellerId }: { initialSellerId?: number }) => {
  const { data: user, isLoading, error } = useUserProfile()
  const [chats, setChats] = useState<Chat[]>([])
  const getIdToken = useIdToken()
  const { setSelectedSellerId, selectedSellerId } = useChatContext()

  useEffect(() => {
    let mounted = true

    const fetchChats = async () => {
      if (!user?.id) return

      const token = await getIdToken()
      try {
        const response = await fetch(
          `https://api.house-community.site/en/api/v1/chat/recieve/?profile_id=${user?.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        if (!mounted) return

        setChats(data.results)

        // Auto-select first chat if no chat is selected
        if (!selectedSellerId) {
          const firstChatSellerId =
            initialSellerId || data.results[0]?.second_user_profile.id
          if (firstChatSellerId) {
            setSelectedSellerId(firstChatSellerId)
          }
        }
      } catch (error) {
        console.error('Error fetching user ID or chats:', error)
      }
    }

    fetchChats()

    return () => {
      mounted = false
    }
  }, [user?.id])

  if (isLoading) return <div>Loading user data...</div>
  if (error) return <div>Error loading user: {error.message}</div>
  if (!user) return <div>No user data available. Please log in.</div>

  const handleChatSelect = (sellerId: number) => {
    setSelectedSellerId(sellerId)
  }

  return (
    <ScrollArea className='h-[calc(100vh-230px)] flex-grow overflow-y-auto'>
      <ul>
        {chats?.map((chat, index) => {
          const sellerProfile = chat.second_user_profile
          const lastMessage = chat.last_message

          return (
            <li
              key={index}
              className='border-b border-b-border py-4 first:pt-0'
              onClick={() => handleChatSelect(sellerProfile.id)}
            >
              <div
                className={cn(
                  'flex cursor-pointer gap-3 rounded-[10px] px-5 py-2.5',
                  sellerProfile.id === selectedSellerId && 'bg-primary-50',
                )}
              >
                <img
                  src={sellerProfile.picture || profileDefault}
                  alt={`User ${sellerProfile.id}`}
                  className='size-12 flex-none rounded-full object-cover'
                />
                <div className='flex-1 space-y-2'>
                  <div className='flex items-baseline justify-between'>
                    <h3 className='text-sm/[21px] font-semibold text-primary-900'>
                      User {sellerProfile.id}
                    </h3>
                    <span className='text-xs/[14.52px] text-gray-500'>
                      {lastMessage
                        ? new Date(lastMessage.created_at).toLocaleDateString()
                        : 'No messages'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='line-clamp-1 w-[198px] text-xs/[14.52px] text-gray-950'>
                      {lastMessage ? lastMessage.content : 'No messages yet'}
                    </p>
                    {lastMessage && <CheckedDoubleIcon />}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </ScrollArea>
  )
}
