"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { KPICard } from "@/components/kpi-card"
import { SectionCard } from "@/components/section-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HardDrive,
  Shield,
  Recycle,
  Activity,
  AlertTriangle,
  Gauge,
  Flame,
  Scale,
  Gem,
  CircuitBoard,
  Box,
  Factory,
  Timer,
  Cpu,
  Package,
  Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart as RechartsPie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { useSimulationContext } from "@/components/simulation-context"

interface GlobalResults {
  disp_total: number;
  peso_desper: number;
  recic_efectivo: number;
  dia_maj_cong: string;
  disp_dia_maj: number;
}

interface RecoveredMaterial {
  name: string;
  value: number;
  unit: string;
  color: string;
  icon: LucideIcon;
}

interface BackendGlobalResults {
  disp_total: number
  peso_desper: number
  recic_efectivo: number
  dia_maj_cong: string
  disp_dia_maj: number
}

interface DailyReportDay {
  num_dia: number
  disp_dia: number
  cant_HDD3_dia: number
  cant_HDD2_dia: number
  cant_SSD2_dia: number
  cant_SSDM_dia: number
  cant_CD_dia: number
  peso_total_dia: number
  ocup_maq_1_dia: number
  ocup_maq_2_dia: number
  ocup_maq_3_dia: number
}

interface BatchReportLot {
  num_dia: number
  num_lote: number
  disp_lote: number
  cant_HDD3: number
  cant_HDD2: number
  cant_SSD2: number
  cant_SSDM: number
  cant_CD: number
  peso_total_lote: number
  tiempo_trit_lote: string
  tiempo_separ_lote: string
  tiempo_proces_lote: string
  maq_limite: number
  maq_uso: number
  maq_libre: number
}

interface BackendReportResponse {
  dailyReports?: Array<Record<string, unknown>>
  batchReports?: Array<Record<string, unknown>>
  globalResults?: Partial<BackendGlobalResults>
  recoveredMaterials?: Array<Record<string, unknown>>
}

const backendUrl = "/api/resultados"

const recoveredMaterialMeta: Record<string, { color: string; icon: LucideIcon; unit: string; label: string }> = {
  aluminio: { color: "oklch(0.72 0.16 195)", icon: Box, unit: "kg", label: "Aluminio" },
  hierro: { color: "oklch(0.55 0.02 250)", icon: Factory, unit: "kg", label: "Hierro" },
  plastico: { color: "oklch(0.68 0.17 150)", icon: Box, unit: "kg", label: "Plastico" },
  plástico: { color: "oklch(0.68 0.17 150)", icon: Box, unit: "kg", label: "Plastico" },
  cobre: { color: "oklch(0.70 0.18 30)", icon: CircuitBoard, unit: "kg", label: "Cobre" },
  silicio: { color: "oklch(0.62 0.18 230)", icon: CircuitBoard, unit: "kg", label: "Silicio" },
  tierrasraras: { color: "oklch(0.70 0.3 700)", icon: Gem, unit: "kg", label: "Tierras raras" },
  tierras_raras: { color: "oklch(0.70 0.3 700)", icon: Gem, unit: "kg", label: "Tierras raras" },
  oro: { color: "oklch(0.75 0.15 85)", icon: Gem, unit: "kg", label: "Oro" },
  plata: { color: "oklch(0.50 0.03 200)", icon: Gem, unit: "kg", label: "Plata" },
  paladio: { color: "oklch(0.20 0.3 200)", icon: Gem, unit: "kg", label: "Paladio" },
}

const toFiniteNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace("%", "")

    if (!normalized || normalized.toLowerCase() === "undefined" || normalized.toLowerCase() === "null") {
      return fallback
    }

    const parsed = Number(normalized)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

const toText = (value: unknown, fallback: string) => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed || fallback
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return fallback
}

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")

const normalizeDailyReportDay = (day: Record<string, unknown>, fallback: DailyReportDay): DailyReportDay => ({
  num_dia: toFiniteNumber(day.num_dia ?? day.numDia ?? day.dayNumber ?? day.dia, fallback.num_dia),
  disp_dia: toFiniteNumber(day.disp_dia ?? day.dispDia ?? day.devices ?? day.totalDevices, fallback.disp_dia),
  cant_HDD3_dia: toFiniteNumber(day.cant_HDD3_dia ?? day.cantHDD3Dia ?? day.hdd35 ?? day.hdd3_5, fallback.cant_HDD3_dia),
  cant_HDD2_dia: toFiniteNumber(day.cant_HDD2_dia ?? day.cantHDD2Dia ?? day.hdd25 ?? day.hdd2_5, fallback.cant_HDD2_dia),
  cant_SSD2_dia: toFiniteNumber(day.cant_SSD2_dia ?? day.cantSSD2Dia ?? day.ssd25 ?? day.ssd2_5, fallback.cant_SSD2_dia),
  cant_SSDM_dia: toFiniteNumber(day.cant_SSDM_dia ?? day.cantSSDMDia ?? day.ssdm ?? day.ssd_m2, fallback.cant_SSDM_dia),
  cant_CD_dia: toFiniteNumber(day.cant_CD_dia ?? day.cantCdDia ?? day.cd ?? day.dvd_cd, fallback.cant_CD_dia),
  peso_total_dia: toFiniteNumber(day.peso_total_dia ?? day.pesoTotalDia ?? day.totalWeight ?? day.weight, fallback.peso_total_dia),
  ocup_maq_1_dia: toFiniteNumber(day.ocup_maq_1_dia ?? day.ocupMaq1Dia ?? day.machine1 ?? day.crusher1, fallback.ocup_maq_1_dia),
  ocup_maq_2_dia: toFiniteNumber(day.ocup_maq_2_dia ?? day.ocupMaq2Dia ?? day.machine2 ?? day.crusher2, fallback.ocup_maq_2_dia),
  ocup_maq_3_dia: toFiniteNumber(day.ocup_maq_3_dia ?? day.ocupMaq3Dia ?? day.machine3 ?? day.crusher3, fallback.ocup_maq_3_dia),
})

const normalizeBatchReportLot = (lot: Record<string, unknown>, fallback: BatchReportLot): BatchReportLot => ({
  num_dia: toFiniteNumber(lot.num_dia ?? lot.numDia ?? lot.dayNumber ?? lot.dia, fallback.num_dia),
  num_lote: toFiniteNumber(lot.num_lote ?? lot.numLote ?? lot.lote ?? lot.batchNumber, fallback.num_lote),
  disp_lote: toFiniteNumber(lot.disp_lote ?? lot.dispLote ?? lot.devices ?? lot.totalDevices, fallback.disp_lote),
  cant_HDD3: toFiniteNumber(lot.cant_HDD3 ?? lot.cantHDD3 ?? lot.hdd35 ?? lot.hdd3_5, fallback.cant_HDD3),
  cant_HDD2: toFiniteNumber(lot.cant_HDD2 ?? lot.cantHDD2 ?? lot.hdd25 ?? lot.hdd2_5, fallback.cant_HDD2),
  cant_SSD2: toFiniteNumber(lot.cant_SSD2 ?? lot.cantSSD2 ?? lot.ssd25 ?? lot.ssd2_5, fallback.cant_SSD2),
  cant_SSDM: toFiniteNumber(lot.cant_SSDM ?? lot.cantSSDM ?? lot.ssdm ?? lot.ssd_m2, fallback.cant_SSDM),
  cant_CD: toFiniteNumber(lot.cant_CD ?? lot.cantCd ?? lot.cd ?? lot.dvd_cd, fallback.cant_CD),
  peso_total_lote: toFiniteNumber(lot.peso_total_lote ?? lot.pesoTotalLote ?? lot.totalWeight ?? lot.weight, fallback.peso_total_lote),
  tiempo_trit_lote: toText(lot.tiempo_trit_lote ?? lot.tiempoTritLote ?? lot.crushTime, fallback.tiempo_trit_lote),
  tiempo_separ_lote: toText(lot.tiempo_separ_lote ?? lot.tiempoSeparLote ?? lot.separationTime, fallback.tiempo_separ_lote),
  tiempo_proces_lote: toText(lot.tiempo_proces_lote ?? lot.tiempoProcesLote ?? lot.processingTime, fallback.tiempo_proces_lote),
  maq_limite: toFiniteNumber(lot.maq_limite ?? lot.maqLimite ?? lot.limitMachines, fallback.maq_limite),
  maq_uso: toFiniteNumber(lot.maq_uso ?? lot.maqUso ?? lot.machinesInUse, fallback.maq_uso),
  maq_libre: toFiniteNumber(lot.maq_libre ?? lot.maqLibre ?? lot.freeMachines, fallback.maq_libre),
})

const normalizeGlobalResults = (value: Partial<BackendGlobalResults> | undefined): GlobalResults | null => {
  if (!value) {
    return null
  }

  return {
    disp_total: toFiniteNumber(value.disp_total, 0),
    peso_desper: toFiniteNumber(value.peso_desper, 0),
    recic_efectivo: toFiniteNumber(value.recic_efectivo, 0),
    dia_maj_cong: toText(value.dia_maj_cong, ""),
    disp_dia_maj: toFiniteNumber(value.disp_dia_maj, 0),
  }
}

const normalizeRecoveredMaterials = (items: Array<Record<string, unknown>> | undefined): RecoveredMaterial[] => {
  if (!items || items.length === 0) {
    return []
  }

  return items.map((item) => {
    const rawName = toText(item.name, "Material")
    const meta = recoveredMaterialMeta[normalizeKey(rawName)] ?? {
      color: "oklch(0.62 0.18 230)",
      icon: CircuitBoard,
      unit: toText(item.unit, "kg"),
      label: rawName,
    }

    return {
      name: meta.label,
      value: toFiniteNumber(item.value, 0),
      unit: toText(item.unit, meta.unit),
      color: meta.color,
      icon: meta.icon,
    }
  })
}

const formatDayValue = (value: number, suffix?: string) => {
  const formatted = Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 1 })

  return suffix ? `${formatted}${suffix}` : formatted
}

export default function ResultadosPage() {
  const { parameters, isReady } = useSimulationContext()
  const [globalResults, setGlobalResults] = useState<GlobalResults | null>(null)
  const [dailyReportDays, setDailyReportDays] = useState<DailyReportDay[]>([])
  const [batchReportLots, setBatchReportLots] = useState<BatchReportLot[]>([])
  const [recoveredMaterialsState, setRecoveredMaterialsState] = useState<RecoveredMaterial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null)
  const totalMaterialRecovered = recoveredMaterialsState.reduce((acc, m) => acc + m.value, 0)
  const hasGlobalResults = globalResults !== null
  const emptyStateLabel = isLoading ? "Cargando datos del backend..." : "Sin datos del backend"

  const selectedDayLots = selectedDayNumber === null
    ? []
    : batchReportLots.filter((lot) => lot.num_dia === selectedDayNumber)

  const selectedDay = selectedDayNumber === null
    ? null
    : dailyReportDays.find((day) => day.num_dia === selectedDayNumber) ?? null

  const openDayLots = (dayNumber: number) => {
    setSelectedDayNumber(dayNumber)
  }

  useEffect(() => {
    const controller = new AbortController()

    const loadBackendReport = async () => {
      if (!isReady) {
        return
      }

      if (!parameters) {
        setIsLoading(false)
        setDailyReportDays([])
        setBatchReportLots([])
        setGlobalResults(null)
        setRecoveredMaterialsState([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parameters),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Error fetching simulation report: ${response.status}`)
        }

        const data = (await response.json()) as BackendReportResponse
        const dailyReports = data.dailyReports ?? []
        const batchReports = data.batchReports ?? []

        const normalizedDays = dailyReports.map((day, index) =>
          normalizeDailyReportDay(day, { num_dia: 0, disp_dia: 0, cant_HDD3_dia: 0, cant_HDD2_dia: 0, cant_SSD2_dia: 0, cant_SSDM_dia: 0, cant_CD_dia: 0, peso_total_dia: 0, ocup_maq_1_dia: 0, ocup_maq_2_dia: 0, ocup_maq_3_dia: 0 }),
        )

        const normalizedLots = batchReports.map((lot, index) =>
          normalizeBatchReportLot(lot, { num_dia: 0, num_lote: 0, disp_lote: 0, cant_HDD3: 0, cant_HDD2: 0, cant_SSD2: 0, cant_SSDM: 0, cant_CD: 0, peso_total_lote: 0, tiempo_trit_lote: "", tiempo_separ_lote: "", tiempo_proces_lote: "", maq_limite: 0, maq_uso: 0, maq_libre: 0 }),
        )

        const finalDays = normalizedDays
        const finalLots = normalizedLots

        setDailyReportDays(finalDays)
        setBatchReportLots(finalLots)
        setGlobalResults(normalizeGlobalResults(data.globalResults))
        setRecoveredMaterialsState(normalizeRecoveredMaterials(data.recoveredMaterials))
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        setDailyReportDays([])
        setBatchReportLots([])
        setGlobalResults(null)
        setRecoveredMaterialsState([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadBackendReport()

    return () => {
      controller.abort()
    }
  }, [isReady, parameters])

  return (
    <DashboardLayout simulationStatus="completed">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Resultados Globales de Simulación</h1>
            <p className="text-muted-foreground">
              Centro de control analítico - Métricas de rendimiento y recuperación
            </p>
          </div>
        </div>

        <SectionCard
          title="Parámetros de la simulación"
          description="Datos enviados desde la pantalla de configuración"
          icon={Settings}
        >
          {parameters ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cantidad de días</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{parameters.cantDias}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Horas laborales por día</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{parameters.horasLabDia}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Capacidad de máquina</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{parameters.capacidadMaq}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tiempo camión</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{parameters.tiempoCam}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Dispositivos por lote</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{parameters.dispLote}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Trituradoras</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{parameters.cantTrituradoras}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/50 bg-background/40 p-4 text-sm text-muted-foreground">
              No hay parámetros guardados en el contexto. Volvé a la configuración para ejecutar una nueva simulación.
            </div>
          )}
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Total Procesados"
            value={hasGlobalResults ? globalResults.disp_total.toLocaleString() : emptyStateLabel}
            subtitle="Dispositivos totales"
            icon={HardDrive}
            variant="accent"
          />
          <KPICard
            title="Desperdicio No Recuperable"
            value={hasGlobalResults ? `${globalResults.peso_desper.toLocaleString()} kg` : emptyStateLabel}
            subtitle="Material no reciclable"
            icon={Flame}
            variant="warning"
          />
          <KPICard
            title="Tasa de Reciclaje"
            value={hasGlobalResults ? `${globalResults.recic_efectivo}%` : emptyStateLabel}
            subtitle="Eficiencia efectiva"
            icon={Recycle}
            variant="success"
          />
          <KPICard
            title="Día Pico Congestión"
            value={hasGlobalResults ? globalResults.dia_maj_cong : emptyStateLabel}
            subtitle={hasGlobalResults ? `${globalResults.disp_dia_maj.toLocaleString()} dispositivos` : emptyStateLabel}
            icon={AlertTriangle}
            variant="default"
          />
          <KPICard
            title="Material Recuperado"
            value={recoveredMaterialsState.length > 0 ? `${(totalMaterialRecovered / 1000).toFixed(1)} Ton` : emptyStateLabel}
            subtitle="Total extraído"
            icon={Scale}
            variant="accent"
          />
        </div>

        <SectionCard
          title="Materiales Recuperados"
          description="Visualización detallada de materiales extraídos para reciclaje"
          icon={Recycle}
        >
          <Tabs defaultValue="bars" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="bars">Barras</TabsTrigger>
              <TabsTrigger value="pie">Torta</TabsTrigger>
              <TabsTrigger value="cards">Tarjetas</TabsTrigger>
            </TabsList>

            <TabsContent value="bars">
              {recoveredMaterialsState.length > 0 ? (
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={recoveredMaterialsState}
                      layout="vertical"
                      margin={{ left: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" horizontal={false} />
                      <XAxis
                        type="number"
                        stroke="oklch(0.65 0.02 250)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="oklch(0.65 0.02 250)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.9333 0.1 335.12)",
                          border: "1px solid oklch(0.25 0.02 250)",
                          borderRadius: "8px",
                          color: "black",
                        }}
                        formatter={(value: number) => [`${value.toLocaleString()} kg`, "Cantidad"]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {recoveredMaterialsState.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-75 items-center justify-center rounded-lg border border-dashed border-border/50 text-sm text-muted-foreground">
                  {emptyStateLabel}
                </div>
              )}
            </TabsContent>
            <TabsContent value="pie">
              {recoveredMaterialsState.length > 0 ? (
                <div className="flex items-center gap-8">
                  <div className="h-70 w-70">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={recoveredMaterialsState}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={110}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {recoveredMaterialsState.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "oklch(0.9333 0.1 335.12)",
                            border: "1px solid oklch(0.25 0.02 250)",
                            borderRadius: "8px",
                            color: "black",
                          }}
                          formatter={(value: number) => [`${value.toLocaleString()} kg`, "Cantidad"]}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {recoveredMaterialsState.map((material) => (
                      <div key={material.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded"
                            style={{ backgroundColor: material.color }}
                          />
                          <span className="font-medium">{material.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{material.value.toLocaleString()}</span>
                          <span className="ml-1 text-sm text-muted-foreground">{material.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-70 items-center justify-center rounded-lg border border-dashed border-border/50 text-sm text-muted-foreground">
                  {emptyStateLabel}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cards">
              {recoveredMaterialsState.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
                  {recoveredMaterialsState.map((material) => {
                    const Icon = material.icon
                    return (
                      <div
                        key={material.name}
                        className="rounded-xl border border-border/50 bg-linear-to-br from-secondary/30 to-secondary/10 p-4 text-center"
                      >
                        <div
                          className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${material.color}20` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: material.color }} />
                        </div>
                        <p className="text-2xl font-bold" style={{ color: material.color }}>
                          {material.value >= 1000
                            ? `${(material.value / 1000).toFixed(1)}T`
                            : material.value.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{material.unit}</p>
                        <p className="mt-1 text-sm font-medium">{material.name}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border/50 p-6 text-sm text-muted-foreground">
                  {emptyStateLabel}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SectionCard>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resultados Diarios</h1>
          <p className="text-muted-foreground">
            Análisis detallado por día de operación - Volumen, peso y ocupación de máquinas
          </p>
        </div>

        {dailyReportDays.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/50 p-6 text-sm text-muted-foreground">
            {emptyStateLabel}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {dailyReportDays.map((day) => (
              <div
                key={day.num_dia}
                className="rounded-xl border border-border/50 bg-linear-to-br from-secondary/30 to-secondary/10 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Día</p>
                    <h3 className="text-lg font-semibold">{formatDayValue(day.num_dia)}</h3>
                  </div>
                  <Button
                    variant="outline"
                    className="hover:text-red-500"
                    size="sm"
                    onClick={() => openDayLots(day.num_dia)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Ver lotes
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <KPICard title="Cantidad de dispositivos" value={formatDayValue(day.disp_dia)} icon={HardDrive} variant="accent" />
                  <KPICard title=' Cantidad HDD 3,5"' value={formatDayValue(day.cant_HDD3_dia)} icon={HardDrive} variant="default" />
                  <KPICard title='Cantidad HDD 2,5"' value={formatDayValue(day.cant_HDD2_dia)} icon={HardDrive} variant="default" />
                  <KPICard title='Cantidad SSD 2,5"' value={formatDayValue(day.cant_SSD2_dia)} icon={Cpu} variant="success" />
                  <KPICard title="Cantidad SSD M2" value={formatDayValue(day.cant_SSDM_dia)} icon={Cpu} variant="success" />
                  <KPICard title="Cantidad DVD/CD" value={formatDayValue(day.cant_CD_dia)} icon={Shield} variant="warning" />
                  <KPICard title="Peso neto total" value={formatDayValue(day.peso_total_dia, " kg")} icon={Scale} variant="accent" />
                  <KPICard title="Ocupación Trituradora 1" value={formatDayValue(day.ocup_maq_1_dia, "%")} icon={Gauge} variant="success" />
                  <KPICard title="Ocupación Trituradora 2" value={formatDayValue(day.ocup_maq_2_dia, "%")} icon={Gauge} variant="default" />
                  <KPICard title="Ocupación Trituradora 3" value={formatDayValue(day.ocup_maq_3_dia, "%")} icon={Gauge} variant="warning" />
                </div>
              </div>
            ))}
          </div>
        )}
        <Dialog open={selectedDayNumber !== null} onOpenChange={(open) => setSelectedDayNumber(open ? selectedDayNumber : null)}>
          <DialogContent
            className="overflow-y-auto"
            style={{ width: "96vw", maxWidth: "96vw", maxHeight: "92vh" }}
          >
            <DialogHeader>
              <DialogTitle>
                Lotes del día {selectedDay ? formatDayValue(selectedDay.num_dia) : ""}
              </DialogTitle>
              <DialogDescription>
                {selectedDay
                  ? `Volumen, tiempos y ocupación de trituradoras para el día ${formatDayValue(selectedDay.num_dia)}`
                  : "Detalle de los lotes asociados al día seleccionado"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              {selectedDayLots.length > 0 ? (
                selectedDayLots.map((lot) => (
                  <div
                    key={lot.num_lote}
                    className="rounded-xl border border-border/50 bg-linear-to-br from-secondary/30 to-secondary/10 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-accent" />
                        <span className="font-medium">Lote {formatDayValue(lot.num_lote)}</span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <KPICard title="Cantidad de Unidades en el lote" value={formatDayValue(lot.disp_lote)} icon={HardDrive} variant="accent" />
                      <KPICard title='Cantidad de HDD 3,5"' value={formatDayValue(lot.cant_HDD3)} icon={HardDrive} variant="default" />
                      <KPICard title='Cantidad de HDD 2,5"' value={formatDayValue(lot.cant_HDD2)} icon={HardDrive} variant="default" />
                      <KPICard title='Cantidad de SSD 2,5"' value={formatDayValue(lot.cant_SSD2)} icon={Cpu} variant="success" />
                      <KPICard title="Cantidad de SSD M2" value={formatDayValue(lot.cant_SSDM)} icon={Cpu} variant="success" />
                      <KPICard title="Cantidad de DVD/CD" value={formatDayValue(lot.cant_CD)} icon={Shield} variant="warning" />
                      <KPICard title="Peso neto total del lote (KG)" value={formatDayValue(lot.peso_total_lote, " kg")} icon={Scale} variant="accent" />
                      <KPICard title="Tiempo total de triturado" value={lot.tiempo_trit_lote} icon={Timer} variant="success" />
                      <KPICard title="Tiempo total de separado del lote" value={lot.tiempo_separ_lote} icon={Timer} variant="default" />
                      <KPICard title="Tiempo total de procesamiento del lote" value={lot.tiempo_proces_lote} icon={Timer} variant="accent" />
                      <KPICard title="Cantidad de trituradoras al límite de capacidad" value={formatDayValue(lot.maq_limite)} icon={Gauge} variant="warning" />
                      <KPICard title="Cantidad de trituradoras en uso" value={formatDayValue(lot.maq_uso)} icon={Activity} variant="success" />
                      <KPICard title="Cantidad de trituradoras libres" value={formatDayValue(lot.maq_libre)} icon={Activity} variant="default" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-border/50 bg-card/60 p-6 text-sm text-muted-foreground md:col-span-2">
                  No hay lotes para este día.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
