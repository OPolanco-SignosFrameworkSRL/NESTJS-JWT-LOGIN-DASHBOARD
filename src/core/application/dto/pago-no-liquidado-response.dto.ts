import { ApiProperty } from '@nestjs/swagger';

export class AccionesDto {
  @ApiProperty({
    description: 'Indica si el usuario puede editar el pago',
    example: true,
  })
  puede_editar: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede cancelar el pago',
    example: true,
  })
  puede_cancelar: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede reversar el pago',
    example: false,
  })
  puede_reversar: boolean;
}

export class PagoNoLiquidadoResponseDto {
  @ApiProperty({
    description: 'ID único del pago no liquidado',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Número de desembolso con beneficiario',
    example: 'DES-2025-0026 Lili Ortiz',
  })
  numero_desembolso: string;

  @ApiProperty({
    description: 'Nombre del responsable',
    example: 'Lili Ortiz',
  })
  responsable: string;

  @ApiProperty({
    description: 'Nombre de la división',
    example: 'Finanzas',
  })
  division: string;

  @ApiProperty({
    description: 'Estado actual del pago',
    example: 'Activo',
    enum: ['Activo', 'Cancelado'],
  })
  estado: string;

  @ApiProperty({
    description: 'Fecha de creación del pago',
    example: '2025-08-25T10:30:00.000Z',
  })
  fecha_creacion: string;

  @ApiProperty({
    description: 'Cantidad de adjuntos asociados',
    example: 3,
  })
  cantidad_adjuntos: number;

  @ApiProperty({
    description: 'Monto del pago',
    example: 1500.50,
    nullable: true,
  })
  monto?: number;

  @ApiProperty({
    description: 'Observaciones del pago',
    example: 'Pago pendiente de liquidación',
    nullable: true,
  })
  observaciones?: string;

  @ApiProperty({
    description: 'Acciones disponibles para el usuario',
    type: AccionesDto,
  })
  acciones: AccionesDto;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Tamaño de página',
    example: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Total de registros',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 2,
  })
  totalPages: number;
}

export class PagosNoLiquidadosListResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Lista de pagos no liquidados',
    type: [PagoNoLiquidadoResponseDto],
  })
  data: PagoNoLiquidadoResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
