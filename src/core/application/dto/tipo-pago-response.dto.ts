import { ApiProperty } from '@nestjs/swagger';

export class TipoPagoResponseDto {
  @ApiProperty({
    description: 'ID del tipo de pago',
    example: 1,
  })
  pago_tipo: number;

  @ApiProperty({
    description: 'Descripción del tipo de pago',
    example: 'Efectivo',
  })
  tipo_desc: string;
}
