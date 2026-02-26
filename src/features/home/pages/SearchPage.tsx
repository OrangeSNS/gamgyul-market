import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getTestToken, searchUser } from '../api';

export default function SearchPage({ onBack }: { onBack: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTestToken().then(fetchedToken => {
      setToken(fetchedToken);
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (keyword && token) {
        const data = await searchUser(keyword, token);
        if (Array.isArray(data)) {
          setResults(data);
        }
      } else {
        setResults([]);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [keyword, token]);

  // ✨ 텍스트 하이라이트 함수: 검색어와 일치하는 부분을 주황색(<span className="text-[#F26E22]">)으로 바꿉니다.
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-[#F26E22]">{part}</span>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-white max-w-[390px] mx-auto">
      {/* 1. 상단 헤더: 뒤로가기 화살표와 검색창이 나란히 배치 */}
      <header className="flex items-center gap-2 p-3 border-b sticky top-0 bg-white z-20">
        <button onClick={onBack} className="p-1 focus:outline-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input 
          type="text" 
          placeholder="계정 검색"
          className="flex-1 bg-[#F2F2F2] px-4 py-2 rounded-full text-sm outline-none placeholder:text-[#C4C4C4]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoFocus
        />
      </header>

      {/* 2. 검색 결과 리스트 */}
      <main className="p-4 flex flex-col gap-4">
        {results.map((user: any) => (
          <div key={user._id}
          onClick={() => navigate(`/profile/${user.accountname}`)}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {/* 프로필 이미지 처리: 기본 이미지 또는 서버 이미지 */}
            <img 
              src={user.image.startsWith('http') ? user.image : `https://dev.wenivops.co.kr/services/mandarin/${user.image}`} 
              alt="" 
              className="w-[50px] h-[50px] rounded-full object-cover bg-gray-100"
              onError={(e) => { 
             (e.target as HTMLImageElement).src = "https://dev.wenivops.co.kr/services/mandarin/1687141187512.png"; 
             }}
            />
            
            <div className="flex flex-col gap-0.5">
              <strong className="text-sm font-medium text-black">
                {highlightText(user.username, keyword)}
              </strong>
              <span className="text-xs text-[#767676]">
                @ {highlightText(user.accountname, keyword)}
              </span>
            </div>
          </div>
        ))}
        
        {keyword && results.length === 0 && (
          <p className="text-center text-sm text-[#767676] mt-10">검색 결과가 없습니다. 🍊</p>
        )}
      </main>
    </div>
  );
}