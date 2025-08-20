import { useEffect, useRef } from "react"
import { useAppStore } from "@/application/store/useAppStore"

type ModalProps = {
    isActive: boolean
    children?: React.ReactNode
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
    onClick?: React.MouseEventHandler<HTMLDivElement>, 
    className?: string
}

const Modal = ({children, isActive, onMouseLeave, onClick, className}: ModalProps) => {

  const handleShowModal = useAppStore(state => state.handleShowModal)

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleShowModal("header"); 
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  const modalRef = useRef<HTMLDivElement>(null);
  
  return (

    <>
    
    
      {isActive && (
  
        <div onMouseLeave={onMouseLeave} onClick={onClick} className={className} ref={modalRef}>

          {children}

        </div>

      )}

    </>


  )
}

export default Modal

