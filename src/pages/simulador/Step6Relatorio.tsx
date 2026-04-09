import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { CheckCircle, AlertTriangle, TrendingUp, FileText, Phone } from 'lucide-react'
import type { ResultadoSimulacao, EmpresaPerfil, Receitas, Custos } from '../../types'

interface Props {
  resultado: ResultadoSimulacao
  perfil: Partial<EmpresaPerfil>
  receitas: Partial<Receitas>
  custos: Partial<Custos>
  onBack: () => void
  onReiniciar: () => void
}

function fmt(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`
}

function gerarRecomendacoes(
  resultado: ResultadoSimulacao,
  perfil: Partial<EmpresaPerfil>,
  receitas: Partial<Receitas>,
  custos: Partial<Custos>
): string[] {
  const recomendacoes: string[] = []

  if (custos.tipoFornecedor === 'pf' || custos.tipoFornecedor === 'simples') {
    recomendacoes.push('Revisar cadeia de fornecedores — priorizar contribuintes IBS/CBS para maximizar créditos.')
  }
  if (receitas.temLocacao) {
    recomendacoes.push('Avaliar estrutura de holding para operações de locação — pode reduzir carga em até 15%.')
  }
  if (resultado.diferencaPct > 3) {
    recomendacoes.push('Revisar precificação e contratos antes de 2026 — reajuste necessário para manter margem.')
  }
  if (perfil.regime === 'simples') {
    recomendacoes.push('Simular migração para Lucro Presumido ou Real — Simples pode perder vantagem competitiva.')
  }
  if (resultado.creditoPerdido > resultado.creditoPotencial * 0.5) {
    recomendacoes.push('Alto índice de crédito perdido — reestruturação da cadeia pode gerar economia significativa.')
  }
  if (resultado.margemProjetadaPct < resultado.margemAtualPct * 0.85) {
    recomendacoes.push('Queda de margem superior a 15% — planejar repasse gradual de preço aos clientes.')
  }

  if (recomendacoes.length === 0) {
    recomendacoes.push('Empresa bem posicionada para a reforma — monitorar atualizações regulatórias.')
    recomendacoes.push('Manter acompanhamento trimestral das alíquotas definitivas do CONFAZ.')
  }

  return recomendacoes
}

const ATIVIDADE_LABEL: Record<string, string> = {
  servicos: 'Serviços',
  comercio: 'Comércio',
  industria: 'Indústria',
  imobiliario: 'Imobiliário',
}

const REGIME_LABEL: Record<string, string> = {
  simples: 'Simples Nacional',
  presumido: 'Lucro Presumido',
  real: 'Lucro Real',
}

export function Step6Relatorio({ resultado, perfil, receitas, custos, onBack, onReiniciar }: Props) {
  const recomendacoes = gerarRecomendacoes(resultado, perfil, receitas, custos)
  const dataHoje = new Date().toLocaleDateString('pt-BR')

  const RISCO_COLOR = {
    baixo: 'text-green-400',
    medio: 'text-yellow-400',
    alto: 'text-red-400',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 max-w-2xl mx-auto">
      <span className="font-display font-bold text-xl tracking-tight block mb-8">
        TRIBU<span className="text-gold-500">TAX</span>
      </span>

      <ProgressBar step={6} total={6} />

      <h2 className="font-display font-bold text-2xl mb-1">Relatório Executivo</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Gerado em {dataHoje} • Baseado em EC 132/2023 • Estimativa sujeita a regulamentação
      </p>

      {/* Cabeçalho da empresa */}
      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Perfil simulado</p>
            <p className="font-display font-bold text-lg">
              {ATIVIDADE_LABEL[perfil.atividade ?? ''] ?? '—'}
            </p>
            <p className="text-sm text-zinc-400">
              {REGIME_LABEL[perfil.regime ?? ''] ?? '—'} •{' '}
              {perfil.faturamentoMensal
                ? fmt(perfil.faturamentoMensal) + '/mês'
                : '—'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">Risco jurídico</p>
            <p className={`font-display font-bold text-lg ${RISCO_COLOR[resultado.nivelRisco]}`}>
              {resultado.nivelRisco.charAt(0).toUpperCase() + resultado.nivelRisco.slice(1)}
            </p>
          </div>
        </div>
      </Card>

      {/* Diagnóstico */}
      <div className="mb-6">
        <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold-500" />
          Diagnóstico
        </h3>
        <Card>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Carga Atual', value: fmtPct(resultado.cargaAtualPct) },
              { label: 'Carga Nova (IBS/CBS)', value: fmtPct(resultado.cargaNovaPct) },
              { label: 'Variação de Carga', value: `${resultado.diferencaPct > 0 ? '+' : ''}${fmtPct(resultado.diferencaPct)}` },
              { label: 'Carga Efetiva Líquida', value: fmt(resultado.cargaEfetiva) },
              { label: 'Crédito Aproveitável', value: fmt(resultado.creditoPotencial) },
              { label: 'Crédito Perdido', value: fmt(resultado.creditoPerdido) },
              { label: 'Margem Atual', value: fmtPct(resultado.margemAtualPct) },
              { label: 'Margem Projetada', value: fmtPct(resultado.margemProjetadaPct) },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-zinc-500">{item.label}</p>
                <p className="font-display font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
          {resultado.precoNeutro > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500">Preço para neutralidade de margem</p>
              <p className="font-display font-bold text-gold-500 text-xl">
                {fmt(resultado.precoNeutro)}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Pontos críticos */}
      {resultado.alertas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Pontos Críticos
          </h3>
          <div className="flex flex-col gap-3">
            {resultado.alertas.map((alerta, i) => (
              <div key={i} className="flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-300">{alerta}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendações */}
      <div className="mb-6">
        <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold-500" />
          Recomendações Práticas
        </h3>
        <div className="flex flex-col gap-3">
          {recomendacoes.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 border border-gold-500/20 bg-gold-500/5 rounded-xl p-4">
              <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upsell consultoria */}
      <Card gold className="mb-8">
        <div className="flex items-start gap-4">
          <Phone className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-display font-bold text-lg mb-1">Diagnóstico Completo</p>
            <p className="text-sm text-zinc-400 mb-4">
              Este relatório é uma estimativa. Para uma análise individualizada com
              revisão de contratos, cadeia de fornecedores e planejamento tributário
              completo, fale com um especialista.
            </p>
            <Button size="md">
              Falar com Especialista →
            </Button>
          </div>
        </div>
      </Card>

      {/* Disclaimer legal */}
      <div className="border border-zinc-800 rounded-xl p-4 mb-8">
        <p className="text-xs text-zinc-600 leading-relaxed">
          <strong className="text-zinc-500">Disclaimer:</strong> Esta simulação é baseada em
          parâmetros estimados conforme EC 132/2023 e não substitui parecer jurídico
          individualizado. Os valores dependem das premissas informadas pelo usuário e refletem
          a legislação vigente na data de geração. Cenários com créditos controversos ou
          operações especiais exigem análise específica por profissional habilitado.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="md" onClick={onBack} className="flex-1">
          ← Voltar
        </Button>
        <Button variant="ghost" size="md" onClick={onReiniciar} className="flex-1">
          Nova Simulação
        </Button>
      </div>
    </div>
  )
}