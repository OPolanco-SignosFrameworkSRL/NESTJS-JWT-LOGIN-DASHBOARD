import { Outlet } from "react-router-dom"

import Header from "@/application/components/Header"
import Footer from "@/application/components/Footer"

const Layout = () => {

  return (

    <>

        <header>
            <Header/>
        </header>

        <main>
            <Outlet/>
        </main>

        <footer>    
            <Footer/>
        </footer>
    
    </>

  )

}

export default Layout
