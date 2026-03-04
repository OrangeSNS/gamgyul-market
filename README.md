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

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firebase 설정 방법, Netlify 환경변수 등록, 보안 규칙은 GitHub Wiki를 참고하세요. 

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
    chat/          # 채팅 (Firebase 실시간 채팅)
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

###  필수 구현

- Splash, 로그인/회원가입, 프로필 설정
- 홈 피드 (팔로우 게시글, 빈 화면)
- 사용자 프로필 (팔로우 토글, 목록형/앨범형)
- 게시글 작성/상세/댓글
- 상품 등록/수정/삭제
- 바텀시트 + 확인 모달
- 하단 탭바, 404 페이지, 보호 라우트

###  마크업만 (서버 기능 없음)

- SNS 로그인 버튼 (UI만)

---

## 기술 스택

- React 18 + TypeScript 5 + TailwindCSS 3 + Vite 5
- react-router-dom v6
- Fetch API 기반 커스텀 API 클라이언트
- Firebase Firestore + Anonymous Auth (1:1 실시간 채팅)
- Netlify 배포

## 기술적 선택 이유

### 실시간 채팅: Firebase Firestore

기존 백엔드 API는 실시간 통신을 지원하지 않아 별도 인프라가 필요했다.
WebSocket 직접 구현은 별도 서버가 필요하고, Supabase는 레퍼런스가 부족했다.
Firebase Firestore는 `onSnapshot`으로 서버 없이 실시간 구독이 가능하고,
기존 REST API를 건드리지 않고 독립적으로 추가할 수 있어 선택했다.

### 인증: Firebase Anonymous Auth

Firebase Rules 적용을 위해 Firebase 자체 인증이 필요했다.
MVP 단계에서 기존 gamgyul 서버와 Firebase를 연동하는 Custom Token 방식은 서버 작업이 수반되어,
구현 복잡도를 낮추고 기능 검증을 우선하기 위해 Anonymous Auth를 채택했다.
운영 전환 시 Custom Token 방식으로 교체할 수 있도록 `auth.ts` 한 곳에 분리해두었다.

자세한 내용은 GitHub Wiki를 참고하세요. 

---

## WBS 추진일정

> **기간**: 2026.02.25 (수) ~ 2026.03.07 (토) · 총 11일
> **근무일**: 월~토 / 일요일 휴무 / 공휴일 제외
> **휴무**: 3/1 일요일, 3/2 삼일절 대체공휴일

### 간트 차트

```
          2/25  2/26  2/27  2/28   3/1   3/2   3/3   3/4   3/5   3/6   3/7
         [수]  [목]  [금]  [토]  [일]  [월]  [화]  [수]  [목]  [금]  [토]

Phase 1  ████  ████
Phase 2              ████  ████  ░░░░  ░░░░  ████
Phase 3                                      ████  ████  ████
Phase 4                                                        ████  ████  ████

░ = 3/1 일요일 휴무 / 3/2 삼일절 대체공휴일
```

---

### Phase 1. 기반 정비 `2/25 (수) ~ 2/26 (목)`

| No. | 작업 항목 | 세부 내용 | 기간 |
|-----|-----------|-----------|:----:|
| 1.1 | 프로젝트 구조 설계 확정 | Feature-based 구조 최종 확인, 폴더 규칙 정리, import alias 통일 | 2/25 |
| 1.2 | 협업 환경 구축 | 브랜치 전략 재확인, PR 템플릿, 코드 리뷰 기준 문서화 | 2/25 |
| 1.3 | 현황 이슈 목록화 | `home/api/index.ts` 코드 혼재, `getTestToken()` 방치, `BASE_URL` 하드코딩 등 이슈 정리 | 2/26 |
| 1.4 | 공용 컴포넌트 분기 점검 | `shared/components` vs `features/*/components` 역할 분리 기준 정립, 중복 컴포넌트(`PostCard`) 통합 여부 결정 | 2/26 |

---

### Phase 2. 퍼블리싱 & API 연동 `2/27 (금) ~ 3/3 (화)`

> 3/1 (일) 일요일 휴무, 3/2 (월) 삼일절 대체공휴일 제외

| No. | 작업 항목 | 세부 내용 | 기간 |
|-----|-----------|-----------|:----:|
| 2.1 | 미완성 페이지 퍼블리싱 | 채팅 목록/채팅방 UI 완성, 빈 상태(Empty State) UI 추가, 스켈레톤/로딩 UI 개선 | 2/27 ~ 2/28 |
| 2.2 | Toast/알림 시스템 구축 | `console.error` 대신 사용자에게 보이는 Toast 컴포넌트 추가 (에러/성공 피드백) | 2/27 |
| 2.3 | API 연동 완성 | Mock 데이터인 채팅 API 연동 검토, 미연동 엔드포인트 확인 및 연결 | 2/28 ~ 3/3 |
| 2.4 | 이미지 업로드 개선 | `URL.createObjectURL` 메모리 누수 수정 (cleanup 추가), 업로드 실패 피드백 추가 | 2/28 |

---

### Phase 3. QA 및 안정화 `3/3 (화) ~ 3/5 (목)`

| No. | 작업 항목 | 세부 내용 | 기간 |
|-----|-----------|-----------|:----:|
| 3.1 | UX/UI 개선 | 폼 유효성 메시지 개선, 빈 피드 안내 화면, 프로필 이미지 fallback 처리 검토 | 3/3 ~ 3/4 |
| 3.2 | 에러 핸들링 강화 | API 실패 시 사용자 피드백 일관성 확보, 401 만료 흐름 점검, 네트워크 에러 처리 | 3/4 |
| 3.3 | 코드 리팩토링 | `home/api/index.ts` 정리, `getTestToken()` 제거, `BASE_URL` constants 통일, 미사용 코드 정리 | 3/4 ~ 3/5 |
| 3.4 | 타입 안정성 점검 | TypeScript `any` 사용 부분 타입 구체화, `shared/types/index.ts` 누락 타입 추가 | 3/5 |

---

### Phase 4. 흐름점검 & 배포 `3/6 (금) ~ 3/7 (토)`

| No. | 작업 항목 | 세부 내용 | 기간 |
|-----|-----------|-----------|:----:|
| 4.1 | 페이지 흐름 점검 | 로그인 → 회원가입 → 홈 → 프로필 → 게시물 전체 플로우 수동 QA, 라우트 가드 동작 확인 | 3/6 |
| 4.2 | 빌드 확인 | `vite build` TypeScript 에러 0건 확인, 번들 크기 점검, 환경변수 분리 | 3/6 |
| 4.3 | Netlify 배포 | `netlify.toml` 설정, SPA 리다이렉트 (`_redirects` 파일), 환경변수 등록, 도메인 연결 | 3/7 |
| 4.4 | 최종 QA 및 마무리 | 배포 환경에서 전체 기능 검증, 치명적 버그 핫픽스, 릴리즈 태그 | 3/7 |
