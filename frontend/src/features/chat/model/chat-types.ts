export type MessageStatus = 'send' | 'delivered' | 'read'

export interface Message {
  message_id: number
  text: string
  sender_id: number
  sender_email?: string
  status: MessageStatus
  created_at: string
  updated_at: string
}

export type WebSocketEventType =
  | 'chat_message'
  | 'message_edited'
  | 'message_deleted'
  | 'mark_message_as_delivered'
  | 'mark_message_as_read'

export interface WebSocketResponse {
  type: WebSocketEventType
  message: Message
}
