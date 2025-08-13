import z from "zod";

export const getAllEmployeesSchema = z.object({
    Token: z.array(z.object({
        id: z.number(),
        cedula: z.string(),
        fullname: z.string(),
        role: z.string(),
        user_email: z.string(),
        valido: z.number(),
    })),
    message: z.string(),
    statusCode: z.number(),
    timestamp: z.string()
})

export type GetAllEmployees = z.infer<typeof getAllEmployeesSchema>