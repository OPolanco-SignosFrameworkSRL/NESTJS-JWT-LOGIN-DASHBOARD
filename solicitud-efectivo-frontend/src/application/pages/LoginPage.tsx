import Container from '@/application/ui/Container/Container'

import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import type { LoginFormSchema } from '@/infrastructure/schemas/auth/auth';

import { GoPersonFill } from "react-icons/go";
import Input from '../ui/Input/Input';
import { hashPassword } from '@/shared/utilts/convertToSha256';
import { useLogin } from '../hooks/auth';
import { useEffect } from 'react';



const LoginPage = () => {

  const loginMutation = useLogin()

  const navigate = useNavigate()

  const { register, handleSubmit, formState: {errors}} = useForm<LoginFormSchema>({
    defaultValues: {
      cedula: '',
      password: ''
    }
  })

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(token){
      navigate("/home")
    }

  }, []);

  const onSubmit = async (data: LoginFormSchema) => {

    const hashedPassword =  await hashPassword(data.cedula, data.password);

    loginMutation.mutate({
      cedula: data.cedula,
      password: hashedPassword
    })
 
  }

  return (

    <Container className='flex flex-col items-center justify-center h-dvh lg:min-h-screen p-4'>
  
      <Container className='w-full max-w-md mx-auto bg-white rounded-lg shadow-lg border border-green-400 p-6'>

        <Container className='flex items-center justify-center mb-6'>
          <GoPersonFill size={80} />
        </Container>

        <Container className='flex flex-col items-center justify-center mb-6'>
          <h1 className='text-xl sm:text-2xl font-bold text-center'>Iniciar Sesión</h1>
        </Container>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >

          <Container className='space-y-4'>
            
            <Container className='flex flex-col space-y-2'>
              <label htmlFor='cedula' className='font-bold text-sm sm:text-base'>Cedula</label>
              <Input
                type='text'
                placeholder='312-0103815-9'
                autoComplete='cedula'
                {...register('cedula', {
                  minLength: {
                    value: 11,
                    message: 'La cedula debe tener 11 digitos'
                  },
                  maxLength: {
                    value: 11,
                    message: 'La cedula debe tener 11 digitos'
                  },
                  required: {
                    value: true,
                    message: 'La cedula es requerida'
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'La cedula debe contener solo numeros'
                  }
                })}
              />

              {errors.cedula && (
                <p className='text-red-500 text-sm'>{errors.cedula.message}</p>
              )}
              
            </Container>

            <Container className='flex flex-col space-y-2'>
              <label htmlFor='password' className='font-bold text-sm sm:text-base'>Contraseña</label>
              <Input 
                type='password' 
                placeholder='Contraseña' 
                autoComplete='current-password'
                className='w-full p-3 rounded-md border border-green-400 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400' 
                {...register('password', {
                    required: {
                      value: true,
                      message: 'La contraseña es requerida'
                    },
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres'
                    }
                  }
                )}
              />

              {errors.password && (
                <p className='text-red-500 text-sm'>{errors.password.message}</p>
              )}

            </Container>

          </Container>

          <Container className='flex justify-between space-y-3 sm:space-y-0 mt-4'> 

            <Container>
              <input type='checkbox' className='mr-2' />
              <label htmlFor='remember' className='font-bold text-sm sm:text-base'>Recordarme</label>
            </Container>

            
            <Container>
              <Link to='/' className='font-bold text-green-400 text-sm sm:text-base hover:text-green-500 transition-colors'>Olvidaste tu contraseña?</Link>
            </Container>

          </Container>

          <Container className='flex flex-col items-center justify-center mt-6'>

            <Container className='w-full'>
              <button
              type='submit'
              className='w-full p-3 rounded-md bg-green-400 text-white font-bold cursor-pointer hover:bg-green-500 transition-all duration-300 text-sm sm:text-base'
              onClick={ () => {}}
              >
                  Iniciar sesión
              </button>
            </Container>
          </Container>

        </form>
        
      </Container>


    </Container>
  )
}

export default LoginPage
