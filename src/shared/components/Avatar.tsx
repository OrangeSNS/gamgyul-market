import { resolveImageUrl } from '@shared/utils'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

const DEFAULT_AVATAR_SMALL = '/icons/basic-profile.svg'
const DEFAULT_AVATAR_LARGE = '/icons/basic-profile-img-.svg'

export default function Avatar({ src, alt = '', size = 'md', className = '' }: AvatarProps) {
  const defaultAvatar = size === 'lg' || size === 'xl' ? DEFAULT_AVATAR_LARGE : DEFAULT_AVATAR_SMALL
  const resolvedSrc = resolveImageUrl(src) ?? defaultAvatar
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      onError={(e) => {
        ;(e.target as HTMLImageElement).src = defaultAvatar
      }}
      className={['rounded-full object-cover bg-gray-100', sizeMap[size], className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
