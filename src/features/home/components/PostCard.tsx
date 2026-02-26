import React from 'react';

// post 객체 하나를 통째로 받도록 구조를 변경합니다.
export default function PostCard({ post }: { post: any }) {
  // 데이터가 없을 경우를 대비해 안전장치(?. )를 추가합니다.
  const author = post?.author;
  const content = post?.content;
  const image = post?.image;

  // 서버 주소 접두사
  const IMG_URL = "https://dev.wenivops.co.kr/services/mandarin/";

  return (
    <article className="max-w-[390px] mx-auto p-4 flex gap-3">
      <img 
        src={author?.image?.startsWith('http') ? author.image : `${IMG_URL}${author?.image}`} 
        alt="" 
        className="w-[42px] h-[42px] rounded-full object-cover bg-gray-100"
        onError={(e) => { (e.target as HTMLImageElement).src = `${IMG_URL}1687141187512.png` }}
      />

      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col mt-1">
          <strong className="text-sm font-medium text-black">{author?.username}</strong>
          <span className="text-xs text-[#767676]">@ {author?.accountname}</span>
        </div>

        <p className="text-sm text-[#333333] leading-[18px] whitespace-pre-wrap">{content}</p>

        {image && (
          <div className="rounded-[10px] overflow-hidden border border-[#DBDBDB]">
            <img 
              src={image.startsWith('http') ? image : `${IMG_URL}${image}`} 
              alt="" 
              className="w-full h-auto object-cover" 
            />
          </div>
        )}

        <div className="flex gap-4 items-center mt-1">
          <span className="text-xs text-[#767676]">❤️ {post?.heartCount || 0}</span>
          <span className="text-xs text-[#767676]">💬 {post?.commentCount || 0}</span>
        </div>
      </div>
    </article>
  );
}