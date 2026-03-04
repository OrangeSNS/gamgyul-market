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
        _id: loginRes._id ?? '',
        username: loginRes.username ?? '',
        accountname: loginRes.accountname ?? '',
        email: loginRes.email,
        intro: loginRes.intro ?? '',
        image: loginRes.image ?? '',
        followerCount: 0,
        followingCount: 0,
      }
      authLogin(loginRes.token ?? '', user)
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
      <TopBar showBack />

      <div className="flex flex-col items-center px-6 pt-8 ">
        <h2 className="text-[24px] font-medium leading-[100%] text-center text-[#000000]">
          프로필 설정
        </h2>
        <p className="text-[14px] text-[#767676] text-center mt-[12px]">
          나중에 언제든지 변경할 수 있습니다.
        </p>

        {/* Avatar upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative mt-[30px]"
        >
          <img
            src={imagePreview}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full object-cover bg-gray-100"
          />
          <span className="absolute bottom-0 right-0 w-8 h-8 bg-brand rounded-full flex items-center justify-center shadow-md">
            <img src="/icons/icon-image-upload.svg" alt="" className="w-4 h-4" />
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </button>

        <div className="w-full flex flex-col mt-[30px]">
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
        <div className="mt-4">
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
          </div>
        <div className="mt-4">
          <Input
            label="소개"
            placeholder="자신과 판매할 상품에 대해 소개해 주세요!"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            underline
          />
        </div>
        </div>
        <Button
          fullWidth
          size="lg"
          disabled={!isValid}
          loading={loading}
          onClick={handleSubmit}
          className="mt-[30px]"
        >
          감귤마켓 시작하기
        </Button>
      </div>
    </div>
  )
}
