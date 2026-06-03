"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface SimulationParameters {
  cantDias: number
  horasLabDia: number
  capacidadMaq: number
  tiempoCam: number
  dispLote: number
  cantTrituradoras: number
}

interface SimulationContextValue {
  parameters: SimulationParameters | null
  setParameters: (parameters: SimulationParameters) => void
  clearParameters: () => void
  isReady: boolean
}

const STORAGE_KEY = "simulation-parameters"

const SimulationContext = createContext<SimulationContextValue | null>(null)

function readStoredParameters(): SimulationParameters | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return null
    }

    return JSON.parse(stored) as SimulationParameters
  } catch {
    return null
  }
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [parameters, setParametersState] = useState<SimulationParameters | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setParametersState(readStoredParameters())
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (parameters === null) {
      window.sessionStorage.removeItem(STORAGE_KEY)
      return
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parameters))
  }, [parameters])

  const value = useMemo<SimulationContextValue>(
    () => ({
      parameters,
      setParameters: setParametersState,
      clearParameters: () => setParametersState(null),
      isReady,
    }),
    [isReady, parameters],
  )

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulationContext() {
  const context = useContext(SimulationContext)

  if (!context) {
    throw new Error("useSimulationContext must be used within a SimulationProvider")
  }

  return context
}