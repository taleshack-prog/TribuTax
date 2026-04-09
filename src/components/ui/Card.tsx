import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  gold?: boolean
}

export function Card({ children, className, gold = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border p-6',
        gold
          ? 'border-gold-500/40 bg-gold-500/5'
          : 'border-zinc-800 bg-zinc-900/60',
        className
      )}
    >
      {children}
    </div>
  )
}