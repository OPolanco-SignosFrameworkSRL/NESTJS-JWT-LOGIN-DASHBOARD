import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import Input from "../ui/Input/Input";
import Select from "../ui/Select/Select";
import { twMerge } from 'tailwind-merge'


const RequestTable = () => {

    const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-black'
    const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0'

    const numerosItems = [
        {number: "1"},
        {number: "2"},
        {number: "3"},
        {number: "4"},
        {number: "5"},
    ]

  return (

    <>

    <div className="bg-white rounded-md border border-green-500 mt-10 shadow-xl">

                <div className="pt-5">
                    <div className="flex items-center gap-3 w-full justify-between px-10">
                    
                        <h2 className="text-sm sm:text-base lg:text-xl font-semibold text-green-800">Flujo de Actividades</h2>
                        <span className="px-3 py-1 bg-transparent border border-green-400 text-green-800 rounded-full text-sm sm:text-base font-medium">33 solicitudes</span>
                        
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-5 px-10 py-5 w-full">

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

                <div className="border border-green-300 overflow-hidden mx-10 my-5">

                    <div className="relative w-full overflow-auto">

                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">
                                <tr className=" border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className={tableCssHeader}>N° Solicitud</th>
                                    <th className={tableCssHeader}>Fecha</th>
                                    <th className={tableCssHeader}>Solicitante</th>
                                    <th className={tableCssHeader}>Division</th>
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

                    </div>


                </div>
            </div>

    

            <div className="flex w-full items-center justify-center mt-5 gap-2">

                <div className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground border h-10 w-10 bg-white border-emerald-200 hover:bg-emerald-50 cursor-pointer">
                    <RiArrowLeftSLine/>
                </div>

                <div className="flex gap-2">

                    {numerosItems.map((item, index) => (
                        <span key={index} className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center bg-white gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background hover:text-accent-foreground border w-8 h-8 border-emerald-200 hover:bg-emerald-50 cursor-pointer">
                            {item.number}
                        </span>
                    ))}

                </div>

                <div className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none bg-white disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground border h-10 w-10 border-emerald-200 hover:bg-emerald-50 cursor-pointer ">
                    <RiArrowRightSLine/>
                </div>
                
            </div>

    </>

   


      

 

  )
}

export default RequestTable
