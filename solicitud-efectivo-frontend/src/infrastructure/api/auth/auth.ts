import api from "@/infrastructure/api"




export const login = async (formData: any) => {

    const url = '/auth/login'
    
    const response = await api.post(url, formData)

    return response.data

}