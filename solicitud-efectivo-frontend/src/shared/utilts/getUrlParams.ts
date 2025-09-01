import { useLocation } from "react-router-dom"


export const getUrlParams = (param: string) => {

    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)

    return searchParams.get(param);

}