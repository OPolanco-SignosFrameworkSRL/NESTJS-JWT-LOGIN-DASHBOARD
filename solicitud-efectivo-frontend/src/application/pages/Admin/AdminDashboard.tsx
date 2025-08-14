

import SkeletonGetUsers from "@/application/components/Admin/SkeletonGetUsers";
import { getAllEmployees } from "@/infrastructure/api/Admin/admin";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";




export default function Dashboard() {

  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-black'
  const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0'

  if(isLoading) return <SkeletonGetUsers/>

  if(data) return (
    
    <div className="mt-10 p-6 sm:p-10 bg-white shadow-lg">

      <div className="flex flex-col sm:flex-row justify-between items-center">

        
        <h2 className="text-xs sm:text-base md:text-xl text-emerald-500 font-bold">
          Gestion de Usuario
        </h2>

        <Link to="/create-employee"
          className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
        >
          Agregar Empleado
        </Link>

      </div>


    <div className="border border-green-300 overflow-hidden my-5">

      <div className="relative w-full overflow-auto">

          <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">
                  <tr className=" border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className={`${tableCssHeader}`}>Empleado</th>
                    <th className={`${tableCssHeader}`}>Cedula</th>
                    <th className={`${tableCssHeader}`}>Rol</th>
                    <th className={`${tableCssHeader}`}>Correo</th>
                    <th className={`${tableCssHeader}`}>Acciones</th>
                  </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0 bg-white">
                 
                {data.Token.map((data) => (
                  <tr className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className={tableCss}> {data.fullname}</td>
                      <td className={tableCss}> {data.cedula}</td>
                      <td className={tableCss}> {data.role}</td>
                      <td className={tableCss}> {data.user_email}</td>

                      <div className="flex items-center">
                        <td className={tableCss}><TbEdit size={24} className="text-blue-500"/></td>
                        <td className={tableCss}><FaRegTrashAlt size={20} className="text-red-500"/></td>
                      </div>

                    </tr>
                ))}
              </tbody>
          </table>

      </div>
    </div>
  </div>

      
  );
}

