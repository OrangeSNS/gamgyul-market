import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'
import { User } from '@shared/types'
import { validateEmail } from '@shared/utils'
import { login } from '../api'
import { ApiError } from '@shared/api/client'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePageTitle } from '@shared/hooks/usePageTitle'

export default function EmailLoginPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  usePageTitle('이메일 로그인')

  const [email, setEmail] = useState('')        
  const [password, setPassword] = useState('')  
  const [emailError, setEmailError] = useState('')
  const [loginError, setLoginError] = useState('')   
  const [loading, setLoading] = useState(false)  

  const isFormFilled = email.trim() !== '' && password.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormFilled || loading) return

    const emailErr = validateEmail(email)
    if (emailErr) {
      setEmailError(emailErr)
      return
    }

    setEmailError('')
    setLoginError('')
    setLoading(true)

    try {
      const res = await login(email, password)

      const user: User = {
        _id: res._id ?? '',
        username: res.username ?? '',
        accountname: res.accountname ?? '',
        email: res.email,
        intro: res.intro ?? '',
        image: res.image ?? '',
        followerCount: 0,
        followingCount: 0,
      }

      authLogin(res.token ?? '', user)

      navigate(ROUTES.HOME, { replace: true })

    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422 || err.status === 401) {
          setLoginError(err.message)
        } else {
          toast.error(err.message)
        }
      } else {
        toast.error('네트워크 연결을 확인해주세요')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar title="" showBack />
      <ToastContainer
        position="top-center"
        autoClose={3000}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 px-6 pt-10"
        noValidate
      >
        <h1 className="text-[24px] font-medium text-[#000000] text-center mb-[40px]">
          로그인
        </h1>

        <div className="flex flex-col">
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

        {loginError && (
          <div className="mt-[6px]">
            <p className="text-[12px] text-[#EB5757]">
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
          className="mt-5 text-[12px] text-[#767676] text-center hover:underline"
        >
          이메일로 회원가입
        </button>
      </form>
    </div>
  )
}