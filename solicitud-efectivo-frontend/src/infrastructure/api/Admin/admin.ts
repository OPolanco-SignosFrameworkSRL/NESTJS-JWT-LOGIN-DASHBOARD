import { isAxiosError } from "axios"

import api from "@/infrastructure/api"
import { getAllEmployeesSchema, type CreateEmployee } from "@/infrastructure/schemas/admin/admin"


type adminProps = {
    page: number
    limit: number
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

export const editEmployee = async (id: number, formData: CreateEmployee) => {
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