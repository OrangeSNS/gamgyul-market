import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES } from '@shared/constants'
import { validateEmail, validatePassword } from '@shared/utils'
import { checkEmail } from '@features/join/api'

export default function JoinEmailPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const isValid = !emailError && !passwordError && email !== '' && password !== '' && !isCheckingEmail

  const handleEmailBlur = async () => {
    const localErr = validateEmail(email)
    if (localErr) {
      setEmailError(localErr)
      return
    }
    setIsCheckingEmail(true)
    try {
      const res = await checkEmail(email)
      setEmailError(res.message.includes('이미') ? '이미 가입된 이메일입니다.' : '')
    } catch {
      setEmailError('이메일 확인에 실패했습니다.')
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password))
  }

  const handleNext = () => {
    if (isCheckingEmail) return
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPasswordError(pErr)
    if (eErr || pErr) return

    navigate(ROUTES.JOIN_PROFILE, {
      state: { email, password },
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="" showBack />

      <div className="flex flex-col flex-1 px-6 pt-10 ">
        <h2 className="text-[24px] font-medium leading-[100%] text-center text-[#000000] mb-[40px]">
          이메일로 회원가입
        </h2>

        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
          onBlur={handleEmailBlur}
          error={emailError}
          autoComplete="email"
          underline
        />
      <div className="mt-4">
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요(6자 이상)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
          }}
          onBlur={handlePasswordBlur}
          error={passwordError}
          autoComplete="new-password"
          underline
        />
      </div>
        <Button
          fullWidth
          size="lg"
          disabled={!isValid}
          onClick={handleNext}
          className="mt-[30px]"
        >
          다음
        </Button>
      </div>
    </div>
  )
}
