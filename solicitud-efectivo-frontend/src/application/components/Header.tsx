import Container from "../ui/Container"
import { RxHamburgerMenu } from "react-icons/rx";
import { useAppStore } from "../store/useAppStore";

type HeaderProps = {
  handleOpen: () => void
}

const Header = ({ handleOpen }: HeaderProps) => {

  const handleShowModal = useAppStore(state => state.handleShowModal)

  return (

    <>

      <Container className="flex items-center bg-white border-b border-gray-200">

        <Container className="flex justify-between items-center w-full p-4">

          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer" onClick={handleOpen}>
            <RxHamburgerMenu size={24} className="text-gray-700"/>
          </button>

          <span className="text-sm sm:text-base lg:text-xl text-emerald-500 font-bold">
            Sistema de Flujo de Efectivo
          </span>

          <Container className="flex items-center gap-4">

            <span
              onClick={() => handleShowModal()}
              className="text-white bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center font-medium cursor-pointer">
              FJ
            </span>

          </Container>

        </Container>

      </Container>

    </>

  )

}

export default Header
