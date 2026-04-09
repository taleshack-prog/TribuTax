import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle, TrendingUp, Shield } from 'lucide-react'
import type { ResultadoSimulacao } from '../../types'

interface Props {
  resultado: ResultadoSimulacao
  faturamento: number
  onNext: () => void
  onBack: () => void
  onReiniciar: () => void
}

function fmt(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`
}

const RISCO_COLOR = { baixo: 'text-green-400', medio: 'text-yellow-400', alto: 'text-red-400' }
const RISCO_BG = { baixo: 'border-green-500/30 bg-green-500/5', medio: 'border-yellow-500/30 bg-yellow-500/5', alto: 'border-red-500/30 bg-red-500/5' }

export function Step5Resultado({ resultado, onNext, onBack, onReiniciar }: Props) {
  const {
    cargaAtualPct, cargaNovaPct, diferencaPct,
    creditoPotencial, creditoPerdido, cargaEfetiva,
    margemAtualPct, margemProjetadaPct,
    precoNeutro, nivelRisco, alertas,
  } = resultado

  const chartData = [
    { name: 'Carga Atual', valor: cargaAtualPct, fill: '#71717a' },
    { name: 'Carga Nova', valor: cargaNovaPct, fill: diferencaPct > 0 ? '#ef4444' : '#22c55e' },
  ]

  const margemData = [
    { name: 'Margem Atual', valor: margemAtualPct, fill: '#71717a' },
    { name: 'Margem Projetada', valor: margemProjetadaPct, fill: margemProjetadaPct < margemAtualPct ? '#ef4444' : '#22c55e' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 max-w-2xl mx-auto">
      <span className="font-display font-bold text-2xl tracking-tight block mb-8">
        TRIBU<span className="text-gold-500">TAX</span>
      </span>

      <ProgressBar step={5} total={6} />

      <h2 className="font-display font-bold text-3xl mb-1">Resultado da Simulação</h2>
      <p className="text-zinc-300 text-base mb-8">
        Baseado nos dados informados — EC 132/2023. Estimativa sujeita a regulamentação.
      </p>

      {/* 6 números principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Carga Atual', value: fmtPct(cargaAtualPct), sub: 'regime atual' },
          { label: 'Carga Nova IBS/CBS', value: fmtPct(cargaNovaPct), sub: 'projetada', highlight: true },
          {
            label: 'Variação',
            value: `${diferencaPct > 0 ? '+' : ''}${fmtPct(diferencaPct)}`,
            sub: diferencaPct > 0 ? 'aumento' : 'redução',
            color: diferencaPct > 0 ? 'text-red-400' : 'text-green-400',
          },
          { label: 'Crédito Potencial', value: fmt(creditoPotencial), sub: 'aproveitável' },
          { label: 'Crédito Perdido', value: fmt(creditoPerdido), sub: 'não aproveitável', color: 'text-red-400' },
          { label: 'Carga Efetiva', value: fmt(cargaEfetiva), sub: 'débito − crédito', highlight: true },
        ].map(item => (
          <Card key={item.label} gold={item.highlight}>
            <p className="text-sm text-zinc-300 mb-1">{item.label}</p>
            <p className={`text-xl font-display font-bold ${item.color ?? 'text-white'}`}>
              {item.value}
            </p>
            <p className="text-xs text-zinc-400 mt-1">{item.sub}</p>
          </Card>
        ))}
      </div>

      {/* Gráfico Carga */}
      <Card className="mb-4">
        <p className="text-base font-semibold text-white mb-4">Carga Tributária: Atual vs Nova</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} barSize={48}>
            <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              formatter={(v: unknown) => [`${Number(v).toFixed(1)}%`, '']}
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
              labelStyle={{ color: '#d4d4d8' }}
            />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfico Margem */}
      <Card className="mb-6">
        <p className="text-base font-semibold text-white mb-4">Margem Operacional: Atual vs Projetada</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={margemData} barSize={48}>
            <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              formatter={(v: unknown) => [`${Number(v).toFixed(1)}%`, '']}
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
              labelStyle={{ color: '#d4d4d8' }}
            />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
              {margemData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Preço neutro */}
      {precoNeutro > 0 && (
        <Card gold className="mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-gold-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-zinc-300">Preço necessário para manter margem atual</p>
              <p className="text-2xl font-display font-bold text-gold-500">{fmt(precoNeutro)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Nível de risco */}
      <div className={`rounded-xl border p-5 mb-6 ${RISCO_BG[nivelRisco]}`}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className={`w-5 h-5 ${RISCO_COLOR[nivelRisco]}`} />
          <p className={`font-display font-semibold text-lg ${RISCO_COLOR[nivelRisco]}`}>
            Risco Jurídico: {nivelRisco.charAt(0).toUpperCase() + nivelRisco.slice(1)}
          </p>
        </div>
        {alertas.length > 0 && (
          <ul className="flex flex-col gap-2">
            {alertas.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-200">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                {a}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-zinc-400 text-center mb-8">
        Simulação estimada com base em EC 132/2023. Não substitui parecer jurídico.
        Créditos controversos dependem de regulamentação e jurisprudência do STF.
      </p>

      <div className="flex flex-col gap-3">
        <Button size="lg" fullWidth onClick={onNext}>
          Ver Relatório Executivo →
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" size="md" onClick={onBack} className="flex-1">
            ← Voltar
          </Button>
          <Button variant="ghost" size="md" onClick={onReiniciar} className="flex-1">
            Nova Simulação
          </Button>
        </div>
      </div>
    </div>
  )
}