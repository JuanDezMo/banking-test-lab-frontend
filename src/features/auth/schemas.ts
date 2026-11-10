import { z } from 'zod'

// Longitud en caracteres Unicode (code points), igual que el backend (I-05)
const charLength = (value: string) => [...value].length

// Mismo patrón de email que usa el backend (I-05)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Reglas de F-01 con los mismos mensajes que devuelve la API
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .refine((value) => charLength(value) >= 1 && charLength(value) <= 100, 'Invalid name'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => emailPattern.test(value) && charLength(value) <= 254, 'Invalid email'),
  // La contraseña no se recorta
  password: z
    .string()
    .refine((value) => charLength(value) >= 8, 'Password too short')
    .refine((value) => charLength(value) <= 128, 'Password too long'),
})

// Login: solo campos obligatorios; las credenciales las valida el backend
export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
