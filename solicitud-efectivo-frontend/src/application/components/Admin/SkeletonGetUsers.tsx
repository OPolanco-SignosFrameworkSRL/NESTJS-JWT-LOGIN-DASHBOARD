
const SkeletonGetUsers = () => {

  return (
       
    <div className="mt-10 p-6 sm:p-10 bg-white shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className=" text-[19px] sm:text-4xl font-black text-slate-500">
          Administrador de empleados
        </h2>
        <span
          className="rounded-md bg-indigo-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
        >
          Agregar Empleado
        </span>
      </div>


      <div className="w-full mt-6 overflow-x-auto">
        <table className="min-w-full bg-white table-auto border-collapse">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3 text-left">Empleado</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Departamento</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
  
}

export default SkeletonGetUsers
