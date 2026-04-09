import { useState } from 'react'
import type { SimuladorState, EmpresaPerfil, Receitas, Custos, PrecoMargem } from '../types'
import { calcularSimulacao } from '../lib/calculator'

const initialState: SimuladorState = {
  step: 1,
  perfil: {},
  receitas: {},
  custos: {},
  precoMargem: {},
  resultado: null,
}

export function useSimulador() {
  const [state, setState] = useState<SimuladorState>(initialState)

  function avancar() {
    setState(s => ({ ...s, step: Math.min(s.step + 1, 6) }))
  }

  function voltar() {
    setState(s => ({ ...s, step: Math.max(s.step - 1, 1) }))
  }

  function setPerfil(data: Partial<EmpresaPerfil>) {
    setState(s => ({ ...s, perfil: { ...s.perfil, ...data } }))
  }

  function setReceitas(data: Partial<Receitas>) {
    setState(s => ({ ...s, receitas: { ...s.receitas, ...data } }))
  }

  function setCustos(data: Partial<Custos>) {
    setState(s => ({ ...s, custos: { ...s.custos, ...data } }))
  }

  function setPrecoMargem(data: Partial<PrecoMargem>) {
    setState(s => ({ ...s, precoMargem: { ...s.precoMargem, ...data } }))
  }

  function calcular() {
    const resultado = calcularSimulacao(
      state.perfil,
      state.receitas,
      state.custos,
      state.precoMargem
    )
    setState(s => ({ ...s, resultado, step: 5 }))
  }

  function reiniciar() {
    setState(initialState)
  }

  return {
    state,
    avancar,
    voltar,
    setPerfil,
    setReceitas,
    setCustos,
    setPrecoMargem,
    calcular,
    reiniciar,
  }
}