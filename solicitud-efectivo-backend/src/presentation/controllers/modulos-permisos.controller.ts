import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  HttpStatus,
  ParseIntPipe,
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { ModulosPermisosService } from '../../core/domain/services/modulos-permisos.service';
import {
  CreateModuloPermisoDto, CreateModuloPermisoSimpleDto,
  UpdateModuloPermisoDto,
  BulkCreateModuloPermisoDto,
  BulkUpdateModuloPermisoDto,
  ModuloPermisoResponseDto,
  GetPermisosByRolDto,
  PermisoByRolResponseDto,
} from '../../core/application/dto/modulo-permiso.dto';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Permisos de Módulos')
@Controller('modulos-permisos')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // Temporalmente deshabilitado para pruebas
export class ModulosPermisosController {
  private readonly logger = new Logger(ModulosPermisosController.name);

  constructor(
    private readonly modulosPermisosService: ModulosPermisosService,
  ) {}

  @Post()
  @Roles(1) // Solo ADMINISTRADOR
  @ApiOperation({
    summary: 'Crear un nuevo permiso de módulo',
    description: 'Crea un nuevo permiso para un módulo específico',
  })
  @ApiBody({
    description: 'Datos del permiso a crear',
    schema: {
      example: {
        "idRol": 1,
        "Module_name": "wiristiki",
        "ver": true,
        "agregar": true,
        "editar": true,
        "eliminar": true
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Permiso de módulo creado exitosamente',
    type: ModuloPermisoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o ya existe un permiso para este módulo',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async create(
    @Body() data: any,
    @Request() req,
  ) {
    const currentUser = req.user || { id: 1 }; // usuario por defecto para pruebas

    // Si recibe un arreglo directo, crear múltiples
    if (Array.isArray(data)) {
      const resultados = [];
      for (const item of data) {
        try {
          let creado;
          if (item.Module_name) {
            // Nuevo formato con Module_name
            creado = await this.modulosPermisosService.createByRolAndModule(item, currentUser.id);
          } else {
            // Formato original con idModulo
            creado = await this.modulosPermisosService.create(item, currentUser.id);
          }
          resultados.push(creado);
        } catch (error) {
          this.logger.error(`Error creando permiso:`, error);
        }
      }
      this.logger.log(`${resultados.length} permisos de módulo creados por usuario ${currentUser.id}`);
      return {
        message: `${resultados.length} permisos de módulos creados exitosamente`,
        data: resultados,
      };
    }

    // Si recibe un objeto, crear uno solo
    try {
      let created;
      if (data.Module_name) {
        // Nuevo formato con Module_name
        created = await this.modulosPermisosService.createByRolAndModule(data, currentUser.id);
      } else {
        // Formato original con idModulo
        created = await this.modulosPermisosService.create(data, currentUser.id);
      }
      
      this.logger.log(`Permiso de módulo creado por usuario ${currentUser.id}`);
      return created;
    } catch (error) {
      this.logger.error('Error en POST /api/modulos-permisos:', error);
      throw new BadRequestException(error.message);
    }
  }

 /*  @Post('bulk')
  @Roles(1) // Solo ADMINISTRADOR
  @ApiOperation({
    summary: 'Crear múltiples permisos de módulos',
    description: 'Crea múltiples permisos para diferentes módulos',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Permisos de módulos creados exitosamente',
    type: [ModuloPermisoResponseDto],
  })
  async createBulk(
    @Body() bulkCreateDto: BulkCreateModuloPermisoDto,
    @Request() req,
  ) {
    const currentUser = req.user;
    const permisos = [];

    for (const permisoDto of bulkCreateDto.permisos) {
      try {
        const permiso = await this.modulosPermisosService.create(
          permisoDto,
          currentUser.id,
        );
        permisos.push(permiso);
      } catch (error) {
        this.logger.error(
          `Error creando permiso para módulo ${permisoDto.idModulo}:`,
          error,
        );
        // Continuar con los siguientes permisos
      }
    }

    return {
      message: `${permisos.length} permisos de módulos creados exitosamente`,
      data: permisos,
    };
  } */

  @Get('by-rol/:idRol')
  @ApiOperation({
    summary: 'Obtener permisos por rol',
    description: 'Retorna los permisos de módulos asignados a un rol específico (simula el script SQL)',
  })
  @ApiParam({ name: 'idRol', type: Number, description: 'ID del rol' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permisos del rol obtenidos exitosamente',
    type: [PermisoByRolResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  async getPermisosByRol(@Param('idRol', ParseIntPipe) idRol: number) {
    const permisos = await this.modulosPermisosService.getPermisosByRol(idRol);

    this.logger.log(`Permisos obtenidos para rol ${idRol}: ${permisos.length} módulos`);

    return {
      message: `Permisos obtenidos para rol ${idRol}`,
      data: permisos,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los permisos de módulos',
    description: 'Retorna una lista paginada de todos los permisos de módulos',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'idModulo', required: false, type: Number })
  @ApiQuery({ name: 'ver', required: false, type: Boolean })
  @ApiQuery({ name: 'agregar', required: false, type: Boolean })
  @ApiQuery({ name: 'editar', required: false, type: Boolean })
  @ApiQuery({ name: 'eliminar', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de permisos de módulos obtenida exitosamente',
    type: [ModuloPermisoResponseDto],
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('idModulo') idModulo?: number,
    @Query('ver') ver?: boolean,
    @Query('agregar') agregar?: boolean,
    @Query('editar') editar?: boolean,
    @Query('eliminar') eliminar?: boolean,
  ) {
    const filters = {
      page,
      limit,
      idModulo,
      ver,
      agregar,
      editar,
      eliminar,
    };

    return await this.modulosPermisosService.findAll(filters);
  }

  @Get('deleted/list')
  @Roles(1) // Solo ADMINISTRADOR
  @ApiOperation({
    summary: 'Obtener lista de permisos de módulos eliminados',
    description: 'Retorna una lista de permisos de módulos marcados como eliminados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de permisos eliminados obtenida exitosamente',
    type: [ModuloPermisoResponseDto],
  })
  async findDeleted() {
    return await this.modulosPermisosService.findDeleted();
  }

  @Get('modulo/:idModulo')
  @ApiOperation({
    summary: 'Obtener permisos por módulo',
    description: 'Retorna los permisos específicos de un módulo',
  })
  @ApiParam({ name: 'idModulo', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permisos del módulo obtenidos exitosamente',
    type: [ModuloPermisoResponseDto],
  })
  async findByModulo(@Param('idModulo', ParseIntPipe) idModulo: number) {
    return await this.modulosPermisosService.findByModulo(idModulo);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un permiso de módulo por ID',
    description: 'Retorna un permiso de módulo específico por su ID',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permiso de módulo obtenido exitosamente',
    type: ModuloPermisoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permiso de módulo no encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.modulosPermisosService.findOne(id);
  }

  @Put(':id')
  @Roles(1) // Solo ADMINISTRADOR
  @ApiOperation({
    summary: 'Actualizar un permiso de módulo específico',
    description: 'Actualiza un permiso individual por ID',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    description: 'Objeto único o array de permisos a actualizar',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(UpdateModuloPermisoDto) },
        { type: 'array', items: { $ref: getSchemaPath(UpdateModuloPermisoDto) } }
      ],
      examples: {
        arrayEjemplo: {
          summary: 'Array de objetos',
          value: [
            {
              agregar: false,
              editar: true,
              eliminar: true,
              idModulo: 1,
              idRol: 1,
              ver: false
            }
          ]
        },
        objetoEjemplo: {
          summary: 'Objeto único',
          value: {
            idModulo: 1,
            ver: true,
            agregar: true,
            editar: true,
            eliminar: false,
            rowActive: true
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permiso actualizado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permiso de módulo no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @Request() req,
  ) {
    const currentUser = req.user || { id: 1 }; // usuario por defecto para pruebas
    
    // Si es array, procesar múltiples
    if (Array.isArray(data)) {
      const processedPermisos = [];
      for (const permisoData of data) {
        try {
          const existingPermisos = await this.modulosPermisosService.findByModulo(permisoData.idModulo);
          if (existingPermisos && existingPermisos.length > 0) {
            const updated = await this.modulosPermisosService.update(
              existingPermisos[0].id,
              permisoData,
              currentUser.id,
            );
            processedPermisos.push(updated);
          } else {
            const created = await this.modulosPermisosService.create(
              permisoData,
              currentUser.id,
            );
            processedPermisos.push(created);
          }
        } catch (error) {
          this.logger.error(`Error procesando módulo ${permisoData.idModulo}:`, error);
        }
      }

      this.logger.log(`${processedPermisos.length} permisos procesados por usuario ${currentUser.id}`);
      return { message: `${processedPermisos.length} permisos actualizados exitosamente`, data: processedPermisos };
    }

    // Objeto único (comportamiento original)
    const updatedPermiso = await this.modulosPermisosService.update(
      id,
      data,
      currentUser.id,
    );

    this.logger.log(`Permiso de módulo ${id} actualizado por usuario ${currentUser.id}`);
    return { message: 'Permiso de módulo actualizado exitosamente', data: updatedPermiso };
  }

  @Put('bulk-update')
  @UsePipes(new ValidationPipe({ transform: false, whitelist: false, forbidNonWhitelisted: false }))
  // @Roles(1) // Solo ADMINISTRADOR (temporalmente deshabilitado para prueba)
  @ApiOperation({
    summary: 'Actualizar múltiples permisos por body',
    description: 'Actualiza múltiples permisos enviando array o { data: [...] } en el cuerpo del request',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permisos actualizados exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  async bulkUpdate(
    @Body() body: any,
    @Request() req,
  ) {
    this.logger.log(`Body recibido: ${JSON.stringify(body)}`);
    
    const currentUser = req.user || { id: 1 }; // Usuario por defecto para pruebas
    const permisosArray = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];

    this.logger.log(`Permisos array: ${JSON.stringify(permisosArray)}`);

    if (!Array.isArray(permisosArray) || permisosArray.length === 0) {
      this.logger.warn('No hay permisos para procesar');
      return {
        message: 'No hay permisos para procesar',
        data: [],
      };
    }

    const processedPermisos = await this.modulosPermisosService.bulkUpdateByRol(
      permisosArray,
    );

    this.logger.log(
      `${processedPermisos.length} permisos procesados por usuario ${currentUser.id}`,
    );

    return processedPermisos;
  }



  /* @Put(':id/restore')
  @Roles(1) // Solo ADMINISTRADOR
  @ApiOperation({
    summary: 'Restaurar un permiso de módulo eliminado',
    description: 'Restaura un permiso de módulo que fue marcado como eliminado',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permiso de módulo restaurado exitosamente',
    type: ModuloPermisoResponseDto,
  })
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const currentUser = req.user;
    const result = await this.modulosPermisosService.restore(id, currentUser.id);

    this.logger.log(
      `Permiso de módulo ${id} restaurado por usuario ${currentUser.id}`,
    );

    return result;
  } */

 /*  @Delete(':id')
  @Roles(1) // Solo ADMINISTRADOR
  @ApiOperation({
    summary: 'Eliminar un permiso de módulo',
    description: 'Marca un permiso de módulo como eliminado (soft delete)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permiso de módulo eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Permiso de módulo eliminado exitosamente' },
        permiso: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            idModulo: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permiso de módulo no encontrado',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const currentUser = req.user;
    const result = await this.modulosPermisosService.remove(id, currentUser.id);

    this.logger.log(
      `Permiso de módulo ${id} eliminado por usuario ${currentUser.id}`,
    );

    return result;
  } */
}
