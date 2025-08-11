import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

import CardSection1 from "@/application/components/Home/CardSection1";
import CardSection2 from "@/application/components/Home/CardSection2";
import RequestTable from "@/application/components/RequestTable";


const Home = () => {

  return (

    <div>

      <div className="flex justify-between">

        <div className="">
          <span className="text-sm sm:text-base md:text-xl text-emerald-500 font-bold">
            Listado de Solicitudes
          </span>
          <p className="text-sm sm:text-base text-gray-500">
            Gestiona y visualiza todas las solicitudes de efectivo.
          </p>
        </div>

        <div>
          <Link to="/new-request" className="flex items-center gap-2 text-sm sm:text-base bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg cursor-pointer  ">
            <span>
              <FaPlus size={18}/>
            </span>
            Nueva Solicitud
          </Link>
        </div>

      </div>

      <section>

        <CardSection1/>

      </section>

      <section>

        <CardSection2/>
        
      </section>

      <section>
        
        <RequestTable/>
        
      </section>






    </div>

  )
}

export default Home
