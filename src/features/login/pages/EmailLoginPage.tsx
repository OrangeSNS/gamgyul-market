import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES } from '@shared/constants'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@app/providers/AuthProvider'
import { User } from '@shared/types'
import { login } from '../api'

export default function EmailLoginPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  // 1. 입력 상태
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 2. 건드림(Touched) 상태: 사용자가 입력창을 클릭했다가 나갔는지 추적
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  // 3. 서버 응답 에러 상태
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ 버튼 활성화 조건: 이메일과 비밀번호가 모두 입력되었을 때만 (피그마 준수)
  const isButtonActive = email.trim().length > 0 && password.trim().length > 0 && !loading

  // --- 에러 메시지 계산 로직 ---

  // 이메일 형식 체크
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // 통합 에러가 노출되어야 하는 상황인지 판단 (둘 다 건드렸는데 둘 다 비어있을 때)
  const isBothEmptyError = emailTouched && passwordTouched && !email.trim() && !password.trim()

  // 개별 필드 에러 메시지: 통합 에러 상황이 아닐 때만 노출하여 중복 방지
  const emailFieldError = !isBothEmptyError && emailTouched && !email.trim() 
    ? '이메일을 입력해주세요' 
    : (!isBothEmptyError && emailTouched && email.trim() && !isEmailValid) 
    ? '잘못된 이메일 형식입니다.' 
    : ''

  const passwordFieldError = !isBothEmptyError && passwordTouched && !password.trim() 
    ? '비밀번호를 입력해주세요' 
    : ''

  // 최종적으로 버튼 위에 보여줄 통합 메시지
  const totalErrorMessage = isBothEmptyError 
    ? '이메일 또는 비밀번호를 입력해주세요' 
    : loginError;

  // -----------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isButtonActive) return

    setLoading(true)
    setLoginError('')

    try {
      const res = await login(email, password)

      const user: User = {
        _id: res._id!,
        username: res.username!,
        accountname: res.accountname!,
        email: res.email!,
        intro: res.intro || '',
        image: res.image || '',
        followerCount: 0,
        followingCount: 0,
      }

      authLogin(res.token!, user)
      navigate(ROUTES.HOME, { replace: true })
    } catch (err: any) {
      // API 명세의 실패 메시지 표시 (422 에러 등)
      if (err.response?.data?.message) {
        setLoginError(err.response.data.message)
      } else {
        setLoginError('이메일 또는 비밀번호가 일치하지 않습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar title="" showBack />
      <ToastContainer position="top-center" autoClose={3000} />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 pt-10" noValidate>
        <h2 className="text-[24px] font-medium leading-[100%] text-center text-[#000000] mb-[40px]">
          로그인
        </h2>

        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (loginError) setLoginError('')
          }}
          onBlur={() => setEmailTouched(true)}
          error={emailFieldError}
          underline
        />

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
            onBlur={() => setPasswordTouched(true)}
            error={passwordFieldError}
            underline
          />
        </div>

        {/* ✅ 통합 에러 메시지 (이미지처럼 버튼 바로 위에 하나만 노출) */}
        {totalErrorMessage && (
          <p className="text-[12px] leading-[14px] text-[#EB5757] mt-[6px] text-left">
            *{totalErrorMessage}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!isButtonActive}
          loading={loading}
          className="mt-[30px] text-sm"
        >
          {loading ? '처리 중...' : '로그인'}
        </Button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.JOIN)}
          className="mt-5 text-sm text-[#767676] text-center hover:underline"
        >
          이메일로 회원가입
        </button>
      </form>
    </div>
  )
}