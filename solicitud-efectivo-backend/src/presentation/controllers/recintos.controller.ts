import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RecintosService } from '../../core/domain/services/recintos.service';
import { CreateRecintosDto } from '../../core/application/dto/create-recintos.dto';
import { UpdateRecintosDto } from '../../core/application/dto/update-recintos.dto';
import { RecintosResponseDto, RecintosListResponseDto } from '../../core/application/dto/recintos-response.dto';
import { RecintosFiltersDto } from '../../core/application/dto/recintos-filters.dto';
import { PaginationDto, PaginatedResponseDto } from '../../core/application/dto/pagination.dto';

@ApiTags('Recintos')
@Controller('recintos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RecintosController {
  constructor(
    private readonly recintosService: RecintosService,
  ) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener todos los recintos con paginación opcional' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', example: 10 })
  @ApiQuery({ 
    name: 'statusId', 
    required: false, 
    type: Number,
    enum: [1, 2],
    description: '1=Válidos, 2=Inválidos' 
  })
  @ApiQuery({ 
    name: 'recinto', 
    required: false, 
    type: String,
    description: 'Filtrar por nombre de recinto',
    example: 'Sala de Conferencias'
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    type: String,
    description: 'Buscar por término (nombre de recinto o ubicación)',
    example: 'Edificio Principal'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recintos obtenida exitosamente',
    type: RecintosListResponseDto
  })
  async findAll(@Query() filters: RecintosFiltersDto): Promise<RecintosListResponseDto> {
    return await this.recintosService.findAll(filters);
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener un recinto por ID' })
  @ApiParam({ name: 'id', description: 'ID del recinto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Recinto obtenido exitosamente',
    type: RecintosResponseDto
  })
  @ApiResponse({ status: 404, description: 'Recinto no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<RecintosResponseDto> {
    return await this.recintosService.findById(id);
  }

  @Post()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Crear un nuevo recinto' })
  @ApiResponse({
    status: 201,
    description: 'Recinto creado exitosamente',
    type: RecintosResponseDto
  })
  @ApiResponse({ status: 409, description: 'Ya existe un recinto con ese nombre' })
  async create(@Body() createDto: CreateRecintosDto): Promise<RecintosResponseDto> {
    return await this.recintosService.create(createDto);
  }

  @Put(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Actualizar un recinto' })
  @ApiParam({ name: 'id', description: 'ID del recinto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Recinto actualizado exitosamente',
    type: RecintosResponseDto
  })
  @ApiResponse({ status: 404, description: 'Recinto no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un recinto con ese nombre' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRecintosDto
  ): Promise<RecintosResponseDto> {
    return await this.recintosService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(1) // Admin
  @ApiOperation({ 
    summary: 'Eliminar un recinto (soft delete)', 
    description: 'Marca el recinto como inactivo (estado = 2) en lugar de eliminarlo permanentemente' 
  })
  @ApiParam({ name: 'id', description: 'ID del recinto', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Recinto marcado como eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Recinto no encontrado' })
  @ApiResponse({ status: 409, description: 'El recinto ya está marcado como eliminado' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.recintosService.delete(id);
    return { message: 'Recinto marcado como eliminado exitosamente' };
  }
}
