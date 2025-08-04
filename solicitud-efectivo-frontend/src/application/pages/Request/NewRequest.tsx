import ButtonForms from "@/application/ui/ButtonForm/ButtonForms";
import { useState } from "react"
import { CiUser } from "react-icons/ci";


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

      <div className="border-b border-gray-300">
        <nav>
          <ul className="flex gap-10 mt-2.5">
            {navItems.map((item, index) => (
              <li key={index} className={`cursor-pointer ${activeItem.label === item.label ? ' pb-5 border-b-2 border-emerald-600 text-green-600' : 'text-gray-500 hover:border-b-2 hover:border-gray-400'}`} onClick={() => setActiveItem(item)}>
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

      {activeItem.label === "Información Básica" && (
        <div>
          <h1>Información Básica</h1>
        </div>
      )}

      {activeItem.label === "Datos Producción" && (
        <div>
          <h1>Datos Producción</h1>
        </div>
      )}

      {activeItem.label === "Integrantes" && (
        <div>
          <h1>Integrantes</h1>
        </div>
      )}
      


      <div className="w-full flex justify-between">

        <ButtonForms 
          label="Anterior" 
          border={true}
          onClick={handleClickPrevious}
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

 
      




    </>


  )
}

export default NewRequest
