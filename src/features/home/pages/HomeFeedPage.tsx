import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PostCard from '@shared/components/PostCard'
import Spinner from '@shared/components/Spinner'
import Button from '@shared/components/Button'
import { Post } from '@shared/types'
import { ROUTES } from '@shared/constants'
import { getFeed } from '../api'

export default function HomeFeedPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')

  const loadFeed = useCallback(async (skip = 0) => {
    try {
      const { posts: newPosts } = await getFeed(10, skip)
      if (skip === 0) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }
      setHasMore(newPosts.length === 10)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '피드를 불러오지 못했습니다.'
      setError(msg)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    loadFeed(0).finally(() => setLoading(false))
  }, [loadFeed])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    await loadFeed(posts.length)
    setLoadingMore(false)
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900">감귤마켓 피드</h1>
        <button
          onClick={() => navigate(ROUTES.SEARCH)}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="검색"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </header>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={() => { setLoading(true); loadFeed(0).finally(() => setLoading(false)) }} size="sm">
            다시 시도
          </Button>
        </div>
      ) : posts.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            아직 팔로우한 유저가 없거나<br />게시글이 없습니다.
          </p>
          <Button onClick={() => navigate(ROUTES.SEARCH)}>
            검색하기
          </Button>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}

          {hasMore && (
            <div className="flex justify-center py-4">
              {loadingMore ? (
                <Spinner size="sm" />
              ) : (
                <button
                  onClick={handleLoadMore}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  더 보기
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
