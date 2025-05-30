import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Message } from '@/features/chat'
import { useChat as useBaseChat } from '@/features/chat/library/hooks/use-chat'

interface ChatContextValue {
  messages: Message[]
  sendMessage: (text: string) => void
  editingMessage: Message | null
  setEditingMessage: (msg: Message | null) => void
  editMessage: (id: number, text: string) => void
  deleteMessage: (messageId: number) => void
  isConnected: boolean
  currentRoomId: string | null
  setCurrentRoomId: (roomId: string | null) => void
  selectedSellerProfile: {
    id: number
    picture: string | null
    username: string
  } | null
  setSelectedSellerProfile: (
    profile: { id: number; picture: string | null; username: string } | null,
  ) => void
  mobileView: 'list' | 'chat'
  setMobileView: (view: 'list' | 'chat') => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
  initialRoomId?: string
}

export const ChatProvider = ({
  children,
  initialRoomId,
}: ChatProviderProps) => {
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(
    initialRoomId || null,
  )
  const { messages, sendMessage, editMessage, deleteMessage, isConnected } =
    useBaseChat(currentRoomId)

  const [editingMessage, setEditingMessage] = useState<Message | null>(null)

  const [selectedSellerProfile, setSelectedSellerProfile] = useState<{
    id: number
    picture: string | null
    username: string
  } | null>(null)

  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

  useEffect(() => {
    if (initialRoomId && !currentRoomId) {
      setCurrentRoomId(initialRoomId)
    }
  }, [initialRoomId, currentRoomId])

  const value: ChatContextValue = {
    messages,
    sendMessage,
    editingMessage,
    setEditingMessage,
    editMessage,
    deleteMessage,
    isConnected,
    currentRoomId,
    setCurrentRoomId,
    selectedSellerProfile,
    setSelectedSellerProfile,
    mobileView,
    setMobileView,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
