import { IoIosClose } from "react-icons/io"
import { useAppStore } from "../store/useAppStore"
import Modal from "../ui/Modal/Modal"
import { CgDanger } from "react-icons/cg"
import Container from "../ui/Container/Container"

type ConfirmEliminationModalProps = {
    onClickCloseModalArgs: string
    handleDelete: () => void
}


const ConfirmEliminationModal = ({ onClickCloseModalArgs, handleDelete }: ConfirmEliminationModalProps) => {

    const isNavOpen = useAppStore(state => state.isNavOpen)
    const showAdminTableModal = useAppStore(state => state.showAdminTableModal)
    const closeModal = useAppStore(state => state.closeModal)

  return (

    <Modal isActive={showAdminTableModal}>
          
        <>
        
            <Container className= "fixed inset-0 bg-black/50 bg-opacity-50 z-40 flex items-center justify-center">

                <Container className={`w-full max-w-md flex flex-col items-center gap-4 bg-white rounded-lg shadow-lg ${isNavOpen ? 'ml-72 transition-all duration-500 ease-in-out' : 'ml-0 transition-all duration-500 ease-in-out'} p-5 border border-green-400`}>
                
                    <Container className="flex justify-end w-full">
                        <button onClick={() => closeModal(onClickCloseModalArgs)} className="hover:bg-gray-100 rounded-full cursor-pointer">
                        <IoIosClose className="text-5xl text-gray-500" />
                        </button>
                    </Container>

                    <Container className="flex flex-col items-center gap-4">
                        <CgDanger 
                        size={64} 
                        className="text-red-500" 
                        />
                        
                        <p className="text-sm sm:text-base text-gray-800 font-semibold text-center">¿Estás seguro de querer eliminar este empleado?</p>
                        
                        <Container className="flex gap-4 mt-2">
                            <button 
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                                onClick={() => closeModal(onClickCloseModalArgs)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                                onClick={() => {
                                    handleDelete();
                                    closeModal(onClickCloseModalArgs)
                                }}
                            >
                                Eliminar
                            </button>
                        </Container>
                    </Container>
                </Container>
            </Container>

        </>

    </Modal>
  )
}

export default ConfirmEliminationModal
