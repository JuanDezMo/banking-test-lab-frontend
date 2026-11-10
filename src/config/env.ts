// Variables de entorno de la app (Vite solo expone las que empiezan con VITE_)
export const env = {
  // Prefijo de la API: en desarrollo el proxy de Vite reenvía /api a la API Go
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
} as const
