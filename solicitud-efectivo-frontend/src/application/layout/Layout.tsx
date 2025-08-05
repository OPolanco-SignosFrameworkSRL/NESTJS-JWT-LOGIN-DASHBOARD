import { Outlet } from "react-router-dom"

import Header from "@/application/components/Header"
import Footer from "@/application/components/Footer"
import AsideMenu from "../components/AsideMenu"
import Container from "../ui/Container/Container"
import { useState, useEffect } from "react"
import { useAppStore } from "../store/useAppStore"
import ModalProfile from "../components/Home/ModalProfile"
import { useCloseModalOnRouteChange } from "../hooks/useCloseModalOnRouteChange"

const Layout = () => {

  useCloseModalOnRouteChange();

  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleTouchStart = () => {
    setIsOpen(false) 
  }

  useEffect(() => {

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      }
    }
    
    checkMobile()

    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const show = useAppStore(state => state.show)

  return (

    <>

      {/* AsideMenu Start */}
      
      <aside>
        <AsideMenu isOpen={isOpen} handleTouchStart={handleTouchStart} />
      </aside>

        
      {/* AsideMenu End */}

      {/* Content Start */}
      <Container className={`
        transition-all 
        duration-500 
        ease-in-out 
        ${!isMobile && isOpen ? 'ml-72' : 'ml-0'}
      `}>
        
        
        <header className="w-full sticky top-0 z-50 lg:relative"> 
            <Header handleOpen={handleOpen}/>
        </header>
        
        {show && <ModalProfile/>}

          <main className="m-5 sm:m-10">

            <Outlet/>

          </main>
 
        <footer>    
            <Footer/>
        </footer>

      </Container>
      {/* Content End */}

      
    </>

  )

}

export default Layout
