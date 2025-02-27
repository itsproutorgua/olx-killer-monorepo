import { useEffect, useRef, useState } from 'react'

import { Message, WebSocketResponse } from '@/features/chat'

export const useChat = (roomId: number) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(`ws://localhost:8001/ws/chat/${roomId}/`)

      ws.current.onopen = () => {
        setIsConnected(true)
        console.log('WebSocket connected')
      }

      ws.current.onmessage = e => {
        const data: WebSocketResponse = JSON.parse(e.data)
        handleMessage(data)
      }

      ws.current.onclose = () => {
        setIsConnected(false)
        console.log('WebSocket disconnected')
      }
    }

    connect()
    return () => {
      ws.current?.close()
    }
  }, [roomId])

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
