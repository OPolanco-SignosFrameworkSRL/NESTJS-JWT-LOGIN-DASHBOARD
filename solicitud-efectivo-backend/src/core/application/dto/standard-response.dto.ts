import { ApiProperty } from '@nestjs/swagger';

export class StandardResponseDto<T> {
  @ApiProperty({
    description: 'Datos de la respuesta',
    example: { id: 1, name: 'Ejemplo' },
  })
  data: T;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje descriptivo de la operación',
    example: 'Operación exitosa',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp de la respuesta en formato ISO',
    example: '2025-04-09T15:30:00.000Z',
  })
  timestamp: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Lista de elementos',
    isArray: true,
  })
  data: T[];

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
    description: 'Mensaje descriptivo de la operación',
    example: 'Operación exitosa',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp de la respuesta en formato ISO',
    example: '2025-04-09T15:30:00.000Z',
  })
  timestamp: string;
}
