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
import ErrorTable from "@/application/components/admin/ErrorTable";
import TableSkeleton from "@/application/components/skeletons/TableSkeleton";

export default function EmployeeTable() {

  const pageNumber = getUrlParams("pageNumber") || 1

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const limit = 10 /* Cambiar a un select para ver cantidad de registros */

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employees", Number(pageNumber), limit],
    queryFn: () => getAllEmployees({page: Number(pageNumber), limit}),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-black'
  const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0 truncate'
  
  const onClick = (employeeId: number) => {
    //queryClient.invalidateQueries({ queryKey: ["editEmployee", String(employeeId)] })
    navigate(`/edit-employee?employeeId=${employeeId}`)
  }

  const handleShowModal = useAppStore(state => state.handleShowModal)

  const { mutate } = useMutation({

    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      toast.success("Empleado eliminado correctamente")
    },
    onError: () => {
      toast.error("No se pudo eliminar el empleado")
    }
  })

  const handleDeleteEmployee = (employeeId: number) => {
    mutate(employeeId)
  }

  let employeeId : number

  if(isLoading) return <TableSkeleton/>  

  if(isError) return <ErrorTable/>
  
  if(data) return (
    
    <Container>

      <Container className="flex flex-row justify-between items-center">

        <h2 className="text-xl sm:text-base md:text-xl text-emerald-500 font-bold">
          Empleados
        </h2>

        <Link to="/create-employee"
          className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
        >
          Agregar Empleado
        </Link>

      </Container>


      <Container className="flex flex-col md:flex-row gap-3 md:gap-5 py-5 w-full">

        <Container className="flex flex-col gap-2 w-full">

            <span className="text-sm sm:text-base text-gray-800 font-semibold">Buscar:</span>

            <Input
                type="text"
                placeholder="Buscar"
                twMerge={(...classes) => twMerge(classes, "border-gray-300 focus:ring-gray-300 h-11")}
            />

        </Container>

        <Container className="flex flex-col gap-2 w-full md:w-1/2 lg:w-3/6 xl:w-2/6  ">

            <span className="text-sm sm:text-base text-gray-800 font-semibold whitespace-nowrap">Estado:</span>

            <Select
                options={[]}
                placeholder="Buscar"
                twMerge={(...classes) => twMerge(classes, "border-gray-300 focus:ring-gray-300")}
            />

        </Container>

      </Container>

      <Container className="border border-green-300 overflow-hidden my-5">


        <Container className="relative w-full overflow-auto">

          <table className="w-full caption-bottom text-sm">

              <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">

                  <tr className=" border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  
                    <th className={`${tableCssHeader}`}>Cedula</th>
                    <th className={`${tableCssHeader}`}>Empleado</th>
                    <th className={`${tableCssHeader}`}>Rol</th>
                    <th className={`${tableCssHeader}`}>Correo</th>
                    <th className={`${tableCssHeader}`}>Estado</th>
                    <th className={`${tableCssHeader}`}>Acciones</th>

                  </tr>

              </thead>

              <tbody className="[&_tr:last-child]:border-0 bg-white">
    
                {data.data.map((data, index) => (
                  <tr key={index} className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className={tableCss}> {data.cedula}</td>
                    <td className={tableCss}> {data.fullname}</td>
                    <td className={tableCss}> {data.roles?.map(item => item.roleName).join(", ")}</td>
                    <td className={tableCss}> {data.user_email}</td>
                    <td className={`${tableCss}`}> 
                      {data.valido.toString() === "true" ? (
                        <div className="bg-green-100 text-green-800 hover:bg-green-100 rounded-full w-24 flex items-center justify-center">Activo</div>
                      ) : (
                        <div className="bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-full w-24 flex items-center justify-center">Inactivo</div>
                      ) }
                    </td>
                    <td className={`${tableCss} flex items-center space-x-6`}>
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

