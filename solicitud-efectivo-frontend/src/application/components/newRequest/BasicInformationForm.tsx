import { type FieldErrors, type UseFormRegister, type FieldValues, type Control, useFieldArray } from "react-hook-form";

import Input from "@/application/ui/Input/Input"
import Select from "@/application/ui/Select/Select";
import { useEffect } from "react";

type BasicInformationFormProps = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  control: Control<FieldValues>
}

const BasicInformationForm = ({register, errors, control}: BasicInformationFormProps) => {

  const formDataItems = [
    {label: "Tipo de Solicitud",  register: "requestType", options:["Test", "Test2", "Test3"]},
    {label: "División", register: "division", options:["Test4", "Test5", "Test6"]},
    {label: "Tipo de Pago", register: "paymentType", options:["Test7", "Test8", "Test9"]}
  ]

  const { fields } = useFieldArray({ control, name: 'formDataBasicInformation' });

  return (

    <>

      {fields.map((field, _) => (
        <div key={field.id}>

          <div className="space-y-3">

            <div className="mb-2">

              <label htmlFor="amount" className="text-sm sm:text-base text-gray-700 font-medium">
                  Monto Solicitado
                  <span className="text-red-500 ml-1.5">*</span>
              </label>

            </div>
            
            <Input 
              type="number"
              placeholder="0.00"
              {...register('formDataBasicInformation.0.amount', { required: "Este campo es requerido" })}
            />

          </div>

          <div className="space-y-3 mt-2">

            {formDataItems.map((item,index) => (

              <div key={index}>
                
                <div className="mb-2">

                  <label htmlFor="amount" className="text-sm sm:text-base text-gray-700 font-medium">
                      {item.label}
                      <span className="text-red-500 ml-1.5">*</span>
                  </label>
                </div>

                <Select
                  options={item.options.map((option) => ({
                    value: option,
                    label: option
                  }))}
                  placeholder="Selecciona una opción"
                  {...register(`formDataBasicInformation.0.${item.register}`, { required: "Este campo es requerido" })}
                />
              </div>

            ))}

          </div>
        </div>

      ))}
    
    </>


    

  )

}

export default BasicInformationForm
