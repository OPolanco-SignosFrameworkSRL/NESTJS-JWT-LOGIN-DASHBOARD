import ButtonForms from "@/application/ui/ButtonForm/ButtonForms";

import { useForm } from "react-hook-form"
import Select from "../ui/Select/Select";
import Input from "../ui/Input/Input";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { CiChat1 } from "react-icons/ci";









const Disbursement = () => {


  const { handleSubmit} = useForm({
    defaultValues: {
      formDataBasicInformation: [{ amount: '', requestType: '', division: '', paymentType: '' }], 
      formDataProduction: [{ orderDate: '', orderNumber: '', clientName: '', ticketNumber: '', requestConcept: '' }],
      formDataMembers: [{ employee: '', cedula: '', beneficiary: '', amount: '', task: '' }]
    } as any
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (

    <>
    
      <div className="flex flex-col bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          <span className="text-xs sm:text-base md:text-xl text-white font-bold">
            $ Desembolso
          </span>
          <p className="text-xs sm:text-base text-gray-300">
            Registro de desembolso de efectivo
          </p>
      </div>

      <div className="bg-white p-5 rounded-bl-lg rounded-br-lg">

        <div className="border-b border-gray-300"></div>

        <div className="mt-5 bg-gray-50 p-5 border border-gray-200 rounded-lg">

          <div className="flex items-center gap-2">

            <div className="flex w-full justify-between items-center">

                <span className="flex items-center gap-2 text-xs sm:text-base font-medium text-gray-700"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-hash h-5 w-5 text-green-600"><line x1="4" x2="20" y1="9" y2="9"></line><line x1="4" x2="20" y1="15" y2="15"></line><line x1="10" x2="8" y1="3" y2="21"></line><line x1="16" x2="14" y1="3" y2="21"></line></svg> 
                    Número de Desembolso:
                </span>
                <span className="text-xs sm:text-xl text-green-900 font-bold">DES-2024-001</span>
            
            </div>
          </div>

        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >

            <div className="mt-5">

                <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <IoDocumentTextOutline className="w-5 h-5 text-blue-600" />
                        Solicitud
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                </div>

                <Select
                options={[]}
                placeholder="Seleccione un tipo de desembolso"
                />

            </div>

            <div className="mt-10 border-b border-gray-300"></div>

            <div className="mt-5 flex gap-5">

                <div className="w-1/2">

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                            <FiUser className="w-5 h-5 text-blue-600" />
                            Responsable
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione un tipo de desembolso"
                    />
                </div>

                <div className="w-1/2">
                    <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <FiUser className="w-5 h-5 text-orange-500" />
                        Cedula Identidad
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    </div>

                    <Input
                    type="text"
                    placeholder="Ingrese la cedula de identidad"
                    />

                </div>


            </div>

            
            <div className="mt-5 flex gap-5">

                <div className="w-1/2">

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                            <LuBuilding2 className="w-5 h-5 text-indigo-500" />
                            Division
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione un tipo de desembolso"
                    />
                </div>

                <div className="w-1/2">
                    <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <MdOutlinePayment className="w-5 h-5 text-yellow-600" />
                        Método de Pago
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione un tipo de desembolso"
                    />

                </div>


            </div>

            <div className="mt-5 flex gap-5">

                <div className="w-1/2">

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                            <MdAttachMoney className="w-5 h-5 text-blue-600" />
                                Monto Solicitado
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione un tipo de desembolso"
                    />
                </div>

                <div className="w-1/2">
                    <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <MdAttachMoney className="w-5 h-5 text-green-700" />
                         Desembolso
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione un tipo de desembolso"
                    />

                </div>


            </div>

            <div className="mt-10 border-b border-gray-300"></div>

            <div className="mt-5 flex gap-5">

                <div className="w-1/2">

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-hash h-5 w-5 text-green-600"><line x1="4" x2="20" y1="9" y2="9"></line><line x1="4" x2="20" y1="15" y2="15"></line><line x1="10" x2="8" y1="3" y2="21"></line><line x1="16" x2="14" y1="3" y2="21"></line></svg> 
                            N° de Cheque
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Input
                    type="text"
                    placeholder="Ingrese el número de cheque"
                    />
                </div>

                <div className="w-1/2">
                    <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <IoDocumentTextOutline className="w-5 h-5 text-black-600" />
                        Referencia
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    </div>

                    <Input
                    type="text"
                    placeholder="Ingrese la referencia"
                    />

                </div>


            </div>

            <div className="mt-5 gap-5">

             

                <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <CiChat1 className="w-5 h-5 text-black" />
                        Observaciones
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                </div>

                <Input
                    type="textarea"
                    placeholder="Ingrese el número de cheque"
                    className=""
                />
        
            </div>


          <div className="w-full flex justify-end gap-5">

            <ButtonForms 
              label="Anterior" 
              border={true}
              onClick={() => {}}
              className="bg-red-500"
            />

       
            <ButtonForms 
            label="Procesar Desembolso" 
            backgroundColor="secondary" 
            textColor="secondary" 
            className="hover:from-green-700 hover:to-emerald-700"
            type="submit"
            />

           
          </div>

        </form>

      </div>


    </>

  )
}

export default Disbursement
