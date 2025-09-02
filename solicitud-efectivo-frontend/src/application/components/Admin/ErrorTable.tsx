import Container from "@/application/ui/container/Container"

const ErrorTable = () => {

  return (

    <>
        <Container className="bg-background flex items-center justify-center p-4">
            <Container className="max-w-2xl w-full text-center space-y-8">

                <Container className="space-y-4">
                    <Container className="text-8xl font-bold text-primary mb-4 text-red-500">500</Container>

                    <h1 className="text-4xl font-bold text-foreground mb-2">¡Oops! Algo salió mal</h1>

                    <p className="text-xl text-muted-foreground">
                        Estamos experimentando algunas dificultades técnicas, ¡pero ya estamos trabajando en ello!
                    </p>

                </Container>

                <Container className="flex justify-center">

                    <Container className="w-32 h-32 bg-card rounded-full flex items-center justify-center text-red-500 bg-gray-100">
                        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                        </svg>
                    </Container>
                    
                </Container>

                <Container className="bg-card border-border">

                    <Container>

                        <h2 className="text-lg font-semibold text-card-foreground mb-3">¿Qué significa esto?</h2>

                        <p className="text-muted-foreground mb-4">
                            Este es un problema del lado del servidor y estamos trabajando arduamente para solucionarlo. El error no
                            está relacionado con tu conexión o dispositivo.
                        </p>

                        <Container className="text-sm text-muted-foreground">
                            <strong>Código de error:</strong> HTTP 500 - Internal Server Error
                        </Container>

                    </Container>

                </Container>

            </Container>
        </Container>
    
    </>
 
  )
}

export default ErrorTable
