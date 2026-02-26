import React, { useState } from 'react';

export default function PostCard({ post }: { post: any }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  
  // ❤️ 좋아요 상태 관리
  const [isLiked, setIsLiked] = useState(false);
  const [heartCount, setHeartCount] = useState(post?.heartCount || 0);

  const author = post?.author;
  const content = post?.content;
  const image = post?.image;
  const IMG_URL = "https://dev.wenivops.co.kr/services/mandarin/";

  // ❤️ 좋아요 클릭 핸들러
  const handleLike = () => {
    if (isLiked) {
      setHeartCount(heartCount - 1);
      setIsLiked(false);
    } else {
      setHeartCount(heartCount + 1);
      setIsLiked(true);
    }
    // 실제 서버 API 호출은 나중에 이 부분에 추가하면 됩니다!
  };

  return (
    <article className="w-[358px] mx-auto py-4 flex gap-[12px] relative border-b border-[#DBDBDB] last:border-none">
      
      {/* 1. 프로필 이미지 */}
      <img 
        src={author?.image?.startsWith('http') ? author.image : `${IMG_URL}${author?.image}`} 
        alt="" 
        className="w-[42px] h-[42px] rounded-full object-cover bg-gray-100 flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).src = `${IMG_URL}1687141187512.png` }}
      />

      <div className="w-[304px] flex flex-col">
        
        {/* 유저 정보 및 더보기 */}
        <div className="flex justify-between items-start mb-[12px]">
          <div className="flex flex-col">
            <strong className="text-[14px] font-medium text-black leading-[18px]">
              {author?.username}
            </strong>
            <span className="text-[12px] text-[#767676] leading-[14px]">
              @ {author?.accountname}
            </span>
          </div>
          <button className="p-0">
            <img src="/icons/icon-more-vertical.svg" alt="더보기" className="w-[24px] h-[24px]" />
          </button>
        </div>

        {/* 게시글 텍스트 */}
        <p className="text-[14px] text-[#333333] leading-[18px] whitespace-pre-wrap mb-[16px]">
          {content}
        </p>

        {/* ✨ 2. 이미지 조건부 렌더링: 데이터가 있을 때만 렌더링합니다. */}
        {image && image !== "" && image !== "undefined" && (
          <div className="w-[304px] h-[228px] rounded-[10px] overflow-hidden border border-[#DBDBDB] mb-[12px] flex-shrink-0">
            <img 
              src={image.startsWith('http') ? image : `${IMG_URL}${image}`} 
              alt="게시글 이미지" 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* 3. 인터랙션 버튼 (좋아요, 댓글) */}
        <div className="flex gap-[16px] items-center">
          {/* ❤️ 좋아요 버튼: 상태에 따라 아이콘과 숫자 변경 */}
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
          
          <button 
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            className="flex items-center gap-[6px]"
          >
            <img src="/icons/icon-message-circle.svg" alt="댓글" className="w-[20px] h-[20px]" />
            <span className="text-[12px] text-[#767676]">{post?.commentCount || 0}</span>
          </button>
        </div>

        {/* 댓글 영역 */}
        {isCommentOpen && (
          <div className="mt-[16px] pt-[16px] border-t border-[#F2F2F2] flex flex-col gap-[12px]">
            <div className="text-[12px] text-[#333333]">
              <span className="font-bold mr-2">방문자</span>
              <span>정말 멋진 게시글이네요! 🍊</span>
            </div>
          </div>
        )}
        
        <time className="text-[10px] text-[#767676] mt-[16px]">
          {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : '2026.02.26'}
        </time>
      </div>
    </article>
  );
}