import { useSimulador } from '../hooks/useSimulador'
import { Step1Perfil } from './simulador/Step1Perfil'
import { Step2Receitas } from './simulador/Step2Receitas'
import { Step3Custos } from './simulador/Step3Custos'
import { Step4Preco } from './simulador/Step4Preco'
import { Step5Resultado } from './simulador/Step5Resultado'
import { Step6Relatorio } from './simulador/Step6Relatorio'

export function Simulador() {
  const {
    state,
    avancar,
    voltar,
    setPerfil,
    setReceitas,
    setCustos,
    setPrecoMargem,
    calcular,
    reiniciar,
  } = useSimulador()

  const { step, perfil, receitas, custos, precoMargem, resultado } = state

  function handleStep4Next() {
    calcular()
  }

  if (step === 1) {
    return (
      <Step1Perfil
        data={perfil}
        onChange={setPerfil}
        onNext={avancar}
      />
    )
  }

  if (step === 2) {
    return (
      <Step2Receitas
        data={receitas}
        onChange={setReceitas}
        onNext={avancar}
        onBack={voltar}
      />
    )
  }

  if (step === 3) {
    return (
      <Step3Custos
        data={custos}
        onChange={setCustos}
        onNext={avancar}
        onBack={voltar}
      />
    )
  }

  if (step === 4) {
    return (
      <Step4Preco
        data={precoMargem}
        onChange={setPrecoMargem}
        onNext={handleStep4Next}
        onBack={voltar}
      />
    )
  }

  if (step === 5 && resultado) {
    return (
      <Step5Resultado
        resultado={resultado}
        faturamento={perfil.faturamentoMensal ?? 0}
        onNext={avancar}
        onBack={voltar}
        onReiniciar={reiniciar}
      />
    )
  }

  if (step === 6 && resultado) {
    return (
      <Step6Relatorio
        resultado={resultado}
        perfil={perfil}
        receitas={receitas}
        custos={custos}
        onBack={voltar}
        onReiniciar={reiniciar}
      />
    )
  }

  return null
}