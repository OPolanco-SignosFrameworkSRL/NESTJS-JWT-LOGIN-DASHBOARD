import { z } from "zod"

export const loginFormSchema = z.object({
    cedula: z.string(),
    password: z.string()
})

export const loginResponseSchema = z.object({
    Token: z.string()
})

export const userSchema = z.object({
    id: z.number(),
    fullname: z.string(),
    email: z.string(),
    role: z.string()
})


export type LoginFormSchema = z.infer<typeof loginFormSchema>
export type UserSchema = z.infer<typeof userSchema>
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>