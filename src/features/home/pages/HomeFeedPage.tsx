import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '@shared/components/PostCard';
import NoFollowView from '../components/NoFollowView';
import Spinner from '@shared/components/Spinner';
import { getFeed } from '../api';
import { Post } from '@shared/types';
import { useAuth } from '@app/providers/AuthProvider'
import { TOPBAR_HEIGHT } from '@shared/constants';
import { usePageTitle } from '@shared/hooks/usePageTitle';

export default function HomeFeedPage() {
  const navigate = useNavigate();
  const { user: me } = useAuth();
  usePageTitle('홈');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true); 
  const observerTarget = useRef<HTMLDivElement>(null); 

 const loadFeed = useCallback(async (isInitial = false) => {
    if (!hasMore && !isInitial) return;
    
    if (isInitial) setLoading(true);
    else setIsFetching(true);

    try {

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

  useEffect(() => {
    loadFeed(true);
  }, []);

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

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-white">
      <header className={`sticky top-0 bg-white z-10 flex justify-between items-center px-4 ${TOPBAR_HEIGHT} border-b border-gray-200`}>
        <h1 className="text-lg font-bold">감귤마켓 피드</h1>
        <button onClick={() => navigate('/search')} className="p-1 text-xl">
          <img src="/icons/icon-search.svg" alt="검색" className="w-6 h-6" />
        </button>
      </header>

      <div className="pb-16">
        {posts.length > 0 ? (
          <div className="flex flex-col">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            
              <div ref={observerTarget} className="h-20 w-full flex justify-center items-center">
              {isFetching && <span className="text-xs text-gray-400">감귤을 더 따오는 중... 🍊</span>}
              {!hasMore && <span className="text-xs text-gray-400">모든 감귤을 다 가져왔어요!</span>}
            </div>
          </div>
        ) : (
          <NoFollowView onSearchClick={() => navigate('/search')} />
        )}
      </div>
    </div>
  );
}
