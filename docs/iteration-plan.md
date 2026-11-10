# Banking Frontend Lab: plan de iteraciones

2026-11-10 · Versión editable: https://claude.ai/artifact/R4AMtad5FDK4sjz8w5eV9R

Nueve iteraciones cortas; cada una termina con una entrega funcional que el usuario revisa y commitea. Claude no hace commits.

## Resumen

| #   | Iteración           | Funcionalidades  | Entregable                                                       | Conceptos de React/TS                                |
| --- | ------------------- | ---------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| 0   | Setup               | —                | App vacía con layout responsive que arranca con `pnpm dev`       | Tooling, TS estricto, alias                          |
| 1   | Registro y login    | F-01, F-02       | Formularios funcionales con todos los errores del backend        | Componentes, props, formularios, Zod                 |
| 2   | Sesión              | F-03, F-04       | Sesión persistente, rutas protegidas, logout                     | Zustand, Router, interceptores                       |
| 3   | Cuentas             | F-05, F-06       | Dashboard con cuentas y creación                                 | TanStack Query, mutaciones, caché                    |
| 4   | Detalle e historial | F-07, F-10       | Detalle con historial paginado                                   | Parámetros de URL, paginación, uniones discriminadas |
| 5   | Transferencias      | F-09             | Transferencia con confirmación e idempotencia                    | Diálogos, invalidación, errores 422                  |
| 6   | Operador            | F-07, F-08, F-10 | Recarga y consulta de cuentas por operador                       | UI por rol, composición                              |
| 7   | Pulido              | —                | Modo oscuro, accesibilidad, estados vacíos y 404                 | Contexto de tema, accesibilidad                      |
| 8   | Plan Playwright     | —                | Documento de planificación del proyecto de pruebas independiente | —                                                    |

**Regla de cierre de cada iteración:** pruebas unitarias de lo nuevo; `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build` sin errores; prueba manual contra la API; notificación al usuario con el resumen de cambios para su revisión y commit. Cada componente nuevo cumple la guía de localizadores del documento de arquitectura.

## Iteración 0: setup

- [x] Crear proyecto con `pnpm create vite` (React + TypeScript) y activar `strict`
- [x] Configurar alias `@/` en `tsconfig` y `vite.config.ts`
- [x] Configurar proxy de Vite: `/api` → `http://localhost:3000`
- [x] Instalar Tailwind v4 e inicializar shadcn/ui (preset radix-nova: Button, Card, Input, Label, Field, Sheet, Sonner)
- [x] Instalar dependencias base: React Router, TanStack Query, Zustand, React Hook Form, Zod, date-fns
- [x] Configurar Vitest + Testing Library + jsdom y script `test`
- [x] Configurar ESLint + Prettier + eslint-plugin-boundaries (regla de capas) y scripts `lint`, `typecheck`, `format`
- [x] Generar tipos con `openapi-typescript` desde `openapi.yaml` (script `gen:api`)
- [x] Crear estructura de carpetas vacía según la arquitectura
- [x] `app/providers.tsx` con QueryClient y Toaster; `app/router.tsx` con página Home temporal
- [x] Layout responsive base: header, menú `Sheet` en móvil, contenedor centrado, con landmarks (`header`, `nav`, `main`)
- [x] `README.md` con cómo levantar API y frontend

**Terminado cuando:** `pnpm dev` muestra el layout en móvil y escritorio, y lint, typecheck y build pasan.

## Iteración 1: registro y login

- [x] `lib/http/httpClient.ts`: función `request<T>()` sobre `fetch` con base `/api`, JSON, query params y manejo de 204
- [x] `lib/http/ApiError.ts`: clase con `status`, `code`, `message` y `retryAfter`
- [x] `lib/errors.ts`: mapa de `message` del backend a campo de formulario (`Invalid email` → `email`)
- [x] `features/auth/types.ts`: `User`, `TokenPair`, `AuthRepository`
- [x] `features/auth/schemas.ts`: Zod con las reglas I-05 (name 1–100, email, password 8–128)
- [x] `features/auth/api/authApi.ts`: `register`, `login`
- [x] `features/auth/services/authService.ts`
- [x] Hooks `useRegister` y `useLogin` con `useMutation`
- [x] `RegisterForm` y `LoginForm` con errores por campo (`aria-invalid`, `aria-describedby`) y alerta general
- [x] Manejo de 429: alerta con cuenta regresiva desde `Retry-After` y botón deshabilitado
- [x] Páginas `/register` y `/login`; registro exitoso redirige a login con toast
- [x] `components/shared/ErrorAlert.tsx` con `role="alert"`
- [x] Pruebas: `httpClient`, `ApiError`, `errors.ts`, esquemas Zod

**Terminado cuando:** se ven todos los errores de F-01 y F-02 (400, 401, 409, 429) y un login exitoso devuelve tokens (aún sin guardarlos).

## Iteración 1.5: diseño visual

- [x] `PRODUCT.md` con usuarios, propósito, marca y accesibilidad (WCAG 2.2 AA)
- [x] Dirección visual elegida (estilo neobanco): bocetos en `.impeccable/mocks/round5/`
- [x] Tokens claro y oscuro en `src/index.css` (marca violeta `#5b3df5`, coral `#ff6b4a`, tinta `#121216`), tipografía Manrope
- [x] Logo Banking Test Lab, aviso "Test environment" y tarjeta virtual (`components/shared`)
- [x] `AuthLayout` (panel de marca + formulario) y `AppLayout` (sidebar en escritorio, pestañas en móvil)
- [x] Login y registro adaptados al nuevo estilo

**Terminado cuando:** login, registro y home se ven con el nuevo estilo en 390 y 1440 px.

## Iteración 2: sesión

- [ ] `store/authStore.ts` (Zustand + `persist` en `sessionStorage`): tokens, usuario derivado del JWT (`sub`, `role`), `setSession`, `clear`
- [ ] `lib/jwt.ts`: decodificar el payload del access token (sin validar firma)
- [ ] `httpClient`: agregar `Authorization: Bearer` a las peticiones protegidas
- [ ] `httpClient`: ante 401, un solo `POST /auth/refresh` compartido y reintento de la petición original
- [ ] Si el refresh falla, limpiar sesión y redirigir a `/login`
- [ ] `app/guards/ProtectedRoute.tsx` y `RoleRoute.tsx` (`customer`, `operator`)
- [ ] Redirección tras login según rol: customer → `/accounts`, operator → `/operator`
- [ ] Logout (`POST /auth/logout`) en el menú de usuario; limpia sesión y caché de queries
- [ ] Header con nombre de rol y menú de usuario
- [ ] Pruebas: `authStore`, `jwt.ts`, refresh concurrente en `httpClient`

**Terminado cuando:** la sesión sobrevive a recargar la página, un token vencido se renueva sin que el usuario lo note y las rutas rechazan al rol incorrecto.

## Iteración 3: cuentas

- [ ] `lib/money.ts`: `formatCents(150000)` → `$1,500.00` y `parseToCents("1500.00")` → `150000`, procesando el texto, sin aritmética de punto flotante; locale y moneda en `config/money.ts`; con pruebas unitarias
- [ ] `components/shared/MoneyText.tsx` (saldo negativo en rojo)
- [ ] `features/accounts`: types, `AccountRepository`, `accountApi` (`list`, `create`, `getById`), `accountService`
- [ ] Hooks `useAccounts` y `useCreateAccount` (invalida `['accounts']`)
- [ ] `AccountCard`: número, tipo (Badge), saldo y límite de sobregiro
- [ ] `CreateAccountDialog` con `Select` de `savings` o `checking`
- [ ] `DashboardPage`: grid responsive (1, 2 o 3 columnas), `Skeleton` en carga, estado vacío
- [ ] Copiar número de cuenta al portapapeles

**Terminado cuando:** un customer crea ambas cuentas y las ve con saldo 0, en móvil y escritorio.

## Iteración 4: detalle e historial

- [ ] Ruta `/accounts/:id`; `useAccount(id)` con 400 y 404 como estado "Account not found"
- [ ] `features/movements`: tipo `Movement` como unión discriminada por `movementType`
- [ ] `movementApi.list(accountId, page)` y `useMovements` con `placeholderData` para paginar sin parpadeo
- [ ] Página en la URL (`?page=2`) con `useSearchParams`
- [ ] `MovementsTable` (escritorio) y `MovementsList` de tarjetas (móvil)
- [ ] Signo y color por tipo: `recharge` y `transfer_in` suman, `transfer_out` resta
- [ ] `components/shared/Pagination.tsx`: anterior deshabilitado en página 1, siguiente deshabilitado si llegan menos de 20
- [ ] Fechas ISO UTC formateadas con date-fns en hora local

**Terminado cuando:** el historial pagina de 20 en 20, la URL conserva la página y una cuenta ajena muestra "Account not found".

## Iteración 5: transferencias

- [ ] `features/transfers`: types, `transferApi.create(dto, idempotencyKey)`, `transferService`
- [ ] Zod: origen y destino de 10 dígitos, distintos, monto > 0 y ≤ 10.000.000.000,00
- [ ] `TransferForm`: origen con `Select` de mis cuentas (muestra saldo disponible + sobregiro), destino como texto
- [ ] Diálogo de confirmación con resumen antes de enviar
- [ ] `Idempotency-Key` generado al abrir la confirmación y reutilizado si el usuario reintenta tras un error de red
- [ ] Botón deshabilitado mientras `isPending` (evita doble envío)
- [ ] Errores: `INSUFFICIENT_FUNDS`, `Cannot transfer to the same account`, `NOT_FOUND`, `IDEMPOTENCY_*`, `BALANCE_LIMIT_EXCEEDED`
- [ ] Éxito: toast, invalidar `accounts` y `movements`, redirigir al detalle del origen
- [ ] Acceso desde el dashboard y desde el detalle de cuenta (origen preseleccionado)

**Terminado cuando:** una transferencia actualiza ambos saldos, aparece en el historial y cada error de F-09 se muestra en la UI.

## Iteración 6: operador

- [ ] Layout y navegación propios del rol `operator` (`/operator`)
- [ ] `features/recharge`: types, `rechargeApi.create(dto, idempotencyKey)`, `rechargeService`
- [ ] `RechargeForm`: número de cuenta, monto y tipo (`cash`, `employer_bonus`, `salary`); aviso de tope de 3.000,00 si es `cash`
- [ ] Errores: `CASH_LIMIT_EXCEEDED`, `DAILY_RECHARGE_COUNT_EXCEEDED`, `DAILY_RECHARGE_AMOUNT_EXCEEDED`, `BALANCE_LIMIT_EXCEEDED`, `NOT_FOUND`, `IDEMPOTENCY_*`
- [ ] Consulta de cuenta por id y su historial, reutilizando los componentes de la iteración 4
- [ ] Ocultar al operador las acciones de customer (crear cuenta, transferir)

**Terminado cuando:** el operador recarga, ve el movimiento creado y cada error de F-08 se muestra.

## Iteración 7: pulido

- [ ] Modo claro y oscuro con toggle persistido en `uiStore`
- [ ] Revisión responsive en 375, 768 y 1280 px
- [ ] Accesibilidad: labels, `aria-label` en botones de ícono, `role="alert"`, foco visible, navegación por teclado en diálogos
- [ ] Página 404 para rutas inexistentes y `ErrorBoundary` global
- [ ] Toast genérico para 500 y errores de red
- [ ] Estados vacíos y de carga consistentes en todas las vistas
- [ ] Refactor: eliminar duplicación detectada y actualizar `README.md`

**Terminado cuando:** todas las vistas funcionan en los tres anchos y con teclado.

## Iteración 8: plan del proyecto Playwright

Solo planificación; Playwright vive en un repositorio independiente y no se agrega nada a este proyecto.

- [ ] Inventario de pantallas, flujos y errores a cubrir
- [ ] Catálogo de localizadores por pantalla (role, label, text, placeholder, test id, CSS, XPath)
- [ ] Plan de conceptos: POM, fixtures, `storageState`, API testing, `page.route`, `page.clock`, visual, accesibilidad, múltiples contextos, CI
- [ ] Estrategia de datos de prueba contra la API (usuarios únicos, operador del seed)
- [ ] Iteraciones propuestas para el nuevo proyecto

## Decisiones tomadas

| Tema              | Decisión                                                                                |
| ----------------- | --------------------------------------------------------------------------------------- |
| Idioma de la UI   | Inglés                                                                                  |
| Dinero            | Centavos enteros en estado y API; se muestra `$1,500.00` (`en-US`, `USD`), configurable |
| Tokens            | Zustand `persist` en `sessionStorage`                                                   |
| Pruebas unitarias | Vitest + Testing Library desde la iteración 0                                           |
| Localizadores     | `data-testid` más soporte para todos los tipos de localizador                           |
| Operador          | Consulta por id y recarga por número, sin listado de cuentas                            |
| HTTP              | `fetch` nativo envuelto en `httpClient`                                                 |
