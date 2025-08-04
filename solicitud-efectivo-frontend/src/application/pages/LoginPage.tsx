import { Link, useNavigate } from 'react-router-dom';

import { GoPersonFill } from "react-icons/go";

import Container from '@/application/ui/Container/Container'

const LoginPage = () => {

  const navigate = useNavigate()

  const handleSubmit = () => {
    navigate('/home')
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
        >

          <Container className='space-y-4'>
            
            <Container className='flex flex-col space-y-2'>
              <label htmlFor='cedula' className='font-bold text-sm sm:text-base'>Cedula</label>
              <input 
                type='text' 
                placeholder='Cedula' 
                className='w-full p-3 rounded-md border border-green-400 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400' 
              />
            </Container>

            <Container className='flex flex-col space-y-2'>
              <label htmlFor='password' className='font-bold text-sm sm:text-base'>Contraseña</label>
              <input 
                type='password' 
                placeholder='Contraseña' 
                className='w-full p-3 rounded-md border border-green-400 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400' 
              />
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
              onClick={ () => handleSubmit()}
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
