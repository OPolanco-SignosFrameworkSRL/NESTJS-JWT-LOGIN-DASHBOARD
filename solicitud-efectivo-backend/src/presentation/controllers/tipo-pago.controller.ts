import { Controller, Get, Param, UseGuards, ParseIntPipe, Query, Body, Post, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { TipoPagoService } from '../../core/domain/services/tipo-pago.service';
import { TipoPagoResponseDto } from '../../core/application/dto/tipo-pago-response.dto';
import { PaginationDto } from '../../core/application/dto/pagination.dto';
import { TipoPagoFiltersDto } from '../../core/application/dto/tipo-pago-filters.dto';
import { UpdateTipoPagoDto } from '../../core/application/dto/update-tipo-pago.dto';
import { CreateTipoPagoDto } from '../../core/application/dto/create-tipo-pago.dto';

@ApiTags('Tipos de Pago')
@Controller('tipo-pago')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TipoPagoController {
  constructor(
    private readonly tipoPagoService: TipoPagoService,
  ) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener todos los tipos de pago' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de pago obtenida exitosamente',
    type: [TipoPagoResponseDto]
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'statusId', required: false, enum: [1, 2], description: '1=Activos, 2=Inactivos' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Buscar por nombre' })
  async findAll(@Query() pagination?: PaginationDto & TipoPagoFiltersDto) {
    return await this.tipoPagoService.findAll(pagination);
  }

  @Get(':id')
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Obtener un tipo de pago por ID' })
  @ApiParam({ name: 'id', description: 'ID del tipo de pago', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Tipo de pago obtenido exitosamente',
    type: TipoPagoResponseDto
  })
  @ApiResponse({ status: 404, description: 'Tipo de pago no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<TipoPagoResponseDto> {
    return await this.tipoPagoService.findById(id);
  }

  @Post()
  @Roles(1)
  @ApiOperation({ summary: 'Crear un tipo de pago' })
  @ApiResponse({ status: 201, description: 'Creado', type: TipoPagoResponseDto })
  async create(@Body() body: CreateTipoPagoDto) {
    return await this.tipoPagoService.create(body);
  }

  @Put(':id')
  @Roles(1)
  @ApiOperation({ summary: 'Actualizar un tipo de pago' })
  @ApiResponse({ status: 200, description: 'Actualizado', type: TipoPagoResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTipoPagoDto
  ): Promise<TipoPagoResponseDto> {
    return await this.tipoPagoService.update(id, body as any);
  }

  @Delete(':id')
  @Roles(1)
  @ApiOperation({ summary: 'Eliminar un tipo de pago' })
  @ApiResponse({ status: 200, description: 'Eliminado (soft delete)', type: TipoPagoResponseDto })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.tipoPagoService.softDelete(id);
  }
}
