import { isAxiosError } from "axios"

import api from "@/infrastructure/api"
import { getAllEmployeesSchema, type CreateEmployee } from "@/infrastructure/schemas/admin/admin"


export const getAllEmployees = async () => {

    
    try {
        
        const url = '/users'

        const { data } = await api(url)

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