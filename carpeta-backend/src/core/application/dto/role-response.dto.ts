import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    description: 'ID único del rol',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  role_name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario con permisos de administración completa',
  })
  role_desc: string;

  @ApiProperty({
    description: 'Indica si el rol está activo',
    example: true,
  })
  valido: boolean;
}

export class RolePaginatedResponseDto {
  @ApiProperty({
    description: 'Lista de roles',
    type: [RoleResponseDto],
  })
  data: RoleResponseDto[];

  @ApiProperty({
    description: 'Total de roles',
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
}

export class RoleStatsDto {
  @ApiProperty({
    description: 'Total de roles',
    example: 10,
  })
  totalRoles: number;

  @ApiProperty({
    description: 'Roles activos',
    example: 8,
  })
  activeRoles: number;

  @ApiProperty({
    description: 'Roles inactivos',
    example: 2,
  })
  inactiveRoles: number;

  @ApiProperty({
    description: 'Roles administrativos',
    example: 2,
  })
  administrativeRoles: number;

  @ApiProperty({
    description: 'Roles operacionales',
    example: 6,
  })
  operationalRoles: number;
}
