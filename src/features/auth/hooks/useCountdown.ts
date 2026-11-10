import { useEffect, useState } from 'react'

// Cuenta regresiva en segundos. start(n) la inicia; secondsLeft llega a 0 y se detiene.
export function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  return {
    secondsLeft,
    isRunning: secondsLeft > 0,
    start: (seconds: number) => setSecondsLeft(Math.max(0, Math.ceil(seconds))),
  }
}

// Formatea segundos como m:ss (por ejemplo 75 → "1:15")
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
