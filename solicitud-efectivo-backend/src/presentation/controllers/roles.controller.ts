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
    description: 'Obtiene la lista de roles con filtros opcionales y paginación'
  })
  @ApiQuery({ name: 'role_name', required: false, description: 'Filtrar por nombre de rol' })
  @ApiQuery({ name: 'role_desc', required: false, description: 'Filtrar por descripción' })
  @ApiQuery({ name: 'valido', required: false, description: 'Filtrar por estado (true/false)' })
  @ApiQuery({ name: 'search', required: false, description: 'Búsqueda general' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página' })
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
    description: 'Acceso denegado' 
  })
  async findAll(@Query() filters: RoleFiltersDto): Promise<RolePaginatedResponseDto> {
    try {
      const result = await this.getRolesUseCase.executePaginated(
        filters,
        filters.page,
        filters.limit
      );

      return {
        data: result.data.map(role => this.mapToResponseDto(role)),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles');
    }
  }

  @Get('active')
  @Roles(1, 4, 2) // Admin, Supervisor, Usuario
  @ApiOperation({ 
    summary: 'Obtener roles activos',
    description: 'Obtiene solo los roles que están activos en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles activos obtenida exitosamente',
    type: [RoleResponseDto]
  })
  async findActive(): Promise<RoleResponseDto[]> {
    try {
      const roles = await this.getRolesUseCase.executeActiveRoles();
      return roles.map(role => this.mapToResponseDto(role));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles activos');
    }
  }

 /*  @Get('stats')
  @Roles('Admin')
  @ApiOperation({ 
    summary: 'Obtener estadísticas de roles',
    description: 'Obtiene estadísticas generales del sistema de roles'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas obtenidas exitosamente',
    type: RoleStatsDto
  })
  async getStats(): Promise<RoleStatsDto> {
    try {
      return await this.getRoleStatsUseCase.execute();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las estadísticas');
    }
  } */

  @Get(':id')
  @Roles(1, 4) // Admin, Supervisor
  @ApiOperation({ 
    summary: 'Obtener un rol por ID',
    description: 'Obtiene los detalles de un rol específico por su ID'
  })
  @ApiParam({ name: 'id', description: 'ID del rol', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol encontrado exitosamente',
    type: RoleResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rol no encontrado' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    try {
      const role = await this.getRoleByIdUseCase.execute(id);
      
      if (!role) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      return this.mapToResponseDto(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el rol');
    }
  }

  //@Patch(':id')
  @Put(':id')
  @Roles(1) // Admin
  @ApiOperation({ 
    summary: 'Actualizar un rol',
    description: 'Actualiza los datos de un rol existente. Solo usuarios administradores pueden acceder.'
  })
  @ApiParam({ name: 'id', description: 'ID del rol', type: 'number' })
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
    status: 404, 
    description: 'Rol no encontrado' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    try {
      const role = await this.updateRoleUseCase.execute(id, updateRoleDto);
      
      if (!role) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      return this.mapToResponseDto(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
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
    summary: 'Desactivar un rol',
    description: 'Desactiva un rol (soft delete). Solo usuarios administradores pueden acceder.'
  })
  @ApiParam({ name: 'id', description: 'ID del rol', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol desactivado exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rol no encontrado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'No se puede desactivar un rol crítico' 
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      const success = await this.deleteRoleUseCase.execute(id);
      
      if (!success) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      return { message: 'Rol desactivado exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.message.includes('crítico')) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Error al desactivar el rol');
    }
  }

  //@Patch(':id/restore')
  @Put(':id/restore')
  @Roles(1) // Admin
  @ApiOperation({ 
    summary: 'Restaurar un rol',
    description: 'Reactiva un rol desactivado. Solo usuarios administradores pueden acceder.'
  })
  @ApiParam({ name: 'id', description: 'ID del rol', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol restaurado exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rol no encontrado' 
  })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      const success = await this.deleteRoleUseCase.executeRestore(id);
      
      if (!success) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      return { message: 'Rol restaurado exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al restaurar el rol');
    }
  }

  /**
   * Mapea una entidad de dominio a DTO de respuesta
   */
  private mapToResponseDto(role: any): RoleResponseDto {
    return {
      id: role.id,
      role_name: role.role_name,
      role_desc: role.role_desc,
      valido: role.valido,
    };
  }
}
