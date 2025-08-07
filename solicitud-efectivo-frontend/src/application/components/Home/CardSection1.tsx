import { IoIosTrendingUp } from "react-icons/io";



const CardSection1 = () => {

  const cardItems = [
    {label: "Total en Flujo", color: "bg-gradient-to-br from-emerald-500 to-green-600", money: "$7,107,500.00", footer:"+12.5% vs mes anterior"},
    {label: "Pendiente Aprobación", color: "bg-gradient-to-br from-blue-500 to-cyan-600", money: "$156,500.00", footer:"33 solicitudes"},
    {label: "Desembolsado Hoy", color: "bg-gradient-to-br from-purple-500 to-violet-600", money: "$25,000.00", footer:"8 transacciones"},
    {label: "Promedio Solicitud", color: "bg-gradient-to-br from-amber-500 to-orange-600", money: "$4,742.42", footer:"Últimos 30 días"},

  ]

  return (

    <>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-5">

        {cardItems.map((item, index) => (

            <div className={`flex flex-col ${item.color} text-sm sm:text-base w-full shadow-xl p-5 rounded-lg`} key={index}>

                <span className="text-sm sm:text-base text-white">
                    {item.label}
                </span>

                <span className="mt-2 text-white font-bold text-2xl">
                    {item.money}
                </span>

                <span className="flex flex-row items-center text-sm text-white opacity-80 gap-1">
                    {index === 0 && <IoIosTrendingUp />} 
                    {item.footer}
                </span>

            </div>
        ))}
    </div>
    






    </>





  )


  
}

export default CardSection1
