interface ProgressBarProps {
  step: number
  total: number
}

const LABELS = ['Perfil', 'Receitas', 'Custos', 'Preço', 'Resultado', 'Relatório']

export function ProgressBar({ step, total }: ProgressBarProps) {
  return (
    <div className="w-full mb-10">
      <div className="flex justify-between mb-3">
        {LABELS.slice(0, total).map((label, i) => (
          <span
            key={label}
            className={`text-sm font-semibold transition-colors ${
              i + 1 <= step ? 'text-gold-500' : 'text-zinc-600'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full">
        <div
          className="h-1.5 bg-gold-500 rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}