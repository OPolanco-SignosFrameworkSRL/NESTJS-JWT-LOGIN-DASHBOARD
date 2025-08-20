import Container from "@/application/ui/Container/Container"

const SkeletonTable = () => {

  const tableCssHeader = `text-sm sm:text-base h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 w-[120px] 
  font-semibold text-black`
  const tableCss = 'text-sm sm:text-base p-4 align-middle [&:has([role=checkbox])]:pr-0'

  return (
       
    <Container>

      <Container className="flex flex-row justify-between items-center">

        
        <Container className="h-8 bg-gray-200 rounded animate-pulse w-2/6"></Container>

        <Container className="h-8 bg-gray-200 rounded animate-pulse w-3/6"></Container>

      </Container>


      <Container className="flex flex-col md:flex-row gap-3 md:gap-5 py-5 w-full ">

        <Container className="flex items-center gap-2 w-full md:flex-grow">

            <Container className="h-8 bg-gray-200 rounded animate-pulse w-3/6 md:w-3/6 lg:w-2/6"></Container>

            <Container className="h-8 bg-gray-200 rounded animate-pulse w-full"></Container>

        </Container>

        <Container className="flex items-center gap-2 w-full md:w-1/2 lg:w-3/6 xl:w-2/6  ">

          <Container className="h-8 bg-gray-200 rounded animate-pulse w-3/6 md:w-4/6 "></Container>

          <Container className="h-8 bg-gray-200 rounded animate-pulse w-full"></Container>
           
        </Container>

      </Container>

      <Container className="border border-green-300 overflow-hidden my-5">


        <Container className="relative w-full overflow-auto">

          <table className="w-full caption-bottom text-sm">

              <thead className="[&_tr]:border-b bg-gradient-to-r from-emerald-50 to-green-50">

                <tr className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className={`${tableCssHeader}`}>
                    <Container className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></Container>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <Container className="h-4 bg-gray-200 rounded animate-pulse w-2/4"></Container>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <Container className="h-4 bg-gray-200 rounded animate-pulse w-2/6"></Container>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <Container className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></Container>
                  </th>
                  <th className={`${tableCssHeader}`}>
                    <Container className="h-4 bg-gray-200 rounded animate-pulse w-2/4"></Container>
                  </th>
                </tr>

              </thead>

              <tbody className="[&_tr:last-child]:border-0 bg-white">
    
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b border-green-300 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className={tableCss}>
                        <Container className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></Container>
                      </td>
                      <td className={tableCss}>
                        <Container className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></Container>
                      </td>
                      <td className={tableCss}>
                        <Container className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></Container>
                      </td>
                      <td className={tableCss}>
                        <Container className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></Container>
                      </td>
                      <td className={`${tableCss} flex items-center space-x-2`}>
                        <Container className="animate-pulse h-4 w-4 bg-gray-200 rounded"></Container>
                        <Container className="animate-pulse h-4 w-4 bg-gray-200 rounded"></Container>
                      </td>
                    </tr>
                ))}
                
              </tbody>

          </table>

        </Container>

      </Container>

      <Container className="flex justify-center mt-4">
        <Container className="h-8 bg-gray-200 rounded animate-pulse w-64"></Container>
      </Container>

    </Container>
  )
  
}

export default SkeletonTable
