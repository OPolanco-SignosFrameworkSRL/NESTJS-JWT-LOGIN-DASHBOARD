import { ApiProperty } from '@nestjs/swagger';

export class CommentContextDto {
  @ApiProperty({ description: 'ID de la solicitud', example: 1430 })
  id!: number;

  @ApiProperty({ description: 'Número legible de la solicitud (AÑO-#####)', example: '2025-01430' })
  numeroSolicitud!: string;

  @ApiProperty({ description: 'Nombre completo del solicitante', example: 'KENNY RODRIGUEZ' })
  solicitante!: string;

  @ApiProperty({ description: 'Monto solicitado (valor numérico)', example: 1000 })
  monto!: number;

  @ApiProperty({ description: 'Monto formateado para UI', example: '1,000.00' })
  montoFormato!: string;

  @ApiProperty({
    description: 'Estado actual de la solicitud',
    example: { id: 3, descripcion: 'Autorizado' },
  })
  status!: { id: number; descripcion: string | null };
}


