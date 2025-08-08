import { FaRegCheckCircle } from "react-icons/fa";
import { IoAlertCircleOutline } from "react-icons/io5";
import { GiCash } from "react-icons/gi";
import ButtonForms from "@/application/ui/ButtonForm/ButtonForms";



const MembersForm = () => {

    const cardItems = [
        {icon: <GiCash/>, className: "bg-blue-50 border border-blue-200 rounded-lg p-4", textColor: "text-blue-900 font-bold", textColor2: "text-blue-700", label: "Monto Solicitado", value: "$3,500.00"},
        {icon: <FaRegCheckCircle/>, className: "bg-green-50 border border-green-200 rounded-lg p-4", textColor: "text-green-900 font-bold", textColor2: "text-green-700",   label: "Monto Asignado", value: "$300.00"},
        {icon: <IoAlertCircleOutline/>, className: "bg-red-50 border border-red-200 rounded-lg p-4", textColor: "text-red-900 font-bold", textColor2: "text-red-700", label: "Balance", value: "$3,200.00"}
    ]


  return (

    <>
    
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-5 mb-4">
        {cardItems.map((item, index) => (

          <>

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


          </>

        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-xl font-semibold text-gray-700">Integrantes del Desembolso</span>
        <ButtonForms
          label="+ Agregar Integrante"
          backgroundColor="secondary"
          textColor="secondary"
        />
      </div>


    </>






  )
}

export default MembersForm
