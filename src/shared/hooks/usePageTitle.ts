import { useEffect } from 'react'

/**
 * 페이지 진입 시 document.title을 동적으로 설정하는 훅
 * - title이 있으면 "title | 감귤마켓"
 * - title이 빈 문자열이면 "감귤마켓"
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | 감귤마켓` : '감귤마켓'
  }, [title])
}
