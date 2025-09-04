import { ApiProperty } from '@nestjs/swagger';

export class SolicitudOnlyResponseDto {
  @ApiProperty({
    description: 'ID de la solicitud',
    example: 26,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del tipo de solicitud',
    example: 'Compras Materiales Órdenes',
  })
  tipoSolicitud: string;

  @ApiProperty({
    description: 'Nombre completo del usuario que creó la solicitud',
    example: 'Juan Pérez',
  })
  nombreUsuario: string;

  @ApiProperty({
    description: 'Cédula del usuario',
    example: '12345678',
  })
  cedula: string;

  @ApiProperty({
    description: 'Monto de la solicitud',
    example: 3500,
  })
  monto: number;

  @ApiProperty({
    description: 'Tipo de pago',
    example: 'Cheque',
  })
  tipoPago: string;
}
