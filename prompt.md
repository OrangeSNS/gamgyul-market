당신은 “감귤마켓” 프론트엔드 팀의 리드 개발자다.
목표: React + TypeScript + TailwindCSS + Vite 로 감귤마켓 웹앱을 구현하고 Netlify에 배포 가능한 상태로 완성한다.
디자인: Figma 참고 (Password: weniv)
요구사항/API: Notion “2025-외부 공개용 감귤마켓 API 명세”를 기준으로 정확히 맞춰 구현한다.
- 링크: https://paullabworkspace.notion.site/2025-API-26cebf76ee8a8041b0b9d31b552acee1
중요: 채팅/검색/SNS로그인은 “마크업+스타일+일부 UI 상호작용만” 구현. 팔로우/좋아요도 “버튼 토글 UI만” 구현(서버 호출 X).

========================
1) 진행 방식 (Plan mode)
========================
1. 먼저 전체 작업을 ‘에픽/이슈’ 단위로 쪼개고, 각 이슈마다:
- 목표/완료 조건(DoD)
- 작업 파일 목록(예상)
- 커밋 메시지 규칙(Conventional Commits)과 커밋 단위
를 제시한다.
2. 그 다음 실제 코드를 생성/수정하며 이슈 순서대로 진행한다.
3. 각 단계 끝에 “다음 커밋에 들어갈 변경사항 요약 + 커밋 메시지 제안”을 출력한다.

========================
2) 필수 기능 범위(정확히 준수)
========================
[필수 구현]
- Splash: 잠시 후 로그인 여부에 따라 라우팅
  - 미로그인: 로그인 메인
  - 로그인: 홈 피드
- 로그인
  - 로그인 메인(이메일로 로그인 버튼, SNS 버튼은 UI만)
  - 이메일 로그인: 이메일/비번 입력 시 다음/로그인 버튼 활성화
  - 로그인 실패 시 경고 문구
  - 포커스 시 인풋 라인 컬러 변화(회색->주황)
- 회원가입
  - 이메일/비번: blur 시 유효성 검사 + 경고 문구
  - 유효성 통과 시 다음 버튼 활성화
  - 프로필 설정(이미지/사용자이름/계정ID/소개) + 계정ID 중복/형식 검사
- 홈 피드(팔로우한 유저의 게시글만)
  - 팔로우가 없거나 게시글이 없을 때 빈 화면 + “검색하기” 버튼 UI
- 사용자 프로필
  - 팔로우 버튼: 팔로우/언팔로우 UI 토글만
  - 팔로워/팔로잉 목록 화면(목록 UI + 팔로우/취소 UI 토글만)
  - 판매 상품 섹션: 등록 상품 없으면 숨김
  - 게시글 목록형/앨범형 토글 (이미지 없는 게시글은 앨범형에서 제외)
  - 내 프로필인 경우: “프로필 수정”, “상품 등록” 노출 + 상품 클릭 시 하단 메뉴(삭제/수정/웹사이트에서 보기)
- 내 프로필 수정
  - 유효성 통과 전까지 저장 비활성화
- 상품 등록/수정
  - 이미지/상품명(2~15)/가격(숫자->원 단위 표시)/판매 링크
  - 입력 완료 시 저장 활성화
- 게시글
  - 게시글 작성(텍스트/이미지 업로드)
    - 기본: 이미지는 1장만 업로드
    - (도전은 옵션) 최대 3장 업로드
  - 게시글 상세
  - 댓글 페이지(댓글 입력 시 게시 버튼 활성화)
  - 게시글/댓글/로그아웃/신고/삭제 등 “바텀시트 + 확인 모달” UI
- 하단 탭바: 홈/채팅/게시물작성/프로필 (현재 경로 활성 상태 반영)
- 404 페이지

[마크업만 구현(서버 기능 X)]
- 검색 페이지(사용자 검색 UI만)
- 채팅 목록/채팅방 UI만(전송 버튼 활성화 로직은 UI로 구현 가능)
- SNS 로그인은 버튼만

[UI 토글만(서버 기능 X)]
- 좋아요 버튼 토글(빈하트<->채운하트)
- 팔로우 버튼 토글

========================
3) 기술 스택/라이브러리 (필수/선택)
========================
필수: React, TypeScript, TailwindCSS, Vite
라우팅: react-router-dom v6
API 통신: fetch 기반 API client(필수) + (선택) TanStack Query 사용 가능
폼/검증: (선택) react-hook-form + zod 사용 가능. 단, 과하게 복잡하게 만들지 말 것.
상태: Auth(토큰/유저) 는 최소한으로(예: context + localStorage or zustand)
코딩 규칙:
- 컴포넌트/훅/서비스 분리
- 타입 안전(요청/응답 타입 정의)
- 에러/로딩 상태 공통 처리
- Tailwind는 공통 컴포넌트(Button/Input/Modal/BottomSheet/TabBar)로 재사용

========================
4) 라우트 설계(권장)
========================
- /splash
- /login
- /login/email
- /join
- /join/profile
- /home
- /search (마크업)
- /profile/:accountName
- /profile/:accountName/followers
- /profile/:accountName/following
- /profile/edit
- /product/new
- /product/:productId/edit
- /post/new
- /post/:postId
- /post/:postId/comments
- /chat (마크업)
- /chat/:chatId (마크업)
- /404 + catch-all redirect

보호 라우트:
- 로그인 필요: home 이후 대부분(프로필/작성/상품 등)
- 미로그인 접근 시 /login 으로

========================
5) API 구현 지침(반드시 Notion 명세 우선)
========================
- Notion API 명세를 먼저 읽고 baseURL, 엔드포인트, 바디 포맷, 헤더(Authorization), 이미지 업로드 방식(FormData 등)을 그대로 따른다.
- 아래 도메인 모델 타입을 만든다(명세 기반으로 정확히):
  User, Profile, Post, Comment, Product, AuthToken/Response, ErrorResponse 등
- API Client:
  - request<T>(path, options) 형태로 공통화
  - 401 처리: 토큰 제거 + 로그인 페이지로 유도
  - 에러 메시지 표준화
- 인증:
  - 로그인 성공 시 토큰을 localStorage 저장
  - 앱 시작 시 토큰 있으면 프로필/내정보 요청으로 세션 확인
- 게시글 CRUD:
  - 목록(홈), 상세, 작성, 수정, 삭제
- 댓글:
  - 목록, 작성 (수정/삭제는 명세에 있으면 구현)
- 상품 CRUD:
  - 내 상품 목록, 등록, 수정, 삭제

========================
6) UI 컴포넌트 (Tailwind 기반)
========================
공통 컴포넌트로 먼저 깔고 페이지에서 조합:
- <AppLayout />, <TopBar />, <TabBar />
- <Button />, <Input />, <Textarea />, <Avatar />
- <ModalConfirm />, <BottomSheetMenu />
- <Toast /> (선택)
- <PostCard />, <ProductCard />, <UserListItem />

디자인 기준:
- 모바일 우선(375px)
- 피그마 간격/폰트 크기 최대한 유사
- 인풋 focus 시 border/underline 컬러 변환

========================
7) Netlify 배포(필수)
========================
- 빌드: npm run build, 산출물: dist
- SPA 라우팅 대응:
  - netlify.toml 또는 public/_redirects 로 "/* /index.html 200" 설정
- 환경변수:
  - VITE_API_BASE_URL
  - (필요 시) VITE_AI_API_BASE_URL 등

========================
8) 레포 구조(권장)
========================
src/
  app/ (라우터, 프로바이더, 레이아웃)
  pages/
  features/
    auth/
    post/
    profile/
    product/
    chat/ (마크업)
    search/ (마크업)
  components/
  hooks/
  services/ (api client)
  types/
  utils/
  styles/

========================
9) 이슈/커밋 요구사항(필수)
========================
- GitHub Issues 형태로 최소 8~12개 에픽/이슈로 분리해서 제시
- 커밋은 Conventional Commits 사용:
  feat: , fix: , refactor: , chore: , docs:
- 각 이슈는 1~3개 커밋으로 끝내도록 쪼갠다.
- README에:
  - 실행 방법
  - 폴더 구조
  - 환경변수
  - 배포 링크(placeholder)
  - 구현 범위(필수/미구현 명시: 채팅/검색/SNS로그인/팔로우/좋아요는 실제 기능 제외)

========================
10) (옵션) AI 기능
========================
요구사항에 “AI 상품 설명 자동 생성”이 포함되어 있다.
- Notion에 별도 ChatGPT API 명세가 있다면 그것도 읽고 구현한다.
- UI:
  - 상품 등록 페이지: 이미지 업로드 시 “AI 상품 설명 생성” 버튼 활성
  - 기존 입력이 있으면 덮어쓰기 확인 모달
  - 로딩 상태(스피너/스켈레톤)
  - 다시 생성 버튼
- 명세가 불명확하면, 우선 UI/상태/추상화만 만들고 API 어댑터는 TODO로 남기되, README에 명확히 적어라.

========================
11) 지금 당장 할 일
========================
A. 먼저 Plan(에픽/이슈/커밋 계획)부터 출력
B. Vite+React+TS 프로젝트 스캐폴딩
C. Tailwind 세팅
D. 라우터/레이아웃/가드
E. Auth → Join → Home → Profile → Post/Product 순으로 기능 구현
F. Netlify 설정 파일 추가

========================
12) 파일 구조 / 협업 충돌 방지 규칙 (필수)
========================
목표: 5개 핵심 기능(로그인/회원가입/Home Feed/Upload/프로필)은 서로 파일을 건드리지 않고 병렬 개발 가능해야 한다.
따라서 기능별 폴더를 완전히 분리하고, 공통 코드는 shared에만 둔다.

[기능 폴더(서로 수정 금지 원칙)]
- src/features/login/        (로그인 전용: /login, /login/email)
- src/features/join/         (회원가입 전용: /join, /join/profile)
- src/features/home/         (Home Feed 전용: /home)
- src/features/upload/       (게시글 작성/수정 전용: /post/new, /post/:id/edit)
- src/features/profile/      (프로필 전용: /profile/*, /product/*, followers/following)

각 feature 폴더 내부는 아래 구조를 기본으로 한다:
- pages/        (라우트 단위 페이지 컴포넌트)
- components/   (해당 기능에서만 쓰는 UI)
- api/          (해당 기능의 API 함수만)
- hooks/        (해당 기능 전용 훅)
- types/        (해당 기능 전용 타입)
- utils/        (해당 기능 전용 유틸)
- index.ts      (barrel export)

[공통(shared) 폴더: 여기만 공통으로 사용]
- src/shared/api/        (apiClient, 토큰 주입, 공통 에러 처리)
- src/shared/components/ (Button/Input/Modal/BottomSheet/TabBar 등)
- src/shared/hooks/      (useDebounce, useOutsideClick 등 범용 훅)
- src/shared/types/      (User/Post/Product 공용 타입)
- src/shared/utils/      (formatPrice, validateEmail 등)
- src/shared/constants/  (routes, regex, storageKeys 등)

[앱(app) 폴더: 조립만 담당]
- src/app/router/        (react-router 라우팅 정의)
- src/app/layouts/       (AppLayout, TopBar, ProtectedRoute)
- src/app/providers/     (AuthProvider 등 전역 Provider)
- src/app/styles/        (tailwind base, global css)

[수정 금지/허용 규칙]
1) 어떤 기능을 개발할 때는 해당 feature 폴더 내부 파일만 수정한다.
2) 공통 컴포넌트/유틸이 필요하면:
   - 해당 feature 내부에 먼저 만들지 말고,
   - 재사용 가능하면 src/shared/* 로 올리고,
   - 이때 다른 feature 파일 수정은 금지한다.
3) 예외적으로 다른 feature 수정이 “불가피”하면:
   - 왜 필요한지 1)원인 2)대안 3)영향 범위를 먼저 설명하고,
   - 최소 변경만 하고,
   - 변경 파일 목록을 출력한다.

[권장 파일 트리 예시]
src/
  app/
    layouts/
    providers/
    router/
    styles/
  features/
    login/
      pages/
      components/
      api/
      hooks/
      types/
      utils/
      index.ts
    join/...
    home/...
    upload/...
    profile/...
  shared/
    api/
    components/
    hooks/
    types/
    utils/
    constants/
  assets/

[경로 별칭(충돌 줄이기)]
- @app/*, @features/*, @shared/*, @assets/*
(typescript + vite 설정으로 맞춘다)

이제 위 요구사항대로 작업을 시작하라.

