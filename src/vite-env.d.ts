/// <reference types="vite/client" />

// Tipado de las variables de entorno propias
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
