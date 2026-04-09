import { clsx } from 'clsx'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
  hint?: string
}

export function Select({ label, options, hint, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-semibold text-white">{label}</label>
      <select
        className={clsx(
          'bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-4 text-white text-base',
          'focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all',
          'hover:border-zinc-400 cursor-pointer',
          className
        )}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <span className="text-sm text-zinc-300">{hint}</span>}
    </div>
  )
}