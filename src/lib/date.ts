import { format, isToday, isYesterday } from 'date-fns'

// Las fechas llegan en ISO 8601 UTC (I-09); se muestran en la hora local del navegador

// Etiqueta de día para agrupar movimientos: "Today", "Yesterday" o "Nov 9, 2026"
export function formatDayLabel(iso: string): string {
  const date = new Date(iso)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d, yyyy')
}

// Hora local: "10:42"
export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm')
}

// Fecha y hora completas: "Nov 9, 2026, 10:42"
export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy, HH:mm')
}

// Clave de día local (yyyy-MM-dd) para agrupar
export function dayKey(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd')
}
