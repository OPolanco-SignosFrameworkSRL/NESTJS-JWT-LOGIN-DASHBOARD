import { useState } from "react"
import Title from "@/application/ui/text/Title";
import EmployeeTable from "@/application/pages/Admin/employees/EmployeeTable"
import RolesTable from "@/application/pages/Admin/roles/RolesTable";
import Dashboard from "@/application/pages/Admin/dashboard/Dashboard";
import RolePermissionsTable from "@/application/pages/Admin/rolePermissions/RolePermissionsTable";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Container from "@/application/ui/container/Container";



const Admin = () => {

  const location = useLocation()

  const navItems = [
    {label: "Dashboard", path: "/admin"},
    {label: "Gestión de Usuarios", path: "/admin/employees"},
    {label: "Gestión de Roles", path: "/admin/roles"},
    {label: "Gestión de Permisos", path: "/admin/permissions"}
  ]

  const isActivePath = location.pathname



  return (

    <>
    
      <Container className="flex flex-col bg-gradient-to-r from-green-600 to-emerald-600 p-6">

        <Title text="Panel de Administración" isTitle={true} className="text-white"/>

      </Container>

      <Container className="bg-white p-5 rounded-bl-lg rounded-br-lg">

        <Container className="border-b border-gray-300">
          <nav>
            <ul className="flex gap-2 sm:gap-6 lg:gap-10 mt-2.5">
              {navItems.map((item, index) => (
                <Link to={item.path} key={index}>
                  <li className={`cursor-pointer text-xs sm:text-sm md:text-base whitespace-nowrap ${isActivePath === item.path ? 'pb-5 border-b-2 border-emerald-600 text-green-600' : 'text-gray-500 hover:border-b-2 hover:border-gray-400 pb-5'}`}>
                      {item.label}
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </Container>

        <Container className="mt-5">

          <Outlet/>

        </Container>


      </Container>

    </>

  )
}

export default Admin
