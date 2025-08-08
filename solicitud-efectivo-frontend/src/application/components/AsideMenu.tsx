import Container from "../ui/Container/Container"
import { useEffect, useState } from "react"
import Nav from "./Nav"

type AsideMenuProps = {
    isOpen: boolean
    handleTouchStart: () => void
}

const AsideMenu = ({ isOpen, handleTouchStart }: AsideMenuProps) => {

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true) // Renombrado para mayor claridad

  useEffect(() => {

    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024) // Cambiado a 1024px para incluir tablets
    }
    
    checkScreenSize()
    
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <>
      {/* Overlay para móvil y tablet */}
      {isMobileOrTablet && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          onClick={handleTouchStart}
        />
      )}

      {/* Menú lateral */}
      <Container className={`
        fixed
        top-0
        left-0
        h-screen
        w-72
        bg-white
        border-r
        border-gray-200
        shadow-lg
        transform
        transition-transform
        duration-500
        ease-in-out
        z-999
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Container >

          <Nav/>
        
        </Container>
      </Container>
    </>
  )
}

export default AsideMenu
