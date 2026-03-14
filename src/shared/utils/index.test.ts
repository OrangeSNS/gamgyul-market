import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateAccountName,
  validateUsername,
  resolveImageUrl,
  formatPrice,
} from './index'

describe('validateEmail', () => {
  it('빈 값이면 에러 메시지 반환', () => {
    expect(validateEmail('')).toBe('이메일을 입력해주세요.')
  })
  it('잘못된 형식이면 에러 메시지 반환', () => {
    expect(validateEmail('notanemail')).toBe('잘못된 이메일 형식입니다.')
  })
  it('올바른 이메일이면 빈 문자열 반환', () => {
    expect(validateEmail('test@test.com')).toBe('')
  })
})

describe('validatePassword', () => {
  it('빈 값이면 에러 메시지 반환', () => {
    expect(validatePassword('')).toBe('비밀번호를 입력해주세요.')
  })
  it('6자 미만이면 에러 메시지 반환', () => {
    expect(validatePassword('abc')).toBe('비밀번호는 6자 이상이어야 합니다.')
  })
  it('6자 이상이면 빈 문자열 반환', () => {
    expect(validatePassword('abcdef')).toBe('')
  })
})

describe('validateAccountName', () => {
  it('빈 값이면 에러 메시지 반환', () => {
    expect(validateAccountName('')).toBe('계정 ID를 입력해주세요.')
  })
  it('특수문자 포함이면 에러 메시지 반환', () => {
    expect(validateAccountName('user@name')).toBe('영문, 숫자, 밑줄(_), 마침표(.)만 사용할 수 있습니다.')
  })
  it('올바른 계정ID면 빈 문자열 반환', () => {
    expect(validateAccountName('user_name.01')).toBe('')
  })
})

describe('validateUsername', () => {
  it('빈 값이면 에러 메시지 반환', () => {
    expect(validateUsername('')).toBe('사용자 이름을 입력해주세요.')
  })
  it('1자면 에러 메시지 반환', () => {
    expect(validateUsername('a')).toBe('사용자 이름은 2~10자 사이여야 합니다.')
  })
  it('2자 이상이면 빈 문자열 반환', () => {
    expect(validateUsername('홍길동')).toBe('')
  })
})

describe('resolveImageUrl', () => {
  it('null이면 undefined 반환', () => {
    expect(resolveImageUrl(null)).toBeUndefined()
  })
  it('빈 문자열이면 undefined 반환', () => {
    expect(resolveImageUrl('')).toBeUndefined()
  })
  it('루트 경로면 undefined 반환', () => {
    expect(resolveImageUrl('/image.jpg')).toBeUndefined()
  })
  it('https URL이면 그대로 반환', () => {
    expect(resolveImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
  })
})

describe('formatPrice', () => {
  it('1000을 1,000원으로 포맷', () => {
    expect(formatPrice(1000)).toBe('1,000원')
  })
  it('0을 0원으로 포맷', () => {
    expect(formatPrice(0)).toBe('0원')
  })
})