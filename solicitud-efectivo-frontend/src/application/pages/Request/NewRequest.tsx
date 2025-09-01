import ButtonForms from "@/application/ui/buttonForm/ButtonForms";
import { useState } from "react"
import { CiUser } from "react-icons/ci";
import { useForm } from "react-hook-form"
import BasicInformationForm from "@/application/components/newRequest/BasicInformationForm";
import ProductionDataForm from "@/application/components/newRequest/ProductionDataForm";
import MembersForm from "@/application/components/newRequest/MembersForm";
import Title from "@/application/ui/text/Title";



const NewRequest = () => {

  const navItems = [
    {label: "Información Básica"},
    {label: "Datos Producción"},
    {label: "Integrantes"},
  ]

  const [activeItem, setActiveItem] = useState(navItems[0]);

  const handleClickNext = () => {

    const currentIndex = navItems.findIndex(item => activeItem.label === item.label);
    
    if (currentIndex < navItems.length - 1) {
      setActiveItem(navItems[currentIndex + 1]);
    }
  }

  const handleClickPrevious = () => {

    const currentIndex = navItems.findIndex(item => activeItem.label === item.label)

    if(currentIndex > 0) {
      setActiveItem(navItems[currentIndex - 1])
    }

  }

  const {register, handleSubmit, control, formState: {errors}, watch} = useForm({
    defaultValues: {
      formDataBasicInformation: [{ amount: '', requestType: '', division: '', paymentType: '' }], 
      formDataProduction: [{ orderDate: '', orderNumber: '', clientName: '', ticketNumber: '', requestConcept: '' }],
      formDataMembers: [{ employee: '', cedula: '', beneficiary: '', amount: '', task: '' }]
    } as any
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (

    <>
    
      <div className="flex flex-col bg-gradient-to-r from-green-600 to-emerald-600 p-6">

          <Title text="$ Nueva Solicitud de Efectivo" isTitle={true} className="text-white"/>

          <Title text="Sistema de Gestión de Flujo de Efectivo" isTitle={false} className="!text-gray-300"/>

      </div>

      <div className="bg-white p-5 rounded-bl-lg rounded-br-lg">

        <div className="border-b border-gray-300">
          <nav>
            <ul className="flex gap-2 sm:gap-6 lg:gap-10 mt-2.5">
              {navItems.map((item, index) => (
                <li key={index} className={`cursor-pointer text-xs sm:text-sm md:text-base whitespace-nowrap ${activeItem.label === item.label ? 'pb-5 border-b-2 border-emerald-600 text-green-600' : 'text-gray-500 hover:border-b-2 hover:border-gray-400'}`} onClick={() => setActiveItem(item)}>
                    {item.label}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-5 bg-gradient-to-r from-green-50 to-emerald-50 p-5 border-2 border-green-200 rounded-lg">

          <div className="flex items-center gap-2">

            <CiUser size={24} className="text-green-600" />

            <div className="flex flex-col">

            <span className="text-sm sm:text-base text-green-700">Solicitado Por:</span>
            <span className="text-sm sm:text-base text-green-900 font-bold">Frandy Jeffry Cepeda</span>
            
            </div>
          </div>

        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className="mt-5">

            {activeItem.label === "Información Básica" && (

              <BasicInformationForm register={register} errors={errors} control={control}/>
            
            )}

            {activeItem.label === "Datos Producción" && (
              <ProductionDataForm register={register} errors={errors} control={control}/>
            )}

            {activeItem.label === "Integrantes" && (
              <MembersForm register={register} errors={errors} watch={watch} control={control}/>
            )}

          </div>

          <div className="w-full flex justify-between">

            <ButtonForms 
              label="Anterior" 
              border={true}
              onClick={handleClickPrevious}
              className="bg-red-500"
            />

            {activeItem.label === "Integrantes" ? (

              <ButtonForms 
                label="Enviar Formulario" 
                backgroundColor="secondary" 
                textColor="secondary" 
                className="hover:from-green-700 hover:to-emerald-700"
                type="submit"
              />

            ) : (

              <ButtonForms 
                label="Siguiente" 
                backgroundColor="secondary" 
                textColor="secondary" 
                className="hover:from-green-700 hover:to-emerald-700"
                onClick={handleClickNext}
              />

            )}

          </div>

        </form>

      </div>


    </>

  )
}

export default NewRequest
