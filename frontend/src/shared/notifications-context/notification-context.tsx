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

  useEffect(() => {
    if (!user?.id) return

    let isMounted = true

    const connect = async () => {
      try {
        const token = await getIdToken()
        const ws = new WebSocket(
          'wss://chat.house-community.site/ws/chat/notifications/',
          ['Bearer', token],
        )
        socketRef.current = ws

        ws.onopen = () => {
          if (!isMounted) return
          setIsConnected(true)
        }

        ws.onmessage = e => {
          if (!isMounted) return
          try {
            const parsed = JSON.parse(e.data)

            if (parsed.type === 'notify' && parsed.messages) {
              // First message shape: as expected
              setNotifications(parsed)
            } else if (
              parsed.counter !== undefined &&
              parsed.messages instanceof Array
            ) {
              // Subsequent message shape: normalize to expected NotificationPayload
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
        }

        ws.onclose = () => {
          if (!isMounted) return
          setIsConnected(false)
        }

        ws.onerror = err => {
          console.error('Notification WS error:', err)
        }
      } catch (error) {
        console.error('Failed to connect notification socket:', error)
      }
    }

    connect().then()

    return () => {
      isMounted = false
      socketRef.current?.close()
      console.log(`Notifications WebSocket closed`)
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
