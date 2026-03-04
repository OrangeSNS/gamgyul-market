import type { Timestamp } from 'firebase/firestore'

/**
 * Firestore Timestamp를 채팅 시간 문자열로 변환합니다.
 * - 오늘: "오전 11:30"
 * - 어제: "어제"
 * - 그 외: "M월 D일"
 */
export function formatChatTime(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return ''

  const date = timestamp.toDate()
  const now = new Date()

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const period = hours < 12 ? '오전' : '오후'
    const displayHour = hours % 12 === 0 ? 12 : hours % 12
    return `${period} ${displayHour}:${minutes}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) return '어제'

  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}
