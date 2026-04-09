import type { EmpresaPerfil, Receitas, Custos, PrecoMargem, ResultadoSimulacao } from '../types'

const ALIQUOTA_IBS_CBS = 0.265 // 26.5% estimado EC 132/2023

function calcularCargaAtual(regime: EmpresaPerfil['regime'], faturamento: number): number {
  switch (regime) {
    case 'simples':   return faturamento * 0.06
    case 'presumido': return faturamento * 0.165
    case 'real':      return faturamento * 0.195
    default:          return faturamento * 0.165
  }
}

function calcularCreditoPotencial(
  faturamento: number,
  custos: Partial<Custos>
): { potencial: number; perdido: number } {
  const {
    insumosPct = 0,
    servicosTomadosPct = 0,
    aluguelPct = 0,
    energiaPct = 0,
    tipoFornecedor = 'misto',
  } = custos

  const totalCustosPct = (insumosPct + servicosTomadosPct + aluguelPct + energiaPct) / 100
  const totalCustos = faturamento * totalCustosPct

  let fatorCredito = 1
  if (tipoFornecedor === 'simples') fatorCredito = 0.3
  else if (tipoFornecedor === 'pf')    fatorCredito = 0
  else if (tipoFornecedor === 'misto') fatorCredito = 0.6

  const potencial = totalCustos * ALIQUOTA_IBS_CBS * fatorCredito
  const perdido   = totalCustos * ALIQUOTA_IBS_CBS * (1 - fatorCredito)

  return { potencial, perdido }
}

function calcularRisco(
  receitas: Partial<Receitas>,
  custos: Partial<Custos>,
  diferencaPct: number
): { nivel: ResultadoSimulacao['nivelRisco']; alertas: string[] } {
  const alertas: string[] = []

  if (receitas.temLocacao) {
    alertas.push('Locação: enquadramento tributário controverso — acompanhe STF.')
  }
  if (custos.tipoFornecedor === 'pf' || custos.tipoFornecedor === 'simples') {
    alertas.push('Fornecedores sem IBS/CBS geram perda de crédito significativa.')
  }
  if (diferencaPct > 5) {
    alertas.push('Aumento de carga relevante — revisar precificação e contratos.')
  }
  if (receitas.temServico && receitas.temMercadoria) {
    alertas.push('Operação mista: base de cálculo pode variar — consulte especialista.')
  }

  const nivel: ResultadoSimulacao['nivelRisco'] =
    alertas.length >= 3 ? 'alto' :
    alertas.length >= 1 ? 'medio' : 'baixo'

  return { nivel, alertas }
}

export function calcularSimulacao(
  perfil: Partial<EmpresaPerfil>,
  receitas: Partial<Receitas>,
  custos: Partial<Custos>,
  precoMargem: Partial<PrecoMargem>
): ResultadoSimulacao {
  const faturamento = perfil.faturamentoMensal ?? 0
  const regime      = perfil.regime ?? 'presumido'
  const precoMedio  = precoMargem.precoMedio ?? 0
  const custoMedio  = precoMargem.custoMedio ?? 0
  const margemAtual = precoMargem.margemAtualPct ?? 0

  const cargaAtual  = calcularCargaAtual(regime, faturamento)
  const cargaBruta  = faturamento * ALIQUOTA_IBS_CBS
  const { potencial, perdido } = calcularCreditoPotencial(faturamento, custos)
  const cargaEfetiva = cargaBruta - potencial

  const cargaAtualPct  = faturamento > 0 ? (cargaAtual  / faturamento) * 100 : 0
  const cargaNovaPct   = faturamento > 0 ? (cargaEfetiva / faturamento) * 100 : 0
  const diferencaPct   = cargaNovaPct - cargaAtualPct

  const margemProjetadaPct = precoMedio > 0
    ? ((precoMedio - custoMedio - (cargaEfetiva / (faturamento / precoMedio))) / precoMedio) * 100
    : margemAtual - diferencaPct

  const precoNeutro = custoMedio > 0 && margemAtual > 0
    ? custoMedio / (1 - margemAtual / 100 - cargaNovaPct / 100)
    : 0

  const { nivel, alertas } = calcularRisco(receitas, custos, diferencaPct)

  return {
    cargaAtualPct,
    cargaNovaPct,
    diferencaPct,
    creditoPotencial: potencial,
    creditoPerdido:   perdido,
    cargaEfetiva,
    margemAtualPct:    margemAtual,
    margemProjetadaPct,
    precoNeutro,
    nivelRisco: nivel,
    alertas,
  }
}