# Banking Frontend Lab: stack y arquitectura

2026-11-10 · Versión editable: https://claude.ai/artifact/JSV7TQcPi5TjsUzhLTRC8K

## Objetivo y alcance

Web bancaria sencilla y responsive que consume la API Go existente (`go_accounts_api`, puerto 3000), pensada para aprender React y TypeScript con una arquitectura por capas.

- **Funcionalidades:** registro, login, refresh y logout; crear, listar y consultar cuentas; transferir; historial paginado; recarga (rol `operator`).
- **Errores:** se muestran los `code` y `message` del backend (`funcionalidades-y-errores.md`, sección 4.3).
- **Reglas del proyecto:** código en inglés, comentarios en español, sin commits por parte de Claude, revisión del usuario al final de cada iteración.
- **Fuera de alcance:** Playwright. Será un proyecto independiente, planificado en la iteración final.

## Stack y librerías

El stack base es pnpm + TypeScript + React + Tailwind + shadcn/ui; el resto son adiciones mínimas, cada una con un único propósito.

| Librería                         | Categoría           | Para qué se usa                                                                                                                                   | Capa donde vive                   |
| -------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| pnpm                             | Gestor de paquetes  | Instalar dependencias y ejecutar scripts                                                                                                          | Proyecto                          |
| TypeScript 5.9 (strict)          | Lenguaje            | Tipado estático de todo el código (5.9 y no 7 por compatibilidad con typescript-eslint y openapi-typescript)                                      | Todas                             |
| Vite                             | Build y dev server  | Servidor de desarrollo rápido; su proxy reenvía `/api` a `localhost:3000` porque la API no tiene CORS                                             | Proyecto                          |
| React 19                         | UI                  | Componentes y hooks                                                                                                                               | Presentación                      |
| Tailwind CSS v4                  | Estilos             | Clases utilitarias y diseño responsive mobile-first                                                                                               | Presentación                      |
| shadcn/ui                        | Componentes         | Button, Input, Field, Card, Table, Dialog, Sheet, Select, Badge, Skeleton; código copiado al proyecto y editable                                  | Presentación (`components/ui`)    |
| lucide-react                     | Íconos              | Íconos usados por shadcn                                                                                                                          | Presentación                      |
| sonner                           | Notificaciones      | Toasts de éxito y error                                                                                                                           | Presentación                      |
| React Router v8                  | Rutas               | Páginas, rutas protegidas por sesión y por rol                                                                                                    | Aplicación (`app/router`)         |
| TanStack Query v5                | Estado del servidor | Peticiones, caché, carga, error, reintentos, paginación e invalidación tras transferir                                                            | Hooks                             |
| Zustand                          | Estado del cliente  | Sesión (tokens, usuario, rol) con `persist` en `sessionStorage`; preferencias de UI                                                               | Store                             |
| React Hook Form                  | Formularios         | Estado y envío de formularios sin re-renders innecesarios                                                                                         | Presentación                      |
| Zod                              | Validación          | Esquemas que replican las reglas del backend; los tipos de formulario se infieren de ellos                                                        | Dominio (`schemas.ts`)            |
| @hookform/resolvers              | Integración         | Conecta Zod con React Hook Form                                                                                                                   | Presentación                      |
| fetch (nativo)                   | HTTP                | `httpClient` propio sobre `fetch`: agrega el Bearer, renueva el token ante 401 y convierte errores en `ApiError`. Sin dependencias, más didáctico | Infraestructura (`lib/http`)      |
| openapi-typescript               | Tipos               | Genera los tipos de la API desde `openapi.yaml` (dependencia de desarrollo)                                                                       | Infraestructura (`lib/api-types`) |
| `crypto.randomUUID()` (nativo)   | Utilidad            | Generar el `Idempotency-Key` de transferencias y recargas                                                                                         | Servicios                         |
| date-fns                         | Utilidad            | Formatear fechas ISO 8601 UTC                                                                                                                     | `lib/date.ts`                     |
| ESLint + Prettier                | Calidad             | Reglas de estilo y formato; eslint-plugin-boundaries hace cumplir la regla de capas                                                               | Proyecto                          |
| Vitest + Testing Library + jsdom | Pruebas unitarias   | Probar utilidades (`money`, `errors`), servicios con repositorios falsos y componentes                                                            | `*.test.ts(x)` junto al archivo   |

Diseño visual: tokens en `src/index.css` (claro y `.dark`), tipografía Manrope, contrato de diseño en `.impeccable/surfaces/` y producto en `PRODUCT.md`.

Los montos viajan en centavos enteros: `lib/money.ts` convierte entre centavos y texto con formato, sin usar decimales en la lógica.

## Arquitectura por capas

Siete capas apiladas con dependencias en un solo sentido: hacia abajo. Las transversales no dependen de nadie.

```
  llama ↓                          ↑ datos o ApiError
┌──────────────────────────────────────────────┐   ┌───────────────────────────┐
│ 1. App · src/app                             │   │ Transversales             │
│    Providers, rutas, layouts, guardas        │   │ (importables desde        │
├──────────────────────────────────────────────┤   │  cualquier capa)          │
│ 2. Pages · src/pages                         │   │                           │
│    Una pantalla por ruta                     │   │ Store · src/store         │
├──────────────────────────────────────────────┤   │   Zustand: tokens y rol   │
│ 3. Components · features/*/components        │   │                           │
│    Muestran datos y capturan eventos         │   │ Domain · types.ts,        │
├──────────────────────────────────────────────┤   │   schemas.ts (Zod)        │
│ 4. Hooks · features/*/hooks                  │   │                           │
│    TanStack Query: data, isPending, error    │   │ Config · src/config       │
├──────────────────────────────────────────────┤   │   Rutas, env y límites    │
│ 5. Services · features/*/services            │   └───────────────────────────┘
│    Casos de uso: centavos, Idempotency-Key   │
├──────────────────────────────────────────────┤
│ 6. Api (repositorios) · features/*/api       │
│    Una función por endpoint                  │
├──────────────────────────────────────────────┤
│ 7. Infraestructura · src/lib                 │
│    httpClient (fetch), ApiError, formato     │
└──────────────────────────────────────────────┘
                       ↓ ↑
        API Go (externa) · localhost:3000 vía proxy de Vite en /api
```

Cada flecha hacia abajo es una llamada a función; cada flecha hacia arriba es un valor de retorno o un `ApiError`.

**Estructura de carpetas**

```
src/
├─ app/                 # 1. providers, router, layouts, guards
├─ pages/               # 2. LoginPage, DashboardPage, AccountDetailPage...
├─ components/
│  ├─ ui/               # shadcn (generado)
│  └─ shared/           # MoneyText, ErrorAlert, Pagination, EmptyState
├─ features/
│  ├─ auth/
│  ├─ accounts/
│  │  ├─ components/     # 3. AccountCard, CreateAccountDialog
│  │  ├─ hooks/          # 4. useAccounts, useCreateAccount
│  │  ├─ services/       # 5. accountService.ts
│  │  ├─ api/            # 6. accountApi.ts (implementa AccountRepository)
│  │  ├─ types.ts        # Account, AccountType, AccountRepository
│  │  └─ schemas.ts      # esquemas Zod
│  ├─ transfers/
│  ├─ movements/
│  └─ recharge/
├─ lib/                 # 7. http/, errors.ts, money.ts, date.ts, api-types.ts
├─ store/               # authStore.ts
└─ config/              # routes.ts, env.ts, limits.ts, money.ts
```

## Responsabilidad de cada capa

Cada capa solo conoce a la capa inmediatamente inferior; ninguna capa inferior importa de una superior.

| Capa                                   | Carpeta                                       | Responsabilidad                                                                                           | Puede                                        | No puede                                   |
| -------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------ |
| 1. App (composición)                   | `src/app`                                     | Arrancar la aplicación: providers (QueryClient, Router, Toaster), rutas, layouts, guardas de sesión y rol | Importar páginas y configurar librerías      | Tener lógica de negocio o llamar a la API  |
| 2. Pages (presentación)                | `src/pages`                                   | Una pantalla por ruta; ensambla componentes de features                                                   | Leer parámetros de URL, componer componentes | Llamar a servicios o a la API directamente |
| 3. Components (presentación)           | `src/features/*/components`, `src/components` | Mostrar datos y capturar eventos del usuario                                                              | Usar hooks, shadcn, React Hook Form          | Hacer `fetch`, conocer URLs o tokens       |
| 4. Hooks (lógica de vista)             | `src/features/*/hooks`                        | Conectar la UI con los servicios mediante TanStack Query; exponer `data`, `isPending`, `error`, `mutate`  | Usar servicios, stores y la caché de queries | Renderizar JSX o hacer HTTP directamente   |
| 5. Services (casos de uso)             | `src/features/*/services`                     | Reglas del frontend: convertir montos, generar `Idempotency-Key`, mapear DTOs a modelos                   | Usar repositorios (interfaces)               | Conocer React ni HTTP                      |
| 6. Api / Repositories (acceso a datos) | `src/features/*/api`                          | Implementar la interfaz del repositorio con peticiones HTTP a un endpoint                                 | Usar `httpClient` y los tipos generados      | Tener reglas de negocio                    |
| 7. Infraestructura compartida          | `src/lib`                                     | `httpClient`, `ApiError`, mapeo de errores, formato de dinero y fechas                                    | Usar librerías externas                      | Importar features                          |
| Transversal: Store                     | `src/store`                                   | Estado global del cliente (sesión) con Zustand                                                            | Persistir en `sessionStorage`                | Hacer peticiones HTTP                      |
| Transversal: Domain                    | `src/features/*/types.ts`, `schemas.ts`       | Tipos del modelo (`Account`, `Movement`) y esquemas Zod                                                   | Ser importado por cualquier capa             | Depender de otras capas                    |
| Transversal: Config                    | `src/config`                                  | Rutas, variables de entorno, límites de negocio (300000 centavos en efectivo, 20 por página)              | Ser importado por cualquier capa             | Depender de otras capas                    |

## Comunicación entre capas

La comunicación baja por llamadas a funciones y sube por valores de retorno o errores tipados; la UI nunca ve un error HTTP crudo.

**Ejemplo: una transferencia**

1. `TransferForm` (componente) valida con Zod y llama a `mutate(values)`.
2. `useTransfer` (hook) ejecuta `transferService.transfer(values)` con `useMutation`.
3. `transferService` convierte el monto a centavos, genera el `Idempotency-Key` y llama a `transferRepository.create(dto, key)`.
4. `transferApi` (repositorio) hace `POST /transfers` con `httpClient`.
5. `httpClient` agrega `Authorization: Bearer <token>` desde `authStore` y envía la petición.
6. **Éxito:** el hook invalida las queries `accounts` y `movements`, y la UI muestra un toast.
7. **Error:** `httpClient` crea un `ApiError { status, code, message }`; el componente lo pasa a `errors.ts`, que decide si va en un campo del formulario o en una alerta general.

**Renovación del token**

- Ante un `401 UNAUTHORIZED`, `httpClient` llama una sola vez a `POST /auth/refresh` y repite la petición original.
- Varias peticiones simultáneas comparten la misma renovación (una promesa en curso).
- Si el refresh responde `401 INVALID_REFRESH_TOKEN`, se limpia `authStore` y se redirige a `/login`.

**Mapeo de errores**

| Origen               | Ejemplo                                          | Dónde se muestra                                  |
| -------------------- | ------------------------------------------------ | ------------------------------------------------- |
| 400 de validación    | `Invalid email`, `Password too short`            | Mensaje bajo el campo correspondiente             |
| 409 / 422 de negocio | `EMAIL_ALREADY_REGISTERED`, `INSUFFICIENT_FUNDS` | Alerta en el formulario                           |
| 429                  | `TOO_MANY_REQUESTS` + `Retry-After`              | Alerta con cuenta regresiva y botón deshabilitado |
| 404                  | `NOT_FOUND` en detalle de cuenta                 | Estado vacío "Account not found"                  |
| 500 o red            | `INTERNAL_ERROR`                                 | Toast genérico                                    |

## SOLID y escalabilidad

| Principio                     | Cómo se aplica                                                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S — Responsabilidad única     | Cada capa y cada archivo tiene un solo motivo de cambio: `accountApi` cambia si cambia el endpoint; `AccountCard` si cambia el diseño                                      |
| O — Abierto/cerrado           | Un nuevo dominio (por ejemplo, bloqueo de cuentas) es una carpeta nueva en `features/`; los componentes de shadcn se extienden por composición con `variant` y `className` |
| L — Sustitución de Liskov     | Cualquier implementación de `AccountRepository` (HTTP o en memoria para pruebas) funciona igual para el servicio                                                           |
| I — Segregación de interfaces | Interfaces pequeñas por dominio (`AuthRepository`, `AccountRepository`, `TransferRepository`), no un `ApiService` gigante                                                  |
| D — Inversión de dependencias | Los servicios reciben el repositorio por parámetro (`createAccountService(repo)`); la composición concreta se hace en un solo lugar por feature                            |

**Escalabilidad:** las features no se importan entre sí; lo compartido sube a `components/shared` o `lib`. Una feature nueva repite la misma estructura de carpetas.

## Convenciones

- **Idioma:** identificadores, archivos y textos de la UI en inglés; comentarios en español.
- **Nombres:** componentes en `PascalCase.tsx`; hooks `useX.ts`; servicios `xService.ts`; repositorios `xApi.ts`; pruebas `x.test.ts`.
- **Imports:** alias `@/` hacia `src/`; regla de ESLint que impide importar de una capa superior.
- **Tipos:** sin `any`; DTOs generados desde `openapi.yaml` y modelos propios en `types.ts`.
- **Responsive:** mobile-first con los breakpoints `sm`, `md` y `lg`; menú en `Sheet` en móvil y sidebar en escritorio; tabla de movimientos en escritorio y tarjetas en móvil.

## Soporte para todos los tipos de localizador

La UI se construye para que el futuro proyecto de Playwright pueda practicar cada estrategia de localización sin tocar este código.

| Localizador         | Qué debe ofrecer la UI                                                                                | Ejemplo                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `getByRole`         | HTML semántico: `button`, `a`, `h1`–`h3`, `table`, `nav`, `main`, `dialog`; nombres accesibles únicos | `<h1>My accounts</h1>`                       |
| `getByLabel`        | Cada input con `<Label htmlFor>`; `aria-label` en botones de solo ícono                               | `<Label htmlFor="email">Email</Label>`       |
| `getByPlaceholder`  | Placeholders descriptivos en inputs                                                                   | `placeholder="0012345678"`                   |
| `getByText`         | Textos visibles estables; mensajes de error del backend sin alterar                                   | `Insufficient funds`                         |
| `getByAltText`      | `alt` en el logo y en imágenes                                                                        | `alt="Bank Lab logo"`                        |
| `getByTitle`        | `title` en íconos informativos y en el número de cuenta truncado                                      | `title="Copy account number"`                |
| `getByTestId`       | `data-testid` en elementos dinámicos o repetidos, en kebab-case                                       | `data-testid="account-card-0012345678"`      |
| CSS                 | Clases semánticas estables además de Tailwind; `id` en formularios                                    | `.account-card`, `#transfer-form`            |
| XPath               | Estructura predecible (tablas con `thead`/`tbody`, listas `ul`/`li`)                                  | `//table//tr[td[text()='recharge']]`         |
| Atributos de estado | `aria-invalid`, `aria-disabled`, `aria-busy`, `data-state`, `aria-current="page"`                     | Aserciones de estado sin depender de estilos |
| Regiones vivas      | `role="alert"` en errores y `aria-live` en toasts y saldo                                             | Esperar mensajes asíncronos                  |

**Regla:** `data-testid` es un atributo adicional, nunca un sustituto de roles y labels correctos.

## Decisiones tomadas

| Tema              | Decisión                                                                                                                                                                                                                                                                                                             | Motivo                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Idioma de la UI   | Inglés                                                                                                                                                                                                                                                                                                               | Coincide con los mensajes del backend                                                                                |
| Dinero            | El estado y la API usan centavos enteros (`number`); se muestran con `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` → `$1,500.00`. El input acepta hasta 2 decimales y se convierte a centavos procesando el texto, sin multiplicar floats. Locale y moneda configurables en `config/money.ts` | El backend maneja una sola moneda sin código y montos enteros en centavos (RN-01, I-01)                              |
| Tokens            | Zustand `persist` en `sessionStorage`: sobrevive a recargar la página y se borra al cerrar la pestaña                                                                                                                                                                                                                | Menos exposición que `localStorage`; httpOnly cookies no son posibles porque la API devuelve los tokens en el cuerpo |
| HTTP              | `fetch` nativo envuelto en `httpClient`                                                                                                                                                                                                                                                                              | Didáctico, sin dependencias                                                                                          |
| Pruebas unitarias | Vitest + Testing Library                                                                                                                                                                                                                                                                                             | Confirmado                                                                                                           |
| `data-testid`     | Sí, junto con soporte para todos los localizadores (sección anterior)                                                                                                                                                                                                                                                | Confirmado                                                                                                           |
| Operador          | Consulta de cuentas por id y recarga por número; sin listado                                                                                                                                                                                                                                                         | Limitación aceptada de la API                                                                                        |
