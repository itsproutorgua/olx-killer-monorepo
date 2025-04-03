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
  isConnected: boolean
  selectedSellerId: number | null
  setSelectedSellerId: (sellerId: number | null) => void
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
  initialSellerId?: number
}

export const ChatProvider = ({
  children,
  initialSellerId,
}: ChatProviderProps) => {
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(
    initialSellerId || null,
  )

  // Reconnect WebSocket when selectedSellerId changes
  const { messages, sendMessage, isConnected } = useBaseChat(
    selectedSellerId ?? 0,
  )

  useEffect(() => {
    if (initialSellerId && !selectedSellerId) {
      setSelectedSellerId(initialSellerId)
    }
  }, [initialSellerId, selectedSellerId])

  const value = {
    messages,
    sendMessage,
    isConnected,
    selectedSellerId,
    setSelectedSellerId,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
