// src/shared/components/PostCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@shared/constants';
import ImageCarousel from '@shared/components/ImageCarousel'

interface PostCardProps {
  post: any;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post?.hearted || false);
  const [heartCount, setHeartCount] = useState(post?.heartCount || 0);

  const author = post?.author;
  // content 변수 선언 (기존 코드에서 누락된 부분 수정)
  const content = post?.content;

  // 2. 이미지 처리 및 필터링 로직
const imageList = post?.image 
    ? post.image.split(',')
        .map((img: string) => img.trim())
        .filter((img: string) => {
          if (!img) return false;
          if (img === "undefined" || img === "null") return false;
          // 주소 뒤에 아무 파일명도 붙어있지 않은 경우(기본 주소만 온 경우) 필터링
          if (img === API_BASE_URL || img === `${API_BASE_URL}/`) return false;
          return true;
        })
    : [];

  const getImageUrl = (img: string) => {
    if (!img) return `${API_BASE_URL}/1687141187512.png`;
    return img.startsWith('http') ? img : `${API_BASE_URL}/${img}`;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setHeartCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    // 전체 가로 358px, 클릭 시 상세페이지 이동
    <article 
      onClick={() => navigate(`/post/${post.id}`)}
      className="w-[358px] mx-auto py-4 flex gap-[12px] border-b border-[#DBDBDB] last:border-none cursor-pointer"
    >
      {/* 1. 프로필 이미지 (42x42) */}
      <img 
        onClick={(e) => {
          e.stopPropagation(); // 상세페이지 이동 방지
          navigate(`/profile/${author?.accountname}`);
        }}
        src={getImageUrl(author?.image)} 
        alt={`${author?.username}님의 프로필`} 
        className="w-[42px] h-[42px] rounded-full object-cover bg-gray-100 flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).src = getImageUrl('1687141187512.png') }}
      />

      <div className="w-[304px] flex flex-col">
        {/* 2. 유저 정보 및 더보기 버튼 */}
        <div className="flex justify-between items-start mb-[12px]">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${author?.accountname}`);
            }}
            className="flex flex-col"
          >
            <strong className="text-[14px] font-medium text-black leading-[18px]">
              {author?.username}
            </strong>
            <span className="text-[12px] text-[#767676] leading-[14px]">
              @ {author?.accountname}
            </span>
          </div>
          <button 
            onClick={(e) => e.stopPropagation()} 
            className="p-1"
          >
            <img src="/icons/icon-more-vertical.svg" alt="더보기" className="w-[24px] h-[24px]" />
          </button>
        </div>

        {/* 3. 게시글 본문 */}
        <p className="text-[14px] text-[#333333] mb-[16px] leading-[18px] whitespace-pre-wrap">
          {content}
        </p>

        {/* 4. 이미지 컨텐츠 (304x228 고정) */}
        {imageList.length > 0 && (
          <div className="w-[304px] h-[228px] rounded-[10px] overflow-hidden border border-[#DBDBDB] mb-[12px] relative bg-gray-50">
            <img 
              src={getImageUrl(imageList[0])} 
              alt="게시글 이미지" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // 로드 실패 시 해당 영역 숨김 처리 (최후의 보루)
                (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
              }}
            />
            {imageList.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">
                +{imageList.length - 1}
              </div>
            )}
          </div>
        )}

        {/* 5. 인터랙션 영역 (좋아요, 댓글) */}
        <div className="flex gap-[16px] items-center">
          <button onClick={handleLike} className="flex items-center gap-[6px]">
            <img 
              src={isLiked ? "/icons/icon-heart-fill.svg" : "/icons/icon-heart.svg"} 
              alt="좋아요" 
              className="w-[20px] h-[20px]" 
            />
            <span className={`text-[12px] ${isLiked ? 'text-[#EB5757]' : 'text-[#767676]'}`}>
              {heartCount}
            </span>
          </button>
          
          <div className="flex items-center gap-[6px]">
            <img src="/icons/icon-message-circle.svg" alt="댓글" className="w-[20px] h-[20px]" />
            <span className="text-[12px] text-[#767676]">{post?.commentCount || 0}</span>
          </div>
        </div>

        {/* 6. 날짜 표시 */}
        <time className="text-[10px] text-[#767676] mt-[16px]">
          {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric'
          }) : '2026년 2월 27일'}
        </time>
      </div>
    </article>
  );
}