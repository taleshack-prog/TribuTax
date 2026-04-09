import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { PrecoMargem } from '../../types'

interface Props {
  data: Partial<PrecoMargem>
  onChange: (d: Partial<PrecoMargem>) => void
  onNext: () => void
  onBack: () => void
}

const REPASSE = [
  {
    value: 'total',
    label: '✅ Consigo repassar o aumento para o cliente',
    desc: 'Seu produto ou serviço tem demanda forte — você ajusta o preço sem perder clientes.',
  },
  {
    value: 'parcial',
    label: '🟡 Consigo repassar só uma parte',
    desc: 'Mercado competitivo — você absorve parte do aumento e repassa o restante.',
  },
  {
    value: 'nenhum',
    label: '🔴 Não consigo repassar nada',
    desc: 'Preço travado pelo mercado ou contrato — o aumento do imposto sai do seu lucro.',
  },
]

export function Step4Preco({ data, onChange, onNext, onBack }: Props) {
  const valid =
    (data.precoMedio ?? 0) > 0 &&
    (data.custoMedio ?? 0) > 0 &&
    (data.margemAtualPct ?? 0) > 0 &&
    data.repasse

  const margemCalculada =
    data.precoMedio && data.custoMedio && data.precoMedio > 0
      ? ((data.precoMedio - data.custoMedio) / data.precoMedio) * 100
      : null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 max-w-xl mx-auto">
      <span className="font-display font-bold text-2xl tracking-tight block mb-10">
        TRIBU<span className="text-gold-500">TAX</span>
      </span>

      <ProgressBar step={4} total={6} />

      <h2 className="font-display font-bold text-3xl mb-2">Preço e Lucro</h2>
      <p className="text-zinc-400 text-base mb-8">
        Agora vamos calcular o impacto real no seu bolso — quanto seu lucro muda
        e se você precisa ajustar preços.
      </p>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preço médio de venda (R$)"
            type="number"
            min={0}
            placeholder="Ex: 1000"
            value={data.precoMedio ?? ''}
            onChange={e => onChange({ precoMedio: Number(e.target.value) })}
            hint="Valor médio que você cobra por produto ou serviço"
          />
          <Input
            label="Custo médio (R$)"
            type="number"
            min={0}
            placeholder="Ex: 600"
            value={data.custoMedio ?? ''}
            onChange={e => onChange({ custoMedio: Number(e.target.value) })}
            hint="Quanto custa para entregar esse produto ou serviço"
          />
        </div>

        {/* Preview margem */}
        {margemCalculada !== null && (
          <div className="border border-zinc-700 rounded-xl p-5 bg-zinc-900/60">
            <p className="text-sm text-zinc-300 mb-1">Margem bruta calculada</p>
            <p className="text-3xl font-display font-bold text-gold-500">
              {margemCalculada.toFixed(1)}%
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              De cada R$ 100 que você recebe, R$ {margemCalculada.toFixed(0)} é lucro bruto
            </p>
          </div>
        )}

        <Input
          label="Qual é sua margem de lucro atual? (%)"
          type="number"
          min={0}
          max={100}
          placeholder="Ex: 25"
          value={data.margemAtualPct ?? ''}
          onChange={e => onChange({ margemAtualPct: Number(e.target.value) })}
          hint="Percentual que sobra depois de pagar todos os custos e impostos atuais. Se não souber exato, use uma estimativa."
        />

        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-white">
            Se o imposto aumentar, você consegue repassar para o preço?
          </p>
          <p className="text-sm text-zinc-300 -mt-1">
            Isso define quem vai absorver o custo da reforma — você ou seu cliente
          </p>

          {REPASSE.map(r => (
            <button
              key={r.value}
              onClick={() => onChange({ repasse: r.value as PrecoMargem['repasse'] })}
              className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all ${
                data.repasse === r.value
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                data.repasse === r.value
                  ? 'border-gold-500 bg-gold-500'
                  : 'border-zinc-600'
              }`}>
                {data.repasse === r.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-black" />
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-white">{r.label}</p>
                <p className="text-sm text-zinc-300 mt-1">{r.desc}</p>
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
          Ver meus Resultados →
        </Button>
      </div>
    </div>
  )
}