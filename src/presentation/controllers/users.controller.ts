import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from '../../core/domain/services/users.service';
import { AuthService } from '../../core/domain/services/auth.service';
import { UpdateUserDto } from '../../core/application/dto/update-user.dto';
import { RegisterDto } from '../../core/application/dto/register.dto';
import { UserFiltersDto } from '../../core/application/dto/user-filters.dto';
import { UpdatePhoneDto } from '../../core/application/dto/update-phone.dto';
import { DeleteUserDto } from '../../core/application/dto/delete-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../core/domain/user.interface';
import { PaginationDto, PaginatedResponseDto } from '../../core/application/dto/pagination.dto';
//import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Usuarios')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario creado correctamente' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El usuario ya existe',
  })
  async create(@Body() registerDto: RegisterDto) {
    return await this.authService.createUser(registerDto);
  }

  // ❌ ENDPOINT DESHABILITADO - Obtener todos los usuarios
  
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'division', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        total: { type: 'number', example: 150 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 15 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false }
      }
    }
  })
  async findAll(@Query() filters: UserFiltersDto) {
    return await this.usersService.findAll(filters);
  }
  
  // ❌ ENDPOINT DESHABILITADO - Estadísticas de usuarios
  /* 
    @Get('stats')
    @Roles(UserRole.Admin, UserRole.Supervisor)
    @ApiOperation({ summary: 'Obtener estadísticas de usuarios' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Estadísticas obtenidas exitosamente',
      schema: {
        type: 'object',
        properties: {
          totalUsers: { type: 'number', example: 150 },
          usersByRole: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', example: 'Usuario' },
                count: { type: 'number', example: 120 },
              },
            },
          },
          usersByDivision: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                division: { type: 'string', example: 'TI' },
                count: { type: 'number', example: 45 },
              },
            },
          },
        },
      },
    })
    async getStats() {
      return await this.usersService.getStats();
    } 
   // ❌ ENDPOINT DESHABILITADO - Buscar usuarios por término
    @Get('search')
    @ApiOperation({ summary: 'Buscar usuarios por término' })
    @ApiQuery({ name: 'term', required: true, type: String })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Usuarios encontrados exitosamente',
      type: [Object],
    })
    async searchByTerm(@Query('term') term: string) {
      return await this.usersService.searchByTerm(term);
    }
  */
  // ❌ ENDPOINT DESHABILITADO - Obtener usuarios por rol
  /*
  @Get('role/:role')
  @ApiOperation({ summary: 'Obtener usuarios por rol' })
  @ApiParam({ name: 'role', enum: UserRole })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuarios por rol obtenidos exitosamente',
    type: [Object],
  })
  async findByRole(@Param('role') role: UserRole) {
    return await this.usersService.findByRole(role);
  }
*/
  // ❌ ENDPOINT DESHABILITADO - Obtener usuarios por división
  /*
    @Get('division/:division')
    @ApiOperation({ summary: 'Obtener usuarios por división' })
    @ApiParam({ name: 'division', type: String })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Usuarios por división obtenidos exitosamente',
      type: [Object],
    })
    async findByDivision(@Param('division') division: string) {
      return await this.usersService.findByDivision(division);
    }
  */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario obtenido exitosamente',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }
  @Get('cedula/:cedula')
  @ApiOperation({ summary: 'Obtener un usuario por cédula' })
  @ApiParam({ name: 'cedula', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario obtenido exitosamente',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  async findByCedula(@Param('cedula') cedula: string) {
    return await this.usersService.findByCedula(cedula);
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar un usuario (Admin puede actualizar cualquier usuario, Usuario solo puede actualizar sus propios datos)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const currentUser = req.user;
    return await this.usersService.update(id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({
    summary: 'Eliminar un usuario (soft delete por defecto, eliminación física con confirmación)',
    description: 'Por defecto realiza soft delete. Para eliminación física permanente, enviar confirmPermanentDelete: true y confirmText: "SI, ELIMINAR PERMANENTEMENTE"'
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario marcado como eliminado (soft delete)' },
        type: { type: 'string', enum: ['soft', 'permanent'], example: 'soft' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            cedula: { type: 'string', example: '40245980129' },
            nombre: { type: 'string', example: 'Raul' },
            apellido: { type: 'string', example: 'Vargas' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validaciones fallidas (último admin, auto-eliminación, etc.)',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteUserDto: DeleteUserDto,
    @Request() req
  ) {
    const currentUser = req.user;

    // Validar confirmación para eliminación permanente
    if (deleteUserDto.confirmPermanentDelete) {
      if (deleteUserDto.confirmText !== 'SI, ELIMINAR PERMANENTEMENTE') {
        throw new BadRequestException('Para eliminación permanente, debes escribir exactamente: "SI, ELIMINAR PERMANENTEMENTE"');
      }
    }

    return await this.usersService.remove(
      id,
      currentUser,
      deleteUserDto.confirmPermanentDelete,
      deleteUserDto.reason
    );
  }

  @Put(':id/restore')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Restaurar un usuario eliminado (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario restaurado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario restaurado exitosamente' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            cedula: { type: 'string', example: '40245980129' },
            nombre: { type: 'string', example: 'Raul' },
            apellido: { type: 'string', example: 'Vargas' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El usuario ya está activo',
  })
  async restore(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const currentUser = req.user;
    return await this.usersService.restore(id, currentUser);
  }
  // ❌ ENDPOINT DESHABILITADO - Obtener lista de usuarios eliminados (soft delete)
  /*
    @Get('deleted/list')
    @Roles(UserRole.Admin)
    @ApiOperation({ summary: 'Obtener lista de usuarios eliminados (soft delete)' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de usuarios eliminados obtenida exitosamente',
      type: [Object],
    })
    async findDeleted() {
      return await this.usersService.findDeleted();
    }
  */
  // ❌ ENDPOINT DESHABILITADO - Actualizar teléfono del usuario
  /*
    @Post('update-phone')
    @ApiOperation({ summary: 'Actualizar teléfono del usuario' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Teléfono actualizado exitosamente',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Teléfono actualizado exitosamente' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              cedula: { type: 'string', example: '40245980129' },
              nombre: { type: 'string', example: 'Raul' },
              apellido: { type: 'string', example: 'Vargas' },
              telefono: { type: 'string', example: '8091234567' },
            },
          },
        },
      },
    })
    @ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Credenciales inválidas',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    async updatePhone(@Body() updatePhoneDto: UpdatePhoneDto) {
      return await this.usersService.updateUserPhone(
        updatePhoneDto.cedula,
        updatePhoneDto.clave,
        updatePhoneDto.telefono,
      );
    }
  */
}
