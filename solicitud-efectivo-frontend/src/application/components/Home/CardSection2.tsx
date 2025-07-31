
import { FaClock } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaMoneyBill } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

const CardSection2 = () => {

  const cardItems = [
    {label: "Pendientes", count: "33", textColorHeader: "tracking-tight font-medium text-amber-700", color: "text-card-foreground bg-amber-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105", money: "$156,500,00", footer:"Solicitudes en espera"},
    {label: "Aprobadas", count: "1", textColorHeader: "tracking-tight font-medium text-emerald-700", color: "text-card-foreground bg-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105", money: "$1,000.00", footer:"Listas para desembolso"},
    {label: "Verificadas", count: "84", textColorHeader: "tracking-tight font-medium text-blue-700", color:"text-card-foreground bg-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105", money: "$420,000.00", footer:"Documentación completa"},
    {label: "Provisionales", count: "7", textColorHeader: "font-bold text-purple-700", color: "text-card-foreground bg-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105", money: "$$35,000.00", footer:"Pendiente documentos"},
    {label: "Liquidadas", count: "1,106", textColorHeader: "font-bold text-slate-700", color: "text-card-foreground bg-slate-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105", money: "$5,530,000.00", footer:"Efectivo desembolsado"},
    {label: "Rechazadas", count: "193", textColorHeader: "font-bold text-red-700", color: "text-card-foreground bg-red-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105", money: "$965,000.00", footer:"No aprobadas"},
  ]

  const iconsItems = [
    {item: <FaClock size={24} />, colors: "bg-gradient-to-r from-amber-500 to-orange-500"},
    {item: <FaCheckCircle size={24} />, colors: "bg-gradient-to-r from-emerald-500 to-green-600"},
    {item: <FaCheckSquare size={24} />, colors: "bg-gradient-to-r from-blue-500 to-cyan-500"},
    {item: <BsFillQuestionSquareFill size={24} />, colors: "bg-gradient-to-r from-purple-500 to-violet-500"},
    {item: <FaMoneyBill size={24} />, colors: "bg-gradient-to-r from-slate-500 to-gray-600"},
    {item: <FaCircleXmark size={24} />, colors: "bg-gradient-to-r from-red-500 to-rose-500"}

  ]

  return (

    <>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-6 mt-10 gap-5">

            {cardItems.map((item, index) => (

                <div className={`flex flex-col ${item.color} text-sm sm:text-base w-full shadow-xl p-5 rounded-lg`} key={index}>

                    <span className={`${item.textColorHeader} flex items-center`}>

                        <div className="flex w-full">
                            {item.label}
                        </div>
                        

                        {iconsItems.map((iconsItem, indexItems) => (
                        
                        <div>
                                {indexItems === index && (
                                    <div className={`p-2 rounded-lg text-white shadow-md ${iconsItem.colors}`}>
                                        {iconsItem.item}
                                    </div>
                                )}
                        </div>
                            
                        ))}

                    </span>

                    <span className={`mt-5 text-3xl ${item.textColorHeader}`}>
                        {item.count}
                    </span>

                    <span className="mt-2 text-black text-xl">
                        {item.money}
                    </span>

                    <span className="flex flex-row items-center text-sm text-muted-foreground opacity-80 gap-1">

                        {item.footer}
                    </span>

                </div>
            ))}
        </div>
    
    </>





  )


  
}

export default CardSection2
