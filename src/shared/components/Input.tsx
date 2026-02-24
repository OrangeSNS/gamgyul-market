import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  underline?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, underline = false, className = '', ...props }, ref) => {
    if (underline) {
      return (
        <div className="flex flex-col gap-1">
          {label && (
            <label className="text-xs text-gray-500">{label}</label>
          )}
          <input
            ref={ref}
            className={[
              'w-full pb-2 text-sm bg-transparent border-b outline-none transition-colors duration-150',
              'border-gray-300 focus:border-brand placeholder:text-gray-400',
              error ? 'border-red-400 focus:border-red-400' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs text-gray-500">{label}</label>
        )}
        <input
          ref={ref}
          className={[
            'w-full px-4 py-3 text-sm rounded-lg border outline-none transition-colors duration-150',
            'border-gray-300 focus:border-brand placeholder:text-gray-400',
            error ? 'border-red-400 focus:border-red-400' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
export default Input
