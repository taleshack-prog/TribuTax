import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-semibold text-white">{label}</label>
      <input
        className={clsx(
          'bg-zinc-800 border rounded-xl px-4 py-4 text-white text-base placeholder-zinc-500',
          'focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all',
          error ? 'border-red-500' : 'border-zinc-600 hover:border-zinc-400',
          className
        )}
        {...props}
      />
      {hint && <span className="text-sm text-zinc-400">{hint}</span>}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  )
}