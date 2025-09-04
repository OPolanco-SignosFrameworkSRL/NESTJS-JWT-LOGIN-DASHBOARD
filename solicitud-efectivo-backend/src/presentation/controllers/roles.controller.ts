import {
  Controller,
  Get,
  Post,
  Body,
  //Patch,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

// DTOs
import { CreateRoleDto } from '../../core/application/dto/create-role.dto';
import { UpdateRoleDto } from '../../core/application/dto/update-role.dto';
import { RoleFiltersDto } from '../../core/application/dto/role-filters.dto';
import { 
  RoleResponseDto, 
  RolePaginatedResponseDto, 
  RoleStatsDto 
} from '../../core/application/dto/role-response.dto';

// Use Cases
import { CreateRoleUseCase } from '../../core/application/use-cases/create-role.use-case';
import { GetRolesUseCase } from '../../core/application/use-cases/get-roles.use-case';
import { GetRoleByIdUseCase } from '../../core/application/use-cases/get-role-by-id.use-case';
import { UpdateRoleUseCase } from '../../core/application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../../core/application/use-cases/delete-role.use-case';
//import { GetRoleStatsUseCase } from '../../core/application/use-cases/get-role-stats.use-case';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    //private readonly getRoleStatsUseCase: GetRoleStatsUseCase,
  ) {}

  @Post()
  @Roles(1) // Admin
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role_name: { type: 'string', example: 'Testing' }
      }
    }
  })
  @ApiOperation({ 
    summary: 'Crear un nuevo rol',
    description: 'Crea un nuevo rol en el sistema. Solo usuarios administradores pueden acceder.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Rol creado exitosamente',
    type: RoleResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o rol ya existe' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador' 
  })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      const role = await this.createRoleUseCase.execute(createRoleDto);
      return this.mapToResponseDto(role);
    } catch (error) {
      if (error.message.includes('Ya existe')) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Error al crear el rol');
    }
  }

  @Get()
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener todos los roles',
    description: 'Retorna una lista paginada de roles en el sistema. Admin y Supervisor pueden acceder.' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number,
    description: 'Número de página para paginación',
    example: 1
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number,
    description: 'Número de elementos por página',
    example: 10
  })
  @ApiQuery({ 
    name: 'role_name', 
    required: false, 
    type: String,
    description: 'Filtrar por nombre de rol',
    example: 'Administrador'
  })
  @ApiQuery({ 
    name: 'role_desc', 
    required: false, 
    type: String,
    description: 'Filtrar por descripción de rol',
    example: 'administración'
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    type: String,
    description: 'Búsqueda general por nombre o descripción',
    example: 'admin'
  })
  @ApiQuery({ 
    name: 'statusId', 
    required: false, 
    type: Number,
    description: 'Filtrar por StatusId específico',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles obtenida exitosamente',
    type: RolePaginatedResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador o supervisor' 
  })
  async findAll(@Query() filters: RoleFiltersDto): Promise<any> {
    try {
      return await this.getRolesUseCase.executePaginated(filters, filters.page, filters.limit);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles');
    }
  }

  @Get('active')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener solo roles activos',
    description: 'Retorna una lista de roles activos en el sistema. Admin y Supervisor pueden acceder.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles activos obtenida exitosamente',
    type: [RoleResponseDto] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador o supervisor' 
  })
  async findActive(): Promise<any> {
    try {
      // Usar directamente el repositorio para filtrar por rowActive
      const result = await this.getRolesUseCase.executeActive();
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles activos');
    }
  }

  @Get('inactive')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener solo roles inactivos',
    description: 'Retorna una lista de roles inactivos en el sistema. Admin y Supervisor pueden acceder.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles inactivos obtenida exitosamente',
    type: [RoleResponseDto] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador o supervisor' 
  })
  async findInactive(): Promise<any> {
    try {
      // Usar directamente el repositorio para filtrar por rowActive
      const result = await this.getRolesUseCase.executeInactive();
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles inactivos');
    }
  }

  @Get('by-status/:statusId')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener roles por StatusId específico',
    description: 'Retorna una lista de roles filtrados por un StatusId específico. Admin y Supervisor pueden acceder.' 
  })
  @ApiParam({ 
    name: 'statusId', 
    type: Number, 
    description: 'ID del status para filtrar roles',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles filtrada por status obtenida exitosamente',
    type: [RoleResponseDto] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador o supervisor' 
  })
  async findByStatus(@Param('statusId', ParseIntPipe) statusId: number): Promise<any> {
    try {
      const filters: RoleFiltersDto = { statusId };
      const result = await this.getRolesUseCase.execute(filters);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles por status');
    }
  }

  @Get(':id')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener un rol por ID',
    description: 'Retorna la información de un rol específico. Admin y Supervisor pueden acceder.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del rol a buscar',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol encontrado exitosamente',
    type: RoleResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador o supervisor' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rol no encontrado' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    try {
      const role = await this.getRoleByIdUseCase.execute(id);
      return this.mapToResponseDto(role);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Error al obtener el rol');
    }
  }

  @Put(':id')
  @Roles(1) // Admin
  @ApiOperation({ 
    summary: 'Actualizar un rol',
    description: 'Actualiza la información de un rol existente. Solo usuarios administradores pueden acceder.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del rol a actualizar',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol actualizado exitosamente',
    type: RoleResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rol no encontrado' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    try {
      const role = await this.updateRoleUseCase.execute(id, updateRoleDto);
      return this.mapToResponseDto(role);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('Ya existe')) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Error al actualizar el rol');
    }
  }

  @Delete(':id')
  @Roles(1) // Admin
  @ApiOperation({ 
    summary: 'Eliminar un rol',
    description: 'Elimina un rol del sistema (soft delete). Solo usuarios administradores pueden acceder.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del rol a eliminar',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rol no encontrado' 
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.deleteRoleUseCase.execute(id);
      return { message: 'Rol eliminado exitosamente' };
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Error al eliminar el rol');
    }
  }

  @Put(':id/restore')
  @Roles(1) // Admin
  @ApiOperation({ 
    summary: 'Restaurar un rol eliminado',
    description: 'Restaura un rol que fue marcado como eliminado. Solo usuarios administradores pueden acceder.' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del rol a restaurar',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol restaurado exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - se requieren permisos de administrador' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rol no encontrado' 
  })
  async restore(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.updateRoleUseCase.execute(id, { valido: true });
      return { message: 'Rol restaurado exitosamente' };
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Error al restaurar el rol');
    }
  }

  // Mapear entity a response DTO
  private mapToResponseDto(role: any): RoleResponseDto {
    return {
      id: role.id,
      role_name: role.role_name,
      role_desc: role.role_desc,
      valido: role.valido,
    };
  }
}
