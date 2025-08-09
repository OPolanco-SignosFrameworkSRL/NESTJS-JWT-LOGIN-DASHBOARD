import { FaRegCheckCircle } from "react-icons/fa";
import { IoAlertCircleOutline } from "react-icons/io5";
import { GiCash } from "react-icons/gi";
import ButtonForms from "@/application/ui/ButtonForm/ButtonForms";
import Select from "@/application/ui/Select/Select";
import Input from "@/application/ui/Input/Input";
import { useFieldArray, type Control, type FieldErrors, type FieldValues, type UseFormRegister, type UseFormWatch } from "react-hook-form";
import { useEffect } from "react";

type MembersFormProps = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  watch: UseFormWatch<FieldValues>
  control: Control<FieldValues>
}

const MembersForm = ({register, errors, control}: MembersFormProps) => {

    const cardItems = [
        {icon: <GiCash/>, className: "bg-blue-50 border border-blue-200 rounded-lg p-4", textColor: "text-blue-900 font-bold", textColor2: "text-blue-700", label: "Monto Solicitado", value: "$3,500.00"},
        {icon: <FaRegCheckCircle/>, className: "bg-green-50 border border-green-200 rounded-lg p-4", textColor: "text-green-900 font-bold", textColor2: "text-green-700",   label: "Monto Asignado", value: "$300.00"},
        {icon: <IoAlertCircleOutline/>, className: "bg-red-50 border border-red-200 rounded-lg p-4", textColor: "text-red-900 font-bold", textColor2: "text-red-700", label: "Balance", value: "$3,200.00"}
    ]

    const test = [
      {name: "frandy"},
      {name: "roger"},
      {name: "perez"},
      {name: "willy"},
    ]

    const formDataItems = [
      {label: "Cédula", register: "cedula", placeholder: "40208712477", type: "text", readOnly: false, required: true},
      {label: "Beneficiario", register: "beneficiary", placeholder: "Nombre del beneficiario", type: "text", readOnly: false, required: true},
      {label: "Monto", register: "amount", placeholder: "$ 0.00", type: "number", readOnly: false, required: true},
      {label: "Tarea Asignada", register: "task", placeholder: "Ingrese Tarea asignada", type: "text", readOnly: false, required: true},
    ] as const

    const { fields, append, remove } = useFieldArray({ control, name: 'formDataMembers' });

    const handleDelete = (index: number) => {
      remove(index)
    }

  return (

    <>
    
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-5 mb-4">

        {cardItems.map((item, index) => (

            <div className={`flex flex-col gap-2 mb-4 ${item.className}`} key={index}>

              <div className="flex items-center gap-2">
                  <div className={`${item.textColor2}`}>
                      {item.icon}
                  </div>

                  <div className={`text-sm sm:text-base ${item.textColor2}`}>
                      {item.label}
                  </div>

              </div>

              <div className={`text-2xl ${item.textColor}`}>
                  {item.value}
              </div>

            </div>

        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-md sm:text-xl font-semibold text-gray-700">Integrantes del Desembolso</span>
        <ButtonForms
          label="+ Agregar Integrante"
          backgroundColor="secondary"
          textColor="secondary"
          onClick={() => append({ employee: '', cedula: '', beneficiary: '', amount: '', task: '' })}
          type="button"
        />
      </div>

      {fields.map((field, index) => (

       <div key={field.id} className="border border-emerald-500 rounded-lg p-4 mt-5">

        <div className="flex items-center justify-between">

          <span className="text-sm sm:text-lg text-gray-700 font-medium" >{`Integrante ${index + 1}`}</span>

          {fields.length > 1 && (

            <ButtonForms
              label="Eliminar"
              borderColor="tertiary"
              textColor="tertiary"
              backgroundColor="primary"
              border={true}
              className="hover:bg-red-50"
              onClick={() => handleDelete(index)}
            />

          )}

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">

          <div className="flex flex-col gap-2">

            <div>
              <label className="text-sm sm:text-base text-gray-700 font-medium" >Nombre del Empleado</label>
              <span className="text-red-500 ml-1.5">*</span>
            </div>

            <Select
              options={test.map(item => ({
                value: item.name,
                label: item.name
              }))}
              placeholder={"Seleccione una opción"}
              {...register(`formDataMembers.${index}.employee`)}
            />

          </div>

          {formDataItems.slice(0, 3).map((item, itemIndex) => (

            <div key={itemIndex} className="flex flex-col gap-2">

              <div>

                <label className="text-sm sm:text-base text-gray-700 font-medium">{item.label}</label>
                {item.required && <span className="text-red-500 ml-1.5">*</span>}

              </div>

              <Input
                type={item.type}
                placeholder={item.placeholder}
                readOnly={item.readOnly}
                {...register(`formDataMembers.${index}.${item.register}`)}
              />

            </div>
          ))}
        </div>

        <div className="w-full">
          
          {formDataItems.slice(3).map((item, itemIndex) => (

            <div key={itemIndex} className="flex flex-col gap-2 mt-4">

              <div>
                <label className="text-sm sm:text-base text-gray-700 font-medium">{item.label}</label>
                {item.required && <span className="text-red-500 ml-1.5">*</span>}
              </div>

              <Input
                type={item.type}
                placeholder={item.placeholder}
                readOnly={item.readOnly}
                {...register(`formDataMembers.${index}.${item.register}`)}
              />

            </div>
          ))}

        </div>

      </div>
      ))}


    </>

  )
}

export default MembersForm
