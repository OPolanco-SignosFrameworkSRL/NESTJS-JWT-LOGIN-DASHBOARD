import { isAxiosError } from "axios"

import api from "@/infrastructure/api"
import { getAllEmployeesSchema } from "@/infrastructure/schemas/admin/admin"


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