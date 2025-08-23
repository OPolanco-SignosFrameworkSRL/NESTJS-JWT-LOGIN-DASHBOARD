import Input from "@/application/ui/Input/Input";
import Select from "@/application/ui/Select/Select";
import { createEmployee, getAllRoles } from "@/infrastructure/api/admin/admin";
import type { CreateEmployee } from "@/infrastructure/schemas/admin/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Register() {

  const { register, handleSubmit, formState: { errors } } = useForm<CreateEmployee>()

  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const { mutate } = useMutation({

    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const onSubmit = (data: CreateEmployee) => {

    data.fullname = `${data.nombre} ${data.apellido}`
    data.clave = "MiClaveSecreta2024"
    data.user_status = 1
    data.caja_id = "1"
    data.tienda_id = "1"
    data.allow_multi_tienda = "0"
    data.max_descuento = "10.5"
    data.close_caja = "0"
    data.user_account_email = "pedro@gmail.com"
    data.user_account_email_passw = "MiClaveSecreta2024"
    data.comision_porciento = "5.5"
    data.default_portalid = "1"
    data.nuevocampo = "valor"
    data.encargadoId = "1"

    data.role = Number(data.role)

    mutate(data)

  }

  return (
    <>
      <div className="mt-10 p-6 sm:p-10 bg-white shadow-lg">

        <div className="flex items-center justify-between">

          <h2 className="text-xs sm:text-base md:text-xl text-emerald-500 font-bold">
            Registrar Empleado
          </h2>

          <Link
            to="/admin"
            className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
            >
            Volver a Dashboard
          </Link>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 space-y-2">

            <div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-gray-800" htmlFor="name">Nombre:</label>
                <span className="text-red-500">*</span>
              </div>

              <Input
                id="name"
                type="text"
                placeholder="Pedro"
                
                {...register("nombre", { required: "El nombre es requerido" })}
              />
              {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
              
            </div>

            <div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-gray-800" htmlFor="lastName">Apellido:</label>
                <span className="text-red-500">*</span>
              </div>

              <Input
                id="lastName"
                type="text"
                placeholder="Enriquez"
                
                {...register("apellido", { required: "El apellido es requerido" })}
              />

              {errors.apellido && <p className="text-red-500">{errors.apellido.message}</p>}

            </div>

            <div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-gray-800" htmlFor="cedula">Cedula:</label>
                <span className="text-red-500">*</span>
              </div>

              <Input
                id="cedula"
                type="text"
                
                placeholder="40245980129"
                {...register("cedula", { required: "La cedula es requerida" })}
              />

              {errors.cedula && <p className="text-red-500">{errors.cedula.message}</p>}

            </div>

            <div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-gray-800" htmlFor="password">Contraseña:</label>
                <span className="text-red-500">*</span>
              </div>

              <Input
                id="password"
                type="password"
                
                placeholder="Contraseña"
                {...register("password", { required: "La contraseña es requerida" })}
              />

              {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            </div>

            <div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-gray-800" htmlFor="rol">Role:</label>
                <span className="text-red-500">*</span>
              </div>

              <Select
                id="rol"
                placeholder="Selecciona un rol"
                options={data?.data.map(items => ({
                  label: items.role_name,
                  value: items.id
                }))}

                {...register("role", { required: "El role es requerido" })}

              />

              {errors.role && <p className="text-red-500">{errors.role.message}</p>}

            </div>

            <div>
              <label className="text-gray-800" htmlFor="email">Email:</label>
              <Input
                id="email"
                type="text"
                placeholder="pedro@gmail.com"
                {...register("user_email", { required: "El email es requerido" })}
              />
              {errors.user_email && <p className="text-red-500">{errors.user_email.message}</p>}
            </div>

            <div>
              <label className="text-gray-800" htmlFor="telefono">Telefono:</label>
              <Input
                id="telefono"
                type="text"
                placeholder="04145980129"
                {...register("telefono", { required: "El telefono es requerido" })}
              />
              {errors.telefono && <p className="text-red-500">{errors.telefono.message}</p>}
            </div>

            <div>
              <label className="text-gray-800" htmlFor="celular">Celular:</label>
              <Input
                id="celular"
                type="text"
                placeholder="04145980129"
                {...register("celular", { required: "El celular es requerido" })}
              />
              {errors.celular && <p className="text-red-500">{errors.celular.message}</p>}
            </div>
          </div>

          <div className="mt-2 mb-4">
            <label className="text-gray-800" htmlFor="direccion">Direccion:</label>
            <Input
              id="direccion"
              type="textarea"
              placeholder="04145980129"
              {...register("direccion", { required: "La direccion es requerida" })}
            />
            {errors.direccion && <p className="text-red-500">{errors.direccion.message}</p>}
          </div>

          <div className="md:col-span-2">
            <Input
              type="submit"
              className="h-14 flex justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg cursor-pointer rounded"
              value="Registrar Empleado"
            />
          </div>

        </form>
      </div>
    </>
  );
}