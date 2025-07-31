import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { AuthService } from '../../auth/services/auth.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RegisterDto } from '../../auth/dto/register.dto';
import { UserFiltersDto } from '../dto/user-filters.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/interfaces/user.interface';
//import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Usuarios')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'division', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [Object],
  })
  async findAll(@Query() filters: UserFiltersDto) {
    return await this.usersService.findAll(filters);
  }

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

  @Get(':id')
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

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Actualizar un usuario' })
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
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Eliminar un usuario (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
