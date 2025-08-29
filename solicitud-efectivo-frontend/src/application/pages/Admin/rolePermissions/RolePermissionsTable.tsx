import ConfirmEliminationModal from "@/application/components/ConfirmEliminationModal"
import Pagination from "@/application/components/Pagination"
import Container from "@/application/ui/Container/Container"
import Input from "@/application/ui/Input/Input"
import Select from "@/application/ui/Select/Select"
import { FaRegTrashAlt } from "react-icons/fa"
import { TbEdit } from "react-icons/tb"
import { Link } from "react-router-dom"
import { twMerge } from "tailwind-merge"


const RolePermissionsTable = () => {

  const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-black'
  const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0 truncate'

  return (

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

        <Container className="flex items-center gap-2 w-full md:flex-grow">

            <span className="text-sm sm:text-base text-gray-800 font-semibold">Buscar:</span>
            <Input
              type="text"
              placeholder="Buscar"
              twMerge={(...classes) => twMerge(classes, "border-gray-300 focus:ring-gray-300 h-11")}
            />

        </Container>

        <Container className="flex items-center gap-2 w-full md:w-1/2 lg:w-3/6 xl:w-2/6  ">

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
                  
                    <th className={`${tableCssHeader}`}>Módulo</th>
                    <th className={`${tableCssHeader}`}>Ver</th>
                    <th className={`${tableCssHeader}`}>Crear</th>
                    <th className={`${tableCssHeader}`}>Editar</th>
                    <th className={`${tableCssHeader}`}>Eliminar</th>
                    <th className={`${tableCssHeader}`}>Exportar</th>

                  </tr>

              </thead>

              <tbody className="[&_tr:last-child]:border-0 bg-white">
    
                  <tr className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className={tableCss}>test</td>
                    <td className={tableCss}>test</td>
                    <td className={tableCss}>test</td>
                    <td className={tableCss}></td>
                    <td className={`${tableCss}`}> 
                      {/*
                      {data.valido.toString() === "true" ? (
                        <div className="bg-green-100 text-green-800 hover:bg-green-100 rounded-full w-24 flex items-center justify-center">Activo</div>
                      ) : (
                        <div className="bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-full w-24 flex items-center justify-center">Inactivo</div>
                      ) }
                       */}
                    </td>
                    <td className={`${tableCss} flex items-center space-x-2`}>
                      <button
                        onClick={() => {}}
                      >
                        <TbEdit size={24} className="text-blue-500 cursor-pointer hover:text-blue-700"/>
                      </button>
                      <button
                        onClick={() => {
                          //handleShowModal("adminTable")
                          //employeeId = data.id
                        }}
                      >
                        <FaRegTrashAlt size={20} className="text-red-500 cursor-pointer hover:text-red-700"/>
                      </button>
                    </td>
                  </tr>

              </tbody>

          </table>

        </Container>

      </Container>

      {/*<Pagination totalRecords={data.total} pageSize={data.limit}/>*/}

      {/*<ConfirmEliminationModal onClickCloseModalArgs="adminTable" handleDelete={() => handleDeleteEmployee(employeeId)}/>*/}

    </Container>

  )
  
}

export default RolePermissionsTable

{/*
    
    <div className="container py-16">
            
    <label className="flex items-center cursor-pointer select-none text-dark dark:text-white">

        <div className="relative">

            <input type="checkbox" id="4" className="peer sr-only" />

            <div className="block h-8 rounded-full box bg-dark dark:bg-dark-2 w-14 peer-checked:bg-primary bg-green-500"></div>
            <div className="absolute flex items-center justify-center w-6 h-6 transition bg-white rounded-full dot left-1 top-1 dark:bg-dark-5 peer-checked:translate-x-full peer-checked:dark:bg-white"></div>

        </div>

    </label>

    </div>
*/}
