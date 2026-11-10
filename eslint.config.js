import js from '@eslint/js'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Capas de la arquitectura (ver docs/architecture.md).
// Cada patrón clasifica una carpeta como un "elemento" con un tipo.
const elements = [
  { type: 'app', pattern: 'src/app/**' },
  { type: 'pages', pattern: 'src/pages/**' },
  { type: 'feature-components', pattern: 'src/features/*/components/**', capture: ['feature'] },
  { type: 'feature-hooks', pattern: 'src/features/*/hooks/**', capture: ['feature'] },
  { type: 'feature-services', pattern: 'src/features/*/services/**', capture: ['feature'] },
  { type: 'feature-api', pattern: 'src/features/*/api/**', capture: ['feature'] },
  // Archivos en la raíz de la feature (types.ts, schemas.ts). Va después de las
  // capas anteriores porque gana el primer patrón que coincide.
  { type: 'feature-domain', pattern: 'src/features/*', capture: ['feature'] },
  { type: 'components', pattern: 'src/components/**' },
  { type: 'lib', pattern: 'src/lib/**' },
  { type: 'store', pattern: 'src/store/**' },
  { type: 'config', pattern: 'src/config/**' },
  { type: 'test', pattern: 'src/test/**' },
]

// Transversales: se pueden importar desde cualquier capa
const crossCutting = ['config', 'feature-domain']

// Qué capa puede importar a cuál (todo lo demás queda prohibido)
const allowed = {
  app: ['app', 'pages', 'components', 'feature-components', 'lib', 'store'],
  pages: ['components', 'feature-components', 'feature-hooks', 'lib', 'store'],
  'feature-components': ['feature-components', 'feature-hooks', 'components', 'lib', 'store'],
  'feature-hooks': ['feature-hooks', 'feature-services', 'lib', 'store'],
  'feature-services': ['feature-services', 'feature-api', 'lib'],
  'feature-api': ['feature-api', 'lib'],
  'feature-domain': ['feature-domain', 'lib'],
  components: ['components', 'lib', 'store'],
  lib: ['lib', 'store'],
  store: ['store', 'lib'],
  config: [],
  test: ['test', 'lib'],
}

// Las capas de una feature solo pueden importar capas de su MISMA feature.
// De otra feature solo se permite el dominio (types.ts, balance.ts...): tipos y reglas puras.
const featureLayers = ['feature-components', 'feature-hooks', 'feature-services', 'feature-api']
const sameFeature = { feature: '{{ from.element.captured.feature }}' }

const policies = Object.entries(allowed).flatMap(([from, to]) => {
  // app y pages componen features: pueden usar cualquiera. La regla aplica entre features.
  if (!featureLayers.includes(from)) {
    return [
      {
        from: { element: { type: from } },
        allow: { to: { element: { types: [...to, ...crossCutting] } } },
      },
    ]
  }
  const own = to.filter((type) => featureLayers.includes(type))
  const shared = to.filter((type) => !featureLayers.includes(type))
  return [
    {
      from: { element: { type: from } },
      allow: { to: { element: { types: [...shared, ...crossCutting] } } },
    },
    ...(own.length > 0
      ? [
          {
            from: { element: { type: from } },
            allow: { to: { element: { types: own, captured: sameFeature } } },
          },
        ]
      : []),
  ]
})

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'src/lib/api-types.ts'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // Regla de capas: solo aplica al código de src/
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': elements,
      'import/resolver': { typescript: { project: './tsconfig.app.json' } },
    },
    rules: {
      'boundaries/dependencies': [2, { default: 'disallow', policies }],
    },
  },
  {
    // Las pruebas pueden importar cualquier capa (y las utilidades de src/test)
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      'boundaries/dependencies': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Componentes generados por shadcn: se permiten exports adicionales (variants)
    files: ['src/components/ui/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  prettier,
)
