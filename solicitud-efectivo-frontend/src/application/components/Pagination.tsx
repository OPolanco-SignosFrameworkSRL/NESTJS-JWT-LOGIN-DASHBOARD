import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import Container from '../ui/container/Container'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Select from '../ui/select/Select'
import { MdLabel } from 'react-icons/md'

type PaginationProps = {
    totalRecords: number
    pageSize: number
    onPageChange?: (page: number) => void
}

const Pagination = ({totalRecords, pageSize, onPageChange}: PaginationProps) => {

    const navigate = useNavigate()

    const location = useLocation()
    
    const getInitialPage = () => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = searchParams.get("pageNumber");
        return pageParam ? Number(pageParam) : 1;
    };

    const [currentPage, setCurrentPage] = useState(getInitialPage)

    const totalPages = Math.ceil(totalRecords / pageSize)

    const updateUrl = (page: number) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("pageNumber", page.toString());
        navigate(`?${searchParams.toString()}`);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            updateUrl(page)
            if (onPageChange) {
                onPageChange(page)
            }
        }
    }
    
    useEffect(() => {
        const page = getInitialPage();
        if (page !== currentPage) {
            setCurrentPage(page);
            if (onPageChange) {
                onPageChange(page);
            }
        }
    }, [location.search, onPageChange, currentPage]);
    
    const getVisiblePageNumbers = () => {
        const visiblePages = 2;
        const halfVisible = Math.floor(visiblePages / 2);
        let start = Math.max(1, currentPage - halfVisible);
        let end = Math.min(totalPages, start + visiblePages - 1);
      
        if (end - start + 1 < visiblePages) {
            start = Math.max(1, end - visiblePages + 1);
        }
      
        let pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      
        if (!pages.includes(1) && pages.length > 0) {
            pages = [1, ...pages];
        }
        
        if (!pages.includes(totalPages) && totalPages > 1) {
            pages.push(totalPages);
        }
      
        return pages;
    };

    const visiblePageNumbers = getVisiblePageNumbers();

    const numbers = [
        {number: 20},
        {number: 30}
    ]

    return (


        <Container className="flex flex-col sm:flex-row items-center w-full">

            <Container className="flex justify-start w-full">
                <Container className="mb-5 sm:mb-0">{`Mostrando ${pageSize < totalRecords ? pageSize : totalRecords} de ${totalRecords} registros`}</Container>
            </Container>


            <Container className="flex justify-end w-full gap-2  ">

                <Container className="flex items-center gap-5 w-60 ">
                    <Container className="">Mostrar</Container>
                    <Select
                        options={numbers.map((items, index) => ({
                            value: index,
                            label: items.number
                        }))}
                        placeholder='10'
                    />
                    <Container className="">Registros</Container>
                </Container>

                <Container className="flex items-center gap-2">

                    <Container 
                        className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground border h-10 w-10 bg-white border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        <RiArrowLeftSLine/>
                    </Container>

                    <Container className="flex gap-2">
                        {visiblePageNumbers.map((number) => (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                className={` border-2 border-emerald-200 rounded-md w-10 h-10 flex items-center justify-center cursor-pointer ${
                                    currentPage === number ? "bg-emerald-50" : ""
                                }`}
                            >
                                <Container
                                    className={`pagination-button ${
                                        currentPage === number ? "active-arrow" : ""
                                    }`}
                                >
                                    {number}
                                </Container>
                            </button>
                        ))}
                    </Container>

                    <Container 
                        className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none bg-white disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground border h-10 w-10 border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        <RiArrowRightSLine/>
                    </Container>

                </Container>


            </Container>

        </Container>    

    )
}

export default Pagination
