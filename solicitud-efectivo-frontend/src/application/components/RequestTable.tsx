import Input from "../ui/Input/Input";
import Select from "../ui/Select/Select";
import { twMerge } from 'tailwind-merge'
import Container from "../ui/Container/Container";
import Pagination from "./Pagination";
import Text from "../ui/Text/Text";


const RequestTable = () => {

    const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-black'
    const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0 truncate'

  return (

    <>

        <Container className="bg-white rounded-md border border-green-500 mt-10 shadow-xl">

            <Container className="pt-5">
                <Container className="flex items-center gap-3 w-full justify-between px-10">
                
                    <h2 className="text-sm sm:text-base lg:text-xl font-semibold text-green-800">Flujo de Actividades</h2>
                    <span className="px-3 py-1 bg-transparent border border-green-400 text-green-800 rounded-full text-sm sm:text-base font-medium">33 solicitudes</span>
                    
                </Container>
            </Container>

            <Container className="flex flex-col md:flex-row gap-3 md:gap-5 px-10 py-5 w-full">

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

                <Container className="border border-green-300 overflow-hidden mx-10 my-5">

                    <Container className="relative w-full overflow-auto">

                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">
                                <tr className=" border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className={tableCssHeader}>N° Solicitud</th>
                                    <th className={tableCssHeader}>Fecha</th>
                                    <th className={tableCssHeader}>Solicitante</th>
                                    <th className={tableCssHeader}>Containerision</th>
                                    <th className={tableCssHeader}>Monto</th>
                                    <th className={tableCssHeader}>Tipo de Pago</th>
                                    <th className={tableCssHeader}>Estado</th>
                                    <th className={tableCssHeader}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0 bg-white">
                                <tr className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className={tableCss}>2025-01431</td>
                                    <td className={tableCss}>2025-07-30</td>
                                    <td className={tableCss}>Frandy Jeffry Cepeda</td>
                                    <td className={tableCss}>Administración</td>
                                    <td className={tableCss}>5,000,000</td>
                                    <td className={tableCss}>Cheque</td>
                                    <td className={tableCss}>Pendiente</td>
                                    <td className={tableCss}>Iconos</td>
                                </tr>
                                <tr className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className={tableCss}>2025-01431</td>
                                    <td className={tableCss}>2025-07-30</td>
                                    <td className={tableCss}>Frandy Jeffry Cepeda</td>
                                    <td className={tableCss}>Administración</td>
                                    <td className={tableCss}>5,000,000</td>
                                    <td className={tableCss}>Cheque</td>
                                    <td className={tableCss}>Aprobado</td>
                                    <td className={tableCss}>Iconos</td>
                                </tr>
                            </tbody>
                        </table>

                    </Container>

                </Container>

                <div className="flex  mb-5">
                    <Pagination totalRecords={200} pageSize={10}/>
                </div>


            </Container>

          

    </>


  )
}

export default RequestTable
