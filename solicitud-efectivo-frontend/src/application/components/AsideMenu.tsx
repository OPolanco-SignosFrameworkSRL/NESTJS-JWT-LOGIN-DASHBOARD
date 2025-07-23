import Container from "../ui/Container"
import { useEffect, useState } from "react"

type AsideMenuProps = {
    isOpen: boolean
    handleTouchStart: () => void
}

const AsideMenu = ({ isOpen, handleTouchStart }: AsideMenuProps) => {

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isOpen && (
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
        w-64
        bg-white
        border-r
        border-gray-200
        shadow-lg
        transform
        transition-transform
        duration-500
        ease-in-out
        z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Container className="p-4">
          <h1 className="text-black font-semibold">
            AsideMenu
          </h1>
        </Container>
      </Container>
    </>
  )
}

export default AsideMenu
