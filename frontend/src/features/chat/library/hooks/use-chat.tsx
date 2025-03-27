import { useEffect, useRef, useState } from 'react'

import { Message, WebSocketResponse } from '@/features/chat'
//import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useChat = (sellerId: number) => {
  const [messages, setMessages] = useState<Message[]>([])
  //const { data: user } = useUserProfile()
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const getIdToken = useIdToken()
  const isConnecting = useRef(false) // Prevent multiple simultaneous connections

  useEffect(() => {
    const connect = async () => {
      if (ws.current || isConnecting.current) return // Prevent duplicate connections
      isConnecting.current = true

      const token = await getIdToken()
      const url = `ws://54.145.126.99:8001/ws/chat/?first_user=19654&second_user=${sellerId}`
      ws.current = new WebSocket(url, ['Bearer', token])

      ws.current.onopen = () => {
        setIsConnected(true)
        console.log('WebSocket connected')
      }

      ws.current.onerror = error => {
        console.error('Error WebSocket:', error)
      }

      ws.current.onmessage = e => {
        try {
          const data = JSON.parse(e.data) // Parse incoming message

          if (Array.isArray(data)) {
            // 🔥 Server sent initial messages
            setMessages(data) // Replace messages (avoid duplication)
          } else {
            // 🔥 Normal WebSocket message
            handleMessage(data)
          }
        } catch (error) {
          console.error('Invalid WebSocket message:', error)
        }
      }

      ws.current.onclose = event => {
        setIsConnected(false)
        console.log('WebSocket disconnected:', event.code, event.reason)
        ws.current = null // Ensure state is cleared
      }

      isConnecting.current = false
    }

    connect()

    return () => {
      ws.current?.close()
      ws.current = null
    }
  }, [sellerId])

  const handleMessage = (data: WebSocketResponse) => {
    setMessages(prev => {
      switch (data.type) {
        case 'chat_message':
          return [...prev, data.message]
        case 'message_edited':
          return prev.map(msg =>
            msg.message_id === data.message.message_id
              ? { ...msg, text: data.message.text }
              : msg,
          )
        case 'message_deleted':
          return prev.filter(msg => msg.message_id !== data.message.message_id)
        case 'mark_message_as_delivered':
        case 'mark_message_as_read':
          return prev.map(msg =>
            msg.message_id === data.message.message_id
              ? { ...msg, status: data.message.status }
              : msg,
          )
        default:
          return prev
      }
    })
  }

  const sendMessage = (text: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: 'send', message: text }))
    } else {
      console.error('WebSocket is not open')
    }
  }

  return { messages, sendMessage, isConnected }
}
