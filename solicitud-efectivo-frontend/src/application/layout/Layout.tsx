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

  const [isOpen, setIsOpen] = useState(false) 
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true) 

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleTouchStart = () => {
    setIsOpen(false) 
  }

  const getInfoUsers = useAppStore(state => state.GetUserFromToken)

  useEffect(() => {
    getInfoUsers()
  }, [])

  useEffect(() => {

    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth < 1024 
      setIsMobileOrTablet(isSmallScreen)
      
      if (isSmallScreen) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
    
    checkScreenSize()

    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
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
        ${!isMobileOrTablet && isOpen ? 'ml-72' : 'ml-0'}
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
