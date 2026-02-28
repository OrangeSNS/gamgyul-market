import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '@shared/components/PostCard';
import NoFollowView from '../components/NoFollowView';
import { getFeed } from '../api';
import { Post } from '@shared/types';
import { useAuth } from '@app/providers/AuthProvider'
import { TOPBAR_HEIGHT } from '@shared/constants';

export default function HomeFeedPage() {
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true); 
  const observerTarget = useRef<HTMLDivElement>(null); 

 const loadFeed = useCallback(async (isInitial = false) => {
    if (!hasMore && !isInitial) return;
    
    // 로딩 상태 구분
    if (isInitial) setLoading(true);
    else setIsFetching(true);

    try {
      // ⚠️ 주의: api 파일의 getFeed가 (limit, skip)을 받도록 수정되어 있어야 합니다!
      const data = await getFeed(10, isInitial ? 0 : skip);
      const newPosts = data.posts || [];

      if (newPosts.length < 10) {
        setHasMore(false);
      }

      if (isInitial) {
        setPosts(newPosts);
        setSkip(newPosts.length);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setSkip((prev) => prev + newPosts.length);
      }
    } catch (err) {
      console.error("피드 로드 실패", err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [skip, hasMore]);

  // 2. 초기 로드 (딱 한 번만 실행)
  useEffect(() => {
    loadFeed(true);
  }, []);

  // 3. 무한 스크롤 감시 (Intersection Observer)
  useEffect(() => {
    if (loading || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadFeed();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadFeed, hasMore, loading, isFetching]);

  // 첫 로딩 화면
  if (loading) return <div className="p-10 text-center">감귤 로딩 중... 🍊</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className={`sticky top-0 bg-white z-10 flex justify-between items-center px-4 ${TOPBAR_HEIGHT} border-b border-gray-200`}>
        <h1 className="text-lg font-bold">감귤마켓 피드</h1>
        <button onClick={() => navigate('/search')} className="p-1 text-xl">
          <img src="/icons/icon-search.svg" alt="검색" className="w-6 h-6" />
        </button>
      </header>

      <main className="pb-16">
        {posts.length > 0 ? (
          <div className="flex flex-col">
            {posts.map((post: any, index: number) => (
              <PostCard key={`${post.id}-${index}`} post={post} />
            ))}
            
            {/* 감시 표지판 */}
            <div ref={observerTarget} className="h-20 w-full flex justify-center items-center">
              {isFetching && <span className="text-xs text-gray-400">감귤을 더 따오는 중... 🍊</span>}
              {!hasMore && <span className="text-xs text-gray-400">모든 감귤을 다 가져왔어요!</span>}
            </div>
          </div>
        ) : (
          <NoFollowView onSearchClick={() => navigate('/search')} />
        )}
      </main>
    </div>
  );
}
