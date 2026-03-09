import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'
import { validateUsername, validateAccountName, isNetworkError } from '@shared/utils'
import { checkAccountName, signup } from '../api'
import { uploadImage } from '@shared/api/client'
import { User } from '@shared/types'
import { login } from '@features/login/api'
import { usePageTitle } from '@shared/hooks/usePageTitle'
import { API_BASE_URL } from '@shared/constants'

const DEFAULT_AVATAR = `${API_BASE_URL}/Ellipse.png`

export default function JoinProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()
  usePageTitle('프로필 설정')

  const { email = '', password = '' } = (location.state as { email: string; password: string }) ?? {}

  const fileInputRef = useRef<HTMLInputElement>(null)
  const accountCheckRef = useRef(0)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(DEFAULT_AVATAR)

  const [username, setUsername] = useState('')
  const [accountname, setAccountname] = useState('')
  const [intro, setIntro] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [accountnameError, setAccountnameError] = useState('')
  const [imageError, setImageError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email || !password) {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [email, password, navigate])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageError('')
    e.target.value = ''
  }
  const handleResetImage = () => {
    setImageFile(null)
    setImagePreview(DEFAULT_AVATAR)
    setImageError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleUsernameBlur = () => {
    setUsernameError(validateUsername(username))
  }

  /*  accountname 검증 (race condition 방지) */
  const handleAccountnameBlur = async () => {
    setAccountnameError('')
    const localErr = validateAccountName(accountname)
    if (localErr) {
      setAccountnameError(localErr)
      return
    }
    const requestId = ++accountCheckRef.current
    try {
      const res = await checkAccountName(accountname)
      if (requestId !== accountCheckRef.current) return

      if (res.message.includes('이미')) {
        setAccountnameError('이미 사용 중인 계정 ID입니다.')
      } else {
        setAccountnameError('')
      }
    } catch (err: unknown) {
      if (requestId !== accountCheckRef.current) return
      setAccountnameError(isNetworkError(err) ? '네트워크 연결을 확인해주세요.' : '계정 ID 확인에 실패했습니다.')
    }
  }

  const isValid = username && accountname && !usernameError && !accountnameError && !imageError

  const handleSubmit = async () => {
    if (loading) return
    setUsernameError('')
    setAccountnameError('')
    setImageError('')
    setFormError('')

    const uErr = validateUsername(username)
    const aErr = validateAccountName(accountname)

    setUsernameError(uErr)
    setAccountnameError(aErr)

    if (uErr || aErr) return

    setLoading(true)

    try {
      let imageUrl = DEFAULT_AVATAR

      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile)
        } catch (err: unknown) {
          setImageError(isNetworkError(err) ? '네트워크 연결을 확인해주세요.' : '이미지 업로드에 실패했습니다.')
          setLoading(false)
          return
        }
      }

      await signup({
        email,
        password,
        username,
        accountname,
        intro,
        image: imageUrl,
      })

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
      const message = isNetworkError(err)
        ? '네트워크 연결을 확인해주세요.'
        : err instanceof Error
          ? err.message
          : '회원가입에 실패했습니다.'
      setFormError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar showBack />

      <div className="flex flex-col items-center px-6 pt-8">
        <h1 className="text-[24px] font-medium text-center">프로필 설정</h1>
        <p className="text-[14px] text-[#767676] text-center mt-[12px]">나중에 언제든지 변경할 수 있습니다.</p>

        <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="프로필 이미지 선택하기" className="relative mt-[30px]">
          <img src={imagePreview} alt="프로필 이미지" className="w-24 h-24 rounded-full object-cover bg-gray-100" />
          <span className="absolute bottom-0 right-0 w-8 h-8 bg-brand rounded-full flex items-center justify-center shadow-md">
            <img src="/icons/icon-image-upload.svg" alt="" className="w-4 h-4" />
          </span>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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

            {(imageError || formError || imageFile) && (
              <div className="flex justify-between items-center mt-[6px]">
                <p className="text-[12px] text-[#EB5757]">{(imageError || formError) && `*${imageError || formError}`}</p>

                {(imageFile || imageError) && (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="text-[12px] text-[#767676] underline underline-offset-2 hover:text-brand transition-colors"
                  >
                    기본 이미지로 가기
                  </button>
                )}
              </div>
            )}
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