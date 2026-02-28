import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Spinner from '@shared/components/Spinner'
import { User } from '@shared/types'
import { ROUTES, TOPBAR_HEIGHT } from '@shared/constants'
import { useDebounce } from '@shared/hooks/useDebounce'
import { request } from '@shared/api/client'

export default function SearchPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  
  // 팀원이 만든 디바운스 훅 사용 (400ms 대기)
  const debouncedKeyword = useDebounce(keyword, 400)

  // ✨ 우리가 만든 텍스트 하이라이트 함수 유지
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-[#F26E22]">{part}</span>
      ) : part
    );
  };

  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    // 팀원의 request 도구 사용 (토큰 처리가 이미 되어있을 확률이 큼)
    request<User[]>(`/user/searchuser/?keyword=${encodeURIComponent(debouncedKeyword)}`)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [debouncedKeyword])

  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <header className={`sticky top-0 z-30 bg-white border-b border-[#DBDBDB] px-[16px] ${TOPBAR_HEIGHT} flex items-center gap-[20px] w-full`}>
        <button onClick={() => navigate(-1)} className="p-0 flex-shrink-0">
          <img src="/icons/icon-arrow-left.svg" alt="뒤로가기" className="w-[22px] h-[22px]" />
        </button>
        <div className="flex-1 h-[32px]">
          <input
            type="text"
            placeholder="계정 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus
            className="w-full h-full bg-[#F2F2F2] px-[16px] py-0 rounded-full text-[14px] outline-none placeholder:text-[#C4C4C4]"
          />
        </div>
      </header>

      {/* 2. 결과 리스트: 팀원의 컴포넌트 + 우리의 하이라이트 */}
      <main className="flex-1 px-[16px]">
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-[16px]">
            {results.map((user) => (
              <button
                key={user._id}
                // 팀원이 정한 상수를 사용하여 프로필로 이동
                onClick={() => navigate(ROUTES.PROFILE(user.accountname))}
                className="w-full h-[50px] flex items-center gap-[12px] text-left"
              >
                {/* 팀원의 Avatar 컴포넌트 사용 (이미지 에러 처리가 내장됨) */}
                <Avatar src={user.image} alt={user.username} size="sm" />
                <div className="flex flex-col gap-[4px] min-w-0">
                  <p className="text-[14px] font-medium text-black">
                    {highlightText(user.username, keyword)}
                  </p>
                  <p className="text-[12px] text-[#767676]">
                    @ {highlightText(user.accountname, keyword)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : keyword && !loading ? (
          <p className="text-center text-sm text-[#767676] mt-10">검색 결과가 없습니다. 🍊</p>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#767676]">
             <img src="/icons/icon-search.svg" className="w-12 h-12 opacity-20 mb-4" alt="" />
             <p className="text-sm">사용자 이름이나 계정 ID로 검색하세요</p>
          </div>
        )}
      </main>
    </div>
  )
}