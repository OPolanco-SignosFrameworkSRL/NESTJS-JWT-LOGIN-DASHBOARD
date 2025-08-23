import { Outlet } from "react-router-dom"

import Header from "@/application/components/Header"
import Footer from "@/application/components/Footer"
import AsideMenu from "../components/AsideMenu"
import Container from "../ui/Container/Container"
import { useState, useEffect } from "react"
import { useAppStore } from "../store/useAppStore"
import ModalProfile from "../components/home/ModalProfile"
import { useCloseModalOnRouteChange } from "../hooks/useCloseModalOnRouteChange"

import { Toaster }  from "react-hot-toast"

const Layout = () => {

  useCloseModalOnRouteChange();

  const isNavOpen = useAppStore(state => state.isNavOpen)

  const handleShowNav = useAppStore(state => state.handleShowNav)
  const closeNav = useAppStore(state => state.closeNav)

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true) 

  const handleOpen = () => {
    handleShowNav()
  }

  const handleTouchStart = () => {
    closeNav()
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
        closeNav()
      } else {
        handleShowNav()
      }
    }
    
    checkScreenSize()

    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const showHeaderModal = useAppStore(state => state.showHeaderModal)

  return (

    <>

      <Toaster
       position="top-right"
       reverseOrder={false}
      />

      {/* AsideMenu Start */}
      
      <aside>
        <AsideMenu isOpen={isNavOpen} handleTouchStart={handleTouchStart} />
      </aside>

        
      {/* AsideMenu End */}

      {/* Content Start */}
      <Container className={`
        transition-all 
        duration-500 
        ease-in-out 
        ${!isMobileOrTablet && isNavOpen ? 'ml-72' : 'ml-0'}
      `}>
        
        
        <header className="w-full sticky top-0 z-50 lg:relative"> 
            <Header handleOpen={handleOpen}/>
        </header>
        
        {showHeaderModal && <ModalProfile/>}

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
