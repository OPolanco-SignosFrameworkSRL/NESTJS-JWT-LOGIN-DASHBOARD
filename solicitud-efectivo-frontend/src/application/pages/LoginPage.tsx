import Container from '@/application/ui/Container'
import { CgProfile } from "react-icons/cg";


const LoginPage = () => {

  return (

    <Container className='flex flex-col items-center justify-center h-screen'>


      <Container className='w-2/6 h-1/2 bg-white rounded-lg shadow-lg'>

        <Container className='flex items-center justify-center mt-5'>
          <CgProfile size={80} />
        </Container>

        <Container className='flex flex-col items-center justify-center mt-5 text-2xl font-bold'>
          <h1>Iniciar Sesión</h1>
        </Container>

        <form
          noValidate
        >

          <Container className='flex flex-col mt-5 space-y-5 mx-auto w-4/6'>
            
            <Container className='flex flex-col space-y-2'>
              <label htmlFor='cedula' className='font-bold'>Cedula</label>
              <input type='text' placeholder='Cedula' className='w-full p-2 rounded-md border border-green-400' />
            </Container>

            <Container className='flex flex-col space-y-2'>
              <label htmlFor='password' className='font-bold'>Contraseña</label>
              <input type='password' id='password' name='password' placeholder='Contraseña' className='w-full p-2 rounded-md border border-green-400' />
            </Container>

          </Container>

          <Container className='flex flex-col items-center justify-center mt-5 w-2/6 mx-auto'>
            <button type='submit' className='w-full p-2 rounded-md bg-green-400 text-white font-bold cursor-pointer hover:bg-green-500 transition-all duration-300'>Iniciar sesión</button>
          </Container>

        </form>
        
      </Container>


    </Container>
  )
}

export default LoginPage
