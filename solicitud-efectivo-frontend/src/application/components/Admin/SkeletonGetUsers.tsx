import Container from "@/application/ui/Container/Container"
import Input from "@/application/ui/Input/Input"
import Select from "@/application/ui/Select/Select"
import { FaRegTrashAlt } from "react-icons/fa"
import { TbEdit } from "react-icons/tb"
import { twMerge } from "tailwind-merge"

const SkeletonGetUsers = () => {

  const tableCssHeader = `text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] 
  font-semibold text-black`
  const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0'

  return (
       
    <Container>

      <Container className="flex flex-col sm:flex-row justify-between items-center">

        
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/6"></div>

        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/6"></div>

      </Container>


      <div className="flex flex-col md:flex-row gap-3 md:gap-5 py-5 w-full">

        <div className="flex items-center gap-2 w-full md:flex-grow">

            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>

            <div className="h-8 bg-gray-200 rounded animate-pulse w-full"></div>

        </div>

        <div className="flex items-center gap-2 w-full md:w-1/2 lg:w-3/6 xl:w-2/6  ">

          
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>

          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
           

            

        </div>

      </div>

      <Container className="border border-green-300 overflow-hidden my-5">


        <Container className="relative w-full overflow-auto">

          <table className="w-full caption-bottom text-sm">

              <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">

                <tr className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className={`${tableCssHeader}`}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/4"></div>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/6"></div>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/4"></div>
                  </th>
                </tr>

              </thead>

              <tbody className="[&_tr:last-child]:border-0 bg-white">
    
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className={tableCss}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </td>
                      <td className={tableCss}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </td>
                      <td className={tableCss}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      </td>
                      <td className={tableCss}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </td>
                      <td className={`${tableCss} flex items-center space-x-2`}>
                        <div className="animate-pulse h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="animate-pulse h-4 w-4 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                ))}
                
              </tbody>

          </table>

        </Container>

      </Container>

      <div className="flex justify-center mt-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
      </div>

    </Container>
  )
  
}

export default SkeletonGetUsers
