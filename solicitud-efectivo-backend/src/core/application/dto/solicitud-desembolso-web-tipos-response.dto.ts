import { ApiProperty } from '@nestjs/swagger';

export class SolicitudDesembolsoWebTiposResponseDto {
  @ApiProperty({
    description: 'ID del tipo de solicitud desembolso web',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Descripción del tipo de solicitud desembolso web',
    example: 'Solicitud de Efectivo',
  })
  tipo_desc: string;

  @ApiProperty({
    description: 'Icono del tipo de solicitud desembolso web',
    example: 'cash-icon',
  })
  tipo_icon: string;

  @ApiProperty({
    description: 'Flag de producción',
    example: 1,
  })
  produccion_flag: number;
}
