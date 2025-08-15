import z from "zod";

export const getAllEmployeesSchema = z.object({
    data: z.array(z.object({
        id: z.number(),
        cedula: z.string(),
        fullname: z.string(),
        role: z.string(),
        user_email: z.string(),
        valido: z.number(),
    })),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    timestamp: z.string(),
    
})

export const createEmployeeSchema = z.object({
    cedula: z.string(),
    nombre: z.string(),
    apellido: z.string(),
    fullname: z.string(),
    password: z.string(),
    clave: z.string(),/* */
    role: z.string(),
    user_email: z.string().email(),
    telefono: z.string(),
    direccion: z.string(),
    celular: z.string(),
    user_status: z.number(),/* */
    caja_id: z.string(),/* */
    tienda_id: z.string(),/* */
    allow_multi_tienda: z.string(),/* */
    max_descuento: z.string(),/* */
    close_caja: z.string(),/* */
    user_account_email: z.string().email(),/* */
    user_account_email_passw: z.string(),/* */
    comision_porciento: z.string(),/* */
    default_portalid: z.string(),/* */
    nuevocampo: z.string(),/* */
    encargadoId: z.string()/* */
})

export type GetAllEmployees = z.infer<typeof getAllEmployeesSchema>
export type CreateEmployee = z.infer<typeof createEmployeeSchema>