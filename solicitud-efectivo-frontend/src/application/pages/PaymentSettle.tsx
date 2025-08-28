import ButtonForms from "@/application/ui/ButtonForm/ButtonForms";

import { useForm } from "react-hook-form"
import Select from "../ui/Select/Select";
import Input from "../ui/Input/Input";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CiChat1 } from "react-icons/ci";
import Title from "../ui/Text/Title";
import { MdFileUpload } from "react-icons/md";
import Text from "../ui/Text/Text";
import { MdOutlineFileUpload } from "react-icons/md";

import {useCallback} from 'react'
import {useDropzone, type FileWithPath} from 'react-dropzone'

const PaymentSettle = () => {


  const { handleSubmit} = useForm({})

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    console.log(acceptedFiles)
  }, [])

  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({onDrop})

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (

    <>
    
      <div className="flex flex-col bg-gradient-to-r from-green-600 to-emerald-600 p-6">

          <Title text="$ Pagos No Liquidados" isTitle={true} className="text-white"/>

          <Title text="Procese y gestione los desembolsos para su liquidación" isTitle={false} className="!text-gray-300"/>

      </div>

      <div className="bg-white p-5 rounded-bl-lg rounded-br-lg">

        <div className="mt-5 bg-gray-50 p-5 border border-gray-200 rounded-lg">

          <div className="flex items-center">

            <div className="flex w-full justify-between items-center">

                <span className="flex items-center gap-2 text-xs sm:text-base font-medium text-gray-700"> 
                    <IoDocumentTextOutline className="w-5 h-5 text-gray-600" />
                    Información de la Liquidación
                </span>
            
            </div>

          </div>

        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >

            <div className="mt-5 gap-5 grid grid-cols-1 sm:grid-cols-2">

                <div>

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                                N° Desembolso
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione un tipo de desembolso"
                    />

                </div>

                <div>

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                                Responsable
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione el responsable"
                    />

                </div>


            </div>

            
            <div className="mt-5 gap-5 grid grid-cols-1 sm:grid-cols-2">

                <div>

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                                Division
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione la división"
                    />

                </div>

                <div>

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                                Tipo de Pago
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Select
                    options={[]}
                    placeholder="Seleccione el tipo de pago"
                    />

                </div>


            </div>

            <div className="mt-5 gap-5 grid grid-cols-1 sm:grid-cols-2">

                <div>

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                                N° Solicitud
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Input
                        type="text"
                        placeholder="Ingresa el número de solicitud"
                    />

                </div>

                <div>

                    <div className="mb-2">

                        <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                                Monto Solicitado
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                    </div>

                    <Input
                        type="number"
                        placeholder="0.00"
                    />

                </div>


            </div>

            <div className="mt-5 gap-5">

                <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <MdFileUpload className="w-5 h-5 text-black" />
                        Adjuntar Documentos
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                </div>

                <div className="h-64 border-2 border-green-300 rounded-md" {...getRootProps()}>

                    <div className="m-5 h-54 border-2 border-dashed border-green-200 items-center flex relative">

                        <div className="flex flex-col w-full items-center">

                            <div className="flex  flex-col  items-center z-9999">

                                <MdOutlineFileUpload className="text-5xl sm:text-6xl"/>


                                <Text text="Arrastra y suelta archivos aquí"/>
                                <Text text="o haz clic para seleccionar archivo"/>

                            </div>

                      

                            <div>
                                <input id="fileUpload" {...getInputProps()} />
                                {
                                    isDragActive ?
                                    <div className="border-2 border-dashed animate-pulse border-green-200 absolute top-0 left-0 right-0 bottom-0 w-full h-54 bg-gray-100"></div>  :
                                    <div className="flex">
                                        <label htmlFor="fileUpload"  className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded mt-2">
                                            Subir archivo
                                        </label>
                                    </div>
                                }
                            </div>



                            <div className="flex flex-col items-center z-9999">

                               

                                <Text text="Formatos soportados: PDF, DOC, DOCX, JPG ,PNG" className="mt-2" />

                            </div>



                        </div>

                    </div>

                </div>

            </div>


            <div className="mt-5 gap-5">

                <div className="mb-2">

                    <label htmlFor="amount" className="text-xs sm:text-base text-gray-700 font-medium flex items-center gap-2">
                        <CiChat1 className="w-5 h-5 text-black" />
                        Observaciones
                    </label>

                </div>

                <Input
                    type="textarea"
                    placeholder="Ingrese observaciones adicionales (opcional)"
                    className=""
                />
        
            </div>


          <div className="w-full flex justify-end gap-5">

            <ButtonForms 
              label="Cancelar" 
              border={true}
              onClick={() => {}}
              className="bg-red-500"
            />

       
            <ButtonForms 
            label="Enviar" 
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

export default PaymentSettle