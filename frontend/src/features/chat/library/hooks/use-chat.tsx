import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { Message, WebSocketResponse } from '@/features/chat'
import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useChat = (roomId: string | null) => {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<Message[]>([])
  const { data: user } = useUserProfile()
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const getIdToken = useIdToken()
  const isConnecting = useRef(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!roomId || !user?.id) return
    setMessages([])

    let isCurrent = true // Track if this effect is still relevant

    const connect = async () => {
      isConnecting.current = true

      try {
        const token = await getIdToken()
        //ws://54.145.126.99:8001
        //wss://api.house-community.site
        const url = `wss://chat.house-community.site/ws/chat/?room_id=${roomId}`

        ws.current = new WebSocket(url, ['Bearer', token])

        ws.current.onopen = () => {
          if (!isCurrent) return // Skip if effect was cleaned up
          setIsConnected(true)
          setIsReady(true)
        }

        ws.current.onmessage = e => {
          if (!isCurrent) return

          try {
            const data = JSON.parse(e.data)

            // Case 1: array of messages
            if (Array.isArray(data)) {
              if (data.length === 0) return // Ignore empty batches

              setMessages(prev => {
                const merged = [...prev, ...data]

                // Deduplicate by message_id
                const unique = Array.from(
                  new Map(merged.map(m => [m.message_id, m])).values(),
                )

                // Sort by created_at timestamp
                return unique.sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime(),
                )
              })
            }

            // Case 2: object-based real-time message or update
            else if (typeof data === 'object' && data !== null) {
              handleMessage(data)
            }

            // Case 3: Unexpected
            else {
              console.warn('Unexpected WebSocket message format:', data)
            }
          } catch (error) {
            console.error('Invalid WebSocket message:', error)
          }
        }

        ws.current.onerror = error => {
          if (!isCurrent) return
          console.error('WebSocket error:', error)
          setIsReady(false)
        }

        ws.current.onclose = event => {
          if (!isCurrent) return
          console.log(
            `WebSocket closed for sellerId: ${roomId}`,
            event.code,
            event.reason,
          )
          setIsConnected(false)
          setIsReady(false)
          // Only nullify if the closed socket is the current one
          // if (ws.current === socket) {
          //   ws.current = null
          // }
          isConnecting.current = false
        }
      } catch (error) {
        console.error('Failed to connect WebSocket:', error)
        isConnecting.current = false
        if (isCurrent) setIsReady(false)
      }
    }

    connect().then(() =>
      queryClient.invalidateQueries({ queryKey: ['chatList', user?.id] }),
    )

    return () => {
      isCurrent = false // Mark this effect as stale
      if (ws.current) {
        ws.current.close()
        console.log(`WebSocket closed for sellerId: ${roomId}`)
        ws.current = null
      }
      setIsConnected(false)
      setIsReady(false)
    }
  }, [roomId, user?.id])

  let invalidateTimeout: ReturnType<typeof setTimeout> | null = null

  const debounceInvalidateChatList = () => {
    if (invalidateTimeout !== null) return // already scheduled
    invalidateTimeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['chatList'] })
      invalidateTimeout = null
    }, 300) // Delay just enough to group multiple events
  }

  const handleMessage = (data: WebSocketResponse) => {
    setMessages(prev => {
      switch (data.type) {
        case 'chat_message':
          return [...prev, data.message]
        case 'message_edited': {
          const { message_id, text } = data
          if (!message_id || typeof text !== 'string') return prev

          return prev.map(msg =>
            msg.message_id === message_id ? { ...msg, text } : msg,
          )
        }

        case 'message_deleted': {
          const deletedId = data.message_id
          if (!deletedId) return prev

          return prev.filter(msg => msg.message_id !== deletedId)
        }
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
    debounceInvalidateChatList()
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

  const editMessage = (messageId: number, newText: string) => {
    const currentSocket = ws.current
    if (!currentSocket || currentSocket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not ready for edit')
      return
    }

    const payload = {
      action: 'edit',
      message_id: messageId,
      text: newText,
    }

    currentSocket.send(JSON.stringify(payload))
  }

  const deleteMessage = (messageId: number) => {
    const currentSocket = ws.current
    if (!currentSocket) {
      console.error('WebSocket not ready for delete')
      return
    }

    const payload = {
      action: 'delete',
      message_id: messageId,
    }

    currentSocket.send(JSON.stringify(payload))
  }

  return {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    isConnected,
    isReady,
  }
}
