

import { Link } from "react-router-dom";

export default function Register() {

  return (
    <>
      <div className="mt-10 p-6 sm:p-10 bg-white shadow-lg">

        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-2xl lg:text-4xl font-black text-slate-700">
            Registrar Empleado
          </h2>
          <Link
            to="/admin-dashboard"
            className="rounded-md bg-indigo-600 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base font-bold text-white shadow-sm hover:bg-indigo-500 flex-shrink-0"
          >
            Volver a Dashboard
          </Link>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="mb-4">
            <label className="text-gray-800" htmlFor="fullName">Nombre completo:</label>
            <input 
              id="fullName"
              type="text"
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded"
              placeholder="Pedro Enriquez Jímenez"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-800" htmlFor="userName">Username:</label>
            <input 
              id="userName"
              type="text"
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded"
              placeholder="Pedro"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-800" htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded"
              placeholder="user@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-800" htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded"
              placeholder="Contraseña"
       
            />
          </div>

          <div className="mb-4 relative">
            <label className="text-gray-800" htmlFor="role">Rol:</label>
            <select
              id="role"
              className="mt-2 block w-full p-3 pr-8 bg-gray-50 border border-gray-300 rounded appearance-none"
            >
              <option value="">Selecciona un rol</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Empleado</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none mt-8">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-800" htmlFor="departamento">Departamento:</label>
            <input
              id="departamento"
              type="text"
              className="mt-2 block w-full p-3 bg-gray-50 border border-gray-300 rounded"
              placeholder="IT, Finanzas, etc."
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="submit"
              className="w-full flex justify-center bg-indigo-700 hover:bg-indigo-800 p-3 text-white font-bold text-lg cursor-pointer rounded"
              value="Registrar Empleado"
            />
          </div>
        </form>
      </div>
    </>
  );
}