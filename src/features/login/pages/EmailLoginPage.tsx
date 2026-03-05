import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES, API_BASE_URL } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'
import { User } from '@shared/types'

export default function EmailLoginPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('') // 이메일 형식 에러
  const [loginError, setLoginError] = useState('') // 계정 불일치 에러
  const [loading, setLoading] = useState(false)

  const isFormFilled = email.trim() !== '' && password.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() 
    if (!isFormFilled || loading) return

    // 1. 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('잘못된 이메일 형식입니다.')
      return
    }

    setLoading(true)
    setEmailError('')
    setLoginError('')

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } })
      })

      const res = await response.json()

      if (!response.ok || res.message) {
        // 계정 정보가 틀렸을 때 (이미지 2번: image_ce21d9.png)
        setLoginError(res.message || '이메일 또는 비밀번호가 일치하지 않습니다.')
        setLoading(false)
        return 
      }

      const userData = res.user || res; 
      const user: User = {
        _id: userData._id,
        username: userData.username,
        accountname: userData.accountname,
        email: userData.email,
        intro: userData.intro,
        image: userData.image,
        followerCount: 0,
        followingCount: 0,
      }
      
      authLogin(userData.token, user)
      navigate(ROUTES.HOME, { replace: true })

    } catch (err) {
      setLoginError('서버와 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar title="" showBack />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 pt-10" noValidate>
        <h2 className="text-[24px] font-medium leading-[100%] text-center text-[#000000] mb-[40px]">
  로그인
</h2>

        <div className="flex flex-col ">
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
            {/* [핵심] 이메일 입력창 바로 밑 에러 표시 */}
            {emailError && (
              <p className="text-[12px] leading-[14px] text-[#EB5757] mt-[6px]">*{emailError}</p>
            )}
          </div>
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

        {/* 로그인 결과(비번 틀림 등) 에러 표시 영역 */}
        {loginError && (
  <div className="mt-[6px]">
    <p className="text-[12px] leading-[14px] text-[#EB5757] text-left">
      *{loginError}
    </p>
  </div>
)}

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