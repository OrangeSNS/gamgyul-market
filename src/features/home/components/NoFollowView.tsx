interface NoFollowViewProps {
  onSearchClick: () => void; 
}

export default function NoFollowView({ onSearchClick }: NoFollowViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-white px-8">
        <img src='/icons/symbol-logo.svg' alt="감귤마켓 로고" className="w-[100px] h-[100px] mb-[20px] block" />
      <p className="text-14px leading-[14px] text-[#767676] mb-5 text-center leading-relaxed">
        유저를 검색해 팔로우 해보세요!
      </p>
      <button 
        onClick={onSearchClick}
        className="w-[120px] h-[44px] bg-[#F26E22] text-white rounded-[44px] text-[14px] font-medium hover:bg-[#d95d1d] transition-colors flex items-center justify-center whitespace-nowrap"
      >
        검색하기
      </button>
    </div>
  );
}