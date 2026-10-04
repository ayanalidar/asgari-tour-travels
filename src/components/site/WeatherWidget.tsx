"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Sunrise,
  Sunset,
  Loader2,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudSun,
  RefreshCw,
} from "lucide-react"

interface WeatherWidgetProps {
  latitude?: number | null
  longitude?: number | null
  destinationName: string
  altitude?: string | null
}

interface WeatherData {
  temperature: number
  windSpeed: number
  humidity: number
  weatherCode: number
  isDay: boolean
  apparentTemperature: number
  visibility?: number
  sunrise?: string
  sunset?: string
  maxTemp?: number
  minTemp?: number
}

// WMO weather code → description + icon
function describeWeather(code: number, isDay: boolean): { label: string; icon: React.ReactNode; color: string } {
  if (code === 0) return { label: isDay ? "Clear sky" : "Clear", icon: <Sun className="size-5" />, color: "text-amber-400" }
  if (code <= 2) return { label: "Partly cloudy", icon: <CloudSun className="size-5" />, color: "text-amber-300" }
  if (code <= 48) return { label: "Foggy", icon: <CloudFog className="size-5" />, color: "text-slate-300" }
  if (code <= 57) return { label: "Drizzle", icon: <CloudRain className="size-5" />, color: "text-sky-300" }
  if (code <= 67) return { label: "Rainy", icon: <CloudRain className="size-5" />, color: "text-sky-400" }
  if (code <= 77) return { label: "Snowy", icon: <CloudSnow className="size-5" />, color: "text-sky-200" }
  if (code <= 82) return { label: "Rain showers", icon: <CloudRain className="size-5" />, color: "text-sky-400" }
  if (code <= 86) return { label: "Snow showers", icon: <CloudSnow className="size-5" />, color: "text-sky-200" }
  if (code >= 95) return { label: "Thunderstorm", icon: <CloudRain className="size-5" />, color: "text-purple-300" }
  return { label: "Cloudy", icon: <Cloud className="size-5" />, color: "text-slate-300" }
}

export function WeatherWidget({ latitude, longitude, destinationName, altitude }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchWeather = async (silent = false) => {
    if (!latitude || !longitude) {
      setError("Location coordinates not available")
      setLoading(false)
      return
    }
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,visibility&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia/Kolkata&forecast_days=1`
      )
      if (!res.ok) throw new Error("Weather API failed")
      const data = await res.json()
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        apparentTemperature: Math.round(data.current.apparent_temperature),
        visibility: data.current.visibility ? Math.round(data.current.visibility / 1000) : undefined,
        sunrise: data.daily?.sunrise?.[0],
        sunset: data.daily?.sunset?.[0],
        maxTemp: data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : undefined,
        minTemp: data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : undefined,
      })
      setError(null)
    } catch (e: any) {
      setError("Unable to load weather")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => fetchWeather(true), 600000)
    return () => clearInterval(interval)
  }, [latitude, longitude])

  const formatTime = (iso?: string) => {
    if (!iso) return null
    try {
      return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    } catch {
      return null
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl glass-strong p-5">
      <div className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <Thermometer className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold leading-tight">Live Weather</h3>
              <p className="text-[10px] text-muted-foreground">{destinationName}</p>
            </div>
          </div>
          <button
            onClick={() => fetchWeather(true)}
            disabled={refreshing}
            className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-background/60 hover:text-primary disabled:opacity-50"
            aria-label="Refresh weather"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">Fetching live weather...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <Cloud className="mx-auto size-6 text-muted-foreground/50" />
            <p className="mt-2 text-xs text-muted-foreground">{error}</p>
            <p className="text-[10px] text-muted-foreground/70">
              {altitude ? `Altitude: ${altitude}` : ""}
            </p>
          </div>
        ) : weather ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Main temp display */}
            <div className="flex items-center gap-4">
              <div className={`flex flex-col items-center ${describeWeather(weather.weatherCode, weather.isDay).color}`}>
                {describeWeather(weather.weatherCode, weather.isDay).icon}
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold gradient-text-saffron">
                    {weather.temperature}°
                  </span>
                  <span className="text-lg text-muted-foreground">C</span>
                </div>
                <p className="text-xs font-medium text-foreground/80">
                  {describeWeather(weather.weatherCode, weather.isDay).label}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Feels like {weather.apparentTemperature}°C
                </p>
              </div>
              <div className="ml-auto text-right">
                {weather.maxTemp !== undefined && weather.minTemp !== undefined && (
                  <>
                    <p className="text-xs font-semibold text-rose-300">↑ {weather.maxTemp}°</p>
                    <p className="text-xs font-semibold text-sky-300">↓ {weather.minTemp}°</p>
                  </>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <WeatherStat
                icon={<Wind className="size-3" />}
                label="Wind"
                value={`${weather.windSpeed} km/h`}
              />
              <WeatherStat
                icon={<Droplets className="size-3" />}
                label="Humidity"
                value={`${weather.humidity}%`}
              />
              {weather.visibility !== undefined && (
                <WeatherStat
                  icon={<Eye className="size-3" />}
                  label="Visibility"
                  value={`${weather.visibility} km`}
                />
              )}
            </div>

            {/* Sunrise/Sunset */}
            {(weather.sunrise || weather.sunset) && (
              <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-[10px] text-muted-foreground">
                {weather.sunrise && (
                  <span className="flex items-center gap-1">
                    <Sunrise className="size-3 text-amber-400" />
                    {formatTime(weather.sunrise)}
                  </span>
                )}
                <span className="text-primary/60">•</span>
                {weather.sunset && (
                  <span className="flex items-center gap-1">
                    <Sunset className="size-3 text-rose-400" />
                    {formatTime(weather.sunset)}
                  </span>
                )}
              </div>
            )}

            <p className="mt-2 text-center text-[9px] text-muted-foreground/60">
              Updates every 10 min · Open-Meteo
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/30 p-2 text-center">
      <span className="mb-0.5 flex items-center justify-center gap-1 text-primary">
        {icon}
      </span>
      <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="block text-[11px] font-semibold">{value}</span>
    </div>
  )
}
