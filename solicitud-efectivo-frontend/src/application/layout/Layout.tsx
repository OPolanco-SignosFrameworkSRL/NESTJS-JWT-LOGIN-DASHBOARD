import { Outlet } from "react-router-dom"

import Header from "@/application/components/Header"
import Footer from "@/application/components/Footer"
import AsideMenu from "../components/AsideMenu"
import Container from "../ui/Container"
import { useState, useEffect } from "react"

const Layout = () => {

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

  return (

    <>

    {/* AsideMenu Start */}

      <AsideMenu isOpen={isOpen} handleTouchStart={handleTouchStart} />
      
    {/* AsideMenu End */}

    {/* Content Start */}
    <Container className={`
      transition-all 
      duration-500 
      ease-in-out 
      ${!isMobile && isOpen ? 'ml-64' : 'ml-0'}
    `}>
      
      <header className="w-full"> 
          <Header handleOpen={handleOpen}/>
      </header>

      <main>
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
