import { ApiProperty } from '@nestjs/swagger';

export class DivisionResponseDto {
  @ApiProperty({
    description: 'ID único de la división',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la división',
    example: 'Tecnología',
  })
  nombre: string;

  @ApiProperty({
    description: 'ID de la dependencia',
    example: 1,
  })
  dependencia_id: number;

  @ApiProperty({
    description: 'Estado de la división (1=Activa, 2=Inactiva)',
    example: 1,
  })
  estado: number;
}
