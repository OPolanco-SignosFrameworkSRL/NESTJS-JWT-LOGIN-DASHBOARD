import Input from "@/application/ui/Input/Input";
import Select from "@/application/ui/Select/Select";
import { updateEmployee, getEmployeeById, getAllRoles } from "@/infrastructure/api/admin/admin";
import type { CreateEmployee } from "@/infrastructure/schemas/admin/admin";
import { hashPassword } from "@/shared/utilts/convertToSha256";
import { getUrlParams } from "@/shared/utilts/GetUrlParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function EditEmployee() {

  
  const queryClient = useQueryClient()
  
  const employeeId = getUrlParams('employeeId')

  const navigate = useNavigate()

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
    initialData: () => queryClient.getQueryData(['roles']),
  });
  
  const { data } = useQuery({
    queryKey:['editEmployee', employeeId],
    queryFn: () => getEmployeeById(Number(employeeId)),
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    enabled: !!employeeId
  })
  
  const { mutate } = useMutation({

    mutationFn: (data: CreateEmployee) => updateEmployee(Number(employeeId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      //queryClient.invalidateQueries({ queryKey: ["editEmployee", String(employeeId)] })
      toast.success("Información actualizada correctamente!")
      navigate("/admin")
    },
    onError: () => {
      toast.error("La información no ha podido ser actualizada correctamente.")
    }
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateEmployee>({})

  const onSubmit = async (data: CreateEmployee) => {

    if(data.password && data.password !== "") {
      const hashedPassword = await hashPassword(data.cedula, data.password);
      data.password = hashedPassword;
    } else {
      data.password = undefined;
    }

    mutate(data)
    
  }

  useEffect(() => {
    if(data) {
      reset({
        nombre: data.data.nombre,
        apellido: data.data.apellido,
        password: "",
        cedula: data.data.cedula,
        role: Number(data.data.role),
        user_email: data.data.user_email,
        telefono: data.data.telefono,
        direccion: data.data.direccion,
        celular: data.data.celular,
      })
    }
  }, [data, reset])

  if(data) return (
    <>
      <div className="mt-10 p-6 sm:p-10 bg-white shadow-lg">

        <div className="flex items-center justify-between">

          <h2 className="text-xs sm:text-base md:text-xl text-emerald-500 font-bold">
            Editar Empleado
          </h2>

          <Link
            to="/admin"
            className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 p-2 sm:p-3 text-sm font-bold text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
            //onClick={() => queryClient.invalidateQueries({ queryKey: ['employees', employeeId]})}
            >
            Volver a Dashboard
          </Link>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

            <div>
              <label className="text-gray-800" htmlFor="name">Nombre:</label>
              <Input
                id="name"
                type="text"
                placeholder="Pedro"
                className="mt-2"
                {...register("nombre", { required: "El nombre es requerido" })}
              />
              {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            </div>

            <div>
              <label className="text-gray-800" htmlFor="lastName">Apellido:</label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enriquez"
                className="mt-2"
                {...register("apellido", { required: "El apellido es requerido" })}
              />
              {errors.apellido && <p className="text-red-500">{errors.apellido.message}</p>}
            </div>

            <div>
              <label className="text-gray-800" htmlFor="cedula">Cedula:</label>
              <Input
                id="cedula"
                type="text"
                className="mt-2"
                placeholder="40245980129"
                {...register("cedula", { required: "La cedula es requerida" })}
              />
              {errors.cedula && <p className="text-red-500">{errors.cedula.message}</p>}
            </div>

            <div>
              <label className="text-gray-800" htmlFor="password">Contraseña:</label>
              <Input
                id="password"
                type="password"
                className="mt-2"
                placeholder="Contraseña"
                {...register("password", { 
                  setValueAs: (value) => value === "" ? undefined : value 
                })}
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-gray-800" htmlFor="rol">Role:</label>

              <Select
                id="rol"
                placeholder="Selecciona un rol"
                options={rolesData?.data.map(item => ({
                  label: item.role_name,
                  value: item.id
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
                className="mt-2"
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
                className="mt-2"
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
                className="mt-2"
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
              className="mt-2"
              placeholder="04145980129"
              {...register("direccion", { required: "La direccion es requerida" })}
            />
            {errors.direccion && <p className="text-red-500">{errors.direccion.message}</p>}
          </div>

          <div className="md:col-span-2">
            <Input
              type="submit"
              className="h-14 flex justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg cursor-pointer rounded"
              value="Editar Empleado"
            />
          </div>

        </form>
      </div>
    </>
  );
}