import { jwtDecode } from "jwt-decode";
import type { StateCreator } from "zustand";

import type { LoginResponseSchema, UserSchema } from "@/infrastructure/schemas/auth/auth";

type CustomJwtPayload = {
    id: number;
    fullname: string
    email: string
    role: string
}

  
export type AuthSliceProps = {
   decodedToken: UserSchema | null;

   setAuth: (token: LoginResponseSchema) => void
   logout: () => void
   GetUserFromToken: () => Promise<void>;


};

export const createAuthSlice: StateCreator<AuthSliceProps> = (set) => ({
   decodedToken: null,
   setAuth: (token: LoginResponseSchema) => {

        localStorage.setItem('token', token.Token)

    },
    logout: () => {

        localStorage.removeItem('token')

    },
    GetUserFromToken: async () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            set({ decodedToken: null });
            return;
        }
    
        try {
            if (typeof jwtDecode !== 'function') {
               
                set({ decodedToken: null });
                return;
            }
            
            const decoded = jwtDecode<CustomJwtPayload>(token);

            const userData = {
                id: decoded.id,
                fullname: decoded.fullname,
                email: decoded.email,
                role: decoded.role
            };

            set({ decodedToken: userData });

        } catch (error) {
            console.error("Error decoding token:", error);
            set({ decodedToken: null });
        }
       },
   
});