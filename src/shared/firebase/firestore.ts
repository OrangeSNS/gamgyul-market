import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove,
  updateDoc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { DirectChat, ChatMessage, ChatParticipantProfile } from '@features/chat/types/chat.types'

const CHATS = 'chats'
const MESSAGES = 'messages'

export async function getOrCreateDirectChat(
  myProfile: ChatParticipantProfile,
  targetProfile: ChatParticipantProfile,
): Promise<DirectChat> {
  const chatId = [myProfile.accountName, targetProfile.accountName].sort().join('__')
  const chatRef = doc(db, CHATS, chatId)
  const snap = await getDoc(chatRef)

  if (snap.exists()) {
    return { id: snap.id, ...(snap.data() as Omit<DirectChat, 'id'>) }
  }

  const now = serverTimestamp() as Timestamp
  const newChat: Omit<DirectChat, 'id'> = {
    type: 'direct',
    participants: [myProfile.accountName, targetProfile.accountName],
    participantProfiles: {
      [myProfile.accountName]: myProfile,
      [targetProfile.accountName]: targetProfile,
    },
    lastMessage: '',
    lastMessageAt: null,
    unreadBy: [],
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(chatRef, newChat)
  return { id: chatId, ...newChat }
}

export function subscribeMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void,
): Unsubscribe {
  const messagesRef = collection(db, CHATS, chatId, MESSAGES)
  const q = query(messagesRef, orderBy('createdAt', 'asc'))

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ChatMessage, 'id'>),
    }))
    callback(messages)
  })
}

export async function sendTextMessage(
  chatId: string,
  senderProfile: ChatParticipantProfile,
  text: string,
): Promise<void> {
  const messagesRef = collection(db, CHATS, chatId, MESSAGES)
  const chatRef = doc(db, CHATS, chatId)
  const now = serverTimestamp() as Timestamp

  const batch = writeBatch(db)

  const newMessageRef = doc(messagesRef)
  const newMessage: Omit<ChatMessage, 'id'> = {
    chatId,
    senderAccountName: senderProfile.accountName,
    text,
    type: 'text',
    createdAt: now,
    readBy: [senderProfile.accountName],
  }
  batch.set(newMessageRef, newMessage)

  const recipientAccountName = chatId
    .split('__')
    .find((p) => p !== senderProfile.accountName)

  batch.update(chatRef, {
    lastMessage: text,
    lastMessageAt: now,
    updatedAt: now,
    ...(recipientAccountName ? { unreadBy: arrayUnion(recipientAccountName) } : {}),
  })

  await batch.commit()
}

export async function markChatAsRead(chatId: string, accountName: string): Promise<void> {
  const chatRef = doc(db, CHATS, chatId)
  await updateDoc(chatRef, { unreadBy: arrayRemove(accountName) })
}

export function subscribeUnreadChats(
  accountName: string,
  callback: (hasUnread: boolean) => void,
): Unsubscribe {
  const q = query(collection(db, CHATS), where('unreadBy', 'array-contains', accountName))
  return onSnapshot(q, (snapshot) => {
    callback(!snapshot.empty)
  })
}

export async function getChatDoc(chatId: string): Promise<DirectChat | null> {
  const snap = await getDoc(doc(db, CHATS, chatId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<DirectChat, 'id'>) }
}
