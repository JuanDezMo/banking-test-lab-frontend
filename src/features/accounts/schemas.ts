import { z } from 'zod'

// F-05: el tipo de cuenta es obligatorio y solo puede ser savings o checking
export const createAccountSchema = z.object({
  accountType: z.enum(['savings', 'checking'], { error: 'Choose an account type' }),
})

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>
