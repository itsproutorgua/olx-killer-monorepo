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
  const isConnecting = useRef(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!sellerId || !user?.id) return

    let socket: WebSocket | null = null
    let isCurrent = true // Track if this effect is still relevant

    const connect = async () => {
      isConnecting.current = true

      try {
        const token = await getIdToken()
        //ws://54.145.126.99:8001
        //wss://api.house-community.site
        const url = `wss://chat.house-community.site/ws/chat/?first_user=${user.id}&second_user=${sellerId}`

        socket = new WebSocket(url, ['Bearer', token])
        ws.current = socket // Update ref with current socket

        socket.onopen = () => {
          if (!isCurrent) return // Skip if effect was cleaned up
          setIsConnected(true)
          setIsReady(true)
          console.log(`WebSocket connected for sellerId: ${sellerId}`)
        }

        socket.onmessage = e => {
          if (!isCurrent) return
          try {
            const data = JSON.parse(e.data)

            if (Array.isArray(data)) {
              setMessages(data) // Initial messages from server
            } else {
              handleMessage(data)
            }
          } catch (error) {
            console.error('Invalid WebSocket message:', error)
          }
        }

        socket.onerror = error => {
          if (!isCurrent) return
          console.error('WebSocket error:', error)
          setIsReady(false)
        }

        socket.onclose = event => {
          if (!isCurrent) return
          console.log(
            `WebSocket closed for sellerId: ${sellerId}`,
            event.code,
            event.reason,
          )
          setIsConnected(false)
          setIsReady(false)
          // Only nullify if the closed socket is the current one
          if (ws.current === socket) {
            ws.current = null
          }
          isConnecting.current = false
        }
      } catch (error) {
        console.error('Failed to connect WebSocket:', error)
        isConnecting.current = false
        if (isCurrent) setIsReady(false)
      }
    }

    connect()

    return () => {
      isCurrent = false // Mark this effect as stale
      socket?.close() // Close only the socket from this effect
      // DO NOT nullify ws.current here - it may belong to a newer effect
      setIsConnected(false)
      setIsReady(false)
    }
  }, [sellerId, user?.id])

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
    const currentSocket = ws.current // Capture current ref value

    if (!currentSocket) {
      console.error('No WebSocket connection established')
      return
    }

    if (currentSocket.readyState === WebSocket.OPEN) {
      currentSocket.send(JSON.stringify({ action: 'send', message: text }))
    } else {
      console.error('WebSocket is closed, cannot send message')
    }
  }

  return { messages, sendMessage, isConnected, isReady } // Added isReady for UI feedback
}
