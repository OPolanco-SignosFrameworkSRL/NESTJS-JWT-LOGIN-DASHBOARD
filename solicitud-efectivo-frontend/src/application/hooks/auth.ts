import { login } from "@/infrastructure/api/auth/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/application/store/useAppStore"


export const useLogin = () => {

    const navigate = useNavigate()

    const { setAuth } = useAppStore()

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {

            setAuth(data)

            queryClient.invalidateQueries({queryKey: ['user']})

            navigate('/home')

        },
        onError: (error) => {
            console.error('Error al iniciar sesión', error)

        }
    })

}

export const useLogout = () => {

    const navigate = useNavigate()

    const { logout } = useAppStore()

    const queryClient = useQueryClient()

    return () => {

        logout()

        queryClient.invalidateQueries({queryKey: ['user']})
        
        navigate('/login')
    }
}

