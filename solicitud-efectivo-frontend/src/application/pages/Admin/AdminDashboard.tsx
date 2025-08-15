

import SkeletonGetUsers from "@/application/components/Admin/SkeletonGetUsers";
import { getAllEmployees } from "@/infrastructure/api/Admin/admin";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import Container from "@/application/ui/Container/Container";
import Pagination from "@/application/components/Pagination";


export default function Dashboard() {

  const navigate = useNavigate()

  const location = useLocation()

  const urlParams = new URLSearchParams(location.search)

  const pageNumber = urlParams.get("pageNumber")

  const limit = 10 /* Cambiar a un select para ver cantidad de registros */

  const { data, isLoading } = useQuery({
    queryKey: ["employees", Number(pageNumber), limit],
    queryFn: () => getAllEmployees({page: Number(pageNumber), limit}),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-black'
  const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0'

  
  if(isLoading) return <SkeletonGetUsers/>

  const onClick = (id: number) => {
    navigate(`/edit-employee?employeeId=${id}`)
  }
  
  if(data) return (
    
    <Container className="mt-10 p-6 sm:p-10 bg-white shadow-lg">

      <Container className="flex flex-col sm:flex-row justify-between items-center">

        
        <h2 className="text-xs sm:text-base md:text-xl text-emerald-500 font-bold">
          Gestion de Usuario
        </h2>

        <Link to="/create-employee"
          className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
        >
          Agregar Empleado
        </Link>

      </Container>


    <Container className="border border-green-300 overflow-hidden my-5">

      <Container className="relative w-full overflow-auto">

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
   
                {data.data.map((data, index) => (
                  <tr key={index} className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className={tableCss}> {data.fullname}</td>
                      <td className={tableCss}> {data.cedula}</td>
                      <td className={tableCss}> {data.role}</td>
                      <td className={tableCss}> {data.user_email}</td>
                      <td className={`${tableCss} flex items-center space-x-2`}>
                        <button
                          onClick={() => onClick(data.id)}
                        >
                          <TbEdit size={24} className="text-blue-500 cursor-pointer hover:text-blue-700"/>
                        </button>
                        <button>
                          <FaRegTrashAlt size={20} className="text-red-500 cursor-pointer hover:text-red-700"/>
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
          </table>

      </Container>

    </Container>

    <Pagination totalRecords={data.total} pageSize={data.limit}/>

  </Container>

      
  );
}

