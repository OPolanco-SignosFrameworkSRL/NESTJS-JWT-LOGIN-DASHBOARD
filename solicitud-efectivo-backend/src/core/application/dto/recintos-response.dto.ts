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
    description: 'ID del status (1=Válido, 2=Inválido)',
    example: 1,
  })
  statusId: number;

  @ApiProperty({
    description: 'Indica si el recinto está válido/activo',
    example: true,
  })
  valido: boolean;
}

export class RecintosListResponseDto {
  @ApiProperty({
    description: 'Array de recintos',
    type: [RecintosResponseDto],
  })
  data: RecintosResponseDto[];

  @ApiProperty({
    description: 'Total de elementos',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica si hay página siguiente',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Indica si hay página anterior',
    example: false,
  })
  hasPrev: boolean;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Lista de recintos obtenida exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp de la respuesta',
    example: '2025-09-11T15:30:00.000Z',
  })
  timestamp: string;
}
