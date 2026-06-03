"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { SectionCard } from "@/components/section-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Settings,
  Play,
  Info,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSimulationContext } from "@/components/simulation-context"

export default function ConfiguracionPage() {
  const router = useRouter()
  const { setParameters } = useSimulationContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingTime, setProcessingTime] = useState([1])
  const [workingHours, setWorkingHours] = useState([8])
  const [machineCapacity, setMachineCapacity] = useState([1200])

  const handleStartSimulation = async () => {
    setIsSubmitting(true)

    try {
      const parameters = {
        cantDias: processingTime[0],
        horasLabDia: workingHours[0],
        capacidadMaq: machineCapacity[0],
        tiempoCam: 1,
        dispLote: 3000,
        cantTrituradoras: 3,
      }

      setParameters(parameters)

      const response = await fetch("/api/resultados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameters),
      })

      if (!response.ok) {
        throw new Error(`Error executing simulation: ${response.status}`)
      }

      router.push("/resultados")
      router.refresh()
    } catch (error) {
      console.error("No se pudo iniciar la simulación", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout simulationStatus="idle">
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Configuración de Simulación</h1>
              <p className="text-muted-foreground">
                Ajusta los parámetros antes de iniciar una nueva simulación
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleStartSimulation}
                disabled={isSubmitting}
              >
                <Play className="mr-2 h-4 w-4" />
                {isSubmitting ? "Iniciando..." : "Iniciar Simulación"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="general" className="data-[state=active]:bg-accent/20">
                <Settings className="mr-2 h-4 w-4" />
                General
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-1">
                <SectionCard
                  title="Parámetros de Simulación"
                  description="Configuración básica del escenario"
                  icon={Settings}
                >
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duración (Dias)
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Número de días que se ejecutará la simulación
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="text-sm font-medium tabular-nums">{processingTime[0]} días</span>
                      </div>
                      <Slider
                        value={processingTime}
                        onValueChange={setProcessingTime}
                        max={365}
                        min={1}
                        step={1}
                        className="py-2"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="workingHours">Horas Laborales por Día
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Numero de horas que el sistema estará operativo cada día
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="text-sm font-medium tabular-nums">{workingHours[0]} horas</span>
                      </div>
                      <Slider
                        value={workingHours}
                        onValueChange={setWorkingHours}
                        max={16}
                        min={8}
                        step={2}
                        className="py-2"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="machineCapacity">Capacidad de Máquina
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Número máximo de dispositivos que la máquina puede procesar simultáneamente
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="text-sm font-medium tabular-nums">{machineCapacity[0]} dispositivos</span>
                      </div>
                      <Slider
                        value={machineCapacity}
                        onValueChange={setMachineCapacity}
                        max={5000}
                        min={1200}
                        step={10}
                        className="py-2"
                      />
                    </div>
                  </div>
                </SectionCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  )
}
