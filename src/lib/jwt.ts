// Payload del access token que emite la API (I-08)
export type AccessTokenClaims = {
  sub: string
  role: 'customer' | 'operator'
  iat: number
  exp: number
}

// Decodifica base64url a texto (los JWT no usan el base64 estándar)
function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function isClaims(value: unknown): value is AccessTokenClaims {
  if (typeof value !== 'object' || value === null) return false
  const claims = value as Record<string, unknown>
  return (
    typeof claims.sub === 'string' &&
    (claims.role === 'customer' || claims.role === 'operator') &&
    typeof claims.exp === 'number' &&
    typeof claims.iat === 'number'
  )
}

// Lee los claims del token SIN validar la firma: eso lo hace siempre el backend.
// El frontend solo los usa para saber el rol y mostrar la UI correcta.
export function decodeAccessToken(token: string): AccessTokenClaims | null {
  const payload = token.split('.')[1]
  if (!payload) return null
  try {
    const parsed: unknown = JSON.parse(decodeBase64Url(payload))
    return isClaims(parsed) ? parsed : null
  } catch {
    return null
  }
}
