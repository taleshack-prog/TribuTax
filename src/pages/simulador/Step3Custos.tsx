import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { Custos } from '../../types'

interface Props {
  data: Partial<Custos>
  onChange: (d: Partial<Custos>) => void
  onNext: () => void
  onBack: () => void
}

const FORNECEDORES = [
  {
    value: 'ibscbs',
    label: '✅ Empresas normais (Lucro Presumido ou Real)',
    desc: 'Seus fornecedores pagam o novo imposto — você pode abater o valor deles do seu imposto. Melhor cenário.',
  },
  {
    value: 'simples',
    label: '🟡 Empresas do Simples Nacional',
    desc: 'Fornecedores pequenos (MEI, ME). Você aproveita pouco do imposto deles — desconto reduzido (~30%).',
  },
  {
    value: 'pf',
    label: '🔴 Pessoas físicas / autônomos',
    desc: 'Freelancers, autônomos, prestadores sem empresa. Você não aproveita nenhum desconto de imposto.',
  },
  {
    value: 'misto',
    label: '🔀 Mistura dos três tipos acima',
    desc: 'Parte dos fornecedores gera desconto, parte não. Situação comum na maioria das empresas.',
  },
]

export function Step3Custos({ data, onChange, onNext, onBack }: Props) {
  const valid = (data.insumosPct ?? 0) > 0 && data.tipoFornecedor

  const totalCustos =
    (data.insumosPct ?? 0) +
    (data.servicosTomadosPct ?? 0) +
    (data.aluguelPct ?? 0) +
    (data.energiaPct ?? 0)

  const fatorCredito =
    data.tipoFornecedor === 'ibscbs' ? 1 :
    data.tipoFornecedor === 'simples' ? 0.3 :
    data.tipoFornecedor === 'pf' ? 0 : 0.6

  const creditoEstimado = totalCustos * 0.265 * fatorCredito

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 max-w-xl mx-auto">
      <span className="font-display font-bold text-2xl tracking-tight block mb-10">
        TRIBU<span className="text-gold-500">TAX</span>
      </span>

      <ProgressBar step={3} total={6} />

      <h2 className="font-display font-bold text-3xl mb-2">Seus Gastos e Fornecedores</h2>
      <p className="text-zinc-400 text-base mb-2">
        Na Reforma Tributária, parte do imposto que seus fornecedores pagam pode ser
        abatida do seu. Quanto mais você compra de empresas formais, menos imposto paga.
      </p>
      <p className="text-zinc-500 text-sm mb-8">
        Informe os gastos como percentual do seu faturamento mensal.
      </p>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Compras e insumos (%)"
            type="number" min={0} max={100}
            placeholder="Ex: 30"
            value={data.insumosPct ?? ''}
            onChange={e => onChange({ insumosPct: Number(e.target.value) })}
            hint="Matéria-prima, mercadorias, materiais"
          />
          <Input
            label="Serviços contratados (%)"
            type="number" min={0} max={100}
            placeholder="Ex: 15"
            value={data.servicosTomadosPct ?? ''}
            onChange={e => onChange({ servicosTomadosPct: Number(e.target.value) })}
            hint="Terceiros, freelancers, agências"
          />
          <Input
            label="Aluguel do espaço (%)"
            type="number" min={0} max={100}
            placeholder="Ex: 10"
            value={data.aluguelPct ?? ''}
            onChange={e => onChange({ aluguelPct: Number(e.target.value) })}
            hint="Aluguel do escritório ou loja"
          />
          <Input
            label="Energia elétrica (%)"
            type="number" min={0} max={100}
            placeholder="Ex: 5"
            value={data.energiaPct ?? ''}
            onChange={e => onChange({ energiaPct: Number(e.target.value) })}
            hint="Conta de luz do negócio"
          />
        </div>

        {/* Preview dinâmico */}
        {totalCustos > 0 && (
          <div className="border border-zinc-700 rounded-xl p-5 bg-zinc-900/60">
            <p className="text-sm text-zinc-300 mb-1">Total de gastos mapeados</p>
            <p className="text-3xl font-display font-bold text-white">
              {totalCustos.toFixed(1)}%
              <span className="text-base text-zinc-500 ml-2">do faturamento</span>
            </p>
            {data.tipoFornecedor && (
              <p className="text-base text-gold-500 mt-2 font-semibold">
                💡 Desconto estimado de imposto: {creditoEstimado.toFixed(1)}% do faturamento
              </p>
            )}
          </div>
        )}

        {/* Tipo de fornecedor */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-white">
            Como são a maioria dos seus fornecedores?
          </p>
          <p className="text-sm text-zinc-300 -mt-1">
            Isso define quanto imposto você pode descontar das suas compras
          </p>

          {FORNECEDORES.map(f => (
            <button
              key={f.value}
              onClick={() => onChange({ tipoFornecedor: f.value as Custos['tipoFornecedor'] })}
              className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all ${
                data.tipoFornecedor === f.value
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                data.tipoFornecedor === f.value
                  ? 'border-gold-500 bg-gold-500'
                  : 'border-zinc-600'
              }`}>
                {data.tipoFornecedor === f.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-black" />
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-white">{f.label}</p>
                <p className="text-sm text-zinc-300 mt-1">{f.desc}</p>
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