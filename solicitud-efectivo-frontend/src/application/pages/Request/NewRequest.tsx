import ButtonForms from "@/application/ui/ButtonForm/ButtonForms";
import { useState } from "react"
import { CiUser } from "react-icons/ci";
import { useForm } from "react-hook-form"
import BasicInformationForm from "@/application/components/newRequest/BasicInformationForm";
import ProductionDataForm from "@/application/components/newRequest/ProductionDataForm";
import MembersForm from "@/application/components/newRequest/MembersForm";



const NewRequest = () => {

  const navItems = [
    {label: "Información Básica"},
    {label: "Datos Producción"},
    {label: "Integrantes"}
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

  const {register, reset, handleSubmit, formState: {errors}} = useForm()

  
  return (

    <>
    
      <div className="flex flex-col bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          <span className="text-sm sm:text-base md:text-xl text-white font-bold">
            $ Nueva Solicitud de Efectivo
          </span>
          <p className="text-sm sm:text-base text-gray-300">
            Sistema de Gestión de Flujo de Efectivo
          </p>
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
        >

          <div className="mt-5">

            {activeItem.label === "Información Básica" && (

              <BasicInformationForm register={register} errors={errors}/>
            
            )}

            {activeItem.label === "Datos Producción" && (
              <ProductionDataForm register={register} errors={errors}/>
            )}

            {activeItem.label === "Integrantes" && (
              <MembersForm/>
            )}
          </div>

        </form>

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
      </div>


    </>

  )
}

export default NewRequest
