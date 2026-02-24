import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'
import { validateUsername, validateAccountName } from '@shared/utils'
import { checkAccountName, signup } from '../api'
import { uploadImage } from '@shared/api/client'
import { User } from '@shared/types'
import { login } from '@features/login/api'

const DEFAULT_AVATAR = 'https://dev.wenivops.co.kr/services/mandarin/Ellipse.png'

export default function JoinProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()

  const { email = '', password = '' } = (location.state as { email: string; password: string }) ?? {}

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_AVATAR)
  const [username, setUsername] = useState('')
  const [accountname, setAccountname] = useState('')
  const [intro, setIntro] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [accountnameError, setAccountnameError] = useState('')
  const [loading, setLoading] = useState(false)

  const isValid =
    username !== '' &&
    accountname !== '' &&
    !usernameError &&
    !accountnameError

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleUsernameBlur = () => {
    setUsernameError(validateUsername(username))
  }

  const handleAccountnameBlur = async () => {
    const localErr = validateAccountName(accountname)
    if (localErr) {
      setAccountnameError(localErr)
      return
    }
    try {
      const res = await checkAccountName(accountname)
      if (res.message.includes('이미')) {
        setAccountnameError('이미 사용 중인 계정 ID입니다.')
      } else {
        setAccountnameError('')
      }
    } catch {
      setAccountnameError('계정 ID 확인에 실패했습니다.')
    }
  }

  const handleSubmit = async () => {
    const uErr = validateUsername(username)
    const aErr = validateAccountName(accountname)
    setUsernameError(uErr)
    setAccountnameError(aErr)
    if (uErr || aErr) return

    setLoading(true)
    try {
      let imageUrl = ''
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      await signup({ email, password, username, accountname, intro, image: imageUrl })

      // 회원가입 후 자동 로그인
      const loginRes = await login(email, password)
      const user: User = {
        _id: loginRes._id,
        username: loginRes.username,
        accountname: loginRes.accountname,
        email: loginRes.email,
        intro: loginRes.intro,
        image: loginRes.image,
        followerCount: 0,
        followingCount: 0,
      }
      authLogin(loginRes.token, user)
      navigate(ROUTES.HOME, { replace: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.'
      setAccountnameError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="프로필 설정" showBack />

      <div className="flex flex-col items-center px-6 pt-8 gap-6">
        <p className="text-sm text-gray-500 text-center">
          나중에 언제든지 변경할 수 있습니다.
        </p>

        {/* Avatar upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative"
        >
          <img
            src={imagePreview}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full object-cover bg-gray-100"
          />
          <span className="absolute bottom-0 right-0 w-8 h-8 bg-brand rounded-full flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </button>

        <div className="w-full flex flex-col gap-5">
          <Input
            label="사용자 이름"
            placeholder="2~10자 이내여야 합니다."
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              if (usernameError) setUsernameError('')
            }}
            onBlur={handleUsernameBlur}
            error={usernameError}
            underline
          />

          <Input
            label="계정 ID"
            placeholder="영문, 숫자, 특수문자(.),(_)만 사용 가능합니다."
            value={accountname}
            onChange={(e) => {
              setAccountname(e.target.value)
              if (accountnameError) setAccountnameError('')
            }}
            onBlur={handleAccountnameBlur}
            error={accountnameError}
            underline
          />

          <Input
            label="소개"
            placeholder="자신을 소개해주세요!"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            underline
          />
        </div>

        <Button
          fullWidth
          size="lg"
          disabled={!isValid}
          loading={loading}
          onClick={handleSubmit}
          className="mt-2"
        >
          감귤마켓 시작하기
        </Button>
      </div>
    </div>
  )
}
