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
    description: 'Estado de la división',
    example: true,
  })
  estado: boolean;
}
