import type { Timestamp } from 'firebase/firestore'
import type { User } from '@shared/types'

export interface ChatParticipantProfile {
  accountName: string
  username: string
  image: string
}

export interface DirectChat {
  id: string
  type: 'direct'
  participants: string[]
  participantProfiles: Record<string, ChatParticipantProfile>
  lastMessage: string
  lastMessageAt: Timestamp | null
  unreadBy: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ChatMessage {
  id: string
  chatId: string
  senderAccountName: string
  text: string
  type: 'text'
  createdAt: Timestamp
  readBy: string[]
}

export interface ChatListItemVM {
  user: User
  chatId: string
  lastMessage?: string
  lastMessageAt?: Timestamp
  isUnread?: boolean
}

export interface SendMessagePayload {
  chatId: string
  senderProfile: ChatParticipantProfile
  text: string
}
