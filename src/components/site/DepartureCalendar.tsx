"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Users, ChevronLeft, ChevronRight, Check, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Departure {
  id: string
  date: string // ISO date
  packageTitle: string
  packageSlug: string
  region: "kashmir" | "ladakh"
  seatsTotal: number
  seatsFilled: number
  price: number
  durationNights: number
}

interface DepartureCalendarProps {
  departures: Departure[]
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAYS = ["S", "M", "T", "W", "T", "F", "S"]

export function DepartureCalendar({ departures }: DepartureCalendarProps) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Group departures by date
  const departuresByDate = useMemo(() => {
    const map = new Map<string, Departure[]>()
    departures.forEach((d) => {
      const dateKey = d.date.slice(0, 10)
      if (!map.has(dateKey)) map.set(dateKey, [])
      map.get(dateKey)!.push(d)
    })
    return map
  }, [departures])

  // Calendar grid
  const calendar = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0)
    const startPad = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const cells: { date: string | null; day: number | null; departures: Departure[] }[] = []
    for (let i = 0; i < startPad; i++) {
      cells.push({ date: null, day: null, departures: [] })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      cells.push({
        date: dateStr,
        day: d,
        departures: departuresByDate.get(dateStr) || [],
      })
    }
    return cells
  }, [viewMonth, viewYear, departuresByDate])

  const navigateMonth = (dir: -1 | 1) => {
    let m = viewMonth + dir
    let y = viewYear
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setViewMonth(m)
    setViewYear(y)
    setSelectedDate(null)
  }

  const selectedDepartures = selectedDate ? departuresByDate.get(selectedDate) || [] : []
  const totalDeparturesInMonth = calendar.reduce((sum, c) => sum + c.departures.length, 0)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <div className="lg:col-span-2 rounded-3xl glass-strong p-5 sm:p-6">
        <div className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                <Calendar className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold leading-tight">Departure Calendar</h3>
                <p className="text-[10px] text-muted-foreground">
                  {totalDeparturesInMonth} departures this month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="grid size-8 place-items-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:text-primary"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="min-w-24 text-center text-sm font-bold">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="grid size-8 place-items-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:text-primary"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendar.map((cell, i) => {
              const hasDep = cell.departures.length > 0
              const isSelected = cell.date === selectedDate
              const isToday = cell.date === today.toISOString().slice(0, 10)
              return (
                <button
                  key={i}
                  disabled={!cell.date}
                  onClick={() => cell.date && setSelectedDate(isSelected ? null : cell.date)}
                  className={`relative aspect-square rounded-lg border p-1 text-left transition-all ${
                    !cell.date
                      ? "border-transparent"
                      : isSelected
                      ? "border-primary bg-primary/15"
                      : hasDep
                      ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                      : "border-border/40 bg-background/20 hover:border-border/60"
                  }`}
                >
                  {cell.day && (
                    <>
                      <span className={`text-xs font-medium ${hasDep ? "text-primary" : "text-muted-foreground"}`}>
                        {cell.day}
                      </span>
                      {isToday && (
                        <span className="absolute right-1 top-1 size-1.5 rounded-full bg-accent" />
                      )}
                      {hasDep && (
                        <div className="absolute bottom-1 left-1 flex gap-0.5">
                          {cell.departures.slice(0, 3).map((d) => (
                            <span
                              key={d.id}
                              className={`size-1.5 rounded-full ${
                                d.region === "kashmir" ? "bg-primary" : "bg-accent"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" /> Kashmir departure
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accent" /> Ladakh departure
            </span>
          </div>
        </div>
      </div>

      {/* Selected date departures */}
      <div className="rounded-3xl glass p-5">
        <h4 className="font-display text-sm font-bold mb-3">
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : "Select a date"}
        </h4>
        <AnimatePresence mode="wait">
          {selectedDepartures.length > 0 ? (
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {selectedDepartures.map((dep) => {
                const seatsLeft = dep.seatsTotal - dep.seatsFilled
                const fillPct = (dep.seatsFilled / dep.seatsTotal) * 100
                return (
                  <div key={dep.id} className="rounded-xl border border-border/40 bg-background/30 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className={dep.region === "kashmir" ? "border-primary/40 text-primary" : "border-accent/40 text-accent"}>
                        {dep.region}
                      </Badge>
                      <span className="text-xs font-bold text-primary">
                        ₹{dep.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <h5 className="mt-2 text-sm font-semibold leading-tight">{dep.packageTitle}</h5>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Clock className="size-2.5" /> {dep.durationNights}N
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Users className="size-2.5" /> {dep.seatsFilled}/{dep.seatsTotal} booked
                      </span>
                    </div>
                    {/* Seat bar */}
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${fillPct > 80 ? "bg-rose-400" : fillPct > 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[9px]">
                      <span className={seatsLeft <= 2 ? "text-rose-400 font-semibold" : "text-muted-foreground"}>
                        {seatsLeft <= 2 ? `Only ${seatsLeft} seats left!` : `${seatsLeft} seats available`}
                      </span>
                    </div>
                    <Button size="sm" className="btn-glow mt-2 w-full h-7 text-xs">
                      Join departure
                    </Button>
                  </div>
                )
              })}
            </motion.div>
          ) : (
            <div className="py-8 text-center">
              <Calendar className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedDate ? "No departures on this date" : "Click a highlighted date to see available departures"}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
