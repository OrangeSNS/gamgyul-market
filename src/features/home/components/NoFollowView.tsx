import React from 'react';

interface NoFollowViewProps {
  onSearchClick: () => void; // 버튼 눌렀을 때 실행할 함수
}

export default function NoFollowView({ onSearchClick }: NoFollowViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-white px-8">
      {/* 피그마의 감귤 캐릭터 아이콘 대신 임시 텍스트/이모지 */}
      <div className="w-24 h-24 mb-5 flex items-center justify-center text-6xl">
        🍊
      </div>
      <p className="text-sm text-[#767676] mb-5 text-center leading-relaxed">
        유저를 검색해 팔로우 해보세요!
      </p>
      <button 
        onClick={onSearchClick}
        className="bg-[#F26E22] text-white px-10 py-3 rounded-full font-medium hover:bg-[#d95d1d] transition-colors"
      >
        검색하기
      </button>
    </div>
  );
}