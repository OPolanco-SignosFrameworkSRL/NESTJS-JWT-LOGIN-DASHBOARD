import Modal from "@/application/ui/Modal/Modal"
import { IoMdSettings } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import { useAppStore } from "@/application/store/useAppStore";
import { Link } from "react-router-dom";
import { useLogout } from "@/application/hooks/auth";

const ModalProfile = () => {

    const modalItems = [
        {icon: <FaUser size={24} />, label: "Perfil", path: "/perfil"},
        {icon: <TbLayoutDashboardFilled size={24}/>, label: "Admin Dashboard", path: "/admin-dashboard?pageNumber=1"},
        {icon: <IoMdSettings size={24}/>, label: "Configuración", path: "/configuracion"}
    ]

    const showHeaderModal = useAppStore(state => state.showHeaderModal)

    const { decodedToken } = useAppStore()

    const handleLogout = useLogout()

  return (

    <>
        <div className="sticky top-18 z-50 lg:relative md:top-0">

            <Modal isActive={showHeaderModal} className="absolute right-0 flex justify-end"> 

                <div className="bg-white w-72 h-60 rounded-md shadow-lg flex flex-col">

                    <div className="flex flex-col space-y-1">
                        <span className="text-sm sm:text-base mx-2 mt-2 font-medium">{decodedToken?.fullname}</span>
                        <span className="text-xs sm:text-sm mx-2 no-underline leading-none text-muted-foreground text-gray-400">{decodedToken?.email}</span>
                    </div>

                    <hr className="mt-5 text-gray-400" />

                    <div className="mt-2">
                        
                        {modalItems.map((item, index) => (

                          

                            <div className="flex mx-2 items-center mt-2.5" key={index}>
                                
                                <div className="cursor-pointer">
                                    {item.icon}
                                </div>

                                <Link to={item.path} key={index} className="flex flex-col mx-2 font-medium cursor-pointer">
                                    {item.label}
                                </Link>

                            </div>



                        ))}
                    </div>

                    <hr className="mt-3.5 text-gray-400" />

                    <div className="mt-2 flex items-center mx-2 font-medium gap-2">

                        <MdOutlineLogout size={24} className="cursor-pointer"/>

                        <button onClick={handleLogout} className="cursor-pointer">
                            <Link to="/login" className="cursor-pointer">
                                Cerrar Sesión
                            </Link>
                        </button>

                    </div>

                </div>

            </Modal>

        </div>

    
    </>
    
  )
}

export default ModalProfile
