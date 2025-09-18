import { ApiProperty } from '@nestjs/swagger';

export class ResponsableResponseDto {
  @ApiProperty({
    description: 'ID del responsable',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del responsable',
    example: 'Juan Pérez',
  })
  nombre: string;

  @ApiProperty({
    description: 'Cédula del responsable',
    example: '12345678',
  })
  cedula: string;

  @ApiProperty({
    description: 'División del responsable',
    example: 'TI',
  })
  division: string;
}