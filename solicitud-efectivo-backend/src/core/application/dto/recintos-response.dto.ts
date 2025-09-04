import { ApiProperty } from '@nestjs/swagger';

export class RecintosResponseDto {
  @ApiProperty({
    description: 'ID del recinto',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del recinto',
    example: 'Sala de Conferencias A',
  })
  recinto: string;

  @ApiProperty({
    description: 'Ubicación del recinto',
    example: 'Edificio Principal, Piso 2, Oficina 201',
  })
  ubicacion: string;

  @ApiProperty({
    description: 'Estado del recinto',
    example: true,
  })
  estado: boolean;
}
