import { useState } from "react"
import Title from "@/application/ui/Text/Title";
import AdminDashboard from "@/application/pages/Admin/employees/EmployeeTable"
import RolesTable from "@/application/pages/Admin/roles/RolesTable";
import Dashboard from "@/application/pages/Admin/dashboard/Dashboard";
import RolesPermissionsTable from "@/application/pages/Admin/rolePermissions/rolePermissionsTable";



const Admin = () => {

  const navItems = [
    {label: "Dashboard"},
    {label: "Gestión de Usuarios"},
    {label: "Gestión de Roles"},
    {label: "Gestión de Permisos"}
  ]

  const [activeItem, setActiveItem] = useState(navItems[0]);

  return (

    <>
    
      <div className="flex flex-col bg-gradient-to-r from-green-600 to-emerald-600 p-6">

          <Title text="Panel de Administración" isTitle={true} className="text-white"/>

      </div>

      <div className="bg-white p-5 rounded-bl-lg rounded-br-lg">

        <div className="border-b border-gray-300">
          <nav>
            <ul className="flex gap-2 sm:gap-6 lg:gap-10 mt-2.5">
              {navItems.map((item, index) => (
                <li key={index} className={`cursor-pointer text-xs sm:text-sm md:text-base whitespace-nowrap ${activeItem.label === item.label ? 'pb-5 border-b-2 border-emerald-600 text-green-600' : 'text-gray-500 hover:border-b-2 hover:border-gray-400'}`} onClick={() => setActiveItem(item)}>
                    {item.label}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-5">


          {activeItem.label === "Dashboard" && (
            <Dashboard/>
          )}
        

          {activeItem.label === "Gestión de Usuarios" && (

            <AdminDashboard/>
          
          )}

          {activeItem.label === "Gestión de Roles" && (
            <RolesTable/>
          )}

          {activeItem.label === "Gestión de Permisos" && (
            <RolesPermissionsTable/>
          
          )}


        </div>


      </div>

    </>

  )
}

export default Admin
