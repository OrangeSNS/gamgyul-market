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

const DEFAULT_AVATAR = 'https://dev.wenivops.co.kr/services/mandarin/Ellipse.png'

export default function Avatar({ src, alt = '', size = 'md', className = '' }: AvatarProps) {
  return (
    <img
      src={src || DEFAULT_AVATAR}
      alt={alt}
      onError={(e) => {
        ;(e.target as HTMLImageElement).src = DEFAULT_AVATAR
      }}
      className={['rounded-full object-cover bg-gray-100', sizeMap[size], className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
