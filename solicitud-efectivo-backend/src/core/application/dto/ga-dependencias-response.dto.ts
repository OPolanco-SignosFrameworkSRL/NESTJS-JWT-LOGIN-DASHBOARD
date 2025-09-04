import { ApiProperty } from '@nestjs/swagger';

export class GaDependenciasResponseDto {
  @ApiProperty({
    description: 'ID de la dependencia',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la dependencia',
    example: 'Recursos Humanos',
  })
  dependencia_nombre: string;

  @ApiProperty({
    description: 'Estado de la dependencia',
    example: true,
  })
  estado: boolean;
}
