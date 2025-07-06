import { createContext, ReactNode, useEffect, useRef, useState } from 'react'

import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token'

export interface NotificationRoom {
  counter_by_room: number
  created_at: string
  updated_at: string
  last_message: string
  status: string
  sender_id: number
  room_id: number
}

interface NotificationPayload {
  type: 'notify'
  messages: {
    counter: number
    messages: NotificationRoom[]
  }
}

export interface NotificationContextValue {
  notifications: NotificationPayload | null
  unreadTotal: number
  rooms: NotificationRoom[]
  isConnected: boolean
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { data: user } = useUserProfile()
  const getIdToken = useIdToken()
  const [notifications, setNotifications] =
    useState<NotificationPayload | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const socketRef = useRef<WebSocket | null>(null)
  const updateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isConnecting = useRef(false)
  const isMounted = useRef(true)

  useEffect(() => {
    if (!user?.id) return
    isMounted.current = true

    const connect = async () => {
      if (isConnecting.current) return
      if (
        socketRef.current &&
        socketRef.current.readyState !== WebSocket.CLOSED
      )
        return

      isConnecting.current = true

      try {
        const token = await getIdToken()
        const ws = new WebSocket(
          'wss://chat.house-community.site/ws/chat/notifications/',
          ['Bearer', token],
        )

        socketRef.current = ws

        ws.onopen = () => {
          if (!isMounted.current) return
          setIsConnected(true)
          isConnecting.current = false
        }

        ws.onmessage = e => {
          if (!isMounted.current) return

          //Clear previous scheduled update
          if (updateTimeout.current) {
            clearTimeout(updateTimeout.current)
            updateTimeout.current = null
          }

          //Debounce the update
          updateTimeout.current = setTimeout(() => {
            try {
              const parsed = JSON.parse(e.data)

              if (parsed.type === 'notify' && parsed.messages) {
                setNotifications(parsed)
              } else if (
                parsed.counter !== undefined &&
                parsed.messages instanceof Array
              ) {
                setNotifications({
                  type: 'notify',
                  messages: {
                    counter: parsed.counter,
                    messages: parsed.messages,
                  },
                })
              } else {
                console.warn('Unexpected notification message format:', parsed)
              }
            } catch (error) {
              console.error('Invalid notification message:', error)
            }
          }, 500)
        }

        ws.onclose = event => {
          if (!isMounted.current) return
          console.log('Notification WebSocket closed', event.code, event.reason)
          setIsConnected(false)
          isConnecting.current = false

          setTimeout(() => {
            if (document.visibilityState === 'visible') {
              console.log('Reconnecting notification WebSocket...')
              connect()
            }
          }, 1000)
        }

        ws.onerror = err => {
          console.error('Notification WS error:', err)
        }
      } catch (error) {
        console.error('Failed to connect notification socket:', error)
        isConnecting.current = false
      }
    }

    connect()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const socket = socketRef.current
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          console.warn('Notification WS was closed. Reconnecting...')
          connect()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current)
        updateTimeout.current = null
      }
      isMounted.current = false
      socketRef.current?.close()
      socketRef.current = null
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      setIsConnected(false)
      console.log('Notifications WebSocket cleaned up')
    }
  }, [user?.id])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadTotal: notifications?.messages.counter || 0,
        rooms: notifications?.messages.messages || [],
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
