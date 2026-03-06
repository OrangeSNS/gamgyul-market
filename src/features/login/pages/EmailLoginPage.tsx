import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'
import { User } from '@shared/types'
import { login } from '../api'
import { ApiError } from '@shared/api/client'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * EmailLoginPage
 *
 * 기능:
 * - 이메일과 비밀번호 입력 폼 제공
 * - 로그인 API 호출
 * - 로그인 성공 시 홈 화면으로 이동
 * - 로그인 실패 시 폼 하단 빨간 텍스트 표시
 * - 네트워크/기타 오류 시 Toast 알림
 *
 * 상태 변수:
 * - email: 이메일 입력값
 * - password: 비밀번호 입력값
 * - emailError: 이메일 형식 오류 메시지
 * - loginError: 로그인 실패 메시지
 * - loading: API 호출 중 상태 (버튼 disable 및 로딩 표시용)
 */
export default function EmailLoginPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  // ─── 상태 변수 ──────────────────────────────
  const [email, setEmail] = useState('')         // 이메일 입력값
  const [password, setPassword] = useState('')   // 비밀번호 입력값
  const [emailError, setEmailError] = useState('')   // 이메일 형식 오류 메시지
  const [loginError, setLoginError] = useState('')   // 로그인 실패 메시지
  const [loading, setLoading] = useState(false)      // API 호출 진행 중 상태

  // 폼에 모든 값이 채워졌는지 체크
  const isFormFilled = email.trim() !== '' && password.trim() !== ''

  // ─── 로그인 처리 함수 ──────────────────────────────
  /**
   * handleSubmit
   *
   * 목적:
   * - 로그인 버튼 클릭 시 호출
   * - 이메일 형식 검증
   * - API 호출
   * - 성공 시 authLogin 저장 및 홈 화면 이동
   * - 실패 시 폼 에러 또는 Toast 표시
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormFilled || loading) return

    // ─── 이메일 형식 검증 ──────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('잘못된 이메일 형식입니다.')
      return
    }

    setEmailError('')
    setLoginError('')
    setLoading(true)

    try {
      // ─── API 호출: 로그인 ──────────────────────────────
      const res = await login(email, password)

      // ─── User 객체 생성 (타입 안전성 확보) ───────────────
      const user: User = {
        _id: res._id!,
        username: res.username!,
        accountname: res.accountname!,
        email: res.email,
        intro: res.intro!,
        image: res.image!,
        followerCount: 0,
        followingCount: 0,
      }

      // ─── 로그인 상태 저장 ──────────────────────────────
      authLogin(res.token!, user)

      // ─── 홈 화면 이동 ──────────────────────────────
      navigate(ROUTES.HOME, { replace: true })

    } catch (err) {
      // ─── 에러 처리 ──────────────────────────────
      if (err instanceof ApiError) {
        // 로그인 실패 시 폼 하단 빨간 텍스트 표시
        if (err.status === 422 || err.status === 401) {
          setLoginError(err.message)
        } else {
          // 기타 API 오류: Toast 표시
          toast.error(err.message)
        }
      } else {
        // 네트워크 오류
        toast.error('네트워크 연결을 확인해주세요')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 바 */}
      <TopBar title="" showBack />

      {/* ToastContainer: 네트워크/기타 오류 알림 */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 px-6 pt-10"
        noValidate
      >
        <h2 className="text-[24px] font-medium text-[#000000] text-center mb-[40px]">
          로그인
        </h2>

        <div className="flex flex-col">
          {/* 이메일 입력 */}
          <div>
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
                if (loginError) setLoginError('')
              }}
              underline
            />
            {emailError && (
              <p className="text-[12px] text-[#EB5757] mt-[6px]">
                *{emailError}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="mt-4">
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (loginError) setLoginError('')
              }}
              underline
            />
          </div>
        </div>

        {/* 로그인 실패 메시지 */}
        {loginError && (
          <div className="mt-[6px]">
            <p className="text-[12px] text-[#EB5757]">
              *{loginError}
            </p>
          </div>
        )}

        {/* 로그인 버튼 */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!isFormFilled || loading || !!emailError || !!loginError}
          loading={loading}
          className="mt-[30px] text-sm"
        >
          {loading ? '처리 중...' : '로그인'}
        </Button>

        {/* 회원가입 버튼 */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.JOIN)}
          className="mt-5 text-[12px] text-[#767676] text-center hover:underline"
        >
          이메일로 회원가입
        </button>
      </form>
    </div>
  )
}