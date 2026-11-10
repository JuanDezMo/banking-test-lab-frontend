// Genera una Idempotency-Key nueva (UUID v4) para una operación de dinero (RN-28).
// Se usa una por operación; reintentar la misma operación reutiliza la misma key.
export function newIdempotencyKey(): string {
  return crypto.randomUUID()
}
