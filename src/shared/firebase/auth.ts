import { signInAnonymously } from 'firebase/auth'
import { auth } from './firebase'

/**
 * Firebase 익명 세션을 보장합니다.
 * 이미 로그인 상태면 스킵합니다.
 *
 * MVP 주석: 운영 수준 보안을 위해서는 서버에서 Firebase Custom Token 발급 필요.
 * (서버에서 gamgyul accountname을 기반으로 Custom Token 생성 → 클라이언트에서 signInWithCustomToken)
 */
export async function ensureFirebaseSession(): Promise<void> {
  if (auth.currentUser) return
  await signInAnonymously(auth)
}
