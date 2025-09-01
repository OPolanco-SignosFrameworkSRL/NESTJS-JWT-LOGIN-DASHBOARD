import Container from "@/application/ui/container/Container"
import { IoShieldOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import Text from "@/application/ui/text/Text";
import ButtonForms from "@/application/ui/buttonForm/ButtonForms";

const Dashboard = () => {
    
    const items = [
        {label: "Total Usuarios", totalUsers: 43, icon: <FiUsers/>, textButton1:"Ver Usuarios", textButton2:"+ Agregar Usuario"},
        {label: "Roles Activos", totalUsers: 20,  icon: <IoShieldOutline/>, textButton1:"Ver Roles", textButton2:"+ Agregar Rol"},
    ]
    
  return (

    <>

        <Container className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-5">

            {items.map((items, index) => (

                <Container key={index} className="p-5 border border-green-400 rounded-md shadow-md items-center space-y-5">

                    <Container className="flex gap-5 items-center">

                        <Container className="text-2xl text-green-500">
                            {items.icon}
                        </Container>

                        <Container>
                            <Text
                                text={items.label}
                                variant="none"
                                className="text-green-600 text-sm! md:text-base! lg:text-xl!"
                            />
                        </Container>

                    </Container>

                    <Container>

                        <p className="text-green-700! text-3xl! font-bold">
                            {items.totalUsers}
                        </p>

                    </Container>

                    <Container className="flex flex-col xl:flex-row xl:justify-between">

                        <ButtonForms
                            label={items.textButton1}
                            backgroundColor="secondary"
                            textColor="secondary"
                            type="button"
                        />

                        <ButtonForms
                            label={items.textButton2}
                            backgroundColor="secondary"
                            textColor="secondary"
                            type="button"
                        />

                    </Container>
 
                </Container>
               
            ))}
            
        </Container>


    
    </>

  )
    
}

export default Dashboard
