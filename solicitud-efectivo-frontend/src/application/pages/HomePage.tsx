import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

import Title from "@/application/ui/Text/Title";

import CardSection1 from "@/application/components/home/CardSection1";
import CardSection2 from "@/application/components/home/CardSection2";
import RequestTable from "@/application/components/RequestTable";
import Container from "../ui/Container/Container";


const Home = () => {

  return (

    <>

        <Container className="flex justify-between">

          <Container>

            <Title text="Listado de Solicitudes --- testt"/>

            <Title text="Gestiona y visualiza todas las solicitudes de efectivo" isTitle={false}/>

          </Container>

          <Container>
            <Link to="/new-request" className="flex items-center gap-2 text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer  ">
              <span>
                <FaPlus size={18}/>
              </span>
              Nueva Solicitud
            </Link>
          </Container>

        </Container>

        <section>

          <CardSection1/>

        </section>

        <section>

          <CardSection2/>
          
        </section>

        <section>
          
          <RequestTable/>
          
        </section>
    
    </>


  )
}

export default Home
