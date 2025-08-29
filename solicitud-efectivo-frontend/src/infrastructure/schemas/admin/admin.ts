import z from "zod";

export const createEmployeeSchema = z.object({
    cedula: z.string(),
    nombre: z.string(),
    apellido: z.string(),
    fullname: z.string(),
    password: z.string(),
    clave: z.string(),/* */
    roles: z.array(z.object({ id: z.number()})),
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
    comision_porciento: z.string(),/* */
    default_portalid: z.string(),/* */
    encargadoId: z.string()/* */
})

export const getAllEmployeesSchema = z.object({
    data: z.array(z.object({
        id: z.number(),
        cedula: z.string(),
        fullname: z.string(),
        roles: z.array(z.object({ 
            id: z.number(),
            roleName: z.string()
        })).optional(),
        user_email: z.string(),
        valido: z.boolean(),
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

export const getEmployeeByIdSchema = z.object({
    data: (z.object({
        id: z.number(),
        cedula: z.string(),
        nombre: z.string(),
        apellido: z.string(),
        roles: z.array(z.object({ 
            id: z.number(),
            roleName: z.string()
        })),
        telefono: z.string(),
        direccion: z.string(),
        celular: z.string(),
        user_email: z.string(),
        valido: z.boolean(),
    })),
})

export const getAllRolesSchema = z.object({
    data: z.array(z.object ({
        id: z.number(),
        role_name: z.string(),
        valido: z.boolean()
    }))
})

export const updateEmployeeSchema = z.object({
    nombre: z.string(),
    apellido: z.string(),
    cedula: z.string(),
    password: z.string().optional(),
    roles: z.array(z.object({ id: z.number(), roleName: z.string()})),
    user_email: z.string().email(),
    telefono: z.string(),
    direccion: z.string(),
    celular: z.string(),
})


export type GetAllEmployees = z.infer<typeof getAllEmployeesSchema>
export type EmployeeById = z.infer<typeof getEmployeeByIdSchema>
export type CreateEmployee = z.infer<typeof createEmployeeSchema>
export type UpdateEmployee = z.infer<typeof updateEmployeeSchema>
export type GetAllRoles = z.infer<typeof getAllRolesSchema>

/*

 data.user_status = 1
    data.caja_id = "1"
    data.tienda_id = "1"
    data.allow_multi_tienda = "0"
    data.max_descuento = "10.5"
    data.close_caja = "0"
    data.user_account_email = "pedro@gmail.com"
    data.user_account_email_passw = "MiClaveSecreta2024"
    data.comision_porciento = "5.5"
    data.default_portalid = "1"
    data.nuevocampo = "valor"
    data.encargadoId = "1"



*/