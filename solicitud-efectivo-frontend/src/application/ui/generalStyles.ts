

export interface IColor {
    primary: string
    secondary: string
    tertiary?: string
}

export const bColor: IColor = {
    primary: "border-green-300 ",
    secondary: "none",
    tertiary: "border-red-300"
    
}

export const bgColor: IColor = {
    primary: "bg-white",
    secondary: "bg-gradient-to-r from-green-600 to-emerald-600"
}

export const txtColor: IColor = {
    primary: "text-green-700",
    secondary: "text-white",
    tertiary: "text-red-600"
}

