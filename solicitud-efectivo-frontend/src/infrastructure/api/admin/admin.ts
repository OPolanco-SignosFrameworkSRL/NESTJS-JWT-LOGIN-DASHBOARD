import { isAxiosError } from "axios"
import { getAllEmployeesSchema, getAllRolesSchema, getEmployeeByIdSchema, type CreateEmployee, type UpdateEmployee } from "@/infrastructure/schemas/admin/admin"

import api from "@/infrastructure/api"


type adminProps = {
    page: number
    limit: number
}

export const createEmployee = async (formData: CreateEmployee) => {
    try {

        const url = '/users'

        const { data } = await api.post(url, formData)

        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const getAllEmployees = async ({page, limit}: adminProps) => {

    try {
        
        const url = `/users?page=${page}&limit=${limit}`

        const { data } = await api.get(url)

        const result = getAllEmployeesSchema.safeParse(data)

        if(result.success) {
            return result.data
        }
        
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }              

}

export const getEmployeeById = async (id: number) => {
    try {

        const url= `/users/${id}`

        const { data } = await api.get(url)

        const result = getEmployeeByIdSchema.safeParse(data)

        if(result.success) {
            return result.data
        }


        
    } catch (error) {
         if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}


export const updateEmployee = async (id: number, formData: UpdateEmployee) => {
    try {
        const url = `/users/${id}`

        const { data } = await api.put(url, formData)

        return data
        
    } catch (error) {
         if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const deleteEmployee = async (id: number ) => {
    try {

        const url = `/users/${id}`

        const { data } = await api.delete(url)

        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

/* */

export const getAllRoles = async () => {
    try {

        const url = '/roles'

        const { data } = await api(url)

        const result = getAllRolesSchema.safeParse(data)

        if (result.success) {
            return result.data
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export const getAllRolesView = async ({page, limit}: adminProps) => {
    try {

        const url = `/roles?page=${page}&limit=${limit}`

        const { data } = await api(url)

        const result = getAllRolesSchema.safeParse(data)

        if (result.success) {
            return result.data
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}