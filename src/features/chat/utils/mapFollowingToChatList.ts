import type { User } from '@shared/types'
import type { DirectChat, ChatListItemVM } from '../types/chat.types'
import { buildChatId } from './buildChatId'

/**
 * 팔로잉 목록과 채팅 문서 목록을 결합하여 ChatListItemVM[]을 생성합니다.
 * - 기존 채팅 있는 유저: 상단 (lastMessageAt 내림차순)
 * - 채팅 없는 유저: 하단
 */
export function mapFollowingToChatList(
  myAccountName: string,
  followingList: User[],
  chatDocs: Array<DirectChat | null>,
): ChatListItemVM[] {
  const withChat: ChatListItemVM[] = []
  const withoutChat: ChatListItemVM[] = []

  followingList.forEach((user, i) => {
    const chatDoc = chatDocs[i]
    const chatId = buildChatId(myAccountName, user.accountname)

    if (chatDoc && chatDoc.lastMessageAt) {
      withChat.push({
        user,
        chatId,
        lastMessage: chatDoc.lastMessage,
        lastMessageAt: chatDoc.lastMessageAt,
        isUnread: chatDoc.unreadBy?.includes(myAccountName) ?? false,
      })
    } else {
      withoutChat.push({ user, chatId })
    }
  })

  withChat.sort((a, b) => {
    const aTime = a.lastMessageAt?.toMillis() ?? 0
    const bTime = b.lastMessageAt?.toMillis() ?? 0
    return bTime - aTime
  })

  return [...withChat, ...withoutChat]
}
