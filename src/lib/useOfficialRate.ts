"use client"
import { useEffect, useState } from "react"

// Cotización oficial (venta) de DolarApi. Se pide una sola vez y se comparte entre todos los componentes.
let request: Promise<number | null> | null = null

function fetchOfficialRate(): Promise<number | null> {
  request ??= fetch("https://dolarapi.com/v1/dolares/oficial")
    .then(response => response.json())
    .then((data: { venta?: number }) => (typeof data.venta === "number" ? data.venta : null))
    .catch(() => {
      request = null
      return null
    })
  return request
}

export function useOfficialRate(enabled = true): number | null {
  const [rate, setRate] = useState<number | null>(null)
  useEffect(() => {
    if (!enabled) return
    let active = true
    fetchOfficialRate().then(value => active && setRate(value))
    return () => {
      active = false
    }
  }, [enabled])
  return rate
}
