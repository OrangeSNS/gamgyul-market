import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import { useAuth } from '@app/providers/AuthProvider'
import { validateUsername, validateAccountName } from '@shared/utils'
import { checkAccountName, updateMyProfile } from '../api'
import { uploadImage } from '@shared/api/client'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(user?.image ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [accountname, setAccountname] = useState(user?.accountname ?? '')
  const [intro, setIntro] = useState(user?.intro ?? '')

  const [usernameError, setUsernameError] = useState('')
  const [accountnameError, setAccountnameError] = useState('')
  const [loading, setLoading] = useState(false)

  const isChanged =
    imageFile !== null ||
    username !== user?.username ||
    accountname !== user?.accountname ||
    intro !== user?.intro

  const isValid = !usernameError && !accountnameError && username !== '' && accountname !== ''

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleAccountnameBlur = async () => {
    const localErr = validateAccountName(accountname)
    if (localErr) {
      setAccountnameError(localErr)
      return
    }
    if (accountname === user?.accountname) {
      setAccountnameError('')
      return
    }
    try {
      const res = await checkAccountName(accountname)
      setAccountnameError(res.message.includes('이미') ? '이미 사용 중인 계정 ID입니다.' : '')
    } catch {
      setAccountnameError('계정 ID 확인 실패')
    }
  }

  const handleSave = async () => {
    const uErr = validateUsername(username)
    const aErr = validateAccountName(accountname)
    setUsernameError(uErr)
    setAccountnameError(aErr)
    if (uErr || aErr) return

    setLoading(true)
    try {
      let imageUrl = user?.image ?? ''
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }
      const { user: updated } = await updateMyProfile({
        username,
        accountname,
        intro,
        image: imageUrl,
      })
      updateUser(updated)
      navigate(-1)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '저장에 실패했습니다.'
      setAccountnameError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="프로필 수정"
        showBack
        rightSlot={
          <Button
            size="sm"
            disabled={!isChanged || !isValid}
            loading={loading}
            onClick={handleSave}
          >
            저장
          </Button>
        }
      />

      <div className="flex flex-col items-center px-6 pt-8 gap-6">
        {/* Avatar */}
        <button type="button" onClick={() => fileInputRef.current?.click()} className="relative">
          <img
            src={imagePreview || '/icons/basic-profile-img-.svg'}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full object-cover bg-gray-100"
          />
          <span className="absolute bottom-0 right-0 w-8 h-8 bg-brand rounded-full flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </button>

        <div className="w-full flex flex-col gap-5">
          <Input
            label="사용자 이름"
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (usernameError) setUsernameError('') }}
            onBlur={() => setUsernameError(validateUsername(username))}
            error={usernameError}
            underline
          />
          <Input
            label="계정 ID"
            value={accountname}
            onChange={(e) => { setAccountname(e.target.value); if (accountnameError) setAccountnameError('') }}
            onBlur={handleAccountnameBlur}
            error={accountnameError}
            underline
          />
          <Input
            label="소개"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            underline
          />
        </div>
      </div>
    </div>
  )
}
