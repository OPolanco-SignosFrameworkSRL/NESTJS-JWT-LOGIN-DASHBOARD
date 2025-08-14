import Container from "@/application/ui/Container/Container";
import Text from "@/application/ui/Text/Text";
import { IoIosTrendingUp } from "react-icons/io";



const CardSection1 = () => {

  const cardItems = [
    {text: "Total en Flujo", color: "bg-gradient-to-br from-emerald-500 to-green-600", money: "$7,107,500.00", footer:"+12.5% vs mes anterior"},
    {text: "Pendiente Aprobación", color: "bg-gradient-to-br from-blue-500 to-cyan-600", money: "$156,500.00", footer:"33 solicitudes"},
    {text: "Desembolsado Hoy", color: "bg-gradient-to-br from-purple-500 to-violet-600", money: "$25,000.00", footer:"8 transacciones"},
    {text: "Promedio Solicitud", color: "bg-gradient-to-br from-amber-500 to-orange-600", money: "$4,742.42", footer:"Últimos 30 días"},

  ]

  return (

    <>

    <Container className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-5">

        {cardItems.map((item, index) => (

            <Container className={`flex flex-col ${item.color} text-sm sm:text-base w-full shadow-xl p-5 rounded-lg`} key={index}>

                <Text text={item.text} variant="title"/>

                <Text text={item.money} variant="subtitle"/>

                <Text text={item.footer} variant="footer" className="text-white">
                    {index === 0 && <IoIosTrendingUp />} 
                </Text>

            </Container>

        ))}

    </Container>
    






    </>





  )


  
}

export default CardSection1
