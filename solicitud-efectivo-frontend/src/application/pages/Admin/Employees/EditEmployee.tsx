import Input from "@/application/ui/Input/Input";
import { updateEmployee, getEmployeeById, getAllRoles } from "@/infrastructure/api/admin/admin";
import type { UpdateEmployee } from "@/infrastructure/schemas/admin/admin";
import { hashPassword } from "@/shared/utilts/convertToSha256";
import { getUrlParams } from "@/shared/utilts/GetUrlParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SelectLibrary from 'react-select'


export default function EditEmployee() {

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<UpdateEmployee>({})

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

  type Roles = { id: number, roleName: string };
  
  const options: Roles[] = rolesData?.data.map(item => ({ id: item.id, roleName: item.role_name })) || []

  const rolesEmpleadoApi = data?.data.roles ?? []; 
  
  useEffect(() => {

    if(data) {
      reset({
        nombre: data.data.nombre,
        apellido: data.data.apellido,
        password: "",
        cedula: data.data.cedula,
        roles: rolesEmpleadoApi,
        user_email: data.data.user_email,
        telefono: data.data.telefono,
        direccion: data.data.direccion,
        celular: data.data.celular,
      })
    }
  }, [data, reset])

  const { mutate } = useMutation({

    mutationFn: (data: UpdateEmployee) => updateEmployee(Number(employeeId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ["editEmployee", String(employeeId)] })
      toast.success("Información actualizada correctamente!")
      navigate("/admin/employees")
    },
    onError: () => {
      toast.error("La información no ha podido ser actualizada correctamente.")
    }
  })

  const onSubmit = async (data: UpdateEmployee) => {

    if(data.password && data.password !== "") {
      const hashedPassword = await hashPassword(data.cedula, data.password);
      data.password = hashedPassword;
    } else {
      data.password = undefined;
    }

    mutate(data)
    
  }

  if(data) return (
    <>
      <div className="mt-10 p-6 sm:p-10 bg-white shadow-lg">

        <div className="flex items-center justify-between">

          <h2 className="text-xs sm:text-base md:text-xl text-emerald-500 font-bold">
            Editar Empleado
          </h2>

          <Link
            to="/admin/employees"
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

              <div className="flex items-center gap-2 ">
                <label className="text-gray-800" htmlFor="rol">Role:</label>
                <span className="text-red-500">*</span>
              </div>

              <Controller
                name="roles"
                control={control}
                rules={{ required: "Debe seleccionar al menos un rol" }}
                render={({ field }) => {
                  const selectedValues = field.value ? 
                    options.filter(opt => 
                      field.value.some((v: { id: number }) => v.id === opt.id)
                    ) : []
                  return (
                    <SelectLibrary<Roles, true>
                      isMulti
                      placeholder="Seleccionar roles..."
                      options={options}
                      getOptionValue={(o) => String(o.id)}    
                      getOptionLabel={(o) => o.roleName}      
                      onChange={(vals) => {
                        field.onChange(vals ? (vals as Roles[]).map(v => ({ id: v.id })) : [])
                      }}
                      value={selectedValues}
                      styles={{
                      control: (provided, state) => ({
                        ...provided,
                        width: '100%',
                        minHeight: '44px', 
                        border: '2px solid #86efac', 
                        borderRadius: '6px', 
                        backgroundColor: 'white',
                        paddingLeft: '8px', 
                        paddingRight: '8px',
                        fontSize: '16px', 
                        boxShadow: state.isFocused ? '0 0 0 1px #86efac' : 'none', 
                        borderColor: state.isFocused ? '#86efac' : '#86efac',
                        '&:hover': {
                          borderColor: '#86efac'
                        }
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        padding: '0 4px',
                        minHeight: '40px'
                      }),
                      input: (provided) => ({
                        ...provided,
                        margin: '0',
                        paddingTop: '0',
                        paddingBottom: '0',
                        fontSize: '16px'
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: '#9ca3af', 
                        fontSize: '16px'
                      }),
                      indicatorsContainer: (provided) => ({
                        ...provided,
                        paddingRight: '4px'
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: '#9ca3af', 
                        '&:hover': {
                          color: '#9ca3af'
                        }
                      }),
                      menu: (provided) => ({
                        ...provided,
                        border: '2px solid #86efac',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected 
                          ? '#16a34a' 
                          : state.isFocused 
                          ? '#dcfce7' 
                          : 'white',
                        color: state.isSelected ? 'white' : '#374151', 
                        fontSize: '16px',
                        '&:hover': {
                          backgroundColor: state.isSelected ? '#16a34a' : '#dcfce7'
                        }
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: '#dcfce7', 
                        borderRadius: '4px',
                        border: '1px solid #86efac' 
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: '#166534', 
                        fontSize: '14px',
                        fontWeight: '500'
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        color: '#166534', 
                        '&:hover': {
                          backgroundColor: '#16a34a', 
                          color: 'white'
                        }
                      })
                    }}
                  />
                  )
                }}
              />

              {errors.roles && <p className="text-red-500">{errors.roles.message}</p>}

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