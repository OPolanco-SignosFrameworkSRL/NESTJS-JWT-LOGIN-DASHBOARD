import { bColor, bgColor, txtColor, type IColor } from "@/application/ui/generalStyles"

type ButtonFormProps = {
    label: string
    borderColor?: keyof IColor
    backgroundColor?: keyof IColor
    textColor?: keyof IColor
    border?: boolean
    onClick?: () => void
    className?: string
}

const ButtonForms = ({label, border, borderColor="primary", backgroundColor="primary", textColor="primary", onClick, className} : ButtonFormProps) => {

  return (
    

    <button 
      onClick={onClick}
      className={`mt-5 px-6 py-2 ${border ? `border-2 ${bColor[borderColor]}` : ''} 
      rounded-lg hover:bg-gray-100 transition-colors cursor-pointer
      ${bgColor[backgroundColor]}
      ${txtColor[textColor]}
      ${className}
    `
    }>
      {label}
    </button>

  )
}

export default ButtonForms  
