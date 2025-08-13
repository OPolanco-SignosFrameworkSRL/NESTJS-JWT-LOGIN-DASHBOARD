

import SkeletonGetUsers from "@/application/components/Admin/SkeletonGetUsers";
import { getAllEmployees } from "@/infrastructure/api/Admin/admin";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";


export default function Dashboard() {

  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  })

  const tdClass = 'p-3 text-left'
  const thClass = ''

  if(isLoading) return <SkeletonGetUsers/>

  if(data) return (
    
    <div className="mt-10 p-6 sm:p-10 bg-white shadow-lg">

      <div className="flex flex-col sm:flex-row justify-between items-center">

        <h2 className=" text-[19px] sm:text-4xl font-black text-slate-500">
          Administrador de empleados
        </h2>

        <Link
          to="/create-employee"
          className="rounded-md bg-indigo-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
        >
          Agregar Empleado
        </Link>
        
      </div>


      <div className="w-full mt-6 overflow-x-auto">

        <table className="min-w-full bg-white table-auto border-collapse">

          <thead className="bg-slate-800 text-white">

            <tr className='p-3 text-left'>
              <th className={`${tdClass}`}>Empleado</th>
              <th className={`${tdClass}`}>Cedula</th>
              <th className={`${tdClass}`}>Rol</th>
              <th className={`${tdClass}`}>Correo</th>
              <th className={`${tdClass}`}>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {data.Token.map((data) => (
              <tr key={data.id}>
                <td> {data.fullname}</td>
                <td> {data.cedula}</td>
                <td> {data.role}</td>
                <td> {data.user_email}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
      
    </div>
  );
}