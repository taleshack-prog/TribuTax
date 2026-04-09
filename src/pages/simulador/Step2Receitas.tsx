import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { Receitas } from '../../types'

interface Props {
  data: Partial<Receitas>
  onChange: (d: Partial<Receitas>) => void
  onNext: () => void
  onBack: () => void
}

export function Step2Receitas({ data, onChange, onNext, onBack }: Props) {
  const valid = (data.receitaPrincipalPct ?? 0) > 0

  const toggle = (field: keyof Pick<Receitas, 'temServico' | 'temMercadoria' | 'temLocacao'>) => {
    onChange({ [field]: !data[field] })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 max-w-xl mx-auto">
      <span className="font-display font-bold text-2xl tracking-tight block mb-10">
        TRIBU<span className="text-gold-500">TAX</span>
      </span>

      <ProgressBar step={2} total={6} />

      <h2 className="font-display font-bold text-3xl mb-2">De onde vem seu dinheiro?</h2>
      <p className="text-zinc-400 text-base mb-8">
        Entender a composição da sua receita ajuda a calcular corretamente o imposto novo.
      </p>

      <div className="flex flex-col gap-6">
        <Input
          label="Quanto vem da sua atividade principal? (%)"
          type="number"
          min={0}
          max={100}
          placeholder="Ex: 80"
          value={data.receitaPrincipalPct ?? ''}
          onChange={e => onChange({ receitaPrincipalPct: Number(e.target.value) })}
          hint="Se 100% da receita vem de uma só atividade, coloque 100"
        />

        <Input
          label="Quanto vem de outras atividades? (%)"
          type="number"
          min={0}
          max={100}
          placeholder="Ex: 20"
          value={data.outrasReceitasPct ?? ''}
          onChange={e => onChange({ outrasReceitasPct: Number(e.target.value) })}
          hint="Receitas secundárias, eventuais ou complementares"
        />

        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-white">
            Quais tipos de receita sua empresa tem?
          </p>
          <p className="text-sm text-zinc-400 -mt-1">
            Selecione todos que se aplicam ao seu negócio
          </p>

          {[
            {
              field: 'temServico' as const,
              label: '💼 Presta serviços',
              desc: 'Cobra por trabalho, consultoria, mão de obra, tecnologia, saúde, educação etc.',
            },
            {
              field: 'temMercadoria' as const,
              label: '📦 Vende produtos físicos',
              desc: 'Revende ou fabrica mercadorias, peças, equipamentos etc.',
            },
            {
              field: 'temLocacao' as const,
              label: '🏢 Aluga imóveis ou equipamentos',
              desc: 'Atenção: locação tem regras especiais na Reforma Tributária — área sensível',
            },
          ].map(item => (
            <button
              key={item.field}
              onClick={() => toggle(item.field)}
              className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all ${
                data[item.field]
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-500'
              }`}
            >
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                data[item.field] ? 'border-gold-500 bg-gold-500' : 'border-zinc-600'
              }`}>
                {data[item.field] && <span className="text-black text-sm font-bold">✓</span>}
              </div>
              <div>
                <p className="text-base font-semibold text-white">{item.label}</p>
                <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <Button variant="secondary" size="lg" onClick={onBack} className="flex-1">
          ← Voltar
        </Button>
        <Button size="lg" onClick={onNext} disabled={!valid} className="flex-1">
          Próximo →
        </Button>
      </div>
    </div>
  )
}