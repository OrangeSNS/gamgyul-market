import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard'; // 우리가 만든 것
import NoFollowView from '../components/NoFollowView'; // 우리가 만든 것
import { getFeed } from '../api';
import { Post } from '@shared/types';

export default function HomeFeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = useCallback(async () => {
    try {
      const data = await getFeed();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("피드 로드 실패", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  if (loading) return <div className="p-10 text-center">감귤 로딩 중... 🍊</div>;

  return (
    <div className="min-h-screen bg-white max-w-[390px] mx-auto shadow-lg">
      <header className="sticky top-0 bg-white z-10 flex justify-between items-center px-4 h-12 border-b">
        <h1 className="text-lg font-bold">감귤마켓 피드</h1>
        {/* 팀원이 정한 검색 경로로 이동 */}
        <button onClick={() => navigate('/search')} className="p-1 text-xl">🔍</button>
      </header>

      <main className="pb-16">
        {posts.length > 0 ? (
          <div className="flex flex-col divide-y">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          /* 게시글이 없을 때 우리가 만든 빈 화면을 보여줍니다. */
          <NoFollowView onSearchClick={() => navigate('/search')} />
        )}
      </main>
    </div>
  );
}