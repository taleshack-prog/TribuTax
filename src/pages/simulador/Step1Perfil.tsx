import { Select } from '../../components/ui/Select'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { EmpresaPerfil } from '../../types'

interface Props {
  data: Partial<EmpresaPerfil>
  onChange: (d: Partial<EmpresaPerfil>) => void
  onNext: () => void
}

export function Step1Perfil({ data, onChange, onNext }: Props) {
  const valid = data.atividade && data.tipoOperacao && data.regime && data.faturamentoMensal

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 max-w-xl mx-auto">
      <span className="font-display font-bold text-2xl tracking-tight block mb-10">
        TRIBU<span className="text-gold-500">TAX</span>
      </span>

      <ProgressBar step={1} total={6} />

      <h2 className="font-display font-bold text-3xl mb-2">Perfil da Empresa</h2>
      <p className="text-zinc-400 text-base mb-8">
        Conte um pouco sobre o seu negócio para calibrarmos a simulação.
      </p>

      <div className="flex flex-col gap-6">
        <Select
          label="O que sua empresa faz?"
          value={data.atividade ?? ''}
          onChange={e => onChange({ atividade: e.target.value as EmpresaPerfil['atividade'] })}
          hint="Escolha a atividade que representa a maior parte do seu faturamento"
          options={[
            { value: 'servicos', label: '💼 Prestação de Serviços (consultorias, tecnologia, saúde, educação...)' },
            { value: 'comercio', label: '🛒 Comércio (compra e venda de produtos)' },
            { value: 'industria', label: '🏭 Indústria (fabricação de produtos)' },
            { value: 'imobiliario', label: '🏢 Imobiliário (imóveis, locações, incorporação)' },
          ]}
        />

        <Select
          label="Para quem você vende?"
          value={data.tipoOperacao ?? ''}
          onChange={e => onChange({ tipoOperacao: e.target.value as EmpresaPerfil['tipoOperacao'] })}
          hint="Isso afeta como o imposto é calculado na cadeia"
          options={[
            { value: 'b2b', label: '🏢 Para outras empresas (ex: fornecedor, prestador corporativo)' },
            { value: 'b2c', label: '👤 Para pessoas físicas / consumidor final' },
            { value: 'misto', label: '🔀 Para os dois — empresas e pessoas físicas' },
          ]}
        />

        <Select
          label="Como sua empresa paga imposto hoje?"
          value={data.regime ?? ''}
          onChange={e => onChange({ regime: e.target.value as EmpresaPerfil['regime'] })}
          hint="Se não souber, consulte seu contador ou CNPJ na Receita Federal"
          options={[
            { value: 'simples', label: '🟢 Simples Nacional (faturamento até R$ 4,8M/ano)' },
            { value: 'presumido', label: '🟡 Lucro Presumido (regime intermediário)' },
            { value: 'real', label: '🔴 Lucro Real (grandes empresas, apura lucro real)' },
          ]}
        />

        <Input
          label="Qual é o faturamento médio mensal? (R$)"
          type="number"
          placeholder="Ex: 150000"
          value={data.faturamentoMensal ?? ''}
          onChange={e => onChange({ faturamentoMensal: Number(e.target.value) })}
          hint="Valor aproximado do total que sua empresa recebe por mês (receita bruta)"
        />

        <Select
          label="Estado onde sua empresa opera"
          value={data.uf ?? ''}
          onChange={e => onChange({ uf: e.target.value })}
          options={[
            'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
            'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'
          ].map(uf => ({ value: uf, label: uf }))}
        />
      </div>

      <div className="mt-10">
        <Button fullWidth size="lg" onClick={onNext} disabled={!valid}>
          Próximo →
        </Button>
      </div>
    </div>
  )
}