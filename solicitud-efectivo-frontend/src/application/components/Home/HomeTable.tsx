import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";

const HomeTable = () => {

    const tableCssHeader = 'text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] font-semibold text-emerald-800'
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

    
        <div className="flex items-center justify-between mt-10 ">
            <div className="flex items-center gap-3">
            
                <h2 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800">Pendiente de Aprobación</h2>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm sm:text-base font-medium">33 solicitudes • $156,500.00</span>
                
            </div>
        </div>

        <div className="rounded-md border border-gray-400 mt-5 overflow-hidden">

            <div className="relative w-full overflow-auto">

                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">
                        <tr className=" border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className={tableCssHeader}>Solicitud</th>
                            <th className={tableCssHeader}>Fecha</th>
                            <th className={tableCssHeader}>División</th>
                            <th className={tableCssHeader}>Solicitante</th>
                            <th className={tableCssHeader}>Monto</th>
                            <th className={tableCssHeader}>Tipo de Pago</th>
                            <th className={tableCssHeader}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 bg-white">
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                        <tr className="border-b border-gray-400 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className={tableCss}>2025-01431</td>
                            <td className={tableCss}>2025-07-30</td>
                            <td className={tableCss}>Administración</td>
                            <td className={tableCss}>Frandy Jeffry Cepeda</td>
                            <td className={tableCss}>5,000,000</td>
                            <td className={tableCss}>Cheque</td>
                            <td className={tableCss}>Iconos</td>
                        </tr>
                    </tbody>
                </table>

            </div>


        </div>

            <div className="flex w-full items-center justify-center mt-5 gap-2">

                <div className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground border h-10 w-10 bg-white border-emerald-200 hover:bg-emerald-50 cursor-pointer">
                    <RiArrowLeftSLine/>
                </div>

                <div className="flex gap-2">

                    {numerosItems.map((item) => (
                        <span className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center bg-white gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background hover:text-accent-foreground border w-8 h-8 border-emerald-200 hover:bg-emerald-50 cursor-pointer">
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

export default HomeTable
