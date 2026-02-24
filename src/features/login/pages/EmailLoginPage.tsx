import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'
import { login } from '../api'
import { User } from '@shared/types'

export default function EmailLoginPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isFormFilled = email.trim() !== '' && password.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormFilled || loading) return

    setLoading(true)
    setError('')

    try {
      const res = await login(email, password)
      const user: User = {
        _id: res._id,
        username: res.username,
        accountname: res.accountname,
        email: res.email,
        intro: res.intro,
        image: res.image,
        followerCount: 0,
        followingCount: 0,
      }
      authLogin(res.token, user)
      navigate(ROUTES.HOME, { replace: true })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '이메일 또는 비밀번호가 일치하지 않습니다.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="로그인" showBack />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 pt-10 gap-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">로그인</h2>

        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          underline
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          underline
        />

        {error && (
          <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!isFormFilled}
          loading={loading}
          className="mt-2"
        >
          로그인
        </Button>

        <p className="text-center text-sm text-gray-500">
          아직 계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={() => navigate(ROUTES.JOIN)}
            className="text-brand font-semibold"
          >
            회원가입
          </button>
        </p>
      </form>
    </div>
  )
}
