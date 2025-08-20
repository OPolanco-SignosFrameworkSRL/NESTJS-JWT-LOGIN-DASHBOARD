

import SkeletonGetUsers from "@/application/components/Admin/SkeletonTable";
import { deleteEmployee, getAllEmployees } from "@/infrastructure/api/admin/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import Container from "@/application/ui/Container/Container";
import Pagination from "@/application/components/Pagination";
import Select from "@/application/ui/Select/Select";
import Input from "@/application/ui/Input/Input";
import { twMerge } from "tailwind-merge";
import { getUrlParams } from "@/shared/utilts/GetUrlParams";
import { useAppStore } from "@/application/store/useAppStore";
import ConfirmEliminationModal from "@/application/components/ConfirmEliminationModal";
import toast from "react-hot-toast";


export default function RolesTable() {

  const pageNumber = getUrlParams("pageNumber") || 1

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const limit = 10 /* Cambiar a un select para ver cantidad de registros */

  const { data, isLoading } = useQuery({
    queryKey: ["employees", Number(pageNumber), limit],
    queryFn: () => getAllEmployees({page: Number(pageNumber), limit}),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-black'
  const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0'

  
  const onClick = (employeeId: number) => {
    queryClient.invalidateQueries({ queryKey: ["editEmployee", String(employeeId)] })
    navigate(`/edit-employee?employeeId=${employeeId}`)
  }

  const handleShowModal = useAppStore(state => state.handleShowModal)

  const { mutate } = useMutation({

    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ["employees"] })
      toast.success("Empleado eliminado correctamente")
    },
    onError: () => {
      toast.error("No se pudo eliminar el empleado")
    }
  })


  const handleDeleteEmployee = (employeeId: number) => {
    console.log(employeeId)
    mutate(employeeId)
  }

  let employeeId : number

  if(isLoading) return <SkeletonGetUsers/>  
  
  if(data) return (
    
    <Container className=" ">

      <Container className="flex flex-col sm:flex-row justify-between items-center">

        
        <h2 className="text-xs sm:text-base md:text-xl text-emerald-500 font-bold">
          Roles
        </h2>

        <Link to="/create-employee"
          className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
        >
          Agregar Rol
        </Link>

      </Container>


      <div className="flex flex-col md:flex-row gap-3 md:gap-5 py-5 w-full">

        <div className="flex items-center gap-2 w-full md:flex-grow">

            <span className="text-sm sm:text-base text-gray-800 font-semibold">Buscar:</span>
            <Input
                type="text"
                placeholder="Buscar"
                twMerge={(...classes) => twMerge(classes, "border-gray-300 focus:ring-gray-300 h-11")}
            />

        </div>

        <div className="flex items-center gap-2 w-full md:w-1/2 lg:w-3/6 xl:w-2/6  ">

            <span className="text-sm sm:text-base text-gray-800 font-semibold whitespace-nowrap">Estado:</span>

            <Select
                options={[]}
                placeholder="Buscar"
                twMerge={(...classes) => twMerge(classes, "border-gray-300 focus:ring-gray-300")}
            />

        </div>

      </div>

      <Container className="border border-green-300 overflow-hidden my-5">


        <Container className="relative w-full overflow-auto">

          <table className="w-full caption-bottom text-sm">

              <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">
                  <tr className=" border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className={`${tableCssHeader}`}>Descripción</th>
                    <th className={`${tableCssHeader}`}>Estado</th>
                    <th className={`${tableCssHeader}`}>Acciones</th>
                  </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0 bg-white">
    
                {data.data.map((data, index) => (
                  <tr key={index} className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className={tableCss}> {data.fullname}</td>
                      <td className={tableCss}> {data.cedula}</td>
                      <td className={`${tableCss} flex items-center space-x-2`}>
                        <button
                          onClick={() => onClick(data.id)}
                        >
                          <TbEdit size={24} className="text-blue-500 cursor-pointer hover:text-blue-700"/>
                        </button>
                        <button
                          onClick={() => {
                            handleShowModal("adminTable")
                            employeeId = data.id
                          }}
                        >
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

      <ConfirmEliminationModal onClickCloseModalArgs="adminTable" handleDelete={() => handleDeleteEmployee(employeeId)}/>

    </Container>

      
  );
}

