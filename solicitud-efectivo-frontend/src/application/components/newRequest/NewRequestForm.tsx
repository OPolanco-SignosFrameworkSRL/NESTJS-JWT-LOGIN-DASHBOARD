import type { FieldErrors, UseFormRegister, FieldValues } from "react-hook-form";

import Input from "@/application/ui/Input/Input"

type NewsRequestFormProps = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

const NewRequestForm = ({register, errors}: NewsRequestFormProps) => {

  const formDataItems = [
    {label: "Monto Solicitado", type: "number", placeholder: "0.00", register:"amount"},
    {label: "Tipo de Solicitud", type: "select", placeholder: "Compra de Materiales", register: "requestType"},
    {label: "División", type: "select", placeholder: "Administración", register: "division"},
    {label: "Tipo de Pago", type: "select", placeholder: "Efectivo", register: "paymentType"}
    
  ]

  return (

    <>
    
      <div>

        {formDataItems.map((item, index) => (

          <>
          
            <div className="mb-2">

              <label htmlFor="amount" className="text-sm sm:text-base text-green-700">
                  {item.label}
                  <span className="text-red-500 ml-1.5">*</span>
              </label>
            </div>

            <Input 
              type="select"
              placeholder={item.placeholder}
              {...register(`${item.register}`, { required: "Este campo es requerido" })}
            />
          </>

        ))}

      </div>

    </>


    

  )

}

export default NewRequestForm
