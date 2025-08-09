import { SiCashapp } from "react-icons/si";
import { IoPeopleSharp } from "react-icons/io5";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import { LuActivity } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { PiChartLineUpBold } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaDollarSign } from "react-icons/fa";
import { CiMoneyBill } from "react-icons/ci";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Nav = () => {

    const location = useLocation()

    const navItems = [
        {label: "Inicio", path: "/home", icon: <IoHomeSharp size={26} />},
        {label: "Solicitud De Gasto", path: "/solicitud-gastos", icon: <MdAttachMoney size={26} />},
        {label: "Actividades", path:{}, icon: <LuActivity size={26} />, children:[
            {label: "Crear Solicitud", path: "/new-request", icon: <IoMdAddCircleOutline size={24} />},
            {label: "Flujo de Actividades", path: "/actividades", icon: <FaDollarSign size={24} />},
            {label: "Desembolso", path: "/Disbursement", icon: <CiMoneyBill size={24} />},
        ]},
        {label: "Estadísticas", path: "/estadisticas", icon: <PiChartLineUpBold size={26} />},
        {label: "Recursos Humanos", path: "/recursos-humanos", icon: <IoPeopleSharp size={26} />},
        {label: "Caja Chica", path: "/caja-chica", icon: <FaRegMoneyBillAlt size={26} />},
        {label: "Administración", path: "/administracion", icon: <IoIosSettings size={26} />},
    ]

    const isActive = location.pathname

    const [isOpenChild, setIsOpenChild] = useState(false)

    const handleOpenChild = () => {
        setIsOpenChild(!isOpenChild)
    }
    
  return (

    <>

        <div className="flex items-center justify-center gap-2 p-2 h-18 border-b border-gray-200">

            <SiCashapp size={32} className="text-black font-semibold" />

            <span className="text-sm sm:text-base md:text-lg text-black font-semibold">
                Solicitud De Efectivo
            </span>

        </div>

        <div className="flex items-center flex-col mt-5">

            <nav>
                <ul className="space-y-5 w-full flex flex-col">
                    {navItems.map((item, index) => (

                        <>

                            <Link to={item.path} key={index} className={`w-full p-2 rounded-lg ${isActive === item.path ? 'bg-gray-100' : ''} hover:bg-gray-100 transition-colors duration-200`}
                                onClick={item.children ? handleOpenChild : undefined}
                            >

                                <li className="flex w-full items-center gap-5">

                                    <div>  
                                        {item.icon}
                                    </div>

                                    <div className="flex flex-col items-center justify-center w-full">

                                        <span className="text-sm sm:text-base md:text-lg text-black font-semibold">
                                            {item.label}
                                        </span>
                                    </div>

                                    {item.children && (
                                        <div className="flex items-center justify-center">
                                            {isOpenChild ? <IoIosArrowUp size={24} className="text-gray-500 transition-all duration-700" /> : <IoIosArrowDown size={24} className="text-gray-500 transition-all duration-700" />}
                                        </div>
                                    )}

                                </li>
                            </Link>
                            <div className="ml-8">
                                
                                {isOpenChild && item.children && (
                                    <ul className="flex flex-col gap-2 mt-2">
                                        {item.children.map((child, index) => (
                                            <Link 
                                                to={child.path} 
                                                key={index} 
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3"
                                            >
                                                <div>{child.icon}</div>
                                                <span className="text-sm text-gray-700">{child.label}</span>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </>
                        
                    ))}
                    
                </ul>
            </nav>

        </div>
    </>

  )
}

export default Nav
