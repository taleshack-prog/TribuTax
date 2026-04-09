export interface EmpresaPerfil {
  atividade: 'servicos' | 'comercio' | 'industria' | 'imobiliario'
  tipoOperacao: 'b2b' | 'b2c' | 'misto'
  regime: 'simples' | 'presumido' | 'real'
  faturamentoMensal: number
  uf: string
}

export interface Receitas {
  receitaPrincipalPct: number
  outrasReceitasPct: number
  temServico: boolean
  temMercadoria: boolean
  temLocacao: boolean
}

export interface Custos {
  insumosPct: number
  servicosTomadosPct: number
  aluguelPct: number
  energiaPct: number
  tipoFornecedor: 'ibscbs' | 'simples' | 'pf' | 'misto'
}

export interface PrecoMargem {
  precoMedio: number
  custoMedio: number
  margemAtualPct: number
  repasse: 'total' | 'parcial' | 'nenhum'
}

export interface ResultadoSimulacao {
  cargaAtualPct: number
  cargaNovaPct: number
  diferencaPct: number
  creditoPotencial: number
  creditoPerdido: number
  cargaEfetiva: number
  margemAtualPct: number
  margemProjetadaPct: number
  precoNeutro: number
  nivelRisco: 'baixo' | 'medio' | 'alto'
  alertas: string[]
}

export interface SimuladorState {
  step: number
  perfil: Partial<EmpresaPerfil>
  receitas: Partial<Receitas>
  custos: Partial<Custos>
  precoMargem: Partial<PrecoMargem>
  resultado: ResultadoSimulacao | null
}