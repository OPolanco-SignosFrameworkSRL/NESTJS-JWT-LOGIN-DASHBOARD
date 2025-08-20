import Input from "@/application/ui/Input/Input"
import { useFieldArray, type Control, type FieldValues } from "react-hook-form"
import type { UseFormRegister } from "react-hook-form"
import type { FieldErrors } from "react-hook-form"

type ProductionDataFormProps = {
    register: UseFormRegister<FieldValues>
    errors: FieldErrors<FieldValues>
    control: Control<FieldValues>
}

const ProductionDataForm = ({register, control}: ProductionDataFormProps) => {

    const formDataItems = [
        {label:"Fecha de Orden", placeholder:"dd/mm/yyyy", register:"orderDate", type:"date"},
        {label:"Número de Orden", placeholder:"Ingrese número de orden", register:"orderNumber", type:"text"},
        {label:"Nombre del Cliente", placeholder:"Ingrese nombre del cliente", register:"clientName", type:"text"},
        {label:"Número de Ticket", placeholder:"Ingrese número de ticket (opcional)", register:"ticketNumber", type:"text"},
        {label:"Concepto de la Solicitud", placeholder:"Ingrese concepto de la solicitud", register:"requestConcept", type:"text"},
    ] as const

    const { fields } = useFieldArray({ control, name: 'formDataProduction' });


  return (
    <>
      {fields.map((field, _) => (

        <div key={field.id}>
          <div className="space-y-3">
            
            {formDataItems.map((item, index) => (

              <div key={index}>
                <div className="mb-2">
                  <label htmlFor="amount" className="text-sm sm:text-base text-gray-700 font-medium">
                    {item.label}
                    <span className="text-red-500 ml-1.5">*</span>
                  </label>
                </div>

                <Input
                  type={item.type}
                  placeholder={item.placeholder}
                  {...register(`formDataProduction.0.${item.register}`, { required: "Este campo es requerido" })}
                />

              </div>
            ))}
          </div>
        </div>

      ))}
    </>
  );
};

export default ProductionDataForm;
