import Container from "../ui/Container"
import { RxHamburgerMenu } from "react-icons/rx";

type HeaderProps = {
  handleOpen: () => void
}

const Header = ({ handleOpen }: HeaderProps) => {

  return (

    <>

    <Container className="flex items-center bg-white border-b border-gray-200">

      <Container className="flex justify-between items-center w-full p-4">

        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer" onClick={handleOpen}>
          <RxHamburgerMenu size={24} className="text-gray-700"/>
        </button>

        <Container className="flex items-center gap-4">

          <span className="text-white bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center font-medium">
            AR
          </span>

        </Container>

      </Container>

    </Container>
   
    </>

  )

}

export default Header
