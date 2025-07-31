import Modal from "@/application/ui/Modal"
import { IoMdSettings } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import { useAppStore } from "@/application/store/useAppStore";




const ModalProfile = () => {

    const modalItems = [
        {icon: <FaUser size={24} />, label: "Perfil"},
        {icon: <TbLayoutDashboardFilled size={24}/>, label: "Admin Dashboard"},
        {icon: <IoMdSettings size={24}/>, label: "Configuración"}
    ]

    const show = useAppStore(state => state.show)


  return (

    <>
        <div className="relative">

            <Modal isActive={show} className="absolute right-0 flex justify-end"> 

                <div className="bg-white w-72 h-60 rounded-md shadow-lg flex flex-col">

                    <div className="flex flex-col space-y-1">
                        <span className="text-sm sm:text-base mx-2 mt-2 font-medium">Frandy Jeffry Cepeda</span>
                        <span className="text-xs sm:text-sm mx-2 no-underline leading-none text-muted-foreground text-gray-400">FrandyJeffryCepeda@gmail.com</span>
                    </div>

                    <hr className="mt-5 text-gray-400" />

                    <div className="mt-2">
                        
                        {modalItems.map((item, index) => (

                            <>

                                <div className="flex mx-2 items-center mt-2.5">
                                    
                                    <div className="cursor-pointer">
                                        {item.icon}
                                    </div>

                                    <button key={index} className="flex flex-col mx-2 font-medium cursor-pointer">
                                        {item.label}
                                    </button>

                                </div>

                            </>


                        ))}
                    </div>

                    <hr className="mt-3.5 text-gray-400" />

                    <div className="mt-2 flex items-center mx-2 font-medium gap-2">

                        <MdOutlineLogout size={24} className="cursor-pointer"/>

                        <button className="cursor-pointer">
                            Cerrar Sesión
                        </button>

                    </div>

                </div>

            </Modal>

        </div>

    
    </>
    
  )
}

export default ModalProfile
