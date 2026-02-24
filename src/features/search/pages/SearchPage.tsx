import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Spinner from '@shared/components/Spinner'
import { User } from '@shared/types'
import { ROUTES } from '@shared/constants'
import { useDebounce } from '@shared/hooks/useDebounce'
import { request } from '@shared/api/client'

export default function SearchPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedKeyword = useDebounce(keyword, 400)

  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    request<User[]>(`/user/searchuser/?keyword=${encodeURIComponent(debouncedKeyword)}`)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [debouncedKeyword])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="계정을 검색해보세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="text-gray-400">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Results */}
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : results.length > 0 ? (
          results.map((user) => (
            <button
              key={user._id}
              onClick={() => navigate(ROUTES.PROFILE(user.accountname))}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
            >
              <Avatar src={user.image} alt={user.username} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-400 truncate">@{user.accountname}</p>
              </div>
            </button>
          ))
        ) : keyword && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <p className="text-sm text-gray-500">
              "<span className="font-medium">{keyword}</span>"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-gray-400">사용자 이름이나 계정 ID로 검색하세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
