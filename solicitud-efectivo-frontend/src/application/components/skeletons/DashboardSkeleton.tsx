import Container from "@/application/ui/Container/Container"

const DashboardSkeleton = () => {

  return (

    <>

        <Container className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-5">
            {Array.from({length: 2}).map((_, index) => (
        
                <Container key={index} className="p-5 border border-green-400 rounded-md shadow-md items-center space-y-5">
    
                    <Container className="flex gap-5 items-center">
    
                        <Container className="h-8 bg-gray-200 animate-pulse rounded w-8"></Container>
    
                        <Container className="h-8 bg-gray-200 animate-pulse rounded w-1/6"></Container>
    
    
                    </Container>
    
                    <Container>
    
                        <Container className="h-8 bg-gray-200 animate-pulse rounded w-8"></Container>
    
                    </Container>
    
                    <Container className="flex flex-col xl:flex-row xl:justify-between">
    
                        <Container className="h-8 bg-gray-200 animate-pulse rounded w-2/6"></Container>
    
    
                        <Container className="h-8 bg-gray-200 animate-pulse rounded w-2/6"></Container>
    
    
                    </Container>
    
                </Container>
                    
            ))}
        </Container>
    
    </>

  )
}

export default DashboardSkeleton
