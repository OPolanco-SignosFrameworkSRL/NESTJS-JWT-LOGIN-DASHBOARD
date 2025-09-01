
import { TbEdit } from "react-icons/tb"
import { FaRegTrashAlt } from "react-icons/fa"
import Container from "@/application/ui/container/Container"
import Select from "@/application/ui/select/Select"
import { twMerge } from "tailwind-merge"
import Input from "@/application/ui/input/Input"
import { Link } from "react-router-dom"
import Title from "@/application/ui/text/Title"



const tableCssHeader = "px-4 py-2 text-left text-gray-700 font-semibold"
const tableCss = "px-4 py-2 text-gray-800"

export const Facilities = () => {

  return (
    <>

    <div className="flex flex-col bg-gradient-to-r from-green-600 to-emerald-600 p-6">

          <Title text="$ Desembolso" isTitle={true} className="text-white"/>

          <Title text="Registro de desembolso de efectivo" isTitle={false} className="!text-gray-300"/>

      </div>
      <Container className="bg-white p-5">

<Container className="flex flex-row justify-between items-center">

  <h2 className="text-xl sm:text-base md:text-xl text-emerald-500 font-bold">
    Recintos
  </h2>

  <Link to="/create-employee"
    className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
  >
    Agregar Recinto
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
            
              <th className={`${tableCssHeader}`}>División</th>
              <th className={`${tableCssHeader}`}>Descripción</th>
              <th className={`${tableCssHeader}`}>Estado</th>
              <th className={`${tableCssHeader}`}>Acciones</th>

            </tr>

        </thead>

        <tbody className="[&_tr:last-child]:border-0 bg-white">

        
            <tr  className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className={tableCss}> 2</td>
              <td className={tableCss}> 3</td>
              <td className={tableCss}> 5</td>
              {/*
              
              <td className={`${tableCss}`}> 
                {data.valido.toString() === "true" ? (
                  <div className="bg-green-100 text-green-800 hover:bg-green-100 rounded-full w-24 flex items-center justify-center">Activo</div>
                ) : (
                  <div className="bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-full w-24 flex items-center justify-center">Inactivo</div>
                ) }
              </td>
              */}
              <td className={`${tableCss} flex items-center space-x-6`}>
                <button
                  onClick={() => {}}
                >
                  <TbEdit size={24} className="text-blue-500 cursor-pointer hover:text-blue-700"/>
                </button>
                <button
                  onClick={() => {
                    
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

    </>
  )
}

export default Facilities
