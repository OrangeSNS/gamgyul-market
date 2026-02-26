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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isFormFilled = email.trim() !== '' && password.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 브라우저 새로고침 방지
    
    if (!isFormFilled || loading) return

    setLoading(true)
    setError('') 

    try {
      // [해결 포인트] 공통 request를 쓰지 않고 직접 fetch를 사용합니다.
      // 이렇게 하면 client.ts에 있는 "401 에러 시 강제 이동" 로직을 피할 수 있습니다.
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email, password }
        })
      })

      const res = await response.json()

      // 서버가 실패 응답을 보냈거나(401, 422 등), message가 포함된 경우
      if (!response.ok || res.message) {
        setError(res.message || '이메일 또는 비밀번호가 일치하지 않습니다.')
        setLoading(false)
        return // ★ 여기서 return을 해야 아래 navigate가 실행되지 않습니다!
      }

      // 로그인 성공 시 데이터 처리 (명세서 SUCCESS 구조 반영)
      // 서버 응답 구조에 따라 res.user 또는 res를 선택합니다.
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
      navigate(ROUTES.HOME, { replace: true }) // 성공 시에만 홈으로 이동

    } catch (err) {
      // 네트워크 에러 등 예외 처리
      setError('서버와 연결할 수 없습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar title="로그인" showBack />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 pt-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">로그인</h2>

        <div className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            underline
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            underline
          />
        </div>

        {/* 에러 메시지 영역: 피그마 시안 스타일 반영 (#EB5757) */}
        <div className="h-6 mt-2">
          {error && (
            <p className="text-xs text-[#EB5757] text-left">*{error}</p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!isFormFilled}
          loading={loading}
          className="mt-4"
        >
          {loading ? '처리 중...' : '로그인'}
        </Button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.JOIN)}
          className="mt-5 text-xs text-gray-500 text-center hover:underline"
        >
          이메일로 회원가입
        </button>
      </form>
    </div>
  )
}