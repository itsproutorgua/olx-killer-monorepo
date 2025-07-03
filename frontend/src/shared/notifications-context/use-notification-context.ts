import { useContext } from 'react'

import { NotificationContext } from './notification-context'
import type { NotificationContextValue } from './notification-context'

export const useNotificationContext = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext)
  if (!ctx)
    throw new Error(
      'useNotificationContext must be used inside NotificationProvider',
    )
  return ctx
}
