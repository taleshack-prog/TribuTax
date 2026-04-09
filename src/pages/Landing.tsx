import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-900">
        <span className="font-display font-bold text-xl tracking-tight">
          TRIBU<span className="text-gold-500">TAX</span>
        </span>
        <Button variant="secondary" size="sm" onClick={() => navigate('/simulador')}>
          Simular Agora
        </Button>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          Alíquota estimada: 26.5% • EC 132/2023
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-6 max-w-4xl">
          REFORMA<br />
          <span className="text-gold-500">TRIBUTÁRIA</span><br />
          <span className="text-zinc-400 text-4xl md:text-5xl font-bold">SIMULAÇÃO IBS/CBS</span>
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
          Estime o impacto da EC 132/2023 na sua empresa. Compare regimes,
          analise créditos e projete cenários em minutos.
        </p>

        <Button size="lg" onClick={() => navigate('/simulador')}>
          Simular Agora <ArrowRight className="inline ml-2 w-5 h-5" />
        </Button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 pb-24">
        {[
          {
            icon: <TrendingUp className="w-6 h-6 text-gold-500" />,
            title: 'Carga Tributária',
            desc: 'Compare sua carga atual com a projeção IBS/CBS e veja o impacto real no seu faturamento.',
          },
          {
            icon: <Shield className="w-6 h-6 text-gold-500" />,
            title: 'Análise de Créditos',
            desc: 'Mapeie créditos aproveitáveis na cadeia de fornecedores e reduza sua carga efetiva.',
          },
          {
            icon: <Zap className="w-6 h-6 text-gold-500" />,
            title: 'Projeção de Margem',
            desc: 'Descubra o preço necessário para manter sua margem operacional após a reforma.',
          },
        ].map(f => (
          <div key={f.title} className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40 hover:border-zinc-600 transition-colors">
            <div className="mb-4">{f.icon}</div>
            <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer disclaimer */}
      <footer className="border-t border-zinc-900 px-8 py-6 text-center text-xs text-zinc-600">
        Simulação baseada em parâmetros estimados. Não substitui análise jurídica individualizada.
        Sujeita à regulamentação vigente — EC 132/2023.
      </footer>
    </div>
  )
}