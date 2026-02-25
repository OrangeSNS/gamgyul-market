# 감귤마켓 🍊

> 제주 감귤 농장 직거래 SNS 플랫폼 — React + TypeScript + TailwindCSS + Vite

## 배포 링크

<!-- TODO: 배포 후 Netlify URL 입력 -->
https://gamgyul-market.netlify.app

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 환경변수

`.env.example`을 복사하여 `.env` 파일을 생성하세요.

```env
VITE_API_BASE_URL=https://dev.wenivops.co.kr/services/mandarin
```

---

## 폴더 구조

```
src/
  app/
    layouts/       # AppLayout, TopBar, ProtectedRoute
    providers/     # AuthProvider (Context + localStorage)
    router/        # react-router-dom v6 라우터
    styles/        # Tailwind base CSS
  features/
    login/         # 로그인 메인, 이메일 로그인
    join/          # 이메일 회원가입, 프로필 설정
    home/          # 홈 피드
    profile/       # 프로필, 팔로워/팔로잉, 프로필 수정
    product/       # 상품 등록/수정
    upload/        # 게시글 작성
    post/          # 게시글 상세, 댓글
    search/        # 사용자 검색
    chat/          # 채팅 (마크업)
  shared/
    api/           # fetch 기반 API 클라이언트
    components/    # Button/Input/Modal/BottomSheet/TabBar 등
    constants/     # 라우트, 정규식, 스토리지 키
    hooks/         # useDebounce
    types/         # User/Post/Comment/Product 타입
    utils/         # formatPrice, validateEmail 등
  pages/
    SplashPage     # 스플래시
    NotFoundPage   # 404
```

---

## 구현 범위

### ✅ 필수 구현

- Splash, 로그인/회원가입, 프로필 설정
- 홈 피드 (팔로우 게시글, 빈 화면)
- 사용자 프로필 (팔로우 토글, 목록형/앨범형)
- 게시글 작성/상세/댓글
- 상품 등록/수정/삭제
- 바텀시트 + 확인 모달
- 하단 탭바, 404 페이지, 보호 라우트

### ⚠️ 마크업만 (서버 기능 없음)

- 채팅 목록/채팅방 (목업 데이터)
- SNS 로그인 버튼 (UI만)

---

## 기술 스택

- React 18 + TypeScript 5 + TailwindCSS 3 + Vite 5
- react-router-dom v6
- Fetch API 기반 커스텀 API 클라이언트
- Netlify 배포
