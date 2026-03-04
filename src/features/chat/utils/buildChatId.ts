/**
 * 두 accountName으로 고유한 채팅방 ID를 생성합니다.
 * 순서에 관계없이 항상 동일한 ID가 생성됩니다.
 */
export function buildChatId(a: string, b: string): string {
  return [a, b].sort().join('__')
}
