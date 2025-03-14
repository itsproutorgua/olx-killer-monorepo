import { useEffect, useRef, useState } from 'react'

import { Message, WebSocketResponse } from '@/features/chat'
import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useChat = (sellerId: number) => {
  const [messages, setMessages] = useState<Message[]>([])
  const { data: user } = useUserProfile()

  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const getIdToken = useIdToken()

  useEffect(() => {
    const connect = async () => {
      const token = await getIdToken()
      const url = `ws://api.house-community.site/ws/chat/?first_user=${user?.id}&second_user=${sellerId}`
      ws.current = new WebSocket(url, ['Bearer', token])

      ws.current.onopen = () => {
        setIsConnected(true)
        console.log('WebSocket connected')
      }

      ws.current.onerror = function (error) {
        console.error('Error WebSocket:', error)
      }

      ws.current.onmessage = e => {
        const data: WebSocketResponse = JSON.parse(e.data)
        handleMessage(data)
      }

      ws.current.onclose = event => {
        setIsConnected(false)
        console.log('WebSocket disconnected')
        console.log(' WebSocket closed:', event.code, event.reason)
      }
    }

    connect()
    // return () => {
    //   ws.current?.close()
    // }
  }, [sellerId, user?.id])

  const handleMessage = (data: WebSocketResponse) => {
    switch (data.type) {
      case 'chat_message':
        setMessages(prev => [...prev, data.message])
        break
      case 'message_edited':
        setMessages(prev =>
          prev.map(msg =>
            msg.message_id === data.message.message_id
              ? { ...msg, text: data.message.text }
              : msg,
          ),
        )
        break
      case 'message_deleted':
        setMessages(prev =>
          prev.filter(msg => msg.message_id !== data.message.message_id),
        )
        break
      case 'mark_message_as_delivered':
      case 'mark_message_as_read':
        setMessages(prev =>
          prev.map(msg =>
            msg.message_id === data.message.message_id
              ? { ...msg, status: data.message.status }
              : msg,
          ),
        )
        break
    }
  }

  const sendMessage = (text: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ message: text }))
    }
  }

  return { messages, sendMessage, isConnected }
}
