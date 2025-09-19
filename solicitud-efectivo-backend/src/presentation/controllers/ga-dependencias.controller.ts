import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { GaDependenciasService } from '../../core/domain/services/ga-dependencias.service';
import { CreateGaDependenciasDto } from '../../core/application/dto/create-ga-dependencias.dto';
import { UpdateGaDependenciasDto } from '../../core/application/dto/update-ga-dependencias.dto';
import { GaDependenciasResponseDto } from '../../core/application/dto/ga-dependencias-response.dto';

@ApiTags('Dependencias')
@Controller('ga-dependencias')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GaDependenciasController {
  constructor(
    private readonly gaDependenciasService: GaDependenciasService,
  ) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener todas las dependencias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de dependencias obtenida exitosamente',
    type: [GaDependenciasResponseDto]
  })
  async findAll(): Promise<GaDependenciasResponseDto[]> {
    return await this.gaDependenciasService.findAll();
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener una dependencia por ID' })
  @ApiParam({ name: 'id', description: 'ID de la dependencia', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Dependencia obtenida exitosamente',
    type: GaDependenciasResponseDto
  })
  @ApiResponse({ status: 404, description: 'Dependencia no encontrada' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<GaDependenciasResponseDto> {
    return await this.gaDependenciasService.findById(id);
  }

  @Post()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Crear una nueva dependencia' })
  @ApiResponse({
    status: 201,
    description: 'Dependencia creada exitosamente',
    type: GaDependenciasResponseDto
  })
  @ApiResponse({ status: 409, description: 'Ya existe una dependencia con ese nombre' })
  async create(@Body() createDto: CreateGaDependenciasDto): Promise<GaDependenciasResponseDto> {
    return await this.gaDependenciasService.create(createDto);
  }

  @Put(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Actualizar una dependencia' })
  @ApiParam({ name: 'id', description: 'ID de la dependencia', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Dependencia actualizada exitosamente',
    type: GaDependenciasResponseDto
  })
  @ApiResponse({ status: 404, description: 'Dependencia no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una dependencia con ese nombre' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGaDependenciasDto
  ): Promise<GaDependenciasResponseDto> {
    return await this.gaDependenciasService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Eliminar una dependencia' })
  @ApiParam({ name: 'id', description: 'ID de la dependencia', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Dependencia eliminada exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Dependencia no encontrada' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.gaDependenciasService.delete(id);
    return { message: 'Dependencia eliminada exitosamente' };
  }
}
